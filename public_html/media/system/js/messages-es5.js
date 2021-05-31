(function () {
  'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  (function () {
    var JoomlaAlertElement = /*#__PURE__*/function (_HTMLElement) {
      _inheritsLoose(JoomlaAlertElement, _HTMLElement);

      function JoomlaAlertElement() {
        return _HTMLElement.apply(this, arguments) || this;
      }

      var _proto = JoomlaAlertElement.prototype;

      /* Lifecycle, element appended to the DOM */
      _proto.connectedCallback = function connectedCallback() {
        this.classList.add('joomla-alert--show'); // Default to info

        if (!this.type || ['info', 'warning', 'danger', 'success'].indexOf(this.type) === -1) {
          this.setAttribute('type', 'info');
        } // Default to alert


        if (!this.role || ['alert', 'alertdialog'].indexOf(this.role) === -1) {
          this.setAttribute('role', 'alert');
        } // Append button


        if (this.hasAttribute('dismiss') || this.hasAttribute('acknowledge') || this.hasAttribute('href') && this.getAttribute('href') !== '' && !this.querySelector('button.joomla-alert--close') && !this.querySelector('button.joomla-alert-button--close')) {
          this.appendCloseButton();
        }

        if (this.hasAttribute('auto-dismiss')) {
          this.autoDismiss();
        }

        this.dispatchCustomEvent('joomla.alert.show');
      }
      /* Lifecycle, element removed from the DOM */
      ;

      _proto.disconnectedCallback = function disconnectedCallback() {
        this.removeEventListener('joomla.alert.show', this);
        this.removeEventListener('joomla.alert.close', this);
        this.removeEventListener('joomla.alert.closed', this);

        if (this.firstChild.tagName && this.firstChild.tagName.toLowerCase() === 'button') {
          this.firstChild.removeEventListener('click', this);
        }
      }
      /* Respond to attribute changes */
      ;

      _proto.attributeChangedCallback = function attributeChangedCallback(attr, oldValue, newValue) {
        switch (attr) {
          case 'type':
            if (!newValue || newValue && ['info', 'warning', 'danger', 'success'].indexOf(newValue) === -1) {
              this.type = 'info';
            }

            break;

          case 'role':
            if (!newValue || newValue && ['alert', 'alertdialog'].indexOf(newValue) === -1) {
              this.role = 'alert';
            }

            break;

          case 'dismiss':
          case 'acknowledge':
            if (!newValue || newValue === 'true') {
              this.appendCloseButton();
            } else {
              this.removeCloseButton();
            }

            break;

          case 'auto-dismiss':
            this.autoDismiss();
            break;

          case 'href':
            if (!newValue || newValue === '') {
              this.removeCloseButton();
            } else if (!this.querySelector('button.joomla-alert-button--close')) {
              this.appendCloseButton();
            }

            break;
        }
      };

      _proto.markAlertClosed = function markAlertClosed(element) {
        this.dispatchCustomEvent('joomla.alert.closed');

        if (element) {
          element.parentNode.removeChild(element);
        } else {
          this.remove();
        }
      }
      /* Method to close the alert */
      ;

      _proto.close = function close(element) {
        var _this = this;

        if (element === void 0) {
          element = null;
        }

        this.dispatchCustomEvent('joomla.alert.close');

        if (window.matchMedia('(prefers-reduced-motion)').matches) {
          this.markAlertClosed(element);
        } else {
          this.addEventListener('transitionend', function () {
            return _this.markAlertClosed(element);
          }, false);
        }

        this.classList.remove('joomla-alert--show');
      }
      /* Method to dispatch events */
      ;

      _proto.dispatchCustomEvent = function dispatchCustomEvent(eventName) {
        var OriginalCustomEvent = new CustomEvent(eventName);
        OriginalCustomEvent.relatedTarget = this;
        this.dispatchEvent(OriginalCustomEvent);
        this.removeEventListener(eventName, this);
      }
      /* Method to create the close button */
      ;

      _proto.appendCloseButton = function appendCloseButton() {
        if (this.querySelector('button.joomla-alert--close') || this.querySelector('button.joomla-alert-button--close')) {
          return;
        }

        var self = this;
        var closeButton = document.createElement('button');

        if (this.hasAttribute('dismiss')) {
          closeButton.classList.add('joomla-alert--close');
          closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
          closeButton.setAttribute('aria-label', this.getText('JCLOSE', 'Close'));
        } else {
          closeButton.classList.add('joomla-alert-button--close');

          if (this.hasAttribute('acknowledge')) {
            closeButton.innerHTML = this.getText('JOK', 'ok');
          } else {
            closeButton.innerHTML = this.getText('JOPEN', 'Open');
          }
        }

        if (this.firstChild) {
          this.insertBefore(closeButton, this.firstChild);
        } else {
          this.appendChild(closeButton);
        }
        /* Add the required listener */


        if (closeButton) {
          if (!this.href) {
            closeButton.addEventListener('click', function () {
              self.dispatchCustomEvent('joomla.alert.buttonClicked');

              if (self.getAttribute('data-callback')) {
                window[self.getAttribute('data-callback')]();
                self.close();
              } else {
                self.close();
              }
            });
          } else {
            closeButton.addEventListener('click', function () {
              self.dispatchCustomEvent('joomla.alert.buttonClicked');
              window.location.href = self.href;
              self.close();
            });
          }
        }
      }
      /* Method to auto-dismiss */
      ;

      _proto.autoDismiss = function autoDismiss() {
        var self = this;
        setTimeout(function () {
          self.dispatchCustomEvent('joomla.alert.buttonClicked');

          if (self.hasAttribute('data-callback')) {
            window[self.getAttribute('data-callback')]();
          } else {
            self.close(self);
          }
        }, parseInt(self.getAttribute('auto-dismiss'), 10) ? self.getAttribute('auto-dismiss') : 3000);
      }
      /* Method to remove the close button */
      ;

      _proto.removeCloseButton = function removeCloseButton() {
        var button = this.querySelector('button');

        if (button) {
          button.removeEventListener('click', this);
          button.parentNode.removeChild(button);
        }
      }
      /* Method to get the translated text */
      ;

      _proto.getText = function getText(str, fallback) {
        // TODO: Remove coupling to Joomla CMS Core JS here

        /* eslint-disable-next-line no-undef */
        return window.Joomla && Joomla.JText && Joomla.JText._ && typeof Joomla.JText._ === 'function' && Joomla.JText._(str) ? Joomla.JText._(str) : fallback;
      };

      _createClass(JoomlaAlertElement, [{
        key: "type",
        get: function get() {
          return this.getAttribute('type');
        },
        set: function set(value) {
          return this.setAttribute('type', value);
        }
      }, {
        key: "role",
        get: function get() {
          return this.getAttribute('role');
        },
        set: function set(value) {
          return this.setAttribute('role', value);
        }
      }, {
        key: "dismiss",
        get: function get() {
          return this.getAttribute('dismiss');
        }
      }, {
        key: "autodismiss",
        get: function get() {
          return this.getAttribute('auto-dismiss');
        }
      }, {
        key: "acknowledge",
        get: function get() {
          return this.getAttribute('acknowledge');
        }
      }, {
        key: "href",
        get: function get() {
          return this.getAttribute('href');
        }
      }], [{
        key: "observedAttributes",
        get:
        /* Attributes to monitor */
        function get() {
          return ['type', 'role', 'dismiss', 'acknowledge', 'href'];
        }
      }]);

      return JoomlaAlertElement;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

    customElements.define('joomla-alert', JoomlaAlertElement);
  })();
  /**
   * @copyright  (C) 2020 Open Source Matters, Inc. <https://www.joomla.org>
   * @license    GNU General Public License version 2 or later; see LICENSE.txt
   */

  /**
   * Returns the container of the Messages
   *
   * @param {string|HTMLElement}  container  The container
   *
   * @returns {HTMLElement}
   */


  var getMessageContainer = function getMessageContainer(container) {
    var messageContainer;

    if (container instanceof HTMLElement) {
      return container;
    }

    if (typeof container === 'undefined' || container && container === '#system-message-container') {
      messageContainer = document.getElementById('system-message-container');
    } else {
      messageContainer = document.querySelector(container);
    }

    return messageContainer;
  };
  /**
   * Render messages send via JSON
   * Used by some javascripts such as validate.js
   *
   * @param   {object}  messages JavaScript object containing the messages to render.
   *          Example:
   *          const messages = {
   *              "message": ["This will be a green message", "So will this"],
   *              "error": ["This will be a red message", "So will this"],
   *              "info": ["This will be a blue message", "So will this"],
   *              "notice": ["This will be same as info message", "So will this"],
   *              "warning": ["This will be a orange message", "So will this"],
   *              "my_custom_type": ["This will be same as info message", "So will this"]
   *          };
   * @param  {string} selector The selector of the container where the message will be rendered
   * @param  {bool}   keepOld  If we shall discard old messages
   * @param  {int}    timeout  The milliseconds before the message self destruct
   * @return  void
   */


  Joomla.renderMessages = function (messages, selector, keepOld, timeout) {
    var messageContainer = getMessageContainer(selector);

    if (typeof keepOld === 'undefined' || keepOld && keepOld === false) {
      Joomla.removeMessages(messageContainer);
    }

    [].slice.call(Object.keys(messages)).forEach(function (type) {
      var alertClass = type; // Array of messages of this type

      var typeMessages = messages[type];
      var messagesBox = document.createElement('joomla-alert');

      if (['success', 'info', 'danger', 'warning'].indexOf(type) < 0) {
        alertClass = type === 'notice' ? 'info' : type;
        alertClass = type === 'message' ? 'success' : alertClass;
        alertClass = type === 'error' ? 'danger' : alertClass;
        alertClass = type === 'warning' ? 'warning' : alertClass;
      }

      messagesBox.setAttribute('type', alertClass);
      messagesBox.setAttribute('dismiss', true);

      if (timeout && parseInt(timeout, 10) > 0) {
        messagesBox.setAttribute('auto-dismiss', timeout);
      } // Title


      var title = Joomla.Text._(type); // Skip titles with untranslated strings


      if (typeof title !== 'undefined') {
        var titleWrapper = document.createElement('div');
        titleWrapper.className = 'alert-heading';
        titleWrapper.innerHTML = Joomla.sanitizeHtml("<span class=\"" + type + "\"></span><span class=\"visually-hidden\">" + (Joomla.Text._(type) ? Joomla.Text._(type) : type) + "</span>");
        messagesBox.appendChild(titleWrapper);
      } // Add messages to the message box


      var messageWrapper = document.createElement('div');
      messageWrapper.className = 'alert-wrapper';
      typeMessages.forEach(function (typeMessage) {
        messageWrapper.innerHTML += Joomla.sanitizeHtml("<div class=\"alert-message\">" + typeMessage + "</div>");
      });
      messagesBox.appendChild(messageWrapper);
      messageContainer.appendChild(messagesBox);
    });
  };
  /**
   * Remove messages
   *
   * @param  {element} container The element of the container of the message
   * to be removed
   *
   * @return  {void}
   */


  Joomla.removeMessages = function (container) {
    var messageContainer = getMessageContainer(container);
    var alerts = [].slice.call(messageContainer.querySelectorAll('joomla-alert'));

    if (alerts.length) {
      alerts.forEach(function (alert) {
        alert.close();
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var messages = Joomla.getOptions('joomla.messages');

    if (messages) {
      Object.keys(messages).map(function (message) {
        return Joomla.renderMessages(messages[message], undefined, true, undefined);
      });
    }
  });

}());
