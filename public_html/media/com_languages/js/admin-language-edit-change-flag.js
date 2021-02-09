/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('jform_image').addEventListener('change', function (_ref) {
    var currentTarget = _ref.currentTarget;
    var flagSelectedValue = currentTarget.value;
    var flagimage = document.getElementById('flag').querySelector('img');
    var src = "".concat(Joomla.getOptions('system.paths').rootFull, "/media/mod_languages/images/").concat(flagSelectedValue, ".gif");

    if (flagSelectedValue) {
      flagimage.setAttribute('src', src);
      flagimage.setAttribute('alt', flagSelectedValue);
    } else {
      flagimage.removeAttribute('src');
      flagimage.setAttribute('alt', '');
    }
  }, false);
});