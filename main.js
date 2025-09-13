// AOS animations
AOS.init({ once: true, duration: 600, easing: 'ease-out' });

// Mobile menu toggle
const nav = document.querySelector('.nav');
const btn = document.querySelector('.menu-btn');
btn?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Expand/collapse "View details"
document.querySelectorAll('[expand-more]').forEach(el => {
    el.addEventListener('click', () => {
        const targetId = el.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const show = !content.classList.contains('expand-active');
        content.classList.toggle('expand-active', show);
        el.textContent = show ? el.getAttribute('data-hidetext') : el.getAttribute('data-showtext');
    });
});

// Back to top + year
document.getElementById('up')?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();

// ===================== Global Starfield =========================
(function starfield(){
    const wrapper = document.querySelector('.starfield');
    if(!wrapper) return;
    const canvas = wrapper.querySelector('#stars');
    const ctx = canvas.getContext('2d', { alpha: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars = [], w = 0, h = 0, lastT = 0, animId = 0;

    function fitCanvas(){
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = wrapper.getBoundingClientRect(); // viewport-sized (fixed)
        w = canvas.width  = Math.max(1, Math.round(rect.width  * dpr));
        h = canvas.height = Math.max(1, Math.round(rect.height * dpr));
        ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function makeStars(count){
        stars.length = 0;
        // slightly larger/closer stars for visibility
        const layers = [
            { size:[1.0, 1.9], speed: 8,   twinkle: 1.4 }, // near
            { size:[0.7, 1.4], speed: 4,   twinkle: 1.0 }, // mid
            { size:[0.45,1.0], speed: 1.6, twinkle: 0.6 }  // far
        ];
        for(let i=0;i<count;i++){
            const L = layers[Math.floor(Math.random()*layers.length)];
            stars.push({
                x: Math.random()*w,
                y: Math.random()*h,
                r: L.size[0] + Math.random()*(L.size[1]-L.size[0]),
                baseA: 0.55 + Math.random()*0.35,     // 0.55–0.90 visibility
                phase: Math.random()*Math.PI*2,
                tw: L.twinkle*(0.8 + Math.random()*0.6),
                vx: L.speed*(0.4 + Math.random()*0.8), // px/sec drifting right
                hue: 190 + Math.random()*200
            });
        }
    }

    function drawStar(s, t){
        const tw = 0.5 + 0.5*Math.sin(s.phase + t*s.tw*0.0018);
        const a = s.baseA * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 88%, ${a})`;
        const glow = 8 + s.r * 6;              // softer, brighter glow
        ctx.shadowColor = `hsla(${s.hue}, 100%, 82%, ${a*0.9})`;
        ctx.shadowBlur  = glow;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function render(t){
        const dt = Math.min(32, t - (lastT || t));
        lastT = t;

        ctx.clearRect(0,0,w,h);
        for(const s of stars){
            if(!reduceMotion){
                s.x += (s.vx * dt/1000);
                if(s.x > w+10) s.x = -10;
            }
            drawStar(s, t);
        }
        animId = requestAnimationFrame(render);
    }

    function init(){
        fitCanvas();
        const density = Math.round((w*h)/12000); // denser than before (~+50%)
        makeStars(density);
        cancelAnimationFrame(animId);
        if(reduceMotion){
            ctx.clearRect(0,0,w,h);
            stars.forEach(s => drawStar(s, performance.now()));
        } else {
            animId = requestAnimationFrame(render);
        }
    }

    window.addEventListener('resize', () => { fitCanvas(); init(); }, { passive:true });
    requestAnimationFrame(init);
})();
