// Modern Altintas Cars JavaScript - Complete Version

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeaderEffects();
    initSmoothScrolling();
    initScrollAnimations();
    initMobileMenu();
    initCarCardAnimations();
    initPriceAnimations();
    addLoadingScreen();
    initParallaxEffect();
    initEasterEggs();
});

// Header scroll effects
function initHeaderEffects() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add shadow class when scrolling
        if (currentScrollY > 50) {
            header.classList.add('shadow');
        } else {
            header.classList.remove('shadow');
        }

        // Update active navigation link
        updateActiveNavLink();
        
        lastScrollY = currentScrollY;
    }

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSectionId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const contactLinks = document.querySelectorAll('.link-grid a[href^="#"]');
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('href'));
        });
    });

    // Contact section links
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('href'));
        });
    });

    // Smooth scroll buttons
    const buttons = document.querySelectorAll('.btn[href^="#"]');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('href'));
        });
    });
}

function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        closemenu();
    }
}

// Scroll-triggered animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger delay for car cards
                if (entry.target.classList.contains('car-card')) {
                    const cards = document.querySelectorAll('.car-card');
                    cards.forEach((card, index) => {
                        if (card === entry.target) {
                            setTimeout(() => {
                                card.style.animationDelay = `${index * 0.1}s`;
                            }, index * 100);
                        }
                    });
                }
            }
        });
    }, observerOptions);

    // Observe fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Observe car cards
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        observer.observe(card);
    });
}

// Enhanced mobile menu functionality
function initMobileMenu() {
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const closeIcon = navbar?.querySelector('.fa-xmark');

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closemenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target) && 
            menuIcon && !menuIcon.contains(e.target)) {
            closemenu();
        }
    });

    // Prevent menu close when clicking inside menu
    if (navbar) {
        navbar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Mobile menu functions
function openmenu() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    navbar.classList.add('active');
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        z-index: 1;
        animation: fadeIn 0.3s ease;
    `;
    
    backdrop.addEventListener('click', closemenu);
    document.body.appendChild(backdrop);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closemenu() {
    const navbar = document.getElementById('navbar');
    const backdrop = document.querySelector('.menu-backdrop');
    
    if (navbar) {
        navbar.classList.remove('active');
    }
    
    if (backdrop) {
        backdrop.remove();
    }
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Car card animations and interactions
function initCarCardAnimations() {
    const carCards = document.querySelectorAll('.car-card');
    
    carCards.forEach(card => {
        // Add hover effect with slight tilt
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg)';
        });

        // Add click effect for mobile
        card.addEventListener('touchstart', () => {
            card.style.transform = 'translateY(-5px) scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
}

// Price animation on scroll
function initPriceAnimations() {
    const priceElements = document.querySelectorAll('.price-badge');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const priceElement = entry.target;
                const finalPrice = priceElement.textContent;
                const numericPrice = parseInt(finalPrice.replace(/[^\d]/g, ''));
                
                // Animate price counting up
                let currentPrice = 0;
                const increment = numericPrice / 50;
                const timer = setInterval(() => {
                    currentPrice += increment;
                    if (currentPrice >= numericPrice) {
                        currentPrice = numericPrice;
                        clearInterval(timer);
                        priceElement.textContent = finalPrice; // Restore original format
                    } else {
                        priceElement.textContent = `€ ${Math.floor(currentPrice).toLocaleString()}`;
                    }
                }, 30);
                
                observer.unobserve(priceElement);
            }
        });
    }, {
        threshold: 0.5
    });
    
    priceElements.forEach(element => {
        observer.observe(element);
    });
}

// Loading screen
function addLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <span>Altintas</span> Cars
            </div>
            <div class="loading-spinner"></div>
            <p>Loading automotive excellence...</p>
        </div>
    `;
    
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        .loading-content {
            text-align: center;
            color: #ffffff;
        }
        
        .loading-logo {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
        }
        
        .loading-logo span {
            background: linear-gradient(135deg, #D90429 0%, #FF1744 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(217, 4, 41, 0.3);
            border-top: 3px solid #D90429;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        .loading-content p {
            color: #a0a0a0;
            font-size: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(loadingStyle);
    document.body.prepend(loadingScreen);
    
    // Remove loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
                if (loadingStyle.parentNode) {
                    loadingStyle.remove();
                }
            }, 500);
        }, 800);
    });
}

// Parallax effect for hero background
function initParallaxEffect() {
    const hero = document.querySelector('.home');
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        hero.style.backgroundPosition = `center ${rate}px`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Statistics counter animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const finalValue = statElement.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                        statElement.textContent = finalValue; // Restore original format
                    } else {
                        let displayValue = Math.floor(currentValue);
                        if (isPercentage) {
                            statElement.textContent = `${displayValue}%`;
                        } else if (isPlus) {
                            statElement.textContent = `${displayValue}+`;
                        } else {
                            statElement.textContent = displayValue;
                        }
                    }
                }, 40);
                
                observer.unobserve(statElement);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Initialize stats counter
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initStatsCounter();
    }, 1000);
});

// Easter eggs and special effects
function initEasterEggs() {
    // Konami code for car animation
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            triggerCarBounceAnimation();
            konamiCode = [];
        }
    });

    // Double click logo for special effect
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 2) {
                    triggerLogoAnimation();
                }
                clickCount = 0;
            }, 300);
        });
    }
}

function triggerCarBounceAnimation() {
    const cars = document.querySelectorAll('.car-card');
    cars.forEach((car, index) => {
        setTimeout(() => {
            car.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                car.style.animation = '';
            }, 600);
        }, index * 100);
    });
    
    // Show message
    showEasterEggMessage('🚗 Car Dance Activated! 🚗');
}

function triggerLogoAnimation() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.animation = 'spin 1s ease-in-out';
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000);
    }
    
    showEasterEggMessage('🏁 Altintas Cars Turbo Mode! 🏁');
}

function showEasterEggMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #D90429 0%, #FF1744 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-weight: 600;
        font-size: 1.2rem;
        z-index: 10000;
        animation: fadeInOut 3s ease;
        box-shadow: 0 10px 30px rgba(217, 4, 41, 0.5);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Add bounce animation styles
const easterEggStyles = document.createElement('style');
easterEggStyles.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-30px,0);
        }
        70% {
            transform: translate3d(0,-15px,0);
        }
        90% {
            transform: translate3d(0,-4px,0);
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(easterEggStyles);

// Performance optimization: Debounce scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Console message for developers
console.log(`
🚗 Welcome to Altintas Cars!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your reliable partner in automotive excellence
Built with modern web technologies

🎮 Try the Konami code: ↑↑↓↓←→←→BA for car animation!
🖱️ Double-click the logo for a surprise!

📧 Contact: info@altintascars.be
🌐 Website: https://altintascars.be
📍 Location: Hees 112, 3920 Lommel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Make functions globally available
window.openmenu = openmenu;
window.closemenu = closemenu;

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth reveal animation to page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});