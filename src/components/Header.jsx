import { useState, useEffect } from 'react';
import Logo from './Logo';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#inicio" className="header-logo" onClick={(e) => { e.preventDefault(); scrollTo('inicio'); }}>
          <Logo size={38} showText={true} />
        </a>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {['Inicio', 'Servicios', 'Sobre mí', 'Contacto'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-').replace('í', 'i')}`}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.toLowerCase().replace(' ', '-').replace('í', 'i').replace('í', 'i'));
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="https://wa.me/5493434570645"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary header-cta"
        >
          Hablemos 💬
        </a>

        <button className={`burger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
};

export default Header;
