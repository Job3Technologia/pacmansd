// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                initAnimations();
            }, 500);
        }, 1500);
    } else {
        initAnimations();
    }
    
    initModal();
    initMobileMenu();
    initHeroSlideshow();
});

function initHeroSlideshow() {
    const heroImage = document.getElementById('hero-image');
    if (!heroImage) return;

    const images = ['FB_IMG_1767419803312.jpg'];
    heroImage.src = images[0];
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    let isOpen = false;

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                // Open Menu
                menu.classList.remove('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.classList.add('overflow-hidden');
                
                // Animate Links
                gsap.fromTo(links, 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
                );
            } else {
                // Close Menu
                menu.classList.add('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('overflow-hidden');
            }
        });

        // Close on Link Click
        links.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                menu.classList.add('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('overflow-hidden');
            });
        });
    }
}

function initAnimations() {
    // Navbar Animation
    gsap.from("nav", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });

    // Section 1: Hero
    gsap.from("#hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.from("#hero-image", {
        scale: 1,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
        delay: 0.8
    });

    // Navigation Click Handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navbar = document.getElementById('navbar');
            const navHeight = navbar ? navbar.offsetHeight : 0;
            
            if (targetSection) {
                const top = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Remove parallax and floating for a static hero image

    // Section 2: Music Animations
    gsap.from(".album-cover", {
        scrollTrigger: {
            trigger: "#music",
            start: "top 60%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Section 3: Booking Animations
    gsap.from("#booking-card", {
        scrollTrigger: {
            trigger: "#booking",
            start: "top 70%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Section 4: Gallery Animations
    // Static gallery: no entrance scaling or fade

    // Section 5: Events Animations
    gsap.from(".event-item", {
        scrollTrigger: {
            trigger: "#events",
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    });
}

// Audio Player Logic
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const trackTitle = document.getElementById('current-track');
const trackArtist = document.getElementById('current-artist');

let isPlaying = false;
// Placeholder audio - using a silence or simple beep would be safer, 
// but for now we just simulate the UI state since no real file is provided.
// In a real scenario, playBtn.addEventListener('click', toggleAudio);

if (playBtn) {
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            // Simulate progress
            simulateProgress();
        } else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    });
}

function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        if (!isPlaying || progress >= 100) {
            clearInterval(interval);
            if (progress >= 100) {
                isPlaying = false;
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
                if (progressBar) progressBar.value = 0;
            }
            return;
        }
        progress += 1; // 1% every 100ms = 10s song
        if (progressBar) progressBar.value = progress;
    }, 100);
}

// Album Selection (Mock)
const albums = document.querySelectorAll('.album-cover');
albums.forEach(album => {
    album.addEventListener('click', () => {
        // Reset active state
        albums.forEach(a => a.classList.remove('ring-2', 'ring-yellow-500'));
        // Set active
        album.classList.add('ring-2', 'ring-yellow-500');
        
        // Update Text
        if (trackTitle) trackTitle.innerText = album.dataset.track || "Unknown Track";
        if (trackArtist && album.dataset.artist) trackArtist.innerText = album.dataset.artist;
        
        // Reset player
        isPlaying = false;
        if (playIcon) {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
        if (progressBar) progressBar.value = 0;
    });
});

// Bio Modal Logic
function initModal() {
    const bioModal = document.getElementById('bio-modal');
    const openBioBtn = document.getElementById('open-bio-btn');
    const closeBioBtn = document.getElementById('close-bio');

    if (openBioBtn && bioModal && closeBioBtn) {
        openBioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bioModal.classList.remove('hidden');
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => {
                bioModal.classList.remove('opacity-0');
            }, 10);
            // Optional: Blur main content
            const main = document.querySelector('main');
            if(main) main.classList.add('blur-sm');
        });

        closeBioBtn.addEventListener('click', () => {
            bioModal.classList.add('opacity-0');
            // Remove blur
            const main = document.querySelector('main');
            if(main) main.classList.remove('blur-sm');
            
            setTimeout(() => {
                bioModal.classList.add('hidden');
            }, 500);
        });
        
        // Close on clicking outside
        bioModal.addEventListener('click', (e) => {
            if (e.target === bioModal || e.target.classList.contains('absolute')) {
                // If clicking the overlay (absolute div) or container
                // Actually the absolute div covers inset-0.
                // Let's check if the click is NOT inside the content div
                // Easier: just attach to the overlay
            }
        });
        
        // Better way to handle outside click given the structure
        const overlay = bioModal.querySelector('.absolute');
        if(overlay) {
            overlay.addEventListener('click', () => {
                closeBioBtn.click();
            });
        }
    }
}

// WhatsApp booking integration
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-whatsapp');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const name = document.getElementById('booking-name')?.value || '';
            const email = document.getElementById('booking-email')?.value || '';
            const message = document.getElementById('booking-message')?.value || '';
            const date = document.getElementById('booking-date')?.value || '';
            const type = document.getElementById('booking-type')?.value || '';
            const venue = document.getElementById('booking-venue')?.value || '';
            const budget = document.getElementById('booking-budget')?.value || '';
            const errorEl = document.getElementById('booking-error');
            if (errorEl) errorEl.classList.add('hidden');

            if (!name.trim() || !message.trim()) {
                if (errorEl) errorEl.classList.remove('hidden');
                return;
            }

            const lines = [
                `Booking Inquiry`,
                `Name: ${name}`,
                `Email: ${email}`,
                type ? `Type: ${type}` : '',
                date ? `Date: ${date}` : '',
                venue ? `Venue: ${venue}` : '',
                budget ? `Budget: ${budget}` : '',
                `Message: ${message}`,
            ].filter(Boolean);
            const composed = lines.join('\n');
            const encoded = encodeURIComponent(composed);
            const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const base = isMobile ? 'whatsapp://send?phone=26878270065&text=' : 'https://wa.me/26878270065?text=';
            const url = `${base}${encoded}`;
            window.open(url, '_blank');
        });
    }
});
