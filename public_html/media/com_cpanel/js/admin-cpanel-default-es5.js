(function () {
  'use strict';

  /**
   * @copyright  (C) 2019 Open Source Matters, Inc. <https://www.joomla.org>
   * @license    GNU General Public License version 2 or later; see LICENSE.txt
   */

  /**
   * Debounce
   * https://gist.github.com/nmsdvid/8807205
   *
   * @param { function } callback  The callback function to be executed
   * @param { int }  time      The time to wait before firing the callback
   * @param { int }  interval  The interval
   */
  // eslint-disable-next-line max-len, no-param-reassign, no-return-assign
  var debounce = function debounce(callback, time, interval) {
    if (time === void 0) {
      time = 250;
    }

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return clearTimeout(interval, interval = setTimeout.apply(void 0, [callback, time].concat(args)));
    };
  };

  (function (window, document, Joomla) {
    Joomla.unpublishModule = function (element) {
      // Get variables
      var baseUrl = 'index.php?option=com_modules&task=modules.unpublish&format=json';
      var id = element.getAttribute('data-module-id');
      Joomla.request({
        url: baseUrl + "&cid=" + id,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: function onSuccess() {
          var wrapper = element.closest('.module-wrapper');
          wrapper.parentNode.removeChild(wrapper);
          Joomla.renderMessages({
            message: [Joomla.JText._('COM_CPANEL_UNPUBLISH_MODULE_SUCCESS')]
          });
        },
        onError: function onError() {
          Joomla.renderMessages({
            error: [Joomla.JText._('COM_CPANEL_UNPUBLISH_MODULE_ERROR')]
          });
        }
      });
    };

    var onBoot = function onBoot() {
      var cpanelModules = document.getElementById('content');

      if (cpanelModules) {
        var links = [].slice.call(cpanelModules.querySelectorAll('.unpublish-module'));
        links.forEach(function (link) {
          link.addEventListener('click', function (_ref) {
            var target = _ref.target;
            return Joomla.unpublishModule(target);
          });
        });
      } // Cleanup


      document.removeEventListener('DOMContentLoaded', onBoot);
    }; // Initialise


    document.addEventListener('DOMContentLoaded', onBoot); // Masonry layout for cpanel cards

    var MasonryLayout = {
      $gridBox: null,
      // Calculate "grid-row-end" property
      resizeGridItem: function resizeGridItem($cell, rowHeight, rowGap) {
        var $content = $cell.querySelector('.card');

        if ($content) {
          var contentHeight = $content.getBoundingClientRect().height + rowGap;
          var rowSpan = Math.ceil(contentHeight / (rowHeight + rowGap));
          $cell.style.gridRowEnd = "span " + rowSpan;
        }
      },
      // Check a size of every cell in the grid
      resizeAllGridItems: function resizeAllGridItems() {
        var $gridCells = [].slice.call(MasonryLayout.$gridBox.children);
        var gridStyle = window.getComputedStyle(MasonryLayout.$gridBox);
        var gridAutoRows = parseInt(gridStyle.getPropertyValue('grid-auto-rows'), 10) || 0;
        var gridRowGap = parseInt(gridStyle.getPropertyValue('grid-row-gap'), 10) || 10;
        $gridCells.forEach(function ($cell) {
          MasonryLayout.resizeGridItem($cell, gridAutoRows, gridRowGap);
        });
      },
      initialise: function initialise() {
        MasonryLayout.$gridBox = document.querySelector('#cpanel-modules .card-columns');
        MasonryLayout.resizeAllGridItems(); // Watch on window resize

        window.addEventListener('resize', debounce(MasonryLayout.resizeAllGridItems, 50));
      }
    }; // Initialise Masonry layout on full load,
    // to be sure all images/fonts are loaded, and so cards have a "final" size

    window.addEventListener('load', MasonryLayout.initialise);
  })(window, document, window.Joomla);

}());
