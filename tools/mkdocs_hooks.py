from __future__ import annotations

import re
import posixpath
from pathlib import Path
from typing import Dict, List

TOC_TITLE = "目录"
START_MARKER = "<!-- auto-toc:start -->"
END_MARKER = "<!-- auto-toc:end -->"
BOM = b"\xef\xbb\xbf"


def _read_text(path: Path) -> tuple[str, bool]:
    data = path.read_bytes()
    has_bom = data.startswith(BOM)
    text = data.decode("utf-8-sig")
    return text, has_bom


def _write_text(path: Path, text: str, has_bom: bool) -> None:
    data = text.encode("utf-8")
    if has_bom:
        data = BOM + data
    path.write_bytes(data)


def _normalize_path(p: str) -> str:
    p = p.strip().strip('"').strip("'")
    p = p.replace("\\", "/")
    if p.startswith("./"):
        p = p[2:]
    return p


def _parse_nav(text: str) -> List[dict]:
    lines = text.splitlines()
    nav_start = None
    nav_indent = 0
    for i, line in enumerate(lines):
        if re.match(r"^\s*nav\s*:\s*$", line) and not line.lstrip().startswith("#"):
            nav_start = i + 1
            nav_indent = len(line) - len(line.lstrip(" "))
            break
    if nav_start is None:
        return []

    nav_lines = []
    for line in lines[nav_start:]:
        if line.strip() and not line.lstrip().startswith("#"):
            indent = len(line) - len(line.lstrip(" "))
            if indent <= nav_indent:
                break
        nav_lines.append(line)

    root: List[dict] = []
    stack: List[tuple[int, List[dict]]] = [(-1, root)]

    for line in nav_lines:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        stripped = line.lstrip(" ")
        if not stripped.startswith("- "):
            continue
        indent = len(line) - len(stripped)
        item_str = stripped[2:].strip()

        title = None
        path = None
        has_children = False

        if ":" in item_str:
            title_part, rest = item_str.split(":", 1)
            title = title_part.strip().strip('"').strip("'")
            rest = rest.strip()
            if rest == "":
                has_children = True
            else:
                path = _normalize_path(rest)
        else:
            path = _normalize_path(item_str)

        node = {"title": title, "path": path, "children": []}

        while indent <= stack[-1][0]:
            stack.pop()
        stack[-1][1].append(node)

        if has_children:
            stack.append((indent, node["children"]))

    return root


def _node_index_path(node: dict) -> str | None:
    if node.get("path") and node["path"].endswith("index.md"):
        return node["path"]
    for child in node.get("children", []):
        if child.get("path") and child["path"].endswith("index.md"):
            return child["path"]
    return None


def _extract_h1(path: Path) -> str:
    text, _ = _read_text(path)
    lines = text.splitlines()
    i = 0
    if lines and lines[0].strip() == "---":
        i = 1
        while i < len(lines):
            if lines[i].strip() == "---":
                i += 1
                break
            i += 1
    h1_re = re.compile(r"^#\s+(.*)$")
    for line in lines[i:]:
        m = h1_re.match(line)
        if m:
            return m.group(1).strip()
    return path.stem


def _build_section_map(nav_root: List[dict]) -> Dict[str, List[dict]]:
    section_map: Dict[str, List[dict]] = {}

    def walk(node: dict) -> None:
        if node.get("children"):
            idx = _node_index_path(node)
            if idx:
                section_map.setdefault(idx, node["children"])
            for child in node["children"]:
                walk(child)

    for n in nav_root:
        walk(n)

    return section_map


def _collect_items(nodes: List[dict], current_index: str) -> List[str]:
    items: List[str] = []
    current_index = _normalize_path(current_index)
    for node in nodes:
        if node.get("children"):
            idx = _node_index_path(node)
            if idx:
                if _normalize_path(idx) != current_index:
                    items.append(idx)
            else:
                items.extend(_collect_items(node["children"], current_index))
            continue
        if node.get("path"):
            if _normalize_path(node["path"]) == current_index:
                continue
            items.append(node["path"])
    return items


def _make_toc_block(items: List[str], current_index: str, docs_root: Path) -> str:
    lines = [f"## {TOC_TITLE}", START_MARKER]
    for p in items:
        target = _normalize_path(p)
        title = _extract_h1(docs_root / target)
        rel = posixpath.relpath(target, posixpath.dirname(current_index))
        lines.append(f"- [{title}]({rel})")
    lines.append(END_MARKER)
    return "\n".join(lines)


def _strip_toc_block(text: str) -> str:
    start = text.find(START_MARKER)
    end = text.find(END_MARKER)
    if start == -1 or end == -1 or end <= start:
        return text

    lines = text.splitlines()
    start_line = None
    end_line = None
    for i, line in enumerate(lines):
        if START_MARKER in line:
            start_line = i
            break
    for i in range(start_line or 0, len(lines)):
        if END_MARKER in lines[i]:
            end_line = i
            break

    heading_line = (start_line or 0) - 1
    while heading_line >= 0 and lines[heading_line].strip() == "":
        heading_line -= 1
    replace_start_line = (
        heading_line
        if heading_line >= 0 and lines[heading_line].startswith("## ")
        else (start_line or 0)
    )

    prev_line = replace_start_line - 1
    while prev_line >= 0 and lines[prev_line].strip() == "":
        prev_line -= 1
    if prev_line >= 0 and lines[prev_line].startswith("## "):
        prev_title = lines[prev_line].strip()
        if prev_title in {f"## {TOC_TITLE}", "## ??"}:
            replace_start_line = prev_line

    new_lines = lines[:replace_start_line] + lines[(end_line or len(lines) - 1) + 1 :]
    return "\n".join(new_lines).rstrip() + "\n"


def _update_index_file(path: Path, toc_block: str) -> None:
    text, has_bom = _read_text(path)
    start = text.find(START_MARKER)
    end = text.find(END_MARKER)
    if start != -1 and end != -1 and end > start:
        stripped = _strip_toc_block(text)
        new_text = stripped.rstrip() + "\n\n" + toc_block + "\n"
    else:
        new_text = text.rstrip() + "\n\n" + toc_block + "\n"
    _write_text(path, new_text, has_bom)


def on_pre_build(config):
    config_path = Path(config["config_file_path"]).resolve()
    project_root = config_path.parent
    docs_root = (project_root / config["docs_dir"]).resolve()

    mkdocs_text, _ = _read_text(config_path)
    nav_root = _parse_nav(mkdocs_text)
    section_map = _build_section_map(nav_root)

    for index_path in sorted(docs_root.rglob("index.md")):
        rel = index_path.relative_to(docs_root).as_posix()
        children = section_map.get(rel)
        if children is None:
            # No siblings under the same nav group -> no TOC.
            text, has_bom = _read_text(index_path)
            stripped = _strip_toc_block(text)
            if stripped != text:
                _write_text(index_path, stripped, has_bom)
            continue
        items = _collect_items(children, rel)
        if not items:
            text, has_bom = _read_text(index_path)
            stripped = _strip_toc_block(text)
            if stripped != text:
                _write_text(index_path, stripped, has_bom)
            continue
        toc_block = _make_toc_block(items, rel, docs_root)
        _update_index_file(index_path, toc_block)

