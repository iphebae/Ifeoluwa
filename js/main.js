// Portfolio Main JavaScript
class Portfolio {
    constructor() {
        // DOM Elements
        this.navToggle = document.querySelector('.nav__toggle');
        this.navList = document.querySelector('.nav__list');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.scrollTopBtn = document.getElementById('scrollTop');
        this.currentYearEl = document.getElementById('current-year');
        
        // State
        this.isNavOpen = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set current year
        this.setCurrentYear();
        
        // Event Listeners
        this.setupEventListeners();
        
        // Initialize animations
        this.setupAnimations();
        
        // Initialize smooth scroll
        this.setupSmoothScroll();
        
        // Setup scroll tracking
        this.setupScrollTracking();
        
        // Setup number counters
        this.setupNumberCounters();
    }
    
    setCurrentYear() {
        if (this.currentYearEl) {
            this.currentYearEl.textContent = new Date().getFullYear();
        }
    }
    
    setupEventListeners() {
        // Navigation Toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleNavigation());
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isNavOpen && 
                !this.navToggle.contains(e.target) && 
                !this.navList.contains(e.target)) {
                this.closeNavigation();
            }
        });
        
        // Scroll to Top Button
        if (this.scrollTopBtn) {
            window.addEventListener('scroll', () => this.toggleScrollTopButton());
            this.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
        }
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeNavigation());
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }
    
    toggleNavigation() {
        this.isNavOpen = !this.isNavOpen;
        
        if (this.navToggle) {
            this.navToggle.setAttribute('aria-expanded', this.isNavOpen);
        }
        
        if (this.navList) {
            this.navList.setAttribute('aria-expanded', this.isNavOpen);
            
            if (this.isNavOpen) {
                this.navList.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                this.navList.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    
    closeNavigation() {
        this.isNavOpen = false;
        
        if (this.navToggle) {
            this.navToggle.setAttribute('aria-expanded', false);
        }
        
        if (this.navList) {
            this.navList.setAttribute('aria-expanded', false);
            this.navList.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }
    
    toggleScrollTopButton() {
        if (!this.scrollTopBtn) return;
        
        if (window.scrollY > 300) {
            this.scrollTopBtn.classList.add('visible');
        } else {
            this.scrollTopBtn.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus management for accessibility
        this.scrollTopBtn.blur();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    setupScrollTracking() {
        // Active nav link tracking
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNavLink(id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    setActiveNavLink(id) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        fadeElements.forEach(el => fadeObserver.observe(el));
    }
    
    setupNumberCounters() {
        const statNumbers = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statNumbers.forEach(number => counterObserver.observe(number));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    handleKeyboardNavigation(e) {
        // Close navigation on Escape key
        if (e.key === 'Escape' && this.isNavOpen) {
            this.closeNavigation();
        }
        
        // Trap focus in mobile navigation when open
        if (e.key === 'Tab' && this.isNavOpen && this.navList) {
            const focusableElements = this.navList.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
    
    // Analytics tracking (optional)
    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Custom tracking logic
        console.log(`Event: ${eventName}`, data);
    }
}

// Initialize Portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    // Expose to global scope if needed
    window.portfolio = portfolio;
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => {
                console.log('ServiceWorker registration successful');
            },
            err => {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}