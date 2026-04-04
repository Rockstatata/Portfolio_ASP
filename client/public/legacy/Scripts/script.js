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
            initializeVantaBackground();
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

const PORTFOLIO_CONTENT_ENDPOINT = '/api/portfolio/content';
const PORTFOLIO_BLOG_CONTENT_ENDPOINT = '/api/portfolio/blog';
const PORTFOLIO_CONTACT_ENDPOINT = '/api/portfolio/contact';

const projectTagColorClasses = [
    'tag-blue',
    'tag-orange',
    'tag-teal',
    'tag-red',
    'tag-purple',
    'tag-gray',
    'tag-cyan',
    'tag-green'
];

const aboutStrengthPalette = [
    'text-blue-700',
    'text-cyan-700',
    'text-pink-700',
    'text-green-700',
    'text-purple-700',
    'text-orange-700'
];

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeSectionKey(value) {
    return String(value ?? '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ');
}

function splitList(value) {
    return String(value ?? '')
        .split(/[,;\n|]/)
        .map(item => item.trim())
        .filter(Boolean);
}

function truncateText(value, maxLength) {
    const text = String(value ?? '').trim();
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
}

function formatDisplayDate(value) {
    if (!value) return 'Recent';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return String(value);
    }

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function getSkillCategoryIconPath(categoryName) {
    const normalized = String(categoryName ?? '').toLowerCase();

    if (normalized.includes('frontend') || normalized.includes('ui')) {
        return '<path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 7.996c0-1.107.896-2.004 2.004-2.004s2.004.897 2.004 2.004S11.111 10 10.004 10 8 9.103 8 7.996zM14 18H6v-1.5l2-2 1.5 1.5L12 13l2 2v3z"/>';
    }

    if (normalized.includes('backend') || normalized.includes('server')) {
        return '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>';
    }

    if (normalized.includes('tool') || normalized.includes('devops')) {
        return '<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>';
    }

    return '<path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V6.5L12 6.5L11 6.5V7.5C11 8.1 10.6 8.5 10 8.5S9 8.1 9 7.5V6.5L3 7V9C3 10.1 3.9 11 5 11V17C5 18.1 5.9 19 7 19H9C10.1 19 11 18.1 11 17V11C11.4 11 11.7 10.8 11.9 10.4L12 10.5L12.1 10.4C12.3 10.8 12.6 11 13 11V17C13 18.1 13.9 19 15 19H17C18.1 19 19 18.1 19 17V11C20.1 11 21 10.1 21 9Z"/>';
}

function getSkillIconMarkup(skill) {
    const icon = String(skill?.skill_icon ?? '').trim();

    if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/')) {
        return `<img src="${escapeHtml(icon)}" alt="${escapeHtml(skill.skill_name || 'Skill')}" class="skill-icon">`;
    }

    if (icon.startsWith('devicon-')) {
        return `<i class="${escapeHtml(icon)} skill-icon"></i>`;
    }

    return '<svg class="skill-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
}

function getBlogCategoryClassName(category, index) {
    const normalized = String(category ?? '').toLowerCase();

    if (normalized.includes('programming') || normalized.includes('code')) return 'programming';
    if (normalized.includes('frontend') || normalized.includes('ui')) return 'frontend';
    if (normalized.includes('development') || normalized.includes('dev')) return 'development';
    if (normalized.includes('cloud') || normalized.includes('database')) return 'cloud';

    return ['programming', 'frontend', 'development', 'cloud'][index % 4];
}

function getHomeSectionValue(homeSections, candidates, fallback = '') {
    const normalizedCandidates = candidates.map(normalizeSectionKey);
    const matched = (homeSections || []).find(section =>
        normalizedCandidates.includes(normalizeSectionKey(section.section_name))
    );

    return matched?.content?.trim() || fallback;
}

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
if (true) {
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

    contactForm.addEventListener('submit', async function (e) {
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

        try {
            const response = await fetch(PORTFOLIO_CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok || payload.ok === false) {
                const message = payload?.error || 'Failed to send message. Please try again.';
                throw new Error(message);
            }

            contactForm.reset();
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        } catch (error) {
            console.error('Contact form submission failed:', error);
            showNotification(error?.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
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

function renderHomeSectionContent(homeSections) {
        if (!Array.isArray(homeSections) || homeSections.length === 0) return;

        const statusText = getHomeSectionValue(homeSections, ['status', 'availability']);
        const fullName = getHomeSectionValue(homeSections, ['full name', 'name', 'hero name']);
        const tagline = getHomeSectionValue(homeSections, ['tagline', 'hero title', 'hero', 'headline']);
        const description = getHomeSectionValue(homeSections, ['description', 'hero subtitle', 'hero description', 'intro']);
        const specializations = getHomeSectionValue(homeSections, ['skill tags', 'skills', 'specializations', 'focus areas']);

        const statusElement = document.querySelector('.status-text');
        if (statusElement && statusText) {
                statusElement.textContent = statusText;
        }

        if (fullName) {
                const heading = document.querySelector('.main-heading');
                if (heading) {
                        const nameParts = fullName.split(/\s+/).filter(Boolean);
                        const first = nameParts[0] || '';
                        const second = nameParts[1] || '';
                        const remaining = nameParts.slice(2).join(' ');

                        heading.innerHTML = `
                                <div class="name-line">
                                    <span class="slide-up text-gradient-primary" style="--delay: 0ms">${escapeHtml(first || fullName)}</span>
                                </div>
                                <div class="name-line">
                                    <span class="slide-up name-middle" style="--delay: 100ms">${escapeHtml(second || '')}</span>
                                </div>
                                <div class="name-line">
                                    <span class="slide-up text-gradient-secondary" style="--delay: 200ms">${escapeHtml(remaining || '')}</span>
                                </div>
                        `;
                }

                    const brandText = document.querySelector('.brand-text');
                    if (brandText) {
                        brandText.textContent = fullName;
                    }

                    const footerLink = document.querySelector('.footer-link');
                    if (footerLink) {
                        footerLink.textContent = fullName;
                    }

                    const profileImage = document.querySelector('#home .profile-image');
                    if (profileImage) {
                        profileImage.setAttribute('alt', fullName);
                    }
        }

        const taglineElement = document.querySelector('.tagline');
        if (taglineElement && tagline) {
                taglineElement.textContent = tagline;
        }

        const descriptionElement = document.querySelector('.description');
        if (descriptionElement && description) {
                descriptionElement.textContent = description;
        }

        const specializationTags = splitList(specializations);
        if (specializationTags.length > 0) {
                const tagContainer = document.querySelector('.role-section .skill-tags');
                if (tagContainer) {
                        tagContainer.innerHTML = specializationTags.slice(0, 6)
                                .map((tag) => `<span class="skill-tag">${escapeHtml(tag)}</span>`)
                                .join('');
                }
        }
}

function renderAboutSectionContent(aboutSections) {
        if (!Array.isArray(aboutSections) || aboutSections.length === 0) return;

        const primarySection = aboutSections.find(section =>
                !String(section.section_type || '').toLowerCase().startsWith('strength:')
        );

        if (primarySection) {
                const titleElement = document.querySelector('#about .bento-card-large .card-title');
                const textElement = document.querySelector('#about .bento-card-large .card-text');
            const detailElements = Array.from(document.querySelectorAll('#about .bento-card-large .text-large'));
            const contentParagraphs = String(primarySection.content || '')
                .split(/\n+/)
                .map((part) => part.trim())
                .filter(Boolean);

                if (titleElement && primarySection.title) {
                        titleElement.textContent = primarySection.title;
                }

            if (textElement) {
                const mainText = contentParagraphs[0] || String(primarySection.content || '').trim();
                textElement.textContent = mainText;
                textElement.style.display = mainText ? '' : 'none';
                }

            const detailValues = [];
            if (primarySection.subtitle) {
                detailValues.push(String(primarySection.subtitle).trim());
            }
            detailValues.push(...contentParagraphs.slice(1));

            detailElements.forEach((element, index) => {
                const value = detailValues[index] || '';
                element.textContent = value;
                element.style.display = value ? '' : 'none';
            });

            if (detailValues.length === 0 && detailElements.length > 0) {
                detailElements[0].style.display = 'none';
                }
        }

        const strengths = [];
        const research = [];
        const goals = [];
        const learning = [];

        aboutSections.forEach((section) => {
                const sectionType = String(section.section_type || '').toLowerCase();
                if (!sectionType.startsWith('strength:')) return;

                if (sectionType.includes('research')) {
                        research.push(section);
                        return;
                }

                if (sectionType.includes('future_goal') || sectionType.includes('goal')) {
                        goals.push(section);
                        return;
                }

                if (sectionType.includes('current_focus') || sectionType.includes('learning')) {
                        learning.push(section);
                        return;
                }

                strengths.push(section);
        });

        if (strengths.length > 0) {
                const container = document.querySelector('#about .skills-grid.skills-mb-4');
                if (container) {
                        container.innerHTML = strengths.slice(0, 8)
                                .map((item, index) => {
                                        const isWide = index % 3 === 0;
                                        const colorClass = aboutStrengthPalette[index % aboutStrengthPalette.length];
                                        return `
                                                <div class="skill-item ${isWide ? 'skill-item-wide' : ''}">
                                                    <div class="skill-name ${colorClass}">${escapeHtml(item.title || item.content || 'Skill')}</div>
                                                </div>
                                        `;
                                })
                                .join('');
                }
        }

        if (research.length > 0) {
                const container = document.querySelector('#about .research-grid');
                if (container) {
                        container.innerHTML = research.slice(0, 8)
                                .map((item, index) => {
                                        const isWide = index % 3 === 0;
                                        const colorClass = aboutStrengthPalette[index % aboutStrengthPalette.length];
                                        return `
                                                <div class="research-item ${isWide ? 'research-item-wide' : ''}">
                                                    <span class="research-name ${colorClass}">${escapeHtml(item.title || item.content || 'Research')}</span>
                                                </div>
                                        `;
                                })
                                .join('');
                }
        }

        if (goals.length > 0) {
                const container = document.querySelector('#about .goals-list');
                if (container) {
                        const dotVariants = ['', 'goal-dot-teal', 'goal-dot-purple', 'goal-dot-blue'];
                        const textVariants = ['', 'goal-text-teal', 'goal-text-purple', 'goal-text-blue'];

                        container.innerHTML = goals.slice(0, 8)
                                .map((item, index) => `
                                        <div class="goal-item">
                                            <span class="goal-dot ${dotVariants[index % dotVariants.length]}"></span>
                                            <span class="goal-text ${textVariants[index % textVariants.length]}">${escapeHtml(item.title || item.content || 'Goal')}</span>
                                        </div>
                                `)
                                .join('');
                }
        }

        if (learning.length > 0) {
                const container = document.querySelector('#about .learning-grid');
                if (container) {
                        container.innerHTML = learning.slice(0, 8)
                                .map((item, index) => {
                                        const colorClass = aboutStrengthPalette[index % aboutStrengthPalette.length];
                                        return `
                                                <div class="learning-item">
                                                    <div class="learning-title ${colorClass}">${escapeHtml(item.title || 'Learning')}</div>
                                                    <div class="learning-desc">${escapeHtml(item.content || '')}</div>
                                                </div>
                                        `;
                                })
                                .join('');
                }
        }
}

function renderTimelineContent(timelineItems) {
        if (!Array.isArray(timelineItems) || timelineItems.length === 0) return;

        const timelineContainer = document.querySelector('#timeline .timeline-content');
        if (!timelineContainer) return;

        const rows = timelineItems.slice(0, 12);
        timelineContainer.innerHTML = `
                <div class="timeline-line"></div>
                ${rows.map((item, index) => {
                        const yearRange = item.year_range || '';
                        const status = String(item.status || '').toLowerCase();
                        const current = /current|present|ongoing|in progress/.test(`${yearRange} ${status}`);

                        return `
                                <div class="timeline-item" data-position="${index % 2 === 0 ? 'top' : 'bottom'}">
                                    <div class="timeline-dot ${current ? 'timeline-dot-current' : ''}"></div>
                                    <div class="timeline-card">
                                        <div class="timeline-year">${escapeHtml(yearRange || 'Timeline')}</div>
                                        <div class="timeline-title">${escapeHtml(item.title || '')}</div>
                                        <div class="timeline-location">${escapeHtml(item.location || '')}</div>
                                        <div class="timeline-degree">${escapeHtml(item.description || item.type || '')}</div>
                                    </div>
                                </div>
                        `;
                }).join('')}
        `;
}

function renderSkillsContent(skills) {
        if (!Array.isArray(skills) || skills.length === 0) return;

        const skillsContainer = document.querySelector('#skills .skills-categories-grid');
        if (!skillsContainer) return;

        const grouped = skills.reduce((acc, skill) => {
                const category = String(skill.category || 'General').trim() || 'General';
                if (!acc[category]) {
                        acc[category] = [];
                }
                acc[category].push(skill);
                return acc;
        }, {});

        const categories = Object.entries(grouped);
        if (categories.length === 0) return;

        const accentClasses = ['text-accent-red', 'text-accent-orange', 'text-accent-red', 'text-accent-orange'];

        skillsContainer.innerHTML = categories.map(([categoryName, categorySkills], categoryIndex) => `
                <div class="glass-card skills-category">
                    <div class="card-content">
                        <div class="card-header">
                            <h3 class="card-title ${accentClasses[categoryIndex % accentClasses.length]}">${escapeHtml(categoryName)}</h3>
                            <div class="category-icon">
                                <svg class="skill-category-icon" fill="currentColor" viewBox="0 0 24 24">
                                    ${getSkillCategoryIconPath(categoryName)}
                                </svg>
                            </div>
                        </div>
                        <div class="skills-grid">
                            ${categorySkills.slice(0, 12).map(skill => `
                                    <div class="skill-tag">
                                        ${getSkillIconMarkup(skill)}
                                        <span>${escapeHtml(skill.skill_name || '')}</span>
                                    </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
        `).join('');
}

function renderProjectsContent(projects) {
        if (!Array.isArray(projects) || projects.length === 0) return;

        const projectsContainer = document.querySelector('#projects .projects-grid');
        if (!projectsContainer) return;

        projectsContainer.innerHTML = projects.slice(0, 12).map((project, index) => {
                const imageUrl = project.image_url || `https://picsum.photos/600/300?random=${encodeURIComponent(project.id || String(index + 1))}`;
                const status = String(project.status || '').trim();
                const showStatus = status && !['active', 'completed'].includes(status.toLowerCase());
                const technologies = splitList(project.technologies).slice(0, 8);
                const sourceLink = String(project.github_url || '').trim();
                const demoLink = String(project.demo_url || '').trim();

                return `
                        <article class="glass-card project-card">
                            <div class="project-image">
                                <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(project.title || 'Project')}" class="project-img" />
                                ${showStatus ? `<div class="project-badge">${escapeHtml(status)}</div>` : ''}
                            </div>
                            <div class="project-content">
                                <h3 class="project-title">${escapeHtml(project.title || 'Untitled Project')}</h3>
                                <div class="project-meta">
                                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span class="project-year">${escapeHtml(project.project_year || new Date().getFullYear())}</span>
                                </div>
                                <p class="project-desc">${escapeHtml(truncateText(project.description || '', 120))}</p>
                                ${technologies.length > 0 ? `
                                        <div class="project-tags">
                                            ${technologies.map((tech, tagIndex) => `<span class="tag ${projectTagColorClasses[tagIndex % projectTagColorClasses.length]}">${escapeHtml(tech)}</span>`).join('')}
                                        </div>
                                ` : ''}
                                <div class="project-actions">
                                    ${sourceLink ? `
                                            <a class="btn btn-outline" href="${escapeHtml(sourceLink)}" target="_blank" rel="noopener noreferrer">
                                                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                                </svg>
                                                Source
                                            </a>
                                    ` : ''}
                                    ${demoLink ? `
                                            <a class="btn btn-outline" href="${escapeHtml(demoLink)}" target="_blank" rel="noopener noreferrer">
                                                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                    <polyline points="15,3 21,3 21,9"/>
                                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                                </svg>
                                                Demo
                                            </a>
                                    ` : ''}
                                    ${!sourceLink && !demoLink ? `
                                            <a class="btn btn-outline" href="#" onclick="return false;" style="opacity: 0.6; cursor: not-allowed;">
                                                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                    <polyline points="15,3 21,3 21,9"/>
                                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                                </svg>
                                                Coming Soon
                                            </a>
                                    ` : ''}
                                </div>
                            </div>
                        </article>
                `;
        }).join('');
}

function renderExperiencesContent(experiences) {
        if (!Array.isArray(experiences) || experiences.length === 0) return;

        const experienceContainer = document.querySelector('#experience .projects-grid');
        if (!experienceContainer) return;

        experienceContainer.innerHTML = experiences.slice(0, 12).map((experience) => {
                const responsibilityTags = splitList(
                        String(experience.responsibilities || '')
                                .replace(/\r/g, '\n')
                                .replace(/\n+/g, ',')
                ).slice(0, 8);

                return `
                        <article class="glass-card project-card">
                            <div class="project-content">
                                <h3 class="project-title">${escapeHtml(experience.company || 'Experience')}</h3>
                                <div class="project-meta">
                                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span class="project-year">${escapeHtml(experience.position || '')}</span>
                                </div>
                                <p class="project-desc">${escapeHtml(experience.duration || 'Duration not specified')}</p>
                                ${experience.description ? `<p class="project-desc">${escapeHtml(experience.description)}</p>` : ''}
                                ${responsibilityTags.length > 0 ? `
                                        <div class="project-tags">
                                            ${responsibilityTags.map((tag, index) => {
                                                    const shortTag = truncateText(tag, 28);
                                                    return `<span class="tag ${projectTagColorClasses[index % projectTagColorClasses.length]}">${escapeHtml(shortTag)}</span>`;
                                            }).join('')}
                                        </div>
                                ` : ''}
                            </div>
                        </article>
                `;
        }).join('');
}

function renderBlogsContent(blogs) {
        if (!Array.isArray(blogs) || blogs.length === 0) return;

        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        const visibleBlogs = blogs.slice(0, 12);
        blogGrid.innerHTML = visibleBlogs.map((post) => {
                const categories = splitList(post.categories).slice(0, 2);
                const tags = splitList(post.tags).slice(0, 4);
                const title = truncateText(post.title || 'Blog Post', 80);
                const excerptSource = post.excerpt || String(post.content || '').replace(/<[^>]*>/g, ' ');
                const excerpt = truncateText(excerptSource, 120);
                const readTime = Number(post.read_time) > 0 ? Number(post.read_time) : 3;

                return `
                        <article class="blog-card glass-card" data-blog-id="${escapeHtml(post.id || '')}" style="cursor: pointer;">
                            <div class="blog-content">
                                ${categories.length > 0 ? `
                                        <div class="blog-categories">
                                            ${categories.map((category, index) => `<span class="blog-category ${getBlogCategoryClassName(category, index)}">${escapeHtml(category)}</span>`).join('')}
                                        </div>
                                ` : ''}

                                ${tags.length > 0 ? `
                                        <div class="blog-tags">
                                            ${tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
                                        </div>
                                ` : ''}

                                <h3 class="blog-post-title">${escapeHtml(title)}</h3>
                                <p class="blog-excerpt">${escapeHtml(excerpt)}</p>

                                <div class="blog-meta">
                                    <span class="blog-date">${escapeHtml(formatDisplayDate(post.published_at || post.created_at))}</span>
                                    <span class="blog-separator">•</span>
                                    <span class="blog-read-time">${escapeHtml(readTime)} min read</span>
                                    <div class="blog-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M7 17l9.2-9.2M17 17V7H7"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </article>
                `;
        }).join('');

        const dotsContainer = document.querySelector('.scroll-indicator-dots');
        if (dotsContainer) {
                dotsContainer.innerHTML = visibleBlogs.map((_, index) => `
                        <div class="scroll-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                `).join('');
        }
}

function getSocialIconSvg(platform) {
        const normalized = String(platform || '').toLowerCase();

        if (normalized.includes('github')) {
                return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
        }

        if (normalized.includes('linkedin')) {
                return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
        }

        if (normalized.includes('email') || normalized.includes('mail')) {
                return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 4.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>';
        }

        if (normalized.includes('twitter') || normalized === 'x') {
                return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/></svg>';
        }

        if (normalized.includes('instagram')) {
                return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
        }

        if (normalized.includes('facebook')) {
                return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
        }

        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14L21 3"/><path d="M21 3h-6"/><path d="M21 3v6"/><path d="M14 10v11H3V10h11z"/></svg>';
}

function renderSocialLinksContent(socialLinks) {
        if (!Array.isArray(socialLinks) || socialLinks.length === 0) return;

        const validLinks = socialLinks.filter(link => String(link.url || '').trim().length > 0);
        if (validLinks.length === 0) return;

        const heroContainer = document.querySelector('#home .profile-display .social-links');
        if (heroContainer) {
                heroContainer.innerHTML = validLinks.slice(0, 6).map((link) => {
                        const platform = String(link.platform || 'Social');
                        const url = String(link.url || '').trim();
                        const isEmail = url.startsWith('mailto:') || platform.toLowerCase().includes('mail');
                const iconMarkup = getSocialIconSvg(platform).replace('<svg ', '<svg class="social-icon" ');

                        return `
                                <a href="${escapeHtml(url)}" ${isEmail ? '' : 'target="_blank" rel="noopener noreferrer"'} class="social-link" data-magnetic aria-label="${escapeHtml(platform)} Profile">
                      ${iconMarkup}
                                </a>
                        `;
                }).join('');
        }

        const contactContainer = document.querySelector('.social-links-contact');
        if (contactContainer) {
                contactContainer.innerHTML = validLinks.slice(0, 8).map((link) => {
                        const platform = String(link.platform || 'Social');
                        const url = String(link.url || '').trim();
                        const isEmail = url.startsWith('mailto:') || platform.toLowerCase().includes('mail');

                        return `
                                <a href="${escapeHtml(url)}" ${isEmail ? '' : 'target="_blank" rel="noopener noreferrer"'} class="social-link-contact" aria-label="${escapeHtml(platform)}">
                                    ${getSocialIconSvg(platform)}
                                </a>
                        `;
                }).join('');
        }
}

function renderPortfolioContent(data) {
        if (!data || typeof data !== 'object') return;

        renderHomeSectionContent(data.homeSections || []);
        renderAboutSectionContent(data.aboutSections || []);
        renderTimelineContent(data.timeline || []);
        renderSkillsContent(data.skills || []);
        renderProjectsContent(data.projects || []);
        renderExperiencesContent(data.experiences || []);
        renderBlogsContent(data.blogs || []);
        renderSocialLinksContent(data.socialLinks || []);
}

async function loadPortfolioContent() {
        const response = await fetch(PORTFOLIO_CONTENT_ENDPOINT, {
                cache: 'no-store'
        });

        if (!response.ok) {
                throw new Error(`Failed to load portfolio data (${response.status})`);
        }

        const payload = await response.json();
        if (!payload || payload.ok !== true || !payload.data) {
                throw new Error(payload?.error || 'Invalid portfolio response payload.');
        }

        renderPortfolioContent(payload.data);
}

// Blog Modal Functionality
function initBlogModal() {
    const modal = document.getElementById('blogModal');
    const modalBackdrop = document.getElementById('blogModalBackdrop');
    const modalClose = document.getElementById('blogModalClose');
    const modalTitle = document.getElementById('blogModalTitle');
    const modalCategories = document.getElementById('modalCategories');
    const modalTags = document.getElementById('modalTags');
    const modalDate = document.getElementById('modalDate');
    const modalReadTime = document.getElementById('modalReadTime');
    const modalExcerpt = document.getElementById('modalExcerpt');
    const modalArticle = document.getElementById('modalArticle');
    const modalComingSoon = document.getElementById('modalComingSoon');
    const modalBody = document.querySelector('.blog-modal-body');
    const scrollProgress = document.getElementById('scrollProgress');

    // Action buttons
    const shareBtn = document.getElementById('shareBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const likeBtn = document.getElementById('likeBtn');
    const notifyMeBtn = document.getElementById('notifyMeBtn');

    if (!modal) return;

    let currentBlogData = null;

    // Open modal function
    function openModal(blogData) {
        currentBlogData = blogData;
        populateModal(blogData);

        // Show modal
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');

        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        modalClose.focus();

        // Update scroll progress initially
        updateScrollProgress();

        // If we have an id and no preloaded fullContent, fetch directly from API (Content column)
        if (blogData.id && (!blogData.fullContent || blogData.fullContent.trim().length === 0)) {
            // show a small loading indicator in the modal area
            if (modalComingSoon) {
                modalComingSoon.style.display = 'block';
                modalComingSoon.textContent = 'Loading article...';
            }
            if (modalArticle) modalArticle.style.display = 'none';

            fetch(`${PORTFOLIO_BLOG_CONTENT_ENDPOINT}/${encodeURIComponent(blogData.id)}`, {
                method: 'GET',
                cache: 'no-store'
            })
                .then(res => res.json())
                .then(payload => {
                    if (payload && payload.ok) {
                        const contentHtml = payload.content || '';
                        // Insert content directly (Content column holds HTML)
                        if (modalArticle) {
                            modalArticle.innerHTML = contentHtml;
                            modalArticle.style.display = 'block';
                        }
                        if (modalComingSoon) modalComingSoon.style.display = 'none';
                    } else {
                        if (modalComingSoon) modalComingSoon.textContent = payload && payload.error ? payload.error : 'Article not available.';
                        if (modalArticle) modalArticle.style.display = 'none';
                    }
                    updateScrollProgress();
                })
                .catch(err => {
                    console.error('Error fetching blog content:', err);
                    if (modalComingSoon) modalComingSoon.textContent = 'Failed to load article. Please try again later.';
                    showNotification('Unable to load full article from API.', 'error');
                });
        }
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            currentBlogData = null;
        }, 300);
    }

    // Populate modal with blog data
    function populateModal(blogData) {
        // Set title
        modalTitle.textContent = blogData.title || 'Blog Post';

        // Set categories
        modalCategories.innerHTML = '';
        if (blogData.categories && blogData.categories.length > 0) {
            blogData.categories.forEach(category => {
                const categorySpan = document.createElement('span');
                categorySpan.className = `blog-category ${getCategoryClass(category)}`;
                categorySpan.textContent = category;
                modalCategories.appendChild(categorySpan);
            });
        }

        // Set tags
        modalTags.innerHTML = '';
        if (blogData.tags && blogData.tags.length > 0) {
            blogData.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'blog-tag';
                tagSpan.textContent = tag;
                modalTags.appendChild(tagSpan);
            });
        }

        // Set date and read time
        modalDate.textContent = blogData.date || 'Recent';
        modalReadTime.textContent = `${blogData.readTime || 3} min read`;

        // Set excerpt
        modalExcerpt.textContent = blogData.excerpt || blogData.content || 'This is an excerpt of the blog post...';

        // Set content or show coming soon
        if (blogData.fullContent && blogData.fullContent.trim().length > 0) {
            // If the server returned HTML in the Content column, insert it directly
            modalArticle.innerHTML = blogData.fullContent;
            modalArticle.style.display = 'block';
            if (modalComingSoon) modalComingSoon.style.display = 'none';
        } else {
            // We'll fetch by id in openModal when available. If no id, show placeholder.
            if (!blogData.id) {
                modalArticle.style.display = 'none';
                if (modalComingSoon) {
                    modalComingSoon.style.display = 'block';
                    modalComingSoon.textContent = 'This article will be available soon.';
                }
            } else {
                modalArticle.style.display = 'none';
                if (modalComingSoon) modalComingSoon.style.display = 'none';
            }
        }
    }

    // Get category class based on category name
    function getCategoryClass(category) {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('programming') || categoryLower.includes('code')) return 'programming';
        if (categoryLower.includes('frontend') || categoryLower.includes('ui')) return 'frontend';
        if (categoryLower.includes('development') || categoryLower.includes('dev')) return 'development';
        if (categoryLower.includes('cloud') || categoryLower.includes('database')) return 'cloud';
        return 'programming'; // default
    }

    // Format blog content
    function formatBlogContent(content) {
        // Basic formatting - you can enhance this based on your needs
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/^\s*/, '<p>')
            .replace(/\s*$/, '</p>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    // Update scroll progress
    function updateScrollProgress() {
        if (!modalBody) return;

        const scrollTop = modalBody.scrollTop;
        const scrollHeight = modalBody.scrollHeight - modalBody.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }

    // Extract blog data from card element
    function extractBlogData(cardElement) {
        const titleElement = cardElement.querySelector('.blog-post-title');
        const excerptElement = cardElement.querySelector('.blog-excerpt');
        const dateElement = cardElement.querySelector('.blog-date');
        const readTimeElement = cardElement.querySelector('.blog-read-time');
        const categoryElements = cardElement.querySelectorAll('.blog-category');
        const tagElements = cardElement.querySelectorAll('.blog-tag');

        // Try to find blog id in data attribute or href query string
        let blogId = cardElement.dataset.blogId || cardElement.getAttribute('data-blog-id') || '';
        if (!blogId) {
            const link = cardElement.querySelector('a[href*="id="]');
            if (link) {
                const href = link.getAttribute('href');
                const match = href.match(/[?&]id=([^&]+)/);
                if (match) blogId = decodeURIComponent(match[1]);
            }
        }

        return {
            id: blogId || '',
            title: titleElement ? titleElement.textContent.trim() : 'Blog Post',
            excerpt: excerptElement ? excerptElement.textContent.trim() : '',
            date: dateElement ? dateElement.textContent.trim() : '',
            readTime: readTimeElement ? readTimeElement.textContent.replace(' min read', '') : '3',
            categories: Array.from(categoryElements).map(el => el.textContent.trim()),
            tags: Array.from(tagElements).map(el => el.textContent.trim()),
            fullContent: '' // not preloaded; will be fetched from server
        };
    }

    // Event listeners for opening modal
    document.addEventListener('click', (e) => {
        // Check if clicked element is a blog arrow or blog card
        const blogArrow = e.target.closest('.blog-arrow');
        const blogCard = e.target.closest('.blog-card');

        if (blogArrow && blogCard) {
            e.preventDefault();
            e.stopPropagation();

            const blogData = extractBlogData(blogCard);
            openModal(blogData);
        }
    });

    // Event listeners for closing modal
    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Scroll progress tracking
    modalBody?.addEventListener('scroll', updateScrollProgress);

    // Action button handlers
    shareBtn?.addEventListener('click', () => {
        if (currentBlogData && navigator.share) {
            navigator.share({
                title: currentBlogData.title,
                text: currentBlogData.excerpt,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                showNotification('Unable to copy link', 'error');
            });
        }
    });

    bookmarkBtn?.addEventListener('click', () => {
        const isBookmarked = bookmarkBtn.classList.contains('active');

        if (isBookmarked) {
            bookmarkBtn.classList.remove('active');
            showNotification('Bookmark removed', 'info');
        } else {
            bookmarkBtn.classList.add('active');
            showNotification('Article bookmarked!', 'success');
        }

        // Here you would typically save to localStorage or send to server
        if (currentBlogData) {
            const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
            if (isBookmarked) {
                const index = bookmarks.findIndex(b => b.title === currentBlogData.title);
                if (index > -1) bookmarks.splice(index, 1);
            } else {
                bookmarks.push(currentBlogData);
            }
            localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
        }
    });

    likeBtn?.addEventListener('click', () => {
        const isLiked = likeBtn.classList.contains('active');

        if (isLiked) {
            likeBtn.classList.remove('active');
            showNotification('Like removed', 'info');
        } else {
            likeBtn.classList.add('active');
            showNotification('Thanks for the like! ❤️', 'success');
        }

        // Here you would typically send to server
        // For demo purposes, just store in localStorage
        if (currentBlogData) {
            const likes = JSON.parse(localStorage.getItem('blogLikes') || '[]');
            if (isLiked) {
                const index = likes.findIndex(l => l.title === currentBlogData.title);
                if (index > -1) likes.splice(index, 1);
            } else {
                likes.push(currentBlogData);
            }
            localStorage.setItem('blogLikes', JSON.stringify(likes));
        }
    });

    notifyMeBtn?.addEventListener('click', () => {
        // Show a simple form or just notify for now
        const email = prompt('Enter your email to be notified when this article is published:');
        if (email && validateEmail(email)) {
            showNotification('Thank you! We\'ll notify you when this article is published.', 'success');
            // Here you would send the email to your server
        } else if (email) {
            showNotification('Please enter a valid email address.', 'error');
        }
    });

    // Load saved states
    function loadSavedStates() {
        if (!currentBlogData) return;

        const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
        const likes = JSON.parse(localStorage.getItem('blogLikes') || '[]');

        const isBookmarked = bookmarks.some(b => b.title === currentBlogData.title);
        const isLiked = likes.some(l => l.title === currentBlogData.title);

        if (isBookmarked) bookmarkBtn?.classList.add('active');
        if (isLiked) likeBtn?.classList.add('active');
    }

    // Validate email function
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Initialize saved states when modal opens
    const originalOpenModal = openModal;
    openModal = function (blogData) {
        originalOpenModal(blogData);
        setTimeout(loadSavedStates, 100);
    };

    console.log('✅ Blog Modal initialized');
}

let hasInitializedPortfolio = false;

function initializePortfolioApp() {
    if (hasInitializedPortfolio) return;
    hasInitializedPortfolio = true;

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

    // Load dynamic content, then initialize blog interactions on rendered cards
    loadPortfolioContent()
        .catch((error) => {
            console.warn('Falling back to static legacy content:', error);
        })
        .finally(() => {
            initBlogScroll();
            initBlogModal();

            if (!deviceInfo.isMobile && !isReducedMotion) {
                setTimeout(initializeMagneticEffect, 100);
            }
        });

    // Initialize contact form
    initContactForm();

    console.log('✅ Portfolio initialized successfully');
    console.log('📱 Device Info:', deviceInfo);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolioApp, { once: true });
} else {
    initializePortfolioApp();
}

window.initializePortfolioApp = initializePortfolioApp;