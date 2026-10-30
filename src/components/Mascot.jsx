import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { createChromaKey } from '../lib/chromaKey';
import { CLIP_BASE, CLIPS, SCENES, SERVICE_KEYS } from '../data/mascotScenes';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FLIGHT_MS = 800;
const BUBBLE_KEY = 'chapstech-mascot-bubble';

// Robot que acompaña al visitante: cambia de clip y de mensaje según la
// sección que se está viendo. Sale del hero (que ya tiene su propio robot).
const Mascot = () => {
  const rootRef = useRef(null);
  const bubbleRef = useRef(null);
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const tagRef = useRef(null);
  const ghostRef = useRef(null);
  const typedRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const bubble = bubbleRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const keyer = createChromaKey(canvas);
    if (!keyer) return; // sin WebGL no se muestra la mascota

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let bubbleClosed = false;
    try { bubbleClosed = sessionStorage.getItem(BUBBLE_KEY) === 'closed'; } catch { /* modo privado */ }

    let current = null;
    let timer = 0;
    let flightStart = 0;
    let settle = 0;
    let typeTween = null;
    let running = false;
    let handle = 0;
    let frameReady = false;
    let wantShown = false;
    let shown = false;

    gsap.set(root, { autoAlpha: 0, y: 60, scale: 0.8 });
    gsap.set(bubble, { autoAlpha: 0, y: 8 });

    /* ── dibujo: cada cuadro del video pasa por el recorte de verde ── */
    const applyVisibility = () => {
      const on = wantShown && frameReady;
      if (on === shown) return;
      shown = on;
      gsap.to(root, on
        ? { autoAlpha: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.7, ease: 'back.out(1.5)', overwrite: true }
        : { autoAlpha: 0, y: 60, scale: 0.8, duration: reduce ? 0 : 0.4, ease: 'power2.in', overwrite: true });
    };
    const draw = () => {
      if (video.readyState < 2 || video.seeking) return;
      keyer.draw(video);
      if (!frameReady) { frameReady = true; applyVisibility(); }
    };
    const schedule = () => {
      if (!running || handle) return;
      handle = video.requestVideoFrameCallback
        ? video.requestVideoFrameCallback(render)
        : requestAnimationFrame(render);
    };
    function render() {
      handle = 0;
      if (!running) return;
      draw();
      schedule();
    }
    const cancel = () => {
      if (!handle) return;
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
      handle = 0;
    };
    const play = () => {
      const p = video.play();
      if (p) p.catch(() => window.addEventListener('pointerdown', () => video.play().catch(() => {}), { once: true }));
    };
    const start = () => { running = true; schedule(); if (!reduce) play(); };
    const stop = () => { running = false; cancel(); video.pause(); };
    const setClip = (name) => {
      if (video.dataset.clip === name) return;
      video.dataset.clip = name;
      video.src = CLIP_BASE + CLIPS[name];
      if (running && !reduce) play();
    };
    // con movimiento reducido el clip queda en su primer cuadro
    const onData = () => { draw(); if (reduce) video.pause(); };
    video.addEventListener('loadeddata', onData);
    const onVis = () => {
      if (!running) return;
      if (document.hidden) { video.pause(); cancel(); } else { schedule(); if (!reduce) play(); }
    };
    document.addEventListener('visibilitychange', onVis);

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      keyer.resize(Math.max(2, Math.round(canvas.clientWidth * dpr)), Math.max(2, Math.round(canvas.clientHeight * dpr)));
      if (frameReady) draw();
    };
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(canvas);
    sizeCanvas();

    /* ── globo de texto ── */
    const showBubble = (scene) => {
      tagRef.current.textContent = scene.tag;
      ghostRef.current.textContent = scene.text; // reserva el alto final del globo
      typeTween?.kill();
      if (bubbleClosed) { gsap.set(bubble, { autoAlpha: 0 }); return; }
      gsap.to(bubble, { autoAlpha: 1, y: 0, duration: reduce ? 0 : 0.35, overwrite: true });
      if (reduce) { typedRef.current.textContent = scene.text; return; }
      const o = { n: 0 };
      typedRef.current.textContent = '';
      typeTween = gsap.to(o, {
        n: scene.text.length,
        duration: Math.min(1.8, scene.text.length * 0.022),
        ease: 'none',
        onUpdate: () => { typedRef.current.textContent = scene.text.slice(0, Math.round(o.n)); },
      });
    };
    const hideBubble = () => {
      typeTween?.kill();
      gsap.to(bubble, { autoAlpha: 0, y: 8, duration: reduce ? 0 : 0.2, overwrite: true });
    };
    const setClosed = (v) => {
      bubbleClosed = v;
      try { sessionStorage.setItem(BUBBLE_KEY, v ? 'closed' : 'open'); } catch { /* modo privado */ }
      if (v) hideBubble();
      else if (current && current !== 'hidden') showBubble(SCENES[current]);
    };
    const onClose = (e) => { e.stopPropagation(); setClosed(true); };
    const onBody = () => setClosed(!bubbleClosed);
    closeRef.current.addEventListener('click', onClose);
    bodyRef.current.addEventListener('click', onBody);

    /* ── qué escena toca ── */
    const go = (key) => {
      if (key === current) return;
      const wasHidden = current === null || current === 'hidden';
      const now = performance.now();
      // si ya venía volando, apunta a la escena nueva sin empezar el vuelo de cero:
      // con scroll lento llega enseguida; con scroll muy rápido espera, pero no para siempre
      const inFlight = timer !== 0;
      if (!inFlight) flightStart = now;
      current = key;
      clearTimeout(timer);
      timer = 0;

      if (key === 'hidden') {
        wantShown = false;
        applyVisibility();
        stop();
        hideBubble();
        return;
      }
      const scene = SCENES[key];
      // al cambiar de sección el robot "vuela" un momento y llega con su mensaje
      setClip(reduce ? scene.clip : 'volando');
      if (wasHidden) { wantShown = true; start(); applyVisibility(); }
      if (reduce) { showBubble(scene); return; }
      hideBubble();
      const wait = wasHidden ? FLIGHT_MS + 300 : inFlight ? Math.max(250, FLIGHT_MS - (now - flightStart)) : FLIGHT_MS;
      timer = window.setTimeout(() => {
        timer = 0;
        setClip(scene.clip);
        showBubble(scene);
      }, wait);
    };

    const sectionTrigger = (selector, key) => {
      const el = document.querySelector(selector);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => { if (self.isActive) go(key); },
      });
    };

    // (con elementos y no con selectores: useGSAP resuelve los textos dentro de .mascot)
    ScrollTrigger.create({
      trigger: document.querySelector('#inicio'),
      start: 'top top',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) go('hidden'); },
    });
    sectionTrigger('.techstack', 'hola');
    sectionTrigger('.services .section-header', 'servicios');
    sectionTrigger('.process', 'proceso');
    sectionTrigger('#sobre-mi', 'sobre');
    sectionTrigger('#contacto', 'contacto');

    // los servicios: uno por tramo de scroll y, con mouse, el de la tarjeta que se mira
    const grid = document.querySelector('.services-grid');
    let lastIdx = -1;
    let gridActive = false;
    let onOver = null;
    if (grid) {
      const pick = (self) => {
        const idx = Math.min(SERVICE_KEYS.length - 1, Math.floor(self.progress * SERVICE_KEYS.length));
        if (idx !== lastIdx) { lastIdx = idx; go(SERVICE_KEYS[idx]); }
      };
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 70%',
        end: 'bottom 45%',
        onToggle: (self) => { gridActive = self.isActive; if (self.isActive) { lastIdx = -1; pick(self); } },
        onUpdate: pick,
      });
      onOver = (e) => {
        if (e.pointerType !== 'mouse' || !gridActive) return;
        const card = e.target.closest('.service-card');
        const key = card && SERVICE_KEYS[[...grid.children].indexOf(card)];
        if (key) go(key);
      };
      grid.addEventListener('pointerover', onOver);
    }

    // al bajar rápido el robot se inclina y se queda un poco atrás, como si volara con vos
    if (!reduce) {
      const yTo = gsap.quickTo(innerRef.current, 'y', { duration: 0.5, ease: 'power3' });
      const rTo = gsap.quickTo(innerRef.current, 'rotation', { duration: 0.6, ease: 'power3' });
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          yTo(gsap.utils.clamp(-22, 22, -v / 140));
          rTo(gsap.utils.clamp(-9, 9, v / 450));
          clearTimeout(settle);
          settle = window.setTimeout(() => { yTo(0); rTo(0); }, 120);
        },
      });
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(settle);
      typeTween?.kill();
      stop();
      ro.disconnect();
      video.removeEventListener('loadeddata', onData);
      document.removeEventListener('visibilitychange', onVis);
      closeRef.current?.removeEventListener('click', onClose);
      bodyRef.current?.removeEventListener('click', onBody);
      if (grid && onOver) grid.removeEventListener('pointerover', onOver);
      keyer.destroy();
    };
  }, { scope: rootRef });

  return (
    <div className="mascot" ref={rootRef}>
      <div className="mascot-bubble" ref={bubbleRef} role="note">
        <button className="mascot-close" ref={closeRef} type="button" aria-label="Cerrar mensaje">×</button>
        <span className="mascot-tag" ref={tagRef} />
        <p className="mascot-text">
          <span className="mascot-ghost" ref={ghostRef} aria-hidden="true" />
          <span className="mascot-typed" ref={typedRef} />
        </p>
      </div>
      <button className="mascot-body" ref={bodyRef} type="button" aria-label="Mostrar u ocultar el mensaje del robot">
        <div className="mascot-inner" ref={innerRef}>
          <canvas ref={canvasRef} />
        </div>
      </button>
      <video className="mascot-video" ref={videoRef} muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
    </div>
  );
};

export default Mascot;
