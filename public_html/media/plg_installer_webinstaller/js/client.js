/**
* PLEASE DO NOT MODIFY THIS FILE. WORK ON THE ES6 VERSION.
* OTHERWISE YOUR CHANGES WILL BE REPLACED ON THE NEXT BUILD.
**/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
if (!Joomla) {
  throw new Error('Joomla API is not properly initialised');
}

(function (window, document, Joomla) {
  'use strict';

  var webInstallerOptions = {
    view: 'dashboard',
    id: 0,
    ordering: '',
    version: 'current',
    list: 0,
    options: Joomla.getOptions('plg_installer_webinstaller', {})
  };
  var instance;

  var WebInstaller = /*#__PURE__*/function () {
    function WebInstaller() {
      _classCallCheck(this, WebInstaller);
    }

    _createClass(WebInstaller, [{
      key: "initialise",
      value: function initialise() {
        var _this = this;

        webInstallerOptions.loaded = 1;
        var cancelButton = document.getElementById('uploadform-web-cancel');
        cancelButton.addEventListener('click', function () {
          document.getElementById('uploadform-web').classList.add('hidden');

          if (webInstallerOptions.list && document.querySelector('.list-view')) {
            document.querySelector('.list-view').click();
          }
        });
        var installButton = document.getElementById('uploadform-web-install');
        installButton.addEventListener('click', function () {
          if (webInstallerOptions.options.installFrom === 4) {
            _this.submitButtonUrl();
          } else {
            _this.submitButtonWeb();
          }
        });
        this.loadweb("".concat(webInstallerOptions.options.base_url, "index.php?format=json&option=com_apps&view=dashboard"));
        this.clickforlinks();
      }
    }, {
      key: "loadweb",
      value: function loadweb(url) {
        var _this2 = this;

        if (!url) {
          return false;
        }

        var pattern1 = new RegExp(webInstallerOptions.options.base_url);
        var pattern2 = new RegExp('^index.php');

        if (!(pattern1.test(url) || pattern2.test(url))) {
          window.open(url, '_blank');
          return false;
        }

        var requestUrl = "".concat(url, "&product=").concat(webInstallerOptions.options.product, "&release=").concat(webInstallerOptions.options.release, "&dev_level=").concat(webInstallerOptions.options.dev_level, "&list=").concat(webInstallerOptions.list ? 'list' : 'grid', "&lang=").concat(webInstallerOptions.options.language);
        var orderingSelect = document.getElementById('com-apps-ordering');
        var versionSelect = document.getElementById('com-apps-filter-joomla-version');

        if (webInstallerOptions.ordering !== '' && orderingSelect && orderingSelect.value) {
          webInstallerOptions.ordering = orderingSelect.value;
          requestUrl += "&ordering=".concat(webInstallerOptions.ordering);
        }

        if (webInstallerOptions.version !== '' && versionSelect && versionSelect.value) {
          webInstallerOptions.version = versionSelect.value;
          requestUrl += "&filter_version=".concat(webInstallerOptions.version);
        }

        WebInstaller.showLoadingLayer();
        new Promise(function (resolve, reject) {
          Joomla.request({
            url: requestUrl,
            onSuccess: function onSuccess(resp) {
              var response;

              try {
                response = JSON.parse(resp);
              } catch (error) {
                throw new Error('Failed to parse JSON');
              }

              if (document.getElementById('web-loader')) {
                document.getElementById('web-loader').classList.add('hidden');
              }

              var jedContainer = document.getElementById('jed-container');
              jedContainer.innerHTML = response.data.html;
              document.getElementById('com-apps-searchbox').addEventListener('keypress', function (_ref) {
                var which = _ref.which;

                if (which === 13) {
                  _this2.initiateSearch();
                }
              });
              document.getElementById('search-extensions').addEventListener('click', function () {
                _this2.initiateSearch();
              });
              document.getElementById('search-reset').addEventListener('click', function () {
                var searchBox = document.getElementById('com-apps-searchbox');
                searchBox.value = '';

                _this2.initiateSearch();
              }); // eslint-disable-next-line no-shadow

              var orderingSelect = document.getElementById('com-apps-ordering'); // eslint-disable-next-line no-shadow

              var versionSelect = document.getElementById('com-apps-filter-joomla-version');

              if (orderingSelect) {
                orderingSelect.addEventListener('change', function () {
                  var index = orderingSelect.selectedIndex;
                  webInstallerOptions.ordering = orderingSelect.options[index].value;

                  _this2.installfromwebajaxsubmit();
                });
              }

              if (versionSelect) {
                versionSelect.addEventListener('change', function () {
                  var index = versionSelect.selectedIndex;
                  webInstallerOptions.version = versionSelect.options[index].value;

                  _this2.installfromwebajaxsubmit();
                });
              }

              if (webInstallerOptions.options.installfrom_url !== '') {
                WebInstaller.installfromweb(webInstallerOptions.options.installfrom_url);
              }

              resolve();
            },
            onError: function onError(request) {
              var errorContainer = document.getElementById('web-loader-error');
              var loaderContainer = document.getElementById('web-loader');

              if (request.responseText && errorContainer) {
                errorContainer.innerHTML = request.responseText;
              }

              if (loaderContainer) {
                loaderContainer.classList.add('hidden');
                errorContainer.classList.remove('hidden');
              }

              reject();
            }
          });
        }).finally(function () {
          // Promise has been settled.
          // Run the following whether or not it was a success.
          var installAtField = document.getElementById('joomlaapsinstallatinput');

          if (installAtField) {
            installAtField.value = webInstallerOptions.options.installat_url;
          }

          _this2.clickforlinks();

          WebInstaller.clicker();

          if (webInstallerOptions.view !== 'extension') {
            [].slice.call(document.querySelectorAll('div.load-extension')).forEach(function (element) {
              element.addEventListener('click', function (event) {
                event.preventDefault();

                _this2.processLinkClick(element.getAttribute('data-url'));
              });
              element.setAttribute('href', '#');
            });
          }

          if (webInstallerOptions.view === 'extension') {
            var installExtensionButton = document.getElementById('install-extension');
            var installExtensionFromExternalButton = document.getElementById('install-extension-from-external');

            if (installExtensionButton) {
              installExtensionButton.addEventListener('click', function () {
                WebInstaller.installfromweb(installExtensionButton.getAttribute('data-downloadurl'), installExtensionButton.getAttribute('data-name'));
                document.getElementById('uploadform-web-install').scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              });
            }

            if (installExtensionFromExternalButton) {
              installExtensionFromExternalButton.addEventListener('click', function () {
                var redirectUrl = installExtensionFromExternalButton.getAttribute('data-downloadurl');
                var redirectConfirm = window.confirm(Joomla.Text._('PLG_INSTALLER_WEBINSTALLER_REDIRECT_TO_EXTERNAL_SITE_TO_INSTALL').replace('[SITEURL]', redirectUrl));

                if (redirectConfirm !== true) {
                  return;
                }

                document.getElementById('adminForm').setAttribute('action', redirectUrl);
                document.querySelector('input[name=task]').setAttribute('disabled', true);
                document.querySelector('input[name=install_directory]').setAttribute('disabled', true);
                document.querySelector('input[name=install_url]').setAttribute('disabled', true);
                document.querySelector('input[name=installtype]').setAttribute('disabled', true);
                document.querySelector('input[name=filter_search]').setAttribute('disabled', true);
                document.getElementById('adminForm').submit();
              });
            }
          }

          if (webInstallerOptions.list && document.querySelector('.list-view')) {
            document.querySelector('.list-view').click();
          }

          WebInstaller.hideLoadingLayer();
        });
        return true;
      }
    }, {
      key: "clickforlinks",
      value: function clickforlinks() {
        var _this3 = this;

        [].slice.call(document.querySelectorAll('a.transcode')).forEach(function (element) {
          var ajaxurl = element.getAttribute('href');
          element.addEventListener('click', function (event) {
            event.preventDefault();

            _this3.processLinkClick(ajaxurl);
          });
          element.setAttribute('href', '#');
        });
      }
    }, {
      key: "initiateSearch",
      value: function initiateSearch() {
        webInstallerOptions.view = 'dashboard';
        this.installfromwebajaxsubmit();
      }
    }, {
      key: "installfromwebajaxsubmit",
      value: function installfromwebajaxsubmit() {
        var tail = "&view=".concat(webInstallerOptions.view);

        if (webInstallerOptions.id) {
          tail += "&id=".concat(webInstallerOptions.id);
        }

        if (document.getElementById('com-apps-searchbox').value) {
          var value = encodeURI(document.getElementById('com-apps-searchbox').value.toLowerCase().replace(/ +/g, '_').replace(/[^a-z0-9-_]/g, '').trim());
          tail += "&filter_search=".concat(value);
        }

        var orderingSelect = document.getElementById('com-apps-ordering');
        var versionSelect = document.getElementById('com-apps-filter-joomla-version');

        if (webInstallerOptions.ordering !== '' && orderingSelect && orderingSelect.value) {
          webInstallerOptions.ordering = orderingSelect.value;
        }

        if (webInstallerOptions.ordering) {
          tail += "&ordering=".concat(webInstallerOptions.ordering);
        }

        if (webInstallerOptions.version !== '' && versionSelect && versionSelect.value) {
          webInstallerOptions.version = versionSelect.value;
        }

        if (webInstallerOptions.version) {
          tail += "&filter_version=".concat(webInstallerOptions.version);
        }

        this.loadweb("".concat(webInstallerOptions.options.base_url, "index.php?format=json&option=com_apps").concat(tail));
      }
    }, {
      key: "processLinkClick",
      value: function processLinkClick(url) {
        var pattern1 = new RegExp(webInstallerOptions.options.base_url);
        var pattern2 = new RegExp('^index.php');

        if (pattern1.test(url) || pattern2.test(url)) {
          webInstallerOptions.view = url.replace(/^.+[&?]view=(\w+).*$/, '$1');

          if (webInstallerOptions.view === 'dashboard') {
            webInstallerOptions.id = 0;
          } else if (webInstallerOptions.view === 'category') {
            webInstallerOptions.id = url.replace(/^.+[&?]id=(\d+).*$/, '$1');
          }

          this.loadweb(webInstallerOptions.options.base_url + url);
        } else {
          this.loadweb(url);
        }
      }
    }, {
      key: "submitButtonUrl",
      value: // eslint-disable-next-line class-methods-use-this
      function submitButtonUrl() {
        var form = document.getElementById('adminForm'); // do field validation

        if (form.install_url.value === '' || form.install_url.value === 'http://' || form.install_url.value === 'https://') {
          Joomla.renderMessages({
            warning: [Joomla.Text._('COM_INSTALLER_MSG_INSTALL_ENTER_A_URL')]
          });
        } else {
          var loading = document.getElementById('loading');

          if (loading) {
            loading.classList.remove('hidden');
          }

          form.installtype.value = 'url';
          form.submit();
        }
      }
    }, {
      key: "submitButtonWeb",
      value: function submitButtonWeb() {
        var form = document.getElementById('adminForm'); // do field validation

        if (form.install_url.value !== '' || form.install_url.value !== 'http://' || form.install_url.value !== 'https://') {
          this.submitButtonUrl();
        } else if (form.install_url.value === '') {
          Joomla.renderMessages({
            warning: [Joomla.apps.options.btntxt]
          });
        } else {
          document.querySelector('#appsloading').classList.remove('hidden');
          form.installtype.value = 'web';
          form.submit();
        }
      }
    }], [{
      key: "showLoadingLayer",
      value: function showLoadingLayer() {
        document.getElementById('web').appendChild(document.createElement('joomla-core-loader'));
      }
    }, {
      key: "hideLoadingLayer",
      value: function hideLoadingLayer() {
        var spinnerElement = document.querySelector('#web joomla-core-loader');
        spinnerElement.parentNode.removeChild(spinnerElement);
      }
    }, {
      key: "clicker",
      value: function clicker() {
        if (document.querySelector('.grid-view')) {
          document.querySelector('.grid-view').addEventListener('click', function () {
            webInstallerOptions.list = 0;
            document.querySelector('.list-container').classList.add('hidden');
            document.querySelector('.grid-container').classList.remove('hidden');
            document.getElementById('btn-list-view').classList.remove('active');
            document.getElementById('btn-grid-view').classList.remove('active');
          });
        }

        if (document.querySelector('.list-view')) {
          document.querySelector('.list-view').addEventListener('click', function () {
            webInstallerOptions.list = 1;
            document.querySelector('.grid-container').classList.add('hidden');
            document.querySelector('.list-container').classList.remove('hidden');
            document.getElementById('btn-grid-view').classList.remove('active');
            document.getElementById('btn-list-view').classList.add('active');
          });
        }
      }
      /**
       * @param {string} installUrl
       * @param {string} name
       * @returns {boolean}
       */

    }, {
      key: "installfromweb",
      value: function installfromweb(installUrl) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!installUrl) {
          Joomla.renderMessages({
            warning: [Joomla.Text._('PLG_INSTALLER_WEBINSTALLER_CANNOT_INSTALL_EXTENSION_IN_PLUGIN')]
          });
          return false;
        }

        document.getElementById('install_url').value = installUrl;
        document.getElementById('uploadform-web-url').innerText = installUrl;

        if (name) {
          document.getElementById('uploadform-web-name').innerText = name;
          document.getElementById('uploadform-web-name-label').classList.remove('hidden');
        } else {
          document.getElementById('uploadform-web-name-label').classList.add('hidden');
        }

        document.getElementById('uploadform-web').classList.remove('hidden');
        return true;
      }
    }]);

    return WebInstaller;
  }();

  document.addEventListener('DOMContentLoaded', function () {
    var initialiser = function initialiser() {
      var installerTabs = document.getElementById('myTab'); // Need to wait for the CE to have inserted the tabs list

      if (installerTabs.firstElementChild.tagName !== 'UL') {
        window.setTimeout(initialiser, 50);
        return;
      }

      var link = installerTabs.querySelector('#tab-web'); // Abort if the IFW tab cannot be found

      if (!link) {
        return;
      }

      if (webInstallerOptions.options.installfromon) {
        link.click();
      }

      if (link.hasAttribute('active') && !instance) {
        instance = new WebInstaller();
        instance.initialise();
      }

      if (webInstallerOptions.options.installfrom_url !== '') {
        link.click();
      }

      link.addEventListener('joomla.tab.shown', function () {
        if (!instance) {
          instance = new WebInstaller();
          instance.initialise();
        }
      });
    };

    window.setTimeout(initialiser, 50);
  });
})(window, document, Joomla);