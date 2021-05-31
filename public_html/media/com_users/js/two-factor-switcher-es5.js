(function () {
  'use strict';

  /**
   * @copyright   (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
   * @license     GNU General Public License version 2 or later; see LICENSE.txt
   */
  Joomla = window.Joomla || {};

  (function (Joomla) {
    document.addEventListener('DOMContentLoaded', function () {
      Joomla.twoFactorMethodChange = function () {
        var method = document.getElementById('jform_twofactor_method');

        if (method) {
          var selectedPane = "com_users_twofactor_" + method.value;
          var twoFactorForms = [].slice.call(document.querySelectorAll('#com_users_twofactor_forms_container > div'));
          twoFactorForms.forEach(function (value) {
            var id = value.id;

            if (id !== selectedPane) {
              document.getElementById(id).classList.add('hidden');
            } else {
              document.getElementById(id).classList.remove('hidden');
            }
          });
        }
      };
    });
  })(Joomla);

}());
