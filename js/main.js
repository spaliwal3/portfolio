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

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
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
});

// Console welcome message
console.log('%c👋 Welcome to Samarth P\'s portfolio!', 'font-size: 16px; font-weight: bold;');
console.log('%cBuilt with pure HTML, CSS, and JavaScript.', 'font-size: 12px; color: #666;');
