'use strict';

const clean = require('../tasks/clean');
const mkdirp = require('../tasks/mkdirp');
const sass = require('../tasks/sass');
const postcss = require('../tasks/postcss');

const currentPath = process.cwd();

// clean and create
clean();
mkdirp();

// css
sass({ file: 'style.scss' });
setTimeout(() => {
  postcss({ file: 'style.css' });
}, 2000);
