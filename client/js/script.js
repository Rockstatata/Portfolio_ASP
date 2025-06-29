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
        isReducedMotion
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

// Optimized CSS injection
function injectOptimizedStyles() {
    const css = `
        /* Core animations - optimized for performance */
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translate3d(0, 30px, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }

        @keyframes float {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -10px, 0) rotate(2deg); }
        }

        @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        /* Component styles */
        .slide-up {
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: var(--delay, 0ms);
            opacity: 0;
        }

        .floating-shape {
            animation: float 6s ease-in-out infinite;
            will-change: transform;
        }

        .floating-shape:nth-child(2) { animation-delay: -2s; }
        .floating-shape:nth-child(3) { animation-delay: -4s; }

        .pulse-dot {
            animation: pulse 2s ease-in-out infinite;
        }

        /* Typography */
        .text-gradient-primary {
            background: linear-gradient(135deg, #374151 0%, #dc2626 50%, #374151 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% 200%;
        }

        .dark .text-gradient-primary {
            background: linear-gradient(135deg, #ffffff 0%, #ef4444 50%, #ffffff 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .text-gradient-secondary {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .highlight-tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-weight: 600;
            margin: 0 0.25rem;
        }

        /* Interactive elements */
        .skill-tag {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 9999px;
            transition: transform 0.2s ease;
            cursor: pointer;
        }

        .dark .skill-tag {
            background: rgba(17, 24, 39, 0.1);
            border-color: rgba(107, 114, 128, 0.2);
        }

        .skill-tag:hover {
            transform: scale(1.05);
        }

        /* Buttons */
        .btn-primary {
            position: relative;
            overflow: hidden;
            padding: 1rem 2rem;
            background: #dc2626;
            color: white;
            font-weight: 600;
            border-radius: 1rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary:hover {
            background: #b91c1c;
            transform: scale(1.05);
            box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
        }

        .btn-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            position: relative;
            z-index: 10;
        }

        .btn-arrow {
            width: 1.25rem;
            height: 1.25rem;
            transition: transform 0.3s ease;
        }

        .btn-primary:hover .btn-arrow {
            transform: translateX(4px);
        }

        .btn-secondary {
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: inherit;
            font-weight: 600;
            border-radius: 1rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .dark .btn-secondary {
            background: rgba(17, 24, 39, 0.1);
            border-color: rgba(107, 114, 128, 0.2);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }

        .dark .btn-secondary:hover {
            background: rgba(17, 24, 39, 0.2);
        }

        .btn-icon {
            width: 1.25rem;
            height: 1.25rem;
        }

        /* Profile section */
        .profile-container {
            position: relative;
            width: 20rem;
            height: 20rem;
        }

        @media (min-width: 1024px) {
            .profile-container {
                width: 24rem;
                height: 24rem;
            }
        }

        .profile-ring {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: linear-gradient(45deg, #ef4444, #8b5cf6, #ef4444);
            animation: spinSlow 20s linear infinite;
            opacity: 0.75;
        }

        .profile-ring-inner {
            position: absolute;
            inset: 4px;
            border-radius: 50%;
            background: white;
        }

        .dark .profile-ring-inner {
            background: #111827;
        }

        .profile-image-container {
            position: absolute;
            inset: 1rem;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
        }

        .dark .profile-image-container {
            background: linear-gradient(135deg, #1f2937, #374151);
        }

        .profile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .profile-image:hover {
            transform: scale(1.1);
        }

        /* Info cards */
        .info-card {
            position: absolute;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.75rem;
            animation: float 4s ease-in-out infinite;
        }

        .dark .info-card {
            background: rgba(17, 24, 39, 0.1);
            border-color: rgba(107, 114, 128, 0.2);
        }

        .info-card-1 {
            top: -1rem;
            right: -1rem;
            animation-delay: 0s;
        }

        .info-card-2 {
            bottom: -1rem;
            left: -1rem;
            animation-delay: -1.5s;
        }

        .info-card-3 {
            top: 50%;
            left: -2rem;
            transform: translateY(-50%);
            animation-delay: -3s;
        }

        .info-card-value {
            font-size: 0.75rem;
            font-weight: 600;
            color: #dc2626;
        }

        .dark .info-card-value {
            color: #ef4444;
        }

        .info-card-2 .info-card-value {
            color: #8b5cf6;
        }

        .info-card-3 .info-card-value {
            color: #10b981;
        }

        .info-card-label {
            font-size: 0.75rem;
            color: #6b7280;
        }

        .dark .info-card-label {
            color: #9ca3af;
        }

        /* Social links */
        .social-links {
            position: absolute;
            bottom: -4rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
        }

        .social-link {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transition: all 0.3s ease;
            color: #374151;
        }

        .dark .social-link {
            background: rgba(17, 24, 39, 0.1);
            border-color: rgba(107, 114, 128, 0.2);
            color: #d1d5db;
        }

        .social-link:hover {
            transform: translateY(-5px) scale(1.1);
            background: rgba(220, 38, 38, 0.2);
            color: #dc2626;
            box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
        }

        .social-icon {
            width: 1.25rem;
            height: 1.25rem;
        }

        /* Scroll indicator */
        .scroll-indicator {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            animation: float 3s ease-in-out infinite;
            cursor: pointer;
        }

        .scroll-text {
            font-size: 0.75rem;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .dark .scroll-text {
            color: #9ca3af;
        }

        .scroll-mouse {
            width: 1.5rem;
            height: 2.5rem;
            border: 2px solid #6b7280;
            border-radius: 9999px;
            display: flex;
            justify-content: center;
        }

        .dark .scroll-mouse {
            border-color: #9ca3af;
        }

        .scroll-wheel {
            width: 0.25rem;
            height: 0.75rem;
            background: #6b7280;
            border-radius: 9999px;
            margin-top: 0.5rem;
            animation: pulse 2s ease-in-out infinite;
        }

        .dark .scroll-wheel {
            background: #9ca3af;
        }

        /* Magnetic effect */
        [data-magnetic] {
            transition: transform 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
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
            color: isDark ? 0x882233 : 0xcc3355,
            backgroundColor: isDark ? 0x111111 : 0xffffff,
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
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)';
    
    if (!isReducedMotion) {
        background.style.animation = 'gradientShift 15s ease infinite';
        
        const keyframes = `
            @keyframes gradientShift {
                0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                50% { filter: hue-rotate(20deg) brightness(1.1); }
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
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
    
    // Close on link click
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
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