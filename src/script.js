import Lenis from 'lenis'

// Force to Top on Reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Redirect to Beranda (index.html) if the page is restarted/refreshed
const perfEntries = performance.getEntriesByType("navigation");
if (perfEntries.length > 0 && perfEntries[0].type === "reload") {
    const isLocalIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    if (!isLocalIndex) {
        window.location.href = 'index.html';
    } else {
        window.scrollTo(0, 0);
    }
} else {
    window.scrollTo(0, 0);
}

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener("DOMContentLoaded", () => {
    // 1. Preloader fade out
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            handleScrollAnimation();
        }, 600);
    }, 800);

    // 2. Header Scroll Effect & Scroll To Top Button
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide scroll to top button
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        handleScrollAnimation(); // trigger check on scroll
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }

    // 3. Mobile Menu Overlay Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. Subtle Intersectional Fade Up
    const fadeElements = document.querySelectorAll('.fade-up');

    function handleScrollAnimation() {
        if (preloader.style.visibility !== 'hidden') return;

        // Use a slightly varied trigger point for a smoother reveal
        const triggerBottom = window.innerHeight * 0.85;

        fadeElements.forEach(el => {
            const elRect = el.getBoundingClientRect();
            // Check if element top is within the viewport threshold
            if (elRect.top < triggerBottom) {
                el.classList.add('visible');
            }
        });
    }

    // Call once initially to catch elements already in viewport
    handleScrollAnimation();

    // 5. Menu Filtering Logic
    const menuLinks = document.querySelectorAll('.menu-nav-links .btn');
    const menuSections = {
        '#section-utama': document.getElementById('section-utama'),
        '#section-pelengkap': document.getElementById('section-pelengkap'),
        '#section-minuman': document.getElementById('section-minuman')
    };

    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = this.getAttribute('href');

                // Update active button styling
                menuLinks.forEach(l => {
                    l.classList.remove('btn-primary');
                    l.classList.add('btn-outline');
                });
                this.classList.remove('btn-outline');
                this.classList.add('btn-primary');

                // Hide all sections, then show the target one
                Object.values(menuSections).forEach(section => {
                    if (section) section.style.display = 'none';
                });

                if (menuSections[target]) {
                    menuSections[target].style.display = 'block';

                    // Re-trigger fade animations for the newly visible section
                    const newFadeElements = menuSections[target].querySelectorAll('.fade-up');
                    newFadeElements.forEach(el => {
                        el.classList.remove('visible');
                    });

                    setTimeout(() => {
                        handleScrollAnimation();
                    }, 50);
                }
            });
        });

        // Ensure only the first section is visible initially (handled in HTML/CSS too, but good to enforce)
        if (menuSections['#section-utama']) menuSections['#section-utama'].style.display = 'block';
        if (menuSections['#section-pelengkap']) menuSections['#section-pelengkap'].style.display = 'none';
        if (menuSections['#section-minuman']) menuSections['#section-minuman'].style.display = 'none';
    }

    // 6. Review Modal Logic
    const openReviewBtn = document.getElementById('openReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewBtn = document.querySelector('.close-modal');
    const reviewForm = document.getElementById('reviewForm');

    if (openReviewBtn && reviewModal) {
        openReviewBtn.addEventListener('click', () => {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            lenis.stop(); // Pause smooth scrolling while modal is open
        });

        const closeModal = () => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
            lenis.start(); // Resume smooth scrolling
        };

        closeReviewBtn.addEventListener('click', closeModal);

        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                closeModal();
            }
        });

        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('reviewName').value;
                const stars = document.getElementById('reviewStars').value;
                const text = document.getElementById('reviewText').value;

                // Simple Profanity / Bad Word Filter
                const forbiddenWords = [
                    'anjing', 'babi', 'monyet', 'bangsat', 'kontol', 'memek',
                    'ngentot', 'perek', 'tai', 'goblok', 'tolol', 'bego',
                    'idiot', 'bajingan', 'kampret', 'asu', 'jancok', 'pantek'
                ];

                const hasBadWord = forbiddenWords.some(word => {
                    const regex = new RegExp(`\\b${word}\\b`, 'i');
                    return regex.test(name) || regex.test(text);
                });

                if (hasBadWord) {
                    alert("Mohon maaf, ulasan Anda terdeteksi mengandung kata-kata yang tidak pantas atau kurang sopan. Mohon gunakan bahasa yang baik.");
                    return; // Stop submission
                }

                let starString = '';
                for (let i = 0; i < stars; i++) starString += '★';

                // Tambahkan ulasan ke dalam grid website tanpa WhatsApp
                const testimonialGrid = document.querySelector('.testimonial-grid');

                // Cek apakah ada kotak 'Kosong' lalu hapus jika ada
                const emptyMsg = testimonialGrid.querySelector('[style*="grid-column: 1 / -1"]');
                if (emptyMsg) {
                    emptyMsg.remove();
                }

                // Buat Elemen Kartu Testimonial Baru
                const newCard = document.createElement('div');
                newCard.classList.add('testimonial-card', 'fade-up', 'visible'); // Langsung visible
                newCard.innerHTML = `
                    <div class="testi-stars">${starString}</div>
                    <p class="testi-text">"${text}"</p>
                    <div class="testi-author">
                        <strong>${name}</strong>
                        <span>Pelanggan</span>
                    </div>
                `;

                // Masukkan kartu ke bagian paling depan list
                testimonialGrid.prepend(newCard);

                // Tutup modal dan reset
                closeModal();
                reviewForm.reset();

                // Pesan Terima Kasih
                setTimeout(() => {
                    alert("Terima kasih! Ulasan Anda berhasil ditambahkan ke halaman.");
                }, 300);
            });
        }
    }

    // 7. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');

        questionBtn.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            // Re-trigger scroll animations after expansion in case new elements enter viewport
            setTimeout(() => {
                handleScrollAnimation();
            }, 400); // 400ms matches css transition duration
        });
    });

    // 8. Live Operational Status
    const statusBadges = document.querySelectorAll('#liveStatusBadge');

    function updateLiveStatus() {
        const now = new Date();
        const hour = now.getHours(); // 0-23

        // Buka jam 17:00 sampai 02:00 (17:00 - 01:59)
        let isOpen = false;
        if (hour >= 17 || hour < 2) {
            isOpen = true;
        }

        statusBadges.forEach(badge => {
            badge.style.display = 'inline-flex';
            badge.classList.remove('checking', 'open', 'closed');
            if (isOpen) {
                badge.classList.add('open');
                badge.textContent = 'BUKA';
            } else {
                badge.classList.add('closed');
                badge.textContent = 'TUTUP';
            }
        });
    }

    if (statusBadges.length > 0) {
        updateLiveStatus();
        // Check every minute
        setInterval(updateLiveStatus, 60000);
    }
});
