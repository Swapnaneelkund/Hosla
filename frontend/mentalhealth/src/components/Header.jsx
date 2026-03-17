const Header = ({ logo, translate }) => {
  return (
    <div className="header">
      <div className="logo">
        <img id="mainImage"
          src={logo}
          alt="Hosla Logo"
        />
      </div>

      <h1 className="main-title">{translate("formTitle")}</h1>
      <p className="subtitle">
        {translate("formHelper")}
      </p>
    </div>
  );
};

export default Header;