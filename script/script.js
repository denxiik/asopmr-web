// Function to load content from another HTML file
function loadHTML(filename, elementId) {
    return fetch(filename)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
        });
}