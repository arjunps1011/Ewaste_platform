import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../../css/user/home.module.css";
import Nav from "./Nav";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { id: "phone1",     delay: 0.00, style: { width:"60px",  height:"60px",  top:"18%", left:"12%" } },
  { id: "phone2",     delay: 0.06, style: { width:"52px",  height:"52px",  top:"28%", right:"14%" } },
  { id: "laptop",     delay: 0.10, style: { width:"100px", height:"100px", top:"14%", left:"50%", marginLeft:"-50px" } },
  { id: "battery",    delay: 0.04, style: { width:"55px",  height:"55px",  top:"55%", left:"8%" } },
  { id: "headphones", delay: 0.08, style: { width:"70px",  height:"70px",  top:"60%", right:"10%" } },
  { id: "tablet",     delay: 0.02, style: { width:"75px",  height:"75px",  top:"35%", left:"6%" } },
  { id: "chip",       delay: 0.12, style: { width:"58px",  height:"58px",  top:"20%", right:"8%" } },
  { id: "watch",      delay: 0.05, style: { width:"52px",  height:"52px",  top:"70%", left:"30%" } },
];

const SVGS = {
  phone1: (
    <svg viewBox="0 0 60 60" fill="none">
      <rect x="8" y="4" width="44" height="52" rx="7" fill="#1a2535" stroke="#2e4060" strokeWidth="1.5"/>
      <rect x="14" y="10" width="32" height="34" rx="3" fill="#0d1a2a"/>
      <rect x="15" y="11" width="30" height="32" rx="2" fill="url(#ps1)"/>
      <circle cx="30" cy="50" r="3.5" fill="#2e4060"/>
      <defs><linearGradient id="ps1" x1="15" y1="11" x2="45" y2="43" gradientUnits="userSpaceOnUse"><stop stopColor="#00ffa3" stopOpacity="0.15"/><stop offset="1" stopColor="#00c8ff" stopOpacity="0.08"/></linearGradient></defs>
    </svg>
  ),
  phone2: (
    <svg viewBox="0 0 60 60" fill="none">
      <rect x="10" y="3" width="40" height="54" rx="8" fill="#1d1822" stroke="#3a2e4a" strokeWidth="1.5"/>
      <rect x="16" y="9" width="28" height="36" rx="3" fill="#0d0b12"/>
      <rect x="17" y="10" width="26" height="34" rx="2" fill="url(#ps2)"/>
      <defs><linearGradient id="ps2" x1="17" y1="10" x2="43" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#a855f7" stopOpacity="0.2"/><stop offset="1" stopColor="#00c8ff" stopOpacity="0.08"/></linearGradient></defs>
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 100 70" fill="none">
      <rect x="10" y="4" width="80" height="52" rx="5" fill="#15202e" stroke="#243040" strokeWidth="1.5"/>
      <rect x="14" y="8" width="72" height="44" rx="3" fill="#080c10"/>
      <rect x="15" y="9" width="70" height="42" rx="2" fill="url(#ls)"/>
      <rect x="4" y="56" width="92" height="10" rx="4" fill="#1a2535" stroke="#243040" strokeWidth="1.2"/>
      <defs><linearGradient id="ls" x1="15" y1="9" x2="85" y2="51" gradientUnits="userSpaceOnUse"><stop stopColor="#00ffa3" stopOpacity="0.07"/><stop offset="1" stopColor="#00c8ff" stopOpacity="0.12"/></linearGradient></defs>
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 60 36" fill="none">
      <rect x="2" y="4" width="50" height="28" rx="6" fill="#1a2010" stroke="#3a4a20" strokeWidth="1.5"/>
      <rect x="52" y="12" width="6" height="12" rx="3" fill="#3a4a20"/>
      <rect x="7" y="9" width="15" height="18" rx="3" fill="url(#bc)"/>
      <path d="M29 10 L24 20 L28 20 L27 28 L34 17 L30 17 Z" fill="rgba(0,255,163,0.35)"/>
      <defs><linearGradient id="bc" x1="7" y1="9" x2="22" y2="27" gradientUnits="userSpaceOnUse"><stop stopColor="#00ffa3" stopOpacity="0.4"/><stop offset="1" stopColor="#00c050" stopOpacity="0.15"/></linearGradient></defs>
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 70 70" fill="none">
      <path d="M12 40 C12 22 22 10 35 10 C48 10 58 22 58 40" stroke="#2a2040" strokeWidth="4" strokeLinecap="round"/>
      <rect x="6" y="38" width="12" height="20" rx="4" fill="#1d1830" stroke="#2a2040" strokeWidth="1.5"/>
      <rect x="52" y="38" width="12" height="20" rx="4" fill="#1d1830" stroke="#2a2040" strokeWidth="1.5"/>
    </svg>
  ),
  tablet: (
    <svg viewBox="0 0 60 80" fill="none">
      <rect x="4" y="4" width="52" height="72" rx="7" fill="#1a1f2a" stroke="#2a3040" strokeWidth="1.5"/>
      <rect x="9" y="9" width="42" height="60" rx="4" fill="#080c10"/>
      <rect x="10" y="10" width="40" height="58" rx="3" fill="url(#ts)"/>
      <defs><linearGradient id="ts" x1="10" y1="10" x2="50" y2="68" gradientUnits="userSpaceOnUse"><stop stopColor="#00c8ff" stopOpacity="0.12"/><stop offset="1" stopColor="#00ffa3" stopOpacity="0.06"/></linearGradient></defs>
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 60 60" fill="none">
      <rect x="12" y="12" width="36" height="36" rx="4" fill="#0f1e18" stroke="#1e4030" strokeWidth="1.5"/>
      <rect x="17" y="17" width="26" height="26" rx="2" fill="#0a1410" stroke="#1e4030" strokeWidth="1"/>
      <rect x="4" y="19" width="8" height="3" rx="1.5" fill="#1e4030"/>
      <rect x="4" y="26" width="8" height="3" rx="1.5" fill="#1e4030"/>
      <rect x="4" y="33" width="8" height="3" rx="1.5" fill="#1e4030"/>
      <rect x="48" y="19" width="8" height="3" rx="1.5" fill="#1e4030"/>
      <rect x="48" y="26" width="8" height="3" rx="1.5" fill="#1e4030"/>
      <rect x="48" y="33" width="8" height="3" rx="1.5" fill="#1e4030"/>
      <rect x="20" y="20" width="8" height="8" rx="1" fill="rgba(0,255,163,0.15)" stroke="rgba(0,255,163,0.3)" strokeWidth="0.8"/>
      <rect x="32" y="20" width="8" height="8" rx="1" fill="rgba(0,200,255,0.12)" stroke="rgba(0,200,255,0.25)" strokeWidth="0.8"/>
    </svg>
  ),
  watch: (
    <svg viewBox="0 0 50 62" fill="none">
      <rect x="16" y="2" width="18" height="10" rx="4" fill="#1a1520" stroke="#2a2035" strokeWidth="1.2"/>
      <rect x="16" y="50" width="18" height="10" rx="4" fill="#1a1520" stroke="#2a2035" strokeWidth="1.2"/>
      <rect x="6" y="12" width="38" height="38" rx="10" fill="#1a1520" stroke="#2a2035" strokeWidth="1.5"/>
      <rect x="11" y="17" width="28" height="28" rx="6" fill="url(#ws)"/>
      <circle cx="25" cy="31" r="8" fill="none" stroke="rgba(0,255,163,0.2)" strokeWidth="1.5"/>
      <line x1="25" y1="31" x2="25" y2="25" stroke="rgba(0,255,163,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
      <defs><linearGradient id="ws" x1="11" y1="17" x2="39" y2="45" gradientUnits="userSpaceOnUse"><stop stopColor="#00ffa3" stopOpacity="0.1"/><stop offset="1" stopColor="#a855f7" stopOpacity="0.08"/></linearGradient></defs>
    </svg>
  ),
};

const CATEGORIES = [
  {
    label: "Phones", desc: "Smartphones & feature phones",
    svg: <svg viewBox="0 0 40 40" fill="none" width="40" height="40"><rect x="8" y="3" width="24" height="34" rx="5" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="12" y="8" width="16" height="20" rx="2" fill="rgba(0,255,163,0.07)"/><circle cx="20" cy="32" r="2" fill="#00ffa3" opacity="0.4"/></svg>,
  },
  {
    label: "Laptops", desc: "All brands & conditions",
    svg: <svg viewBox="0 0 44 34" fill="none" width="44" height="34"><rect x="4" y="2" width="36" height="24" rx="3" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="7" y="5" width="30" height="18" rx="1.5" fill="rgba(0,255,163,0.07)"/><rect x="1" y="26" width="42" height="6" rx="3" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="16" y="27" width="12" height="2" rx="1" fill="rgba(0,255,163,0.2)"/></svg>,
  },
  {
    label: "Batteries", desc: "Li-ion, NiMH & more",
    svg: <svg viewBox="0 0 44 26" fill="none" width="44" height="26"><rect x="1" y="4" width="38" height="18" rx="4" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="39" y="9" width="4" height="8" rx="2" fill="#00ffa3" opacity="0.4"/><rect x="5" y="8" width="10" height="10" rx="2" fill="rgba(0,255,163,0.2)"/><path d="M20 6 L16 14 L19 14 L18 20 L24 12 L21 12 Z" fill="rgba(0,255,163,0.5)"/></svg>,
  },
  {
    label: "TVs", desc: "LED, LCD & plasma screens",
    svg: <svg viewBox="0 0 48 38" fill="none" width="48" height="38"><rect x="2" y="2" width="44" height="28" rx="3" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="5" y="5" width="38" height="22" rx="1.5" fill="rgba(0,255,163,0.07)"/><rect x="18" y="30" width="12" height="4" rx="1" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.2"/><rect x="12" y="34" width="24" height="3" rx="1.5" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.2"/></svg>,
  },
  {
    label: "Wearables", desc: "Smartwatches & fitness bands",
    svg: <svg viewBox="0 0 32 42" fill="none" width="32" height="42"><rect x="10" y="1" width="12" height="7" rx="3" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.2"/><rect x="10" y="34" width="12" height="7" rx="3" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.2"/><rect x="4" y="8" width="24" height="26" rx="7" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="8" y="12" width="16" height="18" rx="4" fill="rgba(0,255,163,0.07)"/><circle cx="16" cy="21" r="5" fill="none" stroke="rgba(0,255,163,0.3)" strokeWidth="1.2"/><line x1="16" y1="21" x2="16" y2="17" stroke="#00ffa3" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/></svg>,
  },
  {
    label: "Desktops", desc: "PCs, monitors & peripherals",
    svg: <svg viewBox="0 0 48 44" fill="none" width="48" height="44"><rect x="2" y="2" width="44" height="28" rx="3" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="5" y="5" width="38" height="22" rx="1.5" fill="rgba(0,255,163,0.07)"/><rect x="18" y="30" width="12" height="6" rx="1" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.2"/><rect x="10" y="36" width="28" height="4" rx="2" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.2"/><circle cx="24" cy="16" r="4" fill="none" stroke="rgba(0,255,163,0.3)" strokeWidth="1"/></svg>,
  },
  {
    label: "Cameras", desc: "DSLRs, action cams & more",
    svg: <svg viewBox="0 0 48 36" fill="none" width="48" height="36"><path d="M4 12 L14 12 L18 6 L30 6 L34 12 L44 12 L44 32 L4 32 Z" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><circle cx="24" cy="21" r="8" fill="none" stroke="#00ffa3" strokeWidth="1.5"/><circle cx="24" cy="21" r="4" fill="rgba(0,255,163,0.1)" stroke="rgba(0,255,163,0.3)" strokeWidth="1"/><circle cx="36" cy="15" r="2" fill="rgba(0,255,163,0.3)"/></svg>,
  },
  {
    label: "Audio", desc: "Headphones, speakers & earbuds",
    svg: <svg viewBox="0 0 44 40" fill="none" width="44" height="40"><path d="M8 26 C8 12 14 4 22 4 C30 4 36 12 36 26" stroke="#00ffa3" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/><rect x="2" y="24" width="10" height="14" rx="4" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/><rect x="32" y="24" width="10" height="14" rx="4" fill="#0e1520" stroke="#00ffa3" strokeWidth="1.5"/></svg>,
  },
];

const OUTPUT_ITEMS = [
  { text: "💰 Value",      color: "#ffd700", glow: "rgba(255,215,0,0.9)", dx: -130, dy: -175 },
  { text: "🌱 Green Energy", color: "#00ffa3", glow: "rgba(0,255,163,0.9)", dx: 0,    dy: -210 },
  { text: "♻ Recycled",    color: "#00c8ff", glow: "rgba(0,200,255,0.9)", dx: 130,  dy: -175 },
];

const WHY_ITEMS = [
  { tag: "01", title: "Best Price",     desc: "We offer the most competitive rates for your devices — guaranteed." },
  { tag: "02", title: "Free Pickup",    desc: "We come to your door at no cost. Zero hassle, zero fees." },
  { tag: "03", title: "Safe Recycling", desc: "Certified eco-friendly disposal. Every device handled responsibly." },
  { tag: "04", title: "Fast Payment",   desc: "Get paid within 24 hours once your device is verified." },
];

export default function Home() {
  const spacerRef     = useRef(null);
  const heroRef       = useRef(null);
  const canvasRef     = useRef(null);
  const heroCopyRef   = useRef(null);
  const scrollHintRef = useRef(null);
  const binWrapRef    = useRef(null);
  const binSvgRef     = useRef(null);
  const scorePanelRef = useRef(null);
  const ringFillRef   = useRef(null);
  const scoreNumRef   = useRef(null);
  const itemRefs      = useRef({});
  const particlesRef  = useRef([]);
  const rafRef        = useRef(null);
  const outputRefs    = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const hero   = heroRef.current;
    const hr     = hero.getBoundingClientRect();
    const br     = binWrapRef.current.getBoundingClientRect();
    const binX   = br.left + br.width / 2 - hr.left;
    const binY   = br.top + br.height * 0.33 - hr.top;

    gsap.set(scorePanelRef.current, { opacity:0, pointerEvents:"none" });
    gsap.set(Object.values(itemRefs.current).filter(Boolean), { x:0, y:0, opacity:1, scale:1 });

    const resize = () => { 
      canvas.width = canvas.offsetWidth; 
      canvas.height = canvas.offsetHeight; 
    };
    resize();
    window.addEventListener("resize", resize);

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.alpha -= p.decay; p.size *= 0.97;
        ctx.save(); 
        ctx.globalAlpha = Math.max(0, p.alpha); 
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8; 
        ctx.shadowColor = p.color;
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); 
        ctx.fill(); 
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Ambient particles
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("div");
      el.className = styles.ambientParticle;
      const size = Math.random() * 3 + 1;
      const green = Math.random() > 0.5;
      el.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:${green?"rgba(0,255,163,0.5)":"rgba(0,200,255,0.4)"};box-shadow:0 0 ${size*3}px ${green?"rgba(0,255,163,0.3)":"rgba(0,200,255,0.3)"};`;
      hero.appendChild(el);
      gsap.to(el, { y:"-=80", x:`+=${(Math.random()-0.5)*60}`, opacity:0, duration:4+Math.random()*4, delay:Math.random()*5, repeat:-1, ease:"power1.in" });
    }

    const tl = gsap.timeline({ paused: true });

    // Items falling into bin
    ITEMS.forEach(({ id, delay }) => {
      const el = itemRefs.current[id];
      if (!el) return;
      const ir = el.getBoundingClientRect();
      const dx = binX - (ir.left + ir.width / 2 - hr.left);
      const dy = binY - (ir.top + ir.height / 2 - hr.top);
      const end = delay + 0.55;

      tl.to(el, { x:dx*0.4+(Math.random()-0.5)*80, y:dy*0.3-80, rotation:(Math.random()-0.5)*60, scale:1.15, ease:"power2.in", duration:end-delay-0.2 }, delay);
      tl.to(el, { x:dx, y:dy, rotation:(Math.random()-0.5)*180, scale:0.25, opacity:0, ease:"power3.in", duration:0.25,
        onComplete: () => {
          const colors = ["#00ffa3","#00c8ff","#a3ffdb","#80e8ff","#ffffff"];
          for (let i = 0; i < 30; i++) {
            particlesRef.current.push({ x:binX, y:binY, vx:(Math.random()-0.5)*6, vy:(Math.random()-0.5)*6-2, size:Math.random()*3+1, alpha:1, color:colors[Math.floor(Math.random()*colors.length)], decay:0.015+Math.random()*0.02 });
          }
        }
      }, end-0.22);
    });

    tl.to(scrollHintRef.current, { opacity:0, duration:0.15 }, 0.02);
    tl.to(heroCopyRef.current,   { opacity:0, scale:0.92, duration:0.2, ease:"power2.in" }, 0.05);

    // Bin glow & transform
    tl.to(binSvgRef.current, { filter:"drop-shadow(0 0 36px rgba(0,255,163,0.8))", duration:0.3, ease:"power2.out" }, 0.7);
    tl.to(binSvgRef.current, { scale:1.18, duration:0.18, ease:"back.out(3)" }, 0.82);
    tl.to(binSvgRef.current, {
      filter:"drop-shadow(0 0 60px rgba(255,215,0,0.95)) drop-shadow(0 0 20px rgba(255,255,255,0.8))",
      duration:0.18, ease:"power3.out"
    }, 0.82);
    tl.to(binSvgRef.current, {
      filter:"drop-shadow(0 0 28px rgba(0,255,163,0.6))",
      scale:1, duration:0.22, ease:"power2.out"
    }, 1.0);



    // ====================== TEXT ONLY OUTPUT ITEMS ======================
    OUTPUT_ITEMS.forEach((item, i) => {
      const el = document.createElement("div");
      el.textContent = item.text;
      el.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 1.05rem;
        font-weight: 700;
        font-family: 'Syne', sans-serif;
        letter-spacing: 0.05em;
        color: ${item.color};
        background: rgba(8,12,16,0.92);
        border: 2.5px solid ${item.color};
        box-shadow: 0 0 30px ${item.glow};
        white-space: nowrap;
        pointer-events: none;
        z-index: 16;
      `;

      hero.appendChild(el);
      outputRefs.current.push(el);

      gsap.set(el, { 
        x: binX - 60, 
        y: binY - 25, 
        scale: 0.3, 
        opacity: 0 
      });

      // Pop out from bin
      tl.to(el, {
        x: binX + item.dx,
        y: binY + item.dy,
        scale: 1.05,
        opacity: 1,
        duration: 0.12,
        ease: "back.out(3.5)"
      }, 0.86 + i * 0.06);

      // Float up and fade
      tl.to(el, {
        y: binY + item.dy - 65,
        scale: 0.9,
        opacity: 0,
        duration: 0.1,
        ease: "power2.in"
      }, 0.98 + i * 0.05);
    });
    // ===================================================================

    tl.to(binWrapRef.current, { bottom:"50%", y:"50%", duration:0.35, ease:"power2.inOut" }, 0.85);
    tl.to(binWrapRef.current, { opacity:0, scale:0.6, duration:0.2, ease:"power2.in" }, 1.1);
    tl.to(scorePanelRef.current, { opacity:1, duration:0.35, ease:"power2.out",
      onStart: () => {
        scorePanelRef.current.style.pointerEvents = "auto";
        const circ = 502; let start = null;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts-start)/1800, 1), e = 1-Math.pow(1-p,3);
          if (scoreNumRef.current) scoreNumRef.current.textContent = Math.round(e*2847);
          if (ringFillRef.current) ringFillRef.current.style.strokeDashoffset = String(circ-e*circ);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, 1.3);

    ScrollTrigger.create({ trigger:spacerRef.current, start:"top top", end:"+=200%", scrub:1.2, animation:tl });

    const checkVisible = () => {
      document.querySelectorAll(
        `.${styles.animSlideUp}, .${styles.animSlideLeft}, .${styles.animSlideRight}`
      ).forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add("visible");
        }
      });
    };
    checkVisible();
    window.addEventListener("scroll", checkVisible);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach(t => t.kill());
      outputRefs.current.forEach(el => el?.remove());
      window.removeEventListener("scroll", checkVisible);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={spacerRef} className={styles.scrollSpacer}>
        <div ref={heroRef} className={styles.hero}>

            <Nav/>

          <div ref={heroCopyRef} className={styles.heroCopy}>
            <div className={styles.heroEyebrow}>↓ Scroll to Recycle</div>
            <h1 className={styles.heroTitle}>Drop it.<br /><em>Save the planet.</em></h1>
            <p className={styles.heroSub}>Scroll down to watch your e-waste journey into a greener future.</p>
          </div>

          <canvas ref={canvasRef} className={styles.particleCanvas} />

          {ITEMS.map(({ id, style }) => (
            <div key={id} ref={el => { itemRefs.current[id] = el; }} className={styles.ewasteItem} style={style}>
              {SVGS[id]}
            </div>
          ))}

          <div ref={binWrapRef} className={styles.binWrapper}>
            <div className={styles.binGlowRing} />
            <svg ref={binSvgRef} className={styles.binSvg} viewBox="0 0 90 100" fill="none">
              <path d="M14 32 L18 92 C18 95 21 98 24 98 L66 98 C69 98 72 95 72 92 L76 32 Z" fill="#0e2018" stroke="#00ffa3" strokeWidth="1.5"/>
              <path d="M30 45 L26 90" stroke="rgba(0,255,163,0.15)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M45 43 L45 92" stroke="rgba(0,255,163,0.15)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M60 45 L64 90" stroke="rgba(0,255,163,0.15)" strokeWidth="2" strokeLinecap="round"/>
              <rect x="8" y="26" width="74" height="10" rx="5" fill="#0e2018" stroke="#00ffa3" strokeWidth="1.5"/>
              <rect x="34" y="18" width="22" height="12" rx="4" fill="none" stroke="#00ffa3" strokeWidth="1.5"/>
              <text x="45" y="74" textAnchor="middle" fontSize="22" fill="rgba(0,255,163,0.4)" fontFamily="sans-serif">♻</text>
            </svg>
            <div className={styles.binLabel}>Recycle Bin</div>
          </div>

          <div ref={scorePanelRef} className={styles.scorePanel}>
            <div className={styles.successGlow} />
            <div className={styles.scoreRing}>
              <svg viewBox="0 0 180 180">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffa3"/>
                    <stop offset="100%" stopColor="#00c8ff"/>
                  </linearGradient>
                </defs>
                <circle className={styles.ringBg} cx="90" cy="90" r="80"/>
                <circle ref={ringFillRef} className={styles.ringFill} cx="90" cy="90" r="80"/>
              </svg>
              <div className={styles.scoreCenter}>
                <div ref={scoreNumRef} className={styles.scoreNumber}>0</div>
                <div className={styles.scoreLabel}>Eco Points</div>
              </div>
            </div>
            <h2 className={styles.scoreHeadline}>Mission<br /><em>Complete!</em></h2>
            <p className={styles.scoreDesc}>You've responsibly recycled 7 devices. Together we keep toxic waste out of landfills.</p>
            <div className={styles.scoreBadges}>
              <div className={styles.badge}>♻ 7 Items</div>
              <div className={styles.badge}>🌍 Earth Saver</div>
              <div className={styles.badge}>⚡ Level 3</div>
            </div>
          </div>

          <div ref={scrollHintRef} className={styles.scrollHint}>
            <div className={styles.scrollLine} />
            <div className={styles.scrollText}>Scroll to Recycle</div>
          </div>

        </div>
      </div>

      <div className={styles.postSection}>
        <p className={`${styles.postEyebrow} ${styles.animSlideUp}`}>Join the Movement</p>
        <h2 className={`${styles.postTitle} ${styles.animSlideUp} ${styles.delay1}`}>Every device<br />counts.</h2>
        <p className={`${styles.postSub} ${styles.animSlideUp} ${styles.delay2}`}>Schedule a pickup, drop off at a centre, or mail your devices. We handle the rest — responsibly.</p>
        <button className={`${styles.ctaBtn} ${styles.animSlideUp} ${styles.delay3}`}>Sell your E-waste and earn some money →</button>
      </div>

      <div className={styles.stepsSection}>
        <p className={`${styles.postEyebrow} ${styles.animSlideUp}`}>How It Works</p>
        <h2 className={`${styles.postTitle} ${styles.animSlideUp} ${styles.delay1}`}>Simple steps.<br /><em>Big impact.</em></h2>
        <div className={styles.stepsRow}>
          {[
            { num: "01", title: "Schedule Pickup", desc: "Choose to drop off, mail, or request a pickup of your device." },
            { num: "02", title: "Device Inspection", desc: "Our team receives your device and carefully checks its condition." },
            { num: "03", title: "Price Confirmation", desc: "We evaluate your device and confirm the price with you." },
            { num: "04", title: "Receive Payment", desc: "Get paid securely once the price is approved." },
          ].map((step, i, arr) => (
            <div key={step.num} style={{ display:"contents" }}>
              <div className={`${styles.stepCard} ${styles.animSlideUp}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDesc}>{step.desc}</div>
              </div>
              {i < arr.length - 1 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.categoriesSection}>
        <p className={`${styles.postEyebrow} ${styles.animSlideUp}`}>We Accept</p>
        <h2 className={`${styles.postTitle} ${styles.animSlideUp} ${styles.delay1}`}>All your<br /><em>e-waste.</em></h2>
        <div className={styles.categoriesGrid}>
          {CATEGORIES.map(({ label, desc, svg }, i) => (
            <div key={label} className={`${styles.catCard} ${styles.animSlideUp}`} style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className={styles.catIcon}>{svg}</div>
              <div className={styles.catLabel}>{label}</div>
              <div className={styles.catDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.whySection}>
        <p className={`${styles.postEyebrow} ${styles.animSlideUp}`}>Why Choose Us</p>
        <h2 className={`${styles.postTitle} ${styles.animSlideUp} ${styles.delay1}`}>What sets us<br /><em>apart.</em></h2>
        <div className={styles.whyGrid}>
          {WHY_ITEMS.map(({ tag, title, desc }, i) => (
            <div
              key={tag}
              className={`${styles.whyCard} ${i % 2 === 0 ? styles.animSlideLeft : styles.animSlideRight}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={styles.whyTag}>{tag}</div>
              <div className={styles.whyTitle}>{title}</div>
              <div className={styles.whyDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    <Footer />
    </div>
    
  );
}