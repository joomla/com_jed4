import { B as BaseComponent, g as getElementFromSelector, E as EventHandler, a as getTransitionDurationFromElement, e as emulateTransitionEnd, D as Data, d as defineJQueryPlugin } from './dom.js?1614481245';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'alert';
var DATA_KEY = 'bs.alert';
var EVENT_KEY = ".".concat(DATA_KEY);
var DATA_API_KEY = '.data-api';
var SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
var EVENT_CLOSE = "close".concat(EVENT_KEY);
var EVENT_CLOSED = "closed".concat(EVENT_KEY);
var EVENT_CLICK_DATA_API = "click".concat(EVENT_KEY).concat(DATA_API_KEY);
var CLASS_NAME_ALERT = 'alert';
var CLASS_NAME_FADE = 'fade';
var CLASS_NAME_SHOW = 'show';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Alert extends BaseComponent {
  // Getters
  static get DATA_KEY() {
    return DATA_KEY;
  } // Public


  close(element) {
    var rootElement = element ? this._getRootElement(element) : this._element;

    var customEvent = this._triggerCloseEvent(rootElement);

    if (customEvent === null || customEvent.defaultPrevented) {
      return;
    }

    this._removeElement(rootElement);
  } // Private


  _getRootElement(element) {
    return getElementFromSelector(element) || element.closest(".".concat(CLASS_NAME_ALERT));
  }

  _triggerCloseEvent(element) {
    return EventHandler.trigger(element, EVENT_CLOSE);
  }

  _removeElement(element) {
    element.classList.remove(CLASS_NAME_SHOW);

    if (!element.classList.contains(CLASS_NAME_FADE)) {
      this._destroyElement(element);

      return;
    }

    var transitionDuration = getTransitionDurationFromElement(element);
    EventHandler.one(element, 'transitionend', () => this._destroyElement(element));
    emulateTransitionEnd(element, transitionDuration);
  }

  _destroyElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }

    EventHandler.trigger(element, EVENT_CLOSED);
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      var data = Data.getData(this, DATA_KEY);

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

defineJQueryPlugin(NAME, Alert);

window.bootstrap = window.bootstrap || {};
window.bootstrap.Alert = Alert;

if (Joomla && Joomla.getOptions) {
  // Get the elements/configurations from the PHP
  var alerts = Joomla.getOptions('bootstrap.alert'); // Initialise the elements

  if (alerts && alerts.length) {
    alerts.forEach(selector => {
      Array.from(document.querySelectorAll(selector)).map(el => new window.bootstrap.Alert(el));
    });
  }
}

export { Alert as A };
