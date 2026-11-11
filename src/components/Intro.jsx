import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { track } from '../lib/analytics';
import { EVENTO_INTRO } from '../lib/intro';

const SEEN_KEY = 'chapstech-intro-seen';

// La intro solo sale en la primera visita de la sesión y no si llegás con un #ancla.
const debeSaltar = () => {
  if (window.location.hash) return true;
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const irAlHero = () => {
  document.getElementById('inicio')?.scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth', block: 'start' });
};

const ABIERTA = -112;  // grados: la hoja gira hacia quien mira, por la izquierda
const NEON = 3;        // segundos: lo que tarda el cartel en encenderse antes de que se abra la puerta
const ESPERA = 6000;   // con la puerta abierta, se entra solo al rato

// estrellas fugaces: dónde nacen (en % del vano), hacia dónde van, cada cuánto y con qué desfase
const FUGACES = [
  { x: 8, y: 6, giro: 32, dura: 3.4, desfase: 0 },
  { x: 62, y: 2, giro: 128, dura: 4.6, desfase: 1.1 },
  { x: 30, y: 38, giro: 24, dura: 5.2, desfase: 2.3 },
  { x: 92, y: 30, giro: 146, dura: 3.9, desfase: 0.6 },
  { x: 14, y: 62, giro: 40, dura: 6.1, desfase: 3.4 },
  { x: 78, y: 58, giro: 136, dura: 4.3, desfase: 2.0 },
];

/* Una puerta en un cuarto a oscuras que, al llegar, se abre sola de a poco: detrás
   hay un cosmos en movimiento. Antes, arriba, se enciende parpadeando la marca en neón. Son dos fotos del
   mismo cuarto (puerta cerrada y vano abierto) que calzan al píxel y se funden
   mientras gira la hoja. Todo se anima con opacity y transform: lo compone la GPU. */
const Intro = () => {
  const [saltar, setSaltar] = useState(debeSaltar);
  const seccionRef = useRef(null);
  const zoomRef = useRef(null);
  const abiertoRef = useRef(null);
  const vanoRef = useRef(null);
  const hojaRef = useRef(null);
  const sombraRef = useRef(null);
  const rendijaRef = useRef(null);
  const puertaRef = useRef(null);
  const flashRef = useRef(null);
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

    const raiz = document.documentElement;
    const seccion = seccionRef.current;
    const zoom = zoomRef.current;
    const hoja = hojaRef.current;
    const sombra = sombraRef.current;
    const rendija = rendijaRef.current;
    const abierto = abiertoRef.current;
    const boton = puertaRef.current;
    const flash = flashRef.current;
    let vivo = true;
    let abierta = false;
    let quierePasar = false;
    let entrando = false;
    let timer = 0;
    let travesia = null;

    /* ── entrar: la cámara atraviesa la puerta, la luz lo inunda todo y aparece la página ── */
    const entrar = () => {
      if (entrando) return;
      clearTimeout(timer);
      track('intro_entrar');
      const hero = document.getElementById('inicio');
      if (sinMovimiento() || !hero) { irAlHero(); return; }
      entrando = true;
      seccion.classList.add('is-entrando');

      // se agranda desde el centro del vano hasta que el cosmos tapa la pantalla
      const sec = seccion.getBoundingClientRect();
      const vano = vanoRef.current.getBoundingClientRect();
      const escala = 1.25 * Math.max(sec.width / vano.width, sec.height / vano.height);
      gsap.set(zoom, {
        transformOrigin: (vano.left + vano.width / 2 - sec.left) + 'px ' + (vano.top + vano.height / 2 - sec.top) + 'px',
      });

      travesia = gsap.timeline({ onComplete: () => { entrando = false; } })
        .to(zoom, { scale: escala, duration: 2.2, ease: 'power2.in' }, 0)
        .to(flash, { opacity: 1, duration: 0.9, ease: 'power2.in' }, 1.3)
        .add(() => {
          // tapado por la luz: se salta a la página y la escena vuelve a su sitio
          const y = hero.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, behavior: 'instant' });
          gsap.set(zoom, { clearProps: 'transform,transformOrigin' });
          seccion.classList.remove('is-entrando');
        }, 2.2)
        .fromTo(hero, { scale: 1.06, transformOrigin: '50% 35%' }, { scale: 1, duration: 2, ease: 'power3.out', clearProps: 'transform', immediateRender: false }, 2.2)
        .to(flash, { opacity: 0, duration: 1.5, ease: 'power2.out' }, 2.25);
    };

    /* ── la puerta se abre sola ── */
    const yaAbierta = () => {
      abierta = true;
      seccion.classList.add('is-abierta');
      boton.setAttribute('aria-label', 'Entrar al sitio');
      track('intro_puerta_abierta');
      if (quierePasar) { entrar(); return; }
      // solo entra sola si la puerta sigue en pantalla (si el visitante ya se fue, no se lo trae de vuelta)
      if (!sinMovimiento()) timer = window.setTimeout(() => { if (raiz.classList.contains('en-intro')) entrar(); }, ESPERA);
    };
    const apertura = gsap.timeline({ paused: true, onComplete: yaAbierta })
      .to(hoja, { rotationY: ABIERTA, duration: 6.2, ease: 'power2.inOut' }, 0)
      .to(abierto, { opacity: 1, duration: 5.2, ease: 'power1.inOut' }, 0.6)
      // la cara que da al cuarto se oscurece al girar; la luz de abajo ya no hace falta: sale por el vano
      .to(sombra, { opacity: 0.5, duration: 3.4, ease: 'power1.in' }, 0)
      .to(rendija, { opacity: 0, duration: 1.8, ease: 'power1.out' }, 0.3);

    if (sinMovimiento()) {
      seccion.classList.add('is-neon');
      apertura.progress(1);
    } else {
      // espera a que el cuarto esté pintado (o un rato, si la red viene lenta) y abre
      const fotos = [...seccion.querySelectorAll('.pt-img')].map((f) => f.decode().catch(() => {}));
      const tope = new Promise((listo) => { window.setTimeout(listo, 2500); });
      Promise.race([Promise.all(fotos), tope]).then(() => {
        if (!vivo) return;
        // primero se enciende el neón, parpadeando (ver .is-neon en App.css); después se abre la puerta
        seccion.classList.add('is-neon');
        apertura.delay(NEON).restart(true);
      });
    }

    // tocar la puerta es pasar; si todavía se está abriendo, termina de abrirse rápido y se pasa
    const clic = () => {
      if (abierta) { entrar(); return; }
      quierePasar = true;
      apertura.timeScale(5).play();
    };
    boton.addEventListener('click', clic);

    // mientras la puerta ocupa la pantalla, la barra de navegación se esconde y el cosmos se mueve
    // (ver .en-intro en App.css); fuera de ella, las animaciones quedan en pausa
    const observador = new IntersectionObserver(
      ([entrada]) => { raiz.classList.toggle('en-intro', entrada.intersectionRatio > 0.5); },
      { threshold: [0, 0.5, 1] },
    );
    observador.observe(seccion);

    return () => {
      vivo = false;
      clearTimeout(timer);
      apertura.kill();
      travesia?.kill();
      gsap.set([zoom, flash, hoja, abierto, sombra, rendija], { clearProps: 'all' });
      seccion.classList.remove('is-neon', 'is-abierta', 'is-entrando');
      boton.removeEventListener('click', clic);
      observador.disconnect();
      raiz.classList.remove('en-intro');
    };
  }, [saltar]);

  if (saltar) return null;

  return (
    <section id="intro" className="pt-escena" aria-label="Entrada" ref={seccionRef}>
      <div className="pt-zoom" ref={zoomRef}>
        <div className="pt-lienzo">
          <img className="pt-img" src="/intro/cuarto-cerrado.webp" alt="" draggable="false" fetchpriority="high" />
          <img className="pt-img pt-img-abierto" src="/intro/cuarto-abierto.webp" alt="" draggable="false" ref={abiertoRef} />

          {/* el vano: una ventana al cosmos, que no para de moverse */}
          <div className="pt-vano" ref={vanoRef} aria-hidden="true">
            <div className="pt-nebulosa" />
            <div className="pt-nebulosa pt-nebulosa-2" />
            <div className="pt-estrellas" />
            <div className="pt-estrellas pt-estrellas-2" />
            <div className="pt-estrellas pt-estrellas-3" />
            <span className="pt-lucero pt-lucero-1" />
            <span className="pt-lucero pt-lucero-2" />
            <span className="pt-lucero pt-lucero-3" />
            {FUGACES.map((f, i) => (
              <span
                key={i}
                className="pt-fugaz"
                style={{ left: f.x + '%', top: f.y + '%', '--giro': f.giro + 'deg', animationDuration: f.dura + 's', animationDelay: f.desfase + 's' }}
              />
            ))}
          </div>

          {/* la hoja de la puerta, con sus dos caras */}
          <div className="pt-hoja-caja" aria-hidden="true">
            <div className="pt-hoja" ref={hojaRef}>
              <span className="pt-cara"><span className="pt-sombra" ref={sombraRef} /></span>
              <span className="pt-cara pt-dorso" />
              <span className="pt-canto" />
            </div>
          </div>

          {/* la luz del cosmos que se cuela por debajo de la puerta cerrada */}
          <span className="pt-rendija" ref={rendijaRef} aria-hidden="true" />

          {/* la marca en tubos de neón: el vidrio apagado y, encima, la luz de cada palabra */}
          <div className="pt-neon" role="img" aria-label="ChapsTech">
            <span className="pt-resplandor" />
            <span className="pt-tubo pt-tubo-apagado" aria-hidden="true">ChapsTech</span>
            <span className="pt-tubo pt-tubo-luz" aria-hidden="true">
              <span className="pt-luz-a">Chaps</span><span className="pt-luz-b">Tech</span>
            </span>
          </div>
          <button className="pt-puerta" type="button" aria-label="Abrir la puerta" ref={puertaRef} />
        </div>
      </div>
      <div className="pt-flash" ref={flashRef} aria-hidden="true" />
      <div className="pt-pie">
        <p className="pt-pista">Tocá la puerta para entrar</p>
        <button className="pt-saltar" type="button" onClick={() => { track('intro_saltar'); irAlHero(); }}>Saltar intro ↓</button>
      </div>
    </section>
  );
};

export default Intro;
