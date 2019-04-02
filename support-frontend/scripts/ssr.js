const { writeFileSync } = require('fs');
const { resolve } = require('path');
const jsdom = require('jsdom');
const { ssr } = require('../public/compiled-assets/javascripts/ssr').Support;

// ------------- Set up global state --------------
const { JSDOM } = jsdom;
const { window } = new JSDOM('...', { url: 'http://localhost/' });

global.URL = require('url').URL;
global.URLSearchParams = require('url').URLSearchParams;

global.window = window;
global.window.guardian = {
  settings: {},
};

global.localStorage = {
  getItem: () => '',
  setItem: () => {},
};
global.sessionStorage = global.localStorage;
global.document = window.document;
global.document.cookie = 'GU_TK=1.1553079258164';
global.navigator = {
  userAgent: 'node.js',
};

global.Image = function image() { return this; };

// -------------- Write pages to file ----------------

ssr.pages.forEach((page) => {
  const { path, html } = page;
  console.log(`Writing ${path}`);

  writeFileSync(
    resolve(__dirname, '..', 'conf/ssr-cache/', `${path.replace(/\//g, '-')}.html`),
    html, 'utf8',
  );
  console.log(`Finished writing ${path}`);
});

console.log('Done');
process.exit();

