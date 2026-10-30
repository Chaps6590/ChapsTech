// Eventos propios para Umami. Si el script no está cargado (sin variables de
// entorno, bloqueador de anuncios, dev) no hace nada.
export const track = (name, data) => {
  try { window.umami?.track(name, data); } catch { /* la analítica nunca debe romper la web */ }
};

// Un único listener para los clics que importan: así no hay que tocar cada componente.
const TARGETS = [
  ['a[href*="wa.me"]', 'whatsapp_click'],
  ['a[href*="instagram.com"]', 'instagram_click'],
  ['a[href^="mailto:"]', 'email_click'],
  ['.service-card', 'service_click'],
];

export const startClickTracking = () => {
  const onClick = (e) => {
    for (const [selector, name] of TARGETS) {
      const el = e.target.closest?.(selector);
      if (!el) continue;
      const section = el.closest('section[id]')?.id || (el.closest('footer') ? 'footer' : el.closest('header') ? 'header' : 'flotante');
      const data = { seccion: section };
      if (name === 'service_click') data.servicio = el.querySelector('.service-title')?.textContent || '';
      track(name, data);
      return;
    }
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
};
