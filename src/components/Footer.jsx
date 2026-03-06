import Logo from './Logo';

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={36} showText={true} />
          <p className="footer-tagline">
            Desarrollo web, bots e IA para negocios que quieren crecer.
          </p>
        </div>

        <div className="footer-links">
          <span className="footer-links-title">Navegación</span>
          {[
            { label: 'Inicio', id: 'inicio' },
            { label: 'Servicios', id: 'servicios' },
            { label: 'Sobre mí', id: 'sobre-mi' },
            { label: 'Contacto', id: 'contacto' },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="footer-link"
              onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-contact">
          <span className="footer-links-title">Contacto directo</span>
          <a
            href="https://wa.me/5493434570645"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            WhatsApp: +54 343 4570645
          </a>
          <a href="mailto:hola@chapstech.cloud" className="footer-link">
            hola@chapstech.cloud
          </a>
          <span className="footer-link no-link">Entre Ríos, Argentina</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} ChapsTech · Cesar Sarchioni. Todos los derechos reservados.</span>
        <span className="footer-domain">chapstech.cloud</span>
      </div>
    </footer>
  );
};

export default Footer;
