'use strict';

const serve = require('../modules/browser-sync');
const lsof = require('../modules/lsof');

const postcss = require('../tasks/postcss');
const sass = require('../tasks/sass');

const bs = require('browser-sync').create();
const path = require('path');
const port = process.env.npm_package_config_port;
const src = process.env.npm_package_config_src;
const dest = process.env.npm_package_config_dist;

let debug = false;

// Clear the port
lsof({
  port: port
});

// Start serving
serve({
  notify: true,
  open: true,
  watchEvents: ['change', 'add'],
  proxy: process.env.npm_package_config_proxy,
  port: process.env.npm_package_config_port,
  files: [
    `${dest}/css/*.css`,
    `${dest}/icons/*.svg`,
    `${dest}/js/*.js`,
    `${dest}/images/*.*`,
    `${dest}/images/favicon/*.*`,
    `${dest}/**/*.php`,
    `${dest}/*.php`
  ]
});

/**
 * Debounce
 * https://gist.github.com/nmsdvid/8807205
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 *
 * @param { function } callback  The callback function to be executed
 * @param { integer }  time      The time to wait before firing the callback
 * @param { integer }  interval  The interval
 */
const debounce = (callback, time = 250, interval) => (...args) => clearTimeout(interval, interval = setTimeout(callback, time, ...args));


bs.watch(`${src}/**`, (event, file) => {
  if (event === 'add' || event === 'change') {

    // Css files changes
    if (file.match(/css\/.*\.css/)) {
      if (debug) {
        console.log('css: ' + event + ' - ' + file);
      }

      debounce(
        postcss({
          file: path.basename(file)
        })
        , 300);
    }

    if (event === 'change') {
      // Sass files changes
      if (file.match(/scss\/.*\.scss/)) {
        if (debug) {
          console.log('sass: ' + event + ' - ' + file);
        }

        debounce(
          sass({
            file: path.basename(file)
          })
          , 300);
      }
    }
  }
});
