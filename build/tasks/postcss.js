'use strict';

const postcss = require('../modules/postcss');

const src = process.env.npm_package_config_src + '/css';
const dest = process.env.npm_package_config_dist + '/css';

module.exports = options => {

  const file = options.file;

  postcss({
    src: `${src}/${file}`,
    dest: `${dest}/${file}`
  });

};
