import { useEffect, useRef, useState } from 'react';
import { Rendija } from '../lib/rendija';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createChromaKey } from '../lib/chromaKey';
import { CLIP_BASE, CLIPS } from '../data/mascotScenes';
import { track } from '../lib/analytics';
import { EVENTO_INTRO } from '../lib/intro';

const SEEN_KEY = 'chapstech-intro-seen';

// La intro solo sale en la primera visita de la sesión y no si llegás con un #ancla.
const debeSaltar = () => {
  if (window.location.hash) return true;
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};

const irAlHero = () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('inicio')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Intro = () => {
  const [saltar, setSaltar] = useState(debeSaltar);
  const seccionRef = useRef(null);
  const escenarioRef = useRef(null);
  const pistaRef = useRef(null);
  const zoomRef = useRef(null);
  const flashRef = useRef(null);
  const robotRef = useRef(null);
  const robotLienzoRef = useRef(null);
  const videoRef = useRef(null);
  const reaparece = useRef(false);

  // "Inicio" pide la puerta cuando la intro no estaba en la página
  useEffect(() => {
    const mostrar = () => { reaparece.current = true; setSaltar(false); };
    window.addEventListener(EVENTO_INTRO, mostrar);
    return () => window.removeEventListener(EVENTO_INTRO, mostrar);
  }, []);

  useEffect(() => {
    if (saltar) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* modo privado */ }
    if (reaparece.current) {
      // la puerta se agrega arriba de todo: se va a ella y se recalculan las posiciones del scroll
      reaparece.current = false;
      window.scrollTo({ top: 0, behavior: 'instant' });
      ScrollTrigger.refresh();
    }

    // mientras la puerta ocupa la pantalla, la barra de navegación se esconde (ver .en-intro en App.css)
    // y, al volver a ella, la puerta se cierra de nuevo
    const raiz = document.documentElement;
    let puerta = null;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        const enPantalla = entrada.intersectionRatio > 0.5;
        raiz.classList.toggle('en-intro', enPantalla);
        if (enPantalla) puerta?.cierra();
      },
      { threshold: [0, 0.5, 1] },
    );
    observador.observe(seccionRef.current);

    /* ── el robot cruza volando por detrás de la puerta (dentro de la habitación,
       entre el logo y el muro: solo se lo ve por el vano) ── */
    const robot = robotRef.current;
    const video = videoRef.current;
    const keyer = sinMovimiento() ? null : createChromaKey(robotLienzoRef.current);
    let corriendo = false;
    let cuadroRobot = 0;
    let vuelo = null;
    let delay = null;
    const dibujaRobot = () => {
      cuadroRobot = 0;
      if (!corriendo) return;
      if (video.readyState >= 2) keyer.draw(video);
      cuadroRobot = requestAnimationFrame(dibujaRobot);
    };
    const paraRobot = () => { corriendo = false; cancelAnimationFrame(cuadroRobot); cuadroRobot = 0; video.pause(); };
    if (keyer) {
      keyer.resize(600, 642);
      video.src = CLIP_BASE + CLIPS.vueloVelocidad;
      video.load();
      gsap.set(robot, { autoAlpha: 0 });
    }
    const volar = () => {
      if (!keyer || video.readyState < 1) return;
      vuelo?.kill();
      video.currentTime = 0;
      video.play().catch(() => {});
      corriendo = true;
      if (!cuadroRobot) cuadroRobot = requestAnimationFrame(dibujaRobot);
      // de derecha a izquierda, a toda velocidad, con un leve vaivén
      gsap.set(robot, { x: 1010, y: 300, z: -250, rotation: -5 });
      vuelo = gsap.timeline({ onComplete: paraRobot })
        .to(robot, { autoAlpha: 1, duration: 0.06 }, 0)
        .to(robot, { x: 170, duration: 0.8, ease: 'power1.inOut' }, 0)
        .to(robot, { y: 255, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0)
        .to(robot, { rotation: 4, duration: 0.8, ease: 'sine.inOut' }, 0)
        .to(robot, { autoAlpha: 0, duration: 0.06 }, '>-0.06');
    };

    /* ── entrar: la cámara atraviesa el vano, la luz lo inunda todo y aparece la página ── */
    let timer = 0;
    let entrando = false;
    let travesia = null;
    const entrar = () => {
      if (entrando) return;
      clearTimeout(timer);
      track('intro_entrar');
      const hero = document.getElementById('inicio');
      if (sinMovimiento() || !hero) { irAlHero(); return; }
      entrando = true;
      vuelo?.progress(1);

      // el vano está en el centro del escenario (un poco más arriba que el centro exacto)
      const sec = seccionRef.current.getBoundingClientRect();
      const esc = escenarioRef.current.getBoundingClientRect();
      const k = esc.width / 1280;
      const zoom = zoomRef.current;
      const escala = 1.25 * Math.max(sec.width / (210 * k), sec.height / (400 * k));
      gsap.set(zoom, { transformOrigin: (sec.width / 2) + 'px ' + (sec.height / 2 - 10 * k) + 'px' });
      pistaRef.current.parentElement.style.opacity = '0';

      travesia = gsap.timeline({ onComplete: () => { entrando = false; } })
        .to(zoom, { scale: escala, duration: 1.15, ease: 'power3.in' }, 0)
        .to(flashRef.current, { opacity: 1, duration: 0.5, ease: 'power2.in' }, 0.65)
        .add(() => {
          // tapado por la luz: se salta a la página y la puerta vuelve a su sitio
          const y = hero.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, behavior: 'instant' });
          gsap.set(zoom, { clearProps: 'transform' });
          pistaRef.current.parentElement.style.opacity = '';
        }, 1.15)
        .fromTo(hero, { scale: 1.06, transformOrigin: '50% 35%' }, { scale: 1, duration: 1.2, ease: 'power3.out', clearProps: 'transform', immediateRender: false }, 1.15)
        .to(flashRef.current, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 1.2);
    };

    puerta = Rendija(escenarioRef.current, {
      // con la puerta abierta pasa el robot; otro clic entra, y si no, se entra solo al rato
      alCambiar: (abierta) => {
        clearTimeout(timer);
        delay?.kill();
        pistaRef.current.textContent = abierta ? 'Tocá otra vez para pasar' : 'Tocá la puerta para entrar';
        if (abierta) {
          track('intro_puerta_abierta');
          delay = gsap.delayedCall(0.35, volar);
          // solo entra sola si la puerta sigue en pantalla (si el visitante ya se fue, no se lo trae de vuelta)
          timer = window.setTimeout(() => { if (raiz.classList.contains('en-intro')) entrar(); }, 3200);
        }
      },
      alEntrar: entrar,
    });
    return () => {
      clearTimeout(timer);
      delay?.kill();
      vuelo?.kill();
      travesia?.kill();
      paraRobot();
      keyer?.destroy();
      puerta.destroy();
      observador.disconnect();
      raiz.classList.remove('en-intro');
    };
  }, [saltar]);

  if (saltar) return null;

  return (
    <section id="intro" className="rd-escena" aria-label="Entrada" ref={seccionRef}>
      <div className="rd-zoom" ref={zoomRef}>
      <div className="rd-escenario" ref={escenarioRef}>
        <div className="rd-mundo" aria-hidden="true">
          <div className="rd-cuarto-fondo"><img src="/chapstech-v2.png" alt="" draggable="false" /></div>
          <div className="rd-cuarto-suelo" />
          <div className="rd-robot" ref={robotRef}><canvas ref={robotLienzoRef} /></div>
          <div className="rd-pared" />
          <div className="rd-jamba rd-jamba-izq" />
          <div className="rd-jamba rd-jamba-der" />
          <div className="rd-jamba rd-dintel" />
          <div className="rd-jamba rd-umbral" />
          <div className="rd-marco" />
          <div className="rd-puerta">
            <span className="rd-tablero" /><span className="rd-tablero" />
            <span className="rd-pomo" />
            <span className="rd-canto" />
          </div>
        </div>
        <canvas className="rd-luz" />
        <button className="rd-tirador" type="button" aria-pressed="false" aria-label="Abrir la puerta" />
      </div>
      </div>
      <video className="rd-video" ref={videoRef} muted playsInline preload="auto" tabIndex={-1} aria-hidden="true" />
      <div className="rd-flash" ref={flashRef} aria-hidden="true" />
      <div className="rd-pie">
        <p className="rd-pista" ref={pistaRef}>Tocá la puerta para entrar</p>
        <button className="rd-saltar" type="button" onClick={() => { track('intro_saltar'); irAlHero(); }}>Saltar intro ↓</button>
      </div>
    </section>
  );
};

export default Intro;
