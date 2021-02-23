var JoomlaMediaManager = (function () {
	'use strict';

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
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
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
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
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

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global$1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
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
	var store = global$1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global$1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var isPure = false;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.8.3',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global$1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    metadata.facade = it;
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
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
	    if (typeof key == 'string' && !has(value, 'name')) {
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

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global$1[namespace])
	    : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.es/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
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
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
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

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
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

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






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
	      descriptor = getOwnPropertyDescriptor$1(target, key);
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

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
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
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

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
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global$1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
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

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
	var createMethod$1 = function (TYPE) {
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
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6),
	  // `Array.prototype.filterOut` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterOut: createMethod$1(7)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global$1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global$1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
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
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
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
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.es/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.es/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
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
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
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

	hiddenKeys[HIDDEN] = true;

	var defineProperty$2 = objectDefineProperty.f;


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
	  defineProperty$2(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol('toStringTag');

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global$1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
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
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var defineProperty$3 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$3(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $every = arrayIteration.every;



	var STRICT_METHOD = arrayMethodIsStrict('every');
	var USES_TO_LENGTH = arrayMethodUsesToLength('every');

	// `Array.prototype.every` method
	// https://tc39.es/ecma262/#sec-array.prototype.every
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var $find = arrayIteration.find;



	var FIND = 'find';
	var SKIPS_HOLES = true;

	var USES_TO_LENGTH$2 = arrayMethodUsesToLength(FIND);

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$2 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var $findIndex = arrayIteration.findIndex;



	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES$1 = true;

	var USES_TO_LENGTH$3 = arrayMethodUsesToLength(FIND_INDEX);

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-array.prototype.findindex
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 || !USES_TO_LENGTH$3 }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND_INDEX);

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD$1 || !USES_TO_LENGTH$4) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var iteratorClose = function (iterator) {
	  var returnMethod = iterator['return'];
	  if (returnMethod !== undefined) {
	    return anObject(returnMethod.call(iterator)).value;
	  }
	};

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

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR] === it);
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

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

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
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

	var ITERATOR$2 = wellKnownSymbol('iterator');
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
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
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

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$5 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$6 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype$1 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$1 : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype[ITERATOR$3].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if (!has(IteratorPrototype, ITERATOR$3)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
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
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
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

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
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
	  if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
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
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

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
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
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

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$3 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$3 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var min$2 = Math.min;
	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf');
	// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
	var USES_TO_LENGTH$7 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });
	var FORCED$1 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$7;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$1 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = toLength(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$2(index, toInteger(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : nativeLastIndexOf;

	// `Array.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
	  lastIndexOf: arrayLastIndexOf
	});

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$8 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$8 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$2 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
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
	  left: createMethod$2(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$2(true)
	};

	var engineIsNode = classofRaw(global$1.process) == 'process';

	var $reduce = arrayReduce.left;





	var STRICT_METHOD$5 = arrayMethodIsStrict('reduce');
	var USES_TO_LENGTH$9 = arrayMethodUsesToLength('reduce', { 1: 0 });
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$5 || !USES_TO_LENGTH$9 || CHROME_BUG }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$a = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$a }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
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

	var $some = arrayIteration.some;



	var STRICT_METHOD$6 = arrayMethodIsStrict('some');
	var USES_TO_LENGTH$b = arrayMethodUsesToLength('some');

	// `Array.prototype.some` method
	// https://tc39.es/ecma262/#sec-array.prototype.some
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$6 || !USES_TO_LENGTH$b }, {
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$c = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$2 = Math.max;
	var min$3 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$c }, {
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
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
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

	var defineProperty$4 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$4(FunctionPrototype, NAME, {
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

	// JSON[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-json-@@tostringtag
	setToStringTag(global$1.JSON, 'JSON', true);

	// Math[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-math-@@tostringtag
	setToStringTag(Math, 'Math', true);

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
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
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$5 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global$1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
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
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key; keys$1.length > j; j++) {
	    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
	      defineProperty$5(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global$1, NUMBER, NumberWrapper);
	}

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
	var stringRepeat = ''.repeat || function repeat(count) {
	  var str = String(requireObjectCoercible(this));
	  var result = '';
	  var n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	var nativeToFixed = 1.0.toFixed;
	var floor$1 = Math.floor;

	var pow = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};

	var log = function (x) {
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

	var FORCED$2 = nativeToFixed && (
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
	_export({ target: 'Number', proto: true, forced: FORCED$2 }, {
	  // eslint-disable-next-line max-statements
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue(this);
	    var fractDigits = toInteger(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    var multiply = function (n, c) {
	      var index = -1;
	      var c2 = c;
	      while (++index < 6) {
	        c2 += n * data[index];
	        data[index] = c2 % 1e7;
	        c2 = floor$1(c2 / 1e7);
	      }
	    };

	    var divide = function (n) {
	      var index = 6;
	      var c = 0;
	      while (--index >= 0) {
	        c += data[index];
	        data[index] = floor$1(c / n);
	        c = (c % n) * 1e7;
	      }
	    };

	    var dataToString = function () {
	      var index = 6;
	      var s = '';
	      while (--index >= 0) {
	        if (s !== '' || index === 0 || data[index] !== 0) {
	          var t = String(data[index]);
	          s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
	        }
	      } return s;
	    };

	    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare
	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return String(number);
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log(number * pow(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        result = dataToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        result = dataToString() + stringRepeat.call('0', fractDigits);
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

	var nativeAssign = Object.assign;
	var defineProperty$6 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$6({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$6(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
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
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



	var METADATA = uid('meta');
	var id = 0;

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
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, METADATA)) {
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
	  if (!has(it, METADATA)) {
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
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	});

	var onFreeze = internalMetadata.onFreeze;

	var nativeFreeze = Object.freeze;
	var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

	// `Object.freeze` method
	// https://tc39.es/ecma262/#sec-object.freeze
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
	  freeze: function freeze(it) {
	    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
	  }
	});

	var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
	var FORCED$3 = !descriptors || FAILS_ON_PRIMITIVES$1;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$3, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
	  }
	});

	var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

	var FAILS_ON_PRIMITIVES$2 = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  getOwnPropertyNames: nativeGetOwnPropertyNames$2
	});

	var nativeIsExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES$3 = fails(function () { nativeIsExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 }, {
	  isExtensible: function isExtensible(it) {
	    return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
	  }
	});

	var nativeIsFrozen = Object.isFrozen;
	var FAILS_ON_PRIMITIVES$4 = fails(function () { nativeIsFrozen(1); });

	// `Object.isFrozen` method
	// https://tc39.es/ecma262/#sec-object.isfrozen
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
	  isFrozen: function isFrozen(it) {
	    return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
	  }
	});

	var FAILS_ON_PRIMITIVES$5 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var nativePromiseConstructor = global$1.Promise;

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
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

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location = global$1.location;
	var set$1 = global$1.setImmediate;
	var clear = global$1.clearImmediate;
	var process$1 = global$1.process;
	var MessageChannel = global$1.MessageChannel;
	var Dispatch = global$1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
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
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (engineIsNode) {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
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

	var task = {
	  set: set$1,
	  clear: clear
	};

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task.set;




	var MutationObserver$1 = global$1.MutationObserver || global$1.WebKitMutationObserver;
	var document$2 = global$1.document;
	var process$2 = global$1.process;
	var Promise$1 = global$1.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(global$1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (engineIsNode && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver$1 && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver$1(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;
	    notify = function () {
	      then.call(promise, flush);
	    };
	  // Node.js without promises
	  } else if (engineIsNode) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
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
	    notify();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$7
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
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

	var task$1 = task.set;











	var SPECIES$5 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$2 = internalState.get;
	var setInternalState$2 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global$1.TypeError;
	var document$3 = global$1.document;
	var process$3 = global$1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global$1.dispatchEvent);
	var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$4 = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!engineIsNode && !NATIVE_REJECTION_EVENT) return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$5] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION$1 = FORCED$4 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (state, isReject) {
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
	    event = document$3.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global$1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (!NATIVE_REJECTION_EVENT && (handler = global$1['on' + name])) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  task$1.call(global$1, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (engineIsNode) {
	          process$3.emit('unhandledRejection', value, promise);
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
	  task$1.call(global$1, function () {
	    var promise = state.facade;
	    if (engineIsNode) {
	      process$3.emit('rejectionHandled', promise);
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
	  notify$1(state, true);
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
	      notify$1(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$4) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState$2(this);
	    try {
	      executor(bind(internalResolve, state), bind(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$2(this, {
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
	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = engineIsNode ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(state, false);
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
	    var state = getInternalState$2(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, state);
	    this.reject = bind(internalReject, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global$1, arguments));
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$4 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$4 }, {
	  // `Promise.reject` method
	  // https://tc39.es/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced: FORCED$4 }, {
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
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
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
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// `Reflect.ownKeys` method
	// https://tc39.es/ecma262/#sec-reflect.ownkeys
	_export({ target: 'Reflect', stat: true }, {
	  ownKeys: ownKeys
	});

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
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

	var UNSUPPORTED_Y = fails(function () {
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
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var defineProperty$7 = objectDefineProperty.f;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;





	var setInternalState$3 = internalState.set;



	var MATCH$1 = wellKnownSymbol('match');
	var NativeRegExp = global$1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;

	var FORCED$5 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$1 || fails(function () {
	  re2[MATCH$1] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (FORCED$5) {
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

	    if (UNSUPPORTED_Y$1) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(
	      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
	      thisIsRegExp ? this : RegExpPrototype,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y$1 && sticky) setInternalState$3(result, { sticky: sticky });

	    return result;
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$7(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$2 = getOwnPropertyNames$1(NativeRegExp);
	  var index = 0;
	  while (keys$2.length > index) proxy(keys$2[index++]);
	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global$1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

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
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  // eslint-disable-next-line max-len
	  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })))) {
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
	    // eslint-disable-next-line no-new
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

	var defineProperty$8 = objectDefineProperty.f;








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
	    if (descriptors) defineProperty$8(C.prototype, 'size', {
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

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$2 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH$2] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$4 = function (CONVERT_TO_STRING) {
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
	  codeAt: createMethod$4(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$4(true)
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$5 = internalState.set;
	var getInternalState$3 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$5(this, {
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
	      if (regexp.exec === regexpExec) {
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

	var floor$2 = Math.floor;
	var replace = ''.replace;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace.call(replacement, symbols, function (match, ch) {
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
	          var f = floor$2(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var max$3 = Math.max;
	var min$4 = Math.min;

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
	        var position = max$3(min$4(toInteger(result.index), S.length), 0);
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

	// `SameValue` abstract operation
	// https://tc39.es/ecma262/#sec-samevalue
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
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

	var arrayPush = [].push;
	var min$5 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
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
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$5(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
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
	}, !SUPPORTS_Y);

	var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;






	var nativeStartsWith = ''.startsWith;
	var min$6 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.startswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = String(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var index = toLength(min$6(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

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

	var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

	var defineProperty$9 = objectDefineProperty.f;





	var Int8Array$1 = global$1.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray = global$1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype$2 = Object.prototype;
	var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global$1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME$1;

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
	  if (!isObject(it)) return false;
	  var klass = classof(it);
	  return klass === 'DataView'
	    || has(TypedArrayConstructorsList, klass)
	    || has(BigIntArrayConstructorsList, klass);
	};

	var isTypedArray = function (it) {
	  if (!isObject(it)) return false;
	  var klass = classof(it);
	  return has(TypedArrayConstructorsList, klass)
	    || has(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray = function (it) {
	  if (isTypedArray(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor = function (C) {
	  if (objectSetPrototypeOf) {
	    if (isPrototypeOf.call(TypedArray, C)) return C;
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
	    var TypedArrayConstructor = global$1[ARRAY];
	    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
	      return C;
	    }
	  } throw TypeError('Target is not a typed array constructor');
	};

	var exportTypedArrayMethod = function (KEY, property, forced) {
	  if (!descriptors) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global$1[ARRAY];
	    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
	      delete TypedArrayConstructor.prototype[KEY];
	    }
	  }
	  if (!TypedArrayPrototype[KEY] || forced) {
	    redefine(TypedArrayPrototype, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportTypedArrayStaticMethod = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) return;
	  if (objectSetPrototypeOf) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global$1[ARRAY];
	      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
	        delete TypedArrayConstructor[KEY];
	      }
	    }
	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
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

	for (NAME$1 in TypedArrayConstructorsList) {
	  if (!global$1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global$1[NAME$1]) objectSetPrototypeOf(global$1[NAME$1], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
	  TypedArrayPrototype = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global$1[NAME$1]) objectSetPrototypeOf(global$1[NAME$1].prototype, TypedArrayPrototype);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$9(TypedArrayPrototype, TO_STRING_TAG$3, { get: function () {
	    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	  } });
	  for (NAME$1 in TypedArrayConstructorsList) if (global$1[NAME$1]) {
	    createNonEnumerableProperty(global$1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
	  }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray,
	  aTypedArrayConstructor: aTypedArrayConstructor,
	  exportTypedArrayMethod: exportTypedArrayMethod,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype
	};

	/* eslint-disable no-new */

	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$1 = global$1.ArrayBuffer;
	var Int8Array$2 = global$1.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
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
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity$1 = 1 / 0;
	var abs = Math.abs;
	var pow$1 = Math.pow;
	var floor$3 = Math.floor;
	var log$1 = Math.log;
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
	  // eslint-disable-next-line no-self-compare
	  if (number != number || number === Infinity$1) {
	    // eslint-disable-next-line no-self-compare
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$3(log$1(number) / LN2);
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
	    return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
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

	var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
	var defineProperty$a = objectDefineProperty.f;




	var getInternalState$4 = internalState.get;
	var setInternalState$6 = internalState.set;
	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE$2 = 'prototype';
	var WRONG_LENGTH = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer = global$1[ARRAY_BUFFER];
	var $ArrayBuffer = NativeArrayBuffer;
	var $DataView = global$1[DATA_VIEW];
	var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
	var ObjectPrototype$3 = Object.prototype;
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
	  defineProperty$a(Constructor[PROTOTYPE$2], key, { get: function () { return getInternalState$4(this)[key]; } });
	};

	var get$1 = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$4(view);
	  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
	  var bytes = getInternalState$4(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = bytes.slice(start, start + count);
	  return isLittleEndian ? pack : pack.reverse();
	};

	var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$4(view);
	  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
	  var bytes = getInternalState$4(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!arrayBufferNative) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = toIndex(length);
	    setInternalState$6(this, {
	      bytes: arrayFill.call(new Array(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!descriptors) this.byteLength = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = getInternalState$4(buffer).byteLength;
	    var offset = toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
	    setInternalState$6(this, {
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

	  redefineAll($DataView[PROTOTYPE$2], {
	    getInt8: function getInt8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
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
	  if (!fails(function () {
	    NativeArrayBuffer(1);
	  }) || !fails(function () {
	    new NativeArrayBuffer(-1); // eslint-disable-line no-new
	  }) || fails(function () {
	    new NativeArrayBuffer(); // eslint-disable-line no-new
	    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
	    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
	    return NativeArrayBuffer.name != ARRAY_BUFFER;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, $ArrayBuffer);
	      return new NativeArrayBuffer(toIndex(length));
	    };
	    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];
	    for (var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1; keys$3.length > j$1;) {
	      if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
	      }
	    }
	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$3) {
	    objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$3);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var nativeSetInt8 = $DataViewPrototype.setInt8;
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
	    setInt8: function setInt8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
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

	var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

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
	  result = new (aTypedArrayConstructor$1(this))(length);
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
	    && isObject(descriptor)
	    && has(descriptor, 'value')
	    && !has(descriptor, 'get')
	    && !has(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!has(descriptor, 'writable') || descriptor.writable)
	    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
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
	        if (!isObject(data)) {
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
	          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
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

	var min$7 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = toLength(O.length);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$7((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
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

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
	  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var $every$1 = arrayIteration.every;

	var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
	  return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
	  return arrayFill.apply(aTypedArray$3(this), arguments);
	});

	var $filter$1 = arrayIteration.filter;


	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	});

	var $find$1 = arrayIteration.find;

	var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
	  return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findIndex$1 = arrayIteration.findIndex;

	var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $forEach$2 = arrayIteration.forEach;

	var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $includes$1 = arrayIncludes.includes;

	var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf$1 = arrayIncludes.indexOf;

	var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var Uint8Array$1 = global$1.Uint8Array;
	var arrayValues = es_array_iterator.values;
	var arrayKeys = es_array_iterator.keys;
	var arrayEntries = es_array_iterator.entries;
	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
	var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];

	var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
	  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$a(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$a('entries', function entries() {
	  return arrayEntries.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.keys` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$a('keys', function keys() {
	  return arrayKeys.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.values` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
	var $join = [].join;

	// `%TypedArray%.prototype.join` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$b('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var aTypedArray$c = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
	});

	var $map$1 = arrayIteration.map;


	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
	  return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length);
	  });
	});

	var $reduce$1 = arrayReduce.left;

	var aTypedArray$e = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
	  return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $reduceRight = arrayReduce.right;

	var aTypedArray$f = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  return $reduceRight(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
	var floor$4 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$g('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$g(that).length;
	  var middle = floor$4(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var aTypedArray$h = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

	var FORCED$6 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
	  aTypedArray$h(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = toLength(src.length);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$6);

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
	var $slice = [].slice;

	var FORCED$7 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$i('slice', function slice(start, end) {
	  var list = $slice.call(aTypedArray$i(this), start, end);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$4(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$7);

	var $some$1 = arrayIteration.some;

	var aTypedArray$j = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
	  return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
	var $sort = [].sort;

	// `%TypedArray%.prototype.sort` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$k('sort', function sort(comparefn) {
	  return $sort.call(aTypedArray$k(this), comparefn);
	});

	var aTypedArray$l = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
	  var O = aTypedArray$l(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  return new (speciesConstructor(O, O.constructor))(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var Int8Array$3 = global$1.Int8Array;
	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;
	var $slice$1 = [].slice;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
	  $toLocaleString.call(new Int8Array$3(1));
	});

	var FORCED$8 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$3.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
	}, FORCED$8);

	var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



	var Uint8Array$2 = global$1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
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
	exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

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

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global$1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	var ITERATOR$6 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global$1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$6, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$6] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
	      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1);
	    }
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var ITERATOR$7 = wellKnownSymbol('iterator');

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
	    || !searchParams[ITERATOR$7]
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
	var floor$5 = Math.floor;
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
	  delta = firstTime ? floor$5(delta / damp) : delta >> 1;
	  delta += floor$5(delta / numPoints);
	  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
	    delta = floor$5(delta / baseMinusTMin);
	  }
	  return floor$5(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	// eslint-disable-next-line  max-statements
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
	    if (m - n > floor$5((maxInt - delta) / handledCPCountPlusOne)) {
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
	          q = floor$5(qMinusT / baseMinusT);
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





















	var $fetch$1 = getBuiltIn('fetch');
	var Headers = getBuiltIn('Headers');
	var ITERATOR$8 = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$7 = internalState.set;
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

	var replace$1 = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replace$1[match];
	};

	var serialize = function (it) {
	  return encodeURIComponent(it).replace(find, replacer);
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
	  setInternalState$7(this, {
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

	  setInternalState$7(that, {
	    type: URL_SEARCH_PARAMS,
	    entries: entries,
	    updateURL: function () { /* empty */ },
	    updateSearchParams: updateSearchParams
	  });

	  if (init !== undefined) {
	    if (isObject(init)) {
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
	      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
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
	redefine(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries);

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
	if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
	  _export({ global: true, enumerable: true, forced: true }, {
	    fetch: function fetch(input /* , init */) {
	      var args = [input];
	      var init, body, headers;
	      if (arguments.length > 1) {
	        init = arguments[1];
	        if (isObject(init)) {
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
	      } return $fetch$1.apply(this, args);
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
	var setInternalState$8 = internalState.set;
	var getInternalURLState = internalState.getterFor('URL');
	var floor$6 = Math.floor;
	var pow$2 = Math.pow;

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[A-Za-z]/;
	var ALPHANUMERIC = /[\d+-.A-Za-z]/;
	var DIGIT = /\d/;
	var HEX_START = /^(0x|0X)/;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\dA-Fa-f]+$/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
	// eslint-disable-next-line no-control-regex
	var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
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
	      if (number >= pow$2(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow$2(256, 3 - index);
	  }
	  return ipv4;
	};

	// eslint-disable-next-line max-statements
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
	      host = floor$6(host / 256);
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
	  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
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
	  return has(specialSchemes, url.scheme);
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

	// eslint-disable-next-line max-statements
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
	            (isSpecial(url) != has(specialSchemes, buffer)) ||
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
	  var state = setInternalState$8(that, { type: 'URL' });
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
	    return new URL(scheme.path[0]).origin;
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
	  // eslint-disable-next-line no-unused-vars
	  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
	    return nativeCreateObjectURL.apply(NativeURL, arguments);
	  });
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
	    return nativeRevokeObjectURL.apply(NativeURL, arguments);
	  });
	}

	setToStringTag(URLConstructor, 'URL');

	_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
	  URL: URLConstructor
	});

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

	var _mutations;
	var t = Object.freeze({});

	function e(t) {
	  return null == t;
	}

	function n(t) {
	  return null != t;
	}

	function o(t) {
	  return !0 === t;
	}

	function r(t) {
	  return "string" == typeof t || "number" == typeof t || "symbol" == typeof t || "boolean" == typeof t;
	}

	function s(t) {
	  return null !== t && "object" == typeof t;
	}

	var i = Object.prototype.toString;

	function a(t) {
	  return "[object Object]" === i.call(t);
	}

	function c(t) {
	  var e = parseFloat(String(t));
	  return e >= 0 && Math.floor(e) === e && isFinite(t);
	}

	function l(t) {
	  return n(t) && "function" == typeof t.then && "function" == typeof t.catch;
	}

	function u(t) {
	  return null == t ? "" : Array.isArray(t) || a(t) && t.toString === i ? JSON.stringify(t, null, 2) : String(t);
	}

	function f$8(t) {
	  var e = parseFloat(t);
	  return isNaN(e) ? t : e;
	}

	function d(t, e) {
	  var n = Object.create(null),
	      o = t.split(",");

	  for (var _t2 = 0; _t2 < o.length; _t2++) {
	    n[o[_t2]] = !0;
	  }

	  return e ? function (t) {
	    return n[t.toLowerCase()];
	  } : function (t) {
	    return n[t];
	  };
	}

	var p = d("slot,component", !0),
	    h = d("key,ref,slot,slot-scope,is");

	function m(t, e) {
	  if (t.length) {
	    var _n2 = t.indexOf(e);

	    if (_n2 > -1) return t.splice(_n2, 1);
	  }
	}

	var y = Object.prototype.hasOwnProperty;

	function g(t, e) {
	  return y.call(t, e);
	}

	function v(t) {
	  var e = Object.create(null);
	  return function (n) {
	    return e[n] || (e[n] = t(n));
	  };
	}

	var $ = /-(\w)/g,
	    _ = v(function (t) {
	  return t.replace($, function (t, e) {
	    return e ? e.toUpperCase() : "";
	  });
	}),
	    b = v(function (t) {
	  return t.charAt(0).toUpperCase() + t.slice(1);
	}),
	    w = /\B([A-Z])/g,
	    C = v(function (t) {
	  return t.replace(w, "-$1").toLowerCase();
	});

	var x = Function.prototype.bind ? function (t, e) {
	  return t.bind(e);
	} : function (t, e) {
	  function n(n) {
	    var o = arguments.length;
	    return o ? o > 1 ? t.apply(e, arguments) : t.call(e, n) : t.call(e);
	  }

	  return n._length = t.length, n;
	};

	function k(t, e) {
	  e = e || 0;
	  var n = t.length - e;
	  var o = new Array(n);

	  for (; n--;) {
	    o[n] = t[n + e];
	  }

	  return o;
	}

	function A(t, e) {
	  for (var _n3 in e) {
	    t[_n3] = e[_n3];
	  }

	  return t;
	}

	function O(t) {
	  var e = {};

	  for (var _n4 = 0; _n4 < t.length; _n4++) {
	    t[_n4] && A(e, t[_n4]);
	  }

	  return e;
	}

	function S(t, e, n) {}

	var T = function T(t, e, n) {
	  return !1;
	},
	    E = function E(t) {
	  return t;
	};

	function N(t, e) {
	  if (t === e) return !0;
	  var n = s(t),
	      o = s(e);
	  if (!n || !o) return !n && !o && String(t) === String(e);

	  try {
	    var _n5 = Array.isArray(t),
	        _o2 = Array.isArray(e);

	    if (_n5 && _o2) return t.length === e.length && t.every(function (t, n) {
	      return N(t, e[n]);
	    });
	    if (t instanceof Date && e instanceof Date) return t.getTime() === e.getTime();
	    if (_n5 || _o2) return !1;
	    {
	      var _n6 = Object.keys(t),
	          _o3 = Object.keys(e);

	      return _n6.length === _o3.length && _n6.every(function (n) {
	        return N(t[n], e[n]);
	      });
	    }
	  } catch (t) {
	    return !1;
	  }
	}

	function j$2(t, e) {
	  for (var _n7 = 0; _n7 < t.length; _n7++) {
	    if (N(t[_n7], e)) return _n7;
	  }

	  return -1;
	}

	function D(t) {
	  var e = !1;
	  return function () {
	    e || (e = !0, t.apply(this, arguments));
	  };
	}

	var L = "data-server-rendered",
	    M = ["component", "directive", "filter"],
	    I = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated", "errorCaptured", "serverPrefetch"];
	var F = {
	  optionMergeStrategies: Object.create(null),
	  silent: !1,
	  productionTip: !1,
	  devtools: !1,
	  performance: !1,
	  errorHandler: null,
	  warnHandler: null,
	  ignoredElements: [],
	  keyCodes: Object.create(null),
	  isReservedTag: T,
	  isReservedAttr: T,
	  isUnknownElement: T,
	  getTagNamespace: S,
	  parsePlatformTagName: E,
	  mustUseProp: T,
	  async: !0,
	  _lifecycleHooks: I
	};
	var P = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

	function R(t) {
	  var e = (t + "").charCodeAt(0);
	  return 36 === e || 95 === e;
	}

	function H(t, e, n, o) {
	  Object.defineProperty(t, e, {
	    value: n,
	    enumerable: !!o,
	    writable: !0,
	    configurable: !0
	  });
	}

	var B = new RegExp("[^" + P.source + ".$_\\d]");
	var U = ("__proto__" in {}),
	    z = "undefined" != typeof window,
	    V = "undefined" != typeof WXEnvironment && !!WXEnvironment.platform,
	    K = V && WXEnvironment.platform.toLowerCase(),
	    J = z && window.navigator.userAgent.toLowerCase(),
	    q = J && /msie|trident/.test(J),
	    W = J && J.indexOf("msie 9.0") > 0,
	    Z = J && J.indexOf("edge/") > 0,
	    G = (J && J.indexOf("android"), J && /iphone|ipad|ipod|ios/.test(J) || "ios" === K),
	    X = (J && /chrome\/\d+/.test(J), J && /phantomjs/.test(J), J && J.match(/firefox\/(\d+)/)),
	    Y = {}.watch;
	var Q,
	    tt = !1;
	if (z) try {
	  var _t3 = {};
	  Object.defineProperty(_t3, "passive", {
	    get: function get() {
	      tt = !0;
	    }
	  }), window.addEventListener("test-passive", null, _t3);
	} catch (t) {}

	var et = function et() {
	  return void 0 === Q && (Q = !z && !V && "undefined" != typeof commonjsGlobal && commonjsGlobal.process && "server" === commonjsGlobal.process.env.VUE_ENV), Q;
	},
	    nt = z && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	function ot(t) {
	  return "function" == typeof t && /native code/.test(t.toString());
	}

	var rt = "undefined" != typeof Symbol && ot(Symbol) && "undefined" != typeof Reflect && ot(Reflect.ownKeys);
	var st;
	st = "undefined" != typeof Set && ot(Set) ? Set : /*#__PURE__*/function () {
	  function _class() {
	    this.set = Object.create(null);
	  }

	  var _proto = _class.prototype;

	  _proto.has = function has(t) {
	    return !0 === this.set[t];
	  };

	  _proto.add = function add(t) {
	    this.set[t] = !0;
	  };

	  _proto.clear = function clear() {
	    this.set = Object.create(null);
	  };

	  return _class;
	}();
	var it = S,
	    at = 0;

	var ct = /*#__PURE__*/function () {
	  function ct() {
	    this.id = at++, this.subs = [];
	  }

	  var _proto2 = ct.prototype;

	  _proto2.addSub = function addSub(t) {
	    this.subs.push(t);
	  };

	  _proto2.removeSub = function removeSub(t) {
	    m(this.subs, t);
	  };

	  _proto2.depend = function depend() {
	    ct.target && ct.target.addDep(this);
	  };

	  _proto2.notify = function notify() {
	    var t = this.subs.slice();

	    for (var _e2 = 0, _n8 = t.length; _e2 < _n8; _e2++) {
	      t[_e2].update();
	    }
	  };

	  return ct;
	}();

	ct.target = null;
	var lt = [];

	function ut(t) {
	  lt.push(t), ct.target = t;
	}

	function ft() {
	  lt.pop(), ct.target = lt[lt.length - 1];
	}

	var dt = /*#__PURE__*/function () {
	  function dt(t, e, n, o, r, s, i, a) {
	    this.tag = t, this.data = e, this.children = n, this.text = o, this.elm = r, this.ns = void 0, this.context = s, this.fnContext = void 0, this.fnOptions = void 0, this.fnScopeId = void 0, this.key = e && e.key, this.componentOptions = i, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1, this.asyncFactory = a, this.asyncMeta = void 0, this.isAsyncPlaceholder = !1;
	  }

	  _createClass(dt, [{
	    key: "child",
	    get: function get() {
	      return this.componentInstance;
	    }
	  }]);

	  return dt;
	}();

	var pt = function pt(t) {
	  if (t === void 0) {
	    t = "";
	  }

	  var e = new dt();
	  return e.text = t, e.isComment = !0, e;
	};

	function ht(t) {
	  return new dt(void 0, void 0, void 0, String(t));
	}

	function mt(t) {
	  var e = new dt(t.tag, t.data, t.children && t.children.slice(), t.text, t.elm, t.context, t.componentOptions, t.asyncFactory);
	  return e.ns = t.ns, e.isStatic = t.isStatic, e.key = t.key, e.isComment = t.isComment, e.fnContext = t.fnContext, e.fnOptions = t.fnOptions, e.fnScopeId = t.fnScopeId, e.asyncMeta = t.asyncMeta, e.isCloned = !0, e;
	}

	var yt = Array.prototype,
	    gt = Object.create(yt);
	["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function (t) {
	  var e = yt[t];
	  H(gt, t, function () {
	    for (var _len = arguments.length, n = new Array(_len), _key = 0; _key < _len; _key++) {
	      n[_key] = arguments[_key];
	    }

	    var o = e.apply(this, n),
	        r = this.__ob__;
	    var s;

	    switch (t) {
	      case "push":
	      case "unshift":
	        s = n;
	        break;

	      case "splice":
	        s = n.slice(2);
	    }

	    return s && r.observeArray(s), r.dep.notify(), o;
	  });
	});
	var vt = Object.getOwnPropertyNames(gt);
	var $t = !0;

	function _t(t) {
	  $t = t;
	}

	var bt = /*#__PURE__*/function () {
	  function bt(t) {
	    var e;
	    this.value = t, this.dep = new ct(), this.vmCount = 0, H(t, "__ob__", this), Array.isArray(t) ? (U ? (e = gt, t.__proto__ = e) : function (t, e, n) {
	      for (var _o4 = 0, _r2 = n.length; _o4 < _r2; _o4++) {
	        var _r3 = n[_o4];
	        H(t, _r3, e[_r3]);
	      }
	    }(t, gt, vt), this.observeArray(t)) : this.walk(t);
	  }

	  var _proto3 = bt.prototype;

	  _proto3.walk = function walk(t) {
	    var e = Object.keys(t);

	    for (var _n9 = 0; _n9 < e.length; _n9++) {
	      Ct(t, e[_n9]);
	    }
	  };

	  _proto3.observeArray = function observeArray(t) {
	    for (var _e3 = 0, _n10 = t.length; _e3 < _n10; _e3++) {
	      wt(t[_e3]);
	    }
	  };

	  return bt;
	}();

	function wt(t, e) {
	  if (!s(t) || t instanceof dt) return;
	  var n;
	  return g(t, "__ob__") && t.__ob__ instanceof bt ? n = t.__ob__ : $t && !et() && (Array.isArray(t) || a(t)) && Object.isExtensible(t) && !t._isVue && (n = new bt(t)), e && n && n.vmCount++, n;
	}

	function Ct(t, e, n, o, r) {
	  var s = new ct(),
	      i = Object.getOwnPropertyDescriptor(t, e);
	  if (i && !1 === i.configurable) return;
	  var a = i && i.get,
	      c = i && i.set;
	  a && !c || 2 !== arguments.length || (n = t[e]);
	  var l = !r && wt(n);
	  Object.defineProperty(t, e, {
	    enumerable: !0,
	    configurable: !0,
	    get: function get() {
	      var e = a ? a.call(t) : n;
	      return ct.target && (s.depend(), l && (l.dep.depend(), Array.isArray(e) && function t(e) {
	        for (var _n11, _o5 = 0, _r4 = e.length; _o5 < _r4; _o5++) {
	          (_n11 = e[_o5]) && _n11.__ob__ && _n11.__ob__.dep.depend(), Array.isArray(_n11) && t(_n11);
	        }
	      }(e))), e;
	    },
	    set: function set(e) {
	      var o = a ? a.call(t) : n;
	      e === o || e != e && o != o || a && !c || (c ? c.call(t, e) : n = e, l = !r && wt(e), s.notify());
	    }
	  });
	}

	function xt(t, e, n) {
	  if (Array.isArray(t) && c(e)) return t.length = Math.max(t.length, e), t.splice(e, 1, n), n;
	  if (e in t && !(e in Object.prototype)) return t[e] = n, n;
	  var o = t.__ob__;
	  return t._isVue || o && o.vmCount ? n : o ? (Ct(o.value, e, n), o.dep.notify(), n) : (t[e] = n, n);
	}

	function kt(t, e) {
	  if (Array.isArray(t) && c(e)) return void t.splice(e, 1);
	  var n = t.__ob__;
	  t._isVue || n && n.vmCount || g(t, e) && (delete t[e], n && n.dep.notify());
	}

	var At = F.optionMergeStrategies;

	function Ot(t, e) {
	  if (!e) return t;
	  var n, o, r;
	  var s = rt ? Reflect.ownKeys(e) : Object.keys(e);

	  for (var _i2 = 0; _i2 < s.length; _i2++) {
	    "__ob__" !== (n = s[_i2]) && (o = t[n], r = e[n], g(t, n) ? o !== r && a(o) && a(r) && Ot(o, r) : xt(t, n, r));
	  }

	  return t;
	}

	function St(t, e, n) {
	  return n ? function () {
	    var o = "function" == typeof e ? e.call(n, n) : e,
	        r = "function" == typeof t ? t.call(n, n) : t;
	    return o ? Ot(o, r) : r;
	  } : e ? t ? function () {
	    return Ot("function" == typeof e ? e.call(this, this) : e, "function" == typeof t ? t.call(this, this) : t);
	  } : e : t;
	}

	function Tt(t, e) {
	  var n = e ? t ? t.concat(e) : Array.isArray(e) ? e : [e] : t;
	  return n ? function (t) {
	    var e = [];

	    for (var _n12 = 0; _n12 < t.length; _n12++) {
	      -1 === e.indexOf(t[_n12]) && e.push(t[_n12]);
	    }

	    return e;
	  }(n) : n;
	}

	function Et(t, e, n, o) {
	  var r = Object.create(t || null);
	  return e ? A(r, e) : r;
	}

	At.data = function (t, e, n) {
	  return n ? St(t, e, n) : e && "function" != typeof e ? t : St(t, e);
	}, I.forEach(function (t) {
	  At[t] = Tt;
	}), M.forEach(function (t) {
	  At[t + "s"] = Et;
	}), At.watch = function (t, e, n, o) {
	  if (t === Y && (t = void 0), e === Y && (e = void 0), !e) return Object.create(t || null);
	  if (!t) return e;
	  var r = {};
	  A(r, t);

	  for (var _t4 in e) {
	    var _n13 = r[_t4];
	    var _o6 = e[_t4];
	    _n13 && !Array.isArray(_n13) && (_n13 = [_n13]), r[_t4] = _n13 ? _n13.concat(_o6) : Array.isArray(_o6) ? _o6 : [_o6];
	  }

	  return r;
	}, At.props = At.methods = At.inject = At.computed = function (t, e, n, o) {
	  if (!t) return e;
	  var r = Object.create(null);
	  return A(r, t), e && A(r, e), r;
	}, At.provide = St;

	var Nt = function Nt(t, e) {
	  return void 0 === e ? t : e;
	};

	function jt(t, e, n) {
	  if ("function" == typeof e && (e = e.options), function (t, e) {
	    var n = t.props;
	    if (!n) return;
	    var o = {};
	    var r, s;
	    if (Array.isArray(n)) for (r = n.length; r--;) {
	      "string" == typeof (s = n[r]) && (o[_(s)] = {
	        type: null
	      });
	    } else if (a(n)) for (var _t5 in n) {
	      s = n[_t5], o[_(_t5)] = a(s) ? s : {
	        type: s
	      };
	    }
	    t.props = o;
	  }(e), function (t, e) {
	    var n = t.inject;
	    if (!n) return;
	    var o = t.inject = {};
	    if (Array.isArray(n)) for (var _t6 = 0; _t6 < n.length; _t6++) {
	      o[n[_t6]] = {
	        from: n[_t6]
	      };
	    } else if (a(n)) for (var _t7 in n) {
	      var _e4 = n[_t7];
	      o[_t7] = a(_e4) ? A({
	        from: _t7
	      }, _e4) : {
	        from: _e4
	      };
	    }
	  }(e), function (t) {
	    var e = t.directives;
	    if (e) for (var _t8 in e) {
	      var _n14 = e[_t8];
	      "function" == typeof _n14 && (e[_t8] = {
	        bind: _n14,
	        update: _n14
	      });
	    }
	  }(e), !e._base && (e.extends && (t = jt(t, e.extends, n)), e.mixins)) for (var _o7 = 0, _r5 = e.mixins.length; _o7 < _r5; _o7++) {
	    t = jt(t, e.mixins[_o7], n);
	  }
	  var o = {};
	  var r;

	  for (r in t) {
	    s(r);
	  }

	  for (r in e) {
	    g(t, r) || s(r);
	  }

	  function s(r) {
	    var s = At[r] || Nt;
	    o[r] = s(t[r], e[r], n, r);
	  }

	  return o;
	}

	function Dt(t, e, n, o) {
	  if ("string" != typeof n) return;
	  var r = t[e];
	  if (g(r, n)) return r[n];

	  var s = _(n);

	  if (g(r, s)) return r[s];
	  var i = b(s);
	  return g(r, i) ? r[i] : r[n] || r[s] || r[i];
	}

	function Lt(t, e, n, o) {
	  var r = e[t],
	      s = !g(n, t);
	  var i = n[t];
	  var a = Ft(Boolean, r.type);
	  if (a > -1) if (s && !g(r, "default")) i = !1;else if ("" === i || i === C(t)) {
	    var _t9 = Ft(String, r.type);

	    (_t9 < 0 || a < _t9) && (i = !0);
	  }

	  if (void 0 === i) {
	    i = function (t, e, n) {
	      if (!g(e, "default")) return;
	      var o = e.default;
	      if (t && t.$options.propsData && void 0 === t.$options.propsData[n] && void 0 !== t._props[n]) return t._props[n];
	      return "function" == typeof o && "Function" !== Mt(e.type) ? o.call(t) : o;
	    }(o, r, t);

	    var _e5 = $t;
	    _t(!0), wt(i), _t(_e5);
	  }

	  return i;
	}

	function Mt(t) {
	  var e = t && t.toString().match(/^\s*function (\w+)/);
	  return e ? e[1] : "";
	}

	function It(t, e) {
	  return Mt(t) === Mt(e);
	}

	function Ft(t, e) {
	  if (!Array.isArray(e)) return It(e, t) ? 0 : -1;

	  for (var _n15 = 0, _o8 = e.length; _n15 < _o8; _n15++) {
	    if (It(e[_n15], t)) return _n15;
	  }

	  return -1;
	}

	function Pt(t, e, n) {
	  ut();

	  try {
	    if (e) {
	      var _o9 = e;

	      for (; _o9 = _o9.$parent;) {
	        var _r6 = _o9.$options.errorCaptured;
	        if (_r6) for (var _s2 = 0; _s2 < _r6.length; _s2++) {
	          try {
	            if (!1 === _r6[_s2].call(_o9, t, e, n)) return;
	          } catch (t) {
	            Ht(t, _o9, "errorCaptured hook");
	          }
	        }
	      }
	    }

	    Ht(t, e, n);
	  } finally {
	    ft();
	  }
	}

	function Rt(t, e, n, o, r) {
	  var s;

	  try {
	    (s = n ? t.apply(e, n) : t.call(e)) && !s._isVue && l(s) && !s._handled && (s.catch(function (t) {
	      return Pt(t, o, r + " (Promise/async)");
	    }), s._handled = !0);
	  } catch (t) {
	    Pt(t, o, r);
	  }

	  return s;
	}

	function Ht(t, e, n) {
	  if (F.errorHandler) try {
	    return F.errorHandler.call(null, t, e, n);
	  } catch (e) {
	    e !== t && Bt(e);
	  }
	  Bt(t);
	}

	function Bt(t, e, n) {
	  if (!z && !V || "undefined" == typeof console) throw t;
	  console.error(t);
	}

	var Ut = !1;
	var zt = [];
	var Vt,
	    Kt = !1;

	function Jt() {
	  Kt = !1;
	  var t = zt.slice(0);
	  zt.length = 0;

	  for (var _e6 = 0; _e6 < t.length; _e6++) {
	    t[_e6]();
	  }
	}

	if ("undefined" != typeof Promise && ot(Promise)) {
	  var _t10 = Promise.resolve();

	  Vt = function Vt() {
	    _t10.then(Jt), G && setTimeout(S);
	  }, Ut = !0;
	} else if (q || "undefined" == typeof MutationObserver || !ot(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) Vt = "undefined" != typeof setImmediate && ot(setImmediate) ? function () {
	  setImmediate(Jt);
	} : function () {
	  setTimeout(Jt, 0);
	};else {
	  var _t11 = 1;

	  var _e7 = new MutationObserver(Jt),
	      _n16 = document.createTextNode(String(_t11));

	  _e7.observe(_n16, {
	    characterData: !0
	  }), Vt = function Vt() {
	    _t11 = (_t11 + 1) % 2, _n16.data = String(_t11);
	  }, Ut = !0;
	}

	function qt(t, e) {
	  var n;
	  if (zt.push(function () {
	    if (t) try {
	      t.call(e);
	    } catch (t) {
	      Pt(t, e, "nextTick");
	    } else n && n(e);
	  }), Kt || (Kt = !0, Vt()), !t && "undefined" != typeof Promise) return new Promise(function (t) {
	    n = t;
	  });
	}

	var Wt = new st();

	function Zt(t) {
	  !function t(e, n) {
	    var o, r;
	    var i = Array.isArray(e);
	    if (!i && !s(e) || Object.isFrozen(e) || e instanceof dt) return;

	    if (e.__ob__) {
	      var _t12 = e.__ob__.dep.id;
	      if (n.has(_t12)) return;
	      n.add(_t12);
	    }

	    if (i) for (o = e.length; o--;) {
	      t(e[o], n);
	    } else for (r = Object.keys(e), o = r.length; o--;) {
	      t(e[r[o]], n);
	    }
	  }(t, Wt), Wt.clear();
	}

	var Gt = v(function (t) {
	  var e = "&" === t.charAt(0),
	      n = "~" === (t = e ? t.slice(1) : t).charAt(0),
	      o = "!" === (t = n ? t.slice(1) : t).charAt(0);
	  return {
	    name: t = o ? t.slice(1) : t,
	    once: n,
	    capture: o,
	    passive: e
	  };
	});

	function Xt(t, e) {
	  function n() {
	    var t = n.fns;
	    if (!Array.isArray(t)) return Rt(t, null, arguments, e, "v-on handler");
	    {
	      var _n17 = t.slice();

	      for (var _t13 = 0; _t13 < _n17.length; _t13++) {
	        Rt(_n17[_t13], null, arguments, e, "v-on handler");
	      }
	    }
	  }

	  return n.fns = t, n;
	}

	function Yt(t, n, r, s, i, a) {
	  var c, u, f, d;

	  for (c in t) {
	    u = t[c], f = n[c], d = Gt(c), e(u) || (e(f) ? (e(u.fns) && (u = t[c] = Xt(u, a)), o(d.once) && (u = t[c] = i(d.name, u, d.capture)), r(d.name, u, d.capture, d.passive, d.params)) : u !== f && (f.fns = u, t[c] = f));
	  }

	  for (c in n) {
	    e(t[c]) && s((d = Gt(c)).name, n[c], d.capture);
	  }
	}

	function Qt(t, r, s) {
	  var i;
	  t instanceof dt && (t = t.data.hook || (t.data.hook = {}));
	  var a = t[r];

	  function c() {
	    s.apply(this, arguments), m(i.fns, c);
	  }

	  e(a) ? i = Xt([c]) : n(a.fns) && o(a.merged) ? (i = a).fns.push(c) : i = Xt([a, c]), i.merged = !0, t[r] = i;
	}

	function te(t, e, o, r, s) {
	  if (n(e)) {
	    if (g(e, o)) return t[o] = e[o], s || delete e[o], !0;
	    if (g(e, r)) return t[o] = e[r], s || delete e[r], !0;
	  }

	  return !1;
	}

	function ee(t) {
	  return r(t) ? [ht(t)] : Array.isArray(t) ? function t(s, i) {
	    var a = [];
	    var c, l, u, f;

	    for (c = 0; c < s.length; c++) {
	      e(l = s[c]) || "boolean" == typeof l || (u = a.length - 1, f = a[u], Array.isArray(l) ? l.length > 0 && (ne((l = t(l, (i || "") + "_" + c))[0]) && ne(f) && (a[u] = ht(f.text + l[0].text), l.shift()), a.push.apply(a, l)) : r(l) ? ne(f) ? a[u] = ht(f.text + l) : "" !== l && a.push(ht(l)) : ne(l) && ne(f) ? a[u] = ht(f.text + l.text) : (o(s._isVList) && n(l.tag) && e(l.key) && n(i) && (l.key = "__vlist" + i + "_" + c + "__"), a.push(l)));
	    }

	    return a;
	  }(t) : void 0;
	}

	function ne(t) {
	  return n(t) && n(t.text) && !1 === t.isComment;
	}

	function oe(t, e) {
	  if (t) {
	    var _n18 = Object.create(null),
	        _o10 = rt ? Reflect.ownKeys(t) : Object.keys(t);

	    for (var _r7 = 0; _r7 < _o10.length; _r7++) {
	      var _s3 = _o10[_r7];
	      if ("__ob__" === _s3) continue;
	      var _i3 = t[_s3].from;
	      var _a = e;

	      for (; _a;) {
	        if (_a._provided && g(_a._provided, _i3)) {
	          _n18[_s3] = _a._provided[_i3];
	          break;
	        }

	        _a = _a.$parent;
	      }

	      if (!_a && "default" in t[_s3]) {
	        var _o11 = t[_s3].default;
	        _n18[_s3] = "function" == typeof _o11 ? _o11.call(e) : _o11;
	      }
	    }

	    return _n18;
	  }
	}

	function re(t, e) {
	  if (!t || !t.length) return {};
	  var n = {};

	  for (var _o12 = 0, _r8 = t.length; _o12 < _r8; _o12++) {
	    var _r9 = t[_o12],
	        _s4 = _r9.data;
	    if (_s4 && _s4.attrs && _s4.attrs.slot && delete _s4.attrs.slot, _r9.context !== e && _r9.fnContext !== e || !_s4 || null == _s4.slot) (n.default || (n.default = [])).push(_r9);else {
	      var _t14 = _s4.slot,
	          _e8 = n[_t14] || (n[_t14] = []);

	      "template" === _r9.tag ? _e8.push.apply(_e8, _r9.children || []) : _e8.push(_r9);
	    }
	  }

	  for (var _t15 in n) {
	    n[_t15].every(se) && delete n[_t15];
	  }

	  return n;
	}

	function se(t) {
	  return t.isComment && !t.asyncFactory || " " === t.text;
	}

	function ie(e, n, o) {
	  var r;
	  var s = Object.keys(n).length > 0,
	      i = e ? !!e.$stable : !s,
	      a = e && e.$key;

	  if (e) {
	    if (e._normalized) return e._normalized;
	    if (i && o && o !== t && a === o.$key && !s && !o.$hasNormal) return o;
	    r = {};

	    for (var _t16 in e) {
	      e[_t16] && "$" !== _t16[0] && (r[_t16] = ae(n, _t16, e[_t16]));
	    }
	  } else r = {};

	  for (var _t17 in n) {
	    _t17 in r || (r[_t17] = ce(n, _t17));
	  }

	  return e && Object.isExtensible(e) && (e._normalized = r), H(r, "$stable", i), H(r, "$key", a), H(r, "$hasNormal", s), r;
	}

	function ae(t, e, n) {
	  var o = function o() {
	    var t = arguments.length ? n.apply(null, arguments) : n({});
	    return (t = t && "object" == typeof t && !Array.isArray(t) ? [t] : ee(t)) && (0 === t.length || 1 === t.length && t[0].isComment) ? void 0 : t;
	  };

	  return n.proxy && Object.defineProperty(t, e, {
	    get: o,
	    enumerable: !0,
	    configurable: !0
	  }), o;
	}

	function ce(t, e) {
	  return function () {
	    return t[e];
	  };
	}

	function le(t, e) {
	  var o, r, i, a, c;
	  if (Array.isArray(t) || "string" == typeof t) for (o = new Array(t.length), r = 0, i = t.length; r < i; r++) {
	    o[r] = e(t[r], r);
	  } else if ("number" == typeof t) for (o = new Array(t), r = 0; r < t; r++) {
	    o[r] = e(r + 1, r);
	  } else if (s(t)) if (rt && t[Symbol.iterator]) {
	    o = [];

	    var _n19 = t[Symbol.iterator]();

	    var _r10 = _n19.next();

	    for (; !_r10.done;) {
	      o.push(e(_r10.value, o.length)), _r10 = _n19.next();
	    }
	  } else for (a = Object.keys(t), o = new Array(a.length), r = 0, i = a.length; r < i; r++) {
	    c = a[r], o[r] = e(t[c], c, r);
	  }
	  return n(o) || (o = []), o._isVList = !0, o;
	}

	function ue(t, e, n, o) {
	  var r = this.$scopedSlots[t];
	  var s;
	  r ? (n = n || {}, o && (n = A(A({}, o), n)), s = r(n) || e) : s = this.$slots[t] || e;
	  var i = n && n.slot;
	  return i ? this.$createElement("template", {
	    slot: i
	  }, s) : s;
	}

	function fe(t) {
	  return Dt(this.$options, "filters", t) || E;
	}

	function de(t, e) {
	  return Array.isArray(t) ? -1 === t.indexOf(e) : t !== e;
	}

	function pe(t, e, n, o, r) {
	  var s = F.keyCodes[e] || n;
	  return r && o && !F.keyCodes[e] ? de(r, o) : s ? de(s, t) : o ? C(o) !== e : void 0;
	}

	function he(t, e, n, o, r) {
	  if (n) if (s(n)) {
	    var _s5;

	    Array.isArray(n) && (n = O(n));

	    var _loop = function _loop(_i4) {
	      if ("class" === _i4 || "style" === _i4 || h(_i4)) _s5 = t;else {
	        var _n20 = t.attrs && t.attrs.type;

	        _s5 = o || F.mustUseProp(e, _n20, _i4) ? t.domProps || (t.domProps = {}) : t.attrs || (t.attrs = {});
	      }

	      var a = _(_i4),
	          c = C(_i4);

	      if (!(a in _s5 || c in _s5) && (_s5[_i4] = n[_i4], r)) {
	        (t.on || (t.on = {}))["update:" + _i4] = function (t) {
	          n[_i4] = t;
	        };
	      }
	    };

	    for (var _i4 in n) {
	      _loop(_i4);
	    }
	  }
	  return t;
	}

	function me(t, e) {
	  var n = this._staticTrees || (this._staticTrees = []);
	  var o = n[t];
	  return o && !e ? o : (ge(o = n[t] = this.$options.staticRenderFns[t].call(this._renderProxy, null, this), "__static__" + t, !1), o);
	}

	function ye(t, e, n) {
	  return ge(t, "__once__" + e + (n ? "_" + n : ""), !0), t;
	}

	function ge(t, e, n) {
	  if (Array.isArray(t)) for (var _o13 = 0; _o13 < t.length; _o13++) {
	    t[_o13] && "string" != typeof t[_o13] && ve(t[_o13], e + "_" + _o13, n);
	  } else ve(t, e, n);
	}

	function ve(t, e, n) {
	  t.isStatic = !0, t.key = e, t.isOnce = n;
	}

	function $e(t, e) {
	  if (e) if (a(e)) {
	    var _n21 = t.on = t.on ? A({}, t.on) : {};

	    for (var _t18 in e) {
	      var _o14 = _n21[_t18],
	          _r11 = e[_t18];
	      _n21[_t18] = _o14 ? [].concat(_o14, _r11) : _r11;
	    }
	  }
	  return t;
	}

	function _e(t, e, n, o) {
	  e = e || {
	    $stable: !n
	  };

	  for (var _o15 = 0; _o15 < t.length; _o15++) {
	    var _r12 = t[_o15];
	    Array.isArray(_r12) ? _e(_r12, e, n) : _r12 && (_r12.proxy && (_r12.fn.proxy = !0), e[_r12.key] = _r12.fn);
	  }

	  return o && (e.$key = o), e;
	}

	function be(t, e) {
	  for (var _n22 = 0; _n22 < e.length; _n22 += 2) {
	    var _o16 = e[_n22];
	    "string" == typeof _o16 && _o16 && (t[e[_n22]] = e[_n22 + 1]);
	  }

	  return t;
	}

	function we(t, e) {
	  return "string" == typeof t ? e + t : t;
	}

	function Ce(t) {
	  t._o = ye, t._n = f$8, t._s = u, t._l = le, t._t = ue, t._q = N, t._i = j$2, t._m = me, t._f = fe, t._k = pe, t._b = he, t._v = ht, t._e = pt, t._u = _e, t._g = $e, t._d = be, t._p = we;
	}

	function xe(e, n, r, s, i) {
	  var _this = this;

	  var a = i.options;
	  var c;
	  g(s, "_uid") ? (c = Object.create(s))._original = s : (c = s, s = s._original);
	  var l = o(a._compiled),
	      u = !l;
	  this.data = e, this.props = n, this.children = r, this.parent = s, this.listeners = e.on || t, this.injections = oe(a.inject, s), this.slots = function () {
	    return _this.$slots || ie(e.scopedSlots, _this.$slots = re(r, s)), _this.$slots;
	  }, Object.defineProperty(this, "scopedSlots", {
	    enumerable: !0,
	    get: function get() {
	      return ie(e.scopedSlots, this.slots());
	    }
	  }), l && (this.$options = a, this.$slots = this.slots(), this.$scopedSlots = ie(e.scopedSlots, this.$slots)), a._scopeId ? this._c = function (t, e, n, o) {
	    var r = De(c, t, e, n, o, u);
	    return r && !Array.isArray(r) && (r.fnScopeId = a._scopeId, r.fnContext = s), r;
	  } : this._c = function (t, e, n, o) {
	    return De(c, t, e, n, o, u);
	  };
	}

	function ke(t, e, n, o, r) {
	  var s = mt(t);
	  return s.fnContext = n, s.fnOptions = o, e.slot && ((s.data || (s.data = {})).slot = e.slot), s;
	}

	function Ae(t, e) {
	  for (var _n23 in e) {
	    t[_(_n23)] = e[_n23];
	  }
	}

	Ce(xe.prototype);
	var Oe = {
	  init: function init(t, e) {
	    if (t.componentInstance && !t.componentInstance._isDestroyed && t.data.keepAlive) {
	      var _e9 = t;
	      Oe.prepatch(_e9, _e9);
	    } else {
	      (t.componentInstance = function (t, e) {
	        var o = {
	          _isComponent: !0,
	          _parentVnode: t,
	          parent: e
	        },
	            r = t.data.inlineTemplate;
	        n(r) && (o.render = r.render, o.staticRenderFns = r.staticRenderFns);
	        return new t.componentOptions.Ctor(o);
	      }(t, ze)).$mount(e ? t.elm : void 0, e);
	    }
	  },
	  prepatch: function prepatch(e, n) {
	    var o = n.componentOptions;
	    !function (e, n, o, r, s) {
	      var i = r.data.scopedSlots,
	          a = e.$scopedSlots,
	          c = !!(i && !i.$stable || a !== t && !a.$stable || i && e.$scopedSlots.$key !== i.$key),
	          l = !!(s || e.$options._renderChildren || c);
	      e.$options._parentVnode = r, e.$vnode = r, e._vnode && (e._vnode.parent = r);

	      if (e.$options._renderChildren = s, e.$attrs = r.data.attrs || t, e.$listeners = o || t, n && e.$options.props) {
	        _t(!1);

	        var _t19 = e._props,
	            _o17 = e.$options._propKeys || [];

	        for (var _r13 = 0; _r13 < _o17.length; _r13++) {
	          var _s6 = _o17[_r13],
	              _i5 = e.$options.props;
	          _t19[_s6] = Lt(_s6, _i5, n, e);
	        }

	        _t(!0), e.$options.propsData = n;
	      }

	      o = o || t;
	      var u = e.$options._parentListeners;
	      e.$options._parentListeners = o, Ue(e, o, u), l && (e.$slots = re(s, r.context), e.$forceUpdate());
	    }(n.componentInstance = e.componentInstance, o.propsData, o.listeners, n, o.children);
	  },
	  insert: function insert(t) {
	    var e = t.context,
	        n = t.componentInstance;
	    var o;
	    n._isMounted || (n._isMounted = !0, qe(n, "mounted")), t.data.keepAlive && (e._isMounted ? ((o = n)._inactive = !1, Ze.push(o)) : Je(n, !0));
	  },
	  destroy: function destroy(t) {
	    var e = t.componentInstance;
	    e._isDestroyed || (t.data.keepAlive ? function t(e, n) {
	      if (n && (e._directInactive = !0, Ke(e))) return;

	      if (!e._inactive) {
	        e._inactive = !0;

	        for (var _n24 = 0; _n24 < e.$children.length; _n24++) {
	          t(e.$children[_n24]);
	        }

	        qe(e, "deactivated");
	      }
	    }(e, !0) : e.$destroy());
	  }
	},
	    Se = Object.keys(Oe);

	function Te(r, i, a, c, u) {
	  if (e(r)) return;
	  var f = a.$options._base;
	  if (s(r) && (r = f.extend(r)), "function" != typeof r) return;
	  var d;
	  if (e(r.cid) && void 0 === (r = function (t, r) {
	    if (o(t.error) && n(t.errorComp)) return t.errorComp;
	    if (n(t.resolved)) return t.resolved;
	    var i = Me;
	    i && n(t.owners) && -1 === t.owners.indexOf(i) && t.owners.push(i);
	    if (o(t.loading) && n(t.loadingComp)) return t.loadingComp;

	    if (i && !n(t.owners)) {
	      var _o18 = t.owners = [i];

	      var _a2 = !0,
	          _c = null,
	          _u = null;

	      i.$on("hook:destroyed", function () {
	        return m(_o18, i);
	      });

	      var _f = function _f(t) {
	        for (var _t20 = 0, _e10 = _o18.length; _t20 < _e10; _t20++) {
	          _o18[_t20].$forceUpdate();
	        }

	        t && (_o18.length = 0, null !== _c && (clearTimeout(_c), _c = null), null !== _u && (clearTimeout(_u), _u = null));
	      },
	          _d = D(function (e) {
	        t.resolved = Ie(e, r), _a2 ? _o18.length = 0 : _f(!0);
	      }),
	          _p = D(function (e) {
	        n(t.errorComp) && (t.error = !0, _f(!0));
	      }),
	          _h = t(_d, _p);

	      return s(_h) && (l(_h) ? e(t.resolved) && _h.then(_d, _p) : l(_h.component) && (_h.component.then(_d, _p), n(_h.error) && (t.errorComp = Ie(_h.error, r)), n(_h.loading) && (t.loadingComp = Ie(_h.loading, r), 0 === _h.delay ? t.loading = !0 : _c = setTimeout(function () {
	        _c = null, e(t.resolved) && e(t.error) && (t.loading = !0, _f(!1));
	      }, _h.delay || 200)), n(_h.timeout) && (_u = setTimeout(function () {
	        _u = null, e(t.resolved) && _p(null);
	      }, _h.timeout)))), _a2 = !1, t.loading ? t.loadingComp : t.resolved;
	    }
	  }(d = r, f))) return function (t, e, n, o, r) {
	    var s = pt();
	    return s.asyncFactory = t, s.asyncMeta = {
	      data: e,
	      context: n,
	      children: o,
	      tag: r
	    }, s;
	  }(d, i, a, c, u);
	  i = i || {}, mn(r), n(i.model) && function (t, e) {
	    var o = t.model && t.model.prop || "value",
	        r = t.model && t.model.event || "input";
	    (e.attrs || (e.attrs = {}))[o] = e.model.value;
	    var s = e.on || (e.on = {}),
	        i = s[r],
	        a = e.model.callback;
	    n(i) ? (Array.isArray(i) ? -1 === i.indexOf(a) : i !== a) && (s[r] = [a].concat(i)) : s[r] = a;
	  }(r.options, i);

	  var p = function (t, o, r) {
	    var s = o.options.props;
	    if (e(s)) return;
	    var i = {},
	        a = t.attrs,
	        c = t.props;
	    if (n(a) || n(c)) for (var _t21 in s) {
	      var _e11 = C(_t21);

	      te(i, c, _t21, _e11, !0) || te(i, a, _t21, _e11, !1);
	    }
	    return i;
	  }(i, r);

	  if (o(r.options.functional)) return function (e, o, r, s, i) {
	    var a = e.options,
	        c = {},
	        l = a.props;
	    if (n(l)) for (var _e12 in l) {
	      c[_e12] = Lt(_e12, l, o || t);
	    } else n(r.attrs) && Ae(c, r.attrs), n(r.props) && Ae(c, r.props);
	    var u = new xe(r, c, i, s, e),
	        f = a.render.call(null, u._c, u);
	    if (f instanceof dt) return ke(f, r, u.parent, a);

	    if (Array.isArray(f)) {
	      var _t22 = ee(f) || [],
	          _e13 = new Array(_t22.length);

	      for (var _n25 = 0; _n25 < _t22.length; _n25++) {
	        _e13[_n25] = ke(_t22[_n25], r, u.parent, a);
	      }

	      return _e13;
	    }
	  }(r, p, i, a, c);
	  var h = i.on;

	  if (i.on = i.nativeOn, o(r.options.abstract)) {
	    var _t23 = i.slot;
	    i = {}, _t23 && (i.slot = _t23);
	  }

	  !function (t) {
	    var e = t.hook || (t.hook = {});

	    for (var _t24 = 0; _t24 < Se.length; _t24++) {
	      var _n26 = Se[_t24],
	          _o19 = e[_n26],
	          _r14 = Oe[_n26];
	      _o19 === _r14 || _o19 && _o19._merged || (e[_n26] = _o19 ? Ee(_r14, _o19) : _r14);
	    }
	  }(i);
	  var y = r.options.name || u;
	  return new dt("vue-component-" + r.cid + (y ? "-" + y : ""), i, void 0, void 0, void 0, a, {
	    Ctor: r,
	    propsData: p,
	    listeners: h,
	    tag: u,
	    children: c
	  }, d);
	}

	function Ee(t, e) {
	  var n = function n(_n69, o) {
	    t(_n69, o), e(_n69, o);
	  };

	  return n._merged = !0, n;
	}

	var Ne = 1,
	    je = 2;

	function De(t, i, a, c, l, u) {
	  return (Array.isArray(a) || r(a)) && (l = c, c = a, a = void 0), o(u) && (l = je), function (t, r, i, a, c) {
	    if (n(i) && n(i.__ob__)) return pt();
	    n(i) && n(i.is) && (r = i.is);
	    if (!r) return pt();
	    Array.isArray(a) && "function" == typeof a[0] && ((i = i || {}).scopedSlots = {
	      default: a[0]
	    }, a.length = 0);
	    c === je ? a = ee(a) : c === Ne && (a = function (t) {
	      for (var _e14 = 0; _e14 < t.length; _e14++) {
	        if (Array.isArray(t[_e14])) return Array.prototype.concat.apply([], t);
	      }

	      return t;
	    }(a));
	    var l, u;

	    if ("string" == typeof r) {
	      var _e15;

	      u = t.$vnode && t.$vnode.ns || F.getTagNamespace(r), l = F.isReservedTag(r) ? new dt(F.parsePlatformTagName(r), i, a, void 0, void 0, t) : i && i.pre || !n(_e15 = Dt(t.$options, "components", r)) ? new dt(r, i, a, void 0, void 0, t) : Te(_e15, i, t, a, r);
	    } else l = Te(r, i, t, a);

	    return Array.isArray(l) ? l : n(l) ? (n(u) && function t(r, s, i) {
	      r.ns = s;
	      "foreignObject" === r.tag && (s = void 0, i = !0);
	      if (n(r.children)) for (var _a3 = 0, _c2 = r.children.length; _a3 < _c2; _a3++) {
	        var _c3 = r.children[_a3];
	        n(_c3.tag) && (e(_c3.ns) || o(i) && "svg" !== _c3.tag) && t(_c3, s, i);
	      }
	    }(l, u), n(i) && function (t) {
	      s(t.style) && Zt(t.style);
	      s(t.class) && Zt(t.class);
	    }(i), l) : pt();
	  }(t, i, a, c, l);
	}

	var Le,
	    Me = null;

	function Ie(t, e) {
	  return (t.__esModule || rt && "Module" === t[Symbol.toStringTag]) && (t = t.default), s(t) ? e.extend(t) : t;
	}

	function Fe(t) {
	  return t.isComment && t.asyncFactory;
	}

	function Pe(t) {
	  if (Array.isArray(t)) for (var _e16 = 0; _e16 < t.length; _e16++) {
	    var _o20 = t[_e16];
	    if (n(_o20) && (n(_o20.componentOptions) || Fe(_o20))) return _o20;
	  }
	}

	function Re(t, e) {
	  Le.$on(t, e);
	}

	function He(t, e) {
	  Le.$off(t, e);
	}

	function Be(t, e) {
	  var n = Le;
	  return function o() {
	    null !== e.apply(null, arguments) && n.$off(t, o);
	  };
	}

	function Ue(t, e, n) {
	  Le = t, Yt(e, n || {}, Re, He, Be, t), Le = void 0;
	}

	var ze = null;

	function Ve(t) {
	  var e = ze;
	  return ze = t, function () {
	    ze = e;
	  };
	}

	function Ke(t) {
	  for (; t && (t = t.$parent);) {
	    if (t._inactive) return !0;
	  }

	  return !1;
	}

	function Je(t, e) {
	  if (e) {
	    if (t._directInactive = !1, Ke(t)) return;
	  } else if (t._directInactive) return;

	  if (t._inactive || null === t._inactive) {
	    t._inactive = !1;

	    for (var _e17 = 0; _e17 < t.$children.length; _e17++) {
	      Je(t.$children[_e17]);
	    }

	    qe(t, "activated");
	  }
	}

	function qe(t, e) {
	  ut();
	  var n = t.$options[e],
	      o = e + " hook";
	  if (n) for (var _e18 = 0, _r15 = n.length; _e18 < _r15; _e18++) {
	    Rt(n[_e18], t, null, t, o);
	  }
	  t._hasHookEvent && t.$emit("hook:" + e), ft();
	}

	var We = [],
	    Ze = [];
	var Ge = {},
	    Xe = !1,
	    Ye = !1,
	    Qe = 0;
	var tn = 0,
	    en = Date.now;

	if (z && !q) {
	  var _t25 = window.performance;
	  _t25 && "function" == typeof _t25.now && en() > document.createEvent("Event").timeStamp && (en = function en() {
	    return _t25.now();
	  });
	}

	function nn() {
	  var t, e;

	  for (tn = en(), Ye = !0, We.sort(function (t, e) {
	    return t.id - e.id;
	  }), Qe = 0; Qe < We.length; Qe++) {
	    (t = We[Qe]).before && t.before(), e = t.id, Ge[e] = null, t.run();
	  }

	  var n = Ze.slice(),
	      o = We.slice();
	  Qe = We.length = Ze.length = 0, Ge = {}, Xe = Ye = !1, function (t) {
	    for (var _e19 = 0; _e19 < t.length; _e19++) {
	      t[_e19]._inactive = !0, Je(t[_e19], !0);
	    }
	  }(n), function (t) {
	    var e = t.length;

	    for (; e--;) {
	      var _n27 = t[e],
	          _o21 = _n27.vm;
	      _o21._watcher === _n27 && _o21._isMounted && !_o21._isDestroyed && qe(_o21, "updated");
	    }
	  }(o), nt && F.devtools && nt.emit("flush");
	}

	var on = 0;

	var rn = /*#__PURE__*/function () {
	  function rn(t, e, n, o, r) {
	    this.vm = t, r && (t._watcher = this), t._watchers.push(this), o ? (this.deep = !!o.deep, this.user = !!o.user, this.lazy = !!o.lazy, this.sync = !!o.sync, this.before = o.before) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = n, this.id = ++on, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new st(), this.newDepIds = new st(), this.expression = "", "function" == typeof e ? this.getter = e : (this.getter = function (t) {
	      if (B.test(t)) return;
	      var e = t.split(".");
	      return function (t) {
	        for (var _n28 = 0; _n28 < e.length; _n28++) {
	          if (!t) return;
	          t = t[e[_n28]];
	        }

	        return t;
	      };
	    }(e), this.getter || (this.getter = S)), this.value = this.lazy ? void 0 : this.get();
	  }

	  var _proto4 = rn.prototype;

	  _proto4.get = function get() {
	    var t;
	    ut(this);
	    var e = this.vm;

	    try {
	      t = this.getter.call(e, e);
	    } catch (t) {
	      if (!this.user) throw t;
	      Pt(t, e, "getter for watcher \"" + this.expression + "\"");
	    } finally {
	      this.deep && Zt(t), ft(), this.cleanupDeps();
	    }

	    return t;
	  };

	  _proto4.addDep = function addDep(t) {
	    var e = t.id;
	    this.newDepIds.has(e) || (this.newDepIds.add(e), this.newDeps.push(t), this.depIds.has(e) || t.addSub(this));
	  };

	  _proto4.cleanupDeps = function cleanupDeps() {
	    var t = this.deps.length;

	    for (; t--;) {
	      var _e20 = this.deps[t];
	      this.newDepIds.has(_e20.id) || _e20.removeSub(this);
	    }

	    var e = this.depIds;
	    this.depIds = this.newDepIds, this.newDepIds = e, this.newDepIds.clear(), e = this.deps, this.deps = this.newDeps, this.newDeps = e, this.newDeps.length = 0;
	  };

	  _proto4.update = function update() {
	    this.lazy ? this.dirty = !0 : this.sync ? this.run() : function (t) {
	      var e = t.id;

	      if (null == Ge[e]) {
	        if (Ge[e] = !0, Ye) {
	          var _e21 = We.length - 1;

	          for (; _e21 > Qe && We[_e21].id > t.id;) {
	            _e21--;
	          }

	          We.splice(_e21 + 1, 0, t);
	        } else We.push(t);

	        Xe || (Xe = !0, qt(nn));
	      }
	    }(this);
	  };

	  _proto4.run = function run() {
	    if (this.active) {
	      var _t26 = this.get();

	      if (_t26 !== this.value || s(_t26) || this.deep) {
	        var _e22 = this.value;
	        if (this.value = _t26, this.user) try {
	          this.cb.call(this.vm, _t26, _e22);
	        } catch (t) {
	          Pt(t, this.vm, "callback for watcher \"" + this.expression + "\"");
	        } else this.cb.call(this.vm, _t26, _e22);
	      }
	    }
	  };

	  _proto4.evaluate = function evaluate() {
	    this.value = this.get(), this.dirty = !1;
	  };

	  _proto4.depend = function depend() {
	    var t = this.deps.length;

	    for (; t--;) {
	      this.deps[t].depend();
	    }
	  };

	  _proto4.teardown = function teardown() {
	    if (this.active) {
	      this.vm._isBeingDestroyed || m(this.vm._watchers, this);
	      var _t27 = this.deps.length;

	      for (; _t27--;) {
	        this.deps[_t27].removeSub(this);
	      }

	      this.active = !1;
	    }
	  };

	  return rn;
	}();

	var sn = {
	  enumerable: !0,
	  configurable: !0,
	  get: S,
	  set: S
	};

	function an(t, e, n) {
	  sn.get = function () {
	    return this[e][n];
	  }, sn.set = function (t) {
	    this[e][n] = t;
	  }, Object.defineProperty(t, n, sn);
	}

	function cn(t) {
	  t._watchers = [];
	  var e = t.$options;
	  e.props && function (t, e) {
	    var n = t.$options.propsData || {},
	        o = t._props = {},
	        r = t.$options._propKeys = [];
	    t.$parent && _t(!1);

	    for (var _s7 in e) {
	      r.push(_s7);

	      var _i6 = Lt(_s7, e, n, t);

	      Ct(o, _s7, _i6), _s7 in t || an(t, "_props", _s7);
	    }

	    _t(!0);
	  }(t, e.props), e.methods && function (t, e) {
	    t.$options.props;

	    for (var _n29 in e) {
	      t[_n29] = "function" != typeof e[_n29] ? S : x(e[_n29], t);
	    }
	  }(t, e.methods), e.data ? function (t) {
	    var e = t.$options.data;
	    a(e = t._data = "function" == typeof e ? function (t, e) {
	      ut();

	      try {
	        return t.call(e, e);
	      } catch (t) {
	        return Pt(t, e, "data()"), {};
	      } finally {
	        ft();
	      }
	    }(e, t) : e || {}) || (e = {});
	    var n = Object.keys(e),
	        o = t.$options.props;
	    t.$options.methods;
	    var r = n.length;

	    for (; r--;) {
	      var _e23 = n[r];
	      o && g(o, _e23) || R(_e23) || an(t, "_data", _e23);
	    }

	    wt(e, !0);
	  }(t) : wt(t._data = {}, !0), e.computed && function (t, e) {
	    var n = t._computedWatchers = Object.create(null),
	        o = et();

	    for (var _r16 in e) {
	      var _s8 = e[_r16],
	          _i7 = "function" == typeof _s8 ? _s8 : _s8.get;

	      o || (n[_r16] = new rn(t, _i7 || S, S, ln)), _r16 in t || un(t, _r16, _s8);
	    }
	  }(t, e.computed), e.watch && e.watch !== Y && function (t, e) {
	    for (var _n30 in e) {
	      var _o22 = e[_n30];
	      if (Array.isArray(_o22)) for (var _e24 = 0; _e24 < _o22.length; _e24++) {
	        pn(t, _n30, _o22[_e24]);
	      } else pn(t, _n30, _o22);
	    }
	  }(t, e.watch);
	}

	var ln = {
	  lazy: !0
	};

	function un(t, e, n) {
	  var o = !et();
	  "function" == typeof n ? (sn.get = o ? fn(e) : dn(n), sn.set = S) : (sn.get = n.get ? o && !1 !== n.cache ? fn(e) : dn(n.get) : S, sn.set = n.set || S), Object.defineProperty(t, e, sn);
	}

	function fn(t) {
	  return function () {
	    var e = this._computedWatchers && this._computedWatchers[t];
	    if (e) return e.dirty && e.evaluate(), ct.target && e.depend(), e.value;
	  };
	}

	function dn(t) {
	  return function () {
	    return t.call(this, this);
	  };
	}

	function pn(t, e, n, o) {
	  return a(n) && (o = n, n = n.handler), "string" == typeof n && (n = t[n]), t.$watch(e, n, o);
	}

	var hn = 0;

	function mn(t) {
	  var e = t.options;

	  if (t.super) {
	    var _n31 = mn(t.super);

	    if (_n31 !== t.superOptions) {
	      t.superOptions = _n31;

	      var _o23 = function (t) {
	        var e;
	        var n = t.options,
	            o = t.sealedOptions;

	        for (var _t28 in n) {
	          n[_t28] !== o[_t28] && (e || (e = {}), e[_t28] = n[_t28]);
	        }

	        return e;
	      }(t);

	      _o23 && A(t.extendOptions, _o23), (e = t.options = jt(_n31, t.extendOptions)).name && (e.components[e.name] = t);
	    }
	  }

	  return e;
	}

	function yn(t) {
	  this._init(t);
	}

	function gn(t) {
	  t.cid = 0;
	  var e = 1;

	  t.extend = function (t) {
	    t = t || {};
	    var n = this,
	        o = n.cid,
	        r = t._Ctor || (t._Ctor = {});
	    if (r[o]) return r[o];

	    var s = t.name || n.options.name,
	        i = function i(t) {
	      this._init(t);
	    };

	    return (i.prototype = Object.create(n.prototype)).constructor = i, i.cid = e++, i.options = jt(n.options, t), i.super = n, i.options.props && function (t) {
	      var e = t.options.props;

	      for (var _n32 in e) {
	        an(t.prototype, "_props", _n32);
	      }
	    }(i), i.options.computed && function (t) {
	      var e = t.options.computed;

	      for (var _n33 in e) {
	        un(t.prototype, _n33, e[_n33]);
	      }
	    }(i), i.extend = n.extend, i.mixin = n.mixin, i.use = n.use, M.forEach(function (t) {
	      i[t] = n[t];
	    }), s && (i.options.components[s] = i), i.superOptions = n.options, i.extendOptions = t, i.sealedOptions = A({}, i.options), r[o] = i, i;
	  };
	}

	function vn(t) {
	  return t && (t.Ctor.options.name || t.tag);
	}

	function $n(t, e) {
	  return Array.isArray(t) ? t.indexOf(e) > -1 : "string" == typeof t ? t.split(",").indexOf(e) > -1 : (n = t, "[object RegExp]" === i.call(n) && t.test(e));
	  var n;
	}

	function _n(t, e) {
	  var n = t.cache,
	      o = t.keys,
	      r = t._vnode;

	  for (var _t29 in n) {
	    var _s9 = n[_t29];

	    if (_s9) {
	      var _i8 = vn(_s9.componentOptions);

	      _i8 && !e(_i8) && bn(n, _t29, o, r);
	    }
	  }
	}

	function bn(t, e, n, o) {
	  var r = t[e];
	  !r || o && r.tag === o.tag || r.componentInstance.$destroy(), t[e] = null, m(n, e);
	}

	!function (e) {
	  e.prototype._init = function (e) {
	    var n = this;
	    n._uid = hn++, n._isVue = !0, e && e._isComponent ? function (t, e) {
	      var n = t.$options = Object.create(t.constructor.options),
	          o = e._parentVnode;
	      n.parent = e.parent, n._parentVnode = o;
	      var r = o.componentOptions;
	      n.propsData = r.propsData, n._parentListeners = r.listeners, n._renderChildren = r.children, n._componentTag = r.tag, e.render && (n.render = e.render, n.staticRenderFns = e.staticRenderFns);
	    }(n, e) : n.$options = jt(mn(n.constructor), e || {}, n), n._renderProxy = n, n._self = n, function (t) {
	      var e = t.$options;
	      var n = e.parent;

	      if (n && !e.abstract) {
	        for (; n.$options.abstract && n.$parent;) {
	          n = n.$parent;
	        }

	        n.$children.push(t);
	      }

	      t.$parent = n, t.$root = n ? n.$root : t, t.$children = [], t.$refs = {}, t._watcher = null, t._inactive = null, t._directInactive = !1, t._isMounted = !1, t._isDestroyed = !1, t._isBeingDestroyed = !1;
	    }(n), function (t) {
	      t._events = Object.create(null), t._hasHookEvent = !1;
	      var e = t.$options._parentListeners;
	      e && Ue(t, e);
	    }(n), function (e) {
	      e._vnode = null, e._staticTrees = null;
	      var n = e.$options,
	          o = e.$vnode = n._parentVnode,
	          r = o && o.context;
	      e.$slots = re(n._renderChildren, r), e.$scopedSlots = t, e._c = function (t, n, o, r) {
	        return De(e, t, n, o, r, !1);
	      }, e.$createElement = function (t, n, o, r) {
	        return De(e, t, n, o, r, !0);
	      };
	      var s = o && o.data;
	      Ct(e, "$attrs", s && s.attrs || t, null, !0), Ct(e, "$listeners", n._parentListeners || t, null, !0);
	    }(n), qe(n, "beforeCreate"), function (t) {
	      var e = oe(t.$options.inject, t);
	      e && (_t(!1), Object.keys(e).forEach(function (n) {
	        Ct(t, n, e[n]);
	      }), _t(!0));
	    }(n), cn(n), function (t) {
	      var e = t.$options.provide;
	      e && (t._provided = "function" == typeof e ? e.call(t) : e);
	    }(n), qe(n, "created"), n.$options.el && n.$mount(n.$options.el);
	  };
	}(yn), function (t) {
	  var e = {
	    get: function get() {
	      return this._data;
	    }
	  },
	      n = {
	    get: function get() {
	      return this._props;
	    }
	  };
	  Object.defineProperty(t.prototype, "$data", e), Object.defineProperty(t.prototype, "$props", n), t.prototype.$set = xt, t.prototype.$delete = kt, t.prototype.$watch = function (t, e, n) {
	    var o = this;
	    if (a(e)) return pn(o, t, e, n);
	    (n = n || {}).user = !0;
	    var r = new rn(o, t, e, n);
	    if (n.immediate) try {
	      e.call(o, r.value);
	    } catch (t) {
	      Pt(t, o, "callback for immediate watcher \"" + r.expression + "\"");
	    }
	    return function () {
	      r.teardown();
	    };
	  };
	}(yn), function (t) {
	  var e = /^hook:/;
	  t.prototype.$on = function (t, n) {
	    var o = this;
	    if (Array.isArray(t)) for (var _e25 = 0, _r17 = t.length; _e25 < _r17; _e25++) {
	      o.$on(t[_e25], n);
	    } else (o._events[t] || (o._events[t] = [])).push(n), e.test(t) && (o._hasHookEvent = !0);
	    return o;
	  }, t.prototype.$once = function (t, e) {
	    var n = this;

	    function o() {
	      n.$off(t, o), e.apply(n, arguments);
	    }

	    return o.fn = e, n.$on(t, o), n;
	  }, t.prototype.$off = function (t, e) {
	    var n = this;
	    if (!arguments.length) return n._events = Object.create(null), n;

	    if (Array.isArray(t)) {
	      for (var _o24 = 0, _r18 = t.length; _o24 < _r18; _o24++) {
	        n.$off(t[_o24], e);
	      }

	      return n;
	    }

	    var o = n._events[t];
	    if (!o) return n;
	    if (!e) return n._events[t] = null, n;
	    var r,
	        s = o.length;

	    for (; s--;) {
	      if ((r = o[s]) === e || r.fn === e) {
	        o.splice(s, 1);
	        break;
	      }
	    }

	    return n;
	  }, t.prototype.$emit = function (t) {
	    var e = this;
	    var n = e._events[t];

	    if (n) {
	      n = n.length > 1 ? k(n) : n;

	      var _o25 = k(arguments, 1),
	          _r19 = "event handler for \"" + t + "\"";

	      for (var _t30 = 0, _s10 = n.length; _t30 < _s10; _t30++) {
	        Rt(n[_t30], e, _o25, e, _r19);
	      }
	    }

	    return e;
	  };
	}(yn), function (t) {
	  t.prototype._update = function (t, e) {
	    var n = this,
	        o = n.$el,
	        r = n._vnode,
	        s = Ve(n);
	    n._vnode = t, n.$el = r ? n.__patch__(r, t) : n.__patch__(n.$el, t, e, !1), s(), o && (o.__vue__ = null), n.$el && (n.$el.__vue__ = n), n.$vnode && n.$parent && n.$vnode === n.$parent._vnode && (n.$parent.$el = n.$el);
	  }, t.prototype.$forceUpdate = function () {
	    var t = this;
	    t._watcher && t._watcher.update();
	  }, t.prototype.$destroy = function () {
	    var t = this;
	    if (t._isBeingDestroyed) return;
	    qe(t, "beforeDestroy"), t._isBeingDestroyed = !0;
	    var e = t.$parent;
	    !e || e._isBeingDestroyed || t.$options.abstract || m(e.$children, t), t._watcher && t._watcher.teardown();
	    var n = t._watchers.length;

	    for (; n--;) {
	      t._watchers[n].teardown();
	    }

	    t._data.__ob__ && t._data.__ob__.vmCount--, t._isDestroyed = !0, t.__patch__(t._vnode, null), qe(t, "destroyed"), t.$off(), t.$el && (t.$el.__vue__ = null), t.$vnode && (t.$vnode.parent = null);
	  };
	}(yn), function (t) {
	  Ce(t.prototype), t.prototype.$nextTick = function (t) {
	    return qt(t, this);
	  }, t.prototype._render = function () {
	    var t = this,
	        _t$$options = t.$options,
	        e = _t$$options.render,
	        n = _t$$options._parentVnode;
	    var o;
	    n && (t.$scopedSlots = ie(n.data.scopedSlots, t.$slots, t.$scopedSlots)), t.$vnode = n;

	    try {
	      Me = t, o = e.call(t._renderProxy, t.$createElement);
	    } catch (e) {
	      Pt(e, t, "render"), o = t._vnode;
	    } finally {
	      Me = null;
	    }

	    return Array.isArray(o) && 1 === o.length && (o = o[0]), o instanceof dt || (o = pt()), o.parent = n, o;
	  };
	}(yn);
	var wn = [String, RegExp, Array];
	var Cn = {
	  KeepAlive: {
	    name: "keep-alive",
	    abstract: !0,
	    props: {
	      include: wn,
	      exclude: wn,
	      max: [String, Number]
	    },
	    created: function created() {
	      this.cache = Object.create(null), this.keys = [];
	    },
	    destroyed: function destroyed() {
	      for (var _t31 in this.cache) {
	        bn(this.cache, _t31, this.keys);
	      }
	    },
	    mounted: function mounted() {
	      var _this2 = this;

	      this.$watch("include", function (t) {
	        _n(_this2, function (e) {
	          return $n(t, e);
	        });
	      }), this.$watch("exclude", function (t) {
	        _n(_this2, function (e) {
	          return !$n(t, e);
	        });
	      });
	    },
	    render: function render() {
	      var t = this.$slots.default,
	          e = Pe(t),
	          n = e && e.componentOptions;

	      if (n) {
	        var _t32 = vn(n),
	            _o26 = this.include,
	            _r20 = this.exclude;

	        if (_o26 && (!_t32 || !$n(_o26, _t32)) || _r20 && _t32 && $n(_r20, _t32)) return e;

	        var _s11 = this.cache,
	            _i9 = this.keys,
	            _a4 = null == e.key ? n.Ctor.cid + (n.tag ? "::" + n.tag : "") : e.key;

	        _s11[_a4] ? (e.componentInstance = _s11[_a4].componentInstance, m(_i9, _a4), _i9.push(_a4)) : (_s11[_a4] = e, _i9.push(_a4), this.max && _i9.length > parseInt(this.max) && bn(_s11, _i9[0], _i9, this._vnode)), e.data.keepAlive = !0;
	      }

	      return e || t && t[0];
	    }
	  }
	};
	!function (t) {
	  var e = {
	    get: function get() {
	      return F;
	    }
	  };
	  Object.defineProperty(t, "config", e), t.util = {
	    warn: it,
	    extend: A,
	    mergeOptions: jt,
	    defineReactive: Ct
	  }, t.set = xt, t.delete = kt, t.nextTick = qt, t.observable = function (t) {
	    return wt(t), t;
	  }, t.options = Object.create(null), M.forEach(function (e) {
	    t.options[e + "s"] = Object.create(null);
	  }), t.options._base = t, A(t.options.components, Cn), function (t) {
	    t.use = function (t) {
	      var e = this._installedPlugins || (this._installedPlugins = []);
	      if (e.indexOf(t) > -1) return this;
	      var n = k(arguments, 1);
	      return n.unshift(this), "function" == typeof t.install ? t.install.apply(t, n) : "function" == typeof t && t.apply(null, n), e.push(t), this;
	    };
	  }(t), function (t) {
	    t.mixin = function (t) {
	      return this.options = jt(this.options, t), this;
	    };
	  }(t), gn(t), function (t) {
	    M.forEach(function (e) {
	      t[e] = function (t, n) {
	        return n ? ("component" === e && a(n) && (n.name = n.name || t, n = this.options._base.extend(n)), "directive" === e && "function" == typeof n && (n = {
	          bind: n,
	          update: n
	        }), this.options[e + "s"][t] = n, n) : this.options[e + "s"][t];
	      };
	    });
	  }(t);
	}(yn), Object.defineProperty(yn.prototype, "$isServer", {
	  get: et
	}), Object.defineProperty(yn.prototype, "$ssrContext", {
	  get: function get() {
	    return this.$vnode && this.$vnode.ssrContext;
	  }
	}), Object.defineProperty(yn, "FunctionalRenderContext", {
	  value: xe
	}), yn.version = "2.6.12";

	var xn = d("style,class"),
	    kn = d("input,textarea,option,select,progress"),
	    An = function An(t, e, n) {
	  return "value" === n && kn(t) && "button" !== e || "selected" === n && "option" === t || "checked" === n && "input" === t || "muted" === n && "video" === t;
	},
	    On = d("contenteditable,draggable,spellcheck"),
	    Sn = d("events,caret,typing,plaintext-only"),
	    Tn = function Tn(t, e) {
	  return Ln(e) || "false" === e ? "false" : "contenteditable" === t && Sn(e) ? e : "true";
	},
	    En = d("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
	    Nn = "http://www.w3.org/1999/xlink",
	    jn = function jn(t) {
	  return ":" === t.charAt(5) && "xlink" === t.slice(0, 5);
	},
	    Dn = function Dn(t) {
	  return jn(t) ? t.slice(6, t.length) : "";
	},
	    Ln = function Ln(t) {
	  return null == t || !1 === t;
	};

	function Mn(t) {
	  var e = t.data,
	      o = t,
	      r = t;

	  for (; n(r.componentInstance);) {
	    (r = r.componentInstance._vnode) && r.data && (e = In(r.data, e));
	  }

	  for (; n(o = o.parent);) {
	    o && o.data && (e = In(e, o.data));
	  }

	  return function (t, e) {
	    if (n(t) || n(e)) return Fn(t, Pn(e));
	    return "";
	  }(e.staticClass, e.class);
	}

	function In(t, e) {
	  return {
	    staticClass: Fn(t.staticClass, e.staticClass),
	    class: n(t.class) ? [t.class, e.class] : e.class
	  };
	}

	function Fn(t, e) {
	  return t ? e ? t + " " + e : t : e || "";
	}

	function Pn(t) {
	  return Array.isArray(t) ? function (t) {
	    var e,
	        o = "";

	    for (var _r21 = 0, _s12 = t.length; _r21 < _s12; _r21++) {
	      n(e = Pn(t[_r21])) && "" !== e && (o && (o += " "), o += e);
	    }

	    return o;
	  }(t) : s(t) ? function (t) {
	    var e = "";

	    for (var _n34 in t) {
	      t[_n34] && (e && (e += " "), e += _n34);
	    }

	    return e;
	  }(t) : "string" == typeof t ? t : "";
	}

	var Rn = {
	  svg: "http://www.w3.org/2000/svg",
	  math: "http://www.w3.org/1998/Math/MathML"
	},
	    Hn = d("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),
	    Bn = d("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
	    Un = function Un(t) {
	  return Hn(t) || Bn(t);
	};

	function zn(t) {
	  return Bn(t) ? "svg" : "math" === t ? "math" : void 0;
	}

	var Vn = Object.create(null);
	var Kn = d("text,number,password,search,email,tel,url");

	function Jn(t) {
	  if ("string" == typeof t) {
	    var _e26 = document.querySelector(t);

	    return _e26 || document.createElement("div");
	  }

	  return t;
	}

	var qn = Object.freeze({
	  createElement: function createElement(t, e) {
	    var n = document.createElement(t);
	    return "select" !== t ? n : (e.data && e.data.attrs && void 0 !== e.data.attrs.multiple && n.setAttribute("multiple", "multiple"), n);
	  },
	  createElementNS: function createElementNS(t, e) {
	    return document.createElementNS(Rn[t], e);
	  },
	  createTextNode: function createTextNode(t) {
	    return document.createTextNode(t);
	  },
	  createComment: function createComment(t) {
	    return document.createComment(t);
	  },
	  insertBefore: function insertBefore(t, e, n) {
	    t.insertBefore(e, n);
	  },
	  removeChild: function removeChild(t, e) {
	    t.removeChild(e);
	  },
	  appendChild: function appendChild(t, e) {
	    t.appendChild(e);
	  },
	  parentNode: function parentNode(t) {
	    return t.parentNode;
	  },
	  nextSibling: function nextSibling(t) {
	    return t.nextSibling;
	  },
	  tagName: function tagName(t) {
	    return t.tagName;
	  },
	  setTextContent: function setTextContent(t, e) {
	    t.textContent = e;
	  },
	  setStyleScope: function setStyleScope(t, e) {
	    t.setAttribute(e, "");
	  }
	}),
	    Wn = {
	  create: function create(t, e) {
	    Zn(e);
	  },
	  update: function update(t, e) {
	    t.data.ref !== e.data.ref && (Zn(t, !0), Zn(e));
	  },
	  destroy: function destroy(t) {
	    Zn(t, !0);
	  }
	};

	function Zn(t, e) {
	  var o = t.data.ref;
	  if (!n(o)) return;
	  var r = t.context,
	      s = t.componentInstance || t.elm,
	      i = r.$refs;
	  e ? Array.isArray(i[o]) ? m(i[o], s) : i[o] === s && (i[o] = void 0) : t.data.refInFor ? Array.isArray(i[o]) ? i[o].indexOf(s) < 0 && i[o].push(s) : i[o] = [s] : i[o] = s;
	}

	var Gn = new dt("", {}, []),
	    Xn = ["create", "activate", "update", "remove", "destroy"];

	function Yn(t, r) {
	  return t.key === r.key && (t.tag === r.tag && t.isComment === r.isComment && n(t.data) === n(r.data) && function (t, e) {
	    if ("input" !== t.tag) return !0;
	    var o;
	    var r = n(o = t.data) && n(o = o.attrs) && o.type,
	        s = n(o = e.data) && n(o = o.attrs) && o.type;
	    return r === s || Kn(r) && Kn(s);
	  }(t, r) || o(t.isAsyncPlaceholder) && t.asyncFactory === r.asyncFactory && e(r.asyncFactory.error));
	}

	function Qn(t, e, o) {
	  var r, s;
	  var i = {};

	  for (r = e; r <= o; ++r) {
	    n(s = t[r].key) && (i[s] = r);
	  }

	  return i;
	}

	var to = {
	  create: eo,
	  update: eo,
	  destroy: function destroy(t) {
	    eo(t, Gn);
	  }
	};

	function eo(t, e) {
	  (t.data.directives || e.data.directives) && function (t, e) {
	    var n = t === Gn,
	        o = e === Gn,
	        r = oo(t.data.directives, t.context),
	        s = oo(e.data.directives, e.context),
	        i = [],
	        a = [];
	    var c, l, u;

	    for (c in s) {
	      l = r[c], u = s[c], l ? (u.oldValue = l.value, u.oldArg = l.arg, so(u, "update", e, t), u.def && u.def.componentUpdated && a.push(u)) : (so(u, "bind", e, t), u.def && u.def.inserted && i.push(u));
	    }

	    if (i.length) {
	      var _o27 = function _o27() {
	        for (var _n35 = 0; _n35 < i.length; _n35++) {
	          so(i[_n35], "inserted", e, t);
	        }
	      };

	      n ? Qt(e, "insert", _o27) : _o27();
	    }

	    a.length && Qt(e, "postpatch", function () {
	      for (var _n36 = 0; _n36 < a.length; _n36++) {
	        so(a[_n36], "componentUpdated", e, t);
	      }
	    });
	    if (!n) for (c in r) {
	      s[c] || so(r[c], "unbind", t, t, o);
	    }
	  }(t, e);
	}

	var no = Object.create(null);

	function oo(t, e) {
	  var n = Object.create(null);
	  if (!t) return n;
	  var o, r;

	  for (o = 0; o < t.length; o++) {
	    (r = t[o]).modifiers || (r.modifiers = no), n[ro(r)] = r, r.def = Dt(e.$options, "directives", r.name);
	  }

	  return n;
	}

	function ro(t) {
	  return t.rawName || t.name + "." + Object.keys(t.modifiers || {}).join(".");
	}

	function so(t, e, n, o, r) {
	  var s = t.def && t.def[e];
	  if (s) try {
	    s(n.elm, t, n, o, r);
	  } catch (o) {
	    Pt(o, n.context, "directive " + t.name + " " + e + " hook");
	  }
	}

	var io = [Wn, to];

	function ao(t, o) {
	  var r = o.componentOptions;
	  if (n(r) && !1 === r.Ctor.options.inheritAttrs) return;
	  if (e(t.data.attrs) && e(o.data.attrs)) return;
	  var s, i;
	  var c = o.elm,
	      l = t.data.attrs || {};
	  var u = o.data.attrs || {};

	  for (s in n(u.__ob__) && (u = o.data.attrs = A({}, u)), u) {
	    i = u[s], l[s] !== i && co(c, s, i);
	  }

	  for (s in (q || Z) && u.value !== l.value && co(c, "value", u.value), l) {
	    e(u[s]) && (jn(s) ? c.removeAttributeNS(Nn, Dn(s)) : On(s) || c.removeAttribute(s));
	  }
	}

	function co(t, e, n) {
	  t.tagName.indexOf("-") > -1 ? lo(t, e, n) : En(e) ? Ln(n) ? t.removeAttribute(e) : (n = "allowfullscreen" === e && "EMBED" === t.tagName ? "true" : e, t.setAttribute(e, n)) : On(e) ? t.setAttribute(e, Tn(e, n)) : jn(e) ? Ln(n) ? t.removeAttributeNS(Nn, Dn(e)) : t.setAttributeNS(Nn, e, n) : lo(t, e, n);
	}

	function lo(t, e, n) {
	  if (Ln(n)) t.removeAttribute(e);else {
	    if (q && !W && "TEXTAREA" === t.tagName && "placeholder" === e && "" !== n && !t.__ieph) {
	      var _e27 = function _e27(n) {
	        n.stopImmediatePropagation(), t.removeEventListener("input", _e27);
	      };

	      t.addEventListener("input", _e27), t.__ieph = !0;
	    }

	    t.setAttribute(e, n);
	  }
	}

	var uo = {
	  create: ao,
	  update: ao
	};

	function fo(t, o) {
	  var r = o.elm,
	      s = o.data,
	      i = t.data;
	  if (e(s.staticClass) && e(s.class) && (e(i) || e(i.staticClass) && e(i.class))) return;
	  var a = Mn(o);
	  var c = r._transitionClasses;
	  n(c) && (a = Fn(a, Pn(c))), a !== r._prevClass && (r.setAttribute("class", a), r._prevClass = a);
	}

	var po = {
	  create: fo,
	  update: fo
	};
	var ho = /[\w).+\-_$\]]/;

	function mo(t) {
	  var e,
	      n,
	      o,
	      r,
	      s,
	      i = !1,
	      a = !1,
	      c = !1,
	      l = !1,
	      u = 0,
	      f = 0,
	      d = 0,
	      p = 0;

	  for (o = 0; o < t.length; o++) {
	    if (n = e, e = t.charCodeAt(o), i) 39 === e && 92 !== n && (i = !1);else if (a) 34 === e && 92 !== n && (a = !1);else if (c) 96 === e && 92 !== n && (c = !1);else if (l) 47 === e && 92 !== n && (l = !1);else if (124 !== e || 124 === t.charCodeAt(o + 1) || 124 === t.charCodeAt(o - 1) || u || f || d) {
	      switch (e) {
	        case 34:
	          a = !0;
	          break;

	        case 39:
	          i = !0;
	          break;

	        case 96:
	          c = !0;
	          break;

	        case 40:
	          d++;
	          break;

	        case 41:
	          d--;
	          break;

	        case 91:
	          f++;
	          break;

	        case 93:
	          f--;
	          break;

	        case 123:
	          u++;
	          break;

	        case 125:
	          u--;
	      }

	      if (47 === e) {
	        var _e28 = void 0,
	            _n37 = o - 1;

	        for (; _n37 >= 0 && " " === (_e28 = t.charAt(_n37)); _n37--) {}

	        _e28 && ho.test(_e28) || (l = !0);
	      }
	    } else void 0 === r ? (p = o + 1, r = t.slice(0, o).trim()) : h();
	  }

	  function h() {
	    (s || (s = [])).push(t.slice(p, o).trim()), p = o + 1;
	  }

	  if (void 0 === r ? r = t.slice(0, o).trim() : 0 !== p && h(), s) for (o = 0; o < s.length; o++) {
	    r = yo(r, s[o]);
	  }
	  return r;
	}

	function yo(t, e) {
	  var n = e.indexOf("(");
	  if (n < 0) return "_f(\"" + e + "\")(" + t + ")";
	  {
	    var _o28 = e.slice(0, n),
	        _r22 = e.slice(n + 1);

	    return "_f(\"" + _o28 + "\")(" + t + (")" !== _r22 ? "," + _r22 : _r22);
	  }
	}

	function go(t, e) {
	  console.error("[Vue compiler]: " + t);
	}

	function vo(t, e) {
	  return t ? t.map(function (t) {
	    return t[e];
	  }).filter(function (t) {
	    return t;
	  }) : [];
	}

	function $o(t, e, n, o, r) {
	  (t.props || (t.props = [])).push(So({
	    name: e,
	    value: n,
	    dynamic: r
	  }, o)), t.plain = !1;
	}

	function _o(t, e, n, o, r) {
	  (r ? t.dynamicAttrs || (t.dynamicAttrs = []) : t.attrs || (t.attrs = [])).push(So({
	    name: e,
	    value: n,
	    dynamic: r
	  }, o)), t.plain = !1;
	}

	function bo(t, e, n, o) {
	  t.attrsMap[e] = n, t.attrsList.push(So({
	    name: e,
	    value: n
	  }, o));
	}

	function wo(t, e, n, o, r, s, i, a) {
	  (t.directives || (t.directives = [])).push(So({
	    name: e,
	    rawName: n,
	    value: o,
	    arg: r,
	    isDynamicArg: s,
	    modifiers: i
	  }, a)), t.plain = !1;
	}

	function Co(t, e, n) {
	  return n ? "_p(" + e + ",\"" + t + "\")" : t + e;
	}

	function xo(e, n, o, r, s, i, a, c) {
	  var l;
	  (r = r || t).right ? c ? n = "(" + n + ")==='click'?'contextmenu':(" + n + ")" : "click" === n && (n = "contextmenu", delete r.right) : r.middle && (c ? n = "(" + n + ")==='click'?'mouseup':(" + n + ")" : "click" === n && (n = "mouseup")), r.capture && (delete r.capture, n = Co("!", n, c)), r.once && (delete r.once, n = Co("~", n, c)), r.passive && (delete r.passive, n = Co("&", n, c)), r.native ? (delete r.native, l = e.nativeEvents || (e.nativeEvents = {})) : l = e.events || (e.events = {});
	  var u = So({
	    value: o.trim(),
	    dynamic: c
	  }, a);
	  r !== t && (u.modifiers = r);
	  var f = l[n];
	  Array.isArray(f) ? s ? f.unshift(u) : f.push(u) : l[n] = f ? s ? [u, f] : [f, u] : u, e.plain = !1;
	}

	function ko(t, e, n) {
	  var o = Ao(t, ":" + e) || Ao(t, "v-bind:" + e);
	  if (null != o) return mo(o);

	  if (!1 !== n) {
	    var _n38 = Ao(t, e);

	    if (null != _n38) return JSON.stringify(_n38);
	  }
	}

	function Ao(t, e, n) {
	  var o;

	  if (null != (o = t.attrsMap[e])) {
	    var _n39 = t.attrsList;

	    for (var _t33 = 0, _o29 = _n39.length; _t33 < _o29; _t33++) {
	      if (_n39[_t33].name === e) {
	        _n39.splice(_t33, 1);

	        break;
	      }
	    }
	  }

	  return n && delete t.attrsMap[e], o;
	}

	function Oo(t, e) {
	  var n = t.attrsList;

	  for (var _t34 = 0, _o30 = n.length; _t34 < _o30; _t34++) {
	    var _o31 = n[_t34];
	    if (e.test(_o31.name)) return n.splice(_t34, 1), _o31;
	  }
	}

	function So(t, e) {
	  return e && (null != e.start && (t.start = e.start), null != e.end && (t.end = e.end)), t;
	}

	function To(t, e, n) {
	  var _ref5 = n || {},
	      o = _ref5.number,
	      r = _ref5.trim;

	  var s = "$$v";
	  r && (s = "(typeof $$v === 'string'? $$v.trim(): $$v)"), o && (s = "_n(" + s + ")");
	  var i = Eo(e, s);
	  t.model = {
	    value: "(" + e + ")",
	    expression: JSON.stringify(e),
	    callback: "function ($$v) {" + i + "}"
	  };
	}

	function Eo(t, e) {
	  var n = function (t) {
	    if (t = t.trim(), No = t.length, t.indexOf("[") < 0 || t.lastIndexOf("]") < No - 1) return (Lo = t.lastIndexOf(".")) > -1 ? {
	      exp: t.slice(0, Lo),
	      key: '"' + t.slice(Lo + 1) + '"'
	    } : {
	      exp: t,
	      key: null
	    };
	    jo = t, Lo = Mo = Io = 0;

	    for (; !Po();) {
	      Ro(Do = Fo()) ? Bo(Do) : 91 === Do && Ho(Do);
	    }

	    return {
	      exp: t.slice(0, Mo),
	      key: t.slice(Mo + 1, Io)
	    };
	  }(t);

	  return null === n.key ? t + "=" + e : "$set(" + n.exp + ", " + n.key + ", " + e + ")";
	}

	var No, jo, Do, Lo, Mo, Io;

	function Fo() {
	  return jo.charCodeAt(++Lo);
	}

	function Po() {
	  return Lo >= No;
	}

	function Ro(t) {
	  return 34 === t || 39 === t;
	}

	function Ho(t) {
	  var e = 1;

	  for (Mo = Lo; !Po();) {
	    if (Ro(t = Fo())) Bo(t);else if (91 === t && e++, 93 === t && e--, 0 === e) {
	      Io = Lo;
	      break;
	    }
	  }
	}

	function Bo(t) {
	  var e = t;

	  for (; !Po() && (t = Fo()) !== e;) {}
	}

	var Uo = "__r",
	    zo = "__c";
	var Vo;

	function Ko(t, e, n) {
	  var o = Vo;
	  return function r() {
	    null !== e.apply(null, arguments) && Wo(t, r, n, o);
	  };
	}

	var Jo = Ut && !(X && Number(X[1]) <= 53);

	function qo(t, e, n, o) {
	  if (Jo) {
	    var _t35 = tn,
	        _n40 = e;

	    e = _n40._wrapper = function (e) {
	      if (e.target === e.currentTarget || e.timeStamp >= _t35 || e.timeStamp <= 0 || e.target.ownerDocument !== document) return _n40.apply(this, arguments);
	    };
	  }

	  Vo.addEventListener(t, e, tt ? {
	    capture: n,
	    passive: o
	  } : n);
	}

	function Wo(t, e, n, o) {
	  (o || Vo).removeEventListener(t, e._wrapper || e, n);
	}

	function Zo(t, o) {
	  if (e(t.data.on) && e(o.data.on)) return;
	  var r = o.data.on || {},
	      s = t.data.on || {};
	  Vo = o.elm, function (t) {
	    if (n(t[Uo])) {
	      var _e29 = q ? "change" : "input";

	      t[_e29] = [].concat(t[Uo], t[_e29] || []), delete t[Uo];
	    }

	    n(t[zo]) && (t.change = [].concat(t[zo], t.change || []), delete t[zo]);
	  }(r), Yt(r, s, qo, Wo, Ko, o.context), Vo = void 0;
	}

	var Go = {
	  create: Zo,
	  update: Zo
	};
	var Xo;

	function Yo(t, o) {
	  if (e(t.data.domProps) && e(o.data.domProps)) return;
	  var r, s;
	  var i = o.elm,
	      a = t.data.domProps || {};
	  var c = o.data.domProps || {};

	  for (r in n(c.__ob__) && (c = o.data.domProps = A({}, c)), a) {
	    r in c || (i[r] = "");
	  }

	  for (r in c) {
	    if (s = c[r], "textContent" === r || "innerHTML" === r) {
	      if (o.children && (o.children.length = 0), s === a[r]) continue;
	      1 === i.childNodes.length && i.removeChild(i.childNodes[0]);
	    }

	    if ("value" === r && "PROGRESS" !== i.tagName) {
	      i._value = s;

	      var _t36 = e(s) ? "" : String(s);

	      Qo(i, _t36) && (i.value = _t36);
	    } else if ("innerHTML" === r && Bn(i.tagName) && e(i.innerHTML)) {
	      (Xo = Xo || document.createElement("div")).innerHTML = "<svg>" + s + "</svg>";
	      var _t37 = Xo.firstChild;

	      for (; i.firstChild;) {
	        i.removeChild(i.firstChild);
	      }

	      for (; _t37.firstChild;) {
	        i.appendChild(_t37.firstChild);
	      }
	    } else if (s !== a[r]) try {
	      i[r] = s;
	    } catch (t) {}
	  }
	}

	function Qo(t, e) {
	  return !t.composing && ("OPTION" === t.tagName || function (t, e) {
	    var n = !0;

	    try {
	      n = document.activeElement !== t;
	    } catch (t) {}

	    return n && t.value !== e;
	  }(t, e) || function (t, e) {
	    var o = t.value,
	        r = t._vModifiers;

	    if (n(r)) {
	      if (r.number) return f$8(o) !== f$8(e);
	      if (r.trim) return o.trim() !== e.trim();
	    }

	    return o !== e;
	  }(t, e));
	}

	var tr = {
	  create: Yo,
	  update: Yo
	};
	var er = v(function (t) {
	  var e = {},
	      n = /:(.+)/;
	  return t.split(/;(?![^(]*\))/g).forEach(function (t) {
	    if (t) {
	      var _o32 = t.split(n);

	      _o32.length > 1 && (e[_o32[0].trim()] = _o32[1].trim());
	    }
	  }), e;
	});

	function nr(t) {
	  var e = or(t.style);
	  return t.staticStyle ? A(t.staticStyle, e) : e;
	}

	function or(t) {
	  return Array.isArray(t) ? O(t) : "string" == typeof t ? er(t) : t;
	}

	var rr = /^--/,
	    sr = /\s*!important$/,
	    ir = function ir(t, e, n) {
	  if (rr.test(e)) t.style.setProperty(e, n);else if (sr.test(n)) t.style.setProperty(C(e), n.replace(sr, ""), "important");else {
	    var _o33 = lr(e);

	    if (Array.isArray(n)) for (var _e30 = 0, _r23 = n.length; _e30 < _r23; _e30++) {
	      t.style[_o33] = n[_e30];
	    } else t.style[_o33] = n;
	  }
	},
	    ar = ["Webkit", "Moz", "ms"];

	var cr;
	var lr = v(function (t) {
	  if (cr = cr || document.createElement("div").style, "filter" !== (t = _(t)) && t in cr) return t;
	  var e = t.charAt(0).toUpperCase() + t.slice(1);

	  for (var _t38 = 0; _t38 < ar.length; _t38++) {
	    var _n41 = ar[_t38] + e;

	    if (_n41 in cr) return _n41;
	  }
	});

	function ur(t, o) {
	  var r = o.data,
	      s = t.data;
	  if (e(r.staticStyle) && e(r.style) && e(s.staticStyle) && e(s.style)) return;
	  var i, a;
	  var c = o.elm,
	      l = s.staticStyle,
	      u = s.normalizedStyle || s.style || {},
	      f = l || u,
	      d = or(o.data.style) || {};
	  o.data.normalizedStyle = n(d.__ob__) ? A({}, d) : d;

	  var p = function (t, e) {
	    var n = {};
	    var o;

	    if (e) {
	      var _e31 = t;

	      for (; _e31.componentInstance;) {
	        (_e31 = _e31.componentInstance._vnode) && _e31.data && (o = nr(_e31.data)) && A(n, o);
	      }
	    }

	    (o = nr(t.data)) && A(n, o);
	    var r = t;

	    for (; r = r.parent;) {
	      r.data && (o = nr(r.data)) && A(n, o);
	    }

	    return n;
	  }(o, !0);

	  for (a in f) {
	    e(p[a]) && ir(c, a, "");
	  }

	  for (a in p) {
	    (i = p[a]) !== f[a] && ir(c, a, null == i ? "" : i);
	  }
	}

	var fr = {
	  create: ur,
	  update: ur
	};
	var dr = /\s+/;

	function pr(t, e) {
	  if (e && (e = e.trim())) if (t.classList) e.indexOf(" ") > -1 ? e.split(dr).forEach(function (e) {
	    return t.classList.add(e);
	  }) : t.classList.add(e);else {
	    var _n42 = " " + (t.getAttribute("class") || "") + " ";

	    _n42.indexOf(" " + e + " ") < 0 && t.setAttribute("class", (_n42 + e).trim());
	  }
	}

	function hr(t, e) {
	  if (e && (e = e.trim())) if (t.classList) e.indexOf(" ") > -1 ? e.split(dr).forEach(function (e) {
	    return t.classList.remove(e);
	  }) : t.classList.remove(e), t.classList.length || t.removeAttribute("class");else {
	    var _n43 = " " + (t.getAttribute("class") || "") + " ";

	    var _o34 = " " + e + " ";

	    for (; _n43.indexOf(_o34) >= 0;) {
	      _n43 = _n43.replace(_o34, " ");
	    }

	    (_n43 = _n43.trim()) ? t.setAttribute("class", _n43) : t.removeAttribute("class");
	  }
	}

	function mr(t) {
	  if (t) {
	    if ("object" == typeof t) {
	      var _e32 = {};
	      return !1 !== t.css && A(_e32, yr(t.name || "v")), A(_e32, t), _e32;
	    }

	    return "string" == typeof t ? yr(t) : void 0;
	  }
	}

	var yr = v(function (t) {
	  return {
	    enterClass: t + "-enter",
	    enterToClass: t + "-enter-to",
	    enterActiveClass: t + "-enter-active",
	    leaveClass: t + "-leave",
	    leaveToClass: t + "-leave-to",
	    leaveActiveClass: t + "-leave-active"
	  };
	}),
	    gr = z && !W,
	    vr = "transition",
	    $r = "animation";
	var _r = "transition",
	    br = "transitionend",
	    wr = "animation",
	    Cr = "animationend";
	gr && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (_r = "WebkitTransition", br = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (wr = "WebkitAnimation", Cr = "webkitAnimationEnd"));
	var xr = z ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : function (t) {
	  return t();
	};

	function kr(t) {
	  xr(function () {
	    xr(t);
	  });
	}

	function Ar(t, e) {
	  var n = t._transitionClasses || (t._transitionClasses = []);
	  n.indexOf(e) < 0 && (n.push(e), pr(t, e));
	}

	function Or(t, e) {
	  t._transitionClasses && m(t._transitionClasses, e), hr(t, e);
	}

	function Sr(t, e, n) {
	  var _Er = Er(t, e),
	      o = _Er.type,
	      r = _Er.timeout,
	      s = _Er.propCount;

	  if (!o) return n();
	  var i = o === vr ? br : Cr;
	  var a = 0;

	  var c = function c() {
	    t.removeEventListener(i, l), n();
	  },
	      l = function l(e) {
	    e.target === t && ++a >= s && c();
	  };

	  setTimeout(function () {
	    a < s && c();
	  }, r + 1), t.addEventListener(i, l);
	}

	var Tr = /\b(transform|all)(,|$)/;

	function Er(t, e) {
	  var n = window.getComputedStyle(t),
	      o = (n[_r + "Delay"] || "").split(", "),
	      r = (n[_r + "Duration"] || "").split(", "),
	      s = Nr(o, r),
	      i = (n[wr + "Delay"] || "").split(", "),
	      a = (n[wr + "Duration"] || "").split(", "),
	      c = Nr(i, a);
	  var l,
	      u = 0,
	      f = 0;
	  return e === vr ? s > 0 && (l = vr, u = s, f = r.length) : e === $r ? c > 0 && (l = $r, u = c, f = a.length) : f = (l = (u = Math.max(s, c)) > 0 ? s > c ? vr : $r : null) ? l === vr ? r.length : a.length : 0, {
	    type: l,
	    timeout: u,
	    propCount: f,
	    hasTransform: l === vr && Tr.test(n[_r + "Property"])
	  };
	}

	function Nr(t, e) {
	  for (; t.length < e.length;) {
	    t = t.concat(t);
	  }

	  return Math.max.apply(null, e.map(function (e, n) {
	    return jr(e) + jr(t[n]);
	  }));
	}

	function jr(t) {
	  return 1e3 * Number(t.slice(0, -1).replace(",", "."));
	}

	function Dr(t, o) {
	  var r = t.elm;
	  n(r._leaveCb) && (r._leaveCb.cancelled = !0, r._leaveCb());
	  var i = mr(t.data.transition);
	  if (e(i)) return;
	  if (n(r._enterCb) || 1 !== r.nodeType) return;
	  var a = i.css,
	      c = i.type,
	      l = i.enterClass,
	      u = i.enterToClass,
	      d = i.enterActiveClass,
	      p = i.appearClass,
	      h = i.appearToClass,
	      m = i.appearActiveClass,
	      y = i.beforeEnter,
	      g = i.enter,
	      v = i.afterEnter,
	      $ = i.enterCancelled,
	      _ = i.beforeAppear,
	      b = i.appear,
	      w = i.afterAppear,
	      C = i.appearCancelled,
	      x = i.duration;
	  var k = ze,
	      A = ze.$vnode;

	  for (; A && A.parent;) {
	    k = A.context, A = A.parent;
	  }

	  var O = !k._isMounted || !t.isRootInsert;
	  if (O && !b && "" !== b) return;
	  var S = O && p ? p : l,
	      T = O && m ? m : d,
	      E = O && h ? h : u,
	      N = O && _ || y,
	      j = O && "function" == typeof b ? b : g,
	      L = O && w || v,
	      M = O && C || $,
	      I = f$8(s(x) ? x.enter : x),
	      F = !1 !== a && !W,
	      P = Ir(j),
	      R = r._enterCb = D(function () {
	    F && (Or(r, E), Or(r, T)), R.cancelled ? (F && Or(r, S), M && M(r)) : L && L(r), r._enterCb = null;
	  });
	  t.data.show || Qt(t, "insert", function () {
	    var e = r.parentNode,
	        n = e && e._pending && e._pending[t.key];
	    n && n.tag === t.tag && n.elm._leaveCb && n.elm._leaveCb(), j && j(r, R);
	  }), N && N(r), F && (Ar(r, S), Ar(r, T), kr(function () {
	    Or(r, S), R.cancelled || (Ar(r, E), P || (Mr(I) ? setTimeout(R, I) : Sr(r, c, R)));
	  })), t.data.show && (o && o(), j && j(r, R)), F || P || R();
	}

	function Lr(t, o) {
	  var r = t.elm;
	  n(r._enterCb) && (r._enterCb.cancelled = !0, r._enterCb());
	  var i = mr(t.data.transition);
	  if (e(i) || 1 !== r.nodeType) return o();
	  if (n(r._leaveCb)) return;

	  var a = i.css,
	      c = i.type,
	      l = i.leaveClass,
	      u = i.leaveToClass,
	      d = i.leaveActiveClass,
	      p = i.beforeLeave,
	      h = i.leave,
	      m = i.afterLeave,
	      y = i.leaveCancelled,
	      g = i.delayLeave,
	      v = i.duration,
	      $ = !1 !== a && !W,
	      _ = Ir(h),
	      b = f$8(s(v) ? v.leave : v),
	      w = r._leaveCb = D(function () {
	    r.parentNode && r.parentNode._pending && (r.parentNode._pending[t.key] = null), $ && (Or(r, u), Or(r, d)), w.cancelled ? ($ && Or(r, l), y && y(r)) : (o(), m && m(r)), r._leaveCb = null;
	  });

	  function C() {
	    w.cancelled || (!t.data.show && r.parentNode && ((r.parentNode._pending || (r.parentNode._pending = {}))[t.key] = t), p && p(r), $ && (Ar(r, l), Ar(r, d), kr(function () {
	      Or(r, l), w.cancelled || (Ar(r, u), _ || (Mr(b) ? setTimeout(w, b) : Sr(r, c, w)));
	    })), h && h(r, w), $ || _ || w());
	  }

	  g ? g(C) : C();
	}

	function Mr(t) {
	  return "number" == typeof t && !isNaN(t);
	}

	function Ir(t) {
	  if (e(t)) return !1;
	  var o = t.fns;
	  return n(o) ? Ir(Array.isArray(o) ? o[0] : o) : (t._length || t.length) > 1;
	}

	function Fr(t, e) {
	  !0 !== e.data.show && Dr(e);
	}

	var Pr = function (t) {
	  var s, i;
	  var a = {},
	      c = t.modules,
	      l = t.nodeOps;

	  for (s = 0; s < Xn.length; ++s) {
	    for (a[Xn[s]] = [], i = 0; i < c.length; ++i) {
	      n(c[i][Xn[s]]) && a[Xn[s]].push(c[i][Xn[s]]);
	    }
	  }

	  function u(t) {
	    var e = l.parentNode(t);
	    n(e) && l.removeChild(e, t);
	  }

	  function f(t, e, r, s, i, c, u) {
	    if (n(t.elm) && n(c) && (t = c[u] = mt(t)), t.isRootInsert = !i, function (t, e, r, s) {
	      var i = t.data;

	      if (n(i)) {
	        var _c4 = n(t.componentInstance) && i.keepAlive;

	        if (n(i = i.hook) && n(i = i.init) && i(t, !1), n(t.componentInstance)) return p(t, e), h(r, t.elm, s), o(_c4) && function (t, e, o, r) {
	          var s,
	              i = t;

	          for (; i.componentInstance;) {
	            if (i = i.componentInstance._vnode, n(s = i.data) && n(s = s.transition)) {
	              for (s = 0; s < a.activate.length; ++s) {
	                a.activate[s](Gn, i);
	              }

	              e.push(i);
	              break;
	            }
	          }

	          h(o, t.elm, r);
	        }(t, e, r, s), !0;
	      }
	    }(t, e, r, s)) return;
	    var f = t.data,
	        d = t.children,
	        y = t.tag;
	    n(y) ? (t.elm = t.ns ? l.createElementNS(t.ns, y) : l.createElement(y, t), v(t), m(t, d, e), n(f) && g(t, e), h(r, t.elm, s)) : o(t.isComment) ? (t.elm = l.createComment(t.text), h(r, t.elm, s)) : (t.elm = l.createTextNode(t.text), h(r, t.elm, s));
	  }

	  function p(t, e) {
	    n(t.data.pendingInsert) && (e.push.apply(e, t.data.pendingInsert), t.data.pendingInsert = null), t.elm = t.componentInstance.$el, y(t) ? (g(t, e), v(t)) : (Zn(t), e.push(t));
	  }

	  function h(t, e, o) {
	    n(t) && (n(o) ? l.parentNode(o) === t && l.insertBefore(t, e, o) : l.appendChild(t, e));
	  }

	  function m(t, e, n) {
	    if (Array.isArray(e)) for (var _o35 = 0; _o35 < e.length; ++_o35) {
	      f(e[_o35], n, t.elm, null, !0, e, _o35);
	    } else r(t.text) && l.appendChild(t.elm, l.createTextNode(String(t.text)));
	  }

	  function y(t) {
	    for (; t.componentInstance;) {
	      t = t.componentInstance._vnode;
	    }

	    return n(t.tag);
	  }

	  function g(t, e) {
	    for (var _e33 = 0; _e33 < a.create.length; ++_e33) {
	      a.create[_e33](Gn, t);
	    }

	    n(s = t.data.hook) && (n(s.create) && s.create(Gn, t), n(s.insert) && e.push(t));
	  }

	  function v(t) {
	    var e;
	    if (n(e = t.fnScopeId)) l.setStyleScope(t.elm, e);else {
	      var _o36 = t;

	      for (; _o36;) {
	        n(e = _o36.context) && n(e = e.$options._scopeId) && l.setStyleScope(t.elm, e), _o36 = _o36.parent;
	      }
	    }
	    n(e = ze) && e !== t.context && e !== t.fnContext && n(e = e.$options._scopeId) && l.setStyleScope(t.elm, e);
	  }

	  function $(t, e, n, o, r, s) {
	    for (; o <= r; ++o) {
	      f(n[o], s, t, e, !1, n, o);
	    }
	  }

	  function _(t) {
	    var e, o;
	    var r = t.data;
	    if (n(r)) for (n(e = r.hook) && n(e = e.destroy) && e(t), e = 0; e < a.destroy.length; ++e) {
	      a.destroy[e](t);
	    }
	    if (n(e = t.children)) for (o = 0; o < t.children.length; ++o) {
	      _(t.children[o]);
	    }
	  }

	  function b(t, e, o) {
	    for (; e <= o; ++e) {
	      var _o37 = t[e];
	      n(_o37) && (n(_o37.tag) ? (w(_o37), _(_o37)) : u(_o37.elm));
	    }
	  }

	  function w(t, e) {
	    if (n(e) || n(t.data)) {
	      var _o38;

	      var _r24 = a.remove.length + 1;

	      for (n(e) ? e.listeners += _r24 : e = function (t, e) {
	        function n() {
	          0 == --n.listeners && u(t);
	        }

	        return n.listeners = e, n;
	      }(t.elm, _r24), n(_o38 = t.componentInstance) && n(_o38 = _o38._vnode) && n(_o38.data) && w(_o38, e), _o38 = 0; _o38 < a.remove.length; ++_o38) {
	        a.remove[_o38](t, e);
	      }

	      n(_o38 = t.data.hook) && n(_o38 = _o38.remove) ? _o38(t, e) : e();
	    } else u(t.elm);
	  }

	  function C(t, e, o, r) {
	    for (var _s13 = o; _s13 < r; _s13++) {
	      var _o39 = e[_s13];
	      if (n(_o39) && Yn(t, _o39)) return _s13;
	    }
	  }

	  function x(t, r, s, i, c, u) {
	    if (t === r) return;
	    n(r.elm) && n(i) && (r = i[c] = mt(r));
	    var d = r.elm = t.elm;
	    if (o(t.isAsyncPlaceholder)) return void (n(r.asyncFactory.resolved) ? O(t.elm, r, s) : r.isAsyncPlaceholder = !0);
	    if (o(r.isStatic) && o(t.isStatic) && r.key === t.key && (o(r.isCloned) || o(r.isOnce))) return void (r.componentInstance = t.componentInstance);
	    var p;
	    var h = r.data;
	    n(h) && n(p = h.hook) && n(p = p.prepatch) && p(t, r);
	    var m = t.children,
	        g = r.children;

	    if (n(h) && y(r)) {
	      for (p = 0; p < a.update.length; ++p) {
	        a.update[p](t, r);
	      }

	      n(p = h.hook) && n(p = p.update) && p(t, r);
	    }

	    e(r.text) ? n(m) && n(g) ? m !== g && function (t, o, r, s, i) {
	      var a,
	          c,
	          u,
	          p = 0,
	          h = 0,
	          m = o.length - 1,
	          y = o[0],
	          g = o[m],
	          v = r.length - 1,
	          _ = r[0],
	          w = r[v];
	      var k = !i;

	      for (; p <= m && h <= v;) {
	        e(y) ? y = o[++p] : e(g) ? g = o[--m] : Yn(y, _) ? (x(y, _, s, r, h), y = o[++p], _ = r[++h]) : Yn(g, w) ? (x(g, w, s, r, v), g = o[--m], w = r[--v]) : Yn(y, w) ? (x(y, w, s, r, v), k && l.insertBefore(t, y.elm, l.nextSibling(g.elm)), y = o[++p], w = r[--v]) : Yn(g, _) ? (x(g, _, s, r, h), k && l.insertBefore(t, g.elm, y.elm), g = o[--m], _ = r[++h]) : (e(a) && (a = Qn(o, p, m)), e(c = n(_.key) ? a[_.key] : C(_, o, p, m)) ? f(_, s, t, y.elm, !1, r, h) : Yn(u = o[c], _) ? (x(u, _, s, r, h), o[c] = void 0, k && l.insertBefore(t, u.elm, y.elm)) : f(_, s, t, y.elm, !1, r, h), _ = r[++h]);
	      }

	      p > m ? $(t, e(r[v + 1]) ? null : r[v + 1].elm, r, h, v, s) : h > v && b(o, p, m);
	    }(d, m, g, s, u) : n(g) ? (n(t.text) && l.setTextContent(d, ""), $(d, null, g, 0, g.length - 1, s)) : n(m) ? b(m, 0, m.length - 1) : n(t.text) && l.setTextContent(d, "") : t.text !== r.text && l.setTextContent(d, r.text), n(h) && n(p = h.hook) && n(p = p.postpatch) && p(t, r);
	  }

	  function k(t, e, r) {
	    if (o(r) && n(t.parent)) t.parent.data.pendingInsert = e;else for (var _t39 = 0; _t39 < e.length; ++_t39) {
	      e[_t39].data.hook.insert(e[_t39]);
	    }
	  }

	  var A = d("attrs,class,staticClass,staticStyle,key");

	  function O(t, e, r, s) {
	    var i;
	    var a = e.tag,
	        c = e.data,
	        l = e.children;
	    if (s = s || c && c.pre, e.elm = t, o(e.isComment) && n(e.asyncFactory)) return e.isAsyncPlaceholder = !0, !0;
	    if (n(c) && (n(i = c.hook) && n(i = i.init) && i(e, !0), n(i = e.componentInstance))) return p(e, r), !0;

	    if (n(a)) {
	      if (n(l)) if (t.hasChildNodes()) {
	        if (n(i = c) && n(i = i.domProps) && n(i = i.innerHTML)) {
	          if (i !== t.innerHTML) return !1;
	        } else {
	          var _e34 = !0,
	              _n44 = t.firstChild;

	          for (var _t40 = 0; _t40 < l.length; _t40++) {
	            if (!_n44 || !O(_n44, l[_t40], r, s)) {
	              _e34 = !1;
	              break;
	            }

	            _n44 = _n44.nextSibling;
	          }

	          if (!_e34 || _n44) return !1;
	        }
	      } else m(e, l, r);

	      if (n(c)) {
	        var _t41 = !1;

	        for (var _n45 in c) {
	          if (!A(_n45)) {
	            _t41 = !0, g(e, r);
	            break;
	          }
	        }

	        !_t41 && c.class && Zt(c.class);
	      }
	    } else t.data !== e.text && (t.data = e.text);

	    return !0;
	  }

	  return function (t, r, s, i) {
	    if (e(r)) return void (n(t) && _(t));
	    var c = !1;
	    var u = [];
	    if (e(t)) c = !0, f(r, u);else {
	      var _e35 = n(t.nodeType);

	      if (!_e35 && Yn(t, r)) x(t, r, u, null, null, i);else {
	        if (_e35) {
	          if (1 === t.nodeType && t.hasAttribute(L) && (t.removeAttribute(L), s = !0), o(s) && O(t, r, u)) return k(r, u, !0), t;
	          d = t, t = new dt(l.tagName(d).toLowerCase(), {}, [], void 0, d);
	        }

	        var _i10 = t.elm,
	            _c5 = l.parentNode(_i10);

	        if (f(r, u, _i10._leaveCb ? null : _c5, l.nextSibling(_i10)), n(r.parent)) {
	          var _t42 = r.parent;

	          var _e36 = y(r);

	          for (; _t42;) {
	            for (var _e37 = 0; _e37 < a.destroy.length; ++_e37) {
	              a.destroy[_e37](_t42);
	            }

	            if (_t42.elm = r.elm, _e36) {
	              for (var _e39 = 0; _e39 < a.create.length; ++_e39) {
	                a.create[_e39](Gn, _t42);
	              }

	              var _e38 = _t42.data.hook.insert;
	              if (_e38.merged) for (var _t43 = 1; _t43 < _e38.fns.length; _t43++) {
	                _e38.fns[_t43]();
	              }
	            } else Zn(_t42);

	            _t42 = _t42.parent;
	          }
	        }

	        n(_c5) ? b([t], 0, 0) : n(t.tag) && _(t);
	      }
	    }
	    var d;
	    return k(r, u, c), r.elm;
	  };
	}({
	  nodeOps: qn,
	  modules: [uo, po, Go, tr, fr, z ? {
	    create: Fr,
	    activate: Fr,
	    remove: function remove(t, e) {
	      !0 !== t.data.show ? Lr(t, e) : e();
	    }
	  } : {}].concat(io)
	});

	W && document.addEventListener("selectionchange", function () {
	  var t = document.activeElement;
	  t && t.vmodel && Jr(t, "input");
	});
	var Rr = {
	  inserted: function inserted(t, e, n, o) {
	    "select" === n.tag ? (o.elm && !o.elm._vOptions ? Qt(n, "postpatch", function () {
	      Rr.componentUpdated(t, e, n);
	    }) : Hr(t, e, n.context), t._vOptions = [].map.call(t.options, zr)) : ("textarea" === n.tag || Kn(t.type)) && (t._vModifiers = e.modifiers, e.modifiers.lazy || (t.addEventListener("compositionstart", Vr), t.addEventListener("compositionend", Kr), t.addEventListener("change", Kr), W && (t.vmodel = !0)));
	  },
	  componentUpdated: function componentUpdated(t, e, n) {
	    if ("select" === n.tag) {
	      Hr(t, e, n.context);

	      var _o40 = t._vOptions,
	          _r25 = t._vOptions = [].map.call(t.options, zr);

	      if (_r25.some(function (t, e) {
	        return !N(t, _o40[e]);
	      })) {
	        (t.multiple ? e.value.some(function (t) {
	          return Ur(t, _r25);
	        }) : e.value !== e.oldValue && Ur(e.value, _r25)) && Jr(t, "change");
	      }
	    }
	  }
	};

	function Hr(t, e, n) {
	  Br(t, e), (q || Z) && setTimeout(function () {
	    Br(t, e);
	  }, 0);
	}

	function Br(t, e, n) {
	  var o = e.value,
	      r = t.multiple;
	  if (r && !Array.isArray(o)) return;
	  var s, i;

	  for (var _e40 = 0, _n46 = t.options.length; _e40 < _n46; _e40++) {
	    if (i = t.options[_e40], r) s = j$2(o, zr(i)) > -1, i.selected !== s && (i.selected = s);else if (N(zr(i), o)) return void (t.selectedIndex !== _e40 && (t.selectedIndex = _e40));
	  }

	  r || (t.selectedIndex = -1);
	}

	function Ur(t, e) {
	  return e.every(function (e) {
	    return !N(e, t);
	  });
	}

	function zr(t) {
	  return "_value" in t ? t._value : t.value;
	}

	function Vr(t) {
	  t.target.composing = !0;
	}

	function Kr(t) {
	  t.target.composing && (t.target.composing = !1, Jr(t.target, "input"));
	}

	function Jr(t, e) {
	  var n = document.createEvent("HTMLEvents");
	  n.initEvent(e, !0, !0), t.dispatchEvent(n);
	}

	function qr(t) {
	  return !t.componentInstance || t.data && t.data.transition ? t : qr(t.componentInstance._vnode);
	}

	var Wr = {
	  model: Rr,
	  show: {
	    bind: function bind(t, _ref, n) {
	      var e = _ref.value;
	      var o = (n = qr(n)).data && n.data.transition,
	          r = t.__vOriginalDisplay = "none" === t.style.display ? "" : t.style.display;
	      e && o ? (n.data.show = !0, Dr(n, function () {
	        t.style.display = r;
	      })) : t.style.display = e ? r : "none";
	    },
	    update: function update(t, _ref2, o) {
	      var e = _ref2.value,
	          n = _ref2.oldValue;
	      if (!e == !n) return;
	      (o = qr(o)).data && o.data.transition ? (o.data.show = !0, e ? Dr(o, function () {
	        t.style.display = t.__vOriginalDisplay;
	      }) : Lr(o, function () {
	        t.style.display = "none";
	      })) : t.style.display = e ? t.__vOriginalDisplay : "none";
	    },
	    unbind: function unbind(t, e, n, o, r) {
	      r || (t.style.display = t.__vOriginalDisplay);
	    }
	  }
	};
	var Zr = {
	  name: String,
	  appear: Boolean,
	  css: Boolean,
	  mode: String,
	  type: String,
	  enterClass: String,
	  leaveClass: String,
	  enterToClass: String,
	  leaveToClass: String,
	  enterActiveClass: String,
	  leaveActiveClass: String,
	  appearClass: String,
	  appearActiveClass: String,
	  appearToClass: String,
	  duration: [Number, String, Object]
	};

	function Gr(t) {
	  var e = t && t.componentOptions;
	  return e && e.Ctor.options.abstract ? Gr(Pe(e.children)) : t;
	}

	function Xr(t) {
	  var e = {},
	      n = t.$options;

	  for (var _o41 in n.propsData) {
	    e[_o41] = t[_o41];
	  }

	  var o = n._parentListeners;

	  for (var _t44 in o) {
	    e[_(_t44)] = o[_t44];
	  }

	  return e;
	}

	function Yr(t, e) {
	  if (/\d-keep-alive$/.test(e.tag)) return t("keep-alive", {
	    props: e.componentOptions.propsData
	  });
	}

	var Qr = function Qr(t) {
	  return t.tag || Fe(t);
	},
	    ts = function ts(t) {
	  return "show" === t.name;
	};

	var es = {
	  name: "transition",
	  props: Zr,
	  abstract: !0,
	  render: function render(t) {
	    var _this3 = this;

	    var e = this.$slots.default;
	    if (!e) return;
	    if (!(e = e.filter(Qr)).length) return;
	    var n = this.mode,
	        o = e[0];
	    if (function (t) {
	      for (; t = t.parent;) {
	        if (t.data.transition) return !0;
	      }
	    }(this.$vnode)) return o;
	    var s = Gr(o);
	    if (!s) return o;
	    if (this._leaving) return Yr(t, o);
	    var i = "__transition-" + this._uid + "-";
	    s.key = null == s.key ? s.isComment ? i + "comment" : i + s.tag : r(s.key) ? 0 === String(s.key).indexOf(i) ? s.key : i + s.key : s.key;
	    var a = (s.data || (s.data = {})).transition = Xr(this),
	        c = this._vnode,
	        l = Gr(c);

	    if (s.data.directives && s.data.directives.some(ts) && (s.data.show = !0), l && l.data && !function (t, e) {
	      return e.key === t.key && e.tag === t.tag;
	    }(s, l) && !Fe(l) && (!l.componentInstance || !l.componentInstance._vnode.isComment)) {
	      var _e41 = l.data.transition = A({}, a);

	      if ("out-in" === n) return this._leaving = !0, Qt(_e41, "afterLeave", function () {
	        _this3._leaving = !1, _this3.$forceUpdate();
	      }), Yr(t, o);

	      if ("in-out" === n) {
	        if (Fe(s)) return c;

	        var _t45;

	        var _n47 = function _n47() {
	          _t45();
	        };

	        Qt(a, "afterEnter", _n47), Qt(a, "enterCancelled", _n47), Qt(_e41, "delayLeave", function (e) {
	          _t45 = e;
	        });
	      }
	    }

	    return o;
	  }
	};
	var ns = A({
	  tag: String,
	  moveClass: String
	}, Zr);

	function os(t) {
	  t.elm._moveCb && t.elm._moveCb(), t.elm._enterCb && t.elm._enterCb();
	}

	function rs(t) {
	  t.data.newPos = t.elm.getBoundingClientRect();
	}

	function ss(t) {
	  var e = t.data.pos,
	      n = t.data.newPos,
	      o = e.left - n.left,
	      r = e.top - n.top;

	  if (o || r) {
	    t.data.moved = !0;
	    var _e42 = t.elm.style;
	    _e42.transform = _e42.WebkitTransform = "translate(" + o + "px," + r + "px)", _e42.transitionDuration = "0s";
	  }
	}

	delete ns.mode;
	var is = {
	  Transition: es,
	  TransitionGroup: {
	    props: ns,
	    beforeMount: function beforeMount() {
	      var _this4 = this;

	      var t = this._update;

	      this._update = function (e, n) {
	        var o = Ve(_this4);
	        _this4.__patch__(_this4._vnode, _this4.kept, !1, !0), _this4._vnode = _this4.kept, o(), t.call(_this4, e, n);
	      };
	    },
	    render: function render(t) {
	      var e = this.tag || this.$vnode.data.tag || "span",
	          n = Object.create(null),
	          o = this.prevChildren = this.children,
	          r = this.$slots.default || [],
	          s = this.children = [],
	          i = Xr(this);

	      for (var _t46 = 0; _t46 < r.length; _t46++) {
	        var _e43 = r[_t46];
	        _e43.tag && null != _e43.key && 0 !== String(_e43.key).indexOf("__vlist") && (s.push(_e43), n[_e43.key] = _e43, (_e43.data || (_e43.data = {})).transition = i);
	      }

	      if (o) {
	        var _r26 = [],
	            _s14 = [];

	        for (var _t47 = 0; _t47 < o.length; _t47++) {
	          var _e44 = o[_t47];
	          _e44.data.transition = i, _e44.data.pos = _e44.elm.getBoundingClientRect(), n[_e44.key] ? _r26.push(_e44) : _s14.push(_e44);
	        }

	        this.kept = t(e, null, _r26), this.removed = _s14;
	      }

	      return t(e, null, s);
	    },
	    updated: function updated() {
	      var t = this.prevChildren,
	          e = this.moveClass || (this.name || "v") + "-move";
	      t.length && this.hasMove(t[0].elm, e) && (t.forEach(os), t.forEach(rs), t.forEach(ss), this._reflow = document.body.offsetHeight, t.forEach(function (t) {
	        if (t.data.moved) {
	          var _n48 = t.elm,
	              _o42 = _n48.style;
	          Ar(_n48, e), _o42.transform = _o42.WebkitTransform = _o42.transitionDuration = "", _n48.addEventListener(br, _n48._moveCb = function t(o) {
	            o && o.target !== _n48 || o && !/transform$/.test(o.propertyName) || (_n48.removeEventListener(br, t), _n48._moveCb = null, Or(_n48, e));
	          });
	        }
	      }));
	    },
	    methods: {
	      hasMove: function hasMove(t, e) {
	        if (!gr) return !1;
	        if (this._hasMove) return this._hasMove;
	        var n = t.cloneNode();
	        t._transitionClasses && t._transitionClasses.forEach(function (t) {
	          hr(n, t);
	        }), pr(n, e), n.style.display = "none", this.$el.appendChild(n);
	        var o = Er(n);
	        return this.$el.removeChild(n), this._hasMove = o.hasTransform;
	      }
	    }
	  }
	};
	yn.config.mustUseProp = An, yn.config.isReservedTag = Un, yn.config.isReservedAttr = xn, yn.config.getTagNamespace = zn, yn.config.isUnknownElement = function (t) {
	  if (!z) return !0;
	  if (Un(t)) return !1;
	  if (t = t.toLowerCase(), null != Vn[t]) return Vn[t];
	  var e = document.createElement(t);
	  return t.indexOf("-") > -1 ? Vn[t] = e.constructor === window.HTMLUnknownElement || e.constructor === window.HTMLElement : Vn[t] = /HTMLUnknownElement/.test(e.toString());
	}, A(yn.options.directives, Wr), A(yn.options.components, is), yn.prototype.__patch__ = z ? Pr : S, yn.prototype.$mount = function (t, e) {
	  return function (t, e, n) {
	    var o;
	    return t.$el = e, t.$options.render || (t.$options.render = pt), qe(t, "beforeMount"), o = function o() {
	      t._update(t._render(), n);
	    }, new rn(t, o, S, {
	      before: function before() {
	        t._isMounted && !t._isDestroyed && qe(t, "beforeUpdate");
	      }
	    }, !0), n = !1, null == t.$vnode && (t._isMounted = !0, qe(t, "mounted")), t;
	  }(this, t = t && z ? Jn(t) : void 0, e);
	}, z && setTimeout(function () {
	  F.devtools && nt && nt.emit("init", yn);
	}, 0);
	var as = /\{\{((?:.|\r?\n)+?)\}\}/g,
	    cs = /[-.*+?^${}()|[\]\/\\]/g,
	    ls = v(function (t) {
	  var e = t[0].replace(cs, "\\$&"),
	      n = t[1].replace(cs, "\\$&");
	  return new RegExp(e + "((?:.|\\n)+?)" + n, "g");
	});
	var us = {
	  staticKeys: ["staticClass"],
	  transformNode: function transformNode(t, e) {
	    e.warn;
	    var n = Ao(t, "class");
	    n && (t.staticClass = JSON.stringify(n));
	    var o = ko(t, "class", !1);
	    o && (t.classBinding = o);
	  },
	  genData: function genData(t) {
	    var e = "";
	    return t.staticClass && (e += "staticClass:" + t.staticClass + ","), t.classBinding && (e += "class:" + t.classBinding + ","), e;
	  }
	};
	var fs = {
	  staticKeys: ["staticStyle"],
	  transformNode: function transformNode(t, e) {
	    e.warn;
	    var n = Ao(t, "style");
	    n && (t.staticStyle = JSON.stringify(er(n)));
	    var o = ko(t, "style", !1);
	    o && (t.styleBinding = o);
	  },
	  genData: function genData(t) {
	    var e = "";
	    return t.staticStyle && (e += "staticStyle:" + t.staticStyle + ","), t.styleBinding && (e += "style:(" + t.styleBinding + "),"), e;
	  }
	};
	var ds;
	var ps = {
	  decode: function decode(t) {
	    return (ds = ds || document.createElement("div")).innerHTML = t, ds.textContent;
	  }
	};

	var hs = d("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),
	    ms = d("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),
	    ys = d("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),
	    gs = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
	    vs = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
	    $s = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + P.source + "]*",
	    _s = "((?:" + $s + "\\:)?" + $s + ")",
	    bs = new RegExp("^<" + _s),
	    ws = /^\s*(\/?)>/,
	    Cs = new RegExp("^<\\/" + _s + "[^>]*>"),
	    xs = /^<!DOCTYPE [^>]+>/i,
	    ks = /^<!\--/,
	    As = /^<!\[/,
	    Os = d("script,style,textarea", !0),
	    Ss = {},
	    Ts = {
	  "&lt;": "<",
	  "&gt;": ">",
	  "&quot;": '"',
	  "&amp;": "&",
	  "&#10;": "\n",
	  "&#9;": "\t",
	  "&#39;": "'"
	},
	    Es = /&(?:lt|gt|quot|amp|#39);/g,
	    Ns = /&(?:lt|gt|quot|amp|#39|#10|#9);/g,
	    js = d("pre,textarea", !0),
	    Ds = function Ds(t, e) {
	  return t && js(t) && "\n" === e[0];
	};

	function Ls(t, e) {
	  var n = e ? Ns : Es;
	  return t.replace(n, function (t) {
	    return Ts[t];
	  });
	}

	var Ms = /^@|^v-on:/,
	    Is = /^v-|^@|^:|^#/,
	    Fs = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
	    Ps = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
	    Rs = /^\(|\)$/g,
	    Hs = /^\[.*\]$/,
	    Bs = /:(.*)$/,
	    Us = /^:|^\.|^v-bind:/,
	    zs = /\.[^.\]]+(?=[^\]]*$)/g,
	    Vs = /^v-slot(:|$)|^#/,
	    Ks = /[\r\n]/,
	    Js = /\s+/g,
	    qs = v(ps.decode),
	    Ws = "_empty_";
	var Zs, Gs, Xs, Ys, Qs, ti, ei, ni;

	function oi(t, e, n) {
	  return {
	    type: 1,
	    tag: t,
	    attrsList: e,
	    attrsMap: ui(e),
	    rawAttrsMap: {},
	    parent: n,
	    children: []
	  };
	}

	function ri(t, e) {
	  Zs = e.warn || go, ti = e.isPreTag || T, ei = e.mustUseProp || T, ni = e.getTagNamespace || T;
	  e.isReservedTag;
	  Xs = vo(e.modules, "transformNode"), Ys = vo(e.modules, "preTransformNode"), Qs = vo(e.modules, "postTransformNode"), Gs = e.delimiters;
	  var n = [],
	      o = !1 !== e.preserveWhitespace,
	      r = e.whitespace;
	  var s,
	      i,
	      a = !1,
	      c = !1;

	  function l(t) {
	    if (u(t), a || t.processed || (t = si(t, e)), n.length || t === s || s.if && (t.elseif || t.else) && ai(s, {
	      exp: t.elseif,
	      block: t
	    }), i && !t.forbidden) if (t.elseif || t.else) !function (t, e) {
	      var n = function (t) {
	        var e = t.length;

	        for (; e--;) {
	          if (1 === t[e].type) return t[e];
	          t.pop();
	        }
	      }(e.children);

	      n && n.if && ai(n, {
	        exp: t.elseif,
	        block: t
	      });
	    }(t, i);else {
	      if (t.slotScope) {
	        var _e45 = t.slotTarget || '"default"';

	        (i.scopedSlots || (i.scopedSlots = {}))[_e45] = t;
	      }

	      i.children.push(t), t.parent = i;
	    }
	    t.children = t.children.filter(function (t) {
	      return !t.slotScope;
	    }), u(t), t.pre && (a = !1), ti(t.tag) && (c = !1);

	    for (var _n49 = 0; _n49 < Qs.length; _n49++) {
	      Qs[_n49](t, e);
	    }
	  }

	  function u(t) {
	    if (!c) {
	      var _e46;

	      for (; (_e46 = t.children[t.children.length - 1]) && 3 === _e46.type && " " === _e46.text;) {
	        t.children.pop();
	      }
	    }
	  }

	  return function (t, e) {
	    var n = [],
	        o = e.expectHTML,
	        r = e.isUnaryTag || T,
	        s = e.canBeLeftOpenTag || T;
	    var i,
	        a,
	        c = 0;

	    for (; t;) {
	      if (i = t, a && Os(a)) {
	        (function () {
	          var n = 0;
	          var o = a.toLowerCase(),
	              r = Ss[o] || (Ss[o] = new RegExp("([\\s\\S]*?)(</" + o + "[^>]*>)", "i")),
	              s = t.replace(r, function (t, r, s) {
	            return n = s.length, Os(o) || "noscript" === o || (r = r.replace(/<!\--([\s\S]*?)-->/g, "$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1")), Ds(o, r) && (r = r.slice(1)), e.chars && e.chars(r), "";
	          });
	          c += t.length - s.length, t = s, d(o, c - n, c);
	        })();
	      } else {
	        var _n50 = void 0,
	            _o43 = void 0,
	            _r27 = void 0,
	            _s15 = t.indexOf("<");

	        if (0 === _s15) {
	          if (ks.test(t)) {
	            var _n52 = t.indexOf("--\x3e");

	            if (_n52 >= 0) {
	              e.shouldKeepComment && e.comment(t.substring(4, _n52), c, c + _n52 + 3), l(_n52 + 3);
	              continue;
	            }
	          }

	          if (As.test(t)) {
	            var _e47 = t.indexOf("]>");

	            if (_e47 >= 0) {
	              l(_e47 + 2);
	              continue;
	            }
	          }

	          var _n51 = t.match(xs);

	          if (_n51) {
	            l(_n51[0].length);
	            continue;
	          }

	          var _o44 = t.match(Cs);

	          if (_o44) {
	            var _t48 = c;
	            l(_o44[0].length), d(_o44[1], _t48, c);
	            continue;
	          }

	          var _r28 = u();

	          if (_r28) {
	            f(_r28), Ds(_r28.tagName, t) && l(1);
	            continue;
	          }
	        }

	        if (_s15 >= 0) {
	          for (_o43 = t.slice(_s15); !(Cs.test(_o43) || bs.test(_o43) || ks.test(_o43) || As.test(_o43) || (_r27 = _o43.indexOf("<", 1)) < 0);) {
	            _s15 += _r27, _o43 = t.slice(_s15);
	          }

	          _n50 = t.substring(0, _s15);
	        }

	        _s15 < 0 && (_n50 = t), _n50 && l(_n50.length), e.chars && _n50 && e.chars(_n50, c - _n50.length, c);
	      }

	      if (t === i) {
	        e.chars && e.chars(t);
	        break;
	      }
	    }

	    function l(e) {
	      c += e, t = t.substring(e);
	    }

	    function u() {
	      var e = t.match(bs);

	      if (e) {
	        var _n53 = {
	          tagName: e[1],
	          attrs: [],
	          start: c
	        };

	        var _o45, _r29;

	        for (l(e[0].length); !(_o45 = t.match(ws)) && (_r29 = t.match(vs) || t.match(gs));) {
	          _r29.start = c, l(_r29[0].length), _r29.end = c, _n53.attrs.push(_r29);
	        }

	        if (_o45) return _n53.unarySlash = _o45[1], l(_o45[0].length), _n53.end = c, _n53;
	      }
	    }

	    function f(t) {
	      var i = t.tagName,
	          c = t.unarySlash;
	      o && ("p" === a && ys(i) && d(a), s(i) && a === i && d(i));
	      var l = r(i) || !!c,
	          u = t.attrs.length,
	          f = new Array(u);

	      for (var _n54 = 0; _n54 < u; _n54++) {
	        var _o46 = t.attrs[_n54],
	            _r30 = _o46[3] || _o46[4] || _o46[5] || "",
	            _s16 = "a" === i && "href" === _o46[1] ? e.shouldDecodeNewlinesForHref : e.shouldDecodeNewlines;

	        f[_n54] = {
	          name: _o46[1],
	          value: Ls(_r30, _s16)
	        };
	      }

	      l || (n.push({
	        tag: i,
	        lowerCasedTag: i.toLowerCase(),
	        attrs: f,
	        start: t.start,
	        end: t.end
	      }), a = i), e.start && e.start(i, f, l, t.start, t.end);
	    }

	    function d(t, o, r) {
	      var s, i;
	      if (null == o && (o = c), null == r && (r = c), t) for (i = t.toLowerCase(), s = n.length - 1; s >= 0 && n[s].lowerCasedTag !== i; s--) {} else s = 0;

	      if (s >= 0) {
	        for (var _t49 = n.length - 1; _t49 >= s; _t49--) {
	          e.end && e.end(n[_t49].tag, o, r);
	        }

	        n.length = s, a = s && n[s - 1].tag;
	      } else "br" === i ? e.start && e.start(t, [], !0, o, r) : "p" === i && (e.start && e.start(t, [], !1, o, r), e.end && e.end(t, o, r));
	    }

	    d();
	  }(t, {
	    warn: Zs,
	    expectHTML: e.expectHTML,
	    isUnaryTag: e.isUnaryTag,
	    canBeLeftOpenTag: e.canBeLeftOpenTag,
	    shouldDecodeNewlines: e.shouldDecodeNewlines,
	    shouldDecodeNewlinesForHref: e.shouldDecodeNewlinesForHref,
	    shouldKeepComment: e.comments,
	    outputSourceRange: e.outputSourceRange,
	    start: function start(t, o, r, u, f) {
	      var d = i && i.ns || ni(t);
	      q && "svg" === d && (o = function (t) {
	        var e = [];

	        for (var _n55 = 0; _n55 < t.length; _n55++) {
	          var _o47 = t[_n55];
	          fi.test(_o47.name) || (_o47.name = _o47.name.replace(di, ""), e.push(_o47));
	        }

	        return e;
	      }(o));
	      var p = oi(t, o, i);
	      var h;
	      d && (p.ns = d), "style" !== (h = p).tag && ("script" !== h.tag || h.attrsMap.type && "text/javascript" !== h.attrsMap.type) || et() || (p.forbidden = !0);

	      for (var _t50 = 0; _t50 < Ys.length; _t50++) {
	        p = Ys[_t50](p, e) || p;
	      }

	      a || (!function (t) {
	        null != Ao(t, "v-pre") && (t.pre = !0);
	      }(p), p.pre && (a = !0)), ti(p.tag) && (c = !0), a ? function (t) {
	        var e = t.attrsList,
	            n = e.length;

	        if (n) {
	          var _o48 = t.attrs = new Array(n);

	          for (var _t51 = 0; _t51 < n; _t51++) {
	            _o48[_t51] = {
	              name: e[_t51].name,
	              value: JSON.stringify(e[_t51].value)
	            }, null != e[_t51].start && (_o48[_t51].start = e[_t51].start, _o48[_t51].end = e[_t51].end);
	          }
	        } else t.pre || (t.plain = !0);
	      }(p) : p.processed || (ii(p), function (t) {
	        var e = Ao(t, "v-if");
	        if (e) t.if = e, ai(t, {
	          exp: e,
	          block: t
	        });else {
	          null != Ao(t, "v-else") && (t.else = !0);

	          var _e48 = Ao(t, "v-else-if");

	          _e48 && (t.elseif = _e48);
	        }
	      }(p), function (t) {
	        null != Ao(t, "v-once") && (t.once = !0);
	      }(p)), s || (s = p), r ? l(p) : (i = p, n.push(p));
	    },
	    end: function end(t, e, o) {
	      var r = n[n.length - 1];
	      n.length -= 1, i = n[n.length - 1], l(r);
	    },
	    chars: function chars(t, e, n) {
	      if (!i) return;
	      if (q && "textarea" === i.tag && i.attrsMap.placeholder === t) return;
	      var s = i.children;
	      var l;

	      if (t = c || t.trim() ? "script" === (l = i).tag || "style" === l.tag ? t : qs(t) : s.length ? r ? "condense" === r && Ks.test(t) ? "" : " " : o ? " " : "" : "") {
	        var _e49, _n56;

	        c || "condense" !== r || (t = t.replace(Js, " ")), !a && " " !== t && (_e49 = function (t, e) {
	          var n = e ? ls(e) : as;
	          if (!n.test(t)) return;
	          var o = [],
	              r = [];
	          var s,
	              i,
	              a,
	              c = n.lastIndex = 0;

	          for (; s = n.exec(t);) {
	            (i = s.index) > c && (r.push(a = t.slice(c, i)), o.push(JSON.stringify(a)));

	            var _e50 = mo(s[1].trim());

	            o.push("_s(" + _e50 + ")"), r.push({
	              "@binding": _e50
	            }), c = i + s[0].length;
	          }

	          return c < t.length && (r.push(a = t.slice(c)), o.push(JSON.stringify(a))), {
	            expression: o.join("+"),
	            tokens: r
	          };
	        }(t, Gs)) ? _n56 = {
	          type: 2,
	          expression: _e49.expression,
	          tokens: _e49.tokens,
	          text: t
	        } : " " === t && s.length && " " === s[s.length - 1].text || (_n56 = {
	          type: 3,
	          text: t
	        }), _n56 && s.push(_n56);
	      }
	    },
	    comment: function comment(t, e, n) {
	      if (i) {
	        var _e51 = {
	          type: 3,
	          text: t,
	          isComment: !0
	        };
	        i.children.push(_e51);
	      }
	    }
	  }), s;
	}

	function si(t, e) {
	  var n;
	  !function (t) {
	    var e = ko(t, "key");
	    e && (t.key = e);
	  }(t), t.plain = !t.key && !t.scopedSlots && !t.attrsList.length, function (t) {
	    var e = ko(t, "ref");
	    e && (t.ref = e, t.refInFor = function (t) {
	      var e = t;

	      for (; e;) {
	        if (void 0 !== e.for) return !0;
	        e = e.parent;
	      }

	      return !1;
	    }(t));
	  }(t), function (t) {
	    var e;
	    "template" === t.tag ? (e = Ao(t, "scope"), t.slotScope = e || Ao(t, "slot-scope")) : (e = Ao(t, "slot-scope")) && (t.slotScope = e);
	    var n = ko(t, "slot");
	    n && (t.slotTarget = '""' === n ? '"default"' : n, t.slotTargetDynamic = !(!t.attrsMap[":slot"] && !t.attrsMap["v-bind:slot"]), "template" === t.tag || t.slotScope || _o(t, "slot", n, function (t, e) {
	      return t.rawAttrsMap[":" + e] || t.rawAttrsMap["v-bind:" + e] || t.rawAttrsMap[e];
	    }(t, "slot")));

	    if ("template" === t.tag) {
	      var _e52 = Oo(t, Vs);

	      if (_e52) {
	        var _ci = ci(_e52),
	            _n57 = _ci.name,
	            _o49 = _ci.dynamic;

	        t.slotTarget = _n57, t.slotTargetDynamic = _o49, t.slotScope = _e52.value || Ws;
	      }
	    } else {
	      var _e53 = Oo(t, Vs);

	      if (_e53) {
	        var _n58 = t.scopedSlots || (t.scopedSlots = {}),
	            _ci2 = ci(_e53),
	            _o50 = _ci2.name,
	            _r31 = _ci2.dynamic,
	            _s17 = _n58[_o50] = oi("template", [], t);

	        _s17.slotTarget = _o50, _s17.slotTargetDynamic = _r31, _s17.children = t.children.filter(function (t) {
	          if (!t.slotScope) return t.parent = _s17, !0;
	        }), _s17.slotScope = _e53.value || Ws, t.children = [], t.plain = !1;
	      }
	    }
	  }(t), "slot" === (n = t).tag && (n.slotName = ko(n, "name")), function (t) {
	    var e;
	    (e = ko(t, "is")) && (t.component = e);
	    null != Ao(t, "inline-template") && (t.inlineTemplate = !0);
	  }(t);

	  for (var _n59 = 0; _n59 < Xs.length; _n59++) {
	    t = Xs[_n59](t, e) || t;
	  }

	  return function (t) {
	    var e = t.attrsList;
	    var n, o, r, s, i, a, c, l;

	    for (n = 0, o = e.length; n < o; n++) {
	      if (r = s = e[n].name, i = e[n].value, Is.test(r)) {
	        if (t.hasBindings = !0, (a = li(r.replace(Is, ""))) && (r = r.replace(zs, "")), Us.test(r)) r = r.replace(Us, ""), i = mo(i), (l = Hs.test(r)) && (r = r.slice(1, -1)), a && (a.prop && !l && "innerHtml" === (r = _(r)) && (r = "innerHTML"), a.camel && !l && (r = _(r)), a.sync && (c = Eo(i, "$event"), l ? xo(t, "\"update:\"+(" + r + ")", c, null, !1, 0, e[n], !0) : (xo(t, "update:" + _(r), c, null, !1, 0, e[n]), C(r) !== _(r) && xo(t, "update:" + C(r), c, null, !1, 0, e[n])))), a && a.prop || !t.component && ei(t.tag, t.attrsMap.type, r) ? $o(t, r, i, e[n], l) : _o(t, r, i, e[n], l);else if (Ms.test(r)) r = r.replace(Ms, ""), (l = Hs.test(r)) && (r = r.slice(1, -1)), xo(t, r, i, a, !1, 0, e[n], l);else {
	          var _o51 = (r = r.replace(Is, "")).match(Bs);

	          var _c6 = _o51 && _o51[1];

	          l = !1, _c6 && (r = r.slice(0, -(_c6.length + 1)), Hs.test(_c6) && (_c6 = _c6.slice(1, -1), l = !0)), wo(t, r, s, i, _c6, l, a, e[n]);
	        }
	      } else _o(t, r, JSON.stringify(i), e[n]), !t.component && "muted" === r && ei(t.tag, t.attrsMap.type, r) && $o(t, r, "true", e[n]);
	    }
	  }(t), t;
	}

	function ii(t) {
	  var e;

	  if (e = Ao(t, "v-for")) {
	    var _n60 = function (t) {
	      var e = t.match(Fs);
	      if (!e) return;
	      var n = {};
	      n.for = e[2].trim();
	      var o = e[1].trim().replace(Rs, ""),
	          r = o.match(Ps);
	      r ? (n.alias = o.replace(Ps, "").trim(), n.iterator1 = r[1].trim(), r[2] && (n.iterator2 = r[2].trim())) : n.alias = o;
	      return n;
	    }(e);

	    _n60 && A(t, _n60);
	  }
	}

	function ai(t, e) {
	  t.ifConditions || (t.ifConditions = []), t.ifConditions.push(e);
	}

	function ci(t) {
	  var e = t.name.replace(Vs, "");
	  return e || "#" !== t.name[0] && (e = "default"), Hs.test(e) ? {
	    name: e.slice(1, -1),
	    dynamic: !0
	  } : {
	    name: "\"" + e + "\"",
	    dynamic: !1
	  };
	}

	function li(t) {
	  var e = t.match(zs);

	  if (e) {
	    var _t52 = {};
	    return e.forEach(function (e) {
	      _t52[e.slice(1)] = !0;
	    }), _t52;
	  }
	}

	function ui(t) {
	  var e = {};

	  for (var _n61 = 0, _o52 = t.length; _n61 < _o52; _n61++) {
	    e[t[_n61].name] = t[_n61].value;
	  }

	  return e;
	}

	var fi = /^xmlns:NS\d+/,
	    di = /^NS\d+:/;

	function pi(t) {
	  return oi(t.tag, t.attrsList.slice(), t.parent);
	}

	var hi = [us, fs, {
	  preTransformNode: function preTransformNode(t, e) {
	    if ("input" === t.tag) {
	      var _n62 = t.attrsMap;
	      if (!_n62["v-model"]) return;

	      var _o53;

	      if ((_n62[":type"] || _n62["v-bind:type"]) && (_o53 = ko(t, "type")), _n62.type || _o53 || !_n62["v-bind"] || (_o53 = "(" + _n62["v-bind"] + ").type"), _o53) {
	        var _n63 = Ao(t, "v-if", !0),
	            _r32 = _n63 ? "&&(" + _n63 + ")" : "",
	            _s18 = null != Ao(t, "v-else", !0),
	            _i11 = Ao(t, "v-else-if", !0),
	            _a5 = pi(t);

	        ii(_a5), bo(_a5, "type", "checkbox"), si(_a5, e), _a5.processed = !0, _a5.if = "(" + _o53 + ")==='checkbox'" + _r32, ai(_a5, {
	          exp: _a5.if,
	          block: _a5
	        });

	        var _c7 = pi(t);

	        Ao(_c7, "v-for", !0), bo(_c7, "type", "radio"), si(_c7, e), ai(_a5, {
	          exp: "(" + _o53 + ")==='radio'" + _r32,
	          block: _c7
	        });

	        var _l = pi(t);

	        return Ao(_l, "v-for", !0), bo(_l, ":type", _o53), si(_l, e), ai(_a5, {
	          exp: _n63,
	          block: _l
	        }), _s18 ? _a5.else = !0 : _i11 && (_a5.elseif = _i11), _a5;
	      }
	    }
	  }
	}];
	var mi = {
	  expectHTML: !0,
	  modules: hi,
	  directives: {
	    model: function model(t, e, n) {
	      var o = e.value,
	          r = e.modifiers,
	          s = t.tag,
	          i = t.attrsMap.type;
	      if (t.component) return To(t, o, r), !1;
	      if ("select" === s) !function (t, e, n) {
	        var o = "var $$selectedVal = " + ('Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;' + ("return " + (n && n.number ? "_n(val)" : "val") + "})")) + ";";
	        o = o + " " + Eo(e, "$event.target.multiple ? $$selectedVal : $$selectedVal[0]"), xo(t, "change", o, null, !0);
	      }(t, o, r);else if ("input" === s && "checkbox" === i) !function (t, e, n) {
	        var o = n && n.number,
	            r = ko(t, "value") || "null",
	            s = ko(t, "true-value") || "true",
	            i = ko(t, "false-value") || "false";
	        $o(t, "checked", "Array.isArray(" + e + ")" + ("?_i(" + e + "," + r + ")>-1") + ("true" === s ? ":(" + e + ")" : ":_q(" + e + "," + s + ")")), xo(t, "change", "var $$a=" + e + "," + "$$el=$event.target," + ("$$c=$$el.checked?(" + s + "):(" + i + ");") + "if(Array.isArray($$a)){" + ("var $$v=" + (o ? "_n(" + r + ")" : r) + ",") + "$$i=_i($$a,$$v);" + ("if($$el.checked){$$i<0&&(" + Eo(e, "$$a.concat([$$v])") + ")}") + ("else{$$i>-1&&(" + Eo(e, "$$a.slice(0,$$i).concat($$a.slice($$i+1))") + ")}") + ("}else{" + Eo(e, "$$c") + "}"), null, !0);
	      }(t, o, r);else if ("input" === s && "radio" === i) !function (t, e, n) {
	        var o = n && n.number;
	        var r = ko(t, "value") || "null";
	        $o(t, "checked", "_q(" + e + "," + (r = o ? "_n(" + r + ")" : r) + ")"), xo(t, "change", Eo(e, r), null, !0);
	      }(t, o, r);else if ("input" === s || "textarea" === s) !function (t, e, n) {
	        var o = t.attrsMap.type,
	            _ref6 = n || {},
	            r = _ref6.lazy,
	            s = _ref6.number,
	            i = _ref6.trim,
	            a = !r && "range" !== o,
	            c = r ? "change" : "range" === o ? Uo : "input";

	        var l = "$event.target.value";
	        i && (l = "$event.target.value.trim()"), s && (l = "_n(" + l + ")");
	        var u = Eo(e, l);
	        a && (u = "if($event.target.composing)return;" + u), $o(t, "value", "(" + e + ")"), xo(t, c, u, null, !0), (i || s) && xo(t, "blur", "$forceUpdate()");
	      }(t, o, r);else if (!F.isReservedTag(s)) return To(t, o, r), !1;
	      return !0;
	    },
	    text: function text(t, e) {
	      e.value && $o(t, "textContent", "_s(" + e.value + ")", e);
	    },
	    html: function html(t, e) {
	      e.value && $o(t, "innerHTML", "_s(" + e.value + ")", e);
	    }
	  },
	  isPreTag: function isPreTag(t) {
	    return "pre" === t;
	  },
	  isUnaryTag: hs,
	  mustUseProp: An,
	  canBeLeftOpenTag: ms,
	  isReservedTag: Un,
	  getTagNamespace: zn,
	  staticKeys: function (t) {
	    return t.reduce(function (t, e) {
	      return t.concat(e.staticKeys || []);
	    }, []).join(",");
	  }(hi)
	};
	var yi, gi;
	var vi = v(function (t) {
	  return d("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap" + (t ? "," + t : ""));
	});

	function $i(t, e) {
	  t && (yi = vi(e.staticKeys || ""), gi = e.isReservedTag || T, function t(e) {
	    e.static = function (t) {
	      if (2 === t.type) return !1;
	      if (3 === t.type) return !0;
	      return !(!t.pre && (t.hasBindings || t.if || t.for || p(t.tag) || !gi(t.tag) || function (t) {
	        for (; t.parent;) {
	          if ("template" !== (t = t.parent).tag) return !1;
	          if (t.for) return !0;
	        }

	        return !1;
	      }(t) || !Object.keys(t).every(yi)));
	    }(e);

	    if (1 === e.type) {
	      if (!gi(e.tag) && "slot" !== e.tag && null == e.attrsMap["inline-template"]) return;

	      for (var _n64 = 0, _o54 = e.children.length; _n64 < _o54; _n64++) {
	        var _o55 = e.children[_n64];
	        t(_o55), _o55.static || (e.static = !1);
	      }

	      if (e.ifConditions) for (var _n65 = 1, _o56 = e.ifConditions.length; _n65 < _o56; _n65++) {
	        var _o57 = e.ifConditions[_n65].block;
	        t(_o57), _o57.static || (e.static = !1);
	      }
	    }
	  }(t), function t(e, n) {
	    if (1 === e.type) {
	      if ((e.static || e.once) && (e.staticInFor = n), e.static && e.children.length && (1 !== e.children.length || 3 !== e.children[0].type)) return void (e.staticRoot = !0);
	      if (e.staticRoot = !1, e.children) for (var _o58 = 0, _r33 = e.children.length; _o58 < _r33; _o58++) {
	        t(e.children[_o58], n || !!e.for);
	      }
	      if (e.ifConditions) for (var _o59 = 1, _r34 = e.ifConditions.length; _o59 < _r34; _o59++) {
	        t(e.ifConditions[_o59].block, n);
	      }
	    }
	  }(t, !1));
	}

	var _i = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,
	    bi = /\([^)]*?\);*$/,
	    wi = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,
	    Ci = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40,
	  delete: [8, 46]
	},
	    xi = {
	  esc: ["Esc", "Escape"],
	  tab: "Tab",
	  enter: "Enter",
	  space: [" ", "Spacebar"],
	  up: ["Up", "ArrowUp"],
	  left: ["Left", "ArrowLeft"],
	  right: ["Right", "ArrowRight"],
	  down: ["Down", "ArrowDown"],
	  delete: ["Backspace", "Delete", "Del"]
	},
	    ki = function ki(t) {
	  return "if(" + t + ")return null;";
	},
	    Ai = {
	  stop: "$event.stopPropagation();",
	  prevent: "$event.preventDefault();",
	  self: ki("$event.target !== $event.currentTarget"),
	  ctrl: ki("!$event.ctrlKey"),
	  shift: ki("!$event.shiftKey"),
	  alt: ki("!$event.altKey"),
	  meta: ki("!$event.metaKey"),
	  left: ki("'button' in $event && $event.button !== 0"),
	  middle: ki("'button' in $event && $event.button !== 1"),
	  right: ki("'button' in $event && $event.button !== 2")
	};

	function Oi(t, e) {
	  var n = e ? "nativeOn:" : "on:";
	  var o = "",
	      r = "";

	  for (var _e54 in t) {
	    var _n66 = Si(t[_e54]);

	    t[_e54] && t[_e54].dynamic ? r += _e54 + "," + _n66 + "," : o += "\"" + _e54 + "\":" + _n66 + ",";
	  }

	  return o = "{" + o.slice(0, -1) + "}", r ? n + ("_d(" + o + ",[" + r.slice(0, -1) + "])") : n + o;
	}

	function Si(t) {
	  if (!t) return "function(){}";
	  if (Array.isArray(t)) return "[" + t.map(function (t) {
	    return Si(t);
	  }).join(",") + "]";

	  var e = wi.test(t.value),
	      n = _i.test(t.value),
	      o = wi.test(t.value.replace(bi, ""));

	  if (t.modifiers) {
	    var _r35 = "",
	        _s19 = "";
	    var _i12 = [];

	    for (var _e55 in t.modifiers) {
	      if (Ai[_e55]) _s19 += Ai[_e55], Ci[_e55] && _i12.push(_e55);else if ("exact" === _e55) {
	        (function () {
	          var e = t.modifiers;
	          _s19 += ki(["ctrl", "shift", "alt", "meta"].filter(function (t) {
	            return !e[t];
	          }).map(function (t) {
	            return "$event." + t + "Key";
	          }).join("||"));
	        })();
	      } else _i12.push(_e55);
	    }

	    return _i12.length && (_r35 += function (t) {
	      return "if(!$event.type.indexOf('key')&&" + (t.map(Ti).join("&&") + ")return null;");
	    }(_i12)), _s19 && (_r35 += _s19), "function($event){" + _r35 + (e ? "return " + t.value + "($event)" : n ? "return (" + t.value + ")($event)" : o ? "return " + t.value : t.value) + "}";
	  }

	  return e || n ? t.value : "function($event){" + (o ? "return " + t.value : t.value) + "}";
	}

	function Ti(t) {
	  var e = parseInt(t, 10);
	  if (e) return "$event.keyCode!==" + e;
	  var n = Ci[t],
	      o = xi[t];
	  return "_k($event.keyCode," + (JSON.stringify(t) + ",") + (JSON.stringify(n) + ",") + "$event.key," + ("" + JSON.stringify(o)) + ")";
	}

	var Ei = {
	  on: function on(t, e) {
	    t.wrapListeners = function (t) {
	      return "_g(" + t + "," + e.value + ")";
	    };
	  },
	  bind: function bind(t, e) {
	    t.wrapData = function (n) {
	      return "_b(" + n + ",'" + t.tag + "'," + e.value + "," + (e.modifiers && e.modifiers.prop ? "true" : "false") + (e.modifiers && e.modifiers.sync ? ",true" : "") + ")";
	    };
	  },
	  cloak: S
	};

	var Ni = function Ni(t) {
	  this.options = t, this.warn = t.warn || go, this.transforms = vo(t.modules, "transformCode"), this.dataGenFns = vo(t.modules, "genData"), this.directives = A(A({}, Ei), t.directives);
	  var e = t.isReservedTag || T;
	  this.maybeComponent = function (t) {
	    return !!t.component || !e(t.tag);
	  }, this.onceId = 0, this.staticRenderFns = [], this.pre = !1;
	};

	function ji(t, e) {
	  var n = new Ni(e);
	  return {
	    render: "with(this){return " + (t ? Di(t, n) : '_c("div")') + "}",
	    staticRenderFns: n.staticRenderFns
	  };
	}

	function Di(t, e) {
	  if (t.parent && (t.pre = t.pre || t.parent.pre), t.staticRoot && !t.staticProcessed) return Li(t, e);
	  if (t.once && !t.onceProcessed) return Mi(t, e);
	  if (t.for && !t.forProcessed) return Fi(t, e);
	  if (t.if && !t.ifProcessed) return Ii(t, e);

	  if ("template" !== t.tag || t.slotTarget || e.pre) {
	    if ("slot" === t.tag) return function (t, e) {
	      var n = t.slotName || '"default"',
	          o = Bi(t, e);
	      var r = "_t(" + n + (o ? "," + o : "");
	      var s = t.attrs || t.dynamicAttrs ? Vi((t.attrs || []).concat(t.dynamicAttrs || []).map(function (t) {
	        return {
	          name: _(t.name),
	          value: t.value,
	          dynamic: t.dynamic
	        };
	      })) : null,
	          i = t.attrsMap["v-bind"];
	      !s && !i || o || (r += ",null");
	      s && (r += "," + s);
	      i && (r += (s ? "" : ",null") + "," + i);
	      return r + ")";
	    }(t, e);
	    {
	      var _n67;

	      if (t.component) _n67 = function (t, e, n) {
	        var o = e.inlineTemplate ? null : Bi(e, n, !0);
	        return "_c(" + t + "," + Pi(e, n) + (o ? "," + o : "") + ")";
	      }(t.component, t, e);else {
	        var _o60;

	        (!t.plain || t.pre && e.maybeComponent(t)) && (_o60 = Pi(t, e));

	        var _r36 = t.inlineTemplate ? null : Bi(t, e, !0);

	        _n67 = "_c('" + t.tag + "'" + (_o60 ? "," + _o60 : "") + (_r36 ? "," + _r36 : "") + ")";
	      }

	      for (var _o61 = 0; _o61 < e.transforms.length; _o61++) {
	        _n67 = e.transforms[_o61](t, _n67);
	      }

	      return _n67;
	    }
	  }

	  return Bi(t, e) || "void 0";
	}

	function Li(t, e) {
	  t.staticProcessed = !0;
	  var n = e.pre;
	  return t.pre && (e.pre = t.pre), e.staticRenderFns.push("with(this){return " + Di(t, e) + "}"), e.pre = n, "_m(" + (e.staticRenderFns.length - 1) + (t.staticInFor ? ",true" : "") + ")";
	}

	function Mi(t, e) {
	  if (t.onceProcessed = !0, t.if && !t.ifProcessed) return Ii(t, e);

	  if (t.staticInFor) {
	    var _n68 = "",
	        _o62 = t.parent;

	    for (; _o62;) {
	      if (_o62.for) {
	        _n68 = _o62.key;
	        break;
	      }

	      _o62 = _o62.parent;
	    }

	    return _n68 ? "_o(" + Di(t, e) + "," + e.onceId++ + "," + _n68 + ")" : Di(t, e);
	  }

	  return Li(t, e);
	}

	function Ii(t, e, n, o) {
	  return t.ifProcessed = !0, function t(e, n, o, r) {
	    if (!e.length) return r || "_e()";
	    var s = e.shift();
	    return s.exp ? "(" + s.exp + ")?" + i(s.block) + ":" + t(e, n, o, r) : "" + i(s.block);

	    function i(t) {
	      return o ? o(t, n) : t.once ? Mi(t, n) : Di(t, n);
	    }
	  }(t.ifConditions.slice(), e, n, o);
	}

	function Fi(t, e, n, o) {
	  var r = t.for,
	      s = t.alias,
	      i = t.iterator1 ? "," + t.iterator1 : "",
	      a = t.iterator2 ? "," + t.iterator2 : "";
	  return t.forProcessed = !0, (o || "_l") + "((" + r + ")," + ("function(" + s + i + a + "){") + ("return " + (n || Di)(t, e)) + "})";
	}

	function Pi(t, e) {
	  var n = "{";

	  var o = function (t, e) {
	    var n = t.directives;
	    if (!n) return;
	    var o,
	        r,
	        s,
	        i,
	        a = "directives:[",
	        c = !1;

	    for (o = 0, r = n.length; o < r; o++) {
	      s = n[o], i = !0;
	      var _r37 = e.directives[s.name];
	      _r37 && (i = !!_r37(t, s, e.warn)), i && (c = !0, a += "{name:\"" + s.name + "\",rawName:\"" + s.rawName + "\"" + (s.value ? ",value:(" + s.value + "),expression:" + JSON.stringify(s.value) : "") + (s.arg ? ",arg:" + (s.isDynamicArg ? s.arg : "\"" + s.arg + "\"") : "") + (s.modifiers ? ",modifiers:" + JSON.stringify(s.modifiers) : "") + "},");
	    }

	    if (c) return a.slice(0, -1) + "]";
	  }(t, e);

	  o && (n += o + ","), t.key && (n += "key:" + t.key + ","), t.ref && (n += "ref:" + t.ref + ","), t.refInFor && (n += "refInFor:true,"), t.pre && (n += "pre:true,"), t.component && (n += "tag:\"" + t.tag + "\",");

	  for (var _o63 = 0; _o63 < e.dataGenFns.length; _o63++) {
	    n += e.dataGenFns[_o63](t);
	  }

	  if (t.attrs && (n += "attrs:" + Vi(t.attrs) + ","), t.props && (n += "domProps:" + Vi(t.props) + ","), t.events && (n += Oi(t.events, !1) + ","), t.nativeEvents && (n += Oi(t.nativeEvents, !0) + ","), t.slotTarget && !t.slotScope && (n += "slot:" + t.slotTarget + ","), t.scopedSlots && (n += function (t, e, n) {
	    var o = t.for || Object.keys(e).some(function (t) {
	      var n = e[t];
	      return n.slotTargetDynamic || n.if || n.for || Ri(n);
	    }),
	        r = !!t.if;

	    if (!o) {
	      var _e56 = t.parent;

	      for (; _e56;) {
	        if (_e56.slotScope && _e56.slotScope !== Ws || _e56.for) {
	          o = !0;
	          break;
	        }

	        _e56.if && (r = !0), _e56 = _e56.parent;
	      }
	    }

	    var s = Object.keys(e).map(function (t) {
	      return Hi(e[t], n);
	    }).join(",");
	    return "scopedSlots:_u([" + s + "]" + (o ? ",null,true" : "") + (!o && r ? ",null,false," + function (t) {
	      var e = 5381,
	          n = t.length;

	      for (; n;) {
	        e = 33 * e ^ t.charCodeAt(--n);
	      }

	      return e >>> 0;
	    }(s) : "") + ")";
	  }(t, t.scopedSlots, e) + ","), t.model && (n += "model:{value:" + t.model.value + ",callback:" + t.model.callback + ",expression:" + t.model.expression + "},"), t.inlineTemplate) {
	    var _o64 = function (t, e) {
	      var n = t.children[0];

	      if (n && 1 === n.type) {
	        var _t53 = ji(n, e.options);

	        return "inlineTemplate:{render:function(){" + _t53.render + "},staticRenderFns:[" + _t53.staticRenderFns.map(function (t) {
	          return "function(){" + t + "}";
	        }).join(",") + "]}";
	      }
	    }(t, e);

	    _o64 && (n += _o64 + ",");
	  }

	  return n = n.replace(/,$/, "") + "}", t.dynamicAttrs && (n = "_b(" + n + ",\"" + t.tag + "\"," + Vi(t.dynamicAttrs) + ")"), t.wrapData && (n = t.wrapData(n)), t.wrapListeners && (n = t.wrapListeners(n)), n;
	}

	function Ri(t) {
	  return 1 === t.type && ("slot" === t.tag || t.children.some(Ri));
	}

	function Hi(t, e) {
	  var n = t.attrsMap["slot-scope"];
	  if (t.if && !t.ifProcessed && !n) return Ii(t, e, Hi, "null");
	  if (t.for && !t.forProcessed) return Fi(t, e, Hi);
	  var o = t.slotScope === Ws ? "" : String(t.slotScope),
	      r = "function(" + o + "){" + ("return " + ("template" === t.tag ? t.if && n ? "(" + t.if + ")?" + (Bi(t, e) || "undefined") + ":undefined" : Bi(t, e) || "undefined" : Di(t, e)) + "}"),
	      s = o ? "" : ",proxy:true";
	  return "{key:" + (t.slotTarget || '"default"') + ",fn:" + r + s + "}";
	}

	function Bi(t, e, n, o, r) {
	  var s = t.children;

	  if (s.length) {
	    var _t54 = s[0];

	    if (1 === s.length && _t54.for && "template" !== _t54.tag && "slot" !== _t54.tag) {
	      var _r38 = n ? e.maybeComponent(_t54) ? ",1" : ",0" : "";

	      return "" + (o || Di)(_t54, e) + _r38;
	    }

	    var _i13 = n ? function (t, e) {
	      var n = 0;

	      for (var _o65 = 0; _o65 < t.length; _o65++) {
	        var _r39 = t[_o65];

	        if (1 === _r39.type) {
	          if (Ui(_r39) || _r39.ifConditions && _r39.ifConditions.some(function (t) {
	            return Ui(t.block);
	          })) {
	            n = 2;
	            break;
	          }

	          (e(_r39) || _r39.ifConditions && _r39.ifConditions.some(function (t) {
	            return e(t.block);
	          })) && (n = 1);
	        }
	      }

	      return n;
	    }(s, e.maybeComponent) : 0,
	        _a6 = r || zi;

	    return "[" + s.map(function (t) {
	      return _a6(t, e);
	    }).join(",") + "]" + (_i13 ? "," + _i13 : "");
	  }
	}

	function Ui(t) {
	  return void 0 !== t.for || "template" === t.tag || "slot" === t.tag;
	}

	function zi(t, e) {
	  return 1 === t.type ? Di(t, e) : 3 === t.type && t.isComment ? (o = t, "_e(" + JSON.stringify(o.text) + ")") : "_v(" + (2 === (n = t).type ? n.expression : Ki(JSON.stringify(n.text))) + ")";
	  var n, o;
	}

	function Vi(t) {
	  var e = "",
	      n = "";

	  for (var _o66 = 0; _o66 < t.length; _o66++) {
	    var _r40 = t[_o66],
	        _s20 = Ki(_r40.value);

	    _r40.dynamic ? n += _r40.name + "," + _s20 + "," : e += "\"" + _r40.name + "\":" + _s20 + ",";
	  }

	  return e = "{" + e.slice(0, -1) + "}", n ? "_d(" + e + ",[" + n.slice(0, -1) + "])" : e;
	}

	function Ki(t) {
	  return t.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}

	function Ji(t, e) {
	  try {
	    return new Function(t);
	  } catch (n) {
	    return e.push({
	      err: n,
	      code: t
	    }), S;
	  }
	}

	function qi(t) {
	  var e = Object.create(null);
	  return function (n, o, r) {
	    (o = A({}, o)).warn;
	    delete o.warn;
	    var s = o.delimiters ? String(o.delimiters) + n : n;
	    if (e[s]) return e[s];
	    var i = t(n, o),
	        a = {},
	        c = [];
	    return a.render = Ji(i.render, c), a.staticRenderFns = i.staticRenderFns.map(function (t) {
	      return Ji(t, c);
	    }), e[s] = a;
	  };
	}

	var Wi = (Zi = function Zi(t, e) {
	  var n = ri(t.trim(), e);
	  !1 !== e.optimize && $i(n, e);
	  var o = ji(n, e);
	  return {
	    ast: n,
	    render: o.render,
	    staticRenderFns: o.staticRenderFns
	  };
	}, function (t) {
	  function e(e, n) {
	    var o = Object.create(t),
	        r = [],
	        s = [];

	    if (n) {
	      n.modules && (o.modules = (t.modules || []).concat(n.modules)), n.directives && (o.directives = A(Object.create(t.directives || null), n.directives));

	      for (var _t55 in n) {
	        "modules" !== _t55 && "directives" !== _t55 && (o[_t55] = n[_t55]);
	      }
	    }

	    o.warn = function (t, e, n) {
	      (n ? s : r).push(t);
	    };

	    var i = Zi(e.trim(), o);
	    return i.errors = r, i.tips = s, i;
	  }

	  return {
	    compile: e,
	    compileToFunctions: qi(e)
	  };
	});
	var Zi;

	var _Wi = Wi(mi);
	    _Wi.compile;
	    var Xi = _Wi.compileToFunctions;

	var Yi;

	function Qi(t) {
	  return (Yi = Yi || document.createElement("div")).innerHTML = t ? '<a href="\n"/>' : '<div a="\n"/>', Yi.innerHTML.indexOf("&#10;") > 0;
	}

	var ta = !!z && Qi(!1),
	    ea = !!z && Qi(!0),
	    na = v(function (t) {
	  var e = Jn(t);
	  return e && e.innerHTML;
	}),
	    oa = yn.prototype.$mount;
	yn.prototype.$mount = function (t, e) {
	  if ((t = t && Jn(t)) === document.body || t === document.documentElement) return this;
	  var n = this.$options;

	  if (!n.render) {
	    var _e57 = n.template;

	    if (_e57) {
	      if ("string" == typeof _e57) "#" === _e57.charAt(0) && (_e57 = na(_e57));else {
	        if (!_e57.nodeType) return this;
	        _e57 = _e57.innerHTML;
	      }
	    } else t && (_e57 = function (t) {
	      if (t.outerHTML) return t.outerHTML;
	      {
	        var _e58 = document.createElement("div");

	        return _e58.appendChild(t.cloneNode(!0)), _e58.innerHTML;
	      }
	    }(t));

	    if (_e57) {
	      var _Xi = Xi(_e57, {
	        outputSourceRange: !1,
	        shouldDecodeNewlines: ta,
	        shouldDecodeNewlinesForHref: ea,
	        delimiters: n.delimiters,
	        comments: n.comments
	      }, this),
	          _t56 = _Xi.render,
	          _o67 = _Xi.staticRenderFns;

	      n.render = _t56, n.staticRenderFns = _o67;
	    }
	  }

	  return oa.call(this, t, e);
	}, yn.compile = Xi;

	var toArray = function toArray(a) {
	  var ret = Array(a.length);

	  for (var i = 0; i < a.length; ++i) {
	    ret[i] = a[i];
	  }

	  return ret;
	};

	var arrayFind = function arrayFind(array, search) {
	  return array.filter(function (a) {
	    return a === search;
	  })[0];
	};

	var tabSort = function tabSort(a, b) {
	  var tabDiff = a.tabIndex - b.tabIndex;
	  var indexDiff = a.index - b.index;

	  if (tabDiff) {
	    if (!a.tabIndex) return 1;
	    if (!b.tabIndex) return -1;
	  }

	  return tabDiff || indexDiff;
	};

	var orderByTabIndex = function orderByTabIndex(nodes, filterNegative) {
	  return toArray(nodes).map(function (node, index) {
	    return {
	      node: node,
	      index: index,
	      tabIndex: node.tabIndex
	    };
	  }).filter(function (data) {
	    return !filterNegative || data.tabIndex >= 0;
	  }).sort(tabSort);
	};

	var tabbables = ['button:enabled:not([readonly])', 'select:enabled:not([readonly])', 'textarea:enabled:not([readonly])', 'input:enabled:not([readonly])', 'a[href]', 'area[href]', 'iframe', 'object', 'embed', '[tabindex]', '[contenteditable]', '[autofocus]'];
	var FOCUS_GROUP = 'data-focus-lock';
	var FOCUS_DISABLED = 'data-focus-lock-disabled';
	var FOCUS_ALLOW = 'data-no-focus-lock';
	var FOCUS_AUTO = 'data-autofocus-inside';

	var getFocusables = function getFocusables(parents) {
	  return parents.reduce(function (acc, parent) {
	    return acc.concat(toArray(parent.querySelectorAll(tabbables.join(','))));
	  }, []);
	};

	var getParentAutofocusables = function getParentAutofocusables(parent) {
	  var parentFocus = parent.querySelectorAll('[' + FOCUS_AUTO + ']');
	  return toArray(parentFocus).map(function (node) {
	    return getFocusables([node]);
	  }).reduce(function (acc, nodes) {
	    return acc.concat(nodes);
	  }, []);
	};

	var isElementHidden = function isElementHidden(computedStyle) {
	  if (!computedStyle || !computedStyle.getPropertyValue) {
	    return false;
	  }

	  return computedStyle.getPropertyValue('display') === 'none' || computedStyle.getPropertyValue('visibility') === 'hidden';
	};

	var isVisible = function isVisible(node) {
	  return !node || node === document || !isElementHidden(window.getComputedStyle(node, null)) && isVisible(node.parentNode);
	};

	var notHiddenInput = function notHiddenInput(node) {
	  return !((node.tagName === 'INPUT' || node.tagName === 'BUTTON') && (node.type === 'hidden' || node.disabled));
	};

	var getParents = function getParents(node) {
	  var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  parents.push(node);

	  if (node.parentNode) {
	    getParents(node.parentNode, parents);
	  }

	  return parents;
	};

	var getCommonParent = function getCommonParent(nodea, nodeb) {
	  var parentsA = getParents(nodea);
	  var parentsB = getParents(nodeb);

	  for (var i = 0; i < parentsA.length; i += 1) {
	    var currentParent = parentsA[i];

	    if (parentsB.indexOf(currentParent) >= 0) {
	      return currentParent;
	    }
	  }

	  return false;
	};

	var filterFocusable = function filterFocusable(nodes) {
	  return toArray(nodes).filter(function (node) {
	    return isVisible(node);
	  }).filter(function (node) {
	    return notHiddenInput(node);
	  });
	};

	var getTabbableNodes = function getTabbableNodes(topNodes) {
	  return orderByTabIndex(filterFocusable(getFocusables(topNodes)), true);
	};

	var getAllTabbableNodes = function getAllTabbableNodes(topNodes) {
	  return orderByTabIndex(filterFocusable(getFocusables(topNodes)), false);
	};

	var parentAutofocusables = function parentAutofocusables(topNode) {
	  return filterFocusable(getParentAutofocusables(topNode));
	};

	var isRadio = function isRadio(node) {
	  return node.tagName === 'INPUT' && node.type === 'radio';
	};

	var findSelectedRadio = function findSelectedRadio(node, nodes) {
	  return nodes.filter(isRadio).filter(function (el) {
	    return el.name === node.name;
	  }).filter(function (el) {
	    return el.checked;
	  })[0] || node;
	};

	var pickFirstFocus = function pickFirstFocus(nodes) {
	  if (nodes[0] && nodes.length > 1) {
	    if (isRadio(nodes[0]) && nodes[0].name) {
	      return findSelectedRadio(nodes[0], nodes);
	    }
	  }

	  return nodes[0];
	};

	var filterNested = function filterNested(nodes) {
	  var l = nodes.length;
	  var i = void 0;
	  var j = void 0;

	  for (i = 0; i < l; i += 1) {
	    for (j = 0; j < l; j += 1) {
	      if (i !== j) {
	        if (nodes[i].contains(nodes[j])) {
	          return filterNested(nodes.filter(function (x) {
	            return x !== nodes[j];
	          }));
	        }
	      }
	    }
	  }

	  return nodes;
	};

	var getTopParent = function getTopParent(node) {
	  return node.parentNode ? getTopParent(node.parentNode) : node;
	};

	var getAllAffectedNodes = function getAllAffectedNodes(node) {
	  var group = node.getAttribute(FOCUS_GROUP);

	  if (group) {
	    return filterNested(toArray(getTopParent(node).querySelectorAll('[' + FOCUS_GROUP + '="' + group + '"]:not([' + FOCUS_DISABLED + '="disabled"])')));
	  }

	  return [node];
	};

	var findAutoFocused = function findAutoFocused(autoFocusables) {
	  return function (node) {
	    return !!node.autofocus || node.dataset && !!node.dataset.autofocus || autoFocusables.indexOf(node) >= 0;
	  };
	};

	var newFocus = function newFocus(innerNodes, outerNodes, activeElement, lastNode, autoFocused) {
	  var cnt = innerNodes.length;
	  var firstFocus = innerNodes[0];
	  var lastFocus = innerNodes[cnt - 1]; // focus is inside

	  if (innerNodes.indexOf(activeElement) >= 0) {
	    return undefined;
	  }

	  var activeIndex = outerNodes.indexOf(activeElement);
	  var lastIndex = outerNodes.indexOf(lastNode || activeIndex);
	  var lastNodeInside = innerNodes.indexOf(lastNode);
	  var indexDiff = activeIndex - lastIndex;
	  var firstNodeIndex = outerNodes.indexOf(firstFocus);
	  var lastNodeIndex = outerNodes.indexOf(lastFocus); // new focus

	  if (activeIndex === -1 || lastNodeInside === -1) {
	    return innerNodes.indexOf(autoFocused.length ? pickFirstFocus(autoFocused) : pickFirstFocus(innerNodes));
	  } // old focus


	  if (!indexDiff && lastNodeInside >= 0) {
	    return lastNodeInside;
	  } // jump out


	  if (indexDiff && Math.abs(indexDiff) > 1) {
	    return lastNodeInside;
	  } // focus above lock


	  if (activeIndex <= firstNodeIndex) {
	    return cnt - 1;
	  } // focus below lock


	  if (activeIndex > lastNodeIndex) {
	    return 0;
	  } // index is inside tab order, but outside Lock


	  if (indexDiff) {
	    if (Math.abs(indexDiff) > 1) {
	      return lastNodeInside;
	    }

	    return (cnt + lastNodeInside + indexDiff) % cnt;
	  } // do nothing


	  return undefined;
	};

	var getTopCommonParent = function getTopCommonParent(activeElement, entry, entries) {
	  var topCommon = entry;
	  entries.forEach(function (subEntry) {
	    var common = getCommonParent(activeElement, subEntry);

	    if (common) {
	      if (common.contains(topCommon)) {
	        topCommon = common;
	      } else {
	        topCommon = getCommonParent(common, topCommon);
	      }
	    }
	  });
	  return topCommon;
	};

	var allParentAutofocusables = function allParentAutofocusables(entries) {
	  return entries.reduce(function (acc, node) {
	    return acc.concat(parentAutofocusables(node));
	  }, []);
	};

	var notAGuard = function notAGuard(node) {
	  return !(node.dataset && node.dataset.focusGuard);
	};

	var getFocusMerge = function getFocusMerge(topNode, lastNode) {
	  var activeElement = document && document.activeElement;
	  var entries = getAllAffectedNodes(topNode).filter(notAGuard);
	  var commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);
	  var innerElements = getTabbableNodes(entries).filter(function (_ref) {
	    var node = _ref.node;
	    return notAGuard(node);
	  });

	  if (!innerElements[0]) {
	    innerElements = getAllTabbableNodes(entries).filter(function (_ref2) {
	      var node = _ref2.node;
	      return notAGuard(node);
	    });

	    if (!innerElements[0]) {
	      return undefined;
	    }
	  }

	  var innerNodes = innerElements.map(function (_ref3) {
	    var node = _ref3.node;
	    return node;
	  });
	  var outerNodes = getTabbableNodes([commonParent]).map(function (_ref4) {
	    var node = _ref4.node;
	    return node;
	  });
	  var newId = newFocus(innerNodes, outerNodes, activeElement, lastNode, innerNodes.filter(findAutoFocused(allParentAutofocusables(entries))));

	  if (newId === undefined) {
	    return newId;
	  }

	  return innerElements[newId];
	};

	var focusInFrame = function focusInFrame(frame) {
	  return frame === document.activeElement;
	};

	var focusInsideIframe = function focusInsideIframe(topNode) {
	  return getAllAffectedNodes(topNode).reduce(function (result, node) {
	    return result || !!arrayFind(toArray(node.querySelectorAll('iframe')), focusInFrame);
	  }, false);
	};

	var focusInside = function focusInside(topNode) {
	  var activeElement = document && document.activeElement;

	  if (!activeElement || activeElement.dataset && activeElement.dataset.focusGuard) {
	    return false;
	  }

	  return getAllAffectedNodes(topNode).reduce(function (result, node) {
	    return result || node.contains(activeElement) || focusInsideIframe(topNode);
	  }, false);
	};

	var focusIsHidden = function focusIsHidden() {
	  return document && toArray(document.querySelectorAll('[' + FOCUS_ALLOW + ']')).some(function (node) {
	    return node.contains(document.activeElement);
	  });
	};

	var focusOn = function focusOn(target) {
	  target.focus();

	  if (target.contentWindow) {
	    target.contentWindow.focus();
	  }
	};

	var guardCount = 0;

	var setFocus = function setFocus(topNode, lastNode) {
	  var focusable = getFocusMerge(topNode, lastNode);

	  if (focusable) {
	    if (guardCount > 2) {
	      return;
	    }

	    guardCount++;
	    focusOn(focusable.node);
	    guardCount--;
	  }
	}; //


	function deferAction(action) {
	  var setImmediate = window.setImmediate;

	  if (typeof setImmediate !== 'undefined') {
	    setImmediate(action);
	  } else {
	    setTimeout(action, 1);
	  }
	}

	var lastActiveTrap = 0;
	var lastActiveFocus = null;
	var focusWasOutsideWindow = false;

	var focusOnBody = function focusOnBody() {
	  return document && document.activeElement === document.body;
	};

	var isFreeFocus = function isFreeFocus() {
	  return focusOnBody() || focusIsHidden();
	};

	var activateTrap = function activateTrap() {
	  var result = false;

	  if (lastActiveTrap) {
	    var _lastActiveTrap = lastActiveTrap,
	        observed = _lastActiveTrap.observed,
	        onActivation = _lastActiveTrap.onActivation;

	    if (focusWasOutsideWindow || !isFreeFocus() || !lastActiveFocus) {
	      if (observed && !focusInside(observed)) {
	        onActivation();
	        result = setFocus(observed, lastActiveFocus);
	      }

	      focusWasOutsideWindow = false;
	      lastActiveFocus = document && document.activeElement;
	    }
	  }

	  return result;
	};

	var reducePropsToState = function reducePropsToState(propsList) {
	  return propsList.filter(function (_ref7) {
	    var disabled = _ref7.disabled;
	    return !disabled;
	  }).slice(-1)[0];
	};

	var handleStateChangeOnClient = function handleStateChangeOnClient(trap) {
	  if (lastActiveTrap !== trap) {
	    lastActiveTrap = null;
	  }

	  lastActiveTrap = trap;

	  if (trap) {
	    activateTrap();
	    deferAction(activateTrap);
	  }
	};

	var instances = [];

	var emitChange = function emitChange() {
	  handleStateChangeOnClient(reducePropsToState(instances));
	};

	var onTrap = function onTrap(event) {
	  if (activateTrap() && event) {
	    // prevent scroll jump
	    event.stopPropagation();
	    event.preventDefault();
	  }
	};

	var onBlur = function onBlur() {
	  deferAction(activateTrap);
	};

	var onWindowBlur = function onWindowBlur() {
	  focusWasOutsideWindow = true;
	};

	var attachHandler = function attachHandler() {
	  document.addEventListener('focusin', onTrap, true);
	  document.addEventListener('focusout', onBlur);
	  window.addEventListener('blur', onWindowBlur);
	};

	var detachHandler = function detachHandler() {
	  document.removeEventListener('focusin', onTrap, true);
	  document.removeEventListener('focusout', onBlur);
	  window.removeEventListener('blur', onWindowBlur);
	};

	var script = {
	  name: 'Lock',
	  props: {
	    returnFocus: {
	      type: Boolean
	    },
	    disabled: {
	      type: Boolean
	    },
	    noFocusGuards: {
	      type: [Boolean, String],
	      default: false
	    },
	    group: {
	      type: String
	    }
	  },
	  data: function data() {
	    return {
	      data: {},
	      hidden: "" //    "width: 1px;height: 0px;padding: 0;overflow: hidden;position: fixed;top: 0;left: 0;"

	    };
	  },
	  computed: {
	    groupAttr: function groupAttr() {
	      var _ref8;

	      return _ref8 = {}, _ref8[FOCUS_GROUP] = this.group, _ref8;
	    },
	    hasLeadingGuards: function hasLeadingGuards() {
	      return this.noFocusGuards !== true;
	    },
	    hasTailingGuards: function hasTailingGuards() {
	      return this.hasLeadingGuards && this.noFocusGuards !== 'tail';
	    }
	  },
	  watch: {
	    disabled: function disabled() {
	      this.data.disabled = this.disabled;
	      emitChange();
	    }
	  },
	  methods: {
	    onBlur: function onBlur() {
	      deferAction(emitChange);
	    }
	  },
	  mounted: function mounted() {
	    var _this5 = this;

	    this.data.vue = this;
	    this.data.observed = this.$el.querySelector("[data-lock]");
	    this.data.disabled = this.disabled;

	    this.data.onActivation = function () {
	      _this5.originalFocusedElement = _this5.originalFocusedElement || document && document.activeElement;
	    };

	    if (!instances.length) {
	      attachHandler();
	    }

	    instances.push(this.data);
	    emitChange();
	  },
	  destroyed: function destroyed() {
	    var _this6 = this;

	    instances = instances.filter(function (_ref9) {
	      var vue = _ref9.vue;
	      return vue !== _this6;
	    });

	    if (!instances.length) {
	      detachHandler();
	    }

	    if (this.returnFocus && this.originalFocusedElement && this.originalFocusedElement.focus) {
	      this.originalFocusedElement.focus();
	    }

	    emitChange();
	  }
	};

	function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
	/* server only */
	, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
	  if (typeof shadowMode !== 'boolean') {
	    createInjectorSSR = createInjector;
	    createInjector = shadowMode;
	    shadowMode = false;
	  } // Vue.extend constructor export interop.


	  var options = typeof script === 'function' ? script.options : script; // render functions

	  if (template && template.render) {
	    options.render = template.render;
	    options.staticRenderFns = template.staticRenderFns;
	    options._compiled = true; // functional template

	    if (isFunctionalTemplate) {
	      options.functional = true;
	    }
	  } // scopedId


	  if (scopeId) {
	    options._scopeId = scopeId;
	  }

	  var hook;

	  if (moduleIdentifier) {
	    // server build
	    hook = function hook(context) {
	      // 2.3 injection
	      context = context || // cached call
	      this.$vnode && this.$vnode.ssrContext || // stateful
	      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
	      // 2.2 with runInNewContext: true

	      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
	        context = __VUE_SSR_CONTEXT__;
	      } // inject component styles


	      if (style) {
	        style.call(this, createInjectorSSR(context));
	      } // register component module identifier for async chunk inference


	      if (context && context._registeredComponents) {
	        context._registeredComponents.add(moduleIdentifier);
	      }
	    }; // used by ssr in case component is cached and beforeCreate
	    // never gets called


	    options._ssrRegister = hook;
	  } else if (style) {
	    hook = shadowMode ? function (context) {
	      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
	    } : function (context) {
	      style.call(this, createInjector(context));
	    };
	  }

	  if (hook) {
	    if (options.functional) {
	      // register for functional component in vue file
	      var originalRender = options.render;

	      options.render = function renderWithStyleInjection(h, context) {
	        hook.call(context);
	        return originalRender(h, context);
	      };
	    } else {
	      // inject component registration as beforeCreate hook
	      var existing = options.beforeCreate;
	      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
	    }
	  }

	  return script;
	}
	/* script */


	var __vue_script__ = script;
	/* template */

	var __vue_render__ = function __vue_render__() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', [_vm.hasLeadingGuards ? _c('div', {
	    style: _vm.hidden,
	    attrs: {
	      "tabIndex": _vm.disabled ? -1 : 0
	    }
	  }) : _vm._e(), _vm._v(" "), _vm.hasLeadingGuards ? _c('div', {
	    style: _vm.hidden,
	    attrs: {
	      "tabIndex": _vm.disabled ? -1 : 1
	    }
	  }) : _vm._e(), _vm._v(" "), _c('div', _vm._b({
	    attrs: {
	      "data-lock": ""
	    },
	    on: {
	      "focusout": _vm.onBlur
	    }
	  }, 'div', _vm.groupAttr, false), [_vm._t("default")], 2), _vm._v(" "), _vm.hasTailingGuards ? _c('div', {
	    style: _vm.hidden,
	    attrs: {
	      "tabIndex": _vm.disabled ? -1 : 0
	    }
	  }) : _vm._e()]);
	};

	var __vue_staticRenderFns__ = [];
	/* style */

	var __vue_inject_styles__ = undefined;
	/* scoped */

	var __vue_scope_id__ = undefined;
	/* module identifier */

	var __vue_module_identifier__ = undefined;
	/* functional template */

	var __vue_is_functional_template__ = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__ = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__,
	  staticRenderFns: __vue_staticRenderFns__
	}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);
	/**
	 * Media Event bus - used for communication between joomla and vue
	 */


	var Event = /*#__PURE__*/function () {
	  /**
	     * Media Event constructor
	     */
	  function Event() {
	    this.vue = new yn();
	  }
	  /**
	     * Fire an event
	     * @param event
	     * @param data
	     */


	  var _proto5 = Event.prototype;

	  _proto5.fire = function fire(event, data) {
	    if (data === void 0) {
	      data = null;
	    }

	    this.vue.$emit(event, data);
	  }
	  /**
	     * Listen to events
	     * @param event
	     * @param callback
	     */
	  ;

	  _proto5.listen = function listen(event, callback) {
	    this.vue.$on(event, callback);
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

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	var Notifications = /*#__PURE__*/function () {
	  function Notifications() {}

	  var _proto6 = Notifications.prototype;

	  /* Send and success notification */
	  // eslint-disable-next-line class-methods-use-this
	  _proto6.success = function success(message, options) {
	    // eslint-disable-next-line no-use-before-define
	    notifications.notify(message, _extends({
	      type: 'message',
	      dismiss: true
	    }, options));
	  }
	  /* Send an error notification */
	  // eslint-disable-next-line class-methods-use-this
	  ;

	  _proto6.error = function error(message, options) {
	    // eslint-disable-next-line no-use-before-define
	    notifications.notify(message, _extends({
	      type: 'error',
	      dismiss: true
	    }, options));
	  }
	  /* Ask the user a question */
	  // eslint-disable-next-line class-methods-use-this
	  ;

	  _proto6.ask = function ask(message) {
	    return window.confirm(message);
	  }
	  /* Send a notification */
	  // eslint-disable-next-line class-methods-use-this
	  ;

	  _proto6.notify = function notify(message, options) {
	    var _Joomla$renderMessage;

	    Joomla.renderMessages((_Joomla$renderMessage = {}, _Joomla$renderMessage[options.type] = [Joomla.JText._(message)], _Joomla$renderMessage));
	  };

	  return Notifications;
	}(); // eslint-disable-next-line import/no-mutable-exports,import/prefer-default-export


	var notifications = new Notifications(); //

	var script$1 = {
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
	    var _this7 = this;

	    // Listen to the toolbar events
	    MediaManager.Event.listen('onClickCreateFolder', function () {
	      return _this7.$store.commit(SHOW_CREATE_FOLDER_MODAL);
	    });
	    MediaManager.Event.listen('onClickDelete', function () {
	      if (_this7.$store.state.selectedItems.length > 0) {
	        _this7.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
	      } else {
	        notifications.error('COM_MEDIA_PLEASE_SELECT_ITEM');
	      }
	    });
	  },
	  mounted: function mounted() {
	    var _this8 = this;

	    // Set the full height and add event listener when dom is updated
	    this.$nextTick(function () {
	      _this8.setFullHeight(); // Add the global resize event listener


	      window.addEventListener('resize', _this8.setFullHeight);
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
	/* script */

	var __vue_script__$1 = script$1;
	/* template */

	var __vue_render__$1 = function __vue_render__$1() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-container"
	  }, [_c('div', {
	    staticClass: "media-sidebar col-md-2 d-none d-md-block"
	  }, _vm._l(_vm.disks, function (disk, index) {
	    return _c('media-disk', {
	      key: index,
	      attrs: {
	        "uid": index,
	        "disk": disk
	      }
	    });
	  }), 1), _vm._v(" "), _c('div', {
	    staticClass: "col-md-10"
	  }, [_c('div', {
	    staticClass: "media-main"
	  }, [_c('media-toolbar'), _vm._v(" "), _c('media-browser')], 1)]), _vm._v(" "), _c('media-upload'), _vm._v(" "), _c('media-create-folder-modal'), _vm._v(" "), _c('media-preview-modal'), _vm._v(" "), _c('media-rename-modal'), _vm._v(" "), _c('media-share-modal'), _vm._v(" "), _c('media-confirm-delete-modal')], 1);
	};

	var __vue_staticRenderFns__$1 = [];
	/* style */

	var __vue_inject_styles__$1 = undefined;
	/* scoped */

	var __vue_scope_id__$1 = undefined;
	/* module identifier */

	var __vue_module_identifier__$1 = undefined;
	/* functional template */

	var __vue_is_functional_template__$1 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$1,
	  staticRenderFns: __vue_staticRenderFns__$1
	}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined); //
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//


	var script$2 = {
	  name: 'MediaDisk',
	  // eslint-disable-next-line vue/require-prop-types
	  props: ['disk', 'uid'],
	  computed: {
	    diskId: function diskId() {
	      return "disk-" + (this.uid + 1);
	    }
	  }
	};
	/* script */

	var __vue_script__$2 = script$2;
	/* template */

	var __vue_render__$2 = function __vue_render__$2() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-disk"
	  }, [_c('h2', {
	    staticClass: "media-disk-name",
	    attrs: {
	      "id": _vm.diskId
	    }
	  }, [_vm._v("\n    " + _vm._s(_vm.disk.displayName) + "\n  ")]), _vm._v(" "), _vm._l(_vm.disk.drives, function (drive, index) {
	    return _c('media-drive', {
	      key: index,
	      attrs: {
	        "disk-id": _vm.diskId,
	        "counter": index,
	        "drive": drive,
	        "total": _vm.disk.drives.length
	      }
	    });
	  })], 2);
	};

	var __vue_staticRenderFns__$2 = [];
	/* style */

	var __vue_inject_styles__$2 = undefined;
	/* scoped */

	var __vue_scope_id__$2 = undefined;
	/* module identifier */

	var __vue_module_identifier__$2 = undefined;
	/* functional template */

	var __vue_is_functional_template__$2 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$2 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$2,
	  staticRenderFns: __vue_staticRenderFns__$2
	}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

	var navigable = {
	  methods: {
	    navigateTo: function navigateTo(path) {
	      this.$store.dispatch('getContents', path);
	    }
	  }
	}; //

	var script$3 = {
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
	/* script */

	var __vue_script__$3 = script$3;
	/* template */

	var __vue_render__$3 = function __vue_render__$3() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-drive",
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.onDriveClick();
	      }
	    }
	  }, [_c('ul', {
	    staticClass: "media-tree",
	    attrs: {
	      "role": "tree",
	      "aria-labelledby": _vm.diskId
	    }
	  }, [_c('li', {
	    class: {
	      active: _vm.isActive,
	      'media-tree-item': true,
	      'media-drive-name': true
	    },
	    attrs: {
	      "role": "treeitem",
	      "aria-level": "1",
	      "aria-setsize": _vm.counter,
	      "aria-posinset": 1,
	      "tabindex": _vm.getTabindex
	    }
	  }, [_c('a', [_c('span', {
	    staticClass: "item-name"
	  }, [_vm._v(_vm._s(_vm.drive.displayName))])]), _vm._v(" "), _c('media-tree', {
	    attrs: {
	      "root": _vm.drive.root,
	      "level": 2
	    }
	  })], 1)])]);
	};

	var __vue_staticRenderFns__$3 = [];
	/* style */

	var __vue_inject_styles__$3 = undefined;
	/* scoped */

	var __vue_scope_id__$3 = undefined;
	/* module identifier */

	var __vue_module_identifier__$3 = undefined;
	/* functional template */

	var __vue_is_functional_template__$3 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$3 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$3,
	  staticRenderFns: __vue_staticRenderFns__$3
	}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined); //
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//


	var script$4 = {
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
	      var _this9 = this;

	      return this.$store.state.directories.filter(function (directory) {
	        return directory.directory === _this9.root;
	      }) // Sort alphabetically
	      .sort(function (a, b) {
	        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
	      });
	    }
	  }
	};
	/* script */

	var __vue_script__$4 = script$4;
	/* template */

	var __vue_render__$4 = function __vue_render__$4() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('ul', {
	    staticClass: "media-tree",
	    attrs: {
	      "role": "group"
	    }
	  }, _vm._l(_vm.directories, function (item, index) {
	    return _c('media-tree-item', {
	      key: item.path,
	      attrs: {
	        "counter": index,
	        "item": item,
	        "size": _vm.directories.length,
	        "level": _vm.level
	      }
	    });
	  }), 1);
	};

	var __vue_staticRenderFns__$4 = [];
	/* style */

	var __vue_inject_styles__$4 = undefined;
	/* scoped */

	var __vue_scope_id__$4 = undefined;
	/* module identifier */

	var __vue_module_identifier__$4 = undefined;
	/* functional template */

	var __vue_is_functional_template__$4 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$4 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$4,
	  staticRenderFns: __vue_staticRenderFns__$4
	}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined); //


	var script$5 = {
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
	/* script */

	var __vue_script__$5 = script$5;
	/* template */

	var __vue_render__$5 = function __vue_render__$5() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('li', {
	    staticClass: "media-tree-item",
	    class: {
	      active: _vm.isActive
	    },
	    attrs: {
	      "role": "treeitem",
	      "aria-level": _vm.level,
	      "aria-setsize": _vm.size,
	      "aria-posinset": _vm.counter,
	      "tabindex": _vm.getTabindex
	    }
	  }, [_c('a', {
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.onItemClick();
	      }
	    }
	  }, [_c('span', {
	    staticClass: "item-icon"
	  }, [_c('span', {
	    class: _vm.iconClass
	  })]), _vm._v(" "), _c('span', {
	    staticClass: "item-name"
	  }, [_vm._v(_vm._s(_vm.item.name))])]), _vm._v(" "), _c('transition', {
	    attrs: {
	      "name": "slide-fade"
	    }
	  }, [_vm.hasChildren ? _c('media-tree', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: _vm.isOpen,
	      expression: "isOpen"
	    }],
	    attrs: {
	      "aria-expanded": _vm.isOpen ? 'true' : 'false',
	      "root": _vm.item.path,
	      "level": _vm.level + 1
	    }
	  }) : _vm._e()], 1)], 1);
	};

	var __vue_staticRenderFns__$5 = [];
	/* style */

	var __vue_inject_styles__$5 = undefined;
	/* scoped */

	var __vue_scope_id__$5 = undefined;
	/* module identifier */

	var __vue_module_identifier__$5 = undefined;
	/* functional template */

	var __vue_is_functional_template__$5 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$5 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$5,
	  staticRenderFns: __vue_staticRenderFns__$5
	}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined); //


	var script$6 = {
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
	/* script */

	var __vue_script__$6 = script$6;
	/* template */

	var __vue_render__$6 = function __vue_render__$6() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-toolbar",
	    attrs: {
	      "role": "toolbar",
	      "aria-label": _vm.translate('COM_MEDIA_TOOLBAR_LABEL')
	    }
	  }, [_vm.isLoading ? _c('div', {
	    staticClass: "media-loader"
	  }) : _vm._e(), _vm._v(" "), _c('div', {
	    staticClass: "media-view-icons"
	  }, [_c('a', {
	    staticClass: "media-toolbar-icon media-toolbar-select-all",
	    attrs: {
	      "href": "#",
	      "aria-label": _vm.translate('COM_MEDIA_SELECT_ALL')
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.toggleSelectAll();
	      }
	    }
	  }, [_c('span', {
	    class: _vm.toggleSelectAllBtnIcon,
	    attrs: {
	      "aria-hidden": "true"
	    }
	  })])]), _vm._v(" "), _c('media-breadcrumb'), _vm._v(" "), _c('div', {
	    staticClass: "media-view-search-input",
	    attrs: {
	      "role": "search"
	    }
	  }, [_c('label', {
	    staticClass: "visually-hidden",
	    attrs: {
	      "for": "media_search"
	    }
	  }, [_vm._v(_vm._s(_vm.translate('COM_MEDIA_SEARCH')))]), _vm._v(" "), _c('input', {
	    attrs: {
	      "id": "media_search",
	      "type": "text",
	      "placeholder": _vm.translate('COM_MEDIA_SEARCH')
	    },
	    on: {
	      "input": _vm.changeSearch
	    }
	  })]), _vm._v(" "), _c('div', {
	    staticClass: "media-view-icons"
	  }, [_vm.isGridView ? _c('button', {
	    staticClass: "media-toolbar-icon media-toolbar-decrease-grid-size",
	    class: {
	      disabled: _vm.isGridSize('sm')
	    },
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_DECREASE_GRID')
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.decreaseGridSize();
	      }
	    }
	  }, [_c('span', {
	    staticClass: "icon-search-minus",
	    attrs: {
	      "aria-hidden": "true"
	    }
	  })]) : _vm._e(), _vm._v(" "), _vm.isGridView ? _c('button', {
	    staticClass: "media-toolbar-icon media-toolbar-increase-grid-size",
	    class: {
	      disabled: _vm.isGridSize('xl')
	    },
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_INCREASE_GRID')
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.increaseGridSize();
	      }
	    }
	  }, [_c('span', {
	    staticClass: "icon-search-plus",
	    attrs: {
	      "aria-hidden": "true"
	    }
	  })]) : _vm._e(), _vm._v(" "), _c('button', {
	    staticClass: "media-toolbar-icon media-toolbar-list-view",
	    attrs: {
	      "type": "button",
	      "href": "#",
	      "aria-label": _vm.translate('COM_MEDIA_TOGGLE_LIST_VIEW')
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.changeListView();
	      }
	    }
	  }, [_c('span', {
	    class: _vm.toggleListViewBtnIcon,
	    attrs: {
	      "aria-hidden": "true"
	    }
	  })]), _vm._v(" "), _c('button', {
	    staticClass: "media-toolbar-icon media-toolbar-info",
	    attrs: {
	      "type": "button",
	      "href": "#",
	      "aria-label": _vm.translate('COM_MEDIA_TOGGLE_INFO')
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.toggleInfoBar($event);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "icon-info",
	    attrs: {
	      "aria-hidden": "true"
	    }
	  })])])], 1);
	};

	var __vue_staticRenderFns__$6 = [];
	/* style */

	var __vue_inject_styles__$6 = undefined;
	/* scoped */

	var __vue_scope_id__$6 = undefined;
	/* module identifier */

	var __vue_module_identifier__$6 = undefined;
	/* functional template */

	var __vue_is_functional_template__$6 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$6 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$6,
	  staticRenderFns: __vue_staticRenderFns__$6
	}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined); //


	var script$7 = {
	  name: 'MediaBreadcrumb',
	  mixins: [navigable],
	  computed: {
	    /* Get the crumbs from the current directory path */
	    crumbs: function crumbs() {
	      var _this10 = this;

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
	          path: _this10.$store.state.selectedDirectory.split(crumb)[0] + crumb
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
	/* script */

	var __vue_script__$7 = script$7;
	/* template */

	var __vue_render__$7 = function __vue_render__$7() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('nav', {
	    staticClass: "media-breadcrumb",
	    attrs: {
	      "role": "navigation",
	      "aria-label": _vm.translate('COM_MEDIA_BREADCRUMB_LABEL')
	    }
	  }, [_c('ol', _vm._l(_vm.crumbs, function (val, index) {
	    return _c('li', {
	      key: index,
	      staticClass: "media-breadcrumb-item"
	    }, [_c('a', {
	      attrs: {
	        "href": "#",
	        "aria-current": index === Object.keys(_vm.crumbs).length - 1 ? 'page' : undefined
	      },
	      on: {
	        "click": function click($event) {
	          $event.stopPropagation();
	          $event.preventDefault();
	          return _vm.onCrumbClick(val);
	        }
	      }
	    }, [_vm._v(_vm._s(val.name))])]);
	  }), 0)]);
	};

	var __vue_staticRenderFns__$7 = [];
	/* style */

	var __vue_inject_styles__$7 = undefined;
	/* scoped */

	var __vue_scope_id__$7 = undefined;
	/* module identifier */

	var __vue_module_identifier__$7 = undefined;
	/* functional template */

	var __vue_is_functional_template__$7 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$7 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$7,
	  staticRenderFns: __vue_staticRenderFns__$7
	}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined); //


	var script$8 = {
	  name: 'MediaBrowser',
	  computed: {
	    /* Get the contents of the currently selected directory */
	    items: function items() {
	      var _this11 = this;

	      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
	      var directories = this.$store.getters.getSelectedDirectoryDirectories // Sort by type and alphabetically
	      .sort(function (a, b) {
	        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
	      }).filter(function (dir) {
	        return dir.name.toLowerCase().includes(_this11.$store.state.search.toLowerCase());
	      }); // eslint-disable-next-line vue/no-side-effects-in-computed-properties

	      var files = this.$store.getters.getSelectedDirectoryFiles // Sort by type and alphabetically
	      .sort(function (a, b) {
	        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
	      }).filter(function (file) {
	        return file.name.toLowerCase().includes(_this11.$store.state.search.toLowerCase());
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
	      var _ref10;

	      return _ref10 = {}, _ref10["media-browser-items-" + this.$store.state.gridSize] = true, _ref10;
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
	      var _this12 = this;

	      // Create a new file reader instance
	      var reader = new FileReader(); // Add the on load callback

	      reader.onload = function (progressEvent) {
	        var result = progressEvent.target.result;
	        var splitIndex = result.indexOf('base64') + 7;
	        var content = result.slice(splitIndex, result.length); // Upload the file

	        _this12.$store.dispatch('uploadFile', {
	          name: file.name,
	          parent: _this12.$store.state.selectedDirectory,
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
	        for (var _i14 = 0, _f2; _f2 = e.dataTransfer.files[_i14]; _i14++) {
	          document.querySelector('.media-dragoutline').classList.remove('active');
	          this.upload(_f2);
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
	/* script */

	var __vue_script__$8 = script$8;
	/* template */

	var __vue_render__$8 = function __vue_render__$8() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', [_c('div', {
	    ref: "browserItems",
	    staticClass: "media-browser",
	    style: _vm.mediaBrowserStyles,
	    on: {
	      "dragenter": _vm.onDragEnter,
	      "drop": _vm.onDrop,
	      "dragover": _vm.onDragOver,
	      "dragleave": _vm.onDragLeave
	    }
	  }, [_c('div', {
	    staticClass: "media-dragoutline"
	  }, [_c('span', {
	    staticClass: "icon-cloud-upload upload-icon",
	    attrs: {
	      "aria-hidden": "true"
	    }
	  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_DROP_FILE')))])]), _vm._v(" "), _vm.listView === 'table' ? _c('table', {
	    staticClass: "table media-browser-table"
	  }, [_c('caption', {
	    staticClass: "visually-hidden"
	  }, [_vm._v("\n        " + _vm._s(_vm.sprintf('COM_MEDIA_BROWSER_TABLE_CAPTION', _vm.currentDirectory)) + "\n      ")]), _vm._v(" "), _c('thead', {
	    staticClass: "media-browser-table-head"
	  }, [_c('tr', [_c('th', {
	    staticClass: "type",
	    attrs: {
	      "scope": "col"
	    }
	  }), _vm._v(" "), _c('th', {
	    staticClass: "name",
	    attrs: {
	      "scope": "col"
	    }
	  }, [_vm._v("\n            " + _vm._s(_vm.translate('COM_MEDIA_MEDIA_NAME')) + "\n          ")]), _vm._v(" "), _c('th', {
	    staticClass: "size",
	    attrs: {
	      "scope": "col"
	    }
	  }, [_vm._v("\n            " + _vm._s(_vm.translate('COM_MEDIA_MEDIA_SIZE')) + "\n          ")]), _vm._v(" "), _c('th', {
	    staticClass: "dimension",
	    attrs: {
	      "scope": "col"
	    }
	  }, [_vm._v("\n            " + _vm._s(_vm.translate('COM_MEDIA_MEDIA_DIMENSION')) + "\n          ")]), _vm._v(" "), _c('th', {
	    staticClass: "created",
	    attrs: {
	      "scope": "col"
	    }
	  }, [_vm._v("\n            " + _vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_CREATED')) + "\n          ")]), _vm._v(" "), _c('th', {
	    staticClass: "modified",
	    attrs: {
	      "scope": "col"
	    }
	  }, [_vm._v("\n            " + _vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')) + "\n          ")])])]), _vm._v(" "), _c('tbody', _vm._l(_vm.items, function (item) {
	    return _c('media-browser-item-row', {
	      key: item.path,
	      attrs: {
	        "item": item
	      }
	    });
	  }), 1)]) : _vm.listView === 'grid' ? _c('div', {
	    staticClass: "media-browser-grid"
	  }, [_c('div', {
	    staticClass: "media-browser-items",
	    class: _vm.mediaBrowserGridItemsClass
	  }, _vm._l(_vm.items, function (item) {
	    return _c('media-browser-item', {
	      key: item.path,
	      attrs: {
	        "item": item
	      }
	    });
	  }), 1)]) : _vm._e()]), _vm._v(" "), _c('media-infobar', {
	    ref: "infobar"
	  })], 1);
	};

	var __vue_staticRenderFns__$8 = [];
	/* style */

	var __vue_inject_styles__$8 = undefined;
	/* scoped */

	var __vue_scope_id__$8 = undefined;
	/* module identifier */

	var __vue_module_identifier__$8 = undefined;
	/* functional template */

	var __vue_is_functional_template__$8 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$8 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$8,
	  staticRenderFns: __vue_staticRenderFns__$8
	}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined); //


	var script$9 = {
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
	      var _this13 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this13.$refs.actionRename.focus();
	      });
	    },

	    /* Open actions dropdown and focus on last element */
	    openLastActions: function openLastActions() {
	      var _this14 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this14.$refs.actionDelete.focus();
	      });
	    },

	    /* Hide actions dropdown */
	    hideActions: function hideActions() {
	      var _this15 = this;

	      this.showActions = false; // eslint-disable-next-line no-unused-expressions

	      this.$nextTick(function () {
	        _this15.$refs.actionToggle ? _this15.$refs.actionToggle.focus() : false;
	      });
	    }
	  }
	};
	/* script */

	var __vue_script__$9 = script$9;
	/* template */

	var __vue_render__$9 = function __vue_render__$9() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-browser-item-directory",
	    on: {
	      "mouseleave": function mouseleave($event) {
	        return _vm.hideActions();
	      }
	    }
	  }, [_c('div', {
	    staticClass: "media-browser-item-preview",
	    on: {
	      "dblclick": function dblclick($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.onPreviewDblClick();
	      }
	    }
	  }, [_vm._m(0)]), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-item-info"
	  }, [_vm._v("\n    " + _vm._s(_vm.item.name) + "\n  ")]), _vm._v(" "), _c('span', {
	    staticClass: "media-browser-select",
	    attrs: {
	      "aria-label": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
	      "title": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
	    }
	  }), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-actions",
	    class: {
	      'active': _vm.showActions
	    }
	  }, [_c('button', {
	    ref: "actionToggle",
	    staticClass: "action-toggle",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
	      "title": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.openLastActions();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-ellipsis-h",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openActions();
	      }
	    }
	  })]), _vm._v(" "), _vm.showActions ? _c('div', {
	    staticClass: "media-browser-actions-list"
	  }, [_c('ul', [_c('li', [_c('button', {
	    ref: "actionRename",
	    staticClass: "action-rename",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_RENAME'),
	      "title": _vm.translate('COM_MEDIA_ACTION_RENAME')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-text-width",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openRenameModal();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionDelete",
	    staticClass: "action-delete",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DELETE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DELETE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-trash",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openConfirmDeleteModal();
	      }
	    }
	  })])])])]) : _vm._e()])]);
	};

	var __vue_staticRenderFns__$9 = [function () {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "file-background"
	  }, [_c('div', {
	    staticClass: "folder-icon"
	  }, [_c('span', {
	    staticClass: "icon-folder"
	  })])]);
	}];
	/* style */

	var __vue_inject_styles__$9 = undefined;
	/* scoped */

	var __vue_scope_id__$9 = undefined;
	/* module identifier */

	var __vue_module_identifier__$9 = undefined;
	/* functional template */

	var __vue_is_functional_template__$9 = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$9 = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$9,
	  staticRenderFns: __vue_staticRenderFns__$9
	}, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, false, undefined, undefined, undefined); //


	var script$a = {
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
	      var _this16 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this16.$refs.actionDownload.focus();
	      });
	    },

	    /* Open actions dropdown and focus on last element */
	    openLastActions: function openLastActions() {
	      var _this17 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this17.$refs.actionDelete.focus();
	      });
	    },

	    /* Hide actions dropdown */
	    hideActions: function hideActions() {
	      var _this18 = this;

	      this.showActions = false;
	      this.$nextTick(function () {
	        return _this18.$refs.actionToggle.focus();
	      });
	    }
	  }
	};
	/* script */

	var __vue_script__$a = script$a;
	/* template */

	var __vue_render__$a = function __vue_render__$a() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-browser-item-file",
	    on: {
	      "mouseleave": function mouseleave($event) {
	        return _vm.hideActions();
	      }
	    }
	  }, [_vm._m(0), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-item-info"
	  }, [_vm._v("\n    " + _vm._s(_vm.item.name) + " " + _vm._s(_vm.item.filetype) + "\n  ")]), _vm._v(" "), _c('span', {
	    staticClass: "media-browser-select",
	    attrs: {
	      "aria-label": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
	      "title": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
	    }
	  }), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-actions",
	    class: {
	      'active': _vm.showActions
	    }
	  }, [_c('button', {
	    ref: "actionToggle",
	    staticClass: "action-toggle",
	    attrs: {
	      "href": "#",
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
	      "title": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.openLastActions();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-ellipsis-h",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openActions();
	      }
	    }
	  })]), _vm._v(" "), _vm.showActions ? _c('div', {
	    staticClass: "media-browser-actions-list"
	  }, [_c('ul', [_c('li', [_c('button', {
	    ref: "actionDownload",
	    staticClass: "action-download",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DOWNLOAD'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DOWNLOAD')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.download();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.download();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }]
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-download",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.download();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionRename",
	    staticClass: "action-rename",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_RENAME'),
	      "title": _vm.translate('COM_MEDIA_ACTION_RENAME')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDownload.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionUrl.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-text-width",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openRenameModal();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionUrl",
	    staticClass: "action-url",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_SHARE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_SHARE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openShareUrlModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openShareUrlModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-link",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openShareUrlModal();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionDelete",
	    staticClass: "action-delete",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DELETE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DELETE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionUrl.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDownload.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-trash",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openConfirmDeleteModal();
	      }
	    }
	  })])])])]) : _vm._e()])]);
	};

	var __vue_staticRenderFns__$a = [function () {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-browser-item-preview"
	  }, [_c('div', {
	    staticClass: "file-background"
	  }, [_c('div', {
	    staticClass: "file-icon"
	  }, [_c('span', {
	    staticClass: "icon-file-alt"
	  })])])]);
	}];
	/* style */

	var __vue_inject_styles__$a = undefined;
	/* scoped */

	var __vue_scope_id__$a = undefined;
	/* module identifier */

	var __vue_module_identifier__$a = undefined;
	/* functional template */

	var __vue_is_functional_template__$a = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$a = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$a,
	  staticRenderFns: __vue_staticRenderFns__$a
	}, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, false, undefined, undefined, undefined); //


	var script$b = {
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
	      var _this19 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this19.$refs.actionPreview.focus();
	      });
	    },

	    /* Open actions dropdown and focus on last element */
	    openLastActions: function openLastActions() {
	      var _this20 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this20.$refs.actionDelete.focus();
	      });
	    },

	    /* Hide actions dropdown */
	    hideActions: function hideActions() {
	      var _this21 = this;

	      this.showActions = false;
	      this.$nextTick(function () {
	        return _this21.$refs.actionToggle.focus();
	      });
	    }
	  }
	};
	/* script */

	var __vue_script__$b = script$b;
	/* template */

	var __vue_render__$b = function __vue_render__$b() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-browser-image",
	    on: {
	      "dblclick": function dblclick($event) {
	        return _vm.openPreview();
	      },
	      "mouseleave": function mouseleave($event) {
	        return _vm.hideActions();
	      }
	    }
	  }, [_c('div', {
	    staticClass: "media-browser-item-preview"
	  }, [_c('div', {
	    staticClass: "image-background"
	  }, [_c('div', {
	    staticClass: "image-cropped",
	    style: {
	      backgroundImage: 'url(' + _vm.thumbUrl + ')'
	    }
	  })])]), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-item-info"
	  }, [_vm._v("\n    " + _vm._s(_vm.item.name) + " " + _vm._s(_vm.item.filetype) + "\n  ")]), _vm._v(" "), _c('span', {
	    staticClass: "media-browser-select",
	    attrs: {
	      "aria-label": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
	      "title": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
	    }
	  }), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-actions",
	    class: {
	      'active': _vm.showActions
	    }
	  }, [_c('button', {
	    ref: "actionToggle",
	    staticClass: "action-toggle",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
	      "title": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.openLastActions();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-ellipsis-h",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openActions();
	      }
	    }
	  })]), _vm._v(" "), _vm.showActions ? _c('div', {
	    staticClass: "media-browser-actions-list"
	  }, [_c('ul', [_c('li', [_c('button', {
	    ref: "actionPreview",
	    staticClass: "action-preview",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_PREVIEW'),
	      "title": _vm.translate('COM_MEDIA_ACTION_PREVIEW')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openPreview();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openPreview();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDownload.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-search-plus",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openPreview();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionDownload",
	    staticClass: "action-download",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DOWNLOAD'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DOWNLOAD')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.download();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.download();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionPreview.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-download",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.download();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionRename",
	    staticClass: "action-rename",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_RENAME'),
	      "title": _vm.translate('COM_MEDIA_ACTION_RENAME')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDownload.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        _vm.canEdit ? _vm.$refs.actionEdit.focus() : _vm.$refs.actionShare.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-text-width",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openRenameModal();
	      }
	    }
	  })])]), _vm._v(" "), _vm.canEdit ? _c('li', [_c('button', {
	    ref: "actionEdit",
	    staticClass: "action-edit",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_EDIT'),
	      "title": _vm.translate('COM_MEDIA_ACTION_EDIT')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.editItem();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.editItem();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionShare.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-pencil-alt",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.editItem();
	      }
	    }
	  })])]) : _vm._e(), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionShare",
	    staticClass: "action-url",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_SHARE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_SHARE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openShareUrlModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openShareUrlModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        _vm.canEdit ? _vm.$refs.actionEdit.focus() : _vm.$refs.actionRename.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-link",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openShareUrlModal();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionDelete",
	    staticClass: "action-delete",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DELETE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DELETE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionShare.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionPreview.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-trash",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openConfirmDeleteModal();
	      }
	    }
	  })])])])]) : _vm._e()])]);
	};

	var __vue_staticRenderFns__$b = [];
	/* style */

	var __vue_inject_styles__$b = undefined;
	/* scoped */

	var __vue_scope_id__$b = undefined;
	/* module identifier */

	var __vue_module_identifier__$b = undefined;
	/* functional template */

	var __vue_is_functional_template__$b = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$b = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$b,
	  staticRenderFns: __vue_staticRenderFns__$b
	}, __vue_inject_styles__$b, __vue_script__$b, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$b, false, undefined, undefined, undefined); //


	var script$c = {
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
	      var _this22 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this22.$refs.actionPreview.focus();
	      });
	    },

	    /* Open actions dropdown and focus on last element */
	    openLastActions: function openLastActions() {
	      var _this23 = this;

	      this.showActions = true;
	      this.$nextTick(function () {
	        return _this23.$refs.actionDelete.focus();
	      });
	    },

	    /* Hide actions dropdown */
	    hideActions: function hideActions() {
	      var _this24 = this;

	      this.showActions = false;
	      this.$nextTick(function () {
	        return _this24.$refs.actionToggle.focus();
	      });
	    }
	  }
	};
	/* script */

	var __vue_script__$c = script$c;
	/* template */

	var __vue_render__$c = function __vue_render__$c() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-browser-image",
	    on: {
	      "dblclick": function dblclick($event) {
	        return _vm.openPreview();
	      },
	      "mouseleave": function mouseleave($event) {
	        return _vm.hideActions();
	      }
	    }
	  }, [_vm._m(0), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-item-info"
	  }, [_vm._v("\n    " + _vm._s(_vm.item.name) + " " + _vm._s(_vm.item.filetype) + "\n  ")]), _vm._v(" "), _c('span', {
	    staticClass: "media-browser-select",
	    attrs: {
	      "aria-label": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
	      "title": _vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
	    }
	  }), _vm._v(" "), _c('div', {
	    staticClass: "media-browser-actions",
	    class: {
	      'active': _vm.showActions
	    }
	  }, [_c('button', {
	    ref: "actionToggle",
	    staticClass: "action-toggle",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
	      "title": _vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.openActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.openLastActions();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-ellipsis-h",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openActions();
	      }
	    }
	  })]), _vm._v(" "), _vm.showActions ? _c('div', {
	    staticClass: "media-browser-actions-list"
	  }, [_c('ul', [_c('li', [_c('button', {
	    ref: "actionPreview",
	    staticClass: "action-preview",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_PREVIEW'),
	      "title": _vm.translate('COM_MEDIA_ACTION_PREVIEW')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openPreview();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openPreview();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDownload.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-search-plus",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openPreview();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionDownload",
	    staticClass: "action-download",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DOWNLOAD'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DOWNLOAD')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.download();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.download();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionPreview.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-download",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.download();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionRename",
	    staticClass: "action-rename",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_RENAME'),
	      "title": _vm.translate('COM_MEDIA_ACTION_RENAME')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openRenameModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionDownload.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionShare.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-text-width",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openRenameModal();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionShare",
	    staticClass: "action-url",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_SHARE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_SHARE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openShareUrlModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openShareUrlModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionRename.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionDelete.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-link",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openShareUrlModal();
	      }
	    }
	  })])]), _vm._v(" "), _c('li', [_c('button', {
	    ref: "actionDelete",
	    staticClass: "action-delete",
	    attrs: {
	      "type": "button",
	      "aria-label": _vm.translate('COM_MEDIA_ACTION_DELETE'),
	      "title": _vm.translate('COM_MEDIA_ACTION_DELETE')
	    },
	    on: {
	      "keyup": [function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) {
	          return null;
	        }

	        return _vm.openConfirmDeleteModal();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
	          return null;
	        }

	        return _vm.hideActions();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
	          return null;
	        }

	        return _vm.$refs.actionShare.focus();
	      }, function ($event) {
	        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
	          return null;
	        }

	        return _vm.$refs.actionPreview.focus();
	      }],
	      "focus": function focus($event) {
	        return _vm.focused(true);
	      },
	      "blur": function blur($event) {
	        return _vm.focused(false);
	      }
	    }
	  }, [_c('span', {
	    staticClass: "image-browser-action icon-trash",
	    attrs: {
	      "aria-hidden": "true"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	        return _vm.openConfirmDeleteModal();
	      }
	    }
	  })])])])]) : _vm._e()])]);
	};

	var __vue_staticRenderFns__$c = [function () {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-browser-item-preview"
	  }, [_c('div', {
	    staticClass: "file-background"
	  }, [_c('div', {
	    staticClass: "file-icon"
	  }, [_c('span', {
	    staticClass: "icon-file-alt"
	  })])])]);
	}];
	/* style */

	var __vue_inject_styles__$c = undefined;
	/* scoped */

	var __vue_scope_id__$c = undefined;
	/* module identifier */

	var __vue_module_identifier__$c = undefined;
	/* functional template */

	var __vue_is_functional_template__$c = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$c = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$c,
	  staticRenderFns: __vue_staticRenderFns__$c
	}, __vue_inject_styles__$c, __vue_script__$c, __vue_scope_id__$c, __vue_is_functional_template__$c, __vue_module_identifier__$c, false, undefined, undefined, undefined);

	var dirname = function dirname(path) {
	  if (typeof path !== 'string') {
	    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
	  }

	  if (path.length === 0) return '.';
	  var code = path.charCodeAt(0);
	  var hasRoot = code === 47;
	  var end = -1;
	  var matchedSlash = true;

	  for (var i = path.length - 1; i >= 1; --i) {
	    code = path.charCodeAt(i);

	    if (code === 47) {
	      if (!matchedSlash) {
	        end = i;
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


	  var _proto7 = Api.prototype;

	  _proto7.getContents = function getContents(dir, full, content) {
	    var _this25 = this;

	    // Wrap the ajax call into a real promise
	    return new Promise(function (resolve, reject) {
	      // Do a check on full
	      if (['0', '1'].indexOf(full) !== -1) {
	        throw Error('Invalid parameter: full');
	      } // Do a check on download


	      if (['0', '1'].indexOf(content) !== -1) {
	        throw Error('Invalid parameter: content');
	      } // eslint-disable-next-line no-underscore-dangle


	      var url = _this25._baseUrl + "&task=api.files&path=" + dir;

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
	          resolve(_this25._normalizeArray(JSON.parse(response).data));
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

	  _proto7.createDirectory = function createDirectory(name, parent) {
	    var _this26 = this;

	    // Wrap the ajax call into a real promise
	    return new Promise(function (resolve, reject) {
	      var _data;

	      // eslint-disable-next-line no-underscore-dangle
	      var url = _this26._baseUrl + "&task=api.files&path=" + parent; // eslint-disable-next-line no-underscore-dangle

	      var data = (_data = {}, _data[_this26._csrfToken] = '1', _data.name = name, _data);
	      Joomla.request({
	        url: url,
	        method: 'POST',
	        data: JSON.stringify(data),
	        headers: {
	          'Content-Type': 'application/json'
	        },
	        onSuccess: function onSuccess(response) {
	          notifications.success('COM_MEDIA_CREATE_NEW_FOLDER_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

	          resolve(_this26._normalizeItem(JSON.parse(response).data));
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

	  _proto7.upload = function upload(name, parent, content, override) {
	    var _this27 = this;

	    // Wrap the ajax call into a real promise
	    return new Promise(function (resolve, reject) {
	      var _data2;

	      // eslint-disable-next-line no-underscore-dangle
	      var url = _this27._baseUrl + "&task=api.files&path=" + parent;
	      var data = (_data2 = {}, _data2[_this27._csrfToken] = '1', _data2.name = name, _data2.content = content, _data2); // Append override

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

	          resolve(_this27._normalizeItem(JSON.parse(response).data));
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

	  _proto7.rename = function rename(path, newPath) {
	    var _this28 = this;

	    // Wrap the ajax call into a real promise
	    return new Promise(function (resolve, reject) {
	      var _data3;

	      // eslint-disable-next-line no-underscore-dangle
	      var url = _this28._baseUrl + "&task=api.files&path=" + path;
	      var data = (_data3 = {}, _data3[_this28._csrfToken] = '1', _data3.newPath = newPath, _data3);
	      Joomla.request({
	        url: url,
	        method: 'PUT',
	        data: JSON.stringify(data),
	        headers: {
	          'Content-Type': 'application/json'
	        },
	        onSuccess: function onSuccess(response) {
	          notifications.success('COM_MEDIA_RENAME_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

	          resolve(_this28._normalizeItem(JSON.parse(response).data));
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

	  _proto7.delete = function _delete(path) {
	    var _this29 = this;

	    // Wrap the ajax call into a real promise
	    return new Promise(function (resolve, reject) {
	      var _data4;

	      // eslint-disable-next-line no-underscore-dangle
	      var url = _this29._baseUrl + "&task=api.files&path=" + path; // eslint-disable-next-line no-underscore-dangle

	      var data = (_data4 = {}, _data4[_this29._csrfToken] = '1', _data4);
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

	  _proto7._normalizeItem = function _normalizeItem(item) {
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

	  _proto7._normalizeArray = function _normalizeArray(data) {
	    var _this30 = this;

	    var directories = data.filter(function (item) {
	      return item.type === 'dir';
	    }) // eslint-disable-next-line no-underscore-dangle
	    .map(function (directory) {
	      return _this30._normalizeItem(directory);
	    });
	    var files = data.filter(function (item) {
	      return item.type === 'file';
	    }) // eslint-disable-next-line no-underscore-dangle
	    .map(function (file) {
	      return _this30._normalizeItem(file);
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

	  _proto7._handleError = function _handleError(error) {
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

	      if (this.item.type === 'dir') return __vue_component__$9; // Render image items

	      if (this.item.extension && imageExtensions.includes(this.item.extension.toLowerCase())) {
	        return __vue_component__$b;
	      } // Render video items


	      if (this.item.extension && !videoExtensions.includes(this.item.extension.toLowerCase())) {
	        return __vue_component__$c;
	      } // Default to file type


	      return __vue_component__$a;
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
	      var _this31 = this;

	      return this.$store.state.selectedItems.some(function (selected) {
	        return selected.path === _this31.item.path;
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
	  render: function render(createElement) {
	    return createElement('div', {
	      class: {
	        'media-browser-item': true,
	        selected: this.isSelected(),
	        active: this.isHoverActive()
	      },
	      on: {
	        click: this.handleClick,
	        mouseover: this.mouseover,
	        mouseleave: this.mouseleave,
	        focused: this.focused
	      }
	    }, [createElement(this.itemType(), {
	      props: {
	        item: this.item,
	        focused: this.focused
	      }
	    })]);
	  }
	}; //

	var script$d = {
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
	      var _this32 = this;

	      return this.$store.state.selectedItems.some(function (selected) {
	        return selected.path === _this32.item.path;
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
	/* script */

	var __vue_script__$d = script$d;
	/* template */

	var __vue_render__$d = function __vue_render__$d() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('tr', {
	    staticClass: "media-browser-item",
	    class: {
	      selected: _vm.selected
	    },
	    on: {
	      "dblclick": function dblclick($event) {
	        $event.stopPropagation();
	        $event.preventDefault();
	        return _vm.onDblClick();
	      },
	      "click": _vm.onClick
	    }
	  }, [_c('td', {
	    staticClass: "type",
	    attrs: {
	      "data-type": _vm.item.extension
	    }
	  }), _vm._v(" "), _c('th', {
	    staticClass: "name",
	    attrs: {
	      "scope": "row"
	    }
	  }, [_vm._v("\n    " + _vm._s(_vm.item.name) + "\n  ")]), _vm._v(" "), _c('td', {
	    staticClass: "size"
	  }, [_vm._v("\n    " + _vm._s(_vm.size) + "\n  ")]), _vm._v(" "), _c('td', {
	    staticClass: "dimension"
	  }, [_vm._v("\n    " + _vm._s(_vm.dimension) + "\n  ")]), _vm._v(" "), _c('td', {
	    staticClass: "created"
	  }, [_vm._v("\n    " + _vm._s(_vm.item.create_date_formatted) + "\n  ")]), _vm._v(" "), _c('td', {
	    staticClass: "modified"
	  }, [_vm._v("\n    " + _vm._s(_vm.item.modified_date_formatted) + "\n  ")])]);
	};

	var __vue_staticRenderFns__$d = [];
	/* style */

	var __vue_inject_styles__$d = undefined;
	/* scoped */

	var __vue_scope_id__$d = undefined;
	/* module identifier */

	var __vue_module_identifier__$d = undefined;
	/* functional template */

	var __vue_is_functional_template__$d = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$d = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$d,
	  staticRenderFns: __vue_staticRenderFns__$d
	}, __vue_inject_styles__$d, __vue_script__$d, __vue_scope_id__$d, __vue_is_functional_template__$d, __vue_module_identifier__$d, false, undefined, undefined, undefined); //
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//


	var script$e = {
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
	/* script */

	var __vue_script__$e = script$e;
	/* template */

	var __vue_render__$e = function __vue_render__$e() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('div', {
	    staticClass: "media-modal-backdrop",
	    on: {
	      "click": function click($event) {
	        return _vm.close();
	      }
	    }
	  }, [_c('div', {
	    staticClass: "modal",
	    staticStyle: {
	      "display": "flex"
	    },
	    on: {
	      "click": function click($event) {
	        $event.stopPropagation();
	      }
	    }
	  }, [_c('tab-lock', [_c('div', {
	    staticClass: "modal-dialog",
	    class: _vm.modalClass,
	    attrs: {
	      "role": "dialog",
	      "aria-labelledby": _vm.labelElement
	    }
	  }, [_c('div', {
	    staticClass: "modal-content"
	  }, [_c('div', {
	    staticClass: "modal-header"
	  }, [_vm._t("header"), _vm._v(" "), _vm._t("backdrop-close"), _vm._v(" "), _vm.showClose ? _c('button', {
	    staticClass: "btn-close",
	    attrs: {
	      "type": "button",
	      "aria-label": "Close"
	    },
	    on: {
	      "click": function click($event) {
	        return _vm.close();
	      }
	    }
	  }) : _vm._e()], 2), _vm._v(" "), _c('div', {
	    staticClass: "modal-body"
	  }, [_vm._t("body")], 2), _vm._v(" "), _c('div', {
	    staticClass: "modal-footer"
	  }, [_vm._t("footer")], 2)])])])], 1)]);
	};

	var __vue_staticRenderFns__$e = [];
	/* style */

	var __vue_inject_styles__$e = undefined;
	/* scoped */

	var __vue_scope_id__$e = undefined;
	/* module identifier */

	var __vue_module_identifier__$e = undefined;
	/* functional template */

	var __vue_is_functional_template__$e = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$e = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$e,
	  staticRenderFns: __vue_staticRenderFns__$e
	}, __vue_inject_styles__$e, __vue_script__$e, __vue_scope_id__$e, __vue_is_functional_template__$e, __vue_module_identifier__$e, false, undefined, undefined, undefined); //


	var script$f = {
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
	/* script */

	var __vue_script__$f = script$f;
	/* template */

	var __vue_render__$f = function __vue_render__$f() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _vm.$store.state.showCreateFolderModal ? _c('media-modal', {
	    attrs: {
	      "size": 'md',
	      "label-element": "createFolderTitle"
	    },
	    on: {
	      "close": function close($event) {
	        return _vm.close();
	      }
	    },
	    scopedSlots: _vm._u([{
	      key: "header",
	      fn: function fn() {
	        return [_c('h3', {
	          staticClass: "modal-title",
	          attrs: {
	            "id": "createFolderTitle"
	          }
	        }, [_vm._v("\n      " + _vm._s(_vm.translate('COM_MEDIA_CREATE_NEW_FOLDER')) + "\n    ")])];
	      },
	      proxy: true
	    }, {
	      key: "body",
	      fn: function fn() {
	        return [_c('div', [_c('form', {
	          staticClass: "form",
	          attrs: {
	            "novalidate": ""
	          },
	          on: {
	            "submit": function submit($event) {
	              $event.preventDefault();
	              return _vm.save($event);
	            }
	          }
	        }, [_c('div', {
	          staticClass: "form-group"
	        }, [_c('label', {
	          attrs: {
	            "for": "folder"
	          }
	        }, [_vm._v(_vm._s(_vm.translate('COM_MEDIA_FOLDER_NAME')))]), _vm._v(" "), _c('input', {
	          directives: [{
	            name: "model",
	            rawName: "v-model.trim",
	            value: _vm.folder,
	            expression: "folder",
	            modifiers: {
	              "trim": true
	            }
	          }],
	          staticClass: "form-control",
	          attrs: {
	            "id": "folder",
	            "type": "text",
	            "required": "",
	            "autocomplete": "off"
	          },
	          domProps: {
	            "value": _vm.folder
	          },
	          on: {
	            "input": [function ($event) {
	              if ($event.target.composing) {
	                return;
	              }

	              _vm.folder = $event.target.value.trim();
	            }, function ($event) {
	              _vm.folder = $event.target.value;
	            }],
	            "blur": function blur($event) {
	              return _vm.$forceUpdate();
	            }
	          }
	        })])])])];
	      },
	      proxy: true
	    }, {
	      key: "footer",
	      fn: function fn() {
	        return [_c('div', [_c('button', {
	          staticClass: "btn btn-secondary",
	          on: {
	            "click": function click($event) {
	              return _vm.close();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JCANCEL')) + "\n      ")]), _vm._v(" "), _c('button', {
	          staticClass: "btn btn-success",
	          attrs: {
	            "disabled": !_vm.isValid()
	          },
	          on: {
	            "click": function click($event) {
	              return _vm.save();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JACTION_CREATE')) + "\n      ")])])];
	      },
	      proxy: true
	    }], null, false, 878963060)
	  }) : _vm._e();
	};

	var __vue_staticRenderFns__$f = [];
	/* style */

	var __vue_inject_styles__$f = undefined;
	/* scoped */

	var __vue_scope_id__$f = undefined;
	/* module identifier */

	var __vue_module_identifier__$f = undefined;
	/* functional template */

	var __vue_is_functional_template__$f = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$f = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$f,
	  staticRenderFns: __vue_staticRenderFns__$f
	}, __vue_inject_styles__$f, __vue_script__$f, __vue_scope_id__$f, __vue_is_functional_template__$f, __vue_module_identifier__$f, false, undefined, undefined, undefined); //


	var script$g = {
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
	/* script */

	var __vue_script__$g = script$g;
	/* template */

	var __vue_render__$g = function __vue_render__$g() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _vm.$store.state.showPreviewModal && _vm.item ? _c('media-modal', {
	    staticClass: "media-preview-modal",
	    attrs: {
	      "size": 'md',
	      "label-element": "previewTitle",
	      "show-close": false
	    },
	    on: {
	      "close": function close($event) {
	        return _vm.close();
	      }
	    },
	    scopedSlots: _vm._u([{
	      key: "header",
	      fn: function fn() {
	        return [_c('h3', {
	          staticClass: "modal-title",
	          attrs: {
	            "id": "previewTitle"
	          }
	        }, [_vm._v("\n      " + _vm._s(_vm.item.name) + "\n    ")])];
	      },
	      proxy: true
	    }, {
	      key: "body",
	      fn: function fn() {
	        return [_c('div', {
	          staticClass: "image-background"
	        }, [_vm.isImage() ? _c('img', {
	          attrs: {
	            "src": _vm.item.url,
	            "type": _vm.item.mime_type
	          }
	        }) : _vm._e(), _vm._v(" "), _vm.isVideo() ? _c('video', {
	          attrs: {
	            "controls": ""
	          }
	        }, [_c('source', {
	          attrs: {
	            "src": _vm.item.url,
	            "type": _vm.item.mime_type
	          }
	        })]) : _vm._e()])];
	      },
	      proxy: true
	    }, {
	      key: "backdrop-close",
	      fn: function fn() {
	        return [_c('button', {
	          staticClass: "media-preview-close",
	          attrs: {
	            "type": "button"
	          },
	          on: {
	            "click": function click($event) {
	              return _vm.close();
	            }
	          }
	        }, [_c('span', {
	          staticClass: "icon-times"
	        })])];
	      },
	      proxy: true
	    }], null, false, 2848818578)
	  }) : _vm._e();
	};

	var __vue_staticRenderFns__$g = [];
	/* style */

	var __vue_inject_styles__$g = undefined;
	/* scoped */

	var __vue_scope_id__$g = undefined;
	/* module identifier */

	var __vue_module_identifier__$g = undefined;
	/* functional template */

	var __vue_is_functional_template__$g = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$g = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$g,
	  staticRenderFns: __vue_staticRenderFns__$g
	}, __vue_inject_styles__$g, __vue_script__$g, __vue_scope_id__$g, __vue_is_functional_template__$g, __vue_module_identifier__$g, false, undefined, undefined, undefined); //


	var script$h = {
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
	/* script */

	var __vue_script__$h = script$h;
	/* template */

	var __vue_render__$h = function __vue_render__$h() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _vm.$store.state.showRenameModal ? _c('media-modal', {
	    attrs: {
	      "size": 'sm',
	      "show-close": false,
	      "label-element": "renameTitle"
	    },
	    on: {
	      "close": function close($event) {
	        return _vm.close();
	      }
	    },
	    scopedSlots: _vm._u([{
	      key: "header",
	      fn: function fn() {
	        return [_c('h3', {
	          staticClass: "modal-title",
	          attrs: {
	            "id": "renameTitle"
	          }
	        }, [_vm._v("\n      " + _vm._s(_vm.translate('COM_MEDIA_RENAME')) + "\n    ")])];
	      },
	      proxy: true
	    }, {
	      key: "body",
	      fn: function fn() {
	        return [_c('div', [_c('form', {
	          staticClass: "form",
	          attrs: {
	            "novalidate": ""
	          },
	          on: {
	            "submit": function submit($event) {
	              $event.preventDefault();
	              return _vm.save($event);
	            }
	          }
	        }, [_c('div', {
	          staticClass: "form-group"
	        }, [_c('label', {
	          attrs: {
	            "for": "name"
	          }
	        }, [_vm._v(_vm._s(_vm.translate('COM_MEDIA_NAME')))]), _vm._v(" "), _c('div', {
	          class: {
	            'input-group': _vm.extension.length
	          }
	        }, [_c('input', {
	          ref: "nameField",
	          staticClass: "form-control",
	          attrs: {
	            "id": "name",
	            "type": "text",
	            "placeholder": _vm.translate('COM_MEDIA_NAME'),
	            "required": "",
	            "autocomplete": "off"
	          },
	          domProps: {
	            "value": _vm.name
	          }
	        }), _vm._v(" "), _vm.extension.length ? _c('span', {
	          staticClass: "input-group-text"
	        }, [_vm._v("\n              " + _vm._s(_vm.extension) + "\n            ")]) : _vm._e()])])])])];
	      },
	      proxy: true
	    }, {
	      key: "footer",
	      fn: function fn() {
	        return [_c('div', [_c('button', {
	          staticClass: "btn btn-secondary",
	          attrs: {
	            "type": "button"
	          },
	          on: {
	            "click": function click($event) {
	              return _vm.close();
	            },
	            "keyup": function keyup($event) {
	              if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	                return null;
	              }

	              return _vm.close();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JCANCEL')) + "\n      ")]), _vm._v(" "), _c('button', {
	          staticClass: "btn btn-success",
	          attrs: {
	            "type": "button",
	            "disabled": !_vm.isValid()
	          },
	          on: {
	            "click": function click($event) {
	              return _vm.save();
	            },
	            "keyup": function keyup($event) {
	              if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
	                return null;
	              }

	              return _vm.save();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JAPPLY')) + "\n      ")])])];
	      },
	      proxy: true
	    }], null, false, 590611486)
	  }) : _vm._e();
	};

	var __vue_staticRenderFns__$h = [];
	/* style */

	var __vue_inject_styles__$h = undefined;
	/* scoped */

	var __vue_scope_id__$h = undefined;
	/* module identifier */

	var __vue_module_identifier__$h = undefined;
	/* functional template */

	var __vue_is_functional_template__$h = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$h = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$h,
	  staticRenderFns: __vue_staticRenderFns__$h
	}, __vue_inject_styles__$h, __vue_script__$h, __vue_scope_id__$h, __vue_is_functional_template__$h, __vue_module_identifier__$h, false, undefined, undefined, undefined); //


	var script$i = {
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
	/* script */

	var __vue_script__$i = script$i;
	/* template */

	var __vue_render__$i = function __vue_render__$i() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _vm.$store.state.showShareModal ? _c('media-modal', {
	    attrs: {
	      "size": 'md',
	      "show-close": false,
	      "label-element": "shareTitle"
	    },
	    on: {
	      "close": function close($event) {
	        return _vm.close();
	      }
	    },
	    scopedSlots: _vm._u([{
	      key: "header",
	      fn: function fn() {
	        return [_c('h3', {
	          staticClass: "modal-title",
	          attrs: {
	            "id": "shareTitle"
	          }
	        }, [_vm._v("\n      " + _vm._s(_vm.translate('COM_MEDIA_SHARE')) + "\n    ")])];
	      },
	      proxy: true
	    }, {
	      key: "body",
	      fn: function fn() {
	        return [_c('div', [_c('div', {
	          staticClass: "desc"
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('COM_MEDIA_SHARE_DESC')) + "\n\n        "), !_vm.url ? [_c('div', {
	          staticClass: "control"
	        }, [_c('button', {
	          staticClass: "btn btn-success w-100",
	          attrs: {
	            "type": "button"
	          },
	          on: {
	            "click": _vm.generateUrl
	          }
	        }, [_vm._v("\n              " + _vm._s(_vm.translate('COM_MEDIA_ACTION_SHARE')) + "\n            ")])])] : [_c('div', {
	          staticClass: "control"
	        }, [_c('span', {
	          staticClass: "input-group"
	        }, [_c('input', {
	          directives: [{
	            name: "model",
	            rawName: "v-model",
	            value: _vm.url,
	            expression: "url"
	          }],
	          ref: "urlText",
	          staticClass: "form-control input-xxlarge",
	          attrs: {
	            "id": "url",
	            "readonly": "",
	            "type": "url",
	            "placeholder": "URL",
	            "autocomplete": "off"
	          },
	          domProps: {
	            "value": _vm.url
	          },
	          on: {
	            "input": function input($event) {
	              if ($event.target.composing) {
	                return;
	              }

	              _vm.url = $event.target.value;
	            }
	          }
	        }), _vm._v(" "), _c('button', {
	          staticClass: "btn btn-secondary",
	          attrs: {
	            "type": "button",
	            "title": _vm.translate('COM_MEDIA_SHARE_COPY')
	          },
	          on: {
	            "click": _vm.copyToClipboard
	          }
	        }, [_c('span', {
	          staticClass: "icon-clipboard",
	          attrs: {
	            "aria-hidden": "true"
	          }
	        })])])])]], 2)])];
	      },
	      proxy: true
	    }, {
	      key: "footer",
	      fn: function fn() {
	        return [_c('div', [_c('button', {
	          staticClass: "btn btn-secondary",
	          on: {
	            "click": function click($event) {
	              return _vm.close();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JCANCEL')) + "\n      ")])])];
	      },
	      proxy: true
	    }], null, false, 299814870)
	  }) : _vm._e();
	};

	var __vue_staticRenderFns__$i = [];
	/* style */

	var __vue_inject_styles__$i = undefined;
	/* scoped */

	var __vue_scope_id__$i = undefined;
	/* module identifier */

	var __vue_module_identifier__$i = undefined;
	/* functional template */

	var __vue_is_functional_template__$i = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$i = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$i,
	  staticRenderFns: __vue_staticRenderFns__$i
	}, __vue_inject_styles__$i, __vue_script__$i, __vue_scope_id__$i, __vue_is_functional_template__$i, __vue_module_identifier__$i, false, undefined, undefined, undefined); //


	var script$j = {
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
	/* script */

	var __vue_script__$j = script$j;
	/* template */

	var __vue_render__$j = function __vue_render__$j() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _vm.$store.state.showConfirmDeleteModal ? _c('media-modal', {
	    attrs: {
	      "size": 'md',
	      "show-close": false,
	      "label-element": "confirmDeleteTitle"
	    },
	    on: {
	      "close": function close($event) {
	        return _vm.close();
	      }
	    },
	    scopedSlots: _vm._u([{
	      key: "header",
	      fn: function fn() {
	        return [_c('h3', {
	          staticClass: "modal-title",
	          attrs: {
	            "id": "confirmDeleteTitle"
	          }
	        }, [_vm._v("\n      " + _vm._s(_vm.translate('COM_MEDIA_CONFIRM_DELETE_MODAL_HEADING')) + "\n    ")])];
	      },
	      proxy: true
	    }, {
	      key: "body",
	      fn: function fn() {
	        return [_c('div', [_c('div', {
	          staticClass: "desc"
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JGLOBAL_CONFIRM_DELETE')) + "\n      ")])])];
	      },
	      proxy: true
	    }, {
	      key: "footer",
	      fn: function fn() {
	        return [_c('div', [_c('button', {
	          staticClass: "btn btn-danger",
	          attrs: {
	            "id": "media-delete-item"
	          },
	          on: {
	            "click": function click($event) {
	              return _vm.deleteItem();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('COM_MEDIA_CONFIRM_DELETE_MODAL')) + "\n      ")]), _vm._v(" "), _c('button', {
	          staticClass: "btn btn-success",
	          on: {
	            "click": function click($event) {
	              return _vm.close();
	            }
	          }
	        }, [_vm._v("\n        " + _vm._s(_vm.translate('JCANCEL')) + "\n      ")])])];
	      },
	      proxy: true
	    }], null, false, 4082513040)
	  }) : _vm._e();
	};

	var __vue_staticRenderFns__$j = [];
	/* style */

	var __vue_inject_styles__$j = undefined;
	/* scoped */

	var __vue_scope_id__$j = undefined;
	/* module identifier */

	var __vue_module_identifier__$j = undefined;
	/* functional template */

	var __vue_is_functional_template__$j = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$j = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$j,
	  staticRenderFns: __vue_staticRenderFns__$j
	}, __vue_inject_styles__$j, __vue_script__$j, __vue_scope_id__$j, __vue_is_functional_template__$j, __vue_module_identifier__$j, false, undefined, undefined, undefined); //


	var script$k = {
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
	/* script */

	var __vue_script__$k = script$k;
	/* template */

	var __vue_render__$k = function __vue_render__$k() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('transition', {
	    attrs: {
	      "name": "infobar"
	    }
	  }, [_vm.showInfoBar && _vm.item ? _c('div', {
	    staticClass: "media-infobar"
	  }, [_c('span', {
	    staticClass: "infobar-close",
	    on: {
	      "click": function click($event) {
	        return _vm.hideInfoBar();
	      }
	    }
	  }, [_vm._v("×")]), _vm._v(" "), _c('h2', [_vm._v(_vm._s(_vm.item.name))]), _vm._v(" "), _vm.item.path === '/' ? _c('div', {
	    staticClass: "text-center"
	  }, [_c('span', {
	    staticClass: "icon-file placeholder-icon"
	  }), _vm._v("\n      Select file or folder to view its details.\n    ")]) : _c('dl', [_c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_FOLDER')))]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.item.directory))]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_TYPE')))]), _vm._v(" "), _vm.item.type === 'file' ? _c('dd', [_vm._v("\n        " + _vm._s(_vm.translate('COM_MEDIA_FILE')) + "\n      ")]) : _vm.item.type === 'dir' ? _c('dd', [_vm._v("\n        " + _vm._s(_vm.translate('COM_MEDIA_FOLDER')) + "\n      ")]) : _c('dd', [_vm._v("\n        -\n      ")]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_CREATED')))]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.item.create_date_formatted))]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')))]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.item.modified_date_formatted))]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_DIMENSION')))]), _vm._v(" "), _vm.item.width || _vm.item.height ? _c('dd', [_vm._v("\n        " + _vm._s(_vm.item.width) + "px * " + _vm._s(_vm.item.height) + "px\n      ")]) : _c('dd', [_vm._v("\n        -\n      ")]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_SIZE')))]), _vm._v(" "), _vm.item.size ? _c('dd', [_vm._v("\n        " + _vm._s((_vm.item.size / 1024).toFixed(2)) + " KB\n      ")]) : _c('dd', [_vm._v("\n        -\n      ")]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_MIME_TYPE')))]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.item.mime_type))]), _vm._v(" "), _c('dt', [_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_EXTENSION')))]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.item.extension || '-'))])])]) : _vm._e()]);
	};

	var __vue_staticRenderFns__$k = [];
	/* style */

	var __vue_inject_styles__$k = undefined;
	/* scoped */

	var __vue_scope_id__$k = undefined;
	/* module identifier */

	var __vue_module_identifier__$k = undefined;
	/* functional template */

	var __vue_is_functional_template__$k = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$k = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$k,
	  staticRenderFns: __vue_staticRenderFns__$k
	}, __vue_inject_styles__$k, __vue_script__$k, __vue_scope_id__$k, __vue_is_functional_template__$k, __vue_module_identifier__$k, false, undefined, undefined, undefined); //
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//


	var script$l = {
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
	    var _this33 = this;

	    // Listen to the toolbar upload click event
	    MediaManager.Event.listen('onClickUpload', function () {
	      return _this33.chooseFiles();
	    });
	  },
	  methods: {
	    /* Open the choose-file dialog */
	    chooseFiles: function chooseFiles() {
	      this.$refs.fileInput.click();
	    },

	    /* Upload files */
	    upload: function upload(e) {
	      var _this34 = this;

	      e.preventDefault();
	      var files = e.target.files; // Loop through array of files and upload each file

	      Array.from(files).forEach(function (file) {
	        // Create a new file reader instance
	        var reader = new FileReader(); // Add the on load callback

	        reader.onload = function (progressEvent) {
	          var result = progressEvent.target.result;
	          var splitIndex = result.indexOf('base64') + 7;
	          var content = result.slice(splitIndex, result.length); // Upload the file

	          _this34.$store.dispatch('uploadFile', {
	            name: file.name,
	            parent: _this34.$store.state.selectedDirectory,
	            content: content
	          });
	        };

	        reader.readAsDataURL(file);
	      });
	    }
	  }
	};
	/* script */

	var __vue_script__$l = script$l;
	/* template */

	var __vue_render__$l = function __vue_render__$l() {
	  var _vm = this;

	  var _h = _vm.$createElement;

	  var _c = _vm._self._c || _h;

	  return _c('input', {
	    ref: "fileInput",
	    staticClass: "hidden",
	    attrs: {
	      "type": "file",
	      "name": _vm.name,
	      "multiple": _vm.multiple,
	      "accept": _vm.accept
	    },
	    on: {
	      "change": _vm.upload
	    }
	  });
	};

	var __vue_staticRenderFns__$l = [];
	/* style */

	var __vue_inject_styles__$l = undefined;
	/* scoped */

	var __vue_scope_id__$l = undefined;
	/* module identifier */

	var __vue_module_identifier__$l = undefined;
	/* functional template */

	var __vue_is_functional_template__$l = false;
	/* style inject */

	/* style inject SSR */

	/* style inject shadow dom */

	var __vue_component__$l = /*#__PURE__*/normalizeComponent({
	  render: __vue_render__$l,
	  staticRenderFns: __vue_staticRenderFns__$l
	}, __vue_inject_styles__$l, __vue_script__$l, __vue_scope_id__$l, __vue_is_functional_template__$l, __vue_module_identifier__$l, false, undefined, undefined, undefined);
	/**
	 * Translate plugin
	 */


	var Translate = {
	  // Translate from Joomla text
	  translate: function translate(key) {
	    return Joomla.JText._(key, key);
	  },
	  sprintf: function sprintf(string) {
	    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    } // eslint-disable-next-line no-param-reassign


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
	          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	            args[_key2 - 1] = arguments[_key2];
	          }

	          return Translate.sprintf(key, args);
	        }
	      }
	    });
	  }
	};
	/*!
	 * vuex v3.6.2
	 * (c) 2021 Evan You
	 * @license MIT
	 */

	var t$1 = ("undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : {}).__VUE_DEVTOOLS_GLOBAL_HOOK__;

	function e$1(t, s) {
	  if (s === void 0) {
	    s = [];
	  }

	  if (null === t || "object" != typeof t) return t;
	  var o = (i = function i(e) {
	    return e.original === t;
	  }, s.filter(i)[0]);
	  var i;
	  if (o) return o.copy;
	  var n = Array.isArray(t) ? [] : {};
	  return s.push({
	    original: t,
	    copy: n
	  }), Object.keys(t).forEach(function (o) {
	    n[o] = e$1(t[o], s);
	  }), n;
	}

	function s$1(t, e) {
	  Object.keys(t).forEach(function (s) {
	    return e(t[s], s);
	  });
	}

	function o$1(t) {
	  return null !== t && "object" == typeof t;
	}

	var i$1 = /*#__PURE__*/function () {
	  function i$1(t, e) {
	    this.runtime = e, this._children = Object.create(null), this._rawModule = t;
	    var s = t.state;
	    this.state = ("function" == typeof s ? s() : s) || {};
	  }

	  var _proto8 = i$1.prototype;

	  _proto8.addChild = function addChild(t, e) {
	    this._children[t] = e;
	  };

	  _proto8.removeChild = function removeChild(t) {
	    delete this._children[t];
	  };

	  _proto8.getChild = function getChild(t) {
	    return this._children[t];
	  };

	  _proto8.hasChild = function hasChild(t) {
	    return t in this._children;
	  };

	  _proto8.update = function update(t) {
	    this._rawModule.namespaced = t.namespaced, t.actions && (this._rawModule.actions = t.actions), t.mutations && (this._rawModule.mutations = t.mutations), t.getters && (this._rawModule.getters = t.getters);
	  };

	  _proto8.forEachChild = function forEachChild(t) {
	    s$1(this._children, t);
	  };

	  _proto8.forEachGetter = function forEachGetter(t) {
	    this._rawModule.getters && s$1(this._rawModule.getters, t);
	  };

	  _proto8.forEachAction = function forEachAction(t) {
	    this._rawModule.actions && s$1(this._rawModule.actions, t);
	  };

	  _proto8.forEachMutation = function forEachMutation(t) {
	    this._rawModule.mutations && s$1(this._rawModule.mutations, t);
	  };

	  _createClass(i$1, [{
	    key: "namespaced",
	    get: function get() {
	      return !!this._rawModule.namespaced;
	    }
	  }]);

	  return i$1;
	}();

	var n$1 = /*#__PURE__*/function () {
	  function n$1(t) {
	    this.register([], t, !1);
	  }

	  var _proto9 = n$1.prototype;

	  _proto9.get = function get(t) {
	    return t.reduce(function (t, e) {
	      return t.getChild(e);
	    }, this.root);
	  };

	  _proto9.getNamespace = function getNamespace(t) {
	    var e = this.root;
	    return t.reduce(function (t, s) {
	      return e = e.getChild(s), t + (e.namespaced ? s + "/" : "");
	    }, "");
	  };

	  _proto9.update = function update(t) {
	    !function t(e, s, o) {
	      if (s.update(o), o.modules) for (var _i in o.modules) {
	        if (!s.getChild(_i)) return;
	        t(e.concat(_i), s.getChild(_i), o.modules[_i]);
	      }
	    }([], this.root, t);
	  };

	  _proto9.register = function register(t, e, o) {
	    var _this35 = this;

	    if (o === void 0) {
	      o = !0;
	    }

	    var n = new i$1(e, o);
	    if (0 === t.length) this.root = n;else {
	      this.get(t.slice(0, -1)).addChild(t[t.length - 1], n);
	    }
	    e.modules && s$1(e.modules, function (e, s) {
	      _this35.register(t.concat(s), e, o);
	    });
	  };

	  _proto9.unregister = function unregister(t) {
	    var e = this.get(t.slice(0, -1)),
	        s = t[t.length - 1],
	        o = e.getChild(s);
	    o && o.runtime && e.removeChild(s);
	  };

	  _proto9.isRegistered = function isRegistered(t) {
	    var e = this.get(t.slice(0, -1)),
	        s = t[t.length - 1];
	    return !!e && e.hasChild(s);
	  };

	  return n$1;
	}();

	var r$1;

	var c$1 = /*#__PURE__*/function () {
	  function c$1(e) {
	    var _this36 = this;

	    if (e === void 0) {
	      e = {};
	    }

	    !r$1 && "undefined" != typeof window && window.Vue && f$1$1(window.Vue);
	    var _e59 = e,
	        _e59$plugins = _e59.plugins,
	        s = _e59$plugins === void 0 ? [] : _e59$plugins,
	        _e59$strict = _e59.strict,
	        o = _e59$strict === void 0 ? !1 : _e59$strict;
	    this._committing = !1, this._actions = Object.create(null), this._actionSubscribers = [], this._mutations = Object.create(null), this._wrappedGetters = Object.create(null), this._modules = new n$1(e), this._modulesNamespaceMap = Object.create(null), this._subscribers = [], this._watcherVM = new r$1(), this._makeLocalGettersCache = Object.create(null);
	    var i = this,
	        c = this.dispatch,
	        a = this.commit;
	    this.dispatch = function (t, e) {
	      return c.call(i, t, e);
	    }, this.commit = function (t, e, s) {
	      return a.call(i, t, e, s);
	    }, this.strict = o;
	    var u = this._modules.root.state;
	    h$1(this, u, [], this._modules.root), l$1(this, u), s.forEach(function (t) {
	      return t(_this36);
	    });
	    (void 0 !== e.devtools ? e.devtools : r$1.config.devtools) && function (e) {
	      t$1 && (e._devtoolHook = t$1, t$1.emit("vuex:init", e), t$1.on("vuex:travel-to-state", function (t) {
	        e.replaceState(t);
	      }), e.subscribe(function (e, s) {
	        t$1.emit("vuex:mutation", e, s);
	      }, {
	        prepend: !0
	      }), e.subscribeAction(function (e, s) {
	        t$1.emit("vuex:action", e, s);
	      }, {
	        prepend: !0
	      }));
	    }(this);
	  }

	  var _proto10 = c$1.prototype;

	  _proto10.commit = function commit(t, e, s) {
	    var _this37 = this;

	    var _p$ = p$1(t, e, s),
	        o = _p$.type,
	        i = _p$.payload,
	        r = {
	      type: o,
	      payload: i
	    },
	        c = this._mutations[o];

	    c && (this._withCommit(function () {
	      c.forEach(function (t) {
	        t(i);
	      });
	    }), this._subscribers.slice().forEach(function (t) {
	      return t(r, _this37.state);
	    }));
	  };

	  _proto10.dispatch = function dispatch(t, e) {
	    var _this38 = this;

	    var _p$2 = p$1(t, e),
	        s = _p$2.type,
	        o = _p$2.payload,
	        i = {
	      type: s,
	      payload: o
	    },
	        n = this._actions[s];

	    if (!n) return;

	    try {
	      this._actionSubscribers.slice().filter(function (t) {
	        return t.before;
	      }).forEach(function (t) {
	        return t.before(i, _this38.state);
	      });
	    } catch (t) {}

	    var r = n.length > 1 ? Promise.all(n.map(function (t) {
	      return t(o);
	    })) : n[0](o);
	    return new Promise(function (t, e) {
	      r.then(function (e) {
	        try {
	          _this38._actionSubscribers.filter(function (t) {
	            return t.after;
	          }).forEach(function (t) {
	            return t.after(i, _this38.state);
	          });
	        } catch (t) {}

	        t(e);
	      }, function (t) {
	        try {
	          _this38._actionSubscribers.filter(function (t) {
	            return t.error;
	          }).forEach(function (e) {
	            return e.error(i, _this38.state, t);
	          });
	        } catch (t) {}

	        e(t);
	      });
	    });
	  };

	  _proto10.subscribe = function subscribe(t, e) {
	    return a$1(t, this._subscribers, e);
	  };

	  _proto10.subscribeAction = function subscribeAction(t, e) {
	    return a$1("function" == typeof t ? {
	      before: t
	    } : t, this._actionSubscribers, e);
	  };

	  _proto10.watch = function watch(t, e, s) {
	    var _this39 = this;

	    return this._watcherVM.$watch(function () {
	      return t(_this39.state, _this39.getters);
	    }, e, s);
	  };

	  _proto10.replaceState = function replaceState(t) {
	    var _this40 = this;

	    this._withCommit(function () {
	      _this40._vm._data.$$state = t;
	    });
	  };

	  _proto10.registerModule = function registerModule(t, e, s) {
	    if (s === void 0) {
	      s = {};
	    }

	    "string" == typeof t && (t = [t]), this._modules.register(t, e), h$1(this, this.state, t, this._modules.get(t), s.preserveState), l$1(this, this.state);
	  };

	  _proto10.unregisterModule = function unregisterModule(t) {
	    var _this41 = this;

	    "string" == typeof t && (t = [t]), this._modules.unregister(t), this._withCommit(function () {
	      var e = d$1(_this41.state, t.slice(0, -1));
	      r$1.delete(e, t[t.length - 1]);
	    }), u$1(this);
	  };

	  _proto10.hasModule = function hasModule(t) {
	    return "string" == typeof t && (t = [t]), this._modules.isRegistered(t);
	  };

	  _proto10.hotUpdate = function hotUpdate(t) {
	    this._modules.update(t), u$1(this, !0);
	  };

	  _proto10._withCommit = function _withCommit(t) {
	    var e = this._committing;
	    this._committing = !0, t(), this._committing = e;
	  };

	  _createClass(c$1, [{
	    key: "state",
	    get: function get() {
	      return this._vm._data.$$state;
	    },
	    set: function set(t) {}
	  }]);

	  return c$1;
	}();

	function a$1(t, e, s) {
	  return e.indexOf(t) < 0 && (s && s.prepend ? e.unshift(t) : e.push(t)), function () {
	    var s = e.indexOf(t);
	    s > -1 && e.splice(s, 1);
	  };
	}

	function u$1(t, e) {
	  t._actions = Object.create(null), t._mutations = Object.create(null), t._wrappedGetters = Object.create(null), t._modulesNamespaceMap = Object.create(null);
	  var s = t.state;
	  h$1(t, s, [], t._modules.root, !0), l$1(t, s, e);
	}

	function l$1(t, e, o) {
	  var i = t._vm;
	  t.getters = {}, t._makeLocalGettersCache = Object.create(null);
	  var n = t._wrappedGetters,
	      c = {};
	  s$1(n, function (e, s) {
	    c[s] = function (t, e) {
	      return function () {
	        return t(e);
	      };
	    }(e, t), Object.defineProperty(t.getters, s, {
	      get: function get() {
	        return t._vm[s];
	      },
	      enumerable: !0
	    });
	  });
	  var a = r$1.config.silent;
	  r$1.config.silent = !0, t._vm = new r$1({
	    data: {
	      $$state: e
	    },
	    computed: c
	  }), r$1.config.silent = a, t.strict && function (t) {
	    t._vm.$watch(function () {
	      return this._data.$$state;
	    }, function () {}, {
	      deep: !0,
	      sync: !0
	    });
	  }(t), i && (o && t._withCommit(function () {
	    i._data.$$state = null;
	  }), r$1.nextTick(function () {
	    return i.$destroy();
	  }));
	}

	function h$1(t, e, s, o, i) {
	  var n = !s.length,
	      c = t._modules.getNamespace(s);

	  if (o.namespaced && (t._modulesNamespaceMap[c], t._modulesNamespaceMap[c] = o), !n && !i) {
	    var _i2 = d$1(e, s.slice(0, -1)),
	        _n = s[s.length - 1];

	    t._withCommit(function () {
	      r$1.set(_i2, _n, o.state);
	    });
	  }

	  var a = o.context = function (t, e, s) {
	    var o = "" === e,
	        i = {
	      dispatch: o ? t.dispatch : function (s, o, i) {
	        var n = p$1(s, o, i),
	            r = n.payload,
	            c = n.options;
	        var a = n.type;
	        return c && c.root || (a = e + a), t.dispatch(a, r);
	      },
	      commit: o ? t.commit : function (s, o, i) {
	        var n = p$1(s, o, i),
	            r = n.payload,
	            c = n.options;
	        var a = n.type;
	        c && c.root || (a = e + a), t.commit(a, r, c);
	      }
	    };
	    return Object.defineProperties(i, {
	      getters: {
	        get: o ? function () {
	          return t.getters;
	        } : function () {
	          return function (t, e) {
	            if (!t._makeLocalGettersCache[e]) {
	              var _s = {},
	                  _o = e.length;
	              Object.keys(t.getters).forEach(function (i) {
	                if (i.slice(0, _o) !== e) return;
	                var n = i.slice(_o);
	                Object.defineProperty(_s, n, {
	                  get: function get() {
	                    return t.getters[i];
	                  },
	                  enumerable: !0
	                });
	              }), t._makeLocalGettersCache[e] = _s;
	            }

	            return t._makeLocalGettersCache[e];
	          }(t, e);
	        }
	      },
	      state: {
	        get: function get() {
	          return d$1(t.state, s);
	        }
	      }
	    }), i;
	  }(t, c, s);

	  o.forEachMutation(function (e, s) {
	    !function (t, e, s, o) {
	      (t._mutations[e] || (t._mutations[e] = [])).push(function (e) {
	        s.call(t, o.state, e);
	      });
	    }(t, c + s, e, a);
	  }), o.forEachAction(function (e, s) {
	    var o = e.root ? s : c + s,
	        i = e.handler || e;
	    !function (t, e, s, o) {
	      (t._actions[e] || (t._actions[e] = [])).push(function (e) {
	        var i = s.call(t, {
	          dispatch: o.dispatch,
	          commit: o.commit,
	          getters: o.getters,
	          state: o.state,
	          rootGetters: t.getters,
	          rootState: t.state
	        }, e);
	        var n;
	        return (n = i) && "function" == typeof n.then || (i = Promise.resolve(i)), t._devtoolHook ? i.catch(function (e) {
	          throw t._devtoolHook.emit("vuex:error", e), e;
	        }) : i;
	      });
	    }(t, o, i, a);
	  }), o.forEachGetter(function (e, s) {
	    !function (t, e, s, o) {
	      if (t._wrappedGetters[e]) return;

	      t._wrappedGetters[e] = function (t) {
	        return s(o.state, o.getters, t.state, t.getters);
	      };
	    }(t, c + s, e, a);
	  }), o.forEachChild(function (o, n) {
	    h$1(t, e, s.concat(n), o, i);
	  });
	}

	function d$1(t, e) {
	  return e.reduce(function (t, e) {
	    return t[e];
	  }, t);
	}

	function p$1(t, e, s) {
	  return o$1(t) && t.type && (s = e, e = t, t = t.type), {
	    type: t,
	    payload: e,
	    options: s
	  };
	}

	function f$1$1(t) {
	  r$1 && t === r$1 || (r$1 = t, function (t) {
	    if (Number(t.version.split(".")[0]) >= 2) t.mixin({
	      beforeCreate: e
	    });else {
	      var _s2 = t.prototype._init;

	      t.prototype._init = function (t) {
	        if (t === void 0) {
	          t = {};
	        }

	        t.init = t.init ? [e].concat(t.init) : e, _s2.call(this, t);
	      };
	    }

	    function e() {
	      var t = this.$options;
	      t.store ? this.$store = "function" == typeof t.store ? t.store() : t.store : t.parent && t.parent.$store && (this.$store = t.parent.$store);
	    }
	  }(r$1));
	}

	var m$1 = v$1(function (t, e) {
	  var s = {};
	  return w$1(e).forEach(function (_ref) {
	    var e = _ref.key,
	        o = _ref.val;
	    s[e] = function () {
	      var e = this.$store.state,
	          s = this.$store.getters;

	      if (t) {
	        var _o2 = $$1(this.$store, "mapState", t);

	        if (!_o2) return;
	        e = _o2.context.state, s = _o2.context.getters;
	      }

	      return "function" == typeof o ? o.call(this, e, s) : e[o];
	    }, s[e].vuex = !0;
	  }), s;
	}),
	    g$1 = v$1(function (t, e) {
	  var s = {};
	  return w$1(e).forEach(function (_ref2) {
	    var e = _ref2.key,
	        o = _ref2.val;

	    s[e] = function () {
	      var s = this.$store.commit;

	      if (t) {
	        var _e = $$1(this.$store, "mapMutations", t);

	        if (!_e) return;
	        s = _e.context.commit;
	      }

	      for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
	        e[_key] = arguments[_key];
	      }

	      return "function" == typeof o ? o.apply(this, [s].concat(e)) : s.apply(this.$store, [o].concat(e));
	    };
	  }), s;
	}),
	    _$1 = v$1(function (t, e) {
	  var s = {};
	  return w$1(e).forEach(function (_ref3) {
	    var e = _ref3.key,
	        o = _ref3.val;
	    o = t + o, s[e] = function () {
	      if (!t || $$1(this.$store, "mapGetters", t)) return this.$store.getters[o];
	    }, s[e].vuex = !0;
	  }), s;
	}),
	    y$1 = v$1(function (t, e) {
	  var s = {};
	  return w$1(e).forEach(function (_ref4) {
	    var e = _ref4.key,
	        o = _ref4.val;

	    s[e] = function () {
	      var s = this.$store.dispatch;

	      if (t) {
	        var _e2 = $$1(this.$store, "mapActions", t);

	        if (!_e2) return;
	        s = _e2.context.dispatch;
	      }

	      for (var _len2 = arguments.length, e = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        e[_key2] = arguments[_key2];
	      }

	      return "function" == typeof o ? o.apply(this, [s].concat(e)) : s.apply(this.$store, [o].concat(e));
	    };
	  }), s;
	}),
	    b$1 = function b$1(t) {
	  return {
	    mapState: m$1.bind(null, t),
	    mapGetters: _$1.bind(null, t),
	    mapMutations: g$1.bind(null, t),
	    mapActions: y$1.bind(null, t)
	  };
	};

	function w$1(t) {
	  return function (t) {
	    return Array.isArray(t) || o$1(t);
	  }(t) ? Array.isArray(t) ? t.map(function (t) {
	    return {
	      key: t,
	      val: t
	    };
	  }) : Object.keys(t).map(function (e) {
	    return {
	      key: e,
	      val: t[e]
	    };
	  }) : [];
	}

	function v$1(t) {
	  return function (e, s) {
	    return "string" != typeof e ? (s = e, e = "") : "/" !== e.charAt(e.length - 1) && (e += "/"), t(e, s);
	  };
	}

	function $$1(t, e, s) {
	  return t._modulesNamespaceMap[s];
	}

	function M$1(_temp) {
	  var _ref11 = _temp === void 0 ? {} : _temp,
	      _ref11$collapsed = _ref11.collapsed,
	      t = _ref11$collapsed === void 0 ? !0 : _ref11$collapsed,
	      _ref11$filter = _ref11.filter,
	      s = _ref11$filter === void 0 ? function (t, e, s) {
	    return !0;
	  } : _ref11$filter,
	      _ref11$transformer = _ref11.transformer,
	      o = _ref11$transformer === void 0 ? function (t) {
	    return t;
	  } : _ref11$transformer,
	      _ref11$mutationTransf = _ref11.mutationTransformer,
	      i = _ref11$mutationTransf === void 0 ? function (t) {
	    return t;
	  } : _ref11$mutationTransf,
	      _ref11$actionFilter = _ref11.actionFilter,
	      n = _ref11$actionFilter === void 0 ? function (t, e) {
	    return !0;
	  } : _ref11$actionFilter,
	      _ref11$actionTransfor = _ref11.actionTransformer,
	      r = _ref11$actionTransfor === void 0 ? function (t) {
	    return t;
	  } : _ref11$actionTransfor,
	      _ref11$logMutations = _ref11.logMutations,
	      c = _ref11$logMutations === void 0 ? !0 : _ref11$logMutations,
	      _ref11$logActions = _ref11.logActions,
	      a = _ref11$logActions === void 0 ? !0 : _ref11$logActions,
	      _ref11$logger = _ref11.logger,
	      u = _ref11$logger === void 0 ? console : _ref11$logger;

	  return function (l) {
	    var h = e$1(l.state);
	    void 0 !== u && (c && l.subscribe(function (n, r) {
	      var c = e$1(r);

	      if (s(n, h, c)) {
	        var _e3 = O$1(),
	            _s3 = i(n),
	            _r = "mutation " + n.type + _e3;

	        C$1(u, _r, t), u.log("%c prev state", "color: #9E9E9E; font-weight: bold", o(h)), u.log("%c mutation", "color: #03A9F4; font-weight: bold", _s3), u.log("%c next state", "color: #4CAF50; font-weight: bold", o(c)), E$1(u);
	      }

	      h = c;
	    }), a && l.subscribeAction(function (e, s) {
	      if (n(e, s)) {
	        var _s4 = O$1(),
	            _o3 = r(e),
	            _i3 = "action " + e.type + _s4;

	        C$1(u, _i3, t), u.log("%c action", "color: #03A9F4; font-weight: bold", _o3), E$1(u);
	      }
	    }));
	  };
	}

	function C$1(t, e, s) {
	  var o = s ? t.groupCollapsed : t.group;

	  try {
	    o.call(t, e);
	  } catch (s) {
	    t.log(e);
	  }
	}

	function E$1(t) {
	  try {
	    t.groupEnd();
	  } catch (e) {
	    t.log("—— log end ——");
	  }
	}

	function O$1() {
	  var t = new Date();
	  return " @ " + j$1$1(t.getHours(), 2) + ":" + j$1$1(t.getMinutes(), 2) + ":" + j$1$1(t.getSeconds(), 2) + "." + j$1$1(t.getMilliseconds(), 3);
	}

	function j$1$1(t, e) {
	  return s = "0", o = e - t.toString().length, new Array(o + 1).join(s) + t;
	  var s, o;
	}

	var A$1 = {
	  Store: c$1,
	  install: f$1$1,
	  version: "3.6.2",
	  mapState: m$1,
	  mapMutations: g$1,
	  mapGetters: _$1,
	  mapActions: y$1,
	  createNamespacedHelpers: b$1,
	  createLogger: M$1
	};

	var r$2 = function r(_r) {
	  return function (r) {
	    return !!r && "object" == typeof r;
	  }(_r) && !function (r) {
	    var t = Object.prototype.toString.call(r);
	    return "[object RegExp]" === t || "[object Date]" === t || function (r) {
	      return r.$$typeof === e$2;
	    }(r);
	  }(_r);
	},
	    e$2 = "function" == typeof Symbol && Symbol.for ? Symbol.for("react.element") : 60103;

	function t$2(r, e) {
	  return !1 !== e.clone && e.isMergeableObject(r) ? u$2(Array.isArray(r) ? [] : {}, r, e) : r;
	}

	function n$2(r, e, n) {
	  return r.concat(e).map(function (r) {
	    return t$2(r, n);
	  });
	}

	function o$2(r) {
	  return Object.keys(r).concat(function (r) {
	    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r).filter(function (e) {
	      return r.propertyIsEnumerable(e);
	    }) : [];
	  }(r));
	}

	function c$2(r, e) {
	  try {
	    return e in r;
	  } catch (r) {
	    return !1;
	  }
	}

	function u$2(e, i, a) {
	  (a = a || {}).arrayMerge = a.arrayMerge || n$2, a.isMergeableObject = a.isMergeableObject || r$2, a.cloneUnlessOtherwiseSpecified = t$2;
	  var f = Array.isArray(i);
	  return f === Array.isArray(e) ? f ? a.arrayMerge(e, i, a) : function (r, e, n) {
	    var i = {};
	    return n.isMergeableObject(r) && o$2(r).forEach(function (e) {
	      i[e] = t$2(r[e], n);
	    }), o$2(e).forEach(function (o) {
	      (function (r, e) {
	        return c$2(r, e) && !(Object.hasOwnProperty.call(r, e) && Object.propertyIsEnumerable.call(r, e));
	      })(r, o) || (i[o] = c$2(r, o) && n.isMergeableObject(e[o]) ? function (r, e) {
	        if (!e.customMerge) return u$2;
	        var t = e.customMerge(r);
	        return "function" == typeof t ? t : u$2;
	      }(o, n)(r[o], e[o], n) : t$2(e[o], n));
	    }), i;
	  }(e, i, a) : t$2(i, a);
	}

	u$2.all = function (r, e) {
	  if (!Array.isArray(r)) throw new Error("first argument should be an array");
	  return r.reduce(function (r, t) {
	    return u$2(r, t, e);
	  }, {});
	};

	var i$2 = u$2;

	function a$2(r) {
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
	    r.fetchBeforeUse || (f = s()), "object" == typeof f && null !== f && (n.replaceState(r.overwrite ? f : i$2(n.state, f, {
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

	      for (var i = 0; i < slice.length; i++) {
	        byteNumbers[i] = slice.charCodeAt(i);
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
	      state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
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
	      state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
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

	    state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
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

	    state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
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
	yn.use(A$1); // A Vuex instance is created by combining the state, mutations, actions, and getters.

	var store$2 = new A$1.Store({
	  state: state,
	  getters: getters,
	  actions: actions,
	  mutations: mutations,
	  plugins: [a$2(persistedStateOptions)],
	  strict: "production" !== 'production'
	});
	yn.use(Translate); // Register the vue components

	yn.component('MediaDrive', __vue_component__$3);
	yn.component('MediaDisk', __vue_component__$2);
	yn.component('MediaTree', __vue_component__$4);
	yn.component('MediaTreeItem', __vue_component__$5);
	yn.component('MediaToolbar', __vue_component__$6);
	yn.component('MediaBreadcrumb', __vue_component__$7);
	yn.component('MediaBrowser', __vue_component__$8);
	yn.component('MediaBrowserItem', BrowserItem);
	yn.component('MediaBrowserItemRow', __vue_component__$d);
	yn.component('MediaModal', __vue_component__$e);
	yn.component('MediaCreateFolderModal', __vue_component__$f);
	yn.component('MediaPreviewModal', __vue_component__$g);
	yn.component('MediaRenameModal', __vue_component__$h);
	yn.component('MediaShareModal', __vue_component__$i);
	yn.component('MediaConfirmDeleteModal', __vue_component__$j);
	yn.component('MediaInfobar', __vue_component__$k);
	yn.component('MediaUpload', __vue_component__$l);
	yn.component('TabLock', __vue_component__); // Register MediaManager namespace

	window.MediaManager = window.MediaManager || {}; // Register the media manager event bus

	window.MediaManager.Event = new Event(); // Create the root Vue instance

	document.addEventListener('DOMContentLoaded', function () {
	  return new yn({
	    el: '#com-media',
	    store: store$2,
	    render: function render(h) {
	      return h(__vue_component__$1);
	    }
	  });
	});
	var mediaManager = {};

	return mediaManager;

}());
