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


