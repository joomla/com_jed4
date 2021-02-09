import { B as BaseComponent, S as SelectorEngine, E as EventHandler, a as getTransitionDurationFromElement, T as TRANSITION_END, e as emulateTransitionEnd, c as typeCheckConfig, r as reflow, h as isRTL, M as Manipulator, D as Data, g as getElementFromSelector, i as isVisible, o as onDOMContentLoaded, b as getjQuery } from './dom-8eef6b5f.js';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta1): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'modal';
const DATA_KEY = 'bs.modal';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ESCAPE_KEY = 'Escape';

const Default = {
  backdrop: true,
  keyboard: true,
  focus: true
};

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean'
};

const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
const CLASS_NAME_BACKDROP = 'modal-backdrop';
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_STATIC = 'modal-static';

const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="modal"]';
const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="modal"]';
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element);

    this._config = this._getConfig(config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, element);
    this._backdrop = null;
    this._isShown = false;
    this._isBodyOverflowing = false;
    this._ignoreBackdropClick = false;
    this._isTransitioning = false;
    this._scrollbarWidth = 0;
  }

  // Getters

  static get Default() {
    return Default
  }

  static get DATA_KEY() {
    return DATA_KEY
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return
    }

    if (this._element.classList.contains(CLASS_NAME_FADE)) {
      this._isTransitioning = true;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget
    });

    if (this._isShown || showEvent.defaultPrevented) {
      return
    }

    this._isShown = true;

    this._checkScrollbar();
    this._setScrollbar();

    this._adjustDialog();

    this._setEscapeEvent();
    this._setResizeEvent();

    EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, event => this.hide(event));

    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        }
      });
    });

    this._showBackdrop(() => this._showElement(relatedTarget));
  }

  hide(event) {
    if (event) {
      event.preventDefault();
    }

    if (!this._isShown || this._isTransitioning) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return
    }

    this._isShown = false;
    const transition = this._element.classList.contains(CLASS_NAME_FADE);

    if (transition) {
      this._isTransitioning = true;
    }

    this._setEscapeEvent();
    this._setResizeEvent();

    EventHandler.off(document, EVENT_FOCUSIN);

    this._element.classList.remove(CLASS_NAME_SHOW);

    EventHandler.off(this._element, EVENT_CLICK_DISMISS);
    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this._element);

      EventHandler.one(this._element, TRANSITION_END, event => this._hideModal(event));
      emulateTransitionEnd(this._element, transitionDuration);
    } else {
      this._hideModal();
    }
  }

  dispose() {
    [window, this._element, this._dialog]
      .forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY));

    super.dispose();

    /**
     * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
     * Do not move `document` in `htmlElements` array
     * It will remove `EVENT_CLICK_DATA_API` event that should remain
     */
    EventHandler.off(document, EVENT_FOCUSIN);

    this._config = null;
    this._dialog = null;
    this._backdrop = null;
    this._isShown = null;
    this._isBodyOverflowing = null;
    this._ignoreBackdropClick = null;
    this._isTransitioning = null;
    this._scrollbarWidth = null;
  }

  handleUpdate() {
    this._adjustDialog();
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...config
    };
    typeCheckConfig(NAME, config, DefaultType);
    return config
  }

  _showElement(relatedTarget) {
    const transition = this._element.classList.contains(CLASS_NAME_FADE);
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

    if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.appendChild(this._element);
    }

    this._element.style.display = 'block';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.scrollTop = 0;

    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    if (transition) {
      reflow(this._element);
    }

    this._element.classList.add(CLASS_NAME_SHOW);

    if (this._config.focus) {
      this._enforceFocus();
    }

    const transitionComplete = () => {
      if (this._config.focus) {
        this._element.focus();
      }

      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget
      });
    };

    if (transition) {
      const transitionDuration = getTransitionDurationFromElement(this._dialog);

      EventHandler.one(this._dialog, TRANSITION_END, transitionComplete);
      emulateTransitionEnd(this._dialog, transitionDuration);
    } else {
      transitionComplete();
    }
  }

  _enforceFocus() {
    EventHandler.off(document, EVENT_FOCUSIN); // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN, event => {
      if (document !== event.target &&
          this._element !== event.target &&
          !this._element.contains(event.target)) {
        this._element.focus();
      }
    });
  }

  _setEscapeEvent() {
    if (this._isShown) {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          event.preventDefault();
          this.hide();
        } else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
          this._triggerBackdropTransition();
        }
      });
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS);
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
    } else {
      EventHandler.off(window, EVENT_RESIZE);
    }
  }

  _hideModal() {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    this._showBackdrop(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._resetScrollbar();
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    });
  }

  _removeBackdrop() {
    this._backdrop.parentNode.removeChild(this._backdrop);
    this._backdrop = null;
  }

  _showBackdrop(callback) {
    const animate = this._element.classList.contains(CLASS_NAME_FADE) ?
      CLASS_NAME_FADE :
      '';

    if (this._isShown && this._config.backdrop) {
      this._backdrop = document.createElement('div');
      this._backdrop.className = CLASS_NAME_BACKDROP;

      if (animate) {
        this._backdrop.classList.add(animate);
      }

      document.body.appendChild(this._backdrop);

      EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return
        }

        if (event.target !== event.currentTarget) {
          return
        }

        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
        } else {
          this.hide();
        }
      });

      if (animate) {
        reflow(this._backdrop);
      }

      this._backdrop.classList.add(CLASS_NAME_SHOW);

      if (!animate) {
        callback();
        return
      }

      const backdropTransitionDuration = getTransitionDurationFromElement(this._backdrop);

      EventHandler.one(this._backdrop, TRANSITION_END, callback);
      emulateTransitionEnd(this._backdrop, backdropTransitionDuration);
    } else if (!this._isShown && this._backdrop) {
      this._backdrop.classList.remove(CLASS_NAME_SHOW);

      const callbackRemove = () => {
        this._removeBackdrop();
        callback();
      };

      if (this._element.classList.contains(CLASS_NAME_FADE)) {
        const backdropTransitionDuration = getTransitionDurationFromElement(this._backdrop);
        EventHandler.one(this._backdrop, TRANSITION_END, callbackRemove);
        emulateTransitionEnd(this._backdrop, backdropTransitionDuration);
      } else {
        callbackRemove();
      }
    } else {
      callback();
    }
  }

  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    if (hideEvent.defaultPrevented) {
      return
    }

    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden';
    }

    this._element.classList.add(CLASS_NAME_STATIC);
    const modalTransitionDuration = getTransitionDurationFromElement(this._dialog);
    EventHandler.off(this._element, TRANSITION_END);
    EventHandler.one(this._element, TRANSITION_END, () => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      if (!isModalOverflowing) {
        EventHandler.one(this._element, TRANSITION_END, () => {
          this._element.style.overflowY = '';
        });
        emulateTransitionEnd(this._element, modalTransitionDuration);
      }
    });
    emulateTransitionEnd(this._element, modalTransitionDuration);
    this._element.focus();
  }

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing =
      this._element.scrollHeight > document.documentElement.clientHeight;

    if ((!this._isBodyOverflowing && isModalOverflowing && !isRTL) || (this._isBodyOverflowing && !isModalOverflowing && isRTL)) {
      this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
    }

    if ((this._isBodyOverflowing && !isModalOverflowing && !isRTL) || (!this._isBodyOverflowing && isModalOverflowing && isRTL)) {
      this._element.style.paddingRight = `${this._scrollbarWidth}px`;
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect();
    this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
    this._scrollbarWidth = this._getScrollbarWidth();
  }

  _setScrollbar() {
    if (this._isBodyOverflowing) {
      // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
      //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

      // Adjust fixed content padding
      SelectorEngine.find(SELECTOR_FIXED_CONTENT)
        .forEach(element => {
          const actualPadding = element.style.paddingRight;
          const calculatedPadding = window.getComputedStyle(element)['padding-right'];
          Manipulator.setDataAttribute(element, 'padding-right', actualPadding);
          element.style.paddingRight = `${Number.parseFloat(calculatedPadding) + this._scrollbarWidth}px`;
        });

      // Adjust sticky content margin
      SelectorEngine.find(SELECTOR_STICKY_CONTENT)
        .forEach(element => {
          const actualMargin = element.style.marginRight;
          const calculatedMargin = window.getComputedStyle(element)['margin-right'];
          Manipulator.setDataAttribute(element, 'margin-right', actualMargin);
          element.style.marginRight = `${Number.parseFloat(calculatedMargin) - this._scrollbarWidth}px`;
        });

      // Adjust body padding
      const actualPadding = document.body.style.paddingRight;
      const calculatedPadding = window.getComputedStyle(document.body)['padding-right'];

      Manipulator.setDataAttribute(document.body, 'padding-right', actualPadding);
      document.body.style.paddingRight = `${Number.parseFloat(calculatedPadding) + this._scrollbarWidth}px`;
    }

    document.body.classList.add(CLASS_NAME_OPEN);
  }

  _resetScrollbar() {
    // Restore fixed content padding
    SelectorEngine.find(SELECTOR_FIXED_CONTENT)
      .forEach(element => {
        const padding = Manipulator.getDataAttribute(element, 'padding-right');
        if (typeof padding !== 'undefined') {
          Manipulator.removeDataAttribute(element, 'padding-right');
          element.style.paddingRight = padding;
        }
      });

    // Restore sticky content and navbar-toggler margin
    SelectorEngine.find(`${SELECTOR_STICKY_CONTENT}`)
      .forEach(element => {
        const margin = Manipulator.getDataAttribute(element, 'margin-right');
        if (typeof margin !== 'undefined') {
          Manipulator.removeDataAttribute(element, 'margin-right');
          element.style.marginRight = margin;
        }
      });

    // Restore body padding
    const padding = Manipulator.getDataAttribute(document.body, 'padding-right');
    if (typeof padding === 'undefined') {
      document.body.style.paddingRight = '';
    } else {
      Manipulator.removeDataAttribute(document.body, 'padding-right');
      document.body.style.paddingRight = padding;
    }
  }

  _getScrollbarWidth() { // thx d.walsh
    const scrollDiv = document.createElement('div');
    scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth
  }

  // Static

  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = {
        ...Default,
        ...Manipulator.getDataAttributes(this),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (!data) {
        data = new Modal(this, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](relatedTarget);
      }
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = getElementFromSelector(this);

  if (this.tagName === 'A' || this.tagName === 'AREA') {
    event.preventDefault();
  }

  EventHandler.one(target, EVENT_SHOW, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return
    }

    EventHandler.one(target, EVENT_HIDDEN, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });

  let data = Data.getData(target, DATA_KEY);
  if (!data) {
    const config = {
      ...Manipulator.getDataAttributes(target),
      ...Manipulator.getDataAttributes(this)
    };

    data = new Modal(target, config);
  }

  data.show(this);
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Modal to jQuery only if jQuery is present
 */

onDOMContentLoaded(() => {
  const $ = getjQuery();
  /* istanbul ignore if */
  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Modal.jQueryInterface;
    $.fn[NAME].Constructor = Modal;
    $.fn[NAME].noConflict = () => {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Modal.jQueryInterface
    };
  }
});

Joomla = Joomla || {};
Joomla.Modal = Joomla.Modal || {};
window.bootstrap = window.bootstrap || {};
window.bootstrap.Modal = Modal;

Joomla.initialiseModal = (modal, options) => {
  if (!(modal instanceof Element)) {
    return;
  }

  // eslint-disable-next-line no-new
  new window.bootstrap.Modal(modal, options);

  // Comply with the Joomla API - Bound element.open/close
  modal.open = () => { window.bootstrap.Modal.getInstance(modal).show(modal); };
  modal.close = () => { window.bootstrap.Modal.getInstance(modal).hide(); };

  // Do some Joomla specific changes
  modal.addEventListener('show.bs.modal', () => {
    // Comply with the Joomla API - Set the current Modal ID
    Joomla.Modal.setCurrent(modal);

    if (modal.dataset.url) {
      const modalBody = modal.querySelector('.modal-body');
      const iframe = modalBody.querySelector('iframe');

      if (iframe) {
        const addData = modal.querySelector('joomla-field-mediamore');

        if (addData) {
          addData.parentNode.removeChild(addData);
        }

        iframe.parentNode.removeChild(iframe);
      }

      // @todo merge https://github.com/joomla/joomla-cms/pull/20788
      // Hacks because com_associations and field modals use pure javascript in the url!
      if (modal.dataset.iframe.indexOf('document.getElementById') > 0) {
        const iframeTextArr = modal.dataset.iframe.split('+');
        const idFieldArr = iframeTextArr[1].split('"');
        let el;

        idFieldArr[0] = idFieldArr[0].replace(/&quot;/g, '"');

        if (!document.getElementById(idFieldArr[1])) {
          // eslint-disable-next-line no-eval
          el = eval(idFieldArr[0]); // This is UNSAFE!!!!
        } else {
          el = document.getElementById(idFieldArr[1]).value;
        }

        modalBody.insertAdjacentHTML('afterbegin', `${iframeTextArr[0]}${el}${iframeTextArr[2]}`);
      } else {
        modalBody.insertAdjacentHTML('afterbegin', modal.dataset.iframe);
      }
    }
  });

  modal.addEventListener('shown.bs.modal', () => {
    const modalBody = modal.querySelector('.modal-body');
    const modalHeader = modal.querySelector('.modal-header');
    const modalFooter = modal.querySelector('.modal-footer');
    let modalHeaderHeight = 0;
    let modalFooterHeight = 0;
    let maxModalBodyHeight = 0;
    let modalBodyPadding = 0;
    let modalBodyHeightOuter = 0;

    if (modalBody) {
      if (modalHeader) {
        const modalHeaderRects = modalHeader.getBoundingClientRect();
        modalHeaderHeight = modalHeaderRects.height;
        modalBodyHeightOuter = modalBody.offsetHeight;
      }
      if (modalFooter) {
        modalFooterHeight = parseFloat(getComputedStyle(modalFooter, null).height.replace('px', ''));
      }

      const modalBodyHeight = parseFloat(getComputedStyle(modalBody, null).height.replace('px', ''));
      const padding = modalBody.offsetTop;
      const maxModalHeight = parseFloat(getComputedStyle(document.body, null).height.replace('px', '')) - (padding * 2);
      modalBodyPadding = modalBodyHeightOuter - modalBodyHeight;
      // eslint-disable-next-line max-len
      maxModalBodyHeight = maxModalHeight - (modalHeaderHeight + modalFooterHeight + modalBodyPadding);
    }

    if (modal.dataset.url) {
      const iframeEl = modal.querySelector('iframe');
      const iframeHeight = parseFloat(getComputedStyle(iframeEl, null).height.replace('px', ''));
      if (iframeHeight > maxModalBodyHeight) {
        modalBody.style.maxHeight = maxModalBodyHeight;
        modalBody.style.overflowY = 'auto';
        iframeEl.style.maxHeight = maxModalBodyHeight - modalBodyPadding;
      }
    }
  });

  modal.addEventListener('hide.bs.modal', () => {
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.maxHeight = 'initial';
  });

  modal.addEventListener('hidden.bs.modal', () => {
    // Comply with the Joomla API - Remove the current Modal ID
    Joomla.Modal.setCurrent('');
  });
};

/**
 * Method to invoke a click on button inside an iframe
 *
 * @param   {object}  options  Object with the css selector for the parent element of an iframe
 *                             and the selector of the button in the iframe that will be clicked
 *                             { iframeSelector: '', buttonSelector: '' }
 * @returns {boolean}
 *
 * @since   4.0
 */
Joomla.iframeButtonClick = (options) => {
  if (!options.iframeSelector || !options.buttonSelector) {
    throw new Error('Selector is missing');
  }

  const iframe = document.querySelector(`${options.iframeSelector} iframe`);
  if (iframe) {
    const button = iframe.contentWindow.document.querySelector(options.buttonSelector);
    if (button) {
      button.click();
    }
  }
};

if (Joomla && Joomla.getOptions) {
  // Get the elements/configurations from the PHP
  const modals = Joomla.getOptions('bootstrap.modal');
  // Initialise the elements
  if (typeof modals === 'object' && modals !== null) {
    Object.keys(modals).forEach((modal) => {
      const opt = modals[modal];
      const options = {
        backdrop: opt.backdrop ? opt.backdrop : true,
        keyboard: opt.keyboard ? opt.keyboard : true,
        focus: opt.focus ? opt.focus : true,
      };

      Array.from(document.querySelectorAll(modal))
        .map((modalEl) => Joomla.initialiseModal(modalEl, options));
    });
  }
}

export { Modal as M };
