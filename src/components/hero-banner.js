import React from "react";

export const HeroBanner = () => {
  const logo = "/images/logo.png";

  return (
    <div className="hero-banner hero-banner--blue-aqua">
      <div className="hero-banner__logo">
        <img className="hero-banner__image" src={logo} alt="CM Logo" />
      </div>
      <h1 className="hero-banner__headline">Crew Manager 0.1</h1>
      <p className="hero-banner__description">
        This is a simple application to manage your sail race crew.
      </p>
     
    </div>
  );
};
