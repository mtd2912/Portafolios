// ==========================
// PARTÍCULAS DE FONDO
// ==========================
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    function rand(a, b) { return Math.random() * (b - a) + a; }

    function createParticles() {
        particles = [];
        const n = Math.floor(W * H / 18000);
        for (let i = 0; i < n; i++) {
            particles.push({ x: rand(0,W), y: rand(0,H), r: rand(0.5,2.2), vx: rand(-0.12,0.12), vy: rand(-0.12,0.12), alpha: rand(0.2,0.7) });
        }
    }

    const syms = ['{','}','<','>','/','0','1',';'];
    const floaters = [];
    function createFloaters() {
        for (let i = 0; i < 18; i++) {
            floaters.push({ x: rand(0,W), y: rand(0,H), sym: syms[Math.floor(rand(0,syms.length))], size: rand(10,18), alpha: rand(0.03,0.09), vx: rand(-0.05,0.05), vy: rand(-0.05,0.05) });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        floaters.forEach(f => {
            ctx.save(); ctx.globalAlpha = f.alpha;
            ctx.fillStyle = '#a78bfa'; ctx.font = `${f.size}px monospace`;
            ctx.fillText(f.sym, f.x, f.y); ctx.restore();
            f.x += f.vx; f.y += f.vy;
            if (f.x < -20) f.x = W+20; if (f.x > W+20) f.x = -20;
            if (f.y < -20) f.y = H+20; if (f.y > H+20) f.y = -20;
        });
        particles.forEach(p => {
            ctx.save(); ctx.globalAlpha = p.alpha;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = '#7c5cfc'; ctx.fill(); ctx.restore();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize(); createParticles(); createFloaters(); draw();
})();


// ==========================
// NAVBAR — activo según página
// ==========================
(function () {
    const page = location.pathname.split('/').pop() || 'inicio.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page || (page === '' && href === 'inicio.html')) {
            a.classList.add('active');
        }
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.style.top = window.scrollY > 60 ? '12px' : '24px';
        });
    }
})();


// ==========================
// REVEAL AL SCROLL
// ==========================
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
}