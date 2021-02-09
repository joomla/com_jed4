/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(function () {
  'use strict';

  window.insertPagebreak = function (editor) {
    // Get the pagebreak title
    var title = document.getElementById('title').value;

    if (!window.parent.Joomla.getOptions('xtd-pagebreak')) {
      // Something went wrong!
      window.parent.Joomla.Modal.getCurrent().close();
      return false;
    } // Get the pagebreak toc alias -- not inserting for now don't know which attribute to use..


    var alt = document.getElementById('alt').value;
    title = title !== '' ? "title=\"".concat(title, "\"") : '';
    alt = alt !== '' ? "alt=\"".concat(alt, "\"") : '';
    var tag = "<hr class=\"system-pagebreak\" ".concat(title, " ").concat(alt, ">");
    window.parent.Joomla.editors.instances[editor].replaceSelection(tag);
    window.parent.Joomla.Modal.getCurrent().close();
    return false;
  };
})();