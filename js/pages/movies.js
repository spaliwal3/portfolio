/**
 * Movies Page
 * Integrates with Letterboxd and displays movie reviews
 */

async function renderMoviesPage() {
    // Fetch Letterboxd data
    const letterboxdData = await LetterboxdService.fetchFeed();
    const stats = LetterboxdService.calculateStats(letterboxdData);

    // Load custom movie reviews
    let reviews = [];
    try {
        const response = await fetch('content/movies.json');
        reviews = await response.json();
    } catch (error) {
        console.log('No movies.json found');
    }

    // Stats section
    const statsHtml = `
        <div class="movies-stats">
            <div class="stat-card">
                <div class="stat-number">${stats.totalWatched || '—'}</div>
                <div class="stat-label">Recent Films</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.thisYear || '—'}</div>
                <div class="stat-label">This Year</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.thisMonth || '—'}</div>
                <div class="stat-label">This Month</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.averageRating || '—'}</div>
                <div class="stat-label">Avg Rating</div>
            </div>
        </div>
    `;

    // Recent watches from Letterboxd
    const recentHtml = letterboxdData ? `
        <div class="recent-watches">
            <h3>Recent Watches</h3>
            <div class="recent-list">
                ${letterboxdData.slice(0, 10).map(movie => `
                    <a href="${movie.link}" target="_blank" rel="noopener" class="recent-item">
                        ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" class="recent-poster">` : ''}
                        <div class="recent-info">
                            <div class="recent-title">${movie.title} ${movie.year ? `(${movie.year})` : ''}</div>
                            ${movie.rating ? `<div class="movie-rating">${LetterboxdService.renderStars(movie.rating)}</div>` : ''}
                            <div class="recent-date">${LetterboxdService.formatDate(movie.watchedDate)}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    ` : `
        <div class="recent-watches">
            <h3>Recent Watches</h3>
            <p>Unable to load Letterboxd data. <a href="https://letterboxd.com/seance_cat" target="_blank" rel="noopener">View my profile on Letterboxd →</a></p>
        </div>
    `;

    // Custom reviews section
    const reviewsHtml = reviews.length > 0 ? `
        <div class="section mt-xl">
            <h2>My Reviews</h2>
            <div class="grid grid-2">
                ${reviews.map(review => `
                    <div class="card movie-card">
                        ${review.poster ? `<img src="${review.poster}" alt="${review.title}" class="movie-poster">` : ''}
                        <div class="movie-info">
                            <h4>${review.title} ${review.year ? `(${review.year})` : ''}</h4>
                            ${review.rating ? `<div class="movie-rating">${LetterboxdService.renderStars(review.rating)}</div>` : ''}
                            <p>${review.review || ''}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    return `
        <div class="container">
            <div class="section-header">
                <h1>Movies</h1>
                <p>
                    Film enthusiast tracking my watches on 
                    <a href="https://letterboxd.com/seance_cat" target="_blank" rel="noopener">Letterboxd</a>
                </p>
            </div>
            
            ${statsHtml}
            ${recentHtml}
            ${reviewsHtml}
        </div>
    `;
}
