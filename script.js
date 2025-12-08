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
let messagesRef;
try {
    firebase.initializeApp(firebaseConfig);
    messagesRef = firebase.database().ref("messages");
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// ===============================
// Wait for the DOM to be fully loaded
// ===============================
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");

    // Mobile Menu Toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';

    const headerContainer = document.querySelector('.main-header .container');
    const mainNav = document.querySelector('.main-nav');

    if (headerContainer && mainNav) {
        headerContainer.insertBefore(mobileMenuToggle, headerContainer.firstChild);

        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId.startsWith('http')) {
                return;
            }

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });

    // Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Initialize first tab as active if none is active
    if (tabButtons.length > 0 && document.querySelectorAll('.tab-btn.active').length === 0) {
        tabButtons[0].classList.add('active');
        if (tabContents.length > 0) {
            tabContents[0].classList.add('active');
        }
    }

    // Newsletter Form Submission (Main)
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'form-success';
                successDiv.style.cssText = `
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    text-align: center;
                    color: white;
                    font-weight: 600;
                    margin-top: 10px;
                `;
                successDiv.textContent = 'Thank you for subscribing!';
                
                this.appendChild(successDiv);
                emailInput.value = '';
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successDiv.remove();
                }, 5000);
                
                console.log('Subscribed email:', email);
            } else {
                showError(emailInput, 'Please enter a valid email address');
            }
        });
    }

    // Footer Newsletter Form
    const footerNewsletterForm = document.getElementById('footerNewsletterForm');
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
                console.log('Footer subscribed email:', email);
            } else {
                showError(emailInput, 'Please enter a valid email address');
            }
        });
    }

    // Header Subscribe Button
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function () {
            const email = prompt('Enter your email to subscribe:');
            if (email && validateEmail(email)) {
                alert('Thank you for subscribing!');
                console.log('Header button subscribed email:', email);
            } else if (email) {
                alert('Please enter a valid email address');
            }
        });
    }

    // =====================================
    //      CONTACT FORM + FIREBASE
    // =====================================
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

            // Reset previous errors
            this.querySelectorAll('input, textarea').forEach(input => {
                input.style.borderColor = '#ddd';
            });
            
            if (formFeedback) {
                formFeedback.innerHTML = '';
                formFeedback.className = '';
            }

            // Validate inputs
            if (!name) {
                showError(document.getElementById('name'), 'Please enter your name');
                isValid = false;
            }

            if (!email || !validateEmail(email)) {
                showError(document.getElementById('email'), 'Please enter a valid email address');
                isValid = false;
            }

            if (!subject) {
                showError(document.getElementById('subject'), 'Please enter a subject');
                isValid = false;
            }

            if (!message) {
                showError(document.getElementById('message'), 'Please enter your message');
                isValid = false;
            }

            if (!isValid) return;

            // Disable submit button
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Prepare data for Firebase
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: Date.now(),
                date: new Date().toISOString()
            };

            // Send to Firebase
            if (messagesRef) {
                messagesRef.push(formData)
                    .then(() => {
                        // Success
                        if (formFeedback) {
                            formFeedback.innerHTML = `
                                <div class="success-message" style="
                                    padding: 15px;
                                    background: #d4edda;
                                    color: #155724;
                                    border-radius: 5px;
                                    margin-top: 15px;
                                    border: 1px solid #c3e6cb;
                                ">
                                    <strong>Success!</strong> Your message has been sent. We'll get back to you soon.
                                </div>
                            `;
                        }
                        
                        // Reset form
                        this.reset();
                    })
                    .catch(error => {
                        console.error('Firebase error:', error);
                        if (formFeedback) {
                            formFeedback.innerHTML = `
                                <div class="error-message" style="
                                    padding: 15px;
                                    background: #f8d7da;
                                    color: #721c24;
                                    border-radius: 5px;
                                    margin-top: 15px;
                                    border: 1px solid #f5c6cb;
                                ">
                                    <strong>Error:</strong> Failed to send message. Please try again later.
                                </div>
                            `;
                        }
                    })
                    .finally(() => {
                        // Re-enable submit button
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    });
            } else {
                // Firebase not available, use local storage as fallback
                try {
                    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                    messages.push(formData);
                    localStorage.setItem('contactMessages', JSON.stringify(messages));
                    
                    if (formFeedback) {
                        formFeedback.innerHTML = `
                            <div class="success-message" style="
                                padding: 15px;
                                background: #d4edda;
                                color: #155724;
                                border-radius: 5px;
                                margin-top: 15px;
                                border: 1px solid #c3e6cb;
                            ">
                                <strong>Success!</strong> Your message has been saved locally.
                            </div>
                        `;
                    }
                    
                    this.reset();
                } catch (error) {
                    console.error('Local storage error:', error);
                    if (formFeedback) {
                        formFeedback.innerHTML = `
                            <div class="error-message" style="
                                padding: 15px;
                                background: #f8d7da;
                                color: #721c24;
                                border-radius: 5px;
                                margin-top: 15px;
                                border: 1px solid #f5c6cb;
                            ">
                                <strong>Error:</strong> Failed to save message.
                            </div>
                        `;
                    }
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }
        });
    }

    // Scroll Animation with Intersection Observer
    const initScrollAnimations = function () {
        const elements = document.querySelectorAll('.news-card, .app-card, .stat-item, .about-image');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Sticky Header
    const header = document.querySelector('.main-header');
    
    if (header) {
        const headerHeight = header.offsetHeight;
        
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > headerHeight) {
                header.classList.add('sticky');
                document.body.style.paddingTop = headerHeight + 'px';
            } else {
                header.classList.remove('sticky');
                document.body.style.paddingTop = '0';
            }
        });
    }

    // Initialize animations
    initScrollAnimations();

    // Helper Functions
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
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.9rem;
            margin-top: 5px;
            margin-bottom: 10px;
        `;

        input.style.borderColor = '#dc3545';

        input.addEventListener('input', function () {
            errorElement.textContent = '';
            input.style.borderColor = '#ddd';
        }, { once: true });
    }

    // AdSense simulation
    setTimeout(() => {
        console.log('AdSense would load here');
    }, 2000);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    };
}
