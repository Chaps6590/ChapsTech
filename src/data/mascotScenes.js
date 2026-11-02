export const CLIP_BASE = '/mascot/';

export const CLIPS = {
  idle: 'idle.mp4',
  volando: 'volando.mp4',
  vueloVelocidad: 'clip-09-vuelo-velocidad.mp4',   // el que cruza por detrás de la puerta (Intro.jsx)
  web: 'web.mp4',
  sistemas: 'sistemas.mp4',
  n8n: 'n8n.mp4',
  ia: 'ia.mp4',
  datos: 'datos.mp4',
  contacto: 'contacto.mp4',
};

// Qué clip muestra el robot en cada parte de la página.
export const SCENES = {
  hola: { clip: 'idle' },
  servicios: { clip: 'idle' },
  web: { clip: 'web' },
  sistemas: { clip: 'sistemas' },
  n8n: { clip: 'n8n' },
  ia: { clip: 'ia' },
  datos: { clip: 'datos' },
  automatizacion: { clip: 'n8n' },
  proceso: { clip: 'idle' },
  sobre: { clip: 'idle' },
  contacto: { clip: 'contacto' },
};

// Orden de las tarjetas de .services-grid
export const SERVICE_KEYS = ['web', 'sistemas', 'n8n', 'ia', 'datos', 'automatizacion'];
