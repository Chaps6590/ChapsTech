export const CLIP_BASE = '/mascot/';

export const CLIPS = {
  idle: 'idle.mp4',
  volando: 'volando.mp4',
  web: 'web.mp4',
  sistemas: 'sistemas.mp4',
  n8n: 'n8n.mp4',
  ia: 'ia.mp4',
  datos: 'datos.mp4',
  contacto: 'contacto.mp4',
};

// Qué dice y qué hace el robot en cada parte de la página.
export const SCENES = {
  hola: {
    clip: 'idle',
    tag: '¡Hola!',
    text: 'Soy el robot de ChapsTech. Bajá conmigo y te cuento qué podemos hacer por tu negocio.',
  },
  servicios: {
    clip: 'idle',
    tag: 'Servicios',
    text: 'Esto es lo que hacemos. Seguí bajando y te cuento cada uno.',
  },
  web: {
    clip: 'web',
    tag: 'Páginas Web & Landings',
    text: 'Webs rápidas, lindas y pensadas para convertir visitas en clientes.',
  },
  sistemas: {
    clip: 'sistemas',
    tag: 'Sistemas Internos',
    text: 'Paneles y sistemas a medida para tener tu negocio ordenado en un solo lugar.',
  },
  n8n: {
    clip: 'n8n',
    tag: 'Bots con N8N',
    text: 'Bots que atienden, cargan datos y avisan por WhatsApp, 24/7 y sin que muevas un dedo.',
  },
  ia: {
    clip: 'ia',
    tag: 'Asistentes con IA',
    text: 'Asistentes con inteligencia artificial que responden a tus clientes con la información de tu negocio.',
  },
  datos: {
    clip: 'datos',
    tag: 'Bases de Datos',
    text: 'Bases de datos bien diseñadas, seguras y listas para crecer: PostgreSQL, SQL Server, Oracle y más.',
  },
  automatizacion: {
    clip: 'n8n',
    tag: 'Automatización & Workflows',
    text: 'Conecto tus herramientas (CRM, correo, redes) para que los procesos se hagan solos.',
  },
  proceso: {
    clip: 'idle',
    tag: 'Cómo trabajamos',
    text: 'Me contás tu idea, te paso un presupuesto, desarrollo por etapas y te acompaño después de la entrega.',
  },
  sobre: {
    clip: 'idle',
    tag: 'Sobre mí',
    text: 'Detrás de ChapsTech está Cesar: más de 10 años de experiencia y Lic. en Sistemas de la Información.',
  },
  contacto: {
    clip: 'contacto',
    tag: '¿Hablamos?',
    text: 'Escribime por WhatsApp y armamos tu proyecto.',
  },
};

// Orden de las tarjetas de .services-grid
export const SERVICE_KEYS = ['web', 'sistemas', 'n8n', 'ia', 'datos', 'automatizacion'];
