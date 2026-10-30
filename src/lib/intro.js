// "Inicio" lleva a la puerta. Si la intro no se mostró en esta sesión (o se llegó
// con un #ancla), no está en la página: se le pide a Intro.jsx que aparezca.
export const EVENTO_INTRO = 'chapstech:mostrar-intro';

export const volverALaPuerta = () => {
  const intro = document.getElementById('intro');
  if (intro) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    intro.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  } else {
    window.dispatchEvent(new Event(EVENTO_INTRO));
  }
};
