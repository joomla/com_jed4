"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (customElements, Joomla) {
  'use strict';

  if (!Joomla) {
    throw new Error('Joomla API is not properly initiated');
  }
  /**
   * An object holding all the information of the selected image in media manager
   * eg:
   * {
   *   extension: "png"
   *   fileType: "image/png"
   *   height: 44
   *   path: "local-0:/powered_by.png"
   *   thumb: undefined
   *   width: 294
   * }
   */


  Joomla.selectedMediaFile = {};
  /**
   * Event Listener that updates the Joomla.selectedMediaFile
   * to the selected file in the media manager
   */

  window.document.addEventListener('onMediaFileSelected', function (e) {
    Joomla.selectedMediaFile = e.detail;
    var currentModal = Joomla.Modal.getCurrent();
    var container = currentModal.querySelector('.modal-body');
    var optionsEl = container.querySelector('joomla-field-mediamore');

    if (optionsEl) {
      optionsEl.parentNode.removeChild(optionsEl);
    } // No extra attributes (lazy, alt) for fields


    if (container.closest('joomla-field-media')) {
      return;
    }

    if (Joomla.selectedMediaFile.path) {
      container.insertAdjacentHTML('afterbegin', "\n<joomla-field-mediamore\n  parent-id=\"".concat(currentModal.id, "\"\n  summary-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_SUMMARY_LABEL'), "\"\n  lazy-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_LAZY_LABEL'), "\"\n  alt-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_ALT_LABEL'), "\"\n  alt-check-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_ALT_CHECK_LABEL'), "\"\n  alt-check-desc-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_ALT_CHECK_DESC_LABEL'), "\"\n  classes-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_CLASS_LABEL'), "\"\n  figure-classes-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_FIGURE_CLASS_LABEL'), "\"\n  figure-caption-label=\"").concat(Joomla.Text._('JFIELD_MEDIA_FIGURE_CAPTION_LABEL'), "\"\n></joomla-field-mediamore>\n"));
    }
  });
  /**
   * Method to check if passed param is HTMLElement
   *
   * @param o {string|HTMLElement}  Element to be checked
   *
   * @returns {boolean}
   */

  var isElement = function isElement(o) {
    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? o instanceof HTMLElement : o && _typeof(o) === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';
  };
  /**
   * Method to safely append parameters to a URL string
   *
   * @param url   {string}  The URL
   * @param key   {string}  The key of the parameter
   * @param value {string}  The value of the parameter
   *
   * @returns {string}
   */


  var appendParam = function appendParam(url, key, value) {
    var newKey = encodeURIComponent(key);
    var newValue = encodeURIComponent(value);
    var r = new RegExp("(&|\\?)".concat(key, "=[^&]*"));
    var s = url;
    var param = "".concat(newKey, "=").concat(newValue);
    s = s.replace(r, "$1".concat(param));

    if (!RegExp.$1 && s.includes('?')) {
      return "".concat(s, "&").concat(param);
    }

    if (!RegExp.$1 && !s.includes('?')) {
      return "".concat(s, "?").concat(param);
    }

    return s;
  };
  /**
   * Method to append the image in an editor or a field
   *
   * @param resp
   * @param editor
   * @param fieldClass
   */


  var execTransform = function execTransform(resp, editor, fieldClass) {
    if (resp.success === true) {
      if (resp.data[0].url) {
        if (/local-/.test(resp.data[0].adapter)) {
          var _Joomla$getOptions = Joomla.getOptions('system.paths'),
              rootFull = _Joomla$getOptions.rootFull; // eslint-disable-next-line prefer-destructuring


          Joomla.selectedMediaFile.url = resp.data[0].url.split(rootFull)[1];

          if (resp.data[0].thumb_path) {
            Joomla.selectedMediaFile.thumb = resp.data[0].thumb_path;
          } else {
            Joomla.selectedMediaFile.thumb = false;
          }
        } else if (resp.data[0].thumb_path) {
          Joomla.selectedMediaFile.thumb = resp.data[0].thumb_path;
        }
      } else {
        Joomla.selectedMediaFile.url = false;
      }

      if (Joomla.selectedMediaFile.url) {
        var attribs;
        var isLazy = '';
        var alt = '';
        var appendAlt = '';
        var classes = '';
        var figClasses = '';
        var figCaption = '';
        var imageElement = '';

        if (!isElement(editor)) {
          var currentModal = fieldClass.closest('.modal-content');
          attribs = currentModal.querySelector('joomla-field-mediamore');

          if (attribs) {
            if (attribs.getAttribute('alt-check') === 'true') {
              appendAlt = ' alt=""';
            }

            alt = attribs.getAttribute('alt-value') ? " alt=\"".concat(attribs.getAttribute('alt-value'), "\"") : appendAlt;
            classes = attribs.getAttribute('img-classes') ? " class=\"".concat(attribs.getAttribute('img-classes'), "\"") : '';
            figClasses = attribs.getAttribute('fig-classes') ? " class=\"".concat(attribs.getAttribute('fig-classes'), "\"") : '';
            figCaption = attribs.getAttribute('fig-caption') ? "".concat(attribs.getAttribute('fig-caption')) : '';

            if (attribs.getAttribute('is-lazy') === 'true') {
              isLazy = " loading=\"lazy\" width=\"".concat(Joomla.selectedMediaFile.width, "\" height=\"").concat(Joomla.selectedMediaFile.height, "\"");
            }
          }

          if (figCaption) {
            imageElement = "<figure".concat(figClasses, "><img src=\"").concat(Joomla.selectedMediaFile.url, "\"").concat(classes).concat(isLazy).concat(alt, "/><figcaption>").concat(figCaption, "</figcaption></figure>");
          } else {
            imageElement = "<img src=\"".concat(Joomla.selectedMediaFile.url, "\"").concat(classes).concat(isLazy).concat(alt, "/>");
          }

          if (attribs) {
            attribs.parentNode.removeChild(attribs);
          }

          Joomla.editors.instances[editor].replaceSelection(imageElement);
        } else {
          var val = appendParam(Joomla.selectedMediaFile.url, 'joomla_image_width', Joomla.selectedMediaFile.width);
          editor.value = appendParam(val, 'joomla_image_height', Joomla.selectedMediaFile.height);
          fieldClass.updatePreview();
        }
      }
    }
  };
  /**
   * Method that resolves the real url for the selected image
   *
   * @param data        {object}         The data for the detail
   * @param editor      {string|object}  The data for the detail
   * @param fieldClass  {HTMLElement}    The fieldClass for the detail
   *
   * @returns {void}
   */


  Joomla.getImage = function (data, editor, fieldClass) {
    return new Promise(function (resolve, reject) {
      if (!data || _typeof(data) === 'object' && (!data.path || data.path === '')) {
        Joomla.selectedMediaFile = {};
        resolve({
          resp: {
            success: false
          }
        });
        return;
      }

      var apiBaseUrl = "".concat(Joomla.getOptions('system.paths').rootFull, "administrator/index.php?option=com_media&format=json");
      Joomla.request({
        url: "".concat(apiBaseUrl, "&task=api.files&url=true&path=").concat(data.path, "&").concat(Joomla.getOptions('csrf.token'), "=1&format=json"),
        method: 'GET',
        perform: true,
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: function onSuccess(response) {
          var resp = JSON.parse(response);
          resolve(execTransform(resp, editor, fieldClass));
        },
        onError: function onError(err) {
          reject(err);
        }
      });
    });
  };
  /**
   * A sipmle Custom Element for adding alt text and controlling
   * the lazy loading on a selected image
   *
   * Will be rendered only for editor content images
   * Attributes:
   * - parent-id: the id of the parent media field {string}
   * - lazy-label: The text for the checkbox label {string}
   * - alt-label: The text for the alt label {string}
   * - is-lazy: The value for the lazyloading (calculated, defaults to 'true') {string}
   * - alt-value: The value for the alt text (calculated, defaults to '') {string}
   */


  var JoomlaFieldMediaOptions = /*#__PURE__*/function (_HTMLElement) {
    _inherits(JoomlaFieldMediaOptions, _HTMLElement);

    var _super = _createSuper(JoomlaFieldMediaOptions);

    function JoomlaFieldMediaOptions() {
      var _this;

      _classCallCheck(this, JoomlaFieldMediaOptions);

      _this = _super.call(this);
      _this.lazyInputFn = _this.lazyInputFn.bind(_assertThisInitialized(_this));
      _this.altInputFn = _this.altInputFn.bind(_assertThisInitialized(_this));
      _this.altCheckFn = _this.altCheckFn.bind(_assertThisInitialized(_this));
      _this.imgClassesFn = _this.imgClassesFn.bind(_assertThisInitialized(_this));
      _this.figclassesFn = _this.figclassesFn.bind(_assertThisInitialized(_this));
      _this.figcaptionFn = _this.figcaptionFn.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(JoomlaFieldMediaOptions, [{
      key: "parentId",
      get: function get() {
        return this.getAttribute('parent-id');
      }
    }, {
      key: "lazytext",
      get: function get() {
        return this.getAttribute('lazy-label');
      }
    }, {
      key: "alttext",
      get: function get() {
        return this.getAttribute('alt-label');
      }
    }, {
      key: "altchecktext",
      get: function get() {
        return this.getAttribute('alt-check-label');
      }
    }, {
      key: "altcheckdesctext",
      get: function get() {
        return this.getAttribute('alt-check-desc-label');
      }
    }, {
      key: "classestext",
      get: function get() {
        return this.getAttribute('classes-label');
      }
    }, {
      key: "figclassestext",
      get: function get() {
        return this.getAttribute('figure-classes-label');
      }
    }, {
      key: "figcaptiontext",
      get: function get() {
        return this.getAttribute('figure-caption-label');
      }
    }, {
      key: "summarytext",
      get: function get() {
        return this.getAttribute('summary-label');
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.innerHTML = "\n<details open>\n  <summary>".concat(this.summarytext, "</summary>\n  <div class=\"\">\n    <div class=\"form-group\">\n      <div class=\"input-group\">\n        <label class=\"input-group-text\" for=\"").concat(this.parentId, "-alt\">").concat(this.alttext, "</label>\n        <input class=\"form-control\" type=\"text\" id=\"").concat(this.parentId, "-alt\" />\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"form-check\">\n        <input class=\"form-check-input\" type=\"checkbox\" id=\"").concat(this.parentId, "-alt-check\">\n        <label class=\"form-check-label\" for=\"").concat(this.parentId, "-alt-check\">").concat(this.altchecktext, "</label>\n        <div><small class=\"form-text text-muted\">").concat(this.altcheckdesctext, "</small></div>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"form-check\">\n        <input class=\"form-check-input\" type=\"checkbox\" id=\"").concat(this.parentId, "-lazy\" checked>\n        <label class=\"form-check-label\" for=\"").concat(this.parentId, "-lazy\">").concat(this.lazytext, "</label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"input-group\">\n        <label class=\"input-group-text\" for=\"").concat(this.parentId, "-classes\">").concat(this.classestext, "</label>\n        <input class=\"form-control\" type=\"text\" id=\"").concat(this.parentId, "-classes\" />\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"input-group\">\n        <label class=\"input-group-text\" for=\"").concat(this.parentId, "-figclasses\">").concat(this.figclassestext, "</label>\n        <input class=\"form-control\" type=\"text\" id=\"").concat(this.parentId, "-figclasses\" />\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"input-group\">\n        <label class=\"input-group-text\" for=\"").concat(this.parentId, "-figcaption\">").concat(this.figcaptiontext, "</label>\n        <input class=\"form-control\" type=\"text\" id=\"").concat(this.parentId, "-figcaption\" />\n      </div>\n    </div>\n  </div>\n</details>"); // Add event listeners

        this.lazyInput = this.querySelector("#".concat(this.parentId, "-lazy"));
        this.lazyInput.addEventListener('change', this.lazyInputFn);
        this.altInput = this.querySelector("#".concat(this.parentId, "-alt"));
        this.altInput.addEventListener('input', this.altInputFn);
        this.altCheck = this.querySelector("#".concat(this.parentId, "-alt-check"));
        this.altCheck.addEventListener('input', this.altCheckFn);
        this.imgClasses = this.querySelector("#".concat(this.parentId, "-classes"));
        this.imgClasses.addEventListener('input', this.imgClassesFn);
        this.figClasses = this.querySelector("#".concat(this.parentId, "-figclasses"));
        this.figClasses.addEventListener('input', this.figclassesFn);
        this.figCaption = this.querySelector("#".concat(this.parentId, "-figcaption"));
        this.figCaption.addEventListener('input', this.figcaptionFn); // Set initial values

        this.setAttribute('is-lazy', !!this.lazyInput.checked);
        this.setAttribute('alt-value', '');
        this.setAttribute('alt-check', false);
        this.setAttribute('img-classes', '');
        this.setAttribute('fig-classes', '');
        this.setAttribute('fig-caption', '');
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.lazyInput.removeEventListener('input', this.lazyInputFn);
        this.altInput.removeEventListener('input', this.altInputFn);
        this.altCheck.removeEventListener('input', this.altCheckFn);
        this.imgClasses.removeEventListener('input', this.imgClassesFn);
        this.figClasses.removeEventListener('input', this.figclassesFn);
        this.figCaption.removeEventListener('input', this.figcaptionFn);
        this.innerHTML = '';
      }
    }, {
      key: "lazyInputFn",
      value: function lazyInputFn(e) {
        this.setAttribute('is-lazy', !!e.target.checked);
      }
    }, {
      key: "altInputFn",
      value: function altInputFn(e) {
        this.setAttribute('alt-value', e.target.value.replace(/"/g, '&quot;'));
      }
    }, {
      key: "altCheckFn",
      value: function altCheckFn(e) {
        this.setAttribute('alt-check', !!e.target.checked);
      }
    }, {
      key: "imgClassesFn",
      value: function imgClassesFn(e) {
        this.setAttribute('img-classes', e.target.value);
      }
    }, {
      key: "figclassesFn",
      value: function figclassesFn(e) {
        this.setAttribute('fig-classes', e.target.value);
      }
    }, {
      key: "figcaptionFn",
      value: function figcaptionFn(e) {
        this.setAttribute('fig-caption', e.target.value);
      }
    }]);

    return JoomlaFieldMediaOptions;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  customElements.define('joomla-field-mediamore', JoomlaFieldMediaOptions);
})(customElements, Joomla);