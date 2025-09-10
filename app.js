// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');
const copyIpBtn = document.getElementById('copyIpBtn');
const serverIp = document.getElementById('serverIp');
const copyToast = document.getElementById('copyToast');

// Server status elements
const statusIndicator = document.getElementById('statusIndicator');
const serverStatus = document.getElementById('serverStatus');
const playerCount = document.getElementById('playerCount');
const tpsValue = document.getElementById('tpsValue');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateToggleIcon();
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.updateToggleIcon();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    updateToggleIcon() {
        themeToggle.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Mobile Menu Management
class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        mobileMenuToggle.addEventListener('click', () => {
            this.toggle();
        });

        // Close menu when clicking on nav links
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.updateUI();
    }

    close() {
        this.isOpen = false;
        this.updateUI();
    }

    updateUI() {
        nav.classList.toggle('active', this.isOpen);
        mobileMenuToggle.classList.toggle('active', this.isOpen);
    }
}

// Clipboard Management
class ClipboardManager {
    constructor() {
        this.init();
    }

    init() {
        copyIpBtn.addEventListener('click', () => {
            this.copyServerIP();
        });
    }

    async copyServerIP() {
        const ip = serverIp.textContent;
        
        try {
            await navigator.clipboard.writeText(ip);
            this.showToast('Server IP copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(ip);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast('Server IP copied to clipboard!');
            } else {
                this.showToast('Failed to copy IP address');
            }
        } catch (err) {
            this.showToast('Failed to copy IP address');
        }
        
        document.body.removeChild(textArea);
    }

    showToast(message) {
        copyToast.querySelector('span').textContent = message;
        copyToast.classList.add('show');
        
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 3000);
    }
}

// Server Status Simulator
class ServerStatusSimulator {
    constructor() {
        this.isOnline = true;
        this.basePlayerCount = 47;
        this.baseTPS = 19.8;
        this.init();
    }

    init() {
        this.updateStatus();
        // Update status every 30 seconds
        setInterval(() => {
            this.updateStatus();
        }, 30000);
    }

    updateStatus() {
        // Simulate occasional server issues
        const random = Math.random();
        
        if (random > 0.95) {
            // 5% chance of server being offline
            this.isOnline = false;
        } else {
            this.isOnline = true;
        }

        this.updateServerStatus();
        this.updatePlayerCount();
        this.updateTPS();
    }

    updateServerStatus() {
        if (this.isOnline) {
            statusIndicator.textContent = '🟢';
            serverStatus.textContent = 'Online';
            serverStatus.style.color = 'var(--color-success)';
        } else {
            statusIndicator.textContent = '🔴';
            serverStatus.textContent = 'Offline';
            serverStatus.style.color = 'var(--color-error)';
        }
    }

    updatePlayerCount() {
        if (this.isOnline) {
            // Simulate player count variations
            const variation = Math.floor(Math.random() * 21) - 10; // -10 to +10
            const currentPlayers = Math.max(0, Math.min(100, this.basePlayerCount + variation));
            playerCount.textContent = `${currentPlayers}/100`;
            playerCount.style.color = 'var(--color-primary)';
        } else {
            playerCount.textContent = '0/100';
            playerCount.style.color = 'var(--color-text-secondary)';
        }
    }

    updateTPS() {
        if (this.isOnline) {
            // Simulate TPS variations
            const variation = (Math.random() * 2 - 1) * 0.5; // -0.5 to +0.5
            const currentTPS = Math.max(15.0, Math.min(20.0, this.baseTPS + variation));
            tpsValue.textContent = currentTPS.toFixed(1);
            
            // Color based on TPS performance
            if (currentTPS >= 19.5) {
                tpsValue.style.color = 'var(--color-success)';
            } else if (currentTPS >= 18.0) {
                tpsValue.style.color = 'var(--color-warning)';
            } else {
                tpsValue.style.color = 'var(--color-error)';
            }
        } else {
            tpsValue.textContent = '0.0';
            tpsValue.style.color = 'var(--color-text-secondary)';
        }
    }
}

// Smooth Scroll Navigation
class SmoothScrollNavigation {
    constructor() {
        this.sections = [];
        this.navLinks = [];
        this.init();
    }

    init() {
        // Get all sections and nav links
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        this.navLinks = Array.from(document.querySelectorAll('.nav__link'));

        // Add click listeners to nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            });
        });

        // Add scroll listener for active nav highlighting
        window.addEventListener('scroll', () => {
            this.highlightActiveNav();
        });

        // Initial highlight
        this.highlightActiveNav();
    }

    scrollToSection(section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    highlightActiveNav() {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        const animateElements = document.querySelectorAll(
            '.feature-card, .step, .gym-card, .tournament-card, .support-card'
        );

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function executedFunction(...args) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = Utils.throttle(() => {
    // Any scroll-based functionality can go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new MobileMenu();
    new ClipboardManager();
    new ServerStatusSimulator();
    new SmoothScrollNavigation();
    new AnimationObserver();

    // Add loading complete class for any CSS animations
    document.body.classList.add('loaded');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause any unnecessary updates
        console.log('Page hidden - reducing updates');
    } else {
        // Page is visible - resume normal operation
        console.log('Page visible - resuming normal operation');
    }
});

// Add some CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .step,
    .gym-card,
    .tournament-card,
    .support-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .feature-card.animate-in,
    .step.animate-in,
    .gym-card.animate-in,
    .tournament-card.animate-in,
    .support-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .nav__link.active {
        color: var(--color-primary) !important;
    }

    .nav__link.active::after {
        width: 100% !important;
    }

    @media (prefers-reduced-motion: reduce) {
        .feature-card,
        .step,
        .gym-card,
        .tournament-card,
        .support-card {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;
document.head.appendChild(style);

// Export classes for potential external use
window.CobblemonChampions = {
    ThemeManager,
    MobileMenu,
    ClipboardManager,
    ServerStatusSimulator,
    SmoothScrollNavigation,
    AnimationObserver,
    Utils
};