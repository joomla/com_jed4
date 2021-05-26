var bootstrap = (function (exports) {
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
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

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

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
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

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var ceil = Math.ceil;
	var floor$1 = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.es/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$1 : ceil)(argument);
	};

	var min$5 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$5(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var document$3 = global$1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$3) && isObject(document$3.createElement);

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

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
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

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$6 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$6
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
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
	var store$1 = global$1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store$1;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.12.0',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});
	});

	var hasOwnProperty = {}.hasOwnProperty;

	var has$1 = function hasOwn(it, key) {
	  return hasOwnProperty.call(toObject(it), key);
	};

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var path = global$1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global$1[namespace])
	    : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process$3 = global$1.process;
	var versions = process$3 && process$3.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] < 4 ? 1 : match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

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

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global$1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has$1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
	    if (nativeSymbol && has$1(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES$6 = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES$6];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
	var createMethod$4 = function (TYPE) {
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
	  forEach: createMethod$4(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$4(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$4(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$4(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$4(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$4(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$4(6),
	  // `Array.prototype.filterOut` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterOut: createMethod$4(7)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;


	var STRICT_METHOD$3 = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$3 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
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

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$4 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$4 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f$5 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$4(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f$5
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$4 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has$1(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$4
	};

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global$1.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

	var keys$2 = shared('keys');

	var sharedKey = function (key) {
	  return keys$2[key] || (keys$2[key] = uid(key));
	};

	var hiddenKeys$1 = {};

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var WeakMap = global$1.WeakMap;
	var set$1, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set$1(it, {});
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
	  var store = sharedStore.state || (sharedStore.state = new WeakMap());
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;
	  set$1 = function (it, metadata) {
	    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset.call(store, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store, it) || {};
	  };
	  has = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys$1[STATE] = true;
	  set$1 = function (it, metadata) {
	    if (has$1(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has$1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return has$1(it, STATE);
	  };
	}

	var internalState = {
	  set: set$1,
	  get: get,
	  has: has,
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
	    if (typeof key == 'string' && !has$1(value, 'name')) {
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

	var max$3 = Math.max;
	var min$4 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max$3(integer + length, 0) : min$4(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$3 = function (IS_INCLUDES) {
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
	  includes: createMethod$3(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$3(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has$1(hiddenKeys$1, key) && has$1(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has$1(O, key = names[i++])) {
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
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	var f$2 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$2
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
	    if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
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

	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;






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
	      descriptor = getOwnPropertyDescriptor$3(target, key);
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

	var SPECIES$5 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$5] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $map = arrayIteration.map;


	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
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

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$5] === it);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var test$1 = {};

	test$1[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test$1) === '[object z]';

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

	var ITERATOR$4 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$4]
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

	var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration(function (iterable) {
	  // eslint-disable-next-line es/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
	  from: arrayFrom
	});

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
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
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has$1(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
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
	  return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if (!has$1(IteratorPrototype$2, ITERATOR$2)) {
	  createNonEnumerableProperty(IteratorPrototype$2, ITERATOR$2, returnThis$2);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

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
	    /* global ActiveXObject -- old IE */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO] = true;

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

	var defineProperty$5 = objectDefineProperty.f;



	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has$1(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
	    defineProperty$5(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
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
	  if (!isObject(it) && it !== null) {
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
	var ITERATOR$1 = wellKnownSymbol('iterator');
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
	  var nativeIterator = IterablePrototype[ITERATOR$1]
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
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis);
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
	  if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
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

	var charAt$1 = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$3(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$2(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
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

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;

	  _setPrototypeOf(subClass, superClass);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

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

	// TODO: Remove from `core-js@4` since it's moved to entry points






	var SPECIES$4 = wellKnownSymbol('species');

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
	      re.constructor[SPECIES$4] = function () { return re; };
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

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
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

	var $includes = arrayIncludes.includes;


	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var MATCH$2 = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

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

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;






	// eslint-disable-next-line es/no-string-prototype-startswith -- safe
	var $startsWith = ''.startsWith;
	var min$3 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.startswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = String(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var index = toLength(min$3(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return $startsWith
	      ? $startsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	var SPECIES$3 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;
	var arrayPush = [].push;
	var min$2 = Math.min;
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
	          (e = min$2(toLength(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p
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

	var trim$2 = stringTrim.trim;


	var $parseFloat = global$1.parseFloat;
	var FORCED$5 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$5 ? function parseFloat(string) {
	  var trimmedString = trim$2(String(string));
	  var result = $parseFloat(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

	// `Number.parseFloat` method
	// https://tc39.es/ecma262/#sec-number.parseFloat
	// eslint-disable-next-line es/no-number-parsefloat -- required for testing
	_export({ target: 'Number', stat: true, forced: Number.parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

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

	var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$4 = objectDefineProperty.f;
	var trim$1 = stringTrim.trim;

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
	    it = trim$1(it);
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
	  for (var keys$1 = descriptors ? getOwnPropertyNames$2(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key; keys$1.length > j; j++) {
	    if (has$1(NativeNumber, key = keys$1[j]) && !has$1(NumberWrapper, key)) {
	      defineProperty$4(NumberWrapper, key, getOwnPropertyDescriptor$1(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global$1, NUMBER, NumberWrapper);
	}

	var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var SPECIES$2 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
	    defineProperty(Constructor, SPECIES$2, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var defineProperty$3 = objectDefineProperty.f;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;





	var enforceInternalState = internalState.enforce;



	var MATCH = wellKnownSymbol('match');
	var NativeRegExp = global$1.RegExp;
	var RegExpPrototype$1 = NativeRegExp.prototype;
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
	      thisIsRegExp ? this : RegExpPrototype$1,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y && sticky) {
	      var state = enforceInternalState(result);
	      state.sticky = true;
	    }

	    return result;
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$3(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys = getOwnPropertyNames$1(NativeRegExp);
	  var index = 0;
	  while (keys.length > index) proxy(keys[index++]);
	  RegExpPrototype$1.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$1;
	  redefine(global$1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var TO_STRING = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING];

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
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

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

	var FORCED$3 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED$3 }, {
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

	var $filter = arrayIteration.filter;


	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	/**
	 * --------------------------------------------------------------------------
	 * Bootstrap (v5.0.1): dom/selector-engine.js
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */
	var NODE_TEXT = 3;
	var SelectorEngine = {
	  find: function find(selector, element) {
	    var _ref;

	    if (element === void 0) {
	      element = document.documentElement;
	    }

	    return (_ref = []).concat.apply(_ref, Element.prototype.querySelectorAll.call(element, selector));
	  },
	  findOne: function findOne(selector, element) {
	    if (element === void 0) {
	      element = document.documentElement;
	    }

	    return Element.prototype.querySelector.call(element, selector);
	  },
	  children: function children(element, selector) {
	    var _ref2;

	    return (_ref2 = []).concat.apply(_ref2, element.children).filter(function (child) {
	      return child.matches(selector);
	    });
	  },
	  parents: function parents(element, selector) {
	    var parents = [];
	    var ancestor = element.parentNode;

	    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
	      if (ancestor.matches(selector)) {
	        parents.push(ancestor);
	      }

	      ancestor = ancestor.parentNode;
	    }

	    return parents;
	  },
	  prev: function prev(element, selector) {
	    var previous = element.previousElementSibling;

	    while (previous) {
	      if (previous.matches(selector)) {
	        return [previous];
	      }

	      previous = previous.previousElementSibling;
	    }

	    return [];
	  },
	  next: function next(element, selector) {
	    var next = element.nextElementSibling;

	    while (next) {
	      if (next.matches(selector)) {
	        return [next];
	      }

	      next = next.nextElementSibling;
	    }

	    return [];
	  }
	};

	/**
	 * --------------------------------------------------------------------------
	 * Bootstrap (v5.0.1): util/index.js
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	var MAX_UID = 1000000;
	var MILLISECONDS_MULTIPLIER = 1000;
	var TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

	var toType = function toType(obj) {
	  if (obj === null || obj === undefined) {
	    return "" + obj;
	  }

	  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
	};
	/**
	 * --------------------------------------------------------------------------
	 * Public Util Api
	 * --------------------------------------------------------------------------
	 */


	var getUID = function getUID(prefix) {
	  do {
	    prefix += Math.floor(Math.random() * MAX_UID);
	  } while (document.getElementById(prefix));

	  return prefix;
	};

	var getSelector = function getSelector(element) {
	  var selector = element.getAttribute('data-bs-target');

	  if (!selector || selector === '#') {
	    var hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
	    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
	    // `document.querySelector` will rightfully complain it is invalid.
	    // See https://github.com/twbs/bootstrap/issues/32273

	    if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
	      return null;
	    } // Just in case some CMS puts out a full URL with the anchor appended


	    if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
	      hrefAttr = "#" + hrefAttr.split('#')[1];
	    }

	    selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
	  }

	  return selector;
	};

	var getSelectorFromElement = function getSelectorFromElement(element) {
	  var selector = getSelector(element);

	  if (selector) {
	    return document.querySelector(selector) ? selector : null;
	  }

	  return null;
	};

	var getElementFromSelector = function getElementFromSelector(element) {
	  var selector = getSelector(element);
	  return selector ? document.querySelector(selector) : null;
	};

	var getTransitionDurationFromElement = function getTransitionDurationFromElement(element) {
	  if (!element) {
	    return 0;
	  } // Get transition-duration of the element


	  var _window$getComputedSt = window.getComputedStyle(element),
	      transitionDuration = _window$getComputedSt.transitionDuration,
	      transitionDelay = _window$getComputedSt.transitionDelay;

	  var floatTransitionDuration = Number.parseFloat(transitionDuration);
	  var floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

	  if (!floatTransitionDuration && !floatTransitionDelay) {
	    return 0;
	  } // If multiple durations are defined, take the first


	  transitionDuration = transitionDuration.split(',')[0];
	  transitionDelay = transitionDelay.split(',')[0];
	  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	};

	var triggerTransitionEnd = function triggerTransitionEnd(element) {
	  element.dispatchEvent(new Event(TRANSITION_END));
	};

	var isElement$1 = function isElement(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  if (typeof obj.jquery !== 'undefined') {
	    obj = obj[0];
	  }

	  return typeof obj.nodeType !== 'undefined';
	};

	var getElement = function getElement(obj) {
	  if (isElement$1(obj)) {
	    // it's a jQuery object or a node element
	    return obj.jquery ? obj[0] : obj;
	  }

	  if (typeof obj === 'string' && obj.length > 0) {
	    return SelectorEngine.findOne(obj);
	  }

	  return null;
	};

	var emulateTransitionEnd = function emulateTransitionEnd(element, duration) {
	  var called = false;
	  var durationPadding = 5;
	  var emulatedDuration = duration + durationPadding;

	  function listener() {
	    called = true;
	    element.removeEventListener(TRANSITION_END, listener);
	  }

	  element.addEventListener(TRANSITION_END, listener);
	  setTimeout(function () {
	    if (!called) {
	      triggerTransitionEnd(element);
	    }
	  }, emulatedDuration);
	};

	var typeCheckConfig = function typeCheckConfig(componentName, config, configTypes) {
	  Object.keys(configTypes).forEach(function (property) {
	    var expectedTypes = configTypes[property];
	    var value = config[property];
	    var valueType = value && isElement$1(value) ? 'element' : toType(value);

	    if (!new RegExp(expectedTypes).test(valueType)) {
	      throw new TypeError(componentName.toUpperCase() + ": Option \"" + property + "\" provided type \"" + valueType + "\" but expected type \"" + expectedTypes + "\".");
	    }
	  });
	};

	var isVisible = function isVisible(element) {
	  if (!element) {
	    return false;
	  }

	  if (element.style && element.parentNode && element.parentNode.style) {
	    var elementStyle = getComputedStyle(element);
	    var parentNodeStyle = getComputedStyle(element.parentNode);
	    return elementStyle.display !== 'none' && parentNodeStyle.display !== 'none' && elementStyle.visibility !== 'hidden';
	  }

	  return false;
	};

	var isDisabled = function isDisabled(element) {
	  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
	    return true;
	  }

	  if (element.classList.contains('disabled')) {
	    return true;
	  }

	  if (typeof element.disabled !== 'undefined') {
	    return element.disabled;
	  }

	  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
	};

	var findShadowRoot = function findShadowRoot(element) {
	  if (!document.documentElement.attachShadow) {
	    return null;
	  } // Can find the shadow root otherwise it'll return the document


	  if (typeof element.getRootNode === 'function') {
	    var root = element.getRootNode();
	    return root instanceof ShadowRoot ? root : null;
	  }

	  if (element instanceof ShadowRoot) {
	    return element;
	  } // when we don't find a shadow root


	  if (!element.parentNode) {
	    return null;
	  }

	  return findShadowRoot(element.parentNode);
	};

	var noop = function noop() {};

	var reflow = function reflow(element) {
	  return element.offsetHeight;
	};

	var getjQuery = function getjQuery() {
	  var _window = window,
	      jQuery = _window.jQuery;

	  if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
	    return jQuery;
	  }

	  return null;
	};

	var onDOMContentLoaded = function onDOMContentLoaded(callback) {
	  if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', callback);
	  } else {
	    callback();
	  }
	};

	var isRTL = function isRTL() {
	  return document.documentElement.dir === 'rtl';
	};

	var defineJQueryPlugin = function defineJQueryPlugin(plugin) {
	  onDOMContentLoaded(function () {
	    var $ = getjQuery();
	    /* istanbul ignore if */

	    if ($) {
	      var name = plugin.NAME;
	      var JQUERY_NO_CONFLICT = $.fn[name];
	      $.fn[name] = plugin.jQueryInterface;
	      $.fn[name].Constructor = plugin;

	      $.fn[name].noConflict = function () {
	        $.fn[name] = JQUERY_NO_CONFLICT;
	        return plugin.jQueryInterface;
	      };
	    }
	  });
	};

	var execute = function execute(callback) {
	  if (typeof callback === 'function') {
	    callback();
	  }
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$2 = internalState.set;
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
	  setInternalState$2(this, {
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

	var freezing = !fails(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



	var METADATA = uid('meta');
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
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has$1(it, METADATA)) {
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
	  if (!has$1(it, METADATA)) {
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
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has$1(it, METADATA)) setMetadata(it);
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

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var defineProperty$2 = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$1 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$1(that, {
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
	    if (descriptors) defineProperty$2(C.prototype, 'size', {
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
	      setInternalState$1(this, {
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

	var ITERATOR = wellKnownSymbol('iterator');
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global$1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
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

	/**
	 * --------------------------------------------------------------------------
	 * Bootstrap (v5.0.1): dom/data.js
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */
	var elementMap = new Map();
	var Data = {
	  set: function set(element, key, instance) {
	    if (!elementMap.has(element)) {
	      elementMap.set(element, new Map());
	    }

	    var instanceMap = elementMap.get(element); // make it clear we only want one instance per element
	    // can be removed later when multiple key/instances are fine to be used

	    if (!instanceMap.has(key) && instanceMap.size !== 0) {
	      // eslint-disable-next-line no-console
	      console.error("Bootstrap doesn't allow more than one instance per element. Bound instance: " + Array.from(instanceMap.keys())[0] + ".");
	      return;
	    }

	    instanceMap.set(key, instance);
	  },
	  get: function get(element, key) {
	    if (elementMap.has(element)) {
	      return elementMap.get(element).get(key) || null;
	    }

	    return null;
	  },
	  remove: function remove(element, key) {
	    if (!elementMap.has(element)) {
	      return;
	    }

	    var instanceMap = elementMap.get(element);
	    instanceMap.delete(key); // free up element references if there are no instances left for an element

	    if (instanceMap.size === 0) {
	      elementMap.delete(element);
	    }
	  }
	};

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var floor = Math.floor;
	var replace = ''.replace;
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
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var max$2 = Math.max;
	var min$1 = Math.min;

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
	        var position = max$2(min$1(toInteger(result.index), S.length), 0);
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

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

	var SPECIES$1 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
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
	        Constructor = Constructor[SPECIES$1];
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

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
	var stripNameRegex = /\..*/;
	var stripUidRegex = /::\d+$/;
	var eventRegistry = {}; // Events storage

	var uidEvent = 1;
	var customEvents = {
	  mouseenter: 'mouseover',
	  mouseleave: 'mouseout'
	};
	var customEventsRegex = /^(mouseenter|mouseleave)/i;
	var nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
	/**
	 * ------------------------------------------------------------------------
	 * Private methods
	 * ------------------------------------------------------------------------
	 */

	function getUidEvent(element, uid) {
	  return uid && uid + "::" + uidEvent++ || element.uidEvent || uidEvent++;
	}

	function getEvent(element) {
	  var uid = getUidEvent(element);
	  element.uidEvent = uid;
	  eventRegistry[uid] = eventRegistry[uid] || {};
	  return eventRegistry[uid];
	}

	function bootstrapHandler(element, fn) {
	  return function handler(event) {
	    event.delegateTarget = element;

	    if (handler.oneOff) {
	      EventHandler.off(element, event.type, fn);
	    }

	    return fn.apply(element, [event]);
	  };
	}

	function bootstrapDelegationHandler(element, selector, fn) {
	  return function handler(event) {
	    var domElements = element.querySelectorAll(selector);

	    for (var target = event.target; target && target !== this; target = target.parentNode) {
	      for (var i = domElements.length; i--;) {
	        if (domElements[i] === target) {
	          event.delegateTarget = target;

	          if (handler.oneOff) {
	            // eslint-disable-next-line unicorn/consistent-destructuring
	            EventHandler.off(element, event.type, selector, fn);
	          }

	          return fn.apply(target, [event]);
	        }
	      }
	    } // To please ESLint


	    return null;
	  };
	}

	function findHandler(events, handler, delegationSelector) {
	  if (delegationSelector === void 0) {
	    delegationSelector = null;
	  }

	  var uidEventList = Object.keys(events);

	  for (var i = 0, len = uidEventList.length; i < len; i++) {
	    var event = events[uidEventList[i]];

	    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
	      return event;
	    }
	  }

	  return null;
	}

	function normalizeParams(originalTypeEvent, handler, delegationFn) {
	  var delegation = typeof handler === 'string';
	  var originalHandler = delegation ? delegationFn : handler;
	  var typeEvent = getTypeEvent(originalTypeEvent);
	  var isNative = nativeEvents.has(typeEvent);

	  if (!isNative) {
	    typeEvent = originalTypeEvent;
	  }

	  return [delegation, originalHandler, typeEvent];
	}

	function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
	  if (typeof originalTypeEvent !== 'string' || !element) {
	    return;
	  }

	  if (!handler) {
	    handler = delegationFn;
	    delegationFn = null;
	  } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
	  // this prevents the handler from being dispatched the same way as mouseover or mouseout does


	  if (customEventsRegex.test(originalTypeEvent)) {
	    var wrapFn = function wrapFn(fn) {
	      return function (event) {
	        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
	          return fn.call(this, event);
	        }
	      };
	    };

	    if (delegationFn) {
	      delegationFn = wrapFn(delegationFn);
	    } else {
	      handler = wrapFn(handler);
	    }
	  }

	  var _normalizeParams = normalizeParams(originalTypeEvent, handler, delegationFn),
	      delegation = _normalizeParams[0],
	      originalHandler = _normalizeParams[1],
	      typeEvent = _normalizeParams[2];

	  var events = getEvent(element);
	  var handlers = events[typeEvent] || (events[typeEvent] = {});
	  var previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

	  if (previousFn) {
	    previousFn.oneOff = previousFn.oneOff && oneOff;
	    return;
	  }

	  var uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
	  var fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
	  fn.delegationSelector = delegation ? handler : null;
	  fn.originalHandler = originalHandler;
	  fn.oneOff = oneOff;
	  fn.uidEvent = uid;
	  handlers[uid] = fn;
	  element.addEventListener(typeEvent, fn, delegation);
	}

	function removeHandler(element, events, typeEvent, handler, delegationSelector) {
	  var fn = findHandler(events[typeEvent], handler, delegationSelector);

	  if (!fn) {
	    return;
	  }

	  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
	  delete events[typeEvent][fn.uidEvent];
	}

	function removeNamespacedHandlers(element, events, typeEvent, namespace) {
	  var storeElementEvent = events[typeEvent] || {};
	  Object.keys(storeElementEvent).forEach(function (handlerKey) {
	    if (handlerKey.includes(namespace)) {
	      var event = storeElementEvent[handlerKey];
	      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
	    }
	  });
	}

	function getTypeEvent(event) {
	  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
	  event = event.replace(stripNameRegex, '');
	  return customEvents[event] || event;
	}

	var EventHandler = {
	  on: function on(element, event, handler, delegationFn) {
	    addHandler(element, event, handler, delegationFn, false);
	  },
	  one: function one(element, event, handler, delegationFn) {
	    addHandler(element, event, handler, delegationFn, true);
	  },
	  off: function off(element, originalTypeEvent, handler, delegationFn) {
	    if (typeof originalTypeEvent !== 'string' || !element) {
	      return;
	    }

	    var _normalizeParams2 = normalizeParams(originalTypeEvent, handler, delegationFn),
	        delegation = _normalizeParams2[0],
	        originalHandler = _normalizeParams2[1],
	        typeEvent = _normalizeParams2[2];

	    var inNamespace = typeEvent !== originalTypeEvent;
	    var events = getEvent(element);
	    var isNamespace = originalTypeEvent.startsWith('.');

	    if (typeof originalHandler !== 'undefined') {
	      // Simplest case: handler is passed, remove that listener ONLY.
	      if (!events || !events[typeEvent]) {
	        return;
	      }

	      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
	      return;
	    }

	    if (isNamespace) {
	      Object.keys(events).forEach(function (elementEvent) {
	        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
	      });
	    }

	    var storeElementEvent = events[typeEvent] || {};
	    Object.keys(storeElementEvent).forEach(function (keyHandlers) {
	      var handlerKey = keyHandlers.replace(stripUidRegex, '');

	      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
	        var event = storeElementEvent[keyHandlers];
	        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
	      }
	    });
	  },
	  trigger: function trigger(element, event, args) {
	    if (typeof event !== 'string' || !element) {
	      return null;
	    }

	    var $ = getjQuery();
	    var typeEvent = getTypeEvent(event);
	    var inNamespace = event !== typeEvent;
	    var isNative = nativeEvents.has(typeEvent);
	    var jQueryEvent;
	    var bubbles = true;
	    var nativeDispatch = true;
	    var defaultPrevented = false;
	    var evt = null;

	    if (inNamespace && $) {
	      jQueryEvent = $.Event(event, args);
	      $(element).trigger(jQueryEvent);
	      bubbles = !jQueryEvent.isPropagationStopped();
	      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
	      defaultPrevented = jQueryEvent.isDefaultPrevented();
	    }

	    if (isNative) {
	      evt = document.createEvent('HTMLEvents');
	      evt.initEvent(typeEvent, bubbles, true);
	    } else {
	      evt = new CustomEvent(event, {
	        bubbles: bubbles,
	        cancelable: true
	      });
	    } // merge custom information in our event


	    if (typeof args !== 'undefined') {
	      Object.keys(args).forEach(function (key) {
	        Object.defineProperty(evt, key, {
	          get: function get() {
	            return args[key];
	          }
	        });
	      });
	    }

	    if (defaultPrevented) {
	      evt.preventDefault();
	    }

	    if (nativeDispatch) {
	      element.dispatchEvent(evt);
	    }

	    if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
	      jQueryEvent.preventDefault();
	    }

	    return evt;
	  }
	};

	/* eslint-disable es/no-object-getownpropertynames -- safe */

	var $getOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$1 = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$1
	};

	var getOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;

	// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
	var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  getOwnPropertyNames: getOwnPropertyNames
	});

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var VERSION = '5.0.1';

	var BaseComponent = /*#__PURE__*/function () {
	  function BaseComponent(element) {
	    element = getElement(element);

	    if (!element) {
	      return;
	    }

	    this._element = element;
	    Data.set(this._element, this.constructor.DATA_KEY, this);
	  }

	  var _proto = BaseComponent.prototype;

	  _proto.dispose = function dispose() {
	    var _this = this;

	    Data.remove(this._element, this.constructor.DATA_KEY);
	    EventHandler.off(this._element, this.constructor.EVENT_KEY);
	    Object.getOwnPropertyNames(this).forEach(function (propertyName) {
	      _this[propertyName] = null;
	    });
	  };

	  _proto._queueCallback = function _queueCallback(callback, element, isAnimated) {
	    if (isAnimated === void 0) {
	      isAnimated = true;
	    }

	    if (!isAnimated) {
	      execute(callback);
	      return;
	    }

	    var transitionDuration = getTransitionDurationFromElement(element);
	    EventHandler.one(element, 'transitionend', function () {
	      return execute(callback);
	    });
	    emulateTransitionEnd(element, transitionDuration);
	  }
	  /** Static */
	  ;

	  BaseComponent.getInstance = function getInstance(element) {
	    return Data.get(element, this.DATA_KEY);
	  };

	  _createClass(BaseComponent, null, [{
	    key: "VERSION",
	    get: function get() {
	      return VERSION;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      throw new Error('You have to implement the static method "NAME", for each component!');
	    }
	  }, {
	    key: "DATA_KEY",
	    get: function get() {
	      return "bs." + this.NAME;
	    }
	  }, {
	    key: "EVENT_KEY",
	    get: function get() {
	      return "." + this.DATA_KEY;
	    }
	  }]);

	  return BaseComponent;
	}();

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$d = 'alert';
	var DATA_KEY$b = 'bs.alert';
	var EVENT_KEY$b = "." + DATA_KEY$b;
	var DATA_API_KEY$8 = '.data-api';
	var SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
	var EVENT_CLOSE = "close" + EVENT_KEY$b;
	var EVENT_CLOSED = "closed" + EVENT_KEY$b;
	var EVENT_CLICK_DATA_API$7 = "click" + EVENT_KEY$b + DATA_API_KEY$8;
	var CLASS_NAME_ALERT = 'alert';
	var CLASS_NAME_FADE$6 = 'fade';
	var CLASS_NAME_SHOW$9 = 'show';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Alert = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Alert, _BaseComponent);

	  function Alert() {
	    return _BaseComponent.apply(this, arguments) || this;
	  }

	  var _proto = Alert.prototype;

	  // Public
	  _proto.close = function close(element) {
	    var rootElement = element ? this._getRootElement(element) : this._element;

	    var customEvent = this._triggerCloseEvent(rootElement);

	    if (customEvent === null || customEvent.defaultPrevented) {
	      return;
	    }

	    this._removeElement(rootElement);
	  } // Private
	  ;

	  _proto._getRootElement = function _getRootElement(element) {
	    return getElementFromSelector(element) || element.closest("." + CLASS_NAME_ALERT);
	  };

	  _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
	    return EventHandler.trigger(element, EVENT_CLOSE);
	  };

	  _proto._removeElement = function _removeElement(element) {
	    var _this = this;

	    element.classList.remove(CLASS_NAME_SHOW$9);
	    var isAnimated = element.classList.contains(CLASS_NAME_FADE$6);

	    this._queueCallback(function () {
	      return _this._destroyElement(element);
	    }, element, isAnimated);
	  };

	  _proto._destroyElement = function _destroyElement(element) {
	    if (element.parentNode) {
	      element.parentNode.removeChild(element);
	    }

	    EventHandler.trigger(element, EVENT_CLOSED);
	  } // Static
	  ;

	  Alert.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY$b);

	      if (!data) {
	        data = new Alert(this);
	      }

	      if (config === 'close') {
	        data[config](this);
	      }
	    });
	  };

	  Alert.handleDismiss = function handleDismiss(alertInstance) {
	    return function (event) {
	      if (event) {
	        event.preventDefault();
	      }

	      alertInstance.close(this);
	    };
	  };

	  _createClass(Alert, null, [{
	    key: "NAME",
	    get: // Getters
	    function get() {
	      return NAME$d;
	    }
	  }]);

	  return Alert;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
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
	  var alerts = Joomla.getOptions('bootstrap.alert'); // Initialise the elements

	  if (alerts && alerts.length) {
	    alerts.forEach(function (selector) {
	      Array.from(document.querySelectorAll(selector)).map(function (el) {
	        return new window.bootstrap.Alert(el);
	      });
	    });
	  }
	}

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$c = 'button';
	var DATA_KEY$a = 'bs.button';
	var EVENT_KEY$a = "." + DATA_KEY$a;
	var DATA_API_KEY$7 = '.data-api';
	var CLASS_NAME_ACTIVE$3 = 'active';
	var SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
	var EVENT_CLICK_DATA_API$6 = "click" + EVENT_KEY$a + DATA_API_KEY$7;
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Button = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Button, _BaseComponent);

	  function Button() {
	    return _BaseComponent.apply(this, arguments) || this;
	  }

	  var _proto = Button.prototype;

	  // Public
	  _proto.toggle = function toggle() {
	    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
	    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
	  } // Static
	  ;

	  Button.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY$a);

	      if (!data) {
	        data = new Button(this);
	      }

	      if (config === 'toggle') {
	        data[config]();
	      }
	    });
	  };

	  _createClass(Button, null, [{
	    key: "NAME",
	    get: // Getters
	    function get() {
	      return NAME$c;
	    }
	  }]);

	  return Button;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, function (event) {
	  event.preventDefault();
	  var button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
	  var data = Data.get(button, DATA_KEY$a);

	  if (!data) {
	    data = new Button(button);
	  }

	  data.toggle();
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Button to jQuery only if jQuery is present
	 */

	defineJQueryPlugin(Button);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Button = Button;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var buttons = Joomla.getOptions('bootstrap.button'); // Initialise the elements

	  if (buttons && buttons.length) {
	    buttons.forEach(function (selector) {
	      Array.from(document.querySelectorAll(selector)).map(function (el) {
	        return new window.bootstrap.Button(el);
	      });
	    });
	  }
	}

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty$1 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$1({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$1(this, 'b', {
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

	var $find = arrayIteration.find;


	var FIND = 'find';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	/**
	 * --------------------------------------------------------------------------
	 * Bootstrap (v5.0.1): dom/manipulator.js
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	 * --------------------------------------------------------------------------
	 */
	function normalizeData(val) {
	  if (val === 'true') {
	    return true;
	  }

	  if (val === 'false') {
	    return false;
	  }

	  if (val === Number(val).toString()) {
	    return Number(val);
	  }

	  if (val === '' || val === 'null') {
	    return null;
	  }

	  return val;
	}

	function normalizeDataKey(key) {
	  return key.replace(/[A-Z]/g, function (chr) {
	    return "-" + chr.toLowerCase();
	  });
	}

	var Manipulator = {
	  setDataAttribute: function setDataAttribute(element, key, value) {
	    element.setAttribute("data-bs-" + normalizeDataKey(key), value);
	  },
	  removeDataAttribute: function removeDataAttribute(element, key) {
	    element.removeAttribute("data-bs-" + normalizeDataKey(key));
	  },
	  getDataAttributes: function getDataAttributes(element) {
	    if (!element) {
	      return {};
	    }

	    var attributes = {};
	    Object.keys(element.dataset).filter(function (key) {
	      return key.startsWith('bs');
	    }).forEach(function (key) {
	      var pureKey = key.replace(/^bs/, '');
	      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
	      attributes[pureKey] = normalizeData(element.dataset[key]);
	    });
	    return attributes;
	  },
	  getDataAttribute: function getDataAttribute(element, key) {
	    return normalizeData(element.getAttribute("data-bs-" + normalizeDataKey(key)));
	  },
	  offset: function offset(element) {
	    var rect = element.getBoundingClientRect();
	    return {
	      top: rect.top + document.body.scrollTop,
	      left: rect.left + document.body.scrollLeft
	    };
	  },
	  position: function position(element) {
	    return {
	      top: element.offsetTop,
	      left: element.offsetLeft
	    };
	  }
	};

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$b = 'collapse';
	var DATA_KEY$9 = 'bs.collapse';
	var EVENT_KEY$9 = "." + DATA_KEY$9;
	var DATA_API_KEY$6 = '.data-api';
	var Default$9 = {
	  toggle: true,
	  parent: ''
	};
	var DefaultType$9 = {
	  toggle: 'boolean',
	  parent: '(string|element)'
	};
	var EVENT_SHOW$5 = "show" + EVENT_KEY$9;
	var EVENT_SHOWN$5 = "shown" + EVENT_KEY$9;
	var EVENT_HIDE$5 = "hide" + EVENT_KEY$9;
	var EVENT_HIDDEN$5 = "hidden" + EVENT_KEY$9;
	var EVENT_CLICK_DATA_API$5 = "click" + EVENT_KEY$9 + DATA_API_KEY$6;
	var CLASS_NAME_SHOW$8 = 'show';
	var CLASS_NAME_COLLAPSE = 'collapse';
	var CLASS_NAME_COLLAPSING = 'collapsing';
	var CLASS_NAME_COLLAPSED = 'collapsed';
	var WIDTH = 'width';
	var HEIGHT = 'height';
	var SELECTOR_ACTIVES = '.show, .collapsing';
	var SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Collapse = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Collapse, _BaseComponent);

	  function Collapse(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._isTransitioning = false;
	    _this._config = _this._getConfig(config);
	    _this._triggerArray = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4 + "[href=\"#" + _this._element.id + "\"]," + (SELECTOR_DATA_TOGGLE$4 + "[data-bs-target=\"#" + _this._element.id + "\"]"));
	    var toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

	    for (var i = 0, len = toggleList.length; i < len; i++) {
	      var elem = toggleList[i];
	      var selector = getSelectorFromElement(elem);
	      var filterElement = SelectorEngine.find(selector).filter(function (foundElem) {
	        return foundElem === _this._element;
	      });

	      if (selector !== null && filterElement.length) {
	        _this._selector = selector;

	        _this._triggerArray.push(elem);
	      }
	    }

	    _this._parent = _this._config.parent ? _this._getParent() : null;

	    if (!_this._config.parent) {
	      _this._addAriaAndCollapsedClass(_this._element, _this._triggerArray);
	    }

	    if (_this._config.toggle) {
	      _this.toggle();
	    }

	    return _this;
	  } // Getters


	  var _proto = Collapse.prototype;

	  // Public
	  _proto.toggle = function toggle() {
	    if (this._element.classList.contains(CLASS_NAME_SHOW$8)) {
	      this.hide();
	    } else {
	      this.show();
	    }
	  };

	  _proto.show = function show() {
	    var _this2 = this;

	    if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW$8)) {
	      return;
	    }

	    var actives;
	    var activesData;

	    if (this._parent) {
	      actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent).filter(function (elem) {
	        if (typeof _this2._config.parent === 'string') {
	          return elem.getAttribute('data-bs-parent') === _this2._config.parent;
	        }

	        return elem.classList.contains(CLASS_NAME_COLLAPSE);
	      });

	      if (actives.length === 0) {
	        actives = null;
	      }
	    }

	    var container = SelectorEngine.findOne(this._selector);

	    if (actives) {
	      var tempActiveData = actives.find(function (elem) {
	        return container !== elem;
	      });
	      activesData = tempActiveData ? Data.get(tempActiveData, DATA_KEY$9) : null;

	      if (activesData && activesData._isTransitioning) {
	        return;
	      }
	    }

	    var startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

	    if (startEvent.defaultPrevented) {
	      return;
	    }

	    if (actives) {
	      actives.forEach(function (elemActive) {
	        if (container !== elemActive) {
	          Collapse.collapseInterface(elemActive, 'hide');
	        }

	        if (!activesData) {
	          Data.set(elemActive, DATA_KEY$9, null);
	        }
	      });
	    }

	    var dimension = this._getDimension();

	    this._element.classList.remove(CLASS_NAME_COLLAPSE);

	    this._element.classList.add(CLASS_NAME_COLLAPSING);

	    this._element.style[dimension] = 0;

	    if (this._triggerArray.length) {
	      this._triggerArray.forEach(function (element) {
	        element.classList.remove(CLASS_NAME_COLLAPSED);
	        element.setAttribute('aria-expanded', true);
	      });
	    }

	    this.setTransitioning(true);

	    var complete = function complete() {
	      _this2._element.classList.remove(CLASS_NAME_COLLAPSING);

	      _this2._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

	      _this2._element.style[dimension] = '';

	      _this2.setTransitioning(false);

	      EventHandler.trigger(_this2._element, EVENT_SHOWN$5);
	    };

	    var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	    var scrollSize = "scroll" + capitalizedDimension;

	    this._queueCallback(complete, this._element, true);

	    this._element.style[dimension] = this._element[scrollSize] + "px";
	  };

	  _proto.hide = function hide() {
	    var _this3 = this;

	    if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW$8)) {
	      return;
	    }

	    var startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

	    if (startEvent.defaultPrevented) {
	      return;
	    }

	    var dimension = this._getDimension();

	    this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
	    reflow(this._element);

	    this._element.classList.add(CLASS_NAME_COLLAPSING);

	    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

	    var triggerArrayLength = this._triggerArray.length;

	    if (triggerArrayLength > 0) {
	      for (var i = 0; i < triggerArrayLength; i++) {
	        var trigger = this._triggerArray[i];
	        var elem = getElementFromSelector(trigger);

	        if (elem && !elem.classList.contains(CLASS_NAME_SHOW$8)) {
	          trigger.classList.add(CLASS_NAME_COLLAPSED);
	          trigger.setAttribute('aria-expanded', false);
	        }
	      }
	    }

	    this.setTransitioning(true);

	    var complete = function complete() {
	      _this3.setTransitioning(false);

	      _this3._element.classList.remove(CLASS_NAME_COLLAPSING);

	      _this3._element.classList.add(CLASS_NAME_COLLAPSE);

	      EventHandler.trigger(_this3._element, EVENT_HIDDEN$5);
	    };

	    this._element.style[dimension] = '';

	    this._queueCallback(complete, this._element, true);
	  };

	  _proto.setTransitioning = function setTransitioning(isTransitioning) {
	    this._isTransitioning = isTransitioning;
	  } // Private
	  ;

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default$9, config);
	    config.toggle = Boolean(config.toggle); // Coerce string values

	    typeCheckConfig(NAME$b, config, DefaultType$9);
	    return config;
	  };

	  _proto._getDimension = function _getDimension() {
	    return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
	  };

	  _proto._getParent = function _getParent() {
	    var _this4 = this;

	    var parent = this._config.parent;
	    parent = getElement(parent);
	    var selector = SELECTOR_DATA_TOGGLE$4 + "[data-bs-parent=\"" + parent + "\"]";
	    SelectorEngine.find(selector, parent).forEach(function (element) {
	      var selected = getElementFromSelector(element);

	      _this4._addAriaAndCollapsedClass(selected, [element]);
	    });
	    return parent;
	  };

	  _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
	    if (!element || !triggerArray.length) {
	      return;
	    }

	    var isOpen = element.classList.contains(CLASS_NAME_SHOW$8);
	    triggerArray.forEach(function (elem) {
	      if (isOpen) {
	        elem.classList.remove(CLASS_NAME_COLLAPSED);
	      } else {
	        elem.classList.add(CLASS_NAME_COLLAPSED);
	      }

	      elem.setAttribute('aria-expanded', isOpen);
	    });
	  } // Static
	  ;

	  Collapse.collapseInterface = function collapseInterface(element, config) {
	    var data = Data.get(element, DATA_KEY$9);

	    var _config = Object.assign({}, Default$9, Manipulator.getDataAttributes(element), typeof config === 'object' && config ? config : {});

	    if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
	      _config.toggle = false;
	    }

	    if (!data) {
	      data = new Collapse(element, _config);
	    }

	    if (typeof config === 'string') {
	      if (typeof data[config] === 'undefined') {
	        throw new TypeError("No method named \"" + config + "\"");
	      }

	      data[config]();
	    }
	  };

	  Collapse.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      Collapse.collapseInterface(this, config);
	    });
	  };

	  _createClass(Collapse, null, [{
	    key: "Default",
	    get: function get() {
	      return Default$9;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$b;
	    }
	  }]);

	  return Collapse;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE$4, function (event) {
	  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
	  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
	    event.preventDefault();
	  }

	  var triggerData = Manipulator.getDataAttributes(this);
	  var selector = getSelectorFromElement(this);
	  var selectorElements = SelectorEngine.find(selector);
	  selectorElements.forEach(function (element) {
	    var data = Data.get(element, DATA_KEY$9);
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

	defineJQueryPlugin(Collapse);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Collapse = Collapse;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var collapses = Object.assign({}, Joomla.getOptions('bootstrap.collapse'), Joomla.getOptions('bootstrap.accordion')); // Initialise the elements

	  Object.keys(collapses).forEach(function (collapse) {
	    var opt = collapses[collapse];
	    var options = {
	      toggle: opt.toggle ? opt.toggle : true
	    };

	    if (opt.parent) {
	      options.parent = opt.parent;
	    }

	    var elements = Array.from(document.querySelectorAll(collapse));

	    if (elements.length) {
	      elements.map(function (el) {
	        return new window.bootstrap.Collapse(el, options);
	      });
	    }
	  });
	}

	var trim = stringTrim.trim;


	var $parseInt = global$1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$2 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$2 ? function parseInt(string, radix) {
	  var S = trim(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	// `Number.parseInt` method
	// https://tc39.es/ecma262/#sec-number.parseint
	// eslint-disable-next-line es/no-number-parseint -- required for testing
	_export({ target: 'Number', stat: true, forced: Number.parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$a = 'carousel';
	var DATA_KEY$8 = 'bs.carousel';
	var EVENT_KEY$8 = "." + DATA_KEY$8;
	var DATA_API_KEY$5 = '.data-api';
	var ARROW_LEFT_KEY = 'ArrowLeft';
	var ARROW_RIGHT_KEY = 'ArrowRight';
	var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

	var SWIPE_THRESHOLD = 40;
	var Default$8 = {
	  interval: 5000,
	  keyboard: true,
	  slide: false,
	  pause: 'hover',
	  wrap: true,
	  touch: true
	};
	var DefaultType$8 = {
	  interval: '(number|boolean)',
	  keyboard: 'boolean',
	  slide: '(boolean|string)',
	  pause: '(string|boolean)',
	  wrap: 'boolean',
	  touch: 'boolean'
	};
	var ORDER_NEXT = 'next';
	var ORDER_PREV = 'prev';
	var DIRECTION_LEFT = 'left';
	var DIRECTION_RIGHT = 'right';
	var EVENT_SLIDE = "slide" + EVENT_KEY$8;
	var EVENT_SLID = "slid" + EVENT_KEY$8;
	var EVENT_KEYDOWN = "keydown" + EVENT_KEY$8;
	var EVENT_MOUSEENTER = "mouseenter" + EVENT_KEY$8;
	var EVENT_MOUSELEAVE = "mouseleave" + EVENT_KEY$8;
	var EVENT_TOUCHSTART = "touchstart" + EVENT_KEY$8;
	var EVENT_TOUCHMOVE = "touchmove" + EVENT_KEY$8;
	var EVENT_TOUCHEND = "touchend" + EVENT_KEY$8;
	var EVENT_POINTERDOWN = "pointerdown" + EVENT_KEY$8;
	var EVENT_POINTERUP = "pointerup" + EVENT_KEY$8;
	var EVENT_DRAG_START = "dragstart" + EVENT_KEY$8;
	var EVENT_LOAD_DATA_API$2 = "load" + EVENT_KEY$8 + DATA_API_KEY$5;
	var EVENT_CLICK_DATA_API$4 = "click" + EVENT_KEY$8 + DATA_API_KEY$5;
	var CLASS_NAME_CAROUSEL = 'carousel';
	var CLASS_NAME_ACTIVE$2 = 'active';
	var CLASS_NAME_SLIDE = 'slide';
	var CLASS_NAME_END = 'carousel-item-end';
	var CLASS_NAME_START = 'carousel-item-start';
	var CLASS_NAME_NEXT = 'carousel-item-next';
	var CLASS_NAME_PREV = 'carousel-item-prev';
	var CLASS_NAME_POINTER_EVENT = 'pointer-event';
	var SELECTOR_ACTIVE$1 = '.active';
	var SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
	var SELECTOR_ITEM = '.carousel-item';
	var SELECTOR_ITEM_IMG = '.carousel-item img';
	var SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
	var SELECTOR_INDICATORS = '.carousel-indicators';
	var SELECTOR_INDICATOR = '[data-bs-target]';
	var SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
	var SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
	var POINTER_TYPE_TOUCH = 'touch';
	var POINTER_TYPE_PEN = 'pen';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Carousel = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Carousel, _BaseComponent);

	  function Carousel(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._items = null;
	    _this._interval = null;
	    _this._activeElement = null;
	    _this._isPaused = false;
	    _this._isSliding = false;
	    _this.touchTimeout = null;
	    _this.touchStartX = 0;
	    _this.touchDeltaX = 0;
	    _this._config = _this._getConfig(config);
	    _this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, _this._element);
	    _this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
	    _this._pointerEvent = Boolean(window.PointerEvent);

	    _this._addEventListeners();

	    return _this;
	  } // Getters


	  var _proto = Carousel.prototype;

	  // Public
	  _proto.next = function next() {
	    if (!this._isSliding) {
	      this._slide(ORDER_NEXT);
	    }
	  };

	  _proto.nextWhenVisible = function nextWhenVisible() {
	    // Don't call next when the page isn't visible
	    // or the carousel or its parent isn't visible
	    if (!document.hidden && isVisible(this._element)) {
	      this.next();
	    }
	  };

	  _proto.prev = function prev() {
	    if (!this._isSliding) {
	      this._slide(ORDER_PREV);
	    }
	  };

	  _proto.pause = function pause(event) {
	    if (!event) {
	      this._isPaused = true;
	    }

	    if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
	      triggerTransitionEnd(this._element);
	      this.cycle(true);
	    }

	    clearInterval(this._interval);
	    this._interval = null;
	  };

	  _proto.cycle = function cycle(event) {
	    if (!event) {
	      this._isPaused = false;
	    }

	    if (this._interval) {
	      clearInterval(this._interval);
	      this._interval = null;
	    }

	    if (this._config && this._config.interval && !this._isPaused) {
	      this._updateInterval();

	      this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
	    }
	  };

	  _proto.to = function to(index) {
	    var _this2 = this;

	    this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

	    var activeIndex = this._getItemIndex(this._activeElement);

	    if (index > this._items.length - 1 || index < 0) {
	      return;
	    }

	    if (this._isSliding) {
	      EventHandler.one(this._element, EVENT_SLID, function () {
	        return _this2.to(index);
	      });
	      return;
	    }

	    if (activeIndex === index) {
	      this.pause();
	      this.cycle();
	      return;
	    }

	    var order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

	    this._slide(order, this._items[index]);
	  } // Private
	  ;

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default$8, config);
	    typeCheckConfig(NAME$a, config, DefaultType$8);
	    return config;
	  };

	  _proto._handleSwipe = function _handleSwipe() {
	    var absDeltax = Math.abs(this.touchDeltaX);

	    if (absDeltax <= SWIPE_THRESHOLD) {
	      return;
	    }

	    var direction = absDeltax / this.touchDeltaX;
	    this.touchDeltaX = 0;

	    if (!direction) {
	      return;
	    }

	    this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
	  };

	  _proto._addEventListeners = function _addEventListeners() {
	    var _this3 = this;

	    if (this._config.keyboard) {
	      EventHandler.on(this._element, EVENT_KEYDOWN, function (event) {
	        return _this3._keydown(event);
	      });
	    }

	    if (this._config.pause === 'hover') {
	      EventHandler.on(this._element, EVENT_MOUSEENTER, function (event) {
	        return _this3.pause(event);
	      });
	      EventHandler.on(this._element, EVENT_MOUSELEAVE, function (event) {
	        return _this3.cycle(event);
	      });
	    }

	    if (this._config.touch && this._touchSupported) {
	      this._addTouchEventListeners();
	    }
	  };

	  _proto._addTouchEventListeners = function _addTouchEventListeners() {
	    var _this4 = this;

	    var start = function start(event) {
	      if (_this4._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
	        _this4.touchStartX = event.clientX;
	      } else if (!_this4._pointerEvent) {
	        _this4.touchStartX = event.touches[0].clientX;
	      }
	    };

	    var move = function move(event) {
	      // ensure swiping with one touch and not pinching
	      _this4.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - _this4.touchStartX;
	    };

	    var end = function end(event) {
	      if (_this4._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
	        _this4.touchDeltaX = event.clientX - _this4.touchStartX;
	      }

	      _this4._handleSwipe();

	      if (_this4._config.pause === 'hover') {
	        // If it's a touch-enabled device, mouseenter/leave are fired as
	        // part of the mouse compatibility events on first tap - the carousel
	        // would stop cycling until user tapped out of it;
	        // here, we listen for touchend, explicitly pause the carousel
	        // (as if it's the second time we tap on it, mouseenter compat event
	        // is NOT fired) and after a timeout (to allow for mouse compatibility
	        // events to fire) we explicitly restart cycling
	        _this4.pause();

	        if (_this4.touchTimeout) {
	          clearTimeout(_this4.touchTimeout);
	        }

	        _this4.touchTimeout = setTimeout(function (event) {
	          return _this4.cycle(event);
	        }, TOUCHEVENT_COMPAT_WAIT + _this4._config.interval);
	      }
	    };

	    SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(function (itemImg) {
	      EventHandler.on(itemImg, EVENT_DRAG_START, function (e) {
	        return e.preventDefault();
	      });
	    });

	    if (this._pointerEvent) {
	      EventHandler.on(this._element, EVENT_POINTERDOWN, function (event) {
	        return start(event);
	      });
	      EventHandler.on(this._element, EVENT_POINTERUP, function (event) {
	        return end(event);
	      });

	      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
	    } else {
	      EventHandler.on(this._element, EVENT_TOUCHSTART, function (event) {
	        return start(event);
	      });
	      EventHandler.on(this._element, EVENT_TOUCHMOVE, function (event) {
	        return move(event);
	      });
	      EventHandler.on(this._element, EVENT_TOUCHEND, function (event) {
	        return end(event);
	      });
	    }
	  };

	  _proto._keydown = function _keydown(event) {
	    if (/input|textarea/i.test(event.target.tagName)) {
	      return;
	    }

	    if (event.key === ARROW_LEFT_KEY) {
	      event.preventDefault();

	      this._slide(DIRECTION_RIGHT);
	    } else if (event.key === ARROW_RIGHT_KEY) {
	      event.preventDefault();

	      this._slide(DIRECTION_LEFT);
	    }
	  };

	  _proto._getItemIndex = function _getItemIndex(element) {
	    this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
	    return this._items.indexOf(element);
	  };

	  _proto._getItemByOrder = function _getItemByOrder(order, activeElement) {
	    var isNext = order === ORDER_NEXT;
	    var isPrev = order === ORDER_PREV;

	    var activeIndex = this._getItemIndex(activeElement);

	    var lastItemIndex = this._items.length - 1;
	    var isGoingToWrap = isPrev && activeIndex === 0 || isNext && activeIndex === lastItemIndex;

	    if (isGoingToWrap && !this._config.wrap) {
	      return activeElement;
	    }

	    var delta = isPrev ? -1 : 1;
	    var itemIndex = (activeIndex + delta) % this._items.length;
	    return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
	  };

	  _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
	    var targetIndex = this._getItemIndex(relatedTarget);

	    var fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

	    return EventHandler.trigger(this._element, EVENT_SLIDE, {
	      relatedTarget: relatedTarget,
	      direction: eventDirectionName,
	      from: fromIndex,
	      to: targetIndex
	    });
	  };

	  _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
	    if (this._indicatorsElement) {
	      var activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
	      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
	      activeIndicator.removeAttribute('aria-current');
	      var indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

	      for (var i = 0; i < indicators.length; i++) {
	        if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
	          indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
	          indicators[i].setAttribute('aria-current', 'true');
	          break;
	        }
	      }
	    }
	  };

	  _proto._updateInterval = function _updateInterval() {
	    var element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

	    if (!element) {
	      return;
	    }

	    var elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

	    if (elementInterval) {
	      this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
	      this._config.interval = elementInterval;
	    } else {
	      this._config.interval = this._config.defaultInterval || this._config.interval;
	    }
	  };

	  _proto._slide = function _slide(directionOrOrder, element) {
	    var _this5 = this;

	    var order = this._directionToOrder(directionOrOrder);

	    var activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

	    var activeElementIndex = this._getItemIndex(activeElement);

	    var nextElement = element || this._getItemByOrder(order, activeElement);

	    var nextElementIndex = this._getItemIndex(nextElement);

	    var isCycling = Boolean(this._interval);
	    var isNext = order === ORDER_NEXT;
	    var directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
	    var orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

	    var eventDirectionName = this._orderToDirection(order);

	    if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
	      this._isSliding = false;
	      return;
	    }

	    var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

	    if (slideEvent.defaultPrevented) {
	      return;
	    }

	    if (!activeElement || !nextElement) {
	      // Some weirdness is happening, so we bail
	      return;
	    }

	    this._isSliding = true;

	    if (isCycling) {
	      this.pause();
	    }

	    this._setActiveIndicatorElement(nextElement);

	    this._activeElement = nextElement;

	    var triggerSlidEvent = function triggerSlidEvent() {
	      EventHandler.trigger(_this5._element, EVENT_SLID, {
	        relatedTarget: nextElement,
	        direction: eventDirectionName,
	        from: activeElementIndex,
	        to: nextElementIndex
	      });
	    };

	    if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
	      nextElement.classList.add(orderClassName);
	      reflow(nextElement);
	      activeElement.classList.add(directionalClassName);
	      nextElement.classList.add(directionalClassName);

	      var completeCallBack = function completeCallBack() {
	        nextElement.classList.remove(directionalClassName, orderClassName);
	        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
	        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
	        _this5._isSliding = false;
	        setTimeout(triggerSlidEvent, 0);
	      };

	      this._queueCallback(completeCallBack, activeElement, true);
	    } else {
	      activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
	      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
	      this._isSliding = false;
	      triggerSlidEvent();
	    }

	    if (isCycling) {
	      this.cycle();
	    }
	  };

	  _proto._directionToOrder = function _directionToOrder(direction) {
	    if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
	      return direction;
	    }

	    if (isRTL()) {
	      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
	    }

	    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
	  };

	  _proto._orderToDirection = function _orderToDirection(order) {
	    if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
	      return order;
	    }

	    if (isRTL()) {
	      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
	    }

	    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
	  } // Static
	  ;

	  Carousel.carouselInterface = function carouselInterface(element, config) {
	    var data = Data.get(element, DATA_KEY$8);

	    var _config = Object.assign({}, Default$8, Manipulator.getDataAttributes(element));

	    if (typeof config === 'object') {
	      _config = Object.assign({}, _config, config);
	    }

	    var action = typeof config === 'string' ? config : _config.slide;

	    if (!data) {
	      data = new Carousel(element, _config);
	    }

	    if (typeof config === 'number') {
	      data.to(config);
	    } else if (typeof action === 'string') {
	      if (typeof data[action] === 'undefined') {
	        throw new TypeError("No method named \"" + action + "\"");
	      }

	      data[action]();
	    } else if (_config.interval && _config.ride) {
	      data.pause();
	      data.cycle();
	    }
	  };

	  Carousel.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      Carousel.carouselInterface(this, config);
	    });
	  };

	  Carousel.dataApiClickHandler = function dataApiClickHandler(event) {
	    var target = getElementFromSelector(this);

	    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
	      return;
	    }

	    var config = Object.assign({}, Manipulator.getDataAttributes(target), Manipulator.getDataAttributes(this));
	    var slideIndex = this.getAttribute('data-bs-slide-to');

	    if (slideIndex) {
	      config.interval = false;
	    }

	    Carousel.carouselInterface(target, config);

	    if (slideIndex) {
	      Data.get(target, DATA_KEY$8).to(slideIndex);
	    }

	    event.preventDefault();
	  };

	  _createClass(Carousel, null, [{
	    key: "Default",
	    get: function get() {
	      return Default$8;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$a;
	    }
	  }]);

	  return Carousel;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
	EventHandler.on(window, EVENT_LOAD_DATA_API$2, function () {
	  var carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

	  for (var i = 0, len = carousels.length; i < len; i++) {
	    Carousel.carouselInterface(carousels[i], Data.get(carousels[i], DATA_KEY$8));
	  }
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Carousel to jQuery only if jQuery is present
	 */

	defineJQueryPlugin(Carousel);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Carousel = Carousel;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var carousels = Joomla.getOptions('bootstrap.carousel'); // Initialise the elements

	  if (typeof carousels === 'object' && carousels !== null) {
	    Object.keys(carousels).forEach(function (carousel) {
	      var opt = carousels[carousel];
	      var options = {
	        interval: opt.interval ? opt.interval : 5000,
	        keyboard: opt.keyboard ? opt.keyboard : true,
	        pause: opt.pause ? opt.pause : 'hover',
	        slide: opt.slide ? opt.slide : false,
	        wrap: opt.wrap ? opt.wrap : true,
	        touch: opt.touch ? opt.touch : true
	      };
	      var elements = Array.from(document.querySelectorAll(carousel));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Carousel(el, options);
	        });
	      }
	    });
	  }
	}

	var defineProperty = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME$9 = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME$9 in FunctionPrototype)) {
	  defineProperty(FunctionPrototype, NAME$9, {
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

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod = function (IS_RIGHT) {
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
	  left: createMethod(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod(true)
	};

	var engineIsNode = classofRaw(global$1.process) == 'process';

	var $reduce = arrayReduce.left;




	var STRICT_METHOD$2 = arrayMethodIsStrict('reduce');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || CHROME_BUG }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var top = 'top';
	var bottom = 'bottom';
	var right = 'right';
	var left = 'left';
	var auto = 'auto';
	var basePlacements = [top, bottom, right, left];
	var start = 'start';
	var end = 'end';
	var clippingParents = 'clippingParents';
	var viewport = 'viewport';
	var popper = 'popper';
	var reference = 'reference';
	var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
	  return acc.concat([placement + "-" + start, placement + "-" + end]);
	}, []);
	var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
	  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
	}, []); // modifiers that need to read the DOM

	var beforeRead = 'beforeRead';
	var read = 'read';
	var afterRead = 'afterRead'; // pure-logic modifiers

	var beforeMain = 'beforeMain';
	var main = 'main';
	var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

	var beforeWrite = 'beforeWrite';
	var write = 'write';
	var afterWrite = 'afterWrite';
	var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

	function getNodeName(element) {
	  return element ? (element.nodeName || '').toLowerCase() : null;
	}

	function getWindow(node) {
	  if (node == null) {
	    return window;
	  }

	  if (node.toString() !== '[object Window]') {
	    var ownerDocument = node.ownerDocument;
	    return ownerDocument ? ownerDocument.defaultView || window : window;
	  }

	  return node;
	}

	function isElement(node) {
	  var OwnElement = getWindow(node).Element;
	  return node instanceof OwnElement || node instanceof Element;
	}

	function isHTMLElement(node) {
	  var OwnElement = getWindow(node).HTMLElement;
	  return node instanceof OwnElement || node instanceof HTMLElement;
	}

	function isShadowRoot(node) {
	  // IE 11 has no ShadowRoot
	  if (typeof ShadowRoot === 'undefined') {
	    return false;
	  }

	  var OwnElement = getWindow(node).ShadowRoot;
	  return node instanceof OwnElement || node instanceof ShadowRoot;
	}

	// and applies them to the HTMLElements such as popper and arrow

	function applyStyles(_ref) {
	  var state = _ref.state;
	  Object.keys(state.elements).forEach(function (name) {
	    var style = state.styles[name] || {};
	    var attributes = state.attributes[name] || {};
	    var element = state.elements[name]; // arrow is optional + virtual elements

	    if (!isHTMLElement(element) || !getNodeName(element)) {
	      return;
	    } // Flow doesn't support to extend this property, but it's the most
	    // effective way to apply styles to an HTMLElement
	    // $FlowFixMe[cannot-write]


	    Object.assign(element.style, style);
	    Object.keys(attributes).forEach(function (name) {
	      var value = attributes[name];

	      if (value === false) {
	        element.removeAttribute(name);
	      } else {
	        element.setAttribute(name, value === true ? '' : value);
	      }
	    });
	  });
	}

	function effect$2(_ref2) {
	  var state = _ref2.state;
	  var initialStyles = {
	    popper: {
	      position: state.options.strategy,
	      left: '0',
	      top: '0',
	      margin: '0'
	    },
	    arrow: {
	      position: 'absolute'
	    },
	    reference: {}
	  };
	  Object.assign(state.elements.popper.style, initialStyles.popper);
	  state.styles = initialStyles;

	  if (state.elements.arrow) {
	    Object.assign(state.elements.arrow.style, initialStyles.arrow);
	  }

	  return function () {
	    Object.keys(state.elements).forEach(function (name) {
	      var element = state.elements[name];
	      var attributes = state.attributes[name] || {};
	      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

	      var style = styleProperties.reduce(function (style, property) {
	        style[property] = '';
	        return style;
	      }, {}); // arrow is optional + virtual elements

	      if (!isHTMLElement(element) || !getNodeName(element)) {
	        return;
	      }

	      Object.assign(element.style, style);
	      Object.keys(attributes).forEach(function (attribute) {
	        element.removeAttribute(attribute);
	      });
	    });
	  };
	} // eslint-disable-next-line import/no-unused-modules


	var applyStyles$1 = {
	  name: 'applyStyles',
	  enabled: true,
	  phase: 'write',
	  fn: applyStyles,
	  effect: effect$2,
	  requires: ['computeStyles']
	};

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

	function getBasePlacement(placement) {
	  return placement.split('-')[0];
	}

	function getBoundingClientRect(element) {
	  var rect = element.getBoundingClientRect();
	  return {
	    width: rect.width,
	    height: rect.height,
	    top: rect.top,
	    right: rect.right,
	    bottom: rect.bottom,
	    left: rect.left,
	    x: rect.left,
	    y: rect.top
	  };
	}

	// means it doesn't take into account transforms.

	function getLayoutRect(element) {
	  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
	  // Fixes https://github.com/popperjs/popper-core/issues/1223

	  var width = element.offsetWidth;
	  var height = element.offsetHeight;

	  if (Math.abs(clientRect.width - width) <= 1) {
	    width = clientRect.width;
	  }

	  if (Math.abs(clientRect.height - height) <= 1) {
	    height = clientRect.height;
	  }

	  return {
	    x: element.offsetLeft,
	    y: element.offsetTop,
	    width: width,
	    height: height
	  };
	}

	function contains(parent, child) {
	  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

	  if (parent.contains(child)) {
	    return true;
	  } // then fallback to custom implementation with Shadow DOM support
	  else if (rootNode && isShadowRoot(rootNode)) {
	      var next = child;

	      do {
	        if (next && parent.isSameNode(next)) {
	          return true;
	        } // $FlowFixMe[prop-missing]: need a better way to handle this...


	        next = next.parentNode || next.host;
	      } while (next);
	    } // Give up, the result is false


	  return false;
	}

	function getComputedStyle$1(element) {
	  return getWindow(element).getComputedStyle(element);
	}

	function isTableElement(element) {
	  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
	}

	function getDocumentElement(element) {
	  // $FlowFixMe[incompatible-return]: assume body is always available
	  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
	  element.document) || window.document).documentElement;
	}

	function getParentNode(element) {
	  if (getNodeName(element) === 'html') {
	    return element;
	  }

	  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
	    // $FlowFixMe[incompatible-return]
	    // $FlowFixMe[prop-missing]
	    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
	    element.parentNode || ( // DOM Element detected
	    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
	    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
	    getDocumentElement(element) // fallback

	  );
	}

	function getTrueOffsetParent(element) {
	  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
	  getComputedStyle$1(element).position === 'fixed') {
	    return null;
	  }

	  return element.offsetParent;
	} // `.offsetParent` reports `null` for fixed elements, while absolute elements
	// return the containing block


	function getContainingBlock(element) {
	  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
	  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

	  if (isIE && isHTMLElement(element)) {
	    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
	    var elementCss = getComputedStyle$1(element);

	    if (elementCss.position === 'fixed') {
	      return null;
	    }
	  }

	  var currentNode = getParentNode(element);

	  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
	    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
	    // create a containing block.
	    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

	    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
	      return currentNode;
	    } else {
	      currentNode = currentNode.parentNode;
	    }
	  }

	  return null;
	} // Gets the closest ancestor positioned element. Handles some edge cases,
	// such as table ancestors and cross browser bugs.


	function getOffsetParent(element) {
	  var window = getWindow(element);
	  var offsetParent = getTrueOffsetParent(element);

	  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
	    offsetParent = getTrueOffsetParent(offsetParent);
	  }

	  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
	    return window;
	  }

	  return offsetParent || getContainingBlock(element) || window;
	}

	function getMainAxisFromPlacement(placement) {
	  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
	}

	var max = Math.max;
	var min = Math.min;
	var round = Math.round;

	function within(min$1, value, max$1) {
	  return max(min$1, min(value, max$1));
	}

	function getFreshSideObject() {
	  return {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  };
	}

	function mergePaddingObject(paddingObject) {
	  return Object.assign({}, getFreshSideObject(), paddingObject);
	}

	function expandToHashMap(value, keys) {
	  return keys.reduce(function (hashMap, key) {
	    hashMap[key] = value;
	    return hashMap;
	  }, {});
	}

	var toPaddingObject = function toPaddingObject(padding, state) {
	  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : padding;
	  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	};

	function arrow(_ref) {
	  var _state$modifiersData$;

	  var state = _ref.state,
	      name = _ref.name,
	      options = _ref.options;
	  var arrowElement = state.elements.arrow;
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var basePlacement = getBasePlacement(state.placement);
	  var axis = getMainAxisFromPlacement(basePlacement);
	  var isVertical = [left, right].indexOf(basePlacement) >= 0;
	  var len = isVertical ? 'height' : 'width';

	  if (!arrowElement || !popperOffsets) {
	    return;
	  }

	  var paddingObject = toPaddingObject(options.padding, state);
	  var arrowRect = getLayoutRect(arrowElement);
	  var minProp = axis === 'y' ? top : left;
	  var maxProp = axis === 'y' ? bottom : right;
	  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	  var arrowOffsetParent = getOffsetParent(arrowElement);
	  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
	  // outside of the popper bounds

	  var min = paddingObject[minProp];
	  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

	  var axisProp = axis;
	  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
	}

	function effect$1(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options;
	  var _options$element = options.element,
	      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

	  if (arrowElement == null) {
	    return;
	  } // CSS selector


	  if (typeof arrowElement === 'string') {
	    arrowElement = state.elements.popper.querySelector(arrowElement);

	    if (!arrowElement) {
	      return;
	    }
	  }

	  if (!contains(state.elements.popper, arrowElement)) {

	    return;
	  }

	  state.elements.arrow = arrowElement;
	} // eslint-disable-next-line import/no-unused-modules


	var arrow$1 = {
	  name: 'arrow',
	  enabled: true,
	  phase: 'main',
	  fn: arrow,
	  effect: effect$1,
	  requires: ['popperOffsets'],
	  requiresIfExists: ['preventOverflow']
	};

	var unsetSides = {
	  top: 'auto',
	  right: 'auto',
	  bottom: 'auto',
	  left: 'auto'
	}; // Round the offsets to the nearest suitable subpixel based on the DPR.
	// Zooming can change the DPR, but it seems to report a value that will
	// cleanly divide the values into the appropriate subpixels.

	function roundOffsetsByDPR(_ref) {
	  var x = _ref.x,
	      y = _ref.y;
	  var win = window;
	  var dpr = win.devicePixelRatio || 1;
	  return {
	    x: round(round(x * dpr) / dpr) || 0,
	    y: round(round(y * dpr) / dpr) || 0
	  };
	}

	function mapToStyles(_ref2) {
	  var _Object$assign2;

	  var popper = _ref2.popper,
	      popperRect = _ref2.popperRect,
	      placement = _ref2.placement,
	      offsets = _ref2.offsets,
	      position = _ref2.position,
	      gpuAcceleration = _ref2.gpuAcceleration,
	      adaptive = _ref2.adaptive,
	      roundOffsets = _ref2.roundOffsets;

	  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
	      _ref3$x = _ref3.x,
	      x = _ref3$x === void 0 ? 0 : _ref3$x,
	      _ref3$y = _ref3.y,
	      y = _ref3$y === void 0 ? 0 : _ref3$y;

	  var hasX = offsets.hasOwnProperty('x');
	  var hasY = offsets.hasOwnProperty('y');
	  var sideX = left;
	  var sideY = top;
	  var win = window;

	  if (adaptive) {
	    var offsetParent = getOffsetParent(popper);
	    var heightProp = 'clientHeight';
	    var widthProp = 'clientWidth';

	    if (offsetParent === getWindow(popper)) {
	      offsetParent = getDocumentElement(popper);

	      if (getComputedStyle$1(offsetParent).position !== 'static') {
	        heightProp = 'scrollHeight';
	        widthProp = 'scrollWidth';
	      }
	    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


	    offsetParent = offsetParent;

	    if (placement === top) {
	      sideY = bottom; // $FlowFixMe[prop-missing]

	      y -= offsetParent[heightProp] - popperRect.height;
	      y *= gpuAcceleration ? 1 : -1;
	    }

	    if (placement === left) {
	      sideX = right; // $FlowFixMe[prop-missing]

	      x -= offsetParent[widthProp] - popperRect.width;
	      x *= gpuAcceleration ? 1 : -1;
	    }
	  }

	  var commonStyles = Object.assign({
	    position: position
	  }, adaptive && unsetSides);

	  if (gpuAcceleration) {
	    var _Object$assign;

	    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	  }

	  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
	}

	function computeStyles(_ref4) {
	  var state = _ref4.state,
	      options = _ref4.options;
	  var _options$gpuAccelerat = options.gpuAcceleration,
	      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
	      _options$adaptive = options.adaptive,
	      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
	      _options$roundOffsets = options.roundOffsets,
	      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

	  var commonStyles = {
	    placement: getBasePlacement(state.placement),
	    popper: state.elements.popper,
	    popperRect: state.rects.popper,
	    gpuAcceleration: gpuAcceleration
	  };

	  if (state.modifiersData.popperOffsets != null) {
	    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.popperOffsets,
	      position: state.options.strategy,
	      adaptive: adaptive,
	      roundOffsets: roundOffsets
	    })));
	  }

	  if (state.modifiersData.arrow != null) {
	    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.arrow,
	      position: 'absolute',
	      adaptive: false,
	      roundOffsets: roundOffsets
	    })));
	  }

	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-placement': state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var computeStyles$1 = {
	  name: 'computeStyles',
	  enabled: true,
	  phase: 'beforeWrite',
	  fn: computeStyles,
	  data: {}
	};

	var passive = {
	  passive: true
	};

	function effect(_ref) {
	  var state = _ref.state,
	      instance = _ref.instance,
	      options = _ref.options;
	  var _options$scroll = options.scroll,
	      scroll = _options$scroll === void 0 ? true : _options$scroll,
	      _options$resize = options.resize,
	      resize = _options$resize === void 0 ? true : _options$resize;
	  var window = getWindow(state.elements.popper);
	  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

	  if (scroll) {
	    scrollParents.forEach(function (scrollParent) {
	      scrollParent.addEventListener('scroll', instance.update, passive);
	    });
	  }

	  if (resize) {
	    window.addEventListener('resize', instance.update, passive);
	  }

	  return function () {
	    if (scroll) {
	      scrollParents.forEach(function (scrollParent) {
	        scrollParent.removeEventListener('scroll', instance.update, passive);
	      });
	    }

	    if (resize) {
	      window.removeEventListener('resize', instance.update, passive);
	    }
	  };
	} // eslint-disable-next-line import/no-unused-modules


	var eventListeners = {
	  name: 'eventListeners',
	  enabled: true,
	  phase: 'write',
	  fn: function fn() {},
	  effect: effect,
	  data: {}
	};

	var hash$1 = {
	  left: 'right',
	  right: 'left',
	  bottom: 'top',
	  top: 'bottom'
	};
	function getOppositePlacement(placement) {
	  return placement.replace(/left|right|bottom|top/g, function (matched) {
	    return hash$1[matched];
	  });
	}

	var hash = {
	  start: 'end',
	  end: 'start'
	};
	function getOppositeVariationPlacement(placement) {
	  return placement.replace(/start|end/g, function (matched) {
	    return hash[matched];
	  });
	}

	function getWindowScroll(node) {
	  var win = getWindow(node);
	  var scrollLeft = win.pageXOffset;
	  var scrollTop = win.pageYOffset;
	  return {
	    scrollLeft: scrollLeft,
	    scrollTop: scrollTop
	  };
	}

	function getWindowScrollBarX(element) {
	  // If <html> has a CSS width greater than the viewport, then this will be
	  // incorrect for RTL.
	  // Popper 1 is broken in this case and never had a bug report so let's assume
	  // it's not an issue. I don't think anyone ever specifies width on <html>
	  // anyway.
	  // Browsers where the left scrollbar doesn't cause an issue report `0` for
	  // this (e.g. Edge 2019, IE11, Safari)
	  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
	}

	function getViewportRect(element) {
	  var win = getWindow(element);
	  var html = getDocumentElement(element);
	  var visualViewport = win.visualViewport;
	  var width = html.clientWidth;
	  var height = html.clientHeight;
	  var x = 0;
	  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
	  // can be obscured underneath it.
	  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
	  // if it isn't open, so if this isn't available, the popper will be detected
	  // to overflow the bottom of the screen too early.

	  if (visualViewport) {
	    width = visualViewport.width;
	    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
	    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
	    // errors due to floating point numbers, so we need to check precision.
	    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
	    // Feature detection fails in mobile emulation mode in Chrome.
	    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
	    // 0.001
	    // Fallback here: "Not Safari" userAgent

	    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	      x = visualViewport.offsetLeft;
	      y = visualViewport.offsetTop;
	    }
	  }

	  return {
	    width: width,
	    height: height,
	    x: x + getWindowScrollBarX(element),
	    y: y
	  };
	}

	// of the `<html>` and `<body>` rect bounds if horizontally scrollable

	function getDocumentRect(element) {
	  var _element$ownerDocumen;

	  var html = getDocumentElement(element);
	  var winScroll = getWindowScroll(element);
	  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	  var y = -winScroll.scrollTop;

	  if (getComputedStyle$1(body || html).direction === 'rtl') {
	    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	  }

	  return {
	    width: width,
	    height: height,
	    x: x,
	    y: y
	  };
	}

	function isScrollParent(element) {
	  // Firefox wants us to check `-x` and `-y` variations as well
	  var _getComputedStyle = getComputedStyle$1(element),
	      overflow = _getComputedStyle.overflow,
	      overflowX = _getComputedStyle.overflowX,
	      overflowY = _getComputedStyle.overflowY;

	  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
	}

	function getScrollParent(node) {
	  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
	    // $FlowFixMe[incompatible-return]: assume body is always available
	    return node.ownerDocument.body;
	  }

	  if (isHTMLElement(node) && isScrollParent(node)) {
	    return node;
	  }

	  return getScrollParent(getParentNode(node));
	}

	/*
	given a DOM element, return the list of all scroll parents, up the list of ancesors
	until we get to the top window object. This list is what we attach scroll listeners
	to, because if any of these parent elements scroll, we'll need to re-calculate the
	reference element's position.
	*/

	function listScrollParents(element, list) {
	  var _element$ownerDocumen;

	  if (list === void 0) {
	    list = [];
	  }

	  var scrollParent = getScrollParent(element);
	  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	  var win = getWindow(scrollParent);
	  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	  var updatedList = list.concat(target);
	  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
	  updatedList.concat(listScrollParents(getParentNode(target)));
	}

	function rectToClientRect(rect) {
	  return Object.assign({}, rect, {
	    left: rect.x,
	    top: rect.y,
	    right: rect.x + rect.width,
	    bottom: rect.y + rect.height
	  });
	}

	function getInnerBoundingClientRect(element) {
	  var rect = getBoundingClientRect(element);
	  rect.top = rect.top + element.clientTop;
	  rect.left = rect.left + element.clientLeft;
	  rect.bottom = rect.top + element.clientHeight;
	  rect.right = rect.left + element.clientWidth;
	  rect.width = element.clientWidth;
	  rect.height = element.clientHeight;
	  rect.x = rect.left;
	  rect.y = rect.top;
	  return rect;
	}

	function getClientRectFromMixedType(element, clippingParent) {
	  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
	} // A "clipping parent" is an overflowable container with the characteristic of
	// clipping (or hiding) overflowing elements with a position different from
	// `initial`


	function getClippingParents(element) {
	  var clippingParents = listScrollParents(getParentNode(element));
	  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
	  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

	  if (!isElement(clipperElement)) {
	    return [];
	  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


	  return clippingParents.filter(function (clippingParent) {
	    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
	  });
	} // Gets the maximum area that the element is visible in due to any number of
	// clipping parents


	function getClippingRect(element, boundary, rootBoundary) {
	  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
	  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	  var firstClippingParent = clippingParents[0];
	  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
	    var rect = getClientRectFromMixedType(element, clippingParent);
	    accRect.top = max(rect.top, accRect.top);
	    accRect.right = min(rect.right, accRect.right);
	    accRect.bottom = min(rect.bottom, accRect.bottom);
	    accRect.left = max(rect.left, accRect.left);
	    return accRect;
	  }, getClientRectFromMixedType(element, firstClippingParent));
	  clippingRect.width = clippingRect.right - clippingRect.left;
	  clippingRect.height = clippingRect.bottom - clippingRect.top;
	  clippingRect.x = clippingRect.left;
	  clippingRect.y = clippingRect.top;
	  return clippingRect;
	}

	function getVariation(placement) {
	  return placement.split('-')[1];
	}

	function computeOffsets(_ref) {
	  var reference = _ref.reference,
	      element = _ref.element,
	      placement = _ref.placement;
	  var basePlacement = placement ? getBasePlacement(placement) : null;
	  var variation = placement ? getVariation(placement) : null;
	  var commonX = reference.x + reference.width / 2 - element.width / 2;
	  var commonY = reference.y + reference.height / 2 - element.height / 2;
	  var offsets;

	  switch (basePlacement) {
	    case top:
	      offsets = {
	        x: commonX,
	        y: reference.y - element.height
	      };
	      break;

	    case bottom:
	      offsets = {
	        x: commonX,
	        y: reference.y + reference.height
	      };
	      break;

	    case right:
	      offsets = {
	        x: reference.x + reference.width,
	        y: commonY
	      };
	      break;

	    case left:
	      offsets = {
	        x: reference.x - element.width,
	        y: commonY
	      };
	      break;

	    default:
	      offsets = {
	        x: reference.x,
	        y: reference.y
	      };
	  }

	  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

	  if (mainAxis != null) {
	    var len = mainAxis === 'y' ? 'height' : 'width';

	    switch (variation) {
	      case start:
	        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
	        break;

	      case end:
	        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
	        break;
	    }
	  }

	  return offsets;
	}

	function detectOverflow(state, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      _options$placement = _options.placement,
	      placement = _options$placement === void 0 ? state.placement : _options$placement,
	      _options$boundary = _options.boundary,
	      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
	      _options$rootBoundary = _options.rootBoundary,
	      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
	      _options$elementConte = _options.elementContext,
	      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
	      _options$altBoundary = _options.altBoundary,
	      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
	      _options$padding = _options.padding,
	      padding = _options$padding === void 0 ? 0 : _options$padding;
	  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	  var altContext = elementContext === popper ? reference : popper;
	  var referenceElement = state.elements.reference;
	  var popperRect = state.rects.popper;
	  var element = state.elements[altBoundary ? altContext : elementContext];
	  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
	  var referenceClientRect = getBoundingClientRect(referenceElement);
	  var popperOffsets = computeOffsets({
	    reference: referenceClientRect,
	    element: popperRect,
	    strategy: 'absolute',
	    placement: placement
	  });
	  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
	  // 0 or negative = within the clipping rect

	  var overflowOffsets = {
	    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
	    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
	    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
	    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	  };
	  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

	  if (elementContext === popper && offsetData) {
	    var offset = offsetData[placement];
	    Object.keys(overflowOffsets).forEach(function (key) {
	      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
	      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
	      overflowOffsets[key] += offset[axis] * multiply;
	    });
	  }

	  return overflowOffsets;
	}

	var test = [];
	var nativeSort = test.sort;

	// IE8-
	var FAILS_ON_UNDEFINED = fails(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD = arrayMethodIsStrict('sort');

	var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

	// `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort
	_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? nativeSort.call(toObject(this))
	      : nativeSort.call(toObject(this), aFunction$1(comparefn));
	  }
	});

	function computeAutoPlacement(state, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      placement = _options.placement,
	      boundary = _options.boundary,
	      rootBoundary = _options.rootBoundary,
	      padding = _options.padding,
	      flipVariations = _options.flipVariations,
	      _options$allowedAutoP = _options.allowedAutoPlacements,
	      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	  var variation = getVariation(placement);
	  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
	    return getVariation(placement) === variation;
	  }) : basePlacements;
	  var allowedPlacements = placements$1.filter(function (placement) {
	    return allowedAutoPlacements.indexOf(placement) >= 0;
	  });

	  if (allowedPlacements.length === 0) {
	    allowedPlacements = placements$1;
	  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


	  var overflows = allowedPlacements.reduce(function (acc, placement) {
	    acc[placement] = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding
	    })[getBasePlacement(placement)];
	    return acc;
	  }, {});
	  return Object.keys(overflows).sort(function (a, b) {
	    return overflows[a] - overflows[b];
	  });
	}

	function getExpandedFallbackPlacements(placement) {
	  if (getBasePlacement(placement) === auto) {
	    return [];
	  }

	  var oppositePlacement = getOppositePlacement(placement);
	  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
	}

	function flip(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;

	  if (state.modifiersData[name]._skip) {
	    return;
	  }

	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
	      specifiedFallbackPlacements = options.fallbackPlacements,
	      padding = options.padding,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      _options$flipVariatio = options.flipVariations,
	      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
	      allowedAutoPlacements = options.allowedAutoPlacements;
	  var preferredPlacement = state.options.placement;
	  var basePlacement = getBasePlacement(preferredPlacement);
	  var isBasePlacement = basePlacement === preferredPlacement;
	  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
	    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding,
	      flipVariations: flipVariations,
	      allowedAutoPlacements: allowedAutoPlacements
	    }) : placement);
	  }, []);
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var checksMap = new Map();
	  var makeFallbackChecks = true;
	  var firstFittingPlacement = placements[0];

	  for (var i = 0; i < placements.length; i++) {
	    var placement = placements[i];

	    var _basePlacement = getBasePlacement(placement);

	    var isStartVariation = getVariation(placement) === start;
	    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
	    var len = isVertical ? 'width' : 'height';
	    var overflow = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      altBoundary: altBoundary,
	      padding: padding
	    });
	    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

	    if (referenceRect[len] > popperRect[len]) {
	      mainVariationSide = getOppositePlacement(mainVariationSide);
	    }

	    var altVariationSide = getOppositePlacement(mainVariationSide);
	    var checks = [];

	    if (checkMainAxis) {
	      checks.push(overflow[_basePlacement] <= 0);
	    }

	    if (checkAltAxis) {
	      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
	    }

	    if (checks.every(function (check) {
	      return check;
	    })) {
	      firstFittingPlacement = placement;
	      makeFallbackChecks = false;
	      break;
	    }

	    checksMap.set(placement, checks);
	  }

	  if (makeFallbackChecks) {
	    // `2` may be desired in some cases – research later
	    var numberOfChecks = flipVariations ? 3 : 1;

	    var _loop = function _loop(_i) {
	      var fittingPlacement = placements.find(function (placement) {
	        var checks = checksMap.get(placement);

	        if (checks) {
	          return checks.slice(0, _i).every(function (check) {
	            return check;
	          });
	        }
	      });

	      if (fittingPlacement) {
	        firstFittingPlacement = fittingPlacement;
	        return "break";
	      }
	    };

	    for (var _i = numberOfChecks; _i > 0; _i--) {
	      var _ret = _loop(_i);

	      if (_ret === "break") break;
	    }
	  }

	  if (state.placement !== firstFittingPlacement) {
	    state.modifiersData[name]._skip = true;
	    state.placement = firstFittingPlacement;
	    state.reset = true;
	  }
	} // eslint-disable-next-line import/no-unused-modules


	var flip$1 = {
	  name: 'flip',
	  enabled: true,
	  phase: 'main',
	  fn: flip,
	  requiresIfExists: ['offset'],
	  data: {
	    _skip: false
	  }
	};

	function getSideOffsets(overflow, rect, preventedOffsets) {
	  if (preventedOffsets === void 0) {
	    preventedOffsets = {
	      x: 0,
	      y: 0
	    };
	  }

	  return {
	    top: overflow.top - rect.height - preventedOffsets.y,
	    right: overflow.right - rect.width + preventedOffsets.x,
	    bottom: overflow.bottom - rect.height + preventedOffsets.y,
	    left: overflow.left - rect.width - preventedOffsets.x
	  };
	}

	function isAnySideFullyClipped(overflow) {
	  return [top, right, bottom, left].some(function (side) {
	    return overflow[side] >= 0;
	  });
	}

	function hide$1(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var preventedOffsets = state.modifiersData.preventOverflow;
	  var referenceOverflow = detectOverflow(state, {
	    elementContext: 'reference'
	  });
	  var popperAltOverflow = detectOverflow(state, {
	    altBoundary: true
	  });
	  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	  state.modifiersData[name] = {
	    referenceClippingOffsets: referenceClippingOffsets,
	    popperEscapeOffsets: popperEscapeOffsets,
	    isReferenceHidden: isReferenceHidden,
	    hasPopperEscaped: hasPopperEscaped
	  };
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-reference-hidden': isReferenceHidden,
	    'data-popper-escaped': hasPopperEscaped
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var hide$2 = {
	  name: 'hide',
	  enabled: true,
	  phase: 'main',
	  requiresIfExists: ['preventOverflow'],
	  fn: hide$1
	};

	function distanceAndSkiddingToXY(placement, rects, offset) {
	  var basePlacement = getBasePlacement(placement);
	  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

	  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
	    placement: placement
	  })) : offset,
	      skidding = _ref[0],
	      distance = _ref[1];

	  skidding = skidding || 0;
	  distance = (distance || 0) * invertDistance;
	  return [left, right].indexOf(basePlacement) >= 0 ? {
	    x: distance,
	    y: skidding
	  } : {
	    x: skidding,
	    y: distance
	  };
	}

	function offset(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options,
	      name = _ref2.name;
	  var _options$offset = options.offset,
	      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	  var data = placements.reduce(function (acc, placement) {
	    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
	    return acc;
	  }, {});
	  var _data$state$placement = data[state.placement],
	      x = _data$state$placement.x,
	      y = _data$state$placement.y;

	  if (state.modifiersData.popperOffsets != null) {
	    state.modifiersData.popperOffsets.x += x;
	    state.modifiersData.popperOffsets.y += y;
	  }

	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules


	var offset$1 = {
	  name: 'offset',
	  enabled: true,
	  phase: 'main',
	  requires: ['popperOffsets'],
	  fn: offset
	};

	function popperOffsets(_ref) {
	  var state = _ref.state,
	      name = _ref.name; // Offsets are the actual position the popper needs to have to be
	  // properly positioned near its reference element
	  // This is the most basic placement, and will be adjusted by
	  // the modifiers in the next step

	  state.modifiersData[name] = computeOffsets({
	    reference: state.rects.reference,
	    element: state.rects.popper,
	    strategy: 'absolute',
	    placement: state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var popperOffsets$1 = {
	  name: 'popperOffsets',
	  enabled: true,
	  phase: 'read',
	  fn: popperOffsets,
	  data: {}
	};

	function getAltAxis(axis) {
	  return axis === 'x' ? 'y' : 'x';
	}

	function preventOverflow(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;
	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      padding = options.padding,
	      _options$tether = options.tether,
	      tether = _options$tether === void 0 ? true : _options$tether,
	      _options$tetherOffset = options.tetherOffset,
	      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	  var overflow = detectOverflow(state, {
	    boundary: boundary,
	    rootBoundary: rootBoundary,
	    padding: padding,
	    altBoundary: altBoundary
	  });
	  var basePlacement = getBasePlacement(state.placement);
	  var variation = getVariation(state.placement);
	  var isBasePlacement = !variation;
	  var mainAxis = getMainAxisFromPlacement(basePlacement);
	  var altAxis = getAltAxis(mainAxis);
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : tetherOffset;
	  var data = {
	    x: 0,
	    y: 0
	  };

	  if (!popperOffsets) {
	    return;
	  }

	  if (checkMainAxis || checkAltAxis) {
	    var mainSide = mainAxis === 'y' ? top : left;
	    var altSide = mainAxis === 'y' ? bottom : right;
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    var offset = popperOffsets[mainAxis];
	    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
	    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
	    var additive = tether ? -popperRect[len] / 2 : 0;
	    var minLen = variation === start ? referenceRect[len] : popperRect[len];
	    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
	    // outside the reference bounds

	    var arrowElement = state.elements.arrow;
	    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
	      width: 0,
	      height: 0
	    };
	    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
	    var arrowPaddingMin = arrowPaddingObject[mainSide];
	    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
	    // to include its full size in the calculation. If the reference is small
	    // and near the edge of a boundary, the popper can overflow even if the
	    // reference is not overflowing as well (e.g. virtual elements with no
	    // width or height)

	    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
	    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
	    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
	    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
	    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
	    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
	    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
	    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

	    if (checkMainAxis) {
	      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
	      popperOffsets[mainAxis] = preventedOffset;
	      data[mainAxis] = preventedOffset - offset;
	    }

	    if (checkAltAxis) {
	      var _mainSide = mainAxis === 'x' ? top : left;

	      var _altSide = mainAxis === 'x' ? bottom : right;

	      var _offset = popperOffsets[altAxis];

	      var _min = _offset + overflow[_mainSide];

	      var _max = _offset - overflow[_altSide];

	      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

	      popperOffsets[altAxis] = _preventedOffset;
	      data[altAxis] = _preventedOffset - _offset;
	    }
	  }

	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules


	var preventOverflow$1 = {
	  name: 'preventOverflow',
	  enabled: true,
	  phase: 'main',
	  fn: preventOverflow,
	  requiresIfExists: ['offset']
	};

	var nativePromiseConstructor = global$1.Promise;

	var engineIsIos = /(?:iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location = global$1.location;
	var set = global$1.setImmediate;
	var clear = global$1.clearImmediate;
	var process$2 = global$1.process;
	var MessageChannel = global$1.MessageChannel;
	var Dispatch = global$1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins -- safe
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
	if (!set || !clear) {
	  set = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func -- spec requirement
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
	  set: set,
	  clear: clear
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
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
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
	  if (isObject(x) && x.constructor === C) return x;
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
	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
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

	var FORCED = isForced_1(PROMISE, function () {
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

	var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
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
	if (FORCED) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState(this);
	    try {
	      executor(bind(internalResolve, state), bind(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };
	  PromiseConstructorPrototype = PromiseConstructor.prototype;
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState(this, {
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
	    var state = getInternalState(promise);
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

	_export({ global: true, wrap: true, forced: FORCED }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED }, {
	  // `Promise.reject` method
	  // https://tc39.es/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced: FORCED }, {
	  // `Promise.resolve` method
	  // https://tc39.es/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve(this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
	  // `Promise.all` method
	  // https://tc39.es/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
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
	    var capability = newPromiseCapability(C);
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

	function getHTMLElementScroll(element) {
	  return {
	    scrollLeft: element.scrollLeft,
	    scrollTop: element.scrollTop
	  };
	}

	function getNodeScroll(node) {
	  if (node === getWindow(node) || !isHTMLElement(node)) {
	    return getWindowScroll(node);
	  } else {
	    return getHTMLElementScroll(node);
	  }
	}

	// Composite means it takes into account transforms as well as layout.

	function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	  if (isFixed === void 0) {
	    isFixed = false;
	  }

	  var documentElement = getDocumentElement(offsetParent);
	  var rect = getBoundingClientRect(elementOrVirtualElement);
	  var isOffsetParentAnElement = isHTMLElement(offsetParent);
	  var scroll = {
	    scrollLeft: 0,
	    scrollTop: 0
	  };
	  var offsets = {
	    x: 0,
	    y: 0
	  };

	  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
	    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
	    isScrollParent(documentElement)) {
	      scroll = getNodeScroll(offsetParent);
	    }

	    if (isHTMLElement(offsetParent)) {
	      offsets = getBoundingClientRect(offsetParent);
	      offsets.x += offsetParent.clientLeft;
	      offsets.y += offsetParent.clientTop;
	    } else if (documentElement) {
	      offsets.x = getWindowScrollBarX(documentElement);
	    }
	  }

	  return {
	    x: rect.left + scroll.scrollLeft - offsets.x,
	    y: rect.top + scroll.scrollTop - offsets.y,
	    width: rect.width,
	    height: rect.height
	  };
	}

	function order(modifiers) {
	  var map = new Map();
	  var visited = new Set();
	  var result = [];
	  modifiers.forEach(function (modifier) {
	    map.set(modifier.name, modifier);
	  }); // On visiting object, check for its dependencies and visit them recursively

	  function sort(modifier) {
	    visited.add(modifier.name);
	    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
	    requires.forEach(function (dep) {
	      if (!visited.has(dep)) {
	        var depModifier = map.get(dep);

	        if (depModifier) {
	          sort(depModifier);
	        }
	      }
	    });
	    result.push(modifier);
	  }

	  modifiers.forEach(function (modifier) {
	    if (!visited.has(modifier.name)) {
	      // check for visited object
	      sort(modifier);
	    }
	  });
	  return result;
	}

	function orderModifiers(modifiers) {
	  // order based on dependencies
	  var orderedModifiers = order(modifiers); // order based on phase

	  return modifierPhases.reduce(function (acc, phase) {
	    return acc.concat(orderedModifiers.filter(function (modifier) {
	      return modifier.phase === phase;
	    }));
	  }, []);
	}

	function debounce(fn) {
	  var pending;
	  return function () {
	    if (!pending) {
	      pending = new Promise(function (resolve) {
	        Promise.resolve().then(function () {
	          pending = undefined;
	          resolve(fn());
	        });
	      });
	    }

	    return pending;
	  };
	}

	function mergeByName(modifiers) {
	  var merged = modifiers.reduce(function (merged, current) {
	    var existing = merged[current.name];
	    merged[current.name] = existing ? Object.assign({}, existing, current, {
	      options: Object.assign({}, existing.options, current.options),
	      data: Object.assign({}, existing.data, current.data)
	    }) : current;
	    return merged;
	  }, {}); // IE11 does not support Object.values

	  return Object.keys(merged).map(function (key) {
	    return merged[key];
	  });
	}

	var DEFAULT_OPTIONS = {
	  placement: 'bottom',
	  modifiers: [],
	  strategy: 'absolute'
	};

	function areValidElements() {
	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  return !args.some(function (element) {
	    return !(element && typeof element.getBoundingClientRect === 'function');
	  });
	}

	function popperGenerator(generatorOptions) {
	  if (generatorOptions === void 0) {
	    generatorOptions = {};
	  }

	  var _generatorOptions = generatorOptions,
	      _generatorOptions$def = _generatorOptions.defaultModifiers,
	      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
	      _generatorOptions$def2 = _generatorOptions.defaultOptions,
	      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	  return function createPopper(reference, popper, options) {
	    if (options === void 0) {
	      options = defaultOptions;
	    }

	    var state = {
	      placement: 'bottom',
	      orderedModifiers: [],
	      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
	      modifiersData: {},
	      elements: {
	        reference: reference,
	        popper: popper
	      },
	      attributes: {},
	      styles: {}
	    };
	    var effectCleanupFns = [];
	    var isDestroyed = false;
	    var instance = {
	      state: state,
	      setOptions: function setOptions(options) {
	        cleanupModifierEffects();
	        state.options = Object.assign({}, defaultOptions, state.options, options);
	        state.scrollParents = {
	          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
	          popper: listScrollParents(popper)
	        }; // Orders the modifiers based on their dependencies and `phase`
	        // properties

	        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

	        state.orderedModifiers = orderedModifiers.filter(function (m) {
	          return m.enabled;
	        }); // Validate the provided modifiers so that the consumer will get warned

	        runModifierEffects();
	        return instance.update();
	      },
	      // Sync update – it will always be executed, even if not necessary. This
	      // is useful for low frequency updates where sync behavior simplifies the
	      // logic.
	      // For high frequency updates (e.g. `resize` and `scroll` events), always
	      // prefer the async Popper#update method
	      forceUpdate: function forceUpdate() {
	        if (isDestroyed) {
	          return;
	        }

	        var _state$elements = state.elements,
	            reference = _state$elements.reference,
	            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
	        // anymore

	        if (!areValidElements(reference, popper)) {

	          return;
	        } // Store the reference and popper rects to be read by modifiers


	        state.rects = {
	          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
	          popper: getLayoutRect(popper)
	        }; // Modifiers have the ability to reset the current update cycle. The
	        // most common use case for this is the `flip` modifier changing the
	        // placement, which then needs to re-run all the modifiers, because the
	        // logic was previously ran for the previous placement and is therefore
	        // stale/incorrect

	        state.reset = false;
	        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
	        // is filled with the initial data specified by the modifier. This means
	        // it doesn't persist and is fresh on each update.
	        // To ensure persistent data, use `${name}#persistent`

	        state.orderedModifiers.forEach(function (modifier) {
	          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
	        });

	        for (var index = 0; index < state.orderedModifiers.length; index++) {

	          if (state.reset === true) {
	            state.reset = false;
	            index = -1;
	            continue;
	          }

	          var _state$orderedModifie = state.orderedModifiers[index],
	              fn = _state$orderedModifie.fn,
	              _state$orderedModifie2 = _state$orderedModifie.options,
	              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
	              name = _state$orderedModifie.name;

	          if (typeof fn === 'function') {
	            state = fn({
	              state: state,
	              options: _options,
	              name: name,
	              instance: instance
	            }) || state;
	          }
	        }
	      },
	      // Async and optimistically optimized update – it will not be executed if
	      // not necessary (debounced to run at most once-per-tick)
	      update: debounce(function () {
	        return new Promise(function (resolve) {
	          instance.forceUpdate();
	          resolve(state);
	        });
	      }),
	      destroy: function destroy() {
	        cleanupModifierEffects();
	        isDestroyed = true;
	      }
	    };

	    if (!areValidElements(reference, popper)) {

	      return instance;
	    }

	    instance.setOptions(options).then(function (state) {
	      if (!isDestroyed && options.onFirstUpdate) {
	        options.onFirstUpdate(state);
	      }
	    }); // Modifiers have the ability to execute arbitrary code before the first
	    // update cycle runs. They will be executed in the same order as the update
	    // cycle. This is useful when a modifier adds some persistent data that
	    // other modifiers need to use, but the modifier is run after the dependent
	    // one.

	    function runModifierEffects() {
	      state.orderedModifiers.forEach(function (_ref3) {
	        var name = _ref3.name,
	            _ref3$options = _ref3.options,
	            options = _ref3$options === void 0 ? {} : _ref3$options,
	            effect = _ref3.effect;

	        if (typeof effect === 'function') {
	          var cleanupFn = effect({
	            state: state,
	            name: name,
	            instance: instance,
	            options: options
	          });

	          var noopFn = function noopFn() {};

	          effectCleanupFns.push(cleanupFn || noopFn);
	        }
	      });
	    }

	    function cleanupModifierEffects() {
	      effectCleanupFns.forEach(function (fn) {
	        return fn();
	      });
	      effectCleanupFns = [];
	    }

	    return instance;
	  };
	}
	var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

	var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
	var createPopper$1 = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers$1
	}); // eslint-disable-next-line import/no-unused-modules

	var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$2];
	var createPopper = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers
	}); // eslint-disable-next-line import/no-unused-modules

	var Popper = /*#__PURE__*/Object.freeze({
		__proto__: null,
		popperGenerator: popperGenerator,
		detectOverflow: detectOverflow,
		createPopperBase: createPopper$2,
		createPopper: createPopper,
		createPopperLite: createPopper$1,
		top: top,
		bottom: bottom,
		right: right,
		left: left,
		auto: auto,
		basePlacements: basePlacements,
		start: start,
		end: end,
		clippingParents: clippingParents,
		viewport: viewport,
		popper: popper,
		reference: reference,
		variationPlacements: variationPlacements,
		placements: placements,
		beforeRead: beforeRead,
		read: read,
		afterRead: afterRead,
		beforeMain: beforeMain,
		main: main,
		afterMain: afterMain,
		beforeWrite: beforeWrite,
		write: write,
		afterWrite: afterWrite,
		modifierPhases: modifierPhases,
		applyStyles: applyStyles$1,
		arrow: arrow$1,
		computeStyles: computeStyles$1,
		eventListeners: eventListeners,
		flip: flip$1,
		hide: hide$2,
		offset: offset$1,
		popperOffsets: popperOffsets$1,
		preventOverflow: preventOverflow$1
	});

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$8 = 'dropdown';
	var DATA_KEY$7 = 'bs.dropdown';
	var EVENT_KEY$7 = "." + DATA_KEY$7;
	var DATA_API_KEY$4 = '.data-api';
	var ESCAPE_KEY$2 = 'Escape';
	var SPACE_KEY = 'Space';
	var TAB_KEY = 'Tab';
	var ARROW_UP_KEY = 'ArrowUp';
	var ARROW_DOWN_KEY = 'ArrowDown';
	var RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

	var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEY + "|" + ARROW_DOWN_KEY + "|" + ESCAPE_KEY$2);
	var EVENT_HIDE$4 = "hide" + EVENT_KEY$7;
	var EVENT_HIDDEN$4 = "hidden" + EVENT_KEY$7;
	var EVENT_SHOW$4 = "show" + EVENT_KEY$7;
	var EVENT_SHOWN$4 = "shown" + EVENT_KEY$7;
	var EVENT_CLICK = "click" + EVENT_KEY$7;
	var EVENT_CLICK_DATA_API$3 = "click" + EVENT_KEY$7 + DATA_API_KEY$4;
	var EVENT_KEYDOWN_DATA_API = "keydown" + EVENT_KEY$7 + DATA_API_KEY$4;
	var EVENT_KEYUP_DATA_API = "keyup" + EVENT_KEY$7 + DATA_API_KEY$4;
	var CLASS_NAME_SHOW$7 = 'show';
	var CLASS_NAME_DROPUP = 'dropup';
	var CLASS_NAME_DROPEND = 'dropend';
	var CLASS_NAME_DROPSTART = 'dropstart';
	var CLASS_NAME_NAVBAR = 'navbar';
	var SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
	var SELECTOR_MENU = '.dropdown-menu';
	var SELECTOR_NAVBAR_NAV = '.navbar-nav';
	var SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
	var PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
	var PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
	var PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
	var PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
	var PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
	var PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
	var Default$7 = {
	  offset: [0, 2],
	  boundary: 'clippingParents',
	  reference: 'toggle',
	  display: 'dynamic',
	  popperConfig: null,
	  autoClose: true
	};
	var DefaultType$7 = {
	  offset: '(array|string|function)',
	  boundary: '(string|element)',
	  reference: '(string|element|object)',
	  display: 'string',
	  popperConfig: '(null|object|function)',
	  autoClose: '(boolean|string)'
	};
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Dropdown = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Dropdown, _BaseComponent);

	  function Dropdown(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._popper = null;
	    _this._config = _this._getConfig(config);
	    _this._menu = _this._getMenuElement();
	    _this._inNavbar = _this._detectNavbar();

	    _this._addEventListeners();

	    return _this;
	  } // Getters


	  var _proto = Dropdown.prototype;

	  // Public
	  _proto.toggle = function toggle() {
	    if (isDisabled(this._element)) {
	      return;
	    }

	    var isActive = this._element.classList.contains(CLASS_NAME_SHOW$7);

	    if (isActive) {
	      this.hide();
	      return;
	    }

	    this.show();
	  };

	  _proto.show = function show() {
	    if (isDisabled(this._element) || this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
	      return;
	    }

	    var parent = Dropdown.getParentFromElement(this._element);
	    var relatedTarget = {
	      relatedTarget: this._element
	    };
	    var showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

	    if (showEvent.defaultPrevented) {
	      return;
	    } // Totally disable Popper for Dropdowns in Navbar


	    if (this._inNavbar) {
	      Manipulator.setDataAttribute(this._menu, 'popper', 'none');
	    } else {
	      if (typeof Popper === 'undefined') {
	        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
	      }

	      var referenceElement = this._element;

	      if (this._config.reference === 'parent') {
	        referenceElement = parent;
	      } else if (isElement$1(this._config.reference)) {
	        referenceElement = getElement(this._config.reference);
	      } else if (typeof this._config.reference === 'object') {
	        referenceElement = this._config.reference;
	      }

	      var popperConfig = this._getPopperConfig();

	      var isDisplayStatic = popperConfig.modifiers.find(function (modifier) {
	        return modifier.name === 'applyStyles' && modifier.enabled === false;
	      });
	      this._popper = createPopper(referenceElement, this._menu, popperConfig);

	      if (isDisplayStatic) {
	        Manipulator.setDataAttribute(this._menu, 'popper', 'static');
	      }
	    } // If this is a touch-enabled device we add extra
	    // empty mouseover listeners to the body's immediate children;
	    // only needed because of broken event delegation on iOS
	    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


	    if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
	      var _ref;

	      (_ref = []).concat.apply(_ref, document.body.children).forEach(function (elem) {
	        return EventHandler.on(elem, 'mouseover', noop);
	      });
	    }

	    this._element.focus();

	    this._element.setAttribute('aria-expanded', true);

	    this._menu.classList.toggle(CLASS_NAME_SHOW$7);

	    this._element.classList.toggle(CLASS_NAME_SHOW$7);

	    EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
	  };

	  _proto.hide = function hide() {
	    if (isDisabled(this._element) || !this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
	      return;
	    }

	    var relatedTarget = {
	      relatedTarget: this._element
	    };

	    this._completeHide(relatedTarget);
	  };

	  _proto.dispose = function dispose() {
	    if (this._popper) {
	      this._popper.destroy();
	    }

	    _BaseComponent.prototype.dispose.call(this);
	  };

	  _proto.update = function update() {
	    this._inNavbar = this._detectNavbar();

	    if (this._popper) {
	      this._popper.update();
	    }
	  } // Private
	  ;

	  _proto._addEventListeners = function _addEventListeners() {
	    var _this2 = this;

	    EventHandler.on(this._element, EVENT_CLICK, function (event) {
	      event.preventDefault();

	      _this2.toggle();
	    });
	  };

	  _proto._completeHide = function _completeHide(relatedTarget) {
	    var hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

	    if (hideEvent.defaultPrevented) {
	      return;
	    } // If this is a touch-enabled device we remove the extra
	    // empty mouseover listeners we added for iOS support


	    if ('ontouchstart' in document.documentElement) {
	      var _ref2;

	      (_ref2 = []).concat.apply(_ref2, document.body.children).forEach(function (elem) {
	        return EventHandler.off(elem, 'mouseover', noop);
	      });
	    }

	    if (this._popper) {
	      this._popper.destroy();
	    }

	    this._menu.classList.remove(CLASS_NAME_SHOW$7);

	    this._element.classList.remove(CLASS_NAME_SHOW$7);

	    this._element.setAttribute('aria-expanded', 'false');

	    Manipulator.removeDataAttribute(this._menu, 'popper');
	    EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
	  };

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, this.constructor.Default, Manipulator.getDataAttributes(this._element), config);
	    typeCheckConfig(NAME$8, config, this.constructor.DefaultType);

	    if (typeof config.reference === 'object' && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
	      // Popper virtual elements require a getBoundingClientRect method
	      throw new TypeError(NAME$8.toUpperCase() + ": Option \"reference\" provided type \"object\" without a required \"getBoundingClientRect\" method.");
	    }

	    return config;
	  };

	  _proto._getMenuElement = function _getMenuElement() {
	    return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
	  };

	  _proto._getPlacement = function _getPlacement() {
	    var parentDropdown = this._element.parentNode;

	    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
	      return PLACEMENT_RIGHT;
	    }

	    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
	      return PLACEMENT_LEFT;
	    } // We need to trim the value because custom properties can also include spaces


	    var isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

	    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
	      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
	    }

	    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
	  };

	  _proto._detectNavbar = function _detectNavbar() {
	    return this._element.closest("." + CLASS_NAME_NAVBAR) !== null;
	  };

	  _proto._getOffset = function _getOffset() {
	    var _this3 = this;

	    var offset = this._config.offset;

	    if (typeof offset === 'string') {
	      return offset.split(',').map(function (val) {
	        return Number.parseInt(val, 10);
	      });
	    }

	    if (typeof offset === 'function') {
	      return function (popperData) {
	        return offset(popperData, _this3._element);
	      };
	    }

	    return offset;
	  };

	  _proto._getPopperConfig = function _getPopperConfig() {
	    var defaultBsPopperConfig = {
	      placement: this._getPlacement(),
	      modifiers: [{
	        name: 'preventOverflow',
	        options: {
	          boundary: this._config.boundary
	        }
	      }, {
	        name: 'offset',
	        options: {
	          offset: this._getOffset()
	        }
	      }]
	    }; // Disable Popper if we have a static display

	    if (this._config.display === 'static') {
	      defaultBsPopperConfig.modifiers = [{
	        name: 'applyStyles',
	        enabled: false
	      }];
	    }

	    return Object.assign({}, defaultBsPopperConfig, typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig);
	  };

	  _proto._selectMenuItem = function _selectMenuItem(event) {
	    var items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

	    if (!items.length) {
	      return;
	    }

	    var index = items.indexOf(event.target); // Up

	    if (event.key === ARROW_UP_KEY && index > 0) {
	      index--;
	    } // Down


	    if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
	      index++;
	    } // index is -1 if the first keydown is an ArrowUp


	    index = index === -1 ? 0 : index;
	    items[index].focus();
	  } // Static
	  ;

	  Dropdown.dropdownInterface = function dropdownInterface(element, config) {
	    var data = Data.get(element, DATA_KEY$7);

	    var _config = typeof config === 'object' ? config : null;

	    if (!data) {
	      data = new Dropdown(element, _config);
	    }

	    if (typeof config === 'string') {
	      if (typeof data[config] === 'undefined') {
	        throw new TypeError("No method named \"" + config + "\"");
	      }

	      data[config]();
	    }
	  };

	  Dropdown.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      Dropdown.dropdownInterface(this, config);
	    });
	  };

	  Dropdown.clearMenus = function clearMenus(event) {
	    if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) {
	      return;
	    }

	    var toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

	    for (var i = 0, len = toggles.length; i < len; i++) {
	      var context = Data.get(toggles[i], DATA_KEY$7);

	      if (!context || context._config.autoClose === false) {
	        continue;
	      }

	      if (!context._element.classList.contains(CLASS_NAME_SHOW$7)) {
	        continue;
	      }

	      var relatedTarget = {
	        relatedTarget: context._element
	      };

	      if (event) {
	        var composedPath = event.composedPath();
	        var isMenuTarget = composedPath.includes(context._menu);

	        if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
	          continue;
	        } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


	        if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) {
	          continue;
	        }

	        if (event.type === 'click') {
	          relatedTarget.clickEvent = event;
	        }
	      }

	      context._completeHide(relatedTarget);
	    }
	  };

	  Dropdown.getParentFromElement = function getParentFromElement(element) {
	    return getElementFromSelector(element) || element.parentNode;
	  };

	  Dropdown.dataApiKeydownHandler = function dataApiKeydownHandler(event) {
	    var _this4 = this;

	    // If not input/textarea:
	    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
	    // If input/textarea:
	    //  - If space key => not a dropdown command
	    //  - If key is other than escape
	    //    - If key is not up or down => not a dropdown command
	    //    - If trigger inside the menu => not a dropdown command
	    if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
	      return;
	    }

	    var isActive = this.classList.contains(CLASS_NAME_SHOW$7);

	    if (!isActive && event.key === ESCAPE_KEY$2) {
	      return;
	    }

	    event.preventDefault();
	    event.stopPropagation();

	    if (isDisabled(this)) {
	      return;
	    }

	    var getToggleButton = function getToggleButton() {
	      return _this4.matches(SELECTOR_DATA_TOGGLE$3) ? _this4 : SelectorEngine.prev(_this4, SELECTOR_DATA_TOGGLE$3)[0];
	    };

	    if (event.key === ESCAPE_KEY$2) {
	      getToggleButton().focus();
	      Dropdown.clearMenus();
	      return;
	    }

	    if (!isActive && (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY)) {
	      getToggleButton().click();
	      return;
	    }

	    if (!isActive || event.key === SPACE_KEY) {
	      Dropdown.clearMenus();
	      return;
	    }

	    Dropdown.getInstance(getToggleButton())._selectMenuItem(event);
	  };

	  _createClass(Dropdown, null, [{
	    key: "Default",
	    get: function get() {
	      return Default$7;
	    }
	  }, {
	    key: "DefaultType",
	    get: function get() {
	      return DefaultType$7;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$8;
	    }
	  }]);

	  return Dropdown;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
	EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
	EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
	EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
	EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
	  event.preventDefault();
	  Dropdown.dropdownInterface(this);
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Dropdown to jQuery only if jQuery is present
	 */

	defineJQueryPlugin(Dropdown);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Dropdown = Dropdown;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var dropdowns = Joomla.getOptions('bootstrap.dropdown'); // Initialise the elements

	  if (typeof dropdowns === 'object' && dropdowns !== null) {
	    Object.keys(dropdowns).forEach(function (dropdown) {
	      var opt = dropdowns[dropdown];
	      var options = {
	        interval: opt.interval ? opt.interval : 5000,
	        pause: opt.pause ? opt.pause : 'hover'
	      };
	      var elements = Array.from(document.querySelectorAll(dropdown));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Dropdown(el, options);
	        });
	      }
	    });
	  }
	}

	var SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
	var SELECTOR_STICKY_CONTENT = '.sticky-top';

	var getWidth = function getWidth() {
	  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
	  var documentWidth = document.documentElement.clientWidth;
	  return Math.abs(window.innerWidth - documentWidth);
	};

	var hide = function hide(width) {
	  if (width === void 0) {
	    width = getWidth();
	  }

	  _disableOverFlow(); // give padding to element to balances the hidden scrollbar width


	  _setElementAttributes('body', 'paddingRight', function (calculatedValue) {
	    return calculatedValue + width;
	  }); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements, to keep shown fullwidth


	  _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', function (calculatedValue) {
	    return calculatedValue + width;
	  });

	  _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', function (calculatedValue) {
	    return calculatedValue - width;
	  });
	};

	var _disableOverFlow = function _disableOverFlow() {
	  var actualValue = document.body.style.overflow;

	  if (actualValue) {
	    Manipulator.setDataAttribute(document.body, 'overflow', actualValue);
	  }

	  document.body.style.overflow = 'hidden';
	};

	var _setElementAttributes = function _setElementAttributes(selector, styleProp, callback) {
	  var scrollbarWidth = getWidth();
	  SelectorEngine.find(selector).forEach(function (element) {
	    if (element !== document.body && window.innerWidth > element.clientWidth + scrollbarWidth) {
	      return;
	    }

	    var actualValue = element.style[styleProp];
	    var calculatedValue = window.getComputedStyle(element)[styleProp];
	    Manipulator.setDataAttribute(element, styleProp, actualValue);
	    element.style[styleProp] = callback(Number.parseFloat(calculatedValue)) + "px";
	  });
	};

	var reset = function reset() {
	  _resetElementAttributes('body', 'overflow');

	  _resetElementAttributes('body', 'paddingRight');

	  _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

	  _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
	};

	var _resetElementAttributes = function _resetElementAttributes(selector, styleProp) {
	  SelectorEngine.find(selector).forEach(function (element) {
	    var value = Manipulator.getDataAttribute(element, styleProp);

	    if (typeof value === 'undefined') {
	      element.style.removeProperty(styleProp);
	    } else {
	      Manipulator.removeDataAttribute(element, styleProp);
	      element.style[styleProp] = value;
	    }
	  });
	};

	var Default$6 = {
	  isVisible: true,
	  // if false, we use the backdrop helper without adding any element to the dom
	  isAnimated: false,
	  rootElement: document.body,
	  // give the choice to place backdrop under different elements
	  clickCallback: null
	};
	var DefaultType$6 = {
	  isVisible: 'boolean',
	  isAnimated: 'boolean',
	  rootElement: 'element',
	  clickCallback: '(function|null)'
	};
	var NAME$7 = 'backdrop';
	var CLASS_NAME_BACKDROP = 'modal-backdrop';
	var CLASS_NAME_FADE$5 = 'fade';
	var CLASS_NAME_SHOW$6 = 'show';
	var EVENT_MOUSEDOWN = "mousedown.bs." + NAME$7;

	var Backdrop = /*#__PURE__*/function () {
	  function Backdrop(config) {
	    this._config = this._getConfig(config);
	    this._isAppended = false;
	    this._element = null;
	  }

	  var _proto = Backdrop.prototype;

	  _proto.show = function show(callback) {
	    if (!this._config.isVisible) {
	      execute(callback);
	      return;
	    }

	    this._append();

	    if (this._config.isAnimated) {
	      reflow(this._getElement());
	    }

	    this._getElement().classList.add(CLASS_NAME_SHOW$6);

	    this._emulateAnimation(function () {
	      execute(callback);
	    });
	  };

	  _proto.hide = function hide(callback) {
	    var _this = this;

	    if (!this._config.isVisible) {
	      execute(callback);
	      return;
	    }

	    this._getElement().classList.remove(CLASS_NAME_SHOW$6);

	    this._emulateAnimation(function () {
	      _this.dispose();

	      execute(callback);
	    });
	  } // Private
	  ;

	  _proto._getElement = function _getElement() {
	    if (!this._element) {
	      var backdrop = document.createElement('div');
	      backdrop.className = CLASS_NAME_BACKDROP;

	      if (this._config.isAnimated) {
	        backdrop.classList.add(CLASS_NAME_FADE$5);
	      }

	      this._element = backdrop;
	    }

	    return this._element;
	  };

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default$6, typeof config === 'object' ? config : {});
	    config.rootElement = config.rootElement || document.body;
	    typeCheckConfig(NAME$7, config, DefaultType$6);
	    return config;
	  };

	  _proto._append = function _append() {
	    var _this2 = this;

	    if (this._isAppended) {
	      return;
	    }

	    this._config.rootElement.appendChild(this._getElement());

	    EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, function () {
	      execute(_this2._config.clickCallback);
	    });
	    this._isAppended = true;
	  };

	  _proto.dispose = function dispose() {
	    if (!this._isAppended) {
	      return;
	    }

	    EventHandler.off(this._element, EVENT_MOUSEDOWN);

	    this._getElement().parentNode.removeChild(this._element);

	    this._isAppended = false;
	  };

	  _proto._emulateAnimation = function _emulateAnimation(callback) {
	    if (!this._config.isAnimated) {
	      execute(callback);
	      return;
	    }

	    var backdropTransitionDuration = getTransitionDurationFromElement(this._getElement());
	    EventHandler.one(this._getElement(), 'transitionend', function () {
	      return execute(callback);
	    });
	    emulateTransitionEnd(this._getElement(), backdropTransitionDuration);
	  };

	  return Backdrop;
	}();

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$6 = 'modal';
	var DATA_KEY$6 = 'bs.modal';
	var EVENT_KEY$6 = "." + DATA_KEY$6;
	var DATA_API_KEY$3 = '.data-api';
	var ESCAPE_KEY$1 = 'Escape';
	var Default$5 = {
	  backdrop: true,
	  keyboard: true,
	  focus: true
	};
	var DefaultType$5 = {
	  backdrop: '(boolean|string)',
	  keyboard: 'boolean',
	  focus: 'boolean'
	};
	var EVENT_HIDE$3 = "hide" + EVENT_KEY$6;
	var EVENT_HIDE_PREVENTED = "hidePrevented" + EVENT_KEY$6;
	var EVENT_HIDDEN$3 = "hidden" + EVENT_KEY$6;
	var EVENT_SHOW$3 = "show" + EVENT_KEY$6;
	var EVENT_SHOWN$3 = "shown" + EVENT_KEY$6;
	var EVENT_FOCUSIN$2 = "focusin" + EVENT_KEY$6;
	var EVENT_RESIZE = "resize" + EVENT_KEY$6;
	var EVENT_CLICK_DISMISS$2 = "click.dismiss" + EVENT_KEY$6;
	var EVENT_KEYDOWN_DISMISS$1 = "keydown.dismiss" + EVENT_KEY$6;
	var EVENT_MOUSEUP_DISMISS = "mouseup.dismiss" + EVENT_KEY$6;
	var EVENT_MOUSEDOWN_DISMISS = "mousedown.dismiss" + EVENT_KEY$6;
	var EVENT_CLICK_DATA_API$2 = "click" + EVENT_KEY$6 + DATA_API_KEY$3;
	var CLASS_NAME_OPEN = 'modal-open';
	var CLASS_NAME_FADE$4 = 'fade';
	var CLASS_NAME_SHOW$5 = 'show';
	var CLASS_NAME_STATIC = 'modal-static';
	var SELECTOR_DIALOG = '.modal-dialog';
	var SELECTOR_MODAL_BODY = '.modal-body';
	var SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
	var SELECTOR_DATA_DISMISS$2 = '[data-bs-dismiss="modal"]';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Modal = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Modal, _BaseComponent);

	  function Modal(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._config = _this._getConfig(config);
	    _this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, _this._element);
	    _this._backdrop = _this._initializeBackDrop();
	    _this._isShown = false;
	    _this._ignoreBackdropClick = false;
	    _this._isTransitioning = false;
	    return _this;
	  } // Getters


	  var _proto = Modal.prototype;

	  // Public
	  _proto.toggle = function toggle(relatedTarget) {
	    return this._isShown ? this.hide() : this.show(relatedTarget);
	  };

	  _proto.show = function show(relatedTarget) {
	    var _this2 = this;

	    if (this._isShown || this._isTransitioning) {
	      return;
	    }

	    if (this._isAnimated()) {
	      this._isTransitioning = true;
	    }

	    var showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
	      relatedTarget: relatedTarget
	    });

	    if (this._isShown || showEvent.defaultPrevented) {
	      return;
	    }

	    this._isShown = true;
	    hide();
	    document.body.classList.add(CLASS_NAME_OPEN);

	    this._adjustDialog();

	    this._setEscapeEvent();

	    this._setResizeEvent();

	    EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, SELECTOR_DATA_DISMISS$2, function (event) {
	      return _this2.hide(event);
	    });
	    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, function () {
	      EventHandler.one(_this2._element, EVENT_MOUSEUP_DISMISS, function (event) {
	        if (event.target === _this2._element) {
	          _this2._ignoreBackdropClick = true;
	        }
	      });
	    });

	    this._showBackdrop(function () {
	      return _this2._showElement(relatedTarget);
	    });
	  };

	  _proto.hide = function hide(event) {
	    var _this3 = this;

	    if (event) {
	      event.preventDefault();
	    }

	    if (!this._isShown || this._isTransitioning) {
	      return;
	    }

	    var hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

	    if (hideEvent.defaultPrevented) {
	      return;
	    }

	    this._isShown = false;

	    var isAnimated = this._isAnimated();

	    if (isAnimated) {
	      this._isTransitioning = true;
	    }

	    this._setEscapeEvent();

	    this._setResizeEvent();

	    EventHandler.off(document, EVENT_FOCUSIN$2);

	    this._element.classList.remove(CLASS_NAME_SHOW$5);

	    EventHandler.off(this._element, EVENT_CLICK_DISMISS$2);
	    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

	    this._queueCallback(function () {
	      return _this3._hideModal();
	    }, this._element, isAnimated);
	  };

	  _proto.dispose = function dispose() {
	    [window, this._dialog].forEach(function (htmlElement) {
	      return EventHandler.off(htmlElement, EVENT_KEY$6);
	    });

	    this._backdrop.dispose();

	    _BaseComponent.prototype.dispose.call(this);
	    /**
	     * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
	     * Do not move `document` in `htmlElements` array
	     * It will remove `EVENT_CLICK_DATA_API` event that should remain
	     */


	    EventHandler.off(document, EVENT_FOCUSIN$2);
	  };

	  _proto.handleUpdate = function handleUpdate() {
	    this._adjustDialog();
	  } // Private
	  ;

	  _proto._initializeBackDrop = function _initializeBackDrop() {
	    return new Backdrop({
	      isVisible: Boolean(this._config.backdrop),
	      // 'static' option will be translated to true, and booleans will keep their value
	      isAnimated: this._isAnimated()
	    });
	  };

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default$5, Manipulator.getDataAttributes(this._element), config);
	    typeCheckConfig(NAME$6, config, DefaultType$5);
	    return config;
	  };

	  _proto._showElement = function _showElement(relatedTarget) {
	    var _this4 = this;

	    var isAnimated = this._isAnimated();

	    var modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

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

	    if (isAnimated) {
	      reflow(this._element);
	    }

	    this._element.classList.add(CLASS_NAME_SHOW$5);

	    if (this._config.focus) {
	      this._enforceFocus();
	    }

	    var transitionComplete = function transitionComplete() {
	      if (_this4._config.focus) {
	        _this4._element.focus();
	      }

	      _this4._isTransitioning = false;
	      EventHandler.trigger(_this4._element, EVENT_SHOWN$3, {
	        relatedTarget: relatedTarget
	      });
	    };

	    this._queueCallback(transitionComplete, this._dialog, isAnimated);
	  };

	  _proto._enforceFocus = function _enforceFocus() {
	    var _this5 = this;

	    EventHandler.off(document, EVENT_FOCUSIN$2); // guard against infinite focus loop

	    EventHandler.on(document, EVENT_FOCUSIN$2, function (event) {
	      if (document !== event.target && _this5._element !== event.target && !_this5._element.contains(event.target)) {
	        _this5._element.focus();
	      }
	    });
	  };

	  _proto._setEscapeEvent = function _setEscapeEvent() {
	    var _this6 = this;

	    if (this._isShown) {
	      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, function (event) {
	        if (_this6._config.keyboard && event.key === ESCAPE_KEY$1) {
	          event.preventDefault();

	          _this6.hide();
	        } else if (!_this6._config.keyboard && event.key === ESCAPE_KEY$1) {
	          _this6._triggerBackdropTransition();
	        }
	      });
	    } else {
	      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
	    }
	  };

	  _proto._setResizeEvent = function _setResizeEvent() {
	    var _this7 = this;

	    if (this._isShown) {
	      EventHandler.on(window, EVENT_RESIZE, function () {
	        return _this7._adjustDialog();
	      });
	    } else {
	      EventHandler.off(window, EVENT_RESIZE);
	    }
	  };

	  _proto._hideModal = function _hideModal() {
	    var _this8 = this;

	    this._element.style.display = 'none';

	    this._element.setAttribute('aria-hidden', true);

	    this._element.removeAttribute('aria-modal');

	    this._element.removeAttribute('role');

	    this._isTransitioning = false;

	    this._backdrop.hide(function () {
	      document.body.classList.remove(CLASS_NAME_OPEN);

	      _this8._resetAdjustments();

	      reset();
	      EventHandler.trigger(_this8._element, EVENT_HIDDEN$3);
	    });
	  };

	  _proto._showBackdrop = function _showBackdrop(callback) {
	    var _this9 = this;

	    EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, function (event) {
	      if (_this9._ignoreBackdropClick) {
	        _this9._ignoreBackdropClick = false;
	        return;
	      }

	      if (event.target !== event.currentTarget) {
	        return;
	      }

	      if (_this9._config.backdrop === true) {
	        _this9.hide();
	      } else if (_this9._config.backdrop === 'static') {
	        _this9._triggerBackdropTransition();
	      }
	    });

	    this._backdrop.show(callback);
	  };

	  _proto._isAnimated = function _isAnimated() {
	    return this._element.classList.contains(CLASS_NAME_FADE$4);
	  };

	  _proto._triggerBackdropTransition = function _triggerBackdropTransition() {
	    var _this10 = this;

	    var hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

	    if (hideEvent.defaultPrevented) {
	      return;
	    }

	    var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

	    if (!isModalOverflowing) {
	      this._element.style.overflowY = 'hidden';
	    }

	    this._element.classList.add(CLASS_NAME_STATIC);

	    var modalTransitionDuration = getTransitionDurationFromElement(this._dialog);
	    EventHandler.off(this._element, 'transitionend');
	    EventHandler.one(this._element, 'transitionend', function () {
	      _this10._element.classList.remove(CLASS_NAME_STATIC);

	      if (!isModalOverflowing) {
	        EventHandler.one(_this10._element, 'transitionend', function () {
	          _this10._element.style.overflowY = '';
	        });
	        emulateTransitionEnd(_this10._element, modalTransitionDuration);
	      }
	    });
	    emulateTransitionEnd(this._element, modalTransitionDuration);

	    this._element.focus();
	  } // ----------------------------------------------------------------------
	  // the following methods are used to handle overflowing modals
	  // ----------------------------------------------------------------------
	  ;

	  _proto._adjustDialog = function _adjustDialog() {
	    var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
	    var scrollbarWidth = getWidth();
	    var isBodyOverflowing = scrollbarWidth > 0;

	    if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
	      this._element.style.paddingLeft = scrollbarWidth + "px";
	    }

	    if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
	      this._element.style.paddingRight = scrollbarWidth + "px";
	    }
	  };

	  _proto._resetAdjustments = function _resetAdjustments() {
	    this._element.style.paddingLeft = '';
	    this._element.style.paddingRight = '';
	  } // Static
	  ;

	  Modal.jQueryInterface = function jQueryInterface(config, relatedTarget) {
	    return this.each(function () {
	      var data = Modal.getInstance(this) || new Modal(this, typeof config === 'object' ? config : {});

	      if (typeof config !== 'string') {
	        return;
	      }

	      if (typeof data[config] === 'undefined') {
	        throw new TypeError("No method named \"" + config + "\"");
	      }

	      data[config](relatedTarget);
	    });
	  };

	  _createClass(Modal, null, [{
	    key: "Default",
	    get: function get() {
	      return Default$5;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$6;
	    }
	  }]);

	  return Modal;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
	  var _this11 = this;

	  var target = getElementFromSelector(this);

	  if (['A', 'AREA'].includes(this.tagName)) {
	    event.preventDefault();
	  }

	  EventHandler.one(target, EVENT_SHOW$3, function (showEvent) {
	    if (showEvent.defaultPrevented) {
	      // only register focus restorer if modal will actually get shown
	      return;
	    }

	    EventHandler.one(target, EVENT_HIDDEN$3, function () {
	      if (isVisible(_this11)) {
	        _this11.focus();
	      }
	    });
	  });
	  var data = Modal.getInstance(target) || new Modal(target);
	  data.toggle(this);
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Modal to jQuery only if jQuery is present
	 */

	defineJQueryPlugin(Modal);

	Joomla = Joomla || {};
	Joomla.Modal = Joomla.Modal || {};
	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Modal = Modal;

	Joomla.initialiseModal = function (modal, options) {
	  if (!(modal instanceof Element)) {
	    return;
	  } // eslint-disable-next-line no-new


	  new window.bootstrap.Modal(modal, options); // Comply with the Joomla API - Bound element.open/close

	  modal.open = function () {
	    window.bootstrap.Modal.getInstance(modal).show(modal);
	  };

	  modal.close = function () {
	    window.bootstrap.Modal.getInstance(modal).hide();
	  }; // Do some Joomla specific changes


	  modal.addEventListener('show.bs.modal', function () {
	    // Comply with the Joomla API - Set the current Modal ID
	    Joomla.Modal.setCurrent(modal);

	    if (modal.dataset.url) {
	      var modalBody = modal.querySelector('.modal-body');
	      var iframe = modalBody.querySelector('iframe');

	      if (iframe) {
	        var addData = modal.querySelector('joomla-field-mediamore');

	        if (addData) {
	          addData.parentNode.removeChild(addData);
	        }

	        iframe.parentNode.removeChild(iframe);
	      } // @todo merge https://github.com/joomla/joomla-cms/pull/20788
	      // Hacks because com_associations and field modals use pure javascript in the url!


	      if (modal.dataset.iframe.indexOf('document.getElementById') > 0) {
	        var iframeTextArr = modal.dataset.iframe.split('+');
	        var idFieldArr = iframeTextArr[1].split('"');
	        var el;
	        idFieldArr[0] = idFieldArr[0].replace(/&quot;/g, '"');

	        if (!document.getElementById(idFieldArr[1])) {
	          // eslint-disable-next-line no-new-func
	          var fn = new Function("return " + idFieldArr[0]); // This is UNSAFE!!!!

	          el = fn.call(null);
	        } else {
	          el = document.getElementById(idFieldArr[1]).value;
	        }

	        modalBody.insertAdjacentHTML('afterbegin', "" + iframeTextArr[0] + el + iframeTextArr[2]);
	      } else {
	        modalBody.insertAdjacentHTML('afterbegin', modal.dataset.iframe);
	      }
	    }
	  });
	  modal.addEventListener('shown.bs.modal', function () {
	    var modalBody = modal.querySelector('.modal-body');
	    var modalHeader = modal.querySelector('.modal-header');
	    var modalFooter = modal.querySelector('.modal-footer');
	    var modalHeaderHeight = 0;
	    var modalFooterHeight = 0;
	    var maxModalBodyHeight = 0;
	    var modalBodyPadding = 0;
	    var modalBodyHeightOuter = 0;

	    if (modalBody) {
	      if (modalHeader) {
	        var modalHeaderRects = modalHeader.getBoundingClientRect();
	        modalHeaderHeight = modalHeaderRects.height;
	        modalBodyHeightOuter = modalBody.offsetHeight;
	      }

	      if (modalFooter) {
	        modalFooterHeight = parseFloat(getComputedStyle(modalFooter, null).height.replace('px', ''));
	      }

	      var modalBodyHeight = parseFloat(getComputedStyle(modalBody, null).height.replace('px', ''));
	      var padding = modalBody.offsetTop;
	      var maxModalHeight = parseFloat(getComputedStyle(document.body, null).height.replace('px', '')) - padding * 2;
	      modalBodyPadding = modalBodyHeightOuter - modalBodyHeight; // eslint-disable-next-line max-len

	      maxModalBodyHeight = maxModalHeight - (modalHeaderHeight + modalFooterHeight + modalBodyPadding);
	    }

	    if (modal.dataset.url) {
	      var iframeEl = modal.querySelector('iframe');
	      var iframeHeight = parseFloat(getComputedStyle(iframeEl, null).height.replace('px', ''));

	      if (iframeHeight > maxModalBodyHeight) {
	        modalBody.style.maxHeight = maxModalBodyHeight;
	        modalBody.style.overflowY = 'auto';
	        iframeEl.style.maxHeight = maxModalBodyHeight - modalBodyPadding;
	      }
	    }
	  });
	  modal.addEventListener('hide.bs.modal', function () {
	    var modalBody = modal.querySelector('.modal-body');
	    modalBody.style.maxHeight = 'initial';
	  });
	  modal.addEventListener('hidden.bs.modal', function () {
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
	 * @since   4.0.0
	 */


	Joomla.iframeButtonClick = function (options) {
	  if (!options.iframeSelector || !options.buttonSelector) {
	    throw new Error('Selector is missing');
	  }

	  var iframe = document.querySelector(options.iframeSelector + " iframe");

	  if (iframe) {
	    var button = iframe.contentWindow.document.querySelector(options.buttonSelector);

	    if (button) {
	      button.click();
	    }
	  }
	};

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var modals = Joomla.getOptions('bootstrap.modal'); // Initialise the elements

	  if (typeof modals === 'object' && modals !== null) {
	    Object.keys(modals).forEach(function (modal) {
	      var opt = modals[modal];
	      var options = {
	        backdrop: opt.backdrop ? opt.backdrop : true,
	        keyboard: opt.keyboard ? opt.keyboard : true,
	        focus: opt.focus ? opt.focus : true
	      };
	      Array.from(document.querySelectorAll(modal)).map(function (modalEl) {
	        return Joomla.initialiseModal(modalEl, options);
	      });
	    });
	  }
	}

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$5 = 'offcanvas';
	var DATA_KEY$5 = 'bs.offcanvas';
	var EVENT_KEY$5 = "." + DATA_KEY$5;
	var DATA_API_KEY$2 = '.data-api';
	var EVENT_LOAD_DATA_API$1 = "load" + EVENT_KEY$5 + DATA_API_KEY$2;
	var ESCAPE_KEY = 'Escape';
	var Default$4 = {
	  backdrop: true,
	  keyboard: true,
	  scroll: false
	};
	var DefaultType$4 = {
	  backdrop: 'boolean',
	  keyboard: 'boolean',
	  scroll: 'boolean'
	};
	var CLASS_NAME_SHOW$4 = 'show';
	var OPEN_SELECTOR = '.offcanvas.show';
	var EVENT_SHOW$2 = "show" + EVENT_KEY$5;
	var EVENT_SHOWN$2 = "shown" + EVENT_KEY$5;
	var EVENT_HIDE$2 = "hide" + EVENT_KEY$5;
	var EVENT_HIDDEN$2 = "hidden" + EVENT_KEY$5;
	var EVENT_FOCUSIN$1 = "focusin" + EVENT_KEY$5;
	var EVENT_CLICK_DATA_API$1 = "click" + EVENT_KEY$5 + DATA_API_KEY$2;
	var EVENT_CLICK_DISMISS$1 = "click.dismiss" + EVENT_KEY$5;
	var EVENT_KEYDOWN_DISMISS = "keydown.dismiss" + EVENT_KEY$5;
	var SELECTOR_DATA_DISMISS$1 = '[data-bs-dismiss="offcanvas"]';
	var SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Offcanvas = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Offcanvas, _BaseComponent);

	  function Offcanvas(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._config = _this._getConfig(config);
	    _this._isShown = false;
	    _this._backdrop = _this._initializeBackDrop();

	    _this._addEventListeners();

	    return _this;
	  } // Getters


	  var _proto = Offcanvas.prototype;

	  // Public
	  _proto.toggle = function toggle(relatedTarget) {
	    return this._isShown ? this.hide() : this.show(relatedTarget);
	  };

	  _proto.show = function show(relatedTarget) {
	    var _this2 = this;

	    if (this._isShown) {
	      return;
	    }

	    var showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
	      relatedTarget: relatedTarget
	    });

	    if (showEvent.defaultPrevented) {
	      return;
	    }

	    this._isShown = true;
	    this._element.style.visibility = 'visible';

	    this._backdrop.show();

	    if (!this._config.scroll) {
	      hide();

	      this._enforceFocusOnElement(this._element);
	    }

	    this._element.removeAttribute('aria-hidden');

	    this._element.setAttribute('aria-modal', true);

	    this._element.setAttribute('role', 'dialog');

	    this._element.classList.add(CLASS_NAME_SHOW$4);

	    var completeCallBack = function completeCallBack() {
	      EventHandler.trigger(_this2._element, EVENT_SHOWN$2, {
	        relatedTarget: relatedTarget
	      });
	    };

	    this._queueCallback(completeCallBack, this._element, true);
	  };

	  _proto.hide = function hide() {
	    var _this3 = this;

	    if (!this._isShown) {
	      return;
	    }

	    var hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

	    if (hideEvent.defaultPrevented) {
	      return;
	    }

	    EventHandler.off(document, EVENT_FOCUSIN$1);

	    this._element.blur();

	    this._isShown = false;

	    this._element.classList.remove(CLASS_NAME_SHOW$4);

	    this._backdrop.hide();

	    var completeCallback = function completeCallback() {
	      _this3._element.setAttribute('aria-hidden', true);

	      _this3._element.removeAttribute('aria-modal');

	      _this3._element.removeAttribute('role');

	      _this3._element.style.visibility = 'hidden';

	      if (!_this3._config.scroll) {
	        reset();
	      }

	      EventHandler.trigger(_this3._element, EVENT_HIDDEN$2);
	    };

	    this._queueCallback(completeCallback, this._element, true);
	  };

	  _proto.dispose = function dispose() {
	    this._backdrop.dispose();

	    _BaseComponent.prototype.dispose.call(this);

	    EventHandler.off(document, EVENT_FOCUSIN$1);
	  } // Private
	  ;

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default$4, Manipulator.getDataAttributes(this._element), typeof config === 'object' ? config : {});
	    typeCheckConfig(NAME$5, config, DefaultType$4);
	    return config;
	  };

	  _proto._initializeBackDrop = function _initializeBackDrop() {
	    var _this4 = this;

	    return new Backdrop({
	      isVisible: this._config.backdrop,
	      isAnimated: true,
	      rootElement: this._element.parentNode,
	      clickCallback: function clickCallback() {
	        return _this4.hide();
	      }
	    });
	  };

	  _proto._enforceFocusOnElement = function _enforceFocusOnElement(element) {
	    EventHandler.off(document, EVENT_FOCUSIN$1); // guard against infinite focus loop

	    EventHandler.on(document, EVENT_FOCUSIN$1, function (event) {
	      if (document !== event.target && element !== event.target && !element.contains(event.target)) {
	        element.focus();
	      }
	    });
	    element.focus();
	  };

	  _proto._addEventListeners = function _addEventListeners() {
	    var _this5 = this;

	    EventHandler.on(this._element, EVENT_CLICK_DISMISS$1, SELECTOR_DATA_DISMISS$1, function () {
	      return _this5.hide();
	    });
	    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, function (event) {
	      if (_this5._config.keyboard && event.key === ESCAPE_KEY) {
	        _this5.hide();
	      }
	    });
	  } // Static
	  ;

	  Offcanvas.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY$5) || new Offcanvas(this, typeof config === 'object' ? config : {});

	      if (typeof config !== 'string') {
	        return;
	      }

	      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
	        throw new TypeError("No method named \"" + config + "\"");
	      }

	      data[config](this);
	    });
	  };

	  _createClass(Offcanvas, null, [{
	    key: "NAME",
	    get: function get() {
	      return NAME$5;
	    }
	  }, {
	    key: "Default",
	    get: function get() {
	      return Default$4;
	    }
	  }]);

	  return Offcanvas;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
	  var _this6 = this;

	  var target = getElementFromSelector(this);

	  if (['A', 'AREA'].includes(this.tagName)) {
	    event.preventDefault();
	  }

	  if (isDisabled(this)) {
	    return;
	  }

	  EventHandler.one(target, EVENT_HIDDEN$2, function () {
	    // focus on trigger when it is closed
	    if (isVisible(_this6)) {
	      _this6.focus();
	    }
	  }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

	  var allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

	  if (allReadyOpen && allReadyOpen !== target) {
	    Offcanvas.getInstance(allReadyOpen).hide();
	  }

	  var data = Data.get(target, DATA_KEY$5) || new Offcanvas(target);
	  data.toggle(this);
	});
	EventHandler.on(window, EVENT_LOAD_DATA_API$1, function () {
	  SelectorEngine.find(OPEN_SELECTOR).forEach(function (el) {
	    return (Data.get(el, DATA_KEY$5) || new Offcanvas(el)).show();
	  });
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 */

	defineJQueryPlugin(Offcanvas);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Offcanvas = Offcanvas;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var offcanvases = Joomla.getOptions('bootstrap.offcanvas'); // Initialise the elements

	  if (typeof offcanvases === 'object' && offcanvases !== null) {
	    Object.keys(offcanvases).forEach(function (offcanvas) {
	      var opt = offcanvases[offcanvas];
	      var options = {
	        backdrop: opt.backdrop ? opt.backdrop : true,
	        keyboard: opt.keyboard ? opt.keyboard : true,
	        scroll: opt.scroll ? opt.scroll : true
	      };
	      var elements = Array.from(document.querySelectorAll(offcanvas));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Offcanvas(el, options);
	        });
	      }
	    });
	  }
	}

	/**
	 * --------------------------------------------------------------------------
	 * Bootstrap (v5.0.1): util/sanitizer.js
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	 * --------------------------------------------------------------------------
	 */
	var uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
	var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
	/**
	 * A pattern that recognizes a commonly useful subset of URLs that are safe.
	 *
	 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
	 */

	var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i;
	/**
	 * A pattern that matches safe data URLs. Only matches image, video and audio types.
	 *
	 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
	 */

	var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

	var allowedAttribute = function allowedAttribute(attr, allowedAttributeList) {
	  var attrName = attr.nodeName.toLowerCase();

	  if (allowedAttributeList.includes(attrName)) {
	    if (uriAttrs.has(attrName)) {
	      return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
	    }

	    return true;
	  }

	  var regExp = allowedAttributeList.filter(function (attrRegex) {
	    return attrRegex instanceof RegExp;
	  }); // Check if a regular expression validates the attribute.

	  for (var i = 0, len = regExp.length; i < len; i++) {
	    if (regExp[i].test(attrName)) {
	      return true;
	    }
	  }

	  return false;
	};

	var DefaultAllowlist = {
	  // Global attributes allowed on any supplied element below.
	  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
	  a: ['target', 'href', 'title', 'rel'],
	  area: [],
	  b: [],
	  br: [],
	  col: [],
	  code: [],
	  div: [],
	  em: [],
	  hr: [],
	  h1: [],
	  h2: [],
	  h3: [],
	  h4: [],
	  h5: [],
	  h6: [],
	  i: [],
	  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
	  li: [],
	  ol: [],
	  p: [],
	  pre: [],
	  s: [],
	  small: [],
	  span: [],
	  sub: [],
	  sup: [],
	  strong: [],
	  u: [],
	  ul: []
	};
	function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
	  var _ref;

	  if (!unsafeHtml.length) {
	    return unsafeHtml;
	  }

	  if (sanitizeFn && typeof sanitizeFn === 'function') {
	    return sanitizeFn(unsafeHtml);
	  }

	  var domParser = new window.DOMParser();
	  var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
	  var allowlistKeys = Object.keys(allowList);

	  var elements = (_ref = []).concat.apply(_ref, createdDocument.body.querySelectorAll('*'));

	  var _loop = function _loop(i, len) {
	    var _ref2;

	    var el = elements[i];
	    var elName = el.nodeName.toLowerCase();

	    if (!allowlistKeys.includes(elName)) {
	      el.parentNode.removeChild(el);
	      return "continue";
	    }

	    var attributeList = (_ref2 = []).concat.apply(_ref2, el.attributes);

	    var allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
	    attributeList.forEach(function (attr) {
	      if (!allowedAttribute(attr, allowedAttributes)) {
	        el.removeAttribute(attr.nodeName);
	      }
	    });
	  };

	  for (var i = 0, len = elements.length; i < len; i++) {
	    var _ret = _loop(i);

	    if (_ret === "continue") continue;
	  }

	  return createdDocument.body.innerHTML;
	}

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$4 = 'tooltip';
	var DATA_KEY$4 = 'bs.tooltip';
	var EVENT_KEY$4 = "." + DATA_KEY$4;
	var CLASS_PREFIX$1 = 'bs-tooltip';
	var BSCLS_PREFIX_REGEX$1 = new RegExp("(^|\\s)" + CLASS_PREFIX$1 + "\\S+", 'g');
	var DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
	var DefaultType$3 = {
	  animation: 'boolean',
	  template: 'string',
	  title: '(string|element|function)',
	  trigger: 'string',
	  delay: '(number|object)',
	  html: 'boolean',
	  selector: '(string|boolean)',
	  placement: '(string|function)',
	  offset: '(array|string|function)',
	  container: '(string|element|boolean)',
	  fallbackPlacements: 'array',
	  boundary: '(string|element)',
	  customClass: '(string|function)',
	  sanitize: 'boolean',
	  sanitizeFn: '(null|function)',
	  allowList: 'object',
	  popperConfig: '(null|object|function)'
	};
	var AttachmentMap = {
	  AUTO: 'auto',
	  TOP: 'top',
	  RIGHT: isRTL() ? 'left' : 'right',
	  BOTTOM: 'bottom',
	  LEFT: isRTL() ? 'right' : 'left'
	};
	var Default$3 = {
	  animation: true,
	  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
	  trigger: 'hover focus',
	  title: '',
	  delay: 0,
	  html: false,
	  selector: false,
	  placement: 'top',
	  offset: [0, 0],
	  container: false,
	  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
	  boundary: 'clippingParents',
	  customClass: '',
	  sanitize: true,
	  sanitizeFn: null,
	  allowList: DefaultAllowlist,
	  popperConfig: null
	};
	var Event$2 = {
	  HIDE: "hide" + EVENT_KEY$4,
	  HIDDEN: "hidden" + EVENT_KEY$4,
	  SHOW: "show" + EVENT_KEY$4,
	  SHOWN: "shown" + EVENT_KEY$4,
	  INSERTED: "inserted" + EVENT_KEY$4,
	  CLICK: "click" + EVENT_KEY$4,
	  FOCUSIN: "focusin" + EVENT_KEY$4,
	  FOCUSOUT: "focusout" + EVENT_KEY$4,
	  MOUSEENTER: "mouseenter" + EVENT_KEY$4,
	  MOUSELEAVE: "mouseleave" + EVENT_KEY$4
	};
	var CLASS_NAME_FADE$3 = 'fade';
	var CLASS_NAME_MODAL = 'modal';
	var CLASS_NAME_SHOW$3 = 'show';
	var HOVER_STATE_SHOW = 'show';
	var HOVER_STATE_OUT = 'out';
	var SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
	var TRIGGER_HOVER = 'hover';
	var TRIGGER_FOCUS = 'focus';
	var TRIGGER_CLICK = 'click';
	var TRIGGER_MANUAL = 'manual';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Tooltip = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Tooltip, _BaseComponent);

	  function Tooltip(element, config) {
	    var _this;

	    if (typeof Popper === 'undefined') {
	      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
	    }

	    _this = _BaseComponent.call(this, element) || this; // private

	    _this._isEnabled = true;
	    _this._timeout = 0;
	    _this._hoverState = '';
	    _this._activeTrigger = {};
	    _this._popper = null; // Protected

	    _this._config = _this._getConfig(config);
	    _this.tip = null;

	    _this._setListeners();

	    return _this;
	  } // Getters


	  var _proto = Tooltip.prototype;

	  // Public
	  _proto.enable = function enable() {
	    this._isEnabled = true;
	  };

	  _proto.disable = function disable() {
	    this._isEnabled = false;
	  };

	  _proto.toggleEnabled = function toggleEnabled() {
	    this._isEnabled = !this._isEnabled;
	  };

	  _proto.toggle = function toggle(event) {
	    if (!this._isEnabled) {
	      return;
	    }

	    if (event) {
	      var context = this._initializeOnDelegatedTarget(event);

	      context._activeTrigger.click = !context._activeTrigger.click;

	      if (context._isWithActiveTrigger()) {
	        context._enter(null, context);
	      } else {
	        context._leave(null, context);
	      }
	    } else {
	      if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$3)) {
	        this._leave(null, this);

	        return;
	      }

	      this._enter(null, this);
	    }
	  };

	  _proto.dispose = function dispose() {
	    clearTimeout(this._timeout);
	    EventHandler.off(this._element.closest("." + CLASS_NAME_MODAL), 'hide.bs.modal', this._hideModalHandler);

	    if (this.tip && this.tip.parentNode) {
	      this.tip.parentNode.removeChild(this.tip);
	    }

	    if (this._popper) {
	      this._popper.destroy();
	    }

	    _BaseComponent.prototype.dispose.call(this);
	  };

	  _proto.show = function show() {
	    var _this2 = this;

	    if (this._element.style.display === 'none') {
	      throw new Error('Please use show on visible elements');
	    }

	    if (!(this.isWithContent() && this._isEnabled)) {
	      return;
	    }

	    var showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
	    var shadowRoot = findShadowRoot(this._element);
	    var isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

	    if (showEvent.defaultPrevented || !isInTheDom) {
	      return;
	    }

	    var tip = this.getTipElement();
	    var tipId = getUID(this.constructor.NAME);
	    tip.setAttribute('id', tipId);

	    this._element.setAttribute('aria-describedby', tipId);

	    this.setContent();

	    if (this._config.animation) {
	      tip.classList.add(CLASS_NAME_FADE$3);
	    }

	    var placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

	    var attachment = this._getAttachment(placement);

	    this._addAttachmentClass(attachment);

	    var container = this._config.container;
	    Data.set(tip, this.constructor.DATA_KEY, this);

	    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
	      container.appendChild(tip);
	      EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
	    }

	    if (this._popper) {
	      this._popper.update();
	    } else {
	      this._popper = createPopper(this._element, tip, this._getPopperConfig(attachment));
	    }

	    tip.classList.add(CLASS_NAME_SHOW$3);
	    var customClass = typeof this._config.customClass === 'function' ? this._config.customClass() : this._config.customClass;

	    if (customClass) {
	      var _tip$classList;

	      (_tip$classList = tip.classList).add.apply(_tip$classList, customClass.split(' '));
	    } // If this is a touch-enabled device we add extra
	    // empty mouseover listeners to the body's immediate children;
	    // only needed because of broken event delegation on iOS
	    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


	    if ('ontouchstart' in document.documentElement) {
	      var _ref;

	      (_ref = []).concat.apply(_ref, document.body.children).forEach(function (element) {
	        EventHandler.on(element, 'mouseover', noop);
	      });
	    }

	    var complete = function complete() {
	      var prevHoverState = _this2._hoverState;
	      _this2._hoverState = null;
	      EventHandler.trigger(_this2._element, _this2.constructor.Event.SHOWN);

	      if (prevHoverState === HOVER_STATE_OUT) {
	        _this2._leave(null, _this2);
	      }
	    };

	    var isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

	    this._queueCallback(complete, this.tip, isAnimated);
	  };

	  _proto.hide = function hide() {
	    var _this3 = this;

	    if (!this._popper) {
	      return;
	    }

	    var tip = this.getTipElement();

	    var complete = function complete() {
	      if (_this3._isWithActiveTrigger()) {
	        return;
	      }

	      if (_this3._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
	        tip.parentNode.removeChild(tip);
	      }

	      _this3._cleanTipClass();

	      _this3._element.removeAttribute('aria-describedby');

	      EventHandler.trigger(_this3._element, _this3.constructor.Event.HIDDEN);

	      if (_this3._popper) {
	        _this3._popper.destroy();

	        _this3._popper = null;
	      }
	    };

	    var hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

	    if (hideEvent.defaultPrevented) {
	      return;
	    }

	    tip.classList.remove(CLASS_NAME_SHOW$3); // If this is a touch-enabled device we remove the extra
	    // empty mouseover listeners we added for iOS support

	    if ('ontouchstart' in document.documentElement) {
	      var _ref2;

	      (_ref2 = []).concat.apply(_ref2, document.body.children).forEach(function (element) {
	        return EventHandler.off(element, 'mouseover', noop);
	      });
	    }

	    this._activeTrigger[TRIGGER_CLICK] = false;
	    this._activeTrigger[TRIGGER_FOCUS] = false;
	    this._activeTrigger[TRIGGER_HOVER] = false;
	    var isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

	    this._queueCallback(complete, this.tip, isAnimated);

	    this._hoverState = '';
	  };

	  _proto.update = function update() {
	    if (this._popper !== null) {
	      this._popper.update();
	    }
	  } // Protected
	  ;

	  _proto.isWithContent = function isWithContent() {
	    return Boolean(this.getTitle());
	  };

	  _proto.getTipElement = function getTipElement() {
	    if (this.tip) {
	      return this.tip;
	    }

	    var element = document.createElement('div');
	    element.innerHTML = this._config.template;
	    this.tip = element.children[0];
	    return this.tip;
	  };

	  _proto.setContent = function setContent() {
	    var tip = this.getTipElement();
	    this.setElementContent(SelectorEngine.findOne(SELECTOR_TOOLTIP_INNER, tip), this.getTitle());
	    tip.classList.remove(CLASS_NAME_FADE$3, CLASS_NAME_SHOW$3);
	  };

	  _proto.setElementContent = function setElementContent(element, content) {
	    if (element === null) {
	      return;
	    }

	    if (isElement$1(content)) {
	      content = getElement(content); // content is a DOM node or a jQuery

	      if (this._config.html) {
	        if (content.parentNode !== element) {
	          element.innerHTML = '';
	          element.appendChild(content);
	        }
	      } else {
	        element.textContent = content.textContent;
	      }

	      return;
	    }

	    if (this._config.html) {
	      if (this._config.sanitize) {
	        content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
	      }

	      element.innerHTML = content;
	    } else {
	      element.textContent = content;
	    }
	  };

	  _proto.getTitle = function getTitle() {
	    var title = this._element.getAttribute('data-bs-original-title');

	    if (!title) {
	      title = typeof this._config.title === 'function' ? this._config.title.call(this._element) : this._config.title;
	    }

	    return title;
	  };

	  _proto.updateAttachment = function updateAttachment(attachment) {
	    if (attachment === 'right') {
	      return 'end';
	    }

	    if (attachment === 'left') {
	      return 'start';
	    }

	    return attachment;
	  } // Private
	  ;

	  _proto._initializeOnDelegatedTarget = function _initializeOnDelegatedTarget(event, context) {
	    var dataKey = this.constructor.DATA_KEY;
	    context = context || Data.get(event.delegateTarget, dataKey);

	    if (!context) {
	      context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
	      Data.set(event.delegateTarget, dataKey, context);
	    }

	    return context;
	  };

	  _proto._getOffset = function _getOffset() {
	    var _this4 = this;

	    var offset = this._config.offset;

	    if (typeof offset === 'string') {
	      return offset.split(',').map(function (val) {
	        return Number.parseInt(val, 10);
	      });
	    }

	    if (typeof offset === 'function') {
	      return function (popperData) {
	        return offset(popperData, _this4._element);
	      };
	    }

	    return offset;
	  };

	  _proto._getPopperConfig = function _getPopperConfig(attachment) {
	    var _this5 = this;

	    var defaultBsPopperConfig = {
	      placement: attachment,
	      modifiers: [{
	        name: 'flip',
	        options: {
	          fallbackPlacements: this._config.fallbackPlacements
	        }
	      }, {
	        name: 'offset',
	        options: {
	          offset: this._getOffset()
	        }
	      }, {
	        name: 'preventOverflow',
	        options: {
	          boundary: this._config.boundary
	        }
	      }, {
	        name: 'arrow',
	        options: {
	          element: "." + this.constructor.NAME + "-arrow"
	        }
	      }, {
	        name: 'onChange',
	        enabled: true,
	        phase: 'afterWrite',
	        fn: function fn(data) {
	          return _this5._handlePopperPlacementChange(data);
	        }
	      }],
	      onFirstUpdate: function onFirstUpdate(data) {
	        if (data.options.placement !== data.placement) {
	          _this5._handlePopperPlacementChange(data);
	        }
	      }
	    };
	    return Object.assign({}, defaultBsPopperConfig, typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig);
	  };

	  _proto._addAttachmentClass = function _addAttachmentClass(attachment) {
	    this.getTipElement().classList.add(CLASS_PREFIX$1 + "-" + this.updateAttachment(attachment));
	  };

	  _proto._getAttachment = function _getAttachment(placement) {
	    return AttachmentMap[placement.toUpperCase()];
	  };

	  _proto._setListeners = function _setListeners() {
	    var _this6 = this;

	    var triggers = this._config.trigger.split(' ');

	    triggers.forEach(function (trigger) {
	      if (trigger === 'click') {
	        EventHandler.on(_this6._element, _this6.constructor.Event.CLICK, _this6._config.selector, function (event) {
	          return _this6.toggle(event);
	        });
	      } else if (trigger !== TRIGGER_MANUAL) {
	        var eventIn = trigger === TRIGGER_HOVER ? _this6.constructor.Event.MOUSEENTER : _this6.constructor.Event.FOCUSIN;
	        var eventOut = trigger === TRIGGER_HOVER ? _this6.constructor.Event.MOUSELEAVE : _this6.constructor.Event.FOCUSOUT;
	        EventHandler.on(_this6._element, eventIn, _this6._config.selector, function (event) {
	          return _this6._enter(event);
	        });
	        EventHandler.on(_this6._element, eventOut, _this6._config.selector, function (event) {
	          return _this6._leave(event);
	        });
	      }
	    });

	    this._hideModalHandler = function () {
	      if (_this6._element) {
	        _this6.hide();
	      }
	    };

	    EventHandler.on(this._element.closest("." + CLASS_NAME_MODAL), 'hide.bs.modal', this._hideModalHandler);

	    if (this._config.selector) {
	      this._config = Object.assign({}, this._config, {
	        trigger: 'manual',
	        selector: ''
	      });
	    } else {
	      this._fixTitle();
	    }
	  };

	  _proto._fixTitle = function _fixTitle() {
	    var title = this._element.getAttribute('title');

	    var originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

	    if (title || originalTitleType !== 'string') {
	      this._element.setAttribute('data-bs-original-title', title || '');

	      if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
	        this._element.setAttribute('aria-label', title);
	      }

	      this._element.setAttribute('title', '');
	    }
	  };

	  _proto._enter = function _enter(event, context) {
	    context = this._initializeOnDelegatedTarget(event, context);

	    if (event) {
	      context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
	    }

	    if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$3) || context._hoverState === HOVER_STATE_SHOW) {
	      context._hoverState = HOVER_STATE_SHOW;
	      return;
	    }

	    clearTimeout(context._timeout);
	    context._hoverState = HOVER_STATE_SHOW;

	    if (!context._config.delay || !context._config.delay.show) {
	      context.show();
	      return;
	    }

	    context._timeout = setTimeout(function () {
	      if (context._hoverState === HOVER_STATE_SHOW) {
	        context.show();
	      }
	    }, context._config.delay.show);
	  };

	  _proto._leave = function _leave(event, context) {
	    context = this._initializeOnDelegatedTarget(event, context);

	    if (event) {
	      context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
	    }

	    if (context._isWithActiveTrigger()) {
	      return;
	    }

	    clearTimeout(context._timeout);
	    context._hoverState = HOVER_STATE_OUT;

	    if (!context._config.delay || !context._config.delay.hide) {
	      context.hide();
	      return;
	    }

	    context._timeout = setTimeout(function () {
	      if (context._hoverState === HOVER_STATE_OUT) {
	        context.hide();
	      }
	    }, context._config.delay.hide);
	  };

	  _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
	    for (var trigger in this._activeTrigger) {
	      if (this._activeTrigger[trigger]) {
	        return true;
	      }
	    }

	    return false;
	  };

	  _proto._getConfig = function _getConfig(config) {
	    var dataAttributes = Manipulator.getDataAttributes(this._element);
	    Object.keys(dataAttributes).forEach(function (dataAttr) {
	      if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
	        delete dataAttributes[dataAttr];
	      }
	    });
	    config = Object.assign({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});
	    config.container = config.container === false ? document.body : getElement(config.container);

	    if (typeof config.delay === 'number') {
	      config.delay = {
	        show: config.delay,
	        hide: config.delay
	      };
	    }

	    if (typeof config.title === 'number') {
	      config.title = config.title.toString();
	    }

	    if (typeof config.content === 'number') {
	      config.content = config.content.toString();
	    }

	    typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

	    if (config.sanitize) {
	      config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
	    }

	    return config;
	  };

	  _proto._getDelegateConfig = function _getDelegateConfig() {
	    var config = {};

	    if (this._config) {
	      for (var key in this._config) {
	        if (this.constructor.Default[key] !== this._config[key]) {
	          config[key] = this._config[key];
	        }
	      }
	    }

	    return config;
	  };

	  _proto._cleanTipClass = function _cleanTipClass() {
	    var tip = this.getTipElement();
	    var tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX$1);

	    if (tabClass !== null && tabClass.length > 0) {
	      tabClass.map(function (token) {
	        return token.trim();
	      }).forEach(function (tClass) {
	        return tip.classList.remove(tClass);
	      });
	    }
	  };

	  _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
	    var state = popperData.state;

	    if (!state) {
	      return;
	    }

	    this.tip = state.elements.popper;

	    this._cleanTipClass();

	    this._addAttachmentClass(this._getAttachment(state.placement));
	  } // Static
	  ;

	  Tooltip.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY$4);

	      var _config = typeof config === 'object' && config;

	      if (!data && /dispose|hide/.test(config)) {
	        return;
	      }

	      if (!data) {
	        data = new Tooltip(this, _config);
	      }

	      if (typeof config === 'string') {
	        if (typeof data[config] === 'undefined') {
	          throw new TypeError("No method named \"" + config + "\"");
	        }

	        data[config]();
	      }
	    });
	  };

	  _createClass(Tooltip, null, [{
	    key: "Default",
	    get: function get() {
	      return Default$3;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$4;
	    }
	  }, {
	    key: "Event",
	    get: function get() {
	      return Event$2;
	    }
	  }, {
	    key: "DefaultType",
	    get: function get() {
	      return DefaultType$3;
	    }
	  }]);

	  return Tooltip;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Tooltip to jQuery only if jQuery is present
	 */


	defineJQueryPlugin(Tooltip);

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$3 = 'popover';
	var DATA_KEY$3 = 'bs.popover';
	var EVENT_KEY$3 = "." + DATA_KEY$3;
	var CLASS_PREFIX = 'bs-popover';
	var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
	var Default$2 = Object.assign({}, Tooltip.Default, {
	  placement: 'right',
	  offset: [0, 8],
	  trigger: 'click',
	  content: '',
	  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
	});
	var DefaultType$2 = Object.assign({}, Tooltip.DefaultType, {
	  content: '(string|element|function)'
	});
	var Event$1 = {
	  HIDE: "hide" + EVENT_KEY$3,
	  HIDDEN: "hidden" + EVENT_KEY$3,
	  SHOW: "show" + EVENT_KEY$3,
	  SHOWN: "shown" + EVENT_KEY$3,
	  INSERTED: "inserted" + EVENT_KEY$3,
	  CLICK: "click" + EVENT_KEY$3,
	  FOCUSIN: "focusin" + EVENT_KEY$3,
	  FOCUSOUT: "focusout" + EVENT_KEY$3,
	  MOUSEENTER: "mouseenter" + EVENT_KEY$3,
	  MOUSELEAVE: "mouseleave" + EVENT_KEY$3
	};
	var CLASS_NAME_FADE$2 = 'fade';
	var CLASS_NAME_SHOW$2 = 'show';
	var SELECTOR_TITLE = '.popover-header';
	var SELECTOR_CONTENT = '.popover-body';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Popover = /*#__PURE__*/function (_Tooltip) {
	  _inheritsLoose(Popover, _Tooltip);

	  function Popover() {
	    return _Tooltip.apply(this, arguments) || this;
	  }

	  var _proto = Popover.prototype;

	  // Overrides
	  _proto.isWithContent = function isWithContent() {
	    return this.getTitle() || this._getContent();
	  };

	  _proto.setContent = function setContent() {
	    var tip = this.getTipElement(); // we use append for html objects to maintain js events

	    this.setElementContent(SelectorEngine.findOne(SELECTOR_TITLE, tip), this.getTitle());

	    var content = this._getContent();

	    if (typeof content === 'function') {
	      content = content.call(this._element);
	    }

	    this.setElementContent(SelectorEngine.findOne(SELECTOR_CONTENT, tip), content);
	    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
	  } // Private
	  ;

	  _proto._addAttachmentClass = function _addAttachmentClass(attachment) {
	    this.getTipElement().classList.add(CLASS_PREFIX + "-" + this.updateAttachment(attachment));
	  };

	  _proto._getContent = function _getContent() {
	    return this._element.getAttribute('data-bs-content') || this._config.content;
	  };

	  _proto._cleanTipClass = function _cleanTipClass() {
	    var tip = this.getTipElement();
	    var tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX);

	    if (tabClass !== null && tabClass.length > 0) {
	      tabClass.map(function (token) {
	        return token.trim();
	      }).forEach(function (tClass) {
	        return tip.classList.remove(tClass);
	      });
	    }
	  } // Static
	  ;

	  Popover.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY$3);

	      var _config = typeof config === 'object' ? config : null;

	      if (!data && /dispose|hide/.test(config)) {
	        return;
	      }

	      if (!data) {
	        data = new Popover(this, _config);
	        Data.set(this, DATA_KEY$3, data);
	      }

	      if (typeof config === 'string') {
	        if (typeof data[config] === 'undefined') {
	          throw new TypeError("No method named \"" + config + "\"");
	        }

	        data[config]();
	      }
	    });
	  };

	  _createClass(Popover, null, [{
	    key: "Default",
	    get: // Getters
	    function get() {
	      return Default$2;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$3;
	    }
	  }, {
	    key: "Event",
	    get: function get() {
	      return Event$1;
	    }
	  }, {
	    key: "DefaultType",
	    get: function get() {
	      return DefaultType$2;
	    }
	  }]);

	  return Popover;
	}(Tooltip);
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Popover to jQuery only if jQuery is present
	 */


	defineJQueryPlugin(Popover);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Popover = Popover;
	window.bootstrap.Tooltip = Tooltip;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var tooltips = Joomla.getOptions('bootstrap.tooltip');
	  var popovers = Joomla.getOptions('bootstrap.popover'); // Initialise the elements

	  if (typeof popovers === 'object' && popovers !== null) {
	    Object.keys(popovers).forEach(function (popover) {
	      var opt = popovers[popover];
	      var options = {
	        animation: opt.animation ? opt.animation : true,
	        container: opt.container ? opt.container : false,
	        content: opt.content ? opt.content : '',
	        delay: opt.delay ? opt.delay : 0,
	        html: opt.html ? opt.html : false,
	        placement: opt.placement ? opt.placement : 'top',
	        selector: opt.selector ? opt.selector : false,
	        title: opt.title ? opt.title : '',
	        trigger: opt.trigger ? opt.trigger : 'click',
	        offset: opt.offset ? opt.offset : 0,
	        fallbackPlacement: opt.fallbackPlacement ? opt.fallbackPlacement : 'flip',
	        boundary: opt.boundary ? opt.boundary : 'scrollParent',
	        customClass: opt.customClass ? opt.customClass : '',
	        sanitize: opt.sanitize ? opt.sanitize : true,
	        sanitizeFn: opt.sanitizeFn ? opt.sanitizeFn : null,
	        popperConfig: opt.popperConfig ? opt.popperConfig : null
	      };

	      if (opt.template) {
	        options.template = opt.template;
	      }

	      if (opt.allowList) {
	        options.allowList = opt.allowList;
	      }

	      var elements = Array.from(document.querySelectorAll(popover));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Popover(el, options);
	        });
	      }
	    });
	  } // Initialise the elements


	  if (typeof tooltips === 'object' && tooltips !== null) {
	    Object.keys(tooltips).forEach(function (tooltip) {
	      var opt = tooltips[tooltip];
	      var options = {
	        animation: opt.animation ? opt.animation : true,
	        container: opt.container ? opt.container : false,
	        delay: opt.delay ? opt.delay : 0,
	        html: opt.html ? opt.html : false,
	        selector: opt.selector ? opt.selector : false,
	        trigger: opt.trigger ? opt.trigger : 'hover focus',
	        fallbackPlacement: opt.fallbackPlacement ? opt.fallbackPlacement : null,
	        boundary: opt.boundary ? opt.boundary : 'clippingParents',
	        title: opt.title ? opt.title : '',
	        customClass: opt.customClass ? opt.customClass : '',
	        sanitize: opt.sanitize ? opt.sanitize : true,
	        sanitizeFn: opt.sanitizeFn ? opt.sanitizeFn : null,
	        popperConfig: opt.popperConfig ? opt.popperConfig : null
	      };

	      if (opt.placement) {
	        options.placement = opt.placement;
	      }

	      if (opt.template) {
	        options.template = opt.template;
	      }

	      if (opt.allowList) {
	        options.allowList = opt.allowList;
	      }

	      var elements = Array.from(document.querySelectorAll(tooltip));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Tooltip(el, options);
	        });
	      }
	    });
	  }
	}

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$2 = 'scrollspy';
	var DATA_KEY$2 = 'bs.scrollspy';
	var EVENT_KEY$2 = "." + DATA_KEY$2;
	var DATA_API_KEY$1 = '.data-api';
	var Default$1 = {
	  offset: 10,
	  method: 'auto',
	  target: ''
	};
	var DefaultType$1 = {
	  offset: 'number',
	  method: 'string',
	  target: '(string|element)'
	};
	var EVENT_ACTIVATE = "activate" + EVENT_KEY$2;
	var EVENT_SCROLL = "scroll" + EVENT_KEY$2;
	var EVENT_LOAD_DATA_API = "load" + EVENT_KEY$2 + DATA_API_KEY$1;
	var CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
	var CLASS_NAME_ACTIVE$1 = 'active';
	var SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
	var SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
	var SELECTOR_NAV_LINKS = '.nav-link';
	var SELECTOR_NAV_ITEMS = '.nav-item';
	var SELECTOR_LIST_ITEMS = '.list-group-item';
	var SELECTOR_DROPDOWN$1 = '.dropdown';
	var SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
	var METHOD_OFFSET = 'offset';
	var METHOD_POSITION = 'position';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var ScrollSpy = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(ScrollSpy, _BaseComponent);

	  function ScrollSpy(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._scrollElement = _this._element.tagName === 'BODY' ? window : _this._element;
	    _this._config = _this._getConfig(config);
	    _this._selector = _this._config.target + " " + SELECTOR_NAV_LINKS + ", " + _this._config.target + " " + SELECTOR_LIST_ITEMS + ", " + _this._config.target + " ." + CLASS_NAME_DROPDOWN_ITEM;
	    _this._offsets = [];
	    _this._targets = [];
	    _this._activeTarget = null;
	    _this._scrollHeight = 0;
	    EventHandler.on(_this._scrollElement, EVENT_SCROLL, function () {
	      return _this._process();
	    });

	    _this.refresh();

	    _this._process();

	    return _this;
	  } // Getters


	  var _proto = ScrollSpy.prototype;

	  // Public
	  _proto.refresh = function refresh() {
	    var _this2 = this;

	    var autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
	    var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
	    var offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
	    this._offsets = [];
	    this._targets = [];
	    this._scrollHeight = this._getScrollHeight();
	    var targets = SelectorEngine.find(this._selector);
	    targets.map(function (element) {
	      var targetSelector = getSelectorFromElement(element);
	      var target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

	      if (target) {
	        var targetBCR = target.getBoundingClientRect();

	        if (targetBCR.width || targetBCR.height) {
	          return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
	        }
	      }

	      return null;
	    }).filter(function (item) {
	      return item;
	    }).sort(function (a, b) {
	      return a[0] - b[0];
	    }).forEach(function (item) {
	      _this2._offsets.push(item[0]);

	      _this2._targets.push(item[1]);
	    });
	  };

	  _proto.dispose = function dispose() {
	    EventHandler.off(this._scrollElement, EVENT_KEY$2);

	    _BaseComponent.prototype.dispose.call(this);
	  } // Private
	  ;

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default$1, Manipulator.getDataAttributes(this._element), typeof config === 'object' && config ? config : {});

	    if (typeof config.target !== 'string' && isElement$1(config.target)) {
	      var id = config.target.id;

	      if (!id) {
	        id = getUID(NAME$2);
	        config.target.id = id;
	      }

	      config.target = "#" + id;
	    }

	    typeCheckConfig(NAME$2, config, DefaultType$1);
	    return config;
	  };

	  _proto._getScrollTop = function _getScrollTop() {
	    return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
	  };

	  _proto._getScrollHeight = function _getScrollHeight() {
	    return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	  };

	  _proto._getOffsetHeight = function _getOffsetHeight() {
	    return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
	  };

	  _proto._process = function _process() {
	    var scrollTop = this._getScrollTop() + this._config.offset;

	    var scrollHeight = this._getScrollHeight();

	    var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

	    if (this._scrollHeight !== scrollHeight) {
	      this.refresh();
	    }

	    if (scrollTop >= maxScroll) {
	      var target = this._targets[this._targets.length - 1];

	      if (this._activeTarget !== target) {
	        this._activate(target);
	      }

	      return;
	    }

	    if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
	      this._activeTarget = null;

	      this._clear();

	      return;
	    }

	    for (var i = this._offsets.length; i--;) {
	      var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

	      if (isActiveTarget) {
	        this._activate(this._targets[i]);
	      }
	    }
	  };

	  _proto._activate = function _activate(target) {
	    this._activeTarget = target;

	    this._clear();

	    var queries = this._selector.split(',').map(function (selector) {
	      return selector + "[data-bs-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
	    });

	    var link = SelectorEngine.findOne(queries.join(','));

	    if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
	      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
	      link.classList.add(CLASS_NAME_ACTIVE$1);
	    } else {
	      // Set triggered link as active
	      link.classList.add(CLASS_NAME_ACTIVE$1);
	      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(function (listGroup) {
	        // Set triggered links parents as active
	        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
	        SelectorEngine.prev(listGroup, SELECTOR_NAV_LINKS + ", " + SELECTOR_LIST_ITEMS).forEach(function (item) {
	          return item.classList.add(CLASS_NAME_ACTIVE$1);
	        }); // Handle special case when .nav-link is inside .nav-item

	        SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(function (navItem) {
	          SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(function (item) {
	            return item.classList.add(CLASS_NAME_ACTIVE$1);
	          });
	        });
	      });
	    }

	    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
	      relatedTarget: target
	    });
	  };

	  _proto._clear = function _clear() {
	    SelectorEngine.find(this._selector).filter(function (node) {
	      return node.classList.contains(CLASS_NAME_ACTIVE$1);
	    }).forEach(function (node) {
	      return node.classList.remove(CLASS_NAME_ACTIVE$1);
	    });
	  } // Static
	  ;

	  ScrollSpy.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = ScrollSpy.getInstance(this) || new ScrollSpy(this, typeof config === 'object' ? config : {});

	      if (typeof config !== 'string') {
	        return;
	      }

	      if (typeof data[config] === 'undefined') {
	        throw new TypeError("No method named \"" + config + "\"");
	      }

	      data[config]();
	    });
	  };

	  _createClass(ScrollSpy, null, [{
	    key: "Default",
	    get: function get() {
	      return Default$1;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME$2;
	    }
	  }]);

	  return ScrollSpy;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(window, EVENT_LOAD_DATA_API, function () {
	  SelectorEngine.find(SELECTOR_DATA_SPY).forEach(function (spy) {
	    return new ScrollSpy(spy);
	  });
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .ScrollSpy to jQuery only if jQuery is present
	 */

	defineJQueryPlugin(ScrollSpy);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Scrollspy = ScrollSpy;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var scrollspys = Joomla.getOptions('bootstrap.scrollspy'); // Initialise the elements

	  if (typeof scrollspys === 'object' && scrollspys !== null) {
	    Object.keys(scrollspys).forEach(function (scrollspy) {
	      var opt = scrollspys[scrollspy];
	      var options = {
	        offset: opt.offset ? opt.offset : 10,
	        method: opt.method ? opt.method : 'auto'
	      };

	      if (opt.target) {
	        options.target = opt.target;
	      }

	      var elements = Array.from(document.querySelectorAll(scrollspy));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Scrollspy(el, options);
	        });
	      }
	    });
	  }
	}

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME$1 = 'tab';
	var DATA_KEY$1 = 'bs.tab';
	var EVENT_KEY$1 = "." + DATA_KEY$1;
	var DATA_API_KEY = '.data-api';
	var EVENT_HIDE$1 = "hide" + EVENT_KEY$1;
	var EVENT_HIDDEN$1 = "hidden" + EVENT_KEY$1;
	var EVENT_SHOW$1 = "show" + EVENT_KEY$1;
	var EVENT_SHOWN$1 = "shown" + EVENT_KEY$1;
	var EVENT_CLICK_DATA_API = "click" + EVENT_KEY$1 + DATA_API_KEY;
	var CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
	var CLASS_NAME_ACTIVE = 'active';
	var CLASS_NAME_FADE$1 = 'fade';
	var CLASS_NAME_SHOW$1 = 'show';
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

	var Tab = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Tab, _BaseComponent);

	  function Tab() {
	    return _BaseComponent.apply(this, arguments) || this;
	  }

	  var _proto = Tab.prototype;

	  // Public
	  _proto.show = function show() {
	    var _this = this;

	    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
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

	    var hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
	      relatedTarget: this._element
	    }) : null;
	    var showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
	      relatedTarget: previous
	    });

	    if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
	      return;
	    }

	    this._activate(this._element, listElement);

	    var complete = function complete() {
	      EventHandler.trigger(previous, EVENT_HIDDEN$1, {
	        relatedTarget: _this._element
	      });
	      EventHandler.trigger(_this._element, EVENT_SHOWN$1, {
	        relatedTarget: previous
	      });
	    };

	    if (target) {
	      this._activate(target, target.parentNode, complete);
	    } else {
	      complete();
	    }
	  } // Private
	  ;

	  _proto._activate = function _activate(element, container, callback) {
	    var _this2 = this;

	    var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
	    var active = activeElements[0];
	    var isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

	    var complete = function complete() {
	      return _this2._transitionComplete(element, active, callback);
	    };

	    if (active && isTransitioning) {
	      active.classList.remove(CLASS_NAME_SHOW$1);

	      this._queueCallback(complete, element, true);
	    } else {
	      complete();
	    }
	  };

	  _proto._transitionComplete = function _transitionComplete(element, active, callback) {
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

	    if (element.classList.contains(CLASS_NAME_FADE$1)) {
	      element.classList.add(CLASS_NAME_SHOW$1);
	    }

	    var parent = element.parentNode;

	    if (parent && parent.nodeName === 'LI') {
	      parent = parent.parentNode;
	    }

	    if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
	      var dropdownElement = element.closest(SELECTOR_DROPDOWN);

	      if (dropdownElement) {
	        SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(function (dropdown) {
	          return dropdown.classList.add(CLASS_NAME_ACTIVE);
	        });
	      }

	      element.setAttribute('aria-expanded', true);
	    }

	    if (callback) {
	      callback();
	    }
	  } // Static
	  ;

	  Tab.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY$1) || new Tab(this);

	      if (typeof config === 'string') {
	        if (typeof data[config] === 'undefined') {
	          throw new TypeError("No method named \"" + config + "\"");
	        }

	        data[config]();
	      }
	    });
	  };

	  _createClass(Tab, null, [{
	    key: "NAME",
	    get: // Getters
	    function get() {
	      return NAME$1;
	    }
	  }]);

	  return Tab;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	  if (['A', 'AREA'].includes(this.tagName)) {
	    event.preventDefault();
	  }

	  if (isDisabled(this)) {
	    return;
	  }

	  var data = Data.get(this, DATA_KEY$1) || new Tab(this);
	  data.show();
	});
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Tab to jQuery only if jQuery is present
	 */

	defineJQueryPlugin(Tab);

	window.Joomla = window.Joomla || {};
	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Tab = Tab;
	/**
	 * Initialise the Tabs interactivity
	 *
	 * @param {HTMLElement} el The element that will become an collapse
	 * @param {object} options The options for this collapse
	 */

	Joomla.initialiseTabs = function (el, options) {
	  if (!(el instanceof Element) && options.isJoomla) {
	    var tab = document.querySelector(el + "Content");

	    if (tab) {
	      var related = Array.from(tab.children); // Build the navigation

	      if (related.length) {
	        related.forEach(function (element) {
	          if (!element.classList.contains('tab-pane')) {
	            return;
	          }

	          var isActive = element.dataset.active !== '';
	          var ul = document.querySelector(el + "Tabs");

	          if (ul) {
	            var link = document.createElement('a');
	            link.href = "#" + element.dataset.id;
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
	    Array.from(document.querySelectorAll(el + " a")).map(function (tab) {
	      return new window.bootstrap.Tab(tab, options);
	    });
	  }
	};

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var tabs = Joomla.getOptions('bootstrap.tabs'); // Initialise the elements

	  if (typeof tabs === 'object' && tabs !== null) {
	    Object.keys(tabs).map(function (tab) {
	      return Joomla.initialiseTabs(tab, tabs[tab]);
	    });
	  }
	}

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var NAME = 'toast';
	var DATA_KEY = 'bs.toast';
	var EVENT_KEY = "." + DATA_KEY;
	var EVENT_CLICK_DISMISS = "click.dismiss" + EVENT_KEY;
	var EVENT_MOUSEOVER = "mouseover" + EVENT_KEY;
	var EVENT_MOUSEOUT = "mouseout" + EVENT_KEY;
	var EVENT_FOCUSIN = "focusin" + EVENT_KEY;
	var EVENT_FOCUSOUT = "focusout" + EVENT_KEY;
	var EVENT_HIDE = "hide" + EVENT_KEY;
	var EVENT_HIDDEN = "hidden" + EVENT_KEY;
	var EVENT_SHOW = "show" + EVENT_KEY;
	var EVENT_SHOWN = "shown" + EVENT_KEY;
	var CLASS_NAME_FADE = 'fade';
	var CLASS_NAME_HIDE = 'hide';
	var CLASS_NAME_SHOW = 'show';
	var CLASS_NAME_SHOWING = 'showing';
	var DefaultType = {
	  animation: 'boolean',
	  autohide: 'boolean',
	  delay: 'number'
	};
	var Default = {
	  animation: true,
	  autohide: true,
	  delay: 5000
	};
	var SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	var Toast = /*#__PURE__*/function (_BaseComponent) {
	  _inheritsLoose(Toast, _BaseComponent);

	  function Toast(element, config) {
	    var _this;

	    _this = _BaseComponent.call(this, element) || this;
	    _this._config = _this._getConfig(config);
	    _this._timeout = null;
	    _this._hasMouseInteraction = false;
	    _this._hasKeyboardInteraction = false;

	    _this._setListeners();

	    return _this;
	  } // Getters


	  var _proto = Toast.prototype;

	  // Public
	  _proto.show = function show() {
	    var _this2 = this;

	    var showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

	    if (showEvent.defaultPrevented) {
	      return;
	    }

	    this._clearTimeout();

	    if (this._config.animation) {
	      this._element.classList.add(CLASS_NAME_FADE);
	    }

	    var complete = function complete() {
	      _this2._element.classList.remove(CLASS_NAME_SHOWING);

	      _this2._element.classList.add(CLASS_NAME_SHOW);

	      EventHandler.trigger(_this2._element, EVENT_SHOWN);

	      _this2._maybeScheduleHide();
	    };

	    this._element.classList.remove(CLASS_NAME_HIDE);

	    reflow(this._element);

	    this._element.classList.add(CLASS_NAME_SHOWING);

	    this._queueCallback(complete, this._element, this._config.animation);
	  };

	  _proto.hide = function hide() {
	    var _this3 = this;

	    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
	      return;
	    }

	    var hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

	    if (hideEvent.defaultPrevented) {
	      return;
	    }

	    var complete = function complete() {
	      _this3._element.classList.add(CLASS_NAME_HIDE);

	      EventHandler.trigger(_this3._element, EVENT_HIDDEN);
	    };

	    this._element.classList.remove(CLASS_NAME_SHOW);

	    this._queueCallback(complete, this._element, this._config.animation);
	  };

	  _proto.dispose = function dispose() {
	    this._clearTimeout();

	    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
	      this._element.classList.remove(CLASS_NAME_SHOW);
	    }

	    _BaseComponent.prototype.dispose.call(this);
	  } // Private
	  ;

	  _proto._getConfig = function _getConfig(config) {
	    config = Object.assign({}, Default, Manipulator.getDataAttributes(this._element), typeof config === 'object' && config ? config : {});
	    typeCheckConfig(NAME, config, this.constructor.DefaultType);
	    return config;
	  };

	  _proto._maybeScheduleHide = function _maybeScheduleHide() {
	    var _this4 = this;

	    if (!this._config.autohide) {
	      return;
	    }

	    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
	      return;
	    }

	    this._timeout = setTimeout(function () {
	      _this4.hide();
	    }, this._config.delay);
	  };

	  _proto._onInteraction = function _onInteraction(event, isInteracting) {
	    switch (event.type) {
	      case 'mouseover':
	      case 'mouseout':
	        this._hasMouseInteraction = isInteracting;
	        break;

	      case 'focusin':
	      case 'focusout':
	        this._hasKeyboardInteraction = isInteracting;
	        break;
	    }

	    if (isInteracting) {
	      this._clearTimeout();

	      return;
	    }

	    var nextElement = event.relatedTarget;

	    if (this._element === nextElement || this._element.contains(nextElement)) {
	      return;
	    }

	    this._maybeScheduleHide();
	  };

	  _proto._setListeners = function _setListeners() {
	    var _this5 = this;

	    EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, function () {
	      return _this5.hide();
	    });
	    EventHandler.on(this._element, EVENT_MOUSEOVER, function (event) {
	      return _this5._onInteraction(event, true);
	    });
	    EventHandler.on(this._element, EVENT_MOUSEOUT, function (event) {
	      return _this5._onInteraction(event, false);
	    });
	    EventHandler.on(this._element, EVENT_FOCUSIN, function (event) {
	      return _this5._onInteraction(event, true);
	    });
	    EventHandler.on(this._element, EVENT_FOCUSOUT, function (event) {
	      return _this5._onInteraction(event, false);
	    });
	  };

	  _proto._clearTimeout = function _clearTimeout() {
	    clearTimeout(this._timeout);
	    this._timeout = null;
	  } // Static
	  ;

	  Toast.jQueryInterface = function jQueryInterface(config) {
	    return this.each(function () {
	      var data = Data.get(this, DATA_KEY);

	      var _config = typeof config === 'object' && config;

	      if (!data) {
	        data = new Toast(this, _config);
	      }

	      if (typeof config === 'string') {
	        if (typeof data[config] === 'undefined') {
	          throw new TypeError("No method named \"" + config + "\"");
	        }

	        data[config](this);
	      }
	    });
	  };

	  _createClass(Toast, null, [{
	    key: "DefaultType",
	    get: function get() {
	      return DefaultType;
	    }
	  }, {
	    key: "Default",
	    get: function get() {
	      return Default;
	    }
	  }, {
	    key: "NAME",
	    get: function get() {
	      return NAME;
	    }
	  }]);

	  return Toast;
	}(BaseComponent);
	/**
	 * ------------------------------------------------------------------------
	 * jQuery
	 * ------------------------------------------------------------------------
	 * add .Toast to jQuery only if jQuery is present
	 */


	defineJQueryPlugin(Toast);

	window.bootstrap = window.bootstrap || {};
	window.bootstrap.Toast = Toast;

	if (Joomla && Joomla.getOptions) {
	  // Get the elements/configurations from the PHP
	  var toasts = Joomla.getOptions('bootstrap.toast'); // Initialise the elements

	  if (typeof toasts === 'object' && toasts !== null) {
	    Object.keys(toasts).forEach(function (toast) {
	      var opt = toasts[toast];
	      var options = {
	        animation: opt.animation ? opt.animation : true,
	        autohide: opt.autohide ? opt.autohide : true,
	        delay: opt.delay ? opt.delay : 5000
	      };
	      var elements = Array.from(document.querySelectorAll(toast));

	      if (elements.length) {
	        elements.map(function (el) {
	          return new window.bootstrap.Toast(el, options);
	        });
	      }
	    });
	  }
	}

	exports.Alert = Alert;
	exports.Button = Button;
	exports.Carousel = Carousel;
	exports.Collapse = Collapse;
	exports.Dropdown = Dropdown;
	exports.Modal = Modal;
	exports.Offcanvas = Offcanvas;
	exports.Popover = Popover;
	exports.Scrollspy = ScrollSpy;
	exports.Tab = Tab;
	exports.Toast = Toast;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

}({}));
