/**
 * Main Application Entry Point
 * Initializes the router and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Register routes
    router.on('/', renderHomePage);
    router.on('/projects', renderProjectsPage);
    router.on('/resume', renderResumePage);
    router.on('/photography', renderPhotographyPage);
    router.on('/blog', renderBlogPage);
    router.on('/blog/:slug', renderBlogPostPage);
    router.on('/movies', renderMoviesPage);

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    const closeNav = () => {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
    };

    navToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeNav();
        }
    });

    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            closeNav();
        }
    });

    // Scroll reveal animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with .reveal class
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Fix iOS viewport height issue (100vh includes address bar)
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
});

// Console welcome message
console.log('%c👋 Welcome to Samarth P\'s portfolio!', 'font-size: 16px; font-weight: bold;');
console.log('%cBuilt with pure HTML, CSS, and JavaScript.', 'font-size: 12px; color: #666;');

