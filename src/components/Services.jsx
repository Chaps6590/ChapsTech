const services = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l2 2-2 2M11 10h4" />
      </svg>
    ),
    title: 'Páginas Web & Landings',
    desc: 'Sitios modernos, rápidos y responsivos. Desde landings de alto impacto hasta portales completos, optimizados para convertir.',
    tags: ['React', 'Next.js', 'SEO'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <path d="M6 6h.01M6 18h.01" />
      </svg>
    ),
    title: 'Sistemas Internos',
    desc: 'Paneles de control, CRMs, ERPs y dashboards a medida. Optimizo los procesos de tu negocio con tecnología propia.',
    tags: ['Dashboard', 'APIs', 'DB'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a10 10 0 110 20A10 10 0 0112 2z" />
        <path d="M8 12h4l2-4" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <path d="M9 16c1 1 3 1 4 0" />
      </svg>
    ),
    title: 'Bots con N8N',
    desc: 'Automatizaciones y bots inteligentes usando N8N. Conecta APIs, procesa datos y elimina tareas manuales de tu operación.',
    tags: ['N8N', 'Webhooks', 'APIs'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h8M8 14h5" />
      </svg>
    ),
    title: 'Asistentes con IA',
    desc: 'Chatbots y asistentes virtuales entrenados con tu información. Atención 24/7, respuestas precisas y completamente personalizados.',
    tags: ['GPT', 'LangChain', 'RAG'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
        <path d="M9 7l2 2-2 2M13 9h2" />
      </svg>
    ),
    title: 'Apps con Inteligencia Artificial',
    desc: 'Aplicaciones completas que integran IA para analizar, predecir, generar contenido y automatizar decisiones de negocio.',
    tags: ['IA', 'Python', 'React'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Automatización & Workflows',
    desc: 'Diseño flujos de trabajo que conectan tus herramientas favoritas: CRMs, e-commerce, redes sociales, correo y más.',
    tags: ['Zapier', 'N8N', 'Make'],
  },
];

const Services = () => {
  return (
    <section id="servicios" className="services section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Lo que hago</span>
          <h2 className="section-title">
            Servicios que <span className="gradient-text">transforman</span> tu negocio
          </h2>
          <p className="section-desc">
            Combino desarrollo moderno con inteligencia artificial para crear soluciones 
            que realmente funcionan y hacen crecer tu empresa.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
