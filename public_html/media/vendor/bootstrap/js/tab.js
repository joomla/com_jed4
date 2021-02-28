import { B as BaseComponent, g as getElementFromSelector, S as SelectorEngine, E as EventHandler, a as getTransitionDurationFromElement, e as emulateTransitionEnd, r as reflow, D as Data, d as defineJQueryPlugin } from './dom.js?1614481245';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'tab';
var DATA_KEY = 'bs.tab';
var EVENT_KEY = ".".concat(DATA_KEY);
var DATA_API_KEY = '.data-api';
var EVENT_HIDE = "hide".concat(EVENT_KEY);
var EVENT_HIDDEN = "hidden".concat(EVENT_KEY);
var EVENT_SHOW = "show".concat(EVENT_KEY);
var EVENT_SHOWN = "shown".concat(EVENT_KEY);
var EVENT_CLICK_DATA_API = "click".concat(EVENT_KEY).concat(DATA_API_KEY);
var CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
var CLASS_NAME_ACTIVE = 'active';
var CLASS_NAME_DISABLED = 'disabled';
var CLASS_NAME_FADE = 'fade';
var CLASS_NAME_SHOW = 'show';
var SELECTOR_DROPDOWN = '.dropdown';
var SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
var SELECTOR_ACTIVE = '.active';
var SELECTOR_ACTIVE_UL = ':scope > li > .active';
var SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
var SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
var SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tab extends BaseComponent {
  // Getters
  static get DATA_KEY() {
    return DATA_KEY;
  } // Public


  show() {
    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE) || this._element.classList.contains(CLASS_NAME_DISABLED)) {
      return;
    }

    var previous;
    var target = getElementFromSelector(this._element);

    var listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

    if (listElement) {
      var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
      previous = SelectorEngine.find(itemSelector, listElement);
      previous = previous[previous.length - 1];
    }

    var hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE, {
      relatedTarget: this._element
    }) : null;
    var showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget: previous
    });

    if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
      return;
    }

    this._activate(this._element, listElement);

    var complete = () => {
      EventHandler.trigger(previous, EVENT_HIDDEN, {
        relatedTarget: this._element
      });
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget: previous
      });
    };

    if (target) {
      this._activate(target, target.parentNode, complete);
    } else {
      complete();
    }
  } // Private


  _activate(element, container, callback) {
    var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
    var active = activeElements[0];
    var isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE);

    var complete = () => this._transitionComplete(element, active, callback);

    if (active && isTransitioning) {
      var transitionDuration = getTransitionDurationFromElement(active);
      active.classList.remove(CLASS_NAME_SHOW);
      EventHandler.one(active, 'transitionend', complete);
      emulateTransitionEnd(active, transitionDuration);
    } else {
      complete();
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      active.classList.remove(CLASS_NAME_ACTIVE);
      var dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

      if (dropdownChild) {
        dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
      }

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false);
      }
    }

    element.classList.add(CLASS_NAME_ACTIVE);

    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true);
    }

    reflow(element);

    if (element.classList.contains(CLASS_NAME_FADE)) {
      element.classList.add(CLASS_NAME_SHOW);
    }

    if (element.parentNode && element.parentNode.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
      var dropdownElement = element.closest(SELECTOR_DROPDOWN);

      if (dropdownElement) {
        SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
      }

      element.setAttribute('aria-expanded', true);
    }

    if (callback) {
      callback();
    }
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      var data = Data.getData(this, DATA_KEY) || new Tab(this);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError("No method named \"".concat(config, "\""));
        }

        data[config]();
      }
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  event.preventDefault();
  var data = Data.getData(this, DATA_KEY) || new Tab(this);
  data.show();
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tab to jQuery only if jQuery is present
 */

defineJQueryPlugin(NAME, Tab);

window.Joomla = window.Joomla || {};
window.bootstrap = window.bootstrap || {};
window.bootstrap.Tab = Tab;
/**
 * Initialise the Tabs interactivity
 *
 * @param {HTMLElement} el The element that will become an collapse
 * @param {object} options The options for this collapse
 */

Joomla.initialiseTabs = (el, options) => {
  if (!(el instanceof Element) && options.isJoomla) {
    var tab = document.querySelector("".concat(el, "Content"));

    if (tab) {
      var related = Array.from(tab.children); // Build the navigation

      if (related.length) {
        related.forEach(element => {
          if (!element.classList.contains('tab-pane')) {
            return;
          }

          var isActive = element.dataset.active !== '';
          var ul = document.querySelector("".concat(el, "Tabs"));

          if (ul) {
            var link = document.createElement('a');
            link.href = "#".concat(element.dataset.id);
            link.classList.add('nav-link');

            if (isActive) {
              link.classList.add('active');
            }

            link.dataset.bsToggle = 'tab';
            link.setAttribute('role', 'tab');
            link.setAttribute('aria-controls', element.dataset.id);
            link.setAttribute('aria-selected', element.dataset.id);
            /**
             * As we are re-rendering text already displayed on the page we judge that there isn't
             * a risk of XSS attacks
             */

            link.innerHTML = element.dataset.title;
            var li = document.createElement('li');
            li.classList.add('nav-item');
            li.setAttribute('role', 'presentation');
            li.appendChild(link);
            ul.appendChild(li); // eslint-disable-next-line no-new

            new window.bootstrap.Tab(li);
          }
        });
      }
    }
  } else {
    Array.from(document.querySelectorAll("".concat(el, " a"))).map(tab => new window.bootstrap.Tab(tab, options));
  }
};

if (Joomla && Joomla.getOptions) {
  // Get the elements/configurations from the PHP
  var tabs = Joomla.getOptions('bootstrap.tabs'); // Initialise the elements

  if (typeof tabs === 'object' && tabs !== null) {
    Object.keys(tabs).map(tab => Joomla.initialiseTabs(tab, tabs[tab]));
  }
}

export { Tab as T };
