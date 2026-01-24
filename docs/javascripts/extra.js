window.addEventListener('load', function () {
    const header = document.querySelector('header.md-header');
    let isHovered = false;

    header.addEventListener('mouseenter', () => isHovered = true);
    header.addEventListener('mouseleave', () => {
        isHovered = false;
        header.classList.remove('expanded');
    });


    header.addEventListener('wheel', (e) => {
        // If deltaY is negative, the user is scrolling up
        if (isHovered && e.deltaY < 0) {
            header.classList.add('expanded');
        } else {
            header.classList.remove('expanded');
        }
    });

    header.addEventListener('dblclick', (e) => {
        // If the dblclick happens on any disallowed element, do nothing.
        const disallowed = e.target.closest(
            'nav.md-header__inner .md-header__source, ' +
            'nav.md-header__inner .md-search, ' +
            'nav.md-header__inner form, ' +
            'nav.md-header__inner label:nth-child(2), ' +
            'nav.md-header__inner a'
        );
        if (disallowed) return;
        
        header.classList.toggle('expanded');
    });
});

window.addEventListener('load', function () {
    const DARK_START_HOUR = 19;
    const LIGHT_START_HOUR = 7;

    function pickSchemeByTime(date) {
        const hour = date.getHours();
        return (hour >= DARK_START_HOUR || hour < LIGHT_START_HOUR) ? 'slate' : 'default';
    }

    function formatTime(date) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

    function showSchemeToast(date, scheme, isSuggestion) {
        const isDark = scheme === 'slate';
        const period = isDark ? '晚上' : '白天';
        const mode = isDark ? '深色' : '浅色';
        const actionText = isSuggestion ? '您可以切换为' : '已为您切换为';

        const existing = document.getElementById('auto-scheme-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'auto-scheme-toast';
        toast.setAttribute('role', 'status');
        toast.style.position = 'fixed';
        toast.style.top = '12px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.zIndex = '10000';
        toast.style.maxWidth = '280px';
        toast.style.padding = '8px 10px';
        toast.style.borderRadius = '10px';
        toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
        toast.style.background = 'var(--md-default-bg-color)';
        toast.style.color = 'var(--md-default-fg-color)';
        toast.style.border = '1px solid var(--md-default-fg-color--lightest)';
        toast.style.fontSize = '0.82rem';
        toast.style.lineHeight = '1.3';
        toast.style.display = 'flex';
        toast.style.gap = '10px';
        toast.style.alignItems = 'flex-start';

        const text = document.createElement('div');
        text.textContent = `您本地时间为${period} (${formatTime(date)}), ${actionText}${mode}模式`;

        const close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', '关闭');
        close.textContent = '×';
        close.style.border = 'none';
        close.style.background = 'transparent';
        close.style.color = 'inherit';
        close.style.fontSize = '16px';
        close.style.cursor = 'pointer';
        close.style.lineHeight = '1';
        close.style.marginTop = '-2px';
        close.addEventListener('click', () => toast.remove());

        toast.appendChild(text);
        toast.appendChild(close);
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.isConnected) toast.remove();
        }, 5000);
    }

    function applyScheme(scheme, nowForToast) {
        const input = document.querySelector(`input[data-md-color-scheme="${scheme}"]`);
        if (!input) return;

        const color = {
            scheme: input.getAttribute('data-md-color-scheme'),
            primary: input.getAttribute('data-md-color-primary'),
            accent: input.getAttribute('data-md-color-accent'),
        };
        const media = input.getAttribute('data-md-color-media');
        if (media) color.media = media;

        for (const [key, value] of Object.entries(color)) {
            document.body.setAttribute(`data-md-color-${key}`, value);
        }

        input.checked = true;
        if (typeof window.__md_set === 'function') {
            window.__md_set('__palette', { color });
        }

        if (nowForToast) {
            showSchemeToast(nowForToast, scheme, false);
        }
    }

    function getManualScheme() {
        const palette = (typeof window.__md_get === 'function') ? window.__md_get('__palette') : null;
        if (palette && palette.color && palette.color.scheme) {
            return palette.color.scheme;
        }
        return null;
    }

    function scheduleNextCheck(now) {
        const next = new Date(now);
        const hour = now.getHours();
        const isDark = (hour >= DARK_START_HOUR || hour < LIGHT_START_HOUR);
        if (isDark) {
            if (hour >= DARK_START_HOUR) {
                next.setDate(next.getDate() + 1);
            }
            next.setHours(LIGHT_START_HOUR, 0, 0, 0);
        } else {
            next.setHours(DARK_START_HOUR, 0, 0, 0);
        }
        const delay = Math.max(1000, next.getTime() - now.getTime());
        setTimeout(() => {
            const current = new Date();
            const autoScheme = pickSchemeByTime(current);
            const manualScheme = getManualScheme();

            if (manualScheme) {
                if (manualScheme !== autoScheme) {
                    showSchemeToast(current, autoScheme, true);
                }
            } else {
                applyScheme(autoScheme, current);
            }
            scheduleNextCheck(current);
        }, delay);
    }

    const now = new Date();
    const autoScheme = pickSchemeByTime(now);
    const manualScheme = getManualScheme();

    if (manualScheme) {
        if (manualScheme === autoScheme) {
            showSchemeToast(now, autoScheme, false);
        } else {
            showSchemeToast(now, autoScheme, true);
        }
    } else {
        applyScheme(autoScheme, now);
    }
    scheduleNextCheck(now);
});


