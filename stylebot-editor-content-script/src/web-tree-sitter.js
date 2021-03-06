var Module = void 0 !== Module ? Module : {};

var e,
  t = {};
for (e in Module) Module.hasOwnProperty(e) && (t[e] = Module[e]);
(Module.arguments = []),
  (Module.thisProgram = "./this.program"),
  (Module.quit = function(e, t) {
    throw t;
  }),
  (Module.preRun = []),
  (Module.postRun = []);
var n,
  r,
  o = !1,
  u = !1,
  s = !1;
(o = "object" == typeof window),
  (u = "function" == typeof importScripts),
  (n =
    "object" == typeof process &&
    "object" == typeof process.versions &&
    "string" == typeof process.versions.node),
  (s = n && !o && !u),
  (r = !o && !s && !u);
var a,
  i,
  l,
  _,
  d = "";
s
  ? ((d = __dirname + "/"),
    (a = function(e, t) {
      var n;
      return (
        l || (l = require("fs")),
        _ || (_ = require("path")),
        (e = _.normalize(e)),
        (n = l.readFileSync(e)),
        t ? n : n.toString()
      );
    }),
    (i = function(e) {
      var t = a(e, !0);
      return t.buffer || (t = new Uint8Array(t)), N(t.buffer), t;
    }),
    process.argv.length > 1 &&
      (Module.thisProgram = process.argv[1].replace(/\\/g, "/")),
    (Module.arguments = process.argv.slice(2)),
    "undefined" != typeof module && (module.exports = Module),
    process.on("uncaughtException", function(e) {
      if (!(e instanceof qe)) throw e;
    }),
    process.on("unhandledRejection", We),
    (Module.quit = function(e) {
      process.exit(e);
    }),
    (Module.inspect = function() {
      return "[Emscripten Module object]";
    }))
  : r
  ? ("undefined" != typeof read &&
      (a = function(e) {
        return read(e);
      }),
    (i = function(e) {
      var t;
      return "function" == typeof readbuffer
        ? new Uint8Array(readbuffer(e))
        : (N("object" == typeof (t = read(e, "binary"))), t);
    }),
    "undefined" != typeof scriptArgs
      ? (Module.arguments = scriptArgs)
      : void 0 !== arguments && (Module.arguments = arguments),
    "function" == typeof quit &&
      (Module.quit = function(e) {
        quit(e);
      }))
  : (o || u) &&
    (u
      ? (d = self.location.href)
      : document.currentScript && (d = document.currentScript.src),
    (d = 0 !== d.indexOf("blob:") ? d.substr(0, d.lastIndexOf("/") + 1) : ""),
    (a = function(e) {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }),
    u &&
      (i = function(e) {
        var t = new XMLHttpRequest();
        return (
          t.open("GET", e, !1),
          (t.responseType = "arraybuffer"),
          t.send(null),
          new Uint8Array(t.response)
        );
      }),
    function(e, t, n) {
      var r = new XMLHttpRequest();
      r.open("GET", e, !0),
        (r.responseType = "arraybuffer"),
        (r.onload = function() {
          200 == r.status || (0 == r.status && r.response)
            ? t(r.response)
            : n();
        }),
        (r.onerror = n),
        r.send(null);
    });
var c =
    Module.print ||
    ("undefined" != typeof console
      ? console.log.bind(console)
      : "undefined" != typeof print
      ? print
      : null),
  f =
    Module.printErr ||
    ("undefined" != typeof printErr
      ? printErr
      : ("undefined" != typeof console && console.warn.bind(console)) || c);
for (e in t) t.hasOwnProperty(e) && (Module[e] = t[e]);
t = void 0;
var p = 16;
function m(e) {
  var t = $[H >> 2],
    n = (t + e + 15) & -16;
  return n > ye() && We(), ($[H >> 2] = n), t;
}
function h(e, t) {
  return t || (t = p), Math.ceil(e / t) * t;
}
function M(e) {
  switch (e) {
    case "i1":
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
    default:
      if ("*" === e[e.length - 1]) return 4;
      if ("i" === e[0]) {
        var t = parseInt(e.substr(1));
        return (
          N(t % 8 == 0, "getNativeTypeSize invalid bits " + t + ", type " + e),
          t / 8
        );
      }
      return 0;
  }
}
var g = {
    "f64-rem": function(e, t) {
      return e % t;
    },
    debugger: function() {}
  },
  y = {
    nextHandle: 1,
    loadedLibs: {
      "-1": { refcount: 1 / 0, name: "__self__", module: Module, global: !0 }
    },
    loadedLibNames: { __self__: -1 }
  };
function w(e, t) {
  t = t || { global: !0, nodelete: !0 };
  var n,
    r = y.loadedLibNames[e];
  if (r)
    return (
      (n = y.loadedLibs[r]),
      t.global &&
        !n.global &&
        ((n.global = !0), "loading" !== n.module && a(n.module)),
      t.nodelete && n.refcount !== 1 / 0 && (n.refcount = 1 / 0),
      n.refcount++,
      t.loadAsync ? Promise.resolve(r) : r
    );
  function o() {
    if (t.fs) {
      var n = t.fs.readFile(e, { encoding: "binary" });
      return (
        n instanceof Uint8Array || (n = new Uint8Array(lib_data)),
        t.loadAsync ? Promise.resolve(n) : n
      );
    }
    return t.loadAsync
      ? ((r = e),
        fetch(r, { credentials: "same-origin" })
          .then(function(e) {
            if (!e.ok) throw "failed to load binary file at '" + r + "'";
            return e.arrayBuffer();
          })
          .then(function(e) {
            return new Uint8Array(e);
          }))
      : i(e);
    var r;
  }
  function u(e) {
    return b(e, t);
  }
  function s() {
    if (void 0 !== Module.preloadedWasm && void 0 !== Module.preloadedWasm[e]) {
      var n = Module.preloadedWasm[e];
      return t.loadAsync ? Promise.resolve(n) : n;
    }
    return t.loadAsync
      ? o().then(function(e) {
          return u(e);
        })
      : u(o());
  }
  function a(e) {
    for (var t in e)
      if (e.hasOwnProperty(t)) {
        var n;
        (n = "_" + t), Module.hasOwnProperty(n) || (Module[n] = e[t]);
      }
  }
  function l(e) {
    n.global && a(e), (n.module = e);
  }
  return (
    (r = y.nextHandle++),
    (n = {
      refcount: t.nodelete ? 1 / 0 : 1,
      name: e,
      module: "loading",
      global: t.global
    }),
    (y.loadedLibNames[e] = r),
    (y.loadedLibs[r] = n),
    t.loadAsync
      ? s().then(function(e) {
          return l(e), r;
        })
      : (l(s()), r)
  );
}
function b(e, t) {
  N(
    1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0],
    "need to see wasm magic number"
  ),
    N(0 === e[8], "need the dylink section to be first");
  var n = 9;
  function r() {
    for (var t = 0, r = 1; ; ) {
      var o = e[n++];
      if (((t += (127 & o) * r), (r *= 128), !(128 & o))) break;
    }
    return t;
  }
  r();
  N(6 === e[n]),
    N(e[++n] === "d".charCodeAt(0)),
    N(e[++n] === "y".charCodeAt(0)),
    N(e[++n] === "l".charCodeAt(0)),
    N(e[++n] === "i".charCodeAt(0)),
    N(e[++n] === "n".charCodeAt(0)),
    N(e[++n] === "k".charCodeAt(0)),
    n++;
  for (
    var o = r(), u = r(), s = r(), a = r(), i = r(), l = [], _ = 0;
    _ < i;
    ++_
  ) {
    var d = r(),
      c = e.subarray(n, n + d);
    n += d;
    var f = T(c, 0);
    l.push(f);
  }
  function m() {
    (u = Math.pow(2, u)), (a = Math.pow(2, a)), (u = Math.max(u, p));
    for (var n = h(C(o + u), u), r = n; r < n + o; ++r) F[r] = 0;
    var i = Ee,
      l = A,
      _ = l.length,
      d = l;
    l.grow(s), N(l === d);
    for (r = n; r < n + o; r++) F[r] = 0;
    for (r = _; r < _ + s; r++) l.set(r, null);
    var c = {},
      f = function(e, t) {
        var n = Module[(e = "_" + e)];
        return n || (n = c[e]), n;
      };
    for (var m in Module) m in i || (i[m] = Module[m]);
    var M = {
      global: { NaN: NaN, Infinity: 1 / 0 },
      "global.Math": Math,
      env: new Proxy(i, {
        get: function(e, t) {
          switch (t) {
            case "__memory_base":
            case "gb":
              return n;
            case "__table_base":
            case "fb":
              return _;
          }
          if (t in e) return e[t];
          if (t.startsWith("g$")) {
            var r = t.substr(2);
            return (e[t] = function() {
              return f(r);
            });
          }
          if (t.startsWith("fp$")) {
            var o = t.split("$");
            N(3 == o.length);
            r = o[1];
            var u = o[2],
              s = 0;
            return (e[t] = function() {
              if (!s) {
                var e = f(r);
                s = v(e, u);
              }
              return s;
            });
          }
          return t.startsWith("invoke_")
            ? (e[t] = Le)
            : (e[t] = function() {
                return f(t).apply(null, arguments);
              });
        }
      }),
      asm2wasm: g
    };
    function y(e, t) {
      var r = {};
      for (var o in e.exports) {
        var u = e.exports[o];
        "object" == typeof u && (u = u.value),
          "number" == typeof u && (u += n),
          (r[o] = u),
          (t["_" + o] = u);
      }
      var s = r.__post_instantiate;
      return s && (Y ? s() : K.push(s)), r;
    }
    return t.loadAsync
      ? WebAssembly.instantiate(e, M).then(function(e) {
          return y(e.instance, c);
        })
      : y(new WebAssembly.Instance(new WebAssembly.Module(e), M), c);
  }
  return t.loadAsync
    ? Promise.all(
        l.map(function(e) {
          return w(e, t);
        })
      ).then(function() {
        return m();
      })
    : (l.forEach(function(e) {
        w(e, t);
      }),
      m());
}
function v(e, t) {
  var n = A,
    r = n.length;
  try {
    n.grow(1);
  } catch (e) {
    if (!e instanceof RangeError) throw e;
    throw "Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH.";
  }
  try {
    n.set(r, e);
  } catch (u) {
    if (!u instanceof TypeError) throw u;
    N(void 0 !== t, "Missing signature argument to addFunction");
    var o = (function(e, t) {
      var n = [1, 0, 1, 96],
        r = t.slice(0, 1),
        o = t.slice(1),
        u = { i: 127, j: 126, f: 125, d: 124 };
      n.push(o.length);
      for (var s = 0; s < o.length; ++s) n.push(u[o[s]]);
      "v" == r ? n.push(0) : (n = n.concat([1, u[r]])), (n[1] = n.length - 2);
      var a = new Uint8Array(
          [0, 97, 115, 109, 1, 0, 0, 0].concat(n, [
            2,
            7,
            1,
            1,
            101,
            1,
            102,
            0,
            0,
            7,
            5,
            1,
            1,
            102,
            0,
            0
          ])
        ),
        i = new WebAssembly.Module(a);
      return new WebAssembly.Instance(i, { e: { f: e } }).exports.f;
    })(e, t);
    n.set(r, o);
  }
  return r;
}
Module.loadWebAssemblyModule = b;
var E,
  A,
  x = 1024;
function I(e, t, n, r) {
  switch (("*" === (n = n || "i8").charAt(n.length - 1) && (n = "i32"), n)) {
    case "i1":
    case "i8":
      F[e >> 0] = t;
      break;
    case "i16":
      W[e >> 1] = t;
      break;
    case "i32":
      $[e >> 2] = t;
      break;
    case "i64":
      (ce = [
        t >>> 0,
        ((de = t),
        +J(de) >= 1
          ? de > 0
            ? (0 | ne(+te(de / 4294967296), 4294967295)) >>> 0
            : ~~+ee((de - +(~~de >>> 0)) / 4294967296) >>> 0
          : 0)
      ]),
        ($[e >> 2] = ce[0]),
        ($[(e + 4) >> 2] = ce[1]);
      break;
    case "float":
      U[e >> 2] = t;
      break;
    case "double":
      j[e >> 3] = t;
      break;
    default:
      We("invalid type for setValue: " + n);
  }
}
function S(e, t, n) {
  switch (("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t)) {
    case "i1":
    case "i8":
      return F[e >> 0];
    case "i16":
      return W[e >> 1];
    case "i32":
    case "i64":
      return $[e >> 2];
    case "float":
      return U[e >> 2];
    case "double":
      return j[e >> 3];
    default:
      We("invalid type for getValue: " + t);
  }
  return null;
}
(x = h(x, 1)),
  "object" != typeof WebAssembly && f("no native wasm support detected");
var R = !1;
function N(e, t) {
  e || We("Assertion failed: " + t);
}
var P = 3;
function C(e) {
  return Y ? Ie(e) : m(e);
}
var k = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
function T(e, t, n) {
  for (var r = t + n, o = t; e[o] && !(o >= r); ) ++o;
  if (o - t > 16 && e.subarray && k) return k.decode(e.subarray(t, o));
  for (var u = ""; t < o; ) {
    var s = e[t++];
    if (128 & s) {
      var a = 63 & e[t++];
      if (192 != (224 & s)) {
        var i = 63 & e[t++];
        if (
          (s =
            224 == (240 & s)
              ? ((15 & s) << 12) | (a << 6) | i
              : ((7 & s) << 18) | (a << 12) | (i << 6) | (63 & e[t++])) < 65536
        )
          u += String.fromCharCode(s);
        else {
          var l = s - 65536;
          u += String.fromCharCode(55296 | (l >> 10), 56320 | (1023 & l));
        }
      } else u += String.fromCharCode(((31 & s) << 6) | a);
    } else u += String.fromCharCode(s);
  }
  return u;
}
function L(e, t) {
  return e ? T(O, e, t) : "";
}
"undefined" != typeof TextDecoder && new TextDecoder("utf-16le");
var q, F, O, W, $, U, j;
function D(e, t) {
  return e % t > 0 && (e += t - (e % t)), e;
}
function B() {
  (Module.HEAP8 = F = new Int8Array(q)),
    (Module.HEAP16 = W = new Int16Array(q)),
    (Module.HEAP32 = $ = new Int32Array(q)),
    (Module.HEAPU8 = O = new Uint8Array(q)),
    (Module.HEAPU16 = new Uint16Array(q)),
    (Module.HEAPU32 = new Uint32Array(q)),
    (Module.HEAPF32 = U = new Float32Array(q)),
    (Module.HEAPF64 = j = new Float64Array(q));
}
var H = 8192,
  Z = Module.TOTAL_MEMORY || 33554432;
function z(e) {
  for (; e.length > 0; ) {
    var t = e.shift();
    if ("function" != typeof t) {
      var n = t.func;
      "number" == typeof n
        ? void 0 === t.arg
          ? Module.dynCall_v(n)
          : Module.dynCall_vi(n, t.arg)
        : n(void 0 === t.arg ? null : t.arg);
    } else t();
  }
}
Z < 5242880 &&
  f(
    "TOTAL_MEMORY should be larger than TOTAL_STACK, was " +
      Z +
      "! (TOTAL_STACK=5242880)"
  ),
  (E = Module.wasmMemory
    ? Module.wasmMemory
    : new WebAssembly.Memory({ initial: Z / 65536 })) && (q = E.buffer),
  (Z = q.byteLength),
  B(),
  ($[H >> 2] = 5251088);
var G = [],
  K = [],
  V = [],
  X = [],
  Y = !1;
function Q(e) {
  G.unshift(e);
}
var J = Math.abs,
  ee = Math.ceil,
  te = Math.floor,
  ne = Math.min,
  re = 0,
  oe = null,
  ue = null;
function se(e) {
  re++, Module.monitorRunDependencies && Module.monitorRunDependencies(re);
}
function ae(e) {
  if (
    (re--,
    Module.monitorRunDependencies && Module.monitorRunDependencies(re),
    0 == re && (null !== oe && (clearInterval(oe), (oe = null)), ue))
  ) {
    var t = ue;
    (ue = null), t();
  }
}
(Module.preloadedImages = {}),
  (Module.preloadedAudios = {}),
  (Module.preloadedWasm = {}),
  Q(function() {
    if (Module.dynamicLibraries && Module.dynamicLibraries.length > 0 && !i)
      return (
        se(),
        void Promise.all(
          Module.dynamicLibraries.map(function(e) {
            return w(e, { loadAsync: !0, global: !0, nodelete: !0 });
          })
        ).then(function() {
          ae();
        })
      );
    var e;
    (e = Module.dynamicLibraries) &&
      e.forEach(function(e) {
        w(e, { global: !0, nodelete: !0 });
      });
  });
var ie = "data:application/octet-stream;base64,";
function le(e) {
  return String.prototype.startsWith ? e.startsWith(ie) : 0 === e.indexOf(ie);
}
var _e,
  de,
  ce,
  fe = globalThis.dral__get_url("/web-tree-sitter/tree-sitter.wasm");
function pe() {
  try {
    if (Module.wasmBinary) return new Uint8Array(Module.wasmBinary);
    if (i) return i(fe);
    throw "both async and sync fetching of the wasm failed";
  } catch (e) {
    We(e);
  }
}
function me(e) {
  var t = { env: e };
  function n(e, t) {
    var n = e.exports;
    (Module.asm = n), ae();
  }
  function r(e) {
    n(e.instance);
  }
  function s(e) {
    return (Module.wasmBinary || (!o && !u) || "function" != typeof fetch
      ? new Promise(function(e, t) {
          e(pe());
        })
      : fetch(fe, { credentials: "same-origin" })
          .then(function(e) {
            if (!e.ok) throw "failed to load wasm binary file at '" + fe + "'";
            return e.arrayBuffer();
          })
          .catch(function() {
            return pe();
          })
    )
      .then(function(e) {
        return WebAssembly.instantiate(e, t);
      })
      .then(e, function(e) {
        f("failed to asynchronously prepare wasm: " + e), We(e);
      });
  }
  if ((se(), Module.instantiateWasm))
    try {
      return Module.instantiateWasm(t, n);
    } catch (e) {
      return f("Module.instantiateWasm callback failed with error: " + e), !1;
    }
  return (
    (function() {
      if (
        Module.wasmBinary ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        le(fe) ||
        "function" != typeof fetch
      )
        return s(r);
      fetch(fe, { credentials: "same-origin" }).then(function(e) {
        return WebAssembly.instantiateStreaming(e, t).then(r, function(e) {
          f("wasm streaming compile failed: " + e),
            f("falling back to ArrayBuffer instantiation"),
            s(r);
        });
      });
    })(),
    {}
  );
}
function he() {
  Module.abort();
}
function Me() {
  We();
}
function ge(e) {
  return (
    Module.___errno_location && ($[Module.___errno_location() >> 2] = e), e
  );
}
function ye() {
  return F.length;
}
function we(e) {
  var t = ye();
  if (e > 2147418112) return !1;
  for (var n = Math.max(t, 16777216); n < e; )
    n =
      n <= 536870912
        ? D(2 * n, 65536)
        : Math.min(D((3 * n + 2147483648) / 4, 65536), 2147418112);
  return (
    !!(function(e) {
      e = D(e, 65536);
      var t = q.byteLength;
      try {
        return -1 !== E.grow((e - t) / 65536) && ((q = E.buffer), !0);
      } catch (e) {
        return !1;
      }
    })(n) && (B(), !0)
  );
}
function be(e, t, n) {
  if (tt) {
    const e = L(n);
    tt(e, 0 !== t);
  }
}
le(fe) ||
  ((_e = fe), (fe = Module.locateFile ? Module.locateFile(_e, d) : d + _e)),
  (Module.asm = function(e, t, n) {
    return (
      (t.memory = E),
      (t.table = A = new WebAssembly.Table({
        initial: 12,
        element: "anyfunc"
      })),
      (t.__memory_base = 1024),
      (t.__stack_pointer = 5251088),
      (t.__table_base = 1),
      me(t)
    );
  }),
  K.push(
    {
      func: function() {
        Ce();
      }
    },
    {
      func: function() {
        xe();
      }
    }
  ),
  (Module._abort = he),
  (Me = s
    ? function() {
        var e = process.hrtime();
        return 1e3 * e[0] + e[1] / 1e6;
      }
    : "undefined" != typeof dateNow
    ? dateNow
    : "object" == typeof performance &&
      performance &&
      "function" == typeof performance.now
    ? function() {
        return performance.now();
      }
    : Date.now);
var ve = x,
  Ee = {
    __memory_base: function() {
      return Module.___memory_base.apply(null, arguments);
    },
    __stack_pointer: function() {
      return Module.___stack_pointer.apply(null, arguments);
    },
    __table_base: function() {
      return Module.___table_base.apply(null, arguments);
    },
    h: he,
    c: function(e, t) {
      var n;
      if (0 === e) n = Date.now();
      else {
        if (
          1 !== e ||
          !(
            s ||
            "undefined" != typeof dateNow ||
            ("object" == typeof performance &&
              performance &&
              "function" == typeof performance.now)
          )
        )
          return ge(22), -1;
        n = Me();
      }
      return (
        ($[t >> 2] = (n / 1e3) | 0),
        ($[(t + 4) >> 2] = ((n % 1e3) * 1e3 * 1e3) | 0),
        0
      );
    },
    i: function(e, t, n) {
      O.set(O.subarray(t, t + n), e);
    },
    a: function(e) {
      Oe(e);
    },
    k: function() {
      return Module._fp$tree_sitter_log_callback$viii.apply(null, arguments);
    },
    g: function() {
      return Module._TRANSFER_BUFFER;
    },
    e: function() {
      return Module.___THREW__;
    },
    f: function() {
      return Module.___cxa_new_handler;
    },
    d: function() {
      return Module.___threwValue;
    },
    b: function(e) {
      var t, n, r;
      return (
        (e |= 0),
        (r = 0 | ye()),
        (((0 | e) > 0) &
          ((0 | (n = ((t = 0 | $[H >> 2]) + e) | 0)) < (0 | t))) |
        ((0 | n) < 0)
          ? (We("OOM"), ge(12), -1)
          : (0 | n) > (0 | r) && !(0 | we(0 | n))
          ? (ge(12), -1)
          : (($[H >> 2] = 0 | n), 0 | t)
      );
    },
    j: function(e, t, n, r, o) {
      var u = et(t, { row: n, column: r });
      "string" == typeof u
        ? (I(o, u.length, "i32"),
          (function(e, t, n) {
            if ((void 0 === n && (n = 2147483647), n < 2)) return 0;
            for (
              var r = (n -= 2) < 2 * e.length ? n / 2 : e.length, o = 0;
              o < r;
              ++o
            ) {
              var u = e.charCodeAt(o);
              (W[t >> 1] = u), (t += 2);
            }
            W[t >> 1] = 0;
          })(u, e, 10240))
        : I(o, 0, "i32");
    }
  },
  Ae = Module.asm({}, Ee, q);
Module.asm = Ae;
var xe = (Module.___wasm_call_ctors = function() {
    return Module.asm.l.apply(null, arguments);
  }),
  Ie =
    ((Module._calloc = function() {
      return Module.asm.m.apply(null, arguments);
    }),
    (Module._ts_language_symbol_count = function() {
      return Module.asm.n.apply(null, arguments);
    }),
    (Module._ts_language_version = function() {
      return Module.asm.o.apply(null, arguments);
    }),
    (Module._ts_language_field_count = function() {
      return Module.asm.p.apply(null, arguments);
    }),
    (Module._ts_language_symbol_name = function() {
      return Module.asm.q.apply(null, arguments);
    }),
    (Module._ts_language_symbol_type = function() {
      return Module.asm.r.apply(null, arguments);
    }),
    (Module._ts_language_field_name_for_id = function() {
      return Module.asm.s.apply(null, arguments);
    }),
    (Module._memcpy = function() {
      return Module.asm.t.apply(null, arguments);
    }),
    (Module._free = function() {
      return Module.asm.u.apply(null, arguments);
    }),
    (Module._malloc = function() {
      return Module.asm.v.apply(null, arguments);
    })),
  Se =
    ((Module._ts_parser_delete = function() {
      return Module.asm.w.apply(null, arguments);
    }),
    (Module._ts_parser_set_language = function() {
      return Module.asm.x.apply(null, arguments);
    }),
    (Module._memcmp = function() {
      return Module.asm.y.apply(null, arguments);
    }),
    (Module._ts_query_new = function() {
      return Module.asm.z.apply(null, arguments);
    }),
    (Module._iswspace = function() {
      return Module.asm.A.apply(null, arguments);
    }),
    (Module._ts_query_delete = function() {
      return Module.asm.B.apply(null, arguments);
    }),
    (Module._iswalnum = function() {
      return Module.asm.C.apply(null, arguments);
    }),
    (Module._ts_query_pattern_count = function() {
      return Module.asm.D.apply(null, arguments);
    }),
    (Module._ts_query_capture_count = function() {
      return Module.asm.E.apply(null, arguments);
    }),
    (Module._ts_query_string_count = function() {
      return Module.asm.F.apply(null, arguments);
    }),
    (Module._ts_query_capture_name_for_id = function() {
      return Module.asm.G.apply(null, arguments);
    }),
    (Module._ts_query_string_value_for_id = function() {
      return Module.asm.H.apply(null, arguments);
    }),
    (Module._ts_query_predicates_for_pattern = function() {
      return Module.asm.I.apply(null, arguments);
    }),
    (Module._ts_tree_delete = function() {
      return Module.asm.J.apply(null, arguments);
    }),
    (Module._ts_init = function() {
      return Module.asm.K.apply(null, arguments);
    }),
    (Module._ts_parser_new_wasm = function() {
      return Module.asm.L.apply(null, arguments);
    }),
    (Module._ts_parser_enable_logger_wasm = function() {
      return Module.asm.M.apply(null, arguments);
    }),
    (Module._ts_parser_parse_wasm = function() {
      return Module.asm.N.apply(null, arguments);
    }),
    (Module._ts_tree_root_node_wasm = function() {
      return Module.asm.O.apply(null, arguments);
    }),
    (Module._ts_tree_edit_wasm = function() {
      return Module.asm.P.apply(null, arguments);
    }),
    (Module._ts_tree_get_changed_ranges_wasm = function() {
      return Module.asm.Q.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_new_wasm = function() {
      return Module.asm.R.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_delete_wasm = function() {
      return Module.asm.S.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_reset_wasm = function() {
      return Module.asm.T.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_goto_first_child_wasm = function() {
      return Module.asm.U.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_goto_next_sibling_wasm = function() {
      return Module.asm.V.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_goto_parent_wasm = function() {
      return Module.asm.W.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_current_node_type_id_wasm = function() {
      return Module.asm.X.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_current_node_is_named_wasm = function() {
      return Module.asm.Y.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_current_node_is_missing_wasm = function() {
      return Module.asm.Z.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_current_node_id_wasm = function() {
      return Module.asm._.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_start_position_wasm = function() {
      return Module.asm.$.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_end_position_wasm = function() {
      return Module.asm.aa.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_start_index_wasm = function() {
      return Module.asm.ba.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_end_index_wasm = function() {
      return Module.asm.ca.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_current_field_id_wasm = function() {
      return Module.asm.da.apply(null, arguments);
    }),
    (Module._ts_tree_cursor_current_node_wasm = function() {
      return Module.asm.ea.apply(null, arguments);
    }),
    (Module._ts_node_symbol_wasm = function() {
      return Module.asm.fa.apply(null, arguments);
    }),
    (Module._ts_node_child_count_wasm = function() {
      return Module.asm.ga.apply(null, arguments);
    }),
    (Module._ts_node_named_child_count_wasm = function() {
      return Module.asm.ha.apply(null, arguments);
    }),
    (Module._ts_node_child_wasm = function() {
      return Module.asm.ia.apply(null, arguments);
    }),
    (Module._ts_node_named_child_wasm = function() {
      return Module.asm.ja.apply(null, arguments);
    }),
    (Module._ts_node_child_by_field_id_wasm = function() {
      return Module.asm.ka.apply(null, arguments);
    }),
    (Module._ts_node_next_sibling_wasm = function() {
      return Module.asm.la.apply(null, arguments);
    }),
    (Module._ts_node_prev_sibling_wasm = function() {
      return Module.asm.ma.apply(null, arguments);
    }),
    (Module._ts_node_next_named_sibling_wasm = function() {
      return Module.asm.na.apply(null, arguments);
    }),
    (Module._ts_node_prev_named_sibling_wasm = function() {
      return Module.asm.oa.apply(null, arguments);
    }),
    (Module._ts_node_parent_wasm = function() {
      return Module.asm.pa.apply(null, arguments);
    }),
    (Module._ts_node_descendant_for_index_wasm = function() {
      return Module.asm.qa.apply(null, arguments);
    }),
    (Module._ts_node_named_descendant_for_index_wasm = function() {
      return Module.asm.ra.apply(null, arguments);
    }),
    (Module._ts_node_descendant_for_position_wasm = function() {
      return Module.asm.sa.apply(null, arguments);
    }),
    (Module._ts_node_named_descendant_for_position_wasm = function() {
      return Module.asm.ta.apply(null, arguments);
    }),
    (Module._ts_node_start_point_wasm = function() {
      return Module.asm.ua.apply(null, arguments);
    }),
    (Module._ts_node_end_point_wasm = function() {
      return Module.asm.va.apply(null, arguments);
    }),
    (Module._ts_node_start_index_wasm = function() {
      return Module.asm.wa.apply(null, arguments);
    }),
    (Module._ts_node_end_index_wasm = function() {
      return Module.asm.xa.apply(null, arguments);
    }),
    (Module._ts_node_to_string_wasm = function() {
      return Module.asm.ya.apply(null, arguments);
    }),
    (Module._ts_node_children_wasm = function() {
      return Module.asm.za.apply(null, arguments);
    }),
    (Module._ts_node_named_children_wasm = function() {
      return Module.asm.Aa.apply(null, arguments);
    }),
    (Module._ts_node_descendants_of_type_wasm = function() {
      return Module.asm.Ba.apply(null, arguments);
    }),
    (Module._ts_node_is_named_wasm = function() {
      return Module.asm.Ca.apply(null, arguments);
    }),
    (Module._ts_node_has_changes_wasm = function() {
      return Module.asm.Da.apply(null, arguments);
    }),
    (Module._ts_node_has_error_wasm = function() {
      return Module.asm.Ea.apply(null, arguments);
    }),
    (Module._ts_node_is_missing_wasm = function() {
      return Module.asm.Fa.apply(null, arguments);
    }),
    (Module._ts_query_matches_wasm = function() {
      return Module.asm.Ga.apply(null, arguments);
    }),
    (Module._ts_query_captures_wasm = function() {
      return Module.asm.Ha.apply(null, arguments);
    }),
    (Module._iswdigit = function() {
      return Module.asm.Ia.apply(null, arguments);
    }),
    (Module._iswalpha = function() {
      return Module.asm.Ja.apply(null, arguments);
    }),
    (Module._iswlower = function() {
      return Module.asm.Ka.apply(null, arguments);
    }),
    (Module._towupper = function() {
      return Module.asm.La.apply(null, arguments);
    }),
    (Module._memchr = function() {
      return Module.asm.Ma.apply(null, arguments);
    }),
    (Module._strlen = function() {
      return Module.asm.Na.apply(null, arguments);
    }),
    (Module.__Znwm = function() {
      return Module.asm.Oa.apply(null, arguments);
    }),
    (Module.__ZdlPv = function() {
      return Module.asm.Pa.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function() {
      return Module.asm.Qa.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function() {
      return Module.asm.Ra.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function() {
      return Module.asm.Sa.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function() {
      return Module.asm.Ta.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function() {
      return Module.asm.Ua.apply(null, arguments);
    }),
    (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function() {
      return Module.asm.Va.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function() {
      return Module.asm.Wa.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function() {
      return Module.asm.Xa.apply(null, arguments);
    }),
    (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = function() {
      return Module.asm.Ya.apply(null, arguments);
    }),
    (Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function() {
      return Module.asm.Za.apply(null, arguments);
    }),
    (Module._setThrew = function() {
      return Module.asm._a.apply(null, arguments);
    })),
  Re = (Module.stackSave = function() {
    return Module.asm.$a.apply(null, arguments);
  }),
  Ne = (Module.stackAlloc = function() {
    return Module.asm.ab.apply(null, arguments);
  }),
  Pe = (Module.stackRestore = function() {
    return Module.asm.bb.apply(null, arguments);
  }),
  Ce = (Module.___assign_got_enties = function() {
    return Module.asm.cb.apply(null, arguments);
  }),
  ke =
    ((Module.dynCall_vi = function() {
      return Module.asm.db.apply(null, arguments);
    }),
    {
      __THREW__: 6984,
      __cxa_new_handler: 6140,
      __data_end: 6992,
      TRANSFER_BUFFER: 1488,
      __threwValue: 6988
    });
for (var Te in ke) Module["_" + Te] = ve + ke[Te];
for (var Te in ((Module.NAMED_GLOBALS = ke), ke))
  !(function(e) {
    var t = Module["_" + e];
    Module["g$_" + e] = function() {
      return t;
    };
  })(Te);
function Le() {
  var e = Re();
  try {
    var t = Array.prototype.slice.call(arguments);
    return A.get(t[0]).apply(null, t.slice(1));
  } catch (t) {
    if ((Pe(e), t !== t + 0 && "longjmp" !== t)) throw t;
    Se(1, 0);
  }
}
function qe(e) {
  (this.name = "ExitStatus"),
    (this.message = "Program terminated with exit(" + e + ")"),
    (this.status = e);
}
(Module._fp$tree_sitter_log_callback$viii = function() {
  N(
    Module._tree_sitter_log_callback || !0,
    "external function `tree_sitter_log_callback` is missing.perhaps a side module was not linked in? if this symbol was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=XX in the environment"
  );
  var e = Module._tree_sitter_log_callback;
  e || (e = be);
  var t = v(e, "viii");
  return (
    (Module._fp$tree_sitter_log_callback$viii = function() {
      return t;
    }),
    t
  );
}),
  (Module.asm = Ae),
  (Module.allocate = function(e, t, n, r) {
    var o, u;
    "number" == typeof e ? ((o = !0), (u = e)) : ((o = !1), (u = e.length));
    var s,
      a = "string" == typeof t ? t : null;
    if (((s = n == P ? r : [Ie, Ne, m][n](Math.max(u, a ? 1 : t.length))), o)) {
      var i;
      for (r = s, N(0 == (3 & s)), i = s + (-4 & u); r < i; r += 4)
        $[r >> 2] = 0;
      for (i = s + u; r < i; ) F[r++ >> 0] = 0;
      return s;
    }
    if ("i8" === a)
      return (
        e.subarray || e.slice ? O.set(e, s) : O.set(new Uint8Array(e), s), s
      );
    for (var l, _, d, c = 0; c < u; ) {
      var f = e[c];
      0 !== (l = a || t[c])
        ? ("i64" == l && (l = "i32"),
          I(s + c, f, l),
          d !== l && ((_ = M(l)), (d = l)),
          (c += _))
        : c++;
    }
    return s;
  }),
  (Module.getMemory = C),
  (qe.prototype = new Error()),
  (qe.prototype.constructor = qe);
function Fe(e) {
  function t() {
    Module.calledRun ||
      ((Module.calledRun = !0),
      R ||
        ((Y = !0),
        z(K),
        z(V),
        Module.onRuntimeInitialized && Module.onRuntimeInitialized(),
        Module._main && $e && Module.callMain(e),
        (function() {
          if (Module.postRun)
            for (
              "function" == typeof Module.postRun &&
              (Module.postRun = [Module.postRun]);
              Module.postRun.length;

            )
              (e = Module.postRun.shift()), X.unshift(e);
          var e;
          z(X);
        })()));
  }
  (e = e || Module.arguments),
    re > 0 ||
      (!(function() {
        if (Module.preRun)
          for (
            "function" == typeof Module.preRun &&
            (Module.preRun = [Module.preRun]);
            Module.preRun.length;

          )
            Q(Module.preRun.shift());
        z(G);
      })(),
      re > 0 ||
        Module.calledRun ||
        (Module.setStatus
          ? (Module.setStatus("Running..."),
            setTimeout(function() {
              setTimeout(function() {
                Module.setStatus("");
              }, 1),
                t();
            }, 1))
          : t()));
}
function Oe(e, t) {
  (t && Module.noExitRuntime && 0 === e) ||
    (Module.noExitRuntime ||
      ((R = !0), e, !0, Module.onExit && Module.onExit(e)),
    Module.quit(e, new qe(e)));
}
function We(e) {
  throw (Module.onAbort && Module.onAbort(e),
  c((e += "")),
  f(e),
  (R = !0),
  1,
  "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.");
}
if (
  ((ue = function e() {
    Module.calledRun || Fe(), Module.calledRun || (ue = e);
  }),
  (Module.callMain = function(e) {
    try {
      Oe(Module._main(0, 0), !0);
    } catch (e) {
      if (e instanceof qe) return;
      if ("SimulateInfiniteLoop" == e) return void (Module.noExitRuntime = !0);
      var t = e;
      e && "object" == typeof e && e.stack && (t = [e, e.stack]),
        f("exception thrown: " + t),
        Module.quit(1, e);
    } finally {
      !0;
    }
  }),
  (Module.run = Fe),
  (Module.abort = We),
  Module.preInit)
)
  for (
    "function" == typeof Module.preInit && (Module.preInit = [Module.preInit]);
    Module.preInit.length > 0;

  )
    Module.preInit.pop()();
var $e = !0;
Module.noInitialRun && ($e = !1), (Module.noExitRuntime = !0), Fe();
const Ue = Module,
  je = {},
  De = 4,
  Be = 5 * De,
  He = 2 * De,
  Ze = 2 * De + 2 * He,
  ze = { row: 0, column: 0 },
  Ge = /[\w-.]*/g,
  Ke = 1,
  Ve = 2,
  Xe = /^_?tree_sitter_\w+/;
var Ye,
  Qe,
  Je,
  et,
  tt,
  nt = new Promise(e => {
    Module.onRuntimeInitialized = e;
  }).then(() => {
    (Je = Ue._ts_init()), (Ye = S(Je, "i32")), (Qe = S(Je + De, "i32"));
  });
class Parser {
  static init() {
    return nt;
  }
  constructor() {
    if (null == Je)
      throw new Error(
        "You must first call Parser.init() and wait for it to resolve."
      );
    Ue._ts_parser_new_wasm(),
      (this[0] = S(Je, "i32")),
      (this[1] = S(Je + De, "i32"));
  }
  delete() {
    Ue._ts_parser_delete(this[0]), Ue._free(this[1]);
  }
  setLanguage(e) {
    let t;
    if (e) {
      if (e.constructor !== Language)
        throw new Error("Argument must be a Language");
      {
        t = e[0];
        const n = Ue._ts_language_version(t);
        if (n < Qe || Ye < n)
          throw new Error(
            `Incompatible language version ${n}. ` +
              `Compatibility range ${Qe} through ${Ye}.`
          );
      }
    } else (t = 0), (e = null);
    return (this.language = e), Ue._ts_parser_set_language(this[0], t), this;
  }
  getLanguage() {
    return this.language;
  }
  parse(e, t, n) {
    if ("string" == typeof e) et = (t, n, r) => e.slice(t, r);
    else {
      if ("function" != typeof e)
        throw new Error("Argument must be a string or a function");
      et = e;
    }
    this.logCallback
      ? ((tt = this.logCallback), Ue._ts_parser_enable_logger_wasm(this[0], 1))
      : ((tt = null), Ue._ts_parser_enable_logger_wasm(this[0], 0));
    let r = 0,
      o = 0;
    if (n && n.includedRanges) {
      r = n.includedRanges.length;
      let e = (o = Ue._calloc(r, Ze));
      for (let t = 0; t < r; t++) ft(e, n.includedRanges[t]), (e += Ze);
    }
    const u = Ue._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, o, r);
    if (!u) throw ((et = null), (tt = null), new Error("Parsing failed"));
    const s = new Tree(je, u, this.language, et);
    return (et = null), (tt = null), s;
  }
  reset() {
    Ue._ts_parser_parse_wasm(this[0]);
  }
  setTimeoutMicros(e) {
    Ue._ts_parser_set_timeout_micros(this[0], e);
  }
  getTimeoutMicros(e) {
    Ue._ts_parser_timeout_micros(this[0]);
  }
  setLogger(e) {
    if (e) {
      if ("function" != typeof e)
        throw new Error("Logger callback must be a function");
    } else e = null;
    return (this.logCallback = e), this;
  }
  getLogger() {
    return this.logCallback;
  }
}
class Tree {
  constructor(e, t, n, r) {
    ut(e), (this[0] = t), (this.language = n), (this.textCallback = r);
  }
  copy() {
    const e = Ue._ts_tree_copy(this[0]);
    return new Tree(je, e, this.language, this.textCallback);
  }
  delete() {
    Ue._ts_tree_delete(this[0]);
  }
  edit(e) {
    !(function(e) {
      let t = Je;
      dt(t, e.startPosition),
        dt((t += He), e.oldEndPosition),
        dt((t += He), e.newEndPosition),
        I((t += He), e.startIndex, "i32"),
        I((t += De), e.oldEndIndex, "i32"),
        I((t += De), e.newEndIndex, "i32"),
        (t += De);
    })(e),
      Ue._ts_tree_edit_wasm(this[0]);
  }
  get rootNode() {
    return Ue._ts_tree_root_node_wasm(this[0]), it(this);
  }
  getLanguage() {
    return this.language;
  }
  walk() {
    return this.rootNode.walk();
  }
  getChangedRanges(e) {
    if (e.constructor !== Tree) throw new TypeError("Argument must be a Tree");
    Ue._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
    const t = S(Je, "i32"),
      n = S(Je + De, "i32"),
      r = new Array(t);
    if (t > 0) {
      let e = n;
      for (let n = 0; n < t; n++) (r[n] = pt(e)), (e += Ze);
      Ue._free(n);
    }
    return r;
  }
}
class Node {
  constructor(e, t) {
    ut(e), (this.tree = t);
  }
  get typeId() {
    return at(this), Ue._ts_node_symbol_wasm(this.tree);
  }
  get type() {
    return this.tree.language.types[this.typeId] || "ERROR";
  }
  get endPosition() {
    return at(this), Ue._ts_node_end_point_wasm(this.tree[0]), ct(Je);
  }
  get endIndex() {
    return at(this), Ue._ts_node_end_index_wasm(this.tree[0]);
  }
  get text() {
    return rt(this.tree, this.startIndex, this.endIndex);
  }
  isNamed() {
    return at(this), 1 === Ue._ts_node_is_named_wasm(this.tree[0]);
  }
  hasError() {
    return at(this), 1 === Ue._ts_node_has_error_wasm(this.tree[0]);
  }
  hasChanges() {
    return at(this), 1 === Ue._ts_node_has_changes_wasm(this.tree[0]);
  }
  isMissing() {
    return at(this), 1 === Ue._ts_node_is_missing_wasm(this.tree[0]);
  }
  equals(e) {
    if (this === e) return !0;
    for (let t = 0; t < 5; t++) if (this[t] !== e[t]) return !1;
    return !0;
  }
  child(e) {
    return at(this), Ue._ts_node_child_wasm(this.tree[0], e), it(this.tree);
  }
  namedChild(e) {
    return (
      at(this), Ue._ts_node_named_child_wasm(this.tree[0], e), it(this.tree)
    );
  }
  childForFieldId(e) {
    return (
      at(this),
      Ue._ts_node_child_by_field_id_wasm(this.tree[0], e),
      it(this.tree)
    );
  }
  childForFieldName(e) {
    const t = this.tree.language.fields.indexOf(e);
    if (-1 !== t) return this.childForFieldId(t);
  }
  get childCount() {
    return at(this), Ue._ts_node_child_count_wasm(this.tree[0]);
  }
  get namedChildCount() {
    return at(this), Ue._ts_node_named_child_count_wasm(this.tree[0]);
  }
  get firstChild() {
    return this.child(0);
  }
  get firstNamedChild() {
    return this.namedChild(0);
  }
  get lastChild() {
    return this.child(this.childCount - 1);
  }
  get lastNamedChild() {
    return this.namedChild(this.namedChildCount - 1);
  }
  get children() {
    if (!this._children) {
      at(this), Ue._ts_node_children_wasm(this.tree[0]);
      const e = S(Je, "i32"),
        t = S(Je + De, "i32");
      if (((this._children = new Array(e)), e > 0)) {
        let n = t;
        for (let t = 0; t < e; t++)
          (this._children[t] = it(this.tree, n)), (n += Be);
        Ue._free(t);
      }
    }
    return this._children;
  }
  get namedChildren() {
    if (!this._namedChildren) {
      at(this), Ue._ts_node_named_children_wasm(this.tree[0]);
      const e = S(Je, "i32"),
        t = S(Je + De, "i32");
      if (((this._namedChildren = new Array(e)), e > 0)) {
        let n = t;
        for (let t = 0; t < e; t++)
          (this._namedChildren[t] = it(this.tree, n)), (n += Be);
        Ue._free(t);
      }
    }
    return this._namedChildren;
  }
  descendantsOfType(e, t, n) {
    Array.isArray(e) || (e = [e]), t || (t = ze), n || (n = ze);
    const r = [],
      o = this.tree.language.types;
    for (let t = 0, n = o.length; t < n; t++) e.includes(o[t]) && r.push(t);
    const u = Ue._malloc(De * r.count);
    for (let e = 0, t = r.length; e < t; e++) I(u + e * De, r[e], "i32");
    at(this),
      Ue._ts_node_descendants_of_type_wasm(
        this.tree[0],
        u,
        r.length,
        t.row,
        t.column,
        n.row,
        n.column
      );
    const s = S(Je, "i32"),
      a = S(Je + De, "i32"),
      i = new Array(s);
    if (s > 0) {
      let e = a;
      for (let t = 0; t < s; t++) (i[t] = it(this.tree, e)), (e += Be);
    }
    return Ue._free(a), Ue._free(u), i;
  }
  get nextSibling() {
    return at(this), Ue._ts_node_next_sibling_wasm(this.tree[0]), it(this.tree);
  }
  get previousSibling() {
    return at(this), Ue._ts_node_prev_sibling_wasm(this.tree[0]), it(this.tree);
  }
  get nextNamedSibling() {
    return (
      at(this), Ue._ts_node_next_named_sibling_wasm(this.tree[0]), it(this.tree)
    );
  }
  get previousNamedSibling() {
    return (
      at(this), Ue._ts_node_prev_named_sibling_wasm(this.tree[0]), it(this.tree)
    );
  }
  get parent() {
    return at(this), Ue._ts_node_parent_wasm(this.tree[0]), it(this.tree);
  }
  descendantForIndex(e, t = e) {
    if ("number" != typeof e || "number" != typeof t)
      throw new Error("Arguments must be numbers");
    at(this);
    let n = Je + Be;
    return (
      I(n, e, "i32"),
      I(n + De, t, "i32"),
      Ue._ts_node_descendant_for_index_wasm(this.tree[0]),
      it(this.tree)
    );
  }
  namedDescendantForIndex(e, t = e) {
    if ("number" != typeof e || "number" != typeof t)
      throw new Error("Arguments must be numbers");
    at(this);
    let n = Je + Be;
    return (
      I(n, e, "i32"),
      I(n + De, t, "i32"),
      Ue._ts_node_named_descendant_for_index_wasm(this.tree[0]),
      it(this.tree)
    );
  }
  descendantForPosition(e, t = e) {
    if (!st(e) || !st(t))
      throw new Error("Arguments must be {row, column} objects");
    at(this);
    let n = Je + Be;
    return (
      dt(n, e),
      dt(n + He, t),
      Ue._ts_node_descendant_for_position_wasm(this.tree[0]),
      it(this.tree)
    );
  }
  namedDescendantForPosition(e, t = e) {
    if (!st(e) || !st(t))
      throw new Error("Arguments must be {row, column} objects");
    at(this);
    let n = Je + Be;
    return (
      dt(n, e),
      dt(n + He, t),
      Ue._ts_node_named_descendant_for_position_wasm(this.tree[0]),
      it(this.tree)
    );
  }
  walk() {
    return (
      at(this),
      Ue._ts_tree_cursor_new_wasm(this.tree[0]),
      new TreeCursor(je, this.tree)
    );
  }
  toString() {
    at(this);
    const e = Ue._ts_node_to_string_wasm(this.tree[0]),
      t = (function(e) {
        for (var t = ""; ; ) {
          var n = O[e++ >> 0];
          if (!n) return t;
          t += String.fromCharCode(n);
        }
      })(e);
    return Ue._free(e), t;
  }
}
class TreeCursor {
  constructor(e, t) {
    ut(e), (this.tree = t), _t(this);
  }
  delete() {
    lt(this), Ue._ts_tree_cursor_delete_wasm(this.tree[0]);
  }
  reset(e) {
    at(e),
      lt(this, Je + Be),
      Ue._ts_tree_cursor_reset_wasm(this.tree[0]),
      _t(this);
  }
  get nodeType() {
    return this.tree.language.types[this.nodeTypeId] || "ERROR";
  }
  get nodeTypeId() {
    return lt(this), Ue._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
  }
  get nodeId() {
    return lt(this), Ue._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
  }
  get nodeIsNamed() {
    return (
      lt(this),
      1 === Ue._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])
    );
  }
  get nodeIsMissing() {
    return (
      lt(this),
      1 === Ue._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])
    );
  }
  get nodeText() {
    lt(this);
    const e = Ue._ts_tree_cursor_start_index_wasm(this.tree[0]),
      t = Ue._ts_tree_cursor_end_index_wasm(this.tree[0]);
    return rt(this.tree, e, t);
  }
  get startPosition() {
    return (
      lt(this), Ue._ts_tree_cursor_start_position_wasm(this.tree[0]), ct(Je)
    );
  }
  get endPosition() {
    return lt(this), Ue._ts_tree_cursor_end_position_wasm(this.tree[0]), ct(Je);
  }
  get startIndex() {
    return lt(this), Ue._ts_tree_cursor_start_index_wasm(this.tree[0]);
  }
  get endIndex() {
    return lt(this), Ue._ts_tree_cursor_end_index_wasm(this.tree[0]);
  }
  currentNode() {
    return (
      lt(this),
      Ue._ts_tree_cursor_current_node_wasm(this.tree[0]),
      it(this.tree)
    );
  }
  currentFieldId() {
    return lt(this), Ue._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
  }
  currentFieldName() {
    return this.tree.language.fields[this.currentFieldId()];
  }
  gotoFirstChild() {
    lt(this);
    const e = Ue._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
    return _t(this), 1 === e;
  }
  gotoNextSibling() {
    lt(this);
    const e = Ue._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
    return _t(this), 1 === e;
  }
  gotoParent() {
    lt(this);
    const e = Ue._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
    return _t(this), 1 === e;
  }
}
class Language {
  constructor(e, t) {
    ut(e),
      (this[0] = t),
      (this.types = new Array(Ue._ts_language_symbol_count(this[0])));
    for (let e = 0, t = this.types.length; e < t; e++)
      Ue._ts_language_symbol_type(this[0], e) < 2 &&
        (this.types[e] = L(Ue._ts_language_symbol_name(this[0], e)));
    this.fields = new Array(Ue._ts_language_field_count(this[0]) + 1);
    for (let e = 0, t = this.fields.length; e < t; e++) {
      const t = Ue._ts_language_field_name_for_id(this[0], e);
      this.fields[e] = 0 !== t ? L(t) : null;
    }
  }
  get version() {
    return Ue._ts_language_version(this[0]);
  }
  get fieldCount() {
    return this.fields.length - 1;
  }
  fieldIdForName(e) {
    const t = this.fields.indexOf(e);
    return -1 !== t ? t : null;
  }
  fieldNameForId(e) {
    return this.fields[e] || null;
  }
  query(e) {
    const t = (function(e) {
        for (var t = 0, n = 0; n < e.length; ++n) {
          var r = e.charCodeAt(n);
          r >= 55296 &&
            r <= 57343 &&
            (r = (65536 + ((1023 & r) << 10)) | (1023 & e.charCodeAt(++n))),
            r <= 127 ? ++t : (t += r <= 2047 ? 2 : r <= 65535 ? 3 : 4);
        }
        return t;
      })(e),
      n = Ue._malloc(t + 1);
    (function(e, t, n, r) {
      if (!(r > 0)) return 0;
      for (var o = n, u = n + r - 1, s = 0; s < e.length; ++s) {
        var a = e.charCodeAt(s);
        if (
          (a >= 55296 &&
            a <= 57343 &&
            (a = (65536 + ((1023 & a) << 10)) | (1023 & e.charCodeAt(++s))),
          a <= 127)
        ) {
          if (n >= u) break;
          t[n++] = a;
        } else if (a <= 2047) {
          if (n + 1 >= u) break;
          (t[n++] = 192 | (a >> 6)), (t[n++] = 128 | (63 & a));
        } else if (a <= 65535) {
          if (n + 2 >= u) break;
          (t[n++] = 224 | (a >> 12)),
            (t[n++] = 128 | ((a >> 6) & 63)),
            (t[n++] = 128 | (63 & a));
        } else {
          if (n + 3 >= u) break;
          (t[n++] = 240 | (a >> 18)),
            (t[n++] = 128 | ((a >> 12) & 63)),
            (t[n++] = 128 | ((a >> 6) & 63)),
            (t[n++] = 128 | (63 & a));
        }
      }
      t[n] = 0;
    })(e, O, n, t + 1);
    const r = Ue._ts_query_new(this[0], n, t, Je, Je + De);
    if (!r) {
      const t = S(Je + De, "i32"),
        r = L(n, S(Je, "i32")).length,
        o = e.substr(r, 100),
        u = o.match(Ge)[0];
      let s;
      switch (t) {
        case 2:
          s = new RangeError(`Bad node name '${u}'`);
          break;
        case 3:
          s = new RangeError(`Bad field name '${u}'`);
          break;
        case 4:
          s = new RangeError(`Bad capture name @${u}`);
          break;
        default:
          s = new SyntaxError(`Bad syntax at offset ${r}: '${o}'...`);
      }
      throw ((s.index = r), (s.length = u.length), Ue._free(n), s);
    }
    const o = Ue._ts_query_string_count(r),
      u = Ue._ts_query_capture_count(r),
      s = Ue._ts_query_pattern_count(r),
      a = new Array(u),
      i = new Array(o);
    for (let e = 0; e < u; e++) {
      const t = Ue._ts_query_capture_name_for_id(r, e, Je),
        n = S(Je, "i32");
      a[e] = L(t, n);
    }
    for (let e = 0; e < o; e++) {
      const t = Ue._ts_query_string_value_for_id(r, e, Je),
        n = S(Je, "i32");
      i[e] = L(t, n);
    }
    const l = new Array(s),
      _ = new Array(s),
      d = new Array(s),
      c = new Array(s);
    for (let e = 0; e < s; e++) {
      const t = Ue._ts_query_predicates_for_pattern(r, e, Je),
        n = S(Je, "i32");
      c[e] = [];
      const o = [];
      let u = t;
      for (let t = 0; t < n; t++) {
        const t = S(u, "i32"),
          n = S((u += De), "i32");
        if (((u += De), t === Ke)) o.push({ type: "capture", name: a[n] });
        else if (t === Ve) o.push({ type: "string", value: i[n] });
        else if (o.length > 0) {
          if ("string" !== o[0].type)
            throw new Error("Predicates must begin with a literal value");
          const t = o[0].value;
          switch (t) {
            case "eq?":
              if (3 !== o.length)
                throw new Error(
                  `Wrong number of arguments to \`eq?\` predicate. Expected 2, got ${o.length -
                    1}`
                );
              if ("capture" !== o[1].type)
                throw new Error(
                  `First argument of \`eq?\` predicate must be a capture. Got "${o[1].value}"`
                );
              if ("capture" === o[2].type) {
                const t = o[1].name,
                  n = o[2].name;
                c[e].push(function(e) {
                  let r, o;
                  for (const u of e)
                    u.name === t && (r = u.node), u.name === n && (o = u.node);
                  return r.text === o.text;
                });
              } else {
                const t = o[1].name,
                  n = o[2].value;
                c[e].push(function(e) {
                  for (const r of e) if (r.name === t) return r.node.text === n;
                  return !1;
                });
              }
              break;
            case "match?":
              if (3 !== o.length)
                throw new Error(
                  `Wrong number of arguments to \`match?\` predicate. Expected 2, got ${o.length -
                    1}.`
                );
              if ("capture" !== o[1].type)
                throw new Error(
                  `First argument of \`match?\` predicate must be a capture. Got "${o[1].value}".`
                );
              if ("string" !== o[2].type)
                throw new Error(
                  `Second argument of \`match?\` predicate must be a string. Got @${o[2].value}.`
                );
              const n = o[1].name,
                r = new RegExp(o[2].value);
              c[e].push(function(e) {
                for (const t of e) if (t.name === n) return r.test(t.node.text);
                return !1;
              });
              break;
            case "set!":
              if (o.length < 2 || o.length > 3)
                throw new Error(
                  `Wrong number of arguments to \`set!\` predicate. Expected 1 or 2. Got ${o.length -
                    1}.`
                );
              if (o.some(e => "string" !== e.type))
                throw new Error(
                  'Arguments to `set!` predicate must be a strings.".'
                );
              l[e] || (l[e] = {}),
                (l[e][o[1].value] = o[2] ? o[2].value : null);
              break;
            case "is?":
            case "is-not?":
              if (o.length < 2 || o.length > 3)
                throw new Error(
                  `Wrong number of arguments to \`${t}\` predicate. Expected 1 or 2. Got ${o.length -
                    1}.`
                );
              if (o.some(e => "string" !== e.type))
                throw new Error(
                  `Arguments to \`${t}\` predicate must be a strings.".`
                );
              const u = "is?" === t ? _ : d;
              u[e] || (u[e] = {}),
                (u[e][o[1].value] = o[2] ? o[2].value : null);
              break;
            default:
              throw new Error(`Unknown query predicate \`${o[0].value}\``);
          }
          o.length = 0;
        }
      }
      Object.freeze(l[e]), Object.freeze(_[e]), Object.freeze(d[e]);
    }
    return (
      Ue._free(n),
      new Query(
        je,
        r,
        a,
        c,
        Object.freeze(l),
        Object.freeze(_),
        Object.freeze(d)
      )
    );
  }
  static load(e) {
    let t;
    if (
      "undefined" != typeof process &&
      process.versions &&
      process.versions.node
    ) {
      const n = require("fs");
      t = Promise.resolve(n.readFileSync(e));
    } else
      t = fetch(e).then(e =>
        e.arrayBuffer().then(t => {
          if (e.ok) return new Uint8Array(t);
          {
            const n = new TextDecoder("utf-8").decode(t);
            throw new Error(
              `Language.load failed with status ${e.status}.\n\n${n}`
            );
          }
        })
      );
    return t
      .then(e => b(e, { loadAsync: !0 }))
      .then(e => {
        const t = e[
          Object.keys(e).find(
            e => Xe.test(e) && !e.includes("external_scanner_")
          )
        ]();
        return new Language(je, t);
      });
  }
}
class Query {
  constructor(e, t, n, r, o, u, s) {
    ut(e),
      (this[0] = t),
      (this.captureNames = n),
      (this.predicates = r),
      (this.setProperties = o),
      (this.assertedProperties = u),
      (this.refutedProperties = s);
  }
  delete() {
    Ue._ts_query_delete(this[0]);
  }
  matches(e, t, n) {
    t || (t = ze),
      n || (n = ze),
      at(e),
      Ue._ts_query_matches_wasm(
        this[0],
        e.tree[0],
        t.row,
        t.column,
        n.row,
        n.column
      );
    const r = S(Je, "i32"),
      o = S(Je + De, "i32"),
      u = new Array(r);
    let s = o;
    for (let t = 0; t < r; t++) {
      const n = S(s, "i32"),
        r = S((s += De), "i32");
      s += De;
      const o = new Array(r);
      if (((s = ot(this, e.tree, s, o)), this.predicates[n].every(e => e(o)))) {
        u[t] = { pattern: n, captures: o };
        const e = this.setProperties[n];
        e && (u[t].setProperties = e);
        const r = this.assertedProperties[n];
        r && (u[t].assertedProperties = r);
        const s = this.refutedProperties[n];
        s && (u[t].refutedProperties = s);
      }
    }
    return Ue._free(o), u;
  }
  captures(e, t, n) {
    t || (t = ze),
      n || (n = ze),
      at(e),
      Ue._ts_query_captures_wasm(
        this[0],
        e.tree[0],
        t.row,
        t.column,
        n.row,
        n.column
      );
    const r = S(Je, "i32"),
      o = S(Je + De, "i32"),
      u = [],
      s = [];
    let a = o;
    for (let t = 0; t < r; t++) {
      const t = S(a, "i32"),
        n = S((a += De), "i32"),
        r = S((a += De), "i32");
      if (
        ((a += De),
        (s.length = n),
        (a = ot(this, e.tree, a, s)),
        this.predicates[t].every(e => e(s)))
      ) {
        const e = s[r],
          n = this.setProperties[t];
        n && (e.setProperties = n);
        const o = this.assertedProperties[t];
        o && (e.assertedProperties = o);
        const a = this.refutedProperties[t];
        a && (e.refutedProperties = a), u.push(e);
      }
    }
    return Ue._free(o), u;
  }
}
function rt(e, t, n) {
  const r = n - t;
  let o = e.textCallback(t, null, n);
  for (t += o.length; t < n; ) {
    const r = e.textCallback(t, null, n);
    if (!(r && r.length > 0)) break;
    (t += r.length), (o += r);
  }
  return t > n && (o = o.slice(0, r)), o;
}
function ot(e, t, n, r) {
  for (let o = 0, u = r.length; o < u; o++) {
    const u = S(n, "i32"),
      s = it(t, (n += De));
    (n += Be), (r[o] = { name: e.captureNames[u], node: s });
  }
  return n;
}
function ut(e) {
  if (e !== je) throw new Error("Illegal constructor");
}
function st(e) {
  return e && "number" == typeof e.row && "number" == typeof e.column;
}
function at(e) {
  let t = Je;
  I(t, e.id, "i32"),
    I((t += De), e.startIndex, "i32"),
    I((t += De), e.startPosition.row, "i32"),
    I((t += De), e.startPosition.column, "i32"),
    I((t += De), e[0], "i32");
}
function it(e, t = Je) {
  const n = S(t, "i32");
  if (0 === n) return null;
  const r = S((t += De), "i32"),
    o = S((t += De), "i32"),
    u = S((t += De), "i32"),
    s = S((t += De), "i32"),
    a = new Node(je, e);
  return (
    (a.id = n),
    (a.startIndex = r),
    (a.startPosition = { row: o, column: u }),
    (a[0] = s),
    a
  );
}
function lt(e, t = Je) {
  I(t + 0 * De, e[0], "i32"),
    I(t + 1 * De, e[1], "i32"),
    I(t + 2 * De, e[2], "i32");
}
function _t(e) {
  (e[0] = S(Je + 0 * De, "i32")),
    (e[1] = S(Je + 1 * De, "i32")),
    (e[2] = S(Je + 2 * De, "i32"));
}
function dt(e, t) {
  I(e, t.row, "i32"), I(e + De, t.column, "i32");
}
function ct(e) {
  return { row: S(e, "i32"), column: S(e + De, "i32") };
}
function ft(e, t) {
  dt(e, t.startPosition),
    dt((e += He), t.endPosition),
    I((e += He), t.startIndex, "i32"),
    I((e += De), t.endIndex, "i32"),
    (e += De);
}
function pt(e) {
  const t = {};
  return (
    (t.startPosition = ct(e)),
    (e += He),
    (t.endPosition = ct(e)),
    (e += He),
    (t.startIndex = S(e, "i32")),
    (e += De),
    (t.endIndex = S(e, "i32")),
    t
  );
}
Parser.Language = Language;
export default Parser;
