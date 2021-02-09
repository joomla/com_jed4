/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function (Joomla) {
  'use strict';

  if (Joomla.getOptions('menus-default')) {
    // eslint-disable-next-line prefer-destructuring
    var items = Joomla.getOptions('menus-default').items;
    items.forEach(function (item) {
      window["jSelectPosition_".concat(item)] = function (name) {
        document.getElementById(item).value = name;
        Joomla.Modal.getCurrent().close();
      };
    });
  }

  Array.from(document.querySelectorAll('.modal')).forEach(function (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', function () {
      setTimeout(function () {
        window.parent.location.reload();
      }, 1000);
    });
  });
})(Joomla);

(function (originalFn) {
  'use strict';

  Joomla.submitform = function (task, form) {
    originalFn(task, form);

    if (task === 'menu.exportXml') {
      document.adminForm.task.value = '';
    }
  };
})(Joomla.submitform);