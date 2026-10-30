import { useEffect, useRef, useState } from 'react';
import { Rendija } from '../lib/rendija';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const Intro = () => {
  const [saltar, setSaltar] = useState(debeSaltar);
  const seccionRef = useRef(null);
  const escenarioRef = useRef(null);
  const pistaRef = useRef(null);
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

    let timer = 0;
    puerta = Rendija(escenarioRef.current, {
      // con la puerta abierta, otro clic entra; y si no, la página baja sola al rato
      alCambiar: (abierta) => {
        clearTimeout(timer);
        pistaRef.current.textContent = abierta ? 'Tocá otra vez para pasar' : 'Tocá la puerta para entrar';
        if (abierta) {
          track('intro_puerta_abierta');
          // solo baja sola si la puerta sigue en pantalla (si el visitante ya se fue, no se lo trae de vuelta)
          timer = window.setTimeout(() => { if (raiz.classList.contains('en-intro')) irAlHero(); }, 2500);
        }
      },
      alEntrar: () => { clearTimeout(timer); track('intro_entrar'); irAlHero(); },
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
        <p className="rd-pista" ref={pistaRef}>Tocá la puerta para entrar</p>
        <button className="rd-saltar" type="button" onClick={() => { track('intro_saltar'); irAlHero(); }}>Saltar intro ↓</button>
      </div>
    </section>
  );
};

export default Intro;
