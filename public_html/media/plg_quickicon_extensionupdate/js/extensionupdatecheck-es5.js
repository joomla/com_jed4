(function () {
  'use strict';

  /**
   * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
   * @license    GNU General Public License version 2 or later; see LICENSE.txt
   */
  // Ajax call to get the update status of the installed extensions
  (function () {
    document.addEventListener('DOMContentLoaded', function () {
      if (Joomla.getOptions('js-extensions-update')) {
        var options = Joomla.getOptions('js-extensions-update');

        var update = function update(type, text) {
          var link = document.getElementById('plg_quickicon_extensionupdate');
          var linkSpans = [].slice.call(link.querySelectorAll('span.j-links-link'));

          if (link) {
            link.classList.add(type);
          }

          if (linkSpans.length) {
            linkSpans.forEach(function (span) {
              span.innerHTML = text;
            });
          }
        };

        Joomla.request({
          url: options.ajaxUrl,
          method: 'GET',
          data: '',
          perform: true,
          onSuccess: function onSuccess(response) {
            var updateInfoList = JSON.parse(response);

            if (Array.isArray(updateInfoList)) {
              if (updateInfoList.length === 0) {
                // No updates
                update('success', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_UPTODATE'));
              } else {
                update('danger', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_UPDATEFOUND').replace('%s', "<span class=\"badge text-dark bg-light\">" + updateInfoList.length + "</span>"));
              }
            } else {
              // An error occurred
              update('danger', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_ERROR'));
            }
          },
          onError: function onError() {
            // An error occurred
            update('danger', Joomla.Text._('PLG_QUICKICON_EXTENSIONUPDATE_ERROR'));
          }
        });
      }
    });
  })();

}());
