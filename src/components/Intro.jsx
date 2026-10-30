import { useEffect, useRef, useState } from 'react';
import { Rendija } from '../lib/rendija';
import { track } from '../lib/analytics';

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

const Intro = () => {
  const [saltar] = useState(debeSaltar);
  const seccionRef = useRef(null);
  const escenarioRef = useRef(null);

  useEffect(() => {
    if (saltar) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* modo privado */ }

    // mientras la puerta ocupa la pantalla, la barra de navegación se esconde (ver .en-intro en App.css)
    const raiz = document.documentElement;
    const observador = new IntersectionObserver(
      ([entrada]) => raiz.classList.toggle('en-intro', entrada.intersectionRatio > 0.5),
      { threshold: [0, 0.5, 1] },
    );
    observador.observe(seccionRef.current);

    let timer = 0;
    const puerta = Rendija(escenarioRef.current, {
      // con la puerta abierta, a los pocos instantes la página baja sola al hero
      alCambiar: (abierta) => {
        clearTimeout(timer);
        if (abierta) { track('intro_puerta_abierta'); timer = window.setTimeout(irAlHero, 1300); }
      },
    });
    return () => {
      clearTimeout(timer);
      puerta.destroy();
      observador.disconnect();
      raiz.classList.remove('en-intro');
    };
  }, [saltar]);

  if (saltar) return null;

  return (
    <section id="intro" className="rd-escena" aria-label="Entrada" ref={seccionRef}>
      <div className="rd-escenario" ref={escenarioRef}>
        <div className="rd-mundo" aria-hidden="true">
          <div className="rd-cuarto-fondo"><img src="/chapstech-v2.png" alt="" draggable="false" /></div>
          <div className="rd-cuarto-suelo" />
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
      <div className="rd-pie">
        <p className="rd-pista">Tocá la puerta para entrar</p>
        <button className="rd-saltar" type="button" onClick={() => { track('intro_saltar'); irAlHero(); }}>Saltar intro ↓</button>
      </div>
    </section>
  );
};

export default Intro;
