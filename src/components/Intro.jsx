import { useEffect, useRef, useState } from 'react';
import { Rendija } from '../lib/rendija';

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
  const escenarioRef = useRef(null);

  useEffect(() => {
    if (saltar) return;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* modo privado */ }

    let timer = 0;
    const puerta = Rendija(escenarioRef.current, {
      // con la puerta abierta, a los pocos instantes la página baja sola al hero
      alCambiar: (abierta) => {
        clearTimeout(timer);
        if (abierta) timer = window.setTimeout(irAlHero, 1300);
      },
    });
    return () => { clearTimeout(timer); puerta.destroy(); };
  }, [saltar]);

  if (saltar) return null;

  return (
    <section id="intro" className="rd-escena" aria-label="Entrada">
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
        <button className="rd-saltar" type="button" onClick={irAlHero}>Saltar intro ↓</button>
      </div>
    </section>
  );
};

export default Intro;
