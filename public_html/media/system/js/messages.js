(() => {
  class JoomlaAlertElement extends HTMLElement {
    /* Attributes to monitor */
    static get observedAttributes() {
      return ['type', 'role', 'dismiss', 'acknowledge', 'href'];
    }

    get type() {
      return this.getAttribute('type');
    }

    set type(value) {
      return this.setAttribute('type', value);
    }

    get role() {
      return this.getAttribute('role');
    }

    set role(value) {
      return this.setAttribute('role', value);
    }

    get dismiss() {
      return this.getAttribute('dismiss');
    }

    get autodismiss() {
      return this.getAttribute('auto-dismiss');
    }

    get acknowledge() {
      return this.getAttribute('acknowledge');
    }

    get href() {
      return this.getAttribute('href');
    }
    /* Lifecycle, element appended to the DOM */


    connectedCallback() {
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


    disconnectedCallback() {
      this.removeEventListener('joomla.alert.show', this);
      this.removeEventListener('joomla.alert.close', this);
      this.removeEventListener('joomla.alert.closed', this);

      if (this.firstChild.tagName && this.firstChild.tagName.toLowerCase() === 'button') {
        this.firstChild.removeEventListener('click', this);
      }
    }
    /* Respond to attribute changes */


    attributeChangedCallback(attr, oldValue, newValue) {
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
    }

    markAlertClosed(element) {
      this.dispatchCustomEvent('joomla.alert.closed');

      if (element) {
        element.parentNode.removeChild(element);
      } else {
        this.remove();
      }
    }
    /* Method to close the alert */


    close(element = null) {
      this.dispatchCustomEvent('joomla.alert.close');

      if (window.matchMedia('(prefers-reduced-motion)').matches) {
        this.markAlertClosed(element);
      } else {
        this.addEventListener('transitionend', () => this.markAlertClosed(element), false);
      }

      this.classList.remove('joomla-alert--show');
    }
    /* Method to dispatch events */


    dispatchCustomEvent(eventName) {
      const OriginalCustomEvent = new CustomEvent(eventName);
      OriginalCustomEvent.relatedTarget = this;
      this.dispatchEvent(OriginalCustomEvent);
      this.removeEventListener(eventName, this);
    }
    /* Method to create the close button */


    appendCloseButton() {
      if (this.querySelector('button.joomla-alert--close') || this.querySelector('button.joomla-alert-button--close')) {
        return;
      }

      const self = this;
      const closeButton = document.createElement('button');

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
          closeButton.addEventListener('click', () => {
            self.dispatchCustomEvent('joomla.alert.buttonClicked');

            if (self.getAttribute('data-callback')) {
              window[self.getAttribute('data-callback')]();
              self.close();
            } else {
              self.close();
            }
          });
        } else {
          closeButton.addEventListener('click', () => {
            self.dispatchCustomEvent('joomla.alert.buttonClicked');
            window.location.href = self.href;
            self.close();
          });
        }
      }
    }
    /* Method to auto-dismiss */


    autoDismiss() {
      const self = this;
      setTimeout(() => {
        self.dispatchCustomEvent('joomla.alert.buttonClicked');

        if (self.hasAttribute('data-callback')) {
          window[self.getAttribute('data-callback')]();
        } else {
          self.close(self);
        }
      }, parseInt(self.getAttribute('auto-dismiss'), 10) ? self.getAttribute('auto-dismiss') : 3000);
    }
    /* Method to remove the close button */


    removeCloseButton() {
      const button = this.querySelector('button');

      if (button) {
        button.removeEventListener('click', this);
        button.parentNode.removeChild(button);
      }
    }
    /* Method to get the translated text */


    getText(str, fallback) {
      // TODO: Remove coupling to Joomla CMS Core JS here

      /* eslint-disable-next-line no-undef */
      return window.Joomla && Joomla.JText && Joomla.JText._ && typeof Joomla.JText._ === 'function' && Joomla.JText._(str) ? Joomla.JText._(str) : fallback;
    }

  }

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

const getMessageContainer = container => {
  let messageContainer;

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


Joomla.renderMessages = (messages, selector, keepOld, timeout) => {
  const messageContainer = getMessageContainer(selector);

  if (typeof keepOld === 'undefined' || keepOld && keepOld === false) {
    Joomla.removeMessages(messageContainer);
  }

  [].slice.call(Object.keys(messages)).forEach(type => {
    let alertClass = type; // Array of messages of this type

    const typeMessages = messages[type];
    const messagesBox = document.createElement('joomla-alert');

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


    const title = Joomla.Text._(type); // Skip titles with untranslated strings


    if (typeof title !== 'undefined') {
      const titleWrapper = document.createElement('div');
      titleWrapper.className = 'alert-heading';
      titleWrapper.innerHTML = Joomla.sanitizeHtml(`<span class="${type}"></span><span class="visually-hidden">${Joomla.Text._(type) ? Joomla.Text._(type) : type}</span>`);
      messagesBox.appendChild(titleWrapper);
    } // Add messages to the message box


    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'alert-wrapper';
    typeMessages.forEach(typeMessage => {
      messageWrapper.innerHTML += Joomla.sanitizeHtml(`<div class="alert-message">${typeMessage}</div>`);
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


Joomla.removeMessages = container => {
  const messageContainer = getMessageContainer(container);
  const alerts = [].slice.call(messageContainer.querySelectorAll('joomla-alert'));

  if (alerts.length) {
    alerts.forEach(alert => {
      alert.close();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const messages = Joomla.getOptions('joomla.messages');

  if (messages) {
    Object.keys(messages).map(message => Joomla.renderMessages(messages[message], undefined, true, undefined));
  }
});
