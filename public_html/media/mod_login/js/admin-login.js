/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function (Joomla, document) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('btn-login-submit');

    if (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();

        if (document.formvalidator.isValid(btn.form)) {
          Joomla.submitbutton('login');
        }
      });
    }
  });
})(window.Joomla, document);