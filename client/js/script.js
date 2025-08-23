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