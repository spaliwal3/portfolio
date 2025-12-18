/**
 * Simple Hash-based Router
 * Handles SPA navigation without page reloads
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    /**
     * Register a route
     * @param {string} path - Route path (e.g., '/', '/projects')
     * @param {Function} handler - Function that returns HTML content
     */
    on(path, handler) {
        this.routes[path] = handler;
    }
    
    /**
     * Navigate to a path
     * @param {string} path - Route path to navigate to
     */
    navigate(path) {
        window.location.hash = path;
    }
    
    /**
     * Get the current path from the hash
     * @returns {string} Current path
     */
    getPath() {
        const hash = window.location.hash.slice(1) || '/';
        // Handle paths with parameters
        const path = hash.split('?')[0];
        return path;
    }
    
    /**
     * Get query parameters from the hash
     * @returns {URLSearchParams} Query parameters
     */
    getParams() {
        const hash = window.location.hash.slice(1) || '/';
        const queryString = hash.split('?')[1] || '';
        return new URLSearchParams(queryString);
    }
    
    /**
     * Handle route changes
     */
    async handleRoute() {
        const path = this.getPath();
        
        // Find matching route
        let handler = this.routes[path];
        let params = {};
        
        // Check for dynamic routes (e.g., /blog/:slug)
        if (!handler) {
            for (const [route, routeHandler] of Object.entries(this.routes)) {
                const match = this.matchRoute(route, path);
                if (match) {
                    handler = routeHandler;
                    params = match;
                    break;
                }
            }
        }
        
        // Default to home if no match
        if (!handler) {
            handler = this.routes['/'] || (() => '<p>Page not found</p>');
        }
        
        // Update active nav link
        this.updateActiveNav(path);
        
        // Render the page
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        try {
            const content = await handler(params);
            app.innerHTML = content;
            app.classList.add('fade-in');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Remove animation class after it completes
            setTimeout(() => app.classList.remove('fade-in'), 300);
        } catch (error) {
            console.error('Error rendering page:', error);
            app.innerHTML = '<div class="container"><p>Error loading page</p></div>';
        }
        
        this.currentRoute = path;
    }
    
    /**
     * Match a route pattern against a path
     * @param {string} pattern - Route pattern (e.g., '/blog/:slug')
     * @param {string} path - Actual path (e.g., '/blog/my-post')
     * @returns {object|null} Matched parameters or null
     */
    matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        
        if (patternParts.length !== pathParts.length) {
            return null;
        }
        
        const params = {};
        
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                // Dynamic segment
                params[patternParts[i].slice(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }
        
        return params;
    }
    
    /**
     * Update the active navigation link
     * @param {string} path - Current path
     */
    updateActiveNav(path) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href').slice(1); // Remove #
            if (href === path || (path.startsWith(href) && href !== '/')) {
                link.classList.add('active');
            } else if (href === '/' && path === '/') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Create global router instance
const router = new Router();
