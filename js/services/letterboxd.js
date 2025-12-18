/**
 * Letterboxd Integration Service
 * Fetches data from Letterboxd RSS feed
 */

const LetterboxdService = {
    username: 'seance_cat',

    /**
     * Fetch the user's Letterboxd RSS feed
     * Uses a CORS proxy to fetch the feed
     */
    async fetchFeed() {
        const feedUrl = `https://letterboxd.com/${this.username}/rss/`;
        // Use a CORS proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;

        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch Letterboxd feed');
            }

            const data = await response.json();
            return this.parseFeed(data.contents);
        } catch (error) {
            console.error('Error fetching Letterboxd feed:', error);
            return null;
        }
    },

    /**
     * Parse RSS XML feed into structured data
     */
    parseFeed(xmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');

        const items = doc.querySelectorAll('item');
        const movies = [];

        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';

            // Parse the title to extract movie name and year
            // Format is usually: "Movie Name, Year - ★★★★"
            const titleMatch = title.match(/^(.+?),\s*(\d{4})\s*-?\s*(★*)?\s*$/);

            // Extract poster from description
            const posterMatch = description.match(/src="([^"]+)"/);
            const poster = posterMatch ? posterMatch[1] : null;

            // Extract rating (count stars)
            const ratingMatch = title.match(/★+/);
            const rating = ratingMatch ? ratingMatch[0].length : 0;

            // Check if this is a review or just a watch
            const isReview = item.querySelector('letterboxd\\:rewatch, rewatch') !== null ||
                description.includes('Watched on');

            movies.push({
                title: titleMatch ? titleMatch[1].trim() : title,
                year: titleMatch ? titleMatch[2] : null,
                rating: rating,
                link: link,
                watchedDate: new Date(pubDate),
                poster: poster,
                description: description.replace(/<[^>]*>/g, '').trim()
            });
        });

        return movies;
    },

    /**
     * Calculate stats from the movies list
     */
    calculateStats(movies) {
        if (!movies || movies.length === 0) {
            return {
                totalWatched: 0,
                averageRating: 0,
                thisYear: 0,
                thisMonth: 0
            };
        }

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth();

        const ratedMovies = movies.filter(m => m.rating > 0);
        const averageRating = ratedMovies.length > 0
            ? (ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length).toFixed(1)
            : 0;

        const moviesThisYear = movies.filter(m =>
            m.watchedDate.getFullYear() === thisYear
        ).length;

        const moviesThisMonth = movies.filter(m =>
            m.watchedDate.getFullYear() === thisYear &&
            m.watchedDate.getMonth() === thisMonth
        ).length;

        return {
            totalWatched: movies.length,
            averageRating: averageRating,
            thisYear: moviesThisYear,
            thisMonth: moviesThisMonth
        };
    },

    /**
     * Generate star rating HTML
     */
    renderStars(rating, maxStars = 5) {
        let html = '';
        for (let i = 1; i <= maxStars; i++) {
            html += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
        }
        return html;
    },

    /**
     * Format date for display
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};
