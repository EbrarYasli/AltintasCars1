// Altintas Cars - Modern JS

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initStatsCounter();
    fetchCarsFromBackend();
    initLoadingReveal();
});

// --- Navigation scroll effect ---
function initNav() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;

    function onScroll() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveLink();
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    });
}

// --- Active nav link ---
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
            current = section.id;
        }
    });

    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// --- Smooth scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const headerH = document.getElementById('header')?.offsetHeight || 0;
            window.scrollTo({
                top: target.offsetTop - headerH,
                behavior: 'smooth'
            });
            closemenu();
        });
    });
}

// --- Scroll animations (Intersection Observer) ---
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Add stagger for car cards
                    const delay = entry.target.style.transitionDelay || '0s';
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in, .car-card, .service-card, .feature, .about-visual, .about-body, .stat-item, .cta-content, .parallax-content').forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        observer.observe(el);
    });
}

// --- Stats counter animation ---
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// --- Mobile menu ---
function initMobileMenu() {
    const navbar = document.getElementById('navbar');

    document.addEventListener('click', e => {
        const menuIcon = document.getElementById('menu-icon');
        if (navbar && !navbar.contains(e.target) && menuIcon && !menuIcon.contains(e.target)) {
            closemenu();
        }
    });
}

function openmenu() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    navbar.classList.add('active');

    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    backdrop.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        z-index: 50;
    `;
    backdrop.addEventListener('click', closemenu);
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
}

function closemenu() {
    const navbar = document.getElementById('navbar');
    const backdrop = document.querySelector('.menu-backdrop');
    if (navbar) navbar.classList.remove('active');
    if (backdrop) backdrop.remove();
    document.body.style.overflow = '';
}

// --- Page load reveal ---
function initLoadingReveal() {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    });
}

// --- Fetch cars from backend ---
async function fetchCarsFromBackend() {
    const carList = document.getElementById('car-list');
    if (!carList) return;

    carList.innerHTML = '<div class="loading">Auto\'s aan het laden...</div>';

    try {
        const res = await fetch('https://altintascars-backend.onrender.com/api/admin/cars/public');
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Fout bij ophalen.');

        if (!data.cars || data.cars.length === 0) {
            carList.innerHTML = '<div class="loading">Geen auto\'s beschikbaar momenteel.</div>';
            return;
        }

        carList.innerHTML = '';
        data.cars.forEach((car, index) => {
            const imageUrl = car.imageUrl.startsWith('http')
                ? car.imageUrl
                : `https://altintascars-backend.onrender.com${car.imageUrl}`;

            const card = document.createElement('div');
            card.className = 'car-card';
            card.style.transitionDelay = `${index * 0.08}s`;
            card.innerHTML = `
                <div class="car-image-container">
                    <a href="${car.instagram}" target="_blank">
                        <img src="${imageUrl}" alt="${car.model}" class="car-image">
                        <div class="car-overlay">
                            <div class="overlay-content">
                                <i class="fas fa-eye"></i>
                                <span>Bekijk Details</span>
                            </div>
                        </div>
                    </a>
                    <div class="price-badge">&euro; ${Number(car.price).toLocaleString('nl-BE')}</div>
                </div>
                <div class="car-info">
                    <h3>${car.model}</h3>
                    <div class="car-specs">
                        <div class="spec-item"><i class="fas fa-road"></i><span>${Number(car.kilometers).toLocaleString('nl-BE')} KM</span></div>
                        <div class="spec-item"><i class="fas fa-calendar"></i><span>${car.year}</span></div>
                        <div class="spec-item"><i class="fas fa-gas-pump"></i><span>${car.fuel}</span></div>
                        <div class="spec-item lez-badge"><i class="fas fa-shield-alt"></i><span>${car.lez}</span></div>
                    </div>
                </div>
            `;
            carList.appendChild(card);
        });

        // Re-init observers for dynamically added cards
        initScrollAnimations();

    } catch (err) {
        console.error(err);
        carList.innerHTML = '<div class="loading">Er zijn momenteel geen auto\'s in aanbod.</div>';
    }
}

// Make menu functions global
window.openmenu = openmenu;
window.closemenu = closemenu;
