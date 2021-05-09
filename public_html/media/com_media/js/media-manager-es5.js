var JoomlaMediaManager = (function () {
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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$1 =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$5 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$5 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  var f$7 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$5(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable$1;

  var objectPropertyIsEnumerable = {
  	f: f$7
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString$1 = {}.toString;

  var classofRaw = function (it) {
    return toString$1.call(it).slice(8, -1);
  };

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var isObject$2 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject$2(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$2(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject$2(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$2(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var hasOwnProperty$1 = {}.hasOwnProperty;

  var has$3 = function hasOwn(it, key) {
    return hasOwnProperty$1.call(toObject(it), key);
  };

  var document$3 = global$1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject$2(document$3) && isObject$2(document$3.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$3.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  var f$6 = descriptors ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return $getOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (has$3(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$6
  };

  var anObject = function (it) {
    if (!isObject$2(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty$1 = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  var f$5 = descriptors ? $defineProperty$1 : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return $defineProperty$1(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$5
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global$1, key, value);
    } catch (error) {
      global$1[key] = value;
    } return value;
  };

  var SHARED = '__core-js_shared__';
  var store$2 = global$1[SHARED] || setGlobal(SHARED, {});

  var sharedStore = store$2;

  var functionToString = Function.toString;

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$2 = global$1.WeakMap;

  var nativeWeakMap = typeof WeakMap$2 === 'function' && /native code/.test(inspectSource(WeakMap$2));

  var isPure = false;

  var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.12.0',
    mode: 'global',
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id$1 = 0;
  var postfix = Math.random();

  var uid$3 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$1 + postfix).toString(36);
  };

  var keys$3 = shared('keys');

  var sharedKey = function (key) {
    return keys$3[key] || (keys$3[key] = uid$3(key));
  };

  var hiddenKeys$1 = {};

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var WeakMap$1 = global$1.WeakMap;
  var set$5, get$4, has$2;

  var enforce = function (it) {
    return has$2(it) ? get$4(it) : set$5(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$2(it) || (state = get$4(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
    var wmget = store$1.get;
    var wmhas = store$1.has;
    var wmset = store$1.set;
    set$5 = function (it, metadata) {
      if (wmhas.call(store$1, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset.call(store$1, it, metadata);
      return metadata;
    };
    get$4 = function (it) {
      return wmget.call(store$1, it) || {};
    };
    has$2 = function (it) {
      return wmhas.call(store$1, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys$1[STATE] = true;
    set$5 = function (it, metadata) {
      if (has$3(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get$4 = function (it) {
      return has$3(it, STATE) ? it[STATE] : {};
    };
    has$2 = function (it) {
      return has$3(it, STATE);
    };
  }

  var internalState = {
    set: set$5,
    get: get$4,
    has: has$2,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(String).split('String');

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var state;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has$3(value, 'name')) {
        createNonEnumerableProperty(value, 'name', key);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
      }
    }
    if (O === global$1) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
  });
  });

  var path = global$1;

  var aFunction$1 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global$1[namespace])
      : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
  };

  var ceil = Math.ceil;
  var floor$6 = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.es/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$6 : ceil)(argument);
  };

  var min$7 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min$7(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max$3 = Math.max;
  var min$6 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max$3(integer + length, 0) : min$6(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$4 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod$4(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$4(false)
  };

  var indexOf = arrayIncludes.indexOf;


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$3(hiddenKeys$1, key) && has$3(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has$3(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys);
  };

  var objectGetOwnPropertyNames = {
  	f: f$4
  };

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  var f$3 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$3
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys$1(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has$3(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$1;
    } else if (STATIC) {
      target = global$1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$4(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.
  function RE(s, f) {
    return RegExp(s, f);
  }

  var UNSUPPORTED_Y$3 = fails(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });

  var BROKEN_CARET = fails(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });

  var regexpStickyHelpers = {
  	UNSUPPORTED_Y: UNSUPPORTED_Y$3,
  	BROKEN_CARET: BROKEN_CARET
  };

  var nativeExec = RegExp.prototype.exec;
  var nativeReplace = shared('native-string-replace', String.prototype.replace);

  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;
      var sticky = UNSUPPORTED_Y$2 && re.sticky;
      var flags = regexpFlags.call(re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = flags.replace('y', '');
        if (flags.indexOf('g') === -1) {
          flags += 'g';
        }

        strCopy = String(str).slice(re.lastIndex);
        // Support anchored sticky behavior.
        if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
          source = '(?: ' + source + ')';
          strCopy = ' ' + strCopy;
          charsAdded++;
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp('^(?:' + source + ')', flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  _export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
    exec: regexpExec
  });

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var process$3 = global$1.process;
  var versions = process$3 && process$3.versions;
  var v8 = versions && versions.v8;
  var match, version$1;

  if (v8) {
    match = v8.split('.');
    version$1 = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version$1 = match[1];
    }
  }

  var engineV8Version = version$1 && +version$1;

  /* eslint-disable es/no-symbol -- required for testing */

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    return !String(Symbol()) ||
      // Chrome 38 Symbol has incorrect toString conversion
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && engineV8Version && engineV8Version < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var useSymbolAsUid = nativeSymbol
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var WellKnownSymbolsStore$1 = shared('wks');
  var Symbol$1 = global$1.Symbol;
  var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$3;

  var wellKnownSymbol = function (name) {
    if (!has$3(WellKnownSymbolsStore$1, name) || !(nativeSymbol || typeof WellKnownSymbolsStore$1[name] == 'string')) {
      if (nativeSymbol && has$3(Symbol$1, name)) {
        WellKnownSymbolsStore$1[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore$1[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore$1[name];
  };

  // TODO: Remove from `core-js@4` since it's moved to entry points






  var SPECIES$6 = wellKnownSymbol('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  var REPLACE_KEEPS_$0 = (function () {
    // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
    return 'a'.replace(/./, '$0') === '$0';
  })();

  var REPLACE = wellKnownSymbol('replace');
  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  })();

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol(KEY);

    var DELEGATES_TO_SYMBOL = !fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;

      if (KEY === 'split') {
        // We can't use real regex here since it causes deoptimization
        // and serious performance degradation in V8
        // https://github.com/zloirock/core-js/issues/306
        re = {};
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$6] = function () { return re; };
        re.flags = '';
        re[SYMBOL] = /./[SYMBOL];
      }

      re.exec = function () { execCalled = true; return null; };

      re[SYMBOL]('');
      return !execCalled;
    });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !(
        REPLACE_SUPPORTS_NAMED_GROUPS &&
        REPLACE_KEEPS_$0 &&
        !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      )) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === RegExp.prototype.exec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }, {
        REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
        REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];

      redefine(String.prototype, KEY, stringMethod);
      redefine(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return regexMethod.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return regexMethod.call(string, this); }
      );
    }

    if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
  };

  var MATCH$2 = wellKnownSymbol('match');

  // `IsRegExp` abstract operation
  // https://tc39.es/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp;
    return isObject$2(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
  };

  var aFunction = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  var SPECIES$5 = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction(S);
  };

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$3 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this));
      var position = toInteger(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$3(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$3(true)
  };

  var charAt$1 = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.es/ecma262/#sec-advancestringindex
  var advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt$1(S, index).length : 1);
  };

  // `RegExpExec` abstract operation
  // https://tc39.es/ecma262/#sec-regexpexec
  var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }

    if (classofRaw(R) !== 'RegExp') {
      throw TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;
  var arrayPush = [].push;
  var min$5 = Math.min;
  var MAX_UINT32 = 0xFFFFFFFF;

  // @@split logic
  fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'.split(/(b)*/)[1] == 'c' ||
      // eslint-disable-next-line regexp/no-empty-group -- required for testing
      'test'.split(/(?:)/, -1).length != 4 ||
      'ab'.split(/(?:ab)*/).length != 2 ||
      '.'.split(/(.?)(.?)/).length != 4 ||
      // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(requireObjectCoercible(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegexp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output.length > lim ? output.slice(0, lim) : output;
      };
    // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [
      // `String.prototype.split` method
      // https://tc39.es/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = requireObjectCoercible(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (UNSUPPORTED_Y$1 ? 'g' : 'y');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(UNSUPPORTED_Y$1 ? '^(?:' + rx.source + ')' : rx, flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = UNSUPPORTED_Y$1 ? 0 : q;
          var z = regexpExecAbstract(splitter, UNSUPPORTED_Y$1 ? S.slice(q) : S);
          var e;
          if (
            z === null ||
            (e = min$5(toLength(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  }, UNSUPPORTED_Y$1);

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray$1 = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
  };

  var SPECIES$4 = wellKnownSymbol('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray$1(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray$1(C.prototype))) C = undefined;
      else if (isObject$2(C)) {
        C = C[SPECIES$4];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var push = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
  var createMethod$2 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_OUT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = functionBindContext(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: push.call(target, value); // filter
          } else switch (TYPE) {
            case 4: return false;             // every
            case 7: push.call(target, value); // filterOut
          }
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$2(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$2(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$2(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$2(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$2(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$2(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$2(6),
    // `Array.prototype.filterOut` method
    // https://github.com/tc39/proposal-array-filtering
    filterOut: createMethod$2(7)
  };

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var $forEach$2 = arrayIteration.forEach;


  var STRICT_METHOD$2 = arrayMethodIsStrict('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  var arrayForEach = !STRICT_METHOD$2 ? function forEach(callbackfn /* , thisArg */) {
    return $forEach$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  } : [].forEach;

  for (var COLLECTION_NAME$1 in domIterables) {
    var Collection$1 = global$1[COLLECTION_NAME$1];
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach) try {
      createNonEnumerableProperty(CollectionPrototype$1, 'forEach', arrayForEach);
    } catch (error) {
      CollectionPrototype$1.forEach = arrayForEach;
    }
  }

  // a string of all valid unicode whitespaces
  var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
    '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$');

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$1 = function (TYPE) {
    return function ($this) {
      var string = String(requireObjectCoercible($this));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    start: createMethod$1(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    end: createMethod$1(2),
    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    trim: createMethod$1(3)
  };

  var non = '\u200B\u0085\u180E';

  // check that a method works with the correct list
  // of whitespaces and has a correct name
  var stringTrimForced = function (METHOD_NAME) {
    return fails(function () {
      return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
    });
  };

  var $trim = stringTrim.trim;


  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  _export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var SPECIES$3 = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$3] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject$2(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray$1(O);
  };

  var FORCED$7 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.es/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export({ target: 'Array', proto: true, forced: FORCED$7 }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    concat: function concat(arg) {
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  var GT = '>';
  var LT = '<';
  var PROTOTYPE$2 = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO$1 = sharedKey('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      /* global ActiveXObject -- old IE */
      activeXDocument = document.domain && new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys$1[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE$2] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE$2] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  var iterators = {};

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO = sharedKey('IE_PROTO');
  var ObjectPrototype$3 = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  // eslint-disable-next-line es/no-object-getprototypeof -- safe
  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has$3(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype$3 : null;
  };

  var ITERATOR$8 = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS$1 = false;

  var returnThis$2 = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$2[ITERATOR$8].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has$3(IteratorPrototype$2, ITERATOR$8)) {
    createNonEnumerableProperty(IteratorPrototype$2, ITERATOR$8, returnThis$2);
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
  };

  var defineProperty$9 = objectDefineProperty.f;



  var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has$3(it = STATIC ? it : it.prototype, TO_STRING_TAG$4)) {
      defineProperty$9(it, TO_STRING_TAG$4, { configurable: true, value: TAG });
    }
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var aPossiblePrototype = function (it) {
    if (!isObject$2(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  /* eslint-disable no-proto -- safe */

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es/no-object-setprototypeof -- safe
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var IteratorPrototype = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$7 = wellKnownSymbol('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$7]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
        if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$7] != 'function') {
            createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$7, returnThis);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if (IterablePrototype[ITERATOR$7] !== defaultIterator) {
      createNonEnumerableProperty(IterablePrototype, ITERATOR$7, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$8 = internalState.set;
  var getInternalState$4 = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$8(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$4(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG$3] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = toStringTagSupport ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  var objectToString$1 = toStringTagSupport ? {}.toString : function toString() {
    return '[object ' + classof(this) + ']';
  };

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!toStringTagSupport) {
    redefine(Object.prototype, 'toString', objectToString$1, { unsafe: true });
  }

  var ITERATOR$6 = wellKnownSymbol('iterator');
  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  var ArrayValues = es_array_iterator.values;

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global$1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    if (CollectionPrototype) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[ITERATOR$6] !== ArrayValues) try {
        createNonEnumerableProperty(CollectionPrototype, ITERATOR$6, ArrayValues);
      } catch (error) {
        CollectionPrototype[ITERATOR$6] = ArrayValues;
      }
      if (!CollectionPrototype[TO_STRING_TAG$1]) {
        createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$1, COLLECTION_NAME);
      }
      if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
          createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
        }
      }
    }
  }

  var notARegexp = function (it) {
    if (isRegexp(it)) {
      throw TypeError("The method doesn't accept regular expressions");
    } return it;
  };

  var MATCH$1 = wellKnownSymbol('match');

  var correctIsRegexpLogic = function (METHOD_NAME) {
    var regexp = /./;
    try {
      '/./'[METHOD_NAME](regexp);
    } catch (error1) {
      try {
        regexp[MATCH$1] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (error2) { /* empty */ }
    } return false;
  };

  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;






  // eslint-disable-next-line es/no-string-prototype-startswith -- safe
  var $startsWith = ''.startsWith;
  var min$4 = Math.min;

  var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
  // https://github.com/zloirock/core-js/pull/702
  var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
    var descriptor = getOwnPropertyDescriptor$3(String.prototype, 'startsWith');
    return descriptor && !descriptor.writable;
  }();

  // `String.prototype.startsWith` method
  // https://tc39.es/ecma262/#sec-string.prototype.startswith
  _export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
    startsWith: function startsWith(searchString /* , position = 0 */) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var index = toLength(min$4(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = String(searchString);
      return $startsWith
        ? $startsWith.call(that, search, index)
        : that.slice(index, index + search.length) === search;
    }
  });

  // eslint-disable-next-line es/no-object-assign -- safe
  var $assign = Object.assign;
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  var defineProperty$8 = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  var objectAssign = !$assign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && $assign({ b: 1 }, $assign(defineProperty$8({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$8(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line es/no-symbol -- safe
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;
    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : $assign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing
  _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
    assign: objectAssign
  });

  var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');

  var max$2 = Math.max;
  var min$3 = Math.min;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.es/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
    splice: function splice(start, deleteCount /* , ...items */) {
      var O = toObject(this);
      var len = toLength(O.length);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$3(max$2(toInteger(deleteCount), 0), len - actualStart);
      }
      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }
      A = arraySpeciesCreate(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');

  var SPECIES$2 = wellKnownSymbol('species');
  var nativeSlice = [].slice;
  var max$1 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.es/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = toLength(O.length);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray$1(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (typeof Constructor == 'function' && (Constructor === Array || isArray$1(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject$2(Constructor)) {
          Constructor = Constructor[SPECIES$2];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === Array || Constructor === undefined) {
          return nativeSlice.call(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  var floor$5 = Math.floor;
  var replace$1 = ''.replace;
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

  // https://tc39.es/ecma262/#sec-getsubstitution
  var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return replace$1.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$5(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  };

  var max = Math.max;
  var min$2 = Math.min;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

    return [
      // `String.prototype.replace` method
      // https://tc39.es/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        if (
          (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
          (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
        ) {
          var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
          if (res.done) return res.value;
        }

        var rx = anObject(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regexpExecAbstract(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max(min$2(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];
  });

  // `globalThis` object
  // https://tc39.es/ecma262/#sec-globalthis
  _export({ global: true }, {
    globalThis: global$1
  });

  var charAt = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$7 = internalState.set;
  var getInternalState$3 = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState$7(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$3(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var freezing = !fails(function () {
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function (module) {
  var defineProperty = objectDefineProperty.f;



  var METADATA = uid$3('meta');
  var id = 0;

  // eslint-disable-next-line es/no-object-isextensible -- safe
  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var setMetadata = function (it) {
    defineProperty(it, METADATA, { value: {
      objectID: 'O' + ++id, // object ID
      weakData: {}          // weak collections IDs
    } });
  };

  var fastKey = function (it, create) {
    // return a primitive with prefix
    if (!isObject$2(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has$3(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMetadata(it);
    // return object ID
    } return it[METADATA].objectID;
  };

  var getWeakData = function (it, create) {
    if (!has$3(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMetadata(it);
    // return the store of weak collections IDs
    } return it[METADATA].weakData;
  };

  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (freezing && meta.REQUIRED && isExtensible(it) && !has$3(it, METADATA)) setMetadata(it);
    return it;
  };

  var meta = module.exports = {
    REQUIRED: false,
    fastKey: fastKey,
    getWeakData: getWeakData,
    onFreeze: onFreeze
  };

  hiddenKeys$1[METADATA] = true;
  });

  var ITERATOR$5 = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$5] === it);
  };

  var ITERATOR$4 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$4]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  var iteratorClose = function (iterator) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return anObject(returnMethod.call(iterator)).value;
    }
  };

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose(iterator);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      } return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength(iterable.length); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = iterFn.call(iterable);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose(iterator);
        throw error;
      }
      if (typeof result == 'object' && result && result instanceof Result) return result;
    } return new Result(false);
  };

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var ITERATOR$3 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$3] = function () {
      return this;
    };
    // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$3] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      typeof (NewTarget = dummy.constructor) == 'function' &&
      NewTarget !== Wrapper &&
      isObject$2(NewTargetPrototype = NewTarget.prototype) &&
      NewTargetPrototype !== Wrapper.prototype
    ) objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
    var ADDER = IS_MAP ? 'set' : 'add';
    var NativeConstructor = global$1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var exported = {};

    var fixMethod = function (KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine(NativePrototype, KEY,
        KEY == 'add' ? function add(value) {
          nativeMethod.call(this, value === 0 ? 0 : value);
          return this;
        } : KEY == 'delete' ? function (key) {
          return IS_WEAK && !isObject$2(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'get' ? function get(key) {
          return IS_WEAK && !isObject$2(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'has' ? function has(key) {
          return IS_WEAK && !isObject$2(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : function set(key, value) {
          nativeMethod.call(this, key === 0 ? 0 : key, value);
          return this;
        }
      );
    };

    var REPLACE = isForced_1(
      CONSTRUCTOR_NAME,
      typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
        new NativeConstructor().entries().next();
      }))
    );

    if (REPLACE) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      internalMetadata.REQUIRED = true;
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new -- required for testing
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO = !IS_WEAK && fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new NativeConstructor();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
          if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export({ global: true, forced: Constructor != NativeConstructor }, exported);

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var getWeakData = internalMetadata.getWeakData;








  var setInternalState$6 = internalState.set;
  var internalStateGetterFor$1 = internalState.getterFor;
  var find$1 = arrayIteration.find;
  var findIndex = arrayIteration.findIndex;
  var id = 0;

  // fallback for uncaught frozen keys
  var uncaughtFrozenStore = function (store) {
    return store.frozen || (store.frozen = new UncaughtFrozenStore());
  };

  var UncaughtFrozenStore = function () {
    this.entries = [];
  };

  var findUncaughtFrozen = function (store, key) {
    return find$1(store.entries, function (it) {
      return it[0] === key;
    });
  };

  UncaughtFrozenStore.prototype = {
    get: function (key) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) return entry[1];
    },
    has: function (key) {
      return !!findUncaughtFrozen(this, key);
    },
    set: function (key, value) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) entry[1] = value;
      else this.entries.push([key, value]);
    },
    'delete': function (key) {
      var index = findIndex(this.entries, function (it) {
        return it[0] === key;
      });
      if (~index) this.entries.splice(index, 1);
      return !!~index;
    }
  };

  var collectionWeak = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$6(that, {
          type: CONSTRUCTOR_NAME,
          id: id++,
          frozen: undefined
        });
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
      });

      var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var data = getWeakData(anObject(key), true);
        if (data === true) uncaughtFrozenStore(state).set(key, value);
        else data[state.id] = value;
        return that;
      };

      redefineAll(C.prototype, {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function (key) {
          var state = getInternalState(this);
          if (!isObject$2(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state)['delete'](key);
          return data && has$3(data, state.id) && delete data[state.id];
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function has(key) {
          var state = getInternalState(this);
          if (!isObject$2(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).has(key);
          return data && has$3(data, state.id);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function get(key) {
          var state = getInternalState(this);
          if (isObject$2(key)) {
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state).get(key);
            return data ? data[state.id] : undefined;
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key, value);
        }
      } : {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function add(value) {
          return define(this, value, true);
        }
      });

      return C;
    }
  };

  createCommonjsModule(function (module) {






  var enforceIternalState = internalState.enforce;


  var IS_IE11 = !global$1.ActiveXObject && 'ActiveXObject' in global$1;
  // eslint-disable-next-line es/no-object-isextensible -- safe
  var isExtensible = Object.isExtensible;
  var InternalWeakMap;

  var wrapper = function (init) {
    return function WeakMap() {
      return init(this, arguments.length ? arguments[0] : undefined);
    };
  };

  // `WeakMap` constructor
  // https://tc39.es/ecma262/#sec-weakmap-constructor
  var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

  // IE11 WeakMap frozen keys fix
  // We can't use feature detection because it crash some old IE builds
  // https://github.com/zloirock/core-js/issues/485
  if (nativeWeakMap && IS_IE11) {
    InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
    internalMetadata.REQUIRED = true;
    var WeakMapPrototype = $WeakMap.prototype;
    var nativeDelete = WeakMapPrototype['delete'];
    var nativeHas = WeakMapPrototype.has;
    var nativeGet = WeakMapPrototype.get;
    var nativeSet = WeakMapPrototype.set;
    redefineAll(WeakMapPrototype, {
      'delete': function (key) {
        if (isObject$2(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeDelete.call(this, key) || state.frozen['delete'](key);
        } return nativeDelete.call(this, key);
      },
      has: function has(key) {
        if (isObject$2(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) || state.frozen.has(key);
        } return nativeHas.call(this, key);
      },
      get: function get(key) {
        if (isObject$2(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
        } return nativeGet.call(this, key);
      },
      set: function set(key, value) {
        if (isObject$2(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
        } else nativeSet.call(this, key, value);
        return this;
      }
    });
  }
  });

  /* eslint-disable es/no-object-getownpropertynames -- safe */

  var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;

  var toString = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return $getOwnPropertyNames$1(it);
    } catch (error) {
      return windowNames.slice();
    }
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  var f$2 = function getOwnPropertyNames(it) {
    return windowNames && toString.call(it) == '[object Window]'
      ? getWindowNames(it)
      : $getOwnPropertyNames$1(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
  	f: f$2
  };

  var f$1 = wellKnownSymbol;

  var wellKnownSymbolWrapped = {
  	f: f$1
  };

  var defineProperty$7 = objectDefineProperty.f;

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!has$3(Symbol, NAME)) defineProperty$7(Symbol, NAME, {
      value: wellKnownSymbolWrapped.f(NAME)
    });
  };

  var $forEach$1 = arrayIteration.forEach;

  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  var setInternalState$5 = internalState.set;
  var getInternalState$2 = internalState.getterFor(SYMBOL);
  var ObjectPrototype$2 = Object[PROTOTYPE$1];
  var $Symbol = global$1.Symbol;
  var $stringify = getBuiltIn('JSON', 'stringify');
  var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var nativeDefineProperty = objectDefineProperty.f;
  var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
  var AllSymbols = shared('symbols');
  var ObjectPrototypeSymbols = shared('op-symbols');
  var StringToSymbolRegistry = shared('string-to-symbol-registry');
  var SymbolToStringRegistry = shared('symbol-to-string-registry');
  var WellKnownSymbolsStore = shared('wks');
  var QObject = global$1.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = descriptors && fails(function () {
    return objectCreate(nativeDefineProperty({}, 'a', {
      get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype$2, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype$2[P];
    nativeDefineProperty(O, P, Attributes);
    if (ObjectPrototypeDescriptor && O !== ObjectPrototype$2) {
      nativeDefineProperty(ObjectPrototype$2, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty;

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState$5(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!descriptors) symbol.description = description;
    return symbol;
  };

  var isSymbol$1 = useSymbolAsUid ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return Object(it) instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype$2) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject(O);
    var key = toPrimitive(P, true);
    anObject(Attributes);
    if (has$3(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has$3(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (has$3(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
      } return setSymbolDescriptor(O, key, Attributes);
    } return nativeDefineProperty(O, key, Attributes);
  };

  var $defineProperties = function defineProperties(O, Properties) {
    anObject(O);
    var properties = toIndexedObject(Properties);
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
    $forEach$1(keys, function (key) {
      if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  var $create = function create(O, Properties) {
    return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive(V, true);
    var enumerable = nativePropertyIsEnumerable.call(this, P);
    if (this === ObjectPrototype$2 && has$3(AllSymbols, P) && !has$3(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !has$3(this, P) || !has$3(AllSymbols, P) || has$3(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject(O);
    var key = toPrimitive(P, true);
    if (it === ObjectPrototype$2 && has$3(AllSymbols, key) && !has$3(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor(it, key);
    if (descriptor && has$3(AllSymbols, key) && !(has$3(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames(toIndexedObject(O));
    var result = [];
    $forEach$1(names, function (key) {
      if (!has$3(AllSymbols, key) && !has$3(hiddenKeys$1, key)) result.push(key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$2;
    var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
    var result = [];
    $forEach$1(names, function (key) {
      if (has$3(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has$3(ObjectPrototype$2, key))) {
        result.push(AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.es/ecma262/#sec-symbol-constructor
  if (!nativeSymbol) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
      var tag = uid$3(description);
      var setter = function (value) {
        if (this === ObjectPrototype$2) setter.call(ObjectPrototypeSymbols, value);
        if (has$3(this, HIDDEN) && has$3(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };
      if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$2, tag, { configurable: true, set: setter });
      return wrap(tag, description);
    };

    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState$2(this).tag;
    });

    redefine($Symbol, 'withoutSetter', function (description) {
      return wrap(uid$3(description), description);
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
    };

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState$2(this).description;
        }
      });
      {
        redefine(ObjectPrototype$2, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
      }
    }
  }

  _export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
    Symbol: $Symbol
  });

  $forEach$1(objectKeys(WellKnownSymbolsStore), function (name) {
    defineWellKnownSymbol(name);
  });

  _export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
    // `Symbol.for` method
    // https://tc39.es/ecma262/#sec-symbol.for
    'for': function (key) {
      var string = String(key);
      if (has$3(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = $Symbol(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry[symbol] = string;
      return symbol;
    },
    // `Symbol.keyFor` method
    // https://tc39.es/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol$1(sym)) throw TypeError(sym + ' is not a symbol');
      if (has$3(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function () { USE_SETTER = true; },
    useSimple: function () { USE_SETTER = false; }
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  _export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return objectGetOwnPropertySymbols.f(toObject(it));
    }
  });

  // `JSON.stringify` method behavior with symbols
  // https://tc39.es/ecma262/#sec-json.stringify
  if ($stringify) {
    var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
      var symbol = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      return $stringify([symbol]) != '[null]'
        // WebKit converts symbol values to JSON as null
        || $stringify({ a: symbol }) != '{}'
        // V8 throws on boxed symbols
        || $stringify(Object(symbol)) != '{}';
    });

    _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      stringify: function stringify(it, replacer, space) {
        var args = [it];
        var index = 1;
        var $replacer;
        while (arguments.length > index) args.push(arguments[index++]);
        $replacer = replacer;
        if (!isObject$2(replacer) && it === undefined || isSymbol$1(it)) return; // IE8 returns string on undefined
        if (!isArray$1(replacer)) replacer = function (key, value) {
          if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
          if (!isSymbol$1(value)) return value;
        };
        args[1] = replacer;
        return $stringify.apply(null, args);
      }
    });
  }

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
    createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
  }
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL);

  hiddenKeys$1[HIDDEN] = true;

  var defineProperty$6 = objectDefineProperty.f;


  var NativeSymbol = global$1.Symbol;

  if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
    // Safari 12 bug
    NativeSymbol().description !== undefined
  )) {
    var EmptyStringDescriptionStore = {};
    // wrap Symbol constructor for correct work with undefined description
    var SymbolWrapper = function Symbol() {
      var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
      var result = this instanceof SymbolWrapper
        ? new NativeSymbol(description)
        // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
        : description === undefined ? NativeSymbol() : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };
    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
    symbolPrototype.constructor = SymbolWrapper;

    var symbolToString = symbolPrototype.toString;
    var native = String(NativeSymbol('test')) == 'Symbol(test)';
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    defineProperty$6(symbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        var symbol = isObject$2(this) ? this.valueOf() : this;
        var string = symbolToString.call(symbol);
        if (has$3(EmptyStringDescriptionStore, symbol)) return '';
        var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });

    _export({ global: true, forced: true }, {
      Symbol: SymbolWrapper
    });
  }

  var $includes$1 = arrayIncludes.includes;


  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  _export({ target: 'Array', proto: true }, {
    includes: function includes(el /* , fromIndex = 0 */) {
      return $includes$1(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('includes');

  var SPECIES$1 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$1]) {
      defineProperty(Constructor, SPECIES$1, {
        configurable: true,
        get: function () { return this; }
      });
    }
  };

  var defineProperty$5 = objectDefineProperty.f;








  var fastKey = internalMetadata.fastKey;


  var setInternalState$4 = internalState.set;
  var internalStateGetterFor = internalState.getterFor;

  var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$4(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
        // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        } return that;
      };

      var getEntry = function (that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;
            else that.size--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;
          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (descriptors) defineProperty$5(C.prototype, 'size', {
        get: function () {
          return getInternalState(this).size;
        }
      });
      return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState$4(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last;
        // revert to the last existing entry
        while (entry && entry.removed) entry = entry.previous;
        // get next entry
        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return { value: undefined, done: true };
        }
        // return step by kind
        if (kind == 'keys') return { value: entry.key, done: false };
        if (kind == 'values') return { value: entry.value, done: false };
        return { value: [entry.key, entry.value], done: false };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // `Map` constructor
  // https://tc39.es/ecma262/#sec-map-objects
  collection('Map', function (init) {
    return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  // `Set` constructor
  // https://tc39.es/ecma262/#sec-set-objects
  collection('Set', function (init) {
    return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var $filter$1 = arrayIteration.filter;


  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $map$1 = arrayIteration.map;


  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var getOwnPropertyNames$3 = objectGetOwnPropertyNamesExternal.f;

  // eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
  var FAILS_ON_PRIMITIVES$3 = fails(function () { return !Object.getOwnPropertyNames(1); });

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 }, {
    getOwnPropertyNames: getOwnPropertyNames$3
  });

  // `Reflect.get` method
  // https://tc39.es/ecma262/#sec-reflect.get
  function get$3(target, propertyKey /* , receiver */) {
    var receiver = arguments.length < 3 ? target : arguments[2];
    var descriptor, prototype;
    if (anObject(target) === receiver) return target[propertyKey];
    if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has$3(descriptor, 'value')
      ? descriptor.value
      : descriptor.get === undefined
        ? undefined
        : descriptor.get.call(receiver);
    if (isObject$2(prototype = objectGetPrototypeOf(target))) return get$3(prototype, propertyKey, receiver);
  }

  _export({ target: 'Reflect', stat: true }, {
    get: get$3
  });

  var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  var defineProperty$4 = objectDefineProperty.f;
  var trim = stringTrim.trim;

  var NUMBER = 'Number';
  var NativeNumber = global$1[NUMBER];
  var NumberPrototype = NativeNumber.prototype;

  // Opera ~12 has broken Object#toString
  var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

  // `ToNumber` abstract operation
  // https://tc39.es/ecma262/#sec-tonumber
  var toNumber$1 = function (argument) {
    var it = toPrimitive(argument, false);
    var first, third, radix, maxCode, digits, length, index, code;
    if (typeof it == 'string' && it.length > 2) {
      it = trim(it);
      first = it.charCodeAt(0);
      if (first === 43 || first === 45) {
        third = it.charCodeAt(2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
          case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
          default: return +it;
        }
        digits = it.slice(2);
        length = digits.length;
        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index);
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return NaN;
        } return parseInt(digits, radix);
      }
    } return +it;
  };

  // `Number` constructor
  // https://tc39.es/ecma262/#sec-number-constructor
  if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var it = arguments.length < 1 ? 0 : value;
      var dummy = this;
      return dummy instanceof NumberWrapper
        // check on 1..constructor(foo) case
        && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
          ? inheritIfRequired(new NativeNumber(toNumber$1(it)), dummy, NumberWrapper) : toNumber$1(it);
    };
    for (var keys$2 = descriptors ? getOwnPropertyNames$2(NativeNumber) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES2015 (in case, if modules with ES2015 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
      // ESNext
      'fromString,range'
    ).split(','), j$1 = 0, key$1; keys$2.length > j$1; j$1++) {
      if (has$3(NativeNumber, key$1 = keys$2[j$1]) && !has$3(NumberWrapper, key$1)) {
        defineProperty$4(NumberWrapper, key$1, getOwnPropertyDescriptor$2(NativeNumber, key$1));
      }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global$1, NUMBER, NumberWrapper);
  }

  // `Reflect.set` method
  // https://tc39.es/ecma262/#sec-reflect.set
  function set$4(target, propertyKey, V /* , receiver */) {
    var receiver = arguments.length < 4 ? target : arguments[3];
    var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
    var existingDescriptor, prototype;
    if (!ownDescriptor) {
      if (isObject$2(prototype = objectGetPrototypeOf(target))) {
        return set$4(prototype, propertyKey, V, receiver);
      }
      ownDescriptor = createPropertyDescriptor(0);
    }
    if (has$3(ownDescriptor, 'value')) {
      if (ownDescriptor.writable === false || !isObject$2(receiver)) return false;
      if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
        if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
        existingDescriptor.value = V;
        objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
      } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
      return true;
    }
    return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
  }

  // MS Edge 17-18 Reflect.set allows setting the property to object
  // with non-writable property on the prototype
  var MS_EDGE_BUG = fails(function () {
    var Constructor = function () { /* empty */ };
    var object = objectDefineProperty.f(new Constructor(), 'a', { configurable: true });
    // eslint-disable-next-line es/no-reflect -- required for testing
    return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
  });

  _export({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
    set: set$4
  });

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

  // `Reflect.deleteProperty` method
  // https://tc39.es/ecma262/#sec-reflect.deleteproperty
  _export({ target: 'Reflect', stat: true }, {
    deleteProperty: function deleteProperty(target, propertyKey) {
      var descriptor = getOwnPropertyDescriptor$1(anObject(target), propertyKey);
      return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
    }
  });

  // `Reflect.has` method
  // https://tc39.es/ecma262/#sec-reflect.has
  _export({ target: 'Reflect', stat: true }, {
    has: function has(target, propertyKey) {
      return propertyKey in target;
    }
  });

  // `Reflect.ownKeys` method
  // https://tc39.es/ecma262/#sec-reflect.ownkeys
  _export({ target: 'Reflect', stat: true }, {
    ownKeys: ownKeys$1
  });

  // `Reflect.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-reflect.getprototypeof
  _export({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
    getPrototypeOf: function getPrototypeOf(target) {
      return objectGetPrototypeOf(anObject(target));
    }
  });

  // `Symbol.iterator` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol('iterator');

  // eslint-disable-next-line es/no-object-isextensible -- safe
  var $isExtensible = Object.isExtensible;
  var FAILS_ON_PRIMITIVES$2 = fails(function () { $isExtensible(1); });

  // `Object.isExtensible` method
  // https://tc39.es/ecma262/#sec-object.isextensible
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
    isExtensible: function isExtensible(it) {
      return isObject$2(it) ? $isExtensible ? $isExtensible(it) : true : false;
    }
  });

  var nativeJoin = [].join;

  var ES3_STRINGS = indexedObject != Object;
  var STRICT_METHOD$1 = arrayMethodIsStrict('join', ',');

  // `Array.prototype.join` method
  // https://tc39.es/ecma262/#sec-array.prototype.join
  _export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$1 }, {
    join: function join(separator) {
      return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
    }
  });

  var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
    keys: function keys(it) {
      return objectKeys(toObject(it));
    }
  });

  var defineProperty$3 = objectDefineProperty.f;

  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME$1 = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (descriptors && !(NAME$1 in FunctionPrototype)) {
    defineProperty$3(FunctionPrototype, NAME$1, {
      configurable: true,
      get: function () {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var nativePromiseConstructor = global$1.Promise;

  var engineIsIos = /(?:iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  var engineIsNode = classofRaw(global$1.process) == 'process';

  var location = global$1.location;
  var set$3 = global$1.setImmediate;
  var clear$1 = global$1.clearImmediate;
  var process$2 = global$1.process;
  var MessageChannel = global$1.MessageChannel;
  var Dispatch = global$1.Dispatch;
  var counter = 0;
  var queue$1 = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function (id) {
    // eslint-disable-next-line no-prototype-builtins -- safe
    if (queue$1.hasOwnProperty(id)) {
      var fn = queue$1[id];
      delete queue$1[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run(id);
    };
  };

  var listener = function (event) {
    run(event.data);
  };

  var post = function (id) {
    // old engines have not location.origin
    global$1.postMessage(id + '', location.protocol + '//' + location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$3 || !clear$1) {
    set$3 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue$1[++counter] = function () {
        // eslint-disable-next-line no-new-func -- spec requirement
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear$1 = function clearImmediate(id) {
      delete queue$1[id];
    };
    // Node.js 0.8-
    if (engineIsNode) {
      defer = function (id) {
        process$2.nextTick(runner(id));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !engineIsIos) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = functionBindContext(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (
      global$1.addEventListener &&
      typeof postMessage == 'function' &&
      !global$1.importScripts &&
      location && location.protocol !== 'file:' &&
      !fails(post)
    ) {
      defer = post;
      global$1.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task$1 = {
    set: set$3,
    clear: clear$1
  };

  var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var macrotask = task$1.set;




  var MutationObserver = global$1.MutationObserver || global$1.WebKitMutationObserver;
  var document$2 = global$1.document;
  var process$1 = global$1.process;
  var Promise$1 = global$1.Promise;
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global$1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify$1, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (engineIsNode && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify$1();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
    if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
      toggle = true;
      node = document$2.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true });
      notify$1 = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      // workaround of WebKit ~ iOS Safari 10.1 bug
      promise.constructor = Promise$1;
      then = promise.then;
      notify$1 = function () {
        then.call(promise, flush);
      };
    // Node.js without promises
    } else if (engineIsNode) {
      notify$1 = function () {
        process$1.nextTick(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify$1 = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global$1, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify$1();
    } last = task;
  };

  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction(resolve);
    this.reject = aFunction(reject);
  };

  // 25.4.1.5 NewPromiseCapability(C)
  var f = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability$1 = {
  	f: f
  };

  var promiseResolve = function (C, x) {
    anObject(C);
    if (isObject$2(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability$1.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function (a, b) {
    var console = global$1.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var engineIsBrowser = typeof window == 'object';

  var task = task$1.set;












  var SPECIES = wellKnownSymbol('species');
  var PROMISE = 'Promise';
  var getInternalState$1 = internalState.get;
  var setInternalState$3 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var NativePromisePrototype = nativePromiseConstructor && nativePromiseConstructor.prototype;
  var PromiseConstructor = nativePromiseConstructor;
  var PromiseConstructorPrototype = NativePromisePrototype;
  var TypeError$1 = global$1.TypeError;
  var document$1 = global$1.document;
  var process = global$1.process;
  var newPromiseCapability = newPromiseCapability$1.f;
  var newGenericPromiseCapability = newPromiseCapability;
  var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$1.dispatchEvent);
  var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var SUBCLASSING = false;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  var FORCED$6 = isForced_1(PROMISE, function () {
    var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) return true;
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
    // Detect correctness of subclassing with @@species support
    var promise = new PromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return !GLOBAL_CORE_JS_PROMISE && engineIsBrowser && !NATIVE_REJECTION_EVENT;
  });

  var INCORRECT_ITERATION$1 = FORCED$6 || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject$2(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify = function (state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var index = 0;
      // variable length - can't use forEach
      while (chain.length > index) {
        var reaction = chain[index++];
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // can throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      }
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$1.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global$1.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (!NATIVE_REJECTION_EVENT && (handler = global$1['on' + name])) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (state) {
    task.call(global$1, function () {
      var promise = state.facade;
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (engineIsNode) {
            process.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (state) {
    task.call(global$1, function () {
      var promise = state.facade;
      if (engineIsNode) {
        process.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function (fn, state, unwrap) {
    return function (value) {
      fn(state, value, unwrap);
    };
  };

  var internalReject = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify(state, true);
  };

  var internalResolve = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            then.call(value,
              bind(internalResolve, wrapper, state),
              bind(internalReject, wrapper, state)
            );
          } catch (error) {
            internalReject(wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify(state, false);
      }
    } catch (error) {
      internalReject({ done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED$6) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction(executor);
      Internal.call(this);
      var state = getInternalState$1(this);
      try {
        executor(bind(internalResolve, state), bind(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };
    PromiseConstructorPrototype = PromiseConstructor.prototype;
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    Internal = function Promise(executor) {
      setInternalState$3(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromiseConstructorPrototype, {
      // `Promise.prototype.then` method
      // https://tc39.es/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = engineIsNode ? process.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify(state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.es/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState$1(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, state);
      this.reject = bind(internalReject, state);
    };
    newPromiseCapability$1.f = newPromiseCapability = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    if (typeof nativePromiseConstructor == 'function' && NativePromisePrototype !== Object.prototype) {
      nativeThen = NativePromisePrototype.then;

      if (!SUBCLASSING) {
        // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
        redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
          var that = this;
          return new PromiseConstructor(function (resolve, reject) {
            nativeThen.call(that, resolve, reject);
          }).then(onFulfilled, onRejected);
        // https://github.com/zloirock/core-js/issues/640
        }, { unsafe: true });

        // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
        redefine(NativePromisePrototype, 'catch', PromiseConstructorPrototype['catch'], { unsafe: true });
      }

      // make `.constructor === Promise` work for native promise-based APIs
      try {
        delete NativePromisePrototype.constructor;
      } catch (error) { /* empty */ }

      // make `instanceof Promise` work for native promise-based APIs
      if (objectSetPrototypeOf) {
        objectSetPrototypeOf(NativePromisePrototype, PromiseConstructorPrototype);
      }
    }
  }

  _export({ global: true, wrap: true, forced: FORCED$6 }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  PromiseWrapper = getBuiltIn(PROMISE);

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED$6 }, {
    // `Promise.reject` method
    // https://tc39.es/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });

  _export({ target: PROMISE, stat: true, forced: FORCED$6 }, {
    // `Promise.resolve` method
    // https://tc39.es/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve(this, x);
    }
  });

  _export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
    // `Promise.all` method
    // https://tc39.es/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          $promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.es/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction(C.resolve);
        iterate(iterable, function (promise) {
          $promiseResolve.call(C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // `String.prototype.includes` method
  // https://tc39.es/ecma262/#sec-string.prototype.includes
  _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
    includes: function includes(searchString /* , position = 0 */) {
      return !!~String(requireObjectCoercible(this))
        .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // @@match logic
  fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.es/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible(this);
        var matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        if (!rx.global) return regexpExecAbstract(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regexpExecAbstract(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var TO_STRING = 'toString';
  var RegExpPrototype$1 = RegExp.prototype;
  var nativeToString = RegExpPrototype$1[TO_STRING];

  var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = nativeToString.name != TO_STRING;

  // `RegExp.prototype.toString` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
      return '/' + p + '/' + f;
    }, { unsafe: true });
  }

  var $findIndex$1 = arrayIteration.findIndex;


  var FIND_INDEX = 'findIndex';
  var SKIPS_HOLES$1 = true;

  // Shouldn't skip holes
  if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findindex
  _export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
    findIndex: function findIndex(callbackfn /* , that = undefined */) {
      return $findIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND_INDEX);

  var quot = /"/g;

  // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
  // https://tc39.es/ecma262/#sec-createhtml
  var createHtml = function (string, tag, attribute, value) {
    var S = String(requireObjectCoercible(string));
    var p1 = '<' + tag;
    if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
    return p1 + '>' + S + '</' + tag + '>';
  };

  // check the existence of a method, lowercase
  // of a tag and escaping quotes in arguments
  var stringHtmlForced = function (METHOD_NAME) {
    return fails(function () {
      var test = ''[METHOD_NAME]('"');
      return test !== test.toLowerCase() || test.split('"').length > 3;
    });
  };

  // `String.prototype.anchor` method
  // https://tc39.es/ecma262/#sec-string.prototype.anchor
  _export({ target: 'String', proto: true, forced: stringHtmlForced('anchor') }, {
    anchor: function anchor(name) {
      return createHtml(this, 'a', 'name', name);
    }
  });

  // `Symbol.unscopables` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.unscopables
  defineWellKnownSymbol('unscopables');

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
  };

  // `Array.from` method implementation
  // https://tc39.es/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      result = new C();
      for (;!(step = next.call(iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    // eslint-disable-next-line es/no-array-from -- required for testing
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.es/ecma262/#sec-array.from
  _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
    from: arrayFrom
  });

  // `SameValue` abstract operation
  // https://tc39.es/ecma262/#sec-samevalue
  // eslint-disable-next-line es/no-object-is -- safe
  var sameValue = Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare -- NaN check
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };

  // @@search logic
  fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
    return [
      // `String.prototype.search` method
      // https://tc39.es/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible(this);
        var searcher = regexp == undefined ? undefined : regexp[SEARCH];
        return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
      function (regexp) {
        var res = maybeCallNative(nativeSearch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regexpExecAbstract(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }
    ];
  });

  // `thisNumberValue` abstract operation
  // https://tc39.es/ecma262/#sec-thisnumbervalue
  var thisNumberValue = function (value) {
    if (typeof value != 'number' && classofRaw(value) != 'Number') {
      throw TypeError('Incorrect invocation');
    }
    return +value;
  };

  // `String.prototype.repeat` method implementation
  // https://tc39.es/ecma262/#sec-string.prototype.repeat
  var stringRepeat = function repeat(count) {
    var str = String(requireObjectCoercible(this));
    var result = '';
    var n = toInteger(count);
    if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
    for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
    return result;
  };

  var nativeToFixed = 1.0.toFixed;
  var floor$4 = Math.floor;

  var pow$2 = function (x, n, acc) {
    return n === 0 ? acc : n % 2 === 1 ? pow$2(x, n - 1, acc * x) : pow$2(x * x, n / 2, acc);
  };

  var log$1 = function (x) {
    var n = 0;
    var x2 = x;
    while (x2 >= 4096) {
      n += 12;
      x2 /= 4096;
    }
    while (x2 >= 2) {
      n += 1;
      x2 /= 2;
    } return n;
  };

  var multiply = function (data, n, c) {
    var index = -1;
    var c2 = c;
    while (++index < 6) {
      c2 += n * data[index];
      data[index] = c2 % 1e7;
      c2 = floor$4(c2 / 1e7);
    }
  };

  var divide = function (data, n) {
    var index = 6;
    var c = 0;
    while (--index >= 0) {
      c += data[index];
      data[index] = floor$4(c / n);
      c = (c % n) * 1e7;
    }
  };

  var dataToString = function (data) {
    var index = 6;
    var s = '';
    while (--index >= 0) {
      if (s !== '' || index === 0 || data[index] !== 0) {
        var t = String(data[index]);
        s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
      }
    } return s;
  };

  var FORCED$5 = nativeToFixed && (
    0.00008.toFixed(3) !== '0.000' ||
    0.9.toFixed(0) !== '1' ||
    1.255.toFixed(2) !== '1.25' ||
    1000000000000000128.0.toFixed(0) !== '1000000000000000128'
  ) || !fails(function () {
    // V8 ~ Android 4.3-
    nativeToFixed.call({});
  });

  // `Number.prototype.toFixed` method
  // https://tc39.es/ecma262/#sec-number.prototype.tofixed
  _export({ target: 'Number', proto: true, forced: FORCED$5 }, {
    toFixed: function toFixed(fractionDigits) {
      var number = thisNumberValue(this);
      var fractDigits = toInteger(fractionDigits);
      var data = [0, 0, 0, 0, 0, 0];
      var sign = '';
      var result = '0';
      var e, z, j, k;

      if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
      // eslint-disable-next-line no-self-compare -- NaN check
      if (number != number) return 'NaN';
      if (number <= -1e21 || number >= 1e21) return String(number);
      if (number < 0) {
        sign = '-';
        number = -number;
      }
      if (number > 1e-21) {
        e = log$1(number * pow$2(2, 69, 1)) - 69;
        z = e < 0 ? number * pow$2(2, -e, 1) : number / pow$2(2, e, 1);
        z *= 0x10000000000000;
        e = 52 - e;
        if (e > 0) {
          multiply(data, 0, z);
          j = fractDigits;
          while (j >= 7) {
            multiply(data, 1e7, 0);
            j -= 7;
          }
          multiply(data, pow$2(10, j, 1), 0);
          j = e - 1;
          while (j >= 23) {
            divide(data, 1 << 23);
            j -= 23;
          }
          divide(data, 1 << j);
          multiply(data, 1, 1);
          divide(data, 2);
          result = dataToString(data);
        } else {
          multiply(data, 0, z);
          multiply(data, 1 << -e, 0);
          result = dataToString(data) + stringRepeat.call('0', fractDigits);
        }
      }
      if (fractDigits > 0) {
        k = result.length;
        result = sign + (k <= fractDigits
          ? '0.' + stringRepeat.call('0', fractDigits - k) + result
          : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
      } else {
        result = sign + result;
      } return result;
    }
  });

  var $find$1 = arrayIteration.find;


  var FIND = 'find';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  _export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var onFreeze = internalMetadata.onFreeze;

  // eslint-disable-next-line es/no-object-freeze -- safe
  var $freeze = Object.freeze;
  var FAILS_ON_PRIMITIVES = fails(function () { $freeze(1); });

  // `Object.freeze` method
  // https://tc39.es/ecma262/#sec-object.freeze
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
    freeze: function freeze(it) {
      return $freeze && isObject$2(it) ? $freeze(onFreeze(it)) : it;
    }
  });

  var defineProperty$2 = objectDefineProperty.f;
  var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;





  var enforceInternalState = internalState.enforce;



  var MATCH = wellKnownSymbol('match');
  var NativeRegExp = global$1.RegExp;
  var RegExpPrototype = NativeRegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;

  var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;

  var FORCED$4 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y || fails(function () {
    re2[MATCH] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  })));

  // `RegExp` constructor
  // https://tc39.es/ecma262/#sec-regexp-constructor
  if (FORCED$4) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegexp(pattern);
      var flagsAreUndefined = flags === undefined;
      var sticky;

      if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
        return pattern;
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = regexpFlags.call(pattern);
        pattern = pattern.source;
      }

      if (UNSUPPORTED_Y) {
        sticky = !!flags && flags.indexOf('y') > -1;
        if (sticky) flags = flags.replace(/y/g, '');
      }

      var result = inheritIfRequired(
        CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
        thisIsRegExp ? this : RegExpPrototype,
        RegExpWrapper
      );

      if (UNSUPPORTED_Y && sticky) {
        var state = enforceInternalState(result);
        state.sticky = true;
      }

      return result;
    };
    var proxy = function (key) {
      key in RegExpWrapper || defineProperty$2(RegExpWrapper, key, {
        configurable: true,
        get: function () { return NativeRegExp[key]; },
        set: function (it) { NativeRegExp[key] = it; }
      });
    };
    var keys$1 = getOwnPropertyNames$1(NativeRegExp);
    var index = 0;
    while (keys$1.length > index) proxy(keys$1[index++]);
    RegExpPrototype.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype;
    redefine(global$1, 'RegExp', RegExpWrapper);
  }

  // https://tc39.es/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  // eslint-disable-next-line es/no-typed-arrays -- safe
  var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

  var defineProperty$1 = objectDefineProperty.f;





  var Int8Array$3 = global$1.Int8Array;
  var Int8ArrayPrototype = Int8Array$3 && Int8Array$3.prototype;
  var Uint8ClampedArray = global$1.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
  var TypedArray = Int8Array$3 && objectGetPrototypeOf(Int8Array$3);
  var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
  var ObjectPrototype$1 = Object.prototype;
  var isPrototypeOf = ObjectPrototype$1.isPrototypeOf;

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  var TYPED_ARRAY_TAG = uid$3('TYPED_ARRAY_TAG');
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferNative && !!objectSetPrototypeOf && classof(global$1.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQIRED = false;
  var NAME;

  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var BigIntArrayConstructorsList = {
    BigInt64Array: 8,
    BigUint64Array: 8
  };

  var isView = function isView(it) {
    if (!isObject$2(it)) return false;
    var klass = classof(it);
    return klass === 'DataView'
      || has$3(TypedArrayConstructorsList, klass)
      || has$3(BigIntArrayConstructorsList, klass);
  };

  var isTypedArray = function (it) {
    if (!isObject$2(it)) return false;
    var klass = classof(it);
    return has$3(TypedArrayConstructorsList, klass)
      || has$3(BigIntArrayConstructorsList, klass);
  };

  var aTypedArray$m = function (it) {
    if (isTypedArray(it)) return it;
    throw TypeError('Target is not a typed array');
  };

  var aTypedArrayConstructor$4 = function (C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else for (var ARRAY in TypedArrayConstructorsList) if (has$3(TypedArrayConstructorsList, NAME)) {
      var TypedArrayConstructor = global$1[ARRAY];
      if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
        return C;
      }
    } throw TypeError('Target is not a typed array constructor');
  };

  var exportTypedArrayMethod$n = function (KEY, property, forced) {
    if (!descriptors) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global$1[ARRAY];
      if (TypedArrayConstructor && has$3(TypedArrayConstructor.prototype, KEY)) try {
        delete TypedArrayConstructor.prototype[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArrayPrototype[KEY] || forced) {
      redefine(TypedArrayPrototype, KEY, forced ? property
        : NATIVE_ARRAY_BUFFER_VIEWS$1 && Int8ArrayPrototype[KEY] || property);
    }
  };

  var exportTypedArrayStaticMethod = function (KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!descriptors) return;
    if (objectSetPrototypeOf) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global$1[ARRAY];
        if (TypedArrayConstructor && has$3(TypedArrayConstructor, KEY)) try {
          delete TypedArrayConstructor[KEY];
        } catch (error) { /* empty */ }
      }
      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$1 && TypedArray[KEY] || property);
        } catch (error) { /* empty */ }
      } else return;
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global$1[ARRAY];
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME in TypedArrayConstructorsList) {
    if (!global$1[NAME]) NATIVE_ARRAY_BUFFER_VIEWS$1 = false;
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (!NATIVE_ARRAY_BUFFER_VIEWS$1 || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow -- safe
    TypedArray = function TypedArray() {
      throw TypeError('Incorrect invocation');
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS$1) for (NAME in TypedArrayConstructorsList) {
      if (global$1[NAME]) objectSetPrototypeOf(global$1[NAME], TypedArray);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS$1 || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$1) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS$1) for (NAME in TypedArrayConstructorsList) {
      if (global$1[NAME]) objectSetPrototypeOf(global$1[NAME].prototype, TypedArrayPrototype);
    }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (NATIVE_ARRAY_BUFFER_VIEWS$1 && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (descriptors && !has$3(TypedArrayPrototype, TO_STRING_TAG)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$1(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
      return isObject$2(this) ? this[TYPED_ARRAY_TAG] : undefined;
    } });
    for (NAME in TypedArrayConstructorsList) if (global$1[NAME]) {
      createNonEnumerableProperty(global$1[NAME], TYPED_ARRAY_TAG, NAME);
    }
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$1,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray$m,
    aTypedArrayConstructor: aTypedArrayConstructor$4,
    exportTypedArrayMethod: exportTypedArrayMethod$n,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
  };

  /* eslint-disable no-new -- required for testing */

  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  var ArrayBuffer$1 = global$1.ArrayBuffer;
  var Int8Array$2 = global$1.Int8Array;

  var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
    Int8Array$2(1);
  }) || !fails(function () {
    new Int8Array$2(-1);
  }) || !checkCorrectnessOfIteration(function (iterable) {
    new Int8Array$2();
    new Int8Array$2(null);
    new Int8Array$2(1.5);
    new Int8Array$2(iterable);
  }, true) || fails(function () {
    // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
    return new Int8Array$2(new ArrayBuffer$1(2), 1, undefined).length !== 1;
  });

  // `ToIndex` abstract operation
  // https://tc39.es/ecma262/#sec-toindex
  var toIndex = function (it) {
    if (it === undefined) return 0;
    var number = toInteger(it);
    var length = toLength(number);
    if (number !== length) throw RangeError('Wrong length or index');
    return length;
  };

  // IEEE754 conversions based on https://github.com/feross/ieee754
  var abs = Math.abs;
  var pow$1 = Math.pow;
  var floor$3 = Math.floor;
  var log = Math.log;
  var LN2 = Math.LN2;

  var pack = function (number, mantissaLength, bytes) {
    var buffer = new Array(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow$1(2, -24) - pow$1(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs(number);
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number || number === Infinity) {
      // eslint-disable-next-line no-self-compare -- NaN check
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$3(log(number) / LN2);
      if (number * (c = pow$1(2, -exponent)) < 1) {
        exponent--;
        c *= 2;
      }
      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow$1(2, 1 - eBias);
      }
      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow$1(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow$1(2, eBias - 1) * pow$1(2, mantissaLength);
        exponent = 0;
      }
    }
    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;
    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpack = function (buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;
    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;
    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity : Infinity;
    } else {
      mantissa = mantissa + pow$1(2, mantissaLength);
      exponent = exponent - eBias;
    } return (sign ? -1 : 1) * mantissa * pow$1(2, exponent - mantissaLength);
  };

  var ieee754 = {
    pack: pack,
    unpack: unpack
  };

  // `Array.prototype.fill` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.fill
  var arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = toObject(this);
    var length = toLength(O.length);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var defineProperty = objectDefineProperty.f;




  var getInternalState = internalState.get;
  var setInternalState$2 = internalState.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE = 'prototype';
  var WRONG_LENGTH = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global$1[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var $DataView = global$1[DATA_VIEW];
  var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
  var ObjectPrototype = Object.prototype;
  var RangeError$1 = global$1.RangeError;

  var packIEEE754 = ieee754.pack;
  var unpackIEEE754 = ieee754.unpack;

  var packInt8 = function (number) {
    return [number & 0xFF];
  };

  var packInt16 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var unpackInt32 = function (buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packFloat32 = function (number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function (number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter = function (Constructor, key) {
    defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
  };

  var get$2 = function (view, count, index, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex(index);
    var store = getInternalState(view);
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
    var bytes = getInternalState(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);
    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
  };

  if (!arrayBufferNative) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = toIndex(length);
      setInternalState$2(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength
      });
      if (!descriptors) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = getInternalState(buffer).byteLength;
      var offset = toInteger(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
      setInternalState$2(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });
      if (!descriptors) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (descriptors) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE], {
      getInt8: function getInt8(byteOffset) {
        return get$2(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get$2(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get$2(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get$2(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(get$2(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return unpackInt32(get$2(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get$2(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get$2(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set$2(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$2(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    /* eslint-disable no-new -- required for testing */
    if (!fails(function () {
      NativeArrayBuffer(1);
    }) || !fails(function () {
      new NativeArrayBuffer(-1);
    }) || fails(function () {
      new NativeArrayBuffer();
      new NativeArrayBuffer(1.5);
      new NativeArrayBuffer(NaN);
      return NativeArrayBuffer.name != ARRAY_BUFFER;
    })) {
    /* eslint-enable no-new -- required for testing */
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };
      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
      for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
        if (!((key = keys[j++]) in $ArrayBuffer)) {
          createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
        }
      }
      ArrayBufferPrototype.constructor = $ArrayBuffer;
    }

    // WebKit bug - the same parent prototype for typed arrays and data view
    if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype) {
      objectSetPrototypeOf($DataViewPrototype, ObjectPrototype);
    }

    // iOS Safari 7.x bug
    var testView = new $DataView(new $ArrayBuffer(2));
    var $setInt8 = $DataViewPrototype.setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
      setInt8: function setInt8(byteOffset, value) {
        $setInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        $setInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, { unsafe: true });
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag($DataView, DATA_VIEW);

  var arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView
  };

  var toPositiveInteger = function (it) {
    var result = toInteger(it);
    if (result < 0) throw RangeError("The argument can't be less than 0");
    return result;
  };

  var toOffset = function (it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw RangeError('Wrong offset');
    return offset;
  };

  var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;

  var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var i, length, result, step, iterator, next;
    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      next = iterator.next;
      O = [];
      while (!(step = next.call(iterator)).done) {
        O.push(step.value);
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = functionBindContext(mapfn, arguments[2], 2);
    }
    length = toLength(O.length);
    result = new (aTypedArrayConstructor$3(this))(length);
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var typedArrayConstructor = createCommonjsModule(function (module) {


















  var getOwnPropertyNames = objectGetOwnPropertyNames.f;

  var forEach = arrayIteration.forEach;






  var getInternalState = internalState.get;
  var setInternalState = internalState.set;
  var nativeDefineProperty = objectDefineProperty.f;
  var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var round = Math.round;
  var RangeError = global$1.RangeError;
  var ArrayBuffer = arrayBuffer.ArrayBuffer;
  var DataView = arrayBuffer.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
  var TypedArray = arrayBufferViewCore.TypedArray;
  var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
  var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
  var isTypedArray = arrayBufferViewCore.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH = 'Wrong length';

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key) {
    nativeDefineProperty(it, key, { get: function () {
      return getInternalState(this)[key];
    } });
  };

  var isArrayBuffer = function (it) {
    var klass;
    return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function (target, key) {
    return isTypedArray(target)
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    return isTypedArrayIndex(target, key = toPrimitive(key, true))
      ? createPropertyDescriptor(2, target[key])
      : nativeGetOwnPropertyDescriptor(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    if (isTypedArrayIndex(target, key = toPrimitive(key, true))
      && isObject$2(descriptor)
      && has$3(descriptor, 'value')
      && !has$3(descriptor, 'get')
      && !has$3(descriptor, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable
      && (!has$3(descriptor, 'writable') || descriptor.writable)
      && (!has$3(descriptor, 'enumerable') || descriptor.enumerable)
    ) {
      target[key] = descriptor.value;
      return target;
    } return nativeDefineProperty(target, key, descriptor);
  };

  if (descriptors) {
    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
      objectDefineProperty.f = wrappedDefineProperty;
      addGetter(TypedArrayPrototype, 'buffer');
      addGetter(TypedArrayPrototype, 'byteOffset');
      addGetter(TypedArrayPrototype, 'byteLength');
      addGetter(TypedArrayPrototype, 'length');
    }

    _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
      defineProperty: wrappedDefineProperty
    });

    module.exports = function (TYPE, wrapper, CLAMPED) {
      var BYTES = TYPE.match(/\d+$/)[0] / 8;
      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + TYPE;
      var SETTER = 'set' + TYPE;
      var NativeTypedArrayConstructor = global$1[CONSTRUCTOR_NAME];
      var TypedArrayConstructor = NativeTypedArrayConstructor;
      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
      var exported = {};

      var getter = function (that, index) {
        var data = getInternalState(that);
        return data.view[GETTER](index * BYTES + data.byteOffset, true);
      };

      var setter = function (that, index, value) {
        var data = getInternalState(that);
        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
      };

      var addElement = function (that, index) {
        nativeDefineProperty(that, index, {
          get: function () {
            return getter(this, index);
          },
          set: function (value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };

      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
          anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
          var index = 0;
          var byteOffset = 0;
          var buffer, byteLength, length;
          if (!isObject$2(data)) {
            length = toIndex(data);
            byteLength = length * BYTES;
            buffer = new ArrayBuffer(byteLength);
          } else if (isArrayBuffer(data)) {
            buffer = data;
            byteOffset = toOffset(offset, BYTES);
            var $len = data.byteLength;
            if ($length === undefined) {
              if ($len % BYTES) throw RangeError(WRONG_LENGTH);
              byteLength = $len - byteOffset;
              if (byteLength < 0) throw RangeError(WRONG_LENGTH);
            } else {
              byteLength = toLength($length) * BYTES;
              if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
            }
            length = byteLength / BYTES;
          } else if (isTypedArray(data)) {
            return fromList(TypedArrayConstructor, data);
          } else {
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }
          setInternalState(that, {
            buffer: buffer,
            byteOffset: byteOffset,
            byteLength: byteLength,
            length: length,
            view: new DataView(buffer)
          });
          while (index < length) addElement(that, index++);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
      } else if (typedArrayConstructorsRequireWrappers) {
        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
          anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
          return inheritIfRequired(function () {
            if (!isObject$2(data)) return new NativeTypedArrayConstructor(toIndex(data));
            if (isArrayBuffer(data)) return $length !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
              : typedArrayOffset !== undefined
                ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
                : new NativeTypedArrayConstructor(data);
            if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }(), dummy, TypedArrayConstructor);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
          if (!(key in TypedArrayConstructor)) {
            createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
          }
        });
        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
      }

      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
        createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
      }

      if (TYPED_ARRAY_TAG) {
        createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
      }

      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

      _export({
        global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
      }, exported);

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
        createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
      }

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
        createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
      }

      setSpecies(CONSTRUCTOR_NAME);
    };
  } else module.exports = function () { /* empty */ };
  });

  // `Uint8Array` constructor
  // https://tc39.es/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var min$1 = Math.min;

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.copywithin
  // eslint-disable-next-line es/no-array-prototype-copywithin -- safe
  var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var to = toAbsoluteIndex(target, len);
    var from = toAbsoluteIndex(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$1((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
    var inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count-- > 0) {
      if (from in O) O[to] = O[from];
      else delete O[to];
      to += inc;
      from += inc;
    } return O;
  };

  var aTypedArray$l = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
  exportTypedArrayMethod$m('copyWithin', function copyWithin(target, start /* , end */) {
    return arrayCopyWithin.call(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var $every = arrayIteration.every;

  var aTypedArray$k = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.every` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
  exportTypedArrayMethod$l('every', function every(callbackfn /* , thisArg */) {
    return $every(aTypedArray$k(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$j = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.fill` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  exportTypedArrayMethod$k('fill', function fill(value /* , start, end */) {
    return arrayFill.apply(aTypedArray$j(this), arguments);
  });

  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;


  var typedArrayFromSpeciesAndList = function (instance, list) {
    var C = speciesConstructor(instance, instance.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$2(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var $filter = arrayIteration.filter;


  var aTypedArray$i = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.filter` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
  exportTypedArrayMethod$j('filter', function filter(callbackfn /* , thisArg */) {
    var list = $filter(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return typedArrayFromSpeciesAndList(this, list);
  });

  var $find = arrayIteration.find;

  var aTypedArray$h = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.find` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
  exportTypedArrayMethod$i('find', function find(predicate /* , thisArg */) {
    return $find(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $findIndex = arrayIteration.findIndex;

  var aTypedArray$g = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
  exportTypedArrayMethod$h('findIndex', function findIndex(predicate /* , thisArg */) {
    return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $forEach = arrayIteration.forEach;

  var aTypedArray$f = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
  exportTypedArrayMethod$g('forEach', function forEach(callbackfn /* , thisArg */) {
    $forEach(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $includes = arrayIncludes.includes;

  var aTypedArray$e = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.includes` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
  exportTypedArrayMethod$f('includes', function includes(searchElement /* , fromIndex */) {
    return $includes(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $indexOf = arrayIncludes.indexOf;

  var aTypedArray$d = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
  exportTypedArrayMethod$e('indexOf', function indexOf(searchElement /* , fromIndex */) {
    return $indexOf(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var Uint8Array$2 = global$1.Uint8Array;
  var arrayValues = es_array_iterator.values;
  var arrayKeys = es_array_iterator.keys;
  var arrayEntries = es_array_iterator.entries;
  var aTypedArray$c = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;
  var nativeTypedArrayIterator = Uint8Array$2 && Uint8Array$2.prototype[ITERATOR$2];

  var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
    && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$c(this));
  };

  // `%TypedArray%.prototype.entries` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
  exportTypedArrayMethod$d('entries', function entries() {
    return arrayEntries.call(aTypedArray$c(this));
  });
  // `%TypedArray%.prototype.keys` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
  exportTypedArrayMethod$d('keys', function keys() {
    return arrayKeys.call(aTypedArray$c(this));
  });
  // `%TypedArray%.prototype.values` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
  exportTypedArrayMethod$d('values', typedArrayValues, !CORRECT_ITER_NAME);
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportTypedArrayMethod$d(ITERATOR$2, typedArrayValues, !CORRECT_ITER_NAME);

  var aTypedArray$b = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;
  var $join = [].join;

  // `%TypedArray%.prototype.join` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  exportTypedArrayMethod$c('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  /* eslint-disable es/no-array-prototype-lastindexof -- safe */





  var min = Math.min;
  var $lastIndexOf = [].lastIndexOf;
  var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
  var FORCED$3 = NEGATIVE_ZERO || !STRICT_METHOD;

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.lastindexof
  var arrayLastIndexOf = FORCED$3 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $lastIndexOf.apply(this, arguments) || 0;
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
    return -1;
  } : $lastIndexOf;

  var aTypedArray$a = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  exportTypedArrayMethod$b('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
    return arrayLastIndexOf.apply(aTypedArray$a(this), arguments);
  });

  var $map = arrayIteration.map;


  var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.map` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
  exportTypedArrayMethod$a('map', function map(mapfn /* , thisArg */) {
    return $map(aTypedArray$9(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (aTypedArrayConstructor$1(speciesConstructor(O, O.constructor)))(length);
    });
  });

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  var createMethod = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction(callbackfn);
      var O = toObject(that);
      var self = indexedObject(O);
      var length = toLength(O.length);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }
        index += i;
        if (IS_RIGHT ? index < 0 : length <= index) {
          throw TypeError('Reduce of empty array with no initial value');
        }
      }
      for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
        memo = callbackfn(memo, self[index], index, O);
      }
      return memo;
    };
  };

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    left: createMethod(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    right: createMethod(true)
  };

  var $reduce = arrayReduce.left;

  var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
  exportTypedArrayMethod$9('reduce', function reduce(callbackfn /* , initialValue */) {
    return $reduce(aTypedArray$8(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $reduceRight = arrayReduce.right;

  var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
  exportTypedArrayMethod$8('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(aTypedArray$7(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;
  var floor$2 = Math.floor;

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
  exportTypedArrayMethod$7('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$6(that).length;
    var middle = floor$2(length / 2);
    var index = 0;
    var value;
    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    } return that;
  });

  var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

  var FORCED$2 = fails(function () {
    // eslint-disable-next-line es/no-typed-arrays -- required for testing
    new Int8Array(1).set({});
  });

  // `%TypedArray%.prototype.set` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
  exportTypedArrayMethod$6('set', function set(arrayLike /* , offset */) {
    aTypedArray$5(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError('Wrong length');
    while (index < len) this[offset + index] = src[index++];
  }, FORCED$2);

  var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
  var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;
  var $slice$1 = [].slice;

  var FORCED$1 = fails(function () {
    // eslint-disable-next-line es/no-typed-arrays -- required for testing
    new Int8Array(1).slice();
  });

  // `%TypedArray%.prototype.slice` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
  exportTypedArrayMethod$5('slice', function slice(start, end) {
    var list = $slice$1.call(aTypedArray$4(this), start, end);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  }, FORCED$1);

  var $some = arrayIteration.some;

  var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.some` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
  exportTypedArrayMethod$4('some', function some(callbackfn /* , thisArg */) {
    return $some(aTypedArray$3(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;
  var $sort = [].sort;

  // `%TypedArray%.prototype.sort` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
  exportTypedArrayMethod$3('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$2(this), comparefn);
  });

  var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
  exportTypedArrayMethod$2('subarray', function subarray(begin, end) {
    var O = aTypedArray$1(this);
    var length = O.length;
    var beginIndex = toAbsoluteIndex(begin, length);
    return new (speciesConstructor(O, O.constructor))(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
    );
  });

  var Int8Array$1 = global$1.Int8Array;
  var aTypedArray = arrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;
  var $toLocaleString = [].toLocaleString;
  var $slice = [].slice;

  // iOS Safari 6.x fails here
  var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails(function () {
    $toLocaleString.call(new Int8Array$1(1));
  });

  var FORCED = fails(function () {
    return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
  }) || !fails(function () {
    Int8Array$1.prototype.toLocaleString.call([1, 2]);
  });

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
  exportTypedArrayMethod$1('toLocaleString', function toLocaleString() {
    return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments);
  }, FORCED);

  var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;



  var Uint8Array$1 = global$1.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
  var arrayToString = [].toString;
  var arrayJoin = [].join;

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

  // `%TypedArray%.prototype.toString` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
  exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  var ITERATOR$1 = wellKnownSymbol('iterator');

  var nativeUrl = !fails(function () {
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return (isPure && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?a=1&c=3'
      || searchParams.get('c') !== '3'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$1]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1'
      // fails in Chrome 66-
      || result !== 'a1c3'
      // throws in Safari
      || new URL('http://x', undefined).host !== 'x';
  });

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;
  var floor$1 = Math.floor;
  var stringFromCharCode = String.fromCharCode;

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$1(delta / damp) : delta >> 1;
    delta += floor$1(delta / numPoints);
    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor$1(delta / baseMinusTMin);
    }
    return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  // eslint-disable-next-line max-statements -- TODO
  var encode = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      output.push(delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          for (var k = base; /* no condition */; k += base) {
            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$1(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }
    return output.join('');
  };

  var stringPunycodeToAscii = function (input) {
    var encoded = [];
    var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
    }
    return encoded.join('.');
  };

  var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject(iteratorMethod.call(it));
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















  var $fetch = getBuiltIn('fetch');
  var Headers = getBuiltIn('Headers');
  var ITERATOR = wellKnownSymbol('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function (bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function (it) {
    var result = it.replace(plus, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = result.replace(percentSequence(bytes--), percentDecode);
      }
      return result;
    }
  };

  var find = /[!'()~]|%20/g;

  var replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer$1 = function (match) {
    return replace[match];
  };

  var serialize = function (it) {
    return encodeURIComponent(it).replace(find, replacer$1);
  };

  var parseSearchParams = function (result, query) {
    if (query) {
      var attributes = query.split('&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = attribute.split('=');
          result.push({
            key: deserialize(entry.shift()),
            value: deserialize(entry.join('='))
          });
        }
      }
    }
  };

  var updateSearchParams = function (query) {
    this.entries.length = 0;
    parseSearchParams(this.entries, query);
  };

  var validateArgumentsLength = function (passed, required) {
    if (passed < required) throw TypeError('Not enough arguments');
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$1(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  });

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
    anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    var that = this;
    var entries = [];
    var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

    setInternalState$1(that, {
      type: URL_SEARCH_PARAMS,
      entries: entries,
      updateURL: function () { /* empty */ },
      updateSearchParams: updateSearchParams
    });

    if (init !== undefined) {
      if (isObject$2(init)) {
        iteratorMethod = getIteratorMethod(init);
        if (typeof iteratorMethod === 'function') {
          iterator = iteratorMethod.call(init);
          next = iterator.next;
          while (!(step = next.call(iterator)).done) {
            entryIterator = getIterator(anObject(step.value));
            entryNext = entryIterator.next;
            if (
              (first = entryNext.call(entryIterator)).done ||
              (second = entryNext.call(entryIterator)).done ||
              !entryNext.call(entryIterator).done
            ) throw TypeError('Expected sequence with length 2');
            entries.push({ key: first.value + '', value: second.value + '' });
          }
        } else for (key in init) if (has$3(init, key)) entries.push({ key: key, value: init[key] + '' });
      } else {
        parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
      }
    }
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

  redefineAll(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.append` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      state.entries.push({ key: name + '', value: value + '' });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) entries.splice(index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) result.push(entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = name + '';
      var val = value + '';
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) entries.splice(index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) entries.push({ key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      var entries = state.entries;
      // Array#sort is not stable in some engines
      var slice = entries.slice();
      var entry, entriesIndex, sliceIndex;
      entries.length = 0;
      for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
        entry = slice[sliceIndex];
        for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
          if (entries[entriesIndex].key > entry.key) {
            entries.splice(entriesIndex, 0, entry);
            break;
          }
        }
        if (entriesIndex === sliceIndex) entries.push(entry);
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine(URLSearchParamsPrototype, 'toString', function toString() {
    var entries = getInternalParamsState(this).entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      result.push(serialize(entry.key) + '=' + serialize(entry.value));
    } return result.join('&');
  }, { enumerable: true });

  setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

  _export({ global: true, forced: !nativeUrl }, {
    URLSearchParams: URLSearchParamsConstructor
  });

  // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
  // https://github.com/zloirock/core-js/issues/674
  if (!nativeUrl && typeof $fetch == 'function' && typeof Headers == 'function') {
    _export({ global: true, enumerable: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        var args = [input];
        var init, body, headers;
        if (arguments.length > 1) {
          init = arguments[1];
          if (isObject$2(init)) {
            body = init.body;
            if (classof(body) === URL_SEARCH_PARAMS) {
              headers = init.headers ? new Headers(init.headers) : new Headers();
              if (!headers.has('content-type')) {
                headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }
              init = objectCreate(init, {
                body: createPropertyDescriptor(0, String(body)),
                headers: createPropertyDescriptor(0, headers)
              });
            }
          }
          args.push(init);
        } return $fetch.apply(this, args);
      }
    });
  }

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











  var codeAt = stringMultibyte.codeAt;





  var NativeURL = global$1.URL;
  var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
  var getInternalSearchParamsState = web_urlSearchParams.getState;
  var setInternalState = internalState.set;
  var getInternalURLState = internalState.getterFor('URL');
  var floor = Math.floor;
  var pow = Math.pow;

  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';

  var ALPHA = /[A-Za-z]/;
  // eslint-disable-next-line regexp/no-obscure-range -- safe
  var ALPHANUMERIC = /[\d+-.A-Za-z]/;
  var DIGIT = /\d/;
  var HEX_START = /^(0x|0X)/;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\dA-Fa-f]+$/;
  /* eslint-disable no-control-regex -- safe */
  var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:?@[\\]]/;
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:?@[\\]]/;
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
  var TAB_AND_NEW_LINE = /[\t\n\r]/g;
  /* eslint-enable no-control-regex -- safe */
  var EOF;

  var parseHost = function (url, input) {
    var result, codePoints, index;
    if (input.charAt(0) == '[') {
      if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(input.slice(1, -1));
      if (!result) return INVALID_HOST;
      url.host = result;
    // opaque host
    } else if (!isSpecial(url)) {
      if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      url.host = result;
    } else {
      input = stringPunycodeToAscii(input);
      if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      url.host = result;
    }
  };

  var parseIPv4 = function (input) {
    var parts = input.split('.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.pop();
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && part.charAt(0) == '0') {
        radix = HEX_START.test(part) ? 16 : 8;
        part = part.slice(radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
        number = parseInt(part, radix);
      }
      numbers.push(number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = numbers.pop();
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow(256, 3 - index);
    }
    return ipv4;
  };

  // eslint-disable-next-line max-statements -- TODO
  var parseIPv6 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var char = function () {
      return input.charAt(pointer);
    };

    if (char() == ':') {
      if (input.charAt(1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (char()) {
      if (pieceIndex == 8) return;
      if (char() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && HEX.test(char())) {
        value = value * 16 + parseInt(char(), 16);
        pointer++;
        length++;
      }
      if (char() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (char()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (char() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!DIGIT.test(char())) return;
          while (DIGIT.test(char())) {
            number = parseInt(char(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (char() == ':') {
        pointer++;
        if (!char()) return;
      } else if (char()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  var serializeHost = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        result.unshift(host % 256);
        host = floor(host / 256);
      } return result.join('.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += host[index].toString(16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode = function (char, set) {
    var code = codeAt(char, 0);
    return code > 0x20 && code < 0x7F && !has$3(set, char) ? char : encodeURIComponent(char);
  };

  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  var isSpecial = function (url) {
    return has$3(specialSchemes, url.scheme);
  };

  var includesCredentials = function (url) {
    return url.username != '' || url.password != '';
  };

  var cannotHaveUsernamePasswordPort = function (url) {
    return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
  };

  var isWindowsDriveLetter = function (string, normalized) {
    var second;
    return string.length == 2 && ALPHA.test(string.charAt(0))
      && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
  };

  var startsWithWindowsDriveLetter = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
      string.length == 2 ||
      ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  var shortenURLsPath = function (url) {
    var path = url.path;
    var pathSize = path.length;
    if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.pop();
    }
  };

  var isSingleDot = function (segment) {
    return segment === '.' || segment.toLowerCase() === '%2e';
  };

  var isDoubleDot = function (segment) {
    segment = segment.toLowerCase();
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {};

  // eslint-disable-next-line max-statements -- TODO
  var parseURL = function (url, input, stateOverride, base) {
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, char, bufferCodePoints, failure;

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
    }

    input = input.replace(TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      char = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (char && ALPHA.test(char)) {
            buffer += char.toLowerCase();
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
            buffer += char.toLowerCase();
          } else if (char == ':') {
            if (stateOverride && (
              (isSpecial(url) != has$3(specialSchemes, buffer)) ||
              (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (isSpecial(url) && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (isSpecial(url)) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              url.path.push('');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && char == '#') {
            url.scheme = base.scheme;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (char == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (char == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (char == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '/' || (char == '\\' && isSpecial(url))) {
            state = RELATIVE_SLASH;
          } else if (char == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.path.pop();
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (isSpecial(url) && (char == '/' || char == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (char == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (char != '/' && char != '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (char == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += char;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (char == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (isSpecial(url) && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (char == '[') seenBracket = true;
            else if (char == ']') seenBracket = false;
            buffer += char;
          } break;

        case PORT:
          if (DIGIT.test(char)) {
            buffer += char;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url)) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          if (char == '/' || char == '\\') state = FILE_SLASH;
          else if (base && base.scheme == 'file') {
            if (char == EOF) {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
            } else if (char == '?') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                url.host = base.host;
                url.path = base.path.slice();
                shortenURLsPath(url);
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (char == '/' || char == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
            if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
            else url.host = base.host;
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = parseHost(url, buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += char;
          break;

        case PATH_START:
          if (isSpecial(url)) {
            state = PATH;
            if (char != '/' && char != '\\') continue;
          } else if (!stateOverride && char == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            state = PATH;
            if (char != '/') continue;
          } break;

        case PATH:
          if (
            char == EOF || char == '/' ||
            (char == '\\' && isSpecial(url)) ||
            (!stateOverride && (char == '?' || char == '#'))
          ) {
            if (isDoubleDot(buffer)) {
              shortenURLsPath(url);
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else if (isSingleDot(buffer)) {
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
              }
              url.path.push(buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                url.path.shift();
              }
            }
            if (char == '?') {
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(char, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case QUERY:
          if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            if (char == "'" && isSpecial(url)) url.query += '%27';
            else if (char == '#') url.query += '%23';
            else url.query += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor = function URL(url /* , base */) {
    var that = anInstance(this, URLConstructor, 'URL');
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var urlString = String(url);
    var state = setInternalState(that, { type: 'URL' });
    var baseState, failure;
    if (base !== undefined) {
      if (base instanceof URLConstructor) baseState = getInternalURLState(base);
      else {
        failure = parseURL(baseState = {}, String(base));
        if (failure) throw TypeError(failure);
      }
    }
    failure = parseURL(state, urlString, null, baseState);
    if (failure) throw TypeError(failure);
    var searchParams = state.searchParams = new URLSearchParams$1();
    var searchParamsState = getInternalSearchParamsState(searchParams);
    searchParamsState.updateSearchParams(state.query);
    searchParamsState.updateURL = function () {
      state.query = String(searchParams) || null;
    };
    if (!descriptors) {
      that.href = serializeURL.call(that);
      that.origin = getOrigin.call(that);
      that.protocol = getProtocol.call(that);
      that.username = getUsername.call(that);
      that.password = getPassword.call(that);
      that.host = getHost.call(that);
      that.hostname = getHostname.call(that);
      that.port = getPort.call(that);
      that.pathname = getPathname.call(that);
      that.search = getSearch.call(that);
      that.searchParams = getSearchParams.call(that);
      that.hash = getHash.call(that);
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var serializeURL = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (includesCredentials(url)) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  };

  var getOrigin = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var port = url.port;
    if (scheme == 'blob') try {
      return new URLConstructor(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !isSpecial(url)) return 'null';
    return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
  };

  var getProtocol = function () {
    return getInternalURLState(this).scheme + ':';
  };

  var getUsername = function () {
    return getInternalURLState(this).username;
  };

  var getPassword = function () {
    return getInternalURLState(this).password;
  };

  var getHost = function () {
    var url = getInternalURLState(this);
    var host = url.host;
    var port = url.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  };

  var getHostname = function () {
    var host = getInternalURLState(this).host;
    return host === null ? '' : serializeHost(host);
  };

  var getPort = function () {
    var port = getInternalURLState(this).port;
    return port === null ? '' : String(port);
  };

  var getPathname = function () {
    var url = getInternalURLState(this);
    var path = url.path;
    return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  };

  var getSearch = function () {
    var query = getInternalURLState(this).query;
    return query ? '?' + query : '';
  };

  var getSearchParams = function () {
    return getInternalURLState(this).searchParams;
  };

  var getHash = function () {
    var fragment = getInternalURLState(this).fragment;
    return fragment ? '#' + fragment : '';
  };

  var accessorDescriptor = function (getter, setter) {
    return { get: getter, set: setter, configurable: true, enumerable: true };
  };

  if (descriptors) {
    objectDefineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor(serializeURL, function (href) {
        var url = getInternalURLState(this);
        var urlString = String(href);
        var failure = parseURL(url, urlString);
        if (failure) throw TypeError(failure);
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor(getOrigin),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor(getProtocol, function (protocol) {
        var url = getInternalURLState(this);
        parseURL(url, String(protocol) + ':', SCHEME_START);
      }),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor(getUsername, function (username) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(username));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.username = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor(getPassword, function (password) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(password));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.password = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor(getHost, function (host) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(host), HOST);
      }),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor(getHostname, function (hostname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(hostname), HOSTNAME);
      }),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor(getPort, function (port) {
        var url = getInternalURLState(this);
        if (cannotHaveUsernamePasswordPort(url)) return;
        port = String(port);
        if (port == '') url.port = null;
        else parseURL(url, port, PORT);
      }),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor(getPathname, function (pathname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        url.path = [];
        parseURL(url, pathname + '', PATH_START);
      }),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor(getSearch, function (search) {
        var url = getInternalURLState(this);
        search = String(search);
        if (search == '') {
          url.query = null;
        } else {
          if ('?' == search.charAt(0)) search = search.slice(1);
          url.query = '';
          parseURL(url, search, QUERY);
        }
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor(getSearchParams),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor(getHash, function (hash) {
        var url = getInternalURLState(this);
        hash = String(hash);
        if (hash == '') {
          url.fragment = null;
          return;
        }
        if ('#' == hash.charAt(0)) hash = hash.slice(1);
        url.fragment = '';
        parseURL(url, hash, FRAGMENT);
      })
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine(URLPrototype, 'toJSON', function toJSON() {
    return serializeURL.call(this);
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine(URLPrototype, 'toString', function toString() {
    return serializeURL.call(this);
  }, { enumerable: true });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
      return nativeCreateObjectURL.apply(NativeURL, arguments);
    });
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
      return nativeRevokeObjectURL.apply(NativeURL, arguments);
    });
  }

  setToStringTag(URLConstructor, 'URL');

  _export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
    URL: URLConstructor
  });

  var _mutations;

  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');

    for (var _i = 0; _i < list.length; _i++) {
      map[list[_i]] = true;
    }

    return expectsLowerCase ? function (val) {
      return !!map[val.toLowerCase()];
    } : function (val) {
      return !!map[val];
    };
  }

  var GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
  var isGloballyWhitelisted = /*#__PURE__*/makeMap(GLOBALS_WHITE_LISTED);
  /**
   * On the client we only need to offer special cases for boolean attributes that
   * have different names from their corresponding dom properties:
   * - itemscope -> N/A
   * - allowfullscreen -> allowFullscreen
   * - formnovalidate -> formNoValidate
   * - ismap -> isMap
   * - nomodule -> noModule
   * - novalidate -> noValidate
   * - readonly -> readOnly
   */

  var specialBooleanAttrs = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly";
  var isSpecialBooleanAttr = /*#__PURE__*/makeMap(specialBooleanAttrs);

  function normalizeStyle(value) {
    if (isArray(value)) {
      var res = {};

      for (var _i2 = 0; _i2 < value.length; _i2++) {
        var item = value[_i2];
        var normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);

        if (normalized) {
          for (var key in normalized) {
            res[key] = normalized[key];
          }
        }
      }

      return res;
    } else if (isObject$1(value)) {
      return value;
    }
  }

  var listDelimiterRE = /;(?![^(]*\))/g;
  var propertyDelimiterRE = /:(.+)/;

  function parseStringStyle(cssText) {
    var ret = {};
    cssText.split(listDelimiterRE).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }

  function normalizeClass(value) {
    var res = '';

    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (var _i3 = 0; _i3 < value.length; _i3++) {
        var normalized = normalizeClass(value[_i3]);

        if (normalized) {
          res += normalized + ' ';
        }
      }
    } else if (isObject$1(value)) {
      for (var name in value) {
        if (value[name]) {
          res += name + ' ';
        }
      }
    }

    return res.trim();
  } // These tag configs are shared between compiler-dom and runtime-dom, so they

  /**
   * For converting {{ interpolation }} values to displayed strings.
   * @private
   */


  var toDisplayString = function toDisplayString(val) {
    return val == null ? '' : isObject$1(val) ? JSON.stringify(val, replacer, 2) : String(val);
  };

  var replacer = function replacer(_key, val) {
    if (isMap(val)) {
      var _ref2;

      return _ref2 = {}, _ref2["Map(" + val.size + ")"] = [].concat(val.entries()).reduce(function (entries, _ref) {
        var key = _ref[0],
            val = _ref[1];
        entries[key + " =>"] = val;
        return entries;
      }, {}), _ref2;
    } else if (isSet(val)) {
      var _ref3;

      return _ref3 = {}, _ref3["Set(" + val.size + ")"] = [].concat(val.values()), _ref3;
    } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }

    return val;
  };

  var EMPTY_OBJ = {};
  var EMPTY_ARR = [];

  var NOOP = function NOOP() {};
  /**
   * Always return false.
   */


  var NO = function NO() {
    return false;
  };

  var onRE = /^on[^a-z]/;

  var isOn = function isOn(key) {
    return onRE.test(key);
  };

  var isModelListener = function isModelListener(key) {
    return key.startsWith('onUpdate:');
  };

  var extend = Object.assign;

  var remove = function remove(arr, el) {
    var i = arr.indexOf(el);

    if (i > -1) {
      arr.splice(i, 1);
    }
  };

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var hasOwn = function hasOwn(val, key) {
    return hasOwnProperty.call(val, key);
  };

  var isArray = Array.isArray;

  var isMap = function isMap(val) {
    return toTypeString(val) === '[object Map]';
  };

  var isSet = function isSet(val) {
    return toTypeString(val) === '[object Set]';
  };

  var isFunction = function isFunction(val) {
    return typeof val === 'function';
  };

  var isString = function isString(val) {
    return typeof val === 'string';
  };

  var isSymbol = function isSymbol(val) {
    return typeof val === 'symbol';
  };

  var isObject$1 = function isObject$1(val) {
    return val !== null && typeof val === 'object';
  };

  var isPromise$1 = function isPromise$1(val) {
    return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
  };

  var objectToString = Object.prototype.toString;

  var toTypeString = function toTypeString(value) {
    return objectToString.call(value);
  };

  var toRawType = function toRawType(value) {
    // extract "RawType" from strings like "[object RawType]"
    return toTypeString(value).slice(8, -1);
  };

  var isPlainObject = function isPlainObject(val) {
    return toTypeString(val) === '[object Object]';
  };

  var isIntegerKey = function isIntegerKey(key) {
    return isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;
  };

  var isReservedProp = /*#__PURE__*/makeMap( // the leading comma is intentional so empty string "" is also included
  ',key,ref,' + 'onVnodeBeforeMount,onVnodeMounted,' + 'onVnodeBeforeUpdate,onVnodeUpdated,' + 'onVnodeBeforeUnmount,onVnodeUnmounted');

  var cacheStringFunction = function cacheStringFunction(fn) {
    var cache = Object.create(null);
    return function (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };

  var camelizeRE = /-(\w)/g;
  /**
   * @private
   */

  var camelize = cacheStringFunction(function (str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  });
  var hyphenateRE = /\B([A-Z])/g;
  /**
   * @private
   */

  var hyphenate = cacheStringFunction(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
  });
  /**
   * @private
   */

  var capitalize = cacheStringFunction(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  /**
   * @private
   */

  var toHandlerKey = cacheStringFunction(function (str) {
    return str ? "on" + capitalize(str) : "";
  }); // compare whether a value has changed, accounting for NaN.

  var hasChanged = function hasChanged(value, oldValue) {
    return value !== oldValue && (value === value || oldValue === oldValue);
  };

  var invokeArrayFns = function invokeArrayFns(fns, arg) {
    for (var _i4 = 0; _i4 < fns.length; _i4++) {
      fns[_i4](arg);
    }
  };

  var def = function def(obj, key, value) {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value: value
    });
  };

  var toNumber = function toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n;
  };

  var _globalThis;

  var getGlobalThis = function getGlobalThis() {
    return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : {});
  };

  var targetMap = new WeakMap();
  var effectStack = [];
  var activeEffect;
  var ITERATE_KEY = Symbol('');
  var MAP_KEY_ITERATE_KEY = Symbol('');

  function isEffect(fn) {
    return fn && fn._isEffect === true;
  }

  function effect(fn, options) {
    if (options === void 0) {
      options = EMPTY_OBJ;
    }

    if (isEffect(fn)) {
      fn = fn.raw;
    }

    var effect = createReactiveEffect(fn, options);

    if (!options.lazy) {
      effect();
    }

    return effect;
  }

  function stop(effect) {
    if (effect.active) {
      cleanup(effect);

      if (effect.options.onStop) {
        effect.options.onStop();
      }

      effect.active = false;
    }
  }

  var uid$2 = 0;

  function createReactiveEffect(fn, options) {
    var effect = function reactiveEffect() {
      if (!effect.active) {
        return options.scheduler ? undefined : fn();
      }

      if (!effectStack.includes(effect)) {
        cleanup(effect);

        try {
          enableTracking();
          effectStack.push(effect);
          activeEffect = effect;
          return fn();
        } finally {
          effectStack.pop();
          resetTracking();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    };

    effect.id = uid$2++;
    effect.allowRecurse = !!options.allowRecurse;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
  }

  function cleanup(effect) {
    var deps = effect.deps;

    if (deps.length) {
      for (var _i5 = 0; _i5 < deps.length; _i5++) {
        deps[_i5].delete(effect);
      }

      deps.length = 0;
    }
  }

  var shouldTrack = true;
  var trackStack = [];

  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }

  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }

  function resetTracking() {
    var last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
  }

  function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
      return;
    }

    var depsMap = targetMap.get(target);

    if (!depsMap) {
      targetMap.set(target, depsMap = new Map());
    }

    var dep = depsMap.get(key);

    if (!dep) {
      depsMap.set(key, dep = new Set());
    }

    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }

  function trigger$1(target, type, key, newValue, oldValue, oldTarget) {
    var depsMap = targetMap.get(target);

    if (!depsMap) {
      // never been tracked
      return;
    }

    var effects = new Set();

    var add = function add(effectsToAdd) {
      if (effectsToAdd) {
        effectsToAdd.forEach(function (effect) {
          if (effect !== activeEffect || effect.allowRecurse) {
            effects.add(effect);
          }
        });
      }
    };

    if (type === "clear"
    /* CLEAR */
    ) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
      } else if (key === 'length' && isArray(target)) {
      depsMap.forEach(function (dep, key) {
        if (key === 'length' || key >= newValue) {
          add(dep);
        }
      });
    } else {
      // schedule runs for SET | ADD | DELETE
      if (key !== void 0) {
        add(depsMap.get(key));
      } // also run for iteration key on ADD | DELETE | Map.SET


      switch (type) {
        case "add"
        /* ADD */
        :
          if (!isArray(target)) {
            add(depsMap.get(ITERATE_KEY));

            if (isMap(target)) {
              add(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            // new index added to array -> length changes
            add(depsMap.get('length'));
          }

          break;

        case "delete"
        /* DELETE */
        :
          if (!isArray(target)) {
            add(depsMap.get(ITERATE_KEY));

            if (isMap(target)) {
              add(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }

          break;

        case "set"
        /* SET */
        :
          if (isMap(target)) {
            add(depsMap.get(ITERATE_KEY));
          }

          break;
      }
    }

    var run = function run(effect) {
      if (effect.options.scheduler) {
        effect.options.scheduler(effect);
      } else {
        effect();
      }
    };

    effects.forEach(run);
  }

  var isNonTrackableKeys = /*#__PURE__*/makeMap("__proto__,__v_isRef,__isVue");
  var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map(function (key) {
    return Symbol[key];
  }).filter(isSymbol));
  var get = /*#__PURE__*/createGetter();
  var shallowGet = /*#__PURE__*/createGetter(false, true);
  var readonlyGet = /*#__PURE__*/createGetter(true);
  var shallowReadonlyGet = /*#__PURE__*/createGetter(true, true);
  var arrayInstrumentations = {};
  ['includes', 'indexOf', 'lastIndexOf'].forEach(function (key) {
    var method = Array.prototype[key];

    arrayInstrumentations[key] = function () {
      var arr = toRaw(this);

      for (var _i6 = 0, l = this.length; _i6 < l; _i6++) {
        track(arr, "get"
        /* GET */
        , _i6 + '');
      } // we run the method using the original args first (which may be reactive)


      for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var res = method.apply(arr, args);

      if (res === -1 || res === false) {
        // if that didn't work, run it again using raw values.
        return method.apply(arr, args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(function (key) {
    var method = Array.prototype[key];

    arrayInstrumentations[key] = function () {
      pauseTracking();

      for (var _len2 = arguments.length, args = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var res = method.apply(this, args);
      resetTracking();
      return res;
    };
  });

  function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) {
      isReadonly = false;
    }

    if (shallow === void 0) {
      shallow = false;
    }

    return function get(target, key, receiver) {
      if (key === "__v_isReactive"
      /* IS_REACTIVE */
      ) {
          return !isReadonly;
        } else if (key === "__v_isReadonly"
      /* IS_READONLY */
      ) {
          return isReadonly;
        } else if (key === "__v_raw"
      /* RAW */
      && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }

      var targetIsArray = isArray(target);

      if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      var res = Reflect.get(target, key, receiver);

      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }

      if (!isReadonly) {
        track(target, "get"
        /* GET */
        , key);
      }

      if (shallow) {
        return res;
      }

      if (isRef(res)) {
        // ref unwrapping - does not apply for Array + integer key.
        var shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }

      if (isObject$1(res)) {
        // Convert returned value into a proxy as well. we do the isObject check
        // here to avoid invalid value warning. Also need to lazy access readonly
        // and reactive here to avoid circular dependency.
        return isReadonly ? readonly(res) : reactive(res);
      }

      return res;
    };
  }

  var set = /*#__PURE__*/createSetter();
  var shallowSet = /*#__PURE__*/createSetter(true);

  function createSetter(shallow) {
    if (shallow === void 0) {
      shallow = false;
    }

    return function set(target, key, value, receiver) {
      var oldValue = target[key];

      if (!shallow) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);

        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }

      var hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      var result = Reflect.set(target, key, value, receiver); // don't trigger if target is something up in the prototype chain of original

      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger$1(target, "add"
          /* ADD */
          , key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger$1(target, "set"
          /* SET */
          , key, value);
        }
      }

      return result;
    };
  }

  function deleteProperty(target, key) {
    var hadKey = hasOwn(target, key);
    target[key];
    var result = Reflect.deleteProperty(target, key);

    if (result && hadKey) {
      trigger$1(target, "delete"
      /* DELETE */
      , key, undefined);
    }

    return result;
  }

  function has(target, key) {
    var result = Reflect.has(target, key);

    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has"
      /* HAS */
      , key);
    }

    return result;
  }

  function ownKeys(target) {
    track(target, "iterate"
    /* ITERATE */
    , isArray(target) ? 'length' : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }

  var mutableHandlers = {
    get: get,
    set: set,
    deleteProperty: deleteProperty,
    has: has,
    ownKeys: ownKeys
  };
  var readonlyHandlers = {
    get: readonlyGet,
    set: function set(target, key) {
      return true;
    },
    deleteProperty: function deleteProperty(target, key) {
      return true;
    }
  };
  var shallowReactiveHandlers = extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
  }); // Props handlers are special in the sense that it should not unwrap top-level
  // refs (in order to allow refs to be explicitly passed down), but should
  // retain the reactivity of the normal readonly object.

  extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  });

  var toReactive = function toReactive(value) {
    return isObject$1(value) ? reactive(value) : value;
  };

  var toReadonly = function toReadonly(value) {
    return isObject$1(value) ? readonly(value) : value;
  };

  var toShallow = function toShallow(value) {
    return value;
  };

  var getProto = function getProto(v) {
    return Reflect.getPrototypeOf(v);
  };

  function get$1(target, key, isReadonly, isShallow) {
    if (isReadonly === void 0) {
      isReadonly = false;
    }

    if (isShallow === void 0) {
      isShallow = false;
    }

    // #1772: readonly(reactive(Map)) should return readonly + reactive version
    // of the value
    target = target["__v_raw"
    /* RAW */
    ];
    var rawTarget = toRaw(target);
    var rawKey = toRaw(key);

    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "get"
      /* GET */
      , key);
    }

    !isReadonly && track(rawTarget, "get"
    /* GET */
    , rawKey);

    var _getProto = getProto(rawTarget),
        has = _getProto.has;

    var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;

    if (has.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    }
  }

  function has$1(key, isReadonly) {
    if (isReadonly === void 0) {
      isReadonly = false;
    }

    var target = this["__v_raw"
    /* RAW */
    ];
    var rawTarget = toRaw(target);
    var rawKey = toRaw(key);

    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "has"
      /* HAS */
      , key);
    }

    !isReadonly && track(rawTarget, "has"
    /* HAS */
    , rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }

  function size(target, isReadonly) {
    if (isReadonly === void 0) {
      isReadonly = false;
    }

    target = target["__v_raw"
    /* RAW */
    ];
    !isReadonly && track(toRaw(target), "iterate"
    /* ITERATE */
    , ITERATE_KEY);
    return Reflect.get(target, 'size', target);
  }

  function add(value) {
    value = toRaw(value);
    var target = toRaw(this);
    var proto = getProto(target);
    var hadKey = proto.has.call(target, value);

    if (!hadKey) {
      target.add(value);
      trigger$1(target, "add"
      /* ADD */
      , value, value);
    }

    return this;
  }

  function set$1(key, value) {
    value = toRaw(value);
    var target = toRaw(this);

    var _getProto2 = getProto(target),
        has = _getProto2.has,
        get = _getProto2.get;

    var hadKey = has.call(target, key);

    if (!hadKey) {
      key = toRaw(key);
      hadKey = has.call(target, key);
    }

    var oldValue = get.call(target, key);
    target.set(key, value);

    if (!hadKey) {
      trigger$1(target, "add"
      /* ADD */
      , key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger$1(target, "set"
      /* SET */
      , key, value);
    }

    return this;
  }

  function deleteEntry(key) {
    var target = toRaw(this);

    var _getProto3 = getProto(target),
        has = _getProto3.has,
        get = _getProto3.get;

    var hadKey = has.call(target, key);

    if (!hadKey) {
      key = toRaw(key);
      hadKey = has.call(target, key);
    }

    get ? get.call(target, key) : undefined; // forward the operation before queueing reactions

    var result = target.delete(key);

    if (hadKey) {
      trigger$1(target, "delete"
      /* DELETE */
      , key, undefined);
    }

    return result;
  }

  function clear() {
    var target = toRaw(this);
    var hadItems = target.size !== 0;
    var result = target.clear();

    if (hadItems) {
      trigger$1(target, "clear"
      /* CLEAR */
      , undefined, undefined);
    }

    return result;
  }

  function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
      var observed = this;
      var target = observed["__v_raw"
      /* RAW */
      ];
      var rawTarget = toRaw(target);
      var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate"
      /* ITERATE */
      , ITERATE_KEY);
      return target.forEach(function (value, key) {
        // important: make sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }

  function createIterableMethod(method, isReadonly, isShallow) {
    return function () {
      var _ref4;

      var target = this["__v_raw"
      /* RAW */
      ];
      var rawTarget = toRaw(target);
      var targetIsMap = isMap(rawTarget);
      var isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
      var isKeyOnly = method === 'keys' && targetIsMap;
      var innerIterator = target[method].apply(target, arguments);
      var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate"
      /* ITERATE */
      , isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY); // return a wrapped iterator which returns observed versions of the
      // values emitted from the real iterator

      return _ref4 = {
        // iterator protocol
        next: function next() {
          var _innerIterator$next = innerIterator.next(),
              value = _innerIterator$next.value,
              done = _innerIterator$next.done;

          return done ? {
            value: value,
            done: done
          } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done: done
          };
        }
      }, _ref4[Symbol.iterator] = function () {
        return this;
      }, _ref4;
    };
  }

  function createReadonlyMethod(type) {
    return function () {
      return type === "delete"
      /* DELETE */
      ? false : this;
    };
  }

  var mutableInstrumentations = {
    get: function get(key) {
      return get$1(this, key);
    },

    get size() {
      return size(this);
    },

    has: has$1,
    add: add,
    set: set$1,
    delete: deleteEntry,
    clear: clear,
    forEach: createForEach(false, false)
  };
  var shallowInstrumentations = {
    get: function get(key) {
      return get$1(this, key, false, true);
    },

    get size() {
      return size(this);
    },

    has: has$1,
    add: add,
    set: set$1,
    delete: deleteEntry,
    clear: clear,
    forEach: createForEach(false, true)
  };
  var readonlyInstrumentations = {
    get: function get(key) {
      return get$1(this, key, true);
    },

    get size() {
      return size(this, true);
    },

    has: function has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"
    /* ADD */
    ),
    set: createReadonlyMethod("set"
    /* SET */
    ),
    delete: createReadonlyMethod("delete"
    /* DELETE */
    ),
    clear: createReadonlyMethod("clear"
    /* CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  var shallowReadonlyInstrumentations = {
    get: function get(key) {
      return get$1(this, key, true, true);
    },

    get size() {
      return size(this, true);
    },

    has: function has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"
    /* ADD */
    ),
    set: createReadonlyMethod("set"
    /* SET */
    ),
    delete: createReadonlyMethod("delete"
    /* DELETE */
    ),
    clear: createReadonlyMethod("clear"
    /* CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  var iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
  iteratorMethods.forEach(function (method) {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
  });

  function createInstrumentationGetter(isReadonly, shallow) {
    var instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return function (target, key, receiver) {
      if (key === "__v_isReactive"
      /* IS_REACTIVE */
      ) {
          return !isReadonly;
        } else if (key === "__v_isReadonly"
      /* IS_READONLY */
      ) {
          return isReadonly;
        } else if (key === "__v_raw"
      /* RAW */
      ) {
          return target;
        }

      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }

  var mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
  };
  var shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
  };
  var readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
  };
  var reactiveMap = new WeakMap();
  var shallowReactiveMap = new WeakMap();
  var readonlyMap = new WeakMap();
  var shallowReadonlyMap = new WeakMap();

  function targetTypeMap(rawType) {
    switch (rawType) {
      case 'Object':
      case 'Array':
        return 1
        /* COMMON */
        ;

      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2
        /* COLLECTION */
        ;

      default:
        return 0
        /* INVALID */
        ;
    }
  }

  function getTargetType(value) {
    return value["__v_skip"
    /* SKIP */
    ] || !Object.isExtensible(value) ? 0
    /* INVALID */
    : targetTypeMap(toRawType(value));
  }

  function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly"
    /* IS_READONLY */
    ]) {
      return target;
    }

    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  /**
   * Return a shallowly-reactive copy of the original object, where only the root
   * level properties are reactive. It also does not auto-unwrap refs (even at the
   * root level).
   */


  function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
  }
  /**
   * Creates a readonly copy of the original object. Note the returned copy is not
   * made reactive, but `readonly` can be called on an already reactive object.
   */


  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }

  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$1(target)) {
      return target;
    } // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object


    if (target["__v_raw"
    /* RAW */
    ] && !(isReadonly && target["__v_isReactive"
    /* IS_REACTIVE */
    ])) {
      return target;
    } // target already has corresponding Proxy


    var existingProxy = proxyMap.get(target);

    if (existingProxy) {
      return existingProxy;
    } // only a whitelist of value types can be observed.


    var targetType = getTargetType(target);

    if (targetType === 0
    /* INVALID */
    ) {
        return target;
      }

    var proxy = new Proxy(target, targetType === 2
    /* COLLECTION */
    ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }

  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"
      /* RAW */
      ]);
    }

    return !!(value && value["__v_isReactive"
    /* IS_REACTIVE */
    ]);
  }

  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"
    /* IS_READONLY */
    ]);
  }

  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }

  function toRaw(observed) {
    return observed && toRaw(observed["__v_raw"
    /* RAW */
    ]) || observed;
  }

  function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
  }

  function unref(ref) {
    return isRef(ref) ? ref.value : ref;
  }

  var shallowUnwrapHandlers = {
    get: function get(target, key, receiver) {
      return unref(Reflect.get(target, key, receiver));
    },
    set: function set(target, key, value, receiver) {
      var oldValue = target[key];

      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };

  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }

  var ObjectRefImpl = /*#__PURE__*/function () {
    function ObjectRefImpl(_object, _key) {
      this._object = _object;
      this._key = _key;
      this.__v_isRef = true;
    }

    _createClass(ObjectRefImpl, [{
      key: "value",
      get: function get() {
        return this._object[this._key];
      },
      set: function set(newVal) {
        this._object[this._key] = newVal;
      }
    }]);

    return ObjectRefImpl;
  }();

  function toRef(object, key) {
    return isRef(object[key]) ? object[key] : new ObjectRefImpl(object, key);
  }

  var ComputedRefImpl = /*#__PURE__*/function () {
    function ComputedRefImpl(getter, _setter, isReadonly) {
      var _this = this;

      this._setter = _setter;
      this._dirty = true;
      this.__v_isRef = true;
      this.effect = effect(getter, {
        lazy: true,
        scheduler: function scheduler() {
          if (!_this._dirty) {
            _this._dirty = true;
            trigger$1(toRaw(_this), "set"
            /* SET */
            , 'value');
          }
        }
      });
      this["__v_isReadonly"
      /* IS_READONLY */
      ] = isReadonly;
    }

    _createClass(ComputedRefImpl, [{
      key: "value",
      get: function get() {
        // the computed ref may get wrapped by other proxies e.g. readonly() #3376
        var self = toRaw(this);

        if (self._dirty) {
          self._value = this.effect();
          self._dirty = false;
        }

        track(self, "get"
        /* GET */
        , 'value');
        return self._value;
      },
      set: function set(newValue) {
        this._setter(newValue);
      }
    }]);

    return ComputedRefImpl;
  }();

  function computed$1(getterOrOptions) {
    var getter;
    var setter;

    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }

    return new ComputedRefImpl(getter, setter, isFunction(getterOrOptions) || !getterOrOptions.set);
  }

  function callWithErrorHandling(fn, instance, type, args) {
    var res;

    try {
      res = args ? fn.apply(void 0, args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }

    return res;
  }

  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      var res = callWithErrorHandling(fn, instance, type, args);

      if (res && isPromise$1(res)) {
        res.catch(function (err) {
          handleError(err, instance, type);
        });
      }

      return res;
    }

    var values = [];

    for (var _i7 = 0; _i7 < fn.length; _i7++) {
      values.push(callWithAsyncErrorHandling(fn[_i7], instance, type, args));
    }

    return values;
  }

  function handleError(err, instance, type, throwInDev) {

    instance ? instance.vnode : null;

    if (instance) {
      var cur = instance.parent; // the exposed instance is the render proxy to keep it consistent with 2.x

      var exposedInstance = instance.proxy; // in production the hook receives only the error code

      var errorInfo = type;

      while (cur) {
        var errorCapturedHooks = cur.ec;

        if (errorCapturedHooks) {
          for (var _i8 = 0; _i8 < errorCapturedHooks.length; _i8++) {
            if (errorCapturedHooks[_i8](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }

        cur = cur.parent;
      } // app-level handling


      var appErrorHandler = instance.appContext.config.errorHandler;

      if (appErrorHandler) {
        callWithErrorHandling(appErrorHandler, null, 10
        /* APP_ERROR_HANDLER */
        , [err, exposedInstance, errorInfo]);
        return;
      }
    }

    logError(err);
  }

  function logError(err, type, contextVNode, throwInDev) {

    {
      // recover in prod to reduce the impact on end-user
      console.error(err);
    }
  }

  var isFlushing = false;
  var isFlushPending = false;
  var queue = [];
  var flushIndex = 0;
  var pendingPreFlushCbs = [];
  var activePreFlushCbs = null;
  var preFlushIndex = 0;
  var pendingPostFlushCbs = [];
  var activePostFlushCbs = null;
  var postFlushIndex = 0;
  var resolvedPromise = Promise.resolve();
  var currentFlushPromise = null;
  var currentPreFlushParentJob = null;

  function nextTick(fn) {
    var p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
  } // #2768
  // Use binary-search to find a suitable position in the queue,
  // so that the queue maintains the increasing order of job's id,
  // which can prevent the job from being skipped and also can avoid repeated patching.


  function findInsertionIndex(job) {
    // the start index should be `flushIndex + 1`
    var start = flushIndex + 1;
    var end = queue.length;
    var jobId = getId(job);

    while (start < end) {
      var middle = start + end >>> 1;
      var middleJobId = getId(queue[middle]);
      middleJobId < jobId ? start = middle + 1 : end = middle;
    }

    return start;
  }

  function queueJob(job) {
    // the dedupe search uses the startIndex argument of Array.includes()
    // by default the search index includes the current job that is being run
    // so it cannot recursively trigger itself again.
    // if the job is a watch() callback, the search will start with a +1 index to
    // allow it recursively trigger itself - it is the user's responsibility to
    // ensure it doesn't end up in an infinite loop.
    if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
      var pos = findInsertionIndex(job);

      if (pos > -1) {
        queue.splice(pos, 0, job);
      } else {
        queue.push(job);
      }

      queueFlush();
    }
  }

  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }

  function invalidateJob(job) {
    var i = queue.indexOf(job);

    if (i > flushIndex) {
      queue.splice(i, 1);
    }
  }

  function queueCb(cb, activeQueue, pendingQueue, index) {
    if (!isArray(cb)) {
      if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
        pendingQueue.push(cb);
      }
    } else {
      // if cb is an array, it is a component lifecycle hook which can only be
      // triggered by a job, which is already deduped in the main queue, so
      // we can skip duplicate check here to improve perf
      pendingQueue.push.apply(pendingQueue, cb);
    }

    queueFlush();
  }

  function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
  }

  function queuePostFlushCb(cb) {
    queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
  }

  function flushPreFlushCbs(seen, parentJob) {
    if (parentJob === void 0) {
      parentJob = null;
    }

    if (pendingPreFlushCbs.length) {
      currentPreFlushParentJob = parentJob;
      activePreFlushCbs = [].concat(new Set(pendingPreFlushCbs));
      pendingPreFlushCbs.length = 0;

      for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
        activePreFlushCbs[preFlushIndex]();
      }

      activePreFlushCbs = null;
      preFlushIndex = 0;
      currentPreFlushParentJob = null; // recursively flush until it drains

      flushPreFlushCbs(seen, parentJob);
    }
  }

  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      var deduped = [].concat(new Set(pendingPostFlushCbs));
      pendingPostFlushCbs.length = 0; // #1947 already has active queue, nested flushPostFlushCbs call

      if (activePostFlushCbs) {
        var _activePostFlushCbs;

        (_activePostFlushCbs = activePostFlushCbs).push.apply(_activePostFlushCbs, deduped);

        return;
      }

      activePostFlushCbs = deduped;
      activePostFlushCbs.sort(function (a, b) {
        return getId(a) - getId(b);
      });

      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        activePostFlushCbs[postFlushIndex]();
      }

      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }

  var getId = function getId(job) {
    return job.id == null ? Infinity : job.id;
  };

  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    flushPreFlushCbs(seen); // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child so its render effect will have smaller
    //    priority number)
    // 2. If a component is unmounted during a parent component's update,
    //    its update can be skipped.

    queue.sort(function (a, b) {
      return getId(a) - getId(b);
    });

    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        var job = queue[flushIndex];

        if (job) {
          if ("production" !== 'production') ;
          callWithErrorHandling(job, null, 14
          /* SCHEDULER */
          );
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs();
      isFlushing = false;
      currentFlushPromise = null; // some postFlushCb queued jobs!
      // keep flushing until it drains.

      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }

  var devtools;

  function setDevtoolsHook(hook) {
    devtools = hook;
  }

  function devtoolsInitApp(app, version) {
    // TODO queue if devtools is undefined
    if (!devtools) return;
    devtools.emit("app:init"
    /* APP_INIT */
    , app, version, {
      Fragment: Fragment,
      Text: Text,
      Comment: Comment,
      Static: Static
    });
  }

  function devtoolsUnmountApp(app) {
    if (!devtools) return;
    devtools.emit("app:unmount"
    /* APP_UNMOUNT */
    , app);
  }

  var devtoolsComponentAdded = /*#__PURE__*/createDevtoolsComponentHook("component:added"
  /* COMPONENT_ADDED */
  );
  var devtoolsComponentUpdated = /*#__PURE__*/createDevtoolsComponentHook("component:updated"
  /* COMPONENT_UPDATED */
  );
  var devtoolsComponentRemoved = /*#__PURE__*/createDevtoolsComponentHook("component:removed"
  /* COMPONENT_REMOVED */
  );

  function createDevtoolsComponentHook(hook) {
    return function (component) {
      if (!devtools) return;
      devtools.emit(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : undefined, component);
    };
  }

  function devtoolsComponentEmit(component, event, params) {
    if (!devtools) return;
    devtools.emit("component:emit"
    /* COMPONENT_EMIT */
    , component.appContext.app, component, event, params);
  }

  function emit(instance, event) {
    var props = instance.vnode.props || EMPTY_OBJ;

    for (var _len4 = arguments.length, rawArgs = new Array(_len4 > 2 ? _len4 - 2 : 0), _key5 = 2; _key5 < _len4; _key5++) {
      rawArgs[_key5 - 2] = arguments[_key5];
    }

    var args = rawArgs;
    var isModelListener = event.startsWith('update:'); // for v-model update:xxx events, apply modifiers on args

    var modelArg = isModelListener && event.slice(7);

    if (modelArg && modelArg in props) {
      var modifiersKey = (modelArg === 'modelValue' ? 'model' : modelArg) + "Modifiers";

      var _ref7 = props[modifiersKey] || EMPTY_OBJ,
          number = _ref7.number,
          trim = _ref7.trim;

      if (trim) {
        args = rawArgs.map(function (a) {
          return a.trim();
        });
      } else if (number) {
        args = rawArgs.map(toNumber);
      }
    }

    if (__VUE_PROD_DEVTOOLS__) {
      devtoolsComponentEmit(instance, event, args);
    }

    var handlerName;
    var handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))]; // for v-model update:xxx events, also trigger kebab-case equivalent
    // for props passed via kebab-case

    if (!handler && isModelListener) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }

    if (handler) {
      callWithAsyncErrorHandling(handler, instance, 6
      /* COMPONENT_EVENT_HANDLER */
      , args);
    }

    var onceHandler = props[handlerName + "Once"];

    if (onceHandler) {
      if (!instance.emitted) {
        (instance.emitted = {})[handlerName] = true;
      } else if (instance.emitted[handlerName]) {
        return;
      }

      callWithAsyncErrorHandling(onceHandler, instance, 6
      /* COMPONENT_EVENT_HANDLER */
      , args);
    }
  }

  function normalizeEmitsOptions(comp, appContext, asMixin) {
    if (asMixin === void 0) {
      asMixin = false;
    }

    if (!appContext.deopt && comp.__emits !== undefined) {
      return comp.__emits;
    }

    var raw = comp.emits;
    var normalized = {}; // apply mixin/extends props

    var hasExtends = false;

    if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
      var extendEmits = function extendEmits(raw) {
        var normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true);

        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };

      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }

      if (comp.extends) {
        extendEmits(comp.extends);
      }

      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }

    if (!raw && !hasExtends) {
      return comp.__emits = null;
    }

    if (isArray(raw)) {
      raw.forEach(function (key) {
        return normalized[key] = null;
      });
    } else {
      extend(normalized, raw);
    }

    return comp.__emits = normalized;
  } // Check if an incoming prop key is a declared emit event listener.
  // e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
  // both considered matched listeners.


  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }

    key = key.slice(2).replace(/Once$/, '');
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }

  var isRenderingCompiledSlot = 0;

  var setCompiledSlotRendering = function setCompiledSlotRendering(n) {
    return isRenderingCompiledSlot += n;
  };
  /**
   * Compiler runtime helper for rendering `<slot/>`
   * @private
   */


  function renderSlot(slots, name, props, // this is not a user-facing function, so the fallback is always generated by
  // the compiler and guaranteed to be a function returning an array
  fallback, noSlotted) {
    if (props === void 0) {
      props = {};
    }

    var slot = slots[name]; // invocation interfering with template-based block tracking, but in
    // `renderSlot` we can be sure that it's template-based so we can force
    // enable it.

    isRenderingCompiledSlot++;
    openBlock();
    var validSlotContent = slot && ensureValidVNode(slot(props));
    var rendered = createBlock(Fragment, {
      key: props.key || "_" + name
    }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1
    /* STABLE */
    ? 64
    /* STABLE_FRAGMENT */
    : -2
    /* BAIL */
    );

    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + '-s'];
    }

    isRenderingCompiledSlot--;
    return rendered;
  }

  function ensureValidVNode(vnodes) {
    return vnodes.some(function (child) {
      if (!isVNode(child)) return true;
      if (child.type === Comment) return false;
      if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
      return true;
    }) ? vnodes : null;
  }
  /**
   * mark the current rendering instance for asset resolution (e.g.
   * resolveComponent, resolveDirective) during render
   */


  var currentRenderingInstance = null;
  var currentScopeId = null;
  /**
   * Note: rendering calls maybe nested. The function returns the parent rendering
   * instance if present, which should be restored after the render is done:
   *
   * ```js
   * const prev = setCurrentRenderingInstance(i)
   * // ...render
   * setCurrentRenderingInstance(prev)
   * ```
   */

  function setCurrentRenderingInstance(instance) {
    var prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  /**
   * Wrap a slot function to memoize current rendering instance
   * @private compiler helper
   */


  function withCtx(fn, ctx) {
    if (ctx === void 0) {
      ctx = currentRenderingInstance;
    }

    if (!ctx) return fn;

    var renderFnWithContext = function renderFnWithContext() {
      // If a user calls a compiled slot inside a template expression (#1745), it
      // can mess up block tracking, so by default we need to push a null block to
      // avoid that. This isn't necessary if rendering a compiled `<slot>`.
      if (!isRenderingCompiledSlot) {
        openBlock(true
        /* null block that disables tracking */
        );
      }

      var prevInstance = setCurrentRenderingInstance(ctx);
      var res = fn.apply(void 0, arguments);
      setCurrentRenderingInstance(prevInstance);

      if (!isRenderingCompiledSlot) {
        closeBlock();
      }

      return res;
    }; // mark this as a compiled slot function.
    // this is used in vnode.ts -> normalizeChildren() to set the slot
    // rendering flag.


    renderFnWithContext._c = true;
    return renderFnWithContext;
  }
  /**
   * dev only flag to track whether $attrs was used during render.
   * If $attrs was used during render then the warning for failed attrs
   * fallthrough can be suppressed.
   */


  var accessedAttrs = false;

  function markAttrsAccessed() {
    accessedAttrs = true;
  }

  function renderComponentRoot(instance) {
    var Component = instance.type,
        vnode = instance.vnode,
        proxy = instance.proxy,
        withProxy = instance.withProxy,
        props = instance.props,
        _instance$propsOption = instance.propsOptions,
        propsOptions = _instance$propsOption[0],
        slots = instance.slots,
        attrs = instance.attrs,
        emit = instance.emit,
        render = instance.render,
        renderCache = instance.renderCache,
        data = instance.data,
        setupState = instance.setupState,
        ctx = instance.ctx;
    var result;
    var prev = setCurrentRenderingInstance(instance);

    try {
      var fallthroughAttrs;

      if (vnode.shapeFlag & 4
      /* STATEFUL_COMPONENT */
      ) {
          // withProxy is a proxy with a different `has` trap only for
          // runtime-compiled render functions using `with` block.
          var proxyToUse = withProxy || proxy;
          result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
          fallthroughAttrs = attrs;
        } else {
        // functional
        var _render = Component; // in dev, mark attrs accessed if optional props (attrs === props)

        if ("production" !== 'production' && attrs === props) ;
        result = normalizeVNode(_render.length > 1 ? _render(props, "production" !== 'production' ? {
          get attrs() {
            markAttrsAccessed();
            return attrs;
          },

          slots: slots,
          emit: emit
        } : {
          attrs: attrs,
          slots: slots,
          emit: emit
        }) : _render(props, null
        /* we know it doesn't need it */
        ));
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      } // attr merging
      // in dev mode, comments are preserved, and it's possible for a template
      // to have comments along side the root element which makes it a fragment


      var root = result;
      var setRoot = undefined;
      if ("production" !== 'production' && result.patchFlag > 0 && result.patchFlag & 2048
      /* DEV_ROOT_FRAGMENT */
      ) ;

      if (Component.inheritAttrs !== false && fallthroughAttrs) {
        var keys = Object.keys(fallthroughAttrs);
        var _root = root,
            shapeFlag = _root.shapeFlag;

        if (keys.length) {
          if (shapeFlag & 1
          /* ELEMENT */
          || shapeFlag & 6
          /* COMPONENT */
          ) {
              if (propsOptions && keys.some(isModelListener)) {
                // If a v-model listener (onUpdate:xxx) has a corresponding declared
                // prop, it indicates this component expects to handle v-model and
                // it should not fallthrough.
                // related: #1543, #1643, #1989
                fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
              }

              root = cloneVNode(root, fallthroughAttrs);
            } else if ("production" !== 'production' && !accessedAttrs && root.type !== Comment) ;
        }
      } // inherit directives


      if (vnode.dirs) {
        if ("production" !== 'production' && !isElementRoot(root)) ;
        root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
      } // inherit transition data


      if (vnode.transition) {
        if ("production" !== 'production' && !isElementRoot(root)) ;
        root.transition = vnode.transition;
      }

      if ("production" !== 'production' && setRoot) ;else {
        result = root;
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1
      /* RENDER_FUNCTION */
      );
      result = createVNode(Comment);
    }

    setCurrentRenderingInstance(prev);
    return result;
  }

  function filterSingleRoot(children) {
    var singleRoot;

    for (var _i9 = 0; _i9 < children.length; _i9++) {
      var child = children[_i9];

      if (isVNode(child)) {
        // ignore user comment
        if (child.type !== Comment || child.children === 'v-if') {
          if (singleRoot) {
            // has more than 1 non-comment child, return now
            return;
          } else {
            singleRoot = child;
          }
        }
      } else {
        return;
      }
    }

    return singleRoot;
  }

  var getFunctionalFallthrough = function getFunctionalFallthrough(attrs) {
    var res;

    for (var key in attrs) {
      if (key === 'class' || key === 'style' || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }

    return res;
  };

  var filterModelListeners = function filterModelListeners(attrs, props) {
    var res = {};

    for (var key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }

    return res;
  };

  var isElementRoot = function isElementRoot(vnode) {
    return vnode.shapeFlag & 6
    /* COMPONENT */
    || vnode.shapeFlag & 1
    /* ELEMENT */
    || vnode.type === Comment // potential v-if branch switch
    ;
  };

  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    var prevProps = prevVNode.props,
        prevChildren = prevVNode.children,
        component = prevVNode.component;
    var nextProps = nextVNode.props,
        nextChildren = nextVNode.children,
        patchFlag = nextVNode.patchFlag;
    var emits = component.emitsOptions; // Parent component's render function was hot-updated. Since this may have

    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }

    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024
      /* DYNAMIC_SLOTS */
      ) {
          // slot content that references values that might have changed,
          // e.g. in a v-for
          return true;
        }

      if (patchFlag & 16
      /* FULL_PROPS */
      ) {
          if (!prevProps) {
            return !!nextProps;
          } // presence of this flag indicates props are always non-null


          return hasPropsChanged(prevProps, nextProps, emits);
        } else if (patchFlag & 8
      /* PROPS */
      ) {
          var dynamicProps = nextVNode.dynamicProps;

          for (var _i10 = 0; _i10 < dynamicProps.length; _i10++) {
            var key = dynamicProps[_i10];

            if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
              return true;
            }
          }
        }
    } else {
      // this path is only taken by manually written render functions
      // so presence of any children leads to a forced update
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }

      if (prevProps === nextProps) {
        return false;
      }

      if (!prevProps) {
        return !!nextProps;
      }

      if (!nextProps) {
        return true;
      }

      return hasPropsChanged(prevProps, nextProps, emits);
    }

    return false;
  }

  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    var nextKeys = Object.keys(nextProps);

    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }

    for (var _i11 = 0; _i11 < nextKeys.length; _i11++) {
      var key = nextKeys[_i11];

      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }

    return false;
  }

  function updateHOCHostEl(_ref8, el // HostNode
  ) {
    var vnode = _ref8.vnode,
        parent = _ref8.parent;

    while (parent && parent.subTree === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    }
  }

  var isSuspense = function isSuspense(type) {
    return type.__isSuspense;
  }; // Suspense exposes a component-like API, and is treated like a component


  function normalizeSuspenseChildren(vnode) {
    var shapeFlag = vnode.shapeFlag,
        children = vnode.children;
    var content;
    var fallback;

    if (shapeFlag & 32
    /* SLOTS_CHILDREN */
    ) {
        content = normalizeSuspenseSlot(children.default);
        fallback = normalizeSuspenseSlot(children.fallback);
      } else {
      content = normalizeSuspenseSlot(children);
      fallback = normalizeVNode(null);
    }

    return {
      content: content,
      fallback: fallback
    };
  }

  function normalizeSuspenseSlot(s) {
    if (isFunction(s)) {
      s = s();
    }

    if (isArray(s)) {
      var singleChild = filterSingleRoot(s);
      s = singleChild;
    }

    return normalizeVNode(s);
  }

  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        var _suspense$effects;

        (_suspense$effects = suspense.effects).push.apply(_suspense$effects, fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }

  function initProps(instance, rawProps, isStateful, // result of bitwise flag comparison
  isSSR) {
    if (isSSR === void 0) {
      isSSR = false;
    }

    var props = {};
    var attrs = {};
    def(attrs, InternalObjectKey, 1);
    instance.propsDefaults = Object.create(null);
    setFullProps(instance, rawProps, props, attrs); // validation

    if (isStateful) {
      // stateful
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        // functional w/ optional props, props === attrs
        instance.props = attrs;
      } else {
        // functional w/ declared props
        instance.props = props;
      }
    }

    instance.attrs = attrs;
  }

  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    var props = instance.props,
        attrs = instance.attrs,
        patchFlag = instance.vnode.patchFlag;
    var rawCurrentProps = toRaw(props);
    var _instance$propsOption2 = instance.propsOptions,
        options = _instance$propsOption2[0];

    if ( // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16
    /* FULL_PROPS */
    )) {
      if (patchFlag & 8
      /* PROPS */
      ) {
          // Compiler-generated props & no keys change, just set the updated
          // the props.
          var propsToUpdate = instance.vnode.dynamicProps;

          for (var _i12 = 0; _i12 < propsToUpdate.length; _i12++) {
            var key = propsToUpdate[_i12]; // PROPS flag guarantees rawProps to be non-null

            var value = rawProps[key];

            if (options) {
              // attr / props separation was done on init and will be consistent
              // in this code path, so just check if attrs have it.
              if (hasOwn(attrs, key)) {
                attrs[key] = value;
              } else {
                var camelizedKey = camelize(key);
                props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance);
              }
            } else {
              attrs[key] = value;
            }
          }
        }
    } else {
      // full props update.
      setFullProps(instance, rawProps, props, attrs); // in case of dynamic props, check if we need to delete keys from
      // the props object

      var kebabKey;

      for (var _key6 in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, _key6) && ( // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        (kebabKey = hyphenate(_key6)) === _key6 || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && ( // for camelCase
            rawPrevProps[_key6] !== undefined || // for kebab-case
            rawPrevProps[kebabKey] !== undefined)) {
              props[_key6] = resolvePropValue(options, rawProps || EMPTY_OBJ, _key6, undefined, instance);
            }
          } else {
            delete props[_key6];
          }
        }
      } // in the case of functional component w/o props declaration, props and
      // attrs point to the same object so it should already have been updated.


      if (attrs !== rawCurrentProps) {
        for (var _key7 in attrs) {
          if (!rawProps || !hasOwn(rawProps, _key7)) {
            delete attrs[_key7];
          }
        }
      }
    } // trigger updates for $attrs in case it's used in component slots


    trigger$1(instance, "set"
    /* SET */
    , '$attrs');
  }

  function setFullProps(instance, rawProps, props, attrs) {
    var _instance$propsOption3 = instance.propsOptions,
        options = _instance$propsOption3[0],
        needCastKeys = _instance$propsOption3[1];

    if (rawProps) {
      for (var key in rawProps) {
        var value = rawProps[key]; // key, ref are reserved and never passed down

        if (isReservedProp(key)) {
          continue;
        } // prop option names are camelized during normalization, so to support
        // kebab -> camel conversion here we need to camelize the key.


        var camelKey = void 0;

        if (options && hasOwn(options, camelKey = camelize(key))) {
          props[camelKey] = value;
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          // Any non-declared (either as a prop or an emitted event) props are put
          // into a separate `attrs` object for spreading. Make sure to preserve
          // original key casing
          attrs[key] = value;
        }
      }
    }

    if (needCastKeys) {
      var rawCurrentProps = toRaw(props);

      for (var _i13 = 0; _i13 < needCastKeys.length; _i13++) {
        var _key8 = needCastKeys[_i13];
        props[_key8] = resolvePropValue(options, rawCurrentProps, _key8, rawCurrentProps[_key8], instance);
      }
    }
  }

  function resolvePropValue(options, props, key, value, instance) {
    var opt = options[key];

    if (opt != null) {
      var hasDefault = hasOwn(opt, 'default'); // default values

      if (hasDefault && value === undefined) {
        var defaultValue = opt.default;

        if (opt.type !== Function && isFunction(defaultValue)) {
          var propsDefaults = instance.propsDefaults;

          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue(props);
            setCurrentInstance(null);
          }
        } else {
          value = defaultValue;
        }
      } // boolean casting


      if (opt[0
      /* shouldCast */
      ]) {
        if (!hasOwn(props, key) && !hasDefault) {
          value = false;
        } else if (opt[1
        /* shouldCastTrue */
        ] && (value === '' || value === hyphenate(key))) {
          value = true;
        }
      }
    }

    return value;
  }

  function normalizePropsOptions(comp, appContext, asMixin) {
    if (asMixin === void 0) {
      asMixin = false;
    }

    if (!appContext.deopt && comp.__props) {
      return comp.__props;
    }

    var raw = comp.props;
    var normalized = {};
    var needCastKeys = []; // apply mixin/extends props

    var hasExtends = false;

    if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
      var extendProps = function extendProps(raw) {
        hasExtends = true;

        var _normalizePropsOption = normalizePropsOptions(raw, appContext, true),
            props = _normalizePropsOption[0],
            keys = _normalizePropsOption[1];

        extend(normalized, props);
        if (keys) needCastKeys.push.apply(needCastKeys, keys);
      };

      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }

      if (comp.extends) {
        extendProps(comp.extends);
      }

      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }

    if (!raw && !hasExtends) {
      return comp.__props = EMPTY_ARR;
    }

    if (isArray(raw)) {
      for (var _i14 = 0; _i14 < raw.length; _i14++) {
        var normalizedKey = camelize(raw[_i14]);

        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (var key in raw) {
        var _normalizedKey = camelize(key);

        if (validatePropName(_normalizedKey)) {
          var opt = raw[key];
          var prop = normalized[_normalizedKey] = isArray(opt) || isFunction(opt) ? {
            type: opt
          } : opt;

          if (prop) {
            var booleanIndex = getTypeIndex(Boolean, prop.type);
            var stringIndex = getTypeIndex(String, prop.type);
            prop[0
            /* shouldCast */
            ] = booleanIndex > -1;
            prop[1
            /* shouldCastTrue */
            ] = stringIndex < 0 || booleanIndex < stringIndex; // if the prop needs boolean casting or default value

            if (booleanIndex > -1 || hasOwn(prop, 'default')) {
              needCastKeys.push(_normalizedKey);
            }
          }
        }
      }
    }

    return comp.__props = [normalized, needCastKeys];
  }

  function validatePropName(key) {
    if (key[0] !== '$') {
      return true;
    }

    return false;
  } // use function string name to check type constructors
  // so that it works across vms / iframes.


  function getType(ctor) {
    var match = ctor && ctor.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
  }

  function isSameType(a, b) {
    return getType(a) === getType(b);
  }

  function getTypeIndex(type, expectedTypes) {
    if (isArray(expectedTypes)) {
      return expectedTypes.findIndex(function (t) {
        return isSameType(t, type);
      });
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }

    return -1;
  }

  function injectHook(type, hook, target, prepend) {
    if (target === void 0) {
      target = currentInstance;
    }

    if (prepend === void 0) {
      prepend = false;
    }

    if (target) {
      var hooks = target[type] || (target[type] = []); // cache the error handling wrapper for injected hooks so the same hook
      // can be properly deduped by the scheduler. "__weh" stands for "with error
      // handling".

      var wrappedHook = hook.__weh || (hook.__weh = function () {
        if (target.isUnmounted) {
          return;
        } // disable tracking inside all lifecycle hooks
        // since they can potentially be called inside effects.


        pauseTracking(); // Set currentInstance during hook invocation.
        // This assumes the hook does not synchronously trigger other hooks, which
        // can only be false when the user does something really funky.

        setCurrentInstance(target);

        for (var _len5 = arguments.length, args = new Array(_len5), _key9 = 0; _key9 < _len5; _key9++) {
          args[_key9] = arguments[_key9];
        }

        var res = callWithAsyncErrorHandling(hook, target, type, args);
        setCurrentInstance(null);
        resetTracking();
        return res;
      });

      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }

      return wrappedHook;
    }
  }

  var createHook = function createHook(lifecycle) {
    return function (hook, target) {
      if (target === void 0) {
        target = currentInstance;
      }

      return (// post-create lifecycle registrations are noops during SSR
        !isInSSRComponentSetup && injectHook(lifecycle, hook, target)
      );
    };
  };

  var onBeforeMount = createHook("bm"
  /* BEFORE_MOUNT */
  );
  var onMounted = createHook("m"
  /* MOUNTED */
  );
  var onBeforeUpdate = createHook("bu"
  /* BEFORE_UPDATE */
  );
  var onUpdated = createHook("u"
  /* UPDATED */
  );
  var onBeforeUnmount = createHook("bum"
  /* BEFORE_UNMOUNT */
  );
  var onUnmounted = createHook("um"
  /* UNMOUNTED */
  );
  var onRenderTriggered = createHook("rtg"
  /* RENDER_TRIGGERED */
  );
  var onRenderTracked = createHook("rtc"
  /* RENDER_TRACKED */
  );

  var onErrorCaptured = function onErrorCaptured(hook, target) {
    if (target === void 0) {
      target = currentInstance;
    }

    injectHook("ec"
    /* ERROR_CAPTURED */
    , hook, target);
  }; // Simple effect.


  var INITIAL_WATCHER_VALUE = {}; // implementation

  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }

  function doWatch(source, cb, _temp, instance) {
    var _ref9 = _temp === void 0 ? EMPTY_OBJ : _temp,
        immediate = _ref9.immediate,
        deep = _ref9.deep,
        flush = _ref9.flush,
        onTrack = _ref9.onTrack,
        onTrigger = _ref9.onTrigger;

    if (instance === void 0) {
      instance = currentInstance;
    }

    var getter;
    var forceTrigger = false;

    if (isRef(source)) {
      getter = function getter() {
        return source.value;
      };

      forceTrigger = !!source._shallow;
    } else if (isReactive(source)) {
      getter = function getter() {
        return source;
      };

      deep = true;
    } else if (isArray(source)) {
      getter = function getter() {
        return source.map(function (s) {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return traverse(s);
          } else if (isFunction(s)) {
            return callWithErrorHandling(s, instance, 2
            /* WATCH_GETTER */
            , [instance && instance.proxy]);
          } else ;
        });
      };
    } else if (isFunction(source)) {
      if (cb) {
        // getter with cb
        getter = function getter() {
          return callWithErrorHandling(source, instance, 2
          /* WATCH_GETTER */
          , [instance && instance.proxy]);
        };
      } else {
        // no cb -> simple effect
        getter = function getter() {
          if (instance && instance.isUnmounted) {
            return;
          }

          if (cleanup) {
            cleanup();
          }

          return callWithAsyncErrorHandling(source, instance, 3
          /* WATCH_CALLBACK */
          , [onInvalidate]);
        };
      }
    } else {
      getter = NOOP;
    }

    if (cb && deep) {
      var baseGetter = getter;

      getter = function getter() {
        return traverse(baseGetter());
      };
    }

    var cleanup;

    var onInvalidate = function onInvalidate(fn) {
      cleanup = runner.options.onStop = function () {
        callWithErrorHandling(fn, instance, 4
        /* WATCH_CLEANUP */
        );
      };
    };

    var oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;

    var job = function job() {
      if (!runner.active) {
        return;
      }

      if (cb) {
        // watch(source, cb)
        var newValue = runner();

        if (deep || forceTrigger || hasChanged(newValue, oldValue)) {
          // cleanup before running cb again
          if (cleanup) {
            cleanup();
          }

          callWithAsyncErrorHandling(cb, instance, 3
          /* WATCH_CALLBACK */
          , [newValue, // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue, onInvalidate]);
          oldValue = newValue;
        }
      } else {
        // watchEffect
        runner();
      }
    }; // important: mark the job as a watcher callback so that scheduler knows
    // it is allowed to self-trigger (#1727)


    job.allowRecurse = !!cb;
    var scheduler;

    if (flush === 'sync') {
      scheduler = job;
    } else if (flush === 'post') {
      scheduler = function scheduler() {
        return queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else {
      // default: 'pre'
      scheduler = function scheduler() {
        if (!instance || instance.isMounted) {
          queuePreFlushCb(job);
        } else {
          // with 'pre' option, the first call must happen before
          // the component is mounted so it is called synchronously.
          job();
        }
      };
    }

    var runner = effect(getter, {
      lazy: true,
      onTrack: onTrack,
      onTrigger: onTrigger,
      scheduler: scheduler
    });
    recordInstanceBoundEffect(runner, instance); // initial run

    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = runner();
      }
    } else if (flush === 'post') {
      queuePostRenderEffect(runner, instance && instance.suspense);
    } else {
      runner();
    }

    return function () {
      stop(runner);

      if (instance) {
        remove(instance.effects, runner);
      }
    };
  } // this.$watch


  function instanceWatch(source, cb, options) {
    var publicThis = this.proxy;
    var getter = isString(source) ? function () {
      return publicThis[source];
    } : source.bind(publicThis);
    return doWatch(getter, cb.bind(publicThis), options, this);
  }

  function traverse(value, seen) {
    if (seen === void 0) {
      seen = new Set();
    }

    if (!isObject$1(value) || seen.has(value)) {
      return value;
    }

    seen.add(value);

    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray(value)) {
      for (var _i15 = 0; _i15 < value.length; _i15++) {
        traverse(value[_i15], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach(function (v) {
        traverse(v, seen);
      });
    } else {
      for (var key in value) {
        traverse(value[key], seen);
      }
    }

    return value;
  }

  function useTransitionState() {
    var state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: new Map()
    };
    onMounted(function () {
      state.isMounted = true;
    });
    onBeforeUnmount(function () {
      state.isUnmounting = true;
    });
    return state;
  }

  var TransitionHookValidator = [Function, Array];
  var BaseTransitionImpl = {
    name: "BaseTransition",
    props: {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      // enter
      onBeforeEnter: TransitionHookValidator,
      onEnter: TransitionHookValidator,
      onAfterEnter: TransitionHookValidator,
      onEnterCancelled: TransitionHookValidator,
      // leave
      onBeforeLeave: TransitionHookValidator,
      onLeave: TransitionHookValidator,
      onAfterLeave: TransitionHookValidator,
      onLeaveCancelled: TransitionHookValidator,
      // appear
      onBeforeAppear: TransitionHookValidator,
      onAppear: TransitionHookValidator,
      onAfterAppear: TransitionHookValidator,
      onAppearCancelled: TransitionHookValidator
    },
    setup: function setup(props, _ref10) {
      var slots = _ref10.slots;
      var instance = getCurrentInstance();
      var state = useTransitionState();
      var prevTransitionKey;
      return function () {
        var children = slots.default && getTransitionRawChildren(slots.default(), true);

        if (!children || !children.length) {
          return;
        } // warn multiple elements
        // props for a bit better perf


        var rawProps = toRaw(props);
        var mode = rawProps.mode; // check mode

        var child = children[0];

        if (state.isLeaving) {
          return emptyPlaceholder(child);
        } // in the case of <transition><keep-alive/></transition>, we need to
        // compare the type of the kept-alive children.


        var innerChild = getKeepAliveChild(child);

        if (!innerChild) {
          return emptyPlaceholder(child);
        }

        var enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
        setTransitionHooks(innerChild, enterHooks);
        var oldChild = instance.subTree;
        var oldInnerChild = oldChild && getKeepAliveChild(oldChild);
        var transitionKeyChanged = false;
        var getTransitionKey = innerChild.type.getTransitionKey;

        if (getTransitionKey) {
          var key = getTransitionKey();

          if (prevTransitionKey === undefined) {
            prevTransitionKey = key;
          } else if (key !== prevTransitionKey) {
            prevTransitionKey = key;
            transitionKeyChanged = true;
          }
        } // handle mode


        if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
          var leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance); // update old tree's hooks in case of dynamic transition

          setTransitionHooks(oldInnerChild, leavingHooks); // switching between different views

          if (mode === 'out-in') {
            state.isLeaving = true; // return placeholder node and queue update when leave finishes

            leavingHooks.afterLeave = function () {
              state.isLeaving = false;
              instance.update();
            };

            return emptyPlaceholder(child);
          } else if (mode === 'in-out' && innerChild.type !== Comment) {
            leavingHooks.delayLeave = function (el, earlyRemove, delayedLeave) {
              var leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild; // early removal callback

              el._leaveCb = function () {
                earlyRemove();
                el._leaveCb = undefined;
                delete enterHooks.delayedLeave;
              };

              enterHooks.delayedLeave = delayedLeave;
            };
          }
        }

        return child;
      };
    }
  }; // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files

  var BaseTransition = BaseTransitionImpl;

  function getLeavingNodesForType(state, vnode) {
    var leavingVNodes = state.leavingVNodes;
    var leavingVNodesCache = leavingVNodes.get(vnode.type);

    if (!leavingVNodesCache) {
      leavingVNodesCache = Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }

    return leavingVNodesCache;
  } // The transition hooks are attached to the vnode as vnode.transition
  // and will be called at appropriate timing in the renderer.


  function resolveTransitionHooks(vnode, props, state, instance) {
    var appear = props.appear,
        mode = props.mode,
        _props$persisted = props.persisted,
        persisted = _props$persisted === void 0 ? false : _props$persisted,
        onBeforeEnter = props.onBeforeEnter,
        onEnter = props.onEnter,
        onAfterEnter = props.onAfterEnter,
        onEnterCancelled = props.onEnterCancelled,
        onBeforeLeave = props.onBeforeLeave,
        onLeave = props.onLeave,
        onAfterLeave = props.onAfterLeave,
        onLeaveCancelled = props.onLeaveCancelled,
        onBeforeAppear = props.onBeforeAppear,
        onAppear = props.onAppear,
        onAfterAppear = props.onAfterAppear,
        onAppearCancelled = props.onAppearCancelled;
    var key = String(vnode.key);
    var leavingVNodesCache = getLeavingNodesForType(state, vnode);

    var callHook = function callHook(hook, args) {
      hook && callWithAsyncErrorHandling(hook, instance, 9
      /* TRANSITION_HOOK */
      , args);
    };

    var hooks = {
      mode: mode,
      persisted: persisted,
      beforeEnter: function beforeEnter(el) {
        var hook = onBeforeEnter;

        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        } // for same element (v-show)


        if (el._leaveCb) {
          el._leaveCb(true
          /* cancelled */
          );
        } // for toggled element with same key (v-if)


        var leavingVNode = leavingVNodesCache[key];

        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
          // force early removal (not cancelled)
          leavingVNode.el._leaveCb();
        }

        callHook(hook, [el]);
      },
      enter: function enter(el) {
        var hook = onEnter;
        var afterHook = onAfterEnter;
        var cancelHook = onEnterCancelled;

        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }

        var called = false;

        var done = el._enterCb = function (cancelled) {
          if (called) return;
          called = true;

          if (cancelled) {
            callHook(cancelHook, [el]);
          } else {
            callHook(afterHook, [el]);
          }

          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }

          el._enterCb = undefined;
        };

        if (hook) {
          hook(el, done);

          if (hook.length <= 1) {
            done();
          }
        } else {
          done();
        }
      },
      leave: function leave(el, remove) {
        var key = String(vnode.key);

        if (el._enterCb) {
          el._enterCb(true
          /* cancelled */
          );
        }

        if (state.isUnmounting) {
          return remove();
        }

        callHook(onBeforeLeave, [el]);
        var called = false;

        var done = el._leaveCb = function (cancelled) {
          if (called) return;
          called = true;
          remove();

          if (cancelled) {
            callHook(onLeaveCancelled, [el]);
          } else {
            callHook(onAfterLeave, [el]);
          }

          el._leaveCb = undefined;

          if (leavingVNodesCache[key] === vnode) {
            delete leavingVNodesCache[key];
          }
        };

        leavingVNodesCache[key] = vnode;

        if (onLeave) {
          onLeave(el, done);

          if (onLeave.length <= 1) {
            done();
          }
        } else {
          done();
        }
      },
      clone: function clone(vnode) {
        return resolveTransitionHooks(vnode, props, state, instance);
      }
    };
    return hooks;
  } // the placeholder really only handles one special case: KeepAlive
  // in the case of a KeepAlive in a leave phase we need to return a KeepAlive
  // placeholder with empty content to avoid the KeepAlive instance from being
  // unmounted.


  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }

  function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : undefined : vnode;
  }

  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6
    /* COMPONENT */
    && vnode.component) {
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128
    /* SUSPENSE */
    ) {
        vnode.ssContent.transition = hooks.clone(vnode.ssContent);
        vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
      } else {
      vnode.transition = hooks;
    }
  }

  function getTransitionRawChildren(children, keepComment) {
    if (keepComment === void 0) {
      keepComment = false;
    }

    var ret = [];
    var keyedFragmentCount = 0;

    for (var _i16 = 0; _i16 < children.length; _i16++) {
      var child = children[_i16]; // handle fragment children case, e.g. v-for

      if (child.type === Fragment) {
        if (child.patchFlag & 128
        /* KEYED_FRAGMENT */
        ) keyedFragmentCount++;
        ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
      } // comment placeholders should be skipped, e.g. v-if
      else if (keepComment || child.type !== Comment) {
          ret.push(child);
        }
    } // #1126 if a transition children list contains multiple sub fragments, these
    // fragments will be merged into a flat children array. Since each v-for
    // fragment may contain different static bindings inside, we need to de-op
    // these children to force full diffs to ensure correct behavior.


    if (keyedFragmentCount > 1) {
      for (var _i17 = 0; _i17 < ret.length; _i17++) {
        ret[_i17].patchFlag = -2
        /* BAIL */
        ;
      }
    }

    return ret;
  }

  var isKeepAlive = function isKeepAlive(vnode) {
    return vnode.type.__isKeepAlive;
  };

  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a"
    /* ACTIVATED */
    , target);
  }

  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da"
    /* DEACTIVATED */
    , target);
  }

  function registerKeepAliveHook(hook, type, target) {
    if (target === void 0) {
      target = currentInstance;
    }

    // cache the deactivate branch check wrapper for injected hooks so the same
    // hook can be properly deduped by the scheduler. "__wdc" stands for "with
    // deactivation check".
    var wrappedHook = hook.__wdc || (hook.__wdc = function () {
      // only fire the hook if the target instance is NOT in a deactivated branch.
      var current = target;

      while (current) {
        if (current.isDeactivated) {
          return;
        }

        current = current.parent;
      }

      hook();
    });

    injectHook(type, wrappedHook, target); // In addition to registering it on the target instance, we walk up the parent
    // chain and register it on all ancestor instances that are keep-alive roots.
    // This avoids the need to walk the entire component tree when invoking these
    // hooks, and more importantly, avoids the need to track child components in
    // arrays.

    if (target) {
      var current = target.parent;

      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }

        current = current.parent;
      }
    }
  }

  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    // injectHook wraps the original for error handling, so make sure to remove
    // the wrapped version.
    var injected = injectHook(type, hook, keepAliveRoot, true
    /* prepend */
    );
    onUnmounted(function () {
      remove(keepAliveRoot[type], injected);
    }, target);
  }

  var isInternalKey = function isInternalKey(key) {
    return key[0] === '_' || key === '$stable';
  };

  var normalizeSlotValue = function normalizeSlotValue(value) {
    return isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  };

  var normalizeSlot = function normalizeSlot(key, rawSlot, ctx) {
    return withCtx(function (props) {
      return normalizeSlotValue(rawSlot(props));
    }, ctx);
  };

  var normalizeObjectSlots = function normalizeObjectSlots(rawSlots, slots) {
    var ctx = rawSlots._ctx;

    for (var key in rawSlots) {
      if (isInternalKey(key)) continue;
      var value = rawSlots[key];

      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        (function () {
          var normalized = normalizeSlotValue(value);

          slots[key] = function () {
            return normalized;
          };
        })();
      }
    }
  };

  var normalizeVNodeSlots = function normalizeVNodeSlots(instance, children) {
    var normalized = normalizeSlotValue(children);

    instance.slots.default = function () {
      return normalized;
    };
  };

  var initSlots = function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & 32
    /* SLOTS_CHILDREN */
    ) {
        var type = children._;

        if (type) {
          instance.slots = children; // make compiler marker non-enumerable

          def(children, '_', type);
        } else {
          normalizeObjectSlots(children, instance.slots = {});
        }
      } else {
      instance.slots = {};

      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }

    def(instance.slots, InternalObjectKey, 1);
  };

  var updateSlots = function updateSlots(instance, children, optimized) {
    var vnode = instance.vnode,
        slots = instance.slots;
    var needDeletionCheck = true;
    var deletionComparisonTarget = EMPTY_OBJ;

    if (vnode.shapeFlag & 32
    /* SLOTS_CHILDREN */
    ) {
        var type = children._;

        if (type) {
          // compiled slots.
          if (optimized && type === 1
          /* STABLE */
          ) {
              // compiled AND stable.
              // no need to update, and skip stale slots removal.
              needDeletionCheck = false;
            } else {
            // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
            // normalization.
            extend(slots, children); // #2893
            // when rendering the optimized slots by manually written render function,
            // we need to delete the `slots._` flag if necessary to make subsequent updates reliable,
            // i.e. let the `renderSlot` create the bailed Fragment

            if (!optimized && type === 1
            /* STABLE */
            ) {
                delete slots._;
              }
          }
        } else {
          needDeletionCheck = !children.$stable;
          normalizeObjectSlots(children, slots);
        }

        deletionComparisonTarget = children;
      } else if (children) {
      // non slot object children (direct value) passed to a component
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = {
        default: 1
      };
    } // delete stale slots


    if (needDeletionCheck) {
      for (var key in slots) {
        if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
          delete slots[key];
        }
      }
    }
  };
  /**
   * Adds directives to a VNode.
   */


  function withDirectives(vnode, directives) {
    var internalInstance = currentRenderingInstance;

    if (internalInstance === null) {
      return vnode;
    }

    var instance = internalInstance.proxy;
    var bindings = vnode.dirs || (vnode.dirs = []);

    for (var _i18 = 0; _i18 < directives.length; _i18++) {
      var _directives$_i = directives[_i18],
          dir = _directives$_i[0],
          value = _directives$_i[1],
          arg = _directives$_i[2],
          _directives$_i$ = _directives$_i[3],
          modifiers = _directives$_i$ === void 0 ? EMPTY_OBJ : _directives$_i$;

      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }

      bindings.push({
        dir: dir,
        instance: instance,
        value: value,
        oldValue: void 0,
        arg: arg,
        modifiers: modifiers
      });
    }

    return vnode;
  }

  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    var bindings = vnode.dirs;
    var oldBindings = prevVNode && prevVNode.dirs;

    for (var _i19 = 0; _i19 < bindings.length; _i19++) {
      var binding = bindings[_i19];

      if (oldBindings) {
        binding.oldValue = oldBindings[_i19].value;
      }

      var hook = binding.dir[name];

      if (hook) {
        callWithAsyncErrorHandling(hook, instance, 8
        /* DIRECTIVE_HOOK */
        , [vnode.el, binding, vnode, prevVNode]);
      }
    }
  }

  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        isCustomElement: NO,
        errorHandler: undefined,
        warnHandler: undefined
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null)
    };
  }

  var uid = 0;

  function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps) {
      if (rootProps === void 0) {
        rootProps = null;
      }

      if (rootProps != null && !isObject$1(rootProps)) {
        rootProps = null;
      }

      var context = createAppContext();
      var installedPlugins = new Set();
      var isMounted = false;
      var app = context.app = {
        _uid: uid++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        version: version,

        get config() {
          return context.config;
        },

        set config(v) {},

        use: function use(plugin) {
          for (var _len6 = arguments.length, options = new Array(_len6 > 1 ? _len6 - 1 : 0), _key10 = 1; _key10 < _len6; _key10++) {
            options[_key10 - 1] = arguments[_key10];
          }

          if (installedPlugins.has(plugin)) ;else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install.apply(plugin, [app].concat(options));
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin.apply(void 0, [app].concat(options));
          } else ;
          return app;
        },
        mixin: function mixin(_mixin) {
          if (__VUE_OPTIONS_API__) {
            if (!context.mixins.includes(_mixin)) {
              context.mixins.push(_mixin); // global mixin with props/emits de-optimizes props/emits
              // normalization caching.

              if (_mixin.props || _mixin.emits) {
                context.deopt = true;
              }
            }
          }

          return app;
        },
        component: function component(name, _component) {
          if (!_component) {
            return context.components[name];
          }

          context.components[name] = _component;
          return app;
        },
        directive: function directive(name, _directive) {
          if (!_directive) {
            return context.directives[name];
          }

          context.directives[name] = _directive;
          return app;
        },
        mount: function mount(rootContainer, isHydrate, isSVG) {
          if (!isMounted) {
            var vnode = createVNode(rootComponent, rootProps); // store app context on the root VNode.
            // this will be set on the root instance on initial mount.

            vnode.appContext = context; // HMR root reload

            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, isSVG);
            }

            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;

            if (__VUE_PROD_DEVTOOLS__) {
              devtoolsInitApp(app, version);
            }

            return vnode.component.proxy;
          }
        },
        unmount: function unmount() {
          if (isMounted) {
            render(null, app._container);

            if (__VUE_PROD_DEVTOOLS__) {
              devtoolsUnmountApp(app);
            }

            delete app._container.__vue_app__;
          }
        },
        provide: function provide(key, value) {
          // https://github.com/Microsoft/TypeScript/issues/24587
          context.provides[key] = value;
          return app;
        }
      };
      return app;
    };
  }
  /**
   * This is only called in esm-bundler builds.
   * It is called when a renderer is created, in `baseCreateRenderer` so that
   * importing runtime-core is side-effects free.
   *
   * istanbul-ignore-next
   */


  function initFeatureFlags() {
    if (typeof __VUE_OPTIONS_API__ !== 'boolean') {
      getGlobalThis().__VUE_OPTIONS_API__ = true;
    }

    if (typeof __VUE_PROD_DEVTOOLS__ !== 'boolean') {
      getGlobalThis().__VUE_PROD_DEVTOOLS__ = false;
    }
  } // implementation, close to no-op


  var isAsyncWrapper = function isAsyncWrapper(i) {
    return !!i.type.__asyncLoader;
  };

  var prodEffectOptions = {
    scheduler: queueJob,
    // #1801, #2043 component render effects should allow recursive updates
    allowRecurse: true
  };
  var queuePostRenderEffect = queueEffectWithSuspense;

  var setRef = function setRef(rawRef, oldRawRef, parentSuspense, vnode) {
    if (isArray(rawRef)) {
      rawRef.forEach(function (r, i) {
        return setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode);
      });
      return;
    }

    var value;

    if (!vnode) {
      // means unmount
      value = null;
    } else if (isAsyncWrapper(vnode)) {
      // when mounting async components, nothing needs to be done,
      // because the template ref is forwarded to inner component
      return;
    } else if (vnode.shapeFlag & 4
    /* STATEFUL_COMPONENT */
    ) {
        value = vnode.component.exposed || vnode.component.proxy;
      } else {
      value = vnode.el;
    }

    var owner = rawRef.i,
        ref = rawRef.r;
    var oldRef = oldRawRef && oldRawRef.r;
    var refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    var setupState = owner.setupState; // unset old ref

    if (oldRef != null && oldRef !== ref) {
      if (isString(oldRef)) {
        refs[oldRef] = null;

        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }

    if (isString(ref)) {
      var doSet = function doSet() {
        refs[ref] = value;

        if (hasOwn(setupState, ref)) {
          setupState[ref] = value;
        }
      }; // #1789: for non-null values, set them after render
      // null values means this is unmount and it should not overwrite another
      // ref with the same key


      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    } else if (isRef(ref)) {
      var _doSet = function _doSet() {
        ref.value = value;
      };

      if (value) {
        _doSet.id = -1;
        queuePostRenderEffect(_doSet, parentSuspense);
      } else {
        _doSet();
      }
    } else if (isFunction(ref)) {
      callWithErrorHandling(ref, owner, 12
      /* FUNCTION_REF */
      , [value, refs]);
    } else ;
  };
  /**
   * The createRenderer function accepts two generic arguments:
   * HostNode and HostElement, corresponding to Node and Element types in the
   * host environment. For example, for runtime-dom, HostNode would be the DOM
   * `Node` interface and HostElement would be the DOM `Element` interface.
   *
   * Custom renderers can pass in the platform specific types like this:
   *
   * ``` js
   * const { render, createApp } = createRenderer<Node, Element>({
   *   patchProp,
   *   ...nodeOps
   * })
   * ```
   */


  function createRenderer(options) {
    return baseCreateRenderer(options);
  } // Separate API for creating hydration-enabled renderer.


  function baseCreateRenderer(options, createHydrationFns) {
    // compile-time feature flags check
    {
      initFeatureFlags();
    }

    if (__VUE_PROD_DEVTOOLS__) {
      var _target = getGlobalThis();

      _target.__VUE__ = true;
      setDevtoolsHook(_target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
    }

    var hostInsert = options.insert,
        hostRemove = options.remove,
        hostPatchProp = options.patchProp,
        hostForcePatchProp = options.forcePatchProp,
        hostCreateElement = options.createElement,
        hostCreateText = options.createText,
        hostCreateComment = options.createComment,
        hostSetText = options.setText,
        hostSetElementText = options.setElementText,
        hostParentNode = options.parentNode,
        hostNextSibling = options.nextSibling,
        _options$setScopeId = options.setScopeId,
        hostSetScopeId = _options$setScopeId === void 0 ? NOOP : _options$setScopeId,
        hostCloneNode = options.cloneNode,
        hostInsertStaticContent = options.insertStaticContent; // Note: functions inside this closure should use `const xxx = () => {}`
    // style in order to prevent being inlined by minifiers.

    var patch = function patch(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      if (anchor === void 0) {
        anchor = null;
      }

      if (parentComponent === void 0) {
        parentComponent = null;
      }

      if (parentSuspense === void 0) {
        parentSuspense = null;
      }

      if (isSVG === void 0) {
        isSVG = false;
      }

      if (slotScopeIds === void 0) {
        slotScopeIds = null;
      }

      if (optimized === void 0) {
        optimized = false;
      }

      // patching & not same type, unmount old tree
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }

      if (n2.patchFlag === -2
      /* BAIL */
      ) {
          optimized = false;
          n2.dynamicChildren = null;
        }

      var type = n2.type,
          ref = n2.ref,
          shapeFlag = n2.shapeFlag;

      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;

        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;

        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, isSVG);
          }

          break;

        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          break;

        default:
          if (shapeFlag & 1
          /* ELEMENT */
          ) {
              processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (shapeFlag & 6
          /* COMPONENT */
          ) {
              processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (shapeFlag & 64
          /* TELEPORT */
          ) {
              type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
            } else if (shapeFlag & 128
          /* SUSPENSE */
          ) {
              type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
            } else ;

      } // set ref


      if (ref != null && parentComponent) {
        setRef(ref, n1 && n1.ref, parentSuspense, n2);
      }
    };

    var processText = function processText(n1, n2, container, anchor) {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
      } else {
        var el = n2.el = n1.el;

        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };

    var processCommentNode = function processCommentNode(n1, n2, container, anchor) {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateComment(n2.children || ''), container, anchor);
      } else {
        // there's no support for dynamic comments
        n2.el = n1.el;
      }
    };

    var mountStaticNode = function mountStaticNode(n2, container, anchor, isSVG) {
      var _hostInsertStaticCont = hostInsertStaticContent(n2.children, container, anchor, isSVG);

      n2.el = _hostInsertStaticCont[0];
      n2.anchor = _hostInsertStaticCont[1];
    };

    var moveStaticNode = function moveStaticNode(_ref11, container, nextSibling) {
      var el = _ref11.el,
          anchor = _ref11.anchor;
      var next;

      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }

      hostInsert(anchor, container, nextSibling);
    };

    var removeStaticNode = function removeStaticNode(_ref12) {
      var el = _ref12.el,
          anchor = _ref12.anchor;
      var next;

      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }

      hostRemove(anchor);
    };

    var processElement = function processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      isSVG = isSVG || n2.type === 'svg';

      if (n1 == null) {
        mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };

    var mountElement = function mountElement(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      var el;
      var vnodeHook;
      var type = vnode.type,
          props = vnode.props,
          shapeFlag = vnode.shapeFlag,
          transition = vnode.transition,
          patchFlag = vnode.patchFlag,
          dirs = vnode.dirs;

      if (vnode.el && hostCloneNode !== undefined && patchFlag === -1
      /* HOISTED */
      ) {
          // If a vnode has non-null el, it means it's being reused.
          // Only static vnodes can be reused, so its mounted DOM nodes should be
          // exactly the same, and we can simply do a clone here.
          // only do this in production since cloned trees cannot be HMR updated.
          el = vnode.el = hostCloneNode(vnode.el);
        } else {
        el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props); // mount children first, since some props may rely on child content
        // being already rendered, e.g. `<select value>`

        if (shapeFlag & 8
        /* TEXT_CHILDREN */
        ) {
            hostSetElementText(el, vnode.children);
          } else if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
            mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', slotScopeIds, optimized || !!vnode.dynamicChildren);
          }

        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, 'created');
        } // props


        if (props) {
          for (var key in props) {
            if (!isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }

          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        } // scopeId


        setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      }

      if (__VUE_PROD_DEVTOOLS__) {
        Object.defineProperty(el, '__vnode', {
          value: vnode,
          enumerable: false
        });
        Object.defineProperty(el, '__vueParentComponent', {
          value: parentComponent,
          enumerable: false
        });
      }

      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
      } // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved
      // #1689 For inside suspense + suspense resolved case, just call it


      var needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;

      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }

      hostInsert(el, container, anchor);

      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(function () {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
        }, parentSuspense);
      }
    };

    var setScopeId = function setScopeId(el, vnode, scopeId, slotScopeIds, parentComponent) {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }

      if (slotScopeIds) {
        for (var _i20 = 0; _i20 < slotScopeIds.length; _i20++) {
          hostSetScopeId(el, slotScopeIds[_i20]);
        }
      }

      if (parentComponent) {
        var subTree = parentComponent.subTree;

        if (vnode === subTree) {
          var parentVNode = parentComponent.vnode;
          setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
        }
      }
    };

    var mountChildren = function mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, slotScopeIds, start) {
      if (start === void 0) {
        start = 0;
      }

      for (var _i21 = start; _i21 < children.length; _i21++) {
        var child = children[_i21] = optimized ? cloneIfMounted(children[_i21]) : normalizeVNode(children[_i21]);
        patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized, slotScopeIds);
      }
    };

    var patchElement = function patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      var el = n2.el = n1.el;
      var patchFlag = n2.patchFlag,
          dynamicChildren = n2.dynamicChildren,
          dirs = n2.dirs; // #1426 take the old vnode's patch flag into account since user may clone a
      // compiler-generated vnode, which de-opts to FULL_PROPS

      patchFlag |= n1.patchFlag & 16
      /* FULL_PROPS */
      ;
      var oldProps = n1.props || EMPTY_OBJ;
      var newProps = n2.props || EMPTY_OBJ;
      var vnodeHook;

      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }

      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
      }

      if (patchFlag > 0) {
        // the presence of a patchFlag means this element's render code was
        // generated by the compiler and can take the fast path.
        // in this path old node and new node are guaranteed to have the same shape
        // (i.e. at the exact same position in the source template)
        if (patchFlag & 16
        /* FULL_PROPS */
        ) {
            // element props contain dynamic keys, full diff needed
            patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
          } else {
          // class
          // this flag is matched when the element has dynamic class bindings.
          if (patchFlag & 2
          /* CLASS */
          ) {
              if (oldProps.class !== newProps.class) {
                hostPatchProp(el, 'class', null, newProps.class, isSVG);
              }
            } // style
          // this flag is matched when the element has dynamic style bindings


          if (patchFlag & 4
          /* STYLE */
          ) {
              hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
            } // props
          // This flag is matched when the element has dynamic prop/attr bindings
          // other than class and style. The keys of dynamic prop/attrs are saved for
          // faster iteration.
          // Note dynamic keys like :[foo]="bar" will cause this optimization to
          // bail out and go through a full diff because we need to unset the old key


          if (patchFlag & 8
          /* PROPS */
          ) {
              // if the flag is present then dynamicProps must be non-null
              var propsToUpdate = n2.dynamicProps;

              for (var _i22 = 0; _i22 < propsToUpdate.length; _i22++) {
                var key = propsToUpdate[_i22];
                var prev = oldProps[key];
                var next = newProps[key];

                if (next !== prev || hostForcePatchProp && hostForcePatchProp(el, key)) {
                  hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
                }
              }
            }
        } // text
        // This flag is matched when the element has only dynamic text children.


        if (patchFlag & 1
        /* TEXT */
        ) {
            if (n1.children !== n2.children) {
              hostSetElementText(el, n2.children);
            }
          }
      } else if (!optimized && dynamicChildren == null) {
        // unoptimized, full diff
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      }

      var areChildrenSVG = isSVG && n2.type !== 'foreignObject';

      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
      } else if (!optimized) {
        // full diff
        patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
      }

      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(function () {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
        }, parentSuspense);
      }
    }; // The fast path for blocks.


    var patchBlockChildren = function patchBlockChildren(oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) {
      for (var _i23 = 0; _i23 < newChildren.length; _i23++) {
        var oldVNode = oldChildren[_i23];
        var newVNode = newChildren[_i23]; // Determine the container (parent element) for the patch.

        var container = // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & 6
        /* COMPONENT */
        || oldVNode.shapeFlag & 64
        /* TELEPORT */
        ? hostParentNode(oldVNode.el) : // In other cases, the parent container is not actually used so we
        // just pass the block element here to avoid a DOM parentNode call.
        fallbackContainer;
        patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
      }
    };

    var patchProps = function patchProps(el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) {
      if (oldProps !== newProps) {
        for (var key in newProps) {
          // empty string is not valid prop
          if (isReservedProp(key)) continue;
          var next = newProps[key];
          var prev = oldProps[key];

          if (next !== prev || hostForcePatchProp && hostForcePatchProp(el, key)) {
            hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }

        if (oldProps !== EMPTY_OBJ) {
          for (var _key11 in oldProps) {
            if (!isReservedProp(_key11) && !(_key11 in newProps)) {
              hostPatchProp(el, _key11, oldProps[_key11], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
    };

    var processFragment = function processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      var fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText('');
      var fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText('');
      var patchFlag = n2.patchFlag,
          dynamicChildren = n2.dynamicChildren,
          fragmentSlotScopeIds = n2.slotScopeIds;

      if (patchFlag > 0) {
        optimized = true;
      } // check if this is a slot fragment with :slotted scope ids


      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }

      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor); // a fragment can only have array children
        // since they are either generated by the compiler, or implicitly created
        // from arrays.

        mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        if (patchFlag > 0 && patchFlag & 64
        /* STABLE_FRAGMENT */
        && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          // a stable fragment (template root or <template v-for>) doesn't need to
          // patch children order, but it may contain dynamicChildren.
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);

          if ( // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree) {
            traverseStaticChildren(n1, n2, true
            /* shallow */
            );
          }
        } else {
          // keyed / unkeyed, or manual fragments.
          // for keyed & unkeyed, since they are compiler generated from v-for,
          // each child is guaranteed to be a block so the fragment will never
          // have dynamicChildren.
          patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    };

    var processComponent = function processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      n2.slotScopeIds = slotScopeIds;

      if (n1 == null) {
        if (n2.shapeFlag & 512
        /* COMPONENT_KEPT_ALIVE */
        ) {
            parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
          } else {
          mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };

    var mountComponent = function mountComponent(initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) {
      var instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);

      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      } // resolve props and slots for setup context


      setupComponent(instance); // before proceeding

      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect); // Give it a placeholder if this is not hydration
        // TODO handle self-defined fallback

        if (!initialVNode.el) {
          var placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }

        return;
      }

      setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
    };

    var updateComponent = function updateComponent(n1, n2, optimized) {
      var instance = n2.component = n1.component;

      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          // normal update
          instance.next = n2; // in case the child component is also queued, remove it to avoid
          // double updating the same child component in the same flush.

          invalidateJob(instance.update); // instance.update is the reactive effect runner.

          instance.update();
        }
      } else {
        // no update needed. just copy over properties
        n2.component = n1.component;
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };

    var setupRenderEffect = function setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) {
      // create reactive effect for rendering
      instance.update = effect(function componentEffect() {
        if (!instance.isMounted) {
          var vnodeHook;
          var _initialVNode = initialVNode,
              el = _initialVNode.el,
              props = _initialVNode.props;
          var bm = instance.bm,
              m = instance.m,
              parent = instance.parent; // beforeMount hook

          if (bm) {
            invokeArrayFns(bm);
          } // onVnodeBeforeMount


          if (vnodeHook = props && props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          } // render


          var subTree = instance.subTree = renderComponentRoot(instance);

          if (el && hydrateNode) {
            hydrateNode(initialVNode.el, subTree, instance, parentSuspense, null);
          } else {
            patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
            initialVNode.el = subTree.el;
          } // mounted hook


          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          } // onVnodeMounted


          if (vnodeHook = props && props.onVnodeMounted) {
            var scopedInitialVNode = initialVNode;
            queuePostRenderEffect(function () {
              invokeVNodeHook(vnodeHook, parent, scopedInitialVNode);
            }, parentSuspense);
          } // activated hook for keep-alive roots.
          // #1742 activated hook must be accessed after first render
          // since the hook may be injected by a child keep-alive


          var _a = instance.a;

          if (_a && initialVNode.shapeFlag & 256
          /* COMPONENT_SHOULD_KEEP_ALIVE */
          ) {
              queuePostRenderEffect(_a, parentSuspense);
            }

          instance.isMounted = true;

          if (__VUE_PROD_DEVTOOLS__) {
            devtoolsComponentAdded(instance);
          } // #2458: deference mount-only object parameters to prevent memleaks


          initialVNode = container = anchor = null;
        } else {
          // updateComponent
          // This is triggered by mutation of component's own state (next: null)
          // OR parent calling processComponent (next: VNode)
          var next = instance.next,
              bu = instance.bu,
              _u = instance.u,
              _parent = instance.parent,
              vnode = instance.vnode;
          var originNext = next;

          var _vnodeHook;

          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          } // beforeUpdate hook


          if (bu) {
            invokeArrayFns(bu);
          } // onVnodeBeforeUpdate


          if (_vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(_vnodeHook, _parent, next, vnode);
          } // render


          var nextTree = renderComponentRoot(instance);
          var prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(prevTree, nextTree, // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el), // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree), instance, parentSuspense, isSVG);
          next.el = nextTree.el;

          if (originNext === null) {
            // self-triggered update. In case of HOC, update parent component
            // vnode el. HOC is indicated by parent instance's subTree pointing
            // to child component's vnode
            updateHOCHostEl(instance, nextTree.el);
          } // updated hook


          if (_u) {
            queuePostRenderEffect(_u, parentSuspense);
          } // onVnodeUpdated


          if (_vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(function () {
              invokeVNodeHook(_vnodeHook, _parent, next, vnode);
            }, parentSuspense);
          }

          if (__VUE_PROD_DEVTOOLS__) {
            devtoolsComponentUpdated(instance);
          }
        }
      }, prodEffectOptions);
    };

    var updateComponentPreRender = function updateComponentPreRender(instance, nextVNode, optimized) {
      nextVNode.component = instance;
      var prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking(); // props update may have triggered pre-flush watchers.
      // flush them before the render update.

      flushPreFlushCbs(undefined, instance.update);
      resetTracking();
    };

    var patchChildren = function patchChildren(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      if (optimized === void 0) {
        optimized = false;
      }

      var c1 = n1 && n1.children;
      var prevShapeFlag = n1 ? n1.shapeFlag : 0;
      var c2 = n2.children;
      var patchFlag = n2.patchFlag,
          shapeFlag = n2.shapeFlag; // fast path

      if (patchFlag > 0) {
        if (patchFlag & 128
        /* KEYED_FRAGMENT */
        ) {
            // this could be either fully-keyed or mixed (some keyed some not)
            // presence of patchFlag means children are guaranteed to be arrays
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            return;
          } else if (patchFlag & 256
        /* UNKEYED_FRAGMENT */
        ) {
            // unkeyed
            patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            return;
          }
      } // children has 3 possibilities: text, array or no children.


      if (shapeFlag & 8
      /* TEXT_CHILDREN */
      ) {
          // text children fast path
          if (prevShapeFlag & 16
          /* ARRAY_CHILDREN */
          ) {
              unmountChildren(c1, parentComponent, parentSuspense);
            }

          if (c2 !== c1) {
            hostSetElementText(container, c2);
          }
        } else {
        if (prevShapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
            // prev children was array
            if (shapeFlag & 16
            /* ARRAY_CHILDREN */
            ) {
                // two arrays, cannot assume anything, do full diff
                patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
              } else {
              // no new children, just unmount old
              unmountChildren(c1, parentComponent, parentSuspense, true);
            }
          } else {
          // prev children was text OR null
          // new children is array OR null
          if (prevShapeFlag & 8
          /* TEXT_CHILDREN */
          ) {
              hostSetElementText(container, '');
            } // mount new if array


          if (shapeFlag & 16
          /* ARRAY_CHILDREN */
          ) {
              mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            }
        }
      }
    };

    var patchUnkeyedChildren = function patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      var oldLength = c1.length;
      var newLength = c2.length;
      var commonLength = Math.min(oldLength, newLength);
      var i;

      for (i = 0; i < commonLength; i++) {
        var nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }

      if (oldLength > newLength) {
        // remove old
        unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
      } else {
        // mount new
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
      }
    }; // can be all-keyed or mixed


    var patchKeyedChildren = function patchKeyedChildren(c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      var i = 0;
      var l2 = c2.length;
      var e1 = c1.length - 1; // prev ending index

      var e2 = l2 - 1; // next ending index
      // 1. sync from start
      // (a b) c
      // (a b) d e

      while (i <= e1 && i <= e2) {
        var n1 = c1[i];
        var n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }

        i++;
      } // 2. sync from end
      // a (b c)
      // d e (b c)


      while (i <= e1 && i <= e2) {
        var _n = c1[e1];

        var _n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);

        if (isSameVNodeType(_n, _n2)) {
          patch(_n, _n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }

        e1--;
        e2--;
      } // 3. common sequence + mount
      // (a b)
      // (a b) c
      // i = 2, e1 = 1, e2 = 2
      // (a b)
      // c (a b)
      // i = 0, e1 = -1, e2 = 0


      if (i > e1) {
        if (i <= e2) {
          var nextPos = e2 + 1;
          var anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;

          while (i <= e2) {
            patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            i++;
          }
        }
      } // 4. common sequence + unmount
      // (a b) c
      // (a b)
      // i = 2, e1 = 2, e2 = 1
      // a (b c)
      // (b c)
      // i = 0, e1 = 0, e2 = -1
      else if (i > e2) {
          while (i <= e1) {
            unmount(c1[i], parentComponent, parentSuspense, true);
            i++;
          }
        } // 5. unknown sequence
        // [i ... e1 + 1]: a b [c d e] f g
        // [i ... e2 + 1]: a b [e d c h] f g
        // i = 2, e1 = 4, e2 = 5
        else {
            var s1 = i; // prev starting index

            var s2 = i; // next starting index
            // 5.1 build key:index map for newChildren

            var keyToNewIndexMap = new Map();

            for (i = s2; i <= e2; i++) {
              var nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

              if (nextChild.key != null) {
                keyToNewIndexMap.set(nextChild.key, i);
              }
            } // 5.2 loop through old children left to be patched and try to patch
            // matching nodes & remove nodes that are no longer present


            var j;
            var patched = 0;
            var toBePatched = e2 - s2 + 1;
            var moved = false; // used to track whether any node has moved

            var maxNewIndexSoFar = 0; // works as Map<newIndex, oldIndex>
            // Note that oldIndex is offset by +1
            // and oldIndex = 0 is a special value indicating the new node has
            // no corresponding old node.
            // used for determining longest stable subsequence

            var newIndexToOldIndexMap = new Array(toBePatched);

            for (i = 0; i < toBePatched; i++) {
              newIndexToOldIndexMap[i] = 0;
            }

            for (i = s1; i <= e1; i++) {
              var prevChild = c1[i];

              if (patched >= toBePatched) {
                // all new children have been patched so this can only be a removal
                unmount(prevChild, parentComponent, parentSuspense, true);
                continue;
              }

              var newIndex = void 0;

              if (prevChild.key != null) {
                newIndex = keyToNewIndexMap.get(prevChild.key);
              } else {
                // key-less node, try to locate a key-less node of the same type
                for (j = s2; j <= e2; j++) {
                  if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                    newIndex = j;
                    break;
                  }
                }
              }

              if (newIndex === undefined) {
                unmount(prevChild, parentComponent, parentSuspense, true);
              } else {
                newIndexToOldIndexMap[newIndex - s2] = i + 1;

                if (newIndex >= maxNewIndexSoFar) {
                  maxNewIndexSoFar = newIndex;
                } else {
                  moved = true;
                }

                patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
                patched++;
              }
            } // 5.3 move and mount
            // generate longest stable subsequence only when nodes have moved


            var increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
            j = increasingNewIndexSequence.length - 1; // looping backwards so that we can use last patched node as anchor

            for (i = toBePatched - 1; i >= 0; i--) {
              var nextIndex = s2 + i;
              var _nextChild = c2[nextIndex];

              var _anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;

              if (newIndexToOldIndexMap[i] === 0) {
                // mount new
                patch(null, _nextChild, container, _anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
              } else if (moved) {
                // move if:
                // There is no stable subsequence (e.g. a reverse)
                // OR current node is not among the stable sequence
                if (j < 0 || i !== increasingNewIndexSequence[j]) {
                  move(_nextChild, container, _anchor, 2
                  /* REORDER */
                  );
                } else {
                  j--;
                }
              }
            }
          }
    };

    var move = function move(vnode, container, anchor, moveType, parentSuspense) {
      if (parentSuspense === void 0) {
        parentSuspense = null;
      }

      var el = vnode.el,
          type = vnode.type,
          transition = vnode.transition,
          children = vnode.children,
          shapeFlag = vnode.shapeFlag;

      if (shapeFlag & 6
      /* COMPONENT */
      ) {
          move(vnode.component.subTree, container, anchor, moveType);
          return;
        }

      if (shapeFlag & 128
      /* SUSPENSE */
      ) {
          vnode.suspense.move(container, anchor, moveType);
          return;
        }

      if (shapeFlag & 64
      /* TELEPORT */
      ) {
          type.move(vnode, container, anchor, internals);
          return;
        }

      if (type === Fragment) {
        hostInsert(el, container, anchor);

        for (var _i24 = 0; _i24 < children.length; _i24++) {
          move(children[_i24], container, anchor, moveType);
        }

        hostInsert(vnode.anchor, container, anchor);
        return;
      }

      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      } // single nodes


      var needTransition = moveType !== 2
      /* REORDER */
      && shapeFlag & 1
      /* ELEMENT */
      && transition;

      if (needTransition) {
        if (moveType === 0
        /* ENTER */
        ) {
            transition.beforeEnter(el);
            hostInsert(el, container, anchor);
            queuePostRenderEffect(function () {
              return transition.enter(el);
            }, parentSuspense);
          } else {
          var leave = transition.leave,
              delayLeave = transition.delayLeave,
              afterLeave = transition.afterLeave;

          var _remove = function _remove() {
            return hostInsert(el, container, anchor);
          };

          var performLeave = function performLeave() {
            leave(el, function () {
              _remove();

              afterLeave && afterLeave();
            });
          };

          if (delayLeave) {
            delayLeave(el, _remove, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };

    var unmount = function unmount(vnode, parentComponent, parentSuspense, doRemove, optimized) {
      if (doRemove === void 0) {
        doRemove = false;
      }

      if (optimized === void 0) {
        optimized = false;
      }

      var type = vnode.type,
          props = vnode.props,
          ref = vnode.ref,
          children = vnode.children,
          dynamicChildren = vnode.dynamicChildren,
          shapeFlag = vnode.shapeFlag,
          patchFlag = vnode.patchFlag,
          dirs = vnode.dirs; // unset ref

      if (ref != null) {
        setRef(ref, null, parentSuspense, null);
      }

      if (shapeFlag & 256
      /* COMPONENT_SHOULD_KEEP_ALIVE */
      ) {
          parentComponent.ctx.deactivate(vnode);
          return;
        }

      var shouldInvokeDirs = shapeFlag & 1
      /* ELEMENT */
      && dirs;
      var vnodeHook;

      if (vnodeHook = props && props.onVnodeBeforeUnmount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }

      if (shapeFlag & 6
      /* COMPONENT */
      ) {
          unmountComponent(vnode.component, parentSuspense, doRemove);
        } else {
        if (shapeFlag & 128
        /* SUSPENSE */
        ) {
            vnode.suspense.unmount(parentSuspense, doRemove);
            return;
          }

        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
        }

        if (shapeFlag & 64
        /* TELEPORT */
        ) {
            vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
          } else if (dynamicChildren && ( // #1153: fast path should not be taken for non-stable (v-for) fragments
        type !== Fragment || patchFlag > 0 && patchFlag & 64
        /* STABLE_FRAGMENT */
        )) {
          // fast path for block nodes: only need to unmount dynamic children.
          unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
        } else if (type === Fragment && (patchFlag & 128
        /* KEYED_FRAGMENT */
        || patchFlag & 256
        /* UNKEYED_FRAGMENT */
        ) || !optimized && shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
            unmountChildren(children, parentComponent, parentSuspense);
          }

        if (doRemove) {
          remove(vnode);
        }
      }

      if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(function () {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
        }, parentSuspense);
      }
    };

    var remove = function remove(vnode) {
      var type = vnode.type,
          el = vnode.el,
          anchor = vnode.anchor,
          transition = vnode.transition;

      if (type === Fragment) {
        removeFragment(el, anchor);
        return;
      }

      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }

      var performRemove = function performRemove() {
        hostRemove(el);

        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };

      if (vnode.shapeFlag & 1
      /* ELEMENT */
      && transition && !transition.persisted) {
        var leave = transition.leave,
            delayLeave = transition.delayLeave;

        var performLeave = function performLeave() {
          return leave(el, performRemove);
        };

        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };

    var removeFragment = function removeFragment(cur, end) {
      // For fragments, directly remove all contained DOM nodes.
      // (fragment child nodes cannot have transition)
      var next;

      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }

      hostRemove(end);
    };

    var unmountComponent = function unmountComponent(instance, parentSuspense, doRemove) {
      var bum = instance.bum,
          effects = instance.effects,
          update = instance.update,
          subTree = instance.subTree,
          um = instance.um; // beforeUnmount hook

      if (bum) {
        invokeArrayFns(bum);
      }

      if (effects) {
        for (var _i25 = 0; _i25 < effects.length; _i25++) {
          stop(effects[_i25]);
        }
      } // update may be null if a component is unmounted before its async
      // setup has resolved.


      if (update) {
        stop(update);
        unmount(subTree, instance, parentSuspense, doRemove);
      } // unmounted hook


      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }

      queuePostRenderEffect(function () {
        instance.isUnmounted = true;
      }, parentSuspense); // A component with async dep inside a pending suspense is unmounted before
      // its async dep resolves. This should remove the dep from the suspense, and
      // cause the suspense to resolve immediately if that was the last dep.

      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;

        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }

      if (__VUE_PROD_DEVTOOLS__) {
        devtoolsComponentRemoved(instance);
      }
    };

    var unmountChildren = function unmountChildren(children, parentComponent, parentSuspense, doRemove, optimized, start) {
      if (doRemove === void 0) {
        doRemove = false;
      }

      if (optimized === void 0) {
        optimized = false;
      }

      if (start === void 0) {
        start = 0;
      }

      for (var _i26 = start; _i26 < children.length; _i26++) {
        unmount(children[_i26], parentComponent, parentSuspense, doRemove, optimized);
      }
    };

    var getNextHostNode = function getNextHostNode(vnode) {
      if (vnode.shapeFlag & 6
      /* COMPONENT */
      ) {
          return getNextHostNode(vnode.component.subTree);
        }

      if (vnode.shapeFlag & 128
      /* SUSPENSE */
      ) {
          return vnode.suspense.next();
        }

      return hostNextSibling(vnode.anchor || vnode.el);
    };

    var render = function render(vnode, container, isSVG) {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container, null, null, null, isSVG);
      }

      flushPostFlushCbs();
      container._vnode = vnode;
    };

    var internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    var hydrate;
    var hydrateNode;

    if (createHydrationFns) {
      var _createHydrationFns = createHydrationFns(internals);

      hydrate = _createHydrationFns[0];
      hydrateNode = _createHydrationFns[1];
    }

    return {
      render: render,
      hydrate: hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }

  function invokeVNodeHook(hook, instance, vnode, prevVNode) {
    if (prevVNode === void 0) {
      prevVNode = null;
    }

    callWithAsyncErrorHandling(hook, instance, 7
    /* VNODE_HOOK */
    , [vnode, prevVNode]);
  }
  /**
   * #1156
   * When a component is HMR-enabled, we need to make sure that all static nodes
   * inside a block also inherit the DOM element from the previous tree so that
   * HMR updates (which are full updates) can retrieve the element for patching.
   *
   * #2080
   * Inside keyed `template` fragment static children, if a fragment is moved,
   * the children will always moved so that need inherit el form previous nodes
   * to ensure correct moved position.
   */


  function traverseStaticChildren(n1, n2, shallow) {
    if (shallow === void 0) {
      shallow = false;
    }

    var ch1 = n1.children;
    var ch2 = n2.children;

    if (isArray(ch1) && isArray(ch2)) {
      for (var _i27 = 0; _i27 < ch1.length; _i27++) {
        // this is only called in the optimized path so array children are
        // guaranteed to be vnodes
        var c1 = ch1[_i27];
        var c2 = ch2[_i27];

        if (c2.shapeFlag & 1
        /* ELEMENT */
        && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32
          /* HYDRATE_EVENTS */
          ) {
              c2 = ch2[_i27] = cloneIfMounted(ch2[_i27]);
              c2.el = c1.el;
            }

          if (!shallow) traverseStaticChildren(c1, c2);
        } // also inherit for comment nodes, but not placeholders (e.g. v-if which

      }
    }
  } // https://en.wikipedia.org/wiki/Longest_increasing_subsequence


  function getSequence(arr) {
    var p = arr.slice();
    var result = [0];
    var i, j, u, v, c;
    var len = arr.length;

    for (i = 0; i < len; i++) {
      var arrI = arr[i];

      if (arrI !== 0) {
        j = result[result.length - 1];

        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }

        u = 0;
        v = result.length - 1;

        while (u < v) {
          c = (u + v) / 2 | 0;

          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }

        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }

          result[u] = i;
        }
      }
    }

    u = result.length;
    v = result[u - 1];

    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }

    return result;
  }

  var isTeleport = function isTeleport(type) {
    return type.__isTeleport;
  };

  var COMPONENTS = 'components';
  /**
   * @private
   */

  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }

  var NULL_DYNAMIC_COMPONENT = Symbol();

  function resolveAsset(type, name, warnMissing, maybeSelfReference) {

    if (maybeSelfReference === void 0) {
      maybeSelfReference = false;
    }

    var instance = currentRenderingInstance || currentInstance;

    if (instance) {
      var Component = instance.type; // explicit self name has highest priority

      if (type === COMPONENTS) {
        var selfName = getComponentName(Component);

        if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
          return Component;
        }
      }

      var res = // local registration
      // check instance[type] first for components with mixin or extends.
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name);

      if (!res && maybeSelfReference) {
        // fallback to implicit self-reference
        return Component;
      }

      return res;
    }
  }

  function resolve(registry, name) {
    return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
  }

  var Fragment = Symbol(undefined);
  var Text = Symbol(undefined);
  var Comment = Symbol(undefined);
  var Static = Symbol(undefined); // Since v-if and v-for are the two possible ways node structure can dynamically
  // change, once we consider v-if branches and each v-for fragment a block, we
  // can divide a template into nested blocks, and within each block the node
  // structure would be stable. This allows us to skip most children diffing
  // and only worry about the dynamic nodes (indicated by patch flags).

  var blockStack = [];
  var currentBlock = null;
  /**
   * Open a block.
   * This must be called before `createBlock`. It cannot be part of `createBlock`
   * because the children of the block are evaluated before `createBlock` itself
   * is called. The generated code typically looks like this:
   *
   * ```js
   * function render() {
   *   return (openBlock(),createBlock('div', null, [...]))
   * }
   * ```
   * disableTracking is true when creating a v-for fragment block, since a v-for
   * fragment always diffs its children.
   *
   * @private
   */

  function openBlock(disableTracking) {
    if (disableTracking === void 0) {
      disableTracking = false;
    }

    blockStack.push(currentBlock = disableTracking ? null : []);
  }

  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  } // Whether we should be tracking dynamic child nodes inside a block.

  /**
   * Create a block root vnode. Takes the same exact arguments as `createVNode`.
   * A block root keeps track of dynamic nodes within the block in the
   * `dynamicChildren` array.
   *
   * @private
   */


  function createBlock(type, props, children, patchFlag, dynamicProps) {
    var vnode = createVNode(type, props, children, patchFlag, dynamicProps, true
    /* isBlock: prevent a block from tracking itself */
    ); // save current block children on the block vnode

    vnode.dynamicChildren = currentBlock || EMPTY_ARR; // close block

    closeBlock(); // a block is always going to be patched, so track it as a child of its
    // parent block

    if (currentBlock) {
      currentBlock.push(vnode);
    }

    return vnode;
  }

  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }

  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }

  var InternalObjectKey = "__vInternal";

  var normalizeKey = function normalizeKey(_ref13) {
    var key = _ref13.key;
    return key != null ? key : null;
  };

  var normalizeRef = function normalizeRef(_ref14) {
    var ref = _ref14.ref;
    return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? {
      i: currentRenderingInstance,
      r: ref
    } : ref : null;
  };

  var createVNode = _createVNode;

  function _createVNode(type, props, children, patchFlag, dynamicProps, isBlockNode) {
    var _vnode;

    if (props === void 0) {
      props = null;
    }

    if (children === void 0) {
      children = null;
    }

    if (patchFlag === void 0) {
      patchFlag = 0;
    }

    if (dynamicProps === void 0) {
      dynamicProps = null;
    }

    if (isBlockNode === void 0) {
      isBlockNode = false;
    }

    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }

    if (isVNode(type)) {
      // createVNode receiving an existing vnode. This happens in cases like
      // <component :is="vnode"/>
      // #2078 make sure to merge refs during the clone instead of overwriting it
      var cloned = cloneVNode(type, props, true
      /* mergeRef: true */
      );

      if (children) {
        normalizeChildren(cloned, children);
      }

      return cloned;
    } // class component normalization.


    if (isClassComponent(type)) {
      type = type.__vccOpts;
    } // class & style normalization.


    if (props) {
      // for reactive or proxy objects, we need to clone it to enable mutation.
      if (isProxy(props) || InternalObjectKey in props) {
        props = extend({}, props);
      }

      var _props = props,
          klass = _props.class,
          style = _props.style;

      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }

      if (isObject$1(style)) {
        // reactive state objects need to be cloned since they are likely to be
        // mutated
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }

        props.style = normalizeStyle(style);
      }
    } // encode the vnode type information into a bitmap


    var shapeFlag = isString(type) ? 1
    /* ELEMENT */
    : isSuspense(type) ? 128
    /* SUSPENSE */
    : isTeleport(type) ? 64
    /* TELEPORT */
    : isObject$1(type) ? 4
    /* STATEFUL_COMPONENT */
    : isFunction(type) ? 2
    /* FUNCTIONAL_COMPONENT */
    : 0;
    var vnode = (_vnode = {
      __v_isVNode: true
    }, _vnode["__v_skip"
    /* SKIP */
    ] = true, _vnode.type = type, _vnode.props = props, _vnode.key = props && normalizeKey(props), _vnode.ref = props && normalizeRef(props), _vnode.scopeId = currentScopeId, _vnode.slotScopeIds = null, _vnode.children = null, _vnode.component = null, _vnode.suspense = null, _vnode.ssContent = null, _vnode.ssFallback = null, _vnode.dirs = null, _vnode.transition = null, _vnode.el = null, _vnode.anchor = null, _vnode.target = null, _vnode.targetAnchor = null, _vnode.staticCount = 0, _vnode.shapeFlag = shapeFlag, _vnode.patchFlag = patchFlag, _vnode.dynamicProps = dynamicProps, _vnode.dynamicChildren = null, _vnode.appContext = null, _vnode); // validate key

    normalizeChildren(vnode, children); // normalize suspense children

    if (shapeFlag & 128
    /* SUSPENSE */
    ) {
        var _normalizeSuspenseChi = normalizeSuspenseChildren(vnode),
            content = _normalizeSuspenseChi.content,
            fallback = _normalizeSuspenseChi.fallback;

        vnode.ssContent = content;
        vnode.ssFallback = fallback;
      }

    if ( // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && ( // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    patchFlag > 0 || shapeFlag & 6
    /* COMPONENT */
    ) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    patchFlag !== 32
    /* HYDRATE_EVENTS */
    ) {
        currentBlock.push(vnode);
      }

    return vnode;
  }

  function cloneVNode(vnode, extraProps, mergeRef) {
    var _ref15;

    if (mergeRef === void 0) {
      mergeRef = false;
    }

    // This is intentionally NOT using spread or extend to avoid the runtime
    // key enumeration cost.
    var props = vnode.props,
        ref = vnode.ref,
        patchFlag = vnode.patchFlag,
        children = vnode.children;
    var mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    return _ref15 = {
      __v_isVNode: true
    }, _ref15["__v_skip"
    /* SKIP */
    ] = true, _ref15.type = vnode.type, _ref15.props = mergedProps, _ref15.key = mergedProps && normalizeKey(mergedProps), _ref15.ref = extraProps && extraProps.ref ? // #2078 in the case of <component :is="vnode" ref="extra"/>
    // if the vnode itself already has a ref, cloneVNode will need to merge
    // the refs so the single vnode can be set on multiple refs
    mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref, _ref15.scopeId = vnode.scopeId, _ref15.slotScopeIds = vnode.slotScopeIds, _ref15.children = children, _ref15.target = vnode.target, _ref15.targetAnchor = vnode.targetAnchor, _ref15.staticCount = vnode.staticCount, _ref15.shapeFlag = vnode.shapeFlag, _ref15.patchFlag = extraProps && vnode.type !== Fragment ? patchFlag === -1 // hoisted node
    ? 16
    /* FULL_PROPS */
    : patchFlag | 16
    /* FULL_PROPS */
    : patchFlag, _ref15.dynamicProps = vnode.dynamicProps, _ref15.dynamicChildren = vnode.dynamicChildren, _ref15.appContext = vnode.appContext, _ref15.dirs = vnode.dirs, _ref15.transition = vnode.transition, _ref15.component = vnode.component, _ref15.suspense = vnode.suspense, _ref15.ssContent = vnode.ssContent && cloneVNode(vnode.ssContent), _ref15.ssFallback = vnode.ssFallback && cloneVNode(vnode.ssFallback), _ref15.el = vnode.el, _ref15.anchor = vnode.anchor, _ref15;
  }
  /**
   * @private
   */


  function createTextVNode(text, flag) {
    if (text === void 0) {
      text = ' ';
    }

    if (flag === void 0) {
      flag = 0;
    }

    return createVNode(Text, null, text, flag);
  }
  /**
   * @private
   */


  function createCommentVNode(text, // when used as the v-else branch, the comment node must be created as a
  // block to ensure correct updates.
  asBlock) {
    if (text === void 0) {
      text = '';
    }

    if (asBlock === void 0) {
      asBlock = false;
    }

    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }

  function normalizeVNode(child) {
    if (child == null || typeof child === 'boolean') {
      // empty placeholder
      return createVNode(Comment);
    } else if (isArray(child)) {
      // fragment
      return createVNode(Fragment, null, child);
    } else if (typeof child === 'object') {
      // already vnode, this should be the most common since compiled templates
      // always produce all-vnode children arrays
      return child.el === null ? child : cloneVNode(child);
    } else {
      // strings and numbers
      return createVNode(Text, null, String(child));
    }
  } // optimized normalization for template-compiled render fns


  function cloneIfMounted(child) {
    return child.el === null ? child : cloneVNode(child);
  }

  function normalizeChildren(vnode, children) {
    var type = 0;
    var shapeFlag = vnode.shapeFlag;

    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16
      /* ARRAY_CHILDREN */
      ;
    } else if (typeof children === 'object') {
      if (shapeFlag & 1
      /* ELEMENT */
      || shapeFlag & 64
      /* TELEPORT */
      ) {
          // Normalize slot to plain children for plain element and Teleport
          var slot = children.default;

          if (slot) {
            // _c marker is added by withCtx() indicating this is a compiled slot
            slot._c && setCompiledSlotRendering(1);
            normalizeChildren(vnode, slot());
            slot._c && setCompiledSlotRendering(-1);
          }

          return;
        } else {
        type = 32
        /* SLOTS_CHILDREN */
        ;
        var slotFlag = children._;

        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3
        /* FORWARDED */
        && currentRenderingInstance) {
          // a child component receives forwarded slots from the parent.
          // its slot type is determined by its parent's slot type.
          if (currentRenderingInstance.vnode.patchFlag & 1024
          /* DYNAMIC_SLOTS */
          ) {
              children._ = 2
              /* DYNAMIC */
              ;
              vnode.patchFlag |= 1024
              /* DYNAMIC_SLOTS */
              ;
            } else {
            children._ = 1
            /* STABLE */
            ;
          }
        }
      }
    } else if (isFunction(children)) {
      children = {
        default: children,
        _ctx: currentRenderingInstance
      };
      type = 32
      /* SLOTS_CHILDREN */
      ;
    } else {
      children = String(children); // force teleport children to array so it can be moved around

      if (shapeFlag & 64
      /* TELEPORT */
      ) {
          type = 16
          /* ARRAY_CHILDREN */
          ;
          children = [createTextVNode(children)];
        } else {
        type = 8
        /* TEXT_CHILDREN */
        ;
      }
    }

    vnode.children = children;
    vnode.shapeFlag |= type;
  }

  function mergeProps() {
    var ret = extend({}, arguments.length <= 0 ? undefined : arguments[0]);

    for (var _i28 = 1; _i28 < arguments.length; _i28++) {
      var toMerge = _i28 < 0 || arguments.length <= _i28 ? undefined : arguments[_i28];

      for (var key in toMerge) {
        if (key === 'class') {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === 'style') {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          var existing = ret[key];
          var incoming = toMerge[key];

          if (existing !== incoming) {
            ret[key] = existing ? [].concat(existing, toMerge[key]) : incoming;
          }
        } else if (key !== '') {
          ret[key] = toMerge[key];
        }
      }
    }

    return ret;
  }

  function provide(key, value) {
    if (!currentInstance) ;else {
      var provides = currentInstance.provides; // by default an instance inherits its parent's provides object
      // but when it needs to provide values of its own, it creates its
      // own provides object using parent provides object as prototype.
      // this way in `inject` we can simply look up injections from direct
      // parent and let the prototype chain do the work.

      var parentProvides = currentInstance.parent && currentInstance.parent.provides;

      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      } // TS doesn't allow symbol as index type


      provides[key] = value;
    }
  }

  function inject(key, defaultValue, treatDefaultAsFactory) {
    if (treatDefaultAsFactory === void 0) {
      treatDefaultAsFactory = false;
    }

    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    var instance = currentInstance || currentRenderingInstance;

    if (instance) {
      // #2400
      // to support `app.use` plugins,
      // fallback to appContext's `provides` if the intance is at root
      var provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;

      if (provides && key in provides) {
        // TS doesn't allow symbol as index type
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue() : defaultValue;
      } else ;
    }
  }

  var shouldCacheAccess = true;

  function applyOptions(instance, options, deferredData, deferredWatch, deferredProvide, asMixin) {
    if (deferredData === void 0) {
      deferredData = [];
    }

    if (deferredWatch === void 0) {
      deferredWatch = [];
    }

    if (deferredProvide === void 0) {
      deferredProvide = [];
    }

    if (asMixin === void 0) {
      asMixin = false;
    }

    var mixins = options.mixins,
        extendsOptions = options.extends,
        dataOptions = options.data,
        computedOptions = options.computed,
        methods = options.methods,
        watchOptions = options.watch,
        provideOptions = options.provide,
        injectOptions = options.inject,
        components = options.components,
        directives = options.directives,
        beforeMount = options.beforeMount,
        mounted = options.mounted,
        beforeUpdate = options.beforeUpdate,
        updated = options.updated,
        activated = options.activated,
        deactivated = options.deactivated;
        options.beforeDestroy;
        var beforeUnmount = options.beforeUnmount;
        options.destroyed;
        var unmounted = options.unmounted,
        render = options.render,
        renderTracked = options.renderTracked,
        renderTriggered = options.renderTriggered,
        errorCaptured = options.errorCaptured,
        expose = options.expose;
    var publicThis = instance.proxy;
    var ctx = instance.ctx;
    var globalMixins = instance.appContext.mixins;

    if (asMixin && render && instance.render === NOOP) {
      instance.render = render;
    } // applyOptions is called non-as-mixin once per instance


    if (!asMixin) {
      shouldCacheAccess = false;
      callSyncHook('beforeCreate', "bc"
      /* BEFORE_CREATE */
      , options, instance, globalMixins);
      shouldCacheAccess = true; // global mixins are applied first

      applyMixins(instance, globalMixins, deferredData, deferredWatch, deferredProvide);
    } // extending a base component...


    if (extendsOptions) {
      applyOptions(instance, extendsOptions, deferredData, deferredWatch, deferredProvide, true);
    } // local mixins


    if (mixins) {
      applyMixins(instance, mixins, deferredData, deferredWatch, deferredProvide);
    } // - props (already done outside of this function)
    // - inject
    // - methods
    // - data (deferred since it relies on `this` access)
    // - computed
    // - watch (deferred since it relies on `this` access)


    if (injectOptions) {
      if (isArray(injectOptions)) {
        for (var _i29 = 0; _i29 < injectOptions.length; _i29++) {
          var key = injectOptions[_i29];
          ctx[key] = inject(key);
        }
      } else {
        for (var _key12 in injectOptions) {
          var opt = injectOptions[_key12];

          if (isObject$1(opt)) {
            ctx[_key12] = inject(opt.from || _key12, opt.default, true
            /* treat default function as factory */
            );
          } else {
            ctx[_key12] = inject(opt);
          }
        }
      }
    }

    if (methods) {
      for (var _key13 in methods) {
        var methodHandler = methods[_key13];

        if (isFunction(methodHandler)) {
          // In dev mode, we use the `createRenderContext` function to define methods to the proxy target,
          // and those are read-only but reconfigurable, so it needs to be redefined here
          {
            ctx[_key13] = methodHandler.bind(publicThis);
          }
        }
      }
    }

    if (!asMixin) {
      if (deferredData.length) {
        deferredData.forEach(function (dataFn) {
          return resolveData(instance, dataFn, publicThis);
        });
      }

      if (dataOptions) {
        // @ts-ignore dataOptions is not fully type safe
        resolveData(instance, dataOptions, publicThis);
      }
    } else if (dataOptions) {
      deferredData.push(dataOptions);
    }

    if (computedOptions) {
      var _loop = function _loop(_key14) {
        var opt = computedOptions[_key14];
        var get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        var set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        var c = computed({
          get: get,
          set: set
        });
        Object.defineProperty(ctx, _key14, {
          enumerable: true,
          configurable: true,
          get: function get() {
            return c.value;
          },
          set: function set(v) {
            return c.value = v;
          }
        });
      };

      for (var _key14 in computedOptions) {
        _loop(_key14);
      }
    }

    if (watchOptions) {
      deferredWatch.push(watchOptions);
    }

    if (!asMixin && deferredWatch.length) {
      deferredWatch.forEach(function (watchOptions) {
        for (var _key15 in watchOptions) {
          createWatcher(watchOptions[_key15], ctx, publicThis, _key15);
        }
      });
    }

    if (provideOptions) {
      deferredProvide.push(provideOptions);
    }

    if (!asMixin && deferredProvide.length) {
      deferredProvide.forEach(function (provideOptions) {
        var provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
        Reflect.ownKeys(provides).forEach(function (key) {
          provide(key, provides[key]);
        });
      });
    } // asset options.
    // To reduce memory usage, only components with mixins or extends will have
    // resolved asset registry attached to instance.


    if (asMixin) {
      if (components) {
        extend(instance.components || (instance.components = extend({}, instance.type.components)), components);
      }

      if (directives) {
        extend(instance.directives || (instance.directives = extend({}, instance.type.directives)), directives);
      }
    } // lifecycle options


    if (!asMixin) {
      callSyncHook('created', "c"
      /* CREATED */
      , options, instance, globalMixins);
    }

    if (beforeMount) {
      onBeforeMount(beforeMount.bind(publicThis));
    }

    if (mounted) {
      onMounted(mounted.bind(publicThis));
    }

    if (beforeUpdate) {
      onBeforeUpdate(beforeUpdate.bind(publicThis));
    }

    if (updated) {
      onUpdated(updated.bind(publicThis));
    }

    if (activated) {
      onActivated(activated.bind(publicThis));
    }

    if (deactivated) {
      onDeactivated(deactivated.bind(publicThis));
    }

    if (errorCaptured) {
      onErrorCaptured(errorCaptured.bind(publicThis));
    }

    if (renderTracked) {
      onRenderTracked(renderTracked.bind(publicThis));
    }

    if (renderTriggered) {
      onRenderTriggered(renderTriggered.bind(publicThis));
    }

    if (beforeUnmount) {
      onBeforeUnmount(beforeUnmount.bind(publicThis));
    }

    if (unmounted) {
      onUnmounted(unmounted.bind(publicThis));
    }

    if (isArray(expose)) {
      if (!asMixin) {
        if (expose.length) {
          var exposed = instance.exposed || (instance.exposed = proxyRefs({}));
          expose.forEach(function (key) {
            exposed[key] = toRef(publicThis, key);
          });
        } else if (!instance.exposed) {
          instance.exposed = EMPTY_OBJ;
        }
      }
    }
  }

  function callSyncHook(name, type, options, instance, globalMixins) {
    for (var _i30 = 0; _i30 < globalMixins.length; _i30++) {
      callHookWithMixinAndExtends(name, type, globalMixins[_i30], instance);
    }

    callHookWithMixinAndExtends(name, type, options, instance);
  }

  function callHookWithMixinAndExtends(name, type, options, instance) {
    var base = options.extends,
        mixins = options.mixins;
    var selfHook = options[name];

    if (base) {
      callHookWithMixinAndExtends(name, type, base, instance);
    }

    if (mixins) {
      for (var _i31 = 0; _i31 < mixins.length; _i31++) {
        callHookWithMixinAndExtends(name, type, mixins[_i31], instance);
      }
    }

    if (selfHook) {
      callWithAsyncErrorHandling(selfHook.bind(instance.proxy), instance, type);
    }
  }

  function applyMixins(instance, mixins, deferredData, deferredWatch, deferredProvide) {
    for (var _i32 = 0; _i32 < mixins.length; _i32++) {
      applyOptions(instance, mixins[_i32], deferredData, deferredWatch, deferredProvide, true);
    }
  }

  function resolveData(instance, dataFn, publicThis) {
    shouldCacheAccess = false;
    var data = dataFn.call(publicThis, publicThis);
    shouldCacheAccess = true;
    if (!isObject$1(data)) ;else if (instance.data === EMPTY_OBJ) {
      instance.data = reactive(data);
    } else {
      // existing data: this is a mixin or extends.
      extend(instance.data, data);
    }
  }

  function createWatcher(raw, ctx, publicThis, key) {
    var getter = key.includes('.') ? createPathGetter(publicThis, key) : function () {
      return publicThis[key];
    };

    if (isString(raw)) {
      var handler = ctx[raw];

      if (isFunction(handler)) {
        watch(getter, handler);
      }
    } else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    } else if (isObject$1(raw)) {
      if (isArray(raw)) {
        raw.forEach(function (r) {
          return createWatcher(r, ctx, publicThis, key);
        });
      } else {
        var _handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];

        if (isFunction(_handler)) {
          watch(getter, _handler, raw);
        }
      }
    } else ;
  }

  function createPathGetter(ctx, path) {
    var segments = path.split('.');
    return function () {
      var cur = ctx;

      for (var _i33 = 0; _i33 < segments.length && cur; _i33++) {
        cur = cur[segments[_i33]];
      }

      return cur;
    };
  }

  function resolveMergedOptions(instance) {
    var raw = instance.type;
    var __merged = raw.__merged,
        mixins = raw.mixins,
        extendsOptions = raw.extends;
    if (__merged) return __merged;
    var globalMixins = instance.appContext.mixins;
    if (!globalMixins.length && !mixins && !extendsOptions) return raw;
    var options = {};
    globalMixins.forEach(function (m) {
      return mergeOptions(options, m, instance);
    });
    mergeOptions(options, raw, instance);
    return raw.__merged = options;
  }

  function mergeOptions(to, from, instance) {
    var strats = instance.appContext.config.optionMergeStrategies;
    var mixins = from.mixins,
        extendsOptions = from.extends;
    extendsOptions && mergeOptions(to, extendsOptions, instance);
    mixins && mixins.forEach(function (m) {
      return mergeOptions(to, m, instance);
    });

    for (var key in from) {
      if (strats && hasOwn(strats, key)) {
        to[key] = strats[key](to[key], from[key], instance.proxy, key);
      } else {
        to[key] = from[key];
      }
    }
  }
  /**
   * #2437 In Vue 3, functional components do not have a public instance proxy but
   * they exist in the internal parent chain. For code that relies on traversing
   * public $parent chains, skip functional ones and go to the parent instead.
   */


  var getPublicInstance = function getPublicInstance(i) {
    if (!i) return null;
    if (isStatefulComponent(i)) return i.exposed ? i.exposed : i.proxy;
    return getPublicInstance(i.parent);
  };

  var publicPropertiesMap = extend(Object.create(null), {
    $: function $(i) {
      return i;
    },
    $el: function $el(i) {
      return i.vnode.el;
    },
    $data: function $data(i) {
      return i.data;
    },
    $props: function $props(i) {
      return i.props;
    },
    $attrs: function $attrs(i) {
      return i.attrs;
    },
    $slots: function $slots(i) {
      return i.slots;
    },
    $refs: function $refs(i) {
      return i.refs;
    },
    $parent: function $parent(i) {
      return getPublicInstance(i.parent);
    },
    $root: function $root(i) {
      return getPublicInstance(i.root);
    },
    $emit: function $emit(i) {
      return i.emit;
    },
    $options: function $options(i) {
      return __VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type;
    },
    $forceUpdate: function $forceUpdate(i) {
      return function () {
        return queueJob(i.update);
      };
    },
    $nextTick: function $nextTick(i) {
      return nextTick.bind(i.proxy);
    },
    $watch: function $watch(i) {
      return __VUE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP;
    }
  });
  var PublicInstanceProxyHandlers = {
    get: function get(_ref16, key) {
      var instance = _ref16._;
      var ctx = instance.ctx,
          setupState = instance.setupState,
          data = instance.data,
          props = instance.props,
          accessCache = instance.accessCache,
          type = instance.type,
          appContext = instance.appContext; // let @vue/reactivity know it should never observe Vue public instances.

      if (key === "__v_skip"
      /* SKIP */
      ) {
          return true;
        } // for internal formatters to know that this is a Vue instance
      // This getter gets called for every property access on the render context
      // during render and is a major hotspot. The most expensive part of this
      // is the multiple hasOwn() calls. It's much faster to do a simple property
      // access on a plain object, so we use an accessCache object (with null
      // prototype) to memoize what access type a key corresponds to.


      var normalizedProps;

      if (key[0] !== '$') {
        var _n3 = accessCache[key];

        if (_n3 !== undefined) {
          switch (_n3) {
            case 0
            /* SETUP */
            :
              return setupState[key];

            case 1
            /* DATA */
            :
              return data[key];

            case 3
            /* CONTEXT */
            :
              return ctx[key];

            case 2
            /* PROPS */
            :
              return props[key];
            // default: just fallthrough
          }
        } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
          accessCache[key] = 0
          /* SETUP */
          ;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 1
          /* DATA */
          ;
          return data[key];
        } else if ( // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
          accessCache[key] = 2
          /* PROPS */
          ;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 3
          /* CONTEXT */
          ;
          return ctx[key];
        } else if (!__VUE_OPTIONS_API__ || shouldCacheAccess) {
          accessCache[key] = 4
          /* OTHER */
          ;
        }
      }

      var publicGetter = publicPropertiesMap[key];
      var cssModule, globalProperties; // public $xxx properties

      if (publicGetter) {
        if (key === '$attrs') {
          track(instance, "get"
          /* GET */
          , key);
        }

        return publicGetter(instance);
      } else if ( // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        // user may set custom properties to `this` that start with `$`
        accessCache[key] = 3
        /* CONTEXT */
        ;
        return ctx[key];
      } else if ( // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
        return globalProperties[key];
      } else ;
    },
    set: function set(_ref17, key, value) {
      var instance = _ref17._;
      var data = instance.data,
          setupState = instance.setupState,
          ctx = instance.ctx;

      if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }

      if (key[0] === '$' && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }

      return true;
    },
    has: function has(_ref18, key) {
      var _ref18$_ = _ref18._,
          data = _ref18$_.data,
          setupState = _ref18$_.setupState,
          accessCache = _ref18$_.accessCache,
          ctx = _ref18$_.ctx,
          appContext = _ref18$_.appContext,
          propsOptions = _ref18$_.propsOptions;
      var normalizedProps;
      return accessCache[key] !== undefined || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    }
  };
  var RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
    get: function get(target, key) {
      // fast path for unscopables when using `with` block
      if (key === Symbol.unscopables) {
        return;
      }

      return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has: function has(_, key) {
      var has = key[0] !== '_' && !isGloballyWhitelisted(key);
      return has;
    }
  }); // In dev mode, the proxy target exposes the same properties as seen on `this`

  var emptyAppContext = createAppContext();
  var uid$1 = 0;

  function createComponentInstance(vnode, parent, suspense) {
    var type = vnode.type; // inherit parent app context - or - if root, adopt from root vnode

    var appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    var instance = {
      uid: uid$1++,
      vnode: vnode,
      type: type,
      parent: parent,
      appContext: appContext,
      root: null,
      next: null,
      subTree: null,
      update: null,
      render: null,
      proxy: null,
      exposed: null,
      withProxy: null,
      effects: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      // local resovled assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense: suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null
    };
    {
      instance.ctx = {
        _: instance
      };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    return instance;
  }

  var currentInstance = null;

  var getCurrentInstance = function getCurrentInstance() {
    return currentInstance || currentRenderingInstance;
  };

  var setCurrentInstance = function setCurrentInstance(instance) {
    currentInstance = instance;
  };

  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4
    /* STATEFUL_COMPONENT */
    ;
  }

  var isInSSRComponentSetup = false;

  function setupComponent(instance, isSSR) {
    if (isSSR === void 0) {
      isSSR = false;
    }

    isInSSRComponentSetup = isSSR;
    var _instance$vnode = instance.vnode,
        props = _instance$vnode.props,
        children = _instance$vnode.children;
    var isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    var setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : undefined;
    isInSSRComponentSetup = false;
    return setupResult;
  }

  function setupStatefulComponent(instance, isSSR) {
    var Component = instance.type;
    instance.accessCache = Object.create(null); // 1. create public instance / render proxy
    // also mark it raw so it's never observed

    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    var setup = Component.setup;

    if (setup) {
      var setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      currentInstance = instance;
      pauseTracking();
      var setupResult = callWithErrorHandling(setup, instance, 0
      /* SETUP_FUNCTION */
      , [instance.props, setupContext]);
      resetTracking();
      currentInstance = null;

      if (isPromise$1(setupResult)) {
        if (isSSR) {
          // return the promise so server-renderer can wait on it
          return setupResult.then(function (resolvedResult) {
            handleSetupResult(instance, resolvedResult);
          }).catch(function (e) {
            handleError(e, instance, 0
            /* SETUP_FUNCTION */
            );
          });
        } else {
          // async setup returned Promise.
          // bail here and wait for re-entry.
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult);
      }
    } else {
      finishComponentSetup(instance);
    }
  }

  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      // setup returned an inline render function
      {
        instance.render = setupResult;
      }
    } else if (isObject$1(setupResult)) {
      // assuming a render function compiled from template is present.
      if (__VUE_PROD_DEVTOOLS__) {
        instance.devtoolsRawSetupState = setupResult;
      }

      instance.setupState = proxyRefs(setupResult);
    } else ;

    finishComponentSetup(instance);
  }

  function finishComponentSetup(instance, isSSR) {
    var Component = instance.type; // template / render function normalization

    if (!instance.render) {
      instance.render = Component.render || NOOP; // for runtime-compiled render functions using `with` blocks, the render
      // proxy used needs a different `has` handler which is more performant and
      // also only allows a whitelist of globals to fallthrough.

      if (instance.render._rc) {
        instance.withProxy = new Proxy(instance.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    } // support for 2.x options


    if (__VUE_OPTIONS_API__) {
      currentInstance = instance;
      pauseTracking();
      applyOptions(instance, Component);
      resetTracking();
      currentInstance = null;
    } // warn missing template/render

  }

  function createSetupContext(instance) {
    var expose = function expose(exposed) {
      instance.exposed = proxyRefs(exposed);
    };

    {
      return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
        expose: expose
      };
    }
  } // record effects created during a component's setup() so that they can be
  // stopped when the component unmounts


  function recordInstanceBoundEffect(effect, instance) {
    if (instance === void 0) {
      instance = currentInstance;
    }

    if (instance) {
      (instance.effects || (instance.effects = [])).push(effect);
    }
  }

  function getComponentName(Component) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name;
  }

  function isClassComponent(value) {
    return isFunction(value) && '__vccOpts' in value;
  }

  function computed(getterOrOptions) {
    var c = computed$1(getterOrOptions);
    recordInstanceBoundEffect(c.effect);
    return c;
  } // implementation


  function h(type, propsOrChildren, children) {
    var l = arguments.length;

    if (l === 2) {
      if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
        // single vnode without props
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        } // props without children


        return createVNode(type, propsOrChildren);
      } else {
        // omit props
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVNode(children)) {
        children = [children];
      }

      return createVNode(type, propsOrChildren, children);
    }
  }
  /**
   * Actual implementation
   */


  function renderList(source, renderItem) {
    var ret;

    if (isArray(source) || isString(source)) {
      ret = new Array(source.length);

      for (var _i34 = 0, l = source.length; _i34 < l; _i34++) {
        ret[_i34] = renderItem(source[_i34], _i34);
      }
    } else if (typeof source === 'number') {
      ret = new Array(source);

      for (var _i35 = 0; _i35 < source; _i35++) {
        ret[_i35] = renderItem(_i35 + 1, _i35);
      }
    } else if (isObject$1(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(source, renderItem);
      } else {
        var keys = Object.keys(source);
        ret = new Array(keys.length);

        for (var _i36 = 0, _l = keys.length; _i36 < _l; _i36++) {
          var key = keys[_i36];
          ret[_i36] = renderItem(source[key], key, _i36);
        }
      }
    } else {
      ret = [];
    }

    return ret;
  }

  var version = "3.0.11";
  var svgNS = 'http://www.w3.org/2000/svg';
  var doc = typeof document !== 'undefined' ? document : null;
  var tempContainer;
  var tempSVGContainer;
  var nodeOps = {
    insert: function insert(child, parent, anchor) {
      parent.insertBefore(child, anchor || null);
    },
    remove: function remove(child) {
      var parent = child.parentNode;

      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: function createElement(tag, isSVG, is, props) {
      var el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? {
        is: is
      } : undefined);

      if (tag === 'select' && props && props.multiple != null) {
        el.setAttribute('multiple', props.multiple);
      }

      return el;
    },
    createText: function createText(text) {
      return doc.createTextNode(text);
    },
    createComment: function createComment(text) {
      return doc.createComment(text);
    },
    setText: function setText(node, text) {
      node.nodeValue = text;
    },
    setElementText: function setElementText(el, text) {
      el.textContent = text;
    },
    parentNode: function parentNode(node) {
      return node.parentNode;
    },
    nextSibling: function nextSibling(node) {
      return node.nextSibling;
    },
    querySelector: function querySelector(selector) {
      return doc.querySelector(selector);
    },
    setScopeId: function setScopeId(el, id) {
      el.setAttribute(id, '');
    },
    cloneNode: function cloneNode(el) {
      var cloned = el.cloneNode(true); // #3072
      // - in `patchDOMProp`, we store the actual value in the `el._value` property.
      // - normally, elements using `:value` bindings will not be hoisted, but if
      //   the bound value is a constant, e.g. `:value="true"` - they do get
      //   hoisted.
      // - in production, hoisted nodes are cloned when subsequent inserts, but
      //   cloneNode() does not copy the custom property we attached.
      // - This may need to account for other custom DOM properties we attach to
      //   elements in addition to `_value` in the future.

      if ("_value" in el) {
        cloned._value = el._value;
      }

      return cloned;
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent: function insertStaticContent(content, parent, anchor, isSVG) {
      var temp = isSVG ? tempSVGContainer || (tempSVGContainer = doc.createElementNS(svgNS, 'svg')) : tempContainer || (tempContainer = doc.createElement('div'));
      temp.innerHTML = content;
      var first = temp.firstChild;
      var node = first;
      var last = node;

      while (node) {
        last = node;
        nodeOps.insert(node, parent, anchor);
        node = temp.firstChild;
      }

      return [first, last];
    }
  }; // compiler should normalize class + :class bindings on the same element
  // into a single binding ['staticClass', dynamic]

  function patchClass(el, value, isSVG) {
    if (value == null) {
      value = '';
    }

    if (isSVG) {
      el.setAttribute('class', value);
    } else {
      // directly setting className should be faster than setAttribute in theory
      // if this is an element during a transition, take the temporary transition
      // classes into account.
      var transitionClasses = el._vtc;

      if (transitionClasses) {
        value = (value ? [value].concat(transitionClasses) : [].concat(transitionClasses)).join(' ');
      }

      el.className = value;
    }
  }

  function patchStyle(el, prev, next) {
    var style = el.style;

    if (!next) {
      el.removeAttribute('style');
    } else if (isString(next)) {
      if (prev !== next) {
        var current = style.display;
        style.cssText = next; // indicates that the `display` of the element is controlled by `v-show`,
        // so we always keep the current `display` value regardless of the `style` value,
        // thus handing over control to `v-show`.

        if ('_vod' in el) {
          style.display = current;
        }
      }
    } else {
      for (var key in next) {
        setStyle(style, key, next[key]);
      }

      if (prev && !isString(prev)) {
        for (var _key16 in prev) {
          if (next[_key16] == null) {
            setStyle(style, _key16, '');
          }
        }
      }
    }
  }

  var importantRE = /\s*!important$/;

  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach(function (v) {
        return setStyle(style, name, v);
      });
    } else {
      if (name.startsWith('--')) {
        // custom property definition
        style.setProperty(name, val);
      } else {
        var prefixed = autoPrefix(style, name);

        if (importantRE.test(val)) {
          // !important
          style.setProperty(hyphenate(prefixed), val.replace(importantRE, ''), 'important');
        } else {
          style[prefixed] = val;
        }
      }
    }
  }

  var prefixes = ['Webkit', 'Moz', 'ms'];
  var prefixCache = {};

  function autoPrefix(style, rawName) {
    var cached = prefixCache[rawName];

    if (cached) {
      return cached;
    }

    var name = camelize(rawName);

    if (name !== 'filter' && name in style) {
      return prefixCache[rawName] = name;
    }

    name = capitalize(name);

    for (var _i37 = 0; _i37 < prefixes.length; _i37++) {
      var prefixed = prefixes[_i37] + name;

      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }

    return rawName;
  }

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  function patchAttr(el, key, value, isSVG) {
    if (isSVG && key.startsWith('xlink:')) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      // note we are only checking boolean attributes that don't have a
      // corresponding dom prop of the same name here.
      var isBoolean = isSpecialBooleanAttr(key);

      if (value == null || isBoolean && value === false) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean ? '' : value);
      }
    }
  } // __UNSAFE__
  // functions. The user is responsible for using them with only trusted content.


  function patchDOMProp(el, key, value, // the following args are passed only due to potential innerHTML/textContent
  // overriding existing VNodes, in which case the old tree must be properly
  // unmounted.
  prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === 'innerHTML' || key === 'textContent') {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }

      el[key] = value == null ? '' : value;
      return;
    }

    if (key === 'value' && el.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified.
      el._value = value;
      var newValue = value == null ? '' : value;

      if (el.value !== newValue) {
        el.value = newValue;
      }

      return;
    }

    if (value === '' || value == null) {
      var type = typeof el[key];

      if (value === '' && type === 'boolean') {
        // e.g. <select multiple> compiles to { multiple: '' }
        el[key] = true;
        return;
      } else if (value == null && type === 'string') {
        // e.g. <div :id="null">
        el[key] = '';
        el.removeAttribute(key);
        return;
      } else if (type === 'number') {
        // e.g. <img :width="null">
        el[key] = 0;
        el.removeAttribute(key);
        return;
      }
    } // some properties perform value validation and throw


    try {
      el[key] = value;
    } catch (e) {}
  } // Async edge case fix requires storing an event listener's attach timestamp.


  var _getNow = Date.now;
  var skipTimestampCheck = false;

  if (typeof window !== 'undefined') {
    // Determine what event timestamp the browser is using. Annoyingly, the
    // timestamp can either be hi-res (relative to page load) or low-res
    // (relative to UNIX epoch), so in order to compare time we have to use the
    // same timestamp type when saving the flush timestamp.
    if (_getNow() > document.createEvent('Event').timeStamp) {
      // if the low-res timestamp which is bigger than the event timestamp
      // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listeners as well.
      _getNow = function _getNow() {
        return performance.now();
      };
    } // #3485: Firefox <= 53 has incorrect Event.timeStamp implementation
    // and does not fire microtasks in between event propagation, so safe to exclude.


    var ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
  } // To avoid the overhead of repeatedly calling performance.now(), we cache
  // and use the same timestamp for all event listeners attached in the same tick.


  var cachedNow = 0;
  var p = Promise.resolve();

  var reset = function reset() {
    cachedNow = 0;
  };

  var getNow = function getNow() {
    return cachedNow || (p.then(reset), cachedNow = _getNow());
  };

  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }

  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }

  function patchEvent(el, rawName, prevValue, nextValue, instance) {
    if (instance === void 0) {
      instance = null;
    }

    // vei = vue event invokers
    var invokers = el._vei || (el._vei = {});
    var existingInvoker = invokers[rawName];

    if (nextValue && existingInvoker) {
      // patch
      existingInvoker.value = nextValue;
    } else {
      var _parseName = parseName(rawName),
          name = _parseName[0],
          _options2 = _parseName[1];

      if (nextValue) {
        // add
        var invoker = invokers[rawName] = createInvoker(nextValue, instance);
        addEventListener(el, name, invoker, _options2);
      } else if (existingInvoker) {
        // remove
        removeEventListener(el, name, existingInvoker, _options2);
        invokers[rawName] = undefined;
      }
    }
  }

  var optionsModifierRE = /(?:Once|Passive|Capture)$/;

  function parseName(name) {
    var options;

    if (optionsModifierRE.test(name)) {
      options = {};
      var m;

      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }

    return [hyphenate(name.slice(2)), options];
  }

  function createInvoker(initialValue, instance) {
    var invoker = function invoker(e) {
      // async edge case #6566: inner click event triggers patch, event handler
      // attached to outer element during patch, and triggered again. This
      // happens because browsers fire microtask ticks between event propagation.
      // the solution is simple: we save the timestamp when a handler is attached,
      // and the handler would only fire if the event passed to it was fired
      // AFTER it was attached.
      var timeStamp = e.timeStamp || _getNow();

      if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
        callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5
        /* NATIVE_EVENT_HANDLER */
        , [e]);
      }
    };

    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }

  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      var originalStop = e.stopImmediatePropagation;

      e.stopImmediatePropagation = function () {
        originalStop.call(e);
        e._stopped = true;
      };

      return value.map(function (fn) {
        return function (e) {
          return !e._stopped && fn(e);
        };
      });
    } else {
      return value;
    }
  }

  var nativeOnRE = /^on[a-z]/;

  var forcePatchProp = function forcePatchProp(_, key) {
    return key === 'value';
  };

  var patchProp = function patchProp(el, key, prevValue, nextValue, isSVG, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (isSVG === void 0) {
      isSVG = false;
    }

    switch (key) {
      // special
      case 'class':
        patchClass(el, nextValue, isSVG);
        break;

      case 'style':
        patchStyle(el, prevValue, nextValue);
        break;

      default:
        if (isOn(key)) {
          // ignore v-model listeners
          if (!isModelListener(key)) {
            patchEvent(el, key, prevValue, nextValue, parentComponent);
          }
        } else if (shouldSetAsProp(el, key, nextValue, isSVG)) {
          patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
        } else {
          // special case for <input v-model type="checkbox"> with
          // :true-value & :false-value
          // store value as dom properties since non-string values will be
          // stringified.
          if (key === 'true-value') {
            el._trueValue = nextValue;
          } else if (key === 'false-value') {
            el._falseValue = nextValue;
          }

          patchAttr(el, key, nextValue, isSVG);
        }

        break;
    }
  };

  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      // most keys must be set as attribute on svg elements to work
      // ...except innerHTML
      if (key === 'innerHTML') {
        return true;
      } // or native onclick with function values


      if (key in el && nativeOnRE.test(key) && isFunction(value)) {
        return true;
      }

      return false;
    } // spellcheck and draggable are numerated attrs, however their
    // corresponding DOM properties are actually booleans - this leads to
    // setting it with a string "false" value leading it to be coerced to
    // `true`, so we need to always treat them as attributes.
    // Note that `contentEditable` doesn't have this problem: its DOM
    // property is also enumerated string values.


    if (key === 'spellcheck' || key === 'draggable') {
      return false;
    } // #1787, #2840 form property on form elements is readonly and must be set as
    // attribute.


    if (key === 'form') {
      return false;
    } // #1526 <input list> must be set as attribute


    if (key === 'list' && el.tagName === 'INPUT') {
      return false;
    } // #2766 <textarea type> must be set as attribute


    if (key === 'type' && el.tagName === 'TEXTAREA') {
      return false;
    } // native onclick with string value, must be set as attribute


    if (nativeOnRE.test(key) && isString(value)) {
      return false;
    }

    return key in el;
  }

  var TRANSITION = 'transition';
  var ANIMATION = 'animation'; // DOM Transition is a higher-order-component based on the platform-agnostic
  // base Transition component, with DOM-specific logic.

  var Transition = function Transition(props, _ref19) {
    var slots = _ref19.slots;
    return h(BaseTransition, resolveTransitionProps(props), slots);
  };

  Transition.displayName = 'Transition';
  var DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  Transition.props = /*#__PURE__*/extend({}, BaseTransition.props, DOMTransitionPropsValidators);

  function resolveTransitionProps(rawProps) {
    var _rawProps$name = rawProps.name,
        name = _rawProps$name === void 0 ? 'v' : _rawProps$name,
        type = rawProps.type,
        _rawProps$css = rawProps.css,
        css = _rawProps$css === void 0 ? true : _rawProps$css,
        duration = rawProps.duration,
        _rawProps$enterFromCl = rawProps.enterFromClass,
        enterFromClass = _rawProps$enterFromCl === void 0 ? name + "-enter-from" : _rawProps$enterFromCl,
        _rawProps$enterActive = rawProps.enterActiveClass,
        enterActiveClass = _rawProps$enterActive === void 0 ? name + "-enter-active" : _rawProps$enterActive,
        _rawProps$enterToClas = rawProps.enterToClass,
        enterToClass = _rawProps$enterToClas === void 0 ? name + "-enter-to" : _rawProps$enterToClas,
        _rawProps$appearFromC = rawProps.appearFromClass,
        appearFromClass = _rawProps$appearFromC === void 0 ? enterFromClass : _rawProps$appearFromC,
        _rawProps$appearActiv = rawProps.appearActiveClass,
        appearActiveClass = _rawProps$appearActiv === void 0 ? enterActiveClass : _rawProps$appearActiv,
        _rawProps$appearToCla = rawProps.appearToClass,
        appearToClass = _rawProps$appearToCla === void 0 ? enterToClass : _rawProps$appearToCla,
        _rawProps$leaveFromCl = rawProps.leaveFromClass,
        leaveFromClass = _rawProps$leaveFromCl === void 0 ? name + "-leave-from" : _rawProps$leaveFromCl,
        _rawProps$leaveActive = rawProps.leaveActiveClass,
        leaveActiveClass = _rawProps$leaveActive === void 0 ? name + "-leave-active" : _rawProps$leaveActive,
        _rawProps$leaveToClas = rawProps.leaveToClass,
        leaveToClass = _rawProps$leaveToClas === void 0 ? name + "-leave-to" : _rawProps$leaveToClas;
    var baseProps = {};

    for (var key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }

    if (!css) {
      return baseProps;
    }

    var durations = normalizeDuration(duration);
    var enterDuration = durations && durations[0];
    var leaveDuration = durations && durations[1];

    var _onBeforeEnter = baseProps.onBeforeEnter,
        onEnter = baseProps.onEnter,
        _onEnterCancelled = baseProps.onEnterCancelled,
        _onLeave = baseProps.onLeave,
        _onLeaveCancelled = baseProps.onLeaveCancelled,
        _baseProps$onBeforeAp = baseProps.onBeforeAppear,
        _onBeforeAppear = _baseProps$onBeforeAp === void 0 ? _onBeforeEnter : _baseProps$onBeforeAp,
        _baseProps$onAppear = baseProps.onAppear,
        onAppear = _baseProps$onAppear === void 0 ? onEnter : _baseProps$onAppear,
        _baseProps$onAppearCa = baseProps.onAppearCancelled,
        _onAppearCancelled = _baseProps$onAppearCa === void 0 ? _onEnterCancelled : _baseProps$onAppearCa;

    var finishEnter = function finishEnter(el, isAppear, done) {
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };

    var finishLeave = function finishLeave(el, done) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };

    var makeEnterHook = function makeEnterHook(isAppear) {
      return function (el, done) {
        var hook = isAppear ? onAppear : onEnter;

        var resolve = function resolve() {
          return finishEnter(el, isAppear, done);
        };

        hook && hook(el, resolve);
        nextFrame(function () {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);

          if (!(hook && hook.length > 1)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
        });
      };
    };

    return extend(baseProps, {
      onBeforeEnter: function onBeforeEnter(el) {
        _onBeforeEnter && _onBeforeEnter(el);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear: function onBeforeAppear(el) {
        _onBeforeAppear && _onBeforeAppear(el);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave: function onLeave(el, done) {
        var resolve = function resolve() {
          return finishLeave(el, done);
        };

        addTransitionClass(el, leaveFromClass); // force reflow so *-leave-from classes immediately take effect (#2593)

        forceReflow();
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);

          if (!(_onLeave && _onLeave.length > 1)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
        });
        _onLeave && _onLeave(el, resolve);
      },
      onEnterCancelled: function onEnterCancelled(el) {
        finishEnter(el, false);
        _onEnterCancelled && _onEnterCancelled(el);
      },
      onAppearCancelled: function onAppearCancelled(el) {
        finishEnter(el, true);
        _onAppearCancelled && _onAppearCancelled(el);
      },
      onLeaveCancelled: function onLeaveCancelled(el) {
        finishLeave(el);
        _onLeaveCancelled && _onLeaveCancelled(el);
      }
    });
  }

  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject$1(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      var _n4 = NumberOf(duration);

      return [_n4, _n4];
    }
  }

  function NumberOf(val) {
    var res = toNumber(val);
    return res;
  }

  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach(function (c) {
      return c && el.classList.add(c);
    });
    (el._vtc || (el._vtc = new Set())).add(cls);
  }

  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach(function (c) {
      return c && el.classList.remove(c);
    });
    var _vtc = el._vtc;

    if (_vtc) {
      _vtc.delete(cls);

      if (!_vtc.size) {
        el._vtc = undefined;
      }
    }
  }

  function nextFrame(cb) {
    requestAnimationFrame(function () {
      requestAnimationFrame(cb);
    });
  }

  var endId = 0;

  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    var id = el._endId = ++endId;

    var resolveIfNotStale = function resolveIfNotStale() {
      if (id === el._endId) {
        resolve();
      }
    };

    if (explicitTimeout) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }

    var _getTransitionInfo = getTransitionInfo(el, expectedType),
        type = _getTransitionInfo.type,
        timeout = _getTransitionInfo.timeout,
        propCount = _getTransitionInfo.propCount;

    if (!type) {
      return resolve();
    }

    var endEvent = type + 'end';
    var ended = 0;

    var end = function end() {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };

    var onEnd = function onEnd(e) {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };

    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }

  function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

    var getStyleProperties = function getStyleProperties(key) {
      return (styles[key] || '').split(', ');
    };

    var transitionDelays = getStyleProperties(TRANSITION + 'Delay');
    var transitionDurations = getStyleProperties(TRANSITION + 'Duration');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = getStyleProperties(ANIMATION + 'Delay');
    var animationDurations = getStyleProperties(ANIMATION + 'Duration');
    var animationTimeout = getTimeout(animationDelays, animationDurations);
    var type = null;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */

    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }

    var hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    };
  }

  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(Math, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i]);
    }));
  } // Old versions of Chromium (below 61.0.3163.100) formats floating pointer
  // numbers in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down
  // (i.e. acting as a floor function) causing unexpected behaviors


  function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
  } // synchronously force layout to put elements into a certain state


  function forceReflow() {
    return document.body.offsetHeight;
  }

  var getModelAssigner = function getModelAssigner(vnode) {
    var fn = vnode.props['onUpdate:modelValue'];
    return isArray(fn) ? function (value) {
      return invokeArrayFns(fn, value);
    } : fn;
  };

  function onCompositionStart(e) {
    e.target.composing = true;
  }

  function onCompositionEnd(e) {
    var target = e.target;

    if (target.composing) {
      target.composing = false;
      trigger(target, 'input');
    }
  }

  function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  } // We are exporting the v-model runtime directly as vnode hooks so that it can
  // be tree-shaken in case v-model is never used.


  var vModelText = {
    created: function created(el, _ref20, vnode) {
      var _ref20$modifiers = _ref20.modifiers,
          lazy = _ref20$modifiers.lazy,
          trim = _ref20$modifiers.trim,
          number = _ref20$modifiers.number;
      el._assign = getModelAssigner(vnode);
      var castToNumber = number || el.type === 'number';
      addEventListener(el, lazy ? 'change' : 'input', function (e) {
        if (e.target.composing) return;
        var domValue = el.value;

        if (trim) {
          domValue = domValue.trim();
        } else if (castToNumber) {
          domValue = toNumber(domValue);
        }

        el._assign(domValue);
      });

      if (trim) {
        addEventListener(el, 'change', function () {
          el.value = el.value.trim();
        });
      }

      if (!lazy) {
        addEventListener(el, 'compositionstart', onCompositionStart);
        addEventListener(el, 'compositionend', onCompositionEnd); // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.

        addEventListener(el, 'change', onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted: function mounted(el, _ref21) {
      var value = _ref21.value;
      el.value = value == null ? '' : value;
    },
    beforeUpdate: function beforeUpdate(el, _ref22, vnode) {
      var value = _ref22.value,
          _ref22$modifiers = _ref22.modifiers,
          trim = _ref22$modifiers.trim,
          number = _ref22$modifiers.number;
      el._assign = getModelAssigner(vnode); // avoid clearing unresolved text. #2302

      if (el.composing) return;

      if (document.activeElement === el) {
        if (trim && el.value.trim() === value) {
          return;
        }

        if ((number || el.type === 'number') && toNumber(el.value) === value) {
          return;
        }
      }

      var newValue = value == null ? '' : value;

      if (el.value !== newValue) {
        el.value = newValue;
      }
    }
  };
  var systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
  var modifierGuards = {
    stop: function stop(e) {
      return e.stopPropagation();
    },
    prevent: function prevent(e) {
      return e.preventDefault();
    },
    self: function self(e) {
      return e.target !== e.currentTarget;
    },
    ctrl: function ctrl(e) {
      return !e.ctrlKey;
    },
    shift: function shift(e) {
      return !e.shiftKey;
    },
    alt: function alt(e) {
      return !e.altKey;
    },
    meta: function meta(e) {
      return !e.metaKey;
    },
    left: function left(e) {
      return 'button' in e && e.button !== 0;
    },
    middle: function middle(e) {
      return 'button' in e && e.button !== 1;
    },
    right: function right(e) {
      return 'button' in e && e.button !== 2;
    },
    exact: function exact(e, modifiers) {
      return systemModifiers.some(function (m) {
        return e[m + "Key"] && !modifiers.includes(m);
      });
    }
  };
  /**
   * @private
   */

  var withModifiers = function withModifiers(fn, modifiers) {
    return function (event) {
      for (var _i38 = 0; _i38 < modifiers.length; _i38++) {
        var guard = modifierGuards[modifiers[_i38]];
        if (guard && guard(event, modifiers)) return;
      }

      for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key17 = 1; _key17 < _len7; _key17++) {
        args[_key17 - 1] = arguments[_key17];
      }

      return fn.apply(void 0, [event].concat(args));
    };
  }; // Kept for 2.x compat.
  // Note: IE11 compat for `spacebar` and `del` is removed for now.


  var keyNames = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace'
  };
  /**
   * @private
   */

  var withKeys = function withKeys(fn, modifiers) {
    return function (event) {
      if (!('key' in event)) return;
      var eventKey = hyphenate(event.key);

      if ( // None of the provided key modifiers match the current event key
      !modifiers.some(function (k) {
        return k === eventKey || keyNames[k] === eventKey;
      })) {
        return;
      }

      return fn(event);
    };
  };

  var vShow = {
    beforeMount: function beforeMount(el, _ref23, _ref24) {
      var value = _ref23.value;
      var transition = _ref24.transition;
      el._vod = el.style.display === 'none' ? '' : el.style.display;

      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted: function mounted(el, _ref25, _ref26) {
      var value = _ref25.value;
      var transition = _ref26.transition;

      if (transition && value) {
        transition.enter(el);
      }
    },
    updated: function updated(el, _ref27, _ref28) {
      var value = _ref27.value,
          oldValue = _ref27.oldValue;
      var transition = _ref28.transition;
      if (!value === !oldValue) return;

      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, function () {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount: function beforeUnmount(el, _ref29) {
      var value = _ref29.value;
      setDisplay(el, value);
    }
  };

  function setDisplay(el, value) {
    el.style.display = value ? el._vod : 'none';
  }

  var rendererOptions = extend({
    patchProp: patchProp,
    forcePatchProp: forcePatchProp
  }, nodeOps); // lazy create the renderer - this makes core renderer logic tree-shakable
  // in case the user only imports reactivity utilities from Vue.

  var renderer;

  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }

  var createApp = function createApp() {
    var _ensureRenderer;

    var app = (_ensureRenderer = ensureRenderer()).createApp.apply(_ensureRenderer, arguments);

    var mount = app.mount;

    app.mount = function (containerOrSelector) {
      var container = normalizeContainer(containerOrSelector);
      if (!container) return;
      var component = app._component;

      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      } // clear content before mounting


      container.innerHTML = '';
      var proxy = mount(container, false, container instanceof SVGElement);

      if (container instanceof Element) {
        container.removeAttribute('v-cloak');
        container.setAttribute('data-v-app', '');
      }

      return proxy;
    };

    return app;
  };

  function normalizeContainer(container) {
    if (isString(container)) {
      var res = document.querySelector(container);
      return res;
    }

    return container;
  }
  /**
   * Media Event bus - used for communication between joomla and vue
   */


  var Event = /*#__PURE__*/function () {
    /**
       * Media Event constructor
       */
    function Event() {
      this.events = {};
    }
    /**
       * Fire an event
       * @param event
       * @param data
       */


    var _proto = Event.prototype;

    _proto.fire = function fire(event, data) {
      if (data === void 0) {
        data = null;
      }

      if (this.events[event]) {
        this.events[event].forEach(function (fn) {
          return fn(data);
        });
      }
    }
    /**
       * Listen to events
       * @param event
       * @param callback
       */
    ;

    _proto.listen = function listen(event, callback) {
      this.events[event] = this.events[event] || [];
      this.events[event].push(callback);
    };

    return Event;
  }(); // Loading state


  var SET_IS_LOADING = 'SET_IS_LOADING'; // Selecting media items

  var SELECT_DIRECTORY = 'SELECT_DIRECTORY';
  var SELECT_BROWSER_ITEM = 'SELECT_BROWSER_ITEM';
  var SELECT_BROWSER_ITEMS = 'SELECT_BROWSER_ITEMS';
  var UNSELECT_BROWSER_ITEM = 'UNSELECT_BROWSER_ITEM';
  var UNSELECT_ALL_BROWSER_ITEMS = 'UNSELECT_ALL_BROWSER_ITEMS'; // In/Decrease grid item size

  var INCREASE_GRID_SIZE = 'INCREASE_GRID_SIZE';
  var DECREASE_GRID_SIZE = 'DECREASE_GRID_SIZE'; // Api handlers

  var LOAD_CONTENTS_SUCCESS = 'LOAD_CONTENTS_SUCCESS';
  var LOAD_FULL_CONTENTS_SUCCESS = 'LOAD_FULL_CONTENTS_SUCCESS';
  var CREATE_DIRECTORY_SUCCESS = 'CREATE_DIRECTORY_SUCCESS';
  var UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'; // Create folder modal

  var SHOW_CREATE_FOLDER_MODAL = 'SHOW_CREATE_FOLDER_MODAL';
  var HIDE_CREATE_FOLDER_MODAL = 'HIDE_CREATE_FOLDER_MODAL'; // Confirm Delete Modal

  var SHOW_CONFIRM_DELETE_MODAL = 'SHOW_CONFIRM_DELETE_MODAL';
  var HIDE_CONFIRM_DELETE_MODAL = 'HIDE_CONFIRM_DELETE_MODAL'; // Infobar

  var SHOW_INFOBAR = 'SHOW_INFOBAR';
  var HIDE_INFOBAR = 'HIDE_INFOBAR'; // Delete items

  var DELETE_SUCCESS = 'DELETE_SUCCESS'; // List view

  var CHANGE_LIST_VIEW = 'CHANGE_LIST_VIEW'; // Preview modal

  var SHOW_PREVIEW_MODAL = 'SHOW_PREVIEW_MODAL';
  var HIDE_PREVIEW_MODAL = 'HIDE_PREVIEW_MODAL'; // Rename modal

  var SHOW_RENAME_MODAL = 'SHOW_RENAME_MODAL';
  var HIDE_RENAME_MODAL = 'HIDE_RENAME_MODAL';
  var RENAME_SUCCESS = 'RENAME_SUCCESS'; // Share model

  var SHOW_SHARE_MODAL = 'SHOW_SHARE_MODAL';
  var HIDE_SHARE_MODAL = 'HIDE_SHARE_MODAL'; // Search Query

  var SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';

  var Notifications = /*#__PURE__*/function () {
    function Notifications() {}

    var _proto2 = Notifications.prototype;

    /* Send and success notification */
    // eslint-disable-next-line class-methods-use-this
    _proto2.success = function success(message, options) {
      // eslint-disable-next-line no-use-before-define
      notifications.notify(message, Object.assign({
        type: 'message',
        // @todo rename it to success
        dismiss: true
      }, options));
    }
    /* Send an error notification */
    // eslint-disable-next-line class-methods-use-this
    ;

    _proto2.error = function error(message, options) {
      // eslint-disable-next-line no-use-before-define
      notifications.notify(message, Object.assign({
        type: 'error',
        // @todo rename it to danger
        dismiss: true
      }, options));
    }
    /* Ask the user a question */
    // eslint-disable-next-line class-methods-use-this
    ;

    _proto2.ask = function ask(message) {
      return window.confirm(message);
    }
    /* Send a notification */
    // eslint-disable-next-line class-methods-use-this
    ;

    _proto2.notify = function notify(message, options) {
      var _Joomla$renderMessage;

      var timer;

      if (options.type === 'message') {
        timer = 3000;
      }

      Joomla.renderMessages((_Joomla$renderMessage = {}, _Joomla$renderMessage[options.type] = [Joomla.JText._(message)], _Joomla$renderMessage), undefined, true, timer);
    };

    return Notifications;
  }(); // eslint-disable-next-line import/no-mutable-exports,import/prefer-default-export


  var notifications = new Notifications();
  var script$k = {
    name: 'MediaApp',
    data: function data() {
      return {
        // The full height of the app in px
        fullHeight: ''
      };
    },
    computed: {
      disks: function disks() {
        return this.$store.state.disks;
      }
    },
    created: function created() {
      var _this2 = this;

      // Listen to the toolbar events
      MediaManager.Event.listen('onClickCreateFolder', function () {
        return _this2.$store.commit(SHOW_CREATE_FOLDER_MODAL);
      });
      MediaManager.Event.listen('onClickDelete', function () {
        if (_this2.$store.state.selectedItems.length > 0) {
          _this2.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
        } else {
          notifications.error('COM_MEDIA_PLEASE_SELECT_ITEM');
        }
      });
    },
    mounted: function mounted() {
      var _this3 = this;

      // Set the full height and add event listener when dom is updated
      this.$nextTick(function () {
        _this3.setFullHeight(); // Add the global resize event listener


        window.addEventListener('resize', _this3.setFullHeight);
      }); // Initial load the data

      this.$store.dispatch('getContents', this.$store.state.selectedDirectory);
    },
    beforeUnmount: function beforeUnmount() {
      // Remove the global resize event listener
      window.removeEventListener('resize', this.setFullHeight);
    },
    methods: {
      /* Set the full height on the app container */
      setFullHeight: function setFullHeight() {
        this.fullHeight = window.innerHeight - this.$el.getBoundingClientRect().top + "px";
      }
    }
  };
  var _hoisted_1$i = {
    class: "media-container"
  };
  var _hoisted_2$f = {
    class: "media-sidebar"
  };
  var _hoisted_3$e = {
    class: "media-main"
  };

  function render$k(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_disk = resolveComponent("media-disk");

    var _component_media_toolbar = resolveComponent("media-toolbar");

    var _component_media_browser = resolveComponent("media-browser");

    var _component_media_upload = resolveComponent("media-upload");

    var _component_media_create_folder_modal = resolveComponent("media-create-folder-modal");

    var _component_media_preview_modal = resolveComponent("media-preview-modal");

    var _component_media_rename_modal = resolveComponent("media-rename-modal");

    var _component_media_share_modal = resolveComponent("media-share-modal");

    var _component_media_confirm_delete_modal = resolveComponent("media-confirm-delete-modal");

    return openBlock(), createBlock("div", _hoisted_1$i, [createVNode("div", _hoisted_2$f, [(openBlock(true), createBlock(Fragment, null, renderList($options.disks, function (disk, index) {
      return openBlock(), createBlock(_component_media_disk, {
        key: index,
        uid: index,
        disk: disk
      }, null, 8
      /* PROPS */
      , ["uid", "disk"]);
    }), 128
    /* KEYED_FRAGMENT */
    ))]), createVNode("div", _hoisted_3$e, [createVNode(_component_media_toolbar), createVNode(_component_media_browser)]), createVNode(_component_media_upload), createVNode(_component_media_create_folder_modal), createVNode(_component_media_preview_modal), createVNode(_component_media_rename_modal), createVNode(_component_media_share_modal), createVNode(_component_media_confirm_delete_modal)]);
  }

  script$k.render = render$k;
  script$k.__file = "administrator/components/com_media/resources/scripts/components/app.vue";
  var script$j = {
    name: 'MediaDisk',
    // eslint-disable-next-line vue/require-prop-types
    props: ['disk', 'uid'],
    computed: {
      diskId: function diskId() {
        return "disk-" + (this.uid + 1);
      }
    }
  };
  var _hoisted_1$h = {
    class: "media-disk"
  };

  function render$j(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_drive = resolveComponent("media-drive");

    return openBlock(), createBlock("div", _hoisted_1$h, [createVNode("h2", {
      id: $options.diskId,
      class: "media-disk-name"
    }, toDisplayString($props.disk.displayName), 9
    /* TEXT, PROPS */
    , ["id"]), (openBlock(true), createBlock(Fragment, null, renderList($props.disk.drives, function (drive, index) {
      return openBlock(), createBlock(_component_media_drive, {
        key: index,
        "disk-id": $options.diskId,
        counter: index,
        drive: drive,
        total: $props.disk.drives.length
      }, null, 8
      /* PROPS */
      , ["disk-id", "counter", "drive", "total"]);
    }), 128
    /* KEYED_FRAGMENT */
    ))]);
  }

  script$j.render = render$j;
  script$j.__file = "administrator/components/com_media/resources/scripts/components/tree/disk.vue";
  var navigable = {
    methods: {
      navigateTo: function navigateTo(path) {
        this.$store.dispatch('getContents', path);
      }
    }
  };
  var script$i = {
    name: 'MediaDrive',
    mixins: [navigable],
    // eslint-disable-next-line vue/require-prop-types
    props: ['drive', 'total', 'diskId', 'counter'],
    computed: {
      /* Whether or not the item is active */
      isActive: function isActive() {
        return this.$store.state.selectedDirectory === this.drive.root;
      },
      getTabindex: function getTabindex() {
        return this.isActive ? 0 : -1;
      }
    },
    methods: {
      /* Handle the on drive click event */
      onDriveClick: function onDriveClick() {
        this.navigateTo(this.drive.root);
      }
    }
  };
  var _hoisted_1$g = {
    class: "item-name"
  };

  function render$i(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_tree = resolveComponent("media-tree");

    return openBlock(), createBlock("div", {
      class: "media-drive",
      onClick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.onDriveClick();
      }, ["stop", "prevent"]))
    }, [createVNode("ul", {
      class: "media-tree",
      role: "tree",
      "aria-labelledby": $props.diskId
    }, [createVNode("li", {
      class: {
        active: $options.isActive,
        'media-tree-item': true,
        'media-drive-name': true
      },
      role: "treeitem",
      "aria-level": "1",
      "aria-setsize": $props.counter,
      "aria-posinset": 1,
      tabindex: $options.getTabindex
    }, [createVNode("a", null, [createVNode("span", _hoisted_1$g, toDisplayString($props.drive.displayName), 1
    /* TEXT */
    )]), createVNode(_component_media_tree, {
      root: $props.drive.root,
      level: 2
    }, null, 8
    /* PROPS */
    , ["root"])], 10
    /* CLASS, PROPS */
    , ["aria-setsize", "tabindex"])], 8
    /* PROPS */
    , ["aria-labelledby"])]);
  }

  script$i.render = render$i;
  script$i.__file = "administrator/components/com_media/resources/scripts/components/tree/drive.vue";
  var script$h = {
    name: 'MediaTree',
    props: {
      root: {
        type: String,
        required: true
      },
      level: {
        type: Number,
        required: true
      }
    },
    computed: {
      /* Get the directories */
      directories: function directories() {
        var _this4 = this;

        return this.$store.state.directories.filter(function (directory) {
          return directory.directory === _this4.root;
        }) // Sort alphabetically
        .sort(function (a, b) {
          return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
        });
      }
    }
  };
  var _hoisted_1$f = {
    class: "media-tree",
    role: "group"
  };

  function render$h(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_tree_item = resolveComponent("media-tree-item");

    return openBlock(), createBlock("ul", _hoisted_1$f, [(openBlock(true), createBlock(Fragment, null, renderList($options.directories, function (item, index) {
      return openBlock(), createBlock(_component_media_tree_item, {
        key: item.path,
        counter: index,
        item: item,
        size: $options.directories.length,
        level: $props.level
      }, null, 8
      /* PROPS */
      , ["counter", "item", "size", "level"]);
    }), 128
    /* KEYED_FRAGMENT */
    ))]);
  }

  script$h.render = render$h;
  script$h.__file = "administrator/components/com_media/resources/scripts/components/tree/tree.vue";
  var script$g = {
    name: 'MediaTreeItem',
    mixins: [navigable],
    props: {
      item: {
        type: Object,
        required: true
      },
      level: {
        type: Number,
        required: true
      },
      counter: {
        type: Number,
        required: true
      },
      size: {
        type: Number,
        required: true
      }
    },
    computed: {
      /* Whether or not the item is active */
      isActive: function isActive() {
        return this.item.path === this.$store.state.selectedDirectory;
      },

      /**
               * Whether or not the item is open
               *
               * @return  boolean
               */
      isOpen: function isOpen() {
        return this.$store.state.selectedDirectory.includes(this.item.path);
      },

      /* Whether or not the item has children */
      hasChildren: function hasChildren() {
        return this.item.directories.length > 0;
      },
      iconClass: function iconClass() {
        return {
          fas: false,
          'icon-folder': !this.isOpen,
          'icon-folder-open': this.isOpen
        };
      },
      getTabindex: function getTabindex() {
        return this.isActive ? 0 : -1;
      }
    },
    methods: {
      /* Handle the on item click event */
      onItemClick: function onItemClick() {
        this.navigateTo(this.item.path);
      }
    }
  };
  var _hoisted_1$e = {
    class: "item-icon"
  };
  var _hoisted_2$e = {
    class: "item-name"
  };

  function render$g(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_tree = resolveComponent("media-tree");

    return openBlock(), createBlock("li", {
      class: ["media-tree-item", {
        active: $options.isActive
      }],
      role: "treeitem",
      "aria-level": $props.level,
      "aria-setsize": $props.size,
      "aria-posinset": $props.counter,
      tabindex: $options.getTabindex
    }, [createVNode("a", {
      onClick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.onItemClick();
      }, ["stop", "prevent"]))
    }, [createVNode("span", _hoisted_1$e, [createVNode("span", {
      class: $options.iconClass
    }, null, 2
    /* CLASS */
    )]), createVNode("span", _hoisted_2$e, toDisplayString($props.item.name), 1
    /* TEXT */
    )]), createVNode(Transition, {
      name: "slide-fade"
    }, {
      default: withCtx(function () {
        return [$options.hasChildren ? withDirectives((openBlock(), createBlock(_component_media_tree, {
          key: 0,
          "aria-expanded": $options.isOpen ? 'true' : 'false',
          root: $props.item.path,
          level: $props.level + 1
        }, null, 8
        /* PROPS */
        , ["aria-expanded", "root", "level"])), [[vShow, $options.isOpen]]) : createCommentVNode("v-if", true)];
      }),
      _: 1
      /* STABLE */

    })], 10
    /* CLASS, PROPS */
    , ["aria-level", "aria-setsize", "aria-posinset", "tabindex"]);
  }

  script$g.render = render$g;
  script$g.__file = "administrator/components/com_media/resources/scripts/components/tree/item.vue";
  var script$f = {
    name: 'MediaToolbar',
    computed: {
      toggleListViewBtnIcon: function toggleListViewBtnIcon() {
        return this.isGridView ? 'icon-list' : 'icon-th';
      },
      toggleSelectAllBtnIcon: function toggleSelectAllBtnIcon() {
        return this.allItemsSelected ? 'icon-check-square' : 'icon-square';
      },
      isLoading: function isLoading() {
        return this.$store.state.isLoading;
      },
      atLeastOneItemSelected: function atLeastOneItemSelected() {
        return this.$store.state.selectedItems.length > 0;
      },
      isGridView: function isGridView() {
        return this.$store.state.listView === 'grid';
      },
      allItemsSelected: function allItemsSelected() {
        // eslint-disable-next-line max-len
        return this.$store.getters.getSelectedDirectoryContents.length === this.$store.state.selectedItems.length;
      }
    },
    methods: {
      toggleInfoBar: function toggleInfoBar() {
        if (this.$store.state.showInfoBar) {
          this.$store.commit(HIDE_INFOBAR);
        } else {
          this.$store.commit(SHOW_INFOBAR);
        }
      },
      decreaseGridSize: function decreaseGridSize() {
        if (!this.isGridSize('sm')) {
          this.$store.commit(DECREASE_GRID_SIZE);
        }
      },
      increaseGridSize: function increaseGridSize() {
        if (!this.isGridSize('xl')) {
          this.$store.commit(INCREASE_GRID_SIZE);
        }
      },
      changeListView: function changeListView() {
        if (this.$store.state.listView === 'grid') {
          this.$store.commit(CHANGE_LIST_VIEW, 'table');
        } else {
          this.$store.commit(CHANGE_LIST_VIEW, 'grid');
        }
      },
      toggleSelectAll: function toggleSelectAll() {
        if (this.allItemsSelected) {
          this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        } else {
          // eslint-disable-next-line max-len
          this.$store.commit(SELECT_BROWSER_ITEMS, this.$store.getters.getSelectedDirectoryContents);
        }
      },
      isGridSize: function isGridSize(size) {
        return this.$store.state.gridSize === size;
      },
      changeSearch: function changeSearch(query) {
        this.$store.commit(SET_SEARCH_QUERY, query.target.value);
      }
    }
  };
  var _hoisted_1$d = {
    key: 0,
    class: "media-loader"
  };
  var _hoisted_2$d = {
    class: "media-view-icons"
  };
  var _hoisted_3$d = {
    class: "media-view-search-input",
    role: "search"
  };
  var _hoisted_4$9 = {
    for: "media_search",
    class: "visually-hidden"
  };
  var _hoisted_5$5 = {
    class: "media-view-icons"
  };

  var _hoisted_6$3 = /*#__PURE__*/createVNode("span", {
    class: "icon-search-minus",
    "aria-hidden": "true"
  }, null, -1
  /* HOISTED */
  );

  var _hoisted_7$3 = /*#__PURE__*/createVNode("span", {
    class: "icon-search-plus",
    "aria-hidden": "true"
  }, null, -1
  /* HOISTED */
  );

  var _hoisted_8$2 = /*#__PURE__*/createVNode("span", {
    class: "icon-info",
    "aria-hidden": "true"
  }, null, -1
  /* HOISTED */
  );

  function render$f(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_breadcrumb = resolveComponent("media-breadcrumb");

    return openBlock(), createBlock("div", {
      class: "media-toolbar",
      role: "toolbar",
      "aria-label": _ctx.translate('COM_MEDIA_TOOLBAR_LABEL')
    }, [$options.isLoading ? (openBlock(), createBlock("div", _hoisted_1$d)) : createCommentVNode("v-if", true), createVNode("div", _hoisted_2$d, [createVNode("a", {
      href: "#",
      class: "media-toolbar-icon media-toolbar-select-all",
      "aria-label": _ctx.translate('COM_MEDIA_SELECT_ALL'),
      onClick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.toggleSelectAll();
      }, ["stop", "prevent"]))
    }, [createVNode("span", {
      class: $options.toggleSelectAllBtnIcon,
      "aria-hidden": "true"
    }, null, 2
    /* CLASS */
    )], 8
    /* PROPS */
    , ["aria-label"])]), createVNode(_component_media_breadcrumb), createVNode("div", _hoisted_3$d, [createVNode("label", _hoisted_4$9, toDisplayString(_ctx.translate('COM_MEDIA_SEARCH')), 1
    /* TEXT */
    ), createVNode("input", {
      id: "media_search",
      class: "form-control",
      type: "text",
      placeholder: _ctx.translate('COM_MEDIA_SEARCH'),
      onInput: _cache[2] || (_cache[2] = function () {
        return $options.changeSearch && $options.changeSearch.apply($options, arguments);
      })
    }, null, 40
    /* PROPS, HYDRATE_EVENTS */
    , ["placeholder"])]), createVNode("div", _hoisted_5$5, [$options.isGridView ? (openBlock(), createBlock("button", {
      key: 0,
      type: "button",
      class: ["media-toolbar-icon media-toolbar-decrease-grid-size", {
        disabled: $options.isGridSize('sm')
      }],
      "aria-label": _ctx.translate('COM_MEDIA_DECREASE_GRID'),
      onClick: _cache[3] || (_cache[3] = withModifiers(function ($event) {
        return $options.decreaseGridSize();
      }, ["stop", "prevent"]))
    }, [_hoisted_6$3], 10
    /* CLASS, PROPS */
    , ["aria-label"])) : createCommentVNode("v-if", true), $options.isGridView ? (openBlock(), createBlock("button", {
      key: 1,
      type: "button",
      class: ["media-toolbar-icon media-toolbar-increase-grid-size", {
        disabled: $options.isGridSize('xl')
      }],
      "aria-label": _ctx.translate('COM_MEDIA_INCREASE_GRID'),
      onClick: _cache[4] || (_cache[4] = withModifiers(function ($event) {
        return $options.increaseGridSize();
      }, ["stop", "prevent"]))
    }, [_hoisted_7$3], 10
    /* CLASS, PROPS */
    , ["aria-label"])) : createCommentVNode("v-if", true), createVNode("button", {
      type: "button",
      href: "#",
      class: "media-toolbar-icon media-toolbar-list-view",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_LIST_VIEW'),
      onClick: _cache[5] || (_cache[5] = withModifiers(function ($event) {
        return $options.changeListView();
      }, ["stop", "prevent"]))
    }, [createVNode("span", {
      class: $options.toggleListViewBtnIcon,
      "aria-hidden": "true"
    }, null, 2
    /* CLASS */
    )], 8
    /* PROPS */
    , ["aria-label"]), createVNode("button", {
      type: "button",
      href: "#",
      class: "media-toolbar-icon media-toolbar-info",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_INFO'),
      onClick: _cache[6] || (_cache[6] = withModifiers(function () {
        return $options.toggleInfoBar && $options.toggleInfoBar.apply($options, arguments);
      }, ["stop", "prevent"]))
    }, [_hoisted_8$2], 8
    /* PROPS */
    , ["aria-label"])])], 8
    /* PROPS */
    , ["aria-label"]);
  }

  script$f.render = render$f;
  script$f.__file = "administrator/components/com_media/resources/scripts/components/toolbar/toolbar.vue";
  var script$e = {
    name: 'MediaBreadcrumb',
    mixins: [navigable],
    computed: {
      /* Get the crumbs from the current directory path */
      crumbs: function crumbs() {
        var _this5 = this;

        var items = [];
        var parts = this.$store.state.selectedDirectory.split('/'); // Add the drive as first element

        if (parts) {
          var drive = this.findDrive(parts[0]);

          if (drive) {
            items.push(drive);
            parts.shift();
          }
        }

        parts.filter(function (crumb) {
          return crumb.length !== 0;
        }).forEach(function (crumb) {
          items.push({
            name: crumb,
            path: _this5.$store.state.selectedDirectory.split(crumb)[0] + crumb
          });
        });
        return items;
      },

      /* Whether or not the crumb is the last element in the list */
      isLast: function isLast(item) {
        return this.crumbs.indexOf(item) === this.crumbs.length - 1;
      }
    },
    methods: {
      /* Handle the on crumb click event */
      onCrumbClick: function onCrumbClick(crumb) {
        this.navigateTo(crumb.path);
      },
      findDrive: function findDrive(adapter) {
        var driveObject = null;
        this.$store.state.disks.forEach(function (disk) {
          disk.drives.forEach(function (drive) {
            if (drive.root.startsWith(adapter)) {
              driveObject = {
                name: drive.displayName,
                path: drive.root
              };
            }
          });
        });
        return driveObject;
      }
    }
  };

  function render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("nav", {
      class: "media-breadcrumb",
      role: "navigation",
      "aria-label": _ctx.translate('COM_MEDIA_BREADCRUMB_LABEL')
    }, [createVNode("ol", null, [(openBlock(true), createBlock(Fragment, null, renderList($options.crumbs, function (val, index) {
      return openBlock(), createBlock("li", {
        key: index,
        class: "media-breadcrumb-item"
      }, [createVNode("a", {
        href: "#",
        "aria-current": index === Object.keys($options.crumbs).length - 1 ? 'page' : undefined,
        onClick: withModifiers(function ($event) {
          return $options.onCrumbClick(val);
        }, ["stop", "prevent"])
      }, toDisplayString(val.name), 9
      /* TEXT, PROPS */
      , ["aria-current", "onClick"])]);
    }), 128
    /* KEYED_FRAGMENT */
    ))])], 8
    /* PROPS */
    , ["aria-label"]);
  }

  script$e.render = render$e;
  script$e.__file = "administrator/components/com_media/resources/scripts/components/breadcrumb/breadcrumb.vue";
  var script$d = {
    name: 'MediaBrowser',
    computed: {
      /* Get the contents of the currently selected directory */
      items: function items() {
        var _this6 = this;

        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        var directories = this.$store.getters.getSelectedDirectoryDirectories // Sort by type and alphabetically
        .sort(function (a, b) {
          return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
        }).filter(function (dir) {
          return dir.name.toLowerCase().includes(_this6.$store.state.search.toLowerCase());
        }); // eslint-disable-next-line vue/no-side-effects-in-computed-properties

        var files = this.$store.getters.getSelectedDirectoryFiles // Sort by type and alphabetically
        .sort(function (a, b) {
          return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
        }).filter(function (file) {
          return file.name.toLowerCase().includes(_this6.$store.state.search.toLowerCase());
        });
        return [].concat(directories, files);
      },

      /* The styles for the media-browser element */
      mediaBrowserStyles: function mediaBrowserStyles() {
        return {
          width: this.$store.state.showInfoBar ? '75%' : '100%'
        };
      },

      /* The styles for the media-browser element */
      listView: function listView() {
        return this.$store.state.listView;
      },
      mediaBrowserGridItemsClass: function mediaBrowserGridItemsClass() {
        var _ref30;

        return _ref30 = {}, _ref30["media-browser-items-" + this.$store.state.gridSize] = true, _ref30;
      },
      isModal: function isModal() {
        return Joomla.getOptions('com_media', {}).isModal;
      },
      currentDirectory: function currentDirectory() {
        var parts = this.$store.state.selectedDirectory.split('/').filter(function (crumb) {
          return crumb.length !== 0;
        }); // The first part is the name of the drive, so if we have a folder name display it. Else
        // find the filename

        if (parts.length !== 1) {
          return parts[parts.length - 1];
        }

        var diskName = '';
        this.$store.state.disks.forEach(function (disk) {
          disk.drives.forEach(function (drive) {
            if (drive.root === parts[0] + "/") {
              diskName = drive.displayName;
            }
          });
        });
        return diskName;
      }
    },
    created: function created() {
      document.body.addEventListener('click', this.unselectAllBrowserItems, false);
    },
    beforeUnmount: function beforeUnmount() {
      document.body.removeEventListener('click', this.unselectAllBrowserItems, false);
    },
    methods: {
      /* Unselect all browser items */
      unselectAllBrowserItems: function unselectAllBrowserItems(event) {
        var clickedDelete = !!(event.target.id !== undefined && event.target.id === 'mediaDelete');
        var notClickedBrowserItems = this.$refs.browserItems && !this.$refs.browserItems.contains(event.target) || event.target === this.$refs.browserItems;
        var notClickedInfobar = this.$refs.infobar !== undefined && !this.$refs.infobar.$el.contains(event.target);
        var clickedOutside = notClickedBrowserItems && notClickedInfobar && !clickedDelete;

        if (clickedOutside) {
          this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
          window.parent.document.dispatchEvent(new CustomEvent('onMediaFileSelected', {
            bubbles: true,
            cancelable: false,
            detail: {
              path: '',
              thumb: false,
              fileType: false,
              extension: false
            }
          }));
        }
      },
      // Listeners for drag and drop
      // Fix for Chrome
      onDragEnter: function onDragEnter(e) {
        e.stopPropagation();
        return false;
      },
      // Notify user when file is over the drop area
      onDragOver: function onDragOver(e) {
        e.preventDefault();
        document.querySelector('.media-dragoutline').classList.add('active');
        return false;
      },

      /* Upload files */
      upload: function upload(file) {
        var _this7 = this;

        // Create a new file reader instance
        var reader = new FileReader(); // Add the on load callback

        reader.onload = function (progressEvent) {
          var result = progressEvent.target.result;
          var splitIndex = result.indexOf('base64') + 7;
          var content = result.slice(splitIndex, result.length); // Upload the file

          _this7.$store.dispatch('uploadFile', {
            name: file.name,
            parent: _this7.$store.state.selectedDirectory,
            content: content
          });
        };

        reader.readAsDataURL(file);
      },
      // Logic for the dropped file
      onDrop: function onDrop(e) {
        e.preventDefault(); // Loop through array of files and upload each file

        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          // eslint-disable-next-line no-plusplus,no-cond-assign
          for (var _i39 = 0, f; f = e.dataTransfer.files[_i39]; _i39++) {
            document.querySelector('.media-dragoutline').classList.remove('active');
            this.upload(f);
          }
        }

        document.querySelector('.media-dragoutline').classList.remove('active');
      },
      // Reset the drop area border
      onDragLeave: function onDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        document.querySelector('.media-dragoutline').classList.remove('active');
        return false;
      }
    }
  };
  var _hoisted_1$c = {
    class: "media-dragoutline"
  };

  var _hoisted_2$c = /*#__PURE__*/createVNode("span", {
    class: "icon-cloud-upload upload-icon",
    "aria-hidden": "true"
  }, null, -1
  /* HOISTED */
  );

  var _hoisted_3$c = {
    key: 0,
    class: "table media-browser-table"
  };
  var _hoisted_4$8 = {
    class: "visually-hidden"
  };
  var _hoisted_5$4 = {
    class: "media-browser-table-head"
  };

  var _hoisted_6$2 = /*#__PURE__*/createVNode("th", {
    class: "type",
    scope: "col"
  }, null, -1
  /* HOISTED */
  );

  var _hoisted_7$2 = {
    class: "name",
    scope: "col"
  };
  var _hoisted_8$1 = {
    class: "size",
    scope: "col"
  };
  var _hoisted_9$1 = {
    class: "dimension",
    scope: "col"
  };
  var _hoisted_10$1 = {
    class: "created",
    scope: "col"
  };
  var _hoisted_11$1 = {
    class: "modified",
    scope: "col"
  };
  var _hoisted_12$1 = {
    key: 1,
    class: "media-browser-grid"
  };

  function render$d(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_browser_item_row = resolveComponent("media-browser-item-row");

    var _component_media_browser_item = resolveComponent("media-browser-item");

    var _component_media_infobar = resolveComponent("media-infobar");

    return openBlock(), createBlock("div", null, [createVNode("div", {
      ref: "browserItems",
      class: "media-browser",
      style: $options.mediaBrowserStyles,
      onDragenter: _cache[1] || (_cache[1] = function () {
        return $options.onDragEnter && $options.onDragEnter.apply($options, arguments);
      }),
      onDrop: _cache[2] || (_cache[2] = function () {
        return $options.onDrop && $options.onDrop.apply($options, arguments);
      }),
      onDragover: _cache[3] || (_cache[3] = function () {
        return $options.onDragOver && $options.onDragOver.apply($options, arguments);
      }),
      onDragleave: _cache[4] || (_cache[4] = function () {
        return $options.onDragLeave && $options.onDragLeave.apply($options, arguments);
      })
    }, [createVNode("div", _hoisted_1$c, [_hoisted_2$c, createVNode("p", null, toDisplayString(_ctx.translate('COM_MEDIA_DROP_FILE')), 1
    /* TEXT */
    )]), $options.listView === 'table' ? (openBlock(), createBlock("table", _hoisted_3$c, [createVNode("caption", _hoisted_4$8, toDisplayString(_ctx.sprintf('COM_MEDIA_BROWSER_TABLE_CAPTION', $options.currentDirectory)), 1
    /* TEXT */
    ), createVNode("thead", _hoisted_5$4, [createVNode("tr", null, [_hoisted_6$2, createVNode("th", _hoisted_7$2, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_NAME')), 1
    /* TEXT */
    ), createVNode("th", _hoisted_8$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_SIZE')), 1
    /* TEXT */
    ), createVNode("th", _hoisted_9$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DIMENSION')), 1
    /* TEXT */
    ), createVNode("th", _hoisted_10$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_CREATED')), 1
    /* TEXT */
    ), createVNode("th", _hoisted_11$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')), 1
    /* TEXT */
    )])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList($options.items, function (item) {
      return openBlock(), createBlock(_component_media_browser_item_row, {
        key: item.path,
        item: item
      }, null, 8
      /* PROPS */
      , ["item"]);
    }), 128
    /* KEYED_FRAGMENT */
    ))])])) : $options.listView === 'grid' ? (openBlock(), createBlock("div", _hoisted_12$1, [createVNode("div", {
      class: ["media-browser-items", $options.mediaBrowserGridItemsClass]
    }, [(openBlock(true), createBlock(Fragment, null, renderList($options.items, function (item) {
      return openBlock(), createBlock(_component_media_browser_item, {
        key: item.path,
        item: item
      }, null, 8
      /* PROPS */
      , ["item"]);
    }), 128
    /* KEYED_FRAGMENT */
    ))], 2
    /* CLASS */
    )])) : createCommentVNode("v-if", true)], 36
    /* STYLE, HYDRATE_EVENTS */
    ), createVNode(_component_media_infobar, {
      ref: "infobar"
    }, null, 512
    /* NEED_PATCH */
    )]);
  }

  script$d.render = render$d;
  script$d.__file = "administrator/components/com_media/resources/scripts/components/browser/browser.vue";
  var script$c = {
    name: 'MediaBrowserItemDirectory',
    mixins: [navigable],
    // eslint-disable-next-line vue/require-prop-types
    props: ['item', 'focused'],
    data: function data() {
      return {
        showActions: false
      };
    },
    methods: {
      /* Handle the on preview double click event */
      onPreviewDblClick: function onPreviewDblClick() {
        this.navigateTo(this.item.path);
      },

      /* Opening confirm delete modal */
      openConfirmDeleteModal: function openConfirmDeleteModal() {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
      },

      /* Rename an item */
      openRenameModal: function openRenameModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_RENAME_MODAL);
      },

      /* Open actions dropdown */
      openActions: function openActions() {
        var _this8 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this8.$refs.actionRename.focus();
        });
      },

      /* Open actions dropdown and focus on last element */
      openLastActions: function openLastActions() {
        var _this9 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this9.$refs.actionDelete.focus();
        });
      },

      /* Hide actions dropdown */
      hideActions: function hideActions() {
        var _this10 = this;

        this.showActions = false; // eslint-disable-next-line no-unused-expressions

        this.$nextTick(function () {
          _this10.$refs.actionToggle ? _this10.$refs.actionToggle.focus() : false;
        });
      }
    }
  };

  var _hoisted_1$b = /*#__PURE__*/createVNode("div", {
    class: "file-background"
  }, [/*#__PURE__*/createVNode("div", {
    class: "folder-icon"
  }, [/*#__PURE__*/createVNode("span", {
    class: "icon-folder"
  })])], -1
  /* HOISTED */
  );

  var _hoisted_2$b = {
    class: "media-browser-item-info"
  };
  var _hoisted_3$b = {
    key: 0,
    class: "media-browser-actions-list"
  };

  function render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("div", {
      class: "media-browser-item-directory",
      onMouseleave: _cache[25] || (_cache[25] = function ($event) {
        return $options.hideActions();
      })
    }, [createVNode("div", {
      class: "media-browser-item-preview",
      onDblclick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.onPreviewDblClick();
      }, ["stop", "prevent"]))
    }, [_hoisted_1$b], 32
    /* HYDRATE_EVENTS */
    ), createVNode("div", _hoisted_2$b, toDisplayString($props.item.name), 1
    /* TEXT */
    ), createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8
    /* PROPS */
    , ["aria-label", "title"]), createVNode("div", {
      class: ["media-browser-actions", {
        'active': $data.showActions
      }]
    }, [createVNode("button", {
      ref: "actionToggle",
      class: "action-toggle",
      type: "button",
      "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      onKeyup: [_cache[3] || (_cache[3] = withKeys(function ($event) {
        return $options.openActions();
      }, ["enter"])), _cache[6] || (_cache[6] = withKeys(function ($event) {
        return $options.openActions();
      }, ["space"])), _cache[7] || (_cache[7] = withKeys(function ($event) {
        return $options.openActions();
      }, ["down"])), _cache[8] || (_cache[8] = withKeys(function ($event) {
        return $options.openLastActions();
      }, ["up"]))],
      onFocus: _cache[4] || (_cache[4] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[5] || (_cache[5] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-ellipsis-h",
      "aria-hidden": "true",
      onClick: _cache[2] || (_cache[2] = withModifiers(function ($event) {
        return $options.openActions();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"]), $data.showActions ? (openBlock(), createBlock("div", _hoisted_3$b, [createVNode("ul", null, [createVNode("li", null, [createVNode("button", {
      ref: "actionRename",
      type: "button",
      class: "action-rename",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      onKeyup: [_cache[10] || (_cache[10] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["enter"])), _cache[11] || (_cache[11] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["space"])), _cache[14] || (_cache[14] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[15] || (_cache[15] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["up"])), _cache[16] || (_cache[16] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["down"]))],
      onFocus: _cache[12] || (_cache[12] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[13] || (_cache[13] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-text-width",
      "aria-hidden": "true",
      onClick: _cache[9] || (_cache[9] = withModifiers(function ($event) {
        return $options.openRenameModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionDelete",
      type: "button",
      class: "action-delete",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      onKeyup: [_cache[18] || (_cache[18] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["enter"])), _cache[19] || (_cache[19] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["space"])), _cache[22] || (_cache[22] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[23] || (_cache[23] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["up"])), _cache[24] || (_cache[24] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["down"]))],
      onFocus: _cache[20] || (_cache[20] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[21] || (_cache[21] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-trash",
      "aria-hidden": "true",
      onClick: _cache[17] || (_cache[17] = withModifiers(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])])])])) : createCommentVNode("v-if", true)], 2
    /* CLASS */
    )], 32
    /* HYDRATE_EVENTS */
    );
  }

  script$c.render = render$c;
  script$c.__file = "administrator/components/com_media/resources/scripts/components/browser/items/directory.vue";
  var script$b = {
    name: 'MediaBrowserItemFile',
    // eslint-disable-next-line vue/require-prop-types
    props: ['item', 'focused'],
    data: function data() {
      return {
        showActions: false
      };
    },
    methods: {
      /* Preview an item */
      download: function download() {
        this.$store.dispatch('download', this.item);
      },

      /* Opening confirm delete modal */
      openConfirmDeleteModal: function openConfirmDeleteModal() {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
      },

      /* Rename an item */
      openRenameModal: function openRenameModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_RENAME_MODAL);
      },

      /* Open modal for share url */
      openShareUrlModal: function openShareUrlModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_SHARE_MODAL);
      },

      /* Open actions dropdown */
      openActions: function openActions() {
        var _this11 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this11.$refs.actionDownload.focus();
        });
      },

      /* Open actions dropdown and focus on last element */
      openLastActions: function openLastActions() {
        var _this12 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this12.$refs.actionDelete.focus();
        });
      },

      /* Hide actions dropdown */
      hideActions: function hideActions() {
        var _this13 = this;

        this.showActions = false;
        this.$nextTick(function () {
          return _this13.$refs.actionToggle.focus();
        });
      }
    }
  };

  var _hoisted_1$a = /*#__PURE__*/createVNode("div", {
    class: "media-browser-item-preview"
  }, [/*#__PURE__*/createVNode("div", {
    class: "file-background"
  }, [/*#__PURE__*/createVNode("div", {
    class: "file-icon"
  }, [/*#__PURE__*/createVNode("span", {
    class: "icon-file-alt"
  })])])], -1
  /* HOISTED */
  );

  var _hoisted_2$a = {
    class: "media-browser-item-info"
  };
  var _hoisted_3$a = {
    key: 0,
    class: "media-browser-actions-list"
  };

  function render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("div", {
      class: "media-browser-item-file",
      onMouseleave: _cache[37] || (_cache[37] = function ($event) {
        return $options.hideActions();
      })
    }, [_hoisted_1$a, createVNode("div", _hoisted_2$a, toDisplayString($props.item.name) + " " + toDisplayString($props.item.filetype), 1
    /* TEXT */
    ), createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8
    /* PROPS */
    , ["aria-label", "title"]), createVNode("div", {
      class: ["media-browser-actions", {
        'active': $data.showActions
      }]
    }, [createVNode("button", {
      ref: "actionToggle",
      href: "#",
      class: "action-toggle",
      type: "button",
      "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      onKeyup: [_cache[2] || (_cache[2] = withKeys(function ($event) {
        return $options.openActions();
      }, ["enter"])), _cache[5] || (_cache[5] = withKeys(function ($event) {
        return $options.openActions();
      }, ["space"])), _cache[6] || (_cache[6] = withKeys(function ($event) {
        return $options.openActions();
      }, ["down"])), _cache[7] || (_cache[7] = withKeys(function ($event) {
        return $options.openLastActions();
      }, ["up"]))],
      onFocus: _cache[3] || (_cache[3] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[4] || (_cache[4] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-ellipsis-h",
      "aria-hidden": "true",
      onClick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.openActions();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"]), $data.showActions ? (openBlock(), createBlock("div", _hoisted_3$a, [createVNode("ul", null, [createVNode("li", null, [createVNode("button", {
      ref: "actionDownload",
      type: "button",
      class: "action-download",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
      title: _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
      onKeyup: [_cache[9] || (_cache[9] = withKeys(function ($event) {
        return $options.download();
      }, ["enter"])), _cache[10] || (_cache[10] = withKeys(function ($event) {
        return $options.download();
      }, ["space"])), _cache[11] || (_cache[11] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["up"])), _cache[12] || (_cache[12] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["down"]))]
    }, [createVNode("span", {
      class: "image-browser-action icon-download",
      "aria-hidden": "true",
      onClick: _cache[8] || (_cache[8] = withModifiers(function ($event) {
        return $options.download();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionRename",
      type: "button",
      class: "action-rename",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      onKeyup: [_cache[14] || (_cache[14] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["space"])), _cache[15] || (_cache[15] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["enter"])), _cache[18] || (_cache[18] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[19] || (_cache[19] = withKeys(function ($event) {
        return _ctx.$refs.actionDownload.focus();
      }, ["up"])), _cache[20] || (_cache[20] = withKeys(function ($event) {
        return _ctx.$refs.actionUrl.focus();
      }, ["down"]))],
      onFocus: _cache[16] || (_cache[16] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[17] || (_cache[17] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-text-width",
      "aria-hidden": "true",
      onClick: _cache[13] || (_cache[13] = withModifiers(function ($event) {
        return $options.openRenameModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionUrl",
      type: "button",
      class: "action-url",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_SHARE'),
      title: _ctx.translate('COM_MEDIA_ACTION_SHARE'),
      onKeyup: [_cache[22] || (_cache[22] = withKeys(function ($event) {
        return $options.openShareUrlModal();
      }, ["space"])), _cache[23] || (_cache[23] = withKeys(function ($event) {
        return $options.openShareUrlModal();
      }, ["enter"])), _cache[26] || (_cache[26] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[27] || (_cache[27] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["up"])), _cache[28] || (_cache[28] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["down"]))],
      onFocus: _cache[24] || (_cache[24] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[25] || (_cache[25] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-link",
      "aria-hidden": "true",
      onClick: _cache[21] || (_cache[21] = withModifiers(function ($event) {
        return $options.openShareUrlModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionDelete",
      type: "button",
      class: "action-delete",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      onKeyup: [_cache[30] || (_cache[30] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["space"])), _cache[31] || (_cache[31] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["enter"])), _cache[34] || (_cache[34] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[35] || (_cache[35] = withKeys(function ($event) {
        return _ctx.$refs.actionUrl.focus();
      }, ["up"])), _cache[36] || (_cache[36] = withKeys(function ($event) {
        return _ctx.$refs.actionDownload.focus();
      }, ["down"]))],
      onFocus: _cache[32] || (_cache[32] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[33] || (_cache[33] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-trash",
      "aria-hidden": "true",
      onClick: _cache[29] || (_cache[29] = withModifiers(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])])])])) : createCommentVNode("v-if", true)], 2
    /* CLASS */
    )], 32
    /* HYDRATE_EVENTS */
    );
  }

  script$b.render = render$b;
  script$b.__file = "administrator/components/com_media/resources/scripts/components/browser/items/file.vue";
  var script$a = {
    name: 'MediaBrowserItemImage',
    // eslint-disable-next-line vue/require-prop-types
    props: ['item', 'focused'],
    data: function data() {
      return {
        showActions: false
      };
    },
    computed: {
      /* Get the item url */
      thumbUrl: function thumbUrl() {
        return this.item.thumb_path;
      },

      /* Check if the item is an image to edit */
      canEdit: function canEdit() {
        return ['jpg', 'jpeg', 'png'].indexOf(this.item.extension.toLowerCase()) > -1;
      }
    },
    methods: {
      /* Preview an item */
      openPreview: function openPreview() {
        this.$store.commit(SHOW_PREVIEW_MODAL);
        this.$store.dispatch('getFullContents', this.item);
      },

      /* Preview an item */
      download: function download() {
        this.$store.dispatch('download', this.item);
      },

      /* Opening confirm delete modal */
      openConfirmDeleteModal: function openConfirmDeleteModal() {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
      },

      /* Rename an item */
      openRenameModal: function openRenameModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_RENAME_MODAL);
      },

      /* Edit an item */
      editItem: function editItem() {
        // TODO should we use relative urls here?
        var fileBaseUrl = Joomla.getOptions('com_media').editViewUrl + "&path=";
        window.location.href = fileBaseUrl + this.item.path;
      },

      /* Open modal for share url */
      openShareUrlModal: function openShareUrlModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_SHARE_MODAL);
      },

      /* Open actions dropdown */
      openActions: function openActions() {
        var _this14 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this14.$refs.actionPreview.focus();
        });
      },

      /* Open actions dropdown and focus on last element */
      openLastActions: function openLastActions() {
        var _this15 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this15.$refs.actionDelete.focus();
        });
      },

      /* Hide actions dropdown */
      hideActions: function hideActions() {
        var _this16 = this;

        this.showActions = false;
        this.$nextTick(function () {
          return _this16.$refs.actionToggle.focus();
        });
      }
    }
  };
  var _hoisted_1$9 = {
    class: "media-browser-item-preview"
  };
  var _hoisted_2$9 = {
    class: "image-background"
  };
  var _hoisted_3$9 = {
    class: "media-browser-item-info"
  };
  var _hoisted_4$7 = {
    key: 0,
    class: "media-browser-actions-list"
  };
  var _hoisted_5$3 = {
    key: 0
  };

  function render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("div", {
      class: "media-browser-image",
      onDblclick: _cache[56] || (_cache[56] = function ($event) {
        return $options.openPreview();
      }),
      onMouseleave: _cache[57] || (_cache[57] = function ($event) {
        return $options.hideActions();
      })
    }, [createVNode("div", _hoisted_1$9, [createVNode("div", _hoisted_2$9, [createVNode("div", {
      class: "image-cropped",
      style: {
        backgroundImage: 'url(' + $options.thumbUrl + ')'
      }
    }, null, 4
    /* STYLE */
    )])]), createVNode("div", _hoisted_3$9, toDisplayString($props.item.name) + " " + toDisplayString($props.item.filetype), 1
    /* TEXT */
    ), createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8
    /* PROPS */
    , ["aria-label", "title"]), createVNode("div", {
      class: ["media-browser-actions", {
        'active': $data.showActions
      }]
    }, [createVNode("button", {
      ref: "actionToggle",
      type: "button",
      class: "action-toggle",
      "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      onKeyup: [_cache[2] || (_cache[2] = withKeys(function ($event) {
        return $options.openActions();
      }, ["enter"])), _cache[5] || (_cache[5] = withKeys(function ($event) {
        return $options.openActions();
      }, ["space"])), _cache[6] || (_cache[6] = withKeys(function ($event) {
        return $options.openActions();
      }, ["down"])), _cache[7] || (_cache[7] = withKeys(function ($event) {
        return $options.openLastActions();
      }, ["up"]))],
      onFocus: _cache[3] || (_cache[3] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[4] || (_cache[4] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-ellipsis-h",
      "aria-hidden": "true",
      onClick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.openActions();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"]), $data.showActions ? (openBlock(), createBlock("div", _hoisted_4$7, [createVNode("ul", null, [createVNode("li", null, [createVNode("button", {
      ref: "actionPreview",
      type: "button",
      class: "action-preview",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
      title: _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
      onKeyup: [_cache[9] || (_cache[9] = withKeys(function ($event) {
        return $options.openPreview();
      }, ["enter"])), _cache[10] || (_cache[10] = withKeys(function ($event) {
        return $options.openPreview();
      }, ["space"])), _cache[13] || (_cache[13] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[14] || (_cache[14] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["up"])), _cache[15] || (_cache[15] = withKeys(function ($event) {
        return _ctx.$refs.actionDownload.focus();
      }, ["down"]))],
      onFocus: _cache[11] || (_cache[11] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[12] || (_cache[12] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-search-plus",
      "aria-hidden": "true",
      onClick: _cache[8] || (_cache[8] = withModifiers(function ($event) {
        return $options.openPreview();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionDownload",
      type: "button",
      class: "action-download",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
      title: _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
      onKeyup: [_cache[17] || (_cache[17] = withKeys(function ($event) {
        return $options.download();
      }, ["enter"])), _cache[18] || (_cache[18] = withKeys(function ($event) {
        return $options.download();
      }, ["space"])), _cache[21] || (_cache[21] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[22] || (_cache[22] = withKeys(function ($event) {
        return _ctx.$refs.actionPreview.focus();
      }, ["up"])), _cache[23] || (_cache[23] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["down"]))],
      onFocus: _cache[19] || (_cache[19] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[20] || (_cache[20] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-download",
      "aria-hidden": "true",
      onClick: _cache[16] || (_cache[16] = withModifiers(function ($event) {
        return $options.download();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionRename",
      type: "button",
      class: "action-rename",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      onKeyup: [_cache[25] || (_cache[25] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["enter"])), _cache[26] || (_cache[26] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["space"])), _cache[29] || (_cache[29] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[30] || (_cache[30] = withKeys(function ($event) {
        return _ctx.$refs.actionDownload.focus();
      }, ["up"])), _cache[31] || (_cache[31] = withKeys(function ($event) {
        return $options.canEdit ? _ctx.$refs.actionEdit.focus() : _ctx.$refs.actionShare.focus();
      }, ["down"]))],
      onFocus: _cache[27] || (_cache[27] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[28] || (_cache[28] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-text-width",
      "aria-hidden": "true",
      onClick: _cache[24] || (_cache[24] = withModifiers(function ($event) {
        return $options.openRenameModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), $options.canEdit ? (openBlock(), createBlock("li", _hoisted_5$3, [createVNode("button", {
      ref: "actionEdit",
      type: "button",
      class: "action-edit",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_EDIT'),
      title: _ctx.translate('COM_MEDIA_ACTION_EDIT'),
      onKeyup: [_cache[33] || (_cache[33] = withKeys(function ($event) {
        return $options.editItem();
      }, ["enter"])), _cache[34] || (_cache[34] = withKeys(function ($event) {
        return $options.editItem();
      }, ["space"])), _cache[37] || (_cache[37] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[38] || (_cache[38] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["up"])), _cache[39] || (_cache[39] = withKeys(function ($event) {
        return _ctx.$refs.actionShare.focus();
      }, ["down"]))],
      onFocus: _cache[35] || (_cache[35] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[36] || (_cache[36] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-pencil-alt",
      "aria-hidden": "true",
      onClick: _cache[32] || (_cache[32] = withModifiers(function ($event) {
        return $options.editItem();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])])) : createCommentVNode("v-if", true), createVNode("li", null, [createVNode("button", {
      ref: "actionShare",
      type: "button",
      class: "action-url",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_SHARE'),
      title: _ctx.translate('COM_MEDIA_ACTION_SHARE'),
      onKeyup: [_cache[41] || (_cache[41] = withKeys(function ($event) {
        return $options.openShareUrlModal();
      }, ["enter"])), _cache[42] || (_cache[42] = withKeys(function ($event) {
        return $options.openShareUrlModal();
      }, ["space"])), _cache[45] || (_cache[45] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[46] || (_cache[46] = withKeys(function ($event) {
        return $options.canEdit ? _ctx.$refs.actionEdit.focus() : _ctx.$refs.actionRename.focus();
      }, ["up"])), _cache[47] || (_cache[47] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["down"]))],
      onFocus: _cache[43] || (_cache[43] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[44] || (_cache[44] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-link",
      "aria-hidden": "true",
      onClick: _cache[40] || (_cache[40] = withModifiers(function ($event) {
        return $options.openShareUrlModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionDelete",
      type: "button",
      class: "action-delete",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      onKeyup: [_cache[49] || (_cache[49] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["enter"])), _cache[50] || (_cache[50] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["space"])), _cache[53] || (_cache[53] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[54] || (_cache[54] = withKeys(function ($event) {
        return _ctx.$refs.actionShare.focus();
      }, ["up"])), _cache[55] || (_cache[55] = withKeys(function ($event) {
        return _ctx.$refs.actionPreview.focus();
      }, ["down"]))],
      onFocus: _cache[51] || (_cache[51] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[52] || (_cache[52] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-trash",
      "aria-hidden": "true",
      onClick: _cache[48] || (_cache[48] = withModifiers(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])])])])) : createCommentVNode("v-if", true)], 2
    /* CLASS */
    )], 32
    /* HYDRATE_EVENTS */
    );
  }

  script$a.render = render$a;
  script$a.__file = "administrator/components/com_media/resources/scripts/components/browser/items/image.vue";
  var script$9 = {
    name: 'MediaBrowserItemVideo',
    // eslint-disable-next-line vue/require-prop-types
    props: ['item', 'focused'],
    data: function data() {
      return {
        showActions: false
      };
    },
    methods: {
      /* Preview an item */
      openPreview: function openPreview() {
        this.$store.commit(SHOW_PREVIEW_MODAL);
        this.$store.dispatch('getFullContents', this.item);
      },

      /* Preview an item */
      download: function download() {
        this.$store.dispatch('download', this.item);
      },

      /* Opening confirm delete modal */
      openConfirmDeleteModal: function openConfirmDeleteModal() {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
      },

      /* Rename an item */
      openRenameModal: function openRenameModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_RENAME_MODAL);
      },

      /* Open modal for share url */
      openShareUrlModal: function openShareUrlModal() {
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        this.$store.commit(SHOW_SHARE_MODAL);
      },

      /* Open actions dropdown */
      openActions: function openActions() {
        var _this17 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this17.$refs.actionPreview.focus();
        });
      },

      /* Open actions dropdown and focus on last element */
      openLastActions: function openLastActions() {
        var _this18 = this;

        this.showActions = true;
        this.$nextTick(function () {
          return _this18.$refs.actionDelete.focus();
        });
      },

      /* Hide actions dropdown */
      hideActions: function hideActions() {
        var _this19 = this;

        this.showActions = false;
        this.$nextTick(function () {
          return _this19.$refs.actionToggle.focus();
        });
      }
    }
  };

  var _hoisted_1$8 = /*#__PURE__*/createVNode("div", {
    class: "media-browser-item-preview"
  }, [/*#__PURE__*/createVNode("div", {
    class: "file-background"
  }, [/*#__PURE__*/createVNode("div", {
    class: "file-icon"
  }, [/*#__PURE__*/createVNode("span", {
    class: "icon-file-alt"
  })])])], -1
  /* HOISTED */
  );

  var _hoisted_2$8 = {
    class: "media-browser-item-info"
  };
  var _hoisted_3$8 = {
    key: 0,
    class: "media-browser-actions-list"
  };

  function render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("div", {
      class: "media-browser-image",
      onDblclick: _cache[48] || (_cache[48] = function ($event) {
        return $options.openPreview();
      }),
      onMouseleave: _cache[49] || (_cache[49] = function ($event) {
        return $options.hideActions();
      })
    }, [_hoisted_1$8, createVNode("div", _hoisted_2$8, toDisplayString($props.item.name) + " " + toDisplayString($props.item.filetype), 1
    /* TEXT */
    ), createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8
    /* PROPS */
    , ["aria-label", "title"]), createVNode("div", {
      class: ["media-browser-actions", {
        'active': $data.showActions
      }]
    }, [createVNode("button", {
      ref: "actionToggle",
      type: "button",
      class: "action-toggle",
      "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
      onKeyup: [_cache[2] || (_cache[2] = withKeys(function ($event) {
        return $options.openActions();
      }, ["enter"])), _cache[5] || (_cache[5] = withKeys(function ($event) {
        return $options.openActions();
      }, ["space"])), _cache[6] || (_cache[6] = withKeys(function ($event) {
        return $options.openActions();
      }, ["down"])), _cache[7] || (_cache[7] = withKeys(function ($event) {
        return $options.openLastActions();
      }, ["up"]))],
      onFocus: _cache[3] || (_cache[3] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[4] || (_cache[4] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-ellipsis-h",
      "aria-hidden": "true",
      onClick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.openActions();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"]), $data.showActions ? (openBlock(), createBlock("div", _hoisted_3$8, [createVNode("ul", null, [createVNode("li", null, [createVNode("button", {
      ref: "actionPreview",
      type: "button",
      class: "action-preview",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
      title: _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
      onKeyup: [_cache[9] || (_cache[9] = withKeys(function ($event) {
        return $options.openPreview();
      }, ["enter"])), _cache[10] || (_cache[10] = withKeys(function ($event) {
        return $options.openPreview();
      }, ["space"])), _cache[13] || (_cache[13] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[14] || (_cache[14] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["up"])), _cache[15] || (_cache[15] = withKeys(function ($event) {
        return _ctx.$refs.actionDownload.focus();
      }, ["down"]))],
      onFocus: _cache[11] || (_cache[11] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[12] || (_cache[12] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-search-plus",
      "aria-hidden": "true",
      onClick: _cache[8] || (_cache[8] = withModifiers(function ($event) {
        return $options.openPreview();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionDownload",
      type: "button",
      class: "action-download",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
      title: _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
      onKeyup: [_cache[17] || (_cache[17] = withKeys(function ($event) {
        return $options.download();
      }, ["enter"])), _cache[18] || (_cache[18] = withKeys(function ($event) {
        return $options.download();
      }, ["space"])), _cache[21] || (_cache[21] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[22] || (_cache[22] = withKeys(function ($event) {
        return _ctx.$refs.actionPreview.focus();
      }, ["up"])), _cache[23] || (_cache[23] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["down"]))],
      onFocus: _cache[19] || (_cache[19] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[20] || (_cache[20] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-download",
      "aria-hidden": "true",
      onClick: _cache[16] || (_cache[16] = withModifiers(function ($event) {
        return $options.download();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionRename",
      type: "button",
      class: "action-rename",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
      onKeyup: [_cache[25] || (_cache[25] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["enter"])), _cache[26] || (_cache[26] = withKeys(function ($event) {
        return $options.openRenameModal();
      }, ["space"])), _cache[29] || (_cache[29] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[30] || (_cache[30] = withKeys(function ($event) {
        return _ctx.$refs.actionDownload.focus();
      }, ["up"])), _cache[31] || (_cache[31] = withKeys(function ($event) {
        return _ctx.$refs.actionShare.focus();
      }, ["down"]))],
      onFocus: _cache[27] || (_cache[27] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[28] || (_cache[28] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-text-width",
      "aria-hidden": "true",
      onClick: _cache[24] || (_cache[24] = withModifiers(function ($event) {
        return $options.openRenameModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionShare",
      type: "button",
      class: "action-url",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_SHARE'),
      title: _ctx.translate('COM_MEDIA_ACTION_SHARE'),
      onKeyup: [_cache[33] || (_cache[33] = withKeys(function ($event) {
        return $options.openShareUrlModal();
      }, ["enter"])), _cache[34] || (_cache[34] = withKeys(function ($event) {
        return $options.openShareUrlModal();
      }, ["space"])), _cache[37] || (_cache[37] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[38] || (_cache[38] = withKeys(function ($event) {
        return _ctx.$refs.actionRename.focus();
      }, ["up"])), _cache[39] || (_cache[39] = withKeys(function ($event) {
        return _ctx.$refs.actionDelete.focus();
      }, ["down"]))],
      onFocus: _cache[35] || (_cache[35] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[36] || (_cache[36] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-link",
      "aria-hidden": "true",
      onClick: _cache[32] || (_cache[32] = withModifiers(function ($event) {
        return $options.openShareUrlModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])]), createVNode("li", null, [createVNode("button", {
      ref: "actionDelete",
      type: "button",
      class: "action-delete",
      "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
      onKeyup: [_cache[41] || (_cache[41] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["enter"])), _cache[42] || (_cache[42] = withKeys(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["space"])), _cache[45] || (_cache[45] = withKeys(function ($event) {
        return $options.hideActions();
      }, ["esc"])), _cache[46] || (_cache[46] = withKeys(function ($event) {
        return _ctx.$refs.actionShare.focus();
      }, ["up"])), _cache[47] || (_cache[47] = withKeys(function ($event) {
        return _ctx.$refs.actionPreview.focus();
      }, ["down"]))],
      onFocus: _cache[43] || (_cache[43] = function ($event) {
        return $props.focused(true);
      }),
      onBlur: _cache[44] || (_cache[44] = function ($event) {
        return $props.focused(false);
      })
    }, [createVNode("span", {
      class: "image-browser-action icon-trash",
      "aria-hidden": "true",
      onClick: _cache[40] || (_cache[40] = withModifiers(function ($event) {
        return $options.openConfirmDeleteModal();
      }, ["stop"]))
    })], 40
    /* PROPS, HYDRATE_EVENTS */
    , ["aria-label", "title"])])])])) : createCommentVNode("v-if", true)], 2
    /* CLASS */
    )], 32
    /* HYDRATE_EVENTS */
    );
  }

  script$9.render = render$9;
  script$9.__file = "administrator/components/com_media/resources/scripts/components/browser/items/video.vue";

  var dirname = function dirname(path) {
    if (typeof path !== 'string') {
      throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
    }

    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47;
    var end = -1;
    var matchedSlash = true;

    for (var _i40 = path.length - 1; _i40 >= 1; --_i40) {
      code = path.charCodeAt(_i40);

      if (code === 47) {
        if (!matchedSlash) {
          end = _i40;
          break;
        }
      } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  };
  /**
   * Api class for communication with the server
   */


  var Api = /*#__PURE__*/function () {
    /**
       * Store constructor
       */
    function Api() {
      var options = Joomla.getOptions('com_media', {});

      if (options.apiBaseUrl === undefined) {
        throw new TypeError('Media api baseUrl is not defined');
      }

      if (options.csrfToken === undefined) {
        throw new TypeError('Media api csrf token is not defined');
      } // eslint-disable-next-line no-underscore-dangle


      this._baseUrl = options.apiBaseUrl; // eslint-disable-next-line no-underscore-dangle

      this._csrfToken = Joomla.getOptions('csrf.token');
      this.imagesExtensions = options.imagesExtensions;
    }
    /**
       * Get the contents of a directory from the server
       * @param {string}  dir  The directory path
       * @param {number}  full whether or not the persistent url should be returned
       * @param {number}  content whether or not the content should be returned
       * @returns {Promise}
       */


    var _proto3 = Api.prototype;

    _proto3.getContents = function getContents(dir, full, content) {
      var _this20 = this;

      // Wrap the ajax call into a real promise
      return new Promise(function (resolve, reject) {
        // Do a check on full
        if (['0', '1'].indexOf(full) !== -1) {
          throw Error('Invalid parameter: full');
        } // Do a check on download


        if (['0', '1'].indexOf(content) !== -1) {
          throw Error('Invalid parameter: content');
        } // eslint-disable-next-line no-underscore-dangle


        var url = _this20._baseUrl + "&task=api.files&path=" + dir;

        if (full) {
          url += "&url=" + full;
        }

        if (content) {
          url += "&content=" + content;
        }

        Joomla.request({
          url: url,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          onSuccess: function onSuccess(response) {
            // eslint-disable-next-line no-underscore-dangle
            resolve(_this20._normalizeArray(JSON.parse(response).data));
          },
          onError: function onError(xhr) {
            reject(xhr);
          }
        }); // eslint-disable-next-line no-underscore-dangle
      }).catch(this._handleError);
    }
    /**
       * Create a directory
       * @param name
       * @param parent
       * @returns {Promise.<T>}
       */
    ;

    _proto3.createDirectory = function createDirectory(name, parent) {
      var _this21 = this;

      // Wrap the ajax call into a real promise
      return new Promise(function (resolve, reject) {
        var _data;

        // eslint-disable-next-line no-underscore-dangle
        var url = _this21._baseUrl + "&task=api.files&path=" + parent; // eslint-disable-next-line no-underscore-dangle

        var data = (_data = {}, _data[_this21._csrfToken] = '1', _data.name = name, _data);
        Joomla.request({
          url: url,
          method: 'POST',
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          onSuccess: function onSuccess(response) {
            notifications.success('COM_MEDIA_CREATE_NEW_FOLDER_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

            resolve(_this21._normalizeItem(JSON.parse(response).data));
          },
          onError: function onError(xhr) {
            notifications.error('COM_MEDIA_CREATE_NEW_FOLDER_ERROR');
            reject(xhr);
          }
        }); // eslint-disable-next-line no-underscore-dangle
      }).catch(this._handleError);
    }
    /**
       * Upload a file
       * @param name
       * @param parent
       * @param content base64 encoded string
       * @param override boolean whether or not we should override existing files
       * @return {Promise.<T>}
       */
    ;

    _proto3.upload = function upload(name, parent, content, override) {
      var _this22 = this;

      // Wrap the ajax call into a real promise
      return new Promise(function (resolve, reject) {
        var _data2;

        // eslint-disable-next-line no-underscore-dangle
        var url = _this22._baseUrl + "&task=api.files&path=" + parent;
        var data = (_data2 = {}, _data2[_this22._csrfToken] = '1', _data2.name = name, _data2.content = content, _data2); // Append override

        if (override === true) {
          data.override = true;
        }

        Joomla.request({
          url: url,
          method: 'POST',
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          onSuccess: function onSuccess(response) {
            notifications.success('COM_MEDIA_UPLOAD_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

            resolve(_this22._normalizeItem(JSON.parse(response).data));
          },
          onError: function onError(xhr) {
            reject(xhr);
          }
        }); // eslint-disable-next-line no-underscore-dangle
      }).catch(this._handleError);
    }
    /**
       * Rename an item
       * @param path
       * @param newPath
       * @return {Promise.<T>}
       */
    // eslint-disable-next-line no-shadow
    ;

    _proto3.rename = function rename(path, newPath) {
      var _this23 = this;

      // Wrap the ajax call into a real promise
      return new Promise(function (resolve, reject) {
        var _data3;

        // eslint-disable-next-line no-underscore-dangle
        var url = _this23._baseUrl + "&task=api.files&path=" + path;
        var data = (_data3 = {}, _data3[_this23._csrfToken] = '1', _data3.newPath = newPath, _data3);
        Joomla.request({
          url: url,
          method: 'PUT',
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          onSuccess: function onSuccess(response) {
            notifications.success('COM_MEDIA_RENAME_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

            resolve(_this23._normalizeItem(JSON.parse(response).data));
          },
          onError: function onError(xhr) {
            notifications.error('COM_MEDIA_RENAME_ERROR');
            reject(xhr);
          }
        }); // eslint-disable-next-line no-underscore-dangle
      }).catch(this._handleError);
    }
    /**
       * Delete a file
       * @param path
       * @return {Promise.<T>}
       */
    // eslint-disable-next-line no-shadow
    ;

    _proto3.delete = function _delete(path) {
      var _this24 = this;

      // Wrap the ajax call into a real promise
      return new Promise(function (resolve, reject) {
        var _data4;

        // eslint-disable-next-line no-underscore-dangle
        var url = _this24._baseUrl + "&task=api.files&path=" + path; // eslint-disable-next-line no-underscore-dangle

        var data = (_data4 = {}, _data4[_this24._csrfToken] = '1', _data4);
        Joomla.request({
          url: url,
          method: 'DELETE',
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          onSuccess: function onSuccess() {
            notifications.success('COM_MEDIA_DELETE_SUCCESS');
            resolve();
          },
          onError: function onError(xhr) {
            notifications.error('COM_MEDIA_DELETE_ERROR');
            reject(xhr);
          }
        }); // eslint-disable-next-line no-underscore-dangle
      }).catch(this._handleError);
    }
    /**
       * Normalize a single item
       * @param item
       * @returns {*}
       * @private
       */
    // eslint-disable-next-line no-underscore-dangle,class-methods-use-this
    ;

    _proto3._normalizeItem = function _normalizeItem(item) {
      if (item.type === 'dir') {
        item.directories = [];
        item.files = [];
      }

      item.directory = dirname(item.path);

      if (item.directory.indexOf(':', item.directory.length - 1) !== -1) {
        item.directory += '/';
      }

      return item;
    }
    /**
       * Normalize array data
       * @param data
       * @returns {{directories, files}}
       * @private
       */
    // eslint-disable-next-line no-underscore-dangle
    ;

    _proto3._normalizeArray = function _normalizeArray(data) {
      var _this25 = this;

      var directories = data.filter(function (item) {
        return item.type === 'dir';
      }) // eslint-disable-next-line no-underscore-dangle
      .map(function (directory) {
        return _this25._normalizeItem(directory);
      });
      var files = data.filter(function (item) {
        return item.type === 'file';
      }) // eslint-disable-next-line no-underscore-dangle
      .map(function (file) {
        return _this25._normalizeItem(file);
      });
      return {
        directories: directories,
        files: files
      };
    }
    /**
       * Handle errors
       * @param error
       * @private
       *
       * @TODO DN improve error handling
       */
    // eslint-disable-next-line no-underscore-dangle,class-methods-use-this
    ;

    _proto3._handleError = function _handleError(error) {
      var response = JSON.parse(error.response);

      if (response.message) {
        notifications.error(response.message);
      } else {
        switch (error.status) {
          case 409:
            // Handled in consumer
            break;

          case 404:
            notifications.error('COM_MEDIA_ERROR_NOT_FOUND');
            break;

          case 401:
            notifications.error('COM_MEDIA_ERROR_NOT_AUTHENTICATED');
            break;

          case 403:
            notifications.error('COM_MEDIA_ERROR_NOT_AUTHORIZED');
            break;

          case 500:
            notifications.error('COM_MEDIA_SERVER_ERROR');
            break;

          default:
            notifications.error('COM_MEDIA_ERROR');
        }
      }

      throw error;
    };

    return Api;
  }(); // eslint-disable-next-line import/prefer-default-export


  var api = new Api();
  var BrowserItem = {
    props: ['item'],
    data: function data() {
      return {
        hoverActive: false
      };
    },
    methods: {
      /**
           * Return the correct item type component
           */
      itemType: function itemType() {
        var imageExtensions = api.imagesExtensions;
        var videoExtensions = ['mp4']; // Render directory items

        if (this.item.type === 'dir') return script$c; // Render image items

        if (this.item.extension && imageExtensions.includes(this.item.extension.toLowerCase())) {
          return script$a;
        } // Render video items


        if (this.item.extension && !videoExtensions.includes(this.item.extension.toLowerCase())) {
          return script$9;
        } // Default to file type


        return script$b;
      },

      /**
           * Get the styles for the media browser item
           * @returns {{}}
           */
      styles: function styles() {
        return {
          width: "calc(" + this.$store.state.gridSize + "% - 20px)"
        };
      },

      /**
           * Whether or not the item is currently selected
           * @returns {boolean}
           */
      isSelected: function isSelected() {
        var _this26 = this;

        return this.$store.state.selectedItems.some(function (selected) {
          return selected.path === _this26.item.path;
        });
      },

      /**
           * Whether or not the item is currently active (on hover or via tab)
           * @returns {boolean}
           */
      isHoverActive: function isHoverActive() {
        return this.hoverActive;
      },

      /**
           * Turns on the hover class
           */
      mouseover: function mouseover() {
        this.hoverActive = true;
      },

      /**
           * Turns off the hover class
           */
      mouseleave: function mouseleave() {
        this.hoverActive = false;
      },

      /**
           * Handle the click event
           * @param event
           */
      handleClick: function handleClick(event) {
        if (this.item.path && this.item.type === 'file') {
          window.parent.document.dispatchEvent(new CustomEvent('onMediaFileSelected', {
            bubbles: true,
            cancelable: false,
            detail: {
              path: this.item.path,
              thumb: this.item.thumb,
              fileType: this.item.mime_type ? this.item.mime_type : false,
              extension: this.item.extension ? this.item.extension : false,
              width: this.item.width ? this.item.width : 0,
              height: this.item.height ? this.item.height : 0
            }
          }));
        }

        if (this.item.type === 'dir') {
          window.parent.document.dispatchEvent(new CustomEvent('onMediaFileSelected', {
            bubbles: true,
            cancelable: false,
            detail: {}
          }));
        } // Handle clicks when the item was not selected


        if (!this.isSelected()) {
          // Unselect all other selected items,
          // if the shift key was not pressed during the click event
          if (!(event.shiftKey || event.keyCode === 13)) {
            this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
          }

          this.$store.commit(SELECT_BROWSER_ITEM, this.item);
          return;
        }

        this.$store.dispatch('toggleBrowserItemSelect', this.item);
        window.parent.document.dispatchEvent(new CustomEvent('onMediaFileSelected', {
          bubbles: true,
          cancelable: false,
          detail: {}
        })); // If more than one item was selected and the user clicks again on the selected item,
        // he most probably wants to unselect all other items.

        if (this.$store.state.selectedItems.length > 1) {
          this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
          this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        }
      },

      /**
           * Handle the when an element is focused in the child to display the layover for a11y
           * @param value
           */
      focused: function focused(value) {
        // eslint-disable-next-line no-unused-expressions
        value ? this.mouseover() : this.mouseleave();
      }
    },
    render: function render() {
      return h('div', {
        class: {
          'media-browser-item': true,
          selected: this.isSelected(),
          active: this.isHoverActive()
        },
        onClick: this.handleClick,
        onMouseover: this.mouseover,
        onMouseleave: this.mouseleave,
        onFocused: this.focused
      }, [h(this.itemType(), {
        item: this.item,
        focused: this.focused
      })]);
    }
  };
  var script$8 = {
    name: 'MediaBrowserItemRow',
    mixins: [navigable],
    // eslint-disable-next-line vue/require-prop-types
    props: ['item'],
    computed: {
      /* The dimension of a file */
      dimension: function dimension() {
        if (!this.item.width) {
          return '';
        }

        return this.item.width + "px * " + this.item.height + "px";
      },
      isDir: function isDir() {
        return this.item.type === 'dir';
      },

      /* The size of a file in KB */
      size: function size() {
        if (!this.item.size) {
          return '';
        }

        return (this.item.size / 1024).toFixed(2) + " KB";
      },
      selected: function selected() {
        return !!this.isSelected();
      }
    },
    methods: {
      /* Handle the on row double click event */
      onDblClick: function onDblClick() {
        if (this.isDir) {
          this.navigateTo(this.item.path);
          return;
        }

        var extensionWithPreview = ['jpg', 'jpeg', 'png', 'gif', 'mp4']; // Show preview

        if (this.item.extension && !extensionWithPreview.includes(this.item.extension.toLowerCase())) {
          this.$store.commit(SHOW_PREVIEW_MODAL);
          this.$store.dispatch('getFullContents', this.item);
        }
      },

      /**
               * Whether or not the item is currently selected
               * @returns {boolean}
               */
      isSelected: function isSelected() {
        var _this27 = this;

        return this.$store.state.selectedItems.some(function (selected) {
          return selected.path === _this27.item.path;
        });
      },

      /**
               * Handle the click event
               * @param event
               */
      onClick: function onClick(event) {
        var path = false;
        var data = {
          path: path,
          thumb: false,
          fileType: this.item.mime_type ? this.item.mime_type : false,
          extension: this.item.extension ? this.item.extension : false
        };

        if (this.item.type === 'file') {
          data.path = this.item.path;
          data.thumb = this.item.thumb ? this.item.thumb : false;
          data.width = this.item.width ? this.item.width : 0;
          data.height = this.item.height ? this.item.height : 0;
          var ev = new CustomEvent('onMediaFileSelected', {
            bubbles: true,
            cancelable: false,
            detail: data
          });
          window.parent.document.dispatchEvent(ev);
        } // Handle clicks when the item was not selected


        if (!this.isSelected()) {
          // Unselect all other selected items,
          // if the shift key was not pressed during the click event
          if (!(event.shiftKey || event.keyCode === 13)) {
            this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
          }

          this.$store.commit(SELECT_BROWSER_ITEM, this.item);
          return;
        } // If more than one item was selected and the user clicks again on the selected item,
        // he most probably wants to unselect all other items.


        if (this.$store.state.selectedItems.length > 1) {
          this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
          this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        }
      }
    }
  };
  var _hoisted_1$7 = {
    scope: "row",
    class: "name"
  };
  var _hoisted_2$7 = {
    class: "size"
  };
  var _hoisted_3$7 = {
    class: "dimension"
  };
  var _hoisted_4$6 = {
    class: "created"
  };
  var _hoisted_5$2 = {
    class: "modified"
  };

  function render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("tr", {
      class: ["media-browser-item", {
        selected: $options.selected
      }],
      onDblclick: _cache[1] || (_cache[1] = withModifiers(function ($event) {
        return $options.onDblClick();
      }, ["stop", "prevent"])),
      onClick: _cache[2] || (_cache[2] = function () {
        return $options.onClick && $options.onClick.apply($options, arguments);
      })
    }, [createVNode("td", {
      class: "type",
      "data-type": $props.item.extension
    }, null, 8
    /* PROPS */
    , ["data-type"]), createVNode("th", _hoisted_1$7, toDisplayString($props.item.name), 1
    /* TEXT */
    ), createVNode("td", _hoisted_2$7, toDisplayString($options.size), 1
    /* TEXT */
    ), createVNode("td", _hoisted_3$7, toDisplayString($options.dimension), 1
    /* TEXT */
    ), createVNode("td", _hoisted_4$6, toDisplayString($props.item.create_date_formatted), 1
    /* TEXT */
    ), createVNode("td", _hoisted_5$2, toDisplayString($props.item.modified_date_formatted), 1
    /* TEXT */
    )], 34
    /* CLASS, HYDRATE_EVENTS */
    );
  }

  script$8.render = render$8;
  script$8.__file = "administrator/components/com_media/resources/scripts/components/browser/items/row.vue";
  var script$7 = {
    name: 'MediaModal',
    props: {
      /* Whether or not the close button in the header should be shown */
      showClose: {
        type: Boolean,
        default: true
      },

      /* The size of the modal */
      // eslint-disable-next-line vue/require-default-prop
      size: {
        type: String
      },
      labelElement: {
        type: String,
        required: true
      }
    },
    emits: ['close'],
    computed: {
      /* Get the modal css class */
      modalClass: function modalClass() {
        return {
          'modal-sm': this.size === 'sm'
        };
      }
    },
    mounted: function mounted() {
      // Listen to keydown events on the document
      document.addEventListener('keydown', this.onKeyDown);
    },
    beforeUnmount: function beforeUnmount() {
      // Remove the keydown event listener
      document.removeEventListener('keydown', this.onKeyDown);
    },
    methods: {
      /* Close the modal instance */
      close: function close() {
        this.$emit('close');
      },

      /* Handle keydown events */
      onKeyDown: function onKeyDown(event) {
        if (event.keyCode === 27) {
          this.close();
        }
      }
    }
  };
  var _hoisted_1$6 = {
    class: "modal-content"
  };
  var _hoisted_2$6 = {
    class: "modal-header"
  };
  var _hoisted_3$6 = {
    class: "modal-body"
  };
  var _hoisted_4$5 = {
    class: "modal-footer"
  };

  function render$7(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_tab_lock = resolveComponent("tab-lock");

    return openBlock(), createBlock("div", {
      class: "media-modal-backdrop",
      onClick: _cache[3] || (_cache[3] = function ($event) {
        return $options.close();
      })
    }, [createVNode("div", {
      class: "modal",
      style: {
        "display": "flex"
      },
      onClick: _cache[2] || (_cache[2] = withModifiers(function () {}, ["stop"]))
    }, [createVNode(_component_tab_lock, null, {
      default: withCtx(function () {
        return [createVNode("div", {
          class: ["modal-dialog", $options.modalClass],
          role: "dialog",
          "aria-labelledby": $props.labelElement
        }, [createVNode("div", _hoisted_1$6, [createVNode("div", _hoisted_2$6, [renderSlot(_ctx.$slots, "header"), renderSlot(_ctx.$slots, "backdrop-close"), $props.showClose ? (openBlock(), createBlock("button", {
          key: 0,
          type: "button",
          class: "btn-close",
          "aria-label": "Close",
          onClick: _cache[1] || (_cache[1] = function ($event) {
            return $options.close();
          })
        })) : createCommentVNode("v-if", true)]), createVNode("div", _hoisted_3$6, [renderSlot(_ctx.$slots, "body")]), createVNode("div", _hoisted_4$5, [renderSlot(_ctx.$slots, "footer")])])], 10
        /* CLASS, PROPS */
        , ["aria-labelledby"])];
      }),
      _: 3
      /* FORWARDED */

    })])]);
  }

  script$7.render = render$7;
  script$7.__file = "administrator/components/com_media/resources/scripts/components/modals/modal.vue";
  var script$6 = {
    name: 'MediaCreateFolderModal',
    data: function data() {
      return {
        folder: ''
      };
    },
    methods: {
      /* Check if the the form is valid */
      isValid: function isValid() {
        return this.folder;
      },

      /* Close the modal instance */
      close: function close() {
        this.reset();
        this.$store.commit(HIDE_CREATE_FOLDER_MODAL);
      },

      /* Save the form and create the folder */
      save: function save() {
        // Check if the form is valid
        if (!this.isValid()) {
          // TODO show an error message to user for insert a folder name
          // TODO mark the field as invalid
          return;
        } // Create the directory


        this.$store.dispatch('createDirectory', {
          name: this.folder,
          parent: this.$store.state.selectedDirectory
        });
        this.reset();
      },

      /* Reset the form */
      reset: function reset() {
        this.folder = '';
      }
    }
  };
  var _hoisted_1$5 = {
    id: "createFolderTitle",
    class: "modal-title"
  };
  var _hoisted_2$5 = {
    class: "p-3"
  };
  var _hoisted_3$5 = {
    class: "form-group"
  };
  var _hoisted_4$4 = {
    for: "folder"
  };

  function render$6(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_modal = resolveComponent("media-modal");

    return _ctx.$store.state.showCreateFolderModal ? (openBlock(), createBlock(_component_media_modal, {
      key: 0,
      size: 'md',
      "label-element": "createFolderTitle",
      onClose: _cache[6] || (_cache[6] = function ($event) {
        return $options.close();
      })
    }, {
      header: withCtx(function () {
        return [createVNode("h3", _hoisted_1$5, toDisplayString(_ctx.translate('COM_MEDIA_CREATE_NEW_FOLDER')), 1
        /* TEXT */
        )];
      }),
      body: withCtx(function () {
        return [createVNode("div", _hoisted_2$5, [createVNode("form", {
          class: "form",
          novalidate: "",
          onSubmit: _cache[3] || (_cache[3] = withModifiers(function () {
            return $options.save && $options.save.apply($options, arguments);
          }, ["prevent"]))
        }, [createVNode("div", _hoisted_3$5, [createVNode("label", _hoisted_4$4, toDisplayString(_ctx.translate('COM_MEDIA_FOLDER_NAME')), 1
        /* TEXT */
        ), withDirectives(createVNode("input", {
          id: "folder",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
            return $data.folder = $event;
          }),
          class: "form-control",
          type: "text",
          required: "",
          autocomplete: "off",
          onInput: _cache[2] || (_cache[2] = function ($event) {
            return $data.folder = $event.target.value;
          })
        }, null, 544
        /* HYDRATE_EVENTS, NEED_PATCH */
        ), [[vModelText, $data.folder, void 0, {
          trim: true
        }]])])], 32
        /* HYDRATE_EVENTS */
        )])];
      }),
      footer: withCtx(function () {
        return [createVNode("div", null, [createVNode("button", {
          class: "btn btn-secondary",
          onClick: _cache[4] || (_cache[4] = function ($event) {
            return $options.close();
          })
        }, toDisplayString(_ctx.translate('JCANCEL')), 1
        /* TEXT */
        ), createVNode("button", {
          class: "btn btn-success",
          disabled: !$options.isValid(),
          onClick: _cache[5] || (_cache[5] = function ($event) {
            return $options.save();
          })
        }, toDisplayString(_ctx.translate('JACTION_CREATE')), 9
        /* TEXT, PROPS */
        , ["disabled"])])];
      }),
      _: 1
      /* STABLE */

    })) : createCommentVNode("v-if", true);
  }

  script$6.render = render$6;
  script$6.__file = "administrator/components/com_media/resources/scripts/components/modals/create-folder-modal.vue";
  var script$5 = {
    name: 'MediaPreviewModal',
    computed: {
      /* Get the item to show in the modal */
      item: function item() {
        // Use the currently selected directory as a fallback
        return this.$store.state.previewItem;
      }
    },
    methods: {
      /* Close the modal */
      close: function close() {
        this.$store.commit(HIDE_PREVIEW_MODAL);
      },
      isImage: function isImage() {
        return this.item.mime_type.indexOf('image/') === 0;
      },
      isVideo: function isVideo() {
        return this.item.mime_type.indexOf('video/') === 0;
      }
    }
  };
  var _hoisted_1$4 = {
    id: "previewTitle",
    class: "modal-title text-light"
  };
  var _hoisted_2$4 = {
    class: "image-background"
  };
  var _hoisted_3$4 = {
    key: 1,
    controls: ""
  };

  var _hoisted_4$3 = /*#__PURE__*/createVNode("span", {
    class: "icon-times"
  }, null, -1
  /* HOISTED */
  );

  function render$5(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_modal = resolveComponent("media-modal");

    return _ctx.$store.state.showPreviewModal && $options.item ? (openBlock(), createBlock(_component_media_modal, {
      key: 0,
      size: 'md',
      class: "media-preview-modal",
      "label-element": "previewTitle",
      "show-close": false,
      onClose: _cache[2] || (_cache[2] = function ($event) {
        return $options.close();
      })
    }, {
      header: withCtx(function () {
        return [createVNode("h3", _hoisted_1$4, toDisplayString($options.item.name), 1
        /* TEXT */
        )];
      }),
      body: withCtx(function () {
        return [createVNode("div", _hoisted_2$4, [$options.isImage() ? (openBlock(), createBlock("img", {
          key: 0,
          src: $options.item.url,
          type: $options.item.mime_type
        }, null, 8
        /* PROPS */
        , ["src", "type"])) : createCommentVNode("v-if", true), $options.isVideo() ? (openBlock(), createBlock("video", _hoisted_3$4, [createVNode("source", {
          src: $options.item.url,
          type: $options.item.mime_type
        }, null, 8
        /* PROPS */
        , ["src", "type"])])) : createCommentVNode("v-if", true)])];
      }),
      "backdrop-close": withCtx(function () {
        return [createVNode("button", {
          type: "button",
          class: "media-preview-close",
          onClick: _cache[1] || (_cache[1] = function ($event) {
            return $options.close();
          })
        }, [_hoisted_4$3])];
      }),
      _: 1
      /* STABLE */

    })) : createCommentVNode("v-if", true);
  }

  script$5.render = render$5;
  script$5.__file = "administrator/components/com_media/resources/scripts/components/modals/preview-modal.vue";
  var script$4 = {
    name: 'MediaRenameModal',
    computed: {
      item: function item() {
        return this.$store.state.selectedItems[this.$store.state.selectedItems.length - 1];
      },
      name: function name() {
        return this.item.name.replace("." + this.item.extension, '');
      },
      extension: function extension() {
        return this.item.extension;
      }
    },
    methods: {
      /* Check if the form is valid */
      isValid: function isValid() {
        return this.item.name.length > 0;
      },

      /* Close the modal instance */
      close: function close() {
        this.$store.commit(HIDE_RENAME_MODAL);
      },

      /* Save the form and create the folder */
      save: function save() {
        // Check if the form is valid
        if (!this.isValid()) {
          // TODO mark the field as invalid
          return;
        }

        var newName = this.$refs.nameField.value;

        if (this.extension.length) {
          newName += "." + this.item.extension;
        }

        var newPath = this.item.directory;

        if (newPath.substr(-1) !== '/') {
          newPath += '/';
        } // Rename the item


        this.$store.dispatch('renameItem', {
          path: this.item.path,
          newPath: newPath + newName,
          newName: newName
        });
      }
    }
  };
  var _hoisted_1$3 = {
    id: "renameTitle",
    class: "modal-title"
  };
  var _hoisted_2$3 = {
    class: "form-group p-3"
  };
  var _hoisted_3$3 = {
    for: "name"
  };
  var _hoisted_4$2 = {
    key: 0,
    class: "input-group-text"
  };

  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_modal = resolveComponent("media-modal");

    return _ctx.$store.state.showRenameModal ? (openBlock(), createBlock(_component_media_modal, {
      key: 0,
      size: 'sm',
      "show-close": false,
      "label-element": "renameTitle",
      onClose: _cache[6] || (_cache[6] = function ($event) {
        return $options.close();
      })
    }, {
      header: withCtx(function () {
        return [createVNode("h3", _hoisted_1$3, toDisplayString(_ctx.translate('COM_MEDIA_RENAME')), 1
        /* TEXT */
        )];
      }),
      body: withCtx(function () {
        return [createVNode("div", null, [createVNode("form", {
          class: "form",
          novalidate: "",
          onSubmit: _cache[1] || (_cache[1] = withModifiers(function () {
            return $options.save && $options.save.apply($options, arguments);
          }, ["prevent"]))
        }, [createVNode("div", _hoisted_2$3, [createVNode("label", _hoisted_3$3, toDisplayString(_ctx.translate('COM_MEDIA_NAME')), 1
        /* TEXT */
        ), createVNode("div", {
          class: {
            'input-group': $options.extension.length
          }
        }, [createVNode("input", {
          id: "name",
          ref: "nameField",
          class: "form-control",
          type: "text",
          placeholder: _ctx.translate('COM_MEDIA_NAME'),
          value: $options.name,
          required: "",
          autocomplete: "off"
        }, null, 8
        /* PROPS */
        , ["placeholder", "value"]), $options.extension.length ? (openBlock(), createBlock("span", _hoisted_4$2, toDisplayString($options.extension), 1
        /* TEXT */
        )) : createCommentVNode("v-if", true)], 2
        /* CLASS */
        )])], 32
        /* HYDRATE_EVENTS */
        )])];
      }),
      footer: withCtx(function () {
        return [createVNode("div", null, [createVNode("button", {
          type: "button",
          class: "btn btn-secondary",
          onClick: _cache[2] || (_cache[2] = function ($event) {
            return $options.close();
          }),
          onKeyup: _cache[3] || (_cache[3] = withKeys(function ($event) {
            return $options.close();
          }, ["enter"]))
        }, toDisplayString(_ctx.translate('JCANCEL')), 33
        /* TEXT, HYDRATE_EVENTS */
        ), createVNode("button", {
          type: "button",
          class: "btn btn-success",
          disabled: !$options.isValid(),
          onClick: _cache[4] || (_cache[4] = function ($event) {
            return $options.save();
          }),
          onKeyup: _cache[5] || (_cache[5] = withKeys(function ($event) {
            return $options.save();
          }, ["enter"]))
        }, toDisplayString(_ctx.translate('JAPPLY')), 41
        /* TEXT, PROPS, HYDRATE_EVENTS */
        , ["disabled"])])];
      }),
      _: 1
      /* STABLE */

    })) : createCommentVNode("v-if", true);
  }

  script$4.render = render$4;
  script$4.__file = "administrator/components/com_media/resources/scripts/components/modals/rename-modal.vue";
  var script$3 = {
    name: 'MediaShareModal',
    computed: {
      item: function item() {
        return this.$store.state.selectedItems[this.$store.state.selectedItems.length - 1];
      },
      url: function url() {
        return this.$store.state.previewItem && Object.prototype.hasOwnProperty.call(this.$store.state.previewItem, 'url') ? this.$store.state.previewItem.url : null;
      }
    },
    methods: {
      /* Close the modal instance and reset the form */
      close: function close() {
        this.$store.commit(HIDE_SHARE_MODAL);
        this.$store.commit(LOAD_FULL_CONTENTS_SUCCESS, null);
      },
      // Generate the url from backend
      generateUrl: function generateUrl() {
        this.$store.dispatch('getFullContents', this.item);
      },
      // Copy to clipboard
      copyToClipboard: function copyToClipboard() {
        this.$refs.urlText.focus();
        this.$refs.urlText.select();

        try {
          document.execCommand('copy');
        } catch (err) {
          // TODO Error handling in joomla way
          // eslint-disable-next-line no-undef
          alert(translate('COM_MEDIA_SHARE_COPY_FAILED_ERROR'));
        }
      }
    }
  };
  var _hoisted_1$2 = {
    id: "shareTitle",
    class: "modal-title"
  };
  var _hoisted_2$2 = {
    class: "p-3"
  };
  var _hoisted_3$2 = {
    class: "desc"
  };
  var _hoisted_4$1 = {
    key: 0,
    class: "control"
  };
  var _hoisted_5$1 = {
    key: 1,
    class: "control"
  };
  var _hoisted_6$1 = {
    class: "input-group"
  };

  var _hoisted_7$1 = /*#__PURE__*/createVNode("span", {
    class: "icon-clipboard",
    "aria-hidden": "true"
  }, null, -1
  /* HOISTED */
  );

  function render$3(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_modal = resolveComponent("media-modal");

    return _ctx.$store.state.showShareModal ? (openBlock(), createBlock(_component_media_modal, {
      key: 0,
      size: 'md',
      "show-close": false,
      "label-element": "shareTitle",
      onClose: _cache[5] || (_cache[5] = function ($event) {
        return $options.close();
      })
    }, {
      header: withCtx(function () {
        return [createVNode("h3", _hoisted_1$2, toDisplayString(_ctx.translate('COM_MEDIA_SHARE')), 1
        /* TEXT */
        )];
      }),
      body: withCtx(function () {
        return [createVNode("div", _hoisted_2$2, [createVNode("div", _hoisted_3$2, [createTextVNode(toDisplayString(_ctx.translate('COM_MEDIA_SHARE_DESC')) + " ", 1
        /* TEXT */
        ), !$options.url ? (openBlock(), createBlock("div", _hoisted_4$1, [createVNode("button", {
          class: "btn btn-success w-100",
          type: "button",
          onClick: _cache[1] || (_cache[1] = function () {
            return $options.generateUrl && $options.generateUrl.apply($options, arguments);
          })
        }, toDisplayString(_ctx.translate('COM_MEDIA_ACTION_SHARE')), 1
        /* TEXT */
        )])) : (openBlock(), createBlock("div", _hoisted_5$1, [createVNode("span", _hoisted_6$1, [withDirectives(createVNode("input", {
          id: "url",
          ref: "urlText",
          "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
            return $options.url = $event;
          }),
          readonly: "",
          type: "url",
          class: "form-control input-xxlarge",
          placeholder: "URL",
          autocomplete: "off"
        }, null, 512
        /* NEED_PATCH */
        ), [[vModelText, $options.url]]), createVNode("button", {
          class: "btn btn-secondary",
          type: "button",
          title: _ctx.translate('COM_MEDIA_SHARE_COPY'),
          onClick: _cache[3] || (_cache[3] = function () {
            return $options.copyToClipboard && $options.copyToClipboard.apply($options, arguments);
          })
        }, [_hoisted_7$1], 8
        /* PROPS */
        , ["title"])])]))])])];
      }),
      footer: withCtx(function () {
        return [createVNode("div", null, [createVNode("button", {
          class: "btn btn-secondary",
          onClick: _cache[4] || (_cache[4] = function ($event) {
            return $options.close();
          })
        }, toDisplayString(_ctx.translate('JCANCEL')), 1
        /* TEXT */
        )])];
      }),
      _: 1
      /* STABLE */

    })) : createCommentVNode("v-if", true);
  }

  script$3.render = render$3;
  script$3.__file = "administrator/components/com_media/resources/scripts/components/modals/share-modal.vue";
  var script$2 = {
    name: 'MediaShareModal',
    computed: {
      item: function item() {
        return this.$store.state.selectedItems[this.$store.state.selectedItems.length - 1];
      }
    },
    methods: {
      /* Delete Item */
      deleteItem: function deleteItem() {
        this.$store.dispatch('deleteSelectedItems');
        this.$store.commit(HIDE_CONFIRM_DELETE_MODAL);
      },

      /* Close the modal instance */
      close: function close() {
        this.$store.commit(HIDE_CONFIRM_DELETE_MODAL);
      }
    }
  };
  var _hoisted_1$1 = {
    id: "confirmDeleteTitle",
    class: "modal-title"
  };
  var _hoisted_2$1 = {
    class: "p-3"
  };
  var _hoisted_3$1 = {
    class: "desc"
  };

  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_media_modal = resolveComponent("media-modal");

    return _ctx.$store.state.showConfirmDeleteModal ? (openBlock(), createBlock(_component_media_modal, {
      key: 0,
      size: 'md',
      "show-close": false,
      "label-element": "confirmDeleteTitle",
      onClose: _cache[3] || (_cache[3] = function ($event) {
        return $options.close();
      })
    }, {
      header: withCtx(function () {
        return [createVNode("h3", _hoisted_1$1, toDisplayString(_ctx.translate('COM_MEDIA_CONFIRM_DELETE_MODAL_HEADING')), 1
        /* TEXT */
        )];
      }),
      body: withCtx(function () {
        return [createVNode("div", _hoisted_2$1, [createVNode("div", _hoisted_3$1, toDisplayString(_ctx.translate('JGLOBAL_CONFIRM_DELETE')), 1
        /* TEXT */
        )])];
      }),
      footer: withCtx(function () {
        return [createVNode("div", null, [createVNode("button", {
          class: "btn btn-success",
          onClick: _cache[1] || (_cache[1] = function ($event) {
            return $options.close();
          })
        }, toDisplayString(_ctx.translate('JCANCEL')), 1
        /* TEXT */
        ), createVNode("button", {
          id: "media-delete-item",
          class: "btn btn-danger",
          onClick: _cache[2] || (_cache[2] = function ($event) {
            return $options.deleteItem();
          })
        }, toDisplayString(_ctx.translate('COM_MEDIA_CONFIRM_DELETE_MODAL')), 1
        /* TEXT */
        )])];
      }),
      _: 1
      /* STABLE */

    })) : createCommentVNode("v-if", true);
  }

  script$2.render = render$2;
  script$2.__file = "administrator/components/com_media/resources/scripts/components/modals/confirm-delete-modal.vue";
  var script$1 = {
    name: 'MediaInfobar',
    computed: {
      /* Get the item to show in the infobar */
      item: function item() {
        // Check if there are selected items
        var selectedItems = this.$store.state.selectedItems; // If there is only one selected item, show that one.

        if (selectedItems.length === 1) {
          return selectedItems[0];
        } // If there are more selected items, use the last one


        if (selectedItems.length > 1) {
          return selectedItems.slice(-1)[0];
        } // Use the currently selected directory as a fallback


        return this.$store.getters.getSelectedDirectory;
      },

      /* Show/Hide the InfoBar */
      showInfoBar: function showInfoBar() {
        return this.$store.state.showInfoBar;
      }
    },
    methods: {
      hideInfoBar: function hideInfoBar() {
        this.$store.commit(HIDE_INFOBAR);
      }
    }
  };
  var _hoisted_1 = {
    key: 0,
    class: "media-infobar"
  };
  var _hoisted_2 = {
    key: 0,
    class: "text-center"
  };

  var _hoisted_3 = /*#__PURE__*/createVNode("span", {
    class: "icon-file placeholder-icon"
  }, null, -1
  /* HOISTED */
  );

  var _hoisted_4 = /*#__PURE__*/createTextVNode(" Select file or folder to view its details. ");

  var _hoisted_5 = {
    key: 1
  };
  var _hoisted_6 = {
    key: 0
  };
  var _hoisted_7 = {
    key: 1
  };
  var _hoisted_8 = {
    key: 2
  };
  var _hoisted_9 = {
    key: 3
  };
  var _hoisted_10 = {
    key: 4
  };
  var _hoisted_11 = {
    key: 5
  };
  var _hoisted_12 = {
    key: 6
  };

  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock(Transition, {
      name: "infobar"
    }, {
      default: withCtx(function () {
        return [$options.showInfoBar && $options.item ? (openBlock(), createBlock("div", _hoisted_1, [createVNode("span", {
          class: "infobar-close",
          onClick: _cache[1] || (_cache[1] = function ($event) {
            return $options.hideInfoBar();
          })
        }, "×"), createVNode("h2", null, toDisplayString($options.item.name), 1
        /* TEXT */
        ), $options.item.path === '/' ? (openBlock(), createBlock("div", _hoisted_2, [_hoisted_3, _hoisted_4])) : (openBlock(), createBlock("dl", _hoisted_5, [createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_FOLDER')), 1
        /* TEXT */
        ), createVNode("dd", null, toDisplayString($options.item.directory), 1
        /* TEXT */
        ), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_TYPE')), 1
        /* TEXT */
        ), $options.item.type === 'file' ? (openBlock(), createBlock("dd", _hoisted_6, toDisplayString(_ctx.translate('COM_MEDIA_FILE')), 1
        /* TEXT */
        )) : $options.item.type === 'dir' ? (openBlock(), createBlock("dd", _hoisted_7, toDisplayString(_ctx.translate('COM_MEDIA_FOLDER')), 1
        /* TEXT */
        )) : (openBlock(), createBlock("dd", _hoisted_8, " - ")), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_CREATED')), 1
        /* TEXT */
        ), createVNode("dd", null, toDisplayString($options.item.create_date_formatted), 1
        /* TEXT */
        ), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')), 1
        /* TEXT */
        ), createVNode("dd", null, toDisplayString($options.item.modified_date_formatted), 1
        /* TEXT */
        ), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DIMENSION')), 1
        /* TEXT */
        ), $options.item.width || $options.item.height ? (openBlock(), createBlock("dd", _hoisted_9, toDisplayString($options.item.width) + "px * " + toDisplayString($options.item.height) + "px ", 1
        /* TEXT */
        )) : (openBlock(), createBlock("dd", _hoisted_10, " - ")), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_SIZE')), 1
        /* TEXT */
        ), $options.item.size ? (openBlock(), createBlock("dd", _hoisted_11, toDisplayString(($options.item.size / 1024).toFixed(2)) + " KB ", 1
        /* TEXT */
        )) : (openBlock(), createBlock("dd", _hoisted_12, " - ")), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_MIME_TYPE')), 1
        /* TEXT */
        ), createVNode("dd", null, toDisplayString($options.item.mime_type), 1
        /* TEXT */
        ), createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_EXTENSION')), 1
        /* TEXT */
        ), createVNode("dd", null, toDisplayString($options.item.extension || '-'), 1
        /* TEXT */
        )]))])) : createCommentVNode("v-if", true)];
      }),
      _: 1
      /* STABLE */

    });
  }

  script$1.render = render$1;
  script$1.__file = "administrator/components/com_media/resources/scripts/components/infobar/infobar.vue";
  var script = {
    name: 'MediaUpload',
    props: {
      // eslint-disable-next-line vue/require-default-prop
      accept: {
        type: String
      },
      // eslint-disable-next-line vue/require-prop-types
      extensions: {
        default: function _default() {
          return [];
        }
      },
      name: {
        type: String,
        default: 'file'
      },
      multiple: {
        type: Boolean,
        default: true
      }
    },
    created: function created() {
      var _this28 = this;

      // Listen to the toolbar upload click event
      MediaManager.Event.listen('onClickUpload', function () {
        return _this28.chooseFiles();
      });
    },
    methods: {
      /* Open the choose-file dialog */
      chooseFiles: function chooseFiles() {
        this.$refs.fileInput.click();
      },

      /* Upload files */
      upload: function upload(e) {
        var _this29 = this;

        e.preventDefault();
        var files = e.target.files; // Loop through array of files and upload each file

        Array.from(files).forEach(function (file) {
          // Create a new file reader instance
          var reader = new FileReader(); // Add the on load callback

          reader.onload = function (progressEvent) {
            var result = progressEvent.target.result;
            var splitIndex = result.indexOf('base64') + 7;
            var content = result.slice(splitIndex, result.length); // Upload the file

            _this29.$store.dispatch('uploadFile', {
              name: file.name,
              parent: _this29.$store.state.selectedDirectory,
              content: content
            });
          };

          reader.readAsDataURL(file);
        });
      }
    }
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock("input", {
      ref: "fileInput",
      type: "file",
      class: "hidden",
      name: $props.name,
      multiple: $props.multiple,
      accept: $props.accept,
      onChange: _cache[1] || (_cache[1] = function () {
        return $options.upload && $options.upload.apply($options, arguments);
      })
    }, null, 40
    /* PROPS, HYDRATE_EVENTS */
    , ["name", "multiple", "accept"]);
  }

  script.render = render;
  script.__file = "administrator/components/com_media/resources/scripts/components/upload/upload.vue";
  /**
   * Translate plugin
   */

  var Translate = {
    // Translate from Joomla text
    translate: function translate(key) {
      return Joomla.JText._(key, key);
    },
    sprintf: function sprintf(string) {
      for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key18 = 1; _key18 < _len8; _key18++) {
        args[_key18 - 1] = arguments[_key18];
      }

      // eslint-disable-next-line no-param-reassign
      string = Translate.translate(string);
      var i = 0;
      return string.replace(/%((%)|s|d)/g, function (m) {
        var val = args[i];

        if (m === '%d') {
          val = parseFloat(val); // eslint-disable-next-line no-restricted-globals

          if (isNaN(val)) {
            val = 0;
          }
        } // eslint-disable-next-line no-plusplus


        i++;
        return val;
      });
    },
    install: function install(Vue) {
      return Vue.mixin({
        methods: {
          translate: function translate(key) {
            return Translate.translate(key);
          },
          sprintf: function sprintf(key) {
            for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key19 = 1; _key19 < _len9; _key19++) {
              args[_key19 - 1] = arguments[_key19];
            }

            return Translate.sprintf(key, args);
          }
        }
      });
    }
  };
  /*!
   * vuex v4.0.0
   * (c) 2021 Evan You
   * @license MIT
   */

  var storeKey = 'store';
  var target = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : {};
  var devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  function devtoolPlugin(store) {
    if (!devtoolHook) {
      return;
    }

    store._devtoolHook = devtoolHook;
    devtoolHook.emit('vuex:init', store);
    devtoolHook.on('vuex:travel-to-state', function (targetState) {
      store.replaceState(targetState);
    });
    store.subscribe(function (mutation, state) {
      devtoolHook.emit('vuex:mutation', mutation, state);
    }, {
      prepend: true
    });
    store.subscribeAction(function (action, state) {
      devtoolHook.emit('vuex:action', action, state);
    }, {
      prepend: true
    });
  }
  /**
   * forEach for object
   */


  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function (key) {
      return fn(obj[key], key);
    });
  }

  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  function isPromise(val) {
    return val && typeof val.then === 'function';
  }

  function partial(fn, arg) {
    return function () {
      return fn(arg);
    };
  } // Base data struct for store's module, package with some attribute and method


  var Module = function Module(rawModule, runtime) {
    this.runtime = runtime; // Store some children item

    this._children = Object.create(null); // Store the origin module object which passed by programmer

    this._rawModule = rawModule;
    var rawState = rawModule.state; // Store the origin module's state

    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
  };

  var prototypeAccessors = {
    namespaced: {
      configurable: true
    }
  };

  prototypeAccessors.namespaced.get = function () {
    return !!this._rawModule.namespaced;
  };

  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };

  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };

  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };

  Module.prototype.hasChild = function hasChild(key) {
    return key in this._children;
  };

  Module.prototype.update = function update(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;

    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }

    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }

    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };

  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };

  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };

  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };

  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };

  Object.defineProperties(Module.prototype, prototypeAccessors);

  var ModuleCollection = function ModuleCollection(rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false);
  };

  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function (module, key) {
      return module.getChild(key);
    }, this.root);
  };

  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function (namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '');
    }, '');
  };

  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update([], this.root, rawRootModule);
  };

  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1 = this;
    if (runtime === void 0) runtime = true;
    var newModule = new Module(rawModule, runtime);

    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    } // register nested modules


    if (rawModule.modules) {
      forEachValue(rawModule.modules, function (rawChildModule, key) {
        this$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };

  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);

    if (!child) {
      return;
    }

    if (!child.runtime) {
      return;
    }

    parent.removeChild(key);
  };

  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];

    if (parent) {
      return parent.hasChild(key);
    }

    return false;
  };

  function update(path, targetModule, newModule) {
    targetModule.update(newModule); // update nested modules

    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          return;
        }

        update(path.concat(key), targetModule.getChild(key), newModule.modules[key]);
      }
    }
  }

  function createStore(options) {
    return new Store(options);
  }

  var Store = function Store(options) {
    var this$1 = this;
    if (options === void 0) options = {};
    var plugins = options.plugins;
    if (plugins === void 0) plugins = [];
    var strict = options.strict;
    if (strict === void 0) strict = false; // store internal state

    this._committing = false;
    this._actions = Object.create(null);
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = Object.create(null); // bind commit and dispatch to self

    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;

    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };

    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    }; // strict mode


    this.strict = strict;
    var state = this._modules.root.state; // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters

    installModule(this, state, [], this._modules.root); // initialize the store state, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)

    resetStoreState(this, state); // apply plugins

    plugins.forEach(function (plugin) {
      return plugin(this$1);
    });
    var useDevtools = options.devtools !== undefined ? options.devtools :
    /* Vue.config.devtools */
    true;

    if (useDevtools) {
      devtoolPlugin(this);
    }
  };

  var prototypeAccessors$1 = {
    state: {
      configurable: true
    }
  };

  Store.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
  };

  prototypeAccessors$1.state.get = function () {
    return this._state.data;
  };

  prototypeAccessors$1.state.set = function (v) {};

  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1 = this; // check object-style commit

    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var mutation = {
      type: type,
      payload: payload
    };
    var entry = this._mutations[type];

    if (!entry) {
      return;
    }

    this._withCommit(function () {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });

    this._subscribers.slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(function (sub) {
      return sub(mutation, this$1.state);
    });
  };

  Store.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1 = this; // check object-style dispatch

    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = {
      type: type,
      payload: payload
    };
    var entry = this._actions[type];

    if (!entry) {
      return;
    }

    try {
      this._actionSubscribers.slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .filter(function (sub) {
        return sub.before;
      }).forEach(function (sub) {
        return sub.before(action, this$1.state);
      });
    } catch (e) {}

    var result = entry.length > 1 ? Promise.all(entry.map(function (handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function (resolve, reject) {
      result.then(function (res) {
        try {
          this$1._actionSubscribers.filter(function (sub) {
            return sub.after;
          }).forEach(function (sub) {
            return sub.after(action, this$1.state);
          });
        } catch (e) {}

        resolve(res);
      }, function (error) {
        try {
          this$1._actionSubscribers.filter(function (sub) {
            return sub.error;
          }).forEach(function (sub) {
            return sub.error(action, this$1.state, error);
          });
        } catch (e) {}

        reject(error);
      });
    });
  };

  Store.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };

  Store.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === 'function' ? {
      before: fn
    } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };

  Store.prototype.watch = function watch$1(getter, cb, options) {
    var this$1 = this;
    return watch(function () {
      return getter(this$1.state, this$1.getters);
    }, cb, Object.assign({}, options));
  };

  Store.prototype.replaceState = function replaceState(state) {
    var this$1 = this;

    this._withCommit(function () {
      this$1._state.data = state;
    });
  };

  Store.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0) options = {};

    if (typeof path === 'string') {
      path = [path];
    }

    this._modules.register(path, rawModule);

    installModule(this, this.state, path, this._modules.get(path), options.preserveState); // reset store to update getters...

    resetStoreState(this, this.state);
  };

  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1 = this;

    if (typeof path === 'string') {
      path = [path];
    }

    this._modules.unregister(path);

    this._withCommit(function () {
      var parentState = getNestedState(this$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });

    resetStore(this);
  };

  Store.prototype.hasModule = function hasModule(path) {
    if (typeof path === 'string') {
      path = [path];
    }

    return this._modules.isRegistered(path);
  };

  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);

    resetStore(this, true);
  };

  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };

  Object.defineProperties(Store.prototype, prototypeAccessors$1);

  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }

    return function () {
      var i = subs.indexOf(fn);

      if (i > -1) {
        subs.splice(i, 1);
      }
    };
  }

  function resetStore(store, hot) {
    store._actions = Object.create(null);
    store._mutations = Object.create(null);
    store._wrappedGetters = Object.create(null);
    store._modulesNamespaceMap = Object.create(null);
    var state = store.state; // init all modules

    installModule(store, state, [], store._modules.root, true); // reset state

    resetStoreState(store, state, hot);
  }

  function resetStoreState(store, state, hot) {
    var oldState = store._state; // bind store public getters

    store.getters = {}; // reset local getters cache

    store._makeLocalGettersCache = Object.create(null);
    var wrappedGetters = store._wrappedGetters;
    var computedObj = {};
    forEachValue(wrappedGetters, function (fn, key) {
      // use computed to leverage its lazy-caching mechanism
      // direct inline function use will lead to closure preserving oldState.
      // using partial to return function with only arguments preserved in closure environment.
      computedObj[key] = partial(fn, store);
      Object.defineProperty(store.getters, key, {
        // TODO: use `computed` when it's possible. at the moment we can't due to
        // https://github.com/vuejs/vuex/pull/1883
        get: function get() {
          return computedObj[key]();
        },
        enumerable: true // for local getters

      });
    });
    store._state = reactive({
      data: state
    }); // enable strict mode for new state

    if (store.strict) {
      enableStrictMode(store);
    }

    if (oldState) {
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(function () {
          oldState.data = null;
        });
      }
    }
  }

  function installModule(store, rootState, path, module, hot) {
    var isRoot = !path.length;

    var namespace = store._modules.getNamespace(path); // register in namespace map


    if (module.namespaced) {
      if (store._modulesNamespaceMap[namespace] && "production" !== 'production') {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join('/'));
      }

      store._modulesNamespaceMap[namespace] = module;
    } // set state


    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];

      store._withCommit(function () {
        parentState[moduleName] = module.state;
      });
    }

    var local = module.context = makeLocalContext(store, namespace, path);
    module.forEachMutation(function (mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store, namespacedType, mutation, local);
    });
    module.forEachAction(function (action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store, type, handler, local);
    });
    module.forEachGetter(function (getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store, namespacedType, getter, local);
    });
    module.forEachChild(function (child, key) {
      installModule(store, rootState, path.concat(key), child, hot);
    });
  }
  /**
   * make localized dispatch, commit, getters and state
   * if there is no namespace, just use root ones
   */


  function makeLocalContext(store, namespace, path) {
    var noNamespace = namespace === '';
    var local = {
      dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
        }

        return store.dispatch(type, payload);
      },
      commit: noNamespace ? store.commit : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
        }

        store.commit(type, payload, options);
      }
    }; // getters and state object must be gotten lazily
    // because they will be changed by state update

    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function () {
          return store.getters;
        } : function () {
          return makeLocalGetters(store, namespace);
        }
      },
      state: {
        get: function get() {
          return getNestedState(store.state, path);
        }
      }
    });
    return local;
  }

  function makeLocalGetters(store, namespace) {
    if (!store._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store.getters).forEach(function (type) {
        // skip if the target getter is not match this namespace
        if (type.slice(0, splitPos) !== namespace) {
          return;
        } // extract local getter type


        var localType = type.slice(splitPos); // Add a port to the getters proxy.
        // Define as getter property because
        // we do not want to evaluate the getters in this time.

        Object.defineProperty(gettersProxy, localType, {
          get: function get() {
            return store.getters[type];
          },
          enumerable: true
        });
      });
      store._makeLocalGettersCache[namespace] = gettersProxy;
    }

    return store._makeLocalGettersCache[namespace];
  }

  function registerMutation(store, type, handler, local) {
    var entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store, local.state, payload);
    });
  }

  function registerAction(store, type, handler, local) {
    var entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      }, payload);

      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }

      if (store._devtoolHook) {
        return res.catch(function (err) {
          store._devtoolHook.emit('vuex:error', err);

          throw err;
        });
      } else {
        return res;
      }
    });
  }

  function registerGetter(store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      return;
    }

    store._wrappedGetters[type] = function wrappedGetter(store) {
      return rawGetter(local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
      );
    };
  }

  function enableStrictMode(store) {
    watch(function () {
      return store._state.data;
    }, function () {}, {
      deep: true,
      flush: 'sync'
    });
  }

  function getNestedState(state, path) {
    return path.reduce(function (state, key) {
      return state[key];
    }, state);
  }

  function unifyObjectStyle(type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }

    return {
      type: type,
      payload: payload,
      options: options
    };
  }

  var r = function r(_r) {
    return function (r) {
      return !!r && "object" == typeof r;
    }(_r) && !function (r) {
      var t = Object.prototype.toString.call(r);
      return "[object RegExp]" === t || "[object Date]" === t || function (r) {
        return r.$$typeof === e;
      }(r);
    }(_r);
  },
      e = "function" == typeof Symbol && Symbol.for ? Symbol.for("react.element") : 60103;

  function t(r, e) {
    return !1 !== e.clone && e.isMergeableObject(r) ? u(Array.isArray(r) ? [] : {}, r, e) : r;
  }

  function n(r, e, n) {
    return r.concat(e).map(function (r) {
      return t(r, n);
    });
  }

  function o(r) {
    return Object.keys(r).concat(function (r) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r).filter(function (e) {
        return r.propertyIsEnumerable(e);
      }) : [];
    }(r));
  }

  function c(r, e) {
    try {
      return e in r;
    } catch (r) {
      return !1;
    }
  }

  function u(e, i, a) {
    (a = a || {}).arrayMerge = a.arrayMerge || n, a.isMergeableObject = a.isMergeableObject || r, a.cloneUnlessOtherwiseSpecified = t;
    var f = Array.isArray(i);
    return f === Array.isArray(e) ? f ? a.arrayMerge(e, i, a) : function (r, e, n) {
      var i = {};
      return n.isMergeableObject(r) && o(r).forEach(function (e) {
        i[e] = t(r[e], n);
      }), o(e).forEach(function (o) {
        (function (r, e) {
          return c(r, e) && !(Object.hasOwnProperty.call(r, e) && Object.propertyIsEnumerable.call(r, e));
        })(r, o) || (i[o] = c(r, o) && n.isMergeableObject(e[o]) ? function (r, e) {
          if (!e.customMerge) return u;
          var t = e.customMerge(r);
          return "function" == typeof t ? t : u;
        }(o, n)(r[o], e[o], n) : t(e[o], n));
      }), i;
    }(e, i, a) : t(i, a);
  }

  u.all = function (r, e) {
    if (!Array.isArray(r)) throw new Error("first argument should be an array");
    return r.reduce(function (r, t) {
      return u(r, t, e);
    }, {});
  };

  var i = u;

  function a(r) {
    var e = (r = r || {}).storage || window && window.localStorage,
        t = r.key || "vuex";

    function n(r, e) {
      var t = e.getItem(r);

      try {
        return void 0 !== t ? JSON.parse(t) : void 0;
      } catch (r) {}
    }

    function o() {
      return !0;
    }

    function c(r, e, t) {
      return t.setItem(r, JSON.stringify(e));
    }

    function u(r, e) {
      return Array.isArray(e) ? e.reduce(function (e, t) {
        return function (r, e, t, n) {
          return !/__proto__/.test(e) && ((e = e.split ? e.split(".") : e.slice(0)).slice(0, -1).reduce(function (r, e) {
            return r[e] = r[e] || {};
          }, r)[e.pop()] = t), r;
        }(e, t, (n = r, void 0 === (n = ((o = t).split ? o.split(".") : o).reduce(function (r, e) {
          return r && r[e];
        }, n)) ? void 0 : n));
        var n, o;
      }, {}) : r;
    }

    function a(r) {
      return function (e) {
        return r.subscribe(e);
      };
    }

    (r.assertStorage || function () {
      e.setItem("@@", 1), e.removeItem("@@");
    })(e);

    var f,
        s = function s() {
      return (r.getState || n)(t, e);
    };

    return r.fetchBeforeUse && (f = s()), function (n) {
      r.fetchBeforeUse || (f = s()), "object" == typeof f && null !== f && (n.replaceState(r.overwrite ? f : i(n.state, f, {
        arrayMerge: r.arrayMerger || function (r, e) {
          return e;
        },
        clone: !1
      })), (r.rehydrated || function () {})(n)), (r.subscriber || a)(n)(function (n, i) {
        (r.filter || o)(n) && (r.setState || c)(t, (r.reducer || u)(i, r.paths), e);
      });
    };
  } // The options for persisting state
  // eslint-disable-next-line import/prefer-default-export


  var persistedStateOptions = {
    key: 'joomla.mediamanager',
    paths: ['selectedDirectory', 'showInfoBar', 'listView', 'gridSize'],
    storage: window.sessionStorage
  };
  var options = Joomla.getOptions('com_media', {});

  if (options.providers === undefined || options.providers.length === 0) {
    throw new TypeError('Media providers are not defined.');
  } // Load disks from options


  var loadedDisks = options.providers.map(function (disk) {
    return {
      displayName: disk.displayName,
      drives: disk.adapterNames.map(function (account, index) {
        return {
          root: disk.name + "-" + index + ":/",
          displayName: account
        };
      })
    };
  });

  if (loadedDisks[0].drives[0] === undefined || loadedDisks[0].drives.length === 0) {
    throw new TypeError('No default media drive was found');
  } // Override the storage if we have a path


  if (options.currentPath) {
    var storedState = JSON.parse(persistedStateOptions.storage.getItem(persistedStateOptions.key));

    if (storedState && storedState.selectedDirectory && storedState.selectedDirectory !== options.currentPath) {
      storedState.selectedDirectory = options.currentPath;
      persistedStateOptions.storage.setItem(persistedStateOptions.key, JSON.stringify(storedState));
    }
  } // The initial state


  var state = {
    // The general loading state
    isLoading: false,
    // Will hold the activated filesystem disks
    disks: loadedDisks,
    // The loaded directories
    directories: loadedDisks.map(function (disk) {
      return {
        path: disk.drives[0].root,
        name: disk.displayName,
        directories: [],
        files: [],
        directory: null
      };
    }),
    // The loaded files
    files: [],
    // The selected disk. Providers are ordered by plugin ordering, so we set the first provider
    // in the list as the default provider and load first drive on it as default
    selectedDirectory: options.currentPath || loadedDisks[0].drives[0].root,
    // The currently selected items
    selectedItems: [],
    // The state of the infobar
    showInfoBar: false,
    // List view
    listView: 'grid',
    // The size of the grid items
    gridSize: 'md',
    // The state of confirm delete model
    showConfirmDeleteModal: false,
    // The state of create folder model
    showCreateFolderModal: false,
    // The state of preview model
    showPreviewModal: false,
    // The state of share model
    showShareModal: false,
    // The state of  model
    showRenameModal: false,
    // The preview item
    previewItem: null,
    // The Search Query
    search: ''
  }; // Sometimes we may need to compute derived state based on store state,
  // for example filtering through a list of items and counting them.

  /**
   * Get the currently selected directory
   * @param state
   * @returns {*}
   */

  var getSelectedDirectory = function getSelectedDirectory(state) {
    return state.directories.find(function (directory) {
      return directory.path === state.selectedDirectory;
    });
  };
  /**
   * Get the sudirectories of the currently selected directory
   * @param state
   *
   * @returns {Array|directories|{/}|computed.directories|*|Object}
   */


  var getSelectedDirectoryDirectories = function getSelectedDirectoryDirectories(state) {
    return state.directories.filter(function (directory) {
      return directory.directory === state.selectedDirectory;
    });
  };
  /**
   * Get the files of the currently selected directory
   * @param state
   *
   * @returns {Array|files|{}|FileList|*}
   */


  var getSelectedDirectoryFiles = function getSelectedDirectoryFiles(state) {
    return state.files.filter(function (file) {
      return file.directory === state.selectedDirectory;
    });
  };
  /**
   * Whether or not all items of the current directory are selected
   * @param state
   * @param getters
   * @returns Array
   */


  var getSelectedDirectoryContents = function getSelectedDirectoryContents(state, getters) {
    return [].concat(getters.getSelectedDirectoryDirectories, getters.getSelectedDirectoryFiles);
  };

  var getters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getSelectedDirectory: getSelectedDirectory,
    getSelectedDirectoryDirectories: getSelectedDirectoryDirectories,
    getSelectedDirectoryFiles: getSelectedDirectoryFiles,
    getSelectedDirectoryContents: getSelectedDirectoryContents
  }); // - Instead of mutating the state, actions commit mutations.
  // - Actions can contain arbitrary asynchronous operations.
  // TODO move to utils

  function updateUrlPath(path) {
    if (path == null) {
      // eslint-disable-next-line no-param-reassign
      path = '';
    }

    var url = window.location.href;
    var pattern = new RegExp('\\b(path=).*?(&|$)');

    if (url.search(pattern) >= 0) {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(null, '', url.replace(pattern, "$1" + path + "$2"));
    } else {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(null, '', url + (url.indexOf('?') > 0 ? '&' : '?') + "path=" + path);
    }
  }
  /**
   * Get contents of a directory from the api
   * @param context
   * @param payload
   */


  var getContents = function getContents(context, payload) {
    // Update the url
    updateUrlPath(payload);
    context.commit(SET_IS_LOADING, true);
    api.getContents(payload, 0).then(function (contents) {
      context.commit(LOAD_CONTENTS_SUCCESS, contents);
      context.commit(UNSELECT_ALL_BROWSER_ITEMS);
      context.commit(SELECT_DIRECTORY, payload);
      context.commit(SET_IS_LOADING, false);
    }).catch(function (error) {
      // TODO error handling
      context.commit(SET_IS_LOADING, false); // eslint-disable-next-line no-console

      console.log('error', error);
    });
  };
  /**
   * Get the full contents of a directory
   * @param context
   * @param payload
   */


  var getFullContents = function getFullContents(context, payload) {
    context.commit(SET_IS_LOADING, true);
    api.getContents(payload.path, 1).then(function (contents) {
      context.commit(LOAD_FULL_CONTENTS_SUCCESS, contents.files[0]);
      context.commit(SET_IS_LOADING, false);
    }).catch(function (error) {
      // TODO error handling
      context.commit(SET_IS_LOADING, false); // eslint-disable-next-line no-console

      console.log('error', error);
    });
  };
  /**
   * Download a file
   * @param context
   * @param payload
   */


  var download = function download(context, payload) {
    api.getContents(payload.path, 0, 1).then(function (contents) {
      var file = contents.files[0]; // Convert the base 64 encoded string to a blob

      var byteCharacters = atob(file.content);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += 512) {
        var slice = byteCharacters.slice(offset, offset + 512);
        var byteNumbers = new Array(slice.length); // eslint-disable-next-line no-plusplus

        for (var _i41 = 0; _i41 < slice.length; _i41++) {
          byteNumbers[_i41] = slice.charCodeAt(_i41);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      } // Download file


      var blobURL = URL.createObjectURL(new Blob(byteArrays, {
        type: file.mime_type
      }));
      var a = document.createElement('a');
      a.href = blobURL;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }).catch(function (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
    });
  };
  /**
   * Toggle the selection state of an item
   * @param context
   * @param payload
   */


  var toggleBrowserItemSelect = function toggleBrowserItemSelect(context, payload) {
    var item = payload;
    var isSelected = context.state.selectedItems.some(function (selected) {
      return selected.path === item.path;
    });

    if (!isSelected) {
      context.commit(SELECT_BROWSER_ITEM, item);
    } else {
      context.commit(UNSELECT_BROWSER_ITEM, item);
    }
  };
  /**
   * Create a new folder
   * @param context
   * @param payload object with the new folder name and its parent directory
   */


  var createDirectory = function createDirectory(context, payload) {
    context.commit(SET_IS_LOADING, true);
    api.createDirectory(payload.name, payload.parent).then(function (folder) {
      context.commit(CREATE_DIRECTORY_SUCCESS, folder);
      context.commit(HIDE_CREATE_FOLDER_MODAL);
      context.commit(SET_IS_LOADING, false);
    }).catch(function (error) {
      // TODO error handling
      context.commit(SET_IS_LOADING, false); // eslint-disable-next-line no-console

      console.log('error', error);
    });
  };
  /**
   * Create a new folder
   * @param context
   * @param payload object with the new folder name and its parent directory
   */


  var uploadFile = function uploadFile(context, payload) {
    context.commit(SET_IS_LOADING, true);
    api.upload(payload.name, payload.parent, payload.content, payload.override || false).then(function (file) {
      context.commit(UPLOAD_SUCCESS, file);
      context.commit(SET_IS_LOADING, false);
    }).catch(function (error) {
      context.commit(SET_IS_LOADING, false); // Handle file exists

      if (error.status === 409) {
        if (notifications.ask(Translate.sprintf('COM_MEDIA_FILE_EXISTS_AND_OVERRIDE', payload.name), {})) {
          payload.override = true;
          uploadFile(context, payload);
        }
      }
    });
  };
  /**
   * Rename an item
   * @param context
   * @param payload object: the old and the new path
   */


  var renameItem = function renameItem(context, payload) {
    context.commit(SET_IS_LOADING, true);
    api.rename(payload.path, payload.newPath).then(function (item) {
      context.commit(RENAME_SUCCESS, {
        item: item,
        oldPath: payload.path,
        newName: payload.newName
      });
      context.commit(HIDE_RENAME_MODAL);
      context.commit(SET_IS_LOADING, false);
    }).catch(function (error) {
      // TODO error handling
      context.commit(SET_IS_LOADING, false); // eslint-disable-next-line no-console

      console.log('error', error);
    });
  };
  /**
   * Delete the selected items
   * @param context
   */


  var deleteSelectedItems = function deleteSelectedItems(context) {
    context.commit(SET_IS_LOADING, true); // Get the selected items from the store

    var selectedItems = context.state.selectedItems;

    if (selectedItems.length > 0) {
      selectedItems.forEach(function (item) {
        api.delete(item.path).then(function () {
          context.commit(DELETE_SUCCESS, item);
          context.commit(UNSELECT_ALL_BROWSER_ITEMS);
          context.commit(SET_IS_LOADING, false);
        }).catch(function (error) {
          // TODO error handling
          context.commit(SET_IS_LOADING, false); // eslint-disable-next-line no-console

          console.log('error', error);
        });
      });
    }
  };

  var actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getContents: getContents,
    getFullContents: getFullContents,
    download: download,
    toggleBrowserItemSelect: toggleBrowserItemSelect,
    createDirectory: createDirectory,
    uploadFile: uploadFile,
    renameItem: renameItem,
    deleteSelectedItems: deleteSelectedItems
  }); // Mutations are very similar to events: each mutation has a string type and a handler.
  // The handler function is where we perform actual state modifications,
  // and it will receive the state as the first argument.
  // The grid item sizes

  var gridItemSizes = ['sm', 'md', 'lg', 'xl'];
  var mutations = (_mutations = {}, _mutations[SELECT_DIRECTORY] = function (state, payload) {
    state.selectedDirectory = payload;
  }, _mutations[LOAD_CONTENTS_SUCCESS] = function (state, payload) {
    /**
         * Create the directory structure
         * @param path
         */
    function createDirectoryStructureFromPath(path) {
      var exists = state.directories.some(function (existing) {
        return existing.path === path;
      });

      if (!exists) {
        // eslint-disable-next-line no-use-before-define
        var directory = directoryFromPath(path); // Add the sub directories and files

        directory.directories = state.directories.filter(function (existing) {
          return existing.directory === directory.path;
        }).map(function (existing) {
          return existing.path;
        }); // Add the directory

        state.directories.push(directory);

        if (directory.directory) {
          createDirectoryStructureFromPath(directory.directory);
        }
      }
    }
    /**
         * Create a directory from a path
         * @param path
         */


    function directoryFromPath(path) {
      var parts = path.split('/');
      var directory = dirname(path);

      if (directory.indexOf(':', directory.length - 1) !== -1) {
        directory += '/';
      }

      return {
        path: path,
        name: parts[parts.length - 1],
        directories: [],
        files: [],
        directory: directory !== '.' ? directory : null,
        type: 'dir',
        mime_type: 'directory'
      };
    }
    /**
         * Add a directory
         * @param state
         * @param directory
         */
    // eslint-disable-next-line no-shadow


    function addDirectory(state, directory) {
      var parentDirectory = state.directories.find(function (existing) {
        return existing.path === directory.directory;
      });
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory);
      var index = state.directories.findIndex(function (existing) {
        return existing.path === directory.path;
      });

      if (index === -1) {
        index = state.directories.length;
      } // Add the directory


      state.directories.splice(index, 1, directory); // Update the relation to the parent directory

      if (parentDirectoryIndex !== -1) {
        state.directories.splice(parentDirectoryIndex, 1, Object.assign({}, parentDirectory, {
          directories: [].concat(parentDirectory.directories, [directory.path])
        }));
      }
    }
    /**
         * Add a file
         * @param state
         * @param directory
         */
    // eslint-disable-next-line no-shadow


    function addFile(state, file) {
      var parentDirectory = state.directories.find(function (directory) {
        return directory.path === file.directory;
      });
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory);
      var index = state.files.findIndex(function (existing) {
        return existing.path === file.path;
      });

      if (index === -1) {
        index = state.files.length;
      } // Add the file


      state.files.splice(index, 1, file); // Update the relation to the parent directory

      if (parentDirectoryIndex !== -1) {
        state.directories.splice(parentDirectoryIndex, 1, Object.assign({}, parentDirectory, {
          files: [].concat(parentDirectory.files, [file.path])
        }));
      }
    } // Create the parent directory structure if it does not exist


    createDirectoryStructureFromPath(state.selectedDirectory); // Add directories

    payload.directories.forEach(function (directory) {
      addDirectory(state, directory);
    }); // Add files

    payload.files.forEach(function (file) {
      addFile(state, file);
    });
  }, _mutations[UPLOAD_SUCCESS] = function (state, payload) {
    var file = payload;
    var isNew = !state.files.some(function (existing) {
      return existing.path === file.path;
    }); // TODO handle file_exists

    if (isNew) {
      var parentDirectory = state.directories.find(function (existing) {
        return existing.path === file.directory;
      });
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory); // Add the new file to the files array

      state.files.push(file); // Update the relation to the parent directory

      state.directories.splice(parentDirectoryIndex, 1, Object.assign({}, parentDirectory, {
        files: [].concat(parentDirectory.files, [file.path])
      }));
    }
  }, _mutations[CREATE_DIRECTORY_SUCCESS] = function (state, payload) {
    var directory = payload;
    var isNew = !state.directories.some(function (existing) {
      return existing.path === directory.path;
    });

    if (isNew) {
      var parentDirectory = state.directories.find(function (existing) {
        return existing.path === directory.directory;
      });
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory); // Add the new directory to the directory

      state.directories.push(directory); // Update the relation to the parent directory

      state.directories.splice(parentDirectoryIndex, 1, Object.assign({}, parentDirectory, {
        directories: [].concat(parentDirectory.directories, [directory.path])
      }));
    }
  }, _mutations[RENAME_SUCCESS] = function (state, payload) {
    state.selectedItems[state.selectedItems.length - 1].name = payload.newName;
    var item = payload.item;
    var oldPath = payload.oldPath;

    if (item.type === 'file') {
      var index = state.files.findIndex(function (file) {
        return file.path === oldPath;
      });
      state.files.splice(index, 1, item);
    } else {
      var _index = state.directories.findIndex(function (directory) {
        return directory.path === oldPath;
      });

      state.directories.splice(_index, 1, item);
    }
  }, _mutations[DELETE_SUCCESS] = function (state, payload) {
    var item = payload; // Delete file

    if (item.type === 'file') {
      state.files.splice(state.files.findIndex(function (file) {
        return file.path === item.path;
      }), 1);
    } // Delete dir


    if (item.type === 'dir') {
      state.directories.splice(state.directories.findIndex(function (directory) {
        return directory.path === item.path;
      }), 1);
    }
  }, _mutations[SELECT_BROWSER_ITEM] = function (state, payload) {
    state.selectedItems.push(payload);
  }, _mutations[SELECT_BROWSER_ITEMS] = function (state, payload) {
    state.selectedItems = payload;
  }, _mutations[UNSELECT_BROWSER_ITEM] = function (state, payload) {
    var item = payload;
    state.selectedItems.splice(state.selectedItems.findIndex(function (selectedItem) {
      return selectedItem.path === item.path;
    }), 1);
  }, _mutations[UNSELECT_ALL_BROWSER_ITEMS] = function (state) {
    state.selectedItems = [];
  }, _mutations[SHOW_CREATE_FOLDER_MODAL] = function (state) {
    state.showCreateFolderModal = true;
  }, _mutations[HIDE_CREATE_FOLDER_MODAL] = function (state) {
    state.showCreateFolderModal = false;
  }, _mutations[SHOW_INFOBAR] = function (state) {
    state.showInfoBar = true;
  }, _mutations[HIDE_INFOBAR] = function (state) {
    state.showInfoBar = false;
  }, _mutations[CHANGE_LIST_VIEW] = function (state, view) {
    state.listView = view;
  }, _mutations[LOAD_FULL_CONTENTS_SUCCESS] = function (state, payload) {
    state.previewItem = payload;
  }, _mutations[SHOW_PREVIEW_MODAL] = function (state) {
    state.showPreviewModal = true;
  }, _mutations[HIDE_PREVIEW_MODAL] = function (state) {
    state.showPreviewModal = false;
  }, _mutations[SET_IS_LOADING] = function (state, payload) {
    state.isLoading = payload;
  }, _mutations[SHOW_RENAME_MODAL] = function (state) {
    state.showRenameModal = true;
  }, _mutations[HIDE_RENAME_MODAL] = function (state) {
    state.showRenameModal = false;
  }, _mutations[SHOW_SHARE_MODAL] = function (state) {
    state.showShareModal = true;
  }, _mutations[HIDE_SHARE_MODAL] = function (state) {
    state.showShareModal = false;
  }, _mutations[INCREASE_GRID_SIZE] = function (state) {
    var currentSizeIndex = gridItemSizes.indexOf(state.gridSize);

    if (currentSizeIndex >= 0 && currentSizeIndex < gridItemSizes.length - 1) {
      // eslint-disable-next-line no-plusplus
      state.gridSize = gridItemSizes[++currentSizeIndex];
    }
  }, _mutations[DECREASE_GRID_SIZE] = function (state) {
    var currentSizeIndex = gridItemSizes.indexOf(state.gridSize);

    if (currentSizeIndex > 0 && currentSizeIndex < gridItemSizes.length) {
      // eslint-disable-next-line no-plusplus
      state.gridSize = gridItemSizes[--currentSizeIndex];
    }
  }, _mutations[SET_SEARCH_QUERY] = function (state, query) {
    state.search = query;
  }, _mutations[SHOW_CONFIRM_DELETE_MODAL] = function (state) {
    state.showConfirmDeleteModal = true;
  }, _mutations[HIDE_CONFIRM_DELETE_MODAL] = function (state) {
    state.showConfirmDeleteModal = false;
  }, _mutations);
  var store = createStore({
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
    plugins: [a(persistedStateOptions)],
    strict: "production" !== 'production'
  });
  window.MediaManager = window.MediaManager || {}; // Register the media manager event bus

  window.MediaManager.Event = new Event(); // Create the Vue app instance

  var app = createApp(script$k);
  app.use(store);
  app.use(Translate); // Register the vue components

  app.component('MediaDrive', script$i);
  app.component('MediaDisk', script$j);
  app.component('MediaTree', script$h);
  app.component('MediaTreeItem', script$g);
  app.component('MediaToolbar', script$f);
  app.component('MediaBreadcrumb', script$e);
  app.component('MediaBrowser', script$d);
  app.component('MediaBrowserItem', BrowserItem);
  app.component('MediaBrowserItemRow', script$8);
  app.component('MediaModal', script$7);
  app.component('MediaCreateFolderModal', script$6);
  app.component('MediaPreviewModal', script$5);
  app.component('MediaRenameModal', script$4);
  app.component('MediaShareModal', script$3);
  app.component('MediaConfirmDeleteModal', script$2);
  app.component('MediaInfobar', script$1);
  app.component('MediaUpload', script);
  app.mount('#com-media');
  var mediaManager = {};

  return mediaManager;

}());
