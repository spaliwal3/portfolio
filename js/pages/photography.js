/**
 * Photography Page
 */

async function renderPhotographyPage() {
    let photos = [];

    try {
        const response = await fetch('content/photos.json');
        photos = await response.json();
    } catch (error) {
        console.log('No photos.json found, using sample data');
        photos = getSamplePhotos();
    }

    const photosHtml = photos.map((photo, index) => `
        <div class="masonry-item photo-item" onclick="openLightbox(${index})">
            <img src="${photo.src}" alt="${photo.title || 'Photo'}" loading="lazy">
            <div class="photo-overlay">
                <p class="photo-title">${photo.title || ''}</p>
            </div>
        </div>
    `).join('');

    // Store photos globally for lightbox
    window.currentPhotos = photos;

    return `
        <div class="container">
            <div class="section-header">
                <h1>Photography</h1>
                <p>Capturing moments and perspectives through my lens.</p>
            </div>
            
            <div class="masonry" id="photo-gallery">
                ${photosHtml}
            </div>
        </div>
    `;
}

function openLightbox(index) {
    const photos = window.currentPhotos || [];
    if (!photos[index]) return;

    window.currentPhotoIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    img.src = photos[index].src;
    img.alt = photos[index].title || '';
    caption.textContent = photos[index].title || '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const photos = window.currentPhotos || [];
    let newIndex = (window.currentPhotoIndex || 0) + direction;

    if (newIndex < 0) newIndex = photos.length - 1;
    if (newIndex >= photos.length) newIndex = 0;

    openLightbox(newIndex);
}

// Initialize lightbox controls
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
    document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));

    document.getElementById('lightbox')?.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('lightbox')?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
});

function getSamplePhotos() {
    return [
        {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
            title: 'Mountain Vista'
        },
        {
            src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
            title: 'Foggy Forest'
        },
        {
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
            title: 'Sunlit Path'
        },
        {
            src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
            title: 'Nature\'s Beauty'
        },
        {
            src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
            title: 'Golden Hour'
        },
        {
            src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
            title: 'Waterfall'
        }
    ];
}
