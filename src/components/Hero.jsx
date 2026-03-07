import { useEffect, useRef, useState, useCallback } from 'react';

const Hero = () => {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const [robotBop, setRobotBop] = useState('');

  const handleRobotTap = useCallback((e) => {
    // Pick a random reaction
    const reactions = ['bop-spin', 'bop-bounce', 'bop-shake', 'bop-flip'];
    const pick = reactions[Math.floor(Math.random() * reactions.length)];
    setRobotBop(pick);

    // Burst stars at tap position
    const rect = logoRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const emojis = ['⚡','✨','💫','🌟','🔥','💥'];
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('span');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (i / 8) * 2 * Math.PI;
      const dist = 60 + Math.random() * 50;
      el.style.cssText = `
        position:fixed;
        left:${cx}px;
        top:${cy}px;
        font-size:${1.2 + Math.random() * 0.8}rem;
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
        animation:starBurst 0.7s ease-out forwards;
        --tx:${Math.cos(angle) * dist}px;
        --ty:${Math.sin(angle) * dist}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 750);
    }

    // Clear class after animation ends
    setTimeout(() => setRobotBop(''), 650);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 90;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.5 ? '0,207,255' : '21,101,192',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="inicio" className="hero">
      <canvas ref={canvasRef} className="hero-particles" />

      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="container">
        <div className="hero-grid">

          {/* Left column — text */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot" />
              Disponible para proyectos · Argentina
            </div>

            <h1 className="hero-title">
              <span className="title-line">
                <span className="title-word" style={{animationDelay:'0ms'}}>Transformo</span>{' '}
                <span className="title-word" style={{animationDelay:'120ms'}}>ideas</span>{' '}
                <span className="title-word" style={{animationDelay:'240ms'}}>en</span>
              </span>
              <span className="title-line">
                <span className="title-word" style={{animationDelay:'380ms'}}>
                  <span className="shimmer-text">Soluciones digitales</span>
                </span>
              </span>
            </h1>

            <p className="hero-desc">
              Soy <strong>Cesar Sarchioni</strong>, desarrollador especializado en webs, sistemas internos,
              bots con N8N y asistentes con inteligencia artificial. Construyo herramientas que
              automatizan, escalan y hacen crecer tu negocio.
            </p>

            <div className="hero-actions">
              <a
                href="#servicios"
                className="btn btn-primary"
                onClick={(e) => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Ver mis servicios
              </a>
              <a
                href="https://wa.me/5493434570645"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num gradient-text">+50</span>
                <span className="stat-label">Proyectos</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num gradient-text">+10</span>
                <span className="stat-label">Años de experiencia</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num gradient-text" style={{fontSize:'1rem', lineHeight:'1.3'}}>Lic.</span>
                <span className="stat-label">Sistemas de la Información</span>
              </div>
            </div>
          </div>

          {/* Right column — robot + orbiting tags */}
          <div className="hero-right">

            <div className="orbit-wrapper orbit-1">
              <div className="floating-tag">
                <span className="ftag-icon" style={{background:'rgba(0,180,216,0.15)',color:'#00cfff'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                <span className="ftag-body">
                  <span className="ftag-title">Sitios Web</span>
                  <span className="ftag-sub">Diseño moderno &amp; rápido</span>
                </span>
              </div>
            </div>

            <div className="orbit-wrapper orbit-2">
              <div className="floating-tag">
                <span className="ftag-icon" style={{background:'rgba(139,92,246,0.15)',color:'#a78bfa'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
                </span>
                <span className="ftag-body">
                  <span className="ftag-title">Asistentes de IA</span>
                  <span className="ftag-sub">Bots inteligentes 24/7</span>
                </span>
              </div>
            </div>

            <div className="orbit-wrapper orbit-3">
              <div className="floating-tag">
                <span className="ftag-icon" style={{background:'rgba(52,211,153,0.15)',color:'#34d399'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </span>
                <span className="ftag-body">
                  <span className="ftag-title">Chatbots</span>
                  <span className="ftag-sub">Atención automatizada</span>
                </span>
              </div>
            </div>

            <div className="orbit-wrapper orbit-4">
              <div className="floating-tag">
                <span className="ftag-icon" style={{background:'rgba(251,146,60,0.15)',color:'#fb923c'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.84h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6.29 6.29l1.52-1.16a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 17z"/></svg>
                </span>
                <span className="ftag-body">
                  <span className="ftag-title">Call Center</span>
                  <span className="ftag-sub">Voz + IA integrada</span>
                </span>
              </div>
            </div>

            <div className="orbit-wrapper orbit-5">
              <div className="floating-tag">
                <span className="ftag-icon" style={{background:'rgba(244,63,94,0.15)',color:'#fb7185'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </span>
                <span className="ftag-body">
                  <span className="ftag-title">Redes Sociales</span>
                  <span className="ftag-sub">Contenido &amp; automatización</span>
                </span>
              </div>
            </div>

            <img
              ref={logoRef}
              src="/logo.png"
              alt="ChapsTech"
              className={`hero-logo-img${robotBop ? ' ' + robotBop : ''}`}
              onClick={handleRobotTap}
              style={{ cursor: 'pointer' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
