import { _ as _objectSpread2 } from './carousel.js';
import { B as BaseComponent, S as SelectorEngine, f as getSelectorFromElement, D as Data, E as EventHandler, a as getTransitionDurationFromElement, e as emulateTransitionEnd, r as reflow, g as getElementFromSelector, b as typeCheckConfig, h as isElement, M as Manipulator, d as defineJQueryPlugin } from './dom.js?1614049248';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'collapse';
var DATA_KEY = 'bs.collapse';
var EVENT_KEY = ".".concat(DATA_KEY);
var DATA_API_KEY = '.data-api';
var Default = {
  toggle: true,
  parent: ''
};
var DefaultType = {
  toggle: 'boolean',
  parent: '(string|element)'
};
var EVENT_SHOW = "show".concat(EVENT_KEY);
var EVENT_SHOWN = "shown".concat(EVENT_KEY);
var EVENT_HIDE = "hide".concat(EVENT_KEY);
var EVENT_HIDDEN = "hidden".concat(EVENT_KEY);
var EVENT_CLICK_DATA_API = "click".concat(EVENT_KEY).concat(DATA_API_KEY);
var CLASS_NAME_SHOW = 'show';
var CLASS_NAME_COLLAPSE = 'collapse';
var CLASS_NAME_COLLAPSING = 'collapsing';
var CLASS_NAME_COLLAPSED = 'collapsed';
var WIDTH = 'width';
var HEIGHT = 'height';
var SELECTOR_ACTIVES = '.show, .collapsing';
var SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._isTransitioning = false;
    this._config = this._getConfig(config);
    this._triggerArray = SelectorEngine.find("".concat(SELECTOR_DATA_TOGGLE, "[href=\"#").concat(element.id, "\"],") + "".concat(SELECTOR_DATA_TOGGLE, "[data-bs-target=\"#").concat(element.id, "\"]"));
    var toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE);

    for (var i = 0, len = toggleList.length; i < len; i++) {
      var elem = toggleList[i];
      var selector = getSelectorFromElement(elem);
      var filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === element);

      if (selector !== null && filterElement.length) {
        this._selector = selector;

        this._triggerArray.push(elem);
      }
    }

    this._parent = this._config.parent ? this._getParent() : null;

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._element, this._triggerArray);
    }

    if (this._config.toggle) {
      this.toggle();
    }
  } // Getters


  static get Default() {
    return Default;
  }

  static get DATA_KEY() {
    return DATA_KEY;
  } // Public


  toggle() {
    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW)) {
      return;
    }

    var actives;
    var activesData;

    if (this._parent) {
      actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent).filter(elem => {
        if (typeof this._config.parent === 'string') {
          return elem.getAttribute('data-bs-parent') === this._config.parent;
        }

        return elem.classList.contains(CLASS_NAME_COLLAPSE);
      });

      if (actives.length === 0) {
        actives = null;
      }
    }

    var container = SelectorEngine.findOne(this._selector);

    if (actives) {
      var tempActiveData = actives.find(elem => container !== elem);
      activesData = tempActiveData ? Data.getData(tempActiveData, DATA_KEY) : null;

      if (activesData && activesData._isTransitioning) {
        return;
      }
    }

    var startEvent = EventHandler.trigger(this._element, EVENT_SHOW);

    if (startEvent.defaultPrevented) {
      return;
    }

    if (actives) {
      actives.forEach(elemActive => {
        if (container !== elemActive) {
          Collapse.collapseInterface(elemActive, 'hide');
        }

        if (!activesData) {
          Data.setData(elemActive, DATA_KEY, null);
        }
      });
    }

    var dimension = this._getDimension();

    this._element.classList.remove(CLASS_NAME_COLLAPSE);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.style[dimension] = 0;

    if (this._triggerArray.length) {
      this._triggerArray.forEach(element => {
        element.classList.remove(CLASS_NAME_COLLAPSED);
        element.setAttribute('aria-expanded', true);
      });
    }

    this.setTransitioning(true);

    var complete = () => {
      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

      this._element.style[dimension] = '';
      this.setTransitioning(false);
      EventHandler.trigger(this._element, EVENT_SHOWN);
    };

    var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    var scrollSize = "scroll".concat(capitalizedDimension);
    var transitionDuration = getTransitionDurationFromElement(this._element);
    EventHandler.one(this._element, 'transitionend', complete);
    emulateTransitionEnd(this._element, transitionDuration);
    this._element.style[dimension] = "".concat(this._element[scrollSize], "px");
  }

  hide() {
    if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW)) {
      return;
    }

    var startEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (startEvent.defaultPrevented) {
      return;
    }

    var dimension = this._getDimension();

    this._element.style[dimension] = "".concat(this._element.getBoundingClientRect()[dimension], "px");
    reflow(this._element);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

    var triggerArrayLength = this._triggerArray.length;

    if (triggerArrayLength > 0) {
      for (var i = 0; i < triggerArrayLength; i++) {
        var trigger = this._triggerArray[i];
        var elem = getElementFromSelector(trigger);

        if (elem && !elem.classList.contains(CLASS_NAME_SHOW)) {
          trigger.classList.add(CLASS_NAME_COLLAPSED);
          trigger.setAttribute('aria-expanded', false);
        }
      }
    }

    this.setTransitioning(true);

    var complete = () => {
      this.setTransitioning(false);

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE);

      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };

    this._element.style[dimension] = '';
    var transitionDuration = getTransitionDurationFromElement(this._element);
    EventHandler.one(this._element, 'transitionend', complete);
    emulateTransitionEnd(this._element, transitionDuration);
  }

  setTransitioning(isTransitioning) {
    this._isTransitioning = isTransitioning;
  }

  dispose() {
    super.dispose();
    this._config = null;
    this._parent = null;
    this._triggerArray = null;
    this._isTransitioning = null;
  } // Private


  _getConfig(config) {
    config = _objectSpread2(_objectSpread2({}, Default), config);
    config.toggle = Boolean(config.toggle); // Coerce string values

    typeCheckConfig(NAME, config, DefaultType);
    return config;
  }

  _getDimension() {
    return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
  }

  _getParent() {
    var {
      parent
    } = this._config;

    if (isElement(parent)) {
      // it's a jQuery object
      if (typeof parent.jquery !== 'undefined' || typeof parent[0] !== 'undefined') {
        parent = parent[0];
      }
    } else {
      parent = SelectorEngine.findOne(parent);
    }

    var selector = "".concat(SELECTOR_DATA_TOGGLE, "[data-bs-parent=\"").concat(parent, "\"]");
    SelectorEngine.find(selector, parent).forEach(element => {
      var selected = getElementFromSelector(element);

      this._addAriaAndCollapsedClass(selected, [element]);
    });
    return parent;
  }

  _addAriaAndCollapsedClass(element, triggerArray) {
    if (!element || !triggerArray.length) {
      return;
    }

    var isOpen = element.classList.contains(CLASS_NAME_SHOW);
    triggerArray.forEach(elem => {
      if (isOpen) {
        elem.classList.remove(CLASS_NAME_COLLAPSED);
      } else {
        elem.classList.add(CLASS_NAME_COLLAPSED);
      }

      elem.setAttribute('aria-expanded', isOpen);
    });
  } // Static


  static collapseInterface(element, config) {
    var data = Data.getData(element, DATA_KEY);

    var _config = _objectSpread2(_objectSpread2(_objectSpread2({}, Default), Manipulator.getDataAttributes(element)), typeof config === 'object' && config ? config : {});

    if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }

    if (!data) {
      data = new Collapse(element, _config);
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError("No method named \"".concat(config, "\""));
      }

      data[config]();
    }
  }

  static jQueryInterface(config) {
    return this.each(function () {
      Collapse.collapseInterface(this, config);
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }

  var triggerData = Manipulator.getDataAttributes(this);
  var selector = getSelectorFromElement(this);
  var selectorElements = SelectorEngine.find(selector);
  selectorElements.forEach(element => {
    var data = Data.getData(element, DATA_KEY);
    var config;

    if (data) {
      // update parent attribute
      if (data._parent === null && typeof triggerData.parent === 'string') {
        data._config.parent = triggerData.parent;
        data._parent = data._getParent();
      }

      config = 'toggle';
    } else {
      config = triggerData;
    }

    Collapse.collapseInterface(element, config);
  });
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Collapse to jQuery only if jQuery is present
 */

defineJQueryPlugin(NAME, Collapse);

window.bootstrap = window.bootstrap || {};
window.bootstrap.Collapse = Collapse;

if (Joomla && Joomla.getOptions) {
  // Get the elements/configurations from the PHP
  var collapses = _objectSpread2(_objectSpread2({}, Joomla.getOptions('bootstrap.collapse')), Joomla.getOptions('bootstrap.accordion')); // Initialise the elements


  Object.keys(collapses).forEach(collapse => {
    var opt = collapses[collapse];
    var options = {
      toggle: opt.toggle ? opt.toggle : true
    };

    if (opt.parent) {
      options.parent = opt.parent;
    }

    var elements = Array.from(document.querySelectorAll(collapse));

    if (elements.length) {
      elements.map(el => new window.bootstrap.Collapse(el, options));
    }
  });
}

export { Collapse as C };
