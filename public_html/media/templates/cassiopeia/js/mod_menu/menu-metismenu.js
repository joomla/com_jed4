/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @package     Joomla.Site
 * @subpackage  Templates.cassiopeia
 * @copyright   (C) 2020 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       4.0
 */
document.addEventListener('DOMContentLoaded', function () {
  var allMenus = document.querySelectorAll('ul.mod-menu_dropdown-metismenu');
  allMenus.forEach(function (menu) {
    // eslint-disable-next-line no-new, no-undef
    var mm = new MetisMenu(menu, {
      triggerElement: 'button.mm-toggler'
    }).on('shown.metisMenu', function (event) {
      window.addEventListener('click', function mmClick(e) {
        if (!event.target.contains(e.target)) {
          mm.hide(event.detail.shownElement);
          window.removeEventListener('click', mmClick);
        }
      });
    });
  });
});