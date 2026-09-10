// ======== Firebase Configuration ========
const firebaseConfig = {
    apiKey: "AIzaSyCy3MEe006atAjmSIjKbUvI68uLXPD-hhE",
    authDomain: "airevolutioncontact-5db6a.firebaseapp.com",
    databaseURL: "https://airevolutioncontact-5db6a-default-rtdb.firebaseio.com",
    projectId: "airevolutioncontact-5db6a",
    storageBucket: "airevolutioncontact-5db6a.appspot.com",
    messagingSenderId: "622517273550",
    appId: "1:622517273550:web:5a4a2b3146feedd0c4619f"
};

// Initialize Firebase
let messagesRef = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        messagesRef = firebase.database().ref("messages");
        console.log("Firebase initialized successfully");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// ===============================
// Helper Functions
// ===============================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    if (!input) return;
    const formGroup = input.closest('.form-group') || input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.cssText = 'color:#dc3545;font-size:0.85rem;margin-top:5px;';
    input.style.borderColor = '#dc3545';

    input.addEventListener('input', function () {
        errorElement.textContent = '';
        input.style.borderColor = '#ddd';
    }, { once: true });
}

// ===============================
// DOM Ready
// ===============================
document.addEventListener('DOMContentLoaded', function () {

    // ===== Mobile Menu =====
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';

    const headerContainer = document.querySelector('.main-header .container');
    const mainNav = document.querySelector('.main-nav');

    if (headerContainer && mainNav) {
        headerContainer.appendChild(mobileMenuToggle);

        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // ===== Smooth Scroll for anchors =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                if (mainNav && mainNav.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            }
        });
    });

    // ===== Tabs =====
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // ===== Main Newsletter =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                const msg = document.createElement('div');
                msg.textContent = 'Thank you for subscribing!';
                msg.style.cssText = 'padding:10px;background:rgba(255,255,255,0.2);border-radius:8px;text-align:center;color:white;font-weight:600;margin-top:10px;';
                this.appendChild(msg);
                emailInput.value = '';
                setTimeout(() => msg.remove(), 5000);
            } else {
                showError(emailInput, 'Please enter a valid email');
            }
        });
    }

    // ===== Footer Newsletter =====
    const footerForm = document.getElementById('footerNewsletterForm');
    if (footerForm) {
        footerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                alert('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                showError(emailInput, 'Please enter a valid email');
            }
        });
    }

    // ===== Header Subscribe Button =====
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function () {
            const email = prompt('Enter your email to subscribe:');
            if (email && validateEmail(email)) {
                alert('Thank you for subscribing!');
            } else if (email) {
                alert('Please enter a valid email address');
            }
        });
    }

    // ===== Contact Form + Firebase =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const formFeedback = document.getElementById('formFeedback');

            let isValid = true;
            this.querySelectorAll('input, textarea').forEach(i => i.style.borderColor = '#ddd');
            if (formFeedback) formFeedback.innerHTML = '';

            if (!name) { showError(document.getElementById('name'), 'Please enter your name'); isValid = false; }
            if (!email || !validateEmail(email)) { showError(document.getElementById('email'), 'Please enter a valid email'); isValid = false; }
            if (!subject) { showError(document.getElementById('subject'), 'Please enter a subject'); isValid = false; }
            if (!message) { showError(document.getElementById('message'), 'Please enter your message'); isValid = false; }
            if (!isValid) return;

            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const formData = {
                name, email, subject, message,
                timestamp: Date.now(),
                date: new Date().toISOString()
            };

            if (messagesRef) {
                messagesRef.push(formData)
                    .then(() => {
                        if (formFeedback) {
                            formFeedback.innerHTML = '<div style="padding:15px;background:#d4edda;color:#155724;border-radius:5px;margin-top:15px;border:1px solid #c3e6cb;"><strong>Success!</strong> Your message has been sent.</div>';
                        }
                        this.reset();
                    })
                    .catch(error => {
                        console.error('Firebase error:', error);
                        if (formFeedback) {
                            formFeedback.innerHTML = '<div style="padding:15px;background:#f8d7da;color:#721c24;border-radius:5px;margin-top:15px;border:1px solid #f5c6cb;"><strong>Error:</strong> Failed to send. Try again later.</div>';
                        }
                    })
                    .finally(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    });
            } else {
                if (formFeedback) {
                    formFeedback.innerHTML = '<div style="padding:15px;background:#f8d7da;color:#721c24;border-radius:5px;margin-top:15px;"><strong>Error:</strong> Connection failed.</div>';
                }
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // ===== Scroll Animations =====
    const elements = document.querySelectorAll('.news-card, .app-card, .stat-item, .about-image');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
});
