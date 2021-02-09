/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(Joomla => {
  'use strict';

  if (!window.parent.Joomla) {
    throw new Error('core.js was not properly initialised');
  }

  if (!Joomla) {
    window.Joomla = {};
  }

  Joomla.fieldIns = (id, editor) => {
    window.parent.Joomla.editors.instances[editor].replaceSelection(`{field ${id}}`);

    if (window.parent.Joomla.Modal) {
      window.parent.Joomla.Modal.getCurrent().close();
    }
  };

  Joomla.fieldgroupIns = (id, editor) => {
    window.parent.Joomla.editors.instances[editor].replaceSelection(`{fieldgroup ${id}}`);

    if (window.parent.Joomla.Modal) {
      window.parent.Joomla.Modal.getCurrent().close();
    }
  };
})(Joomla);