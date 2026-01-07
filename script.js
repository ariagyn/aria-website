/* ================================
   ARIA GYNECOLOGY & SURGERY
   Main JavaScript File
   ================================ */

/* ================================
   GOOGLE ANALYTICS SETUP
   ================================ */

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID'); // Replace with your actual GA ID

/* ================================
   DEV MODE ANALYTICS (Optional)
   ================================ */

// Set to true for local testing, false for production
const DEV_MODE = false;

if (DEV_MODE) {
    // Initialize counters
    if (!localStorage.getItem('pageViews')) {
        localStorage.setItem('pageViews', JSON.stringify({}));
    }
    if (!localStorage.getItem('clickTracking')) {
        localStorage.setItem('clickTracking', JSON.stringify({}));
    }
    
    // Track page view
    function trackPageView(pageName) {
        const views = JSON.parse(localStorage.getItem('pageViews'));
        views[pageName] = (views[pageName] || 0) + 1;
        localStorage.setItem('pageViews', JSON.stringify(views));
        console.log('Dev Mode - Page View:', pageName, 'Total:', views[pageName]);
    }
    
    // Track click event
    function trackClick(eventName, eventData) {
        const clicks = JSON.parse(localStorage.getItem('clickTracking'));
        const key = `${eventName}_${eventData}`;
        clicks[key] = (clicks[key] || 0) + 1;
        localStorage.setItem('clickTracking', JSON.stringify(clicks));
        console.log('Dev Mode - Click:', eventName, eventData, 'Total:', clicks[key]);
    }
    
    // View stored analytics
    window.viewAnalytics = function() {
        console.log('=== LOCAL ANALYTICS DATA ===');
        console.log('Page Views:', JSON.parse(localStorage.getItem('pageViews')));
        console.log('Click Tracking:', JSON.parse(localStorage.getItem('clickTracking')));
    }
    
    // Clear analytics data
    window.clearAnalytics = function() {
        localStorage.removeItem('pageViews');
        localStorage.removeItem('clickTracking');
        console.log('Analytics data cleared');
    }
    
    // Track initial page load
    trackPageView('homepage');
}

/* ================================
   ANALYTICS EVENT TRACKING
   ================================ */

// Google Analytics event tracking function
function trackEvent(eventName, eventCategory, eventLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': eventCategory,
            'event_label': eventLabel
        });
    }
    
    // Also track in dev mode if enabled
    if (DEV_MODE && typeof trackClick !== 'undefined') {
        trackClick(eventCategory, eventLabel);
    }
}

// Track "Coming Soon" clicks
function trackComingSoon(serviceName) {
    trackEvent('coming_soon_click', 'Coming Soon', serviceName);
    console.log('Coming Soon interest tracked:', serviceName);
}

/* ================================
   MODAL FUNCTIONALITY
   ================================ */

// Modal name mapping for analytics
const modalNames = {
    'annualExamsModal': 'Preventive & Wellness Care',
    'gynSurgeryModal': 'Minimally Invasive Gynecologic Surgery',
    'generalGynModal': 'General Gynecology',
    'reproductiveHealthModal': 'Reproductive Health & Family Planning',
    'officeBasedModal': 'Office-Based Procedures',
    'menopauseModal': 'Menopause & Midlife Women\'s Health',
    'pelvicHealthModal': 'Pelvic Health & Intimacy Care',
    'diagnosticModal': 'Diagnostic Imaging & Testing',
    'highRiskModal': 'High-Risk & Complex Gynecology',
    'postSurgicalModal': 'Post-Surgical & Long-Term Care',
    'patientEducationModal': 'Patient Education & Support Services',
    'aestheticModal': 'Aesthetic & Functional Gynecology (Coming Soon)',
    'privacyPolicyModal': 'Privacy Policy',
    'termsOfServiceModal': 'Terms of Service'
};

// Open modal function
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track modal opening
        const modalName = modalNames[modalId] || modalId;
        trackEvent('modal_open', 'Service Details', modalName);
        
        // Special tracking for "Coming Soon" modal
        if (modalId === 'aestheticModal') {
            trackComingSoon('Aesthetic & Functional Gynecology');
        }
    }
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/* ================================
   EVENT LISTENERS
   ================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Track "Book Appointment" button clicks
    const ctaButtons = document.querySelectorAll('.nav-cta, .btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', 'Call to Action', this.textContent.trim());
        });
    });
    
    // Track navigation clicks
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('navigation_click', 'Navigation', this.textContent.trim());
        });
    });
    
    // DEV MODE: Log analytics viewing instructions
    if (DEV_MODE) {
        console.log('%c📊 DEV MODE ANALYTICS ENABLED', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%cTo view analytics data, type: viewAnalytics()', 'color: #2196F3;');
        console.log('%cTo clear analytics data, type: clearAnalytics()', 'color: #FF9800;');
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Don't prevent default for # links that open modals
            if (href === '#' || this.hasAttribute('onclick')) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Prevent body scroll when modal is open
function preventBodyScroll() {
    const activeModals = document.querySelectorAll('.modal.active');
    if (activeModals.length > 0) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

/* ================================
   FORM VALIDATION (If needed)
   ================================ */

// Add form validation functions here if you add contact forms later
// Example:
/*
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone);
}
*/

/* ================================
   CONSOLE MESSAGE
   ================================ */

console.log('%cAria Gynecology & Surgery', 'color: #d2988e; font-size: 24px; font-weight: bold;');
console.log('%cWebsite loaded successfully', 'color: #666; font-size: 12px;');
