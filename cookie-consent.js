
/**
 * Ultimate GDPR Cookie Consent Solution v2.2
 * - Compact floating button view
 * - Detailed customization modal
 * - Automatic cookie categorization
 * - Attractive modern UI
 * - Full compliance with Consent Mode v2
 */

// Initialize dataLayer for Google Tag Manager
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Set default consent (deny all except security)
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'personalization_storage': 'denied',
  'functionality_storage': 'denied',
  'security_storage': 'granted'
});

// Enhanced cookie database with detailed descriptions
const cookieDatabase = {
    // Google Analytics/GA4
    '_ga': { category: 'analytics', duration: '2 years', description: 'Google Analytics user distinction' },
    '_gid': { category: 'analytics', duration: '24 hours', description: 'Google Analytics user distinction' },
    '_gat': { category: 'analytics', duration: '1 minute', description: 'Google Analytics throttle rate' },
    '_ga_': { category: 'analytics', duration: '2 years', description: 'GA4 session state' },
    
    // Facebook Pixel
    '_fbp': { category: 'advertising', duration: '3 months', description: 'Facebook conversion tracking' },
    'fr': { category: 'advertising', duration: '3 months', description: 'Facebook targeted ads' },
    
    // Functional cookies
    'wordpress_': { category: 'functional', duration: 'Session', description: 'WordPress authentication' },
    'wp-settings': { category: 'functional', duration: '1 year', description: 'WordPress preferences' },
    'PHPSESSID': { category: 'functional', duration: 'Session', description: 'PHP session' },
    'cookie_consent': { category: 'functional', duration: '1 year', description: 'Stores cookie consent preferences' },
    
    // WooCommerce cookies
    'woocommerce_items_in_cart': { category: 'functional', duration: 'Session', description: 'WooCommerce cart items tracking' },
    'woocommerce_cart_hash': { category: 'functional', duration: 'Session', description: 'WooCommerce cart hash' },
    
    // Advertising cookies
    '_gcl_au': { category: 'advertising', duration: '3 months', description: 'Google Ads conversion' },
    'IDE': { category: 'advertising', duration: '1 year', description: 'Google DoubleClick' },
    'NID': { category: 'advertising', duration: '6 months', description: 'Google user tracking' },
    
    // Other common cookies
    'gclid_tracker': { category: 'advertising', duration: 'Session', description: 'Tracks Google Click ID for conversions' },
    'tk_ai': { category: 'analytics', duration: 'Session', description: 'Jetpack/Tumblr analytics' },
    'external_id': { category: 'functional', duration: 'Session', description: 'External service identifier' }
};

// Language translations
const translations = {
    en: {
        title: "We value your privacy",
        description: "We use cookies to enhance your browsing experience. Choose which cookies you allow.",
        privacy: "Privacy Policy",
        customize: "Customize",
        reject: "Reject All",
        accept: "Accept All",
        essential: "Essential Cookies",
        essentialDesc: "Necessary for website functionality",
        analytics: "Analytics Cookies",
        analyticsDesc: "Help understand visitor interactions",
        performance: "Performance Cookies",
        performanceDesc: "Improve website performance",
        advertising: "Advertising Cookies",
        advertisingDesc: "Deliver relevant ads",
        other: "Other Cookies",
        otherDesc: "Uncategorized cookies",
        save: "Save Preferences",
        viewMore: "VIEW MORE",
        viewLess: "VIEW LESS"
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    const detectedCookies = scanAndCategorizeCookies();
    injectConsentHTML(detectedCookies);
    initializeCookieConsent(detectedCookies);
    
    if (getCookie('cookie_consent')) {
        showFloatingButton();
    }
    
    // Periodic cookie scan
    setInterval(() => {
        const newCookies = scanAndCategorizeCookies();
        updateCookieTables(newCookies);
    }, 5000);
});

// Enhanced cookie scanning with automatic categorization
function scanAndCategorizeCookies() {
    const cookies = document.cookie.split(';');
    const result = {
        functional: [],
        analytics: [],
        performance: [],
        advertising: [],
        uncategorized: []
    };

    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (!name) return;
        
        let categorized = false;
        
        // Check against known patterns
        for (const pattern in cookieDatabase) {
            if (name.startsWith(pattern) || name === pattern) {
                const cookieInfo = cookieDatabase[pattern];
                result[cookieInfo.category].push({
                    name: name,
                    value: value || '',
                    duration: cookieInfo.duration || getCookieDuration(name),
                    description: cookieInfo.description || 'Unknown purpose'
                });
                categorized = true;
                break;
            }
        }
        
        // Automatic categorization for common patterns
        if (!categorized && name !== 'cookie_consent') {
            const autoCategory = autoCategorizeCookie(name);
            result[autoCategory].push({
                name: name,
                value: value || '',
                duration: getCookieDuration(name),
                description: autoCategory === 'uncategorized' ? 
                    'Unknown cookie purpose' : 
                    `Automatically categorized as ${autoCategory}`
            });
        }
    });
    
    return result;
}

// Automatic cookie categorization
function autoCategorizeCookie(name) {
    // Analytics patterns
    if (/_ga|_gid|_gat|collect|amplitude|mixpanel|hotjar|piwik/i.test(name)) {
        return 'analytics';
    }
    
    // Advertising patterns
    if (/_gcl|_fbp|fr|tr|ads|doubleclick|adform|adroll/i.test(name)) {
        return 'advertising';
    }
    
    // Functional patterns
    if (/wordpress|wp_|session|auth|token|login|cart|checkout/i.test(name)) {
        return 'functional';
    }
    
    // Performance patterns
    if (/perf|speed|optimize|cdn|cache/i.test(name)) {
        return 'performance';
    }
    
    return 'uncategorized';
}

function getCookieDuration(name) {
    const cookieMatch = document.cookie.match(new RegExp(`${name}=[^;]+(;|$)`));
    if (!cookieMatch) return "Session";
    
    const expiresMatch = document.cookie.match(new RegExp(`${name}=[^;]+; expires=([^;]+)`));
    if (expiresMatch && expiresMatch[1]) {
        const expiryDate = new Date(expiresMatch[1]);
        return expiryDate > new Date() ? 
            `Expires ${expiryDate.toLocaleDateString()}` : 
            "Expired";
    }
    return "Session";
}

function injectConsentHTML(detectedCookies) {
    const lang = translations.en;
    
    // Generate cookie tables for each category
    const generateCategorySection = (category) => {
        const cookies = detectedCookies[category];
        const categoryKey = category === 'functional' ? 'essential' : category;
        const isEssential = category === 'functional';
        
        return `
        <div class="cookie-category">
            <div class="toggle-container">
                <h3>${lang[categoryKey]}</h3>
                <label class="toggle-switch">
                    <input type="checkbox" data-category="${category}" ${isEssential ? 'checked disabled' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <p>${lang[`${categoryKey}Desc`]}</p>
            <div class="cookie-details-container">
                <div class="cookie-details-header">
                    <span>Cookie Details</span>
                    <span class="toggle-details">+</span>
                </div>
                <div class="cookie-details-content" style="display: none;">
                    ${cookies.length > 0 ? 
                        generateCookieTable(cookies) : 
                        `<p class="no-cookies-message">No cookies in this category detected.</p>`}
                </div>
            </div>
        </div>`;
    };
    
    const html = `
    <!-- Compact Consent Banner -->
    <div id="compactConsentBanner" class="compact-consent-banner">
        <div class="compact-consent-content">
            <h2>${lang.title}</h2>
            <p>${lang.description}</p>
            <a href="/privacy-policy/" class="privacy-policy-link">${lang.privacy}</a>
            <div class="compact-consent-buttons">
                <button id="compactRejectBtn" class="compact-btn reject-btn">${lang.reject}</button>
                <button id="compactAcceptBtn" class="compact-btn accept-btn">${lang.accept}</button>
                <button id="compactCustomizeBtn" class="compact-btn customize-btn">${lang.customize}</button>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div id="cookieSettingsModal" class="cookie-settings-modal">
        <div class="cookie-settings-content">
            <div class="cookie-settings-header">
                <h2>${lang.title}</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="cookie-settings-body">
                ${generateCategorySection('functional')}
                ${generateCategorySection('analytics')}
                ${generateCategorySection('performance')}
                ${generateCategorySection('advertising')}
                ${detectedCookies.uncategorized.length > 0 ? generateCategorySection('uncategorized') : ''}
            </div>
            <div class="cookie-settings-footer">
                <button id="rejectAllSettingsBtn" class="cookie-btn reject-btn">${lang.reject}</button>
                <button id="saveSettingsBtn" class="cookie-btn save-btn">${lang.save}</button>
                <button id="acceptAllSettingsBtn" class="cookie-btn accept-btn">${lang.accept}</button>
            </div>
        </div>
    </div>

    <!-- Floating Settings Button -->
    <div id="cookieFloatingButton" class="cookie-settings-button" title="Cookie Settings">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M257.5 27.6c-.8-5.4-4.9-9.8-10.3-10.6c-22.1-3.1-44.6 .9-64.4 11.4l-74 39.5C89.1 78.4 73.2 94.9 63.4 115L26.7 190.6c-9.8 20.1-13 42.9-9.1 64.9l14.5 82.8c3.9 22.1 14.6 42.3 30.7 57.9l60.3 58.4c16.1 15.6 36.6 25.6 58.7 28.7l83 11.7c22.1 3.1 44.6-.9-64.4-11.4l74-39.5c19.7-10.5 35.6-27 45.4-47.2l36.7-75.5c9.8-20.1 13-42.9 9.1-64.9c-.9-5.7-5.9-9.9-11.6-9.9c-51.5 0-101.5-14.7-144.9-42.3l-61.2-42.4c-10.1-7-21.8-11.1-33.9-11.9c-12.1-.9-24.1 1.6-34.9 7.2l-61.2 35.1c-6.4 3.7-14.6 1.9-19.3-4.1s-4.7-13.7 1.1-18.4l61.2-42.4c43.4-30.1 97.1-46.4 151.8-46.4c5.7 0 10.7-4.1 11.6-9.8zM133.4 303.6c-25.9 0-46.9-21-46.9-46.9s21-46.9 46.9-46.9s46.9 21 46.9 46.9s-21 46.9-46.9 46.9zm116.1-90.3c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48zm92.3 99.7c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"/>
        </svg>
    </div>
    
    <style>
    /* Compact Banner Styles */
    .compact-consent-banner {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 320px;
        background: #ffffff;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        padding: 20px;
        border-radius: 12px;
        font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
        display: none;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    .compact-consent-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .compact-consent-content h2 {
        margin: 0;
        font-size: 1.1rem;
        color: #2c3e50;
        font-weight: 600;
    }

    .compact-consent-content p {
        margin: 0;
        font-size: 0.85rem;
        color: #7f8c8d;
        line-height: 1.4;
    }

    .compact-consent-buttons {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }

    .compact-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.8rem;
        transition: all 0.2s ease;
        flex: 1;
        text-align: center;
    }

    .compact-btn.reject-btn {
        background-color: #f8f9fa;
        color: #e74c3c;
        border: 1px solid #dfe6e9;
    }

    .compact-btn.reject-btn:hover {
        background-color: #ffeceb;
    }

    .compact-btn.accept-btn {
        background-color: #2ecc71;
        color: white;
    }

    .compact-btn.accept-btn:hover {
        background-color: #27ae60;
    }

    .compact-btn.customize-btn {
        background-color: #3498db;
        color: white;
    }

    .compact-btn.customize-btn:hover {
        background-color: #2980b9;
    }

    /* Modal Styles (same as before) */
    .cookie-settings-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        overflow-y: auto;
        padding: 30px 0;
    }

    .cookie-settings-content {
        background-color: #ffffff;
        margin: 0 auto;
        max-width: 800px;
        border-radius: 12px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }

    .cookie-settings-header {
        padding: 20px;
        border-bottom: 1px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cookie-settings-header h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
    }

    .close-modal {
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #7f8c8d;
        background: none;
        border: none;
        padding: 0 10px;
    }

    .close-modal:hover {
        color: #e74c3c;
    }

    .cookie-settings-body {
        padding: 20px;
    }

    .cookie-category {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ecf0f1;
    }

    .cookie-category:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    /* Toggle Switch Styles */
    .toggle-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #bdc3c7;
        transition: .4s;
        border-radius: 34px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .toggle-slider {
        background-color: #2ecc71;
    }

    input:checked + .toggle-slider:before {
        transform: translateX(24px);
    }

    input:disabled + .toggle-slider {
        background-color: #95a5a6;
        cursor: not-allowed;
    }

    /* Cookie Details */
    .cookie-details-container {
        margin-top: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
    }

    .cookie-details-header {
        background-color: #f5f5f5;
        padding: 10px 15px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }

    .cookie-details-content {
        padding: 15px;
        background-color: #fafafa;
        border-top: 1px solid #e0e0e0;
        display: none;
    }

    .cookie-details-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }

    .cookie-details-table th {
        text-align: left;
        padding: 8px 10px;
        background-color: #f0f0f0;
        font-weight: 600;
    }

    .cookie-details-table td {
        padding: 8px 10px;
        border-bottom: 1px solid #e0e0e0;
    }

    .cookie-details-table tr:last-child td {
        border-bottom: none;
    }

    .no-cookies-message {
        padding: 15px;
        text-align: center;
        color: #666;
        font-style: italic;
    }

    /* Floating Settings Button */
    .cookie-settings-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3498db, #2ecc71);
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9998;
        transition: all 0.3s ease;
    }

    .cookie-settings-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .cookie-settings-button svg {
        width: 24px;
        height: 24px;
        fill: white;
    }

    /* Footer Buttons */
    .cookie-settings-footer {
        padding: 20px;
        background-color: #f8f9fa;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid #ecf0f1;
    }

    .cookie-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.2s ease;
        min-width: 120px;
    }

    .reject-btn {
        background-color: #f8f9fa;
        color: #e74c3c;
        border: 1px solid #dfe6e9;
    }

    .reject-btn:hover {
        background-color: #ffeceb;
    }

    .accept-btn {
        background-color: #2ecc71;
        color: white;
    }

    .accept-btn:hover {
        background-color: #27ae60;
    }

    .save-btn {
        background-color: #3498db;
        color: white;
    }

    .save-btn:hover {
        background-color: #2980b9;
    }

    /* Privacy Policy Link */
    .privacy-policy-link {
        color: #3498db;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .privacy-policy-link:hover {
        text-decoration: underline;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .compact-consent-banner {
            width: calc(100% - 40px);
            bottom: 10px;
            left: 20px;
            right: 20px;
        }
        
        .cookie-settings-content {
            margin: 20px;
            width: calc(100% - 40px);
        }
        
        .cookie-settings-footer {
            flex-direction: column;
        }
        
        .cookie-settings-footer .cookie-btn {
            width: 100%;
        }
        
        .cookie-settings-button {
            bottom: 80px;
            left: 15px;
        }
    }
    </style>`;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function initializeCookieConsent(detectedCookies) {
    const consentGiven = getCookie('cookie_consent');
    
    if (!consentGiven) {
        // Show nothing initially - only show when floating button clicked
    } else {
        const consentData = JSON.parse(consentGiven);
        updateConsentMode(consentData);
        loadCookiesAccordingToConsent(consentData);
    }
    
    setupEventListeners();
    
    // Setup cookie details toggles
    document.querySelectorAll('.cookie-details-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const toggle = this.querySelector('.toggle-details');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggle.textContent = '−';
            } else {
                content.style.display = 'none';
                toggle.textContent = '+';
            }
        });
    });
}

function setupEventListeners() {
    // Floating button
    document.getElementById('cookieFloatingButton').addEventListener('click', function() {
        if (document.getElementById('compactConsentBanner').style.display === 'block') {
            hideCompactBanner();
        } else {
            showCompactBanner();
        }
    });
    
    // Compact banner buttons
    document.getElementById('compactAcceptBtn').addEventListener('click', function() {
        acceptAllCookies();
        hideCompactBanner();
    });
    
    document.getElementById('compactRejectBtn').addEventListener('click', function() {
        rejectAllCookies();
        hideCompactBanner();
    });
    
    document.getElementById('compactCustomizeBtn').addEventListener('click', function() {
        showCookieSettings();
        hideCompactBanner();
    });
    
    // Modal buttons
    document.getElementById('acceptAllSettingsBtn').addEventListener('click', function() {
        acceptAllCookies();
        hideCookieSettings();
    });
    
    document.getElementById('rejectAllSettingsBtn').addEventListener('click', function() {
        rejectAllCookies();
        hideCookieSettings();
    });
    
    document.getElementById('saveSettingsBtn').addEventListener('click', function() {
        saveCustomSettings();
        hideCookieSettings();
    });
    
    document.querySelector('.close-modal').addEventListener('click', function() {
        hideCookieSettings();
    });
}

function showCompactBanner() {
    document.getElementById('compactConsentBanner').style.display = 'block';
    document.getElementById('cookieFloatingButton').style.display = 'none';
}

function hideCompactBanner() {
    document.getElementById('compactConsentBanner').style.display = 'none';
    document.getElementById('cookieFloatingButton').style.display = 'flex';
}

function showCookieSettings() {
    document.getElementById('cookieSettingsModal').style.display = 'block';
    
    // Load current settings
    const consent = getCookie('cookie_consent');
    if (consent) {
        const consentData = JSON.parse(consent);
        document.querySelector('input[data-category="analytics"]').checked = consentData.categories.analytics;
        document.querySelector('input[data-category="performance"]').checked = consentData.categories.performance;
        document.querySelector('input[data-category="advertising"]').checked = consentData.categories.advertising;
        if (document.querySelector('input[data-category="uncategorized"]')) {
            document.querySelector('input[data-category="uncategorized"]').checked = consentData.categories.uncategorized;
        }
    }
}

function hideCookieSettings() {
    document.getElementById('cookieSettingsModal').style.display = 'none';
    showFloatingButton();
}

function showFloatingButton() {
    document.getElementById('cookieFloatingButton').style.display = 'flex';
}

function updateConsentMode(consentData) {
    const consentStates = {
        'ad_storage': consentData.categories.advertising ? 'granted' : 'denied',
        'analytics_storage': consentData.categories.analytics ? 'granted' : 'denied',
        'ad_user_data': consentData.categories.advertising ? 'granted' : 'denied',
        'ad_personalization': consentData.categories.advertising ? 'granted' : 'denied',
        'personalization_storage': consentData.categories.performance ? 'granted' : 'denied',
        'functionality_storage': consentData.categories.functional ? 'granted' : 'denied',
        'security_storage': 'granted'
    };

    gtag('consent', 'update', consentStates);
    
    window.dataLayer.push({
        'event': 'cookie_consent_update',
        'consent_mode': consentStates,
        'consent_status': consentData.status,
        'consent_categories': consentData.categories
    });
}

function acceptAllCookies() {
    const consentData = {
        status: 'accepted',
        categories: {
            functional: true,
            analytics: true,
            performance: true,
            advertising: true,
            uncategorized: true
        },
        timestamp: new Date().getTime()
    };
    
    setCookie('cookie_consent', JSON.stringify(consentData), 365);
    updateConsentMode(consentData);
    showFloatingButton();
}

function rejectAllCookies() {
    const consentData = {
        status: 'rejected',
        categories: {
            functional: true,
            analytics: false,
            performance: false,
            advertising: false,
            uncategorized: false
        },
        timestamp: new Date().getTime()
    };
    
    setCookie('cookie_consent', JSON.stringify(consentData), 365);
    updateConsentMode(consentData);
    clearNonEssentialCookies();
    showFloatingButton();
}

function saveCustomSettings() {
    const consentData = {
        status: 'custom',
        categories: {
            functional: true,
            analytics: document.querySelector('input[data-category="analytics"]').checked,
            performance: document.querySelector('input[data-category="performance"]').checked,
            advertising: document.querySelector('input[data-category="advertising"]').checked,
            uncategorized: document.querySelector('input[data-category="uncategorized"]') ? 
                document.querySelector('input[data-category="uncategorized"]').checked : false
        },
        timestamp: new Date().getTime()
    };
    
    setCookie('cookie_consent', JSON.stringify(consentData), 365);
    updateConsentMode(consentData);
    
    if (!consentData.categories.analytics) clearCategoryCookies('analytics');
    if (!consentData.categories.performance) clearCategoryCookies('performance');
    if (!consentData.categories.advertising) clearCategoryCookies('advertising');
    if (!consentData.categories.uncategorized) clearCategoryCookies('uncategorized');
    
    showFloatingButton();
}

function clearNonEssentialCookies() {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const [nameValue] = cookie.trim().split('=');
        const name = nameValue.trim();
        let isEssential = false;
        
        for (const pattern in cookieDatabase) {
            if (name.startsWith(pattern) && cookieDatabase[pattern].category === 'functional') {
                isEssential = true;
                break;
            }
        }
        
        if (!isEssential && name && name !== 'cookie_consent') {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        }
    });
}

function clearCategoryCookies(category) {
    const cookies = scanAndCategorizeCookies()[category];
    cookies.forEach(cookie => {
        document.cookie = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    });
}

function updateCookieTables(detectedCookies) {
    const categories = ['functional', 'analytics', 'performance', 'advertising', 'uncategorized'];
    
    categories.forEach(category => {
        const container = document.querySelector(`input[data-category="${category}"]`)?.closest('.cookie-category');
        if (container) {
            const content = container.querySelector('.cookie-details-content');
            if (content) {
                content.innerHTML = detectedCookies[category].length > 0 ? 
                    generateCookieTable(detectedCookies[category]) : 
                    '<p class="no-cookies-message">No cookies in this category detected.</p>';
            }
        }
    });
}

function generateCookieTable(cookies) {
    return `
    <table class="cookie-details-table">
        <thead>
            <tr>
                <th>Cookie Name</th>
                <th>Value</th>
                <th>Duration</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            ${cookies.map(cookie => `
            <tr>
                <td><code>${cookie.name}</code></td>
                <td><code>${cookie.value.substring(0, 20)}${cookie.value.length > 20 ? '...' : ''}</code></td>
                <td>${cookie.duration}</td>
                <td>${cookie.description}</td>
            </tr>`).join('')}
        </tbody>
    </table>`;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

