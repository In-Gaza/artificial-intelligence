// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';

    const headerContainer = document.querySelector('.main-header .container');
    headerContainer.prepend(mobileMenuToggle);

    const mainNav = document.querySelector('.main-nav');

    mobileMenuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
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

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Newsletter Form Submission
    const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                // Simulate form submission
                this.innerHTML = `
                    <div class="form-success" style="
                        padding: 15px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: var(--border-radius);
                        text-align: center;
                    ">
                        <p style="margin: 0; color: white; font-weight: 600;">Thank you for subscribing!</p>
                    </div>
                `;

                // In a real scenario, you would send the data to your server here
                console.log('Subscribed email:', email);
            } else {
                showError(emailInput, 'Please enter a valid email address');
            }
        });
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const subject = this.querySelector('input[type="text"][placeholder="Subject"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            // Validate form
            let isValid = true;

            if (name === '') {
                showError(this.querySelector('input[type="text"]'), 'Please enter your name');
                isValid = false;
            }

            if (email === '' || !validateEmail(email)) {
                showError(this.querySelector('input[type="email"]'), 'Please enter a valid email address');
                isValid = false;
            }

            if (message === '') {
                showError(this.querySelector('textarea'), 'Please enter your message');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                setTimeout(() => {
                    this.innerHTML = `
                        <div class="form-success" style="
                            padding: 30px;
                            background: #f8f9fa;
                            border-radius: var(--border-radius);
                            text-align: center;
                        ">
                            <h3 style="margin-bottom: 15px; color: var(--primary-color);">Thank you for your message!</h3>
                            <p style="margin: 0; color: var(--text-color);">We'll get back to you as soon as possible.</p>
                        </div>
                    `;

                    // In a real scenario, you would send the data to your server here
                    console.log('Contact form submitted:', { name, email, subject, message });
                }, 1500);
            }
        });
    }

    // Scroll Animation for Sections
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.news-card, .app-card, .stat-item, .about-image');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };

    // Run once on page load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Sticky Header on Scroll
    const header = document.querySelector('.main-header');
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

    // Google Adsense Integration (Example)
    // Note: Replace with your actual AdSense code
    const loadAdsense = function () {
        // This is just a placeholder - use your real AdSense code
        console.log('AdSense would load here');
        /*
        const adScript = document.createElement('script');
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
        adScript.async = true;
        adScript.crossOrigin = 'anonymous';
        document.head.appendChild(adScript);
        */
    };

    // Load AdSense after a short delay
    setTimeout(loadAdsense, 2000);

    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.color = 'var(--danger-color)';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '5px';

        input.style.borderColor = 'var(--danger-color)';

        input.addEventListener('input', function () {
            errorElement.textContent = '';
            input.style.borderColor = '#ddd';
        }, { once: true });
    }

    // Initialize first tab as active if none is active
    if (document.querySelectorAll('.tab-btn.active').length === 0 && tabButtons.length > 0) {
        tabButtons[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
});

// Additional animations with Intersection Observer
const initIntersectionObserver = function () {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.news-card, .app-card, .stat-item, .about-image').forEach(element => {
        observer.observe(element);
    });
};

// Initialize Intersection Observer when DOM is loaded
document.addEventListener('DOMContentLoaded', initIntersectionObserver);