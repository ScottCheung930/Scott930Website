window.addEventListener('load', function () {
    const header = document.querySelector('header.md-header');
    console.log(header);  // This will print the header element to the console for debugging
    console.log("!!");
    let isHovered = false;

    header.addEventListener('mouseenter', () => isHovered = true);
    header.addEventListener('mouseleave', () => {
        isHovered = false;
        header.classList.remove('expanded');
        console.log("mouseleave!!!");
    });


    header.addEventListener('wheel', (e) => {
        console.log("wheel event:", e.deltaY);
        // If deltaY is negative, the user is scrolling up
        if (isHovered && e.deltaY < 0) {
            header.classList.add('expanded');
        } else {
            header.classList.remove('expanded');
        }
    });
});


