/* ==========================================================================
   AETHER AI INTERACTIVE LOGIC (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Dom Elements
    const header = document.getElementById('main-header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Testimonial Elements
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const sliderDots = document.querySelectorAll('#slider-dots .dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    // FAQ Elements
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const successMsg = document.getElementById('form-success');
    const formSpinner = document.getElementById('form-spinner');

    /* ==========================================================================
       1. SCROLL-DRIVEN HEADER STYLING
       ========================================================================== */
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Initial call and event listener
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll);

    /* ==========================================================================
       2. MOBILE MENU DRAWER TOGGLE
       ========================================================================== */
    const toggleMobileMenu = () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================================================
       3. SMOOTH NAVIGATION WITH OFFSET ADJUSTMENT
       ========================================================================== */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header.classList.contains('scrolled') 
                    ? 70 
                    : 70; // Use fixed 70px or computed scrolled height
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       4. INTERSECTION OBSERVER FOR ACTIVE LINK INDICATOR
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -60% 0px', // Trigger when section is in header/upper half of screen
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    /* ==========================================================================
       5. THEME TOGGLE (DARK / LIGHT MODE) WITH PERSISTENCE
       ========================================================================== */
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        // Default to dark mode if no setting found
        return 'dark';
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Redraw Lucide Icons (to update moon/sun or style)
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Set initial theme
    setTheme(getSavedTheme());

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    /* ==========================================================================
       6. DYNAMIC MOUSE HOVER EFFECT FOR FEATURE CARDS
       ========================================================================== */
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================================================
       7. TESTIMONIALS SLIDER / CAROUSEL LOGIC
       ========================================================================== */
    let currentSlide = 0;
    let autoSlideInterval;
    
    const showSlide = (index) => {
        // Handle boundary wraps
        if (index >= testimonialCards.length) index = 0;
        if (index < 0) index = testimonialCards.length - 1;
        
        currentSlide = index;
        
        // Update active class on slides
        testimonialCards.forEach((card, idx) => {
            if (idx === currentSlide) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update active class on dots
        sliderDots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000); // Shift every 6 seconds
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    };

    // Button controls
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startAutoSlide(); // Reset auto timer
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startAutoSlide(); // Reset auto timer
    });

    // Dot controls
    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
            showSlide(targetIdx);
            startAutoSlide(); // Reset auto timer
        });
    });

    // Start auto slide
    startAutoSlide();

    // Pause slider on hover
    const sliderContainer = document.querySelector('.testimonials-wrapper');
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    /* ==========================================================================
       8. FAQ ACCORDION LOGIC
       ========================================================================== */
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close other FAQs
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            // Toggle current FAQ
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       9. CONTACT FORM INTERACTIVE SUBMISSION
       ========================================================================== */
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const setError = (element, hasError) => {
        const group = element.parentElement;
        if (hasError) {
            group.classList.add('invalid');
        } else {
            group.classList.remove('invalid');
        }
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Input declarations
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const roleSelect = document.getElementById('form-role');
        const messageInput = document.getElementById('form-message');
        
        // 1. Name Check
        if (nameInput.value.trim() === '') {
            setError(nameInput, true);
            isValid = false;
        } else {
            setError(nameInput, false);
        }
        
        // 2. Email Check
        if (!validateEmail(emailInput.value.trim())) {
            setError(emailInput, true);
            isValid = false;
        } else {
            setError(emailInput, false);
        }
        
        // 3. Role Check
        if (roleSelect.value === '') {
            setError(roleSelect, true);
            isValid = false;
        } else {
            setError(roleSelect, false);
        }
        
        // 4. Message Check
        if (messageInput.value.trim() === '') {
            setError(messageInput, true);
            isValid = false;
        } else {
            setError(messageInput, false);
        }
        
        if (isValid) {
            // Trigger visual processing loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Simulate network return success
                submitBtn.classList.remove('loading');
                successMsg.style.display = 'flex';
                
                // Reset form fields
                contactForm.reset();
                
                // Clear active floating label positioning
                document.querySelectorAll('.form-control').forEach(input => {
                    input.parentElement.classList.remove('invalid');
                });
                
                // Keep success notice visible for 5 seconds
                setTimeout(() => {
                    successMsg.style.animation = 'fadeInUp var(--transition-normal) reverse';
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                        successMsg.style.animation = '';
                        submitBtn.disabled = false;
                    }, 300);
                }, 5000);
                
            }, 1800); // 1.8 second simulated response delay
        }
    });

    // Clear error states on input keypress
    document.querySelectorAll('.form-control').forEach(control => {
        control.addEventListener('input', () => {
            if (control.value.trim() !== '') {
                setError(control, false);
            }
        });
        
        control.addEventListener('blur', () => {
            if (control.value.trim() === '') {
                setError(control, true);
            }
        });
    });
    
    // Clear select control error state
    document.getElementById('form-role').addEventListener('change', (e) => {
        if (e.target.value !== '') {
            setError(e.target, false);
        }
    });
});
