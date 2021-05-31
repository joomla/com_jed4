import { B as BaseComponent, g as getElementFromSelector, E as EventHandler, D as Data, d as defineJQueryPlugin } from './dom.js?1621994459';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'alert';
const DATA_KEY = 'bs.alert';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const CLASS_NAME_ALERT = 'alert';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME;
  } // Public


  close(element) {
    const rootElement = element ? this._getRootElement(element) : this._element;

    const customEvent = this._triggerCloseEvent(rootElement);

    if (customEvent === null || customEvent.defaultPrevented) {
      return;
    }

    this._removeElement(rootElement);
  } // Private


  _getRootElement(element) {
    return getElementFromSelector(element) || element.closest(`.${CLASS_NAME_ALERT}`);
  }

  _triggerCloseEvent(element) {
    return EventHandler.trigger(element, EVENT_CLOSE);
  }

  _removeElement(element) {
    element.classList.remove(CLASS_NAME_SHOW);
    const isAnimated = element.classList.contains(CLASS_NAME_FADE);

    this._queueCallback(() => this._destroyElement(element), element, isAnimated);
  }

  _destroyElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }

    EventHandler.trigger(element, EVENT_CLOSED);
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.get(this, DATA_KEY);

      if (!data) {
        data = new Alert(this);
      }

      if (config === 'close') {
        data[config](this);
      }
    });
  }

  static handleDismiss(alertInstance) {
    return function (event) {
      if (event) {
        event.preventDefault();
      }

      alertInstance.close(this);
    };
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Alert to jQuery only if jQuery is present
 */

defineJQueryPlugin(Alert);

window.bootstrap = window.bootstrap || {};
window.bootstrap.Alert = Alert;

if (Joomla && Joomla.getOptions) {
  // Get the elements/configurations from the PHP
  const alerts = Joomla.getOptions('bootstrap.alert'); // Initialise the elements

  if (alerts && alerts.length) {
    alerts.forEach(selector => {
      Array.from(document.querySelectorAll(selector)).map(el => new window.bootstrap.Alert(el));
    });
  }
}

export { Alert as A };
