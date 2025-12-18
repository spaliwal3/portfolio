/**
 * Photography Page - 3x3 Grid with Lightbox
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
        <div class="photo-grid-item reveal" style="transition-delay: ${index * 0.05}s" onclick="openLightbox(${index})">
            <img src="${photo.src}" alt="${photo.title || 'Photo'}" loading="lazy">
            <div class="photo-grid-overlay">
                <p class="photo-grid-title">${photo.title || ''}</p>
            </div>
        </div>
    `).join('');

    // Store photos globally for lightbox
    window.galleryPhotos = photos;

    // Trigger observer update after render
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);

    return `
        <div class="container">
            <div class="section-header">
                <h1>Photography</h1>
                <p>Capturing the world, one frame at a time.</p>
            </div>
            
            <div class="photo-grid-3x3" id="photo-gallery">
                ${photosHtml}
            </div>
        </div>

        <!-- Lightbox Modal -->
        <div class="lightbox" id="lightbox" onclick="closeLightbox(event)">
            <button class="lightbox-close" onclick="closeLightbox(event)">&times;</button>
            <button class="lightbox-prev" onclick="prevPhoto(event)">&#10094;</button>
            <button class="lightbox-next" onclick="nextPhoto(event)">&#10095;</button>
            <img class="lightbox-img" id="lightbox-img" src="" alt="">
            <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
    `;
}

// Lightbox functions
window.currentPhotoIndex = 0;

window.openLightbox = function (index) {
    window.currentPhotoIndex = index;
    const photo = window.galleryPhotos[index];
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = photo.src;
    lightboxCaption.textContent = photo.title || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function (event) {
    if (event.target.classList.contains('lightbox') || event.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.prevPhoto = function (event) {
    event.stopPropagation();
    window.currentPhotoIndex = (window.currentPhotoIndex - 1 + window.galleryPhotos.length) % window.galleryPhotos.length;
    updateLightboxImage();
};

window.nextPhoto = function (event) {
    event.stopPropagation();
    window.currentPhotoIndex = (window.currentPhotoIndex + 1) % window.galleryPhotos.length;
    updateLightboxImage();
};

function updateLightboxImage() {
    const photo = window.galleryPhotos[window.currentPhotoIndex];
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = photo.src;
    lightboxCaption.textContent = photo.title || '';
}

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
        window.prevPhoto(e);
    } else if (e.key === 'ArrowRight') {
        window.nextPhoto(e);
    }
});

// Touch swipe support for mobile
(function () {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;

    document.addEventListener('touchstart', function (e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Check if horizontal swipe is dominant
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - previous photo
                    window.currentPhotoIndex = (window.currentPhotoIndex - 1 + window.galleryPhotos.length) % window.galleryPhotos.length;
                    updateLightboxImage();
                } else {
                    // Swipe left - next photo
                    window.currentPhotoIndex = (window.currentPhotoIndex + 1) % window.galleryPhotos.length;
                    updateLightboxImage();
                }
            }
        } else {
            // Vertical swipe - close on swipe down
            if (deltaY > minSwipeDistance * 2) {
                const lightbox = document.getElementById('lightbox');
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
})();

function getSamplePhotos() {
    return [
        {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
            title: 'Majestic Peaks'
        },
        {
            src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
            title: 'Mist & Mystery'
        },
        {
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
            title: 'Forest Path'
        }
    ];
}

