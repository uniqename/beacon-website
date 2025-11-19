// Beacon of New Beginnings Website JavaScript

// Global variables
let currentUser = null;
let chatOpen = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeChatWidget();
    initializeContactForm();
    initializeDonationSystem();
    initializeScrollEffects();
    initializeQuickExit();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 120; // Account for fixed header
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });

    // Hide/show navbar on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Chat Widget functionality
function initializeChatWidget() {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const chatClose = document.getElementById('chatClose');

    if (chatToggle && chatBox && chatClose) {
        chatToggle.addEventListener('click', function() {
            chatBox.classList.toggle('hidden');
            chatOpen = !chatOpen;
            
            if (chatOpen) {
                // Track chat opening
                gtag('event', 'chat_opened', {
                    event_category: 'engagement',
                    event_label: 'support_chat'
                });
            }
        });

        chatClose.addEventListener('click', function() {
            chatBox.classList.add('hidden');
            chatOpen = false;
        });
    }
}

function openChat() {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.classList.remove('hidden');
        chatOpen = true;
    }
}

function quickHelp(type) {
    // Track quick help usage
    gtag('event', 'quick_help_used', {
        event_category: 'engagement',
        event_label: type
    });

    switch(type) {
        case 'emergency':
            if (confirm('This will call emergency services. Continue?')) {
                window.location.href = 'tel:999';
            }
            break;
        case 'shelter':
            alert('Connecting you with our shelter coordinator...');
            window.location.href = 'tel:+233123456789';
            break;
        case 'counseling':
            alert('Our counseling team will be with you shortly...');
            break;
        case 'legal':
            alert('Connecting you with legal advocacy services...');
            break;
    }
}

// Contact Form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (!formObject.email || !formObject.subject || !formObject.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                alert('Thank you for your message. We will respond within 24 hours.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Track form submission
                gtag('event', 'contact_form_submitted', {
                    event_category: 'engagement',
                    event_label: formObject.subject
                });
            }, 2000);
        });
    }
}

// Donation System
function initializeDonationSystem() {
    // This would integrate with a payment processor like Stripe or Paystack
    console.log('Donation system initialized');
}

function donate(amount) {
    // Track donation intent
    gtag('event', 'donation_intent', {
        event_category: 'fundraising',
        event_label: 'preset_amount',
        value: amount
    });

    // Redirect to Beacon of New Beginnings donation page
    const donationUrl = `https://beaconnewbeginnings.org/donate?amount=${amount}&currency=GHS`;
    
    if (confirm(`Donate ₵${amount} to Beacon of New Beginnings Ghana?`)) {
        window.location.href = donationUrl;
    }
}

function customDonate() {
    const amount = prompt('Enter donation amount (₵):');
    
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        donate(parseFloat(amount));
    } else if (amount !== null) {
        alert('Please enter a valid amount.');
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .help-card, .support-card').forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .help-card, .support-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Quick Exit functionality for safety
function initializeQuickExit() {
    // Double-tap ESC to quickly exit
    let escPressCount = 0;
    let escTimer;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            escPressCount++;
            
            if (escPressCount === 1) {
                escTimer = setTimeout(() => {
                    escPressCount = 0;
                }, 1000);
            } else if (escPressCount === 2) {
                clearTimeout(escTimer);
                quickExit();
            }
        }
    });
}

function quickExit() {
    // Clear browsing data and redirect to a safe site
    if (confirm('Quick exit will clear your browsing history and redirect to Google. Continue?')) {
        // Clear session storage
        sessionStorage.clear();
        
        // Clear local storage (be careful with this)
        localStorage.removeItem('beacon_data');
        
        // Replace current page in history and redirect
        window.location.replace('https://www.google.com');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                border-left: 4px solid #00796B;
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .notification-error {
                border-left-color: #f44336;
            }
            .notification-success {
                border-left-color: #4caf50;
            }
            .notification button {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Security and Privacy Functions
function clearSensitiveData() {
    // Clear any sensitive data stored locally
    sessionStorage.clear();
    localStorage.removeItem('user_data');
    localStorage.removeItem('search_history');
}

// Page Visibility API for security
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - could clear sensitive data or pause video calls
        console.log('Page hidden - enhancing privacy');
    } else {
        // Page is visible again
        console.log('Page visible - resuming normal operation');
    }
});

// Prevent right-click context menu on sensitive elements (optional)
document.querySelectorAll('.emergency-banner, .help-card.urgent').forEach(element => {
    element.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});

// Analytics and Tracking (Privacy-conscious)
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            anonymize_ip: true // Ensure IP anonymization
        });
    }
}

// Load external resources safely
function loadExternalResource(url, type = 'script') {
    return new Promise((resolve, reject) => {
        const element = document.createElement(type);
        
        if (type === 'script') {
            element.src = url;
            element.async = true;
        } else if (type === 'link') {
            element.href = url;
            element.rel = 'stylesheet';
        }
        
        element.onload = resolve;
        element.onerror = reject;
        
        document.head.appendChild(element);
    });
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                
                // Track performance if it's notably slow
                if (loadTime > 3000) {
                    trackEvent('slow_page_load', 'performance', `${Math.round(loadTime/1000)}s`);
                }
            }, 0);
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        quickHelp,
        donate,
        quickExit,
        showNotification
    };
}