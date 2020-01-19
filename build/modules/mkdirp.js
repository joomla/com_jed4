/* eslint-disable */

'use strict';

/**
 * Ensures that the directory exists.
 * If the directory structure does not exist, it is created.
 * Like mkdir -p.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md
 */

const fs = require('fs-extra');

module.exports = options => {

  const dir = options.dir;

  fs.ensureDir(dir, err => {
    if (err) {
      return console.error(err);
    }

    console.log(' Created ' + dir);
  });
};

/* eslint-enable */
