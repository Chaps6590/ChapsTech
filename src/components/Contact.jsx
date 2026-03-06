const Contact = () => {
  return (
    <section id="contacto" className="contact section">
      <div className="orb orb-contact-1" />
      <div className="orb orb-contact-2" />
      <div className="container contact-inner">
        <div className="section-header">
          <span className="section-badge">Contacto</span>
          <h2 className="section-title">
            ¿Tenés un proyecto en mente?<br />
            <span className="gradient-text">Hablemos hoy</span>
          </h2>
          <p className="section-desc">
            Contame tu idea y te respondo rápido. La primer consulta es sin costo.
          </p>
        </div>

        <div className="contact-grid">
          {/* WhatsApp CTA — main */}
          <a
            href="https://wa.me/5493434570645?text=Hola%20Cesar!%20Vi%20tu%20web%20ChapsTech%20y%20me%20interesa%20hablar%20sobre%20un%20proyecto."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-whatsapp"
          >
            <div className="wa-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="wa-text">
              <span className="wa-title">Escribime por WhatsApp</span>
              <span className="wa-num">+54 343 4570645</span>
            </div>
            <svg className="wa-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Contact info cards */}
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <div>
                <span className="cic-label">Ubicación</span>
                <span className="cic-value">Entre Ríos, Argentina</span>
              </div>
            </div>

            <div className="contact-info-card">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <span className="cic-label">Disponibilidad</span>
                <span className="cic-value">Lun–Vie · 9 a 20 hs</span>
              </div>
            </div>

            <div className="contact-info-card">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.75a16 16 0 006.29 6.29l1.17-1.17a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.02z" />
              </svg>
              <div>
                <span className="cic-label">WhatsApp</span>
                <span className="cic-value">+54 343 4570645</span>
              </div>
            </div>

            <div className="contact-info-card">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 01.8-1.6l8-6a2 2 0 012.4 0l8 6z" />
                <path d="M22 10l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 10" />
              </svg>
              <div>
                <span className="cic-label">Email</span>
                <span className="cic-value">hola@chapstech.cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
