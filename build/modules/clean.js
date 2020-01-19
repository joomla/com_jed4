/* eslint-disable */

'use strict';

/**
 * Clean a directory
 */

const fs = require('fs-extra');

module.exports = options => {

  const dir = options.dir;

  fs.removeSync(dir);

  console.log(' Removed ' + dir);

};

/* eslint-enable */
