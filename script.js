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

// Particles (Sparks & Dust)
class Particle {
    constructor() {
        this.reset();
        // Scatter initially across screen
        this.y = Math.random() * height; 
    }
    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 1.5 + 0.5);
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.life = Math.random() * 0.5 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        // Cinematic colors: mostly glowing sparks (orange/red) and some blue energy
        this.color = Math.random() > 0.75 ? 'rgba(0, 81, 255, ' : 'rgba(230, 0, 40, ';
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Parallax effect with mouse
        const dx = (mouseX - width/2) * 0.005 * this.size;
        this.x -= dx;

        this.life -= 0.002;
        if (this.y < 0 || this.life <= 0) {
            this.reset();
            this.y = height + 10;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * this.life) + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '1)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }
}

const particles = Array.from({ length: 70 }, () => new Particle());

// Swinging Web Lines (Occasional cinematic lines crossing screen)
class WebLine {
    constructor() {
        this.reset();
    }
    reset() {
        this.active = false;
        this.progress = 0;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.ctrlX = 0;
        this.ctrlY = 0;
        this.thickness = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.03 + 0.015;
    }
    trigger() {
        if(this.active) return;
        this.active = true;
        this.progress = 0;
        // Random start and end points across the screen
        this.startX = Math.random() > 0.5 ? -100 : width + 100;
        this.startY = Math.random() * height * 0.5 - 100;
        this.endX = Math.random() * width;
        this.endY = height + 100;
        
        // Bezier curve control point (offset for a swing curve)
        this.ctrlX = width / 2 + (Math.random() - 0.5) * width;
        this.ctrlY = height / 2 + (Math.random() - 0.5) * height;
    }
    update() {
        if(!this.active) return;
        this.progress += this.speed;
        if(this.progress >= 1.5) { // let it fade out completely
            this.active = false;
        }
    }
    draw() {
        if(!this.active) return;
        
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        
        // Calculate current end point based on progress along quadratic curve
        const t = Math.min(this.progress, 1);
        const curX = (1-t)*(1-t)*this.startX + 2*(1-t)*t*this.ctrlX + t*t*this.endX;
        const curY = (1-t)*(1-t)*this.startY + 2*(1-t)*t*this.ctrlY + t*t*this.endY;
        
        ctx.quadraticCurveTo(this.ctrlX, this.ctrlY, curX, curY);
        
        // Fade out as it extends
        const alpha = Math.max(0, 1 - (this.progress > 1 ? (this.progress - 1)*2 : 0));
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
        ctx.lineWidth = this.thickness;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

const webs = [new WebLine(), new WebLine(), new WebLine()];

// Mouse Trail (Web-like energy glow)
const trail = [];
const maxTrail = 20;

function updateTrail() {
    trail.push({x: mouseX, y: mouseY});
    if(trail.length > maxTrail) trail.shift();
}

function drawTrail() {
    if(trail.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for(let i=1; i<trail.length; i++) {
        // smooth curve
        const xc = (trail[i].x + trail[i-1].x) / 2;
        const yc = (trail[i].y + trail[i-1].y) / 2;
        ctx.quadraticCurveTo(trail[i-1].x, trail[i-1].y, xc, yc);
    }
    ctx.lineTo(trail[trail.length-1].x, trail[trail.length-1].y);
    
    ctx.strokeStyle = 'rgba(230, 0, 40, 0.4)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(230, 0, 40, 1)';
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw Particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Randomly trigger web swings (about every 2-3 seconds)
    if(Math.random() < 0.008) {
        const inactiveWeb = webs.find(w => !w.active);
        if(inactiveWeb) inactiveWeb.trigger();
    }
    
    // Draw Webs
    webs.forEach(w => {
        w.update();
        w.draw();
    });
    
    // Draw Mouse Trail
    if(window.innerWidth > 768) {
        updateTrail();
        drawTrail();
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

// --- Contact Form Simulation ---
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Transmission Sent <i class="fa-solid fa-check"></i>';
        btn.style.background = 'var(--primary-blue)';
        btn.style.color = 'var(--text-white)';
        btn.style.boxShadow = 'var(--neon-glow-blue)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style = '';
            form.reset();
        }, 3000);
    });
}
