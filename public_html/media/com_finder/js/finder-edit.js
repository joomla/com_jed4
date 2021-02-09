/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
Joomla = window.Joomla || {};

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Handle toggle all
    [].slice.call(document.querySelectorAll('.filter-toggle-all')).forEach(function (button) {
      button.addEventListener('click', function () {
        [].slice.call(document.querySelectorAll('.filter-node')).forEach(function (node) {
          node.click();
        });
      });
    }); // Update the count

    [].slice.call(document.querySelectorAll('.filter-node')).forEach(function () {
      var count = document.getElementById('jform_map_count');

      if (count) {
        count.value = document.querySelectorAll('input[type="checkbox"]:checked').length;
      }
    }); // Expand/collapse

    var expandAccordion = document.getElementById('expandAccordion');

    if (expandAccordion) {
      expandAccordion.addEventListener('click', function (event) {
        event.preventDefault();
        var elements;

        if (event.target.innerText === Joomla.JText._('COM_FINDER_FILTER_SHOW_ALL')) {
          event.target.innerText = Joomla.JText._('COM_FINDER_FILTER_HIDE_ALL');
          elements = [].slice.call(document.querySelectorAll('.accordion-button.collapsed'));
        } else {
          event.target.innerText = Joomla.JText._('COM_FINDER_FILTER_SHOW_ALL');
          elements = [].slice.call(document.querySelectorAll('.accordion-button:not(.collapsed)'));
        }

        if (elements) {
          elements.forEach(function (element) {
            element.click();
          });
        }
      });
    }
  });
})();