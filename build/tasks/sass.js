'use strict';

const sass = require('../modules/sass');

const src = process.env.npm_package_config_src + '/scss';
const dest = process.env.npm_package_config_src + '/css';

module.exports = options => {

  const file = options.file;

  sass({
    src: `${src}/style.scss`,
    dest: `${dest}/style.css`
  });

};
