const skills = [
  { name: 'React / Next.js', pct: 92 },
  { name: 'N8N & Automatización', pct: 95 },
  { name: 'Asistentes con IA (GPT, LangChain)', pct: 90 },
  { name: 'Node.js / Python', pct: 85 },
  { name: 'Bases de datos (SQL / NoSQL)', pct: 88 },
  { name: 'Integración de APIs', pct: 94 },
];

const About = () => {
  return (
    <section id="sobre-mi" className="about section">
      <div className="container about-inner">
        {/* Visual side */}
        <div className="about-visual">
          <div className="about-card">
            <div className="about-avatar">
              <img src="/Chaps.png" alt="Cesar Sarchioni" className="about-avatar-img" />
            </div>
            <h3 className="about-name">Cesar Sarchioni</h3>
            <p className="about-role gradient-text">Full-Stack Developer & AI Builder</p>
            <div className="about-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Argentina — Entre Ríos
            </div>
            <div className="about-contact-info">
              <a href="https://wa.me/5493434570645" target="_blank" rel="noopener noreferrer" className="about-whatsapp-mini">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +54 343 4570645
              </a>
              <a href="mailto:hola@chapstech.cloud" className="about-email-mini">
                hola@chapstech.cloud
              </a>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="about-text">
          <span className="section-badge">Sobre mí</span>
          <h2 className="section-title">
            El developer detrás de <span className="gradient-text">ChapsTech</span>
          </h2>
          <p className="about-bio">
            Soy Cesar Sarchioni, desarrollador apasionado por transformar ideas en productos digitales reales.
            Trabajo en el cruce entre el desarrollo web tradicional y las nuevas tecnologías de inteligencia artificial.
          </p>
          <p className="about-bio">
            Me especialicé en construir <strong>sistemas que automatizan y escalan</strong>: desde bots inteligentes
            con N8N hasta asistentes conversacionales con GPT, pasando por sistemas internos, aplicaciones web y apps
            que integran IA de forma natural.
          </p>
          <p className="about-bio">
            Cada proyecto que tomo es una oportunidad de resolver un problema real con la mejor tecnología disponible.
            Trabajo de forma directa, transparente y enfocado en resultados.
          </p>

          <div className="skills-list">
            {skills.map((sk) => (
              <div key={sk.name} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{sk.name}</span>
                  <span className="skill-pct">{sk.pct}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: `${sk.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
