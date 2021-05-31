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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  (function (customElements) {
    'strict';
    /**
     * Creates a custom element with the default spinner of the Joomla logo
     */

    var JoomlaCoreLoader = /*#__PURE__*/function (_HTMLElement) {
      _inheritsLoose(JoomlaCoreLoader, _HTMLElement);

      function JoomlaCoreLoader() {
        var _this;

        _this = _HTMLElement.call(this) || this;
        var template = document.createElement('template');
        template.innerHTML = "<style>:host{position:fixed;top:0;left:0;z-index:10000;display:flex;align-items:center;width:100%;height:100%;overflow:hidden;opacity:.8}.box{position:relative;width:345px;height:345px;margin:0 auto}.box p{float:right;margin:95px 0 0;font:normal 1.25em/1em sans-serif;color:#999}.box>span{-webkit-animation:jspinner 2s ease-in-out infinite;animation:jspinner 2s ease-in-out infinite}.box .red{-webkit-animation-delay:-1.5s;animation-delay:-1.5s}.box .blue{-webkit-animation-delay:-1s;animation-delay:-1s}.box .green{-webkit-animation-delay:-.5s;animation-delay:-.5s}.yellow{width:90px;height:90px;background:#f9a541;border-radius:90px}.yellow,.yellow:after,.yellow:before{position:absolute;top:0;left:0;content:\"\"}.yellow:after,.yellow:before{box-sizing:content-box;width:50px;background:transparent;border:50px solid #f9a541}.yellow:before{height:35px;margin:60px 0 0 -30px;border-width:50px 50px 0;border-radius:75px 75px 0 0}.yellow:after{height:105px;margin:140px 0 0 -30px;border-width:0 0 0 50px}.red{width:90px;height:90px;background:#f44321;border-radius:90px}.red,.red:after,.red:before{position:absolute;top:0;left:0;content:\"\"}.red:after,.red:before{box-sizing:content-box;width:50px;background:transparent;border:50px solid #f44321}.red:before{height:35px;margin:60px 0 0 -30px;border-width:50px 50px 0;border-radius:75px 75px 0 0}.red:after{height:105px;margin:140px 0 0 -30px;border-width:0 0 0 50px}.blue{width:90px;height:90px;background:#5091cd;border-radius:90px}.blue,.blue:after,.blue:before{position:absolute;top:0;left:0;content:\"\"}.blue:after,.blue:before{box-sizing:content-box;width:50px;background:transparent;border:50px solid #5091cd}.blue:before{height:35px;margin:60px 0 0 -30px;border-width:50px 50px 0;border-radius:75px 75px 0 0}.blue:after{height:105px;margin:140px 0 0 -30px;border-width:0 0 0 50px}.green{width:90px;height:90px;background:#7ac143;border-radius:90px}.green,.green:after,.green:before{position:absolute;top:0;left:0;content:\"\"}.green:after,.green:before{box-sizing:content-box;width:50px;background:transparent;border:50px solid #7ac143}.green:before{height:35px;margin:60px 0 0 -30px;border-width:50px 50px 0;border-radius:75px 75px 0 0}.green:after{height:105px;margin:140px 0 0 -30px;border-width:0 0 0 50px}.yellow{margin:0 0 0 255px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.red{margin:255px 0 0 255px;-webkit-transform:rotate(135deg);transform:rotate(135deg)}.blue{margin:255px 0 0;-webkit-transform:rotate(225deg);transform:rotate(225deg)}.green{-webkit-transform:rotate(315deg);transform:rotate(315deg)}@-webkit-keyframes jspinner{0%,40%,to{opacity:.3}20%{opacity:1}}@keyframes jspinner{0%,40%,to{opacity:.3}20%{opacity:1}}@media (prefers-reduced-motion:reduce){.box>span{-webkit-animation:none;animation:none}}</style>\n<div>\n    <span class=\"yellow\"></span>\n    <span class=\"red\"></span>\n    <span class=\"blue\"></span>\n    <span class=\"green\"></span>\n    <p>&trade;</p>\n</div>"; // Patch the shadow DOM

        if (window.ShadyCSS) {
          window.ShadyCSS.prepareTemplate(template, 'joomla-core-loader');
        }

        _this.attachShadow({
          mode: 'open'
        });

        _this.shadowRoot.appendChild(template.content.cloneNode(true)); // Patch the shadow DOM


        if (window.ShadyCSS) {
          window.ShadyCSS.styleElement(_assertThisInitialized(_this));
        }

        return _this;
      }

      var _proto = JoomlaCoreLoader.prototype;

      _proto.connectedCallback = function connectedCallback() {
        this.style.backgroundColor = this.color;
        this.style.opacity = 0.8;
        this.shadowRoot.querySelector('div').classList.add('box');
      };

      _proto.attributeChangedCallback = function attributeChangedCallback(attr, oldValue, newValue) {
        switch (attr) {
          case 'color':
            if (newValue && newValue !== oldValue) {
              this.style.backgroundColor = this.color;
            }

            break;
        }
      };

      _createClass(JoomlaCoreLoader, [{
        key: "color",
        get: function get() {
          return this.getAttribute('color') || '#fff';
        },
        set: function set(value) {
          this.setAttribute('color', value);
        }
      }], [{
        key: "observedAttributes",
        get: function get() {
          return ['color'];
        }
      }]);

      return JoomlaCoreLoader;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

    if (!customElements.get('joomla-core-loader')) {
      customElements.define('joomla-core-loader', JoomlaCoreLoader);
    }
  })(customElements);

}());
