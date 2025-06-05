// Make h3 grid-items from SERVICE-BENEFITS SECTION have same height
function setEqualH3Height(itemsPerRow) {
    const gridContainer = document.querySelector('.grid-container');
    const gridItems = document.querySelectorAll('.grid-item');

    for (let i = 0; i < gridItems.length; i += itemsPerRow) {
        const rowItems = Array.from(gridItems).slice(i, i + itemsPerRow);
        let maxHeight = 0;
        const h3Elements = [];

        rowItems.forEach(item => {
            const h3 = item.querySelector('h3');
            if (h3) {
                h3Elements.push(h3);
                h3.style.height = 'auto';
                maxHeight = Math.max(maxHeight, h3.offsetHeight);
            }
        });

        h3Elements.forEach(h3 => {
            h3.style.height = `${maxHeight}px`;
        });
    }
}

// Handle case small screesn with two items per column
function handleResize() {
    const screenWidth = window.innerWidth;
    let itemsPerRow = 3;
    if (screenWidth < 576) {
        itemsPerRow = 2;
    }

    setEqualH3Height(itemsPerRow);
}


