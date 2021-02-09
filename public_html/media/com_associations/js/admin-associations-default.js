/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright   (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
Joomla.submitbutton = function (pressbutton) {
  if (pressbutton === 'associations.purge') {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(Joomla.JText._('COM_ASSOCIATIONS_PURGE_CONFIRM_PROMPT'))) {
      Joomla.submitform(pressbutton);
    } else {
      return false;
    }
  } else {
    Joomla.submitform(pressbutton);
  }

  return true;
};