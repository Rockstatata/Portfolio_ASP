// Dark Mode Management
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
    
    // Theme toggle handler
    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Reinitialize Vanta effect with new theme
        if (vantaEffect) {
            initVantaBackground();
        }
    });
}

let vantaEffect = null;
let observers = [];
let magneticElements = [];
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Optimized device detection
const deviceInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isLowPerformance: (
        !window.requestAnimationFrame ||
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        isReducedMotion || false
    ),
    supportsWebGL: (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    })()
};

// Optimized CSS injection - DISABLED to prevent conflicts with styles.css
function injectOptimizedStyles() {
    // CSS injection disabled - all styles should be in styles.css file
    console.log('⚠️ CSS injection disabled - using styles.css file instead');
    return;
}

// Optimized magnetic effect with throttling
function initializeMagneticEffect() {
    if (isReducedMotion) return;

    magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
        let rafId = null;
        
        const handleMouseMove = (e) => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                rafId = null;
            });
        };
        
        const handleMouseLeave = () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            element.style.transform = 'translate(0px, 0px)';
        };
        
        element.addEventListener('mousemove', handleMouseMove, { passive: true });
        element.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    });
}

// Optimized Vanta.js initialization
function initializeVantaBackground() {
    if (!deviceInfo.supportsWebGL || deviceInfo.isLowPerformance) {
        initializeFallbackBackground();
        return;
    }

    if (typeof VANTA === 'undefined') {
        setTimeout(initializeVantaBackground, 100);
        return;
    }

    try {
        const isDark = document.documentElement.classList.contains('dark');
        
        vantaEffect = VANTA.NET({
            el: "#vanta-background",
            mouseControls: !deviceInfo.isMobile,
            touchControls: deviceInfo.isMobile,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: deviceInfo.isMobile ? 0.7 : 1.0,
            scaleMobile: 0.6,
            color: isDark ? 0xD14D72 : 0xD14D72, // Using CSS --color-primary: rgb(209, 77, 114)
            backgroundColor: isDark ? 0x1a1625 : 0xffffff, // Using CSS --bg-primary-dark and --bg-primary
            points: deviceInfo.isMobile ? 6 : 10,
            maxDistance: deviceInfo.isMobile ? 18 : 23,
            spacing: deviceInfo.isMobile ? 22 : 18,
            showDots: !deviceInfo.isMobile
        });

        console.log('✅ Vanta.js initialized');
    } catch (error) {
        console.error('❌ Vanta.js error:', error);
        initializeFallbackBackground();
    }
}

// Optimized fallback background
function initializeFallbackBackground() {
    const background = document.getElementById('vanta-background');
    if (!background) return;

    const isDark = document.documentElement.classList.contains('dark');

    background.style.background = isDark
        // Using CSS color palette: --bg-primary-dark and --color-primary
        ? 'linear-gradient(135deg, #1a1625 0%, #2d1c2a 40%, #D14D72 80%, #FFABAB 100%)'
        // Using CSS color palette: --bg-primary and --color-primary  
        : 'linear-gradient(135deg, #ffffff 0%, #fef7f7 40%, #D14D72 80%, #FFABAB 100%)';

    // Optional: subtle glassmorphism overlay
    background.style.backdropFilter = 'blur(8px) saturate(120%)';
    background.style.webkitBackdropFilter = 'blur(8px) saturate(120%)';
    background.style.borderRadius = '1.5rem';
    background.style.boxShadow = isDark
        ? '0 8px 32px 0 rgba(209, 77, 114, 0.25)' // Using CSS --color-primary: rgb(209, 77, 114)
        : '0 8px 32px 0 rgba(209, 77, 114, 0.10)'; // Using CSS --color-primary: rgb(209, 77, 114)

    if (!isReducedMotion) {
        background.style.animation = 'gradientShift 18s ease-in-out infinite';

        const keyframes = `
            @keyframes gradientShift {
                0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                50% { filter: hue-rotate(12deg) brightness(1.06); }
            }
        `;
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
}

// Optimized theme handling
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        
        // Update Vanta background
        if (vantaEffect) {
            vantaEffect.destroy();
            vantaEffect = null;
            setTimeout(initializeVantaBackground, 100);
        } else {
            initializeFallbackBackground();
        }
    });
}

// Optimized mobile menu
function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (!toggle || !menu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Ensure menu starts hidden
    menu.classList.add('hidden');
    
    // Toggle menu visibility
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        
        // Add ARIA attributes for accessibility
        const isOpen = !menu.classList.contains('hidden');
        toggle.setAttribute('aria-expanded', isOpen);
        menu.setAttribute('aria-hidden', !isOpen);
    });
    
    // Close on link click and smooth scroll
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            toggle.focus(); // Return focus to toggle button
        }
    });
    
    // Initial ARIA attributes
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
}

// Optimized smooth scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = 120;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Optimized scroll indicator
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Navigation Active State Management
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (!navLinks.length || !sections.length) return;
    
    // Create intersection observer options
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px', // Trigger when section is 50px from top/bottom
        threshold: 0.3 // Trigger when 30% of section is visible
    };
    
    // Track current active section
    let currentActiveSection = null;
    
    // Update active navigation links
    function updateActiveNav(sectionId) {
        if (currentActiveSection === sectionId) return;
        
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            link.removeAttribute('aria-current');
        });
        
        // Add active class to matching links
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('nav-active');
                link.setAttribute('aria-current', 'page');
            }
        });
        
        currentActiveSection = sectionId;
    }
    
    // Special handling for home section (brand link)
    const brandLink = document.querySelector('.brand-link');
    function updateBrandActive(isHome) {
        if (brandLink) {
            if (isHome) {
                brandLink.classList.add('nav-active');
                brandLink.setAttribute('aria-current', 'page');
            } else {
                brandLink.classList.remove('nav-active');
                brandLink.removeAttribute('aria-current');
            }
        }
    }
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        let visibleSections = [];
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleSections.push({
                    id: entry.target.id,
                    ratio: entry.intersectionRatio,
                    top: entry.boundingClientRect.top
                });
            }
        });
        
        if (visibleSections.length > 0) {
            // Sort by intersection ratio and proximity to center
            visibleSections.sort((a, b) => {
                const aDistance = Math.abs(a.top);
                const bDistance = Math.abs(b.top);
                
                // Prefer section with higher ratio, then closer to top
                if (Math.abs(a.ratio - b.ratio) < 0.1) {
                    return aDistance - bDistance;
                }
                return b.ratio - a.ratio;
            });
            
            const activeSection = visibleSections[0].id;
            
            // Handle home section brand link
            if (activeSection === 'home') {
                updateBrandActive(true);
                updateActiveNav(null); // Clear nav links for home
            } else {
                updateBrandActive(false);
                updateActiveNav(activeSection);
            }
        }
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Handle manual navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                
                // Small delay to let scroll happen first
                setTimeout(() => {
                    if (sectionId === 'home') {
                        updateBrandActive(true);
                        updateActiveNav(null);
                    } else {
                        updateBrandActive(false);
                        updateActiveNav(sectionId);
                    }
                }, 100);
            }
        });
    });
    
    // Handle brand link (home) clicks
    if (brandLink) {
        brandLink.addEventListener('click', () => {
            setTimeout(() => {
                updateBrandActive(true);
                updateActiveNav(null);
            }, 100);
        });
    }
    
    // Store observer for cleanup
    observers.push(observer);
}

// Main initialization - optimized
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing optimized portfolio...');
    
    // Inject styles first
    injectOptimizedStyles();
    
    // Initialize core features
    initDarkMode();
    initializeTheme();
    
    // Initialize background (Vanta or fallback)
    if (deviceInfo.supportsWebGL && !deviceInfo.isLowPerformance && !isReducedMotion) {
        initializeVantaBackground();
    } else {
        initializeFallbackBackground();
    }
    
    // Setup interactions
    setupThemeToggle();
    setupMobileMenu();
    setupSmoothScrolling();
    setupScrollIndicator();
    
    // Initialize navigation active state
    initActiveNavigation();
    
    // Initialize blog scroll functionality
    initBlogScroll();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize magnetic effect after a brief delay
    if (!deviceInfo.isMobile && !isReducedMotion) {
        setTimeout(initializeMagneticEffect, 100);
    }
    
    console.log('✅ Portfolio initialized successfully');
    console.log('📱 Device Info:', deviceInfo);
});

// Cleanup and resize handlers
window.addEventListener('resize', () => {
    if (vantaEffect && vantaEffect.resize) {
        vantaEffect.resize();
    }
});

window.addEventListener('beforeunload', () => {
    if (vantaEffect) {
        vantaEffect.destroy();
    }
});

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            if (fps < 30) {
                console.warn(`⚠️ Low FPS detected: ${fps}fps`);
            }
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorFPS);
    }
    
    requestAnimationFrame(monitorFPS);
}

// Blog Horizontal Scroll Functionality
function initBlogScroll() {
    const blogGrid = document.getElementById('blogGrid');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    
    if (!blogGrid || !scrollLeftBtn || !scrollRightBtn) return;
    
    const cardWidth = 350; // Base card width
    const gap = 32; // 2rem gap
    const scrollAmount = cardWidth + gap;
    
    let currentIndex = 0;
    const maxIndex = Math.max(0, scrollDots.length - 1);
    
    // Update scroll buttons state
    function updateScrollButtons() {
        scrollLeftBtn.disabled = currentIndex <= 0;
        scrollRightBtn.disabled = currentIndex >= maxIndex;
        
        // Update active dot
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Scroll to specific position
    function scrollToPosition(index) {
        const scrollPosition = index * scrollAmount;
        blogGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateScrollButtons();
    }
    
    // Scroll left
    scrollLeftBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            scrollToPosition(currentIndex - 1);
        }
    });
    
    // Scroll right
    scrollRightBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            scrollToPosition(currentIndex + 1);
        }
    });
    
    // Dot navigation
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToPosition(index);
        });
    });
    
    // Handle scroll events to update current position
    let scrollTimeout;
    blogGrid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPosition = blogGrid.scrollLeft;
            const newIndex = Math.round(scrollPosition / scrollAmount);
            if (newIndex !== currentIndex) {
                currentIndex = Math.max(0, Math.min(newIndex, maxIndex));
                updateScrollButtons();
            }
        }, 100);
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startScrollLeft = 0;
    let isDragging = false;
    
    blogGrid.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        startScrollLeft = blogGrid.scrollLeft;
        isDragging = true;
    });
    
    blogGrid.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        blogGrid.scrollLeft = startScrollLeft - walk;
    });
    
    blogGrid.addEventListener('touchend', () => {
        isDragging = false;
        // Snap to nearest card
        const scrollPosition = blogGrid.scrollLeft;
        const newIndex = Math.round(scrollPosition / scrollAmount);
        scrollToPosition(Math.max(0, Math.min(newIndex, maxIndex)));
    });
    
    // Mouse drag support for desktop
    let mouseDown = false;
    let startMouseX = 0;
    let startScrollLeftMouse = 0;
    
    blogGrid.addEventListener('mousedown', (e) => {
        mouseDown = true;
        startMouseX = e.pageX;
        startScrollLeftMouse = blogGrid.scrollLeft;
        blogGrid.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    blogGrid.addEventListener('mouseleave', () => {
        mouseDown = false;
        blogGrid.style.cursor = 'grab';
    });
    
    blogGrid.addEventListener('mouseup', () => {
        mouseDown = false;
        blogGrid.style.cursor = 'grab';
        // Snap to nearest card
        const scrollPosition = blogGrid.scrollLeft;
        const newIndex = Math.round(scrollPosition / scrollAmount);
        scrollToPosition(Math.max(0, Math.min(newIndex, maxIndex)));
    });
    
    blogGrid.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startMouseX) * 2;
        blogGrid.scrollLeft = startScrollLeftMouse - walk;
    });
    
    // Initialize
    updateScrollButtons();
    blogGrid.style.cursor = 'grab';
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('.blog-scroll-container')) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault();
                scrollToPosition(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
                e.preventDefault();
                scrollToPosition(currentIndex + 1);
            }
        }
    });
    
    // Auto-scroll on hover over dots (optional enhancement)
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('mouseenter', () => {
            if (index !== currentIndex) {
                dot.style.transform = 'scale(1.2)';
            }
        });
        
        dot.addEventListener('mouseleave', () => {
            if (index !== currentIndex) {
                dot.style.transform = 'scale(1)';
            }
        });
    });
    
    // Responsive card width adjustment
    function adjustCardWidth() {
        const container = document.querySelector('.blog-scroll-container');
        if (!container) return;
        
        const containerWidth = container.offsetWidth;
        if (containerWidth < 768) {
            blogGrid.style.setProperty('--card-width', '280px');
        } else if (containerWidth < 1024) {
            blogGrid.style.setProperty('--card-width', '300px');
        } else {
            blogGrid.style.setProperty('--card-width', '350px');
        }
    }
    
    // Listen for window resize
    window.addEventListener('resize', adjustCardWidth);
    adjustCardWidth();
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.contact-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 1000;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
        }

        body.dark .notification {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }

        .notification-success {
            border-left: 4px solid #10b981;
        }

        .notification-error {
            border-left: 4px solid #ef4444;
        }

        .notification-info {
            border-left: 4px solid #3b82f6;
        }

        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
        }

        .notification-message {
            color: var(--text-primary);
            font-size: 0.875rem;
            line-height: 1.5;
        }

        body.dark .notification-message {
            color: var(--text-primary-dark);
        }

        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
            margin-left: 1rem;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        body.dark .notification-close {
            color: var(--text-muted-dark);
        }

        .notification-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: var(--text-primary);
        }

        body.dark .notification-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary-dark);
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @media (max-width: 768px) {
            .notification {
                top: 1rem;
                right: 1rem;
                left: 1rem;
                max-width: none;
            }
        }
    `;

    // Add styles to head if not already present
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }

    // Add notification to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-in reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}