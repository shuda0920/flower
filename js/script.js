
const nav = document.querySelector("nav")
addEventListener("scroll", () => {
    if (scrollY > 80) {
        nav.classList.add("glassify")
    } else {
        nav.classList.remove("glassify")
    }
})


// --- 1. Algorithmic Art: Golden Rose to Dust (p5.js) ---
const sketch = (p) => {
    let particles = [];
    let numParticles = 800;
    let scrollProgress = 0; // 0 = Rose, 1 = Dust
    let roseScale = 1; // Scale factor for rose size

    // Rose parameters
    let k = 5; // Petal count parameter
    let scale = 200;

    // Responsive parameters based on screen size
    function updateResponsiveParams() {
        let w = window.innerWidth;
        let h = window.innerHeight;

        // Adjust particle count based on screen size
        if (w < 480) {
            // Mobile
            numParticles = 300;
            roseScale = 0.5;
        } else if (w < 768) {
            // Tablet
            numParticles = 500;
            roseScale = 0.7;
        } else if (w < 1200) {
            // Small desktop
            numParticles = 650;
            roseScale = 0.85;
        } else {
            // Large desktop
            numParticles = 800;
            roseScale = 1;
        }
    }

    p.setup = () => {
        let container = document.getElementById('canvas-container');
        let w = window.innerWidth;
        let h = window.innerHeight;
        let canvas = p.createCanvas(w, h);
        canvas.parent('canvas-container');

        p.angleMode(p.DEGREES);
        p.rectMode(p.CENTER);

        // Set responsive parameters
        updateResponsiveParams();

        // Initialize particles
        particles = []; // Clear existing particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(p, i, numParticles));
        }
    };

    p.draw = () => {
        // Clear with extreme transparency for trail, or fully clear
        p.clear(); // We need transparency for CSS background to show?
        // Actually, user wants rose on homepage.
        // If we p.clear(), we see the body background (marble + gradients).
        // That's good.

        p.translate(p.width / 2, p.height / 2);

        // Update Scroll Progress based on scroll position relative to Hero height
        let scrollY = window.scrollY;
        let heroHeight = window.innerHeight;
        // Dissolve starts at 0, complete by end of hero
        scrollProgress = p.map(scrollY, 0, heroHeight * 0.8, 0, 1, true);

        // Draw particles
        for (let particle of particles) {
            particle.update(scrollProgress);
            particle.show();
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);

        // Update responsive parameters and reinitialize particles
        let oldNumParticles = numParticles;
        updateResponsiveParams();

        // Only reinitialize if particle count changed significantly
        if (Math.abs(oldNumParticles - numParticles) > 50) {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(p, i, numParticles));
            }
        }
    };

    class Particle {
        constructor(p, index, total) {
            this.p = p;
            this.index = index; // 0 to 1
            this.angleOffset = p.map(index, 0, total, 0, 360 * 10); // Spiral distribution

            // Rose Target Calculation (Rhodonea Curve + Helix)
            // r = cos(k * theta)
            // We distribute points along the curve

            // Random radius for distribution
            this.rBase = p.random(0, 1);
            // this.theta = p.random(0, 360 * 2);
            this.theta = this.angleOffset;

            // Apply responsive scale to rose size
            this.radius = 250 * roseScale * p.sin(2 * this.theta) * p.random(0.5, 1.2);
            // Using a Maurer Rose or simple Sine rose formula
            // Let's use a nice phyllotaxis or rose formula
            // Rose: r = cos(n*theta)
            let n = 4;
            let d = 5;
            let k = n / d;
            let r = 300 * roseScale * p.cos(k * this.theta);

            this.roseX = r * p.cos(this.theta);
            this.roseY = r * p.sin(this.theta);
            this.roseZ = p.random(-50, 50);

            // Current Position
            this.pos = p.createVector(this.roseX, this.roseY);
            this.vel = p.createVector(0, 0);

            // Random drift for dust state
            this.driftVel = p.createVector(p.random(-1, 1), p.random(-1, -3)); // Upward drift

            // Responsive particle size
            let baseSize = window.innerWidth < 768 ? 1.5 : 2;
            let maxSize = window.innerWidth < 768 ? 3 : 4;
            this.size = p.random(baseSize, maxSize);
            this.goldColor = p.color(212, 175, 55, p.random(150, 255));
        }

        update(progress) {
            // Rotation of the rose
            let rotateSpeed = 0.1;

            // Recalculate Rose Position (Rotating)
            let rX = this.roseX * this.p.cos(this.p.frameCount * 0.2) - this.roseY * this.p.sin(this.p.frameCount * 0.2);
            let rY = this.roseX * this.p.sin(this.p.frameCount * 0.2) + this.roseY * this.p.cos(this.p.frameCount * 0.2);

            // Target State transition
            if (progress < 0.5) {
                // Rose Mode
                let target = this.p.createVector(rX, rY);
                this.pos.lerp(target, 0.1);

                // Add subtle wobble
                this.pos.x += this.p.random(-1, 1);
                this.pos.y += this.p.random(-1, 1);

                // Mouse Interaction (Rose Distortion)
                let d = this.p.dist(this.p.mouseX - this.p.width / 2, this.p.mouseY - this.p.height / 2, this.pos.x, this.pos.y);
                if (d < 150) {
                    let angle = this.p.atan2(this.pos.y - (this.p.mouseY - this.p.height / 2), this.pos.x - (this.p.mouseX - this.p.width / 2));
                    this.pos.x += this.p.cos(angle) * 5;
                    this.pos.y += this.p.sin(angle) * 5;
                }

            } else {
                // Dust Mode (Floating & Persistent)

                // 1. Mouse wind/repulsion
                let mouseV = this.p.createVector(this.p.mouseX - this.p.width / 2, this.p.mouseY - this.p.height / 2);
                let dir = p5.Vector.sub(this.pos, mouseV);
                let d = dir.mag();
                dir.normalize();

                if (d < 200) {
                    let force = 800 / (d * d + 1);
                    this.driftVel.add(dir.mult(force));
                }

                // 2. Irregular Floating (Perlin Noise)
                // Use frameCount and index to create unique flow for each particle
                let noiseScale = 0.005;
                let timeScale = 0.005;
                // Unique noise offsets
                let nX = this.p.noise(this.pos.x * noiseScale, this.p.frameCount * timeScale, this.index);
                let nY = this.p.noise(this.pos.y * noiseScale, this.p.frameCount * timeScale, this.index + 1000);

                // Map noise to velocity vector
                let floatForce = this.p.createVector(this.p.map(nX, 0, 1, -0.5, 0.5), this.p.map(nY, 0, 1, -0.5, 0.5));
                this.driftVel.add(floatForce);

                // 3. Damping
                this.driftVel.mult(0.95);

                // 4. Update Position
                this.pos.add(this.driftVel);

                // 5. Screen Wrapping (Persistence)
                // Keep them within a slightly larger bound so they don't pop instantly
                let margin = 50;
                let halfW = this.p.width / 2 + margin;
                let halfH = this.p.height / 2 + margin;

                if (this.pos.x > halfW) this.pos.x = -halfW;
                if (this.pos.x < -halfW) this.pos.x = halfW;
                if (this.pos.y > halfH) this.pos.y = -halfH;
                if (this.pos.y < -halfH) this.pos.y = halfH;
            }

            // Opacity Logic
            // Persist with slight transparency in background
            this.alpha = this.p.map(progress, 0, 1, 255, 120);
        }

        show() {
            this.p.noStroke();
            this.goldColor.setAlpha(this.alpha);
            this.p.fill(this.goldColor);
            this.p.ellipse(this.pos.x, this.pos.y, this.size);
        }
    }
};

// Initialize p5
new p5(sketch);


// --- 1.5 Navigation Active State ---
const promoLinks = document.querySelectorAll(".nav-links a");

// 點擊導航連結時更新active狀態
promoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        // 移除所有連結的 active 狀態
        promoLinks.forEach(l => l.classList.remove("active"));
        // 給被點擊的連結加上 active 狀態
        link.classList.add("active");
    });
});

// 滾動時自動更新導航欄active狀態
function updateNavOnScroll() {
    // 獲取所有section
    const sections = document.querySelectorAll('section[id]');

    // 當前滾動位置
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150; // 偏移量，提前觸發
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // 檢查當前滾動位置是否在這個section範圍內
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // 移除所有active
            promoLinks.forEach(link => link.classList.remove('active'));

            // 找到對應的導航連結並添加active
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    // 如果滾動到頁面頂部，移除所有active或者激活第一個
    if (scrollY < 100) {
        promoLinks.forEach(link => link.classList.remove('active'));
    }
}

// 添加滾動事件監聽
window.addEventListener('scroll', updateNavOnScroll);

// 頁面加載時執行一次
document.addEventListener('DOMContentLoaded', updateNavOnScroll);




// --- 2. Stage Play Interaction (Acts) ---
const stageContainer = document.getElementById("stage-area");
const actSlides = document.querySelectorAll(".act-slide");
let currentAct = 0; // 0-based index

if (stageContainer) {
    stageContainer.addEventListener("click", () => {
        // Fade out current
        actSlides[currentAct].classList.remove("active");

        // Advance Act
        currentAct++;
        if (currentAct >= actSlides.length) {
            currentAct = 0; // Loop back to start
        }

        // Fade in next
        // Slight delay for "Scene Change" feel
        setTimeout(() => {
            actSlides[currentAct].classList.add("active");
        }, 300);
    });
}

// --- 3. GSAP Entrance Animations ---
const introTl = gsap.timeline();

// Specifically set hero elements to hidden at start of JS execution to prep for animation
gsap.set(".title-line", { opacity: 0, y: 30 });
gsap.set(".subtitle", { opacity: 0 });
gsap.set(".hero-info", { opacity: 0 });

// Animate immediately on load
introTl.to(".title-line", {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
})
    .to(".subtitle", { opacity: 1, duration: 1 }, "-=0.5")
    .to(".hero-info", { opacity: 1, duration: 1 }, "-=0.5");

// --- 3.5 Hero Mouse Parallax (Premium Feel) ---
const heroSection = document.getElementById('hero');
const heroImg = document.querySelector('.hero-img');
const heroTitle = document.querySelector('.main-title');

if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Image moves opposite to mouse (depth)
        gsap.to(heroImg, {
            x: x * 20,
            y: y * 20,
            rotationY: x * 2,
            rotationX: -y * 2,
            duration: 1,
            ease: "power2.out"
        });

        // Title moves slightly less
        gsap.to(heroTitle, {
            x: x * 10,
            y: y * 10,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Reset on leave
    heroSection.addEventListener('mouseleave', () => {
        gsap.to([heroImg, heroTitle], {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    });
}


// --- 4. Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".section-title").forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 100%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
    });
});

// Hero Background Dissolve effect with Timeline (Precise Control)
// 建立一個時間軸，把 ScrollTrigger 綁定在時間軸上
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",      // 視窗頂端碰到 #hero 頂端時開始
        end: "bottom top",     // 視窗頂端碰到 #hero 底端時結束 (剛好滾過整個 hero 高度)
        scrub: 0.5             // 數值越小跟隨越緊 (0.5秒緩衝)
    }
});

// 在這個「滾動距離」內，依序或同時安排動作
// 總進度 0% -> 100%
heroTl
    // 1. 整個過程圖片持續緩慢放大 (0% -> 100%)
    .to(".hero-image-container", {
        scale: 1.7,
        duration: 1, // 這裡的 duration 是比例權重，不是秒數
        ease: "none"
    }, 0) // 0 代表從時間軸起點開始

    // 2. 視差移動：圖片往下沈 (0% -> 100%)
    .to(".hero-image-container", {
        y: 190,
        duration: 1.5,
        ease: "none"
    }, 0.1)

    // 3. 滾動到一半時 (0.5) 才開始變透明，直到結束 (0.5 -> 1.0)
    .to(".hero-image-container, .hero-content", {
        opacity: 0,
        duration: 0.6, // 佔用下半場的時間
        ease: "power2.out"
    }, 0.05); // 0.5 代表時間軸走到一半時才插入這個動作

// Stagger grids
const grids = [".team-grid", ".merch-grid", ".schedule-grid"]; // Removed cast-carousel from general grid stagger for custom handling

grids.forEach(grid => {
    const children = document.querySelector(grid)?.children;
    if (children) {
        // Use batch for better performance and reliability with dynamic content
        ScrollTrigger.batch(children, {
            start: "top 95%",
            onEnter: batch => gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
                overwrite: true,
                duration: 0.6,
                ease: "power2.out"
            }),
            onLeaveBack: batch => gsap.to(batch, {
                autoAlpha: 0,
                y: 30,
                overwrite: true
            })
        });

        // Set initial state
        gsap.set(children, { autoAlpha: 0, y: 30 });
    }
});

// Refresh ScrollTrigger after all assets (like images) are loaded to ensure correct positions
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});


// --- 5. Interactive Game: Memory Petals ---
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-game-btn");
const scoreDisplay = document.getElementById("score");
const secretMessage = document.getElementById("secret-message");
const closeMsgBtn = document.getElementById("close-msg");

let score = 0;
let gameActive = false;
let petalInterval;

if (startBtn) startBtn.addEventListener("click", startGame);
if (closeMsgBtn) closeMsgBtn.addEventListener("click", () => {
    secretMessage.classList.add("hidden");
    // Reset game UI slightly or just show button again
    startBtn.classList.remove("hidden");
    startBtn.innerText = "再次挑戰";
});

function startGame() {
    startBtn.classList.add("hidden");
    secretMessage.classList.add("hidden");
    score = 0;
    scoreDisplay.innerText = score;
    gameActive = true;
    petalInterval = setInterval(createPetal, 700);
}

function createPetal() {
    if (!gameActive) return;

    const petal = document.createElement("div");
    petal.classList.add("petal");

    const maxLeft = gameArea.offsetWidth - 40;
    const startLeft = Math.random() * maxLeft;

    petal.style.left = startLeft + "px";
    petal.style.top = "-30px";

    // Interactions
    petal.addEventListener("mousedown", () => collectPetal(petal));
    petal.addEventListener("touchstart", (e) => {
        e.preventDefault();
        collectPetal(petal);
    });

    gameArea.appendChild(petal);

    gsap.to(petal, {
        y: 550,
        x: "+=" + (Math.random() * 100 - 50),
        rotation: 360 + Math.random() * 360,
        duration: 4 + Math.random() * 2,
        ease: "none",
        onComplete: () => {
            if (petal.parentNode) petal.remove();
        }
    });
}

function collectPetal(p) {
    if (!gameActive) return;
    score++;
    scoreDisplay.innerText = score;
    gsap.to(p, { scale: 1.5, opacity: 0, duration: 0.2, onComplete: () => p.remove() });
    checkWin();
}

function checkWin() {
    if (score >= 10) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(petalInterval);
    document.querySelectorAll(".petal").forEach(p => p.remove());

    secretMessage.classList.remove("hidden");
    gsap.fromTo(".msg-content",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
    );
}

// Navbar Scroll
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 10) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

// Mobile Menu handling is in mobile-menu.js
