const Logo = ({ size = 38 }) => {
  return (
    <img
      src="/chapstech-v2.png"
      alt="ChapsTech"
      className="logo-img"
      style={{ height: size }}
      draggable="false"
    />
  );
};

export default Logo;
