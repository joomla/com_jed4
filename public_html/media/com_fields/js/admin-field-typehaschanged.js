/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2019 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function (Joomla) {
  'use strict';

  Joomla.typeHasChanged = function (element) {
    // Display the loading indication
    document.body.appendChild(document.createElement('joomla-core-loader'));
    document.querySelector('input[name=task]').value = 'field.reload';
    element.form.submit();
  };
})(Joomla);