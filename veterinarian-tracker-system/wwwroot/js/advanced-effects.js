/**
 * Advanced Effects JavaScript
 * Adds cutting-edge visual effects and interactions to the VetTracker application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all advanced effects
    initializeParallaxEffects();
    initializeScrollEffects();
    initializeHoverEffects();
    initializeTextEffects();
    initializeBackgroundEffects();
    initializeAdvancedButtons();
    initializeNotifications();
});

/**
 * Initialize parallax effects for elements with the parallax class
 */
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    // Simple parallax on scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.3;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Mouse move parallax for hero sections
    const heroSections = document.querySelectorAll('.hero-section');
    
    heroSections.forEach(section => {
        const heroContent = section.querySelector('.hero-content');
        const heroImage = section.querySelector('.hero-image');
        
        if (!heroContent || !heroImage) return;
        
        section.addEventListener('mousemove', function(e) {
            const x = e.clientX;
            const y = e.clientY;
            
            const sectionRect = section.getBoundingClientRect();
            const centerX = sectionRect.left + sectionRect.width / 2;
            const centerY = sectionRect.top + sectionRect.height / 2;
            
            const deltaX = (x - centerX) / 30;
            const deltaY = (y - centerY) / 30;
            
            heroContent.style.transform = `translate(${-deltaX / 2}px, ${-deltaY / 2}px)`;
            heroImage.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        section.addEventListener('mouseleave', function() {
            heroContent.style.transform = 'translate(0, 0)';
            heroImage.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Initialize scroll-based animations and effects
 */
function initializeScrollEffects() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (revealElements.length === 0) return;
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-reveal-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('revealed');
                }, delay);
                
                revealObserver.unobserve(element);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Progress bar for long pages
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    });
}

/**
 * Initialize advanced hover effects
 */
function initializeHoverEffects() {
    // 3D card tilt effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            const rotateX = (mouseY / (cardRect.height / 2)) * -8;
            const rotateY = (mouseX / (cardRect.width / 2)) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Add highlight effect
            const glare = card.querySelector('.card-glare') || document.createElement('div');
            if (!card.querySelector('.card-glare')) {
                glare.className = 'card-glare';
                card.appendChild(glare);
            }
            
            const glareX = (mouseX / cardRect.width) * 100 + 50;
            const glareY = (mouseY / cardRect.height) * 100 + 50;
            
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            
            const glare = card.querySelector('.card-glare');
            if (glare) {
                glare.style.background = 'none';
            }
        });
    });
    
    // Magnetic buttons
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const btnRect = button.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;
            
            const mouseX = e.clientX - btnCenterX;
            const mouseY = e.clientY - btnCenterY;
            
            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
            const maxDistance = Math.max(btnRect.width, btnRect.height) / 2;
            
            if (distance < maxDistance * 1.5) {
                const moveX = mouseX * 0.3;
                const moveY = mouseY * 0.3;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Initialize advanced text effects
 */
function initializeTextEffects() {
    // Text scramble effect
    const textScrambles = document.querySelectorAll('.text-scramble');
    
    textScrambles.forEach(element => {
        const originalText = element.textContent;
        const chars = '!<>-_\\ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let frame = 0;
        let frameRate = 20;
        let frameCount = 20;
        
        const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
        
        const update = () => {
            let output = '';
            const complete = frame >= frameCount;
            
            for (let i = 0; i < originalText.length; i++) {
                if (originalText[i] === ' ') {
                    output += ' ';
                    continue;
                }
                
                if (frame >= frameCount) {
                    output += originalText[i];
                    continue;
                }
                
                if (i < frame / frameCount * originalText.length) {
                    output += originalText[i];
                } else {
                    output += randomChar();
                }
            }
            
            element.textContent = output;
            
            if (!complete) {
                frame++;
                setTimeout(update, 1000 / frameRate);
            }
        };
        
        // Start the effect when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    frame = 0;
                    update();
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    // Gradient text animation
    const gradientTexts = document.querySelectorAll('.text-gradient');
    
    gradientTexts.forEach(element => {
        const colors = element.getAttribute('data-colors') || '45deg, #0072ff, #00c6ff, #0072ff';
        element.style.backgroundImage = `linear-gradient(${colors})`;
        element.style.backgroundSize = '200% auto';
        element.style.color = 'transparent';
        element.style.backgroundClip = 'text';
        element.style.webkitBackgroundClip = 'text';
        element.style.animation = 'gradient-shift 3s ease infinite';
    });
}

/**
 * Initialize advanced background effects
 */
function initializeBackgroundEffects() {
    // Animated gradient backgrounds
    const gradientBackgrounds = document.querySelectorAll('.bg-gradient-animated');
    
    gradientBackgrounds.forEach(element => {
        const colors = element.getAttribute('data-colors') || '45deg, #0072ff, #00c6ff, #0072ff';
        element.style.backgroundImage = `linear-gradient(${colors})`;
        element.style.backgroundSize = '200% 200%';
        element.style.animation = 'gradient-shift 15s ease infinite';
    });
    
    // Particle background for hero sections
    const particleSections = document.querySelectorAll('.particle-background');
    
    particleSections.forEach(section => {
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        section.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
            initParticles();
        };
        
        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor(canvas.width * canvas.height / 10000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }
        };
        
        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get theme colors
            const isDarkMode = document.body.classList.contains('dark-mode');
            const particleColor = isDarkMode ? '255, 255, 255' : '0, 0, 0';
            
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity * 0.2})`;
                ctx.fill();
                
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX = -particle.speedX;
                }
                
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY = -particle.speedY;
                }
            });
            
            // Draw connections between nearby particles
            particles.forEach((particle, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const otherParticle = particles[j];
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${particleColor}, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                }
            });
            
            requestAnimationFrame(drawParticles);
        };
        
        resizeCanvas();
        drawParticles();
        
        window.addEventListener('resize', resizeCanvas);
        
        // Clean up event listener when section is removed
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.removedNodes) {
                    mutation.removedNodes.forEach(node => {
                        if (node === section || node.contains(section)) {
                            window.removeEventListener('resize', resizeCanvas);
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

/**
 * Initialize advanced button effects
 */
function initializeAdvancedButtons() {
    // Ripple effect for buttons
    const rippleButtons = document.querySelectorAll('.btn-ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Glowing buttons
    const glowButtons = document.querySelectorAll('.btn-glow');
    
    glowButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--glow-x', `${x}px`);
            button.style.setProperty('--glow-y', `${y}px`);
        });
    });
    
    // Morphing buttons
    const morphButtons = document.querySelectorAll('.btn-morph');
    
    morphButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (button.classList.contains('loading')) return;
            
            const originalText = button.textContent;
            const originalWidth = button.offsetWidth;
            const originalHeight = button.offsetHeight;
            
            button.classList.add('loading');
            button.style.width = `${originalWidth}px`;
            button.style.height = `${originalHeight}px`;
            button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            
            // Simulate loading
            setTimeout(() => {
                button.classList.remove('loading');
                button.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            }, 2000);
        });
    });
}

/**
 * Initialize advanced notification system
 */
function initializeNotifications() {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Add global function to show notifications
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = document.createElement('i');
        icon.className = `fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} notification-icon`;
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        notification.appendChild(icon);
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        
        notificationContainer.appendChild(notification);
        
        // Add visible class after a small delay for animation
        setTimeout(() => {
            notification.classList.add('notification-visible');
        }, 10);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.classList.add('notification-hiding');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }
            }, duration);
        }
        
        return notification;
    };
    
    // Add notification styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            }
            
            .notification {
                display: flex;
                align-items: center;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                background: white;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                overflow: hidden;
            }
            
            .notification::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 5px;
            }
            
            .notification-visible {
                transform: translateX(0);
            }
            
            .notification-hiding {
                transform: translateX(120%);
            }
            
            .notification-icon {
                margin-right: 15px;
                font-size: 1.2rem;
            }
            
            .notification-content {
                flex: 1;
                font-size: 0.9rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.5;
                transition: opacity 0.2s;
                padding: 0;
                margin-left: 10px;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            .notification-success {
                border-left: 5px solid #28a745;
            }
            
            .notification-success .notification-icon {
                color: #28a745;
            }
            
            .notification-error {
                border-left: 5px solid #dc3545;
            }
            
            .notification-error .notification-icon {
                color: #dc3545;
            }
            
            .notification-warning {
                border-left: 5px solid #ffc107;
            }
            
            .notification-warning .notification-icon {
                color: #ffc107;
            }
            
            .notification-info {
                border-left: 5px solid #17a2b8;
            }
            
            .notification-info .notification-icon {
                color: #17a2b8;
            }
            
            @media (max-width: 576px) {
                .notification-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add demo notification if URL has notification parameter
    if (window.location.search.includes('notification=')) {
        const notificationParam = new URLSearchParams(window.location.search).get('notification');
        const typeParam = new URLSearchParams(window.location.search).get('type') || 'info';
        
        if (notificationParam) {
            setTimeout(() => {
                window.showNotification(decodeURIComponent(notificationParam), typeParam);
            }, 1000);
        }
    }
}