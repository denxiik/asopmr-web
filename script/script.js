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
// overlay-handlers.js

function initializeOverlayHandlers() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');
    const configureButton = document.getElementById('configure-cookies');
    const legalOverlay = document.getElementById('legal-overlay');
    const privacyOverlay = document.getElementById('privacy-overlay');
    const cookiesOverlay = document.getElementById('cookies-overlay');
    const genderOverlay = document.getElementById('gender-overlay');
    const analyticsCheckbox = document.getElementById('analyticsCookies');
    const saveButton = document.getElementById('save-cookie-settings');
    const learnMoreLink = document.getElementById('learn-more');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const floatingLegalButton = document.getElementById('legal-advice-footer');
    const floatingPrivacyButton = document.getElementById('privacy-policy-footer');
    const floatingCookieButton = document.getElementById('cookies-footer');
    const floatingGenderButton = document.getElementById('gender-footer');
    const privacyPolicyLink = document.getElementById('link-privacy-policy');
    const cookiesPolicyLink = document.getElementById('link-cookies-policy');
    const closeCookieButton = document.querySelector('.cookie-close-button');
    const closeLegalButton = document.querySelector('.legal-close-button');
    const closePrivacyButton = document.querySelector('.privacy-close-button');
    const closeGenderButton = document.querySelector('.gender-close-button');

    // Check localStorage *immediately*
    let consentCookie = localStorage.getItem('cookie_consent');

    if (cookieBanner) { // Add a check to ensure cookieBanner exists
        if (consentCookie === null) {
            cookieBanner.style.display = 'block';
        } else {
            cookieBanner.style.display = 'none';
        }
    }


    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', '{"analytics": "true"}');
            if (cookieBanner) cookieBanner.style.display = 'none';
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', '{"analytics": "false"}');
            if (cookieBanner) cookieBanner.style.display = 'none';
        });
    }

    if (configureButton) {
        configureButton.addEventListener('click', () => {
            openCookieOverlay();
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            let cookie_settings = {
                analytics: analyticsCheckbox && analyticsCheckbox.checked ? 'true' : 'false'
            };

            localStorage.setItem('cookie_consent', JSON.stringify(cookie_settings));

            closeCookieOverlay();
        });
    }

    if (learnMoreLink) {
        learnMoreLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (cookiesOverlay) cookiesOverlay.style.display = 'block';
        });
    }

    if (closeCookieButton) {
        closeCookieButton.addEventListener('click', closeCookieOverlay);
    }

    if (closeLegalButton) {
        closeLegalButton.addEventListener('click', closeLegalOverlay);
    }

    if (closePrivacyButton) {
        closePrivacyButton.addEventListener('click', closePrivacyOverlay);
    }

    if (closeGenderButton) {
        closeGenderButton.addEventListener('click', closeGenderOverlay);
    }

    // Define helper functions within this scope or make them globally accessible if needed elsewhere
    function openLegalOverlay() {
        if (legalOverlay) legalOverlay.style.display = 'block';
    }

    function openPrivacyOverlay() {
        if (privacyOverlay) privacyOverlay.style.display = 'block';
    }

    function openCookieOverlay() {
        if (cookiesOverlay) cookiesOverlay.style.display = 'block';
        let consentCookie = localStorage.getItem('cookie_consent');
        if (consentCookie !== null && analyticsCheckbox) {
            try {
                let cookie_settings = JSON.parse(consentCookie);
                analyticsCheckbox.checked = cookie_settings.analytics === 'true';
            } catch (e) {
                console.error("Error parsing cookie_consent from localStorage:", e);
            }
        }
    }

    function openGenderOverlay() {
        if (genderOverlay) genderOverlay.style.display = 'block';
    }

    function closeLegalOverlay() {
        if (legalOverlay) legalOverlay.style.display = 'none';
    }

    function closePrivacyOverlay() {
        if (privacyOverlay) privacyOverlay.style.display = 'none';
    }

    function closeCookieOverlay() {
        if (cookiesOverlay) cookiesOverlay.style.display = 'none';
    }

    function closeGenderOverlay() {
        if (genderOverlay) genderOverlay.style.display = 'none';
    }

    if (cookiesOverlay) {
        cookiesOverlay.addEventListener('click', (event) => {
            if (event.target === cookiesOverlay) {
                closeCookieOverlay();
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            const targetTabContent = document.getElementById(tabId);
            if (targetTabContent) {
                targetTabContent.classList.add('active');
            }
        });
    });

    if (floatingLegalButton) {
        floatingLegalButton.addEventListener('click', () => {
            openLegalOverlay();
        });
    }

    if (floatingPrivacyButton) {
        floatingPrivacyButton.addEventListener('click', () => {
            openPrivacyOverlay();
        });
    }

    if (floatingCookieButton) {
        floatingCookieButton.addEventListener('click', () => {
            openCookieOverlay();
        });
    }

    if (floatingGenderButton) {
        floatingGenderButton.addEventListener('click', () => {
            openGenderOverlay();
        });
    }

    if (privacyPolicyLink) {
        privacyPolicyLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag
            closeLegalOverlay();
            openPrivacyOverlay();
        });
    }

    if (cookiesPolicyLink) {
        cookiesPolicyLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag
            closeLegalOverlay();
            openCookieOverlay();
        });
    }
}