'use strict';

const clean = require('../modules/clean');

const dest = process.env.npm_package_config_dist;

module.exports = options => {

  clean({
    dir: `${dest}/css`
  });

};
