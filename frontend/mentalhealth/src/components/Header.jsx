const Header = ({ logo, translate }) => {
  return (
    <div className="header">
      <div className="logo">
        <img
          src={logo}
          alt="Hosla Logo"
          style={{ height: "60px", width: "auto" }}
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