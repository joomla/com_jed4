(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  (function (customElements, Joomla) {
    if (!Joomla) {
      throw new Error('Joomla API is not properly initiated');
    }

    var JoomlaFieldMedia = /*#__PURE__*/function (_HTMLElement) {
      _inheritsLoose(JoomlaFieldMedia, _HTMLElement);

      function JoomlaFieldMedia() {
        var _this;

        _this = _HTMLElement.call(this) || this;
        _this.onSelected = _this.onSelected.bind(_assertThisInitialized(_this));
        _this.show = _this.show.bind(_assertThisInitialized(_this));
        _this.clearValue = _this.clearValue.bind(_assertThisInitialized(_this));
        _this.modalClose = _this.modalClose.bind(_assertThisInitialized(_this));
        _this.setValue = _this.setValue.bind(_assertThisInitialized(_this));
        _this.updatePreview = _this.updatePreview.bind(_assertThisInitialized(_this));
        return _this;
      }

      var _proto = JoomlaFieldMedia.prototype;

      // attributeChangedCallback(attr, oldValue, newValue) {}
      _proto.connectedCallback = function connectedCallback() {
        this.button = this.querySelector(this.buttonSelect);
        this.inputElement = this.querySelector(this.input);
        this.buttonClearEl = this.querySelector(this.buttonClear);
        this.modalElement = this.querySelector('.joomla-modal');
        this.buttonSaveSelectedElement = this.querySelector(this.buttonSaveSelected);
        this.previewElement = this.querySelector('.field-media-preview');

        if (!this.button || !this.inputElement || !this.buttonClearEl || !this.modalElement || !this.buttonSaveSelectedElement) {
          throw new Error('Misconfiguaration...');
        }

        this.button.addEventListener('click', this.show); // Bootstrap modal init

        if (this.modalElement && window.bootstrap && window.bootstrap.Modal && !window.bootstrap.Modal.getInstance(this.modalElement)) {
          Joomla.initialiseModal(this.modalElement, {
            isJoomla: true
          });
        }

        if (this.buttonClearEl) {
          this.buttonClearEl.addEventListener('click', this.clearValue);
        }

        this.updatePreview();
      };

      _proto.disconnectedCallback = function disconnectedCallback() {
        if (this.button) {
          this.button.removeEventListener('click', this.show);
        }

        if (this.buttonClearEl) {
          this.buttonClearEl.removeEventListener('click', this.clearValue);
        }
      };

      _proto.onSelected = function onSelected(event) {
        event.preventDefault();
        event.stopPropagation();
        this.modalClose();
        return false;
      };

      _proto.show = function show() {
        this.modalElement.open();
        Joomla.selectedMediaFile = {};
        this.buttonSaveSelectedElement.addEventListener('click', this.onSelected);
      };

      _proto.modalClose = /*#__PURE__*/function () {
        var _modalClose = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return Joomla.getImage(Joomla.selectedMediaFile, this.inputElement, this);

                case 3:
                  _context.next = 8;
                  break;

                case 5:
                  _context.prev = 5;
                  _context.t0 = _context["catch"](0);
                  Joomla.renderMessages({
                    error: [Joomla.Text._('JLIB_APPLICATION_ERROR_SERVER')]
                  });

                case 8:
                  Joomla.selectedMediaFile = {};
                  Joomla.Modal.getCurrent().close();

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 5]]);
        }));

        function modalClose() {
          return _modalClose.apply(this, arguments);
        }

        return modalClose;
      }();

      _proto.setValue = function setValue(value) {
        this.inputElement.value = value;
        this.updatePreview(); // trigger change event both on the input and on the custom element

        this.inputElement.dispatchEvent(new Event('change'));
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            value: value
          },
          bubbles: true
        }));
      };

      _proto.clearValue = function clearValue() {
        this.setValue('');
      };

      _proto.updatePreview = function updatePreview() {
        if (['true', 'static'].indexOf(this.preview) === -1 || this.preview === 'false' || !this.previewElement) {
          return;
        } // Reset preview


        if (this.preview) {
          var value = this.inputElement.value;

          if (!value) {
            this.previewElement.innerHTML = '<span class="field-media-preview-icon"></span>';
          } else {
            this.previewElement.innerHTML = '';
            var imgPreview = new Image();
            var mediaType = {
              image: function image() {
                imgPreview.src = /http/.test(value) ? value : Joomla.getOptions('system.paths').rootFull + value;
                imgPreview.setAttribute('alt', '');
              }
            };
            mediaType[this.type]();
            this.previewElement.style.width = this.previewWidth;
            this.previewElement.appendChild(imgPreview);
          }
        }
      };

      _createClass(JoomlaFieldMedia, [{
        key: "type",
        get: function get() {
          return this.getAttribute('type');
        },
        set: function set(value) {
          this.setAttribute('type', value);
        }
      }, {
        key: "basePath",
        get: function get() {
          return this.getAttribute('base-path');
        },
        set: function set(value) {
          this.setAttribute('base-path', value);
        }
      }, {
        key: "rootFolder",
        get: function get() {
          return this.getAttribute('root-folder');
        },
        set: function set(value) {
          this.setAttribute('root-folder', value);
        }
      }, {
        key: "url",
        get: function get() {
          return this.getAttribute('url');
        },
        set: function set(value) {
          this.setAttribute('url', value);
        }
      }, {
        key: "modalContainer",
        get: function get() {
          return this.getAttribute('modal-container');
        },
        set: function set(value) {
          this.setAttribute('modal-container', value);
        }
      }, {
        key: "input",
        get: function get() {
          return this.getAttribute('input');
        },
        set: function set(value) {
          this.setAttribute('input', value);
        }
      }, {
        key: "buttonSelect",
        get: function get() {
          return this.getAttribute('button-select');
        },
        set: function set(value) {
          this.setAttribute('button-select', value);
        }
      }, {
        key: "buttonClear",
        get: function get() {
          return this.getAttribute('button-clear');
        },
        set: function set(value) {
          this.setAttribute('button-clear', value);
        }
      }, {
        key: "buttonSaveSelected",
        get: function get() {
          return this.getAttribute('button-save-selected');
        },
        set: function set(value) {
          this.setAttribute('button-save-selected', value);
        }
      }, {
        key: "modalWidth",
        get: function get() {
          return this.getAttribute(parseInt('modal-width', 10));
        },
        set: function set(value) {
          this.setAttribute('modal-width', value);
        }
      }, {
        key: "modalHeight",
        get: function get() {
          return this.getAttribute(parseInt('modal-height', 10));
        },
        set: function set(value) {
          this.setAttribute('modal-height', value);
        }
      }, {
        key: "previewWidth",
        get: function get() {
          return this.getAttribute(parseInt('preview-width', 10));
        },
        set: function set(value) {
          this.setAttribute('preview-width', value);
        }
      }, {
        key: "previewHeight",
        get: function get() {
          return this.getAttribute(parseInt('preview-height', 10));
        },
        set: function set(value) {
          this.setAttribute('preview-height', value);
        }
      }, {
        key: "preview",
        get: function get() {
          return this.getAttribute('preview');
        },
        set: function set(value) {
          this.setAttribute('preview', value);
        }
      }, {
        key: "previewContainer",
        get: function get() {
          return this.getAttribute('preview-container');
        }
      }], [{
        key: "observedAttributes",
        get: function get() {
          return ['type', 'base-path', 'root-folder', 'url', 'modal-container', 'modal-width', 'modal-height', 'input', 'button-select', 'button-clear', 'button-save-selected', 'preview', 'preview-width', 'preview-height'];
        }
      }]);

      return JoomlaFieldMedia;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

    customElements.define('joomla-field-media', JoomlaFieldMedia);
  })(customElements, Joomla);

}());
