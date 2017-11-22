// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink } from 'helpers/legal';


// ----- Component ----- //

const LinksFooter = () => (
  <footer className="component-links-footer">
    <div className="component-links-footer__content gu-content-margin">
      <small className="component-links-footer__privacy">
        <a className="component-links-footer__link" href={privacyLink}>
          Privacy Policy
        </a>
      </small>
      <small className="component-links-footer__copyright">
        &copy; 2017 Guardian News and Media Limited or its affiliated companies.
        All rights reserved.
      </small>
    </div>
  </footer>
);

export default LinksFooter;
