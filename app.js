// WAIT FOR DOM TO FULLY LOAD
document.addEventListener('DOMContentLoaded', () => {
    initEnvelope();
    initParticles();
    initMusicPlayer();
    initWishes();
});

/* ==========================================================================
   1. ENVELOPE INTERACTION & INTRO FLOW
   ========================================================================== */
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const overlay = document.getElementById('envelopeOverlay');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');

    if (!envelope || !overlay) return;

    envelope.addEventListener('click', () => {
        // Trigger envelope open animations in CSS
        envelope.classList.add('open');
        
        // Autoplay background music immediately (user interaction is registered)
        setTimeout(() => {
            playBackgroundMusic();
        }, 800);

        // Fade out overlay after letter slides up
        setTimeout(() => {
            overlay.classList.add('fade-out');
        }, 1800);

        // Switch active views after fade out completes
        setTimeout(() => {
            overlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            
            // Fire an initial celebratory full-screen confetti burst!
            celebrateBirthday();
        }, 2900);
    });
}

/* ==========================================================================
   2. FLOATING BACKGROUND PARTICLES (CANVAS)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const colors = [
        'rgba(183, 110, 121, 0.4)', // Rose Gold
        'rgba(212, 175, 55, 0.35)', // Gold
        'rgba(243, 229, 171, 0.3)', // Light Gold
        'rgba(253, 246, 236, 0.25)' // Cream
    ];

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse interactive tracking
    let mouse = { x: null, y: null, radius: 100 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.reset();
            // Randomize starting Y to distribute them smoothly at load
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 8 + 3; // Particle size
            this.speedY = Math.random() * 0.7 + 0.3; // Upward speed
            this.speedX = Math.random() * 0.4 - 0.2; // Left/Right drift
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.3;
            this.type = Math.random() > 0.6 ? 'heart' : 'circle'; // 40% hearts, 60% circles
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = Math.random() * 0.02 - 0.01;
            this.swayRange = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.y -= this.speedY;
            this.angle += this.angleSpeed;
            this.x += Math.sin(this.angle) * this.swayRange * 0.3 + this.speedX;

            // Repel from mouse slightly
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = dx / distance;
                    let directionY = dy / distance;
                    this.x += directionX * force * 3;
                    this.y += directionY * force * 3;
                }
            }

            // Reset when going off screen
            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            if (this.type === 'heart') {
                // Draw a beautiful vector heart
                ctx.beginPath();
                let x = this.x;
                let y = this.y;
                let size = this.size;
                ctx.moveTo(x, y + size / 4);
                ctx.quadraticCurveTo(x, y, x + size / 2, y);
                ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
                ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
                ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 4);
                ctx.closePath();
                ctx.fill();
            } else {
                // Draw a glowing circle/sparkle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize particle array
    function init() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000); // Density adjustment
        for (let i = 0; i < Math.min(numberOfParticles, 80); i++) {
            particles.push(new Particle());
        }
    }
    init();

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Handle resize adjustments
    window.addEventListener('resize', () => {
        init();
    });
}

/* ==========================================================================
   3. ELEGANT FLOATING AUDIO PLAYER
   ========================================================================== */
function initMusicPlayer() {
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    
    if (!bgMusic || !musicPlayer || !musicToggleBtn) return;

    // Toggle button icons
    const musicIcon = musicToggleBtn.querySelector('.music-icon');
    const pauseIcon = musicToggleBtn.querySelector('.pause-icon');

    // Controls player play/pause state
    function togglePlay() {
        if (bgMusic.paused) {
            playBackgroundMusic();
        } else {
            pauseBackgroundMusic();
        }
    }

    musicToggleBtn.addEventListener('click', togglePlay);
}

function playBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    if (!bgMusic) return;

    bgMusic.play()
        .then(() => {
            musicPlayer.classList.remove('paused');
            const musicToggleBtn = document.getElementById('musicToggleBtn');
            musicToggleBtn.querySelector('.music-icon').classList.add('hidden');
            musicToggleBtn.querySelector('.pause-icon').classList.remove('hidden');
        })
        .catch(err => {
            console.log("El navegador bloqueó la reproducción automática inicial. Esperando interacción.");
        });
}

function pauseBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    if (!bgMusic) return;

    bgMusic.pause();
    musicPlayer.classList.add('paused');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    musicToggleBtn.querySelector('.music-icon').classList.remove('hidden');
    musicToggleBtn.querySelector('.pause-icon').classList.add('hidden');
}

/* ==========================================================================
   4. CELEBRATION EFFECTS (CONFETTI) & WISHES GENERATOR
   ========================================================================== */
const birthdayWishes = [
    "¡Martha, que este nuevo año de vida esté lleno de risas, salud inquebrantable y momentos mágicos que alegren tu corazón!",
    "¡Felicidades en tu día, Martha! Que cada uno de tus hermosos sueños empiece a convertirse en una realidad radiante.",
    "¡Martha, eres una luz inspiradora para todos! Que la vida te devuelva el doble del amor y la alegría que tú regalas.",
    "¡Feliz Cumpleaños! Que hoy te mimen, te abracen fuerte y sientas lo increíblemente especial que eres para todos nosotros.",
    "¡Que este cumpleaños sea solo el inicio de un año extraordinario lleno de paz, prosperidad y éxitos, querida Martha!",
    "¡Brindemos por tu felicidad, Martha! Que hoy sonrías como nunca y celebres rodeada de amor sincero y buenas vibras.",
    "¡Feliz Día, Martha! Que Dios bendiga cada paso de tu camino y llene tu hogar de abundante armonía, salud y felicidad infinita."
];

let currentWishIndex = -1;

function initWishes() {
    const wishBtn = document.getElementById('wishBtn');
    const wishDisplay = document.getElementById('wishDisplay');
    const wishDisplayContainer = document.querySelector('.wish-display-container');

    if (!wishBtn || !wishDisplay) return;

    wishBtn.addEventListener('click', () => {
        // Confetti explosion colors (rose gold, gold, premium magenta, metallic silver)
        const premiumColors = ['#b76e79', '#e5b3bb', '#d4af37', '#f3e5ab', '#ff007f', '#ffffff'];

        // Trigger confetti blast from the button position
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.7 },
            colors: premiumColors,
            ticks: 200
        });

        // Trigger double side-cannons for extra wow-effect
        setTimeout(() => {
            confetti({
                particleCount: 40,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: premiumColors
            });
            confetti({
                particleCount: 40,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: premiumColors
            });
        }, 150);

        // Smooth text transition
        wishDisplay.style.opacity = 0;
        wishDisplayContainer.classList.add('pulse-glow');
        
        setTimeout(() => {
            let nextIndex = currentWishIndex;
            // Avoid repeating the same wish sequentially
            while (nextIndex === currentWishIndex) {
                nextIndex = Math.floor(Math.random() * birthdayWishes.length);
            }
            currentWishIndex = nextIndex;
            
            wishDisplay.textContent = `"${birthdayWishes[currentWishIndex]}"`;
            wishDisplay.style.opacity = 1;
            
            setTimeout(() => {
                wishDisplayContainer.classList.remove('pulse-glow');
            }, 800);
        }, 300);
    });
}

// Initial full screen confetti salute when entering the main page
function celebrateBirthday() {
    const end = Date.now() + (2 * 1000); // celebrate for 2 seconds
    const colors = ['#b76e79', '#d4af37', '#f3e5ab', '#800020'];

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colors
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

/* ==========================================================================
   5. POLAROID LIGHTBOX (FULL-SCREEN VIEWER)
   ========================================================================== */
function openLightbox(imageSrc, captionText) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = captionText;
    
    lightbox.style.display = 'flex';
    // Small delay to allow display flex to apply before opacity transition
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
    
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('show');
    
    // Wait for animation to finish before hiding display
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }, 400);
}
