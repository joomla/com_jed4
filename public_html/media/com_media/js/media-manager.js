/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');

  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}
const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
const isGloballyWhitelisted = /*#__PURE__*/makeMap(GLOBALS_WHITE_LISTED);
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


const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /*#__PURE__*/makeMap(specialBooleanAttrs);

function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};

    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);

      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }

    return res;
  } else if (isObject$1(value)) {
    return value;
  }
}

const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;

function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach(item => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}

function normalizeClass(value) {
  let res = '';

  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);

      if (normalized) {
        res += normalized + ' ';
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
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


const toDisplayString = val => {
  return val == null ? '' : isObject$1(val) ? JSON.stringify(val, replacer, 2) : String(val);
};

const replacer = (_key, val) => {
  if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
        entries[`${key} =>`] = val;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }

  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];

const NOOP = () => {};
/**
 * Always return false.
 */


const NO = () => false;

const onRE = /^on[^a-z]/;

const isOn = key => onRE.test(key);

const isModelListener = key => key.startsWith('onUpdate:');

const extend = Object.assign;

const remove = (arr, el) => {
  const i = arr.indexOf(el);

  if (i > -1) {
    arr.splice(i, 1);
  }
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasOwn = (val, key) => hasOwnProperty.call(val, key);

const isArray = Array.isArray;

const isMap = val => toTypeString(val) === '[object Map]';

const isSet = val => toTypeString(val) === '[object Set]';

const isFunction = val => typeof val === 'function';

const isString = val => typeof val === 'string';

const isSymbol = val => typeof val === 'symbol';

const isObject$1 = val => val !== null && typeof val === 'object';

const isPromise$1 = val => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};

const objectToString = Object.prototype.toString;

const toTypeString = value => objectToString.call(value);

const toRawType = value => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1);
};

const isPlainObject = val => toTypeString(val) === '[object Object]';

const isIntegerKey = key => isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;

const isReservedProp = /*#__PURE__*/makeMap( // the leading comma is intentional so empty string "" is also included
',key,ref,' + 'onVnodeBeforeMount,onVnodeMounted,' + 'onVnodeBeforeUpdate,onVnodeUpdated,' + 'onVnodeBeforeUnmount,onVnodeUnmounted');

const cacheStringFunction = fn => {
  const cache = Object.create(null);
  return str => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

const camelizeRE = /-(\w)/g;
/**
 * @private
 */

const camelize = cacheStringFunction(str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */

const hyphenate = cacheStringFunction(str => str.replace(hyphenateRE, '-$1').toLowerCase());
/**
 * @private
 */

const capitalize = cacheStringFunction(str => str.charAt(0).toUpperCase() + str.slice(1));
/**
 * @private
 */

const toHandlerKey = cacheStringFunction(str => str ? `on${capitalize(str)}` : ``); // compare whether a value has changed, accounting for NaN.

const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};

const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};

const toNumber = val => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};

let _globalThis;

const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
};

const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol('');
const MAP_KEY_ITERATE_KEY = Symbol('');

function isEffect(fn) {
  return fn && fn._isEffect === true;
}

function effect(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }

  const effect = createReactiveEffect(fn, options);

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

let uid$2 = 0;

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
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
  const {
    deps
  } = effect;

  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }

    deps.length = 0;
  }
}

let shouldTrack = true;
const trackStack = [];

function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}

function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}

function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === undefined ? true : last;
}

function track(target, type, key) {
  if (!shouldTrack || activeEffect === undefined) {
    return;
  }

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }

  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, dep = new Set());
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

function trigger$1(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);

  if (!depsMap) {
    // never been tracked
    return;
  }

  const effects = new Set();

  const add = effectsToAdd => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
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
    depsMap.forEach((dep, key) => {
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

  const run = effect => {

    if (effect.options.scheduler) {
      effect.options.scheduler(effect);
    } else {
      effect();
    }
  };

  effects.forEach(run);
}

const isNonTrackableKeys = /*#__PURE__*/makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map(key => Symbol[key]).filter(isSymbol));
const get = /*#__PURE__*/createGetter();
const shallowGet = /*#__PURE__*/createGetter(false, true);
const readonlyGet = /*#__PURE__*/createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/createGetter(true, true);
const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
  const method = Array.prototype[key];

  arrayInstrumentations[key] = function (...args) {
    const arr = toRaw(this);

    for (let i = 0, l = this.length; i < l; i++) {
      track(arr, "get"
      /* GET */
      , i + '');
    } // we run the method using the original args first (which may be reactive)


    const res = method.apply(arr, args);

    if (res === -1 || res === false) {
      // if that didn't work, run it again using raw values.
      return method.apply(arr, args.map(toRaw));
    } else {
      return res;
    }
  };
});
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
  const method = Array.prototype[key];

  arrayInstrumentations[key] = function (...args) {
    pauseTracking();
    const res = method.apply(this, args);
    resetTracking();
    return res;
  };
});

function createGetter(isReadonly = false, shallow = false) {
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

    const targetIsArray = isArray(target);

    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }

    const res = Reflect.get(target, key, receiver);

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
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
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

const set = /*#__PURE__*/createSetter();
const shallowSet = /*#__PURE__*/createSetter(true);

function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    let oldValue = target[key];

    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);

      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }

    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver); // don't trigger if target is something up in the prototype chain of original

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
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);

  if (result && hadKey) {
    trigger$1(target, "delete"
    /* DELETE */
    , key, undefined);
  }

  return result;
}

function has(target, key) {
  const result = Reflect.has(target, key);

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

const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,

  set(target, key) {

    return true;
  },

  deleteProperty(target, key) {

    return true;
  }

};
const shallowReactiveHandlers = extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
}); // Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.

extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});

const toReactive = value => isObject$1(value) ? reactive(value) : value;

const toReadonly = value => isObject$1(value) ? readonly(value) : value;

const toShallow = value => value;

const getProto = v => Reflect.getPrototypeOf(v);

function get$1(target, key, isReadonly = false, isShallow = false) {
  // #1772: readonly(reactive(Map)) should return readonly + reactive version
  // of the value
  target = target["__v_raw"
  /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);

  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get"
    /* GET */
    , key);
  }

  !isReadonly && track(rawTarget, "get"
  /* GET */
  , rawKey);
  const {
    has
  } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;

  if (has.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  }
}

function has$1(key, isReadonly = false) {
  const target = this["__v_raw"
  /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);

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

function size(target, isReadonly = false) {
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
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);

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
  const target = toRaw(this);
  const {
    has,
    get
  } = getProto(target);
  let hadKey = has.call(target, key);

  if (!hadKey) {
    key = toRaw(key);
    hadKey = has.call(target, key);
  }

  const oldValue = get.call(target, key);
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
  const target = toRaw(this);
  const {
    has,
    get
  } = getProto(target);
  let hadKey = has.call(target, key);

  if (!hadKey) {
    key = toRaw(key);
    hadKey = has.call(target, key);
  }

  get ? get.call(target, key) : undefined; // forward the operation before queueing reactions

  const result = target.delete(key);

  if (hadKey) {
    trigger$1(target, "delete"
    /* DELETE */
    , key, undefined);
  }

  return result;
}

function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;

  const result = target.clear();

  if (hadItems) {
    trigger$1(target, "clear"
    /* CLEAR */
    , undefined, undefined);
  }

  return result;
}

function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"
    /* RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate"
    /* ITERATE */
    , ITERATE_KEY);
    return target.forEach((value, key) => {
      // important: make sure the callback is
      // 1. invoked with the reactive map as `this` and 3rd arg
      // 2. the value received should be a corresponding reactive/readonly.
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}

function createIterableMethod(method, isReadonly, isShallow) {
  return function (...args) {
    const target = this["__v_raw"
    /* RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === 'keys' && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate"
    /* ITERATE */
    , isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY); // return a wrapped iterator which returns observed versions of the
    // values emitted from the real iterator

    return {
      // iterator protocol
      next() {
        const {
          value,
          done
        } = innerIterator.next();
        return done ? {
          value,
          done
        } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },

      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }

    };
  };
}

function createReadonlyMethod(type) {
  return function (...args) {

    return type === "delete"
    /* DELETE */
    ? false : this;
  };
}

const mutableInstrumentations = {
  get(key) {
    return get$1(this, key);
  },

  get size() {
    return size(this);
  },

  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, false)
};
const shallowInstrumentations = {
  get(key) {
    return get$1(this, key, false, true);
  },

  get size() {
    return size(this);
  },

  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, true)
};
const readonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true);
  },

  get size() {
    return size(this, true);
  },

  has(key) {
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
const shallowReadonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true, true);
  },

  get size() {
    return size(this, true);
  },

  has(key) {
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
const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
iteratorMethods.forEach(method => {
  mutableInstrumentations[method] = createIterableMethod(method, false, false);
  readonlyInstrumentations[method] = createIterableMethod(method, true, false);
  shallowInstrumentations[method] = createIterableMethod(method, false, true);
  shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
});

function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
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

const mutableCollectionHandlers = {
  get: createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: createInstrumentationGetter(true, false)
};

const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();

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


  const existingProxy = proxyMap.get(target);

  if (existingProxy) {
    return existingProxy;
  } // only a whitelist of value types can be observed.


  const targetType = getTargetType(target);

  if (targetType === 0
  /* INVALID */
  ) {
      return target;
    }

  const proxy = new Proxy(target, targetType === 2
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

const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];

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

class ObjectRefImpl {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }

  get value() {
    return this._object[this._key];
  }

  set value(newVal) {
    this._object[this._key] = newVal;
  }

}

function toRef(object, key) {
  return isRef(object[key]) ? object[key] : new ObjectRefImpl(object, key);
}

class ComputedRefImpl {
  constructor(getter, _setter, isReadonly) {
    this._setter = _setter;
    this._dirty = true;
    this.__v_isRef = true;
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          trigger$1(toRaw(this), "set"
          /* SET */
          , 'value');
        }
      }
    });
    this["__v_isReadonly"
    /* IS_READONLY */
    ] = isReadonly;
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this);

    if (self._dirty) {
      self._value = this.effect();
      self._dirty = false;
    }

    track(self, "get"
    /* GET */
    , 'value');
    return self._value;
  }

  set value(newValue) {
    this._setter(newValue);
  }

}

function computed$1(getterOrOptions) {
  let getter;
  let setter;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter, isFunction(getterOrOptions) || !getterOrOptions.set);
}

const stack = [];

function warn(msg, ...args) {
  // avoid props formatting or warn handler tracking deps that might be mutated
  // during patch, leading to infinite recursion.
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();

  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11
    /* APP_WARN_HANDLER */
    , [msg + args.join(''), instance && instance.proxy, trace.map(({
      vnode
    }) => `at <${formatComponentName(instance, vnode.type)}>`).join('\n'), trace]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    /* istanbul ignore if */

    if (trace.length && // avoid spamming console during tests
    !false) {
      warnArgs.push(`\n`, ...formatTrace(trace));
    }

    console.warn(...warnArgs);
  }

  resetTracking();
}

function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];

  if (!currentVNode) {
    return [];
  } // we can't just use the stack because it will be incomplete during updates
  // that did not start from the root. Re-construct the parent chain using
  // instance parent pointers.


  const normalizedStack = [];

  while (currentVNode) {
    const last = normalizedStack[0];

    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }

    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }

  return normalizedStack;
}
/* istanbul ignore next */


function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
  });
  return logs;
}

function formatTraceEntry({
  vnode,
  recurseCount
}) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
/* istanbul ignore next */


function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach(key => {
    res.push(...formatProp(key, props[key]));
  });

  if (keys.length > 3) {
    res.push(` ...`);
  }

  return res;
}
/* istanbul ignore next */


function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}

function callWithErrorHandling(fn, instance, type, args) {
  let res;

  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }

  return res;
}

function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);

    if (res && isPromise$1(res)) {
      res.catch(err => {
        handleError(err, instance, type);
      });
    }

    return res;
  }

  const values = [];

  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }

  return values;
}

function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;

  if (instance) {
    let cur = instance.parent; // the exposed instance is the render proxy to keep it consistent with 2.x

    const exposedInstance = instance.proxy; // in production the hook receives only the error code

    const errorInfo = type;

    while (cur) {
      const errorCapturedHooks = cur.ec;

      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }

      cur = cur.parent;
    } // app-level handling


    const appErrorHandler = instance.appContext.config.errorHandler;

    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10
      /* APP_ERROR_HANDLER */
      , [err, exposedInstance, errorInfo]);
      return;
    }
  }

  logError(err, type, contextVNode, throwInDev);
}

function logError(err, type, contextVNode, throwInDev = true) {
  {
    // recover in prod to reduce the impact on end-user
    console.error(err);
  }
}

let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
const RECURSION_LIMIT = 100;

function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
} // #2768
// Use binary-search to find a suitable position in the queue,
// so that the queue maintains the increasing order of job's id,
// which can prevent the job from being skipped and also can avoid repeated patching.


function findInsertionIndex(job) {
  // the start index should be `flushIndex + 1`
  let start = flushIndex + 1;
  let end = queue.length;
  const jobId = getId(job);

  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
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
    const pos = findInsertionIndex(job);

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
  const i = queue.indexOf(job);

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
    pendingQueue.push(...cb);
  }

  queueFlush();
}

function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}

function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}

function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
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
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0; // #1947 already has active queue, nested flushPostFlushCbs call

    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }

    activePostFlushCbs = deduped;

    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));

    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {

      activePostFlushCbs[postFlushIndex]();
    }

    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}

const getId = job => job.id == null ? Infinity : job.id;

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

  queue.sort((a, b) => getId(a) - getId(b));

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];

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

function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);

    if (count > RECURSION_LIMIT) {
      throw new Error(`Maximum recursive updates exceeded. ` + `This means you have a reactive effect that is mutating its own ` + `dependencies and thus recursively triggering itself. Possible sources ` + `include component template, render function, updated hook or ` + `watcher source function.`);
    } else {
      seen.set(fn, count + 1);
    }
  }
}

let devtools;

function setDevtoolsHook(hook) {
  devtools = hook;
}

function devtoolsInitApp(app, version) {
  // TODO queue if devtools is undefined
  if (!devtools) return;
  devtools.emit("app:init"
  /* APP_INIT */
  , app, version, {
    Fragment,
    Text,
    Comment,
    Static
  });
}

function devtoolsUnmountApp(app) {
  if (!devtools) return;
  devtools.emit("app:unmount"
  /* APP_UNMOUNT */
  , app);
}

const devtoolsComponentAdded = /*#__PURE__*/createDevtoolsComponentHook("component:added"
/* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /*#__PURE__*/createDevtoolsComponentHook("component:updated"
/* COMPONENT_UPDATED */
);
const devtoolsComponentRemoved = /*#__PURE__*/createDevtoolsComponentHook("component:removed"
/* COMPONENT_REMOVED */
);

function createDevtoolsComponentHook(hook) {
  return component => {
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

function emit(instance, event, ...rawArgs) {
  const props = instance.vnode.props || EMPTY_OBJ;

  let args = rawArgs;
  const isModelListener = event.startsWith('update:'); // for v-model update:xxx events, apply modifiers on args

  const modelArg = isModelListener && event.slice(7);

  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === 'modelValue' ? 'model' : modelArg}Modifiers`;
    const {
      number,
      trim
    } = props[modifiersKey] || EMPTY_OBJ;

    if (trim) {
      args = rawArgs.map(a => a.trim());
    } else if (number) {
      args = rawArgs.map(toNumber);
    }
  }

  if (__VUE_PROD_DEVTOOLS__) {
    devtoolsComponentEmit(instance, event, args);
  }

  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
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

  const onceHandler = props[handlerName + `Once`];

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

function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  if (!appContext.deopt && comp.__emits !== undefined) {
    return comp.__emits;
  }

  const raw = comp.emits;
  let normalized = {}; // apply mixin/extends props

  let hasExtends = false;

  if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
    const extendEmits = raw => {
      const normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true);

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
    raw.forEach(key => normalized[key] = null);
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

let isRenderingCompiledSlot = 0;

const setCompiledSlotRendering = n => isRenderingCompiledSlot += n;
/**
 * Compiler runtime helper for rendering `<slot/>`
 * @private
 */


function renderSlot(slots, name, props = {}, // this is not a user-facing function, so the fallback is always generated by
// the compiler and guaranteed to be a function returning an array
fallback, noSlotted) {
  let slot = slots[name];
  // invocation interfering with template-based block tracking, but in
  // `renderSlot` we can be sure that it's template-based so we can force
  // enable it.


  isRenderingCompiledSlot++;
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, {
    key: props.key || `_${name}`
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
  return vnodes.some(child => {
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


let currentRenderingInstance = null;
let currentScopeId = null;
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
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
/**
 * Wrap a slot function to memoize current rendering instance
 * @private compiler helper
 */


function withCtx(fn, ctx = currentRenderingInstance) {
  if (!ctx) return fn;

  const renderFnWithContext = (...args) => {
    // If a user calls a compiled slot inside a template expression (#1745), it
    // can mess up block tracking, so by default we need to push a null block to
    // avoid that. This isn't necessary if rendering a compiled `<slot>`.
    if (!isRenderingCompiledSlot) {
      openBlock(true
      /* null block that disables tracking */
      );
    }

    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
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


let accessedAttrs = false;

function markAttrsAccessed() {
  accessedAttrs = true;
}

function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit,
    render,
    renderCache,
    data,
    setupState,
    ctx
  } = instance;
  let result;
  const prev = setCurrentRenderingInstance(instance);

  try {
    let fallthroughAttrs;

    if (vnode.shapeFlag & 4
    /* STATEFUL_COMPONENT */
    ) {
        // withProxy is a proxy with a different `has` trap only for
        // runtime-compiled render functions using `with` block.
        const proxyToUse = withProxy || proxy;
        result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
        fallthroughAttrs = attrs;
      } else {
      // functional
      const render = Component; // in dev, mark attrs accessed if optional props (attrs === props)

      if ("production" !== 'production' && attrs === props) ;

      result = normalizeVNode(render.length > 1 ? render(props, "production" !== 'production' ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },

        slots,
        emit
      } : {
        attrs,
        slots,
        emit
      }) : render(props, null
      /* we know it doesn't need it */
      ));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    } // attr merging
    // in dev mode, comments are preserved, and it's possible for a template
    // to have comments along side the root element which makes it a fragment


    let root = result;
    let setRoot = undefined;

    if ("production" !== 'production' && result.patchFlag > 0 && result.patchFlag & 2048
    /* DEV_ROOT_FRAGMENT */
    ) ;

    if (Component.inheritAttrs !== false && fallthroughAttrs) {
      const keys = Object.keys(fallthroughAttrs);
      const {
        shapeFlag
      } = root;

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

    if ("production" !== 'production' && setRoot) ; else {
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
/**
 * dev only
 * In dev mode, template root level comments are rendered, which turns the
 * template into a fragment root, but we need to locate the single element
 * root for attrs and scope id processing.
 */


const getChildRoot = vnode => {
  const rawChildren = vnode.children;
  const dynamicChildren = vnode.dynamicChildren;
  const childRoot = filterSingleRoot(rawChildren);

  if (!childRoot) {
    return [vnode, undefined];
  }

  const index = rawChildren.indexOf(childRoot);
  const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;

  const setRoot = updatedRoot => {
    rawChildren[index] = updatedRoot;

    if (dynamicChildren) {
      if (dynamicIndex > -1) {
        dynamicChildren[dynamicIndex] = updatedRoot;
      } else if (updatedRoot.patchFlag > 0) {
        vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
      }
    }
  };

  return [normalizeVNode(childRoot), setRoot];
};

function filterSingleRoot(children) {
  let singleRoot;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

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

const getFunctionalFallthrough = attrs => {
  let res;

  for (const key in attrs) {
    if (key === 'class' || key === 'style' || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }

  return res;
};

const filterModelListeners = (attrs, props) => {
  const res = {};

  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }

  return res;
};

const isElementRoot = vnode => {
  return vnode.shapeFlag & 6
  /* COMPONENT */
  || vnode.shapeFlag & 1
  /* ELEMENT */
  || vnode.type === Comment // potential v-if branch switch
  ;
};

function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const {
    props: prevProps,
    children: prevChildren,
    component
  } = prevVNode;
  const {
    props: nextProps,
    children: nextChildren,
    patchFlag
  } = nextVNode;
  const emits = component.emitsOptions; // Parent component's render function was hot-updated. Since this may have


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
        const dynamicProps = nextVNode.dynamicProps;

        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];

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
  const nextKeys = Object.keys(nextProps);

  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }

  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];

    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }

  return false;
}

function updateHOCHostEl({
  vnode,
  parent
}, el // HostNode
) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}

const isSuspense = type => type.__isSuspense; // Suspense exposes a component-like API, and is treated like a component

function normalizeSuspenseChildren(vnode) {
  const {
    shapeFlag,
    children
  } = vnode;
  let content;
  let fallback;

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
    content,
    fallback
  };
}

function normalizeSuspenseSlot(s) {
  if (isFunction(s)) {
    s = s();
  }

  if (isArray(s)) {
    const singleChild = filterSingleRoot(s);

    s = singleChild;
  }

  return normalizeVNode(s);
}

function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}

function initProps(instance, rawProps, isStateful, // result of bitwise flag comparison
isSSR = false) {
  const props = {};
  const attrs = {};
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
  const {
    props,
    attrs,
    vnode: {
      patchFlag
    }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;

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
        const propsToUpdate = instance.vnode.dynamicProps;

        for (let i = 0; i < propsToUpdate.length; i++) {
          const key = propsToUpdate[i]; // PROPS flag guarantees rawProps to be non-null

          const value = rawProps[key];

          if (options) {
            // attr / props separation was done on init and will be consistent
            // in this code path, so just check if attrs have it.
            if (hasOwn(attrs, key)) {
              attrs[key] = value;
            } else {
              const camelizedKey = camelize(key);
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

    let kebabKey;

    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && ( // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      (kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && ( // for camelCase
          rawPrevProps[key] !== undefined || // for kebab-case
          rawPrevProps[kebabKey] !== undefined)) {
            props[key] = resolvePropValue(options, rawProps || EMPTY_OBJ, key, undefined, instance);
          }
        } else {
          delete props[key];
        }
      }
    } // in the case of functional component w/o props declaration, props and
    // attrs point to the same object so it should already have been updated.


    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key)) {
          delete attrs[key];
        }
      }
    }
  } // trigger updates for $attrs in case it's used in component slots


  trigger$1(instance, "set"
  /* SET */
  , '$attrs');
}

function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;

  if (rawProps) {
    for (const key in rawProps) {
      const value = rawProps[key]; // key, ref are reserved and never passed down

      if (isReservedProp(key)) {
        continue;
      } // prop option names are camelized during normalization, so to support
      // kebab -> camel conversion here we need to camelize the key.


      let camelKey;

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
    const rawCurrentProps = toRaw(props);

    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, rawCurrentProps[key], instance);
    }
  }
}

function resolvePropValue(options, props, key, value, instance) {
  const opt = options[key];

  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default'); // default values

    if (hasDefault && value === undefined) {
      const defaultValue = opt.default;

      if (opt.type !== Function && isFunction(defaultValue)) {
        const {
          propsDefaults
        } = instance;

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

function normalizePropsOptions(comp, appContext, asMixin = false) {
  if (!appContext.deopt && comp.__props) {
    return comp.__props;
  }

  const raw = comp.props;
  const normalized = {};
  const needCastKeys = []; // apply mixin/extends props

  let hasExtends = false;

  if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
    const extendProps = raw => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
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
    for (let i = 0; i < raw.length; i++) {

      const normalizedKey = camelize(raw[i]);

      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {

    for (const key in raw) {
      const normalizedKey = camelize(key);

      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? {
          type: opt
        } : opt;

        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0
          /* shouldCast */
          ] = booleanIndex > -1;
          prop[1
          /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex; // if the prop needs boolean casting or default value

          if (booleanIndex > -1 || hasOwn(prop, 'default')) {
            needCastKeys.push(normalizedKey);
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
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex(t => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }

  return -1;
}

function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []); // cache the error handling wrapper for injected hooks so the same hook
    // can be properly deduped by the scheduler. "__weh" stands for "with error
    // handling".

    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      } // disable tracking inside all lifecycle hooks
      // since they can potentially be called inside effects.


      pauseTracking(); // Set currentInstance during hook invocation.
      // This assumes the hook does not synchronously trigger other hooks, which
      // can only be false when the user does something really funky.

      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
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

const createHook = lifecycle => (hook, target = currentInstance) => // post-create lifecycle registrations are noops during SSR
!isInSSRComponentSetup && injectHook(lifecycle, hook, target);

const onBeforeMount = createHook("bm"
/* BEFORE_MOUNT */
);
const onMounted = createHook("m"
/* MOUNTED */
);
const onBeforeUpdate = createHook("bu"
/* BEFORE_UPDATE */
);
const onUpdated = createHook("u"
/* UPDATED */
);
const onBeforeUnmount = createHook("bum"
/* BEFORE_UNMOUNT */
);
const onUnmounted = createHook("um"
/* UNMOUNTED */
);
const onRenderTriggered = createHook("rtg"
/* RENDER_TRIGGERED */
);
const onRenderTracked = createHook("rtc"
/* RENDER_TRACKED */
);

const onErrorCaptured = (hook, target = currentInstance) => {
  injectHook("ec"
  /* ERROR_CAPTURED */
  , hook, target);
}; // Simple effect.


const INITIAL_WATCHER_VALUE = {}; // implementation

function watch(source, cb, options) {

  return doWatch(source, cb, options);
}

function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  onTrack,
  onTrigger
} = EMPTY_OBJ, instance = currentInstance) {

  let getter;
  let forceTrigger = false;

  if (isRef(source)) {
    getter = () => source.value;

    forceTrigger = !!source._shallow;
  } else if (isReactive(source)) {
    getter = () => source;

    deep = true;
  } else if (isArray(source)) {
    getter = () => source.map(s => {
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
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () => callWithErrorHandling(source, instance, 2
      /* WATCH_GETTER */
      , [instance && instance.proxy]);
    } else {
      // no cb -> simple effect
      getter = () => {
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
    const baseGetter = getter;

    getter = () => traverse(baseGetter());
  }

  let cleanup;

  let onInvalidate = fn => {
    cleanup = runner.options.onStop = () => {
      callWithErrorHandling(fn, instance, 4
      /* WATCH_CLEANUP */
      );
    };
  };

  let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;

  const job = () => {
    if (!runner.active) {
      return;
    }

    if (cb) {
      // watch(source, cb)
      const newValue = runner();

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
  let scheduler;

  if (flush === 'sync') {
    scheduler = job;
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    // default: 'pre'
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        // with 'pre' option, the first call must happen before
        // the component is mounted so it is called synchronously.
        job();
      }
    };
  }

  const runner = effect(getter, {
    lazy: true,
    onTrack,
    onTrigger,
    scheduler
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

  return () => {
    stop(runner);

    if (instance) {
      remove(instance.effects, runner);
    }
  };
} // this.$watch


function instanceWatch(source, cb, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? () => publicThis[source] : source.bind(publicThis);
  return doWatch(getter, cb.bind(publicThis), options, this);
}

function traverse(value, seen = new Set()) {
  if (!isObject$1(value) || seen.has(value)) {
    return value;
  }

  seen.add(value);

  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach(v => {
      traverse(v, seen);
    });
  } else {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }

  return value;
}

function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}

const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
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

  setup(props, {
    slots
  }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);

      if (!children || !children.length) {
        return;
      } // warn multiple elements
      // props for a bit better perf


      const rawProps = toRaw(props);
      const {
        mode
      } = rawProps; // check mode


      const child = children[0];

      if (state.isLeaving) {
        return emptyPlaceholder(child);
      } // in the case of <transition><keep-alive/></transition>, we need to
      // compare the type of the kept-alive children.


      const innerChild = getKeepAliveChild(child);

      if (!innerChild) {
        return emptyPlaceholder(child);
      }

      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const {
        getTransitionKey
      } = innerChild.type;

      if (getTransitionKey) {
        const key = getTransitionKey();

        if (prevTransitionKey === undefined) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      } // handle mode


      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance); // update old tree's hooks in case of dynamic transition

        setTransitionHooks(oldInnerChild, leavingHooks); // switching between different views

        if (mode === 'out-in') {
          state.isLeaving = true; // return placeholder node and queue update when leave finishes

          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };

          return emptyPlaceholder(child);
        } else if (mode === 'in-out' && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild; // early removal callback

            el._leaveCb = () => {
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

const BaseTransition = BaseTransitionImpl;

function getLeavingNodesForType(state, vnode) {
  const {
    leavingVNodes
  } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);

  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }

  return leavingVNodesCache;
} // The transition hooks are attached to the vnode as vnode.transition
// and will be called at appropriate timing in the renderer.


function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);

  const callHook = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9
    /* TRANSITION_HOOK */
    , args);
  };

  const hooks = {
    mode,
    persisted,

    beforeEnter(el) {
      let hook = onBeforeEnter;

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


      const leavingVNode = leavingVNodesCache[key];

      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        // force early removal (not cancelled)
        leavingVNode.el._leaveCb();
      }

      callHook(hook, [el]);
    },

    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;

      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }

      let called = false;

      const done = el._enterCb = cancelled => {
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

    leave(el, remove) {
      const key = String(vnode.key);

      if (el._enterCb) {
        el._enterCb(true
        /* cancelled */
        );
      }

      if (state.isUnmounting) {
        return remove();
      }

      callHook(onBeforeLeave, [el]);
      let called = false;

      const done = el._leaveCb = cancelled => {
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

    clone(vnode) {
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

function getTransitionRawChildren(children, keepComment = false) {
  let ret = [];
  let keyedFragmentCount = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]; // handle fragment children case, e.g. v-for

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
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2
      /* BAIL */
      ;
    }
  }

  return ret;
}

const isKeepAlive = vnode => vnode.type.__isKeepAlive;

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

function registerKeepAliveHook(hook, type, target = currentInstance) {
  // cache the deactivate branch check wrapper for injected hooks so the same
  // hook can be properly deduped by the scheduler. "__wdc" stands for "with
  // deactivation check".
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    // only fire the hook if the target instance is NOT in a deactivated branch.
    let current = target;

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
    let current = target.parent;

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
  const injected = injectHook(type, hook, keepAliveRoot, true
  /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}

const isInternalKey = key => key[0] === '_' || key === '$stable';

const normalizeSlotValue = value => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];

const normalizeSlot = (key, rawSlot, ctx) => withCtx(props => {

  return normalizeSlotValue(rawSlot(props));
}, ctx);

const normalizeObjectSlots = (rawSlots, slots) => {
  const ctx = rawSlots._ctx;

  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];

    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {

      const normalized = normalizeSlotValue(value);

      slots[key] = () => normalized;
    }
  }
};

const normalizeVNodeSlots = (instance, children) => {

  const normalized = normalizeSlotValue(children);

  instance.slots.default = () => normalized;
};

const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32
  /* SLOTS_CHILDREN */
  ) {
      const type = children._;

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

const updateSlots = (instance, children, optimized) => {
  const {
    vnode,
    slots
  } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;

  if (vnode.shapeFlag & 32
  /* SLOTS_CHILDREN */
  ) {
      const type = children._;

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
    for (const key in slots) {
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
  const internalInstance = currentRenderingInstance;

  if (internalInstance === null) {
    return vnode;
  }

  const instance = internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);

  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];

    if (isFunction(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }

    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }

  return vnode;
}

function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];

    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }

    const hook = binding.dir[name];

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

let uid = 0;

function createAppAPI(render, hydrate) {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }

    const context = createAppContext();
    const installedPlugins = new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      version,

      get config() {
        return context.config;
      },

      set config(v) {
      },

      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ; else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else ;

        return app;
      },

      mixin(mixin) {
        if (__VUE_OPTIONS_API__) {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin); // global mixin with props/emits de-optimizes props/emits
            // normalization caching.

            if (mixin.props || mixin.emits) {
              context.deopt = true;
            }
          }
        }

        return app;
      },

      component(name, component) {

        if (!component) {
          return context.components[name];
        }

        context.components[name] = component;
        return app;
      },

      directive(name, directive) {

        if (!directive) {
          return context.directives[name];
        }

        context.directives[name] = directive;
        return app;
      },

      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps); // store app context on the root VNode.
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

      unmount() {
        if (isMounted) {
          render(null, app._container);

          if (__VUE_PROD_DEVTOOLS__) {
            devtoolsUnmountApp(app);
          }

          delete app._container.__vue_app__;
        }
      },

      provide(key, value) {
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

const isAsyncWrapper = i => !!i.type.__asyncLoader;

const prodEffectOptions = {
  scheduler: queueJob,
  // #1801, #2043 component render effects should allow recursive updates
  allowRecurse: true
};

const queuePostRenderEffect = queueEffectWithSuspense;

const setRef = (rawRef, oldRawRef, parentSuspense, vnode) => {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode));
    return;
  }

  let value;

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

  const {
    i: owner,
    r: ref
  } = rawRef;

  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState; // unset old ref

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
    const doSet = () => {
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
    const doSet = () => {
      ref.value = value;
    };

    if (value) {
      doSet.id = -1;
      queuePostRenderEffect(doSet, parentSuspense);
    } else {
      doSet();
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
    const target = getGlobalThis();
    target.__VUE__ = true;
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
  }

  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    forcePatchProp: hostForcePatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    cloneNode: hostCloneNode,
    insertStaticContent: hostInsertStaticContent
  } = options; // Note: functions inside this closure should use `const xxx = () => {}`
  // style in order to prevent being inlined by minifiers.

  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = false) => {
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

    const {
      type,
      ref,
      shapeFlag
    } = n2;

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

  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;

      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };

  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ''), container, anchor);
    } else {
      // there's no support for dynamic comments
      n2.el = n1.el;
    }
  };

  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
  };

  const moveStaticNode = ({
    el,
    anchor
  }, container, nextSibling) => {
    let next;

    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }

    hostInsert(anchor, container, nextSibling);
  };

  const removeStaticNode = ({
    el,
    anchor
  }) => {
    let next;

    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }

    hostRemove(anchor);
  };

  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === 'svg';

    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };

  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const {
      type,
      props,
      shapeFlag,
      transition,
      patchFlag,
      dirs
    } = vnode;

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
        for (const key in props) {
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


    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;

    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }

    hostInsert(el, container, anchor);

    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
      }, parentSuspense);
    }
  };

  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }

    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }

    if (parentComponent) {
      let subTree = parentComponent.subTree;

      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };

  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, slotScopeIds, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized, slotScopeIds);
    }
  };

  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let {
      patchFlag,
      dynamicChildren,
      dirs
    } = n2; // #1426 take the old vnode's patch flag into account since user may clone a
    // compiler-generated vnode, which de-opts to FULL_PROPS

    patchFlag |= n1.patchFlag & 16
    /* FULL_PROPS */
    ;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;

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
            const propsToUpdate = n2.dynamicProps;

            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];

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

    const areChildrenSVG = isSVG && n2.type !== 'foreignObject';

    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      // full diff
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }

    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
      }, parentSuspense);
    }
  }; // The fast path for blocks.


  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i]; // Determine the container (parent element) for the patch.

      const container = // - In the case of a Fragment, we need to provide the actual parent
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

  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        // empty string is not valid prop
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];

        if (next !== prev || hostForcePatchProp && hostForcePatchProp(el, key)) {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
    }
  };

  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText('');
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText('');
    let {
      patchFlag,
      dynamicChildren,
      slotScopeIds: fragmentSlotScopeIds
    } = n2;

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

  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
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

  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);


    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    } // resolve props and slots for setup context

    setupComponent(instance);
    // before proceeding


    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect); // Give it a placeholder if this is not hydration
      // TODO handle self-defined fallback

      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }

      return;
    }

    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };

  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;

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

  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    // create reactive effect for rendering
    instance.update = effect(function componentEffect() {
      if (!instance.isMounted) {
        let vnodeHook;
        const {
          el,
          props
        } = initialVNode;
        const {
          bm,
          m,
          parent
        } = instance; // beforeMount hook

        if (bm) {
          invokeArrayFns(bm);
        } // onVnodeBeforeMount


        if (vnodeHook = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        } // render

        const subTree = instance.subTree = renderComponentRoot(instance);

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
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => {
            invokeVNodeHook(vnodeHook, parent, scopedInitialVNode);
          }, parentSuspense);
        } // activated hook for keep-alive roots.
        // #1742 activated hook must be accessed after first render
        // since the hook may be injected by a child keep-alive


        const {
          a
        } = instance;

        if (a && initialVNode.shapeFlag & 256
        /* COMPONENT_SHOULD_KEEP_ALIVE */
        ) {
            queuePostRenderEffect(a, parentSuspense);
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
        let {
          next,
          bu,
          u,
          parent,
          vnode
        } = instance;
        let originNext = next;
        let vnodeHook;

        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        } // beforeUpdate hook


        if (bu) {
          invokeArrayFns(bu);
        } // onVnodeBeforeUpdate


        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        } // render

        const nextTree = renderComponentRoot(instance);

        const prevTree = instance.subTree;
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


        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        } // onVnodeUpdated


        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }, parentSuspense);
        }

        if (__VUE_PROD_DEVTOOLS__) {
          devtoolsComponentUpdated(instance);
        }
      }
    }, prodEffectOptions);
  };

  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking(); // props update may have triggered pre-flush watchers.
    // flush them before the render update.

    flushPreFlushCbs(undefined, instance.update);
    resetTracking();
  };

  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const {
      patchFlag,
      shapeFlag
    } = n2; // fast path

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

  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;

    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
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


  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1; // prev ending index

    let e2 = l2 - 1; // next ending index
    // 1. sync from start
    // (a b) c
    // (a b) d e

    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

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
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
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
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;

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
          const s1 = i; // prev starting index

          const s2 = i; // next starting index
          // 5.1 build key:index map for newChildren

          const keyToNewIndexMap = new Map();

          for (i = s2; i <= e2; i++) {
            const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

            if (nextChild.key != null) {

              keyToNewIndexMap.set(nextChild.key, i);
            }
          } // 5.2 loop through old children left to be patched and try to patch
          // matching nodes & remove nodes that are no longer present


          let j;
          let patched = 0;
          const toBePatched = e2 - s2 + 1;
          let moved = false; // used to track whether any node has moved

          let maxNewIndexSoFar = 0; // works as Map<newIndex, oldIndex>
          // Note that oldIndex is offset by +1
          // and oldIndex = 0 is a special value indicating the new node has
          // no corresponding old node.
          // used for determining longest stable subsequence

          const newIndexToOldIndexMap = new Array(toBePatched);

          for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

          for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];

            if (patched >= toBePatched) {
              // all new children have been patched so this can only be a removal
              unmount(prevChild, parentComponent, parentSuspense, true);
              continue;
            }

            let newIndex;

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


          const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
          j = increasingNewIndexSequence.length - 1; // looping backwards so that we can use last patched node as anchor

          for (i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;

            if (newIndexToOldIndexMap[i] === 0) {
              // mount new
              patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            } else if (moved) {
              // move if:
              // There is no stable subsequence (e.g. a reverse)
              // OR current node is not among the stable sequence
              if (j < 0 || i !== increasingNewIndexSequence[j]) {
                move(nextChild, container, anchor, 2
                /* REORDER */
                );
              } else {
                j--;
              }
            }
          }
        }
  };

  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const {
      el,
      type,
      transition,
      children,
      shapeFlag
    } = vnode;

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

      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }

      hostInsert(vnode.anchor, container, anchor);
      return;
    }

    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    } // single nodes


    const needTransition = moveType !== 2
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
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
        const {
          leave,
          delayLeave,
          afterLeave
        } = transition;

        const remove = () => hostInsert(el, container, anchor);

        const performLeave = () => {
          leave(el, () => {
            remove();
            afterLeave && afterLeave();
          });
        };

        if (delayLeave) {
          delayLeave(el, remove, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };

  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode; // unset ref

    if (ref != null) {
      setRef(ref, null, parentSuspense, null);
    }

    if (shapeFlag & 256
    /* COMPONENT_SHOULD_KEEP_ALIVE */
    ) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }

    const shouldInvokeDirs = shapeFlag & 1
    /* ELEMENT */
    && dirs;
    let vnodeHook;

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
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
      }, parentSuspense);
    }
  };

  const remove = vnode => {
    const {
      type,
      el,
      anchor,
      transition
    } = vnode;

    if (type === Fragment) {
      removeFragment(el, anchor);
      return;
    }

    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }

    const performRemove = () => {
      hostRemove(el);

      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };

    if (vnode.shapeFlag & 1
    /* ELEMENT */
    && transition && !transition.persisted) {
      const {
        leave,
        delayLeave
      } = transition;

      const performLeave = () => leave(el, performRemove);

      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };

  const removeFragment = (cur, end) => {
    // For fragments, directly remove all contained DOM nodes.
    // (fragment child nodes cannot have transition)
    let next;

    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }

    hostRemove(end);
  };

  const unmountComponent = (instance, parentSuspense, doRemove) => {

    const {
      bum,
      effects,
      update,
      subTree,
      um
    } = instance; // beforeUnmount hook

    if (bum) {
      invokeArrayFns(bum);
    }

    if (effects) {
      for (let i = 0; i < effects.length; i++) {
        stop(effects[i]);
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

    queuePostRenderEffect(() => {
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

  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };

  const getNextHostNode = vnode => {
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

  const render = (vnode, container, isSVG) => {
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

  const internals = {
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
  let hydrate;
  let hydrateNode;

  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}

function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
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


function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;

  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      // this is only called in the optimized path so array children are
      // guaranteed to be vnodes
      const c1 = ch1[i];
      let c2 = ch2[i];

      if (c2.shapeFlag & 1
      /* ELEMENT */
      && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32
        /* HYDRATE_EVENTS */
        ) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }

        if (!shallow) traverseStaticChildren(c1, c2);
      } // also inherit for comment nodes, but not placeholders (e.g. v-if which
    }
  }
} // https://en.wikipedia.org/wiki/Longest_increasing_subsequence


function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;

  for (i = 0; i < len; i++) {
    const arrI = arr[i];

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

const isTeleport = type => type.__isTeleport;
const COMPONENTS = 'components';
/**
 * @private
 */

function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}

const NULL_DYNAMIC_COMPONENT = Symbol();


function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;

  if (instance) {
    const Component = instance.type; // explicit self name has highest priority

    if (type === COMPONENTS) {
      const selfName = getComponentName(Component);

      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }

    const res = // local registration
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

const Fragment = Symbol(undefined);
const Text = Symbol(undefined);
const Comment = Symbol(undefined);
const Static = Symbol(undefined); // Since v-if and v-for are the two possible ways node structure can dynamically
// change, once we consider v-if branches and each v-for fragment a block, we
// can divide a template into nested blocks, and within each block the node
// structure would be stable. This allows us to skip most children diffing
// and only worry about the dynamic nodes (indicated by patch flags).

const blockStack = [];
let currentBlock = null;
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

function openBlock(disableTracking = false) {
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
  const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true
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

const InternalObjectKey = `__vInternal`;

const normalizeKey = ({
  key
}) => key != null ? key : null;

const normalizeRef = ({
  ref
}) => {
  return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? {
    i: currentRenderingInstance,
    r: ref
  } : ref : null;
};

const createVNode = _createVNode;

function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {

    type = Comment;
  }

  if (isVNode(type)) {
    // createVNode receiving an existing vnode. This happens in cases like
    // <component :is="vnode"/>
    // #2078 make sure to merge refs during the clone instead of overwriting it
    const cloned = cloneVNode(type, props, true
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

    let {
      class: klass,
      style
    } = props;

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


  const shapeFlag = isString(type) ? 1
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

  const vnode = {
    __v_isVNode: true,
    ["__v_skip"
    /* SKIP */
    ]: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children: null,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  }; // validate key

  normalizeChildren(vnode, children); // normalize suspense children

  if (shapeFlag & 128
  /* SUSPENSE */
  ) {
      const {
        content,
        fallback
      } = normalizeSuspenseChildren(vnode);
      vnode.ssContent = content;
      vnode.ssFallback = fallback;
    }

  if (// avoid a block node from tracking itself
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

function cloneVNode(vnode, extraProps, mergeRef = false) {
  // This is intentionally NOT using spread or extend to avoid the runtime
  // key enumeration cost.
  const {
    props,
    ref,
    patchFlag,
    children
  } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  return {
    __v_isVNode: true,
    ["__v_skip"
    /* SKIP */
    ]: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? // #2078 in the case of <component :is="vnode" ref="extra"/>
    // if the vnode itself already has a ref, cloneVNode will need to merge
    // the refs so the single vnode can be set on multiple refs
    mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children: children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: perserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 // hoisted node
    ? 16
    /* FULL_PROPS */
    : patchFlag | 16
    /* FULL_PROPS */
    : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
}
/**
 * @private
 */


function createTextVNode(text = ' ', flag = 0) {
  return createVNode(Text, null, text, flag);
}
/**
 * @private
 */


function createCommentVNode(text = '', // when used as the v-else branch, the comment node must be created as a
// block to ensure correct updates.
asBlock = false) {
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
  let type = 0;
  const {
    shapeFlag
  } = vnode;

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
        const slot = children.default;

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
      const slotFlag = children._;

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

function mergeProps(...args) {
  const ret = extend({}, args[0]);

  for (let i = 1; i < args.length; i++) {
    const toMerge = args[i];

    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === 'style') {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];

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
  if (!currentInstance) ; else {
    let provides = currentInstance.provides; // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.

    const parentProvides = currentInstance.parent && currentInstance.parent.provides;

    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    } // TS doesn't allow symbol as index type


    provides[key] = value;
  }
}

function inject(key, defaultValue, treatDefaultAsFactory = false) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance;

  if (instance) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the intance is at root
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;

    if (provides && key in provides) {
      // TS doesn't allow symbol as index type
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue() : defaultValue;
    } else ;
  }
}

let shouldCacheAccess = true;

function applyOptions(instance, options, deferredData = [], deferredWatch = [], deferredProvide = [], asMixin = false) {
  const {
    // composition
    mixins,
    extends: extendsOptions,
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // assets
    components,
    directives,
    // lifecycle
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    // public API
    expose
  } = options;
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  const globalMixins = instance.appContext.mixins;

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
  }
  // - props (already done outside of this function)
  // - inject
  // - methods
  // - data (deferred since it relies on `this` access)
  // - computed
  // - watch (deferred since it relies on `this` access)


  if (injectOptions) {
    if (isArray(injectOptions)) {
      for (let i = 0; i < injectOptions.length; i++) {
        const key = injectOptions[i];
        ctx[key] = inject(key);
      }
    } else {
      for (const key in injectOptions) {
        const opt = injectOptions[key];

        if (isObject$1(opt)) {
          ctx[key] = inject(opt.from || key, opt.default, true
          /* treat default function as factory */
          );
        } else {
          ctx[key] = inject(opt);
        }
      }
    }
  }

  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];

      if (isFunction(methodHandler)) {
        // In dev mode, we use the `createRenderContext` function to define methods to the proxy target,
        // and those are read-only but reconfigurable, so it needs to be redefined here
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }

  if (!asMixin) {
    if (deferredData.length) {
      deferredData.forEach(dataFn => resolveData(instance, dataFn, publicThis));
    }

    if (dataOptions) {
      // @ts-ignore dataOptions is not fully type safe
      resolveData(instance, dataOptions, publicThis);
    }
  } else if (dataOptions) {
    deferredData.push(dataOptions);
  }

  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;

      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: v => c.value = v
      });
    }
  }

  if (watchOptions) {
    deferredWatch.push(watchOptions);
  }

  if (!asMixin && deferredWatch.length) {
    deferredWatch.forEach(watchOptions => {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    });
  }

  if (provideOptions) {
    deferredProvide.push(provideOptions);
  }

  if (!asMixin && deferredProvide.length) {
    deferredProvide.forEach(provideOptions => {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach(key => {
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
        const exposed = instance.exposed || (instance.exposed = proxyRefs({}));
        expose.forEach(key => {
          exposed[key] = toRef(publicThis, key);
        });
      } else if (!instance.exposed) {
        instance.exposed = EMPTY_OBJ;
      }
    }
  }
}

function callSyncHook(name, type, options, instance, globalMixins) {
  for (let i = 0; i < globalMixins.length; i++) {
    callHookWithMixinAndExtends(name, type, globalMixins[i], instance);
  }

  callHookWithMixinAndExtends(name, type, options, instance);
}

function callHookWithMixinAndExtends(name, type, options, instance) {
  const {
    extends: base,
    mixins
  } = options;
  const selfHook = options[name];

  if (base) {
    callHookWithMixinAndExtends(name, type, base, instance);
  }

  if (mixins) {
    for (let i = 0; i < mixins.length; i++) {
      callHookWithMixinAndExtends(name, type, mixins[i], instance);
    }
  }

  if (selfHook) {
    callWithAsyncErrorHandling(selfHook.bind(instance.proxy), instance, type);
  }
}

function applyMixins(instance, mixins, deferredData, deferredWatch, deferredProvide) {
  for (let i = 0; i < mixins.length; i++) {
    applyOptions(instance, mixins[i], deferredData, deferredWatch, deferredProvide, true);
  }
}

function resolveData(instance, dataFn, publicThis) {

  shouldCacheAccess = false;
  const data = dataFn.call(publicThis, publicThis);
  shouldCacheAccess = true;

  if (!isObject$1(data)) ; else if (instance.data === EMPTY_OBJ) {
    instance.data = reactive(data);
  } else {
    // existing data: this is a mixin or extends.
    extend(instance.data, data);
  }
}

function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes('.') ? createPathGetter(publicThis, key) : () => publicThis[key];

  if (isString(raw)) {
    const handler = ctx[raw];

    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray(raw)) {
      raw.forEach(r => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];

      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}

function createPathGetter(ctx, path) {
  const segments = path.split('.');
  return () => {
    let cur = ctx;

    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }

    return cur;
  };
}

function resolveMergedOptions(instance) {
  const raw = instance.type;
  const {
    __merged,
    mixins,
    extends: extendsOptions
  } = raw;
  if (__merged) return __merged;
  const globalMixins = instance.appContext.mixins;
  if (!globalMixins.length && !mixins && !extendsOptions) return raw;
  const options = {};
  globalMixins.forEach(m => mergeOptions(options, m, instance));
  mergeOptions(options, raw, instance);
  return raw.__merged = options;
}

function mergeOptions(to, from, instance) {
  const strats = instance.appContext.config.optionMergeStrategies;
  const {
    mixins,
    extends: extendsOptions
  } = from;
  extendsOptions && mergeOptions(to, extendsOptions, instance);
  mixins && mixins.forEach(m => mergeOptions(to, m, instance));

  for (const key in from) {
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


const getPublicInstance = i => {
  if (!i) return null;
  if (isStatefulComponent(i)) return i.exposed ? i.exposed : i.proxy;
  return getPublicInstance(i.parent);
};

const publicPropertiesMap = extend(Object.create(null), {
  $: i => i,
  $el: i => i.vnode.el,
  $data: i => i.data,
  $props: i => i.props,
  $attrs: i => i.attrs,
  $slots: i => i.slots,
  $refs: i => i.refs,
  $parent: i => getPublicInstance(i.parent),
  $root: i => getPublicInstance(i.root),
  $emit: i => i.emit,
  $options: i => __VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type,
  $forceUpdate: i => () => queueJob(i.update),
  $nextTick: i => nextTick.bind(i.proxy),
  $watch: i => __VUE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP
});
const PublicInstanceProxyHandlers = {
  get({
    _: instance
  }, key) {
    const {
      ctx,
      setupState,
      data,
      props,
      accessCache,
      type,
      appContext
    } = instance; // let @vue/reactivity know it should never observe Vue public instances.

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


    let normalizedProps;

    if (key[0] !== '$') {
      const n = accessCache[key];

      if (n !== undefined) {
        switch (n) {
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

    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties; // public $xxx properties

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

  set({
    _: instance
  }, key, value) {
    const {
      data,
      setupState,
      ctx
    } = instance;

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

  has({
    _: {
      data,
      setupState,
      accessCache,
      ctx,
      appContext,
      propsOptions
    }
  }, key) {
    let normalizedProps;
    return accessCache[key] !== undefined || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  }

};

const RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
  get(target, key) {
    // fast path for unscopables when using `with` block
    if (key === Symbol.unscopables) {
      return;
    }

    return PublicInstanceProxyHandlers.get(target, key, target);
  },

  has(_, key) {
    const has = key[0] !== '_' && !isGloballyWhitelisted(key);

    return has;
  }

}); // In dev mode, the proxy target exposes the same properties as seen on `this`

const emptyAppContext = createAppContext();
let uid$1 = 0;

function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type; // inherit parent app context - or - if root, adopt from root vnode

  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
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
    suspense,
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

let currentInstance = null;

const getCurrentInstance = () => currentInstance || currentRenderingInstance;

const setCurrentInstance = instance => {
  currentInstance = instance;
};

function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4
  /* STATEFUL_COMPONENT */
  ;
}

let isInSSRComponentSetup = false;

function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const {
    props,
    children
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : undefined;
  isInSSRComponentSetup = false;
  return setupResult;
}

function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;


  instance.accessCache = Object.create(null); // 1. create public instance / render proxy
  // also mark it raw so it's never observed

  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);


  const {
    setup
  } = Component;

  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    currentInstance = instance;
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0
    /* SETUP_FUNCTION */
    , [instance.props, setupContext]);
    resetTracking();
    currentInstance = null;

    if (isPromise$1(setupResult)) {
      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult.then(resolvedResult => {
          handleSetupResult(instance, resolvedResult);
        }).catch(e => {
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
  const Component = instance.type; // template / render function normalization

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
  const expose = exposed => {

    instance.exposed = proxyRefs(exposed);
  };

  {
    return {
      attrs: instance.attrs,
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
} // record effects created during a component's setup() so that they can be
// stopped when the component unmounts


function recordInstanceBoundEffect(effect, instance = currentInstance) {
  if (instance) {
    (instance.effects || (instance.effects = [])).push(effect);
  }
}

const classifyRE = /(?:^|[-_])(\w)/g;

const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');

function getComponentName(Component) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name;
}
/* istanbul ignore next */


function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);

  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);

    if (match) {
      name = match[1];
    }
  }

  if (!name && instance && instance.parent) {
    // try to infer the name based on reverse resolution
    const inferFromRegistry = registry => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };

    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }

  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}

function isClassComponent(value) {
  return isFunction(value) && '__vccOpts' in value;
}

function computed(getterOrOptions) {
  const c = computed$1(getterOrOptions);
  recordInstanceBoundEffect(c.effect);
  return c;
} // implementation


function h(type, propsOrChildren, children) {
  const l = arguments.length;

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
  let ret;

  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);

    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i);
    }
  } else if (typeof source === 'number') {

    ret = new Array(source);

    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, renderItem);
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }

  return ret;
}


const version = "3.0.11";

const svgNS = 'http://www.w3.org/2000/svg';
const doc = typeof document !== 'undefined' ? document : null;
let tempContainer;
let tempSVGContainer;
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: child => {
    const parent = child.parentNode;

    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? {
      is
    } : undefined);

    if (tag === 'select' && props && props.multiple != null) {
      el.setAttribute('multiple', props.multiple);
    }

    return el;
  },
  createText: text => doc.createTextNode(text),
  createComment: text => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: node => node.parentNode,
  nextSibling: node => node.nextSibling,
  querySelector: selector => doc.querySelector(selector),

  setScopeId(el, id) {
    el.setAttribute(id, '');
  },

  cloneNode(el) {
    const cloned = el.cloneNode(true); // #3072
    // - in `patchDOMProp`, we store the actual value in the `el._value` property.
    // - normally, elements using `:value` bindings will not be hoisted, but if
    //   the bound value is a constant, e.g. `:value="true"` - they do get
    //   hoisted.
    // - in production, hoisted nodes are cloned when subsequent inserts, but
    //   cloneNode() does not copy the custom property we attached.
    // - This may need to account for other custom DOM properties we attach to
    //   elements in addition to `_value` in the future.

    if (`_value` in el) {
      cloned._value = el._value;
    }

    return cloned;
  },

  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG) {
    const temp = isSVG ? tempSVGContainer || (tempSVGContainer = doc.createElementNS(svgNS, 'svg')) : tempContainer || (tempContainer = doc.createElement('div'));
    temp.innerHTML = content;
    const first = temp.firstChild;
    let node = first;
    let last = node;

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
    const transitionClasses = el._vtc;

    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(' ');
    }

    el.className = value;
  }
}

function patchStyle(el, prev, next) {
  const style = el.style;

  if (!next) {
    el.removeAttribute('style');
  } else if (isString(next)) {
    if (prev !== next) {
      const current = style.display;
      style.cssText = next; // indicates that the `display` of the element is controlled by `v-show`,
      // so we always keep the current `display` value regardless of the `style` value,
      // thus handing over control to `v-show`.

      if ('_vod' in el) {
        style.display = current;
      }
    }
  } else {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }

    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, '');
        }
      }
    }
  }
}

const importantRE = /\s*!important$/;

function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach(v => setStyle(style, name, v));
  } else {
    if (name.startsWith('--')) {
      // custom property definition
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);

      if (importantRE.test(val)) {
        // !important
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ''), 'important');
      } else {
        style[prefixed] = val;
      }
    }
  }
}

const prefixes = ['Webkit', 'Moz', 'ms'];
const prefixCache = {};

function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];

  if (cached) {
    return cached;
  }

  let name = camelize(rawName);

  if (name !== 'filter' && name in style) {
    return prefixCache[rawName] = name;
  }

  name = capitalize(name);

  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;

    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }

  return rawName;
}

const xlinkNS = 'http://www.w3.org/1999/xlink';

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
    const isBoolean = isSpecialBooleanAttr(key);

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
    const newValue = value == null ? '' : value;

    if (el.value !== newValue) {
      el.value = newValue;
    }

    return;
  }

  if (value === '' || value == null) {
    const type = typeof el[key];

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
  } catch (e) {
  }
} // Async edge case fix requires storing an event listener's attach timestamp.


let _getNow = Date.now;
let skipTimestampCheck = false;

if (typeof window !== 'undefined') {
  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  if (_getNow() > document.createEvent('Event').timeStamp) {
    // if the low-res timestamp which is bigger than the event timestamp
    // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listeners as well.
    _getNow = () => performance.now();
  } // #3485: Firefox <= 53 has incorrect Event.timeStamp implementation
  // and does not fire microtasks in between event propagation, so safe to exclude.


  const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
  skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
} // To avoid the overhead of repeatedly calling performance.now(), we cache
// and use the same timestamp for all event listeners attached in the same tick.


let cachedNow = 0;
const p = Promise.resolve();

const reset = () => {
  cachedNow = 0;
};

const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());

function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}

function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}

function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  // vei = vue event invokers
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];

  if (nextValue && existingInvoker) {
    // patch
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);

    if (nextValue) {
      // add
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      // remove
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = undefined;
    }
  }
}

const optionsModifierRE = /(?:Once|Passive|Capture)$/;

function parseName(name) {
  let options;

  if (optionsModifierRE.test(name)) {
    options = {};
    let m;

    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }

  return [hyphenate(name.slice(2)), options];
}

function createInvoker(initialValue, instance) {
  const invoker = e => {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    const timeStamp = e.timeStamp || _getNow();

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
    const originalStop = e.stopImmediatePropagation;

    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };

    return value.map(fn => e => !e._stopped && fn(e));
  } else {
    return value;
  }
}

const nativeOnRE = /^on[a-z]/;

const forcePatchProp = (_, key) => key === 'value';

const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
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

const TRANSITION = 'transition';
const ANIMATION = 'animation'; // DOM Transition is a higher-order-component based on the platform-agnostic
// base Transition component, with DOM-specific logic.

const Transition = (props, {
  slots
}) => h(BaseTransition, resolveTransitionProps(props), slots);

Transition.displayName = 'Transition';
const DOMTransitionPropsValidators = {
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
  let {
    name = 'v',
    type,
    css = true,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const baseProps = {};

  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }

  if (!css) {
    return baseProps;
  }

  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;

  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };

  const finishLeave = (el, done) => {
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };

  const makeEnterHook = isAppear => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;

      const resolve = () => finishEnter(el, isAppear, done);

      hook && hook(el, resolve);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);

        if (!(hook && hook.length > 1)) {
          whenTransitionEnds(el, type, enterDuration, resolve);
        }
      });
    };
  };

  return extend(baseProps, {
    onBeforeEnter(el) {
      onBeforeEnter && onBeforeEnter(el);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },

    onBeforeAppear(el) {
      onBeforeAppear && onBeforeAppear(el);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },

    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),

    onLeave(el, done) {
      const resolve = () => finishLeave(el, done);

      addTransitionClass(el, leaveFromClass); // force reflow so *-leave-from classes immediately take effect (#2593)

      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);

        if (!(onLeave && onLeave.length > 1)) {
          whenTransitionEnds(el, type, leaveDuration, resolve);
        }
      });
      onLeave && onLeave(el, resolve);
    },

    onEnterCancelled(el) {
      finishEnter(el, false);
      onEnterCancelled && onEnterCancelled(el);
    },

    onAppearCancelled(el) {
      finishEnter(el, true);
      onAppearCancelled && onAppearCancelled(el);
    },

    onLeaveCancelled(el) {
      finishLeave(el);
      onLeaveCancelled && onLeaveCancelled(el);
    }

  });
}

function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}

function NumberOf(val) {
  const res = toNumber(val);
  return res;
}

function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach(c => c && el.classList.add(c));
  (el._vtc || (el._vtc = new Set())).add(cls);
}

function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach(c => c && el.classList.remove(c));
  const {
    _vtc
  } = el;

  if (_vtc) {
    _vtc.delete(cls);

    if (!_vtc.size) {
      el._vtc = undefined;
    }
  }
}

function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}

let endId = 0;

function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
  const id = el._endId = ++endId;

  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve();
    }
  };

  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }

  const {
    type,
    timeout,
    propCount
  } = getTransitionInfo(el, expectedType);

  if (!type) {
    return resolve();
  }

  const endEvent = type + 'end';
  let ended = 0;

  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };

  const onEnd = e => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };

  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}

function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  const getStyleProperties = key => (styles[key] || '').split(', ');

  const transitionDelays = getStyleProperties(TRANSITION + 'Delay');
  const transitionDurations = getStyleProperties(TRANSITION + 'Duration');
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + 'Delay');
  const animationDurations = getStyleProperties(ANIMATION + 'Duration');
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
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

  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property']);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}

function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
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

const getModelAssigner = vnode => {
  const fn = vnode.props['onUpdate:modelValue'];
  return isArray(fn) ? value => invokeArrayFns(fn, value) : fn;
};

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  const target = e.target;

  if (target.composing) {
    target.composing = false;
    trigger(target, 'input');
  }
}

function trigger(el, type) {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
} // We are exporting the v-model runtime directly as vnode hooks so that it can
// be tree-shaken in case v-model is never used.


const vModelText = {
  created(el, {
    modifiers: {
      lazy,
      trim,
      number
    }
  }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || el.type === 'number';
    addEventListener(el, lazy ? 'change' : 'input', e => {
      if (e.target.composing) return;
      let domValue = el.value;

      if (trim) {
        domValue = domValue.trim();
      } else if (castToNumber) {
        domValue = toNumber(domValue);
      }

      el._assign(domValue);
    });

    if (trim) {
      addEventListener(el, 'change', () => {
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
  mounted(el, {
    value
  }) {
    el.value = value == null ? '' : value;
  },

  beforeUpdate(el, {
    value,
    modifiers: {
      trim,
      number
    }
  }, vnode) {
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

    const newValue = value == null ? '' : value;

    if (el.value !== newValue) {
      el.value = newValue;
    }
  }

};

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
const modifierGuards = {
  stop: e => e.stopPropagation(),
  prevent: e => e.preventDefault(),
  self: e => e.target !== e.currentTarget,
  ctrl: e => !e.ctrlKey,
  shift: e => !e.shiftKey,
  alt: e => !e.altKey,
  meta: e => !e.metaKey,
  left: e => 'button' in e && e.button !== 0,
  middle: e => 'button' in e && e.button !== 1,
  right: e => 'button' in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some(m => e[`${m}Key`] && !modifiers.includes(m))
};
/**
 * @private
 */

const withModifiers = (fn, modifiers) => {
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }

    return fn(event, ...args);
  };
}; // Kept for 2.x compat.
// Note: IE11 compat for `spacebar` and `del` is removed for now.


const keyNames = {
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

const withKeys = (fn, modifiers) => {
  return event => {
    if (!('key' in event)) return;
    const eventKey = hyphenate(event.key);

    if ( // None of the provided key modifiers match the current event key
    !modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
      return;
    }

    return fn(event);
  };
};

const vShow = {
  beforeMount(el, {
    value
  }, {
    transition
  }) {
    el._vod = el.style.display === 'none' ? '' : el.style.display;

    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },

  mounted(el, {
    value
  }, {
    transition
  }) {
    if (transition && value) {
      transition.enter(el);
    }
  },

  updated(el, {
    value,
    oldValue
  }, {
    transition
  }) {
    if (!value === !oldValue) return;

    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },

  beforeUnmount(el, {
    value
  }) {
    setDisplay(el, value);
  }

};

function setDisplay(el, value) {
  el.style.display = value ? el._vod : 'none';
}

const rendererOptions = extend({
  patchProp,
  forcePatchProp
}, nodeOps); // lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.

let renderer;

function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}

const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);

  const {
    mount
  } = app;

  app.mount = containerOrSelector => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;

    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    } // clear content before mounting


    container.innerHTML = '';
    const proxy = mount(container, false, container instanceof SVGElement);

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
    const res = document.querySelector(container);

    return res;
  }

  return container;
}

/**
 * Media Event bus - used for communication between joomla and vue
 */
class Event {
  /**
     * Media Event constructor
     */
  constructor() {
    this.events = {};
  }
  /**
     * Fire an event
     * @param event
     * @param data
     */


  fire(event, data = null) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(data));
    }
  }
  /**
     * Listen to events
     * @param event
     * @param callback
     */


  listen(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }

}

// Loading state
const SET_IS_LOADING = 'SET_IS_LOADING'; // Selecting media items

const SELECT_DIRECTORY = 'SELECT_DIRECTORY';
const SELECT_BROWSER_ITEM = 'SELECT_BROWSER_ITEM';
const SELECT_BROWSER_ITEMS = 'SELECT_BROWSER_ITEMS';
const UNSELECT_BROWSER_ITEM = 'UNSELECT_BROWSER_ITEM';
const UNSELECT_ALL_BROWSER_ITEMS = 'UNSELECT_ALL_BROWSER_ITEMS'; // In/Decrease grid item size

const INCREASE_GRID_SIZE = 'INCREASE_GRID_SIZE';
const DECREASE_GRID_SIZE = 'DECREASE_GRID_SIZE'; // Api handlers

const LOAD_CONTENTS_SUCCESS = 'LOAD_CONTENTS_SUCCESS';
const LOAD_FULL_CONTENTS_SUCCESS = 'LOAD_FULL_CONTENTS_SUCCESS';
const CREATE_DIRECTORY_SUCCESS = 'CREATE_DIRECTORY_SUCCESS';
const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'; // Create folder modal

const SHOW_CREATE_FOLDER_MODAL = 'SHOW_CREATE_FOLDER_MODAL';
const HIDE_CREATE_FOLDER_MODAL = 'HIDE_CREATE_FOLDER_MODAL'; // Confirm Delete Modal

const SHOW_CONFIRM_DELETE_MODAL = 'SHOW_CONFIRM_DELETE_MODAL';
const HIDE_CONFIRM_DELETE_MODAL = 'HIDE_CONFIRM_DELETE_MODAL'; // Infobar

const SHOW_INFOBAR = 'SHOW_INFOBAR';
const HIDE_INFOBAR = 'HIDE_INFOBAR'; // Delete items

const DELETE_SUCCESS = 'DELETE_SUCCESS'; // List view

const CHANGE_LIST_VIEW = 'CHANGE_LIST_VIEW'; // Preview modal

const SHOW_PREVIEW_MODAL = 'SHOW_PREVIEW_MODAL';
const HIDE_PREVIEW_MODAL = 'HIDE_PREVIEW_MODAL'; // Rename modal

const SHOW_RENAME_MODAL = 'SHOW_RENAME_MODAL';
const HIDE_RENAME_MODAL = 'HIDE_RENAME_MODAL';
const RENAME_SUCCESS = 'RENAME_SUCCESS'; // Share model

const SHOW_SHARE_MODAL = 'SHOW_SHARE_MODAL';
const HIDE_SHARE_MODAL = 'HIDE_SHARE_MODAL'; // Search Query

const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';

class Notifications {
  /* Send and success notification */
  // eslint-disable-next-line class-methods-use-this
  success(message, options) {
    // eslint-disable-next-line no-use-before-define
    notifications.notify(message, {
      type: 'message',
      // @todo rename it to success
      dismiss: true,
      ...options
    });
  }
  /* Send an error notification */
  // eslint-disable-next-line class-methods-use-this


  error(message, options) {
    // eslint-disable-next-line no-use-before-define
    notifications.notify(message, {
      type: 'error',
      // @todo rename it to danger
      dismiss: true,
      ...options
    });
  }
  /* Ask the user a question */
  // eslint-disable-next-line class-methods-use-this


  ask(message) {
    return window.confirm(message);
  }
  /* Send a notification */
  // eslint-disable-next-line class-methods-use-this


  notify(message, options) {
    let timer;

    if (options.type === 'message') {
      timer = 3000;
    }

    Joomla.renderMessages({
      [options.type]: [Joomla.JText._(message)]
    }, undefined, true, timer);
  }

} // eslint-disable-next-line import/no-mutable-exports,import/prefer-default-export


let notifications = new Notifications();

var script$k = {
  name: 'MediaApp',
  data() {
    return {
      // The full height of the app in px
      fullHeight: '',
    };
  },
  computed: {
    disks() {
      return this.$store.state.disks;
    },
  },
  created() {
    // Listen to the toolbar events
    MediaManager.Event.listen('onClickCreateFolder', () => this.$store.commit(SHOW_CREATE_FOLDER_MODAL));
    MediaManager.Event.listen('onClickDelete', () => {
      if (this.$store.state.selectedItems.length > 0) {
        this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
      } else {
        notifications.error('COM_MEDIA_PLEASE_SELECT_ITEM');
      }
    });
  },
  mounted() {
    // Set the full height and add event listener when dom is updated
    this.$nextTick(() => {
      this.setFullHeight();
      // Add the global resize event listener
      window.addEventListener('resize', this.setFullHeight);
    });

    // Initial load the data
    this.$store.dispatch('getContents', this.$store.state.selectedDirectory);
  },
  beforeUnmount() {
    // Remove the global resize event listener
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    /* Set the full height on the app container */
    setFullHeight() {
      this.fullHeight = `${window.innerHeight - this.$el.getBoundingClientRect().top}px`;
    },
  },
};

const _hoisted_1$i = { class: "media-container" };
const _hoisted_2$f = { class: "media-sidebar" };
const _hoisted_3$e = { class: "media-main" };

function render$k(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_disk = resolveComponent("media-disk");
  const _component_media_toolbar = resolveComponent("media-toolbar");
  const _component_media_browser = resolveComponent("media-browser");
  const _component_media_upload = resolveComponent("media-upload");
  const _component_media_create_folder_modal = resolveComponent("media-create-folder-modal");
  const _component_media_preview_modal = resolveComponent("media-preview-modal");
  const _component_media_rename_modal = resolveComponent("media-rename-modal");
  const _component_media_share_modal = resolveComponent("media-share-modal");
  const _component_media_confirm_delete_modal = resolveComponent("media-confirm-delete-modal");

  return (openBlock(), createBlock("div", _hoisted_1$i, [
    createVNode("div", _hoisted_2$f, [
      (openBlock(true), createBlock(Fragment, null, renderList($options.disks, (disk, index) => {
        return (openBlock(), createBlock(_component_media_disk, {
          key: index,
          uid: index,
          disk: disk
        }, null, 8 /* PROPS */, ["uid", "disk"]))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    createVNode("div", _hoisted_3$e, [
      createVNode(_component_media_toolbar),
      createVNode(_component_media_browser)
    ]),
    createVNode(_component_media_upload),
    createVNode(_component_media_create_folder_modal),
    createVNode(_component_media_preview_modal),
    createVNode(_component_media_rename_modal),
    createVNode(_component_media_share_modal),
    createVNode(_component_media_confirm_delete_modal)
  ]))
}

script$k.render = render$k;
script$k.__file = "administrator/components/com_media/resources/scripts/components/app.vue";

var script$j = {
  name: 'MediaDisk',
  // eslint-disable-next-line vue/require-prop-types
  props: ['disk', 'uid'],
  computed: {
    diskId() {
      return `disk-${this.uid + 1}`;
    },
  },
};

const _hoisted_1$h = { class: "media-disk" };

function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_drive = resolveComponent("media-drive");

  return (openBlock(), createBlock("div", _hoisted_1$h, [
    createVNode("h2", {
      id: $options.diskId,
      class: "media-disk-name"
    }, toDisplayString($props.disk.displayName), 9 /* TEXT, PROPS */, ["id"]),
    (openBlock(true), createBlock(Fragment, null, renderList($props.disk.drives, (drive, index) => {
      return (openBlock(), createBlock(_component_media_drive, {
        key: index,
        "disk-id": $options.diskId,
        counter: index,
        drive: drive,
        total: $props.disk.drives.length
      }, null, 8 /* PROPS */, ["disk-id", "counter", "drive", "total"]))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

script$j.render = render$j;
script$j.__file = "administrator/components/com_media/resources/scripts/components/tree/disk.vue";

var navigable = {
  methods: {
    navigateTo(path) {
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
    isActive() {
      return (this.$store.state.selectedDirectory === this.drive.root);
    },
    getTabindex() {
      return this.isActive ? 0 : -1;
    },
  },
  methods: {
    /* Handle the on drive click event */
    onDriveClick() {
      this.navigateTo(this.drive.root);
    },
  },
};

const _hoisted_1$g = { class: "item-name" };

function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_tree = resolveComponent("media-tree");

  return (openBlock(), createBlock("div", {
    class: "media-drive",
    onClick: _cache[1] || (_cache[1] = withModifiers($event => ($options.onDriveClick()), ["stop","prevent"]))
  }, [
    createVNode("ul", {
      class: "media-tree",
      role: "tree",
      "aria-labelledby": $props.diskId
    }, [
      createVNode("li", {
        class: {active: $options.isActive, 'media-tree-item': true, 'media-drive-name': true},
        role: "treeitem",
        "aria-level": "1",
        "aria-setsize": $props.counter,
        "aria-posinset": 1,
        tabindex: $options.getTabindex
      }, [
        createVNode("a", null, [
          createVNode("span", _hoisted_1$g, toDisplayString($props.drive.displayName), 1 /* TEXT */)
        ]),
        createVNode(_component_media_tree, {
          root: $props.drive.root,
          level: 2
        }, null, 8 /* PROPS */, ["root"])
      ], 10 /* CLASS, PROPS */, ["aria-setsize", "tabindex"])
    ], 8 /* PROPS */, ["aria-labelledby"])
  ]))
}

script$i.render = render$i;
script$i.__file = "administrator/components/com_media/resources/scripts/components/tree/drive.vue";

var script$h = {
  name: 'MediaTree',
  props: {
    root: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  computed: {
    /* Get the directories */
    directories() {
      return this.$store.state.directories
        .filter((directory) => (directory.directory === this.root))
        // Sort alphabetically
        .sort((a, b) => ((a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1));
    },
  },
};

const _hoisted_1$f = {
  class: "media-tree",
  role: "group"
};

function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_tree_item = resolveComponent("media-tree-item");

  return (openBlock(), createBlock("ul", _hoisted_1$f, [
    (openBlock(true), createBlock(Fragment, null, renderList($options.directories, (item, index) => {
      return (openBlock(), createBlock(_component_media_tree_item, {
        key: item.path,
        counter: index,
        item: item,
        size: $options.directories.length,
        level: $props.level
      }, null, 8 /* PROPS */, ["counter", "item", "size", "level"]))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

script$h.render = render$h;
script$h.__file = "administrator/components/com_media/resources/scripts/components/tree/tree.vue";

var script$g = {
  name: 'MediaTreeItem',
  mixins: [navigable],
  props: {
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  computed: {
    /* Whether or not the item is active */
    isActive() {
      return (this.item.path === this.$store.state.selectedDirectory);
    },
    /**
             * Whether or not the item is open
             *
             * @return  boolean
             */
    isOpen() {
      return this.$store.state.selectedDirectory.includes(this.item.path);
    },
    /* Whether or not the item has children */
    hasChildren() {
      return this.item.directories.length > 0;
    },
    iconClass() {
      return {
        fas: false,
        'icon-folder': !this.isOpen,
        'icon-folder-open': this.isOpen,
      };
    },
    getTabindex() {
      return this.isActive ? 0 : -1;
    },
  },
  methods: {
    /* Handle the on item click event */
    onItemClick() {
      this.navigateTo(this.item.path);
    },
  },
};

const _hoisted_1$e = { class: "item-icon" };
const _hoisted_2$e = { class: "item-name" };

function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_tree = resolveComponent("media-tree");

  return (openBlock(), createBlock("li", {
    class: ["media-tree-item", {active: $options.isActive}],
    role: "treeitem",
    "aria-level": $props.level,
    "aria-setsize": $props.size,
    "aria-posinset": $props.counter,
    tabindex: $options.getTabindex
  }, [
    createVNode("a", {
      onClick: _cache[1] || (_cache[1] = withModifiers($event => ($options.onItemClick()), ["stop","prevent"]))
    }, [
      createVNode("span", _hoisted_1$e, [
        createVNode("span", { class: $options.iconClass }, null, 2 /* CLASS */)
      ]),
      createVNode("span", _hoisted_2$e, toDisplayString($props.item.name), 1 /* TEXT */)
    ]),
    createVNode(Transition, { name: "slide-fade" }, {
      default: withCtx(() => [
        ($options.hasChildren)
          ? withDirectives((openBlock(), createBlock(_component_media_tree, {
              key: 0,
              "aria-expanded": $options.isOpen ? 'true' : 'false',
              root: $props.item.path,
              level: ($props.level+1)
            }, null, 8 /* PROPS */, ["aria-expanded", "root", "level"])), [
              [vShow, $options.isOpen]
            ])
          : createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    })
  ], 10 /* CLASS, PROPS */, ["aria-level", "aria-setsize", "aria-posinset", "tabindex"]))
}

script$g.render = render$g;
script$g.__file = "administrator/components/com_media/resources/scripts/components/tree/item.vue";

var script$f = {
  name: 'MediaToolbar',
  computed: {
    toggleListViewBtnIcon() {
      return (this.isGridView) ? 'icon-list' : 'icon-th';
    },
    toggleSelectAllBtnIcon() {
      return (this.allItemsSelected) ? 'icon-check-square' : 'icon-square';
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    atLeastOneItemSelected() {
      return this.$store.state.selectedItems.length > 0;
    },
    isGridView() {
      return (this.$store.state.listView === 'grid');
    },
    allItemsSelected() {
      // eslint-disable-next-line max-len
      return (this.$store.getters.getSelectedDirectoryContents.length === this.$store.state.selectedItems.length);
    },
  },
  methods: {
    toggleInfoBar() {
      if (this.$store.state.showInfoBar) {
        this.$store.commit(HIDE_INFOBAR);
      } else {
        this.$store.commit(SHOW_INFOBAR);
      }
    },
    decreaseGridSize() {
      if (!this.isGridSize('sm')) {
        this.$store.commit(DECREASE_GRID_SIZE);
      }
    },
    increaseGridSize() {
      if (!this.isGridSize('xl')) {
        this.$store.commit(INCREASE_GRID_SIZE);
      }
    },
    changeListView() {
      if (this.$store.state.listView === 'grid') {
        this.$store.commit(CHANGE_LIST_VIEW, 'table');
      } else {
        this.$store.commit(CHANGE_LIST_VIEW, 'grid');
      }
    },
    toggleSelectAll() {
      if (this.allItemsSelected) {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
      } else {
        // eslint-disable-next-line max-len
        this.$store.commit(SELECT_BROWSER_ITEMS, this.$store.getters.getSelectedDirectoryContents);
      }
    },
    isGridSize(size) {
      return (this.$store.state.gridSize === size);
    },
    changeSearch(query) {
      this.$store.commit(SET_SEARCH_QUERY, query.target.value);
    },
  },
};

const _hoisted_1$d = {
  key: 0,
  class: "media-loader"
};
const _hoisted_2$d = { class: "media-view-icons" };
const _hoisted_3$d = {
  class: "media-view-search-input",
  role: "search"
};
const _hoisted_4$9 = {
  for: "media_search",
  class: "visually-hidden"
};
const _hoisted_5$5 = { class: "media-view-icons" };
const _hoisted_6$3 = /*#__PURE__*/createVNode("span", {
  class: "icon-search-minus",
  "aria-hidden": "true"
}, null, -1 /* HOISTED */);
const _hoisted_7$3 = /*#__PURE__*/createVNode("span", {
  class: "icon-search-plus",
  "aria-hidden": "true"
}, null, -1 /* HOISTED */);
const _hoisted_8$2 = /*#__PURE__*/createVNode("span", {
  class: "icon-info",
  "aria-hidden": "true"
}, null, -1 /* HOISTED */);

function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_breadcrumb = resolveComponent("media-breadcrumb");

  return (openBlock(), createBlock("div", {
    class: "media-toolbar",
    role: "toolbar",
    "aria-label": _ctx.translate('COM_MEDIA_TOOLBAR_LABEL')
  }, [
    ($options.isLoading)
      ? (openBlock(), createBlock("div", _hoisted_1$d))
      : createCommentVNode("v-if", true),
    createVNode("div", _hoisted_2$d, [
      createVNode("a", {
        href: "#",
        class: "media-toolbar-icon media-toolbar-select-all",
        "aria-label": _ctx.translate('COM_MEDIA_SELECT_ALL'),
        onClick: _cache[1] || (_cache[1] = withModifiers($event => ($options.toggleSelectAll()), ["stop","prevent"]))
      }, [
        createVNode("span", {
          class: $options.toggleSelectAllBtnIcon,
          "aria-hidden": "true"
        }, null, 2 /* CLASS */)
      ], 8 /* PROPS */, ["aria-label"])
    ]),
    createVNode(_component_media_breadcrumb),
    createVNode("div", _hoisted_3$d, [
      createVNode("label", _hoisted_4$9, toDisplayString(_ctx.translate('COM_MEDIA_SEARCH')), 1 /* TEXT */),
      createVNode("input", {
        id: "media_search",
        class: "form-control",
        type: "text",
        placeholder: _ctx.translate('COM_MEDIA_SEARCH'),
        onInput: _cache[2] || (_cache[2] = (...args) => ($options.changeSearch && $options.changeSearch(...args)))
      }, null, 40 /* PROPS, HYDRATE_EVENTS */, ["placeholder"])
    ]),
    createVNode("div", _hoisted_5$5, [
      ($options.isGridView)
        ? (openBlock(), createBlock("button", {
            key: 0,
            type: "button",
            class: ["media-toolbar-icon media-toolbar-decrease-grid-size", {disabled: $options.isGridSize('sm')}],
            "aria-label": _ctx.translate('COM_MEDIA_DECREASE_GRID'),
            onClick: _cache[3] || (_cache[3] = withModifiers($event => ($options.decreaseGridSize()), ["stop","prevent"]))
          }, [
            _hoisted_6$3
          ], 10 /* CLASS, PROPS */, ["aria-label"]))
        : createCommentVNode("v-if", true),
      ($options.isGridView)
        ? (openBlock(), createBlock("button", {
            key: 1,
            type: "button",
            class: ["media-toolbar-icon media-toolbar-increase-grid-size", {disabled: $options.isGridSize('xl')}],
            "aria-label": _ctx.translate('COM_MEDIA_INCREASE_GRID'),
            onClick: _cache[4] || (_cache[4] = withModifiers($event => ($options.increaseGridSize()), ["stop","prevent"]))
          }, [
            _hoisted_7$3
          ], 10 /* CLASS, PROPS */, ["aria-label"]))
        : createCommentVNode("v-if", true),
      createVNode("button", {
        type: "button",
        href: "#",
        class: "media-toolbar-icon media-toolbar-list-view",
        "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_LIST_VIEW'),
        onClick: _cache[5] || (_cache[5] = withModifiers($event => ($options.changeListView()), ["stop","prevent"]))
      }, [
        createVNode("span", {
          class: $options.toggleListViewBtnIcon,
          "aria-hidden": "true"
        }, null, 2 /* CLASS */)
      ], 8 /* PROPS */, ["aria-label"]),
      createVNode("button", {
        type: "button",
        href: "#",
        class: "media-toolbar-icon media-toolbar-info",
        "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_INFO'),
        onClick: _cache[6] || (_cache[6] = withModifiers((...args) => ($options.toggleInfoBar && $options.toggleInfoBar(...args)), ["stop","prevent"]))
      }, [
        _hoisted_8$2
      ], 8 /* PROPS */, ["aria-label"])
    ])
  ], 8 /* PROPS */, ["aria-label"]))
}

script$f.render = render$f;
script$f.__file = "administrator/components/com_media/resources/scripts/components/toolbar/toolbar.vue";

var script$e = {
  name: 'MediaBreadcrumb',
  mixins: [navigable],
  computed: {
    /* Get the crumbs from the current directory path */
    crumbs() {
      const items = [];

      const parts = this.$store.state.selectedDirectory.split('/');

      // Add the drive as first element
      if (parts) {
        const drive = this.findDrive(parts[0]);

        if (drive) {
          items.push(drive);
          parts.shift();
        }
      }

      parts
        .filter((crumb) => crumb.length !== 0)
        .forEach((crumb) => {
          items.push({
            name: crumb,
            path: this.$store.state.selectedDirectory.split(crumb)[0] + crumb,
          });
        });

      return items;
    },
    /* Whether or not the crumb is the last element in the list */
    isLast(item) {
      return this.crumbs.indexOf(item) === this.crumbs.length - 1;
    },
  },
  methods: {
    /* Handle the on crumb click event */
    onCrumbClick(crumb) {
      this.navigateTo(crumb.path);
    },
    findDrive(adapter) {
      let driveObject = null;

      this.$store.state.disks.forEach((disk) => {
        disk.drives.forEach((drive) => {
          if (drive.root.startsWith(adapter)) {
            driveObject = { name: drive.displayName, path: drive.root };
          }
        });
      });

      return driveObject;
    },
  },
};

function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("nav", {
    class: "media-breadcrumb",
    role: "navigation",
    "aria-label": _ctx.translate('COM_MEDIA_BREADCRUMB_LABEL')
  }, [
    createVNode("ol", null, [
      (openBlock(true), createBlock(Fragment, null, renderList($options.crumbs, (val, index) => {
        return (openBlock(), createBlock("li", {
          key: index,
          class: "media-breadcrumb-item"
        }, [
          createVNode("a", {
            href: "#",
            "aria-current": (index === Object.keys($options.crumbs).length - 1) ? 'page' : undefined,
            onClick: withModifiers($event => ($options.onCrumbClick(val)), ["stop","prevent"])
          }, toDisplayString(val.name), 9 /* TEXT, PROPS */, ["aria-current", "onClick"])
        ]))
      }), 128 /* KEYED_FRAGMENT */))
    ])
  ], 8 /* PROPS */, ["aria-label"]))
}

script$e.render = render$e;
script$e.__file = "administrator/components/com_media/resources/scripts/components/breadcrumb/breadcrumb.vue";

var script$d = {
  name: 'MediaBrowser',
  computed: {
    /* Get the contents of the currently selected directory */
    items() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      const directories = this.$store.getters.getSelectedDirectoryDirectories
        // Sort by type and alphabetically
        .sort((a, b) => ((a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1))
        .filter((dir) => dir.name.toLowerCase().includes(this.$store.state.search.toLowerCase()));

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      const files = this.$store.getters.getSelectedDirectoryFiles
        // Sort by type and alphabetically
        .sort((a, b) => ((a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1))
        .filter((file) => file.name.toLowerCase().includes(this.$store.state.search.toLowerCase()));

      return [...directories, ...files];
    },
    /* The styles for the media-browser element */
    mediaBrowserStyles() {
      return {
        width: this.$store.state.showInfoBar ? '75%' : '100%',
      };
    },
    /* The styles for the media-browser element */
    listView() {
      return this.$store.state.listView;
    },
    mediaBrowserGridItemsClass() {
      return {
        [`media-browser-items-${this.$store.state.gridSize}`]: true,
      };
    },
    isModal() {
      return Joomla.getOptions('com_media', {}).isModal;
    },
    currentDirectory() {
      const parts = this.$store.state.selectedDirectory.split('/').filter((crumb) => crumb.length !== 0);

      // The first part is the name of the drive, so if we have a folder name display it. Else
      // find the filename
      if (parts.length !== 1) {
        return parts[parts.length - 1];
      }

      let diskName = '';

      this.$store.state.disks.forEach((disk) => {
        disk.drives.forEach((drive) => {
          if (drive.root === `${parts[0]}/`) {
            diskName = drive.displayName;
          }
        });
      });

      return diskName;
    },
  },
  created() {
    document.body.addEventListener('click', this.unselectAllBrowserItems, false);
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.unselectAllBrowserItems, false);
  },
  methods: {
    /* Unselect all browser items */
    unselectAllBrowserItems(event) {
      const clickedDelete = !!((event.target.id !== undefined && event.target.id === 'mediaDelete'));
      const notClickedBrowserItems = (this.$refs.browserItems
        && !this.$refs.browserItems.contains(event.target))
        || event.target === this.$refs.browserItems;

      const notClickedInfobar = this.$refs.infobar !== undefined
        && !this.$refs.infobar.$el.contains(event.target);

      const clickedOutside = notClickedBrowserItems && notClickedInfobar && !clickedDelete;
      if (clickedOutside) {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);

        window.parent.document.dispatchEvent(
          new CustomEvent(
            'onMediaFileSelected',
            {
              bubbles: true,
              cancelable: false,
              detail: {
                path: '',
                thumb: false,
                fileType: false,
                extension: false,
              },
            },
          ),
        );
      }
    },

    // Listeners for drag and drop
    // Fix for Chrome
    onDragEnter(e) {
      e.stopPropagation();
      return false;
    },

    // Notify user when file is over the drop area
    onDragOver(e) {
      e.preventDefault();
      document.querySelector('.media-dragoutline').classList.add('active');
      return false;
    },

    /* Upload files */
    upload(file) {
      // Create a new file reader instance
      const reader = new FileReader();

      // Add the on load callback
      reader.onload = (progressEvent) => {
        const { result } = progressEvent.target;
        const splitIndex = result.indexOf('base64') + 7;
        const content = result.slice(splitIndex, result.length);

        // Upload the file
        this.$store.dispatch('uploadFile', {
          name: file.name,
          parent: this.$store.state.selectedDirectory,
          content,
        });
      };

      reader.readAsDataURL(file);
    },

    // Logic for the dropped file
    onDrop(e) {
      e.preventDefault();

      // Loop through array of files and upload each file
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // eslint-disable-next-line no-plusplus,no-cond-assign
        for (let i = 0, f; f = e.dataTransfer.files[i]; i++) {
          document.querySelector('.media-dragoutline').classList.remove('active');
          this.upload(f);
        }
      }
      document.querySelector('.media-dragoutline').classList.remove('active');
    },

    // Reset the drop area border
    onDragLeave(e) {
      e.stopPropagation();
      e.preventDefault();
      document.querySelector('.media-dragoutline').classList.remove('active');
      return false;
    },
  },
};

const _hoisted_1$c = { class: "media-dragoutline" };
const _hoisted_2$c = /*#__PURE__*/createVNode("span", {
  class: "icon-cloud-upload upload-icon",
  "aria-hidden": "true"
}, null, -1 /* HOISTED */);
const _hoisted_3$c = {
  key: 0,
  class: "table media-browser-table"
};
const _hoisted_4$8 = { class: "visually-hidden" };
const _hoisted_5$4 = { class: "media-browser-table-head" };
const _hoisted_6$2 = /*#__PURE__*/createVNode("th", {
  class: "type",
  scope: "col"
}, null, -1 /* HOISTED */);
const _hoisted_7$2 = {
  class: "name",
  scope: "col"
};
const _hoisted_8$1 = {
  class: "size",
  scope: "col"
};
const _hoisted_9$1 = {
  class: "dimension",
  scope: "col"
};
const _hoisted_10$1 = {
  class: "created",
  scope: "col"
};
const _hoisted_11$1 = {
  class: "modified",
  scope: "col"
};
const _hoisted_12$1 = {
  key: 1,
  class: "media-browser-grid"
};

function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_browser_item_row = resolveComponent("media-browser-item-row");
  const _component_media_browser_item = resolveComponent("media-browser-item");
  const _component_media_infobar = resolveComponent("media-infobar");

  return (openBlock(), createBlock("div", null, [
    createVNode("div", {
      ref: "browserItems",
      class: "media-browser",
      style: $options.mediaBrowserStyles,
      onDragenter: _cache[1] || (_cache[1] = (...args) => ($options.onDragEnter && $options.onDragEnter(...args))),
      onDrop: _cache[2] || (_cache[2] = (...args) => ($options.onDrop && $options.onDrop(...args))),
      onDragover: _cache[3] || (_cache[3] = (...args) => ($options.onDragOver && $options.onDragOver(...args))),
      onDragleave: _cache[4] || (_cache[4] = (...args) => ($options.onDragLeave && $options.onDragLeave(...args)))
    }, [
      createVNode("div", _hoisted_1$c, [
        _hoisted_2$c,
        createVNode("p", null, toDisplayString(_ctx.translate('COM_MEDIA_DROP_FILE')), 1 /* TEXT */)
      ]),
      ($options.listView === 'table')
        ? (openBlock(), createBlock("table", _hoisted_3$c, [
            createVNode("caption", _hoisted_4$8, toDisplayString(_ctx.sprintf('COM_MEDIA_BROWSER_TABLE_CAPTION', $options.currentDirectory)), 1 /* TEXT */),
            createVNode("thead", _hoisted_5$4, [
              createVNode("tr", null, [
                _hoisted_6$2,
                createVNode("th", _hoisted_7$2, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_NAME')), 1 /* TEXT */),
                createVNode("th", _hoisted_8$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_SIZE')), 1 /* TEXT */),
                createVNode("th", _hoisted_9$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DIMENSION')), 1 /* TEXT */),
                createVNode("th", _hoisted_10$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_CREATED')), 1 /* TEXT */),
                createVNode("th", _hoisted_11$1, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')), 1 /* TEXT */)
              ])
            ]),
            createVNode("tbody", null, [
              (openBlock(true), createBlock(Fragment, null, renderList($options.items, (item) => {
                return (openBlock(), createBlock(_component_media_browser_item_row, {
                  key: item.path,
                  item: item
                }, null, 8 /* PROPS */, ["item"]))
              }), 128 /* KEYED_FRAGMENT */))
            ])
          ]))
        : ($options.listView === 'grid')
          ? (openBlock(), createBlock("div", _hoisted_12$1, [
              createVNode("div", {
                class: ["media-browser-items", $options.mediaBrowserGridItemsClass]
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList($options.items, (item) => {
                  return (openBlock(), createBlock(_component_media_browser_item, {
                    key: item.path,
                    item: item
                  }, null, 8 /* PROPS */, ["item"]))
                }), 128 /* KEYED_FRAGMENT */))
              ], 2 /* CLASS */)
            ]))
          : createCommentVNode("v-if", true)
    ], 36 /* STYLE, HYDRATE_EVENTS */),
    createVNode(_component_media_infobar, { ref: "infobar" }, null, 512 /* NEED_PATCH */)
  ]))
}

script$d.render = render$d;
script$d.__file = "administrator/components/com_media/resources/scripts/components/browser/browser.vue";

var script$c = {
  name: 'MediaBrowserItemDirectory',
  mixins: [navigable],
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'focused'],
  data() {
    return {
      showActions: false,
    };
  },
  methods: {
    /* Handle the on preview double click event */
    onPreviewDblClick() {
      this.navigateTo(this.item.path);
    },
    /* Opening confirm delete modal */
    openConfirmDeleteModal() {
      this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
    },
    /* Rename an item */
    openRenameModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_RENAME_MODAL);
    },
    /* Open actions dropdown */
    openActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionRename.focus());
    },
    /* Open actions dropdown and focus on last element */
    openLastActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionDelete.focus());
    },
    /* Hide actions dropdown */
    hideActions() {
      this.showActions = false;
      // eslint-disable-next-line no-unused-expressions
      this.$nextTick(() => { this.$refs.actionToggle ? this.$refs.actionToggle.focus() : false; });
    },
  },
};

const _hoisted_1$b = /*#__PURE__*/createVNode("div", { class: "file-background" }, [
  /*#__PURE__*/createVNode("div", { class: "folder-icon" }, [
    /*#__PURE__*/createVNode("span", { class: "icon-folder" })
  ])
], -1 /* HOISTED */);
const _hoisted_2$b = { class: "media-browser-item-info" };
const _hoisted_3$b = {
  key: 0,
  class: "media-browser-actions-list"
};

function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "media-browser-item-directory",
    onMouseleave: _cache[25] || (_cache[25] = $event => ($options.hideActions()))
  }, [
    createVNode("div", {
      class: "media-browser-item-preview",
      onDblclick: _cache[1] || (_cache[1] = withModifiers($event => ($options.onPreviewDblClick()), ["stop","prevent"]))
    }, [
      _hoisted_1$b
    ], 32 /* HYDRATE_EVENTS */),
    createVNode("div", _hoisted_2$b, toDisplayString($props.item.name), 1 /* TEXT */),
    createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8 /* PROPS */, ["aria-label", "title"]),
    createVNode("div", {
      class: ["media-browser-actions", {'active': $data.showActions}]
    }, [
      createVNode("button", {
        ref: "actionToggle",
        class: "action-toggle",
        type: "button",
        "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        onKeyup: [
          _cache[3] || (_cache[3] = withKeys($event => ($options.openActions()), ["enter"])),
          _cache[6] || (_cache[6] = withKeys($event => ($options.openActions()), ["space"])),
          _cache[7] || (_cache[7] = withKeys($event => ($options.openActions()), ["down"])),
          _cache[8] || (_cache[8] = withKeys($event => ($options.openLastActions()), ["up"]))
        ],
        onFocus: _cache[4] || (_cache[4] = $event => ($props.focused(true))),
        onBlur: _cache[5] || (_cache[5] = $event => ($props.focused(false)))
      }, [
        createVNode("span", {
          class: "image-browser-action icon-ellipsis-h",
          "aria-hidden": "true",
          onClick: _cache[2] || (_cache[2] = withModifiers($event => ($options.openActions()), ["stop"]))
        })
      ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"]),
      ($data.showActions)
        ? (openBlock(), createBlock("div", _hoisted_3$b, [
            createVNode("ul", null, [
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionRename",
                  type: "button",
                  class: "action-rename",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  onKeyup: [
                    _cache[10] || (_cache[10] = withKeys($event => ($options.openRenameModal()), ["enter"])),
                    _cache[11] || (_cache[11] = withKeys($event => ($options.openRenameModal()), ["space"])),
                    _cache[14] || (_cache[14] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[15] || (_cache[15] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["up"])),
                    _cache[16] || (_cache[16] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["down"]))
                  ],
                  onFocus: _cache[12] || (_cache[12] = $event => ($props.focused(true))),
                  onBlur: _cache[13] || (_cache[13] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-text-width",
                    "aria-hidden": "true",
                    onClick: _cache[9] || (_cache[9] = withModifiers($event => ($options.openRenameModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDelete",
                  type: "button",
                  class: "action-delete",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  onKeyup: [
                    _cache[18] || (_cache[18] = withKeys($event => ($options.openConfirmDeleteModal()), ["enter"])),
                    _cache[19] || (_cache[19] = withKeys($event => ($options.openConfirmDeleteModal()), ["space"])),
                    _cache[22] || (_cache[22] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[23] || (_cache[23] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["up"])),
                    _cache[24] || (_cache[24] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["down"]))
                  ],
                  onFocus: _cache[20] || (_cache[20] = $event => ($props.focused(true))),
                  onBlur: _cache[21] || (_cache[21] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-trash",
                    "aria-hidden": "true",
                    onClick: _cache[17] || (_cache[17] = withModifiers($event => ($options.openConfirmDeleteModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ])
            ])
          ]))
        : createCommentVNode("v-if", true)
    ], 2 /* CLASS */)
  ], 32 /* HYDRATE_EVENTS */))
}

script$c.render = render$c;
script$c.__file = "administrator/components/com_media/resources/scripts/components/browser/items/directory.vue";

var script$b = {
  name: 'MediaBrowserItemFile',
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'focused'],
  data() {
    return {
      showActions: false,
    };
  },
  methods: {
    /* Preview an item */
    download() {
      this.$store.dispatch('download', this.item);
    },
    /* Opening confirm delete modal */
    openConfirmDeleteModal() {
      this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
    },
    /* Rename an item */
    openRenameModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_RENAME_MODAL);
    },
    /* Open modal for share url */
    openShareUrlModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_SHARE_MODAL);
    },
    /* Open actions dropdown */
    openActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionDownload.focus());
    },
    /* Open actions dropdown and focus on last element */
    openLastActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionDelete.focus());
    },
    /* Hide actions dropdown */
    hideActions() {
      this.showActions = false;
      this.$nextTick(() => this.$refs.actionToggle.focus());
    },
  },
};

const _hoisted_1$a = /*#__PURE__*/createVNode("div", { class: "media-browser-item-preview" }, [
  /*#__PURE__*/createVNode("div", { class: "file-background" }, [
    /*#__PURE__*/createVNode("div", { class: "file-icon" }, [
      /*#__PURE__*/createVNode("span", { class: "icon-file-alt" })
    ])
  ])
], -1 /* HOISTED */);
const _hoisted_2$a = { class: "media-browser-item-info" };
const _hoisted_3$a = {
  key: 0,
  class: "media-browser-actions-list"
};

function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "media-browser-item-file",
    onMouseleave: _cache[37] || (_cache[37] = $event => ($options.hideActions()))
  }, [
    _hoisted_1$a,
    createVNode("div", _hoisted_2$a, toDisplayString($props.item.name) + " " + toDisplayString($props.item.filetype), 1 /* TEXT */),
    createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8 /* PROPS */, ["aria-label", "title"]),
    createVNode("div", {
      class: ["media-browser-actions", {'active': $data.showActions}]
    }, [
      createVNode("button", {
        ref: "actionToggle",
        href: "#",
        class: "action-toggle",
        type: "button",
        "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        onKeyup: [
          _cache[2] || (_cache[2] = withKeys($event => ($options.openActions()), ["enter"])),
          _cache[5] || (_cache[5] = withKeys($event => ($options.openActions()), ["space"])),
          _cache[6] || (_cache[6] = withKeys($event => ($options.openActions()), ["down"])),
          _cache[7] || (_cache[7] = withKeys($event => ($options.openLastActions()), ["up"]))
        ],
        onFocus: _cache[3] || (_cache[3] = $event => ($props.focused(true))),
        onBlur: _cache[4] || (_cache[4] = $event => ($props.focused(false)))
      }, [
        createVNode("span", {
          class: "image-browser-action icon-ellipsis-h",
          "aria-hidden": "true",
          onClick: _cache[1] || (_cache[1] = withModifiers($event => ($options.openActions()), ["stop"]))
        })
      ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"]),
      ($data.showActions)
        ? (openBlock(), createBlock("div", _hoisted_3$a, [
            createVNode("ul", null, [
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDownload",
                  type: "button",
                  class: "action-download",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
                  onKeyup: [
                    _cache[9] || (_cache[9] = withKeys($event => ($options.download()), ["enter"])),
                    _cache[10] || (_cache[10] = withKeys($event => ($options.download()), ["space"])),
                    _cache[11] || (_cache[11] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["up"])),
                    _cache[12] || (_cache[12] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["down"]))
                  ]
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-download",
                    "aria-hidden": "true",
                    onClick: _cache[8] || (_cache[8] = withModifiers($event => ($options.download()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionRename",
                  type: "button",
                  class: "action-rename",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  onKeyup: [
                    _cache[14] || (_cache[14] = withKeys($event => ($options.openRenameModal()), ["space"])),
                    _cache[15] || (_cache[15] = withKeys($event => ($options.openRenameModal()), ["enter"])),
                    _cache[18] || (_cache[18] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[19] || (_cache[19] = withKeys($event => (_ctx.$refs.actionDownload.focus()), ["up"])),
                    _cache[20] || (_cache[20] = withKeys($event => (_ctx.$refs.actionUrl.focus()), ["down"]))
                  ],
                  onFocus: _cache[16] || (_cache[16] = $event => ($props.focused(true))),
                  onBlur: _cache[17] || (_cache[17] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-text-width",
                    "aria-hidden": "true",
                    onClick: _cache[13] || (_cache[13] = withModifiers($event => ($options.openRenameModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionUrl",
                  type: "button",
                  class: "action-url",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_SHARE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_SHARE'),
                  onKeyup: [
                    _cache[22] || (_cache[22] = withKeys($event => ($options.openShareUrlModal()), ["space"])),
                    _cache[23] || (_cache[23] = withKeys($event => ($options.openShareUrlModal()), ["enter"])),
                    _cache[26] || (_cache[26] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[27] || (_cache[27] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["up"])),
                    _cache[28] || (_cache[28] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["down"]))
                  ],
                  onFocus: _cache[24] || (_cache[24] = $event => ($props.focused(true))),
                  onBlur: _cache[25] || (_cache[25] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-link",
                    "aria-hidden": "true",
                    onClick: _cache[21] || (_cache[21] = withModifiers($event => ($options.openShareUrlModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDelete",
                  type: "button",
                  class: "action-delete",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  onKeyup: [
                    _cache[30] || (_cache[30] = withKeys($event => ($options.openConfirmDeleteModal()), ["space"])),
                    _cache[31] || (_cache[31] = withKeys($event => ($options.openConfirmDeleteModal()), ["enter"])),
                    _cache[34] || (_cache[34] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[35] || (_cache[35] = withKeys($event => (_ctx.$refs.actionUrl.focus()), ["up"])),
                    _cache[36] || (_cache[36] = withKeys($event => (_ctx.$refs.actionDownload.focus()), ["down"]))
                  ],
                  onFocus: _cache[32] || (_cache[32] = $event => ($props.focused(true))),
                  onBlur: _cache[33] || (_cache[33] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-trash",
                    "aria-hidden": "true",
                    onClick: _cache[29] || (_cache[29] = withModifiers($event => ($options.openConfirmDeleteModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ])
            ])
          ]))
        : createCommentVNode("v-if", true)
    ], 2 /* CLASS */)
  ], 32 /* HYDRATE_EVENTS */))
}

script$b.render = render$b;
script$b.__file = "administrator/components/com_media/resources/scripts/components/browser/items/file.vue";

var script$a = {
  name: 'MediaBrowserItemImage',
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'focused'],
  data() {
    return {
      showActions: false,
    };
  },
  computed: {
    /* Get the item url */
    thumbUrl() {
      return this.item.thumb_path;
    },
    /* Check if the item is an image to edit */
    canEdit() {
      return ['jpg', 'jpeg', 'png'].indexOf(this.item.extension.toLowerCase()) > -1;
    },
  },
  methods: {
    /* Preview an item */
    openPreview() {
      this.$store.commit(SHOW_PREVIEW_MODAL);
      this.$store.dispatch('getFullContents', this.item);
    },
    /* Preview an item */
    download() {
      this.$store.dispatch('download', this.item);
    },
    /* Opening confirm delete modal */
    openConfirmDeleteModal() {
      this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
    },
    /* Rename an item */
    openRenameModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_RENAME_MODAL);
    },
    /* Edit an item */
    editItem() {
      // TODO should we use relative urls here?
      const fileBaseUrl = `${Joomla.getOptions('com_media').editViewUrl}&path=`;

      window.location.href = fileBaseUrl + this.item.path;
    },
    /* Open modal for share url */
    openShareUrlModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_SHARE_MODAL);
    },
    /* Open actions dropdown */
    openActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionPreview.focus());
    },
    /* Open actions dropdown and focus on last element */
    openLastActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionDelete.focus());
    },
    /* Hide actions dropdown */
    hideActions() {
      this.showActions = false;
      this.$nextTick(() => this.$refs.actionToggle.focus());
    },
  },
};

const _hoisted_1$9 = { class: "media-browser-item-preview" };
const _hoisted_2$9 = { class: "image-background" };
const _hoisted_3$9 = { class: "media-browser-item-info" };
const _hoisted_4$7 = {
  key: 0,
  class: "media-browser-actions-list"
};
const _hoisted_5$3 = { key: 0 };

function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "media-browser-image",
    onDblclick: _cache[56] || (_cache[56] = $event => ($options.openPreview())),
    onMouseleave: _cache[57] || (_cache[57] = $event => ($options.hideActions()))
  }, [
    createVNode("div", _hoisted_1$9, [
      createVNode("div", _hoisted_2$9, [
        createVNode("div", {
          class: "image-cropped",
          style: { backgroundImage: 'url(' + $options.thumbUrl + ')' }
        }, null, 4 /* STYLE */)
      ])
    ]),
    createVNode("div", _hoisted_3$9, toDisplayString($props.item.name) + " " + toDisplayString($props.item.filetype), 1 /* TEXT */),
    createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8 /* PROPS */, ["aria-label", "title"]),
    createVNode("div", {
      class: ["media-browser-actions", {'active': $data.showActions}]
    }, [
      createVNode("button", {
        ref: "actionToggle",
        type: "button",
        class: "action-toggle",
        "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        onKeyup: [
          _cache[2] || (_cache[2] = withKeys($event => ($options.openActions()), ["enter"])),
          _cache[5] || (_cache[5] = withKeys($event => ($options.openActions()), ["space"])),
          _cache[6] || (_cache[6] = withKeys($event => ($options.openActions()), ["down"])),
          _cache[7] || (_cache[7] = withKeys($event => ($options.openLastActions()), ["up"]))
        ],
        onFocus: _cache[3] || (_cache[3] = $event => ($props.focused(true))),
        onBlur: _cache[4] || (_cache[4] = $event => ($props.focused(false)))
      }, [
        createVNode("span", {
          class: "image-browser-action icon-ellipsis-h",
          "aria-hidden": "true",
          onClick: _cache[1] || (_cache[1] = withModifiers($event => ($options.openActions()), ["stop"]))
        })
      ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"]),
      ($data.showActions)
        ? (openBlock(), createBlock("div", _hoisted_4$7, [
            createVNode("ul", null, [
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionPreview",
                  type: "button",
                  class: "action-preview",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
                  title: _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
                  onKeyup: [
                    _cache[9] || (_cache[9] = withKeys($event => ($options.openPreview()), ["enter"])),
                    _cache[10] || (_cache[10] = withKeys($event => ($options.openPreview()), ["space"])),
                    _cache[13] || (_cache[13] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[14] || (_cache[14] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["up"])),
                    _cache[15] || (_cache[15] = withKeys($event => (_ctx.$refs.actionDownload.focus()), ["down"]))
                  ],
                  onFocus: _cache[11] || (_cache[11] = $event => ($props.focused(true))),
                  onBlur: _cache[12] || (_cache[12] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-search-plus",
                    "aria-hidden": "true",
                    onClick: _cache[8] || (_cache[8] = withModifiers($event => ($options.openPreview()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDownload",
                  type: "button",
                  class: "action-download",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
                  onKeyup: [
                    _cache[17] || (_cache[17] = withKeys($event => ($options.download()), ["enter"])),
                    _cache[18] || (_cache[18] = withKeys($event => ($options.download()), ["space"])),
                    _cache[21] || (_cache[21] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[22] || (_cache[22] = withKeys($event => (_ctx.$refs.actionPreview.focus()), ["up"])),
                    _cache[23] || (_cache[23] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["down"]))
                  ],
                  onFocus: _cache[19] || (_cache[19] = $event => ($props.focused(true))),
                  onBlur: _cache[20] || (_cache[20] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-download",
                    "aria-hidden": "true",
                    onClick: _cache[16] || (_cache[16] = withModifiers($event => ($options.download()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionRename",
                  type: "button",
                  class: "action-rename",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  onKeyup: [
                    _cache[25] || (_cache[25] = withKeys($event => ($options.openRenameModal()), ["enter"])),
                    _cache[26] || (_cache[26] = withKeys($event => ($options.openRenameModal()), ["space"])),
                    _cache[29] || (_cache[29] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[30] || (_cache[30] = withKeys($event => (_ctx.$refs.actionDownload.focus()), ["up"])),
                    _cache[31] || (_cache[31] = withKeys($event => ($options.canEdit ? _ctx.$refs.actionEdit.focus() : _ctx.$refs.actionShare.focus()), ["down"]))
                  ],
                  onFocus: _cache[27] || (_cache[27] = $event => ($props.focused(true))),
                  onBlur: _cache[28] || (_cache[28] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-text-width",
                    "aria-hidden": "true",
                    onClick: _cache[24] || (_cache[24] = withModifiers($event => ($options.openRenameModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              ($options.canEdit)
                ? (openBlock(), createBlock("li", _hoisted_5$3, [
                    createVNode("button", {
                      ref: "actionEdit",
                      type: "button",
                      class: "action-edit",
                      "aria-label": _ctx.translate('COM_MEDIA_ACTION_EDIT'),
                      title: _ctx.translate('COM_MEDIA_ACTION_EDIT'),
                      onKeyup: [
                        _cache[33] || (_cache[33] = withKeys($event => ($options.editItem()), ["enter"])),
                        _cache[34] || (_cache[34] = withKeys($event => ($options.editItem()), ["space"])),
                        _cache[37] || (_cache[37] = withKeys($event => ($options.hideActions()), ["esc"])),
                        _cache[38] || (_cache[38] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["up"])),
                        _cache[39] || (_cache[39] = withKeys($event => (_ctx.$refs.actionShare.focus()), ["down"]))
                      ],
                      onFocus: _cache[35] || (_cache[35] = $event => ($props.focused(true))),
                      onBlur: _cache[36] || (_cache[36] = $event => ($props.focused(false)))
                    }, [
                      createVNode("span", {
                        class: "image-browser-action icon-pencil-alt",
                        "aria-hidden": "true",
                        onClick: _cache[32] || (_cache[32] = withModifiers($event => ($options.editItem()), ["stop"]))
                      })
                    ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
                  ]))
                : createCommentVNode("v-if", true),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionShare",
                  type: "button",
                  class: "action-url",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_SHARE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_SHARE'),
                  onKeyup: [
                    _cache[41] || (_cache[41] = withKeys($event => ($options.openShareUrlModal()), ["enter"])),
                    _cache[42] || (_cache[42] = withKeys($event => ($options.openShareUrlModal()), ["space"])),
                    _cache[45] || (_cache[45] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[46] || (_cache[46] = withKeys($event => ($options.canEdit ? _ctx.$refs.actionEdit.focus() : _ctx.$refs.actionRename.focus()), ["up"])),
                    _cache[47] || (_cache[47] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["down"]))
                  ],
                  onFocus: _cache[43] || (_cache[43] = $event => ($props.focused(true))),
                  onBlur: _cache[44] || (_cache[44] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-link",
                    "aria-hidden": "true",
                    onClick: _cache[40] || (_cache[40] = withModifiers($event => ($options.openShareUrlModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDelete",
                  type: "button",
                  class: "action-delete",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  onKeyup: [
                    _cache[49] || (_cache[49] = withKeys($event => ($options.openConfirmDeleteModal()), ["enter"])),
                    _cache[50] || (_cache[50] = withKeys($event => ($options.openConfirmDeleteModal()), ["space"])),
                    _cache[53] || (_cache[53] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[54] || (_cache[54] = withKeys($event => (_ctx.$refs.actionShare.focus()), ["up"])),
                    _cache[55] || (_cache[55] = withKeys($event => (_ctx.$refs.actionPreview.focus()), ["down"]))
                  ],
                  onFocus: _cache[51] || (_cache[51] = $event => ($props.focused(true))),
                  onBlur: _cache[52] || (_cache[52] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-trash",
                    "aria-hidden": "true",
                    onClick: _cache[48] || (_cache[48] = withModifiers($event => ($options.openConfirmDeleteModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ])
            ])
          ]))
        : createCommentVNode("v-if", true)
    ], 2 /* CLASS */)
  ], 32 /* HYDRATE_EVENTS */))
}

script$a.render = render$a;
script$a.__file = "administrator/components/com_media/resources/scripts/components/browser/items/image.vue";

var script$9 = {
  name: 'MediaBrowserItemVideo',
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'focused'],
  data() {
    return {
      showActions: false,
    };
  },
  methods: {
    /* Preview an item */
    openPreview() {
      this.$store.commit(SHOW_PREVIEW_MODAL);
      this.$store.dispatch('getFullContents', this.item);
    },
    /* Preview an item */
    download() {
      this.$store.dispatch('download', this.item);
    },
    /* Opening confirm delete modal */
    openConfirmDeleteModal() {
      this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_CONFIRM_DELETE_MODAL);
    },
    /* Rename an item */
    openRenameModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_RENAME_MODAL);
    },
    /* Open modal for share url */
    openShareUrlModal() {
      this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      this.$store.commit(SHOW_SHARE_MODAL);
    },
    /* Open actions dropdown */
    openActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionPreview.focus());
    },
    /* Open actions dropdown and focus on last element */
    openLastActions() {
      this.showActions = true;
      this.$nextTick(() => this.$refs.actionDelete.focus());
    },
    /* Hide actions dropdown */
    hideActions() {
      this.showActions = false;
      this.$nextTick(() => this.$refs.actionToggle.focus());
    },
  },
};

const _hoisted_1$8 = /*#__PURE__*/createVNode("div", { class: "media-browser-item-preview" }, [
  /*#__PURE__*/createVNode("div", { class: "file-background" }, [
    /*#__PURE__*/createVNode("div", { class: "file-icon" }, [
      /*#__PURE__*/createVNode("span", { class: "icon-file-alt" })
    ])
  ])
], -1 /* HOISTED */);
const _hoisted_2$8 = { class: "media-browser-item-info" };
const _hoisted_3$8 = {
  key: 0,
  class: "media-browser-actions-list"
};

function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "media-browser-image",
    onDblclick: _cache[48] || (_cache[48] = $event => ($options.openPreview())),
    onMouseleave: _cache[49] || (_cache[49] = $event => ($options.hideActions()))
  }, [
    _hoisted_1$8,
    createVNode("div", _hoisted_2$8, toDisplayString($props.item.name) + " " + toDisplayString($props.item.filetype), 1 /* TEXT */),
    createVNode("span", {
      class: "media-browser-select",
      "aria-label": _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),
      title: _ctx.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')
    }, null, 8 /* PROPS */, ["aria-label", "title"]),
    createVNode("div", {
      class: ["media-browser-actions", {'active': $data.showActions}]
    }, [
      createVNode("button", {
        ref: "actionToggle",
        type: "button",
        class: "action-toggle",
        "aria-label": _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        title: _ctx.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),
        onKeyup: [
          _cache[2] || (_cache[2] = withKeys($event => ($options.openActions()), ["enter"])),
          _cache[5] || (_cache[5] = withKeys($event => ($options.openActions()), ["space"])),
          _cache[6] || (_cache[6] = withKeys($event => ($options.openActions()), ["down"])),
          _cache[7] || (_cache[7] = withKeys($event => ($options.openLastActions()), ["up"]))
        ],
        onFocus: _cache[3] || (_cache[3] = $event => ($props.focused(true))),
        onBlur: _cache[4] || (_cache[4] = $event => ($props.focused(false)))
      }, [
        createVNode("span", {
          class: "image-browser-action icon-ellipsis-h",
          "aria-hidden": "true",
          onClick: _cache[1] || (_cache[1] = withModifiers($event => ($options.openActions()), ["stop"]))
        })
      ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"]),
      ($data.showActions)
        ? (openBlock(), createBlock("div", _hoisted_3$8, [
            createVNode("ul", null, [
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionPreview",
                  type: "button",
                  class: "action-preview",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
                  title: _ctx.translate('COM_MEDIA_ACTION_PREVIEW'),
                  onKeyup: [
                    _cache[9] || (_cache[9] = withKeys($event => ($options.openPreview()), ["enter"])),
                    _cache[10] || (_cache[10] = withKeys($event => ($options.openPreview()), ["space"])),
                    _cache[13] || (_cache[13] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[14] || (_cache[14] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["up"])),
                    _cache[15] || (_cache[15] = withKeys($event => (_ctx.$refs.actionDownload.focus()), ["down"]))
                  ],
                  onFocus: _cache[11] || (_cache[11] = $event => ($props.focused(true))),
                  onBlur: _cache[12] || (_cache[12] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-search-plus",
                    "aria-hidden": "true",
                    onClick: _cache[8] || (_cache[8] = withModifiers($event => ($options.openPreview()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDownload",
                  type: "button",
                  class: "action-download",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DOWNLOAD'),
                  onKeyup: [
                    _cache[17] || (_cache[17] = withKeys($event => ($options.download()), ["enter"])),
                    _cache[18] || (_cache[18] = withKeys($event => ($options.download()), ["space"])),
                    _cache[21] || (_cache[21] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[22] || (_cache[22] = withKeys($event => (_ctx.$refs.actionPreview.focus()), ["up"])),
                    _cache[23] || (_cache[23] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["down"]))
                  ],
                  onFocus: _cache[19] || (_cache[19] = $event => ($props.focused(true))),
                  onBlur: _cache[20] || (_cache[20] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-download",
                    "aria-hidden": "true",
                    onClick: _cache[16] || (_cache[16] = withModifiers($event => ($options.download()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionRename",
                  type: "button",
                  class: "action-rename",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  title: _ctx.translate('COM_MEDIA_ACTION_RENAME'),
                  onKeyup: [
                    _cache[25] || (_cache[25] = withKeys($event => ($options.openRenameModal()), ["enter"])),
                    _cache[26] || (_cache[26] = withKeys($event => ($options.openRenameModal()), ["space"])),
                    _cache[29] || (_cache[29] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[30] || (_cache[30] = withKeys($event => (_ctx.$refs.actionDownload.focus()), ["up"])),
                    _cache[31] || (_cache[31] = withKeys($event => (_ctx.$refs.actionShare.focus()), ["down"]))
                  ],
                  onFocus: _cache[27] || (_cache[27] = $event => ($props.focused(true))),
                  onBlur: _cache[28] || (_cache[28] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-text-width",
                    "aria-hidden": "true",
                    onClick: _cache[24] || (_cache[24] = withModifiers($event => ($options.openRenameModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionShare",
                  type: "button",
                  class: "action-url",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_SHARE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_SHARE'),
                  onKeyup: [
                    _cache[33] || (_cache[33] = withKeys($event => ($options.openShareUrlModal()), ["enter"])),
                    _cache[34] || (_cache[34] = withKeys($event => ($options.openShareUrlModal()), ["space"])),
                    _cache[37] || (_cache[37] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[38] || (_cache[38] = withKeys($event => (_ctx.$refs.actionRename.focus()), ["up"])),
                    _cache[39] || (_cache[39] = withKeys($event => (_ctx.$refs.actionDelete.focus()), ["down"]))
                  ],
                  onFocus: _cache[35] || (_cache[35] = $event => ($props.focused(true))),
                  onBlur: _cache[36] || (_cache[36] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-link",
                    "aria-hidden": "true",
                    onClick: _cache[32] || (_cache[32] = withModifiers($event => ($options.openShareUrlModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ]),
              createVNode("li", null, [
                createVNode("button", {
                  ref: "actionDelete",
                  type: "button",
                  class: "action-delete",
                  "aria-label": _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  title: _ctx.translate('COM_MEDIA_ACTION_DELETE'),
                  onKeyup: [
                    _cache[41] || (_cache[41] = withKeys($event => ($options.openConfirmDeleteModal()), ["enter"])),
                    _cache[42] || (_cache[42] = withKeys($event => ($options.openConfirmDeleteModal()), ["space"])),
                    _cache[45] || (_cache[45] = withKeys($event => ($options.hideActions()), ["esc"])),
                    _cache[46] || (_cache[46] = withKeys($event => (_ctx.$refs.actionShare.focus()), ["up"])),
                    _cache[47] || (_cache[47] = withKeys($event => (_ctx.$refs.actionPreview.focus()), ["down"]))
                  ],
                  onFocus: _cache[43] || (_cache[43] = $event => ($props.focused(true))),
                  onBlur: _cache[44] || (_cache[44] = $event => ($props.focused(false)))
                }, [
                  createVNode("span", {
                    class: "image-browser-action icon-trash",
                    "aria-hidden": "true",
                    onClick: _cache[40] || (_cache[40] = withModifiers($event => ($options.openConfirmDeleteModal()), ["stop"]))
                  })
                ], 40 /* PROPS, HYDRATE_EVENTS */, ["aria-label", "title"])
              ])
            ])
          ]))
        : createCommentVNode("v-if", true)
    ], 2 /* CLASS */)
  ], 32 /* HYDRATE_EVENTS */))
}

script$9.render = render$9;
script$9.__file = "administrator/components/com_media/resources/scripts/components/browser/items/video.vue";

const dirname = path => {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }

  if (path.length === 0) return '.';
  let code = path.charCodeAt(0);
  const hasRoot = code === 47;
  let end = -1;
  let matchedSlash = true;

  for (let i = path.length - 1; i >= 1; --i) {
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

class Api {
  /**
     * Store constructor
     */
  constructor() {
    const options = Joomla.getOptions('com_media', {});

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


  getContents(dir, full, content) {
    // Wrap the ajax call into a real promise
    return new Promise((resolve, reject) => {
      // Do a check on full
      if (['0', '1'].indexOf(full) !== -1) {
        throw Error('Invalid parameter: full');
      } // Do a check on download


      if (['0', '1'].indexOf(content) !== -1) {
        throw Error('Invalid parameter: content');
      } // eslint-disable-next-line no-underscore-dangle


      let url = `${this._baseUrl}&task=api.files&path=${dir}`;

      if (full) {
        url += `&url=${full}`;
      }

      if (content) {
        url += `&content=${content}`;
      }

      Joomla.request({
        url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: response => {
          // eslint-disable-next-line no-underscore-dangle
          resolve(this._normalizeArray(JSON.parse(response).data));
        },
        onError: xhr => {
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


  createDirectory(name, parent) {
    // Wrap the ajax call into a real promise
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-underscore-dangle
      const url = `${this._baseUrl}&task=api.files&path=${parent}`; // eslint-disable-next-line no-underscore-dangle

      const data = {
        [this._csrfToken]: '1',
        name
      };
      Joomla.request({
        url,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: response => {
          notifications.success('COM_MEDIA_CREATE_NEW_FOLDER_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

          resolve(this._normalizeItem(JSON.parse(response).data));
        },
        onError: xhr => {
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


  upload(name, parent, content, override) {
    // Wrap the ajax call into a real promise
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-underscore-dangle
      const url = `${this._baseUrl}&task=api.files&path=${parent}`;
      const data = {
        // eslint-disable-next-line no-underscore-dangle
        [this._csrfToken]: '1',
        name,
        content
      }; // Append override

      if (override === true) {
        data.override = true;
      }

      Joomla.request({
        url,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: response => {
          notifications.success('COM_MEDIA_UPLOAD_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

          resolve(this._normalizeItem(JSON.parse(response).data));
        },
        onError: xhr => {
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


  rename(path, newPath) {
    // Wrap the ajax call into a real promise
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-underscore-dangle
      const url = `${this._baseUrl}&task=api.files&path=${path}`;
      const data = {
        // eslint-disable-next-line no-underscore-dangle
        [this._csrfToken]: '1',
        newPath
      };
      Joomla.request({
        url,
        method: 'PUT',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: response => {
          notifications.success('COM_MEDIA_RENAME_SUCCESS'); // eslint-disable-next-line no-underscore-dangle

          resolve(this._normalizeItem(JSON.parse(response).data));
        },
        onError: xhr => {
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


  delete(path) {
    // Wrap the ajax call into a real promise
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-underscore-dangle
      const url = `${this._baseUrl}&task=api.files&path=${path}`; // eslint-disable-next-line no-underscore-dangle

      const data = {
        [this._csrfToken]: '1'
      };
      Joomla.request({
        url,
        method: 'DELETE',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        onSuccess: () => {
          notifications.success('COM_MEDIA_DELETE_SUCCESS');
          resolve();
        },
        onError: xhr => {
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


  _normalizeItem(item) {
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


  _normalizeArray(data) {
    const directories = data.filter(item => item.type === 'dir') // eslint-disable-next-line no-underscore-dangle
    .map(directory => this._normalizeItem(directory));
    const files = data.filter(item => item.type === 'file') // eslint-disable-next-line no-underscore-dangle
    .map(file => this._normalizeItem(file));
    return {
      directories,
      files
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


  _handleError(error) {
    const response = JSON.parse(error.response);

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
  }

} // eslint-disable-next-line import/prefer-default-export


const api = new Api();

var BrowserItem = {
  props: ['item'],

  data() {
    return {
      hoverActive: false
    };
  },

  methods: {
    /**
         * Return the correct item type component
         */
    itemType() {
      const imageExtensions = api.imagesExtensions;
      const videoExtensions = ['mp4']; // Render directory items

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
    styles() {
      return {
        width: `calc(${this.$store.state.gridSize}% - 20px)`
      };
    },

    /**
         * Whether or not the item is currently selected
         * @returns {boolean}
         */
    isSelected() {
      return this.$store.state.selectedItems.some(selected => selected.path === this.item.path);
    },

    /**
         * Whether or not the item is currently active (on hover or via tab)
         * @returns {boolean}
         */
    isHoverActive() {
      return this.hoverActive;
    },

    /**
         * Turns on the hover class
         */
    mouseover() {
      this.hoverActive = true;
    },

    /**
         * Turns off the hover class
         */
    mouseleave() {
      this.hoverActive = false;
    },

    /**
         * Handle the click event
         * @param event
         */
    handleClick(event) {
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
    focused(value) {
      // eslint-disable-next-line no-unused-expressions
      value ? this.mouseover() : this.mouseleave();
    }

  },

  render() {
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
    dimension() {
      if (!this.item.width) {
        return '';
      }
      return `${this.item.width}px * ${this.item.height}px`;
    },
    isDir() {
      return (this.item.type === 'dir');
    },
    /* The size of a file in KB */
    size() {
      if (!this.item.size) {
        return '';
      }
      return `${(this.item.size / 1024).toFixed(2)} KB`;
    },
    selected() {
      return !!this.isSelected();
    },
  },

  methods: {
    /* Handle the on row double click event */
    onDblClick() {
      if (this.isDir) {
        this.navigateTo(this.item.path);
        return;
      }

      const extensionWithPreview = ['jpg', 'jpeg', 'png', 'gif', 'mp4'];

      // Show preview
      if (this.item.extension
        && extensionWithPreview.includes(this.item.extension.toLowerCase())) {
        this.$store.commit(SHOW_PREVIEW_MODAL);
        this.$store.dispatch('getFullContents', this.item);
      }
    },

    /**
             * Whether or not the item is currently selected
             * @returns {boolean}
             */
    isSelected() {
      return this.$store.state.selectedItems.some((selected) => selected.path === this.item.path);
    },

    /**
             * Handle the click event
             * @param event
             */
    onClick(event) {
      const path = false;
      const data = {
        path,
        thumb: false,
        fileType: this.item.mime_type ? this.item.mime_type : false,
        extension: this.item.extension ? this.item.extension : false,
      };

      if (this.item.type === 'file') {
        data.path = this.item.path;
        data.thumb = this.item.thumb ? this.item.thumb : false;
        data.width = this.item.width ? this.item.width : 0;
        data.height = this.item.height ? this.item.height : 0;

        const ev = new CustomEvent('onMediaFileSelected', {
          bubbles: true,
          cancelable: false,
          detail: data,
        });
        window.parent.document.dispatchEvent(ev);
      }

      // Handle clicks when the item was not selected
      if (!this.isSelected()) {
        // Unselect all other selected items,
        // if the shift key was not pressed during the click event
        if (!(event.shiftKey || event.keyCode === 13)) {
          this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        }
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
        return;
      }

      // If more than one item was selected and the user clicks again on the selected item,
      // he most probably wants to unselect all other items.
      if (this.$store.state.selectedItems.length > 1) {
        this.$store.commit(UNSELECT_ALL_BROWSER_ITEMS);
        this.$store.commit(SELECT_BROWSER_ITEM, this.item);
      }
    },

  },
};

const _hoisted_1$7 = {
  scope: "row",
  class: "name"
};
const _hoisted_2$7 = { class: "size" };
const _hoisted_3$7 = { class: "dimension" };
const _hoisted_4$6 = { class: "created" };
const _hoisted_5$2 = { class: "modified" };

function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("tr", {
    class: ["media-browser-item", {selected: $options.selected}],
    onDblclick: _cache[1] || (_cache[1] = withModifiers($event => ($options.onDblClick()), ["stop","prevent"])),
    onClick: _cache[2] || (_cache[2] = (...args) => ($options.onClick && $options.onClick(...args)))
  }, [
    createVNode("td", {
      class: "type",
      "data-type": $props.item.extension
    }, null, 8 /* PROPS */, ["data-type"]),
    createVNode("th", _hoisted_1$7, toDisplayString($props.item.name), 1 /* TEXT */),
    createVNode("td", _hoisted_2$7, toDisplayString($options.size), 1 /* TEXT */),
    createVNode("td", _hoisted_3$7, toDisplayString($options.dimension), 1 /* TEXT */),
    createVNode("td", _hoisted_4$6, toDisplayString($props.item.create_date_formatted), 1 /* TEXT */),
    createVNode("td", _hoisted_5$2, toDisplayString($props.item.modified_date_formatted), 1 /* TEXT */)
  ], 34 /* CLASS, HYDRATE_EVENTS */))
}

script$8.render = render$8;
script$8.__file = "administrator/components/com_media/resources/scripts/components/browser/items/row.vue";

var script$7 = {
  name: 'MediaModal',
  props: {
    /* Whether or not the close button in the header should be shown */
    showClose: {
      type: Boolean,
      default: true,
    },
    /* The size of the modal */
    // eslint-disable-next-line vue/require-default-prop
    size: {
      type: String,
    },
    labelElement: {
      type: String,
      required: true,
    },
  },
  emits: ['close'],
  computed: {
    /* Get the modal css class */
    modalClass() {
      return {
        'modal-sm': this.size === 'sm',
      };
    },
  },
  mounted() {
    // Listen to keydown events on the document
    document.addEventListener('keydown', this.onKeyDown);
  },
  beforeUnmount() {
    // Remove the keydown event listener
    document.removeEventListener('keydown', this.onKeyDown);
  },
  methods: {
    /* Close the modal instance */
    close() {
      this.$emit('close');
    },
    /* Handle keydown events */
    onKeyDown(event) {
      if (event.keyCode === 27) {
        this.close();
      }
    },
  },
};

const _hoisted_1$6 = { class: "modal-content" };
const _hoisted_2$6 = { class: "modal-header" };
const _hoisted_3$6 = { class: "modal-body" };
const _hoisted_4$5 = { class: "modal-footer" };

function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_tab_lock = resolveComponent("tab-lock");

  return (openBlock(), createBlock("div", {
    class: "media-modal-backdrop",
    onClick: _cache[3] || (_cache[3] = $event => ($options.close()))
  }, [
    createVNode("div", {
      class: "modal",
      style: {"display":"flex"},
      onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
    }, [
      createVNode(_component_tab_lock, null, {
        default: withCtx(() => [
          createVNode("div", {
            class: ["modal-dialog", $options.modalClass],
            role: "dialog",
            "aria-labelledby": $props.labelElement
          }, [
            createVNode("div", _hoisted_1$6, [
              createVNode("div", _hoisted_2$6, [
                renderSlot(_ctx.$slots, "header"),
                renderSlot(_ctx.$slots, "backdrop-close"),
                ($props.showClose)
                  ? (openBlock(), createBlock("button", {
                      key: 0,
                      type: "button",
                      class: "btn-close",
                      "aria-label": "Close",
                      onClick: _cache[1] || (_cache[1] = $event => ($options.close()))
                    }))
                  : createCommentVNode("v-if", true)
              ]),
              createVNode("div", _hoisted_3$6, [
                renderSlot(_ctx.$slots, "body")
              ]),
              createVNode("div", _hoisted_4$5, [
                renderSlot(_ctx.$slots, "footer")
              ])
            ])
          ], 10 /* CLASS, PROPS */, ["aria-labelledby"])
        ]),
        _: 3 /* FORWARDED */
      })
    ])
  ]))
}

script$7.render = render$7;
script$7.__file = "administrator/components/com_media/resources/scripts/components/modals/modal.vue";

var script$6 = {
  name: 'MediaCreateFolderModal',
  data() {
    return {
      folder: '',
    };
  },
  methods: {
    /* Check if the the form is valid */
    isValid() {
      return (this.folder);
    },
    /* Close the modal instance */
    close() {
      this.reset();
      this.$store.commit(HIDE_CREATE_FOLDER_MODAL);
    },
    /* Save the form and create the folder */
    save() {
      // Check if the form is valid
      if (!this.isValid()) {
        // TODO show an error message to user for insert a folder name
        // TODO mark the field as invalid
        return;
      }

      // Create the directory
      this.$store.dispatch('createDirectory', {
        name: this.folder,
        parent: this.$store.state.selectedDirectory,
      });
      this.reset();
    },
    /* Reset the form */
    reset() {
      this.folder = '';
    },
  },
};

const _hoisted_1$5 = {
  id: "createFolderTitle",
  class: "modal-title"
};
const _hoisted_2$5 = { class: "p-3" };
const _hoisted_3$5 = { class: "form-group" };
const _hoisted_4$4 = { for: "folder" };

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_modal = resolveComponent("media-modal");

  return (_ctx.$store.state.showCreateFolderModal)
    ? (openBlock(), createBlock(_component_media_modal, {
        key: 0,
        size: 'md',
        "label-element": "createFolderTitle",
        onClose: _cache[6] || (_cache[6] = $event => ($options.close()))
      }, {
        header: withCtx(() => [
          createVNode("h3", _hoisted_1$5, toDisplayString(_ctx.translate('COM_MEDIA_CREATE_NEW_FOLDER')), 1 /* TEXT */)
        ]),
        body: withCtx(() => [
          createVNode("div", _hoisted_2$5, [
            createVNode("form", {
              class: "form",
              novalidate: "",
              onSubmit: _cache[3] || (_cache[3] = withModifiers((...args) => ($options.save && $options.save(...args)), ["prevent"]))
            }, [
              createVNode("div", _hoisted_3$5, [
                createVNode("label", _hoisted_4$4, toDisplayString(_ctx.translate('COM_MEDIA_FOLDER_NAME')), 1 /* TEXT */),
                withDirectives(createVNode("input", {
                  id: "folder",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ($data.folder = $event)),
                  class: "form-control",
                  type: "text",
                  required: "",
                  autocomplete: "off",
                  onInput: _cache[2] || (_cache[2] = $event => ($data.folder = $event.target.value))
                }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */), [
                  [
                    vModelText,
                    $data.folder,
                    void 0,
                    { trim: true }
                  ]
                ])
              ])
            ], 32 /* HYDRATE_EVENTS */)
          ])
        ]),
        footer: withCtx(() => [
          createVNode("div", null, [
            createVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[4] || (_cache[4] = $event => ($options.close()))
            }, toDisplayString(_ctx.translate('JCANCEL')), 1 /* TEXT */),
            createVNode("button", {
              class: "btn btn-success",
              disabled: !$options.isValid(),
              onClick: _cache[5] || (_cache[5] = $event => ($options.save()))
            }, toDisplayString(_ctx.translate('JACTION_CREATE')), 9 /* TEXT, PROPS */, ["disabled"])
          ])
        ]),
        _: 1 /* STABLE */
      }))
    : createCommentVNode("v-if", true)
}

script$6.render = render$6;
script$6.__file = "administrator/components/com_media/resources/scripts/components/modals/create-folder-modal.vue";

var script$5 = {
  name: 'MediaPreviewModal',
  computed: {
    /* Get the item to show in the modal */
    item() {
      // Use the currently selected directory as a fallback
      return this.$store.state.previewItem;
    },
  },
  methods: {
    /* Close the modal */
    close() {
      this.$store.commit(HIDE_PREVIEW_MODAL);
    },
    isImage() {
      return this.item.mime_type.indexOf('image/') === 0;
    },
    isVideo() {
      return this.item.mime_type.indexOf('video/') === 0;
    },
  },
};

const _hoisted_1$4 = {
  id: "previewTitle",
  class: "modal-title text-light"
};
const _hoisted_2$4 = { class: "image-background" };
const _hoisted_3$4 = {
  key: 1,
  controls: ""
};
const _hoisted_4$3 = /*#__PURE__*/createVNode("span", { class: "icon-times" }, null, -1 /* HOISTED */);

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_modal = resolveComponent("media-modal");

  return (_ctx.$store.state.showPreviewModal && $options.item)
    ? (openBlock(), createBlock(_component_media_modal, {
        key: 0,
        size: 'md',
        class: "media-preview-modal",
        "label-element": "previewTitle",
        "show-close": false,
        onClose: _cache[2] || (_cache[2] = $event => ($options.close()))
      }, {
        header: withCtx(() => [
          createVNode("h3", _hoisted_1$4, toDisplayString($options.item.name), 1 /* TEXT */)
        ]),
        body: withCtx(() => [
          createVNode("div", _hoisted_2$4, [
            ($options.isImage())
              ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: $options.item.url,
                  type: $options.item.mime_type
                }, null, 8 /* PROPS */, ["src", "type"]))
              : createCommentVNode("v-if", true),
            ($options.isVideo())
              ? (openBlock(), createBlock("video", _hoisted_3$4, [
                  createVNode("source", {
                    src: $options.item.url,
                    type: $options.item.mime_type
                  }, null, 8 /* PROPS */, ["src", "type"])
                ]))
              : createCommentVNode("v-if", true)
          ])
        ]),
        "backdrop-close": withCtx(() => [
          createVNode("button", {
            type: "button",
            class: "media-preview-close",
            onClick: _cache[1] || (_cache[1] = $event => ($options.close()))
          }, [
            _hoisted_4$3
          ])
        ]),
        _: 1 /* STABLE */
      }))
    : createCommentVNode("v-if", true)
}

script$5.render = render$5;
script$5.__file = "administrator/components/com_media/resources/scripts/components/modals/preview-modal.vue";

var script$4 = {
  name: 'MediaRenameModal',
  computed: {
    item() {
      return this.$store.state.selectedItems[this.$store.state.selectedItems.length - 1];
    },
    name() {
      return this.item.name.replace(`.${this.item.extension}`, '');
    },
    extension() {
      return this.item.extension;
    },
  },
  methods: {
    /* Check if the form is valid */
    isValid() {
      return this.item.name.length > 0;
    },
    /* Close the modal instance */
    close() {
      this.$store.commit(HIDE_RENAME_MODAL);
    },
    /* Save the form and create the folder */
    save() {
      // Check if the form is valid
      if (!this.isValid()) {
        // TODO mark the field as invalid
        return;
      }
      let newName = this.$refs.nameField.value;
      if (this.extension.length) {
        newName += `.${this.item.extension}`;
      }

      let newPath = this.item.directory;
      if (newPath.substr(-1) !== '/') {
        newPath += '/';
      }

      // Rename the item
      this.$store.dispatch('renameItem', {
        path: this.item.path,
        newPath: newPath + newName,
        newName,
      });
    },
  },
};

const _hoisted_1$3 = {
  id: "renameTitle",
  class: "modal-title"
};
const _hoisted_2$3 = { class: "form-group p-3" };
const _hoisted_3$3 = { for: "name" };
const _hoisted_4$2 = {
  key: 0,
  class: "input-group-text"
};

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_modal = resolveComponent("media-modal");

  return (_ctx.$store.state.showRenameModal)
    ? (openBlock(), createBlock(_component_media_modal, {
        key: 0,
        size: 'sm',
        "show-close": false,
        "label-element": "renameTitle",
        onClose: _cache[6] || (_cache[6] = $event => ($options.close()))
      }, {
        header: withCtx(() => [
          createVNode("h3", _hoisted_1$3, toDisplayString(_ctx.translate('COM_MEDIA_RENAME')), 1 /* TEXT */)
        ]),
        body: withCtx(() => [
          createVNode("div", null, [
            createVNode("form", {
              class: "form",
              novalidate: "",
              onSubmit: _cache[1] || (_cache[1] = withModifiers((...args) => ($options.save && $options.save(...args)), ["prevent"]))
            }, [
              createVNode("div", _hoisted_2$3, [
                createVNode("label", _hoisted_3$3, toDisplayString(_ctx.translate('COM_MEDIA_NAME')), 1 /* TEXT */),
                createVNode("div", {
                  class: {'input-group': $options.extension.length}
                }, [
                  createVNode("input", {
                    id: "name",
                    ref: "nameField",
                    class: "form-control",
                    type: "text",
                    placeholder: _ctx.translate('COM_MEDIA_NAME'),
                    value: $options.name,
                    required: "",
                    autocomplete: "off"
                  }, null, 8 /* PROPS */, ["placeholder", "value"]),
                  ($options.extension.length)
                    ? (openBlock(), createBlock("span", _hoisted_4$2, toDisplayString($options.extension), 1 /* TEXT */))
                    : createCommentVNode("v-if", true)
                ], 2 /* CLASS */)
              ])
            ], 32 /* HYDRATE_EVENTS */)
          ])
        ]),
        footer: withCtx(() => [
          createVNode("div", null, [
            createVNode("button", {
              type: "button",
              class: "btn btn-secondary",
              onClick: _cache[2] || (_cache[2] = $event => ($options.close())),
              onKeyup: _cache[3] || (_cache[3] = withKeys($event => ($options.close()), ["enter"]))
            }, toDisplayString(_ctx.translate('JCANCEL')), 33 /* TEXT, HYDRATE_EVENTS */),
            createVNode("button", {
              type: "button",
              class: "btn btn-success",
              disabled: !$options.isValid(),
              onClick: _cache[4] || (_cache[4] = $event => ($options.save())),
              onKeyup: _cache[5] || (_cache[5] = withKeys($event => ($options.save()), ["enter"]))
            }, toDisplayString(_ctx.translate('JAPPLY')), 41 /* TEXT, PROPS, HYDRATE_EVENTS */, ["disabled"])
          ])
        ]),
        _: 1 /* STABLE */
      }))
    : createCommentVNode("v-if", true)
}

script$4.render = render$4;
script$4.__file = "administrator/components/com_media/resources/scripts/components/modals/rename-modal.vue";

var script$3 = {
  name: 'MediaShareModal',
  computed: {
    item() {
      return this.$store.state.selectedItems[this.$store.state.selectedItems.length - 1];
    },

    url() {
      return (this.$store.state.previewItem && Object.prototype.hasOwnProperty.call(this.$store.state.previewItem, 'url') ? this.$store.state.previewItem.url : null);
    },
  },
  methods: {
    /* Close the modal instance and reset the form */
    close() {
      this.$store.commit(HIDE_SHARE_MODAL);
      this.$store.commit(LOAD_FULL_CONTENTS_SUCCESS, null);
    },

    // Generate the url from backend
    generateUrl() {
      this.$store.dispatch('getFullContents', this.item);
    },

    // Copy to clipboard
    copyToClipboard() {
      this.$refs.urlText.focus();
      this.$refs.urlText.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        // TODO Error handling in joomla way
        // eslint-disable-next-line no-undef
        alert(translate('COM_MEDIA_SHARE_COPY_FAILED_ERROR'));
      }
    },
  },
};

const _hoisted_1$2 = {
  id: "shareTitle",
  class: "modal-title"
};
const _hoisted_2$2 = { class: "p-3" };
const _hoisted_3$2 = { class: "desc" };
const _hoisted_4$1 = {
  key: 0,
  class: "control"
};
const _hoisted_5$1 = {
  key: 1,
  class: "control"
};
const _hoisted_6$1 = { class: "input-group" };
const _hoisted_7$1 = /*#__PURE__*/createVNode("span", {
  class: "icon-clipboard",
  "aria-hidden": "true"
}, null, -1 /* HOISTED */);

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_modal = resolveComponent("media-modal");

  return (_ctx.$store.state.showShareModal)
    ? (openBlock(), createBlock(_component_media_modal, {
        key: 0,
        size: 'md',
        "show-close": false,
        "label-element": "shareTitle",
        onClose: _cache[5] || (_cache[5] = $event => ($options.close()))
      }, {
        header: withCtx(() => [
          createVNode("h3", _hoisted_1$2, toDisplayString(_ctx.translate('COM_MEDIA_SHARE')), 1 /* TEXT */)
        ]),
        body: withCtx(() => [
          createVNode("div", _hoisted_2$2, [
            createVNode("div", _hoisted_3$2, [
              createTextVNode(toDisplayString(_ctx.translate('COM_MEDIA_SHARE_DESC')) + " ", 1 /* TEXT */),
              (!$options.url)
                ? (openBlock(), createBlock("div", _hoisted_4$1, [
                    createVNode("button", {
                      class: "btn btn-success w-100",
                      type: "button",
                      onClick: _cache[1] || (_cache[1] = (...args) => ($options.generateUrl && $options.generateUrl(...args)))
                    }, toDisplayString(_ctx.translate('COM_MEDIA_ACTION_SHARE')), 1 /* TEXT */)
                  ]))
                : (openBlock(), createBlock("div", _hoisted_5$1, [
                    createVNode("span", _hoisted_6$1, [
                      withDirectives(createVNode("input", {
                        id: "url",
                        ref: "urlText",
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ($options.url = $event)),
                        readonly: "",
                        type: "url",
                        class: "form-control input-xxlarge",
                        placeholder: "URL",
                        autocomplete: "off"
                      }, null, 512 /* NEED_PATCH */), [
                        [vModelText, $options.url]
                      ]),
                      createVNode("button", {
                        class: "btn btn-secondary",
                        type: "button",
                        title: _ctx.translate('COM_MEDIA_SHARE_COPY'),
                        onClick: _cache[3] || (_cache[3] = (...args) => ($options.copyToClipboard && $options.copyToClipboard(...args)))
                      }, [
                        _hoisted_7$1
                      ], 8 /* PROPS */, ["title"])
                    ])
                  ]))
            ])
          ])
        ]),
        footer: withCtx(() => [
          createVNode("div", null, [
            createVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[4] || (_cache[4] = $event => ($options.close()))
            }, toDisplayString(_ctx.translate('JCANCEL')), 1 /* TEXT */)
          ])
        ]),
        _: 1 /* STABLE */
      }))
    : createCommentVNode("v-if", true)
}

script$3.render = render$3;
script$3.__file = "administrator/components/com_media/resources/scripts/components/modals/share-modal.vue";

var script$2 = {
  name: 'MediaShareModal',
  computed: {
    item() {
      return this.$store.state.selectedItems[this.$store.state.selectedItems.length - 1];
    },
  },
  methods: {
    /* Delete Item */
    deleteItem() {
      this.$store.dispatch('deleteSelectedItems');
      this.$store.commit(HIDE_CONFIRM_DELETE_MODAL);
    },
    /* Close the modal instance */
    close() {
      this.$store.commit(HIDE_CONFIRM_DELETE_MODAL);
    },
  },
};

const _hoisted_1$1 = {
  id: "confirmDeleteTitle",
  class: "modal-title"
};
const _hoisted_2$1 = { class: "p-3" };
const _hoisted_3$1 = { class: "desc" };

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_media_modal = resolveComponent("media-modal");

  return (_ctx.$store.state.showConfirmDeleteModal)
    ? (openBlock(), createBlock(_component_media_modal, {
        key: 0,
        size: 'md',
        "show-close": false,
        "label-element": "confirmDeleteTitle",
        onClose: _cache[3] || (_cache[3] = $event => ($options.close()))
      }, {
        header: withCtx(() => [
          createVNode("h3", _hoisted_1$1, toDisplayString(_ctx.translate('COM_MEDIA_CONFIRM_DELETE_MODAL_HEADING')), 1 /* TEXT */)
        ]),
        body: withCtx(() => [
          createVNode("div", _hoisted_2$1, [
            createVNode("div", _hoisted_3$1, toDisplayString(_ctx.translate('JGLOBAL_CONFIRM_DELETE')), 1 /* TEXT */)
          ])
        ]),
        footer: withCtx(() => [
          createVNode("div", null, [
            createVNode("button", {
              class: "btn btn-success",
              onClick: _cache[1] || (_cache[1] = $event => ($options.close()))
            }, toDisplayString(_ctx.translate('JCANCEL')), 1 /* TEXT */),
            createVNode("button", {
              id: "media-delete-item",
              class: "btn btn-danger",
              onClick: _cache[2] || (_cache[2] = $event => ($options.deleteItem()))
            }, toDisplayString(_ctx.translate('COM_MEDIA_CONFIRM_DELETE_MODAL')), 1 /* TEXT */)
          ])
        ]),
        _: 1 /* STABLE */
      }))
    : createCommentVNode("v-if", true)
}

script$2.render = render$2;
script$2.__file = "administrator/components/com_media/resources/scripts/components/modals/confirm-delete-modal.vue";

var script$1 = {
  name: 'MediaInfobar',
  computed: {
    /* Get the item to show in the infobar */
    item() {
      // Check if there are selected items
      const { selectedItems } = this.$store.state;

      // If there is only one selected item, show that one.
      if (selectedItems.length === 1) {
        return selectedItems[0];
      }

      // If there are more selected items, use the last one
      if (selectedItems.length > 1) {
        return selectedItems.slice(-1)[0];
      }

      // Use the currently selected directory as a fallback
      return this.$store.getters.getSelectedDirectory;
    },
    /* Show/Hide the InfoBar */
    showInfoBar() {
      return this.$store.state.showInfoBar;
    },
  },
  methods: {
    hideInfoBar() {
      this.$store.commit(HIDE_INFOBAR);
    },
  },
};

const _hoisted_1 = {
  key: 0,
  class: "media-infobar"
};
const _hoisted_2 = {
  key: 0,
  class: "text-center"
};
const _hoisted_3 = /*#__PURE__*/createVNode("span", { class: "icon-file placeholder-icon" }, null, -1 /* HOISTED */);
const _hoisted_4 = /*#__PURE__*/createTextVNode(" Select file or folder to view its details. ");
const _hoisted_5 = { key: 1 };
const _hoisted_6 = { key: 0 };
const _hoisted_7 = { key: 1 };
const _hoisted_8 = { key: 2 };
const _hoisted_9 = { key: 3 };
const _hoisted_10 = { key: 4 };
const _hoisted_11 = { key: 5 };
const _hoisted_12 = { key: 6 };

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(Transition, { name: "infobar" }, {
    default: withCtx(() => [
      ($options.showInfoBar && $options.item)
        ? (openBlock(), createBlock("div", _hoisted_1, [
            createVNode("span", {
              class: "infobar-close",
              onClick: _cache[1] || (_cache[1] = $event => ($options.hideInfoBar()))
            }, "×"),
            createVNode("h2", null, toDisplayString($options.item.name), 1 /* TEXT */),
            ($options.item.path === '/')
              ? (openBlock(), createBlock("div", _hoisted_2, [
                  _hoisted_3,
                  _hoisted_4
                ]))
              : (openBlock(), createBlock("dl", _hoisted_5, [
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_FOLDER')), 1 /* TEXT */),
                  createVNode("dd", null, toDisplayString($options.item.directory), 1 /* TEXT */),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_TYPE')), 1 /* TEXT */),
                  ($options.item.type === 'file')
                    ? (openBlock(), createBlock("dd", _hoisted_6, toDisplayString(_ctx.translate('COM_MEDIA_FILE')), 1 /* TEXT */))
                    : ($options.item.type === 'dir')
                      ? (openBlock(), createBlock("dd", _hoisted_7, toDisplayString(_ctx.translate('COM_MEDIA_FOLDER')), 1 /* TEXT */))
                      : (openBlock(), createBlock("dd", _hoisted_8, " - ")),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_CREATED')), 1 /* TEXT */),
                  createVNode("dd", null, toDisplayString($options.item.create_date_formatted), 1 /* TEXT */),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')), 1 /* TEXT */),
                  createVNode("dd", null, toDisplayString($options.item.modified_date_formatted), 1 /* TEXT */),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_DIMENSION')), 1 /* TEXT */),
                  ($options.item.width || $options.item.height)
                    ? (openBlock(), createBlock("dd", _hoisted_9, toDisplayString($options.item.width) + "px * " + toDisplayString($options.item.height) + "px ", 1 /* TEXT */))
                    : (openBlock(), createBlock("dd", _hoisted_10, " - ")),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_SIZE')), 1 /* TEXT */),
                  ($options.item.size)
                    ? (openBlock(), createBlock("dd", _hoisted_11, toDisplayString(($options.item.size / 1024).toFixed(2)) + " KB ", 1 /* TEXT */))
                    : (openBlock(), createBlock("dd", _hoisted_12, " - ")),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_MIME_TYPE')), 1 /* TEXT */),
                  createVNode("dd", null, toDisplayString($options.item.mime_type), 1 /* TEXT */),
                  createVNode("dt", null, toDisplayString(_ctx.translate('COM_MEDIA_MEDIA_EXTENSION')), 1 /* TEXT */),
                  createVNode("dd", null, toDisplayString($options.item.extension || '-'), 1 /* TEXT */)
                ]))
          ]))
        : createCommentVNode("v-if", true)
    ]),
    _: 1 /* STABLE */
  }))
}

script$1.render = render$1;
script$1.__file = "administrator/components/com_media/resources/scripts/components/infobar/infobar.vue";

var script = {
  name: 'MediaUpload',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    accept: {
      type: String,
    },
    // eslint-disable-next-line vue/require-prop-types
    extensions: {
      default: () => [],
    },
    name: {
      type: String,
      default: 'file',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    // Listen to the toolbar upload click event
    MediaManager.Event.listen('onClickUpload', () => this.chooseFiles());
  },
  methods: {
    /* Open the choose-file dialog */
    chooseFiles() {
      this.$refs.fileInput.click();
    },
    /* Upload files */
    upload(e) {
      e.preventDefault();
      const { files } = e.target;

      // Loop through array of files and upload each file
      Array.from(files).forEach((file) => {
        // Create a new file reader instance
        const reader = new FileReader();

        // Add the on load callback
        reader.onload = (progressEvent) => {
          const { result } = progressEvent.target;
          const splitIndex = result.indexOf('base64') + 7;
          const content = result.slice(splitIndex, result.length);

          // Upload the file
          this.$store.dispatch('uploadFile', {
            name: file.name,
            parent: this.$store.state.selectedDirectory,
            content,
          });
        };

        reader.readAsDataURL(file);
      });
    },
  },
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("input", {
    ref: "fileInput",
    type: "file",
    class: "hidden",
    name: $props.name,
    multiple: $props.multiple,
    accept: $props.accept,
    onChange: _cache[1] || (_cache[1] = (...args) => ($options.upload && $options.upload(...args)))
  }, null, 40 /* PROPS, HYDRATE_EVENTS */, ["name", "multiple", "accept"]))
}

script.render = render;
script.__file = "administrator/components/com_media/resources/scripts/components/upload/upload.vue";

/**
 * Translate plugin
 */
const Translate = {
  // Translate from Joomla text
  translate: key => Joomla.JText._(key, key),
  sprintf: (string, ...args) => {
    // eslint-disable-next-line no-param-reassign
    string = Translate.translate(string);
    let i = 0;
    return string.replace(/%((%)|s|d)/g, m => {
      let val = args[i];

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
  install: Vue => Vue.mixin({
    methods: {
      translate(key) {
        return Translate.translate(key);
      },

      sprintf(key, ...args) {
        return Translate.sprintf(key, args);
      }

    }
  })
};

/*!
 * vuex v4.0.0
 * (c) 2021 Evan You
 * @license MIT
 */
var storeKey = 'store';

var target = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
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

prototypeAccessors$1.state.set = function (v) {
};

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
  } catch (e) {
  }

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
      } catch (e) {
      }

      resolve(res);
    }, function (error) {
      try {
        this$1._actionSubscribers.filter(function (sub) {
          return sub.error;
        }).forEach(function (sub) {
          return sub.error(action, this$1.state, error);
        });
      } catch (e) {
      }

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
      get: function () {
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
      get: function () {
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
        get: function () {
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
  }, function () {
  }, {
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

var r = function (r) {
  return function (r) {
    return !!r && "object" == typeof r;
  }(r) && !function (r) {
    var t = Object.prototype.toString.call(r);
    return "[object RegExp]" === t || "[object Date]" === t || function (r) {
      return r.$$typeof === e;
    }(r);
  }(r);
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
      s = function () {
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
}

// The options for persisting state
// eslint-disable-next-line import/prefer-default-export
const persistedStateOptions = {
  key: 'joomla.mediamanager',
  paths: ['selectedDirectory', 'showInfoBar', 'listView', 'gridSize'],
  storage: window.sessionStorage
};

const options = Joomla.getOptions('com_media', {});

if (options.providers === undefined || options.providers.length === 0) {
  throw new TypeError('Media providers are not defined.');
}
/**
 * Get the drives
 *
 * @param  {Array}  adapterNames
 * @param  {String} provider
 *
 * @return {Array}
 */


const getDrives = (adapterNames, provider) => {
  const drives = [];
  adapterNames.map(name => drives.push({
    root: `${provider}-${name}:/`,
    displayName: name
  }));
  return drives;
}; // Load disks from options


const loadedDisks = options.providers.map(disk => ({
  displayName: disk.displayName,
  drives: getDrives(disk.adapterNames, disk.name)
}));

if (loadedDisks[0].drives[0] === undefined || loadedDisks[0].drives.length === 0) {
  throw new TypeError('No default media drive was found');
} // Override the storage if we have a path


if (options.currentPath) {
  const storedState = JSON.parse(persistedStateOptions.storage.getItem(persistedStateOptions.key));

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
  directories: loadedDisks.map(disk => ({
    path: disk.drives[0].root,
    name: disk.displayName,
    directories: [],
    files: [],
    directory: null
  })),
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
};

// Sometimes we may need to compute derived state based on store state,
// for example filtering through a list of items and counting them.

/**
 * Get the currently selected directory
 * @param state
 * @returns {*}
 */
const getSelectedDirectory = state => state.directories.find(directory => directory.path === state.selectedDirectory);
/**
 * Get the sudirectories of the currently selected directory
 * @param state
 *
 * @returns {Array|directories|{/}|computed.directories|*|Object}
 */

const getSelectedDirectoryDirectories = state => state.directories.filter(directory => directory.directory === state.selectedDirectory);
/**
 * Get the files of the currently selected directory
 * @param state
 *
 * @returns {Array|files|{}|FileList|*}
 */

const getSelectedDirectoryFiles = state => state.files.filter(file => file.directory === state.selectedDirectory);
/**
 * Whether or not all items of the current directory are selected
 * @param state
 * @param getters
 * @returns Array
 */

const getSelectedDirectoryContents = (state, getters) => [...getters.getSelectedDirectoryDirectories, ...getters.getSelectedDirectoryFiles];

var getters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getSelectedDirectory: getSelectedDirectory,
    getSelectedDirectoryDirectories: getSelectedDirectoryDirectories,
    getSelectedDirectoryFiles: getSelectedDirectoryFiles,
    getSelectedDirectoryContents: getSelectedDirectoryContents
});

// - Instead of mutating the state, actions commit mutations.
// - Actions can contain arbitrary asynchronous operations.
// TODO move to utils

function updateUrlPath(path) {
  if (path == null) {
    // eslint-disable-next-line no-param-reassign
    path = '';
  }

  const url = window.location.href;
  const pattern = new RegExp('\\b(path=).*?(&|$)');

  if (url.search(pattern) >= 0) {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, '', url.replace(pattern, `$1${path}$2`));
  } else {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, '', `${url + (url.indexOf('?') > 0 ? '&' : '?')}path=${path}`);
  }
}
/**
 * Get contents of a directory from the api
 * @param context
 * @param payload
 */


const getContents = (context, payload) => {
  // Update the url
  updateUrlPath(payload);
  context.commit(SET_IS_LOADING, true);
  api.getContents(payload, 0).then(contents => {
    context.commit(LOAD_CONTENTS_SUCCESS, contents);
    context.commit(UNSELECT_ALL_BROWSER_ITEMS);
    context.commit(SELECT_DIRECTORY, payload);
    context.commit(SET_IS_LOADING, false);
  }).catch(error => {
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

const getFullContents = (context, payload) => {
  context.commit(SET_IS_LOADING, true);
  api.getContents(payload.path, 1).then(contents => {
    context.commit(LOAD_FULL_CONTENTS_SUCCESS, contents.files[0]);
    context.commit(SET_IS_LOADING, false);
  }).catch(error => {
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

const download = (context, payload) => {
  api.getContents(payload.path, 0, 1).then(contents => {
    const file = contents.files[0]; // Convert the base 64 encoded string to a blob

    const byteCharacters = atob(file.content);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length); // eslint-disable-next-line no-plusplus

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    } // Download file


    const blobURL = URL.createObjectURL(new Blob(byteArrays, {
      type: file.mime_type
    }));
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }).catch(error => {
    // eslint-disable-next-line no-console
    console.log('error', error);
  });
};
/**
 * Toggle the selection state of an item
 * @param context
 * @param payload
 */

const toggleBrowserItemSelect = (context, payload) => {
  const item = payload;
  const isSelected = context.state.selectedItems.some(selected => selected.path === item.path);

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

const createDirectory = (context, payload) => {
  context.commit(SET_IS_LOADING, true);
  api.createDirectory(payload.name, payload.parent).then(folder => {
    context.commit(CREATE_DIRECTORY_SUCCESS, folder);
    context.commit(HIDE_CREATE_FOLDER_MODAL);
    context.commit(SET_IS_LOADING, false);
  }).catch(error => {
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

const uploadFile = (context, payload) => {
  context.commit(SET_IS_LOADING, true);
  api.upload(payload.name, payload.parent, payload.content, payload.override || false).then(file => {
    context.commit(UPLOAD_SUCCESS, file);
    context.commit(SET_IS_LOADING, false);
  }).catch(error => {
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

const renameItem = (context, payload) => {
  context.commit(SET_IS_LOADING, true);
  api.rename(payload.path, payload.newPath).then(item => {
    context.commit(RENAME_SUCCESS, {
      item,
      oldPath: payload.path,
      newName: payload.newName
    });
    context.commit(HIDE_RENAME_MODAL);
    context.commit(SET_IS_LOADING, false);
  }).catch(error => {
    // TODO error handling
    context.commit(SET_IS_LOADING, false); // eslint-disable-next-line no-console

    console.log('error', error);
  });
};
/**
 * Delete the selected items
 * @param context
 */

const deleteSelectedItems = context => {
  context.commit(SET_IS_LOADING, true); // Get the selected items from the store

  const {
    selectedItems
  } = context.state;

  if (selectedItems.length > 0) {
    selectedItems.forEach(item => {
      api.delete(item.path).then(() => {
        context.commit(DELETE_SUCCESS, item);
        context.commit(UNSELECT_ALL_BROWSER_ITEMS);
        context.commit(SET_IS_LOADING, false);
      }).catch(error => {
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
});

// Mutations are very similar to events: each mutation has a string type and a handler.
// The handler function is where we perform actual state modifications,
// and it will receive the state as the first argument.
// The grid item sizes

const gridItemSizes = ['sm', 'md', 'lg', 'xl'];
var mutations = {
  /**
     * Select a directory
     * @param state
     * @param payload
     */
  [SELECT_DIRECTORY]: (state, payload) => {
    state.selectedDirectory = payload;
  },

  /**
     * The load content success mutation
     * @param state
     * @param payload
     */
  [LOAD_CONTENTS_SUCCESS]: (state, payload) => {
    /**
         * Create the directory structure
         * @param path
         */
    function createDirectoryStructureFromPath(path) {
      const exists = state.directories.some(existing => existing.path === path);

      if (!exists) {
        // eslint-disable-next-line no-use-before-define
        const directory = directoryFromPath(path); // Add the sub directories and files

        directory.directories = state.directories.filter(existing => existing.directory === directory.path).map(existing => existing.path); // Add the directory

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
      const parts = path.split('/');
      let directory = dirname(path);

      if (directory.indexOf(':', directory.length - 1) !== -1) {
        directory += '/';
      }

      return {
        path,
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
      const parentDirectory = state.directories.find(existing => existing.path === directory.directory);
      const parentDirectoryIndex = state.directories.indexOf(parentDirectory);
      let index = state.directories.findIndex(existing => existing.path === directory.path);

      if (index === -1) {
        index = state.directories.length;
      } // Add the directory


      state.directories.splice(index, 1, directory); // Update the relation to the parent directory

      if (parentDirectoryIndex !== -1) {
        state.directories.splice(parentDirectoryIndex, 1, { ...parentDirectory,
          directories: [...parentDirectory.directories, directory.path]
        });
      }
    }
    /**
         * Add a file
         * @param state
         * @param directory
         */
    // eslint-disable-next-line no-shadow


    function addFile(state, file) {
      const parentDirectory = state.directories.find(directory => directory.path === file.directory);
      const parentDirectoryIndex = state.directories.indexOf(parentDirectory);
      let index = state.files.findIndex(existing => existing.path === file.path);

      if (index === -1) {
        index = state.files.length;
      } // Add the file


      state.files.splice(index, 1, file); // Update the relation to the parent directory

      if (parentDirectoryIndex !== -1) {
        state.directories.splice(parentDirectoryIndex, 1, { ...parentDirectory,
          files: [...parentDirectory.files, file.path]
        });
      }
    } // Create the parent directory structure if it does not exist


    createDirectoryStructureFromPath(state.selectedDirectory); // Add directories

    payload.directories.forEach(directory => {
      addDirectory(state, directory);
    }); // Add files

    payload.files.forEach(file => {
      addFile(state, file);
    });
  },

  /**
     * The upload success mutation
     * @param state
     * @param payload
     */
  [UPLOAD_SUCCESS]: (state, payload) => {
    const file = payload;
    const isNew = !state.files.some(existing => existing.path === file.path); // TODO handle file_exists

    if (isNew) {
      const parentDirectory = state.directories.find(existing => existing.path === file.directory);
      const parentDirectoryIndex = state.directories.indexOf(parentDirectory); // Add the new file to the files array

      state.files.push(file); // Update the relation to the parent directory

      state.directories.splice(parentDirectoryIndex, 1, { ...parentDirectory,
        files: [...parentDirectory.files, file.path]
      });
    }
  },

  /**
     * The create directory success mutation
     * @param state
     * @param payload
     */
  [CREATE_DIRECTORY_SUCCESS]: (state, payload) => {
    const directory = payload;
    const isNew = !state.directories.some(existing => existing.path === directory.path);

    if (isNew) {
      const parentDirectory = state.directories.find(existing => existing.path === directory.directory);
      const parentDirectoryIndex = state.directories.indexOf(parentDirectory); // Add the new directory to the directory

      state.directories.push(directory); // Update the relation to the parent directory

      state.directories.splice(parentDirectoryIndex, 1, { ...parentDirectory,
        directories: [...parentDirectory.directories, directory.path]
      });
    }
  },

  /**
     * The rename success handler
     * @param state
     * @param payload
     */
  [RENAME_SUCCESS]: (state, payload) => {
    state.selectedItems[state.selectedItems.length - 1].name = payload.newName;
    const {
      item
    } = payload;
    const {
      oldPath
    } = payload;

    if (item.type === 'file') {
      const index = state.files.findIndex(file => file.path === oldPath);
      state.files.splice(index, 1, item);
    } else {
      const index = state.directories.findIndex(directory => directory.path === oldPath);
      state.directories.splice(index, 1, item);
    }
  },

  /**
     * The delete success mutation
     * @param state
     * @param payload
     */
  [DELETE_SUCCESS]: (state, payload) => {
    const item = payload; // Delete file

    if (item.type === 'file') {
      state.files.splice(state.files.findIndex(file => file.path === item.path), 1);
    } // Delete dir


    if (item.type === 'dir') {
      state.directories.splice(state.directories.findIndex(directory => directory.path === item.path), 1);
    }
  },

  /**
     * Select a browser item
     * @param state
     * @param payload the item
     */
  [SELECT_BROWSER_ITEM]: (state, payload) => {
    state.selectedItems.push(payload);
  },

  /**
     * Select browser items
     * @param state
     * @param payload the items
     */
  [SELECT_BROWSER_ITEMS]: (state, payload) => {
    state.selectedItems = payload;
  },

  /**
     * Unselect a browser item
     * @param state
     * @param payload the item
     */
  [UNSELECT_BROWSER_ITEM]: (state, payload) => {
    const item = payload;
    state.selectedItems.splice(state.selectedItems.findIndex(selectedItem => selectedItem.path === item.path), 1);
  },

  /**
     * Unselect all browser items
     * @param state
     * @param payload the item
     */
  [UNSELECT_ALL_BROWSER_ITEMS]: state => {
    state.selectedItems = [];
  },

  /**
     * Show the create folder modal
     * @param state
     */
  [SHOW_CREATE_FOLDER_MODAL]: state => {
    state.showCreateFolderModal = true;
  },

  /**
     * Hide the create folder modal
     * @param state
     */
  [HIDE_CREATE_FOLDER_MODAL]: state => {
    state.showCreateFolderModal = false;
  },

  /**
     * Show the info bar
     * @param state
     */
  [SHOW_INFOBAR]: state => {
    state.showInfoBar = true;
  },

  /**
     * Show the info bar
     * @param state
     */
  [HIDE_INFOBAR]: state => {
    state.showInfoBar = false;
  },

  /**
     * Define the list grid view
     * @param state
     */
  [CHANGE_LIST_VIEW]: (state, view) => {
    state.listView = view;
  },

  /**
     * FUll content is loaded
     * @param state
     * @param payload
     */
  [LOAD_FULL_CONTENTS_SUCCESS]: (state, payload) => {
    state.previewItem = payload;
  },

  /**
     * Show the preview modal
     * @param state
     */
  [SHOW_PREVIEW_MODAL]: state => {
    state.showPreviewModal = true;
  },

  /**
     * Hide the preview modal
     * @param state
     */
  [HIDE_PREVIEW_MODAL]: state => {
    state.showPreviewModal = false;
  },

  /**
     * Set the is loading state
     * @param state
     */
  [SET_IS_LOADING]: (state, payload) => {
    state.isLoading = payload;
  },

  /**
     * Show the rename modal
     * @param state
     */
  [SHOW_RENAME_MODAL]: state => {
    state.showRenameModal = true;
  },

  /**
     * Hide the rename modal
     * @param state
     */
  [HIDE_RENAME_MODAL]: state => {
    state.showRenameModal = false;
  },

  /**
     * Show the share modal
     * @param state
     */
  [SHOW_SHARE_MODAL]: state => {
    state.showShareModal = true;
  },

  /**
     * Hide the share modal
     * @param state
     */
  [HIDE_SHARE_MODAL]: state => {
    state.showShareModal = false;
  },

  /**
     * Increase the size of the grid items
     * @param state
     */
  [INCREASE_GRID_SIZE]: state => {
    let currentSizeIndex = gridItemSizes.indexOf(state.gridSize);

    if (currentSizeIndex >= 0 && currentSizeIndex < gridItemSizes.length - 1) {
      // eslint-disable-next-line no-plusplus
      state.gridSize = gridItemSizes[++currentSizeIndex];
    }
  },

  /**
     * Increase the size of the grid items
     * @param state
     */
  [DECREASE_GRID_SIZE]: state => {
    let currentSizeIndex = gridItemSizes.indexOf(state.gridSize);

    if (currentSizeIndex > 0 && currentSizeIndex < gridItemSizes.length) {
      // eslint-disable-next-line no-plusplus
      state.gridSize = gridItemSizes[--currentSizeIndex];
    }
  },

  /**
    * Set search query
    * @param state
    * @param query
    */
  [SET_SEARCH_QUERY]: (state, query) => {
    state.search = query;
  },

  /**
     * Show the confirm modal
     * @param state
     */
  [SHOW_CONFIRM_DELETE_MODAL]: state => {
    state.showConfirmDeleteModal = true;
  },

  /**
     * Hide the confirm modal
     * @param state
     */
  [HIDE_CONFIRM_DELETE_MODAL]: state => {
    state.showConfirmDeleteModal = false;
  }
};

var store = createStore({
  state,
  getters,
  actions,
  mutations,
  plugins: [a(persistedStateOptions)],
  strict: "production" !== 'production'
});

window.MediaManager = window.MediaManager || {}; // Register the media manager event bus

window.MediaManager.Event = new Event(); // Create the Vue app instance

const app = createApp(script$k);
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
