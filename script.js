gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading sequence
    const loadingTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    // Initial loading animation
    loadingTimeline
        .from('nav', {
            y: -100,
            opacity: 0,
            duration: 1
        })
        .from('.profile-image-container', {
            scale: 0,
            rotation: 720,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
        }, "-=0.5")
        .from('.greeting', {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=1")
        .from('.name', {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.6")
        .from('.role-text', {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.6");

    // Continuous floating animation for profile image
    gsap.to('.profile-image-container', {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    // Mouse movement parallax effect
    const profileImage = document.querySelector('.profile-image-container');
    const textContent = document.querySelector('.text-content');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX - window.innerWidth / 2) / 30;
        const yPos = (clientY - window.innerHeight / 2) / 30;

        gsap.to(profileImage, {
            x: xPos,
            y: yPos,
            duration: 1,
            ease: "power2.out"
        });

        gsap.to(textContent, {
            x: -xPos / 3,
            y: -yPos / 3,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Text scramble effect
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_______';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-text">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Initialize text scramble with roles
    const roles = [
        "Full Stack Developer",
        "Web Designer",
        "Problem Solver",
        "Creative Coder"
    ];

    const roleElement = document.querySelector('.role-text p');
    const fx = new TextScramble(roleElement);
    let counter = 0;

    const nextRole = () => {
        fx.setText(roles[counter]).then(() => {
            setTimeout(nextRole, 2000);
        });
        counter = (counter + 1) % roles.length;
    };

    nextRole();

    // Scroll-triggered animations for other sections
    gsap.utils.toArray('.section:not(#home)').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
                markers: false
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
});

// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...

    // Spotlight and ripple effect
    const spotlight = document.querySelector('.spotlight');
    let mouseX = 0;
    let mouseY = 0;
    let spotlightX = 0;
    let spotlightY = 0;
    
    // Show spotlight when mouse enters the window
    document.addEventListener('mouseenter', () => {
        spotlight.style.opacity = '1';
    });

    // Hide spotlight when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
    });

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth spotlight movement
    function animateSpotlight() {
        // Calculate the distance between current position and target (mouse position)
        const dx = mouseX - spotlightX;
        const dy = mouseY - spotlightY;

        // Move spotlight position 10% closer to mouse position each frame
        spotlightX += dx * 0.1;
        spotlightY += dy * 0.1;

        // Apply the position with a slight lag effect
        spotlight.style.left = `${spotlightX}px`;
        spotlight.style.top = `${spotlightY}px`;

        // Create subtle size variation based on movement
        const speed = Math.sqrt(dx * dx + dy * dy);
        const scale = 1 + Math.min(speed * 0.001, 0.3);
        spotlight.style.transform = `translate(-50%, -50%) scale(${scale})`;

        requestAnimationFrame(animateSpotlight);
    }

    animateSpotlight();

    // Add ripple effect on click
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.querySelector('.background-animation').appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 1000);
    });

    // Optional: Add ripple effect on mouse movement with delay
    let lastRippleTime = 0;
    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastRippleTime > 100) { // Adjust this value to control ripple frequency
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            ripple.style.animation = 'ripple 2s ease-out forwards';
            document.querySelector('.background-animation').appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 2000);
            lastRippleTime = currentTime;
        }
    });
});

// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', () => {
    // Split text animation
    const splitText = new SplitType('.split-text', { types: 'words,chars' });
    
    gsap.from(splitText.chars, {
        scrollTrigger: {
            trigger: '.about-heading',
            start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power4.out'
    });

    // Bio text animation
    gsap.from('.bio-text', {
        scrollTrigger: {
            trigger: '.about-text',
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    // Skill bars animation
    gsap.utils.toArray('.skill-bar').forEach(bar => {
        const progress = bar.querySelector('.progress');
        const level = bar.dataset.level;
        
        gsap.to(progress, {
            scrollTrigger: {
                trigger: bar,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            width: `${level}%`,
            duration: 1.5,
            ease: "power4.out"
        });
    });

    // Skill items hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.1,
                duration: 0.3,
                backgroundColor: 'rgba(100, 255, 218, 0.1)',
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Background gradient follow mouse
    const aboutSection = document.querySelector('.about-section');
    aboutSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = aboutSection.getBoundingClientRect();
        const x = (clientX - left) / width * 100;
        const y = (clientY - top) / height * 100;
        
        gsap.to('.about-section::before', {
            left: `${x}%`,
            top: `${y}%`,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    let lastScroll = 0;
    let scrollTimeout;

    // Function to handle scroll events
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Always show navbar at the top of the page
        if (currentScroll < 50) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
            return;
        }

        // Handle scroll direction
        if (currentScroll > lastScroll && currentScroll > 50) {
            // Scrolling down
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else {
            // Scrolling up
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    }

    // Throttle scroll events
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });

    // Handle initial state
    nav.classList.add('scroll-up');

    // Fix for mobile devices
    window.addEventListener('touchmove', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });

    // Reset navbar visibility when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get navbar height for offset calculation
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight;

    // Add click event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section id from href
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Calculate the position to scroll to
            const targetPosition = targetSection.offsetTop - navbarHeight;

            // Smooth scroll to target position
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});

document.querySelector('.contact-form').addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('.submit-btn');
    const formStatus = this.querySelector('.form-status');
    
    // Change button text while submitting
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('loading');
    
    // Form submission feedback
    this.addEventListener('formspree:submit', () => {
        submitBtn.textContent = 'Send Message';
        submitBtn.classList.remove('loading');
        formStatus.textContent = 'Message sent successfully!';
        formStatus.className = 'form-status success';
        this.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
        }, 5000);
    });
    
    this.addEventListener('formspree:error', () => {
        submitBtn.textContent = 'Send Message';
        submitBtn.classList.remove('loading');
        formStatus.textContent = 'Error sending message. Please try again.';
        formStatus.className = 'form-status error';
    });
});
