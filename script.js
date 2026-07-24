/**
 * Cinematic Marvel-Inspired Interactions & Canvas FX
 */

// --- Custom Cursor & Spotlight ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');
const clickables = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-badge');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let dotX = mouseX;
let dotY = mouseY;
let glowX = mouseX;
let glowY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update spotlight CSS variables
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
});

// Smooth cursor follow animation using requestAnimationFrame
function animateCursor() {
    // Ease factor
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    if(cursorDot) cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    if(cursorGlow) cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    
    requestAnimationFrame(animateCursor);
}
if(window.innerWidth > 768) {
    animateCursor();
}

// Hover states for cursor
clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});


// --- Canvas FX: Sparks, Dust, and Web Swings ---
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle Network (Nodes & Connections)
class Node {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.fill();
    }
}

const nodes = Array.from({ length: 60 }, () => new Node());

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    nodes.forEach(node => {
        node.update();
        node.draw();
    });
    
    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / 150)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Connection to mouse
        if (window.innerWidth > 768) {
            const dx = nodes[i].x - mouseX;
            const dy = nodes[i].y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 * (1 - dist / 200)})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateCanvas);
}
animateCanvas();


// --- 3D Card Tilt Effect ---
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if(window.innerWidth <= 768) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Increase intensity of tilt
        const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// --- Intersection Observer for Cinematic Reveals ---
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only reveal once
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// --- Hero Parallax (Mouse Move) ---
const heroImage = document.querySelector('.hero-image');
const heroBgText = document.querySelector('.hero-bg-text');

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;

        if (heroImage) {
            heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
        }
        if (heroBgText) {
            heroBgText.style.transform = `translate(calc(-50% + ${x * 1.5}px), calc(-50% + ${y * 1.5}px))`;
        }
    }
});

// --- Navigation Scroll State ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Active Nav Link Highlight ---
const sections = document.querySelectorAll('section');
const navItemsList = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });

    navItemsList.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// --- Mobile Menu Toggle ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
        document.body.style.overflow = 'hidden';
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    }
});

navItemsList.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    });
});

// --- Contact Form Handling ---
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.style.opacity = '0.8';
        btn.disabled = true;

        const formData = new FormData(form);

        fetch("https://formsubmit.co/ajax/kumbharshreyas07@gmail.com", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                btn.innerHTML = 'Message Sent <i class="fa-solid fa-check"></i>';
                btn.style.background = 'var(--primary-accent)';
                btn.style.color = 'var(--text-white)';
                btn.style.boxShadow = 'var(--glow-secondary)';
                form.reset();
            } else {
                throw new Error("Failed to send message");
            }
        })
        .catch(error => {
            console.error(error);
            btn.innerHTML = 'Error! Try Again <i class="fa-solid fa-xmark"></i>';
            btn.style.background = '#ef4444'; // Red error color
            btn.style.color = 'var(--text-white)';
        })
        .finally(() => {
            btn.style.opacity = '1';
            btn.disabled = false;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style = '';
            }, 4000);
        });
    });
}
