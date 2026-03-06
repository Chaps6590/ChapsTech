const steps = [
  {
    num: '01',
    title: 'Consulta inicial',
    desc: 'Me contás tu idea o problema. Analizamos juntos qué necesitás y si somos la combinación correcta. Sin costo, sin compromiso.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: '#00cfff',
  },
  {
    num: '02',
    title: 'Propuesta & presupuesto',
    desc: 'Te presento una propuesta clara con alcance, tiempos y precio. Sin sorpresas ni letras chicas. Ajustamos hasta que quede perfecto.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    color: '#a78bfa',
  },
  {
    num: '03',
    title: 'Desarrollo iterativo',
    desc: 'Trabajo en sprints cortos con entregas parciales. Podés ver el avance, dar feedback y ajustar el rumbo en tiempo real.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: '#34d399',
  },
  {
    num: '04',
    title: 'Entrega & soporte',
    desc: 'Desplegamos el proyecto, te enseño a usarlo y quedo disponible para ajustes. El éxito del producto es mi meta, no solo la entrega.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: '#fb923c',
  },
];

const Process = () => {
  return (
    <section className="process section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Metodología</span>
          <h2 className="section-title">
            Cómo <span className="gradient-text">trabajo</span> con vos
          </h2>
          <p className="section-desc">
            Un proceso claro, transparente y orientado a resultados. Sin vueltas.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, i) => (
            <div key={i} className="process-card">
              <div className="process-num" style={{ color: step.color }}>{step.num}</div>
              <div className="process-icon" style={{ background: `${step.color}18`, color: step.color }}>
                {step.icon}
              </div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
              {i < steps.length - 1 && <div className="process-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
