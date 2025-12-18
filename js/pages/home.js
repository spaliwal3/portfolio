/**
 * Home Page
 */

async function renderHomePage() {
    return `
        <section class="hero">
            <div class="hero-content">
                <p class="hero-subtitle">Welcome</p>
                <h1>Samarth P</h1>
                <p class="hero-description">
                    Developer, photographer, and film enthusiast. Explore my projects, 
                    check out my photography, or see what movies I've been watching.
                </p>
                <div class="hero-cta">
                    <a href="#/projects" class="btn btn-primary">View Projects</a>
                    <a href="#/resume" class="btn btn-secondary">My Resume</a>
                </div>
                
                <div class="quick-links">
                    <a href="#/projects" class="quick-link">
                        <span class="quick-link-icon">💻</span>
                        <span class="quick-link-text">Projects</span>
                    </a>
                    <a href="#/resume" class="quick-link">
                        <span class="quick-link-icon">📄</span>
                        <span class="quick-link-text">Resume</span>
                    </a>
                    <a href="#/photography" class="quick-link">
                        <span class="quick-link-icon">📷</span>
                        <span class="quick-link-text">Photography</span>
                    </a>
                    <a href="#/blog" class="quick-link">
                        <span class="quick-link-icon">✍️</span>
                        <span class="quick-link-text">Blog</span>
                    </a>
                    <a href="#/movies" class="quick-link">
                        <span class="quick-link-icon">🎬</span>
                        <span class="quick-link-text">Movies</span>
                    </a>
                </div>
            </div>
        </section>
    `;
}
