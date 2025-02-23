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

    // For mobile: detect drag down gesture
    header.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startY = e.touches[0].clientY;
        }
    });

    header.addEventListener('touchmove', (e) => {
        if (startY !== null) {
            const currentY = e.touches[0].clientY;
            // If the user has dragged down more than 50px, expand the header
            if (currentY - startY > 50) {
                header.classList.add('expanded');
            }
        }
    });

    header.addEventListener('touchend', () => {
        // Reset the starting touch position.
        startY = null;
        header.classList.remove('expanded');
    });
});


