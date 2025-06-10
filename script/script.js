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

// Overlay-handlers
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
    const readMoreLink = document.getElementById('read-more-link');
    const moreText = document.getElementById('more-text');

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

    if (readMoreLink) {
        readMoreLink.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link behavior
            if (moreText.classList.contains('hidden-text')) {
                moreText.classList.remove('hidden-text');
                readMoreLink.textContent = 'Mostrar menos'; // Optional: change link text
            } else {
                moreText.classList.add('hidden-text');
                readMoreLink.textContent = 'Seguir leyendo'; // Optional: change link text back
            }
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

// Accesibility
function initializeAccessibility() {
    const accessibilityButton = document.getElementById('accessibility-button');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    const fontSizeBtn = document.getElementById('font-size-btn');
    const contrastBtn = document.getElementById('contrast-btn');
    const whiteTextBtn = document.getElementById('white-text-btn');
    const readableFontBtn = document.getElementById('readable-font-btn');
    const resetAccessibilityBtn = document.getElementById('reset-accessibility-btn');
    const body = document.body;

    // --- Null Checks for Robustness ---
    // It's good practice to check if elements exist before trying to add event listeners to them.
    if (!accessibilityButton || !accessibilityPanel || !fontSizeBtn || !contrastBtn || !whiteTextBtn || !readableFontBtn || !resetAccessibilityBtn) {
        console.warn("One or more accessibility elements not found. Accessibility features may not function correctly.");
        // Optionally, you might want to return or throw an error if critical elements are missing.
        return;
    }


    // Function to toggle accessibility panel visibility
    accessibilityButton.addEventListener('click', () => {
        accessibilityPanel.classList.toggle('active');
        accessibilityButton.setAttribute('aria-expanded', accessibilityPanel.classList.contains('active'));
    });

    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
        if (!accessibilityPanel.contains(event.target) && !accessibilityButton.contains(event.target)) {
            accessibilityPanel.classList.remove('active');
            accessibilityButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Helper to toggle a class on the body and button state
    function toggleAccessibilityClass(className, button) {
        body.classList.toggle(className);
        button.classList.toggle('active', body.classList.contains(className));
        // Store preference in localStorage
        localStorage.setItem(className, body.classList.contains(className));
    }

    // Helper to remove a class from the body and button state
    function removeAccessibilityClass(className, button) {
        body.classList.remove(className);
        button.classList.remove('active');
        // Remove preference from localStorage
        localStorage.removeItem(className);
    }

    // Load saved preferences on page load
    function loadAccessibilityPreferences() {
        if (localStorage.getItem('font-large') === 'true') {
            body.classList.add('font-large');
            fontSizeBtn.classList.add('active');
        }
        if (localStorage.getItem('high-contrast') === 'true') {
            body.classList.add('high-contrast');
            contrastBtn.classList.add('active');
        }
        if (localStorage.getItem('white-text-mode') === 'true') {
            body.classList.add('white-text-mode');
            whiteTextBtn.classList.add('active');
        }
        if (localStorage.getItem('readable-font') === 'true') {
            body.classList.add('readable-font');
            readableFontBtn.classList.add('active');
        }
    }

    // Event Listeners for accessibility options
    fontSizeBtn.addEventListener('click', () => {
        toggleAccessibilityClass('font-large', fontSizeBtn);
        // Ensure white text mode is off if high contrast is active when font size is toggled
        if (body.classList.contains('white-text-mode')) {
            removeAccessibilityClass('white-text-mode', whiteTextBtn);
        }
    });

    contrastBtn.addEventListener('click', () => {
        toggleAccessibilityClass('high-contrast', contrastBtn);
        // Ensure white text mode is off if high contrast is active
        if (body.classList.contains('high-contrast')) {
            removeAccessibilityClass('white-text-mode', whiteTextBtn);
        }
    });

    whiteTextBtn.addEventListener('click', () => {
        toggleAccessibilityClass('white-text-mode', whiteTextBtn);
        // Ensure high contrast is off if white text mode is active
        if (body.classList.contains('white-text-mode')) {
            removeAccessibilityClass('high-contrast', contrastBtn);
        }
    });

    readableFontBtn.addEventListener('click', () => {
        toggleAccessibilityClass('readable-font', readableFontBtn);
    });

    resetAccessibilityBtn.addEventListener('click', () => {
        // Remove all accessibility classes from the body
        removeAccessibilityClass('font-large', fontSizeBtn);
        removeAccessibilityClass('high-contrast', contrastBtn);
        removeAccessibilityClass('white-text-mode', whiteTextBtn);
        removeAccessibilityClass('readable-font', readableFontBtn);
        // Clear all accessibility preferences from localStorage
        localStorage.removeItem('font-large');
        localStorage.removeItem('high-contrast');
        localStorage.removeItem('white-text-mode');
        localStorage.removeItem('readable-font');
    });

    // Load preferences when the page loads
    loadAccessibilityPreferences();
}