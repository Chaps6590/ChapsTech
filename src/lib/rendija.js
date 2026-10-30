/* Rendija · Moxen — moxen.cl/recursos · Licencia de uso: recursos/moxen-rendija/LICENCIA.txt
   Adaptada a módulo ES: devuelve destroy(), llama a alCambiar(abierta) y deja de
   animar cuando la puerta se queda quieta. Los derechos de autor son de Moxen.

   Una puerta en una pared a oscuras, con una habitación encendida detrás. Al pasar
   el cursor se entorna; con un clic se abre hacia dentro con un resorte y la luz
   sale al suelo en un trapecio proyectado desde la lámpara por el hueco que deja
   la puerta. */

const GRADO = Math.PI / 180;
/* El mundo, en px del escenario (igual que en el CSS): el vano, el ojo, la
   perspectiva y la lámpara de la habitación, que cuelga detrás de la pared. */
const VANO = { x0: 535, x1: 745, y0: 190, y1: 590 }, ANCHO = 210, MURO = 26;
const OJO = { x: 640, y: 330 }, P = 900;
const LAMPARA = { x: 655, y: 120, z: -300 };
const LEJOS = 700; // hasta dónde se dibuja el suelo (z)

// un punto del mundo (z hacia quien mira) en la pantalla del escenario
const proyecta = (x, y, z) => { const k = P / (P - z); return [OJO.x + (x - OJO.x) * k, OJO.y + (y - OJO.y) * k]; };

export function Rendija(escenario, opciones) {
  const o = Object.assign({ abierta: 84, entornada: 11, alCambiar: null }, opciones);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const puerta = escenario.querySelector('.rd-puerta');
  const lienzo = escenario.querySelector('.rd-luz');
  const boton = escenario.querySelector('.rd-tirador');
  const g = lienzo.getContext('2d');
  const luz = (getComputedStyle(escenario).getPropertyValue('--rd-luz') || '255,255,255').trim();
  // Safari no soporta ctx.filter: ahí el desenfoque lo hace el CSS sobre todo el lienzo
  const desenfoque = 'filter' in g;
  if (!desenfoque) lienzo.style.filter = 'blur(7px)';
  // el lienzo sobra 400 px por los lados y 200/400 arriba y abajo; la luz es difusa: basta 1:1
  lienzo.width = 2080; lienzo.height = 1400;

  let th = 0, v = 0, meta = 0, abierta = false, encima = false, antes = 0, dibujado = -1, raf = 0;
  const filtro = (f) => { if (desenfoque) g.filter = f; };

  /* ── la luz ─────────────────────────────────────────────────────────
     La puerta gira hacia dentro por la izquierda: su borde libre queda en
     (x0 + A·cos θ, z = −muro − A·sen θ). El rayo de la lámpara que roza
     ese borde corta el plano de la pared en xg; la luz pasa entre xg y la
     jamba derecha. Cada punto del suelo por delante (z > 0) recibe luz si
     su rayo pasó por ese hueco: un trapecio que se abre con la distancia. */
  function hueco() {
    const ex = VANO.x0 + ANCHO * Math.cos(th * GRADO), ez = -MURO - ANCHO * Math.sin(th * GRADO);
    const t = (0 - LAMPARA.z) / (ez - LAMPARA.z);
    const xg = LAMPARA.x + (ex - LAMPARA.x) * t;
    return Math.max(VANO.x0, Math.min(VANO.x1, xg));
  }
  const enSuelo = (xPared, z) => LAMPARA.x + (xPared - LAMPARA.x) * (z - LAMPARA.z) / (0 - LAMPARA.z);

  function dibuja() {
    g.setTransform(1, 0, 0, 1, 400, 200);
    g.clearRect(-400, -200, 2080, 1400);
    const xg = hueco();
    const ab = Math.max(0, (VANO.x1 - xg) / ANCHO); // cuánto hueco hay, de 0 a 1
    const c = a => 'rgba(' + luz + ',' + a.toFixed(3) + ')';

    // la línea bajo la puerta: siempre, aunque esté cerrada
    filtro('blur(5px)');
    const b0 = proyecta(VANO.x0 + 6, VANO.y1, 0), b1 = proyecta(VANO.x1 - 6, VANO.y1, 0);
    const b2 = proyecta(VANO.x1 + 10, VANO.y1, 46), b3 = proyecta(VANO.x0 - 10, VANO.y1, 46);
    let gr = g.createLinearGradient(0, b0[1], 0, b2[1]);
    gr.addColorStop(0, c(.32)); gr.addColorStop(1, c(0));
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(...b0); g.lineTo(...b1); g.lineTo(...b2); g.lineTo(...b3); g.closePath(); g.fill();

    if (ab > .002) {
      // la mancha del suelo: el hueco proyectado, que se apaga a lo lejos
      const n0 = proyecta(xg, VANO.y1, 0), n1 = proyecta(VANO.x1, VANO.y1, 0);
      const f1 = proyecta(enSuelo(VANO.x1, LEJOS), VANO.y1, LEJOS), f0 = proyecta(enSuelo(xg, LEJOS), VANO.y1, LEJOS);
      filtro('blur(' + (6 + 10 * ab).toFixed(1) + 'px)');
      gr = g.createLinearGradient(0, n0[1], 0, f0[1]);
      gr.addColorStop(0, c(.62 * Math.min(1, ab * 3)));
      gr.addColorStop(.35, c(.3 * Math.min(1, ab * 3)));
      gr.addColorStop(1, c(0));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(...n0); g.lineTo(...n1); g.lineTo(...f1); g.lineTo(...f0); g.closePath(); g.fill();

      /* El haz en el aire: del hueco (arriba, en la pared) a la mancha
         (abajo, lejos). Muy tenue: es polvo iluminado, no una lámpara. */
      const a0 = proyecta(xg, VANO.y0 + 30, 0), a1 = proyecta(VANO.x1, VANO.y0 + 30, 0);
      filtro('blur(18px)');
      gr = g.createLinearGradient(0, a0[1], 0, f0[1]);
      gr.addColorStop(0, c(.1 * ab)); gr.addColorStop(.6, c(.07 * ab)); gr.addColorStop(1, c(0));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(...a0); g.lineTo(...a1); g.lineTo(...f1); g.lineTo(...f0); g.closePath(); g.fill();

      // el halo alrededor del hueco
      filtro('none');
      const cx = (xg + VANO.x1) / 2, cy = (VANO.y0 + VANO.y1) / 2;
      const h = g.createRadialGradient(cx, cy, 20, cx, cy, 300);
      h.addColorStop(0, c(.16 * ab)); h.addColorStop(1, c(0));
      g.fillStyle = h;
      g.fillRect(cx - 320, cy - 320, 640, 640);
    }
    filtro('none');
  }

  /* ── la puerta ──────────────────────────────────────────────────────
     Un resorte con algo de rebote hacia el ángulo pedido. Contra el
     marco (θ = 0) choca y rebota perdiendo casi todo: un portazo suave. */
  function paso(dt) {
    const k = 55, c = 6.5;
    v += ((meta - th) * k - v * c) * dt;
    th += v * dt;
    if (th < 0) { th = 0; v = -v * .28; }
  }
  function pinta() {
    puerta.style.setProperty('--rd-giro', th.toFixed(3) + 'deg');
    // la cara deja de mirarnos y se apaga; el canto mira hacia la luz
    puerta.style.setProperty('--rd-apaga', (Math.sin(th * GRADO) * .55).toFixed(3));
    puerta.style.setProperty('--rd-ilumina', Math.min(1, Math.sin(th * GRADO) * 1.6).toFixed(3));
    if (Math.abs(th - dibujado) > .01) { dibuja(); dibujado = th; }
  }
  function cuadro(t) {
    const dt = Math.min(.05, antes ? (t - antes) / 1000 : 1 / 60);
    antes = t;
    if (reduce) { th = meta; v = 0; }
    else { const n = Math.ceil(dt / (1 / 240)); for (let i = 0; i < n; i++) paso(dt / n); }
    // quieta: se posa en la meta y deja de animar hasta el próximo cambio
    const quieta = Math.abs(th - meta) < .02 && Math.abs(v) < .05;
    if (quieta) { th = meta; v = 0; }
    pinta();
    raf = quieta ? 0 : requestAnimationFrame(cuadro);
  }
  const anima = () => { if (!raf) { antes = 0; raf = requestAnimationFrame(cuadro); } };

  function decide() {
    const cambio = abierta !== (boton.getAttribute('aria-pressed') === 'true');
    meta = abierta ? o.abierta : (encima ? o.entornada : 0);
    boton.setAttribute('aria-pressed', String(abierta));
    boton.setAttribute('aria-label', abierta ? 'Cerrar la puerta' : 'Abrir la puerta');
    anima();
    if (cambio && o.alCambiar) o.alCambiar(abierta);
  }
  const abre = () => { abierta = true; decide(); };
  const cierra = () => { abierta = false; decide(); };
  const alterna = () => { abierta = !abierta; decide(); };
  const entra = e => { if (e.pointerType === 'mouse') { encima = true; decide(); } };
  const sale = () => { encima = false; decide(); };
  boton.addEventListener('pointerenter', entra);
  boton.addEventListener('pointerleave', sale);
  boton.addEventListener('click', alterna);

  // el escenario mide 1280 × 800: se escala para caber, con la puerta al centro
  function ajusta() {
    const k = Math.min(1.15, innerWidth / 640, innerHeight / 800);
    escenario.style.transform = 'scale(' + k.toFixed(4) + ')';
  }
  addEventListener('resize', ajusta);
  ajusta();
  dibuja();
  anima();

  function destroy() {
    cancelAnimationFrame(raf); raf = 0;
    removeEventListener('resize', ajusta);
    boton.removeEventListener('pointerenter', entra);
    boton.removeEventListener('pointerleave', sale);
    boton.removeEventListener('click', alterna);
  }
  return { abre, cierra, alterna, destroy };
}
