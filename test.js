document.addEventListener('DOMContentLoaded', function () {
    // ============== Mobile Menu Toggle ==============
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';

    const headerContainer = document.querySelector('.main-header .container');
    const mainNav = document.querySelector('.main-nav');

    headerContainer.prepend(mobileMenuBtn);

    mobileMenuBtn.addEventListener('click', function () {
        mainNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // ============== Smooth Scrolling ==============
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
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // ============== Article Card Animations ==============
    const animateCards = function () {
        const cards = document.querySelectorAll('.article-card, .video-card');

        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    const cards = document.querySelectorAll('.article-card, .video-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
    });

    // Trigger animations on load and scroll
    window.addEventListener('load', animateCards);
    window.addEventListener('scroll', animateCards);

    // ============== Video Card Enhancements ==============
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        // Add play button overlay
        const playBtn = document.createElement('div');
        playBtn.className = 'video-play-btn';
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        card.querySelector('.video-wrapper').appendChild(playBtn);

        // Click effect
        card.addEventListener('click', function (e) {
            if (e.target.closest('.btn') || e.target.closest('iframe')) return;

            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });

    // ============== Reading Progress Bar ==============
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', function () {
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / (docHeight - windowHeight)) * 100;

        progressBar.style.width = progress + '%';
    });

    // ============== Back to Top Button ==============
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // ============== Article View Count Simulation ==============
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        const viewCount = Math.floor(Math.random() * 500) + 100;
        const viewsEl = document.createElement('div');
        viewsEl.className = 'article-views';
        viewsEl.innerHTML = `<i class="far fa-eye"></i> ${viewCount.toLocaleString()} views`;
        card.querySelector('.article-content').appendChild(viewsEl);
    });

    // ============== Add to Bookmarks Functionality ==============
    articleCards.forEach(card => {
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        bookmarkBtn.title = 'Save article';

        bookmarkBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') ?
                '<i class="fas fa-bookmark"></i>' : '<i class="far fa-bookmark"></i>';

            // In a real app, you would save to localStorage or database
            const articleTitle = card.querySelector('h3').textContent;
            if (this.classList.contains('active')) {
                console.log(`Bookmarked: ${articleTitle}`);
            } else {
                console.log(`Removed bookmark: ${articleTitle}`);
            }
        });

        card.querySelector('.article-content').appendChild(bookmarkBtn);
    });
});

// ============== Additional CSS for JS elements ==============
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--dark);
        cursor: pointer;
    }
    
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: var(--primary);
        z-index: 1000;
    }
    
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .back-to-top.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .back-to-top:hover {
        background: var(--secondary);
        transform: translateY(-3px) scale(1.1);
    }
    
    .video-play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        font-size: 1.5rem;
        pointer-events: none;
        opacity: 0.9;
        transition: all 0.3s ease;
    }
    
    .video-card:hover .video-play-btn {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
    }
    
    .video-card.clicked {
        transform: scale(0.98);
    }
    
    .article-views {
        color: var(--gray);
        font-size: 0.8rem;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .bookmark-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--gray);
        transition: all 0.3s ease;
    }
    
    .bookmark-btn:hover {
        color: var(--primary);
        transform: scale(1.1);
    }
    
    .bookmark-btn.active {
        color: var(--primary);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        
        .main-nav {
            display: none;
            flex-direction: column;
            width: 100%;
            margin-top: 15px;
        }
        
        .main-nav.active {
            display: flex;
        }
    }
`;
document.head.appendChild(dynamicStyles);