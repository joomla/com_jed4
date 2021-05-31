(function () {
  'use strict';

  /**
   * @copyright  (C) 2019 Open Source Matters, Inc. <https://www.joomla.org>
   * @license    GNU General Public License version 2 or later; see LICENSE.txt
   */
  (function (document, Joomla) {
    var init = function init() {
      // Cleanup
      document.removeEventListener('DOMContentLoaded', init); // Get the elements

      var elements = [].slice.call(document.querySelectorAll('.system-counter'));

      if (elements.length) {
        elements.forEach(function (element) {
          var badgeurl = element.getAttribute('data-url');

          if (badgeurl && Joomla && Joomla.request && typeof Joomla.request === 'function') {
            Joomla.request({
              url: badgeurl,
              method: 'POST',
              onSuccess: function onSuccess(resp) {
                var response;

                try {
                  response = JSON.parse(resp);
                } catch (error) {
                  throw new Error('Failed to parse JSON');
                }

                if (response.error || !response.success) {
                  element.classList.remove('icon-spin');
                  element.classList.remove('icon-spinner');
                  element.classList.add('text-danger');
                  element.classList.add('icon-remove');
                } else if (response.data) {
                  var elem = document.createElement('span');
                  elem.classList.add('float-end');
                  elem.classList.add('badge');
                  elem.classList.add('bg-warning', 'text-dark');
                  elem.innerHTML = response.data;
                  element.parentNode.replaceChild(elem, element);
                } else {
                  element.classList.remove('icon-spin');
                  element.classList.remove('icon-spinner');
                  element.classList.add('icon-check');
                  element.classList.add('text-success');
                }
              },
              onError: function onError() {
                element.classList.remove('icon-spin');
                element.classList.remove('icon-spinner');
                element.classList.add('text-danger');
                element.classList.add('icon-remove');
              }
            });
          }
        });
      }
    };

    document.addEventListener('DOMContentLoaded', init);
  })(document, Joomla);

}());
