/*!
 * Vue.js v2.6.12
 * (c) 2014-2020 Evan You
 * Released under the MIT License.
 */
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

function f(t) {
  var e = parseFloat(t);
  return isNaN(e) ? t : e;
}

function d(t, e) {
  var n = Object.create(null),
      o = t.split(",");

  for (var _t2 = 0; _t2 < o.length; _t2++) {
    n[o[_t2]] = !0;
  }

  return e ? t => n[t.toLowerCase()] : t => n[t];
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
    _ = v(t => t.replace($, (t, e) => e ? e.toUpperCase() : "")),
    b = v(t => t.charAt(0).toUpperCase() + t.slice(1)),
    w = /\B([A-Z])/g,
    C = v(t => t.replace(w, "-$1").toLowerCase());

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

var T = (t, e, n) => !1,
    E = t => t;

function N(t, e) {
  if (t === e) return !0;
  var n = s(t),
      o = s(e);
  if (!n || !o) return !n && !o && String(t) === String(e);

  try {
    var _n5 = Array.isArray(t),
        _o2 = Array.isArray(e);

    if (_n5 && _o2) return t.length === e.length && t.every((t, n) => N(t, e[n]));
    if (t instanceof Date && e instanceof Date) return t.getTime() === e.getTime();
    if (_n5 || _o2) return !1;
    {
      var _n6 = Object.keys(t),
          _o3 = Object.keys(e);

      return _n6.length === _o3.length && _n6.every(n => N(t[n], e[n]));
    }
  } catch (t) {
    return !1;
  }
}

function j(t, e) {
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
    get() {
      tt = !0;
    }

  }), window.addEventListener("test-passive", null, _t3);
} catch (t) {}

var et = () => (void 0 === Q && (Q = !z && !V && "undefined" != typeof global && global.process && "server" === global.process.env.VUE_ENV), Q),
    nt = z && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function ot(t) {
  return "function" == typeof t && /native code/.test(t.toString());
}

var rt = "undefined" != typeof Symbol && ot(Symbol) && "undefined" != typeof Reflect && ot(Reflect.ownKeys);
var st;
st = "undefined" != typeof Set && ot(Set) ? Set : class {
  constructor() {
    this.set = Object.create(null);
  }

  has(t) {
    return !0 === this.set[t];
  }

  add(t) {
    this.set[t] = !0;
  }

  clear() {
    this.set = Object.create(null);
  }

};
var it = S,
    at = 0;

class ct {
  constructor() {
    this.id = at++, this.subs = [];
  }

  addSub(t) {
    this.subs.push(t);
  }

  removeSub(t) {
    m(this.subs, t);
  }

  depend() {
    ct.target && ct.target.addDep(this);
  }

  notify() {
    var t = this.subs.slice();

    for (var _e2 = 0, _n8 = t.length; _e2 < _n8; _e2++) {
      t[_e2].update();
    }
  }

}

ct.target = null;
var lt = [];

function ut(t) {
  lt.push(t), ct.target = t;
}

function ft() {
  lt.pop(), ct.target = lt[lt.length - 1];
}

class dt {
  constructor(t, e, n, o, r, s, i, a) {
    this.tag = t, this.data = e, this.children = n, this.text = o, this.elm = r, this.ns = void 0, this.context = s, this.fnContext = void 0, this.fnOptions = void 0, this.fnScopeId = void 0, this.key = e && e.key, this.componentOptions = i, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1, this.asyncFactory = a, this.asyncMeta = void 0, this.isAsyncPlaceholder = !1;
  }

  get child() {
    return this.componentInstance;
  }

}

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

class bt {
  constructor(t) {
    var e;
    this.value = t, this.dep = new ct(), this.vmCount = 0, H(t, "__ob__", this), Array.isArray(t) ? (U ? (e = gt, t.__proto__ = e) : function (t, e, n) {
      for (var _o4 = 0, _r2 = n.length; _o4 < _r2; _o4++) {
        var _r3 = n[_o4];
        H(t, _r3, e[_r3]);
      }
    }(t, gt, vt), this.observeArray(t)) : this.walk(t);
  }

  walk(t) {
    var e = Object.keys(t);

    for (var _n9 = 0; _n9 < e.length; _n9++) {
      Ct(t, e[_n9]);
    }
  }

  observeArray(t) {
    for (var _e3 = 0, _n10 = t.length; _e3 < _n10; _e3++) {
      wt(t[_e3]);
    }
  }

}

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
}, I.forEach(t => {
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
    (s = n ? t.apply(e, n) : t.call(e)) && !s._isVue && l(s) && !s._handled && (s.catch(t => Pt(t, o, r + " (Promise/async)")), s._handled = !0);
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

  Vt = () => {
    _t10.then(Jt), G && setTimeout(S);
  }, Ut = !0;
} else if (q || "undefined" == typeof MutationObserver || !ot(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) Vt = "undefined" != typeof setImmediate && ot(setImmediate) ? () => {
  setImmediate(Jt);
} : () => {
  setTimeout(Jt, 0);
};else {
  var _t11 = 1;

  var _e7 = new MutationObserver(Jt),
      _n16 = document.createTextNode(String(_t11));

  _e7.observe(_n16, {
    characterData: !0
  }), Vt = () => {
    _t11 = (_t11 + 1) % 2, _n16.data = String(_t11);
  }, Ut = !0;
}

function qt(t, e) {
  var n;
  if (zt.push(() => {
    if (t) try {
      t.call(e);
    } catch (t) {
      Pt(t, e, "nextTick");
    } else n && n(e);
  }), Kt || (Kt = !0, Vt()), !t && "undefined" != typeof Promise) return new Promise(t => {
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

var Gt = v(t => {
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
  return () => t[e];
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
  t._o = ye, t._n = f, t._s = u, t._l = le, t._t = ue, t._q = N, t._i = j, t._m = me, t._f = fe, t._k = pe, t._b = he, t._v = ht, t._e = pt, t._u = _e, t._g = $e, t._d = be, t._p = we;
}

function xe(e, n, r, s, i) {
  var a = i.options;
  var c;
  g(s, "_uid") ? (c = Object.create(s))._original = s : (c = s, s = s._original);
  var l = o(a._compiled),
      u = !l;
  this.data = e, this.props = n, this.children = r, this.parent = s, this.listeners = e.on || t, this.injections = oe(a.inject, s), this.slots = () => (this.$slots || ie(e.scopedSlots, this.$slots = re(r, s)), this.$slots), Object.defineProperty(this, "scopedSlots", {
    enumerable: !0,

    get() {
      return ie(e.scopedSlots, this.slots());
    }

  }), l && (this.$options = a, this.$slots = this.slots(), this.$scopedSlots = ie(e.scopedSlots, this.$slots)), a._scopeId ? this._c = (t, e, n, o) => {
    var r = De(c, t, e, n, o, u);
    return r && !Array.isArray(r) && (r.fnScopeId = a._scopeId, r.fnContext = s), r;
  } : this._c = (t, e, n, o) => De(c, t, e, n, o, u);
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
  init(t, e) {
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

  prepatch(e, n) {
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

  insert(t) {
    var {
      context: e,
      componentInstance: n
    } = t;
    var o;
    n._isMounted || (n._isMounted = !0, qe(n, "mounted")), t.data.keepAlive && (e._isMounted ? ((o = n)._inactive = !1, Ze.push(o)) : Je(n, !0));
  },

  destroy(t) {
    var {
      componentInstance: e
    } = t;
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

      i.$on("hook:destroyed", () => m(_o18, i));

      var _f = t => {
        for (var _t20 = 0, _e10 = _o18.length; _t20 < _e10; _t20++) {
          _o18[_t20].$forceUpdate();
        }

        t && (_o18.length = 0, null !== _c && (clearTimeout(_c), _c = null), null !== _u && (clearTimeout(_u), _u = null));
      },
          _d = D(e => {
        t.resolved = Ie(e, r), _a2 ? _o18.length = 0 : _f(!0);
      }),
          _p = D(e => {
        n(t.errorComp) && (t.error = !0, _f(!0));
      }),
          _h = t(_d, _p);

      return s(_h) && (l(_h) ? e(t.resolved) && _h.then(_d, _p) : l(_h.component) && (_h.component.then(_d, _p), n(_h.error) && (t.errorComp = Ie(_h.error, r)), n(_h.loading) && (t.loadingComp = Ie(_h.loading, r), 0 === _h.delay ? t.loading = !0 : _c = setTimeout(() => {
        _c = null, e(t.resolved) && e(t.error) && (t.loading = !0, _f(!1));
      }, _h.delay || 200)), n(_h.timeout) && (_u = setTimeout(() => {
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
        {
      attrs: a,
      props: c
    } = t;
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
  var n = (n, o) => {
    t(n, o), e(n, o);
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
  return ze = t, () => {
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
  _t25 && "function" == typeof _t25.now && en() > document.createEvent("Event").timeStamp && (en = () => _t25.now());
}

function nn() {
  var t, e;

  for (tn = en(), Ye = !0, We.sort((t, e) => t.id - e.id), Qe = 0; Qe < We.length; Qe++) {
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

class rn {
  constructor(t, e, n, o, r) {
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

  get() {
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
  }

  addDep(t) {
    var e = t.id;
    this.newDepIds.has(e) || (this.newDepIds.add(e), this.newDeps.push(t), this.depIds.has(e) || t.addSub(this));
  }

  cleanupDeps() {
    var t = this.deps.length;

    for (; t--;) {
      var _e20 = this.deps[t];
      this.newDepIds.has(_e20.id) || _e20.removeSub(this);
    }

    var e = this.depIds;
    this.depIds = this.newDepIds, this.newDepIds = e, this.newDepIds.clear(), e = this.deps, this.deps = this.newDeps, this.newDeps = e, this.newDeps.length = 0;
  }

  update() {
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
  }

  run() {
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
  }

  evaluate() {
    this.value = this.get(), this.dirty = !1;
  }

  depend() {
    var t = this.deps.length;

    for (; t--;) {
      this.deps[t].depend();
    }
  }

  teardown() {
    if (this.active) {
      this.vm._isBeingDestroyed || m(this.vm._watchers, this);
      var _t27 = this.deps.length;

      for (; _t27--;) {
        this.deps[_t27].removeSub(this);
      }

      this.active = !1;
    }
  }

}

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
  var {
    cache: n,
    keys: o,
    _vnode: r
  } = t;

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
      e.$slots = re(n._renderChildren, r), e.$scopedSlots = t, e._c = (t, n, o, r) => De(e, t, n, o, r, !1), e.$createElement = (t, n, o, r) => De(e, t, n, o, r, !0);
      var s = o && o.data;
      Ct(e, "$attrs", s && s.attrs || t, null, !0), Ct(e, "$listeners", n._parentListeners || t, null, !0);
    }(n), qe(n, "beforeCreate"), function (t) {
      var e = oe(t.$options.inject, t);
      e && (_t(!1), Object.keys(e).forEach(n => {
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
        {
      render: e,
      _parentVnode: n
    } = t.$options;
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

    created() {
      this.cache = Object.create(null), this.keys = [];
    },

    destroyed() {
      for (var _t31 in this.cache) {
        bn(this.cache, _t31, this.keys);
      }
    },

    mounted() {
      this.$watch("include", t => {
        _n(this, e => $n(t, e));
      }), this.$watch("exclude", t => {
        _n(this, e => !$n(t, e));
      });
    },

    render() {
      var t = this.$slots.default,
          e = Pe(t),
          n = e && e.componentOptions;

      if (n) {
        var _t32 = vn(n),
            {
          include: _o26,
          exclude: _r20
        } = this;

        if (_o26 && (!_t32 || !$n(_o26, _t32)) || _r20 && _t32 && $n(_r20, _t32)) return e;

        var {
          cache: _s11,
          keys: _i9
        } = this,
            _a4 = null == e.key ? n.Ctor.cid + (n.tag ? "::" + n.tag : "") : e.key;

        _s11[_a4] ? (e.componentInstance = _s11[_a4].componentInstance, m(_i9, _a4), _i9.push(_a4)) : (_s11[_a4] = e, _i9.push(_a4), this.max && _i9.length > parseInt(this.max) && bn(_s11, _i9[0], _i9, this._vnode)), e.data.keepAlive = !0;
      }

      return e || t && t[0];
    }

  }
};
!function (t) {
  var e = {
    get: () => F
  };
  Object.defineProperty(t, "config", e), t.util = {
    warn: it,
    extend: A,
    mergeOptions: jt,
    defineReactive: Ct
  }, t.set = xt, t.delete = kt, t.nextTick = qt, t.observable = t => (wt(t), t), t.options = Object.create(null), M.forEach(e => {
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
    M.forEach(e => {
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
  get() {
    return this.$vnode && this.$vnode.ssrContext;
  }

}), Object.defineProperty(yn, "FunctionalRenderContext", {
  value: xe
}), yn.version = "2.6.12";

var xn = d("style,class"),
    kn = d("input,textarea,option,select,progress"),
    An = (t, e, n) => "value" === n && kn(t) && "button" !== e || "selected" === n && "option" === t || "checked" === n && "input" === t || "muted" === n && "video" === t,
    On = d("contenteditable,draggable,spellcheck"),
    Sn = d("events,caret,typing,plaintext-only"),
    Tn = (t, e) => Ln(e) || "false" === e ? "false" : "contenteditable" === t && Sn(e) ? e : "true",
    En = d("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
    Nn = "http://www.w3.org/1999/xlink",
    jn = t => ":" === t.charAt(5) && "xlink" === t.slice(0, 5),
    Dn = t => jn(t) ? t.slice(6, t.length) : "",
    Ln = t => null == t || !1 === t;

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
    Un = t => Hn(t) || Bn(t);

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
  create(t, e) {
    Zn(e);
  },

  update(t, e) {
    t.data.ref !== e.data.ref && (Zn(t, !0), Zn(e));
  },

  destroy(t) {
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
      var _o27 = () => {
        for (var _n35 = 0; _n35 < i.length; _n35++) {
          so(i[_n35], "inserted", e, t);
        }
      };

      n ? Qt(e, "insert", _o27) : _o27();
    }

    a.length && Qt(e, "postpatch", () => {
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
    i = u[s], (l[s]) !== i && co(c, s, i);
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
      var _e27 = n => {
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

        for (; _n37 >= 0 && " " === (_e28 = t.charAt(_n37)); _n37--) {
        }

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
  return t ? t.map(t => t[e]).filter(t => t) : [];
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
  var {
    number: o,
    trim: r
  } = n || {};
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

  for (; !Po() && (t = Fo()) !== e;) {
  }
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
      if (r.number) return f(o) !== f(e);
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
    ir = (t, e, n) => {
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
  if (e && (e = e.trim())) if (t.classList) e.indexOf(" ") > -1 ? e.split(dr).forEach(e => t.classList.add(e)) : t.classList.add(e);else {
    var _n42 = " " + (t.getAttribute("class") || "") + " ";

    _n42.indexOf(" " + e + " ") < 0 && t.setAttribute("class", (_n42 + e).trim());
  }
}

function hr(t, e) {
  if (e && (e = e.trim())) if (t.classList) e.indexOf(" ") > -1 ? e.split(dr).forEach(e => t.classList.remove(e)) : t.classList.remove(e), t.classList.length || t.removeAttribute("class");else {
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

var yr = v(t => ({
  enterClass: t + "-enter",
  enterToClass: t + "-enter-to",
  enterActiveClass: t + "-enter-active",
  leaveClass: t + "-leave",
  leaveToClass: t + "-leave-to",
  leaveActiveClass: t + "-leave-active"
})),
    gr = z && !W,
    vr = "transition",
    $r = "animation";
var _r = "transition",
    br = "transitionend",
    wr = "animation",
    Cr = "animationend";
gr && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (_r = "WebkitTransition", br = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (wr = "WebkitAnimation", Cr = "webkitAnimationEnd"));
var xr = z ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : t => t();

function kr(t) {
  xr(() => {
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
  var {
    type: o,
    timeout: r,
    propCount: s
  } = Er(t, e);
  if (!o) return n();
  var i = o === vr ? br : Cr;
  var a = 0;

  var c = () => {
    t.removeEventListener(i, l), n();
  },
      l = e => {
    e.target === t && ++a >= s && c();
  };

  setTimeout(() => {
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

  return Math.max.apply(null, e.map((e, n) => jr(e) + jr(t[n])));
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
  var {
    css: a,
    type: c,
    enterClass: l,
    enterToClass: u,
    enterActiveClass: d,
    appearClass: p,
    appearToClass: h,
    appearActiveClass: m,
    beforeEnter: y,
    enter: g,
    afterEnter: v,
    enterCancelled: $,
    beforeAppear: _,
    appear: b,
    afterAppear: w,
    appearCancelled: C,
    duration: x
  } = i;
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
      I = f(s(x) ? x.enter : x),
      F = !1 !== a && !W,
      P = Ir(j),
      R = r._enterCb = D(() => {
    F && (Or(r, E), Or(r, T)), R.cancelled ? (F && Or(r, S), M && M(r)) : L && L(r), r._enterCb = null;
  });
  t.data.show || Qt(t, "insert", () => {
    var e = r.parentNode,
        n = e && e._pending && e._pending[t.key];
    n && n.tag === t.tag && n.elm._leaveCb && n.elm._leaveCb(), j && j(r, R);
  }), N && N(r), F && (Ar(r, S), Ar(r, T), kr(() => {
    Or(r, S), R.cancelled || (Ar(r, E), P || (Mr(I) ? setTimeout(R, I) : Sr(r, c, R)));
  })), t.data.show && (o && o(), j && j(r, R)), F || P || R();
}

function Lr(t, o) {
  var r = t.elm;
  n(r._enterCb) && (r._enterCb.cancelled = !0, r._enterCb());
  var i = mr(t.data.transition);
  if (e(i) || 1 !== r.nodeType) return o();
  if (n(r._leaveCb)) return;

  var {
    css: a,
    type: c,
    leaveClass: l,
    leaveToClass: u,
    leaveActiveClass: d,
    beforeLeave: p,
    leave: h,
    afterLeave: m,
    leaveCancelled: y,
    delayLeave: g,
    duration: v
  } = i,
      $ = !1 !== a && !W,
      _ = Ir(h),
      b = f(s(v) ? v.leave : v),
      w = r._leaveCb = D(() => {
    r.parentNode && r.parentNode._pending && (r.parentNode._pending[t.key] = null), $ && (Or(r, u), Or(r, d)), w.cancelled ? ($ && Or(r, l), y && y(r)) : (o(), m && m(r)), r._leaveCb = null;
  });

  function C() {
    w.cancelled || (!t.data.show && r.parentNode && ((r.parentNode._pending || (r.parentNode._pending = {}))[t.key] = t), p && p(r), $ && (Ar(r, l), Ar(r, d), kr(() => {
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
      {
    modules: c,
    nodeOps: l
  } = t;

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
    var {
      tag: a,
      data: c,
      children: l
    } = e;
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

    remove(t, e) {
      !0 !== t.data.show ? Lr(t, e) : e();
    }

  } : {}].concat(io)
});

W && document.addEventListener("selectionchange", () => {
  var t = document.activeElement;
  t && t.vmodel && Jr(t, "input");
});
var Rr = {
  inserted(t, e, n, o) {
    "select" === n.tag ? (o.elm && !o.elm._vOptions ? Qt(n, "postpatch", () => {
      Rr.componentUpdated(t, e, n);
    }) : Hr(t, e, n.context), t._vOptions = [].map.call(t.options, zr)) : ("textarea" === n.tag || Kn(t.type)) && (t._vModifiers = e.modifiers, e.modifiers.lazy || (t.addEventListener("compositionstart", Vr), t.addEventListener("compositionend", Kr), t.addEventListener("change", Kr), W && (t.vmodel = !0)));
  },

  componentUpdated(t, e, n) {
    if ("select" === n.tag) {
      Hr(t, e, n.context);

      var _o40 = t._vOptions,
          _r25 = t._vOptions = [].map.call(t.options, zr);

      if (_r25.some((t, e) => !N(t, _o40[e]))) {
        (t.multiple ? e.value.some(t => Ur(t, _r25)) : e.value !== e.oldValue && Ur(e.value, _r25)) && Jr(t, "change");
      }
    }
  }

};

function Hr(t, e, n) {
  Br(t, e), (q || Z) && setTimeout(() => {
    Br(t, e);
  }, 0);
}

function Br(t, e, n) {
  var o = e.value,
      r = t.multiple;
  if (r && !Array.isArray(o)) return;
  var s, i;

  for (var _e40 = 0, _n46 = t.options.length; _e40 < _n46; _e40++) {
    if (i = t.options[_e40], r) s = j(o, zr(i)) > -1, i.selected !== s && (i.selected = s);else if (N(zr(i), o)) return void (t.selectedIndex !== _e40 && (t.selectedIndex = _e40));
  }

  r || (t.selectedIndex = -1);
}

function Ur(t, e) {
  return e.every(e => !N(e, t));
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
    bind(t, _ref, n) {
      var {
        value: e
      } = _ref;
      var o = (n = qr(n)).data && n.data.transition,
          r = t.__vOriginalDisplay = "none" === t.style.display ? "" : t.style.display;
      e && o ? (n.data.show = !0, Dr(n, () => {
        t.style.display = r;
      })) : t.style.display = e ? r : "none";
    },

    update(t, _ref2, o) {
      var {
        value: e,
        oldValue: n
      } = _ref2;
      if (!e == !n) return;
      (o = qr(o)).data && o.data.transition ? (o.data.show = !0, e ? Dr(o, () => {
        t.style.display = t.__vOriginalDisplay;
      }) : Lr(o, () => {
        t.style.display = "none";
      })) : t.style.display = e ? t.__vOriginalDisplay : "none";
    },

    unbind(t, e, n, o, r) {
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

var Qr = t => t.tag || Fe(t),
    ts = t => "show" === t.name;

var es = {
  name: "transition",
  props: Zr,
  abstract: !0,

  render(t) {
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

      if ("out-in" === n) return this._leaving = !0, Qt(_e41, "afterLeave", () => {
        this._leaving = !1, this.$forceUpdate();
      }), Yr(t, o);

      if ("in-out" === n) {
        if (Fe(s)) return c;

        var _t45;

        var _n47 = () => {
          _t45();
        };

        Qt(a, "afterEnter", _n47), Qt(a, "enterCancelled", _n47), Qt(_e41, "delayLeave", e => {
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

    beforeMount() {
      var t = this._update;

      this._update = (e, n) => {
        var o = Ve(this);
        this.__patch__(this._vnode, this.kept, !1, !0), this._vnode = this.kept, o(), t.call(this, e, n);
      };
    },

    render(t) {
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

    updated() {
      var t = this.prevChildren,
          e = this.moveClass || (this.name || "v") + "-move";
      t.length && this.hasMove(t[0].elm, e) && (t.forEach(os), t.forEach(rs), t.forEach(ss), this._reflow = document.body.offsetHeight, t.forEach(t => {
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
      hasMove(t, e) {
        if (!gr) return !1;
        if (this._hasMove) return this._hasMove;
        var n = t.cloneNode();
        t._transitionClasses && t._transitionClasses.forEach(t => {
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
    return t.$el = e, t.$options.render || (t.$options.render = pt), qe(t, "beforeMount"), o = () => {
      t._update(t._render(), n);
    }, new rn(t, o, S, {
      before() {
        t._isMounted && !t._isDestroyed && qe(t, "beforeUpdate");
      }

    }, !0), n = !1, null == t.$vnode && (t._isMounted = !0, qe(t, "mounted")), t;
  }(this, t = t && z ? Jn(t) : void 0, e);
}, z && setTimeout(() => {
  F.devtools && nt && nt.emit("init", yn);
}, 0);
var as = /\{\{((?:.|\r?\n)+?)\}\}/g,
    cs = /[-.*+?^${}()|[\]\/\\]/g,
    ls = v(t => {
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
  decode: t => ((ds = ds || document.createElement("div")).innerHTML = t, ds.textContent)
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
    Ds = (t, e) => t && js(t) && "\n" === e[0];

function Ls(t, e) {
  var n = e ? Ns : Es;
  return t.replace(n, t => Ts[t]);
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
    t.children = t.children.filter(t => !t.slotScope), u(t), t.pre && (a = !1), ti(t.tag) && (c = !1);

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
      if (null == o && (o = c), null == r && (r = c), t) for (i = t.toLowerCase(), s = n.length - 1; s >= 0 && n[s].lowerCasedTag !== i; s--) {
      } else s = 0;

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

    start(t, o, r, u, f) {
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

    end(t, e, o) {
      var r = n[n.length - 1];
      n.length -= 1, i = n[n.length - 1], l(r);
    },

    chars(t, e, n) {
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

    comment(t, e, n) {
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
        var {
          name: _n57,
          dynamic: _o49
        } = ci(_e52);
        t.slotTarget = _n57, t.slotTargetDynamic = _o49, t.slotScope = _e52.value || Ws;
      }
    } else {
      var _e53 = Oo(t, Vs);

      if (_e53) {
        var _n58 = t.scopedSlots || (t.scopedSlots = {}),
            {
          name: _o50,
          dynamic: _r31
        } = ci(_e53),
            _s17 = _n58[_o50] = oi("template", [], t);

        _s17.slotTarget = _o50, _s17.slotTargetDynamic = _r31, _s17.children = t.children.filter(t => {
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
    return e.forEach(e => {
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
            {
          lazy: r,
          number: s,
          trim: i
        } = n || {},
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
  isPreTag: t => "pre" === t,
  isUnaryTag: hs,
  mustUseProp: An,
  canBeLeftOpenTag: ms,
  isReservedTag: Un,
  getTagNamespace: zn,
  staticKeys: function (t) {
    return t.reduce((t, e) => t.concat(e.staticKeys || []), []).join(",");
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
    ki = t => "if(" + t + ")return null;",
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
  if (Array.isArray(t)) return "[" + t.map(t => Si(t)).join(",") + "]";

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
          _s19 += ki(["ctrl", "shift", "alt", "meta"].filter(t => !e[t]).map(t => "$event." + t + "Key").join("||"));
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
    t.wrapListeners = t => "_g(" + t + "," + e.value + ")";
  },
  bind: function bind(t, e) {
    t.wrapData = n => "_b(" + n + ",'" + t.tag + "'," + e.value + "," + (e.modifiers && e.modifiers.prop ? "true" : "false") + (e.modifiers && e.modifiers.sync ? ",true" : "") + ")";
  },
  cloak: S
};

class Ni {
  constructor(t) {
    this.options = t, this.warn = t.warn || go, this.transforms = vo(t.modules, "transformCode"), this.dataGenFns = vo(t.modules, "genData"), this.directives = A(A({}, Ei), t.directives);
    var e = t.isReservedTag || T;
    this.maybeComponent = t => !!t.component || !e(t.tag), this.onceId = 0, this.staticRenderFns = [], this.pre = !1;
  }

}

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
      var s = t.attrs || t.dynamicAttrs ? Vi((t.attrs || []).concat(t.dynamicAttrs || []).map(t => ({
        name: _(t.name),
        value: t.value,
        dynamic: t.dynamic
      }))) : null,
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
    var o = t.for || Object.keys(e).some(t => {
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

    var s = Object.keys(e).map(t => Hi(e[t], n)).join(",");
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

        return "inlineTemplate:{render:function(){" + _t53.render + "},staticRenderFns:[" + _t53.staticRenderFns.map(t => "function(){" + t + "}").join(",") + "]}";
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
          if (Ui(_r39) || _r39.ifConditions && _r39.ifConditions.some(t => Ui(t.block))) {
            n = 2;
            break;
          }

          (e(_r39) || _r39.ifConditions && _r39.ifConditions.some(t => e(t.block))) && (n = 1);
        }
      }

      return n;
    }(s, e.maybeComponent) : 0,
        _a6 = r || zi;

    return "[" + s.map(t => _a6(t, e)).join(",") + "]" + (_i13 ? "," + _i13 : "");
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
    return a.render = Ji(i.render, c), a.staticRenderFns = i.staticRenderFns.map(t => Ji(t, c)), e[s] = a;
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

    o.warn = (t, e, n) => {
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
var {
  compile: Gi,
  compileToFunctions: Xi
} = Wi(mi);
var Yi;

function Qi(t) {
  return (Yi = Yi || document.createElement("div")).innerHTML = t ? '<a href="\n"/>' : '<div a="\n"/>', Yi.innerHTML.indexOf("&#10;") > 0;
}

var ta = !!z && Qi(!1),
    ea = !!z && Qi(!0),
    na = v(t => {
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
      var {
        render: _t56,
        staticRenderFns: _o67
      } = Xi(_e57, {
        outputSourceRange: !1,
        shouldDecodeNewlines: ta,
        shouldDecodeNewlinesForHref: ea,
        delimiters: n.delimiters,
        comments: n.comments
      }, this);
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
var setFocus = (function (topNode, lastNode) {
  var focusable = getFocusMerge(topNode, lastNode);

  if (focusable) {
    if (guardCount > 2) {

      return;
    }

    guardCount++;
    focusOn(focusable.node);
    guardCount--;
  }
});

//

function deferAction(action) {
  const setImmediate = window.setImmediate;
  if (typeof setImmediate !== 'undefined') {
    setImmediate(action);
  } else {
    setTimeout(action, 1);
  }
}

let lastActiveTrap = 0;
let lastActiveFocus = null;

let focusWasOutsideWindow = false;

const focusOnBody = () => (
  document && document.activeElement === document.body
);

const isFreeFocus = () => focusOnBody() || focusIsHidden();

const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const {observed, onActivation} = lastActiveTrap;
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

const reducePropsToState = (propsList) => {
  return propsList
    .filter(({disabled}) => !disabled)
    .slice(-1)[0];
};

const handleStateChangeOnClient = (trap) => {
  if (lastActiveTrap !== trap) {
    lastActiveTrap = null;
  }
  lastActiveTrap = trap;
  if (trap) {
    activateTrap();
    deferAction(activateTrap);
  }
};

let instances = [];

const emitChange = () => {
  handleStateChangeOnClient(reducePropsToState(instances));
};

const onTrap = (event) => {
  if (activateTrap() && event) {
    // prevent scroll jump
    event.stopPropagation();
    event.preventDefault();
  }
};

const onBlur = () => {
  deferAction(activateTrap);
};

const onWindowBlur = () => {
  focusWasOutsideWindow = true;
};

const attachHandler = () => {
  document.addEventListener('focusin', onTrap, true);
  document.addEventListener('focusout', onBlur);
  window.addEventListener('blur', onWindowBlur);
};

const detachHandler = () => {
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
  data() {
    return {
      data: {},
      hidden: ""//    "width: 1px;height: 0px;padding: 0;overflow: hidden;position: fixed;top: 0;left: 0;"
    }
  },
  computed: {
    groupAttr() {
      return {[FOCUS_GROUP]: this.group};
    },
    hasLeadingGuards() {
      return this.noFocusGuards !== true;
    },
    hasTailingGuards() {
      return this.hasLeadingGuards && (this.noFocusGuards !== 'tail');
    }
  },
  watch: {
    disabled() {
      this.data.disabled = this.disabled;
      emitChange();
    }
  },

  methods: {
    onBlur() {
      deferAction(emitChange);
    },
  },

  mounted() {
    this.data.vue = this;
    this.data.observed = this.$el.querySelector("[data-lock]");

    this.data.disabled = this.disabled;
    this.data.onActivation = () => {
      this.originalFocusedElement = this.originalFocusedElement || document && document.activeElement;
    };

    if (!instances.length) {
      attachHandler();
    }
    instances.push(this.data);
    emitChange();
  },

  destroyed() {
    instances = instances.filter(({vue}) => vue !== this);
    if (!instances.length) {
      detachHandler();
    }
    if (
      this.returnFocus &&
      this.originalFocusedElement &&
      this.originalFocusedElement.focus
    ) {
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
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.hasLeadingGuards)?_c('div',{style:(_vm.hidden),attrs:{"tabIndex":_vm.disabled ? -1 : 0}}):_vm._e(),_vm._v(" "),(_vm.hasLeadingGuards)?_c('div',{style:(_vm.hidden),attrs:{"tabIndex":_vm.disabled ? -1 : 1}}):_vm._e(),_vm._v(" "),_c('div',_vm._b({attrs:{"data-lock":""},on:{"focusout":_vm.onBlur}},'div',_vm.groupAttr,false),[_vm._t("default")],2),_vm._v(" "),(_vm.hasTailingGuards)?_c('div',{style:(_vm.hidden),attrs:{"tabIndex":_vm.disabled ? -1 : 0}}):_vm._e()])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

/**
 * Media Event bus - used for communication between joomla and vue
 */

class Event {
  /**
     * Media Event constructor
     */
  constructor() {
    this.vue = new yn();
  }
  /**
     * Fire an event
     * @param event
     * @param data
     */


  fire(event, data) {
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


  listen(event, callback) {
    this.vue.$on(event, callback);
  }

}

// Loading state
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

class Notifications {
  /* Send and success notification */
  // eslint-disable-next-line class-methods-use-this
  success(message, options) {
    // eslint-disable-next-line no-use-before-define
    notifications.notify(message, _extends({
      type: 'message',
      dismiss: true
    }, options));
  }
  /* Send an error notification */
  // eslint-disable-next-line class-methods-use-this


  error(message, options) {
    // eslint-disable-next-line no-use-before-define
    notifications.notify(message, _extends({
      type: 'error',
      dismiss: true
    }, options));
  }
  /* Ask the user a question */
  // eslint-disable-next-line class-methods-use-this


  ask(message) {
    return window.confirm(message);
  }
  /* Send a notification */
  // eslint-disable-next-line class-methods-use-this


  notify(message, options) {
    Joomla.renderMessages({
      [options.type]: [Joomla.JText._(message)]
    });
  }

} // eslint-disable-next-line import/no-mutable-exports,import/prefer-default-export


var notifications = new Notifications();

//

var script$1 = {
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

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-container"},[_c('div',{staticClass:"media-sidebar col-md-2 d-none d-md-block"},_vm._l((_vm.disks),function(disk,index){return _c('media-disk',{key:index,attrs:{"uid":index,"disk":disk}})}),1),_vm._v(" "),_c('div',{staticClass:"col-md-10"},[_c('div',{staticClass:"media-main"},[_c('media-toolbar'),_vm._v(" "),_c('media-browser')],1)]),_vm._v(" "),_c('media-upload'),_vm._v(" "),_c('media-create-folder-modal'),_vm._v(" "),_c('media-preview-modal'),_vm._v(" "),_c('media-rename-modal'),_vm._v(" "),_c('media-share-modal'),_vm._v(" "),_c('media-confirm-delete-modal')],1)};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

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

var script$2 = {
  name: 'MediaDisk',
  // eslint-disable-next-line vue/require-prop-types
  props: ['disk', 'uid'],
  computed: {
    diskId() {
      return `disk-${this.uid + 1}`;
    },
  },
};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-disk"},[_c('h2',{staticClass:"media-disk-name",attrs:{"id":_vm.diskId}},[_vm._v("\n    "+_vm._s(_vm.disk.displayName)+"\n  ")]),_vm._v(" "),_vm._l((_vm.disk.drives),function(drive,index){return _c('media-drive',{key:index,attrs:{"disk-id":_vm.diskId,"counter":index,"drive":drive,"total":_vm.disk.drives.length}})})],2)};
var __vue_staticRenderFns__$2 = [];

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

var navigable = {
  methods: {
    navigateTo(path) {
      this.$store.dispatch('getContents', path);
    }

  }
};

//

var script$3 = {
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

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-drive",on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.onDriveClick()}}},[_c('ul',{staticClass:"media-tree",attrs:{"role":"tree","aria-labelledby":_vm.diskId}},[_c('li',{class:{active: _vm.isActive, 'media-tree-item': true, 'media-drive-name': true},attrs:{"role":"treeitem","aria-level":"1","aria-setsize":_vm.counter,"aria-posinset":1,"tabindex":_vm.getTabindex}},[_c('a',[_c('span',{staticClass:"item-name"},[_vm._v(_vm._s(_vm.drive.displayName))])]),_vm._v(" "),_c('media-tree',{attrs:{"root":_vm.drive.root,"level":2}})],1)])])};
var __vue_staticRenderFns__$3 = [];

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

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

var script$4 = {
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

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"media-tree",attrs:{"role":"group"}},_vm._l((_vm.directories),function(item,index){return _c('media-tree-item',{key:item.path,attrs:{"counter":index,"item":item,"size":_vm.directories.length,"level":_vm.level}})}),1)};
var __vue_staticRenderFns__$4 = [];

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$5 = {
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

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"media-tree-item",class:{active: _vm.isActive},attrs:{"role":"treeitem","aria-level":_vm.level,"aria-setsize":_vm.size,"aria-posinset":_vm.counter,"tabindex":_vm.getTabindex}},[_c('a',{on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.onItemClick()}}},[_c('span',{staticClass:"item-icon"},[_c('span',{class:_vm.iconClass})]),_vm._v(" "),_c('span',{staticClass:"item-name"},[_vm._v(_vm._s(_vm.item.name))])]),_vm._v(" "),_c('transition',{attrs:{"name":"slide-fade"}},[(_vm.hasChildren)?_c('media-tree',{directives:[{name:"show",rawName:"v-show",value:(_vm.isOpen),expression:"isOpen"}],attrs:{"aria-expanded":_vm.isOpen ? 'true' : 'false',"root":_vm.item.path,"level":(_vm.level+1)}}):_vm._e()],1)],1)};
var __vue_staticRenderFns__$5 = [];

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$6 = {
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

/* script */
const __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-toolbar",attrs:{"role":"toolbar","aria-label":_vm.translate('COM_MEDIA_TOOLBAR_LABEL')}},[(_vm.isLoading)?_c('div',{staticClass:"media-loader"}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"media-view-icons"},[_c('a',{staticClass:"media-toolbar-icon media-toolbar-select-all",attrs:{"href":"#","aria-label":_vm.translate('COM_MEDIA_SELECT_ALL')},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.toggleSelectAll()}}},[_c('span',{class:_vm.toggleSelectAllBtnIcon,attrs:{"aria-hidden":"true"}})])]),_vm._v(" "),_c('media-breadcrumb'),_vm._v(" "),_c('div',{staticClass:"media-view-search-input",attrs:{"role":"search"}},[_c('label',{staticClass:"visually-hidden",attrs:{"for":"media_search"}},[_vm._v(_vm._s(_vm.translate('COM_MEDIA_SEARCH')))]),_vm._v(" "),_c('input',{attrs:{"id":"media_search","type":"text","placeholder":_vm.translate('COM_MEDIA_SEARCH')},on:{"input":_vm.changeSearch}})]),_vm._v(" "),_c('div',{staticClass:"media-view-icons"},[(_vm.isGridView)?_c('button',{staticClass:"media-toolbar-icon media-toolbar-decrease-grid-size",class:{disabled: _vm.isGridSize('sm')},attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_DECREASE_GRID')},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.decreaseGridSize()}}},[_c('span',{staticClass:"icon-search-minus",attrs:{"aria-hidden":"true"}})]):_vm._e(),_vm._v(" "),(_vm.isGridView)?_c('button',{staticClass:"media-toolbar-icon media-toolbar-increase-grid-size",class:{disabled: _vm.isGridSize('xl')},attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_INCREASE_GRID')},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.increaseGridSize()}}},[_c('span',{staticClass:"icon-search-plus",attrs:{"aria-hidden":"true"}})]):_vm._e(),_vm._v(" "),_c('button',{staticClass:"media-toolbar-icon media-toolbar-list-view",attrs:{"type":"button","href":"#","aria-label":_vm.translate('COM_MEDIA_TOGGLE_LIST_VIEW')},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.changeListView()}}},[_c('span',{class:_vm.toggleListViewBtnIcon,attrs:{"aria-hidden":"true"}})]),_vm._v(" "),_c('button',{staticClass:"media-toolbar-icon media-toolbar-info",attrs:{"type":"button","href":"#","aria-label":_vm.translate('COM_MEDIA_TOGGLE_INFO')},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.toggleInfoBar($event)}}},[_c('span',{staticClass:"icon-info",attrs:{"aria-hidden":"true"}})])])],1)};
var __vue_staticRenderFns__$6 = [];

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$7 = {
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

/* script */
const __vue_script__$7 = script$7;

/* template */
var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('nav',{staticClass:"media-breadcrumb",attrs:{"role":"navigation","aria-label":_vm.translate('COM_MEDIA_BREADCRUMB_LABEL')}},[_c('ol',_vm._l((_vm.crumbs),function(val,index){return _c('li',{key:index,staticClass:"media-breadcrumb-item"},[_c('a',{attrs:{"href":"#","aria-current":(index === Object.keys(_vm.crumbs).length - 1) ? 'page' : undefined},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.onCrumbClick(val)}}},[_vm._v(_vm._s(val.name))])])}),0)])};
var __vue_staticRenderFns__$7 = [];

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$7 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$8 = {
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

/* script */
const __vue_script__$8 = script$8;

/* template */
var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{ref:"browserItems",staticClass:"media-browser",style:(_vm.mediaBrowserStyles),on:{"dragenter":_vm.onDragEnter,"drop":_vm.onDrop,"dragover":_vm.onDragOver,"dragleave":_vm.onDragLeave}},[_c('div',{staticClass:"media-dragoutline"},[_c('span',{staticClass:"icon-cloud-upload upload-icon",attrs:{"aria-hidden":"true"}}),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_DROP_FILE')))])]),_vm._v(" "),(_vm.listView === 'table')?_c('table',{staticClass:"table media-browser-table"},[_c('caption',{staticClass:"visually-hidden"},[_vm._v("\n        "+_vm._s(_vm.sprintf('COM_MEDIA_BROWSER_TABLE_CAPTION', _vm.currentDirectory))+"\n      ")]),_vm._v(" "),_c('thead',{staticClass:"media-browser-table-head"},[_c('tr',[_c('th',{staticClass:"type",attrs:{"scope":"col"}}),_vm._v(" "),_c('th',{staticClass:"name",attrs:{"scope":"col"}},[_vm._v("\n            "+_vm._s(_vm.translate('COM_MEDIA_MEDIA_NAME'))+"\n          ")]),_vm._v(" "),_c('th',{staticClass:"size",attrs:{"scope":"col"}},[_vm._v("\n            "+_vm._s(_vm.translate('COM_MEDIA_MEDIA_SIZE'))+"\n          ")]),_vm._v(" "),_c('th',{staticClass:"dimension",attrs:{"scope":"col"}},[_vm._v("\n            "+_vm._s(_vm.translate('COM_MEDIA_MEDIA_DIMENSION'))+"\n          ")]),_vm._v(" "),_c('th',{staticClass:"created",attrs:{"scope":"col"}},[_vm._v("\n            "+_vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_CREATED'))+"\n          ")]),_vm._v(" "),_c('th',{staticClass:"modified",attrs:{"scope":"col"}},[_vm._v("\n            "+_vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_MODIFIED'))+"\n          ")])])]),_vm._v(" "),_c('tbody',_vm._l((_vm.items),function(item){return _c('media-browser-item-row',{key:item.path,attrs:{"item":item}})}),1)]):(_vm.listView === 'grid')?_c('div',{staticClass:"media-browser-grid"},[_c('div',{staticClass:"media-browser-items",class:_vm.mediaBrowserGridItemsClass},_vm._l((_vm.items),function(item){return _c('media-browser-item',{key:item.path,attrs:{"item":item}})}),1)]):_vm._e()]),_vm._v(" "),_c('media-infobar',{ref:"infobar"})],1)};
var __vue_staticRenderFns__$8 = [];

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$8 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$9 = {
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

/* script */
const __vue_script__$9 = script$9;

/* template */
var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-browser-item-directory",on:{"mouseleave":function($event){return _vm.hideActions()}}},[_c('div',{staticClass:"media-browser-item-preview",on:{"dblclick":function($event){$event.stopPropagation();$event.preventDefault();return _vm.onPreviewDblClick()}}},[_vm._m(0)]),_vm._v(" "),_c('div',{staticClass:"media-browser-item-info"},[_vm._v("\n    "+_vm._s(_vm.item.name)+"\n  ")]),_vm._v(" "),_c('span',{staticClass:"media-browser-select",attrs:{"aria-label":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),"title":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')}}),_vm._v(" "),_c('div',{staticClass:"media-browser-actions",class:{'active': _vm.showActions}},[_c('button',{ref:"actionToggle",staticClass:"action-toggle",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),"title":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.openLastActions()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-ellipsis-h",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openActions()}}})]),_vm._v(" "),(_vm.showActions)?_c('div',{staticClass:"media-browser-actions-list"},[_c('ul',[_c('li',[_c('button',{ref:"actionRename",staticClass:"action-rename",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_RENAME'),"title":_vm.translate('COM_MEDIA_ACTION_RENAME')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDelete.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDelete.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-text-width",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openRenameModal()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionDelete",staticClass:"action-delete",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DELETE'),"title":_vm.translate('COM_MEDIA_ACTION_DELETE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionRename.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionRename.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-trash",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openConfirmDeleteModal()}}})])])])]):_vm._e()])])};
var __vue_staticRenderFns__$9 = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"file-background"},[_c('div',{staticClass:"folder-icon"},[_c('span',{staticClass:"icon-folder"})])])}];

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$9 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$a = {
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

/* script */
const __vue_script__$a = script$a;

/* template */
var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-browser-item-file",on:{"mouseleave":function($event){return _vm.hideActions()}}},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"media-browser-item-info"},[_vm._v("\n    "+_vm._s(_vm.item.name)+" "+_vm._s(_vm.item.filetype)+"\n  ")]),_vm._v(" "),_c('span',{staticClass:"media-browser-select",attrs:{"aria-label":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),"title":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')}}),_vm._v(" "),_c('div',{staticClass:"media-browser-actions",class:{'active': _vm.showActions}},[_c('button',{ref:"actionToggle",staticClass:"action-toggle",attrs:{"href":"#","type":"button","aria-label":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),"title":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.openLastActions()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-ellipsis-h",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openActions()}}})]),_vm._v(" "),(_vm.showActions)?_c('div',{staticClass:"media-browser-actions-list"},[_c('ul',[_c('li',[_c('button',{ref:"actionDownload",staticClass:"action-download",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DOWNLOAD'),"title":_vm.translate('COM_MEDIA_ACTION_DOWNLOAD')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.download()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.download()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDelete.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionRename.focus()}]}},[_c('span',{staticClass:"image-browser-action icon-download",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.download()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionRename",staticClass:"action-rename",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_RENAME'),"title":_vm.translate('COM_MEDIA_ACTION_RENAME')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDownload.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionUrl.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-text-width",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openRenameModal()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionUrl",staticClass:"action-url",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_SHARE'),"title":_vm.translate('COM_MEDIA_ACTION_SHARE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openShareUrlModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openShareUrlModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionRename.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDelete.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-link",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openShareUrlModal()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionDelete",staticClass:"action-delete",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DELETE'),"title":_vm.translate('COM_MEDIA_ACTION_DELETE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionUrl.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDownload.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-trash",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openConfirmDeleteModal()}}})])])])]):_vm._e()])])};
var __vue_staticRenderFns__$a = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-browser-item-preview"},[_c('div',{staticClass:"file-background"},[_c('div',{staticClass:"file-icon"},[_c('span',{staticClass:"icon-file-alt"})])])])}];

  /* style */
  const __vue_inject_styles__$a = undefined;
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$a = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$b = {
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

/* script */
const __vue_script__$b = script$b;

/* template */
var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-browser-image",on:{"dblclick":function($event){return _vm.openPreview()},"mouseleave":function($event){return _vm.hideActions()}}},[_c('div',{staticClass:"media-browser-item-preview"},[_c('div',{staticClass:"image-background"},[_c('div',{staticClass:"image-cropped",style:({ backgroundImage: 'url(' + _vm.thumbUrl + ')' })})])]),_vm._v(" "),_c('div',{staticClass:"media-browser-item-info"},[_vm._v("\n    "+_vm._s(_vm.item.name)+" "+_vm._s(_vm.item.filetype)+"\n  ")]),_vm._v(" "),_c('span',{staticClass:"media-browser-select",attrs:{"aria-label":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),"title":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')}}),_vm._v(" "),_c('div',{staticClass:"media-browser-actions",class:{'active': _vm.showActions}},[_c('button',{ref:"actionToggle",staticClass:"action-toggle",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),"title":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.openLastActions()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-ellipsis-h",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openActions()}}})]),_vm._v(" "),(_vm.showActions)?_c('div',{staticClass:"media-browser-actions-list"},[_c('ul',[_c('li',[_c('button',{ref:"actionPreview",staticClass:"action-preview",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_PREVIEW'),"title":_vm.translate('COM_MEDIA_ACTION_PREVIEW')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openPreview()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openPreview()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDelete.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDownload.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-search-plus",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openPreview()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionDownload",staticClass:"action-download",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DOWNLOAD'),"title":_vm.translate('COM_MEDIA_ACTION_DOWNLOAD')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.download()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.download()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionPreview.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionRename.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-download",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.download()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionRename",staticClass:"action-rename",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_RENAME'),"title":_vm.translate('COM_MEDIA_ACTION_RENAME')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDownload.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }_vm.canEdit ? _vm.$refs.actionEdit.focus() : _vm.$refs.actionShare.focus();}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-text-width",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openRenameModal()}}})])]),_vm._v(" "),(_vm.canEdit)?_c('li',[_c('button',{ref:"actionEdit",staticClass:"action-edit",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_EDIT'),"title":_vm.translate('COM_MEDIA_ACTION_EDIT')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.editItem()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.editItem()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionRename.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionShare.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-pencil-alt",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.editItem()}}})])]):_vm._e(),_vm._v(" "),_c('li',[_c('button',{ref:"actionShare",staticClass:"action-url",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_SHARE'),"title":_vm.translate('COM_MEDIA_ACTION_SHARE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openShareUrlModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openShareUrlModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }_vm.canEdit ? _vm.$refs.actionEdit.focus() : _vm.$refs.actionRename.focus();},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDelete.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-link",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openShareUrlModal()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionDelete",staticClass:"action-delete",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DELETE'),"title":_vm.translate('COM_MEDIA_ACTION_DELETE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionShare.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionPreview.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-trash",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openConfirmDeleteModal()}}})])])])]):_vm._e()])])};
var __vue_staticRenderFns__$b = [];

  /* style */
  const __vue_inject_styles__$b = undefined;
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$b = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$c = {
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

/* script */
const __vue_script__$c = script$c;

/* template */
var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-browser-image",on:{"dblclick":function($event){return _vm.openPreview()},"mouseleave":function($event){return _vm.hideActions()}}},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"media-browser-item-info"},[_vm._v("\n    "+_vm._s(_vm.item.name)+" "+_vm._s(_vm.item.filetype)+"\n  ")]),_vm._v(" "),_c('span',{staticClass:"media-browser-select",attrs:{"aria-label":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM'),"title":_vm.translate('COM_MEDIA_TOGGLE_SELECT_ITEM')}}),_vm._v(" "),_c('div',{staticClass:"media-browser-actions",class:{'active': _vm.showActions}},[_c('button',{ref:"actionToggle",staticClass:"action-toggle",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS'),"title":_vm.translate('COM_MEDIA_OPEN_ITEM_ACTIONS')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.openActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.openLastActions()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-ellipsis-h",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openActions()}}})]),_vm._v(" "),(_vm.showActions)?_c('div',{staticClass:"media-browser-actions-list"},[_c('ul',[_c('li',[_c('button',{ref:"actionPreview",staticClass:"action-preview",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_PREVIEW'),"title":_vm.translate('COM_MEDIA_ACTION_PREVIEW')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openPreview()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openPreview()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDelete.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDownload.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-search-plus",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openPreview()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionDownload",staticClass:"action-download",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DOWNLOAD'),"title":_vm.translate('COM_MEDIA_ACTION_DOWNLOAD')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.download()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.download()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionPreview.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionRename.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-download",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.download()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionRename",staticClass:"action-rename",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_RENAME'),"title":_vm.translate('COM_MEDIA_ACTION_RENAME')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openRenameModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionDownload.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionShare.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-text-width",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openRenameModal()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionShare",staticClass:"action-url",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_SHARE'),"title":_vm.translate('COM_MEDIA_ACTION_SHARE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openShareUrlModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openShareUrlModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionRename.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionDelete.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-link",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openShareUrlModal()}}})])]),_vm._v(" "),_c('li',[_c('button',{ref:"actionDelete",staticClass:"action-delete",attrs:{"type":"button","aria-label":_vm.translate('COM_MEDIA_ACTION_DELETE'),"title":_vm.translate('COM_MEDIA_ACTION_DELETE')},on:{"keyup":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }return _vm.openConfirmDeleteModal()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.hideActions()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.$refs.actionShare.focus()},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.$refs.actionPreview.focus()}],"focus":function($event){return _vm.focused(true)},"blur":function($event){return _vm.focused(false)}}},[_c('span',{staticClass:"image-browser-action icon-trash",attrs:{"aria-hidden":"true"},on:{"click":function($event){$event.stopPropagation();return _vm.openConfirmDeleteModal()}}})])])])]):_vm._e()])])};
var __vue_staticRenderFns__$c = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-browser-item-preview"},[_c('div',{staticClass:"file-background"},[_c('div',{staticClass:"file-icon"},[_c('span',{staticClass:"icon-file-alt"})])])])}];

  /* style */
  const __vue_inject_styles__$c = undefined;
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$c = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    false,
    undefined,
    undefined,
    undefined
  );

var dirname = path => {
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

class Api {
  /**
     * Store constructor
     */
  constructor() {
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


      var url = this._baseUrl + "&task=api.files&path=" + dir;

      if (full) {
        url += "&url=" + full;
      }

      if (content) {
        url += "&content=" + content;
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
      var url = this._baseUrl + "&task=api.files&path=" + parent; // eslint-disable-next-line no-underscore-dangle

      var data = {
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
      var url = this._baseUrl + "&task=api.files&path=" + parent;
      var data = {
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
      var url = this._baseUrl + "&task=api.files&path=" + path;
      var data = {
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
      var url = this._baseUrl + "&task=api.files&path=" + path; // eslint-disable-next-line no-underscore-dangle

      var data = {
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
    var directories = data.filter(item => item.type === 'dir') // eslint-disable-next-line no-underscore-dangle
    .map(directory => this._normalizeItem(directory));
    var files = data.filter(item => item.type === 'file') // eslint-disable-next-line no-underscore-dangle
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
  }

} // eslint-disable-next-line import/prefer-default-export


var api = new Api();

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
    styles() {
      return {
        width: "calc(" + this.$store.state.gridSize + "% - 20px)"
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

  render(createElement) {
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

};

//

var script$d = {
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
        && !extensionWithPreview.includes(this.item.extension.toLowerCase())) {
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

/* script */
const __vue_script__$d = script$d;

/* template */
var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('tr',{staticClass:"media-browser-item",class:{selected: _vm.selected},on:{"dblclick":function($event){$event.stopPropagation();$event.preventDefault();return _vm.onDblClick()},"click":_vm.onClick}},[_c('td',{staticClass:"type",attrs:{"data-type":_vm.item.extension}}),_vm._v(" "),_c('th',{staticClass:"name",attrs:{"scope":"row"}},[_vm._v("\n    "+_vm._s(_vm.item.name)+"\n  ")]),_vm._v(" "),_c('td',{staticClass:"size"},[_vm._v("\n    "+_vm._s(_vm.size)+"\n  ")]),_vm._v(" "),_c('td',{staticClass:"dimension"},[_vm._v("\n    "+_vm._s(_vm.dimension)+"\n  ")]),_vm._v(" "),_c('td',{staticClass:"created"},[_vm._v("\n    "+_vm._s(_vm.item.create_date_formatted)+"\n  ")]),_vm._v(" "),_c('td',{staticClass:"modified"},[_vm._v("\n    "+_vm._s(_vm.item.modified_date_formatted)+"\n  ")])])};
var __vue_staticRenderFns__$d = [];

  /* style */
  const __vue_inject_styles__$d = undefined;
  /* scoped */
  const __vue_scope_id__$d = undefined;
  /* module identifier */
  const __vue_module_identifier__$d = undefined;
  /* functional template */
  const __vue_is_functional_template__$d = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$d = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d,
    __vue_scope_id__$d,
    __vue_is_functional_template__$d,
    __vue_module_identifier__$d,
    false,
    undefined,
    undefined,
    undefined
  );

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
//

var script$e = {
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

/* script */
const __vue_script__$e = script$e;

/* template */
var __vue_render__$e = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"media-modal-backdrop",on:{"click":function($event){return _vm.close()}}},[_c('div',{staticClass:"modal",staticStyle:{"display":"flex"},on:{"click":function($event){$event.stopPropagation();}}},[_c('tab-lock',[_c('div',{staticClass:"modal-dialog",class:_vm.modalClass,attrs:{"role":"dialog","aria-labelledby":_vm.labelElement}},[_c('div',{staticClass:"modal-content"},[_c('div',{staticClass:"modal-header"},[_vm._t("header"),_vm._v(" "),_vm._t("backdrop-close"),_vm._v(" "),(_vm.showClose)?_c('button',{staticClass:"btn-close",attrs:{"type":"button","aria-label":"Close"},on:{"click":function($event){return _vm.close()}}}):_vm._e()],2),_vm._v(" "),_c('div',{staticClass:"modal-body"},[_vm._t("body")],2),_vm._v(" "),_c('div',{staticClass:"modal-footer"},[_vm._t("footer")],2)])])])],1)])};
var __vue_staticRenderFns__$e = [];

  /* style */
  const __vue_inject_styles__$e = undefined;
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$e = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$f = {
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

/* script */
const __vue_script__$f = script$f;

/* template */
var __vue_render__$f = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$store.state.showCreateFolderModal)?_c('media-modal',{attrs:{"size":'md',"label-element":"createFolderTitle"},on:{"close":function($event){return _vm.close()}},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('h3',{staticClass:"modal-title",attrs:{"id":"createFolderTitle"}},[_vm._v("\n      "+_vm._s(_vm.translate('COM_MEDIA_CREATE_NEW_FOLDER'))+"\n    ")])]},proxy:true},{key:"body",fn:function(){return [_c('div',[_c('form',{staticClass:"form",attrs:{"novalidate":""},on:{"submit":function($event){$event.preventDefault();return _vm.save($event)}}},[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"folder"}},[_vm._v(_vm._s(_vm.translate('COM_MEDIA_FOLDER_NAME')))]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.trim",value:(_vm.folder),expression:"folder",modifiers:{"trim":true}}],staticClass:"form-control",attrs:{"id":"folder","type":"text","required":"","autocomplete":"off"},domProps:{"value":(_vm.folder)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.folder=$event.target.value.trim();},function($event){_vm.folder = $event.target.value;}],"blur":function($event){return _vm.$forceUpdate()}}})])])])]},proxy:true},{key:"footer",fn:function(){return [_c('div',[_c('button',{staticClass:"btn btn-secondary",on:{"click":function($event){return _vm.close()}}},[_vm._v("\n        "+_vm._s(_vm.translate('JCANCEL'))+"\n      ")]),_vm._v(" "),_c('button',{staticClass:"btn btn-success",attrs:{"disabled":!_vm.isValid()},on:{"click":function($event){return _vm.save()}}},[_vm._v("\n        "+_vm._s(_vm.translate('JACTION_CREATE'))+"\n      ")])])]},proxy:true}],null,false,878963060)}):_vm._e()};
var __vue_staticRenderFns__$f = [];

  /* style */
  const __vue_inject_styles__$f = undefined;
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$f = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$g = {
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

/* script */
const __vue_script__$g = script$g;

/* template */
var __vue_render__$g = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$store.state.showPreviewModal && _vm.item)?_c('media-modal',{staticClass:"media-preview-modal",attrs:{"size":'md',"label-element":"previewTitle","show-close":false},on:{"close":function($event){return _vm.close()}},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('h3',{staticClass:"modal-title",attrs:{"id":"previewTitle"}},[_vm._v("\n      "+_vm._s(_vm.item.name)+"\n    ")])]},proxy:true},{key:"body",fn:function(){return [_c('div',{staticClass:"image-background"},[(_vm.isImage())?_c('img',{attrs:{"src":_vm.item.url,"type":_vm.item.mime_type}}):_vm._e(),_vm._v(" "),(_vm.isVideo())?_c('video',{attrs:{"controls":""}},[_c('source',{attrs:{"src":_vm.item.url,"type":_vm.item.mime_type}})]):_vm._e()])]},proxy:true},{key:"backdrop-close",fn:function(){return [_c('button',{staticClass:"media-preview-close",attrs:{"type":"button"},on:{"click":function($event){return _vm.close()}}},[_c('span',{staticClass:"icon-times"})])]},proxy:true}],null,false,2848818578)}):_vm._e()};
var __vue_staticRenderFns__$g = [];

  /* style */
  const __vue_inject_styles__$g = undefined;
  /* scoped */
  const __vue_scope_id__$g = undefined;
  /* module identifier */
  const __vue_module_identifier__$g = undefined;
  /* functional template */
  const __vue_is_functional_template__$g = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$g = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
    __vue_inject_styles__$g,
    __vue_script__$g,
    __vue_scope_id__$g,
    __vue_is_functional_template__$g,
    __vue_module_identifier__$g,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$h = {
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

/* script */
const __vue_script__$h = script$h;

/* template */
var __vue_render__$h = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$store.state.showRenameModal)?_c('media-modal',{attrs:{"size":'sm',"show-close":false,"label-element":"renameTitle"},on:{"close":function($event){return _vm.close()}},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('h3',{staticClass:"modal-title",attrs:{"id":"renameTitle"}},[_vm._v("\n      "+_vm._s(_vm.translate('COM_MEDIA_RENAME'))+"\n    ")])]},proxy:true},{key:"body",fn:function(){return [_c('div',[_c('form',{staticClass:"form",attrs:{"novalidate":""},on:{"submit":function($event){$event.preventDefault();return _vm.save($event)}}},[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"name"}},[_vm._v(_vm._s(_vm.translate('COM_MEDIA_NAME')))]),_vm._v(" "),_c('div',{class:{'input-group': _vm.extension.length}},[_c('input',{ref:"nameField",staticClass:"form-control",attrs:{"id":"name","type":"text","placeholder":_vm.translate('COM_MEDIA_NAME'),"required":"","autocomplete":"off"},domProps:{"value":_vm.name}}),_vm._v(" "),(_vm.extension.length)?_c('span',{staticClass:"input-group-text"},[_vm._v("\n              "+_vm._s(_vm.extension)+"\n            ")]):_vm._e()])])])])]},proxy:true},{key:"footer",fn:function(){return [_c('div',[_c('button',{staticClass:"btn btn-secondary",attrs:{"type":"button"},on:{"click":function($event){return _vm.close()},"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.close()}}},[_vm._v("\n        "+_vm._s(_vm.translate('JCANCEL'))+"\n      ")]),_vm._v(" "),_c('button',{staticClass:"btn btn-success",attrs:{"type":"button","disabled":!_vm.isValid()},on:{"click":function($event){return _vm.save()},"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.save()}}},[_vm._v("\n        "+_vm._s(_vm.translate('JAPPLY'))+"\n      ")])])]},proxy:true}],null,false,590611486)}):_vm._e()};
var __vue_staticRenderFns__$h = [];

  /* style */
  const __vue_inject_styles__$h = undefined;
  /* scoped */
  const __vue_scope_id__$h = undefined;
  /* module identifier */
  const __vue_module_identifier__$h = undefined;
  /* functional template */
  const __vue_is_functional_template__$h = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$h = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
    __vue_inject_styles__$h,
    __vue_script__$h,
    __vue_scope_id__$h,
    __vue_is_functional_template__$h,
    __vue_module_identifier__$h,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$i = {
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

/* script */
const __vue_script__$i = script$i;

/* template */
var __vue_render__$i = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$store.state.showShareModal)?_c('media-modal',{attrs:{"size":'md',"show-close":false,"label-element":"shareTitle"},on:{"close":function($event){return _vm.close()}},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('h3',{staticClass:"modal-title",attrs:{"id":"shareTitle"}},[_vm._v("\n      "+_vm._s(_vm.translate('COM_MEDIA_SHARE'))+"\n    ")])]},proxy:true},{key:"body",fn:function(){return [_c('div',[_c('div',{staticClass:"desc"},[_vm._v("\n        "+_vm._s(_vm.translate('COM_MEDIA_SHARE_DESC'))+"\n\n        "),(!_vm.url)?[_c('div',{staticClass:"control"},[_c('button',{staticClass:"btn btn-success w-100",attrs:{"type":"button"},on:{"click":_vm.generateUrl}},[_vm._v("\n              "+_vm._s(_vm.translate('COM_MEDIA_ACTION_SHARE'))+"\n            ")])])]:[_c('div',{staticClass:"control"},[_c('span',{staticClass:"input-group"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.url),expression:"url"}],ref:"urlText",staticClass:"form-control input-xxlarge",attrs:{"id":"url","readonly":"","type":"url","placeholder":"URL","autocomplete":"off"},domProps:{"value":(_vm.url)},on:{"input":function($event){if($event.target.composing){ return; }_vm.url=$event.target.value;}}}),_vm._v(" "),_c('button',{staticClass:"btn btn-secondary",attrs:{"type":"button","title":_vm.translate('COM_MEDIA_SHARE_COPY')},on:{"click":_vm.copyToClipboard}},[_c('span',{staticClass:"icon-clipboard",attrs:{"aria-hidden":"true"}})])])])]],2)])]},proxy:true},{key:"footer",fn:function(){return [_c('div',[_c('button',{staticClass:"btn btn-secondary",on:{"click":function($event){return _vm.close()}}},[_vm._v("\n        "+_vm._s(_vm.translate('JCANCEL'))+"\n      ")])])]},proxy:true}],null,false,299814870)}):_vm._e()};
var __vue_staticRenderFns__$i = [];

  /* style */
  const __vue_inject_styles__$i = undefined;
  /* scoped */
  const __vue_scope_id__$i = undefined;
  /* module identifier */
  const __vue_module_identifier__$i = undefined;
  /* functional template */
  const __vue_is_functional_template__$i = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$i = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
    __vue_inject_styles__$i,
    __vue_script__$i,
    __vue_scope_id__$i,
    __vue_is_functional_template__$i,
    __vue_module_identifier__$i,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$j = {
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

/* script */
const __vue_script__$j = script$j;

/* template */
var __vue_render__$j = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$store.state.showConfirmDeleteModal)?_c('media-modal',{attrs:{"size":'md',"show-close":false,"label-element":"confirmDeleteTitle"},on:{"close":function($event){return _vm.close()}},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('h3',{staticClass:"modal-title",attrs:{"id":"confirmDeleteTitle"}},[_vm._v("\n      "+_vm._s(_vm.translate('COM_MEDIA_CONFIRM_DELETE_MODAL_HEADING'))+"\n    ")])]},proxy:true},{key:"body",fn:function(){return [_c('div',[_c('div',{staticClass:"desc"},[_vm._v("\n        "+_vm._s(_vm.translate('JGLOBAL_CONFIRM_DELETE'))+"\n      ")])])]},proxy:true},{key:"footer",fn:function(){return [_c('div',[_c('button',{staticClass:"btn btn-danger",attrs:{"id":"media-delete-item"},on:{"click":function($event){return _vm.deleteItem()}}},[_vm._v("\n        "+_vm._s(_vm.translate('COM_MEDIA_CONFIRM_DELETE_MODAL'))+"\n      ")]),_vm._v(" "),_c('button',{staticClass:"btn btn-success",on:{"click":function($event){return _vm.close()}}},[_vm._v("\n        "+_vm._s(_vm.translate('JCANCEL'))+"\n      ")])])]},proxy:true}],null,false,4082513040)}):_vm._e()};
var __vue_staticRenderFns__$j = [];

  /* style */
  const __vue_inject_styles__$j = undefined;
  /* scoped */
  const __vue_scope_id__$j = undefined;
  /* module identifier */
  const __vue_module_identifier__$j = undefined;
  /* functional template */
  const __vue_is_functional_template__$j = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$j = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
    __vue_inject_styles__$j,
    __vue_script__$j,
    __vue_scope_id__$j,
    __vue_is_functional_template__$j,
    __vue_module_identifier__$j,
    false,
    undefined,
    undefined,
    undefined
  );

//

var script$k = {
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

/* script */
const __vue_script__$k = script$k;

/* template */
var __vue_render__$k = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"infobar"}},[(_vm.showInfoBar && _vm.item)?_c('div',{staticClass:"media-infobar"},[_c('span',{staticClass:"infobar-close",on:{"click":function($event){return _vm.hideInfoBar()}}},[_vm._v("×")]),_vm._v(" "),_c('h2',[_vm._v(_vm._s(_vm.item.name))]),_vm._v(" "),(_vm.item.path === '/')?_c('div',{staticClass:"text-center"},[_c('span',{staticClass:"icon-file placeholder-icon"}),_vm._v("\n      Select file or folder to view its details.\n    ")]):_c('dl',[_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_FOLDER')))]),_vm._v(" "),_c('dd',[_vm._v(_vm._s(_vm.item.directory))]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_TYPE')))]),_vm._v(" "),(_vm.item.type === 'file')?_c('dd',[_vm._v("\n        "+_vm._s(_vm.translate('COM_MEDIA_FILE'))+"\n      ")]):(_vm.item.type === 'dir')?_c('dd',[_vm._v("\n        "+_vm._s(_vm.translate('COM_MEDIA_FOLDER'))+"\n      ")]):_c('dd',[_vm._v("\n        -\n      ")]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_CREATED')))]),_vm._v(" "),_c('dd',[_vm._v(_vm._s(_vm.item.create_date_formatted))]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_DATE_MODIFIED')))]),_vm._v(" "),_c('dd',[_vm._v(_vm._s(_vm.item.modified_date_formatted))]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_DIMENSION')))]),_vm._v(" "),(_vm.item.width || _vm.item.height)?_c('dd',[_vm._v("\n        "+_vm._s(_vm.item.width)+"px * "+_vm._s(_vm.item.height)+"px\n      ")]):_c('dd',[_vm._v("\n        -\n      ")]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_SIZE')))]),_vm._v(" "),(_vm.item.size)?_c('dd',[_vm._v("\n        "+_vm._s((_vm.item.size / 1024).toFixed(2))+" KB\n      ")]):_c('dd',[_vm._v("\n        -\n      ")]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_MIME_TYPE')))]),_vm._v(" "),_c('dd',[_vm._v(_vm._s(_vm.item.mime_type))]),_vm._v(" "),_c('dt',[_vm._v(_vm._s(_vm.translate('COM_MEDIA_MEDIA_EXTENSION')))]),_vm._v(" "),_c('dd',[_vm._v(_vm._s(_vm.item.extension || '-'))])])]):_vm._e()])};
var __vue_staticRenderFns__$k = [];

  /* style */
  const __vue_inject_styles__$k = undefined;
  /* scoped */
  const __vue_scope_id__$k = undefined;
  /* module identifier */
  const __vue_module_identifier__$k = undefined;
  /* functional template */
  const __vue_is_functional_template__$k = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$k = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
    __vue_inject_styles__$k,
    __vue_script__$k,
    __vue_scope_id__$k,
    __vue_is_functional_template__$k,
    __vue_module_identifier__$k,
    false,
    undefined,
    undefined,
    undefined
  );

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

var script$l = {
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

/* script */
const __vue_script__$l = script$l;

/* template */
var __vue_render__$l = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('input',{ref:"fileInput",staticClass:"hidden",attrs:{"type":"file","name":_vm.name,"multiple":_vm.multiple,"accept":_vm.accept},on:{"change":_vm.upload}})};
var __vue_staticRenderFns__$l = [];

  /* style */
  const __vue_inject_styles__$l = undefined;
  /* scoped */
  const __vue_scope_id__$l = undefined;
  /* module identifier */
  const __vue_module_identifier__$l = undefined;
  /* functional template */
  const __vue_is_functional_template__$l = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$l = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
    __vue_inject_styles__$l,
    __vue_script__$l,
    __vue_scope_id__$l,
    __vue_is_functional_template__$l,
    __vue_module_identifier__$l,
    false,
    undefined,
    undefined,
    undefined
  );

/**
 * Translate plugin
 */
var Translate = {
  // Translate from Joomla text
  translate: key => Joomla.JText._(key, key),
  sprintf: function sprintf(string) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // eslint-disable-next-line no-param-reassign
    string = Translate.translate(string);
    var i = 0;
    return string.replace(/%((%)|s|d)/g, m => {
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
  install: Vue => Vue.mixin({
    methods: {
      translate(key) {
        return Translate.translate(key);
      },

      sprintf(key) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return Translate.sprintf(key, args);
      }

    }
  })
};

/*!
 * vuex v3.6.2
 * (c) 2021 Evan You
 * @license MIT
 */
var t$1 = ("undefined" != typeof window ? window : "undefined" != typeof global ? global : {}).__VUE_DEVTOOLS_GLOBAL_HOOK__;

function e$1(t, s) {
  if (s === void 0) {
    s = [];
  }

  if (null === t || "object" != typeof t) return t;
  var o = (i = e => e.original === t, s.filter(i)[0]);
  var i;
  if (o) return o.copy;
  var n = Array.isArray(t) ? [] : {};
  return s.push({
    original: t,
    copy: n
  }), Object.keys(t).forEach(o => {
    n[o] = e$1(t[o], s);
  }), n;
}

function s$1(t, e) {
  Object.keys(t).forEach(s => e(t[s], s));
}

function o$1(t) {
  return null !== t && "object" == typeof t;
}

class i$1 {
  constructor(t, e) {
    this.runtime = e, this._children = Object.create(null), this._rawModule = t;
    var s = t.state;
    this.state = ("function" == typeof s ? s() : s) || {};
  }

  get namespaced() {
    return !!this._rawModule.namespaced;
  }

  addChild(t, e) {
    this._children[t] = e;
  }

  removeChild(t) {
    delete this._children[t];
  }

  getChild(t) {
    return this._children[t];
  }

  hasChild(t) {
    return t in this._children;
  }

  update(t) {
    this._rawModule.namespaced = t.namespaced, t.actions && (this._rawModule.actions = t.actions), t.mutations && (this._rawModule.mutations = t.mutations), t.getters && (this._rawModule.getters = t.getters);
  }

  forEachChild(t) {
    s$1(this._children, t);
  }

  forEachGetter(t) {
    this._rawModule.getters && s$1(this._rawModule.getters, t);
  }

  forEachAction(t) {
    this._rawModule.actions && s$1(this._rawModule.actions, t);
  }

  forEachMutation(t) {
    this._rawModule.mutations && s$1(this._rawModule.mutations, t);
  }

}

class n$1 {
  constructor(t) {
    this.register([], t, !1);
  }

  get(t) {
    return t.reduce((t, e) => t.getChild(e), this.root);
  }

  getNamespace(t) {
    var e = this.root;
    return t.reduce((t, s) => (e = e.getChild(s), t + (e.namespaced ? s + "/" : "")), "");
  }

  update(t) {
    !function t(e, s, o) {
      if (s.update(o), o.modules) for (var _i in o.modules) {
        if (!s.getChild(_i)) return;
        t(e.concat(_i), s.getChild(_i), o.modules[_i]);
      }
    }([], this.root, t);
  }

  register(t, e, o) {
    if (o === void 0) {
      o = !0;
    }

    var n = new i$1(e, o);
    if (0 === t.length) this.root = n;else {
      this.get(t.slice(0, -1)).addChild(t[t.length - 1], n);
    }
    e.modules && s$1(e.modules, (e, s) => {
      this.register(t.concat(s), e, o);
    });
  }

  unregister(t) {
    var e = this.get(t.slice(0, -1)),
        s = t[t.length - 1],
        o = e.getChild(s);
    o && o.runtime && e.removeChild(s);
  }

  isRegistered(t) {
    var e = this.get(t.slice(0, -1)),
        s = t[t.length - 1];
    return !!e && e.hasChild(s);
  }

}

var r$1;

class c$1 {
  constructor(e) {
    if (e === void 0) {
      e = {};
    }

    !r$1 && "undefined" != typeof window && window.Vue && f$1(window.Vue);
    var {
      plugins: s = [],
      strict: o = !1
    } = e;
    this._committing = !1, this._actions = Object.create(null), this._actionSubscribers = [], this._mutations = Object.create(null), this._wrappedGetters = Object.create(null), this._modules = new n$1(e), this._modulesNamespaceMap = Object.create(null), this._subscribers = [], this._watcherVM = new r$1(), this._makeLocalGettersCache = Object.create(null);
    var i = this,
        {
      dispatch: c,
      commit: a
    } = this;
    this.dispatch = function (t, e) {
      return c.call(i, t, e);
    }, this.commit = function (t, e, s) {
      return a.call(i, t, e, s);
    }, this.strict = o;
    var u = this._modules.root.state;
    h$1(this, u, [], this._modules.root), l$1(this, u), s.forEach(t => t(this));
    (void 0 !== e.devtools ? e.devtools : r$1.config.devtools) && function (e) {
      t$1 && (e._devtoolHook = t$1, t$1.emit("vuex:init", e), t$1.on("vuex:travel-to-state", t => {
        e.replaceState(t);
      }), e.subscribe((e, s) => {
        t$1.emit("vuex:mutation", e, s);
      }, {
        prepend: !0
      }), e.subscribeAction((e, s) => {
        t$1.emit("vuex:action", e, s);
      }, {
        prepend: !0
      }));
    }(this);
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(t) {}

  commit(t, e, s) {
    var {
      type: o,
      payload: i,
      options: n
    } = p$1(t, e, s),
        r = {
      type: o,
      payload: i
    },
        c = this._mutations[o];
    c && (this._withCommit(() => {
      c.forEach(function (t) {
        t(i);
      });
    }), this._subscribers.slice().forEach(t => t(r, this.state)));
  }

  dispatch(t, e) {
    var {
      type: s,
      payload: o
    } = p$1(t, e),
        i = {
      type: s,
      payload: o
    },
        n = this._actions[s];
    if (!n) return;

    try {
      this._actionSubscribers.slice().filter(t => t.before).forEach(t => t.before(i, this.state));
    } catch (t) {}

    var r = n.length > 1 ? Promise.all(n.map(t => t(o))) : n[0](o);
    return new Promise((t, e) => {
      r.then(e => {
        try {
          this._actionSubscribers.filter(t => t.after).forEach(t => t.after(i, this.state));
        } catch (t) {}

        t(e);
      }, t => {
        try {
          this._actionSubscribers.filter(t => t.error).forEach(e => e.error(i, this.state, t));
        } catch (t) {}

        e(t);
      });
    });
  }

  subscribe(t, e) {
    return a$1(t, this._subscribers, e);
  }

  subscribeAction(t, e) {
    return a$1("function" == typeof t ? {
      before: t
    } : t, this._actionSubscribers, e);
  }

  watch(t, e, s) {
    return this._watcherVM.$watch(() => t(this.state, this.getters), e, s);
  }

  replaceState(t) {
    this._withCommit(() => {
      this._vm._data.$$state = t;
    });
  }

  registerModule(t, e, s) {
    if (s === void 0) {
      s = {};
    }

    "string" == typeof t && (t = [t]), this._modules.register(t, e), h$1(this, this.state, t, this._modules.get(t), s.preserveState), l$1(this, this.state);
  }

  unregisterModule(t) {
    "string" == typeof t && (t = [t]), this._modules.unregister(t), this._withCommit(() => {
      var e = d$1(this.state, t.slice(0, -1));
      r$1.delete(e, t[t.length - 1]);
    }), u$1(this);
  }

  hasModule(t) {
    return "string" == typeof t && (t = [t]), this._modules.isRegistered(t);
  }

  hotUpdate(t) {
    this._modules.update(t), u$1(this, !0);
  }

  _withCommit(t) {
    var e = this._committing;
    this._committing = !0, t(), this._committing = e;
  }

}

function a$1(t, e, s) {
  return e.indexOf(t) < 0 && (s && s.prepend ? e.unshift(t) : e.push(t)), () => {
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
  s$1(n, (e, s) => {
    c[s] = function (t, e) {
      return function () {
        return t(e);
      };
    }(e, t), Object.defineProperty(t.getters, s, {
      get: () => t._vm[s],
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
    }, () => {}, {
      deep: !0,
      sync: !0
    });
  }(t), i && (o && t._withCommit(() => {
    i._data.$$state = null;
  }), r$1.nextTick(() => i.$destroy()));
}

function h$1(t, e, s, o, i) {
  var n = !s.length,
      c = t._modules.getNamespace(s);

  if (o.namespaced && (t._modulesNamespaceMap[c], t._modulesNamespaceMap[c] = o), !n && !i) {
    var _i2 = d$1(e, s.slice(0, -1)),
        _n = s[s.length - 1];

    t._withCommit(() => {
      r$1.set(_i2, _n, o.state);
    });
  }

  var a = o.context = function (t, e, s) {
    var o = "" === e,
        i = {
      dispatch: o ? t.dispatch : (s, o, i) => {
        var n = p$1(s, o, i),
            {
          payload: r,
          options: c
        } = n;
        var {
          type: a
        } = n;
        return c && c.root || (a = e + a), t.dispatch(a, r);
      },
      commit: o ? t.commit : (s, o, i) => {
        var n = p$1(s, o, i),
            {
          payload: r,
          options: c
        } = n;
        var {
          type: a
        } = n;
        c && c.root || (a = e + a), t.commit(a, r, c);
      }
    };
    return Object.defineProperties(i, {
      getters: {
        get: o ? () => t.getters : () => function (t, e) {
          if (!t._makeLocalGettersCache[e]) {
            var _s = {},
                _o = e.length;
            Object.keys(t.getters).forEach(i => {
              if (i.slice(0, _o) !== e) return;
              var n = i.slice(_o);
              Object.defineProperty(_s, n, {
                get: () => t.getters[i],
                enumerable: !0
              });
            }), t._makeLocalGettersCache[e] = _s;
          }

          return t._makeLocalGettersCache[e];
        }(t, e)
      },
      state: {
        get: () => d$1(t.state, s)
      }
    }), i;
  }(t, c, s);

  o.forEachMutation((e, s) => {
    !function (t, e, s, o) {
      (t._mutations[e] || (t._mutations[e] = [])).push(function (e) {
        s.call(t, o.state, e);
      });
    }(t, c + s, e, a);
  }), o.forEachAction((e, s) => {
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
        return (n = i) && "function" == typeof n.then || (i = Promise.resolve(i)), t._devtoolHook ? i.catch(e => {
          throw t._devtoolHook.emit("vuex:error", e), e;
        }) : i;
      });
    }(t, o, i, a);
  }), o.forEachGetter((e, s) => {
    !function (t, e, s, o) {
      if (t._wrappedGetters[e]) return;

      t._wrappedGetters[e] = function (t) {
        return s(o.state, o.getters, t.state, t.getters);
      };
    }(t, c + s, e, a);
  }), o.forEachChild((o, n) => {
    h$1(t, e, s.concat(n), o, i);
  });
}

function d$1(t, e) {
  return e.reduce((t, e) => t[e], t);
}

function p$1(t, e, s) {
  return o$1(t) && t.type && (s = e, e = t, t = t.type), {
    type: t,
    payload: e,
    options: s
  };
}

function f$1(t) {
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

var m$1 = v$1((t, e) => {
  var s = {};
  return w$1(e).forEach((_ref) => {
    var {
      key: e,
      val: o
    } = _ref;
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
    g$1 = v$1((t, e) => {
  var s = {};
  return w$1(e).forEach((_ref2) => {
    var {
      key: e,
      val: o
    } = _ref2;

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
    _$1 = v$1((t, e) => {
  var s = {};
  return w$1(e).forEach((_ref3) => {
    var {
      key: e,
      val: o
    } = _ref3;
    o = t + o, s[e] = function () {
      if (!t || $$1(this.$store, "mapGetters", t)) return this.$store.getters[o];
    }, s[e].vuex = !0;
  }), s;
}),
    y$1 = v$1((t, e) => {
  var s = {};
  return w$1(e).forEach((_ref4) => {
    var {
      key: e,
      val: o
    } = _ref4;

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
    b$1 = t => ({
  mapState: m$1.bind(null, t),
  mapGetters: _$1.bind(null, t),
  mapMutations: g$1.bind(null, t),
  mapActions: y$1.bind(null, t)
});

function w$1(t) {
  return function (t) {
    return Array.isArray(t) || o$1(t);
  }(t) ? Array.isArray(t) ? t.map(t => ({
    key: t,
    val: t
  })) : Object.keys(t).map(e => ({
    key: e,
    val: t[e]
  })) : [];
}

function v$1(t) {
  return (e, s) => ("string" != typeof e ? (s = e, e = "") : "/" !== e.charAt(e.length - 1) && (e += "/"), t(e, s));
}

function $$1(t, e, s) {
  return t._modulesNamespaceMap[s];
}

function M$1(_temp) {
  var {
    collapsed: t = !0,
    filter: s = (t, e, s) => !0,
    transformer: o = t => t,
    mutationTransformer: i = t => t,
    actionFilter: n = (t, e) => !0,
    actionTransformer: r = t => t,
    logMutations: c = !0,
    logActions: a = !0,
    logger: u = console
  } = _temp === void 0 ? {} : _temp;
  return l => {
    var h = e$1(l.state);
    void 0 !== u && (c && l.subscribe((n, r) => {
      var c = e$1(r);

      if (s(n, h, c)) {
        var _e3 = O$1(),
            _s3 = i(n),
            _r = "mutation " + n.type + _e3;

        C$1(u, _r, t), u.log("%c prev state", "color: #9E9E9E; font-weight: bold", o(h)), u.log("%c mutation", "color: #03A9F4; font-weight: bold", _s3), u.log("%c next state", "color: #4CAF50; font-weight: bold", o(c)), E$1(u);
      }

      h = c;
    }), a && l.subscribeAction((e, s) => {
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
  return " @ " + j$1(t.getHours(), 2) + ":" + j$1(t.getMinutes(), 2) + ":" + j$1(t.getSeconds(), 2) + "." + j$1(t.getMilliseconds(), 3);
}

function j$1(t, e) {
  return s = "0", o = e - t.toString().length, new Array(o + 1).join(s) + t;
  var s, o;
}

var A$1 = {
  Store: c$1,
  install: f$1,
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
}

// The options for persisting state
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


var loadedDisks = options.providers.map(disk => ({
  displayName: disk.displayName,
  drives: disk.adapterNames.map((account, index) => ({
    root: disk.name + "-" + index + ":/",
    displayName: account
  }))
}));

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
var getSelectedDirectory = state => state.directories.find(directory => directory.path === state.selectedDirectory);
/**
 * Get the sudirectories of the currently selected directory
 * @param state
 *
 * @returns {Array|directories|{/}|computed.directories|*|Object}
 */

var getSelectedDirectoryDirectories = state => state.directories.filter(directory => directory.directory === state.selectedDirectory);
/**
 * Get the files of the currently selected directory
 * @param state
 *
 * @returns {Array|files|{}|FileList|*}
 */

var getSelectedDirectoryFiles = state => state.files.filter(file => file.directory === state.selectedDirectory);
/**
 * Whether or not all items of the current directory are selected
 * @param state
 * @param getters
 * @returns Array
 */

var getSelectedDirectoryContents = (state, getters) => [...getters.getSelectedDirectoryDirectories, ...getters.getSelectedDirectoryFiles];

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


var getContents = (context, payload) => {
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

var getFullContents = (context, payload) => {
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

var download = (context, payload) => {
  api.getContents(payload.path, 0, 1).then(contents => {
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

var toggleBrowserItemSelect = (context, payload) => {
  var item = payload;
  var isSelected = context.state.selectedItems.some(selected => selected.path === item.path);

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

var createDirectory = (context, payload) => {
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

var uploadFile = (context, payload) => {
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

var renameItem = (context, payload) => {
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

var deleteSelectedItems = context => {
  context.commit(SET_IS_LOADING, true); // Get the selected items from the store

  var {
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

var gridItemSizes = ['sm', 'md', 'lg', 'xl'];
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
      var exists = state.directories.some(existing => existing.path === path);

      if (!exists) {
        // eslint-disable-next-line no-use-before-define
        var directory = directoryFromPath(path); // Add the sub directories and files

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
      var parts = path.split('/');
      var directory = dirname(path);

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
      var parentDirectory = state.directories.find(existing => existing.path === directory.directory);
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory);
      var index = state.directories.findIndex(existing => existing.path === directory.path);

      if (index === -1) {
        index = state.directories.length;
      } // Add the directory


      state.directories.splice(index, 1, directory); // Update the relation to the parent directory

      if (parentDirectoryIndex !== -1) {
        state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
          directories: [...parentDirectory.directories, directory.path]
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
      var parentDirectory = state.directories.find(directory => directory.path === file.directory);
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory);
      var index = state.files.findIndex(existing => existing.path === file.path);

      if (index === -1) {
        index = state.files.length;
      } // Add the file


      state.files.splice(index, 1, file); // Update the relation to the parent directory

      if (parentDirectoryIndex !== -1) {
        state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
          files: [...parentDirectory.files, file.path]
        }));
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
    var file = payload;
    var isNew = !state.files.some(existing => existing.path === file.path); // TODO handle file_exists

    if (isNew) {
      var parentDirectory = state.directories.find(existing => existing.path === file.directory);
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory); // Add the new file to the files array

      state.files.push(file); // Update the relation to the parent directory

      state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
        files: [...parentDirectory.files, file.path]
      }));
    }
  },

  /**
     * The create directory success mutation
     * @param state
     * @param payload
     */
  [CREATE_DIRECTORY_SUCCESS]: (state, payload) => {
    var directory = payload;
    var isNew = !state.directories.some(existing => existing.path === directory.path);

    if (isNew) {
      var parentDirectory = state.directories.find(existing => existing.path === directory.directory);
      var parentDirectoryIndex = state.directories.indexOf(parentDirectory); // Add the new directory to the directory

      state.directories.push(directory); // Update the relation to the parent directory

      state.directories.splice(parentDirectoryIndex, 1, _extends({}, parentDirectory, {
        directories: [...parentDirectory.directories, directory.path]
      }));
    }
  },

  /**
     * The rename success handler
     * @param state
     * @param payload
     */
  [RENAME_SUCCESS]: (state, payload) => {
    state.selectedItems[state.selectedItems.length - 1].name = payload.newName;
    var {
      item
    } = payload;
    var {
      oldPath
    } = payload;

    if (item.type === 'file') {
      var index = state.files.findIndex(file => file.path === oldPath);
      state.files.splice(index, 1, item);
    } else {
      var _index = state.directories.findIndex(directory => directory.path === oldPath);

      state.directories.splice(_index, 1, item);
    }
  },

  /**
     * The delete success mutation
     * @param state
     * @param payload
     */
  [DELETE_SUCCESS]: (state, payload) => {
    var item = payload; // Delete file

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
    var item = payload;
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
    var currentSizeIndex = gridItemSizes.indexOf(state.gridSize);

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
    var currentSizeIndex = gridItemSizes.indexOf(state.gridSize);

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

yn.use(A$1); // A Vuex instance is created by combining the state, mutations, actions, and getters.

var store = new A$1.Store({
  state,
  getters,
  actions,
  mutations,
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

document.addEventListener('DOMContentLoaded', () => new yn({
  el: '#com-media',
  store,
  render: h => h(__vue_component__$1)
}));
