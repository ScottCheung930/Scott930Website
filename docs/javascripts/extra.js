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

    header.addEventListener('dblclick', () => {
        header.classList.toggle('expanded');
    });
});


