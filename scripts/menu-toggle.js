// Load with page
document.addEventListener('DOMContentLoaded', function () {
    loadHTML('header.html', 'header-placeholder');
    const menuToggle = document.querySelector('.menu-toggle');
    const navBar = document.querySelector('.nav-bar');

    // Event listeners for menu toggle(small screens)
    menuToggle.addEventListener('click', function () {
        navBar.classList.toggle('active');
    });
});