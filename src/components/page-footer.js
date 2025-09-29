import React from "react";
import { PageFooterHyperlink } from "./page-footer-hyperlink";

export const PageFooter = () => {
  const resourceList = [
    {
      path: "https://auth0.com/why-auth0/",
      label: "Why Auth0",
    },
    {
      path: "https://auth0.com/docs/get-started",
      label: "How It Works",
    },
    {
      path: "https://auth0.com/blog/developers/",
      label: "Developer Blog",
    },
    {
      path: "https://auth0.com/contact-us",
      label: "Contact an Expert",
    },
  ];

  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div className="page-footer-grid__info">
          <div className="page-footer-info__message">
            <p className="page-footer-message__headline">
              <span>This sample application is brought to you by The Stolen Goat&nbsp;</span>
            </p>
            
          </div>
          
          
        </div>
        <div className="page-footer-grid__brand">
          <div className="page-footer-brand">
            <img
              className="page-footer-brand__logo"
              src="/images/goat.png"
              alt="The Stolen Goat"
              width="20"
              height="22.22"
            />
            <PageFooterHyperlink path="https://thestolengoat.com/">
              The Stolen Goat
            </PageFooterHyperlink>
          </div>
        </div>
      </div>
    </footer>
  );
};
