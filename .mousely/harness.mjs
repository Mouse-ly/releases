#!/usr/bin/env node
import { createRequire as __mouselyCreateRequire } from 'node:module';
const require = __mouselyCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a2;
        return (_a2 = this._str) !== null && _a2 !== void 0 ? _a2 : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a2;
        return (_a2 = this._names) !== null && _a2 !== void 0 ? _a2 : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a2, _b;
        if (((_b = (_a2 = this._parent) === null || _a2 === void 0 ? void 0 : _a2._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a2;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a2 = value.key) !== null && _a2 !== void 0 ? _a2 : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants2) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants2);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants2) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants2);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants2) {
        this.code = optimizeExpr(this.code, names, constants2);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants2) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants2))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants2) {
        var _a2;
        this.else = (_a2 = this.else) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants2);
        if (!(super.optimizeNames(names, constants2) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants2);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants2) {
        if (!super.optimizeNames(names, constants2))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants2);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants2) {
        if (!super.optimizeNames(names, constants2))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants2);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a2, _b;
        super.optimizeNodes();
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants2) {
        var _a2, _b;
        super.optimizeNames(names, constants2);
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants2);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants2);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants2) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants2[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants2[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a2;
      return schema[rule.keyword] !== void 0 || ((_a2 = rule.definition.implements) === null || _a2 === void 0 ? void 0 : _a2.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types2 = getJSONTypes(schema.type);
      const hasNull = types2.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types2.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types2.push("null");
      }
      return types2;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types2 = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types2.every(rules_1.isJSONType))
        return types2;
      throw new Error("type must be JSONType or JSONType[]: " + types2.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types2) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types2, opts.coerceTypes);
      const checkTypes = types2.length > 0 && !(coerceTo.length === 0 && types2.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types2[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types2, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types2, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types2, coerceTypes) {
      return coerceTypes ? types2.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types2, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types2, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types2 = (0, util_1.toHash)(dataTypes);
      if (types2.array && types2.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types2.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types2.null;
        delete types2.array;
        delete types2.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types2.number)
        delete types2.integer;
      for (const t in types2)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a2;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a3;
        gen.if((0, codegen_1.not)((_a3 = def.valid) !== null && _a3 !== void 0 ? _a3 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types2 = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types2);
      schemaKeywords(it, types2, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types2, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types2);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types2.length === 1 && types2[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types2) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types2);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types2);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types2) {
      if (!types2.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types2;
        return;
      }
      types2.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types2);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a2;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a2 = env.baseId) !== null && _a2 !== void 0 ? _a2 : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a2;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a2 = root.localRefs) === null || _a2 === void 0 ? void 0 : _a2[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a2;
      if (((_a2 = parsedRef.fragment) === null || _a2 === void 0 ? void 0 : _a2[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function consumeIsZone(buffer) {
      buffer.length = 0;
      return true;
    }
    function consumeHextets(buffer, address, output) {
      if (buffer.length) {
        const hex = stringArrayToHexStripped(buffer);
        if (hex !== "") {
          address.push(hex);
        } else {
          output.error = true;
          return false;
        }
        buffer.length = 0;
      }
      return true;
    }
    function getIPV6(input) {
      let tokenCount = 0;
      const output = { error: false, address: "", zone: "" };
      const address = [];
      const buffer = [];
      let endipv6Encountered = false;
      let endIpv6 = false;
      let consume = consumeHextets;
      for (let i = 0; i < input.length; i++) {
        const cursor = input[i];
        if (cursor === "[" || cursor === "]") {
          continue;
        }
        if (cursor === ":") {
          if (endipv6Encountered === true) {
            endIpv6 = true;
          }
          if (!consume(buffer, address, output)) {
            break;
          }
          if (++tokenCount > 7) {
            output.error = true;
            break;
          }
          if (i > 0 && input[i - 1] === ":") {
            endipv6Encountered = true;
          }
          address.push(":");
          continue;
        } else if (cursor === "%") {
          if (!consume(buffer, address, output)) {
            break;
          }
          consume = consumeIsZone;
        } else {
          buffer.push(cursor);
          continue;
        }
      }
      if (buffer.length) {
        if (consume === consumeIsZone) {
          output.zone = buffer.join("");
        } else if (endIpv6) {
          address.push(buffer.join(""));
        } else {
          address.push(stringArrayToHexStripped(buffer));
        }
      }
      output.address = address.join("");
      return output;
    }
    function normalizeIPv6(host) {
      if (findToken(host, ":") < 2) {
        return { host, isIPV6: false };
      }
      const ipv6 = getIPV6(host);
      if (!ipv6.error) {
        let newHost = ipv6.address;
        let escapedHost = ipv6.address;
        if (ipv6.zone) {
          newHost += "%" + ipv6.zone;
          escapedHost += "%25" + ipv6.zone;
        }
        return { host: newHost, isIPV6: true, escapedHost };
      } else {
        return { host, isIPV6: false };
      }
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path11) {
      let input = path11;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(input[i])) {
          output += input[i];
        } else {
          output += escape(input[i]);
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(component.userinfo);
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = unescape(component.host);
        if (!isIPv4(host)) {
          const ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        uriTokens.push(":");
        uriTokens.push(String(component.port));
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      escapePreservingEscapes,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const [path11, query] = wsComponent.resourceName.split("?");
        wsComponent.path = path11 && path11 !== "/" ? path11 : void 0;
        wsComponent.query = query;
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed } = parseWithStatus(baseURI, schemelessOptions);
      const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse(serialize(base, options), options);
        relative = parse(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = escapePreservingEscapes(component.path);
          if (component.scheme !== void 0) {
            component.path = component.path.split("%3A").join(":");
          }
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", component.query);
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", component.fragment);
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const ipv6result = normalizeIPv6(parsed.host);
            parsed.host = ipv6result.host.toLowerCase();
            isIP = ipv6result.isIPV6;
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
          if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
            try {
              parsed.host = new URL("http://" + parsed.host).hostname;
            } catch (e) {
              parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
            }
          }
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (uri.indexOf("%") !== -1) {
            if (parsed.scheme !== void 0) {
              parsed.scheme = unescape(parsed.scheme);
            }
            if (parsed.host !== void 0) {
              parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
            }
          }
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.fragment) {
            try {
              parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
            } catch {
              parsed.error = parsed.error || "URI malformed";
            }
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort };
    }
    function parse(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri === "string") {
        const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
        return malformedAuthorityOrPort ? void 0 : normalized;
      }
      if (typeof uri === "object") {
        return serialize(uri, opts);
      }
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve,
      resolveComponent,
      equal,
      serialize,
      parse
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a2 = o.code) === null || _a2 === void 0 ? void 0 : _a2.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    exports.default = Ajv;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a2;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a2 = definition.implements) === null || _a2 === void 0 ? void 0 : _a2.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a2;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a2 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a2 === void 0 ? void 0 : _a2.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS({
  "node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicAnchor = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicAnchor",
      schemaType: "string",
      code: (cxt) => dynamicAnchor(cxt, cxt.schema)
    };
    function dynamicAnchor(cxt, anchor) {
      const { gen, it } = cxt;
      it.schemaEnv.root.dynamicAnchors[anchor] = true;
      const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
      const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
      gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
    }
    exports.dynamicAnchor = dynamicAnchor;
    function _getValidate(cxt) {
      const { schemaEnv, schema, self } = cxt.it;
      const { root, baseId, localRefs, meta } = schemaEnv.root;
      const { schemaId } = self.opts;
      const sch = new compile_1.SchemaEnv({ schema, schemaId, root, baseId, localRefs, meta });
      compile_1.compileSchema.call(self, sch);
      return (0, ref_1.getValidate)(cxt, sch);
    }
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS({
  "node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicRef = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicRef",
      schemaType: "string",
      code: (cxt) => dynamicRef(cxt, cxt.schema)
    };
    function dynamicRef(cxt, ref) {
      const { gen, keyword, it } = cxt;
      if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
      const anchor = ref.slice(1);
      if (it.allErrors) {
        _dynamicRef();
      } else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
      }
      function _dynamicRef(valid) {
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
          const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
          gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        } else {
          _callRef(it.validateName, valid)();
        }
      }
      function _callRef(validate, valid) {
        return valid ? () => gen.block(() => {
          (0, ref_1.callRef)(cxt, validate);
          gen.let(valid, true);
        }) : () => (0, ref_1.callRef)(cxt, validate);
      }
    }
    exports.dynamicRef = dynamicRef;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS({
  "node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var util_1 = require_util();
    var def = {
      keyword: "$recursiveAnchor",
      schemaType: "boolean",
      code(cxt) {
        if (cxt.schema)
          (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
          (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS({
  "node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicRef_1 = require_dynamicRef();
    var def = {
      keyword: "$recursiveRef",
      schemaType: "string",
      code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS({
  "node_modules/ajv/dist/vocabularies/dynamic/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var dynamicRef_1 = require_dynamicRef();
    var recursiveAnchor_1 = require_recursiveAnchor();
    var recursiveRef_1 = require_recursiveRef();
    var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
    exports.default = dynamic;
  }
});

// node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/dependentRequired.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentRequired",
      type: "object",
      schemaType: "object",
      error: dependencies_1.error,
      code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentSchemas",
      type: "object",
      schemaType: "object",
      code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitContains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }) {
        if (parentSchema.contains === void 0) {
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS({
  "node_modules/ajv/dist/vocabularies/next.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependentRequired_1 = require_dependentRequired();
    var dependentSchemas_1 = require_dependentSchemas();
    var limitContains_1 = require_limitContains();
    var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
    exports.default = next;
  }
});

// node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var error = {
      message: "must NOT have unevaluated properties",
      params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
    };
    var def = {
      keyword: "unevaluatedProperties",
      type: "object",
      schemaType: ["boolean", "object"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, props } = it;
        if (props instanceof codegen_1.Name) {
          gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
        } else if (props !== true) {
          gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
        }
        it.props = true;
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function unevaluatedPropCode(key) {
          if (schema === false) {
            cxt.setParams({ unevaluatedProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (!(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            cxt.subschema({
              keyword: "unevaluatedProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            }, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
        function unevaluatedDynamic(evaluatedProps, key) {
          return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
        }
        function unevaluatedStatic(evaluatedProps, key) {
          const ps = [];
          for (const p in evaluatedProps) {
            if (evaluatedProps[p] === true)
              ps.push((0, codegen_1._)`${key} !== ${p}`);
          }
          return (0, codegen_1.and)(...ps);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "unevaluatedItems",
      type: "array",
      schemaType: ["boolean", "object"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        const items = it.items || 0;
        if (items === true)
          return;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items });
          cxt.fail((0, codegen_1._)`${len} > ${items}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
          cxt.ok(valid);
        }
        it.items = true;
        function validateItems(valid, from) {
          gen.forRange("i", from, len, (i) => {
            cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS({
  "node_modules/ajv/dist/vocabularies/unevaluated/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unevaluatedProperties_1 = require_unevaluatedProperties();
    var unevaluatedItems_1 = require_unevaluatedItems();
    var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
    exports.default = unevaluated;
  }
});

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = __commonJS({
  "node_modules/ajv/dist/vocabularies/draft2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var dynamic_1 = require_dynamic();
    var next_1 = require_next();
    var unevaluated_1 = require_unevaluated();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft2020Vocabularies = [
      dynamic_1.default,
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(true),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
      next_1.default,
      unevaluated_1.default
    ];
    exports.default = draft2020Vocabularies;
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a2;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a2 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a2 === void 0 ? void 0 : _a2[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var require_schema = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/schema.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/schema",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true,
        "https://json-schema.org/draft/2020-12/vocab/applicator": true,
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
        "https://json-schema.org/draft/2020-12/vocab/validation": true,
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Core and Validation specifications meta-schema",
      allOf: [
        { $ref: "meta/core" },
        { $ref: "meta/applicator" },
        { $ref: "meta/unevaluated" },
        { $ref: "meta/validation" },
        { $ref: "meta/meta-data" },
        { $ref: "meta/format-annotation" },
        { $ref: "meta/content" }
      ],
      type: ["object", "boolean"],
      $comment: "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
      properties: {
        definitions: {
          $comment: '"definitions" has been replaced by "$defs".',
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          deprecated: true,
          default: {}
        },
        dependencies: {
          $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
          type: "object",
          additionalProperties: {
            anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }]
          },
          deprecated: true,
          default: {}
        },
        $recursiveAnchor: {
          $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
          $ref: "meta/core#/$defs/anchorString",
          deprecated: true
        },
        $recursiveRef: {
          $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
          $ref: "meta/core#/$defs/uriReferenceString",
          deprecated: true
        }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var require_applicator2 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/applicator",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/applicator": true
      },
      $dynamicAnchor: "meta",
      title: "Applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        prefixItems: { $ref: "#/$defs/schemaArray" },
        items: { $dynamicRef: "#meta" },
        contains: { $dynamicRef: "#meta" },
        additionalProperties: { $dynamicRef: "#meta" },
        properties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependentSchemas: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        propertyNames: { $dynamicRef: "#meta" },
        if: { $dynamicRef: "#meta" },
        then: { $dynamicRef: "#meta" },
        else: { $dynamicRef: "#meta" },
        allOf: { $ref: "#/$defs/schemaArray" },
        anyOf: { $ref: "#/$defs/schemaArray" },
        oneOf: { $ref: "#/$defs/schemaArray" },
        not: { $dynamicRef: "#meta" }
      },
      $defs: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $dynamicRef: "#meta" }
        }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var require_unevaluated2 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/unevaluated",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
      },
      $dynamicAnchor: "meta",
      title: "Unevaluated applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        unevaluatedItems: { $dynamicRef: "#meta" },
        unevaluatedProperties: { $dynamicRef: "#meta" }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var require_content = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/content",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Content vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        contentEncoding: { type: "string" },
        contentMediaType: { type: "string" },
        contentSchema: { $dynamicRef: "#meta" }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var require_core3 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/core",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true
      },
      $dynamicAnchor: "meta",
      title: "Core vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        $id: {
          $ref: "#/$defs/uriReferenceString",
          $comment: "Non-empty fragments not allowed.",
          pattern: "^[^#]*#?$"
        },
        $schema: { $ref: "#/$defs/uriString" },
        $ref: { $ref: "#/$defs/uriReferenceString" },
        $anchor: { $ref: "#/$defs/anchorString" },
        $dynamicRef: { $ref: "#/$defs/uriReferenceString" },
        $dynamicAnchor: { $ref: "#/$defs/anchorString" },
        $vocabulary: {
          type: "object",
          propertyNames: { $ref: "#/$defs/uriString" },
          additionalProperties: {
            type: "boolean"
          }
        },
        $comment: {
          type: "string"
        },
        $defs: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" }
        }
      },
      $defs: {
        anchorString: {
          type: "string",
          pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
        },
        uriString: {
          type: "string",
          format: "uri"
        },
        uriReferenceString: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var require_format_annotation = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/format-annotation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
      },
      $dynamicAnchor: "meta",
      title: "Format vocabulary meta-schema for annotation results",
      type: ["object", "boolean"],
      properties: {
        format: { type: "string" }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var require_meta_data = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/meta-data",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true
      },
      $dynamicAnchor: "meta",
      title: "Meta-data vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        deprecated: {
          type: "boolean",
          default: false
        },
        readOnly: {
          type: "boolean",
          default: false
        },
        writeOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var require_validation2 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/validation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/validation": true
      },
      $dynamicAnchor: "meta",
      title: "Validation vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        type: {
          anyOf: [
            { $ref: "#/$defs/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/$defs/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        const: true,
        enum: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/$defs/nonNegativeInteger" },
        minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        maxItems: { $ref: "#/$defs/nonNegativeInteger" },
        minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        maxContains: { $ref: "#/$defs/nonNegativeInteger" },
        minContains: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 1
        },
        maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
        minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        required: { $ref: "#/$defs/stringArray" },
        dependentRequired: {
          type: "object",
          additionalProperties: {
            $ref: "#/$defs/stringArray"
          }
        }
      },
      $defs: {
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 0
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      }
    };
  }
});

// node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-2020-12/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var metaSchema = require_schema();
    var applicator = require_applicator2();
    var unevaluated = require_unevaluated2();
    var content = require_content();
    var core = require_core3();
    var format = require_format_annotation();
    var metadata = require_meta_data();
    var validation = require_validation2();
    var META_SUPPORT_DATA = ["/properties"];
    function addMetaSchema2020($data) {
      ;
      [
        metaSchema,
        applicator,
        unevaluated,
        content,
        core,
        with$data(this, format),
        metadata,
        with$data(this, validation)
      ].forEach((sch) => this.addMetaSchema(sch, void 0, false));
      return this;
      function with$data(ajv2, sch) {
        return $data ? ajv2.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
      }
    }
    exports.default = addMetaSchema2020;
  }
});

// node_modules/ajv/dist/2020.js
var require__ = __commonJS({
  "node_modules/ajv/dist/2020.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
    var core_1 = require_core();
    var draft2020_1 = require_draft2020();
    var discriminator_1 = require_discriminator();
    var json_schema_2020_12_1 = require_json_schema_2020_12();
    var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
    var Ajv20202 = class extends core_1.default {
      constructor(opts = {}) {
        super({
          ...opts,
          dynamicRef: true,
          next: true,
          unevaluated: true
        });
      }
      _addVocabularies() {
        super._addVocabularies();
        draft2020_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data, meta } = this.opts;
        if (!meta)
          return;
        json_schema_2020_12_1.default.call(this, $data);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv2020 = Ajv20202;
    module.exports = exports = Ajv20202;
    module.exports.Ajv2020 = Ajv20202;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv20202;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv;
    module.exports = exports = Ajv;
    module.exports.Ajv = Ajv;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv2) => {
      ajv2.addKeyword(exports.formatLimitDefinition);
      return ajv2;
    };
    exports.default = formatLimitPlugin;
  }
});

// node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "node_modules/ajv-formats/dist/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv2, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats2(ajv2, opts, formats_1.fullFormats, fullName);
        return ajv2;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats2(ajv2, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv2);
      return ajv2;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats2(ajv2, list, fs, exportName) {
      var _a2;
      var _b;
      (_a2 = (_b = ajv2.opts.code).formats) !== null && _a2 !== void 0 ? _a2 : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv2.addFormat(f, fs[f]);
    }
    module.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path11) {
      const ctrl = callVisitor(key, node, visitor, path11);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path11, ctrl);
        return visit_(key, ctrl, visitor, path11);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path11 = Object.freeze(path11.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path11);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path11 = Object.freeze(path11.concat(node));
          const ck = visit_("key", node.key, visitor, path11);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path11);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path11) {
      const ctrl = await callVisitor(key, node, visitor, path11);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path11, ctrl);
        return visitAsync_(key, ctrl, visitor, path11);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path11 = Object.freeze(path11.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path11);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path11 = Object.freeze(path11.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path11);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path11);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path11) {
      if (typeof visitor === "function")
        return visitor(key, node, path11);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path11);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path11);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path11);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path11);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path11);
      return void 0;
    }
    function replaceNode(key, path11, node) {
      const parent = path11[path11.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match2 = tags.filter((t) => t.tag === tagName);
        const tagObj = match2.find((t) => !t.format) ?? match2[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path11, value) {
      let v = value;
      for (let i = path11.length - 1; i >= 0; --i) {
        const k = path11[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path11) => path11 == null || typeof path11 === "object" && !!path11[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path11, value) {
        if (isEmptyPath(path11))
          this.add(value);
        else {
          const [key, ...rest] = path11;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path11) {
        const [key, ...rest] = path11;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path11, keepScalar) {
        const [key, ...rest] = path11;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path11) {
        const [key, ...rest] = path11;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path11, value) {
        const [key, ...rest] = path11;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match2 = tags.filter((t) => t.tag === item.tag);
        if (match2.length > 0)
          return match2.find((t) => t.format === item.format) ?? match2[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match2 = tags.filter((t) => t.identify?.(obj));
        if (match2.length > 1) {
          const testMatch = match2.filter((t) => t.test);
          if (testMatch.length > 0)
            match2 = testMatch;
        }
        tagObj = match2.find((t) => t.format === item.format) ?? match2.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match2 = str.match(timestamp.test);
        if (!match2)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match2.map(Number);
        const millisec = match2[7] ? Number((match2[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match2[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema4 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema2();
    var schema$1 = require_schema3();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema4();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path11, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path11, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path11) {
        if (Collection.isEmptyPath(path11)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path11) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path11, keepScalar) {
        if (Collection.isEmptyPath(path11))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path11, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path11) {
        if (Collection.isEmptyPath(path11))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path11) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path11, value) {
        if (Collection.isEmptyPath(path11)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path11), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path11, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors2 = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep: sep2, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep2) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep2 ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep2, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep2 = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep2 + cb;
              sep2 = "";
              break;
            }
            case "newline":
              if (comment)
                sep2 += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep: sep2, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep2 && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep2 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep2, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep2 ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep2)
                for (const st of sep2) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep2, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep2 = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep2 === " ")
            sep2 = "\n";
          else if (!prevMoreIndented && sep2 === "\n")
            sep2 = "\n\n";
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep2 === "\n")
            value += "\n";
          else
            sep2 = "\n";
        } else {
          value += sep2 + content;
          sep2 = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match2 = first.exec(source);
      if (!match2)
        return source;
      let res = match2[1];
      let sep2 = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match2 = line.exec(source)) {
        if (match2[1] === "") {
          if (sep2 === "\n")
            res += sep2;
          else
            sep2 = "\n";
        } else {
          res += sep2 + match2[1];
          sep2 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match2 = last.exec(source);
      return res + sep2 + (match2?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range: range2 } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range2;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors2();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors2();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep: sep2, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep2)
        for (const st of sep2)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path11) => {
      let item = cst;
      for (const [field, index] of path11) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path11) => {
      const parent = visit.itemAtPath(cst, path11.slice(0, -1));
      const field = path11[path11.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path11, item, visitor) {
      let ctrl = visitor(item, path11);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path11.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path11);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path11) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep2;
          if (scalar.end) {
            sep2 = scalar.end;
            sep2.push(this.sourceToken);
            delete scalar.end;
          } else
            sep2 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep2 }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep2 = it.sep;
                  sep2.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep2 }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep2 = fc.end.splice(1, fc.end.length);
            sep2.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep2 }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors2();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors2();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// src/cli.ts
import path10 from "node:path";
import { execFileSync as execFileSync4 } from "node:child_process";
import { readFileSync as readFileSync4, realpathSync as realpathSync2 } from "node:fs";
import { fileURLToPath } from "node:url";
import { lstat as lstat7, readFile as readFile7, realpath as realpath9 } from "node:fs/promises";

// src/args.ts
function parseArgs(argv) {
  const [command, ...rest] = argv;
  const positional = [];
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token) continue;
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    if (!rawKey) continue;
    const next = rest[index + 1];
    const value = inlineValue ?? (next && !next.startsWith("--") ? (index += 1, next) : true);
    const previous = options[rawKey];
    if (previous === void 0) options[rawKey] = value;
    else if (Array.isArray(previous)) previous.push(String(value));
    else options[rawKey] = [String(previous), String(value)];
  }
  return { command, positional, options };
}
function optionString(args, name) {
  const value = args.options[name];
  if (Array.isArray(value)) return value.at(-1);
  return typeof value === "string" ? value : void 0;
}
function optionStrings(args, name) {
  const value = args.options[name];
  if (Array.isArray(value)) return value;
  return typeof value === "string" ? [value] : [];
}
function optionBoolean(args, name) {
  return args.options[name] === true || args.options[name] === "true";
}
function requireOption(args, name) {
  const value = optionString(args, name);
  if (!value) throw new Error(`Missing required option --${name}`);
  return value;
}

// src/capabilities.ts
import { createPublicKey, verify as verifyAsymmetric } from "node:crypto";
import { accessSync, constants, lstatSync, readFileSync, realpathSync } from "node:fs";
import { delimiter } from "node:path";
import { hostname, platform, arch } from "node:os";
import path3 from "node:path";

// src/contracts.ts
var import__ = __toESM(require__(), 1);
var import_ajv_formats = __toESM(require_dist(), 1);

// contracts/task-batch.v1.schema.json
var task_batch_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/task-batch.v1.schema.json",
  title: "TaskBatch.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "source", "outcomes", "launch_summary"],
  properties: {
    schema_version: { const: "TaskBatch.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    source: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "id"],
      properties: {
        kind: { enum: ["voice", "remote", "slack", "linear", "direct", "api"] },
        id: { type: "string", minLength: 1 }
      }
    },
    outcomes: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "outcome", "dependencies", "proposed_route", "ambiguity", "confirmation_required"],
        properties: {
          id: { type: "string", minLength: 1 },
          outcome: { type: "string", minLength: 1 },
          dependencies: { type: "array", items: { type: "string" }, uniqueItems: true },
          proposed_route: { type: "string", minLength: 1 },
          ambiguity: { type: "array", items: { type: "string" } },
          confirmation_required: { type: "boolean" }
        }
      }
    },
    launch_summary: { type: "string", minLength: 1 }
  }
};

// contracts/task-contract.v1.schema.json
var task_contract_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/task-contract.v1.schema.json",
  title: "TaskContract.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "source", "request_receipt", "motivation", "intent", "organization", "project", "repo", "linear_issue", "outcome", "exclusions", "acceptance_verifier", "proof", "capabilities", "permitted_fallbacks", "forbidden_substitutions", "partial_completion_policy", "idempotency_key", "agent_of_record", "one_writer", "interaction_mode", "target", "base_branch", "base_branch_sha", "dependencies", "edit_scope", "budget", "ttl", "initial_review_lanes", "human_gates", "decision_class"],
  properties: {
    schema_version: { const: "TaskContract.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    source: { type: "object", required: ["kind", "id", "instruction_authority"], properties: { kind: { enum: ["direct", "linear", "slack", "voice", "github", "handoff"] }, id: { type: "string", minLength: 1 }, instruction_authority: { const: "task-request" } }, additionalProperties: false },
    request_receipt: { $ref: "#/$defs/authorityReceiptReference" },
    motivation: { type: "string", minLength: 1 },
    intent: { type: "string", minLength: 1 },
    organization: { type: ["string", "null"] },
    project: { type: "string", minLength: 1 },
    repo: { type: ["string", "null"] },
    linear_issue: { oneOf: [{ type: "null" }, { type: "string", pattern: "^MLY-[1-9][0-9]*$" }] },
    outcome: { type: "string", minLength: 1 },
    exclusions: { type: "array", items: { type: "string" }, uniqueItems: true },
    acceptance_verifier: { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
    proof: { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
    capabilities: { type: "array", items: { type: "string", minLength: 1 }, uniqueItems: true },
    permitted_fallbacks: { type: "array", description: "Explicitly authorized fallback capabilities or routes; an empty array forbids fallback.", items: { type: "string", minLength: 1 }, uniqueItems: true },
    forbidden_substitutions: { type: "array", minItems: 1, description: "Substitutions that must produce not_dispatched instead of silent replacement.", items: { type: "string", minLength: 1 }, uniqueItems: true },
    partial_completion_policy: { enum: ["disallow", "allow-with-handoff", "allow-verified-subset"] },
    idempotency_key: { type: "string", minLength: 1, maxLength: 200 },
    agent_of_record: { enum: ["human", "codex", "cursor", "antigravity"] },
    one_writer: { const: true, description: "Exactly one writer owns mutation for this task/issue at a time." },
    interaction_mode: { enum: ["read-only", "interactive", "unattended", "human-gated-release"] },
    target: { type: "object", required: ["provider", "host"], properties: { provider: { enum: ["local", "codex-cloud", "github-actions", "windows-ci", "cursor", "antigravity"] }, host: { type: ["string", "null"] } }, additionalProperties: false },
    base_branch: { type: ["string", "null"] },
    base_branch_sha: { type: "string", pattern: "^[a-f0-9]{40}$" },
    dependencies: { type: "array", items: { type: "string" }, uniqueItems: true },
    edit_scope: {
      type: "object",
      additionalProperties: false,
      required: ["allowed_globs", "forbidden_globs", "expected_change_classes", "widening_gate"],
      properties: {
        allowed_globs: { type: "array", minItems: 1, maxItems: 32, items: { type: "string", minLength: 1 }, uniqueItems: true },
        forbidden_globs: { type: "array", items: { type: "string", minLength: 1 }, uniqueItems: true },
        expected_change_classes: { type: "array", minItems: 1, items: { $ref: "#/$defs/changeClass" }, uniqueItems: true },
        changed_file_alert_threshold: { type: ["integer", "null"], minimum: 1 },
        widening_gate: { const: "human-only" }
      }
    },
    budget: { type: "object", required: ["maximum_iterations", "maximum_runtime_minutes", "maximum_same_failure_retries", "maximum_no_progress_rounds"], properties: { maximum_iterations: { type: "integer", minimum: 1, maximum: 8 }, maximum_runtime_minutes: { type: "integer", minimum: 1, maximum: 120 }, maximum_same_failure_retries: { type: "integer", minimum: 0, maximum: 2 }, maximum_no_progress_rounds: { type: "integer", minimum: 1, maximum: 2 } }, additionalProperties: false },
    ttl: { type: "string", format: "date-time" },
    initial_review_lanes: { type: "array", items: { $ref: "#/$defs/reviewLane" }, uniqueItems: true },
    human_gates: { type: "array", items: { type: "string", minLength: 1 }, uniqueItems: true },
    decision_class: { enum: ["mechanical", "reversible-technical", "taste", "user-direction-challenge", "one-way-door", "safety-or-feasibility-blocker"] }
  },
  $defs: {
    authorityReceiptReference: { type: "object", additionalProperties: false, required: ["kind", "id", "sha256"], properties: { kind: { enum: ["signed-local", "github-event", "github-api", "linear-api"] }, id: { type: "string", minLength: 1 }, sha256: { type: "string", pattern: "^[a-f0-9]{64}$" } } },
    changeClass: { enum: ["ui-ux", "backend-runtime", "tests", "documentation", "configuration-ci", "migration-data", "api-cli-sdk", "authentication-privacy", "protocol-networking", "release-publishing"] },
    reviewLane: { enum: ["engineering", "product-premise", "design", "dx", "security-privacy", "release", "outside-adversarial"] }
  }
};

// contracts/repo-manifest.v1.schema.json
var repo_manifest_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/repo-manifest.v1.schema.json",
  title: "RepoManifest.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "name", "organization", "aliases", "role", "owners", "architecture_boundaries", "version_source", "source_distribution_coupling", "commands", "os", "device_browser_needs", "services", "release_destinations", "credential_classes", "context_slices", "cleanup_policy", "required_commands"],
  properties: {
    schema_version: { const: "RepoManifest.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    name: { type: "string", minLength: 1 },
    organization: { type: ["string", "null"] },
    aliases: { type: "array", items: { type: "string" }, uniqueItems: true },
    role: { enum: ["source", "distribution", "operations", "brand", "logs", "side-project"] },
    owners: { type: "array", minItems: 1, items: { type: "string", minLength: 1 }, uniqueItems: true },
    architecture_boundaries: { type: "array", items: { type: "string", minLength: 1 } },
    version_source: { type: ["string", "null"] },
    source_distribution_coupling: { type: "object", required: ["source_repo", "distribution_repos"], properties: { source_repo: { type: ["string", "null"] }, distribution_repos: { type: "array", items: { type: "string" }, uniqueItems: true } }, additionalProperties: false },
    commands: { type: "object", required: ["setup", "build", "test", "lint"], properties: { setup: { $ref: "#/$defs/commands" }, build: { $ref: "#/$defs/commands" }, test: { $ref: "#/$defs/commands" }, lint: { $ref: "#/$defs/commands" } }, additionalProperties: false },
    os: { type: "array", items: { enum: ["macos", "linux", "windows"] }, uniqueItems: true },
    device_browser_needs: { type: "array", items: { type: "string" }, uniqueItems: true },
    services: { type: "array", items: { type: "string" }, uniqueItems: true },
    release_destinations: { type: "array", items: { type: "string" }, uniqueItems: true },
    credential_classes: { type: "array", items: { type: "string" }, uniqueItems: true },
    context_slices: { type: "array", items: { type: "string" }, uniqueItems: true },
    cleanup_policy: { type: "object", required: ["preview_idle_minutes", "preview_after_proof_minutes", "hard_maximum_minutes"], properties: { preview_idle_minutes: { type: "integer", minimum: 1, maximum: 30 }, preview_after_proof_minutes: { type: "integer", minimum: 1, maximum: 10 }, hard_maximum_minutes: { type: "integer", minimum: 1, maximum: 120 } }, additionalProperties: false },
    required_commands: { type: "array", items: { type: "string", pattern: "^[A-Za-z0-9._+-]+$" }, uniqueItems: true }
  },
  $defs: { commands: { type: "array", items: { type: "array", minItems: 1, items: { type: "string" } } } }
};

// contracts/context-lock.v1.schema.json
var context_lock_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/context-lock.v1.schema.json",
  title: "ContextLock.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "organization_revision", "context_revision", "target_repository", "context_slices", "repository_owned_files", "repository_owned_sections", "generated_files", "harness", "shared_skill_versions", "protocol_contracts", "brand_assets", "freshness", "source_revisions"],
  properties: {
    schema_version: { const: "ContextLock.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    organization_revision: { type: "string", minLength: 1 },
    context_revision: { type: "string", minLength: 1 },
    target_repository: { type: "object", additionalProperties: false, required: ["repository", "revision"], properties: {
      repository: { type: "string", pattern: "^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$" },
      revision: { type: "string", pattern: "^[a-f0-9]{40}$" }
    } },
    context_slices: { type: "array", items: { $ref: "#/$defs/contextSlice" } },
    repository_owned_files: {
      type: "array",
      description: "Seeded repository-owned files whose presence and policy provenance are checked without freezing their editable bytes.",
      items: { enum: ["AGENTS.md", "docs/ai/architecture.md", "docs/ai/verification.md"] },
      uniqueItems: true,
      minItems: 3,
      maxItems: 3
    },
    repository_owned_sections: {
      type: "array",
      description: "Checksum-managed generated policy sections embedded in otherwise repository-owned files. Hashes use the declared line-ending normalization and include both markers.",
      items: { $ref: "#/$defs/ownedSection" },
      minItems: 1,
      maxItems: 1
    },
    generated_files: { type: "array", items: { $ref: "#/$defs/fileHash" } },
    harness: { $ref: "#/$defs/fileHash" },
    shared_skill_versions: { type: "object", additionalProperties: { type: "string", minLength: 1 } },
    protocol_contracts: { type: "array", items: { $ref: "#/$defs/fileHash" } },
    brand_assets: { type: "array", items: { $ref: "#/$defs/fileHash" } },
    freshness: { type: "object", required: ["verified_at", "expires_at"], properties: { verified_at: { type: "string", format: "date-time" }, expires_at: { type: "string", format: "date-time" } }, additionalProperties: false },
    source_revisions: { type: "object", additionalProperties: { type: "string", minLength: 1 } }
  },
  $defs: {
    fileHash: { type: "object", required: ["path", "sha256"], properties: { path: { type: "string", minLength: 1 }, sha256: { type: "string", pattern: "^[a-f0-9]{64}$" } }, additionalProperties: false },
    ownedSection: { type: "object", additionalProperties: false, required: ["path", "start_marker", "end_marker", "normalization", "sha256"], properties: {
      path: { const: "AGENTS.md" },
      start_marker: { type: "string", pattern: "^<!-- GENERATED BLOCK START: Mouse-ly/mousely-ops@[A-Za-z0-9._-]+ -->$" },
      end_marker: { const: "<!-- GENERATED BLOCK END -->" },
      normalization: { const: "lf" },
      sha256: { type: "string", pattern: "^[a-f0-9]{64}$" }
    } },
    contextSlice: { type: "object", additionalProperties: false, required: ["slice_id", "scope", "source_path", "generated_path", "content_sha256", "file_sha256"], properties: {
      slice_id: { type: "string", pattern: "^[a-z0-9][a-z0-9/_-]*$" },
      scope: { type: "string", minLength: 1 },
      source_path: { type: "string", pattern: "^context/[a-z0-9/_-]+\\.md$" },
      generated_path: { type: "string", pattern: "^docs/ai/generated/[a-z0-9-]+\\.md$" },
      content_sha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
      file_sha256: { type: "string", pattern: "^[a-f0-9]{64}$" }
    } }
  }
};

// contracts/evidence-envelope.v1.schema.json
var evidence_envelope_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/evidence-envelope.v1.schema.json",
  title: "EvidenceEnvelope.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "source_id", "source_uri", "author", "evidence_timestamp", "hash", "scope", "citation", "provenance", "instruction_authority", "access_policy", "confidence", "authorized_direct_request", "content"],
  properties: {
    schema_version: { const: "EvidenceEnvelope.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    source_id: { type: "string", minLength: 1 },
    source_uri: { type: "string", minLength: 1 },
    author: { type: "object", required: ["id", "authenticated"], description: "Source metadata only. The authenticated flag is never authorization evidence.", properties: { id: { type: "string", minLength: 1 }, authenticated: { type: "boolean" } }, additionalProperties: false },
    evidence_timestamp: { type: "string", format: "date-time" },
    hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    scope: { type: "object", required: ["organization", "project", "repo"], properties: { organization: { type: ["string", "null"] }, project: { type: ["string", "null"] }, repo: { type: ["string", "null"] } }, additionalProperties: false },
    citation: { type: "string", minLength: 1 },
    provenance: { enum: ["platform-policy", "repository-policy", "authenticated-human", "internal-evidence", "external-untrusted"] },
    instruction_authority: { enum: ["policy", "task-request", "none"] },
    access_policy: { enum: ["read-write", "read-only", "deny"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    authorized_direct_request: { type: "boolean", description: "Legacy source metadata only. Task authority requires a verified TaskContract request receipt." },
    content: {}
  }
};

// contracts/loop-spec.v1.schema.json
var loop_spec_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/loop-spec.v1.schema.json",
  title: "LoopSpec.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "trigger", "owner", "worker", "evaluator", "threshold", "concurrency", "maximum_iterations", "maximum_runtime_minutes", "retry_rules", "no_progress_rules", "idempotency_key", "permissions", "stop_conditions", "pause_conditions", "kill_conditions"],
  properties: {
    schema_version: { const: "LoopSpec.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    trigger: { type: "string", minLength: 1 },
    owner: { type: "string", minLength: 1 },
    worker: { type: "string", minLength: 1 },
    evaluator: { type: "string", minLength: 1 },
    threshold: { type: "string", minLength: 1 },
    concurrency: { type: "integer", minimum: 1, maximum: 3 },
    maximum_iterations: { type: "integer", minimum: 1, maximum: 8 },
    maximum_runtime_minutes: { type: "integer", minimum: 1, maximum: 120 },
    retry_rules: { type: "object", required: ["same_failure_maximum", "transient_infrastructure_maximum"], properties: { same_failure_maximum: { type: "integer", minimum: 0, maximum: 2 }, transient_infrastructure_maximum: { type: "integer", minimum: 0, maximum: 2 } }, additionalProperties: false },
    no_progress_rules: { type: "object", required: ["maximum_rounds"], properties: { maximum_rounds: { type: "integer", minimum: 1, maximum: 2 } }, additionalProperties: false },
    idempotency_key: { type: "string", minLength: 1 },
    permissions: { type: "array", items: { type: "string" }, uniqueItems: true },
    stop_conditions: { type: "array", minItems: 1, items: { type: "string" } },
    pause_conditions: { type: "array", items: { type: "string" } },
    kill_conditions: { type: "array", minItems: 1, items: { type: "string" } }
  }
};

// contracts/run-receipt.v1.schema.json
var run_receipt_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/run-receipt.v1.schema.json",
  title: "RunReceipt.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "contract_hash", "context_hash", "preflight_receipt_id", "preflight_receipt_sha256", "preflight_consumed_at", "capability_snapshot", "provider", "host", "worktree", "checkpoints", "model_tier", "iterations", "elapsed_time_ms", "usage", "decisions", "scope_changes", "checks", "approvals", "reviewer_corrections", "human_interventions", "outcome", "proof_links", "cleanup"],
  properties: {
    schema_version: { const: "RunReceipt.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    contract_hash: { $ref: "#/$defs/hash" },
    context_hash: { $ref: "#/$defs/hash" },
    preflight_receipt_id: { type: "string", minLength: 1 },
    preflight_receipt_sha256: { $ref: "#/$defs/hash" },
    preflight_consumed_at: { type: "string", format: "date-time" },
    capability_snapshot: { type: "object" },
    provider: { type: "string", minLength: 1 },
    host: { type: ["string", "null"] },
    worktree: { type: ["string", "null"] },
    checkpoints: { type: "array", items: { type: "object", required: ["phase", "timestamp", "hash", "redaction_state"], properties: { phase: { enum: ["planning", "implementation", "evaluation", "review"] }, timestamp: { type: "string", format: "date-time" }, hash: { $ref: "#/$defs/hash" }, redaction_state: { enum: ["clear", "redacted", "restricted"] } }, additionalProperties: false } },
    model_tier: { type: "string", minLength: 1 },
    iterations: { type: "integer", minimum: 0, maximum: 8 },
    elapsed_time_ms: { type: "integer", minimum: 0 },
    usage: { type: "object", required: ["unit", "input", "output", "total", "estimated"], properties: { unit: { enum: ["tokens", "credits", "unknown"] }, input: { type: ["integer", "null"], minimum: 0 }, output: { type: ["integer", "null"], minimum: 0 }, total: { type: ["integer", "null"], minimum: 0 }, estimated: { type: "boolean" } }, additionalProperties: false },
    decisions: { type: "array", items: { type: "string" } },
    scope_changes: { type: "array", items: { type: "object" } },
    checks: { type: "array", items: { type: "object", required: ["name", "status"], properties: { name: { type: "string" }, status: { enum: ["pass", "fail", "inconclusive", "not-applicable"] } }, additionalProperties: true } },
    approvals: { type: "array", items: { type: "object" } },
    reviewer_corrections: { type: "array", items: { type: "object", required: ["reviewer", "lane", "correction", "timestamp"], properties: { reviewer: { type: "string", minLength: 1 }, lane: { $ref: "#/$defs/reviewLane" }, correction: { type: "string", minLength: 1 }, timestamp: { type: "string", format: "date-time" } }, additionalProperties: false } },
    human_interventions: { type: "array", items: { type: "object", required: ["actor", "reason", "action", "timestamp"], properties: { actor: { type: "string", minLength: 1 }, reason: { type: "string", minLength: 1 }, action: { type: "string", minLength: 1 }, timestamp: { type: "string", format: "date-time" } }, additionalProperties: false } },
    outcome: { enum: ["done", "failed", "cancelled", "needs-human", "not-dispatched"] },
    proof_links: { type: "array", items: { type: "string" } },
    cleanup: { type: "object", required: ["status", "resources"], properties: { status: { enum: ["complete", "partial", "not-required"] }, resources: { type: "array", items: { type: "string" } } }, additionalProperties: false }
  },
  $defs: {
    hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    reviewLane: { enum: ["engineering", "product-premise", "design", "dx", "security-privacy", "release", "outside-adversarial"] }
  }
};

// contracts/handoff-packet.v1.schema.json
var handoff_packet_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/handoff-packet.v1.schema.json",
  title: "HandoffPacket.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "completed_state", "branch", "commit", "diff_hash", "remaining_verifier", "target_environment", "required_capability", "blockers", "continuation_command"],
  properties: {
    schema_version: { const: "HandoffPacket.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    completed_state: { type: "string", minLength: 1 },
    branch: { type: ["string", "null"] },
    commit: { type: ["string", "null"], pattern: "^[a-f0-9]{7,64}$" },
    diff_hash: { type: ["string", "null"], pattern: "^[a-f0-9]{64}$" },
    remaining_verifier: { type: "array", items: { type: "string" } },
    target_environment: { type: "string", minLength: 1 },
    required_capability: { type: "array", items: { type: "string" }, uniqueItems: true },
    blockers: { type: "array", items: { type: "string" } },
    continuation_command: { type: "array", minItems: 1, items: { type: "string" } }
  }
};

// contracts/proof-bundle.v1.schema.json
var proof_bundle_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/proof-bundle.v1.schema.json",
  title: "ProofBundle.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "contract_hash", "context_hash", "manifest_hash", "preflight_evidence", "base_commit", "final_commit", "diff_hash", "behavior_changed", "checks", "browser_device_matrix", "media", "review_lanes", "documentation_result", "preview", "limitations", "decisions", "readiness"],
  properties: {
    schema_version: { const: "ProofBundle.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    contract_hash: { $ref: "#/$defs/hash" },
    context_hash: { $ref: "#/$defs/hash" },
    manifest_hash: { $ref: "#/$defs/hash" },
    preflight_evidence: { type: "object", additionalProperties: false, required: ["receipt_id", "receipt_sha256", "run_receipt_id", "run_receipt_sha256"], properties: { receipt_id: { type: "string", minLength: 1 }, receipt_sha256: { $ref: "#/$defs/hash" }, run_receipt_id: { type: "string", minLength: 1 }, run_receipt_sha256: { $ref: "#/$defs/hash" } } },
    base_commit: { type: "string", pattern: "^(?:[a-f0-9]{40}|[a-f0-9]{64})$" },
    final_commit: { type: "string", pattern: "^(?:[a-f0-9]{40}|[a-f0-9]{64})$" },
    diff_hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    behavior_changed: { type: "array", items: { type: "string" } },
    checks: { type: "array", minItems: 1, items: { type: "object", required: ["name", "status", "evidence_ids", "attestation_receipt"], properties: { name: { type: "string", minLength: 1 }, status: { enum: ["pass", "fail", "inconclusive", "not-applicable"] }, evidence_ids: { type: "array", minItems: 1, items: { type: "string", minLength: 1 }, uniqueItems: true }, attestation_receipt: { $ref: "#/$defs/authorityReceiptReference" } }, additionalProperties: false } },
    browser_device_matrix: { type: "array", items: { type: "object", required: ["target", "kind", "status", "physical", "evidence_ids", "device_identity", "build_identity", "install_identity", "device_attestation_receipt"], properties: { target: { type: "string", minLength: 1 }, kind: { enum: ["browser", "device", "accessibility", "reduced-motion"] }, status: { enum: ["pass", "fail", "inconclusive", "not-applicable"] }, physical: { type: "boolean" }, evidence_ids: { type: "array", minItems: 1, items: { type: "string", minLength: 1 }, uniqueItems: true }, device_identity: { type: ["string", "null"] }, build_identity: { type: ["string", "null"] }, install_identity: { type: ["string", "null"] }, device_attestation_receipt: { oneOf: [{ type: "null" }, { $ref: "#/$defs/authorityReceiptReference" }] } }, allOf: [{ if: { properties: { physical: { const: true } } }, then: { properties: { device_identity: { type: "string", minLength: 1 }, build_identity: { type: "string", minLength: 1 }, install_identity: { type: "string", minLength: 1 }, device_attestation_receipt: { $ref: "#/$defs/authorityReceiptReference" } } } }], additionalProperties: false } },
    media: { type: "array", items: { type: "object", required: ["id", "kind", "uri", "hash", "attestation_receipt"], properties: { id: { type: "string", minLength: 1 }, kind: { enum: ["screenshot", "video", "log", "artifact"] }, uri: { type: "string", minLength: 1 }, hash: { $ref: "#/$defs/hash" }, attestation_receipt: { oneOf: [{ type: "null" }, { $ref: "#/$defs/authorityReceiptReference" }] } }, additionalProperties: false } },
    review_lanes: { type: "array", items: { type: "object", required: ["lane", "commit_sha", "verdict", "receipt"], properties: { lane: { $ref: "#/$defs/reviewLane" }, commit_sha: { type: "string", pattern: "^[a-f0-9]{7,64}$" }, verdict: { enum: ["approved", "changes-requested", "inconclusive", "needs-human"] }, receipt: { $ref: "#/$defs/authorityReceiptReference" } }, additionalProperties: false } },
    documentation_result: { type: "object", required: ["status", "impacts", "updates", "debt_issue", "debt_receipt"], properties: { status: { enum: ["complete", "not-required", "blocked", "needs-human"] }, impacts: { type: "array", items: { type: "string" }, uniqueItems: true }, updates: { type: "array", items: { type: "object", required: ["impact", "path"], properties: { impact: { type: "string", minLength: 1 }, path: { type: "string", minLength: 1 } }, additionalProperties: false } }, debt_issue: { oneOf: [{ type: "null" }, { type: "string", pattern: "^MLY-[1-9][0-9]*$" }] }, debt_receipt: { oneOf: [{ type: "null" }, { $ref: "#/$defs/authorityReceiptReference" }] } }, additionalProperties: false },
    preview: { type: "object", required: ["url", "expires_at"], properties: { url: { type: ["string", "null"] }, expires_at: { type: ["string", "null"], format: "date-time" } }, additionalProperties: false },
    limitations: { type: "array", items: { type: "string" } },
    decisions: { type: "array", items: { type: "string" } },
    readiness: { enum: ["ready", "missing-review", "stale-review", "needs-human"] }
  },
  $defs: {
    hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    reviewLane: { enum: ["engineering", "product-premise", "design", "dx", "security-privacy", "release", "outside-adversarial"] },
    authorityReceiptReference: { type: "object", additionalProperties: false, required: ["kind", "id", "sha256"], properties: { kind: { enum: ["signed-local", "github-event", "github-api", "linear-api"] }, id: { type: "string", minLength: 1 }, sha256: { $ref: "#/$defs/hash" } } }
  }
};

// contracts/decision-record.v1.schema.json
var decision_record_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/decision-record.v1.schema.json",
  title: "DecisionRecord.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "scope", "decision_class", "decision", "rationale", "evidence", "owner", "decided_at", "expires_at", "superseded_record", "affected_repositories", "affected_contracts"],
  properties: {
    schema_version: { const: "DecisionRecord.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    scope: { enum: ["personal", "organization", "repository", "tool", "task"] },
    decision_class: { enum: ["mechanical", "reversible-technical", "taste", "user-direction-challenge", "one-way-door", "safety-or-feasibility-blocker"] },
    decision: { type: "string", minLength: 1 },
    rationale: { type: "string", minLength: 1 },
    evidence: { type: "array", items: { type: "string" } },
    owner: { type: "string", minLength: 1 },
    decided_at: { type: "string", format: "date-time" },
    expires_at: { type: ["string", "null"], format: "date-time" },
    superseded_record: { type: ["string", "null"] },
    affected_repositories: { type: "array", items: { type: "string" }, uniqueItems: true },
    affected_contracts: { type: "array", items: { type: "string" }, uniqueItems: true }
  }
};

// contracts/lease.v1.schema.json
var lease_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/lease.v1.schema.json",
  title: "Lease.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "resource_type", "resource_id", "linear_issue", "idempotency_key", "writer", "writer_agent_id", "writer_session_id", "one_writer", "worktree", "repository", "host_fingerprint", "contract_hash", "port", "device", "owner", "pid", "process_group", "process_identity", "command_hash", "health_url", "heartbeat_at", "expires_at", "cleanup_token", "released_at"],
  properties: {
    schema_version: { const: "Lease.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    resource_type: { enum: ["issue", "writer", "worktree", "port", "process", "device"] },
    resource_id: { type: "string", minLength: 1 },
    linear_issue: { type: "string", pattern: "^MLY-[1-9][0-9]*$" },
    idempotency_key: { type: "string", minLength: 1, maxLength: 200 },
    writer: { enum: ["human", "codex", "cursor", "antigravity"] },
    writer_agent_id: { type: "string", minLength: 1, maxLength: 200 },
    writer_session_id: { type: "string", minLength: 1, maxLength: 200 },
    one_writer: { const: true },
    worktree: { type: "string", minLength: 1 },
    repository: { type: "string", minLength: 1 },
    host_fingerprint: { type: "string", pattern: "^[a-f0-9]{64}$" },
    contract_hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    port: { type: ["integer", "null"], minimum: 1, maximum: 65535 },
    device: { type: ["string", "null"] },
    owner: { type: "string", minLength: 1 },
    pid: { type: ["integer", "null"], minimum: 1 },
    process_group: { type: ["integer", "null"], minimum: 1 },
    process_identity: { type: ["string", "null"], pattern: "^[a-f0-9]{64}$" },
    command_hash: { type: ["string", "null"], pattern: "^[a-f0-9]{64}$" },
    health_url: { type: ["string", "null"] },
    heartbeat_at: { type: "string", format: "date-time" },
    expires_at: { type: "string", format: "date-time" },
    cleanup_token: { type: "string", pattern: "^[a-f0-9]{64}$" },
    released_at: { type: ["string", "null"], format: "date-time" }
  }
};

// contracts/authority-receipt.v1.schema.json
var authority_receipt_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/authority-receipt.v1.schema.json",
  title: "AuthorityReceipt.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "expires_at", "source_revision", "redaction_state", "receipt_type", "issuer", "payload", "signature"],
  properties: {
    schema_version: { const: "AuthorityReceipt.v1" },
    id: { type: "string", minLength: 1, maxLength: 200 },
    created_at: { type: "string", format: "date-time" },
    expires_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { const: "clear" },
    receipt_type: { enum: ["request", "review", "media", "linear-debt", "device", "check"] },
    issuer: { type: "object", additionalProperties: false, required: ["id", "provider"], properties: { id: { type: "string", minLength: 1 }, provider: { enum: ["local-authority", "github", "linear"] } } },
    payload: { oneOf: [{ $ref: "#/$defs/requestPayload" }, { $ref: "#/$defs/reviewPayload" }, { $ref: "#/$defs/mediaPayload" }, { $ref: "#/$defs/linearDebtPayload" }, { $ref: "#/$defs/devicePayload" }, { $ref: "#/$defs/checkPayload" }] },
    signature: { $ref: "#/$defs/hash" }
  },
  $defs: {
    hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    sha: { type: "string", pattern: "^[a-f0-9]{40,64}$" },
    linear: { type: "string", pattern: "^MLY-[1-9][0-9]*$" },
    identity: {
      type: "object",
      additionalProperties: false,
      required: ["id", "kind", "provider", "role", "session_id"],
      properties: {
        id: { type: "string", minLength: 1 },
        kind: { enum: ["human", "agent"] },
        provider: { enum: ["human", "codex", "cursor", "antigravity", "github", "linear"] },
        role: { enum: ["requester", "product-owner", "teammate", "independent-evaluator", "security-reviewer", "release-reviewer", "linear-approver"] },
        session_id: { type: "string", minLength: 1 }
      }
    },
    writer: {
      type: "object",
      additionalProperties: false,
      required: ["id", "provider", "session_id"],
      properties: {
        id: { type: "string", minLength: 1 },
        provider: { enum: ["human", "codex", "cursor", "antigravity"] },
        session_id: { type: "string", minLength: 1 }
      }
    },
    requestPayload: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "request_source", "requester", "organization", "project", "repo", "linear_issue", "contract_hash", "context_hash", "manifest_hash", "required_capabilities_hash", "base_commit", "nonce", "use"],
      properties: {
        kind: { const: "request" },
        request_source: { type: "object", additionalProperties: false, required: ["kind", "id"], properties: { kind: { enum: ["direct", "linear", "slack", "voice", "github", "handoff"] }, id: { type: "string", minLength: 1 } } },
        requester: { $ref: "#/$defs/identity" },
        organization: { type: ["string", "null"] },
        project: { type: "string", minLength: 1 },
        repo: { type: ["string", "null"] },
        linear_issue: { oneOf: [{ type: "null" }, { $ref: "#/$defs/linear" }] },
        contract_hash: { $ref: "#/$defs/hash" },
        context_hash: { $ref: "#/$defs/hash" },
        manifest_hash: { $ref: "#/$defs/hash" },
        required_capabilities_hash: { $ref: "#/$defs/hash" },
        base_commit: { $ref: "#/$defs/sha" },
        nonce: { type: "string", pattern: "^[a-f0-9]{32,128}$" },
        use: { const: "preflight" }
      }
    },
    reviewPayload: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "reviewer", "writer", "lane", "verdict", "commit_sha"],
      properties: {
        kind: { const: "review" },
        reviewer: { $ref: "#/$defs/identity" },
        writer: { $ref: "#/$defs/writer" },
        lane: { $ref: "#/$defs/reviewLane" },
        verdict: { enum: ["approved", "changes-requested", "inconclusive", "needs-human"] },
        commit_sha: { $ref: "#/$defs/sha" }
      }
    },
    mediaPayload: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "reviewer", "writer", "commit_sha", "evidence_id", "uri", "hash"],
      properties: {
        kind: { const: "media" },
        reviewer: { $ref: "#/$defs/identity" },
        writer: { $ref: "#/$defs/writer" },
        commit_sha: { $ref: "#/$defs/sha" },
        evidence_id: { type: "string", minLength: 1 },
        uri: { type: "string", minLength: 1 },
        hash: { $ref: "#/$defs/hash" }
      }
    },
    linearDebtPayload: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "issue", "repository", "commit_sha", "approved", "approver", "writer"],
      properties: {
        kind: { const: "linear-debt" },
        issue: { $ref: "#/$defs/linear" },
        repository: { type: "string", pattern: "^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$" },
        commit_sha: { $ref: "#/$defs/sha" },
        approved: { const: true },
        approver: { $ref: "#/$defs/identity" },
        writer: { $ref: "#/$defs/writer" }
      }
    },
    devicePayload: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "repository", "contract_hash", "context_hash", "commit_sha", "target", "device_identity", "build_identity", "install_identity", "evidence", "attestor", "writer"],
      properties: {
        kind: { const: "device" },
        repository: { type: "string", pattern: "^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$" },
        contract_hash: { $ref: "#/$defs/hash" },
        context_hash: { $ref: "#/$defs/hash" },
        commit_sha: { $ref: "#/$defs/sha" },
        target: { type: "string", minLength: 1 },
        device_identity: { type: "string", minLength: 1 },
        build_identity: { type: "string", minLength: 1 },
        install_identity: { type: "string", minLength: 1 },
        evidence: { type: "array", minItems: 1, uniqueItems: true, items: { type: "object", additionalProperties: false, required: ["id", "hash"], properties: { id: { type: "string", minLength: 1 }, hash: { $ref: "#/$defs/hash" } } } },
        attestor: { $ref: "#/$defs/identity" },
        writer: { $ref: "#/$defs/writer" }
      }
    },
    checkPayload: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "repository", "contract_hash", "context_hash", "manifest_hash", "commit_sha", "check_name", "status", "evidence", "attestor", "writer"],
      properties: {
        kind: { const: "check" },
        repository: { type: "string", pattern: "^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$" },
        contract_hash: { $ref: "#/$defs/hash" },
        context_hash: { $ref: "#/$defs/hash" },
        manifest_hash: { $ref: "#/$defs/hash" },
        commit_sha: { $ref: "#/$defs/sha" },
        check_name: { type: "string", minLength: 1 },
        status: { enum: ["pass", "fail", "inconclusive", "not-applicable"] },
        evidence: { type: "array", minItems: 1, uniqueItems: true, items: { type: "object", additionalProperties: false, required: ["id", "hash"], properties: { id: { type: "string", minLength: 1 }, hash: { $ref: "#/$defs/hash" } } } },
        attestor: { $ref: "#/$defs/identity" },
        writer: { $ref: "#/$defs/writer" }
      }
    },
    reviewLane: { enum: ["engineering", "product-premise", "design", "dx", "security-privacy", "release", "outside-adversarial"] }
  }
};

// contracts/capability-snapshot.v1.schema.json
var capability_snapshot_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/capability-snapshot.v1.schema.json",
  title: "CapabilitySnapshot.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "captured_at", "expires_at", "provider", "host", "host_fingerprint", "repository", "base_sha", "checks"],
  properties: {
    schema_version: { const: "CapabilitySnapshot.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { enum: ["clear", "redacted", "restricted"] },
    captured_at: { type: "string", format: "date-time" },
    expires_at: { type: "string", format: "date-time" },
    provider: { enum: ["local", "codex-cloud", "github-actions", "windows-ci", "cursor", "antigravity"] },
    host: { type: ["string", "null"] },
    host_fingerprint: { $ref: "#/$defs/hash" },
    repository: { type: "string", minLength: 1 },
    base_sha: { type: "string", pattern: "^[a-f0-9]{40}$" },
    checks: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: { $ref: "#/$defs/check" }
    }
  },
  $defs: {
    hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    check: {
      type: "object",
      additionalProperties: false,
      required: ["name", "available", "observed_at", "evidence_hash", "verifier"],
      properties: {
        name: { $ref: "#/$defs/capabilityName" },
        available: { type: "boolean" },
        observed_at: { type: "string", format: "date-time" },
        evidence_hash: { $ref: "#/$defs/hash" },
        verifier: {
          type: "object",
          additionalProperties: false,
          required: ["kind", "target", "expected", "receipt_path", "receipt_hash"],
          properties: {
            kind: { enum: ["node-runtime", "command", "signed-probe"] },
            target: { type: "string", minLength: 1, maxLength: 4096 },
            expected: { type: ["string", "null"], maxLength: 4096 },
            receipt_path: { type: ["string", "null"], minLength: 1, maxLength: 4096 },
            receipt_hash: { oneOf: [{ $ref: "#/$defs/hash" }, { type: "null" }] }
          }
        }
      }
    },
    capabilityName: { enum: ["node22", "git", "xcode", "physical-iphone", "ios-simulator", "browser", "network", "authenticated-session", "evaluator", "runtime-control-boundary"] }
  }
};

// contracts/preflight-receipt.v1.schema.json
var preflight_receipt_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/preflight-receipt.v1.schema.json",
  title: "PreflightReceipt.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "issuer", "verifier_registry_hash", "binding", "signature"],
  properties: {
    schema_version: { const: "PreflightReceipt.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { const: "redacted" },
    issuer: { type: "object", additionalProperties: false, required: ["id", "key_id", "algorithm"], properties: { id: { const: "kars-preflight-broker-v1" }, key_id: { type: "string", pattern: "^[A-Za-z0-9._-]{1,100}$" }, algorithm: { const: "Ed25519" } } },
    verifier_registry_hash: { $ref: "#/$defs/hash" },
    binding: {
      type: "object",
      additionalProperties: false,
      required: ["contract_path", "contract_hash", "contract_file_hash", "canonical_contract_path", "canonical_contract_file_hash", "manifest_path", "manifest_hash", "context_lock_path", "context_hash", "harness_path", "harness_hash", "repository_harness_path", "repository_harness_hash", "capability_verifier_registry_hash", "capability_hash", "capability_snapshot_id", "capability_snapshot_path", "capability_expires_at", "base_branch_sha", "task_start_sha", "base_branch", "repo", "provider", "host", "host_fingerprint", "required_capabilities", "required_commands", "command_resolutions", "runtime_root", "lease_store_path", "lease_store_instance_id", "lease_id", "lease_identity_hash", "lease_owner", "lease_pid", "lease_process_identity", "idempotency_key", "writer", "writer_agent_id", "writer_session_id", "one_writer", "worktree", "request_receipt_id", "request_receipt_hash", "request_nonce", "request_receipt_created_at", "request_receipt_expires_at", "contract_expires_at", "verified_at", "expires_at"],
      properties: {
        contract_path: { type: "string", minLength: 1 },
        contract_hash: { $ref: "#/$defs/hash" },
        contract_file_hash: { $ref: "#/$defs/hash" },
        canonical_contract_path: { type: "string", pattern: "^\\.mousely/contracts/MLY-[1-9][0-9]*\\.json$" },
        canonical_contract_file_hash: { $ref: "#/$defs/hash" },
        manifest_path: { const: "mousely.repo.yaml" },
        manifest_hash: { $ref: "#/$defs/hash" },
        context_lock_path: { const: "mousely-context.lock" },
        context_hash: { $ref: "#/$defs/hash" },
        harness_path: { type: "string", minLength: 1 },
        harness_hash: { $ref: "#/$defs/hash" },
        repository_harness_path: { const: ".mousely/harness.mjs" },
        repository_harness_hash: { $ref: "#/$defs/hash" },
        capability_verifier_registry_hash: { $ref: "#/$defs/hash" },
        capability_hash: { $ref: "#/$defs/hash" },
        capability_snapshot_id: { type: "string", minLength: 1 },
        capability_snapshot_path: { type: "string", minLength: 1 },
        capability_expires_at: { type: "string", format: "date-time" },
        base_branch_sha: { type: "string", pattern: "^[a-f0-9]{40}$" },
        task_start_sha: { type: "string", pattern: "^[a-f0-9]{40}$" },
        base_branch: { type: ["string", "null"] },
        repo: { type: "string", minLength: 1 },
        provider: { type: "string", minLength: 1 },
        host: { type: ["string", "null"] },
        host_fingerprint: { $ref: "#/$defs/hash" },
        required_capabilities: { type: "array", items: { type: "string", minLength: 1 }, uniqueItems: true },
        required_commands: { type: "array", items: { type: "string", minLength: 1 }, uniqueItems: true },
        command_resolutions: { type: "object", additionalProperties: { type: "string", minLength: 1 } },
        lease_store_path: { type: "string", minLength: 1 },
        lease_store_instance_id: { type: "string", pattern: "^[0-9a-f-]{36}$" },
        runtime_root: { type: "string", minLength: 1 },
        lease_id: { type: "string", minLength: 1 },
        lease_identity_hash: { $ref: "#/$defs/hash" },
        lease_owner: { type: "string", minLength: 1 },
        lease_pid: { type: "integer", minimum: 1 },
        lease_process_identity: { oneOf: [{ $ref: "#/$defs/hash" }, { type: "null" }] },
        idempotency_key: { type: "string", minLength: 1, maxLength: 200 },
        writer: { enum: ["human", "codex", "cursor", "antigravity"] },
        writer_agent_id: { type: "string", minLength: 1, maxLength: 200 },
        writer_session_id: { type: "string", minLength: 1, maxLength: 200 },
        one_writer: { const: true },
        worktree: { type: "string", minLength: 1 },
        request_receipt_id: { type: "string", minLength: 1 },
        request_receipt_hash: { $ref: "#/$defs/hash" },
        request_nonce: { type: "string", pattern: "^[a-f0-9]{32,128}$" },
        request_receipt_created_at: { type: "string", format: "date-time" },
        request_receipt_expires_at: { type: "string", format: "date-time" },
        contract_expires_at: { type: "string", format: "date-time" },
        verified_at: { type: "string", format: "date-time" },
        expires_at: { type: "string", format: "date-time" }
      }
    },
    signature: { type: "string", pattern: "^[A-Za-z0-9+/]+={0,2}$", minLength: 80, maxLength: 512 }
  },
  $defs: { hash: { type: "string", pattern: "^[a-f0-9]{64}$" } }
};

// contracts/capability-probe-receipt.v1.schema.json
var capability_probe_receipt_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schemas.mousely.dev/contracts/capability-probe-receipt.v1.schema.json",
  title: "CapabilityProbeReceipt.v1",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "id", "created_at", "source_revision", "redaction_state", "capability", "provider", "host", "host_fingerprint", "repository", "base_sha", "observed_at", "expires_at", "nonce", "evidence_hash", "claims", "verifier_key_id", "signature"],
  properties: {
    schema_version: { const: "CapabilityProbeReceipt.v1" },
    id: { type: "string", minLength: 1 },
    created_at: { type: "string", format: "date-time" },
    source_revision: { type: "string", minLength: 1 },
    redaction_state: { const: "redacted" },
    capability: { enum: ["physical-iphone", "ios-simulator", "browser", "network", "authenticated-session", "evaluator", "runtime-control-boundary"] },
    provider: { enum: ["local", "codex-cloud", "github-actions", "windows-ci", "cursor", "antigravity"] },
    host: { type: ["string", "null"] },
    host_fingerprint: { $ref: "#/$defs/hash" },
    repository: { type: "string", minLength: 1 },
    base_sha: { type: "string", pattern: "^[a-f0-9]{40}$" },
    observed_at: { type: "string", format: "date-time" },
    expires_at: { type: "string", format: "date-time" },
    nonce: { type: "string", minLength: 16, maxLength: 200 },
    evidence_hash: { $ref: "#/$defs/hash" },
    claims: { oneOf: [{ type: "null" }, { $ref: "#/$defs/runtimeBoundary" }] },
    verifier_key_id: { type: "string", pattern: "^[A-Za-z0-9._-]{1,100}$" },
    signature: { type: "string", pattern: "^[A-Za-z0-9+/]+={0,2}$", minLength: 80, maxLength: 512 }
  },
  allOf: [{
    if: { properties: { capability: { const: "runtime-control-boundary" } } },
    then: { properties: { claims: { $ref: "#/$defs/runtimeBoundary" } } },
    else: { properties: { claims: { type: "null" } } }
  }],
  $defs: {
    hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
    runtimeBoundary: {
      type: "object",
      additionalProperties: false,
      required: ["runtime_root", "lease_store_path", "lease_store_instance_id", "lease_store_hash", "lease_store_revision", "writer_writable_roots", "writer_writable_roots_hash", "sandbox_profile_id", "sandbox_profile_hash", "writer_agent_id", "writer_session_id", "trusted_harness_path", "trusted_harness_hash", "writer_denial_probe", "read_only_for_writer", "private_keys_isolated", "cleanup_token_isolated"],
      properties: {
        runtime_root: { type: "string", minLength: 1 },
        lease_store_path: { type: "string", minLength: 1 },
        lease_store_instance_id: { type: "string", pattern: "^[0-9a-f-]{36}$" },
        lease_store_hash: { $ref: "#/$defs/hash" },
        lease_store_revision: { type: "integer", minimum: 0 },
        writer_writable_roots: { type: "array", minItems: 1, items: { type: "string", minLength: 1 }, uniqueItems: true },
        writer_writable_roots_hash: { $ref: "#/$defs/hash" },
        sandbox_profile_id: { type: "string", minLength: 1, maxLength: 200 },
        sandbox_profile_hash: { $ref: "#/$defs/hash" },
        writer_agent_id: { type: "string", minLength: 1, maxLength: 200 },
        writer_session_id: { type: "string", minLength: 1, maxLength: 200 },
        trusted_harness_path: { type: "string", minLength: 1 },
        trusted_harness_hash: { $ref: "#/$defs/hash" },
        writer_denial_probe: {
          type: "object",
          additionalProperties: false,
          required: ["tested_at", "expires_at", "nonce", "sandbox_profile_id", "trusted_harness_write_denied", "runtime_root_create_denied", "hook_subprocess_inherits_writer_sandbox", "evidence_hash"],
          properties: {
            tested_at: { type: "string", format: "date-time" },
            expires_at: { type: "string", format: "date-time" },
            nonce: { type: "string", minLength: 16, maxLength: 200 },
            sandbox_profile_id: { type: "string", minLength: 1, maxLength: 200 },
            trusted_harness_write_denied: { const: true },
            runtime_root_create_denied: { const: true },
            hook_subprocess_inherits_writer_sandbox: { const: true },
            evidence_hash: { $ref: "#/$defs/hash" }
          }
        },
        read_only_for_writer: { const: true },
        private_keys_isolated: { const: true },
        cleanup_token_isolated: { const: true }
      }
    }
  }
};

// src/io.ts
var import_yaml = __toESM(require_dist2(), 1);
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { lstat, mkdir, readFile, realpath, rename, writeFile } from "node:fs/promises";
import path from "node:path";
async function readData(filePath) {
  const raw = await readFile(filePath, "utf8");
  if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
    return import_yaml.default.parse(raw);
  }
  return JSON.parse(raw);
}
async function readText(filePath) {
  return readFile(filePath, "utf8");
}
function stableStringify(value) {
  const seen = /* @__PURE__ */ new WeakSet();
  const normalize = (input) => {
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === "object") {
      if (seen.has(input)) throw new TypeError("Cannot serialize a cyclic value");
      seen.add(input);
      return Object.fromEntries(
        Object.entries(input).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, normalize(item)])
      );
    }
    return input;
  };
  return JSON.stringify(normalize(value));
}
function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}
function hashValue(value) {
  return sha256(stableStringify(value));
}
function signValue(value, key) {
  return createHmac("sha256", key).update(stableStringify(value)).digest("hex");
}
function verifySignature(value, signature, key) {
  if (typeof signature !== "string" || !/^[a-f0-9]{64}$/.test(signature)) return false;
  const expected = Buffer.from(signValue(value, key), "hex");
  const actual = Buffer.from(signature, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
async function hashFile(filePath) {
  return sha256(await readFile(filePath));
}
async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}
`, { mode: 384 });
  await rename(temporaryPath, filePath);
}
function safeRelativePath(candidate) {
  if (!candidate || candidate.includes("\0")) return false;
  const portable = candidate.replaceAll("\\", "/");
  if (portable.startsWith("/") || /^[A-Za-z]:/.test(portable)) return false;
  const normalized = path.posix.normalize(portable);
  return normalized !== ".." && !normalized.startsWith("../") && normalized !== "." && !normalized.startsWith("/");
}
function resolveInside(root, candidate) {
  if (!safeRelativePath(candidate)) throw new Error(`Unsafe relative path: ${candidate}`);
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, candidate);
  if (resolved !== resolvedRoot && !resolved.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Path escapes root: ${candidate}`);
  }
  return resolved;
}
async function resolveExistingInside(root, candidate) {
  return resolvePotentialInside(root, candidate, true);
}
async function resolvePotentialInside(root, candidate, mustExist = false) {
  const lexical = resolveInside(root, candidate);
  const realRoot = await realpath(root);
  const parts = path.relative(path.resolve(root), lexical).split(path.sep).filter(Boolean);
  let cursor = path.resolve(root);
  let missing = false;
  for (const part of parts) {
    cursor = path.join(cursor, part);
    try {
      const metadata = await lstat(cursor);
      if (metadata.isSymbolicLink()) throw new Error(`symlink path component is forbidden: ${candidate}`);
      if (!missing) {
        const resolved = await realpath(cursor);
        if (resolved !== realRoot && !resolved.startsWith(`${realRoot}${path.sep}`)) {
          throw new Error(`Path resolves outside root: ${candidate}`);
        }
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      missing = true;
    }
  }
  if (mustExist && missing) throw new Error(`Path does not exist: ${candidate}`);
  return lexical;
}

// node_modules/balanced-match/dist/esm/index.js
var balanced = (a, b, str) => {
  const ma = a instanceof RegExp ? maybeMatch(a, str) : a;
  const mb = b instanceof RegExp ? maybeMatch(b, str) : b;
  const r = ma !== null && mb != null && range(ma, mb, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + ma.length, r[1]),
    post: str.slice(r[1] + mb.length)
  };
};
var maybeMatch = (reg, str) => {
  const m = str.match(reg);
  return m ? m[0] : null;
};
var range = (a, b, str) => {
  let begs, beg, left, right = void 0, result;
  let ai = str.indexOf(a);
  let bi = str.indexOf(b, ai + 1);
  let i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i === ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length === 1) {
        const r = begs.pop();
        if (r !== void 0)
          result = [r, bi];
      } else {
        beg = begs.pop();
        if (beg !== void 0 && beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length && right !== void 0) {
      result = [left, right];
    }
  }
  return result;
};

// node_modules/brace-expansion/dist/esm/index.js
var escSlash = "\0SLASH" + Math.random() + "\0";
var escOpen = "\0OPEN" + Math.random() + "\0";
var escClose = "\0CLOSE" + Math.random() + "\0";
var escComma = "\0COMMA" + Math.random() + "\0";
var escPeriod = "\0PERIOD" + Math.random() + "\0";
var escSlashPattern = new RegExp(escSlash, "g");
var escOpenPattern = new RegExp(escOpen, "g");
var escClosePattern = new RegExp(escClose, "g");
var escCommaPattern = new RegExp(escComma, "g");
var escPeriodPattern = new RegExp(escPeriod, "g");
var slashPattern = /\\\\/g;
var openPattern = /\\{/g;
var closePattern = /\\}/g;
var commaPattern = /\\,/g;
var periodPattern = /\\\./g;
var EXPANSION_MAX = 1e5;
var EXPANSION_MAX_LENGTH = 4e6;
function numeric(str) {
  return !isNaN(str) ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
  return str.replace(slashPattern, escSlash).replace(openPattern, escOpen).replace(closePattern, escClose).replace(commaPattern, escComma).replace(periodPattern, escPeriod);
}
function unescapeBraces(str) {
  return str.replace(escSlashPattern, "\\").replace(escOpenPattern, "{").replace(escClosePattern, "}").replace(escCommaPattern, ",").replace(escPeriodPattern, ".");
}
function parseCommaParts(str) {
  if (!str) {
    return [""];
  }
  const parts = [];
  const m = balanced("{", "}", str);
  if (!m) {
    return str.split(",");
  }
  const { pre, body, post } = m;
  const p = pre.split(",");
  p[p.length - 1] += "{" + body + "}";
  const postParts = parseCommaParts(post);
  if (post.length) {
    ;
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }
  parts.push.apply(parts, p);
  return parts;
}
function expand(str, options = {}) {
  if (!str) {
    return [];
  }
  const { max = EXPANSION_MAX, maxLength = EXPANSION_MAX_LENGTH } = options;
  if (str.slice(0, 2) === "{}") {
    str = "\\{\\}" + str.slice(2);
  }
  return expand_(escapeBraces(str), max, maxLength, true).map(unescapeBraces);
}
function embrace(str) {
  return "{" + str + "}";
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}
function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}
function combine(acc, pre, values, max, maxLength, dropEmpties) {
  const out = [];
  let length = 0;
  for (let a = 0; a < acc.length; a++) {
    for (let v = 0; v < values.length; v++) {
      if (out.length >= max)
        return out;
      const expansion = acc[a] + pre + values[v];
      if (dropEmpties && !expansion)
        continue;
      if (length + expansion.length > maxLength)
        return out;
      out.push(expansion);
      length += expansion.length;
    }
  }
  return out;
}
function expandSequence(body, isAlphaSequence, max, maxLength) {
  const n = body.split(/\.\./);
  const N = [];
  if (n[0] === void 0 || n[1] === void 0) {
    return N;
  }
  const x = numeric(n[0]);
  const y = numeric(n[1]);
  const width = Math.max(n[0].length, n[1].length);
  let incr = n.length === 3 && n[2] !== void 0 ? Math.max(Math.abs(numeric(n[2])), 1) : 1;
  let test = lte;
  const reverse = y < x;
  if (reverse) {
    incr *= -1;
    test = gte;
  }
  const pad = n.some(isPadded);
  let length = 0;
  for (let i = x; test(i, y) && N.length < max; i += incr) {
    let c;
    if (isAlphaSequence) {
      c = String.fromCharCode(i);
      if (c === "\\") {
        c = "";
      }
    } else {
      c = String(i);
      if (pad) {
        const need = width - c.length;
        if (need > 0) {
          const z = new Array(need + 1).join("0");
          if (i < 0) {
            c = "-" + z + c.slice(1);
          } else {
            c = z + c;
          }
        }
      }
    }
    if (length + c.length > maxLength)
      break;
    N.push(c);
    length += c.length;
  }
  return N;
}
function expand_(str, max, maxLength, isTop) {
  let acc = [""];
  let dropEmpties = false;
  let firstGroup = true;
  for (; ; ) {
    const m = balanced("{", "}", str);
    if (!m) {
      return combine(acc, str, [""], max, maxLength, dropEmpties);
    }
    const pre = m.pre;
    if (/\$$/.test(pre)) {
      acc = combine(acc, pre + "{" + m.body + "}", [""], max, maxLength, dropEmpties && !m.post.length);
      firstGroup = false;
      if (!m.post.length)
        break;
      str = m.post;
      continue;
    }
    const isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    const isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    const isSequence = isNumericSequence || isAlphaSequence;
    const isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,(?!,).*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        isTop = true;
        continue;
      }
      return combine(acc, pre + "{" + m.body + "}" + m.post, [""], max, maxLength, dropEmpties);
    }
    if (firstGroup) {
      dropEmpties = isTop && !isSequence;
      firstGroup = false;
    }
    let values;
    if (isSequence) {
      values = expandSequence(m.body, isAlphaSequence, max, maxLength);
    } else {
      let n = parseCommaParts(m.body);
      if (n.length === 1 && n[0] !== void 0) {
        n = expand_(n[0], max, maxLength, false).map(embrace);
        if (n.length === 1) {
          acc = combine(acc, pre + n[0], [""], max, maxLength, dropEmpties && !m.post.length);
          if (!m.post.length)
            break;
          str = m.post;
          continue;
        }
      }
      let dropsEmpties = dropEmpties && !m.post.length && !pre;
      for (let d = 0; dropsEmpties && d < acc.length; d++) {
        if (acc[d]) {
          dropsEmpties = false;
        }
      }
      values = [];
      let valuesLength = 0;
      outer: for (let j = 0; j < n.length; j++) {
        const expanded = expand_(n[j], max, maxLength, false);
        for (let k = 0; k < expanded.length; k++) {
          const v = expanded[k];
          if (dropsEmpties && !v)
            continue;
          if (values.length >= max || valuesLength + v.length > maxLength) {
            break outer;
          }
          values.push(v);
          valuesLength += v.length;
        }
      }
    }
    acc = combine(acc, pre, values, max, maxLength, dropEmpties && !m.post.length);
    if (!m.post.length)
      break;
    str = m.post;
  }
  return acc;
}

// node_modules/minimatch/dist/esm/assert-valid-pattern.js
var MAX_PATTERN_LENGTH = 1024 * 64;
var assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};

// node_modules/minimatch/dist/esm/brace-expressions.js
var posixClasses = {
  "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
  "[:alpha:]": ["\\p{L}\\p{Nl}", true],
  "[:ascii:]": ["\\x00-\\x7f", false],
  "[:blank:]": ["\\p{Zs}\\t", true],
  "[:cntrl:]": ["\\p{Cc}", true],
  "[:digit:]": ["\\p{Nd}", true],
  "[:graph:]": ["\\p{Z}\\p{C}", true, true],
  "[:lower:]": ["\\p{Ll}", true],
  "[:print:]": ["\\p{C}", true],
  "[:punct:]": ["\\p{P}", true],
  "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
  "[:upper:]": ["\\p{Lu}", true],
  "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
  "[:xdigit:]": ["A-Fa-f0-9", false]
};
var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
var regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var rangesToString = (ranges) => ranges.join("");
var parseClass = (glob, position) => {
  const pos = position;
  if (glob.charAt(pos) !== "[") {
    throw new Error("not in a brace expression");
  }
  const ranges = [];
  const negs = [];
  let i = pos + 1;
  let sawStart = false;
  let uflag = false;
  let escaping = false;
  let negate = false;
  let endPos = pos;
  let rangeStart = "";
  WHILE: while (i < glob.length) {
    const c = glob.charAt(i);
    if ((c === "!" || c === "^") && i === pos + 1) {
      negate = true;
      i++;
      continue;
    }
    if (c === "]" && sawStart && !escaping) {
      endPos = i + 1;
      break;
    }
    sawStart = true;
    if (c === "\\") {
      if (!escaping) {
        escaping = true;
        i++;
        continue;
      }
    }
    if (c === "[" && !escaping) {
      for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
        if (glob.startsWith(cls, i)) {
          if (rangeStart) {
            return ["$.", false, glob.length - pos, true];
          }
          i += cls.length;
          if (neg)
            negs.push(unip);
          else
            ranges.push(unip);
          uflag = uflag || u;
          continue WHILE;
        }
      }
    }
    escaping = false;
    if (rangeStart) {
      if (c > rangeStart) {
        ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
      } else if (c === rangeStart) {
        ranges.push(braceEscape(c));
      }
      rangeStart = "";
      i++;
      continue;
    }
    if (glob.startsWith("-]", i + 1)) {
      ranges.push(braceEscape(c + "-"));
      i += 2;
      continue;
    }
    if (glob.startsWith("-", i + 1)) {
      rangeStart = c;
      i += 2;
      continue;
    }
    ranges.push(braceEscape(c));
    i++;
  }
  if (endPos < i) {
    return ["", false, 0, false];
  }
  if (!ranges.length && !negs.length) {
    return ["$.", false, glob.length - pos, true];
  }
  if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
    const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
    return [regexpEscape(r), false, endPos - pos, false];
  }
  const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
  const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
  const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
  return [comb, uflag, endPos - pos, true];
};

// node_modules/minimatch/dist/esm/unescape.js
var unescape2 = (s, { windowsPathsNoEscape = false, magicalBraces = true } = {}) => {
  if (magicalBraces) {
    return windowsPathsNoEscape ? s.replace(/\[([^/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^/\\])\]/g, "$1$2").replace(/\\([^/])/g, "$1");
  }
  return windowsPathsNoEscape ? s.replace(/\[([^/\\{}])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^/\\{}])\]/g, "$1$2").replace(/\\([^/{}])/g, "$1");
};

// node_modules/minimatch/dist/esm/ast.js
var _a;
var types = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]);
var isExtglobType = (c) => types.has(c);
var isExtglobAST = (c) => isExtglobType(c.type);
var adoptionMap = /* @__PURE__ */ new Map([
  ["!", ["@"]],
  ["?", ["?", "@"]],
  ["@", ["@"]],
  ["*", ["*", "+", "?", "@"]],
  ["+", ["+", "@"]]
]);
var adoptionWithSpaceMap = /* @__PURE__ */ new Map([
  ["!", ["?"]],
  ["@", ["?"]],
  ["+", ["?", "*"]]
]);
var adoptionAnyMap = /* @__PURE__ */ new Map([
  ["!", ["?", "@"]],
  ["?", ["?", "@"]],
  ["@", ["?", "@"]],
  ["*", ["*", "+", "?", "@"]],
  ["+", ["+", "@", "?", "*"]]
]);
var usurpMap = /* @__PURE__ */ new Map([
  ["!", /* @__PURE__ */ new Map([["!", "@"]])],
  [
    "?",
    /* @__PURE__ */ new Map([
      ["*", "*"],
      ["+", "*"]
    ])
  ],
  [
    "@",
    /* @__PURE__ */ new Map([
      ["!", "!"],
      ["?", "?"],
      ["@", "@"],
      ["*", "*"],
      ["+", "+"]
    ])
  ],
  [
    "+",
    /* @__PURE__ */ new Map([
      ["?", "*"],
      ["*", "*"]
    ])
  ]
]);
var startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
var startNoDot = "(?!\\.)";
var addPatternStart = /* @__PURE__ */ new Set(["[", "."]);
var justDots = /* @__PURE__ */ new Set(["..", "."]);
var reSpecials = new Set("().*{}+?[]^$\\!");
var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var qmark = "[^/]";
var star = qmark + "*?";
var starNoEmpty = qmark + "+?";
var ID = 0;
var AST = class {
  type;
  #root;
  #hasMagic;
  #uflag = false;
  #parts = [];
  #parent;
  #parentIndex;
  #negs;
  #filledNegs = false;
  #options;
  #toString;
  // set to true if it's an extglob with no children
  // (which really means one child of '')
  #emptyExt = false;
  id = ++ID;
  get depth() {
    return (this.#parent?.depth ?? -1) + 1;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return {
      "@@type": "AST",
      id: this.id,
      type: this.type,
      root: this.#root.id,
      parent: this.#parent?.id,
      depth: this.depth,
      partsLength: this.#parts.length,
      parts: this.#parts
    };
  }
  constructor(type, parent, options = {}) {
    this.type = type;
    if (type)
      this.#hasMagic = true;
    this.#parent = parent;
    this.#root = this.#parent ? this.#parent.#root : this;
    this.#options = this.#root === this ? options : this.#root.#options;
    this.#negs = this.#root === this ? [] : this.#root.#negs;
    if (type === "!" && !this.#root.#filledNegs)
      this.#negs.push(this);
    this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
  }
  get hasMagic() {
    if (this.#hasMagic !== void 0)
      return this.#hasMagic;
    for (const p of this.#parts) {
      if (typeof p === "string")
        continue;
      if (p.type || p.hasMagic)
        return this.#hasMagic = true;
    }
    return this.#hasMagic;
  }
  // reconstructs the pattern
  toString() {
    return this.#toString !== void 0 ? this.#toString : !this.type ? this.#toString = this.#parts.map((p) => String(p)).join("") : this.#toString = this.type + "(" + this.#parts.map((p) => String(p)).join("|") + ")";
  }
  #fillNegs() {
    if (this !== this.#root)
      throw new Error("should only call on root");
    if (this.#filledNegs)
      return this;
    this.toString();
    this.#filledNegs = true;
    let n;
    while (n = this.#negs.pop()) {
      if (n.type !== "!")
        continue;
      let p = n;
      let pp = p.#parent;
      while (pp) {
        for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
          for (const part of n.#parts) {
            if (typeof part === "string") {
              throw new Error("string part in extglob AST??");
            }
            part.copyIn(pp.#parts[i]);
          }
        }
        p = pp;
        pp = p.#parent;
      }
    }
    return this;
  }
  push(...parts) {
    for (const p of parts) {
      if (p === "")
        continue;
      if (typeof p !== "string" && !(p instanceof _a && p.#parent === this)) {
        throw new Error("invalid part: " + p);
      }
      this.#parts.push(p);
    }
  }
  toJSON() {
    const ret = this.type === null ? this.#parts.slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [this.type, ...this.#parts.map((p) => p.toJSON())];
    if (this.isStart() && !this.type)
      ret.unshift([]);
    if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === "!")) {
      ret.push({});
    }
    return ret;
  }
  isStart() {
    if (this.#root === this)
      return true;
    if (!this.#parent?.isStart())
      return false;
    if (this.#parentIndex === 0)
      return true;
    const p = this.#parent;
    for (let i = 0; i < this.#parentIndex; i++) {
      const pp = p.#parts[i];
      if (!(pp instanceof _a && pp.type === "!")) {
        return false;
      }
    }
    return true;
  }
  isEnd() {
    if (this.#root === this)
      return true;
    if (this.#parent?.type === "!")
      return true;
    if (!this.#parent?.isEnd())
      return false;
    if (!this.type)
      return this.#parent?.isEnd();
    const pl = this.#parent ? this.#parent.#parts.length : 0;
    return this.#parentIndex === pl - 1;
  }
  copyIn(part) {
    if (typeof part === "string")
      this.push(part);
    else
      this.push(part.clone(this));
  }
  clone(parent) {
    const c = new _a(this.type, parent);
    for (const p of this.#parts) {
      c.copyIn(p);
    }
    return c;
  }
  static #parseAST(str, ast, pos, opt, extDepth) {
    const maxDepth = opt.maxExtglobRecursion ?? 2;
    let escaping = false;
    let inBrace = false;
    let braceStart = -1;
    let braceNeg = false;
    if (ast.type === null) {
      let i2 = pos;
      let acc2 = "";
      while (i2 < str.length) {
        const c = str.charAt(i2++);
        if (escaping || c === "\\") {
          escaping = !escaping;
          acc2 += c;
          continue;
        }
        if (inBrace) {
          if (i2 === braceStart + 1) {
            if (c === "^" || c === "!") {
              braceNeg = true;
            }
          } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
            inBrace = false;
          }
          acc2 += c;
          continue;
        } else if (c === "[") {
          inBrace = true;
          braceStart = i2;
          braceNeg = false;
          acc2 += c;
          continue;
        }
        const doRecurse = !opt.noext && isExtglobType(c) && str.charAt(i2) === "(" && extDepth <= maxDepth;
        if (doRecurse) {
          ast.push(acc2);
          acc2 = "";
          const ext2 = new _a(c, ast);
          i2 = _a.#parseAST(str, ext2, i2, opt, extDepth + 1);
          ast.push(ext2);
          continue;
        }
        acc2 += c;
      }
      ast.push(acc2);
      return i2;
    }
    let i = pos + 1;
    let part = new _a(null, ast);
    const parts = [];
    let acc = "";
    while (i < str.length) {
      const c = str.charAt(i++);
      if (escaping || c === "\\") {
        escaping = !escaping;
        acc += c;
        continue;
      }
      if (inBrace) {
        if (i === braceStart + 1) {
          if (c === "^" || c === "!") {
            braceNeg = true;
          }
        } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
          inBrace = false;
        }
        acc += c;
        continue;
      } else if (c === "[") {
        inBrace = true;
        braceStart = i;
        braceNeg = false;
        acc += c;
        continue;
      }
      const doRecurse = !opt.noext && isExtglobType(c) && str.charAt(i) === "(" && /* c8 ignore start - the maxDepth is sufficient here */
      (extDepth <= maxDepth || ast && ast.#canAdoptType(c));
      if (doRecurse) {
        const depthAdd = ast && ast.#canAdoptType(c) ? 0 : 1;
        part.push(acc);
        acc = "";
        const ext2 = new _a(c, part);
        part.push(ext2);
        i = _a.#parseAST(str, ext2, i, opt, extDepth + depthAdd);
        continue;
      }
      if (c === "|") {
        part.push(acc);
        acc = "";
        parts.push(part);
        part = new _a(null, ast);
        continue;
      }
      if (c === ")") {
        if (acc === "" && ast.#parts.length === 0) {
          ast.#emptyExt = true;
        }
        part.push(acc);
        acc = "";
        ast.push(...parts, part);
        return i;
      }
      acc += c;
    }
    ast.type = null;
    ast.#hasMagic = void 0;
    ast.#parts = [str.substring(pos - 1)];
    return i;
  }
  #canAdoptWithSpace(child) {
    return this.#canAdopt(child, adoptionWithSpaceMap);
  }
  #canAdopt(child, map = adoptionMap) {
    if (!child || typeof child !== "object" || child.type !== null || child.#parts.length !== 1 || this.type === null) {
      return false;
    }
    const gc = child.#parts[0];
    if (!gc || typeof gc !== "object" || gc.type === null) {
      return false;
    }
    return this.#canAdoptType(gc.type, map);
  }
  #canAdoptType(c, map = adoptionAnyMap) {
    return !!map.get(this.type)?.includes(c);
  }
  #adoptWithSpace(child, index) {
    const gc = child.#parts[0];
    const blank = new _a(null, gc, this.options);
    blank.#parts.push("");
    gc.push(blank);
    this.#adopt(child, index);
  }
  #adopt(child, index) {
    const gc = child.#parts[0];
    this.#parts.splice(index, 1, ...gc.#parts);
    for (const p of gc.#parts) {
      if (typeof p === "object")
        p.#parent = this;
    }
    this.#toString = void 0;
  }
  #canUsurpType(c) {
    const m = usurpMap.get(this.type);
    return !!m?.has(c);
  }
  #canUsurp(child) {
    if (!child || typeof child !== "object" || child.type !== null || child.#parts.length !== 1 || this.type === null || this.#parts.length !== 1) {
      return false;
    }
    const gc = child.#parts[0];
    if (!gc || typeof gc !== "object" || gc.type === null) {
      return false;
    }
    return this.#canUsurpType(gc.type);
  }
  #usurp(child) {
    const m = usurpMap.get(this.type);
    const gc = child.#parts[0];
    const nt = m?.get(gc.type);
    if (!nt)
      return false;
    this.#parts = gc.#parts;
    for (const p of this.#parts) {
      if (typeof p === "object") {
        p.#parent = this;
      }
    }
    this.type = nt;
    this.#toString = void 0;
    this.#emptyExt = false;
  }
  static fromGlob(pattern, options = {}) {
    const ast = new _a(null, void 0, options);
    _a.#parseAST(pattern, ast, 0, options, 0);
    return ast;
  }
  // returns the regular expression if there's magic, or the unescaped
  // string if not.
  toMMPattern() {
    if (this !== this.#root)
      return this.#root.toMMPattern();
    const glob = this.toString();
    const [re, body, hasMagic, uflag] = this.toRegExpSource();
    const anyMagic = hasMagic || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob.toUpperCase() !== glob.toLowerCase();
    if (!anyMagic) {
      return body;
    }
    const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
    return Object.assign(new RegExp(`^${re}$`, flags), {
      _src: re,
      _glob: glob
    });
  }
  get options() {
    return this.#options;
  }
  // returns the string match, the regexp source, whether there's magic
  // in the regexp (so a regular expression is required) and whether or
  // not the uflag is needed for the regular expression (for posix classes)
  // TODO: instead of injecting the start/end at this point, just return
  // the BODY of the regexp, along with the start/end portions suitable
  // for binding the start/end in either a joined full-path makeRe context
  // (where we bind to (^|/), or a standalone matchPart context (where
  // we bind to ^, and not /).  Otherwise slashes get duped!
  //
  // In part-matching mode, the start is:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: ^(?!\.\.?$)
  // - if dots allowed or not possible: ^
  // - if dots possible and not allowed: ^(?!\.)
  // end is:
  // - if not isEnd(): nothing
  // - else: $
  //
  // In full-path matching mode, we put the slash at the START of the
  // pattern, so start is:
  // - if first pattern: same as part-matching mode
  // - if not isStart(): nothing
  // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
  // - if dots allowed or not possible: /
  // - if dots possible and not allowed: /(?!\.)
  // end is:
  // - if last pattern, same as part-matching mode
  // - else nothing
  //
  // Always put the (?:$|/) on negated tails, though, because that has to be
  // there to bind the end of the negated pattern portion, and it's easier to
  // just stick it in now rather than try to inject it later in the middle of
  // the pattern.
  //
  // We can just always return the same end, and leave it up to the caller
  // to know whether it's going to be used joined or in parts.
  // And, if the start is adjusted slightly, can do the same there:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
  // - if dots allowed or not possible: (?:/|^)
  // - if dots possible and not allowed: (?:/|^)(?!\.)
  //
  // But it's better to have a simpler binding without a conditional, for
  // performance, so probably better to return both start options.
  //
  // Then the caller just ignores the end if it's not the first pattern,
  // and the start always gets applied.
  //
  // But that's always going to be $ if it's the ending pattern, or nothing,
  // so the caller can just attach $ at the end of the pattern when building.
  //
  // So the todo is:
  // - better detect what kind of start is needed
  // - return both flavors of starting pattern
  // - attach $ at the end of the pattern when creating the actual RegExp
  //
  // Ah, but wait, no, that all only applies to the root when the first pattern
  // is not an extglob. If the first pattern IS an extglob, then we need all
  // that dot prevention biz to live in the extglob portions, because eg
  // +(*|.x*) can match .xy but not .yx.
  //
  // So, return the two flavors if it's #root and the first child is not an
  // AST, otherwise leave it to the child AST to handle it, and there,
  // use the (?:^|/) style of start binding.
  //
  // Even simplified further:
  // - Since the start for a join is eg /(?!\.) and the start for a part
  // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
  // or start or whatever) and prepend ^ or / at the Regexp construction.
  toRegExpSource(allowDot) {
    const dot = allowDot ?? !!this.#options.dot;
    if (this.#root === this) {
      this.#flatten();
      this.#fillNegs();
    }
    if (!isExtglobAST(this)) {
      const noEmpty = this.isStart() && this.isEnd() && !this.#parts.some((s) => typeof s !== "string");
      const src = this.#parts.map((p) => {
        const [re, _, hasMagic, uflag] = typeof p === "string" ? _a.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
        this.#hasMagic = this.#hasMagic || hasMagic;
        this.#uflag = this.#uflag || uflag;
        return re;
      }).join("");
      let start2 = "";
      if (this.isStart()) {
        if (typeof this.#parts[0] === "string") {
          const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
          if (!dotTravAllowed) {
            const aps = addPatternStart;
            const needNoTrav = (
              // dots are allowed, and the pattern starts with [ or .
              dot && aps.has(src.charAt(0)) || // the pattern starts with \., and then [ or .
              src.startsWith("\\.") && aps.has(src.charAt(2)) || // the pattern starts with \.\., and then [ or .
              src.startsWith("\\.\\.") && aps.has(src.charAt(4))
            );
            const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
            start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
          }
        }
      }
      let end = "";
      if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === "!") {
        end = "(?:$|\\/)";
      }
      const final2 = start2 + src + end;
      return [
        final2,
        unescape2(src),
        this.#hasMagic = !!this.#hasMagic,
        this.#uflag
      ];
    }
    const repeated = this.type === "*" || this.type === "+";
    const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let body = this.#partsToRegExp(dot);
    if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
      const s = this.toString();
      const me = this;
      me.#parts = [s];
      me.type = null;
      me.#hasMagic = void 0;
      return [s, unescape2(this.toString()), false, false];
    }
    let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
    if (bodyDotAllowed === body) {
      bodyDotAllowed = "";
    }
    if (bodyDotAllowed) {
      body = `(?:${body})(?:${bodyDotAllowed})*?`;
    }
    let final = "";
    if (this.type === "!" && this.#emptyExt) {
      final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
    } else {
      const close = this.type === "!" ? (
        // !() must match something,but !(x) can match ''
        "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star + ")"
      ) : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
      final = start + body + close;
    }
    return [
      final,
      unescape2(body),
      this.#hasMagic = !!this.#hasMagic,
      this.#uflag
    ];
  }
  #flatten() {
    if (!isExtglobAST(this)) {
      for (const p of this.#parts) {
        if (typeof p === "object") {
          p.#flatten();
        }
      }
    } else {
      let iterations = 0;
      let done = false;
      do {
        done = true;
        for (let i = 0; i < this.#parts.length; i++) {
          const c = this.#parts[i];
          if (typeof c === "object") {
            c.#flatten();
            if (this.#canAdopt(c)) {
              done = false;
              this.#adopt(c, i);
            } else if (this.#canAdoptWithSpace(c)) {
              done = false;
              this.#adoptWithSpace(c, i);
            } else if (this.#canUsurp(c)) {
              done = false;
              this.#usurp(c);
            }
          }
        }
      } while (!done && ++iterations < 10);
    }
    this.#toString = void 0;
  }
  #partsToRegExp(dot) {
    return this.#parts.map((p) => {
      if (typeof p === "string") {
        throw new Error("string type in extglob ast??");
      }
      const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
      this.#uflag = this.#uflag || uflag;
      return re;
    }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
  }
  static #parseGlob(glob, hasMagic, noEmpty = false) {
    let escaping = false;
    let re = "";
    let uflag = false;
    let inStar = false;
    for (let i = 0; i < glob.length; i++) {
      const c = glob.charAt(i);
      if (escaping) {
        escaping = false;
        re += (reSpecials.has(c) ? "\\" : "") + c;
        continue;
      }
      if (c === "*") {
        if (inStar)
          continue;
        inStar = true;
        re += noEmpty && /^[*]+$/.test(glob) ? starNoEmpty : star;
        hasMagic = true;
        continue;
      } else {
        inStar = false;
      }
      if (c === "\\") {
        if (i === glob.length - 1) {
          re += "\\\\";
        } else {
          escaping = true;
        }
        continue;
      }
      if (c === "[") {
        const [src, needUflag, consumed, magic] = parseClass(glob, i);
        if (consumed) {
          re += src;
          uflag = uflag || needUflag;
          i += consumed - 1;
          hasMagic = hasMagic || magic;
          continue;
        }
      }
      if (c === "?") {
        re += qmark;
        hasMagic = true;
        continue;
      }
      re += regExpEscape(c);
    }
    return [re, unescape2(glob), !!hasMagic, uflag];
  }
};
_a = AST;

// node_modules/minimatch/dist/esm/escape.js
var escape2 = (s, { windowsPathsNoEscape = false, magicalBraces = false } = {}) => {
  if (magicalBraces) {
    return windowsPathsNoEscape ? s.replace(/[?*()[\]{}]/g, "[$&]") : s.replace(/[?*()[\]\\{}]/g, "\\$&");
  }
  return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
};

// node_modules/minimatch/dist/esm/index.js
var minimatch = (p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch(pattern, options).match(p);
};
var starDotExtRE = /^\*+([^+@!?*[(]*)$/;
var starDotExtTest = (ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2);
var starDotExtTestDot = (ext2) => (f) => f.endsWith(ext2);
var starDotExtTestNocase = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
};
var starDotExtTestNocaseDot = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => f.toLowerCase().endsWith(ext2);
};
var starDotStarRE = /^\*+\.\*+$/;
var starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
var starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
var dotStarRE = /^\.\*+$/;
var dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
var starRE = /^\*+$/;
var starTest = (f) => f.length !== 0 && !f.startsWith(".");
var starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
var qmarksRE = /^\?+([^+@!?*[(]*)?$/;
var qmarksTestNocase = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestNocaseDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTest = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTestNoExt = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && !f.startsWith(".");
};
var qmarksTestNoExtDot = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && f !== "." && f !== "..";
};
var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
var path2 = {
  win32: { sep: "\\" },
  posix: { sep: "/" }
};
var sep = defaultPlatform === "win32" ? path2.win32.sep : path2.posix.sep;
minimatch.sep = sep;
var GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
var qmark2 = "[^/]";
var star2 = qmark2 + "*?";
var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
var filter = (pattern, options = {}) => (p) => minimatch(p, pattern, options);
minimatch.filter = filter;
var ext = (a, b = {}) => Object.assign({}, a, b);
var defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
  return Object.assign(m, {
    Minimatch: class Minimatch extends orig.Minimatch {
      constructor(pattern, options = {}) {
        super(pattern, ext(def, options));
      }
      static defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      }
    },
    AST: class AST extends orig.AST {
      /* c8 ignore start */
      constructor(type, parent, options = {}) {
        super(type, parent, ext(def, options));
      }
      /* c8 ignore stop */
      static fromGlob(pattern, options = {}) {
        return orig.AST.fromGlob(pattern, ext(def, options));
      }
    },
    unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
    escape: (s, options = {}) => orig.escape(s, ext(def, options)),
    filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
    defaults: (options) => orig.defaults(ext(def, options)),
    makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
    braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
    match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
    sep: orig.sep,
    GLOBSTAR
  });
};
minimatch.defaults = defaults;
var braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  return expand(pattern, { max: options.braceExpandMax });
};
minimatch.braceExpand = braceExpand;
var makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
minimatch.makeRe = makeRe;
var match = (list, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options);
  list = list.filter((f) => mm.match(f));
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list;
};
minimatch.match = match;
var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
var regExpEscape2 = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Minimatch = class {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  maxGlobstarRecursion;
  regexp;
  constructor(pattern, options = {}) {
    assertValidPattern(pattern);
    options = options || {};
    this.options = options;
    this.maxGlobstarRecursion = options.maxGlobstarRecursion ?? 200;
    this.pattern = pattern;
    this.platform = options.platform || defaultPlatform;
    this.isWindows = this.platform === "win32";
    const awe = "allowWindowsEscape";
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options[awe] === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
    this.regexp = null;
    this.negate = false;
    this.nonegate = !!options.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const pattern of this.set) {
      for (const part of pattern) {
        if (typeof part !== "string")
          return true;
      }
    }
    return false;
  }
  debug(..._) {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [...new Set(this.braceExpand())];
    if (options.debug) {
      this.debug = (...args) => console.error(...args);
    }
    this.debug(this.pattern, this.globSet);
    const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
    this.globParts = this.preprocess(rawGlobParts);
    this.debug(this.pattern, this.globParts);
    let set = this.globParts.map((s, _, __) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
        const isDrive = /^[a-z]:/i.test(s[0]);
        if (isUNC) {
          return [
            ...s.slice(0, 4),
            ...s.slice(4).map((ss) => this.parse(ss))
          ];
        } else if (isDrive) {
          return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
        }
      }
      return s.map((ss) => this.parse(ss));
    });
    this.debug(this.pattern, set);
    this.set = set.filter((s) => s.indexOf(false) === -1);
    if (this.isWindows) {
      for (let i = 0; i < this.set.length; i++) {
        const p = this.set[i];
        if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
          p[2] = "?";
        }
      }
    }
    this.debug(this.pattern, this.set);
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(globParts) {
    if (this.options.noglobstar) {
      for (const partset of globParts) {
        for (let j = 0; j < partset.length; j++) {
          if (partset[j] === "**") {
            partset[j] = "*";
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      globParts = this.firstPhasePreProcess(globParts);
      globParts = this.secondPhasePreProcess(globParts);
    } else if (optimizationLevel >= 1) {
      globParts = this.levelOneOptimize(globParts);
    } else {
      globParts = this.adjascentGlobstarOptimize(globParts);
    }
    return globParts;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(globParts) {
    return globParts.map((parts) => {
      let gs = -1;
      while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
        let i = gs;
        while (parts[i + 1] === "**") {
          i++;
        }
        if (i !== gs) {
          parts.splice(gs, i - gs);
        }
      }
      return parts;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(globParts) {
    return globParts.map((parts) => {
      parts = parts.reduce((set, part) => {
        const prev = set[set.length - 1];
        if (part === "**" && prev === "**") {
          return set;
        }
        if (part === "..") {
          if (prev && prev !== ".." && prev !== "." && prev !== "**") {
            set.pop();
            return set;
          }
        }
        set.push(part);
        return set;
      }, []);
      return parts.length === 0 ? [""] : parts;
    });
  }
  levelTwoFileOptimize(parts) {
    if (!Array.isArray(parts)) {
      parts = this.slashSplit(parts);
    }
    let didSomething = false;
    do {
      didSomething = false;
      if (!this.preserveMultipleSlashes) {
        for (let i = 1; i < parts.length - 1; i++) {
          const p = parts[i];
          if (i === 1 && p === "" && parts[0] === "")
            continue;
          if (p === "." || p === "") {
            didSomething = true;
            parts.splice(i, 1);
            i--;
          }
        }
        if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
          didSomething = true;
          parts.pop();
        }
      }
      let dd = 0;
      while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
        const p = parts[dd - 1];
        if (p && p !== "." && p !== ".." && p !== "**" && !(this.isWindows && /^[a-z]:$/i.test(p))) {
          didSomething = true;
          parts.splice(dd - 1, 2);
          dd -= 2;
        }
      }
    } while (didSomething);
    return parts.length === 0 ? [""] : parts;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(globParts) {
    let didSomething = false;
    do {
      didSomething = false;
      for (let parts of globParts) {
        let gs = -1;
        while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
          let gss = gs;
          while (parts[gss + 1] === "**") {
            gss++;
          }
          if (gss > gs) {
            parts.splice(gs + 1, gss - gs);
          }
          let next = parts[gs + 1];
          const p = parts[gs + 2];
          const p2 = parts[gs + 3];
          if (next !== "..")
            continue;
          if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
            continue;
          }
          didSomething = true;
          parts.splice(gs, 1);
          const other = parts.slice(0);
          other[gs] = "**";
          globParts.push(other);
          gs--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let i = 1; i < parts.length - 1; i++) {
            const p = parts[i];
            if (i === 1 && p === "" && parts[0] === "")
              continue;
            if (p === "." || p === "") {
              didSomething = true;
              parts.splice(i, 1);
              i--;
            }
          }
          if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
            didSomething = true;
            parts.pop();
          }
        }
        let dd = 0;
        while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
          const p = parts[dd - 1];
          if (p && p !== "." && p !== ".." && p !== "**") {
            didSomething = true;
            const needDot = dd === 1 && parts[dd + 1] === "**";
            const splin = needDot ? ["."] : [];
            parts.splice(dd - 1, 2, ...splin);
            if (parts.length === 0)
              parts.push("");
            dd -= 2;
          }
        }
      }
    } while (didSomething);
    return globParts;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
  //
  // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
  // ^-- not valid because ** doens't follow symlinks
  secondPhasePreProcess(globParts) {
    for (let i = 0; i < globParts.length - 1; i++) {
      for (let j = i + 1; j < globParts.length; j++) {
        const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
        if (matched) {
          globParts[i] = [];
          globParts[j] = matched;
          break;
        }
      }
    }
    return globParts.filter((gs) => gs.length);
  }
  partsMatch(a, b, emptyGSMatch = false) {
    let ai = 0;
    let bi = 0;
    let result = [];
    let which = "";
    while (ai < a.length && bi < b.length) {
      if (a[ai] === b[bi]) {
        result.push(which === "b" ? b[bi] : a[ai]);
        ai++;
        bi++;
      } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
        result.push(a[ai]);
        ai++;
      } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
        result.push(b[bi]);
        bi++;
      } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
        if (which === "b")
          return false;
        which = "a";
        result.push(a[ai]);
        ai++;
        bi++;
      } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
        if (which === "a")
          return false;
        which = "b";
        result.push(b[bi]);
        ai++;
        bi++;
      } else {
        return false;
      }
    }
    return a.length === b.length && result;
  }
  parseNegate() {
    if (this.nonegate)
      return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(file, pattern, partial = false) {
    let fileStartIndex = 0;
    let patternStartIndex = 0;
    if (this.isWindows) {
      const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
      const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
      const patternDrive = typeof pattern[0] === "string" && /^[a-z]:$/i.test(pattern[0]);
      const patternUNC = !patternDrive && pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
      const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
      const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
      if (typeof fdi === "number" && typeof pdi === "number") {
        const [fd, pd] = [
          file[fdi],
          pattern[pdi]
        ];
        if (fd.toLowerCase() === pd.toLowerCase()) {
          pattern[pdi] = fd;
          patternStartIndex = pdi;
          fileStartIndex = fdi;
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      file = this.levelTwoFileOptimize(file);
    }
    if (pattern.includes(GLOBSTAR)) {
      return this.#matchGlobstar(file, pattern, partial, fileStartIndex, patternStartIndex);
    }
    return this.#matchOne(file, pattern, partial, fileStartIndex, patternStartIndex);
  }
  #matchGlobstar(file, pattern, partial, fileIndex, patternIndex) {
    const firstgs = pattern.indexOf(GLOBSTAR, patternIndex);
    const lastgs = pattern.lastIndexOf(GLOBSTAR);
    const [head, body, tail] = partial ? [
      pattern.slice(patternIndex, firstgs),
      pattern.slice(firstgs + 1),
      []
    ] : [
      pattern.slice(patternIndex, firstgs),
      pattern.slice(firstgs + 1, lastgs),
      pattern.slice(lastgs + 1)
    ];
    if (head.length) {
      const fileHead = file.slice(fileIndex, fileIndex + head.length);
      if (!this.#matchOne(fileHead, head, partial, 0, 0)) {
        return false;
      }
      fileIndex += head.length;
      patternIndex += head.length;
    }
    let fileTailMatch = 0;
    if (tail.length) {
      if (tail.length + fileIndex > file.length)
        return false;
      let tailStart = file.length - tail.length;
      if (this.#matchOne(file, tail, partial, tailStart, 0)) {
        fileTailMatch = tail.length;
      } else {
        if (file[file.length - 1] !== "" || fileIndex + tail.length === file.length) {
          return false;
        }
        tailStart--;
        if (!this.#matchOne(file, tail, partial, tailStart, 0)) {
          return false;
        }
        fileTailMatch = tail.length + 1;
      }
    }
    if (!body.length) {
      let sawSome = !!fileTailMatch;
      for (let i2 = fileIndex; i2 < file.length - fileTailMatch; i2++) {
        const f = String(file[i2]);
        sawSome = true;
        if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
          return false;
        }
      }
      return partial || sawSome;
    }
    const bodySegments = [[[], 0]];
    let currentBody = bodySegments[0];
    let nonGsParts = 0;
    const nonGsPartsSums = [0];
    for (const b of body) {
      if (b === GLOBSTAR) {
        nonGsPartsSums.push(nonGsParts);
        currentBody = [[], 0];
        bodySegments.push(currentBody);
      } else {
        currentBody[0].push(b);
        nonGsParts++;
      }
    }
    let i = bodySegments.length - 1;
    const fileLength = file.length - fileTailMatch;
    for (const b of bodySegments) {
      b[1] = fileLength - (nonGsPartsSums[i--] + b[0].length);
    }
    return !!this.#matchGlobStarBodySections(file, bodySegments, fileIndex, 0, partial, 0, !!fileTailMatch);
  }
  // return false for "nope, not matching"
  // return null for "not matching, cannot keep trying"
  #matchGlobStarBodySections(file, bodySegments, fileIndex, bodyIndex, partial, globStarDepth, sawTail) {
    const bs = bodySegments[bodyIndex];
    if (!bs) {
      for (let i = fileIndex; i < file.length; i++) {
        sawTail = true;
        const f = file[i];
        if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
          return false;
        }
      }
      return sawTail;
    }
    const [body, after] = bs;
    while (fileIndex <= after) {
      const m = this.#matchOne(file.slice(0, fileIndex + body.length), body, partial, fileIndex, 0);
      if (m && globStarDepth < this.maxGlobstarRecursion) {
        const sub = this.#matchGlobStarBodySections(file, bodySegments, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail);
        if (sub !== false) {
          return sub;
        }
      }
      const f = file[fileIndex];
      if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
        return false;
      }
      fileIndex++;
    }
    return partial || null;
  }
  #matchOne(file, pattern, partial, fileIndex, patternIndex) {
    let fi;
    let pi;
    let pl;
    let fl;
    for (fi = fileIndex, pi = patternIndex, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      let p = pattern[pi];
      let f = file[fi];
      this.debug(pattern, p, f);
      if (p === false || p === GLOBSTAR) {
        return false;
      }
      let hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = p.test(f);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    } else {
      throw new Error("wtf?");
    }
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    let m;
    let fastTest = null;
    if (m = pattern.match(starRE)) {
      fastTest = options.dot ? starTestDot : starTest;
    } else if (m = pattern.match(starDotExtRE)) {
      fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
    } else if (m = pattern.match(qmarksRE)) {
      fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
    } else if (m = pattern.match(starDotStarRE)) {
      fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
    } else if (m = pattern.match(dotStarRE)) {
      fastTest = dotStarTest;
    }
    const re = AST.fromGlob(pattern, this.options).toMMPattern();
    if (fastTest && typeof re === "object") {
      Reflect.defineProperty(re, "test", { value: fastTest });
    }
    return re;
  }
  makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star2 : options.dot ? twoStarDot : twoStarNoDot;
    const flags = new Set(options.nocase ? ["i"] : []);
    let re = set.map((pattern) => {
      const pp = pattern.map((p) => {
        if (p instanceof RegExp) {
          for (const f of p.flags.split(""))
            flags.add(f);
        }
        return typeof p === "string" ? regExpEscape2(p) : p === GLOBSTAR ? GLOBSTAR : p._src;
      });
      pp.forEach((p, i) => {
        const next = pp[i + 1];
        const prev = pp[i - 1];
        if (p !== GLOBSTAR || prev === GLOBSTAR) {
          return;
        }
        if (prev === void 0) {
          if (next !== void 0 && next !== GLOBSTAR) {
            pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
          } else {
            pp[i] = twoStar;
          }
        } else if (next === void 0) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + ")?";
        } else if (next !== GLOBSTAR) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
          pp[i + 1] = GLOBSTAR;
        }
      });
      const filtered = pp.filter((p) => p !== GLOBSTAR);
      if (this.partial && filtered.length >= 1) {
        const prefixes = [];
        for (let i = 1; i <= filtered.length; i++) {
          prefixes.push(filtered.slice(0, i).join("/"));
        }
        return "(?:" + prefixes.join("|") + ")";
      }
      return filtered.join("/");
    }).join("|");
    const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
    re = "^" + open + re + close + "$";
    if (this.partial) {
      re = "^(?:\\/|" + open + re.slice(1, -1) + close + ")$";
    }
    if (this.negate)
      re = "^(?!" + re + ").+$";
    try {
      this.regexp = new RegExp(re, [...flags].join(""));
    } catch {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(p) {
    if (this.preserveMultipleSlashes) {
      return p.split("/");
    } else if (this.isWindows && /^\/\/[^/]+/.test(p)) {
      return ["", ...p.split(/\/+/)];
    } else {
      return p.split(/\/+/);
    }
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return f === "";
    }
    if (f === "/" && partial) {
      return true;
    }
    const options = this.options;
    if (this.isWindows) {
      f = f.split("\\").join("/");
    }
    const ff = this.slashSplit(f);
    this.debug(this.pattern, "split", ff);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (const pattern of set) {
      let file = ff;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      const hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate) {
          return true;
        }
        return !this.negate;
      }
    }
    if (options.flipNegate) {
      return false;
    }
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape2;
minimatch.unescape = unescape2;

// src/contracts.ts
var schemaEntries = [
  ["TaskBatch.v1", task_batch_v1_schema_default],
  ["TaskContract.v1", task_contract_v1_schema_default],
  ["RepoManifest.v1", repo_manifest_v1_schema_default],
  ["ContextLock.v1", context_lock_v1_schema_default],
  ["EvidenceEnvelope.v1", evidence_envelope_v1_schema_default],
  ["LoopSpec.v1", loop_spec_v1_schema_default],
  ["RunReceipt.v1", run_receipt_v1_schema_default],
  ["HandoffPacket.v1", handoff_packet_v1_schema_default],
  ["ProofBundle.v1", proof_bundle_v1_schema_default],
  ["DecisionRecord.v1", decision_record_v1_schema_default],
  ["Lease.v1", lease_v1_schema_default],
  ["AuthorityReceipt.v1", authority_receipt_v1_schema_default],
  ["CapabilitySnapshot.v1", capability_snapshot_v1_schema_default],
  ["PreflightReceipt.v1", preflight_receipt_v1_schema_default],
  ["CapabilityProbeReceipt.v1", capability_probe_receipt_v1_schema_default]
];
var Ajv2020 = import__.default.default ?? import__.default;
var addFormats = import_ajv_formats.default.default ?? import_ajv_formats.default;
var ajv = new Ajv2020({ allErrors: true, strict: false, allowUnionTypes: true });
addFormats(ajv);
var validators = /* @__PURE__ */ new Map();
for (const [name, schema] of schemaEntries) validators.set(name, ajv.compile(schema));
var schemaVersions = schemaEntries.map(([name]) => name);
function formatErrors(errors) {
  return (errors ?? []).map((error) => {
    const suffix = error.message ? ` ${error.message}` : "";
    return `${error.instancePath || "/"}${suffix}`;
  });
}
function semanticErrors(value) {
  const errors = [];
  const version = value.schema_version;
  if (version === "EvidenceEnvelope.v1") {
    const provenance = value.provenance;
    const authority = value.instruction_authority;
    if (authority === "policy" && provenance !== "platform-policy" && provenance !== "repository-policy") {
      errors.push("/instruction_authority policy authority requires platform-policy or repository-policy provenance");
    }
    if (authority === "task-request") errors.push("/instruction_authority EvidenceEnvelope cannot self-authenticate task requests; use a TaskContract request_receipt verified by preflight or a trusted platform event");
    if ((provenance === "internal-evidence" || provenance === "external-untrusted") && authority !== "none") {
      errors.push("/instruction_authority retrieved evidence cannot supply instructions");
    }
    if (provenance === "external-untrusted" && value.access_policy !== "deny" && value.access_policy !== "read-only") {
      errors.push("/access_policy external untrusted evidence cannot be read-write");
    }
  }
  if (version === "ContextLock.v1") {
    const fileGroups = [value.generated_files, value.protocol_contracts, value.brand_assets];
    const managedPaths2 = /* @__PURE__ */ new Set();
    const generatedHashes = /* @__PURE__ */ new Map();
    for (const group of fileGroups) {
      if (!Array.isArray(group)) continue;
      for (const item of group) {
        const pathValue = item?.path;
        const hashValue2 = item?.sha256;
        if (typeof pathValue === "string" && !safeRelativePath(pathValue)) {
          errors.push(`/generated_files unsafe path: ${pathValue}`);
        }
        if (typeof pathValue === "string") managedPaths2.add(pathValue);
        if (group === value.generated_files && typeof pathValue === "string" && typeof hashValue2 === "string") {
          const previous = generatedHashes.get(pathValue);
          if (previous && previous !== hashValue2) errors.push(`/generated_files conflicting checksums for path: ${pathValue}`);
          generatedHashes.set(pathValue, hashValue2);
        }
      }
    }
    const harnessPath2 = value.harness?.path;
    if (typeof harnessPath2 === "string" && !safeRelativePath(harnessPath2)) {
      errors.push(`/harness/path unsafe path: ${harnessPath2}`);
    }
    if (typeof harnessPath2 === "string") managedPaths2.add(harnessPath2);
    for (const pathValue of Array.isArray(value.repository_owned_files) ? value.repository_owned_files : []) {
      if (typeof pathValue === "string" && !safeRelativePath(pathValue)) {
        errors.push(`/repository_owned_files unsafe path: ${pathValue}`);
      } else if (typeof pathValue === "string" && managedPaths2.has(pathValue)) {
        errors.push(`/repository_owned_files repository-owned path is also checksum-managed: ${pathValue}`);
      }
    }
    const ownedFiles = new Set(Array.isArray(value.repository_owned_files) ? value.repository_owned_files.filter((item) => typeof item === "string") : []);
    const sectionPaths = /* @__PURE__ */ new Set();
    for (const section of Array.isArray(value.repository_owned_sections) ? value.repository_owned_sections : []) {
      const item = section;
      const sectionPath = item.path;
      if (typeof sectionPath === "string") {
        if (!safeRelativePath(sectionPath)) errors.push(`/repository_owned_sections unsafe path: ${sectionPath}`);
        if (!ownedFiles.has(sectionPath)) errors.push(`/repository_owned_sections section path is not repository-owned: ${sectionPath}`);
        if (managedPaths2.has(sectionPath)) errors.push(`/repository_owned_sections section path is also whole-file checksum-managed: ${sectionPath}`);
        if (sectionPaths.has(sectionPath)) errors.push(`/repository_owned_sections duplicate or overlapping section path: ${sectionPath}`);
        sectionPaths.add(sectionPath);
      }
      if (item.start_marker === item.end_marker) errors.push("/repository_owned_sections start and end markers must differ");
      for (const [name, marker] of [["start_marker", item.start_marker], ["end_marker", item.end_marker]]) {
        if (typeof marker === "string" && /[\r\n]/.test(marker)) errors.push(`/repository_owned_sections/${name} must be a single line`);
      }
      const expectedStart = `<!-- GENERATED BLOCK START: Mouse-ly/mousely-ops@${String(value.source_revision)} -->`;
      if (item.path === "AGENTS.md" && item.start_marker !== expectedStart) errors.push("/repository_owned_sections AGENTS.md start marker does not match source_revision");
    }
    for (const slice of Array.isArray(value.context_slices) ? value.context_slices : []) {
      const generatedPath = slice?.generated_path;
      const fileHash = slice?.file_sha256;
      if (typeof generatedPath === "string" && generatedHashes.get(generatedPath) !== fileHash) {
        errors.push(`/context_slices generated snapshot is not checksum-locked with its declared file hash: ${generatedPath}`);
      }
    }
  }
  if (version === "LoopSpec.v1") {
    const denied = /(^|:)(merge|release|publish|credential|governance|permission-expand)(:|$)/i;
    for (const permission of Array.isArray(value.permissions) ? value.permissions : []) {
      if (typeof permission === "string" && denied.test(permission)) {
        errors.push(`/permissions loop permission is human-gated: ${permission}`);
      }
    }
  }
  if (version === "TaskContract.v1") {
    const scope = value.edit_scope;
    const allowed = Array.isArray(scope?.allowed_globs) ? scope.allowed_globs : [];
    const universalSentinels = ["README.md", "src/file.ts", "deep/nested/file.ts", ".github/workflows/guard.yml"];
    if (allowed.some((glob) => glob === "**" || glob === "**/*" || glob === "/" || typeof glob === "string" && universalSentinels.every((sentinel) => minimatch(sentinel, glob, { dot: true })))) {
      errors.push("/edit_scope/allowed_globs repository-wide wildcard scope is not narrow");
    }
    if (value.decision_class === "one-way-door" && !value.human_gates?.length) {
      errors.push("/human_gates one-way-door work requires an explicit human gate");
    }
    if (value.linear_issue && typeof value.idempotency_key === "string" && !value.idempotency_key.includes(String(value.linear_issue))) {
      errors.push("/idempotency_key Mousely task idempotency must include the canonical Linear issue");
    }
    const source = value.source;
    if (source?.instruction_authority !== "task-request") errors.push("/source task authority must be task-request");
  }
  if (version === "RunReceipt.v1") {
    const usage2 = value.usage;
    if (usage2?.unit === "unknown" && (usage2.input !== null || usage2.output !== null || usage2.total !== null)) {
      errors.push("/usage unknown usage requires null input, output, and total values");
    }
    if (usage2?.unit !== "unknown" && typeof usage2?.input === "number" && typeof usage2.output === "number" && usage2.total !== usage2.input + usage2.output) {
      errors.push("/usage total must equal input plus output");
    }
  }
  if (version === "AuthorityReceipt.v1") {
    const created = new Date(String(value.created_at));
    const expires = new Date(String(value.expires_at));
    if (!Number.isFinite(created.getTime()) || !Number.isFinite(expires.getTime()) || expires <= created) errors.push("/expires_at authority receipt must expire after it is created");
    const payload = value.payload;
    if (payload?.kind !== value.receipt_type) errors.push("/receipt_type must match payload.kind");
    const maximumLifetimeMs = { request: 5 * 6e4, review: 24 * 60 * 6e4, media: 60 * 6e4, "linear-debt": 7 * 24 * 60 * 6e4, device: 15 * 6e4, check: 60 * 6e4 };
    const maximum = maximumLifetimeMs[String(value.receipt_type)];
    if (maximum && Number.isFinite(created.getTime()) && Number.isFinite(expires.getTime()) && expires.getTime() - created.getTime() > maximum) errors.push(`/expires_at ${String(value.receipt_type)} authority receipt exceeds its maximum lifetime`);
  }
  if (version === "CapabilitySnapshot.v1") {
    const names = /* @__PURE__ */ new Set();
    for (const check of Array.isArray(value.checks) ? value.checks : []) {
      const item = check;
      const name = String(item.name ?? "");
      if (names.has(name)) errors.push(`/checks duplicate capability name: ${name}`);
      names.add(name);
      const verifier = item.verifier;
      if (verifier?.kind === "node-runtime" && !/^[1-9][0-9]*$/.test(String(verifier.expected ?? ""))) {
        errors.push(`/checks/${name}/verifier node-runtime expected value must be a major version`);
      }
    }
    const capturedAt = new Date(String(value.captured_at ?? ""));
    const expiresAt = new Date(String(value.expires_at ?? ""));
    if (Number.isFinite(capturedAt.getTime()) && Number.isFinite(expiresAt.getTime()) && expiresAt <= capturedAt) {
      errors.push("/expires_at must be later than captured_at");
    }
  }
  if (version === "PreflightReceipt.v1") {
    const binding = value.binding;
    const verifiedAt = new Date(String(binding?.verified_at ?? ""));
    const expiresAt = new Date(String(binding?.expires_at ?? ""));
    const capabilityExpiresAt = new Date(String(binding?.capability_expires_at ?? ""));
    const contractExpiresAt = new Date(String(binding?.contract_expires_at ?? ""));
    const requestCreatedAt = new Date(String(binding?.request_receipt_created_at ?? ""));
    const requestExpiresAt = new Date(String(binding?.request_receipt_expires_at ?? ""));
    if (value.created_at !== binding?.verified_at) errors.push("/created_at must exactly match binding.verified_at");
    if (Number.isFinite(verifiedAt.getTime()) && Number.isFinite(expiresAt.getTime()) && expiresAt <= verifiedAt) {
      errors.push("/binding/expires_at must be later than verified_at");
    }
    if (Number.isFinite(expiresAt.getTime()) && Number.isFinite(capabilityExpiresAt.getTime()) && expiresAt > capabilityExpiresAt) {
      errors.push("/binding/expires_at cannot outlive the capability snapshot");
    }
    if (Number.isFinite(expiresAt.getTime()) && Number.isFinite(contractExpiresAt.getTime()) && expiresAt > contractExpiresAt) {
      errors.push("/binding/expires_at cannot outlive the task contract");
    }
    if (!Number.isFinite(verifiedAt.getTime()) || !Number.isFinite(expiresAt.getTime()) || expiresAt.getTime() - verifiedAt.getTime() > 5 * 6e4) errors.push("/binding/expires_at preflight lifetime cannot exceed five minutes");
    if (!Number.isFinite(requestCreatedAt.getTime()) || !Number.isFinite(requestExpiresAt.getTime()) || requestExpiresAt <= requestCreatedAt || requestExpiresAt.getTime() - requestCreatedAt.getTime() > 5 * 6e4) errors.push("/binding/request_receipt_expires_at request authority lifetime must be positive and no longer than five minutes");
    if (Number.isFinite(expiresAt.getTime()) && Number.isFinite(requestExpiresAt.getTime()) && expiresAt > requestExpiresAt) errors.push("/binding/expires_at cannot outlive request authority");
    if (binding?.contract_path === binding?.canonical_contract_path) errors.push("/binding/contract_path external runtime contract and repository bootstrap contract must be distinct");
  }
  if (version === "CapabilityProbeReceipt.v1" && value.capability === "runtime-control-boundary") {
    const claims = value.claims;
    const probe = claims?.writer_denial_probe;
    if (probe?.tested_at !== value.observed_at || probe?.expires_at !== value.expires_at || probe?.sandbox_profile_id !== claims?.sandbox_profile_id) {
      errors.push("/claims/writer_denial_probe must bind the signed probe observation window and sandbox profile");
    }
  }
  if (version === "Lease.v1") {
    if (value.redaction_state !== "restricted") errors.push("/redaction_state lease cleanup material must remain restricted");
    const worktree = String(value.worktree ?? "");
    const repository = String(value.repository ?? "");
    const absolute = (candidate) => candidate.startsWith("/") || /^[A-Za-z]:[\\/]/.test(candidate);
    if (!absolute(worktree) || !absolute(repository)) errors.push("/worktree and /repository must be absolute paths");
    if (worktree !== repository) errors.push("/worktree and /repository must identify the same exact worktree root");
    const expectedResource = value.resource_type === "issue" ? `issue:${String(value.linear_issue)}` : value.resource_type === "writer" ? `writer:${String(value.linear_issue)}` : value.resource_type === "worktree" ? `worktree:${worktree}` : value.resource_type === "port" ? `port:${String(value.port)}` : value.resource_type === "process" ? `process:${String(value.pid)}` : value.resource_type === "device" ? `device:${String(value.device)}` : null;
    if (expectedResource && value.resource_id !== expectedResource) errors.push("/resource_id does not match the typed resource identity");
    if (value.resource_type === "port" && typeof value.port !== "number") errors.push("/port port lease requires an exact port");
    if (value.resource_type === "process" && typeof value.pid !== "number") errors.push("/pid process lease requires an exact PID");
    if (value.resource_type === "device" && (typeof value.device !== "string" || value.device.length === 0)) errors.push("/device device lease requires an exact device identifier");
    if (value.process_identity !== null && typeof value.pid !== "number") errors.push("/process_identity cannot exist without a PID");
    const createdAt = new Date(String(value.created_at ?? ""));
    const heartbeatAt = new Date(String(value.heartbeat_at ?? ""));
    const leaseExpiresAt = new Date(String(value.expires_at ?? ""));
    if (Number.isFinite(createdAt.getTime()) && Number.isFinite(heartbeatAt.getTime()) && heartbeatAt < createdAt) errors.push("/heartbeat_at cannot predate creation");
    if (Number.isFinite(heartbeatAt.getTime()) && Number.isFinite(leaseExpiresAt.getTime()) && leaseExpiresAt <= heartbeatAt) errors.push("/expires_at must be later than heartbeat_at");
  }
  return errors;
}
function validateContract(value, explicitVersion) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, errors: ["/ must be an object"] };
  }
  const object = value;
  const schemaVersion = explicitVersion ?? (typeof object.schema_version === "string" ? object.schema_version : void 0);
  if (!schemaVersion) return { valid: false, errors: ["/schema_version is required"] };
  const validator = validators.get(schemaVersion);
  if (!validator) return { valid: false, schemaVersion, errors: [`Unsupported schema version: ${schemaVersion}`] };
  const valid = validator(object);
  const errors = [...formatErrors(validator.errors), ...semanticErrors(object)];
  return { valid: Boolean(valid) && errors.length === 0, schemaVersion, errors };
}

// src/capabilities.ts
var MAX_SNAPSHOT_AGE_MS = 5 * 6e4;
var MAX_PROBE_AGE_MS = 5 * 6e4;
var CLOCK_SKEW_MS = 5e3;
var MAX_PROBE_BYTES = 256 * 1024;
var CAPABILITY_REGISTRY = Object.freeze({
  node22: { kind: "node-runtime", target: "node", expected: "22" },
  git: { kind: "command", target: "git" },
  xcode: { kind: "command", target: "xcodebuild" },
  "physical-iphone": { kind: "signed-probe" },
  "ios-simulator": { kind: "signed-probe" },
  browser: { kind: "signed-probe" },
  network: { kind: "signed-probe" },
  "authenticated-session": { kind: "signed-probe" },
  evaluator: { kind: "signed-probe" },
  "runtime-control-boundary": { kind: "signed-probe" }
});
var FORBIDDEN_SUBSTITUTION_REGISTRY = Object.freeze({
  "simulator-for-physical-device": ["ios-simulator"],
  "browser-for-physical-device": ["browser"],
  "cloud-for-local": []
});
function runtimeHostFingerprint() {
  return sha256([hostname(), platform(), arch()].join("\0"));
}
function resolveCommandExecutable(command) {
  if (!/^[A-Za-z0-9._+-]+$/.test(command)) return null;
  const candidates = [];
  if (command.includes("/") || command.includes("\\")) candidates.push(command);
  else {
    const extensions = process.platform === "win32" ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";") : [""];
    for (const directory of (process.env.PATH ?? "").split(delimiter).filter(Boolean)) {
      for (const extension of extensions) candidates.push(path3.join(directory, `${command}${extension}`));
    }
  }
  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK);
      return realpathSync(candidate);
    } catch {
    }
  }
  return null;
}
function parseDate(value) {
  const parsed = new Date(String(value ?? ""));
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}
function targetValue(contract, name) {
  const target = contract.target;
  return target?.[name];
}
function trustedProbeKeys() {
  const raw = process.env.MOUSELY_CAPABILITY_VERIFIER_KEYS_JSON ?? "{}";
  const errors = [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { keys: {}, hash: hashValue({}), errors: ["capability verifier key registry is not valid JSON"] };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { keys: {}, hash: hashValue({}), errors: ["capability verifier key registry must be an object"] };
  const keys = {};
  const entries = Object.entries(parsed);
  if (entries.length > 32) errors.push("capability verifier key registry exceeds 32 keys");
  for (const [keyId, value] of entries) {
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(keyId) || typeof value !== "string" || value.length > 16384) {
      errors.push(`invalid capability verifier key entry: ${keyId}`);
      continue;
    }
    try {
      const key = createPublicKey(value);
      if (key.asymmetricKeyType !== "ed25519") errors.push(`capability verifier key must be Ed25519: ${keyId}`);
      else keys[keyId] = key.export({ type: "spki", format: "pem" }).toString();
    } catch {
      errors.push(`capability verifier key cannot be parsed: ${keyId}`);
    }
  }
  return { keys, hash: hashValue(keys), errors };
}
function readProbeReceipt(repository, suppliedPath) {
  try {
    if (!path3.isAbsolute(suppliedPath) || !/^[A-Za-z0-9._-]+\.json$/.test(path3.basename(suppliedPath))) return { error: "signed probe receipt path is not an absolute canonical broker path" };
    const repositoryRoot = realpathSync(repository);
    const runtimeRoot = realpathSync(process.env.MOUSELY_RUNTIME_ROOT ?? "");
    const expectedDirectory = path3.join(runtimeRoot, "worktrees", sha256(repositoryRoot), "capability-probes");
    if (realpathSync(path3.dirname(suppliedPath)) !== expectedDirectory || path3.dirname(suppliedPath) !== expectedDirectory) return { error: "signed probe receipt is outside the external broker capability directory" };
    const absolute = path3.resolve(suppliedPath);
    let cursor = path3.parse(absolute).root;
    for (const part of absolute.slice(cursor.length).split(path3.sep).filter(Boolean)) {
      cursor = path3.join(cursor, part);
      const metadata2 = lstatSync(cursor);
      if (metadata2.isSymbolicLink()) return { error: "signed probe receipt path contains a symlink" };
    }
    const metadata = lstatSync(absolute);
    if (!metadata.isFile() || metadata.size > MAX_PROBE_BYTES) return { error: "signed probe receipt is not a bounded regular file" };
    if (realpathSync(absolute) !== absolute) return { error: "signed probe receipt does not resolve canonically" };
    const receipt = JSON.parse(readFileSync(absolute, "utf8"));
    return { receipt };
  } catch (error) {
    return { error: `signed probe receipt is unavailable: ${error.message}` };
  }
}
function verifySignedProbe(check, snapshot, repository, now, verifierKeys2) {
  const verifier = check.verifier;
  const relativePath = String(verifier.receipt_path ?? "");
  const loaded = readProbeReceipt(repository, relativePath);
  if (!loaded.receipt) return `capability ${String(check.name)} ${loaded.error}`;
  const receipt = loaded.receipt;
  const validation = validateContract(receipt, "CapabilityProbeReceipt.v1");
  if (!validation.valid) return `capability ${String(check.name)} signed probe is invalid: ${validation.errors.join("; ")}`;
  if (hashValue(receipt) !== verifier.receipt_hash) return `capability ${String(check.name)} signed probe hash changed`;
  const observedAt = parseDate(receipt.observed_at);
  const expiresAt = parseDate(receipt.expires_at);
  if (!observedAt || !expiresAt || observedAt.getTime() > now.getTime() + CLOCK_SKEW_MS || now.getTime() - observedAt.getTime() > MAX_PROBE_AGE_MS || expiresAt <= now || expiresAt.getTime() - observedAt.getTime() > MAX_PROBE_AGE_MS) {
    return `capability ${String(check.name)} signed probe is stale, expired, or has an excessive lifetime`;
  }
  const expectedFields = [
    [receipt.capability, check.name, "capability"],
    [receipt.provider, snapshot.provider, "provider"],
    [receipt.host, snapshot.host, "host"],
    [receipt.host_fingerprint, snapshot.host_fingerprint, "host fingerprint"],
    [receipt.repository, snapshot.repository, "repository"],
    [receipt.base_sha, snapshot.base_sha, "base commit"],
    [receipt.observed_at, check.observed_at, "observation time"],
    [receipt.evidence_hash, check.evidence_hash, "evidence hash"],
    [receipt.verifier_key_id, verifier.expected, "verifier key"],
    [verifier.target, check.name, "registry target"]
  ];
  const mismatch = expectedFields.find(([left, right]) => left !== right);
  if (mismatch) return `capability ${String(check.name)} signed probe ${mismatch[2]} does not match the snapshot`;
  if (check.name === "runtime-control-boundary") {
    const claims = receipt.claims;
    if (!claims) return "capability runtime-control-boundary is missing typed claims";
    let runtimeRoot = "";
    try {
      const configured = process.env.MOUSELY_RUNTIME_ROOT;
      if (!configured || !path3.isAbsolute(configured)) return "capability runtime-control-boundary requires an absolute MOUSELY_RUNTIME_ROOT";
      runtimeRoot = realpathSync(configured);
      const repositoryRoot2 = realpathSync(repository);
      const relative = path3.relative(repositoryRoot2, runtimeRoot);
      if (!(relative === ".." || relative.startsWith(`..${path3.sep}`) || path3.isAbsolute(relative))) return "capability runtime-control-boundary overlaps the repository";
    } catch {
      return "capability runtime-control-boundary runtime root is unavailable";
    }
    const leaseStorePath = path3.join(runtimeRoot, "leases.json");
    let leaseStore;
    let leaseStoreHash = "";
    try {
      const bytes = readFileSync(leaseStorePath);
      leaseStoreHash = sha256(bytes);
      leaseStore = JSON.parse(bytes.toString("utf8"));
    } catch {
      return "capability runtime-control-boundary lease store is unavailable";
    }
    let writableRoots;
    try {
      const parsed = JSON.parse(process.env.MOUSELY_WRITER_WRITABLE_ROOTS_JSON ?? "");
      if (!Array.isArray(parsed) || parsed.length === 0 || parsed.some((item) => typeof item !== "string" || !path3.isAbsolute(item))) throw new Error();
      writableRoots = parsed.map((item) => realpathSync(String(item))).sort();
    } catch {
      return "capability runtime-control-boundary writer roots are invalid";
    }
    const containmentOutside = (container, candidate) => {
      const relative = path3.relative(container, candidate);
      return relative === ".." || relative.startsWith(`..${path3.sep}`) || path3.isAbsolute(relative);
    };
    const repositoryRoot = realpathSync(repository);
    if (!containmentOutside(repositoryRoot, runtimeRoot) || !containmentOutside(runtimeRoot, repositoryRoot)) return "capability runtime-control-boundary runtime root and repository contain one another";
    for (const writerRoot of writableRoots) if (!containmentOutside(writerRoot, runtimeRoot) || !containmentOutside(runtimeRoot, writerRoot)) return "capability runtime-control-boundary runtime root and a writer-writable root contain one another";
    const expectedClaims = [
      [claims.runtime_root, runtimeRoot, "runtime root"],
      [claims.lease_store_path, leaseStorePath, "lease store path"],
      [claims.lease_store_instance_id, leaseStore.instance_id, "lease store instance"],
      [stableStringify(claims.writer_writable_roots), stableStringify(writableRoots), "writer writable roots"],
      [claims.writer_writable_roots_hash, sha256(JSON.stringify(writableRoots)), "writer writable roots hash"],
      [claims.sandbox_profile_id, process.env.MOUSELY_SANDBOX_PROFILE_ID, "sandbox profile id"],
      [claims.sandbox_profile_hash, process.env.MOUSELY_SANDBOX_PROFILE_HASH, "sandbox profile hash"],
      [claims.writer_agent_id, process.env.MOUSELY_WRITER_AGENT_ID, "writer agent id"],
      [claims.writer_session_id, process.env.MOUSELY_WRITER_SESSION_ID, "writer session id"],
      [claims.trusted_harness_path, (() => {
        try {
          return realpathSync(process.env.MOUSELY_TRUSTED_HARNESS ?? "");
        } catch {
          return "";
        }
      })(), "trusted harness path"],
      [claims.trusted_harness_hash, (() => {
        try {
          return sha256(readFileSync(process.env.MOUSELY_TRUSTED_HARNESS ?? ""));
        } catch {
          return "";
        }
      })(), "trusted harness hash"],
      [claims.read_only_for_writer, true, "read-only boundary"],
      [claims.private_keys_isolated, true, "private-key isolation"],
      [claims.cleanup_token_isolated, true, "cleanup-token isolation"]
    ];
    const claimMismatch = expectedClaims.find(([left, right]) => left !== right);
    if (claimMismatch) return `capability runtime-control-boundary ${claimMismatch[2]} does not match the active broker profile`;
    const denialProbe = claims.writer_denial_probe;
    const testedAt = parseDate(denialProbe?.tested_at);
    const denialExpiresAt = parseDate(denialProbe?.expires_at);
    if (!denialProbe || denialProbe.sandbox_profile_id !== claims.sandbox_profile_id || denialProbe.trusted_harness_write_denied !== true || denialProbe.runtime_root_create_denied !== true || denialProbe.hook_subprocess_inherits_writer_sandbox !== true || !/^[A-Za-z0-9._-]{16,200}$/.test(String(denialProbe.nonce ?? "")) || !/^[a-f0-9]{64}$/.test(String(denialProbe.evidence_hash ?? "")) || !testedAt || !denialExpiresAt || testedAt.getTime() !== observedAt?.getTime() || denialExpiresAt.getTime() !== expiresAt?.getTime() || denialExpiresAt <= now) {
      return "capability runtime-control-boundary lacks a fresh typed writer-denial probe for the active sandbox";
    }
    try {
      const activeHarness = realpathSync(process.argv[1] ?? "");
      if (activeHarness !== claims.trusted_harness_path) return "capability runtime-control-boundary is not executing from the pinned external trusted harness";
    } catch {
      return "capability runtime-control-boundary cannot resolve the active harness executable";
    }
    if (!/^[a-f0-9]{64}$/.test(String(claims.lease_store_hash)) || !Number.isInteger(claims.lease_store_revision)) return "capability runtime-control-boundary initial lease-store evidence is malformed";
  } else if (receipt.claims !== null) return `capability ${String(check.name)} cannot carry runtime-boundary claims`;
  const key = verifierKeys2[String(receipt.verifier_key_id)];
  if (!key) return `capability ${String(check.name)} signed probe key is not trusted`;
  const { signature, ...unsigned } = receipt;
  try {
    const valid = verifyAsymmetric(null, Buffer.from(stableStringify(unsigned)), createPublicKey(key), Buffer.from(String(signature), "base64"));
    return valid ? null : `capability ${String(check.name)} signed probe signature is invalid`;
  } catch {
    return `capability ${String(check.name)} signed probe signature cannot be verified`;
  }
}
function verifierRegistryError(check) {
  const name = String(check.name);
  const registered = CAPABILITY_REGISTRY[name];
  if (!registered) return `capability ${name} is not in the typed registry`;
  const verifier = check.verifier;
  if (verifier.kind !== registered.kind) return `capability ${name} uses ${String(verifier.kind)} instead of registered verifier ${registered.kind}`;
  if (registered.target && verifier.target !== registered.target) return `capability ${name} verifier target does not match the typed registry`;
  if (registered.expected && verifier.expected !== registered.expected) return `capability ${name} verifier expectation does not match the typed registry`;
  const signed = registered.kind === "signed-probe";
  if (signed && (typeof verifier.receipt_path !== "string" || typeof verifier.receipt_hash !== "string" || verifier.target !== name || typeof verifier.expected !== "string")) {
    return `capability ${name} signed probe binding is incomplete`;
  }
  if (!signed && (verifier.receipt_path !== null || verifier.receipt_hash !== null)) return `capability ${name} non-probe verifier cannot carry a probe receipt`;
  return null;
}
function revalidateCheck(check, snapshot, repository, now, verifierKeys2) {
  if (check.available !== true) return `capability ${String(check.name)} is unavailable`;
  const registryError = verifierRegistryError(check);
  if (registryError) return registryError;
  const observedAt = parseDate(check.observed_at);
  if (!observedAt || observedAt.getTime() > now.getTime() + CLOCK_SKEW_MS) return `capability ${String(check.name)} has an invalid observation time`;
  const verifier = check.verifier;
  const kind = String(verifier.kind);
  const target = String(verifier.target);
  const expected = verifier.expected === null ? null : String(verifier.expected);
  if (kind !== "signed-probe" && now.getTime() - observedAt.getTime() > MAX_SNAPSHOT_AGE_MS) return `capability ${String(check.name)} observation is older than five minutes`;
  switch (kind) {
    case "node-runtime":
      return Number(process.versions.node.split(".")[0]) === Number(expected) ? null : `capability ${String(check.name)} runtime version no longer matches`;
    case "command": {
      const actual = resolveCommandExecutable(target);
      if (!actual) return `capability ${String(check.name)} command is no longer available`;
      if (expected && actual !== expected) return `capability ${String(check.name)} command resolution changed`;
      return null;
    }
    case "signed-probe":
      return verifySignedProbe(check, snapshot, repository, now, verifierKeys2);
    default:
      return `capability ${String(check.name)} uses an unsupported verifier`;
  }
}
function revalidateCapabilitySnapshot(snapshot, options) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  const errors = [];
  const validation = validateContract(snapshot, "CapabilitySnapshot.v1");
  if (!validation.valid) errors.push(...validation.errors.map((error) => `capability snapshot ${error}`));
  const verifierRegistry = trustedProbeKeys();
  errors.push(...verifierRegistry.errors);
  if (options.expectedVerifierRegistryHash && verifierRegistry.hash !== options.expectedVerifierRegistryHash) errors.push("capability verifier key registry changed after preflight");
  const capturedAt = parseDate(snapshot.captured_at);
  const expiresAt = parseDate(snapshot.expires_at);
  if (!capturedAt || now.getTime() - capturedAt.getTime() > MAX_SNAPSHOT_AGE_MS || capturedAt.getTime() > now.getTime() + CLOCK_SKEW_MS) errors.push("capability snapshot is missing, stale, or from the future");
  if (!expiresAt || expiresAt <= now || capturedAt && expiresAt.getTime() - capturedAt.getTime() > MAX_SNAPSHOT_AGE_MS) errors.push("capability snapshot is expired or has a validity window longer than five minutes");
  let repository = path3.resolve(options.repository);
  try {
    repository = realpathSync(repository);
  } catch {
    errors.push("capability repository root is unavailable");
  }
  if (snapshot.repository !== repository) errors.push("capability snapshot repository does not match the active worktree");
  if (snapshot.base_sha !== options.baseSha) errors.push("capability snapshot base commit does not match preflight");
  if (snapshot.provider !== targetValue(options.contract, "provider")) errors.push("capability snapshot provider does not match task target");
  if (snapshot.host !== targetValue(options.contract, "host")) errors.push("capability snapshot host does not match task target");
  if (snapshot.host_fingerprint !== runtimeHostFingerprint()) errors.push("capability snapshot was captured on a different runtime host");
  const checks = Array.isArray(snapshot.checks) ? snapshot.checks : [];
  const byName = new Map(checks.map((check) => [String(check.name), check]));
  if (byName.size !== checks.length) errors.push("capability snapshot contains duplicate capability names");
  for (const check of checks) {
    const registryError = verifierRegistryError(check);
    if (registryError) errors.push(registryError);
  }
  const requiredCapabilities = Array.isArray(options.contract.capabilities) ? options.contract.capabilities.map(String) : [];
  const unknownRequired = requiredCapabilities.filter((name) => !CAPABILITY_REGISTRY[name]);
  if (unknownRequired.length > 0) errors.push(`task requires capabilities outside the typed registry: ${unknownRequired.join(", ")}`);
  const missingCapabilities = requiredCapabilities.filter((name) => byName.get(name)?.available !== true);
  for (const name of requiredCapabilities) {
    const check = byName.get(name);
    if (!check || check.available !== true) continue;
    const error = revalidateCheck(check, snapshot, repository, now, verifierRegistry.keys);
    if (error) errors.push(error);
  }
  if (missingCapabilities.length > 0) errors.push("required capabilities unavailable; substitutions are not implicit");
  const forbiddenSubstitutions = Array.isArray(options.contract.forbidden_substitutions) ? options.contract.forbidden_substitutions.map(String) : [];
  for (const name of forbiddenSubstitutions) {
    const substitutes = FORBIDDEN_SUBSTITUTION_REGISTRY[name];
    if (!substitutes) errors.push(`unknown forbidden-substitution policy: ${name}`);
    else for (const substitute of substitutes) if (byName.get(substitute)?.available === true) errors.push(`forbidden substitution is present: ${name} via ${substitute}`);
  }
  const fallbacks = Array.isArray(options.contract.permitted_fallbacks) ? options.contract.permitted_fallbacks.map(String) : [];
  for (const fallback of fallbacks) if (!CAPABILITY_REGISTRY[fallback]) errors.push(`permitted fallback is outside the typed capability registry: ${fallback}`);
  const requiredCommands = [...new Set(options.requiredCommands ?? [])];
  const commandResolutions = {};
  const missingCommands = [];
  for (const command of requiredCommands) {
    const resolved = resolveCommandExecutable(command);
    if (!resolved) missingCommands.push(command);
    else commandResolutions[command] = resolved;
  }
  if (missingCommands.length > 0) errors.push("required commands unavailable");
  if (options.expectedCommandResolutions) {
    const expectedNames = Object.keys(options.expectedCommandResolutions).sort();
    if (JSON.stringify(expectedNames) !== JSON.stringify(requiredCommands.slice().sort())) errors.push("bound command set does not match required commands");
    for (const [command, expected] of Object.entries(options.expectedCommandResolutions)) if (commandResolutions[command] !== expected) errors.push(`required command resolution changed: ${command}`);
  }
  return { ok: errors.length === 0, errors, missingCapabilities, missingCommands, commandResolutions, verifierRegistryHash: verifierRegistry.hash };
}

// src/context.ts
import { access, readFile as readFile2, realpath as realpath2 } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash as createHash2 } from "node:crypto";
function git(root, args) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  return {
    ok: result.status === 0,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim()
  };
}
function githubRepository(remote) {
  const match2 = /^(?:https:\/\/github\.com\/|ssh:\/\/git@github\.com\/|git@github\.com:)([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?\/?$/i.exec(remote.trim());
  return match2 ? `${match2[1]}/${match2[2]}` : null;
}
async function verifyRepositoryBinding(lock, repositoryRoot) {
  const errors = [];
  const target = lock.target_repository;
  const expectedRepository = String(target.repository);
  const expectedRevision = String(target.revision);
  const sourceRevisions = lock.source_revisions;
  const targetRevisionEntry = Object.entries(sourceRevisions).find(([name]) => name.toLowerCase() === expectedRepository.toLowerCase());
  if (!targetRevisionEntry || targetRevisionEntry[1] !== expectedRevision) errors.push("target repository revision disagrees with source_revisions");
  if (sourceRevisions["Mouse-ly/mousely-ops"] !== lock.source_revision) errors.push("Mousely Ops revision disagrees with source_revisions");
  let resolvedRoot;
  try {
    resolvedRoot = await realpath2(repositoryRoot);
  } catch (error) {
    return [...errors, `target repository root is unavailable: ${error.message}`];
  }
  const topLevel = git(resolvedRoot, ["rev-parse", "--show-toplevel"]);
  if (!topLevel.ok) return [...errors, `target repository binding requires Git: ${topLevel.output}`];
  try {
    if (await realpath2(topLevel.output) !== resolvedRoot) errors.push("target repository root is not the Git worktree root");
  } catch (error) {
    errors.push(`cannot resolve target Git worktree root: ${error.message}`);
  }
  const origin = git(resolvedRoot, ["remote", "get-url", "origin"]);
  const actualRepository = origin.ok ? githubRepository(origin.output) : null;
  if (!origin.ok || !actualRepository) errors.push("target repository origin is missing or is not a canonical GitHub HTTPS/SSH URL");
  else if (actualRepository.toLowerCase() !== expectedRepository.toLowerCase()) errors.push(`target repository origin is ${actualRepository}; expected ${expectedRepository}`);
  const commit = git(resolvedRoot, ["cat-file", "-e", `${expectedRevision}^{commit}`]);
  if (!commit.ok) errors.push(`target base commit is unavailable: ${expectedRevision}`);
  const head = git(resolvedRoot, ["rev-parse", "HEAD"]);
  if (!head.ok || !/^[a-f0-9]{40}$/.test(head.output)) errors.push("target repository HEAD is unavailable or abbreviated");
  if (commit.ok && head.ok) {
    const ancestor = git(resolvedRoot, ["merge-base", "--is-ancestor", expectedRevision, head.output]);
    if (!ancestor.ok) errors.push("target base commit is not an ancestor of current HEAD");
  }
  return errors;
}
async function verifyContextLock(lock, root, now = /* @__PURE__ */ new Date(), repositoryRoot = root) {
  const validation = validateContract(lock, "ContextLock.v1");
  const errors = [...validation.errors];
  const verified = [];
  if (!validation.valid) return { ok: false, status: "invalid-context-lock", errors, verified };
  const freshness = lock.freshness;
  const expiresAt = new Date(String(freshness.expires_at));
  if (!Number.isFinite(expiresAt.getTime()) || expiresAt <= now) errors.push("context lock is stale");
  errors.push(...await verifyRepositoryBinding(lock, repositoryRoot));
  for (const entry of lock.repository_owned_files ?? []) {
    const relativePath = String(entry);
    try {
      const absolute = await resolveExistingInside(root, relativePath);
      await access(absolute);
      verified.push(`${relativePath} (repository-owned)`);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }
  for (const section of lock.repository_owned_sections ?? []) {
    const relativePath = String(section.path);
    try {
      const absolute = await resolveExistingInside(root, relativePath);
      const content = (await readFile2(absolute, "utf8")).replace(/\r\n?/g, "\n");
      const start = String(section.start_marker);
      const end = String(section.end_marker);
      const startIndex = content.indexOf(start);
      const endIndex = content.indexOf(end, Math.max(0, startIndex + start.length));
      const startIsLine = startIndex === 0 || content[startIndex - 1] === "\n";
      const startEndsLine = startIndex >= 0 && (content[startIndex + start.length] === "\n" || startIndex + start.length === content.length);
      const endIsLine = endIndex === 0 || content[endIndex - 1] === "\n";
      const endEndsLine = endIndex >= 0 && (content[endIndex + end.length] === "\n" || endIndex + end.length === content.length);
      if (startIndex < 0 || endIndex <= startIndex || content.indexOf(start, startIndex + start.length) >= 0 || content.indexOf(end, endIndex + end.length) >= 0 || !startIsLine || !startEndsLine || !endIsLine || !endEndsLine) {
        errors.push(`${relativePath}: generated policy markers are missing, duplicated, not standalone, or out of order`);
        continue;
      }
      const block = content.slice(startIndex, endIndex + end.length);
      const actual = createHash2("sha256").update(Buffer.from(block, "utf8")).digest("hex");
      if (actual !== section.sha256) errors.push(`${relativePath}: generated policy block checksum mismatch`);
      else verified.push(`${relativePath} (generated policy block)`);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }
  const entries = [
    ...lock.generated_files ?? [],
    lock.harness,
    ...lock.protocol_contracts ?? [],
    ...lock.brand_assets ?? []
  ];
  for (const entry of entries) {
    const relativePath = String(entry.path);
    try {
      const absolute = await resolveExistingInside(root, relativePath);
      await access(absolute);
      const actual = await hashFile(absolute);
      if (actual !== entry.sha256) errors.push(`${relativePath}: checksum mismatch`);
      else verified.push(relativePath);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }
  return {
    ok: errors.length === 0,
    status: errors.length === 0 ? "verified" : errors.includes("context lock is stale") ? "stale" : "drift",
    errors,
    verified
  };
}

// src/diff.ts
import { execFileSync } from "node:child_process";
import { lstatSync as lstatSync2, readFileSync as readFileSync2 } from "node:fs";
import path4 from "node:path";

// src/redaction.ts
var tokenRules = [
  ["private-key", /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g],
  ["github-token", /\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{20,}\b/g],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g],
  ["openai-key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g],
  ["aws-access-key", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ["google-api-key", /\bAIza[0-9A-Za-z_-]{30,}\b/g],
  ["stripe-secret", /\b(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{16,}\b/g],
  ["npm-token", /\bnpm_[A-Za-z0-9]{20,}\b/g],
  ["gitlab-token", /\bglpat-[A-Za-z0-9_-]{20,}\b/g],
  ["cloudflare-token", /\b(?:CF_API_TOKEN|CLOUDFLARE_API_TOKEN)\s*[:=]\s*["']?[A-Za-z0-9_-]{20,}/gi],
  ["authorization-header", /\bAuthorization\s*:\s*(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{12,}/gi],
  ["url-credentials", /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@]{1,128}:[^\s/@]{8,128}@/gi],
  ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g],
  ["generic-secret-assignment", /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|private[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9_+\/=.-]{16,}/gi]
];
function scanSecrets(value) {
  const findings = [];
  const visit = (input, path11) => {
    if (typeof input === "string") {
      for (const [rule, pattern] of tokenRules) {
        pattern.lastIndex = 0;
        for (const _match of input.matchAll(pattern)) findings.push({ path: path11, rule, preview: "[REDACTED]" });
      }
      return;
    }
    if (Array.isArray(input)) {
      input.forEach((item, index) => visit(item, `${path11}/${index}`));
      return;
    }
    if (input && typeof input === "object") {
      for (const [key, item] of Object.entries(input)) visit(item, `${path11}/${key}`);
    }
  };
  visit(value, "");
  return findings;
}
function redactValue(value) {
  if (typeof value === "string") {
    let output = value;
    for (const [, pattern] of tokenRules) {
      pattern.lastIndex = 0;
      output = output.replace(pattern, "[REDACTED]");
    }
    return output;
  }
  if (Array.isArray(value)) return value.map(redactValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactValue(item)]));
  }
  return value;
}

// src/diff.ts
var generatedPatterns = [
  "**/generated/**",
  "**/dist/**",
  "**/*.generated.*",
  ".mousely/harness.mjs",
  "mousely-context.lock"
];
function normalizedPath(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//, "");
}
function isGeneratedPath(filePath) {
  return generatedPatterns.some((pattern) => minimatch(normalizedPath(filePath), pattern, { dot: true }));
}
function countPatch(patch) {
  let additions = 0;
  let deletions = 0;
  for (const line of patch.split("\n")) {
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (line.startsWith("+")) additions += 1;
    else if (line.startsWith("-")) deletions += 1;
  }
  return { additions, deletions };
}
function parseUnifiedDiff(raw) {
  const files = [];
  let current;
  const flush = () => {
    if (!current) return;
    const patch = current.lines.join("\n");
    files.push({ path: current.path, patch, ...countPatch(patch), generated: isGeneratedPath(current.path) });
  };
  for (const line of raw.split("\n")) {
    const match2 = /^diff --git a\/(.+) b\/(.+)$/.exec(line);
    if (match2?.[2]) {
      flush();
      current = { path: normalizedPath(match2[2]), lines: [line] };
    } else if (current) current.lines.push(line);
  }
  flush();
  return files;
}
function parseNumstatZ(raw) {
  const files = /* @__PURE__ */ new Map();
  const records = raw.split("\0");
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (!record) continue;
    const [additionsRaw, deletionsRaw, inlinePath = ""] = record.split("	", 3);
    let filePath = inlinePath;
    let previousPath;
    if (!filePath) {
      previousPath = records[index + 1];
      filePath = records[index + 2] ?? "";
      index += 2;
    }
    filePath = normalizedPath(filePath);
    if (!filePath) continue;
    files.set(filePath, {
      path: filePath,
      ...previousPath ? { previous_path: normalizedPath(previousPath) } : {},
      additions: additionsRaw === "-" ? 0 : Number(additionsRaw ?? 0),
      deletions: deletionsRaw === "-" ? 0 : Number(deletionsRaw ?? 0),
      generated: isGeneratedPath(filePath)
    });
  }
  return files;
}
function gitChangedFiles(repoRoot, base = "HEAD", includeUntracked = true) {
  const root = path4.resolve(repoRoot);
  const output = execFileSync("git", ["diff", "--no-ext-diff", "--find-renames", "--numstat", "-z", base, "--"], {
    cwd: root,
    encoding: "utf8"
  });
  const files = parseNumstatZ(output);
  const untracked = includeUntracked ? execFileSync("git", ["ls-files", "--others", "--exclude-standard", "-z"], {
    cwd: root,
    encoding: "utf8"
  }).split("\0").filter(Boolean) : [];
  for (const untrackedPath of untracked) {
    const clean = normalizedPath(untrackedPath);
    let additions = 0;
    let patch = "";
    let status = "untracked";
    try {
      const absolute = path4.join(root, clean);
      const metadata = lstatSync2(absolute);
      if (metadata.isSymbolicLink()) {
        status = "unsafe-symlink";
      } else if (!metadata.isFile()) {
        status = "unsafe-non-regular";
      } else if (metadata.size > 1024 * 1024) {
        status = "unsafe-oversize";
      } else {
        patch = readFileSync2(absolute, "utf8");
        additions = patch.split("\n").length;
      }
    } catch {
      status = "unsafe-unreadable";
      additions = 0;
    }
    files.set(clean, { path: clean, status, additions, deletions: 0, patch, generated: isGeneratedPath(clean) });
  }
  for (const file of files.values()) {
    if (file.status === "untracked" || file.status?.startsWith("unsafe-")) continue;
    try {
      file.patch = execFileSync("git", ["diff", "--no-ext-diff", base, "--", file.path], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 5 * 1024 * 1024
      });
    } catch {
      file.patch = "";
      file.status = "unsafe-diff-unavailable";
    }
  }
  return [...files.values()].sort((left, right) => left.path.localeCompare(right.path));
}
function gitChangedFilesBetween(repoRoot, base, head) {
  if (!/^[a-f0-9]{40}$/.test(base) || !/^[a-f0-9]{40}$/.test(head)) throw new Error("Exact 40-character base and head SHAs are required");
  const root = path4.resolve(repoRoot);
  const output = execFileSync("git", ["diff", "--no-ext-diff", "--find-renames", "--numstat", "-z", base, head, "--"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024
  });
  const files = parseNumstatZ(output);
  for (const file of files.values()) {
    try {
      file.patch = execFileSync("git", ["diff", "--no-ext-diff", base, head, "--", file.path], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 5 * 1024 * 1024
      });
    } catch {
      file.patch = "";
      file.status = "unsafe-diff-unavailable";
    }
  }
  return [...files.values()].sort((left, right) => left.path.localeCompare(right.path));
}
function normalizeChangedFiles(value) {
  const source = Array.isArray(value) ? value : value?.files;
  if (!Array.isArray(source)) throw new Error("Changed-files input must be an array or an object with a files array");
  return source.map((item) => {
    const file = typeof item === "string" ? { path: item } : item;
    const filePath = normalizedPath(file.path);
    return {
      ...file,
      path: filePath,
      additions: Number(file.additions ?? 0),
      deletions: Number(file.deletions ?? 0),
      generated: file.generated ?? isGeneratedPath(filePath)
    };
  });
}
function classifyFile(file) {
  const filePath = normalizedPath(file.path).toLowerCase();
  const patch = (file.patch ?? "").toLowerCase();
  const classes = /* @__PURE__ */ new Set();
  const extension = path4.posix.extname(filePath);
  if (/(^|\/)(test|tests|__tests__|spec|specs)(\/|$)|\.(test|spec)\./.test(filePath)) classes.add("tests");
  if (/\.mdx?$|\.rst$|(^|\/)docs\//.test(filePath)) classes.add("documentation");
  if (/(^|\/)(\.github|ci|config)(\/|$)|(^|\/)(package-lock\.json|package\.json|tsconfig.*|.*\.ya?ml|dockerfile)$/.test(filePath)) classes.add("configuration-ci");
  if (/(^|\/)(ui|views?|components?|screens?|styles?|assets?)(\/|$)|\.(css|scss|sass|less|html|tsx|jsx|swift)$/.test(filePath)) classes.add("ui-ux");
  if (/(^|\/)(server|backend|runtime|workers?|functions?|src)(\/|$)|\.(ts|js|mjs|cjs|go|rs|py|java|kt|cs)$/.test(filePath) && !classes.has("tests")) classes.add("backend-runtime");
  if (/(^|\/)(migrations?|schema|fixtures?|data)(\/|$)|\.(sql|csv|parquet)$/.test(filePath)) classes.add("migration-data");
  if (/(^|\/)(api|cli|sdk|bin)(\/|$)|openapi|swagger|graphql/.test(filePath + patch)) classes.add("api-cli-sdk");
  if (/auth|oauth|permission|privacy|secret|credential|keychain|personal[-_ ]data|telemetry/.test(filePath + patch)) classes.add("authentication-privacy");
  if (/protocol|network|udp|ble|bluetooth|socket|websocket|http client/.test(filePath + patch)) classes.add("protocol-networking");
  if (/(^|\/)(release|publishing|fastlane)(\/|$)|versioncode|notari[sz]|app store|testflight|signing|\.github\/workflows\/release/.test(filePath + patch)) classes.add("release-publishing");
  if (classes.size === 0 && extension) classes.add("backend-runtime");
  return [...classes].sort();
}
function classifyDiff(files) {
  const changeClasses = /* @__PURE__ */ new Set();
  let changedLines = 0;
  const classified = files.map((file) => {
    const classes = classifyFile(file);
    classes.forEach((item) => changeClasses.add(item));
    if (!file.generated) changedLines += Number(file.additions ?? 0) + Number(file.deletions ?? 0);
    return { ...file, change_classes: classes };
  });
  return { files: classified, change_classes: [...changeClasses].sort(), non_generated_changed_lines: changedLines };
}
function guardScope(files, contract) {
  const editScope = contract.edit_scope;
  const allowed = Array.isArray(editScope?.allowed_globs) ? editScope.allowed_globs.map(String) : [];
  const forbidden = Array.isArray(editScope?.forbidden_globs) ? editScope.forbidden_globs.map(String) : [];
  const expected = new Set(Array.isArray(editScope?.expected_change_classes) ? editScope.expected_change_classes.map(String) : []);
  const classification = classifyDiff(files);
  const violations = [];
  const warnings = [];
  for (const file of classification.files) {
    if (file.status?.startsWith("unsafe-")) violations.push(`${file.path}: ${file.status}; content inspection failed closed`);
    const patch = file.patch ?? "";
    const addedContent = file.status === "untracked" ? patch : patch.split("\n").filter((line) => line.startsWith("+") && !line.startsWith("+++")).map((line) => line.slice(1)).join("\n");
    if (scanSecrets(addedContent).length > 0) violations.push(`${file.path}: added content contains potential secret material`);
    for (const affectedPath of [file.previous_path, file.path].filter((item) => Boolean(item))) {
      if (!safeRelativePath(affectedPath)) {
        violations.push(`${affectedPath}: unsafe or out-of-repository path`);
        continue;
      }
      if (!allowed.some((glob) => minimatch(affectedPath, glob, { dot: true }))) {
        violations.push(`${affectedPath}: outside allowed_globs`);
      }
      if (forbidden.some((glob) => minimatch(affectedPath, glob, { dot: true }))) {
        violations.push(`${affectedPath}: matches forbidden_globs`);
      }
    }
    for (const changeClass of file.change_classes) {
      if (expected.size > 0 && !expected.has(changeClass)) {
        violations.push(`${file.path}: unexpected change class ${changeClass}`);
      }
    }
  }
  const alertThreshold = editScope?.changed_file_alert_threshold;
  if (typeof alertThreshold === "number" && files.length > alertThreshold) {
    warnings.push(`${files.length} changed files exceeds alert threshold ${alertThreshold}`);
  }
  if (classification.non_generated_changed_lines > 200) {
    warnings.push("more than 200 non-generated changed lines requires outside/adversarial review");
  }
  return { ...classification, ok: violations.length === 0, violations, warnings };
}

// src/docs-impact.ts
function supportsImpact(impact, file) {
  const text = `${file.path}
${file.patch ?? ""}`.toLowerCase();
  switch (impact) {
    case "public-behavior":
      return /(^|\/)docs\/.+|readme/.test(file.path.toLowerCase()) && /behavior|feature|product|user|signup|onboarding|flow|screen|route|usage/.test(text);
    case "api-cli-sdk":
      return /api|cli|sdk|openapi|graphql/.test(text);
    case "setup":
      return /readme|setup|install|getting[- ]started|prerequisite/.test(text);
    case "privacy-security":
      return /privacy|security|permission|personal[- ]data|telemetry|credential/.test(text);
    case "release-update":
      return /changelog|release|update|updater|version|rollout|store/.test(text);
    case "support-troubleshooting":
      return /support|troubleshoot|recovery|known[- ]issue|error/.test(text);
    default:
      return false;
  }
}
function classifyDocsImpact(files) {
  const impacts = /* @__PURE__ */ new Set();
  const required = /* @__PURE__ */ new Set();
  const human = /* @__PURE__ */ new Set();
  const docsFiles = files.filter((file) => /(^|\/)docs\/|\.mdx?$|readme/i.test(file.path)).map((file) => file.path);
  const text = files.map((file) => `${file.path}
${file.patch ?? ""}`).join("\n").toLowerCase();
  if (/ui|views?|components?|screens?|routes?|feature|behavior|\.tsx|\.swift/.test(text)) {
    impacts.add("public-behavior");
    required.add("public-behavior");
  }
  if (/api|cli|sdk|openapi|graphql/.test(text)) {
    impacts.add("api-cli-sdk");
    required.add("api-cli-sdk");
  }
  if (/architecture|protocol|boundary|adr/.test(text)) impacts.add("architecture");
  if (/setup|install|dependency|package\.json|docker/.test(text)) {
    impacts.add("setup");
    required.add("setup");
  }
  if (/auth|privacy|security|permission|personal data|telemetry|secret/.test(text)) {
    impacts.add("privacy-security");
    required.add("privacy-security");
  }
  if (/release|updater|version|testflight|notari[sz]|store/.test(text)) {
    impacts.add("release-update");
    required.add("release-update");
  }
  if (/error|troubleshoot|support|recovery/.test(text)) {
    impacts.add("support-troubleshooting");
    required.add("support-troubleshooting");
  }
  if (/\.mmd|mermaid|diagram/.test(text)) {
    impacts.add("diagrams");
    human.add("brand-sensitive diagram");
  }
  if (/screenshot|\.png|\.jpe?g|\.webp/.test(text)) {
    impacts.add("screenshots");
    human.add("taste-sensitive screenshot");
  }
  if (/marketing|brand[-_ ]copy|headline|tagline|hero[-_ ]copy|call[-_ ]to[-_ ]action|\bcta\b|value proposition/.test(text)) human.add("marketing or brand-sensitive language");
  const updates = [];
  for (const impact of required) {
    for (const file of files.filter((item) => docsFiles.includes(item.path))) {
      if (supportsImpact(impact, file)) updates.push({ impact, path: file.path });
    }
  }
  const missingRequired = [...required].filter((impact) => !updates.some((update) => update.impact === impact));
  let status = "not-required";
  if (human.size > 0) status = "needs-human";
  else if (missingRequired.length > 0) status = "blocked";
  else if (impacts.size > 0) status = "complete";
  return {
    status,
    impacts: [...impacts].sort(),
    required_updates: missingRequired.sort(),
    documentation_files: docsFiles.sort(),
    human_review: [...human].sort(),
    updates: updates.sort((left, right) => left.impact.localeCompare(right.impact) || left.path.localeCompare(right.path))
  };
}

// src/evals.ts
import { spawnSync as spawnSync2 } from "node:child_process";
import { lstat as lstat2 } from "node:fs/promises";
function validateSuite(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Eval suite must be an object");
  const suite = value;
  if (suite.schema_version !== "EvalSuite.v1" || !suite.id || !Array.isArray(suite.cases)) {
    throw new Error("Malformed EvalSuite.v1 manifest");
  }
  if (!Number.isInteger(suite.runtime_budget_ms) || suite.runtime_budget_ms <= 0) {
    throw new Error("Eval suite runtime_budget_ms must be a positive integer");
  }
  for (const field of ["usage_budget", "context_revision", "model_version", "evaluator_version"]) {
    if (typeof suite[field] !== "string" || !suite[field]) throw new Error(`Eval suite ${field} is required`);
  }
  if (!suite.contract_versions || !suite.skill_versions) throw new Error("Eval suite version maps are required");
  const ids = /* @__PURE__ */ new Set();
  for (const item of suite.cases) {
    if (!item.id || ids.has(item.id) || !Array.isArray(item.command) || item.command.length === 0) {
      throw new Error("Every eval case needs a unique id and non-empty argv command");
    }
    if (!Array.isArray(item.touches) || !Number.isInteger(item.timeout_ms) || item.timeout_ms <= 0 || item.required !== true || !["tap", "json"].includes(item.result_protocol)) {
      throw new Error(`Malformed eval case ${item.id}`);
    }
    if (item.result_protocol === "json" && (!item.result_file || !safeRelativePath(item.result_file))) throw new Error(`JSON eval case ${item.id} requires a safe result_file`);
    ids.add(item.id);
  }
  const mappedContracts = new Set(suite.cases.flatMap((item) => item.contracts ?? []));
  const mappedSkills = new Set(suite.cases.flatMap((item) => item.skills ?? []));
  for (const version of Object.values(suite.contract_versions)) if (!mappedContracts.has(version)) throw new Error(`No gate case maps contract ${version}`);
  for (const skill of Object.keys(suite.skill_versions)) if (!mappedSkills.has(skill)) throw new Error(`No gate case maps skill ${skill}`);
  return suite;
}
function isApplicable(item, touched) {
  if (touched.length === 0) return true;
  return touched.some((file) => item.touches.some((glob) => minimatch(file, glob, { dot: true })));
}
function compactOutput(value) {
  const text = typeof value === "string" ? value : value?.toString("utf8") ?? "";
  return text.length <= 16e3 ? text : `${text.slice(0, 16e3)}
[truncated]`;
}
async function runEvalSuite(options) {
  const suite = validateSuite(await readData(options.manifestPath));
  const selected = suite.cases.filter((item) => isApplicable(item, options.touched));
  const started = Date.now();
  const result = {
    schema_version: "EvalResult.v1",
    suite_id: suite.id,
    source_revision: suite.source_revision,
    started_at: new Date(started).toISOString(),
    status: "inconclusive",
    selected_cases: selected.map((item) => item.id),
    executed_cases: 0,
    contract_versions: suite.contract_versions ?? {},
    skill_versions: suite.skill_versions ?? {},
    context_revision: suite.context_revision,
    model_version: suite.model_version,
    evaluator_version: suite.evaluator_version,
    usage_budget: suite.usage_budget,
    cases: []
  };
  if (selected.length === 0) {
    result.status = "fail";
    result.reason = "zero applicable eval cases selected";
    result.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    await writeJsonAtomic(options.resultsPath, result);
    return result;
  }
  for (const item of selected) {
    if (Date.now() - started >= suite.runtime_budget_ms) {
      result.cases.push({
        id: item.id,
        status: "inconclusive",
        required: item.required,
        started_at: (/* @__PURE__ */ new Date()).toISOString(),
        duration_ms: 0,
        exit_code: null,
        stdout: "",
        stderr: "",
        reason: "suite runtime budget exhausted"
      });
      await writeJsonAtomic(options.resultsPath, result);
      continue;
    }
    const caseStarted = Date.now();
    const [program, ...argv] = item.command;
    const execution = spawnSync2(program, argv, {
      cwd: options.cwd,
      encoding: "utf8",
      timeout: Math.min(item.timeout_ms, suite.runtime_budget_ms - (Date.now() - started)),
      env: { ...process.env, MOUSELY_EVAL_CASE: item.id },
      maxBuffer: 4 * 1024 * 1024
    });
    const stdout = compactOutput(execution.stdout);
    const stderr = compactOutput(execution.stderr);
    let status;
    let reason;
    if (execution.error) {
      status = "inconclusive";
      reason = execution.error.message;
    } else if (execution.status !== 0) {
      status = "fail";
      reason = `command exited ${String(execution.status)}`;
    } else if (item.result_protocol === "tap" && !/(?:# tests [1-9]\d*\b|[1-9]\d* tests? (?:passed|executed))/i.test(`${stdout}
${stderr}`)) {
      status = "inconclusive";
      reason = "evaluator did not provide parseable non-zero test-count evidence";
    } else {
      status = "pass";
    }
    if (status === "pass" && item.result_protocol === "json" && item.result_file) {
      try {
        const resultPath = await resolveExistingInside(options.cwd, item.result_file);
        const metadata = await lstat2(resultPath);
        if (!metadata.isFile() || metadata.mtimeMs < caseStarted - 2) throw new Error("result artifact is stale or not a regular file");
        const caseResult2 = await readData(resultPath);
        if (caseResult2.case_id !== item.id || caseResult2.status !== "pass" || !Number.isInteger(caseResult2.executed_tests) || Number(caseResult2.executed_tests) < 1) {
          status = caseResult2.status === "fail" ? "fail" : "inconclusive";
          reason = "declared result artifact did not match case_id/status/executed_tests protocol";
        }
      } catch (error) {
        status = "inconclusive";
        reason = `missing or unparsable result artifact: ${error.message}`;
      }
    }
    const caseResult = {
      id: item.id,
      status,
      required: item.required,
      started_at: new Date(caseStarted).toISOString(),
      duration_ms: Date.now() - caseStarted,
      exit_code: execution.status,
      stdout,
      stderr,
      ...reason ? { reason } : {}
    };
    result.cases.push(caseResult);
    result.executed_cases = Number(result.executed_cases) + 1;
    await writeJsonAtomic(options.resultsPath, result);
  }
  const cases = result.cases;
  const requiredCases = cases.filter((item) => item.required);
  result.status = requiredCases.some((item) => item.status === "fail") ? "fail" : requiredCases.some((item) => item.status === "inconclusive") ? "inconclusive" : "pass";
  result.duration_ms = Date.now() - started;
  result.completed_at = (/* @__PURE__ */ new Date()).toISOString();
  await writeJsonAtomic(options.resultsPath, result);
  return result;
}

// src/hooks.ts
import { lstat as lstat5, mkdir as mkdir4, realpath as realpath5, rename as rename3, writeFile as writeFile3 } from "node:fs/promises";
import { spawnSync as spawnSync4 } from "node:child_process";
import path7 from "node:path";

// src/preflight-authority.ts
import { createPrivateKey, createPublicKey as createPublicKey2, randomUUID, sign as signAsymmetric, verify as verifyAsymmetric2 } from "node:crypto";
function verifierKeys() {
  const raw = process.env.MOUSELY_PREFLIGHT_VERIFIER_KEYS_JSON ?? "{}";
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return { keys: {}, hash: hashValue({}), errors: ["preflight verifier key registry is invalid JSON"] };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return { keys: {}, hash: hashValue({}), errors: ["preflight verifier key registry must be an object"] };
  const keys = {};
  const errors = [];
  for (const [id, pem] of Object.entries(value)) {
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(id) || typeof pem !== "string") {
      errors.push(`invalid preflight verifier key: ${id}`);
      continue;
    }
    try {
      const key = createPublicKey2(pem);
      if (key.asymmetricKeyType !== "ed25519") errors.push(`preflight verifier key must be Ed25519: ${id}`);
      else keys[id] = key.export({ type: "spki", format: "pem" }).toString();
    } catch {
      errors.push(`preflight verifier key cannot be parsed: ${id}`);
    }
  }
  if (Object.keys(keys).length === 0) errors.push("no trusted Ed25519 preflight verifier key is configured");
  return { keys, hash: hashValue(keys), errors };
}
function issueBrokerPreflightReceipt(options) {
  const privatePem = process.env.MOUSELY_PREFLIGHT_SIGNER_PRIVATE_KEY;
  const keyId = process.env.MOUSELY_PREFLIGHT_SIGNER_KEY_ID;
  if (!privatePem || !keyId || !/^[A-Za-z0-9._-]{1,100}$/.test(keyId)) throw new Error("preflight issuance requires an isolated Ed25519 broker private key and key ID");
  const signingKeyObject = createPrivateKey(privatePem);
  if (signingKeyObject.asymmetricKeyType !== "ed25519") throw new Error("preflight broker private key must be Ed25519");
  const registry = verifierKeys();
  if (registry.errors.length > 0) throw new Error(registry.errors.join("; "));
  const publicPem = createPublicKey2(signingKeyObject).export({ type: "spki", format: "pem" }).toString();
  if (registry.keys[keyId] !== publicPem) throw new Error("preflight broker private key does not match its pinned public registry entry");
  const unsigned = {
    schema_version: "PreflightReceipt.v1",
    id: `preflight-${randomUUID()}`,
    created_at: String(options.binding.verified_at),
    source_revision: options.sourceRevision,
    redaction_state: "redacted",
    issuer: { id: "kars-preflight-broker-v1", key_id: keyId, algorithm: "Ed25519" },
    verifier_registry_hash: registry.hash,
    binding: options.binding
  };
  const signature = signAsymmetric(null, Buffer.from(stableStringify(unsigned)), signingKeyObject).toString("base64");
  const receipt = { ...unsigned, signature };
  const errors = verifyBrokerPreflightReceipt(receipt, options.binding);
  if (errors.length > 0) throw new Error(`issued preflight receipt failed self-verification: ${errors.join("; ")}`);
  return receipt;
}
function verifyBrokerPreflightReceipt(receipt, expectedBinding) {
  const errors = [];
  const validation = validateContract(receipt, "PreflightReceipt.v1");
  if (!validation.valid) errors.push(...validation.errors);
  const registry = verifierKeys();
  errors.push(...registry.errors);
  const issuer = receipt.issuer;
  if (issuer?.id !== "kars-preflight-broker-v1" || issuer.algorithm !== "Ed25519" || typeof issuer.key_id !== "string") errors.push("preflight receipt issuer is not the pinned KARS Ed25519 broker");
  if (receipt.verifier_registry_hash !== registry.hash) errors.push("preflight receipt verifier registry hash does not match the pinned hook registry");
  if (stableStringify(receipt.binding) !== stableStringify(expectedBinding)) errors.push("broker preflight binding does not exactly match independently recomputed inputs");
  const key = issuer && typeof issuer.key_id === "string" ? registry.keys[issuer.key_id] : void 0;
  if (!key) errors.push("preflight receipt signer is not in the trusted registry");
  else {
    const { signature: _signature, ...unsigned } = receipt;
    try {
      if (!verifyAsymmetric2(null, Buffer.from(stableStringify(unsigned)), createPublicKey2(key), Buffer.from(String(receipt.signature), "base64"))) errors.push("preflight receipt Ed25519 signature is invalid");
    } catch {
      errors.push("preflight receipt Ed25519 signature cannot be verified");
    }
  }
  return errors;
}

// src/leases.ts
import { randomUUID as randomUUID2, timingSafeEqual as timingSafeEqual2 } from "node:crypto";
import { spawnSync as spawnSync3 } from "node:child_process";
import { readFileSync as readFileSync3 } from "node:fs";
import { kill } from "node:process";
import { lstat as lstat3, mkdir as mkdir2, readFile as readFile3, readdir, realpath as realpath3, rename as rename2, rmdir, unlink, writeFile as writeFile2 } from "node:fs/promises";
import path5 from "node:path";
var LOCK_WAIT_MS = 5e3;
var LOCK_STALE_MS = 5e3;
var HEARTBEAT_FRESH_MS = 2 * 6e4;
var MAX_LEASE_SECONDS = 2 * 60 * 60;
function leaseStoreEmpty(now) {
  return { schema_version: "LeaseStore.v1", instance_id: randomUUID2(), revision: 0, updated_at: now.toISOString(), leases: [] };
}
function validateStore(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("lease store must be an object");
  const store = value;
  if (store.schema_version !== "LeaseStore.v1" || typeof store.instance_id !== "string" || !/^[0-9a-f-]{36}$/.test(store.instance_id) || !Number.isInteger(store.revision) || Number(store.revision) < 0 || !Array.isArray(store.leases)) {
    throw new Error("invalid LeaseStore.v1 envelope");
  }
  for (const lease of store.leases) {
    const result = validateContract(lease, "Lease.v1");
    if (!result.valid) throw new Error(`invalid lease ${String(lease.id ?? "unknown")}: ${result.errors.join("; ")}`);
  }
  return store;
}
function processAlive(pid) {
  try {
    kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}
function currentProcessIdentity(pid) {
  if (!processAlive(pid)) return null;
  if (process.platform === "win32") return null;
  if (process.platform === "linux") {
    try {
      const statLine = readFileSync3(`/proc/${pid}/stat`, "utf8");
      const commandEnd = statLine.lastIndexOf(")");
      if (commandEnd < 0) return null;
      const fieldsFromState = statLine.slice(commandEnd + 1).trim().split(/\s+/);
      const startTicks = fieldsFromState[19];
      if (!startTicks || !/^[0-9]+$/.test(startTicks)) return null;
      return sha256(`linux\0${pid}\0${startTicks}`);
    } catch {
      return null;
    }
  }
  if (process.platform === "darwin") {
    const result = spawnSync3("/bin/ps", ["-p", String(pid), "-o", "lstart="], {
      encoding: "utf8",
      env: { PATH: "/usr/bin:/bin", LC_ALL: "C", LANG: "C", TZ: "UTC0" }
    });
    const started = result.status === 0 ? result.stdout.trim().replace(/\s+/g, " ") : "";
    return started ? sha256(`darwin\0${pid}\0${started}`) : null;
  }
  return null;
}
function immutableLeaseIdentity(lease) {
  return {
    id: lease.id,
    created_at: lease.created_at,
    source_revision: lease.source_revision,
    resource_type: lease.resource_type,
    resource_id: lease.resource_id,
    linear_issue: lease.linear_issue,
    idempotency_key: lease.idempotency_key,
    writer: lease.writer,
    writer_agent_id: lease.writer_agent_id,
    writer_session_id: lease.writer_session_id,
    one_writer: lease.one_writer,
    worktree: lease.worktree,
    repository: lease.repository,
    host_fingerprint: lease.host_fingerprint,
    contract_hash: lease.contract_hash,
    port: lease.port,
    device: lease.device,
    owner: lease.owner,
    pid: lease.pid,
    process_group: lease.process_group,
    process_identity: lease.process_identity,
    command_hash: lease.command_hash,
    health_url: lease.health_url
  };
}
function leaseIdentityHash(lease) {
  return hashValue(immutableLeaseIdentity(lease));
}
async function readStore(storePath, now = /* @__PURE__ */ new Date()) {
  try {
    const metadata = await lstat3(storePath);
    if (metadata.isSymbolicLink() || !metadata.isFile()) throw new Error("lease store must be a regular file, not a symlink");
    return validateStore(await readData(storePath));
  } catch (error) {
    if (error.code === "ENOENT") return leaseStoreEmpty(now);
    throw error;
  }
}
async function loadLeaseStore(storePath) {
  return readStore(storePath);
}
async function recoverAbandonedLock(lockPath2, storePath, hostFingerprint, now) {
  let owner;
  let ownerFile;
  try {
    const metadata = await lstat3(lockPath2);
    if (metadata.isSymbolicLink() || !metadata.isDirectory()) return false;
    const entries = await readdir(lockPath2);
    if (entries.length === 0) {
      const storeMetadata = await lstat3(storePath).catch(() => null);
      if (!storeMetadata || storeMetadata.isSymbolicLink() || !storeMetadata.isFile()) return false;
      const age = now.getTime() - metadata.mtimeMs;
      if (age < LOCK_STALE_MS) return false;
      await rmdir(lockPath2);
      return true;
    }
    if (entries.length !== 1 || entries[0] !== "owner.json" && !/^owner\.[1-9][0-9]*\.tmp$/.test(entries[0] ?? "")) return false;
    ownerFile = entries[0];
    owner = JSON.parse(await readFile3(path5.join(lockPath2, ownerFile), "utf8"));
  } catch {
    return false;
  }
  const createdAt = new Date(String(owner.created_at ?? ""));
  const pid = Number(owner.pid);
  if (owner.host_fingerprint !== hostFingerprint || !Number.isInteger(pid) || pid < 1 || !Number.isFinite(createdAt.getTime())) return false;
  if (ownerFile !== "owner.json" && ownerFile !== `owner.${pid}.tmp`) return false;
  if (now.getTime() - createdAt.getTime() < LOCK_STALE_MS || processAlive(pid)) return false;
  await unlink(path5.join(lockPath2, ownerFile));
  await rmdir(lockPath2);
  return true;
}
async function acquireStoreLock(storePath, hostFingerprint) {
  const lockPath2 = `${storePath}.lock`;
  const startedAt = Date.now();
  while (Date.now() - startedAt < LOCK_WAIT_MS) {
    let created = false;
    let temporary;
    try {
      await mkdir2(lockPath2);
      created = true;
      const ownerPath = path5.join(lockPath2, "owner.json");
      temporary = path5.join(lockPath2, `owner.${process.pid}.tmp`);
      await writeFile2(temporary, `${JSON.stringify({ pid: process.pid, host_fingerprint: hostFingerprint, created_at: (/* @__PURE__ */ new Date()).toISOString() }, null, 2)}
`, { mode: 384, flag: "wx" });
      await rename2(temporary, ownerPath);
      return async () => {
        const entries = await readdir(lockPath2);
        if (entries.length !== 1 || entries[0] !== "owner.json") throw new Error("lease lock contains unknown files; refusing destructive cleanup");
        await unlink(ownerPath);
        await rmdir(lockPath2);
      };
    } catch (error) {
      if (created) {
        try {
          const entries = await readdir(lockPath2);
          if (temporary && entries.length === 1 && path5.join(lockPath2, entries[0]) === temporary) {
            await unlink(temporary);
            await rmdir(lockPath2);
          } else if (entries.length === 0) await rmdir(lockPath2);
        } catch {
        }
      }
      if (error.code !== "EEXIST") throw error;
      if (await recoverAbandonedLock(lockPath2, storePath, hostFingerprint, /* @__PURE__ */ new Date())) continue;
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  throw new Error("lease store is locked by an active or unverifiable owner");
}
async function withStoreLock(storePath, hostFingerprint, action, persist = true) {
  await mkdir2(path5.dirname(storePath), { recursive: true });
  try {
    const initial = leaseStoreEmpty(/* @__PURE__ */ new Date());
    await writeFile2(storePath, `${JSON.stringify(initial, null, 2)}
`, { mode: 384, flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const release = await acquireStoreLock(storePath, hostFingerprint);
  try {
    const store = await readStore(storePath);
    const result = await action(store);
    if (persist) {
      store.revision += 1;
      store.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      await writeJsonAtomic(storePath, store);
    }
    return result;
  } finally {
    await release();
  }
}
function positiveInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`${label} must be a positive integer`);
  return value;
}
function resourceId(options) {
  switch (options.resourceType) {
    case "issue":
      return `issue:${options.linearIssue}`;
    case "writer":
      return `writer:${options.linearIssue}`;
    case "worktree":
      return `worktree:${options.worktree}`;
    case "port":
      return `port:${positiveInteger(Number(options.port), "port")}`;
    case "process":
      return `process:${positiveInteger(options.pid, "pid")}`;
    case "device": {
      if (!options.device) throw new Error("device lease requires a device identifier");
      return `device:${options.device}`;
    }
  }
}
function unreleased(lease) {
  return lease.released_at === null;
}
function cleanupTokenMatches(lease, cleanupToken) {
  const expected = Buffer.from(String(lease.cleanup_token), "hex");
  const supplied = Buffer.from(sha256(cleanupToken), "hex");
  return expected.length === supplied.length && timingSafeEqual2(expected, supplied);
}
function boundProcessState(lease) {
  if (typeof lease.pid !== "number") return "unverifiable";
  if (!processAlive(lease.pid)) return "dead";
  if (typeof lease.process_identity !== "string") return "unverifiable";
  const currentIdentity = currentProcessIdentity(lease.pid);
  if (!currentIdentity) return "unverifiable";
  return currentIdentity === lease.process_identity ? "live" : "dead";
}
function boundProcessReleaseError(lease) {
  const state = boundProcessState(lease);
  if (state === "live") return "lease is still bound to its live task process";
  if (state === "unverifiable") return "lease task process identity is live or unverifiable";
  return null;
}
function safeToRecover(lease, now, allowDeadBeforeExpiry) {
  if (!unreleased(lease)) return false;
  const expired = new Date(String(lease.expires_at)) <= now;
  if (!expired && !allowDeadBeforeExpiry) return false;
  if (boundProcessState(lease) !== "dead") return false;
  return expired || allowDeadBeforeExpiry;
}
function conflicts(existing, candidate) {
  if (!unreleased(existing)) return false;
  if (existing.resource_type === candidate.resource_type && existing.resource_id === candidate.resource_id) return true;
  const sameIdentity = existing.linear_issue === candidate.linear_issue && existing.writer === candidate.writer && existing.writer_agent_id === candidate.writer_agent_id && existing.writer_session_id === candidate.writer_session_id && existing.idempotency_key === candidate.idempotency_key && existing.worktree === candidate.worktree;
  if (sameIdentity) return false;
  if (existing.linear_issue === candidate.linear_issue) return true;
  if (existing.idempotency_key === candidate.idempotency_key) return true;
  if (existing.worktree === candidate.worktree) return true;
  return false;
}
async function acquireLease(options) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  const ttlSeconds = positiveInteger(options.ttlSeconds, "ttlSeconds");
  if (ttlSeconds > MAX_LEASE_SECONDS) throw new Error("lease TTL cannot exceed two hours");
  if (!processAlive(positiveInteger(options.pid, "pid"))) throw new Error("lease owner process is not alive");
  const repository = await realpath3(options.repository);
  const worktree = await realpath3(options.worktree);
  if (repository !== worktree) throw new Error("writer/resource lease repository and worktree must be the same exact Git worktree root");
  if (!options.linearIssue || !options.idempotencyKey || !options.writer || !options.writerAgentId || !options.writerSessionId || !options.owner) throw new Error("lease requires issue, idempotency, writer, writer agent/session, and owner identity");
  const cleanupToken = options.cleanupToken;
  if (cleanupToken.length < 16) throw new Error("cleanup token must contain at least sixteen characters");
  const candidate = {
    schema_version: "Lease.v1",
    id: randomUUID2(),
    created_at: now.toISOString(),
    source_revision: options.sourceRevision,
    redaction_state: "restricted",
    resource_type: options.resourceType,
    resource_id: resourceId({
      resourceType: options.resourceType,
      linearIssue: options.linearIssue,
      worktree,
      port: options.port,
      pid: options.pid,
      device: options.device
    }),
    linear_issue: options.linearIssue,
    idempotency_key: options.idempotencyKey,
    writer: options.writer,
    writer_agent_id: options.writerAgentId,
    writer_session_id: options.writerSessionId,
    one_writer: true,
    worktree,
    repository,
    host_fingerprint: options.hostFingerprint,
    contract_hash: options.contractHash,
    port: options.port ?? null,
    device: options.device ?? null,
    owner: options.owner,
    pid: options.pid,
    process_group: options.processGroup ?? null,
    process_identity: currentProcessIdentity(options.pid),
    command_hash: options.commandHash ?? null,
    health_url: options.healthUrl ?? null,
    heartbeat_at: now.toISOString(),
    expires_at: new Date(now.getTime() + ttlSeconds * 1e3).toISOString(),
    cleanup_token: sha256(cleanupToken),
    released_at: null
  };
  const validation = validateContract(candidate, "Lease.v1");
  if (!validation.valid) throw new Error(`cannot acquire invalid lease: ${validation.errors.join("; ")}`);
  return withStoreLock(options.storePath, options.hostFingerprint, (store) => {
    const recovered = [];
    for (const lease of store.leases) {
      if (lease.host_fingerprint === options.hostFingerprint && cleanupTokenMatches(lease, cleanupToken) && safeToRecover(lease, now, false)) {
        lease.released_at = now.toISOString();
        recovered.push(String(lease.id));
      }
    }
    const conflict = store.leases.find((lease) => conflicts(lease, candidate));
    if (conflict) throw new Error(`lease conflict with ${String(conflict.id)}; one writer/resource owner is already active or unverifiable`);
    store.leases.push(candidate);
    return { lease: candidate, recovered };
  });
}
function authorizedLease(store, options) {
  const lease = store.leases.find((item) => item.id === options.id);
  if (!lease) throw new Error("lease not found");
  if (lease.owner !== options.owner || lease.host_fingerprint !== options.hostFingerprint || !cleanupTokenMatches(lease, options.cleanupToken)) {
    throw new Error("lease owner, host, or cleanup token mismatch");
  }
  return lease;
}
async function heartbeatLease(options) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  const ttlSeconds = positiveInteger(options.ttlSeconds, "ttlSeconds");
  if (ttlSeconds > MAX_LEASE_SECONDS) throw new Error("lease TTL cannot exceed two hours");
  return withStoreLock(options.storePath, options.hostFingerprint, (store) => {
    const lease = authorizedLease(store, options);
    if (!unreleased(lease)) throw new Error("released lease cannot be heartbeated");
    if (typeof lease.pid !== "number" || !processAlive(lease.pid)) throw new Error("lease owner process is not alive");
    if (lease.process_identity && currentProcessIdentity(lease.pid) !== lease.process_identity) throw new Error("lease PID now belongs to a different process");
    lease.heartbeat_at = now.toISOString();
    lease.expires_at = new Date(now.getTime() + ttlSeconds * 1e3).toISOString();
    return lease;
  });
}
async function releaseLease(options) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  return withStoreLock(options.storePath, options.hostFingerprint, (store) => {
    const lease = authorizedLease(store, options);
    if (!unreleased(lease)) return lease;
    const processError = boundProcessReleaseError(lease);
    if (processError) throw new Error(`refusing to release while ${processError}; stop the bound task and verify its identity first`);
    lease.released_at = now.toISOString();
    return lease;
  });
}
async function recoverLease(options) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  return withStoreLock(options.storePath, options.hostFingerprint, (store) => {
    const lease = authorizedLease(store, options);
    if (!unreleased(lease)) return lease;
    if (!safeToRecover(lease, now, true)) {
      throw new Error("lease is still owned by a live or unverifiable process; recovery refuses to kill or reuse it");
    }
    lease.released_at = now.toISOString();
    return lease;
  });
}
async function cleanupExpiredLeases(options) {
  return withStoreLock(options.storePath, options.hostFingerprint, (store) => {
    const reclaimed = [];
    const skipped = [];
    for (const lease of store.leases) {
      if (!unreleased(lease) || new Date(String(lease.expires_at)) > options.now) continue;
      const id = String(lease.id ?? "unknown");
      if (lease.owner !== options.owner) {
        skipped.push({ id, reason: "different owner" });
        continue;
      }
      if (lease.host_fingerprint !== options.hostFingerprint || !cleanupTokenMatches(lease, options.cleanupToken)) {
        skipped.push({ id, reason: "lease host or cleanup token mismatch" });
        continue;
      }
      if (!safeToRecover(lease, options.now, false)) {
        skipped.push({ id, reason: "lease is still owned by a live or unverifiable process; cleanup refuses to kill it" });
        continue;
      }
      reclaimed.push(id);
      if (options.execute) lease.released_at = options.now.toISOString();
    }
    return { ok: skipped.every((item) => item.reason === "different owner"), status: skipped.length > 0 ? "partial" : "complete", reclaimed, skipped };
  }, options.execute);
}
async function validateActiveWriterLease(options) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  const errors = [];
  let store;
  try {
    store = await readStore(options.storePath, now);
  } catch (error) {
    return { errors: [`cannot read lease store: ${error.message}`] };
  }
  const lease = store.leases.find((item) => item.id === options.id);
  if (!lease) return { errors: ["bound writer lease is missing"] };
  if (lease.resource_type !== "writer") errors.push("bound lease is not a writer lease");
  if (leaseIdentityHash(lease) !== options.identityHash) errors.push("bound writer lease identity changed");
  if (lease.owner !== options.owner) errors.push("writer lease owner does not match preflight");
  if (lease.writer !== options.writer) errors.push("writer lease agent does not match preflight");
  if (lease.writer_agent_id !== options.writerAgentId) errors.push("writer lease agent identity does not match preflight");
  if (lease.writer_session_id !== options.writerSessionId) errors.push("writer lease session identity does not match preflight");
  if (lease.linear_issue !== options.linearIssue) errors.push("writer lease issue does not match task contract");
  if (lease.idempotency_key !== options.idempotencyKey) errors.push("writer lease idempotency key does not match task contract");
  if (lease.one_writer !== true) errors.push("writer lease does not enforce one-writer ownership");
  if (lease.worktree !== options.worktree || lease.repository !== options.repository) errors.push("writer lease worktree/repository does not match runtime");
  if (lease.host_fingerprint !== options.hostFingerprint) errors.push("writer lease belongs to a different host");
  if (lease.contract_hash !== options.contractHash) errors.push("writer lease belongs to a different task contract");
  if (lease.released_at !== null) errors.push("writer lease has been released");
  const heartbeatAt = new Date(String(lease.heartbeat_at));
  const expiresAt = new Date(String(lease.expires_at));
  if (expiresAt <= now) errors.push("writer lease has expired");
  if (heartbeatAt.getTime() > now.getTime() + 5e3) errors.push("writer lease heartbeat is from the future");
  if (now.getTime() - heartbeatAt.getTime() > HEARTBEAT_FRESH_MS) errors.push("writer lease heartbeat is older than two minutes");
  if (expiresAt.getTime() - heartbeatAt.getTime() > MAX_LEASE_SECONDS * 1e3) errors.push("writer lease validity exceeds the two-hour maximum");
  if (typeof lease.pid !== "number" || !processAlive(lease.pid)) errors.push("writer lease owner process is not alive");
  else if (lease.process_identity && currentProcessIdentity(lease.pid) !== lease.process_identity) errors.push("writer lease PID now belongs to a different process");
  return { lease, errors };
}

// src/runtime-paths.ts
import path6 from "node:path";
import { lstat as lstat4, mkdir as mkdir3, realpath as realpath4 } from "node:fs/promises";
function outside(root, candidate) {
  const relative = path6.relative(root, candidate);
  return relative === ".." || relative.startsWith(`..${path6.sep}`) || path6.isAbsolute(relative);
}
async function rejectSymlinkChain(absolute, allowMissingTail = false) {
  const parsed = path6.parse(absolute);
  let cursor = parsed.root;
  for (const part of absolute.slice(parsed.root.length).split(path6.sep).filter(Boolean)) {
    cursor = path6.join(cursor, part);
    try {
      const metadata = await lstat4(cursor);
      if (metadata.isSymbolicLink()) throw new Error(`symlink path component is forbidden: ${cursor}`);
    } catch (error) {
      if (allowMissingTail && error.code === "ENOENT") return;
      throw error;
    }
  }
}
async function resolveRuntimePaths(repository, create = false) {
  const repositoryRoot = await realpath4(repository);
  const configured = process.env.MOUSELY_RUNTIME_ROOT;
  if (!configured || !path6.isAbsolute(configured)) throw new Error("MOUSELY_RUNTIME_ROOT must be an absolute host-local control root outside every writer-writable root");
  await rejectSymlinkChain(configured, create);
  if (create) await mkdir3(configured, { recursive: true, mode: 448 });
  await rejectSymlinkChain(configured);
  const rootMetadata = await lstat4(configured);
  if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink()) throw new Error("MOUSELY_RUNTIME_ROOT must be a real directory, not a symlink");
  const root = await realpath4(configured);
  if (!outside(repositoryRoot, root) || !outside(root, repositoryRoot)) throw new Error("MOUSELY_RUNTIME_ROOT and the repository must not contain one another");
  const writableRootsRaw = process.env.MOUSELY_WRITER_WRITABLE_ROOTS_JSON;
  if (!writableRootsRaw) throw new Error("MOUSELY_WRITER_WRITABLE_ROOTS_JSON is required to prove the runtime root is outside writer scope");
  let writableRoots;
  try {
    writableRoots = JSON.parse(writableRootsRaw);
  } catch {
    throw new Error("MOUSELY_WRITER_WRITABLE_ROOTS_JSON must be valid JSON");
  }
  if (!Array.isArray(writableRoots) || writableRoots.length === 0 || writableRoots.some((item) => typeof item !== "string" || !path6.isAbsolute(item))) {
    throw new Error("MOUSELY_WRITER_WRITABLE_ROOTS_JSON must be a non-empty array of absolute paths");
  }
  const canonicalWriterRoots = [];
  for (const configuredRoot of writableRoots) {
    await rejectSymlinkChain(configuredRoot);
    const writerRoot = await realpath4(configuredRoot);
    canonicalWriterRoots.push(writerRoot);
    if (!outside(writerRoot, root) || !outside(root, writerRoot)) throw new Error("MOUSELY_RUNTIME_ROOT overlaps a declared writer-writable root");
  }
  const configuredHarness = process.env.MOUSELY_TRUSTED_HARNESS;
  if (!configuredHarness || !path6.isAbsolute(configuredHarness)) throw new Error("MOUSELY_TRUSTED_HARNESS must identify the hash-pinned external hook harness");
  await rejectSymlinkChain(configuredHarness);
  const trustedHarness = await realpath4(configuredHarness);
  const harnessMetadata = await lstat4(configuredHarness);
  if (!harnessMetadata.isFile() || harnessMetadata.isSymbolicLink()) throw new Error("MOUSELY_TRUSTED_HARNESS must be a regular non-symlink file");
  for (const writerRoot of canonicalWriterRoots) {
    if (!outside(writerRoot, trustedHarness)) throw new Error("MOUSELY_TRUSTED_HARNESS is inside a writer-writable root");
  }
  const namespace = sha256(repositoryRoot);
  const worktreeRoot = path6.join(root, "worktrees", namespace);
  if (create) {
    await mkdir3(worktreeRoot, { recursive: true, mode: 448 });
    await mkdir3(path6.join(worktreeRoot, "capability-probes"), { recursive: true, mode: 448 });
    await mkdir3(path6.join(worktreeRoot, "preflight-receipts"), { recursive: true, mode: 448 });
    await mkdir3(path6.join(worktreeRoot, "run-receipts"), { recursive: true, mode: 448 });
  }
  return {
    root,
    worktreeRoot,
    leaseStore: path6.join(root, "leases.json"),
    taskContract: path6.join(worktreeRoot, "task-contract.json"),
    capabilitySnapshot: path6.join(worktreeRoot, "capability-snapshot.json"),
    capabilityProbes: path6.join(worktreeRoot, "capability-probes"),
    preflightReceipt: path6.join(worktreeRoot, "active-preflight.json"),
    preflightReceipts: path6.join(worktreeRoot, "preflight-receipts"),
    runReceipts: path6.join(worktreeRoot, "run-receipts"),
    trustedHarness
  };
}

// src/hooks.ts
function hookResult(event, fields = {}) {
  return { hookSpecificOutput: { hookEventName: event, ...fields } };
}
function deny(reason) {
  return hookResult("PreToolUse", { permissionDecision: "deny", permissionDecisionReason: reason });
}
var PATCH_TOOLS = /* @__PURE__ */ new Set(["apply_patch", "applypatch", "patch_file"]);
var WRITE_TOOLS = /* @__PURE__ */ new Set([
  "write",
  "edit",
  "multiedit",
  "write_file",
  "write_to_file",
  "edit_file",
  "replace_in_file",
  "replace_file_content",
  "multi_replace_file_content",
  "create_file",
  "create_new_file",
  "delete_file",
  "delete_path",
  "move_file",
  "rename_file",
  "notebookedit",
  "notebook_edit",
  "insert_edit_into_file",
  "str_replace",
  "str_replace_editor"
]);
var SHELL_TOOLS = /* @__PURE__ */ new Set(["bash", "shell", "exec", "exec_command", "execute_command", "run_command", "run_terminal_command", "terminal", "write_stdin"]);
var READ_TOOLS = /* @__PURE__ */ new Set(["read", "read_file", "read_text_file", "list_dir", "glob", "grep", "rg", "find", "search", "ls", "view_image", "websearch", "webfetch", "task", "taskoutput", "askuserquestion", "todowrite"]);
function normalizedToolName(toolName) {
  const raw = toolName.toLowerCase();
  if (/^mcp__filesystem__[a-z0-9_-]+$/.test(raw)) return raw.split("__").at(-1) ?? "";
  if (/^[a-z0-9_-]+$/.test(raw)) return raw;
  const knownNamespace = /^(?:functions|tools)[.:/][a-z0-9_.:/-]+$/.test(raw);
  return knownNamespace ? raw.split(/__|[.:/]/).filter(Boolean).at(-1) ?? "" : raw;
}
function shellWords(command) {
  if (!command || /[\r\n;&|`<>\\]|\$\(|\$\{|\x00/.test(command)) return null;
  const words = [];
  let current = "";
  let quote = null;
  for (let index = 0; index < command.length; index += 1) {
    const character = command[index];
    if (quote) {
      if (character === quote) quote = null;
      else current += character;
    } else if (character === "'" || character === '"') quote = character;
    else if (/\s/.test(character)) {
      if (current) {
        words.push(current);
        current = "";
      }
    } else current += character;
  }
  if (quote) return null;
  if (current) words.push(current);
  return words;
}
function argvSafeReadCommand(command) {
  const words = shellWords(command);
  if (!words || words.length === 0 || words.some((word) => /^-.*=/.test(word) || word.includes(".."))) return false;
  if (words.length === 1 && words[0] === "pwd") return true;
  if (words.length === 2 && words[0] === "node" && (/* @__PURE__ */ new Set(["--version", "-v"])).has(words[1])) return true;
  if (words.length === 2 && words[0] === "npm" && words[1] === "--version") return true;
  if (words[0] === "git") {
    const subcommand = words[1];
    if (!subcommand || !(/* @__PURE__ */ new Set(["status", "diff", "log", "show", "rev-parse", "ls-files"])).has(subcommand)) return false;
    return words.slice(2).every((word) => !word.startsWith("-") || (/* @__PURE__ */ new Set(["--short", "--porcelain", "--stat", "--name-only", "--name-status", "--show-toplevel", "--verify", "--quiet", "--no-ext-diff", "--cached"])).has(word));
  }
  if (words[0] === "rg") return words.slice(1).every((word) => !word.startsWith("-") || (/* @__PURE__ */ new Set(["--files", "--hidden", "--no-heading", "--line-number", "--fixed-strings", "--glob", "-g", "-n", "-F"])).has(word));
  if (words[0] === "node" && words[1] === ".mousely/harness.mjs") {
    const allowed = /* @__PURE__ */ new Set(["doctor", "validate-contract", "verify-context", "guard-diff", "docs-impact", "review-status", "verify-proof", "scan-secrets"]);
    return Boolean(words[2] && allowed.has(words[2]));
  }
  return false;
}
function hasMutationPayload(value, depth = 0) {
  if (depth > 8) return true;
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some((item) => hasMutationPayload(item, depth + 1));
  const object = value;
  const fields = /* @__PURE__ */ new Set(["command", "cmd", "chars", "patch", "content", "new_string", "old_string", "edits", "changes", "diff", "data"]);
  return Object.entries(object).some(([key, item]) => fields.has(key.toLowerCase()) || hasMutationPayload(item, depth + 1));
}
function mutationKind(toolName, input) {
  const name = normalizedToolName(toolName);
  const mutationShaped = hasMutationPayload(input);
  if (PATCH_TOOLS.has(name)) return "patch";
  if (WRITE_TOOLS.has(name)) return "direct-write";
  if (SHELL_TOOLS.has(name)) {
    const command = commandText(input).trim();
    if (name === "write_stdin") return "shell";
    if (!command) return "unknown";
    if (/[\n;&|`<>]|\$\(/.test(command)) return "shell";
    if (argvSafeReadCommand(command)) return "none";
    return "shell";
  }
  if (mutationShaped) return "unknown";
  if (READ_TOOLS.has(name)) return "none";
  return "unknown";
}
function mutationLikely(toolName, input) {
  return mutationKind(toolName, input) !== "none";
}
function commandText(input) {
  for (const field of ["command", "cmd", "chars", "patch", "input"]) {
    if (typeof input[field] === "string") return String(input[field]);
  }
  return "";
}
async function repositoryRootFrom(cwdValue) {
  const cwd = path7.resolve(String(cwdValue ?? process.cwd()));
  const result = spawnSync4("git", ["-C", cwd, "rev-parse", "--show-toplevel"], { encoding: "utf8" });
  if (result.status !== 0 || !result.stdout.trim()) throw new Error("Mousely hooks require a Git repository worktree root.");
  const root = await realpath5(result.stdout.trim());
  const resolvedCwd = await realpath5(cwd);
  if (resolvedCwd !== root && !resolvedCwd.startsWith(`${root}${path7.sep}`)) throw new Error("Hook cwd is outside its discovered Git repository root.");
  return root;
}
function patchPaths(command, cwd, repositoryRoot) {
  const paths = [];
  for (const match2 of command.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)) {
    const raw = match2[1]?.trim();
    if (!raw) continue;
    const absolute = path7.isAbsolute(raw) ? path7.resolve(raw) : path7.resolve(cwd, raw);
    const relative = path7.relative(repositoryRoot, absolute);
    paths.push(relative.replaceAll("\\", "/"));
  }
  for (const match2 of command.matchAll(/^\*\*\* Move to: (.+)$/gm)) {
    const raw = match2[1]?.trim();
    if (!raw) continue;
    const absolute = path7.isAbsolute(raw) ? path7.resolve(raw) : path7.resolve(cwd, raw);
    const relative = path7.relative(repositoryRoot, absolute);
    paths.push(relative.replaceAll("\\", "/"));
  }
  return paths;
}
function directWritePaths(input, cwd, repositoryRoot) {
  const rawPaths = [];
  const pathFields = /* @__PURE__ */ new Set(["file_path", "path", "notebook_path", "target_file", "source_path", "destination_path", "old_path", "new_path"]);
  const collect = (value, depth = 0) => {
    if (depth > 8 || !value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const item of value) collect(item, depth + 1);
      return;
    }
    for (const [field, item] of Object.entries(value)) {
      if (pathFields.has(field) && typeof item === "string") rawPaths.push(item);
      else if (field === "paths" && Array.isArray(item)) rawPaths.push(...item.filter((entry) => typeof entry === "string"));
      else collect(item, depth + 1);
    }
  };
  collect(input);
  return [...new Set(rawPaths.map((raw) => {
    const absolute = path7.isAbsolute(raw) ? path7.resolve(raw) : path7.resolve(cwd, raw);
    return path7.relative(repositoryRoot, absolute).replaceAll("\\", "/");
  }))];
}
function protectedControlPath(file) {
  return file === "mousely.repo.yaml" || file === "mousely-context.lock" || file === ".mousely" || file.startsWith(".mousely/");
}
async function loadTaskContract(repositoryRoot) {
  try {
    const runtime = await resolveRuntimePaths(repositoryRoot);
    return await readData(runtime.taskContract);
  } catch {
    return void 0;
  }
}
async function validatedPreflight(repositoryRoot, contract, hookInput) {
  let runtime;
  try {
    runtime = await resolveRuntimePaths(repositoryRoot);
  } catch (error) {
    return { error: `Trusted runtime boundary is unavailable: ${error.message}` };
  }
  let receipt;
  try {
    receipt = await readData(runtime.preflightReceipt);
  } catch {
    return { error: "Mutation requires a fresh, hash-bound preflight receipt." };
  }
  const receiptValidation = validateContract(receipt, "PreflightReceipt.v1");
  if (!receiptValidation.valid) return { error: `Preflight receipt is invalid: ${receiptValidation.errors.join("; ")}` };
  const binding = receipt.binding;
  const now = /* @__PURE__ */ new Date();
  if (!binding || binding.contract_hash !== hashValue(contract) || new Date(String(binding.expires_at)) <= now || verifyBrokerPreflightReceipt(receipt, binding).length > 0) {
    return { error: "Preflight receipt is stale or does not match the current task contract." };
  }
  if (receipt.source_revision !== contract.source_revision || receipt.created_at !== binding.verified_at || binding.contract_expires_at !== contract.ttl || new Date(String(contract.ttl)) <= now) {
    return { error: "Preflight receipt source, creation time, or contract lifetime no longer matches the active task." };
  }
  const resolvedRoot = await realpath5(repositoryRoot);
  if (binding.repo !== resolvedRoot || binding.worktree !== resolvedRoot || !/^[a-f0-9]{40}$/.test(String(binding.base_branch_sha)) || !/^[a-f0-9]{40}$/.test(String(binding.task_start_sha))) {
    return { error: "Preflight receipt does not bind this repository and a full base commit." };
  }
  if (binding.host_fingerprint !== runtimeHostFingerprint()) return { error: "Preflight receipt belongs to a different runtime host." };
  const target = contract.target;
  if (binding.provider !== target?.provider || binding.host !== target?.host) return { error: "Preflight receipt target no longer matches the task contract." };
  if (binding.writer !== contract.agent_of_record || binding.idempotency_key !== contract.idempotency_key || binding.one_writer !== true || contract.one_writer !== true || binding.base_branch !== contract.base_branch || binding.base_branch_sha !== contract.base_branch_sha) {
    return { error: "Preflight receipt writer/idempotency/branch authority no longer matches the task contract." };
  }
  if (hookInput) {
    if (typeof hookInput.session_id !== "string" || hookInput.session_id !== binding.writer_session_id) return { error: "Hook session_id is missing or does not match the broker-bound writer session." };
    if (typeof hookInput.turn_id !== "string" || !hookInput.turn_id) return { error: "Hook turn_id is required for mutating admission." };
    if (typeof hookInput.permission_mode !== "string" || hookInput.permission_mode === "bypassPermissions") return { error: "Hook permission_mode is missing or bypassPermissions; mutation is denied." };
  }
  const requestReference = contract.request_receipt;
  const requestNonce = String(binding.request_nonce ?? "");
  if (!requestReference || binding.request_receipt_id !== requestReference.id || binding.request_receipt_hash !== requestReference.sha256 || requestReference.id !== `request-${requestNonce}` || !/^[a-f0-9]{32,128}$/.test(requestNonce) || new Date(String(binding.request_receipt_expires_at)) <= new Date(String(binding.verified_at)) || new Date(String(binding.expires_at)) > new Date(String(binding.request_receipt_expires_at))) {
    return { error: "Preflight receipt no longer binds the authenticated request receipt ID, hash, nonce, and lifetime." };
  }
  if (binding.runtime_root !== runtime.root || binding.lease_store_path !== runtime.leaseStore || binding.contract_path !== runtime.taskContract || binding.harness_path !== runtime.trustedHarness) {
    return { error: "Preflight receipt no longer binds the external runtime root, lease store, task contract, and trusted harness." };
  }
  try {
    if (await hashFile(runtime.taskContract) !== binding.contract_file_hash) return { error: "External runtime task contract changed after preflight." };
    if (await hashFile(runtime.trustedHarness) !== binding.harness_hash) return { error: "External trusted hook harness changed after preflight." };
  } catch (error) {
    return { error: `External runtime state cannot be revalidated: ${error.message}` };
  }
  for (const [field, expectedPath, expectedHash] of [
    ["manifest_path", "mousely.repo.yaml", binding.manifest_hash],
    ["context_lock_path", "mousely-context.lock", binding.context_hash],
    ["repository_harness_path", ".mousely/harness.mjs", binding.repository_harness_hash]
  ]) {
    if (binding[field] !== expectedPath) return { error: `Preflight ${field} is not canonical.` };
    try {
      const absolute = await resolvePotentialInside(resolvedRoot, expectedPath, true);
      const actual = await hashFile(absolute);
      if (actual !== expectedHash) return { error: `Preflight-bound ${expectedPath} changed after validation.` };
    } catch (error) {
      return { error: `Preflight-bound ${expectedPath} cannot be revalidated: ${error.message}` };
    }
  }
  const canonicalContractPath = String(binding.canonical_contract_path ?? "");
  const expectedCanonicalContractPath = `.mousely/contracts/${String(contract.linear_issue)}.json`;
  if (canonicalContractPath !== expectedCanonicalContractPath) return { error: "Preflight canonical task contract path no longer matches the Linear issue." };
  try {
    const absolute = await resolvePotentialInside(resolvedRoot, canonicalContractPath, true);
    if (await hashFile(absolute) !== binding.canonical_contract_file_hash) return { error: "Preflight-bound canonical task contract changed after validation." };
    const tracked = spawnSync4("git", ["-C", resolvedRoot, "ls-files", "--error-unmatch", "--", canonicalContractPath], { encoding: "utf8" });
    if (tracked.status !== 0) return { error: "Preflight-bound canonical task contract is no longer tracked." };
    if (hashValue(await readData(absolute)) !== hashValue(contract)) return { error: "Runtime and canonical task contracts no longer match." };
  } catch (error) {
    return { error: `Preflight-bound canonical task contract cannot be revalidated: ${error.message}` };
  }
  const startAncestor = spawnSync4("git", ["-C", resolvedRoot, "merge-base", "--is-ancestor", String(binding.task_start_sha), "HEAD"], { encoding: "utf8" });
  if (startAncestor.status !== 0) return { error: "Preflight task start is no longer an ancestor of the active worktree HEAD." };
  if (typeof binding.base_branch !== "string" || !binding.base_branch || binding.base_branch.startsWith("-") || binding.base_branch.includes("..") || /[~^:?*[\\\s]/.test(binding.base_branch)) {
    return { error: "Preflight base branch is not canonical." };
  }
  const baseCandidates = [`refs/remotes/origin/${binding.base_branch}`, `refs/heads/${binding.base_branch}`];
  let currentBaseSha = "";
  for (const reference of baseCandidates) {
    const resolved = spawnSync4("git", ["-C", resolvedRoot, "rev-parse", "--verify", `${reference}^{commit}`], { encoding: "utf8" });
    if (resolved.status === 0) {
      currentBaseSha = resolved.stdout.trim();
      break;
    }
  }
  if (!currentBaseSha || currentBaseSha !== binding.base_branch_sha) return { error: "Preflight canonical base branch revision changed after validation." };
  let snapshot;
  let snapshotFileHash;
  try {
    const snapshotPath = String(binding.capability_snapshot_path);
    if (snapshotPath !== runtime.capabilitySnapshot || path7.resolve(snapshotPath) !== runtime.capabilitySnapshot) throw new Error("unexpected external capability snapshot path");
    const metadata = await lstat5(snapshotPath);
    if (!metadata.isFile() || metadata.isSymbolicLink() || await realpath5(snapshotPath) !== runtime.capabilitySnapshot) throw new Error("capability snapshot is not a canonical regular file");
    snapshot = await readData(snapshotPath);
    snapshotFileHash = await hashFile(snapshotPath);
  } catch (error) {
    return { error: `Capability snapshot is unavailable: ${error.message}` };
  }
  if (snapshotFileHash !== binding.capability_hash || snapshot.id !== binding.capability_snapshot_id || snapshot.expires_at !== binding.capability_expires_at) {
    return { error: "Capability snapshot no longer matches the signed preflight receipt." };
  }
  const requiredCapabilities = Array.isArray(binding.required_capabilities) ? binding.required_capabilities.map(String) : [];
  if (JSON.stringify(requiredCapabilities) !== JSON.stringify(Array.isArray(contract.capabilities) ? contract.capabilities.map(String) : [])) {
    return { error: "Preflight required capability set no longer matches the task contract." };
  }
  const requiredCommands = Array.isArray(binding.required_commands) ? binding.required_commands.map(String) : [];
  const commandResolutions = binding.command_resolutions && typeof binding.command_resolutions === "object" ? Object.fromEntries(Object.entries(binding.command_resolutions).map(([name, value]) => [name, String(value)])) : {};
  const capabilities = revalidateCapabilitySnapshot(snapshot, {
    contract,
    repository: resolvedRoot,
    baseSha: String(binding.task_start_sha),
    requiredCommands,
    expectedCommandResolutions: commandResolutions,
    expectedVerifierRegistryHash: String(binding.capability_verifier_registry_hash)
  });
  if (!capabilities.ok) return { error: `Volatile capability revalidation failed: ${capabilities.errors.join("; ")}` };
  let leaseStorePath;
  try {
    leaseStorePath = await realpath5(String(binding.lease_store_path));
    if (leaseStorePath !== runtime.leaseStore) throw new Error("unexpected external lease store path");
    const store = await readData(leaseStorePath);
    if (store.instance_id !== binding.lease_store_instance_id) throw new Error("external lease-store instance changed");
  } catch (error) {
    return { error: `Writer lease store is unavailable: ${error.message}` };
  }
  if (typeof contract.linear_issue !== "string" || contract.linear_issue.length === 0) return { error: "Mutating Mousely work requires an exact Linear issue for the writer lease." };
  const lease = await validateActiveWriterLease({
    storePath: leaseStorePath,
    id: String(binding.lease_id),
    identityHash: String(binding.lease_identity_hash),
    owner: String(binding.lease_owner),
    writer: String(binding.writer),
    linearIssue: contract.linear_issue,
    idempotencyKey: String(contract.idempotency_key),
    worktree: resolvedRoot,
    repository: resolvedRoot,
    hostFingerprint: runtimeHostFingerprint(),
    contractHash: hashValue(contract),
    writerAgentId: String(binding.writer_agent_id),
    writerSessionId: String(binding.writer_session_id)
  });
  if (lease.errors.length > 0) return { error: `Writer lease revalidation failed: ${lease.errors.join("; ")}` };
  if (lease.lease?.pid !== binding.lease_pid || lease.lease?.process_identity !== binding.lease_process_identity) {
    return { error: "Writer lease task process binding changed after preflight." };
  }
  return { binding };
}
async function preToolUse(input) {
  const toolName = String(input.tool_name ?? "");
  const toolInput = input.tool_input && typeof input.tool_input === "object" ? input.tool_input : {};
  const kind = mutationKind(toolName, toolInput);
  const cwd = path7.resolve(String(input.cwd ?? process.cwd()));
  if (scanSecrets(toolInput).length > 0) return deny("Potential secret material in tool input; redact it before continuing.");
  const command = commandText(toolInput);
  if (/\bgit\s+(?:push|tag|merge)\b|\b(?:deploy|publish|notari[sz]e|app-store|play-store)\b/i.test(command)) {
    return deny("Merge, release, publishing, signing, notarization, and deployment are human-gated.");
  }
  if (/\brm\s+-[^\n]*r[^\n]*f\b|\bgit\s+(?:reset\s+--hard|clean\s+-)|\b(?:mkfs|diskutil\s+erase)\b/i.test(command)) {
    return deny("Destructive or difficult-to-recover command blocked by repository policy.");
  }
  if (kind === "shell" && (/\.mousely(?:[\\/]|$)/i.test(command) || /(?:^|[\s'"/\\])mousely(?:\.repo\.yaml|-context\.lock)(?:$|[\s'"/\\])/i.test(command))) {
    return deny("Shell mutation may not address runtime control-plane paths; use the typed harness lifecycle commands.");
  }
  if (kind === "none") return {};
  if (kind === "unknown") return deny(`Unsupported mutation-capable tool name: ${toolName || "unknown"}.`);
  if (process.env.MOUSELY_PREFLIGHT_SIGNER_PRIVATE_KEY || process.env.MOUSELY_AUTHORITY_SIGNING_KEY || process.env.MOUSELY_CAPABILITY_SIGNER_PRIVATE_KEY || process.env.MOUSELY_LEASE_CLEANUP_TOKEN) {
    return deny("Mutation is disabled because broker-only signing or cleanup authority leaked into the writer hook environment.");
  }
  let repositoryRoot;
  try {
    repositoryRoot = await repositoryRootFrom(cwd);
  } catch (error) {
    return deny(error.message);
  }
  const contract = await loadTaskContract(repositoryRoot);
  if (!contract) return deny("Mutation requires the external broker task contract and a successful signed preflight.");
  const validation = validateContract(contract, "TaskContract.v1");
  if (!validation.valid) return deny("Mutation requires a valid TaskContract.v1.");
  const preflight2 = await validatedPreflight(repositoryRoot, contract, input);
  if (preflight2.error) return deny(preflight2.error);
  if (kind === "patch" || kind === "direct-write") {
    const scope = contract.edit_scope;
    const allowed = Array.isArray(scope?.allowed_globs) ? scope.allowed_globs.map(String) : [];
    const forbidden = Array.isArray(scope?.forbidden_globs) ? scope.forbidden_globs.map(String) : [];
    const resolvedCwd = await realpath5(cwd);
    const paths = kind === "patch" ? patchPaths(command, resolvedCwd, repositoryRoot) : directWritePaths(toolInput, resolvedCwd, repositoryRoot);
    if (paths.length === 0) return deny(`${kind} input did not expose any enforceable repository-relative paths.`);
    for (const file of paths) {
      if (!safeRelativePath(file)) return deny(`Patch path escapes repository scope: ${file}`);
      try {
        await resolvePotentialInside(repositoryRoot, file);
      } catch (error) {
        return deny(error.message);
      }
      if (protectedControlPath(file)) return deny(`Runtime control-plane path cannot be edited by a task tool: ${file}`);
      if (!allowed.some((glob) => minimatch(file, glob, { dot: true }))) return deny(`Patch path is outside allowed_globs: ${file}`);
      if (forbidden.some((glob) => minimatch(file, glob, { dot: true }))) return deny(`Patch path matches forbidden_globs: ${file}`);
    }
  }
  if (kind === "shell") return hookResult("PreToolUse", { additionalContext: "Shell commands are not a complete path parser; the fresh capability/lease check, frozen-base post-check, and CI guard remain mandatory." });
  return {};
}
async function postToolUse(input) {
  const toolName = String(input.tool_name ?? "");
  const toolInput = input.tool_input && typeof input.tool_input === "object" ? input.tool_input : {};
  if (!mutationLikely(toolName, toolInput)) return {};
  const cwd = path7.resolve(String(input.cwd ?? process.cwd()));
  let repositoryRoot;
  try {
    repositoryRoot = await repositoryRootFrom(cwd);
  } catch (error) {
    return { continue: false, stopReason: error.message };
  }
  const contract = await loadTaskContract(repositoryRoot);
  if (!contract) return { continue: false, stopReason: "Mutation completed without a task contract; stop for scope review." };
  try {
    const preflight2 = await validatedPreflight(repositoryRoot, contract, input);
    if (!preflight2.binding) return { continue: false, stopReason: preflight2.error ?? "Preflight receipt validation failed." };
    const guarded = guardScope(gitChangedFiles(repositoryRoot, String(preflight2.binding.task_start_sha)), contract);
    if (!guarded.ok) {
      return { continue: false, stopReason: `Scope violation after mutation: ${guarded.violations.join("; ")}` };
    }
  } catch (error) {
    return { continue: false, stopReason: `Post-mutation scope check was inconclusive: ${error.message}` };
  }
  return {};
}
async function checkpoint(input, phase) {
  const repositoryRoot = await repositoryRootFrom(input.cwd);
  const sessionId = String(input.session_id ?? "unknown").replace(/[^A-Za-z0-9._-]/g, "_");
  const directory = path7.join(repositoryRoot, ".mousely", "runs", "checkpoints", sessionId);
  await mkdir4(directory, { recursive: true });
  const payload = {
    schema_version: "HookCheckpoint.v1",
    phase,
    session_id: sessionId,
    turn_id: input.turn_id ?? null,
    hook_event_name: input.hook_event_name ?? null,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    redaction_state: "redacted",
    input_hash: hashValue({
      repository_root: repositoryRoot,
      trigger: input.trigger ?? null,
      agent_id: input.agent_id ?? null,
      agent_type: input.agent_type ?? null
    })
  };
  const finalPath = path7.join(directory, `${Date.now()}-${phase}.json`);
  const tempPath = `${finalPath}.tmp`;
  await writeFile3(tempPath, `${JSON.stringify(payload, null, 2)}
`, { mode: 384 });
  await rename3(tempPath, finalPath);
}
async function validateSubagent(input) {
  const message = input.last_assistant_message;
  if (scanSecrets(message).length > 0) {
    return { continue: false, stopReason: "Subagent result contains potential secret material and must not be propagated." };
  }
  return { continue: true };
}
async function runHook(event, input) {
  switch (event) {
    case "pre-tool":
      return preToolUse(input);
    case "post-tool":
      return postToolUse(input);
    case "pre-compact":
      await checkpoint(input, "pre-compact");
      return { continue: true };
    case "subagent-stop":
      return validateSubagent(input);
    case "session-start":
      await checkpoint(input, "session-start");
      return hookResult("SessionStart", { additionalContext: "Verify the context lock and task contract before mutation." });
    case "session-end":
      await checkpoint(input, "session-end");
      return {};
    case "stop":
      await checkpoint(input, "stop");
      return { continue: true };
    default:
      throw new Error(`Unknown hook event: ${event}`);
  }
}

// src/preflight.ts
async function preflight(contract, manifest, capabilitySnapshot, options) {
  const errors = [];
  const contractValidation = validateContract(contract, "TaskContract.v1");
  const manifestValidation = validateContract(manifest, "RepoManifest.v1");
  if (!contractValidation.valid) errors.push(...contractValidation.errors.map((item) => `contract ${item}`));
  if (!manifestValidation.valid) errors.push(...manifestValidation.errors.map((item) => `manifest ${item}`));
  if (contract.organization !== manifest.organization) errors.push("contract and repository organization do not match");
  if (contract.repo !== null && contract.repo !== manifest.name) errors.push("contract and repository name do not match");
  const now = options.now ?? /* @__PURE__ */ new Date();
  if (new Date(String(contract.ttl)).getTime() <= now.getTime()) errors.push("task contract TTL has expired");
  if ((options.requireNode22 ?? true) && Number(process.versions.node.split(".")[0]) !== 22) {
    errors.push(`Node 22 required; found ${process.versions.node}`);
  }
  const requiredCapabilityNames = Array.isArray(contract.capabilities) ? contract.capabilities.map(String) : [];
  if (contract.interaction_mode !== "read-only" && !requiredCapabilityNames.includes("runtime-control-boundary")) errors.push("mutating preflight requires the signed runtime-control-boundary capability");
  const requiredCommands = Array.isArray(manifest.required_commands) ? manifest.required_commands.map(String) : [];
  const capabilityResult = revalidateCapabilitySnapshot(capabilitySnapshot, {
    contract,
    repository: options.repository,
    baseSha: options.baseSha,
    requiredCommands,
    now
  });
  errors.push(...capabilityResult.errors);
  return {
    ok: errors.length === 0,
    status: errors.length === 0 ? "ready" : "not_dispatched",
    missing_capabilities: capabilityResult.missingCapabilities,
    missing_commands: capabilityResult.missingCommands,
    errors,
    capability_snapshot: capabilitySnapshot,
    command_resolutions: capabilityResult.commandResolutions,
    capability_verifier_registry_hash: capabilityResult.verifierRegistryHash
  };
}

// src/pull-request.ts
import { execFileSync as execFileSync3, spawnSync as spawnSync6 } from "node:child_process";
import { lstat as lstat6, readFile as readFile6, realpath as realpath8 } from "node:fs/promises";
var import_yaml4 = __toESM(require_dist2(), 1);

// src/trusted-baseline.ts
var import_yaml2 = __toESM(require_dist2(), 1);
import { createHash as createHash3 } from "node:crypto";
import { readdir as readdir2, readFile as readFile4, realpath as realpath6 } from "node:fs/promises";
import path8 from "node:path";
var repositoryOwnedFiles = /* @__PURE__ */ new Set(["AGENTS.md", "docs/ai/architecture.md", "docs/ai/verification.md"]);
var generatedPolicyEndMarker = "<!-- GENERATED BLOCK END -->";
function sha2562(value) {
  return createHash3("sha256").update(value).digest("hex");
}
function canonicalText(value) {
  return (typeof value === "string" ? value : value.toString("utf8")).replace(/\r\n?/g, "\n");
}
function canonicalBytes(value) {
  return Buffer.from(canonicalText(value), "utf8");
}
async function walk(root) {
  const output = [];
  const visit = async (directory) => {
    for (const entry of await readdir2(directory, { withFileTypes: true })) {
      const absolute = path8.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) output.push(path8.relative(root, absolute).replaceAll("\\", "/"));
      else throw new Error(`trusted source contains a non-regular path: ${path8.relative(root, absolute)}`);
    }
  };
  await visit(root);
  return output.sort();
}
function asObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}
function exactPolicyBlock(content, start) {
  const normalized = content.replace(/\r\n?/g, "\n");
  const startIndex = normalized.indexOf(start);
  const endIndex = normalized.indexOf(generatedPolicyEndMarker, startIndex + start.length);
  if (startIndex < 0 || endIndex <= startIndex || normalized.indexOf(start, startIndex + start.length) >= 0 || normalized.indexOf(generatedPolicyEndMarker, endIndex + generatedPolicyEndMarker.length) >= 0) {
    throw new Error("AGENTS.md does not contain exactly one ordered generated policy block");
  }
  return normalized.slice(startIndex, endIndex + generatedPolicyEndMarker.length);
}
async function verifyTrustedBaseline(options) {
  const errors = [];
  const trustedRoot = await realpath6(options.trustedSourceRoot);
  const repositoryRoot = await realpath6(options.repositoryRoot);
  const readRepositoryFile = options.readRepositoryFile ?? (async (relativePath) => readFile4(await resolveExistingInside(repositoryRoot, relativePath)));
  const repositoryParts = options.repository.split("/");
  if (repositoryParts.length !== 2 || !repositoryParts[0] || !repositoryParts[1]) return ["trusted policy received an invalid repository identifier"];
  const organization = repositoryParts[0];
  const repositoryName = repositoryParts[1];
  const configFiles = await walk(path8.join(trustedRoot, "config", "repos"));
  const matches = [];
  for (const relative of configFiles.filter((item) => item.endsWith(".yaml") || item.endsWith(".yml"))) {
    const config2 = asObject(import_yaml2.default.parse(await readFile4(path8.join(trustedRoot, "config", "repos", relative), "utf8")), "baseline config");
    const repo2 = asObject(config2.repo, "baseline repository");
    if (repo2.organization === organization && repo2.name === repositoryName) matches.push(config2);
  }
  if (matches.length !== 1) return [`trusted policy requires exactly one baseline config for ${options.repository}; found ${matches.length}`];
  const config = matches[0];
  const repo = asObject(config.repo, "baseline repository");
  const catalog = asObject(import_yaml2.default.parse(await readFile4(path8.join(trustedRoot, "context", "catalog.yaml"), "utf8")), "context catalog");
  const records = new Map((catalog.records ?? []).map((record) => [String(record.path), record]));
  const sliceIds = repo.context_slices.map(String);
  const slices = sliceIds.map((sliceId) => {
    const record = records.get(`${sliceId}.md`);
    if (!record || record.access_policy !== "read-only") throw new Error(`trusted context slice is not allowlisted: ${sliceId}`);
    return {
      sliceId,
      record,
      sourcePath: `context/${sliceId}.md`,
      generatedPath: `docs/ai/generated/${sliceId.replaceAll("/", "-")}.md`
    };
  });
  const replacements = {
    REPO_NAME: repositoryName,
    ORGANIZATION: organization,
    CREATED_AT: String(config.created_at),
    SOURCE_REVISION: options.sourceRevision,
    CONTEXT_REVISION: String(config.context_revision),
    ROLE: String(repo.role),
    CODEOWNERS_LIST: repo.owners.map((owner) => `@${String(owner)}`).join(" "),
    ALIASES_JSON: JSON.stringify(repo.aliases),
    OWNERS_JSON: JSON.stringify(repo.owners),
    ARCHITECTURE_BOUNDARIES_JSON: JSON.stringify(repo.architecture_boundaries),
    VERSION_SOURCE_JSON: JSON.stringify(repo.version_source),
    SOURCE_REPO: String(repo.source_repo),
    DISTRIBUTION_REPOS_JSON: JSON.stringify(repo.distribution_repos),
    COMMANDS_JSON: JSON.stringify(repo.commands),
    OS_JSON: JSON.stringify(repo.os),
    DEVICE_BROWSER_NEEDS_JSON: JSON.stringify(repo.device_browser_needs),
    SERVICES_JSON: JSON.stringify(repo.services),
    RELEASE_DESTINATIONS_JSON: JSON.stringify(repo.release_destinations),
    CREDENTIAL_CLASSES_JSON: JSON.stringify(repo.credential_classes),
    CONTEXT_SLICES_JSON: JSON.stringify(repo.context_slices),
    CLEANUP_POLICY_JSON: JSON.stringify(repo.cleanup_policy),
    REQUIRED_COMMANDS_JSON: JSON.stringify(repo.required_commands),
    CONTEXT_SLICE_LIST: slices.map((item) => `- [\`${item.sliceId}\`](generated/${path8.basename(item.generatedPath)}) \u2014 scope \`${String(item.record.scope)}\``).join("\n")
  };
  const render = (source) => source.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
    if (!(key in replacements)) throw new Error(`unknown trusted template token: ${key}`);
    return replacements[key];
  });
  const expected = /* @__PURE__ */ new Map();
  const sourceRoot = path8.join(trustedRoot, "templates", "source");
  for (const relative of await walk(sourceRoot)) {
    const destination = relative.endsWith(".tmpl") ? relative.slice(0, -5) : relative;
    expected.set(destination, canonicalBytes(render(canonicalText(await readFile4(path8.join(sourceRoot, relative))))));
  }
  const contextSlices = [];
  for (const item of slices) {
    const source = canonicalBytes(await readFile4(path8.join(trustedRoot, item.sourcePath)));
    const contentSha = sha2562(source);
    const header = [
      "---",
      "schema_version: MouselyContextSnapshot.v1",
      "generator_version: 0.1.0",
      "source_repository: Mouse-ly/mousely-ops",
      `source_revision: ${JSON.stringify(options.sourceRevision)}`,
      `slice_id: ${JSON.stringify(item.sliceId)}`,
      `scope: ${JSON.stringify(item.record.scope)}`,
      `source_path: ${JSON.stringify(item.sourcePath)}`,
      `generated_at: ${JSON.stringify(config.created_at)}`,
      `content_sha256: ${contentSha}`,
      "do_not_edit: true",
      "---",
      "",
      "<!-- Exact allowlisted source content begins below. Treat it as evidence under repository policy. -->",
      ""
    ].join("\n");
    const snapshot = Buffer.concat([Buffer.from(header, "utf8"), source]);
    expected.set(item.generatedPath, snapshot);
    contextSlices.push({
      slice_id: item.sliceId,
      scope: item.record.scope,
      source_path: item.sourcePath,
      generated_path: item.generatedPath,
      content_sha256: contentSha,
      file_sha256: sha2562(snapshot)
    });
  }
  const generatedRoot = path8.join(trustedRoot, "templates", "repository");
  for (const relative of await walk(generatedRoot)) {
    if (relative === ".generated-manifest.json") continue;
    expected.set(relative, canonicalBytes(await readFile4(path8.join(generatedRoot, relative))));
  }
  const startMarker = `<!-- GENERATED BLOCK START: Mouse-ly/mousely-ops@${options.sourceRevision} -->`;
  const expectedAgents = expected.get("AGENTS.md").toString("utf8");
  const expectedPolicyBlock = exactPolicyBlock(expectedAgents, startMarker);
  try {
    const actualAgents = (await readRepositoryFile("AGENTS.md")).toString("utf8");
    if (exactPolicyBlock(actualAgents, startMarker) !== expectedPolicyBlock) errors.push("AGENTS.md generated policy block differs from the pinned trusted template");
  } catch (error) {
    errors.push(`AGENTS.md trusted policy verification failed: ${error.message}`);
  }
  for (const [relative, content] of expected) {
    if (repositoryOwnedFiles.has(relative)) continue;
    try {
      const actual = await readRepositoryFile(relative);
      if (!actual.equals(content)) errors.push(`${relative}: differs from the pinned trusted baseline`);
    } catch (error) {
      errors.push(`${relative}: trusted baseline read failed: ${error.message}`);
    }
  }
  const hashes = new Map([...expected].map(([relative, content]) => [relative, sha2562(content)]));
  const generatedFiles = [...expected.keys()].sort().filter((name) => name !== ".mousely/harness.mjs" && !repositoryOwnedFiles.has(name)).map((filePath) => ({ path: filePath, sha256: hashes.get(filePath) }));
  const targetRevision = options.targetRevision;
  const expectedLock = {
    schema_version: "ContextLock.v1",
    id: `context-${repositoryName}`,
    created_at: config.created_at,
    source_revision: options.sourceRevision,
    redaction_state: "clear",
    organization_revision: config.organization_revision,
    context_revision: config.context_revision,
    target_repository: { repository: options.repository, revision: targetRevision },
    context_slices: contextSlices,
    repository_owned_files: ["AGENTS.md", "docs/ai/architecture.md", "docs/ai/verification.md"],
    repository_owned_sections: [{
      path: "AGENTS.md",
      start_marker: startMarker,
      end_marker: generatedPolicyEndMarker,
      normalization: "lf",
      sha256: sha2562(Buffer.from(expectedPolicyBlock, "utf8"))
    }],
    generated_files: generatedFiles,
    harness: { path: ".mousely/harness.mjs", sha256: hashes.get(".mousely/harness.mjs") },
    shared_skill_versions: { "mousely-intake": "1.0.0", "mousely-context-smoke": "1.0.0", "mousely-proof-bundle": "1.0.0", "mousely-ui-review": "1.1.0", "mousely-prototype": "1.0.0" },
    protocol_contracts: [],
    brand_assets: [],
    freshness: config.freshness,
    source_revisions: { "Mouse-ly/mousely-ops": options.sourceRevision, [options.repository]: targetRevision }
  };
  if (stableStringify(options.lock) !== stableStringify(expectedLock)) {
    const differingKeys = [.../* @__PURE__ */ new Set([...Object.keys(options.lock), ...Object.keys(expectedLock)])].filter((key) => stableStringify(options.lock[key]) !== stableStringify(expectedLock[key]));
    errors.push(`mousely-context.lock differs from the lock derived from pinned trusted sources: ${differingKeys.join(", ")}`);
  }
  return errors;
}

// src/successor.ts
var import_yaml3 = __toESM(require_dist2(), 1);
import { execFileSync as execFileSync2, spawnSync as spawnSync5 } from "node:child_process";
import { mkdir as mkdir5, mkdtemp, readFile as readFile5, realpath as realpath7, rm, writeFile as writeFile4 } from "node:fs/promises";
import path9 from "node:path";
import os from "node:os";
var successorPath = ".mousely/successor.json";
var verifierPromotionGate = "repository-owner verifier promotion approval";
var guardWorkflowPath = ".github/workflows/mousely-guard.yml";
var harnessPath = ".mousely/harness.mjs";
var lockPath = "mousely-context.lock";
var agentsPath = "AGENTS.md";
var requiredReviewLanes = ["engineering", "dx", "security-privacy", "outside-adversarial"];
var shaPattern = /^[a-f0-9]{40}$/;
var hashPattern = /^[a-f0-9]{64}$/;
function asObject2(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}
function git2(root, args, maxBuffer = 8 * 1024 * 1024) {
  return execFileSync2("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer });
}
function gitBuffer(root, args, maxBuffer) {
  const result = spawnSync5("git", ["-C", root, ...args], { encoding: null, maxBuffer });
  if (result.status !== 0) throw new Error(`Git object read failed: ${Buffer.from(result.stderr ?? []).toString("utf8").trim()}`);
  return Buffer.from(result.stdout ?? []);
}
function canonicalGithubRepository(remote) {
  return /^(?:https:\/\/github\.com\/|ssh:\/\/git@github\.com\/|git@github\.com:)([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?\/?$/i.exec(remote.trim())?.slice(1, 3).join("/");
}
async function materializeSuccessorSource(options) {
  if (!options.sourceRoot) throw new Error("isolated successor Git objects are unavailable; an externally authenticated GitHub App/deploy-key checkout or API-derived object source is required before activation can be approved");
  const sourceRoot = await realpath7(options.sourceRoot);
  const targetRoot = await realpath7(options.targetRoot);
  if (sourceRoot === targetRoot || sourceRoot.startsWith(`${targetRoot}${path9.sep}`) || targetRoot.startsWith(`${sourceRoot}${path9.sep}`)) throw new Error("successor source must be isolated from the untrusted target checkout");
  const topLevel = await realpath7(git2(sourceRoot, ["rev-parse", "--show-toplevel"]).trim());
  if (topLevel !== sourceRoot) throw new Error("successor source must be an exact Git worktree root");
  const origin = canonicalGithubRepository(git2(sourceRoot, ["remote", "get-url", "origin"]));
  if (origin?.toLowerCase() !== "mouse-ly/mousely-ops") throw new Error("successor source origin does not identify Mouse-ly/mousely-ops (origin is consistency metadata, not authentication)");
  let exactCommit = "";
  try {
    exactCommit = git2(sourceRoot, ["rev-parse", "--verify", `${options.revision}^{commit}`]).trim();
  } catch {
    throw new Error(`successor revision ${options.revision} is unavailable as an exact Git commit`);
  }
  if (exactCommit !== options.revision) throw new Error(`successor revision ${options.revision} is unavailable as an exact Git commit`);
  if (git2(sourceRoot, ["rev-parse", "HEAD"]).trim() !== options.revision) throw new Error("successor source HEAD is not the exact approved successor commit");
  const records = git2(sourceRoot, ["ls-tree", "-r", "-z", options.revision]).split("\0").filter(Boolean);
  const materialized = await mkdtemp(path9.join(os.tmpdir(), `mousely-successor-${options.revision.slice(0, 12)}-`));
  let aggregate = 0;
  const projectedPaths = /* @__PURE__ */ new Set();
  try {
    for (const record of records) {
      const match2 = /^(\d{6}) (\w+) ([a-f0-9]{40,64})\t(.+)$/.exec(record);
      if (!match2 || match2[2] !== "blob" || !["100644", "100755"].includes(match2[1]) || !safeRelativePath(match2[4])) throw new Error(`successor source contains a non-regular or unsafe Git entry: ${record}`);
      const size = Number(git2(sourceRoot, ["cat-file", "-s", match2[3]]).trim());
      if (!Number.isFinite(size) || size > 32 * 1024 * 1024) throw new Error(`${match2[4]}: successor source blob exceeds 32 MiB`);
      aggregate += size;
      if (aggregate > 128 * 1024 * 1024) throw new Error("successor source exceeds the 128 MiB materialization limit");
      const destination = path9.join(materialized, match2[4]);
      await mkdir5(path9.dirname(destination), { recursive: true, mode: 448 });
      await writeFile4(destination, gitBuffer(sourceRoot, ["cat-file", "blob", match2[3]], size + 1024), { mode: 256 });
      projectedPaths.add(match2[4]);
    }
    for (const required of ["config/repos", "context/catalog.yaml", "templates/source/AGENTS.md.tmpl", "templates/repository/.mousely/harness.mjs", "templates/repository/.generated-manifest.json", ".github/actions/trusted-pr-guard/harness.mjs"]) {
      if (required.endsWith("repos") ? ![...projectedPaths].some((entry) => entry.startsWith(`${required}/`)) : !projectedPaths.has(required)) throw new Error(`successor source is missing required canonical data: ${required}`);
    }
    const generatedHarness = await readFile5(path9.join(materialized, "templates/repository/.mousely/harness.mjs"));
    const actionHarness = await readFile5(path9.join(materialized, ".github/actions/trusted-pr-guard/harness.mjs"));
    if (!generatedHarness.equals(actionHarness)) throw new Error("successor source fails internal trusted/generated harness parity");
    const manifest = strictJson(await readFile5(path9.join(materialized, "templates/repository/.generated-manifest.json")), "successor generated manifest");
    const manifestFiles = asObject2(manifest.files, "successor generated manifest files");
    const actualTemplateFiles = [...projectedPaths].filter((entry) => entry.startsWith("templates/repository/") && entry !== "templates/repository/.generated-manifest.json").map((entry) => entry.slice("templates/repository/".length)).sort();
    const expectedTemplateFiles = Object.keys(manifestFiles).sort();
    if (stableStringify(actualTemplateFiles) !== stableStringify(expectedTemplateFiles)) throw new Error("successor source generated manifest does not enumerate the exact repository projection");
    for (const relative of expectedTemplateFiles) {
      const content = await readFile5(path9.join(materialized, "templates/repository", relative));
      if (sha256(content) !== manifestFiles[relative]) throw new Error(`${relative}: successor source generated-manifest hash mismatch`);
    }
    if (manifest.harness_sha256 !== sha256(generatedHarness)) throw new Error("successor source generated manifest harness hash is stale");
    return { root: materialized, cleanup: async () => rm(materialized, { recursive: true, force: true }), provenanceAuthenticated: false };
  } catch (error) {
    await rm(materialized, { recursive: true, force: true });
    throw error;
  }
}
function treeRecord(root, commit, filePath) {
  const raw = git2(root, ["ls-tree", "-z", commit, "--", filePath]);
  const records = raw.split("\0").filter(Boolean);
  if (records.length === 0) return void 0;
  if (records.length !== 1) throw new Error(`${filePath}: expected exactly one Git tree entry`);
  const match2 = /^(\d{6}) (\w+) ([a-f0-9]{40,64})\t(.+)$/.exec(records[0]);
  if (!match2 || match2[4] !== filePath) throw new Error(`${filePath}: malformed Git tree entry`);
  return { mode: match2[1], type: match2[2], oid: match2[3], path: match2[4] };
}
function readCommitBlob(root, commit, filePath, maximumBytes = 32 * 1024 * 1024) {
  const entry = treeRecord(root, commit, filePath);
  if (!entry) throw new Error(`${filePath}: required Git blob is missing at ${commit}`);
  if (entry.type !== "blob" || !["100644", "100755"].includes(entry.mode)) throw new Error(`${filePath}: must be a regular Git blob, not ${entry.mode} ${entry.type}`);
  const size = Number(git2(root, ["cat-file", "-s", entry.oid]).trim());
  if (!Number.isFinite(size) || size > maximumBytes) throw new Error(`${filePath}: blob exceeds ${maximumBytes} bytes`);
  return { ...entry, bytes: gitBuffer(root, ["cat-file", "blob", entry.oid], maximumBytes + 1024) };
}
function strictJson(raw, label) {
  const text = raw.toString("utf8");
  const document = import_yaml3.default.parseDocument(text, { uniqueKeys: true, schema: "json" });
  if (document.errors.length > 0) throw new Error(`${label} contains duplicate or invalid JSON keys: ${document.errors[0].message}`);
  return asObject2(JSON.parse(text), label);
}
function readOptionalSuccessor(root, commit) {
  const entry = treeRecord(root, commit, successorPath);
  if (!entry) return void 0;
  if (entry.type !== "blob" || entry.mode !== "100644") throw new Error(`${successorPath}: successor intent must be a regular non-executable 100644 Git blob`);
  const size = Number(git2(root, ["cat-file", "-s", entry.oid]).trim());
  if (!Number.isFinite(size) || size > 256 * 1024) throw new Error(`${successorPath}: successor intent exceeds 256 KiB`);
  const raw = gitBuffer(root, ["cat-file", "blob", entry.oid], 257 * 1024);
  return { raw, value: strictJson(raw, "successor intent") };
}
function exactKeys(value, expected, label, errors) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    errors.push(`${label} keys must be exactly: ${wanted.join(", ")}`);
  }
}
function promotionPathAllowed(filePath) {
  if ([
    agentsPath,
    lockPath,
    harnessPath,
    "mousely.repo.yaml",
    ".gitattributes",
    ".github/CODEOWNERS",
    ".github/PULL_REQUEST_TEMPLATE.md",
    guardWorkflowPath,
    ".codex/hooks.json",
    ".agents/THIRD_PARTY_NOTICES.md",
    "docs/ai/mousely-context.md",
    ".mousely/.gitignore",
    ".mousely/contracts/README.md",
    ".mousely/contracts/task-contract.json.example"
  ].includes(filePath)) return true;
  return /^(?:\.github\/ISSUE_TEMPLATE|\.agents\/skills|\.agents\/rules|\.cursor\/rules|docs\/ai\/generated)\/[A-Za-z0-9._/-]+$/.test(filePath);
}
function changeFor(changes, filePath) {
  return changes.find((change) => change.path === filePath);
}
function validateIntent(options) {
  const errors = [];
  const value = options.file.value;
  exactKeys(value, ["schema_version", "id", "created_at", "expires_at", "redaction_state", "linear_issue", "target", "from", "to", "changes"], "successor intent", errors);
  const issue = String(value.linear_issue ?? "");
  if (value.schema_version !== "SuccessorIntent.v1") errors.push("successor intent schema_version must be SuccessorIntent.v1");
  if (!/^MLY-[1-9][0-9]*$/.test(issue)) errors.push("successor intent linear_issue must be a canonical MLY identifier");
  if (value.id !== `successor-${issue}`) errors.push(`successor intent id must be successor-${issue}`);
  if (value.redaction_state !== "clear") errors.push("successor intent redaction_state must be clear");
  const now = options.now ?? /* @__PURE__ */ new Date();
  const createdAt = new Date(String(value.created_at));
  const expiresAt = new Date(String(value.expires_at));
  if (!Number.isFinite(createdAt.getTime()) || !Number.isFinite(expiresAt.getTime())) errors.push("successor intent timestamps must be valid date-times");
  else {
    if (expiresAt <= createdAt) errors.push("successor intent expires_at must be later than created_at");
    if (createdAt.getTime() > now.getTime() + 5 * 6e4) errors.push("successor intent created_at is too far in the future");
    if (expiresAt <= now) errors.push("successor intent is expired");
    if (expiresAt.getTime() - createdAt.getTime() > 7 * 24 * 60 * 6e4) errors.push("successor intent lifetime exceeds seven days");
  }
  let target = {};
  let from = {};
  let to = {};
  try {
    target = asObject2(value.target, "successor target");
    from = asObject2(value.from, "successor from");
    to = asObject2(value.to, "successor to");
    exactKeys(target, ["repository", "base_branch"], "successor target", errors);
    exactKeys(from, ["action_repository", "revision", "context_lock_sha256", "workflow_sha256"], "successor from", errors);
    exactKeys(to, ["action_repository", "revision", "context_lock_sha256", "workflow_sha256", "harness_sha256"], "successor to", errors);
  } catch (error) {
    errors.push(error.message);
  }
  if (target.repository !== options.repository || target.base_branch !== options.baseBranch) errors.push("successor target repository/base_branch does not match the authenticated PR base");
  if (from.action_repository !== "Mouse-ly/mousely-ops" || from.revision !== options.actionRef) errors.push("successor from authority does not match the executing trusted action");
  if (from.context_lock_sha256 !== sha256(options.baseLock.bytes)) errors.push("successor from context-lock hash does not match the exact base blob");
  if (from.workflow_sha256 !== sha256(options.baseWorkflow.bytes)) errors.push("successor from workflow hash does not match the exact base blob");
  const toRevision = String(to.revision ?? "");
  if (to.action_repository !== "Mouse-ly/mousely-ops" || !shaPattern.test(toRevision) || toRevision === options.actionRef) errors.push("successor to authority must be a different exact Mouse-ly/mousely-ops commit SHA");
  for (const [label, hash] of [["context_lock_sha256", to.context_lock_sha256], ["workflow_sha256", to.workflow_sha256], ["harness_sha256", to.harness_sha256]]) {
    if (!hashPattern.test(String(hash ?? ""))) errors.push(`successor to ${label} must be a lowercase SHA-256`);
  }
  const rawChanges = Array.isArray(value.changes) ? value.changes : [];
  if (rawChanges.length < 4 || rawChanges.length > 512) errors.push("successor changes must contain between 4 and 512 entries");
  const changes = [];
  const paths = /* @__PURE__ */ new Set();
  const foldedPaths = /* @__PURE__ */ new Set();
  for (const [index, rawChange] of rawChanges.entries()) {
    try {
      const item = asObject2(rawChange, `successor change ${index}`);
      const operation = String(item.operation);
      exactKeys(item, operation === "delete" ? ["path", "operation"] : ["path", "operation", "mode", "sha256"], `successor change ${index}`, errors);
      const filePath = String(item.path ?? "");
      const normalizedPath2 = path9.posix.normalize(filePath);
      if (!/^[\x20-\x7E]+$/.test(filePath) || filePath.normalize("NFC") !== filePath || /[\\*?\[\]{}!\r\n]/.test(filePath) || !safeRelativePath(filePath) || normalizedPath2 !== filePath || filePath.includes("//") || filePath.endsWith("/")) errors.push(`${filePath || `change ${index}`}: successor path must be a literal portable NFC repository path`);
      if (!promotionPathAllowed(filePath) || filePath === successorPath || /^\.mousely\/contracts\/MLY-/.test(filePath)) errors.push(`${filePath}: path is outside the successor control-plane allowlist`);
      const folded = filePath.toLocaleLowerCase("en-US");
      if (paths.has(filePath) || foldedPaths.has(folded)) errors.push(`${filePath}: duplicate or case-colliding successor path`);
      paths.add(filePath);
      foldedPaths.add(folded);
      if (!["add", "modify", "delete"].includes(operation)) errors.push(`${filePath}: successor operation is invalid`);
      if (operation !== "delete") {
        if (!["100644", "100755"].includes(String(item.mode))) errors.push(`${filePath}: successor mode must be 100644 or 100755`);
        if (!hashPattern.test(String(item.sha256 ?? ""))) errors.push(`${filePath}: successor sha256 must be lowercase hexadecimal`);
      }
      changes.push({ path: filePath, operation, ...operation === "delete" ? {} : { mode: String(item.mode), sha256: String(item.sha256) } });
    } catch (error) {
      errors.push(error.message);
    }
  }
  const sorted = [...paths].sort((left, right) => left.localeCompare(right));
  if ([...paths].some((item, index) => item !== sorted[index])) errors.push("successor changes must be sorted lexicographically by path");
  for (const required of [agentsPath, guardWorkflowPath, lockPath]) {
    const change = changeFor(changes, required);
    if (!change || change.operation === "delete") errors.push(`successor changes must replace ${required}`);
  }
  if (changeFor(changes, lockPath)?.sha256 !== to.context_lock_sha256) errors.push("successor context-lock change hash differs from to.context_lock_sha256");
  if (changeFor(changes, guardWorkflowPath)?.sha256 !== to.workflow_sha256) errors.push("successor workflow change hash differs from to.workflow_sha256");
  const harnessChange = changeFor(changes, harnessPath);
  if (harnessChange && harnessChange.sha256 !== to.harness_sha256) errors.push("successor harness change hash differs from to.harness_sha256");
  if (scanSecrets(value).length > 0) errors.push("successor intent contains potential secret material");
  return { ...errors.length === 0 ? { intent: { raw: value, linearIssue: issue, fromRevision: options.actionRef, toRevision, changes } } : {}, errors };
}
function promotionContractErrors(contract, intent, expectedPaths, options) {
  const errors = [];
  const validation = validateContract(contract, "TaskContract.v1");
  if (!validation.valid) errors.push(...validation.errors.map((item) => `task contract: ${item}`));
  if (contract.id !== intent.linearIssue || contract.linear_issue !== intent.linearIssue || contract.source?.id !== intent.linearIssue) errors.push("promotion task contract identity must match the successor Linear issue");
  if (contract.source_revision !== options.actionRef) errors.push("promotion task contract source_revision must match verifier A");
  if (contract.organization !== options.organization || contract.repo !== options.repoName || contract.base_branch !== options.baseBranch) errors.push("promotion task contract repository/base binding is invalid");
  const ttl = new Date(String(contract.ttl));
  if (!Number.isFinite(ttl.getTime()) || ttl <= (options.now ?? /* @__PURE__ */ new Date())) errors.push("promotion task contract TTL is expired or invalid");
  const lanes = new Set(Array.isArray(contract.initial_review_lanes) ? contract.initial_review_lanes.map(String) : []);
  if (!requiredReviewLanes.every((lane) => lanes.has(lane))) errors.push(`promotion requires review lanes: ${requiredReviewLanes.join(", ")}`);
  const gates = Array.isArray(contract.human_gates) ? contract.human_gates.map(String) : [];
  if (!gates.includes(verifierPromotionGate)) errors.push(`promotion requires the exact \`${verifierPromotionGate}\` human gate`);
  const allowed = contract.edit_scope?.allowed_globs?.map(String) ?? [];
  const expected = [...expectedPaths].sort((left, right) => left.localeCompare(right));
  const actual = [...allowed].sort((left, right) => left.localeCompare(right));
  if (actual.length !== expected.length || actual.some((item, index) => item !== expected[index])) errors.push(`promotion allowed_globs must exactly declare: ${expected.join(", ")}`);
  return errors;
}
function exactTransitionErrors(entries, contractPath, expectedChanges, cancellation) {
  const errors = [];
  const expected = /* @__PURE__ */ new Map([[successorPath, "D"], [contractPath, "contract"]]);
  if (!cancellation) {
    for (const change of expectedChanges) expected.set(change.path, change.operation === "add" ? "A" : change.operation === "modify" ? "M" : "D");
  }
  for (const entry of entries) {
    if (/^[RC]/.test(entry.status) || entry.previousPath) errors.push(`${entry.path}: successor transitions forbid renames and copies`);
    const wanted = expected.get(entry.path);
    if (!wanted) errors.push(`${entry.path}: extra file is forbidden during a successor transition`);
    else if (wanted === "contract") {
      if (entry.status !== "A" && entry.status !== "M") errors.push(`${entry.path}: promotion contract must be added or modified`);
    } else if (entry.status !== wanted) errors.push(`${entry.path}: successor transition expected Git status ${wanted}, found ${entry.status}`);
    expected.delete(entry.path);
  }
  for (const [filePath] of expected) errors.push(`${filePath}: successor transition is missing the required change`);
  return errors;
}
function exactPolicyParts(content, startMarker, endMarker) {
  const normalized = content.toString("utf8").replace(/\r\n?/g, "\n");
  const start = normalized.indexOf(startMarker);
  const end = normalized.indexOf(endMarker, Math.max(0, start + startMarker.length));
  if (start < 0 || end <= start || normalized.indexOf(startMarker, start + startMarker.length) >= 0 || normalized.indexOf(endMarker, end + endMarker.length) >= 0) throw new Error("AGENTS.md generated section markers are not exact and unique");
  return { prefix: normalized.slice(0, start), block: normalized.slice(start, end + endMarker.length), suffix: normalized.slice(end + endMarker.length) };
}
function verifyCanonicalSuccessorWorkflow(raw, trustedSourceRoot, toRevision) {
  return readFile5(path9.join(trustedSourceRoot, "templates", "source", ".github", "workflows", "mousely-guard.yml.tmpl"), "utf8").then((template) => {
    const expected = template.replaceAll("{{SOURCE_REVISION}}", toRevision);
    return raw.toString("utf8") === expected ? [] : ["successor workflow is not the exact safe canonical workflow rendered at verifier B"];
  });
}
function managedPaths(lock) {
  return [
    ...(lock.generated_files ?? []).map((entry) => String(entry.path)),
    String(lock.harness?.path ?? "")
  ].filter(Boolean);
}
function verifySuccessorPreparation(options) {
  const baseLock = readCommitBlob(options.repositoryRoot, options.baseSha, lockPath, 1024 * 1024);
  const baseWorkflow = readCommitBlob(options.repositoryRoot, options.baseSha, guardWorkflowPath, 256 * 1024);
  const validation = validateIntent({ file: options.file, repository: options.repository, baseBranch: options.baseBranch, actionRef: options.actionRef, baseLock, baseWorkflow, now: options.now });
  const errors = [...validation.errors];
  if (!validation.intent) return { errors };
  errors.push(...exactTransitionErrors(options.entries, options.contractPath, [], false).filter((error) => !error.startsWith(`${successorPath}:`)));
  const allowedEntries = /* @__PURE__ */ new Set([successorPath, options.contractPath]);
  for (const entry of options.entries) {
    if (!allowedEntries.has(entry.path) || entry.previousPath || entry.path === successorPath && entry.status !== "A" || entry.path === options.contractPath && !["A", "M"].includes(entry.status)) {
      errors.push(`${entry.path}: preparation may change only a newly added successor intent and its matching contract`);
    }
  }
  if (options.entries.length !== 2 || !options.entries.some((entry) => entry.path === successorPath) || !options.entries.some((entry) => entry.path === options.contractPath)) errors.push("successor preparation requires exactly the intent and one task contract");
  errors.push(...promotionContractErrors(options.contract, validation.intent, [successorPath], options));
  return { intent: validation.intent, errors };
}
async function verifySuccessorResolution(options) {
  const errors = [];
  const baseLockBlob = readCommitBlob(options.repositoryRoot, options.baseSha, lockPath, 1024 * 1024);
  const baseWorkflow = readCommitBlob(options.repositoryRoot, options.baseSha, guardWorkflowPath, 256 * 1024);
  const validation = validateIntent({ file: options.file, repository: options.repository, baseBranch: options.baseBranch, actionRef: options.actionRef, baseLock: baseLockBlob, baseWorkflow, now: options.now });
  errors.push(...validation.errors);
  if (!validation.intent) return { ok: false, status: "successor-invalid", errors };
  const intent = validation.intent;
  const baseLock = strictJson(baseLockBlob.bytes, "base context lock");
  if (baseLock.source_revision !== options.actionRef || baseLock.source_revisions?.["Mouse-ly/mousely-ops"] !== options.actionRef) errors.push("base context lock is not bound to verifier A");
  errors.push(...await verifyTrustedBaseline({
    trustedSourceRoot: options.trustedSourceRoot,
    repositoryRoot: await realpath7(options.repositoryRoot),
    repository: options.repository,
    sourceRevision: options.actionRef,
    targetRevision: String(baseLock.target_repository.revision),
    lock: baseLock,
    readRepositoryFile: async (filePath) => readCommitBlob(options.repositoryRoot, options.baseSha, filePath).bytes
  }));
  const cancellation = options.entries.length === 2 && options.entries.some((entry) => entry.path === successorPath && entry.status === "D") && options.entries.some((entry) => entry.path === options.contractPath && ["A", "M"].includes(entry.status));
  errors.push(...promotionContractErrors(options.contract, intent, cancellation ? [successorPath] : [successorPath, ...intent.changes.map((change) => change.path)], options));
  errors.push(...exactTransitionErrors(options.entries, options.contractPath, intent.changes, cancellation));
  if (errors.length > 0) return { ok: false, status: "successor-invalid", errors: [...new Set(errors)], intent };
  if (cancellation) return { ok: false, status: "successor-cancel-needs-human", errors: [], intent };
  let successorSource;
  try {
    successorSource = await materializeSuccessorSource({ sourceRoot: options.successorSourceRoot, targetRoot: options.repositoryRoot, revision: intent.toRevision });
  } catch (error) {
    return { ok: false, status: "successor-authentication-needs-human", errors: [error.message], intent };
  }
  try {
    let aggregateBytes = 0;
    for (const change of intent.changes) {
      if (change.operation === "delete") continue;
      try {
        const blob = readCommitBlob(options.repositoryRoot, options.headSha, change.path);
        aggregateBytes += blob.bytes.length;
        if (blob.mode !== change.mode) errors.push(`${change.path}: final mode differs from successor intent`);
        if (sha256(blob.bytes) !== change.sha256) errors.push(`${change.path}: final blob hash differs from successor intent`);
        const printableBinary = blob.bytes.toString("latin1").replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "\n");
        if (scanSecrets(blob.bytes.toString("utf8")).length > 0 || scanSecrets(printableBinary).length > 0) errors.push(`${change.path}: successor blob contains potential secret material`);
      } catch (error) {
        errors.push(error.message);
      }
    }
    if (aggregateBytes > 128 * 1024 * 1024) errors.push("successor transition exceeds the 128 MiB aggregate blob limit");
    try {
      const headWorkflow = readCommitBlob(options.repositoryRoot, options.headSha, guardWorkflowPath, 256 * 1024);
      errors.push(...await verifyCanonicalSuccessorWorkflow(headWorkflow.bytes, successorSource.root, intent.toRevision));
      if (sha256(headWorkflow.bytes) !== intent.raw.to.workflow_sha256) errors.push("successor workflow hash differs from intent authority");
      const headHarness = readCommitBlob(options.repositoryRoot, options.headSha, harnessPath);
      if (sha256(headHarness.bytes) !== intent.raw.to.harness_sha256) errors.push("successor harness hash differs from intent authority");
      const headLockBlob = readCommitBlob(options.repositoryRoot, options.headSha, lockPath, 1024 * 1024);
      if (sha256(headLockBlob.bytes) !== intent.raw.to.context_lock_sha256) errors.push("successor context-lock hash differs from intent authority");
      const headLock = strictJson(headLockBlob.bytes, "successor context lock");
      const lockValidation = validateContract(headLock, "ContextLock.v1");
      if (!lockValidation.valid) errors.push(...lockValidation.errors.map((error) => `successor context lock: ${error}`));
      if (headLock.source_revision !== intent.toRevision || headLock.source_revisions?.["Mouse-ly/mousely-ops"] !== intent.toRevision) errors.push("successor context lock is not bound to verifier B");
      if (stableStringify(headLock.target_repository) !== stableStringify(baseLock.target_repository)) errors.push("successor context lock changed the base-owned target repository anchor");
      const targetRepository = String(baseLock.target_repository.repository);
      if (headLock.source_revisions?.[targetRepository] !== baseLock.source_revisions?.[targetRepository]) errors.push("successor context lock changed the target source revision anchor");
      if (headLock.harness?.path !== harnessPath || headLock.harness?.sha256 !== sha256(headHarness.bytes)) errors.push("successor context lock harness binding is invalid");
      const headManaged = managedPaths(headLock);
      const baseManaged = new Set(managedPaths(baseLock));
      const headManagedSet = new Set(headManaged);
      const folded = /* @__PURE__ */ new Set();
      for (const managed of headManaged) {
        const lower = managed.toLocaleLowerCase("en-US");
        if (folded.has(lower)) errors.push(`${managed}: successor context lock contains a duplicate/case-colliding managed path`);
        folded.add(lower);
        if (!promotionPathAllowed(managed)) errors.push(`${managed}: successor context lock manages a path outside the control-plane allowlist`);
      }
      for (const managed of baseManaged) {
        if (!headManagedSet.has(managed) && changeFor(intent.changes, managed)?.operation !== "delete") errors.push(`${managed}: successor lock removed a managed path without an exact approved deletion`);
      }
      for (const managed of headManagedSet) {
        if (!baseManaged.has(managed) && !changeFor(intent.changes, managed)) errors.push(`${managed}: successor lock added a managed path without an exact approved blob transition`);
      }
      const projectionPaths = /* @__PURE__ */ new Set([...baseManaged, ...headManagedSet, agentsPath, lockPath]);
      for (const change of intent.changes) if (!projectionPaths.has(change.path)) errors.push(`${change.path}: successor payload is not an exact path in the materialized B projection delta`);
      errors.push(...await verifyTrustedBaseline({
        trustedSourceRoot: successorSource.root,
        repositoryRoot: await realpath7(options.repositoryRoot),
        repository: options.repository,
        sourceRevision: intent.toRevision,
        targetRevision: String(baseLock.target_repository.revision),
        lock: headLock,
        readRepositoryFile: async (filePath) => readCommitBlob(options.repositoryRoot, options.headSha, filePath).bytes
      }).then((items) => items.map((error) => `successor B projection: ${error}`)));
      const contextResult = await verifyContextLock(headLock, options.repositoryRoot, options.now ?? /* @__PURE__ */ new Date(), options.repositoryRoot);
      if (!contextResult.ok) errors.push(...contextResult.errors.map((error) => `successor context: ${error}`));
      const manifest = asObject2(import_yaml3.default.parse(readCommitBlob(options.repositoryRoot, options.headSha, "mousely.repo.yaml", 1024 * 1024).bytes.toString("utf8")), "successor repository manifest");
      const manifestValidation = validateContract(manifest, "RepoManifest.v1");
      if (!manifestValidation.valid) errors.push(...manifestValidation.errors.map((error) => `successor manifest: ${error}`));
      if (manifest.source_revision !== intent.toRevision || manifest.organization !== options.organization || manifest.name !== options.repoName) errors.push("successor manifest is not bound to verifier B and the authenticated repository");
      for (const slice of headLock.context_slices ?? []) {
        const snapshot = readCommitBlob(options.repositoryRoot, options.headSha, String(slice.generated_path), 32 * 1024 * 1024).bytes.toString("utf8");
        if (!snapshot.includes(`source_revision: ${JSON.stringify(intent.toRevision)}`)) errors.push(`${String(slice.generated_path)}: context snapshot does not identify verifier B`);
      }
      const baseSection = (baseLock.repository_owned_sections ?? [])[0];
      const headSection = (headLock.repository_owned_sections ?? [])[0];
      if (!baseSection || !headSection) errors.push("base and successor locks require the generated AGENTS section contract");
      else {
        const baseAgents = readCommitBlob(options.repositoryRoot, options.baseSha, agentsPath, 1024 * 1024).bytes;
        const headAgents = readCommitBlob(options.repositoryRoot, options.headSha, agentsPath, 1024 * 1024).bytes;
        const baseParts = exactPolicyParts(baseAgents, String(baseSection.start_marker), String(baseSection.end_marker));
        const headParts = exactPolicyParts(headAgents, String(headSection.start_marker), String(headSection.end_marker));
        if (baseParts.prefix !== headParts.prefix || baseParts.suffix !== headParts.suffix) errors.push("successor AGENTS.md changed repository-owned exterior bytes");
        if (!headParts.block.includes(`Mouse-ly/mousely-ops@${intent.toRevision}`)) errors.push("successor AGENTS.md generated block is not bound to verifier B");
      }
    } catch (error) {
      errors.push(`successor semantic verification failed: ${error.message}`);
    }
    const provenanceErrors = successorSource.provenanceAuthenticated ? [] : ["successor source origin and HEAD are local consistency evidence only; authenticated GitHub App/deploy-key checkout or API provenance remains required"];
    return {
      ok: false,
      status: errors.length === 0 ? "successor-activation-needs-human" : "successor-invalid",
      errors: [.../* @__PURE__ */ new Set([...errors, ...provenanceErrors])],
      intent
    };
  } finally {
    await successorSource.cleanup();
  }
}

// src/authority.ts
function asObject3(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}
function authorityReference(value, label = "authority receipt reference") {
  const reference = asObject3(value, label);
  const kind = String(reference.kind);
  if (!["signed-local", "github-event", "github-api", "linear-api"].includes(kind)) throw new Error(`${label} kind is unsupported`);
  if (typeof reference.id !== "string" || !reference.id) throw new Error(`${label} id is required`);
  if (!/^[a-f0-9]{64}$/.test(String(reference.sha256))) throw new Error(`${label} sha256 must be lowercase hexadecimal`);
  return { kind, id: reference.id, sha256: String(reference.sha256) };
}
function requestIntentHash(contract) {
  const { request_receipt: _requestReceipt, ...authorizedContract } = contract;
  return hashValue(authorizedContract);
}
function unsignedReceipt(receipt) {
  const { signature: _signature, ...unsigned } = receipt;
  return unsigned;
}
function receiptMap(value) {
  const list = Array.isArray(value) ? value : Array.isArray(value?.receipts) ? value.receipts : [];
  const output = /* @__PURE__ */ new Map();
  for (const raw of list) {
    const receipt = asObject3(raw, "authority receipt");
    const id = String(receipt.id ?? "");
    if (!id || output.has(id)) throw new Error(`authority receipts require unique non-empty ids; duplicate ${id || "<empty>"}`);
    output.set(id, receipt);
  }
  return output;
}
function verifySignedAuthorityReceipt(options) {
  const errors = [];
  let reference;
  try {
    reference = authorityReference(options.reference);
  } catch (error) {
    return { errors: [error.message], needsHuman: true };
  }
  if (reference.kind !== "signed-local") return { errors: [`${reference.id}: ${reference.kind} receipt requires an external trusted connector and remains needs-human`], needsHuman: true };
  if (options.receiptType !== "request") return { errors: [`${reference.id}: signed-local HMAC receipts are not authorized for ${options.receiptType} readiness; a pinned public-key issuer or trusted external connector is required`], needsHuman: true };
  if (!options.signingKey || options.signingKey.length < 32) return { errors: [`${reference.id}: MOUSELY_AUTHORITY_SIGNING_KEY is unavailable`], needsHuman: true };
  const receipt = options.receipts.get(reference.id);
  if (!receipt) return { errors: [`${reference.id}: referenced authority receipt is unavailable`], needsHuman: true };
  const validation = validateContract(receipt, "AuthorityReceipt.v1");
  if (!validation.valid) errors.push(...validation.errors.map((error) => `${reference.id}: ${error}`));
  if (hashValue(receipt) !== reference.sha256) errors.push(`${reference.id}: authority receipt hash does not match its reference`);
  if (receipt.receipt_type !== options.receiptType) errors.push(`${reference.id}: authority receipt type is not ${options.receiptType}`);
  const now = options.now ?? /* @__PURE__ */ new Date();
  const created = new Date(String(receipt.created_at));
  const expires = new Date(String(receipt.expires_at));
  if (!Number.isFinite(created.getTime()) || created.getTime() > now.getTime() + 5 * 6e4) errors.push(`${reference.id}: authority receipt was created in the future`);
  if (!Number.isFinite(expires.getTime()) || expires <= now) errors.push(`${reference.id}: authority receipt is expired`);
  if (Number.isFinite(created.getTime()) && Number.isFinite(expires.getTime()) && expires.getTime() - created.getTime() > 5 * 6e4) errors.push(`${reference.id}: local request authority lifetime exceeds five minutes`);
  const issuer = receipt.issuer;
  if (issuer?.provider !== "local-authority" || issuer.id !== "kars-request-broker-v1") errors.push(`${reference.id}: local request authority issuer is not the pinned KARS request broker`);
  if (!verifySignature(unsignedReceipt(receipt), receipt.signature, options.signingKey)) errors.push(`${reference.id}: authority receipt signature is invalid`);
  let payload = {};
  try {
    payload = asObject3(receipt.payload, `${reference.id} payload`);
  } catch (error) {
    errors.push(error.message);
  }
  return errors.length > 0 ? { errors, needsHuman: true } : { verified: { receipt, payload, identity: payload.reviewer, writer: payload.writer }, errors: [], needsHuman: false };
}
function verifyLocalRequestAuthority(options) {
  let reference;
  try {
    reference = authorityReference(options.contract.request_receipt, "task request receipt reference");
  } catch (error) {
    return { errors: [error.message], needsHuman: true };
  }
  const verified = verifySignedAuthorityReceipt({ reference, receipts: /* @__PURE__ */ new Map([[String(options.receipt.id), options.receipt]]), signingKey: options.signingKey, receiptType: "request", now: options.now });
  if (!verified.verified) return verified;
  const payload = verified.verified.payload;
  const source = options.contract.source;
  const requestSource = payload.request_source;
  const errors = [];
  if (verified.verified.receipt.source_revision !== options.contract.source_revision) errors.push("trusted request receipt source_revision does not match the task contract");
  if (requestSource?.kind !== source?.kind || requestSource?.id !== source?.id) errors.push("trusted request receipt source does not match the task contract");
  for (const field of ["organization", "project", "repo", "linear_issue"]) {
    if (payload[field] !== options.contract[field]) errors.push(`trusted request receipt ${field} does not match the task contract`);
  }
  if (payload.contract_hash !== requestIntentHash(options.contract)) errors.push("trusted request receipt contract hash does not match the task contract");
  if (payload.context_hash !== hashValue(options.contextLock)) errors.push("trusted request receipt context hash does not match the supplied context lock");
  if (payload.manifest_hash !== hashValue(options.manifest)) errors.push("trusted request receipt manifest hash does not match the supplied repository manifest");
  if (payload.required_capabilities_hash !== hashValue(options.contract.capabilities)) errors.push("trusted request receipt required-capabilities hash does not match the task contract");
  if (payload.base_commit !== options.baseCommit) errors.push("trusted request receipt base commit does not match the canonical context target revision");
  if (payload.use !== "preflight" || !/^[a-f0-9]{32,128}$/.test(String(payload.nonce ?? ""))) errors.push("trusted request receipt requires a bound preflight use and cryptographic nonce");
  if (options.receipt.id !== `request-${String(payload.nonce ?? "")}`) errors.push("trusted request receipt id must bind its nonce");
  const target = options.contextLock.target_repository;
  if (target?.repository !== `${String(options.contract.organization)}/${String(options.contract.repo)}`) errors.push("trusted request context repository does not match the task contract");
  const requester = payload.requester;
  if (!requester || requester.role !== "requester" || requester.kind !== "human" || requester.provider !== "human") errors.push("trusted request receipt requires a human requester identity from the human provider");
  return errors.length > 0 ? { errors, needsHuman: true } : verified;
}
function githubRequestAuthorityDocument(event, contract) {
  const repository = asObject3(event.repository, "event repository");
  const pullRequest = asObject3(event.pull_request, "pull request");
  const user = asObject3(pullRequest.user, "pull request user");
  const number = Number(event.number ?? pullRequest.number);
  if (!Number.isInteger(number) || number < 1) throw new Error("GitHub request identity correlation requires a pull request number");
  const association = String(pullRequest.author_association ?? "");
  if (!["OWNER", "MEMBER", "COLLABORATOR"].includes(association)) throw new Error("GitHub request identity correlation requires OWNER, MEMBER, or COLLABORATOR association");
  const login = String(user.login ?? "").trim();
  if (!login || user.type !== "User") throw new Error("GitHub request identity correlation requires a non-empty human login with user.type User");
  const repositoryName = String(repository.full_name ?? "");
  const issue = String(contract.linear_issue ?? "");
  const id = `github-pr:${repositoryName}#${number}:${issue}`;
  return {
    schema_version: "DerivedRequestCorrelation.v1",
    id,
    provider: "github-event",
    repository: repositoryName,
    pull_request_number: number,
    requester: { id: login, kind: "human", association, platform_type: "User" },
    source: contract.source,
    organization: contract.organization,
    project: contract.project,
    repo: contract.repo,
    linear_issue: contract.linear_issue,
    claimed_intent_hash: requestIntentHash(contract)
  };
}
function verifyGithubRequestAuthority(event, contract) {
  let reference;
  try {
    reference = authorityReference(contract.request_receipt, "task request receipt reference");
  } catch (error) {
    return { errors: [error.message], needsHuman: true };
  }
  if (reference.kind !== "github-event") return { errors: ["trusted GitHub PR mode requires a github-event request receipt reference"], needsHuman: true };
  try {
    const document = githubRequestAuthorityDocument(event, contract);
    const errors = [];
    if (reference.id !== document.id) errors.push("GitHub request correlation id does not match the base-owned event");
    if (reference.sha256 !== hashValue(document)) errors.push("GitHub request correlation hash does not match the base-owned event and claimed task intent");
    return errors.length > 0 ? { errors, needsHuman: true } : { verified: { receipt: document, payload: document, identity: document.requester }, errors: [], needsHuman: false };
  } catch (error) {
    return { errors: [error.message], needsHuman: true };
  }
}
function identitiesIndependent(identity, writer) {
  return Boolean(identity && writer && identity.id && writer.id && identity.id !== writer.id && identity.session_id && writer.session_id && identity.session_id !== writer.session_id);
}
function reviewRoleAllowed(lane, reviewer) {
  if (!reviewer) return false;
  if (reviewer.kind === "human" !== (reviewer.provider === "human")) return false;
  if (lane === "product-premise" || lane === "design") return reviewer.kind === "human" && reviewer.provider === "human" && reviewer.role === "product-owner";
  if (lane === "security-privacy") return reviewer.role === "security-reviewer";
  if (lane === "release") return reviewer.role === "release-reviewer";
  if (lane === "outside-adversarial") return ["independent-evaluator", "security-reviewer"].includes(String(reviewer.role));
  return ["teammate", "independent-evaluator"].includes(String(reviewer.role));
}

// src/pull-request.ts
var repositoryControlPlanePrefixes = [
  ".github/workflows/",
  ".github/actions/",
  ".codex/",
  ".agents/",
  ".cursor/"
];
var requiredControlPlaneReviewLanes = ["engineering", "dx", "security-privacy", "outside-adversarial"];
var repositoryOwnerControlPlaneGate = "repository-owner control-plane approval";
var currentIntentApprovalMessage = "GitHub event identity and association correlate the PR author only; trusted current-intent approval from an issue/direct-request authority remains required";
var explicitRequestApprovalMessage = "high-risk or control-plane work requires trusted explicit issue/direct approval evidence beyond GitHub author association; no external approval receipt was verified";
function requiresExplicitRequestApproval(contract, controlPlane) {
  const lanes = new Set(Array.isArray(contract.initial_review_lanes) ? contract.initial_review_lanes.map(String) : []);
  const classes = new Set(Array.isArray(contract.edit_scope?.expected_change_classes) ? contract.edit_scope.expected_change_classes.map(String) : []);
  return controlPlane || ["security-privacy", "release", "outside-adversarial"].some((lane) => lanes.has(lane)) || ["authentication-privacy", "migration-data", "release-publishing"].some((changeClass) => classes.has(changeClass));
}
function isAgentInstructionPath(filePath) {
  return filePath !== "AGENTS.md" && (/(^|\/)AGENTS\.override\.md$/i.test(filePath) || /(^|\/)AGENTS\.md$/i.test(filePath) || /(^|\/)(?:CLAUDE|GEMINI)\.md$/i.test(filePath) || /(^|\/)\.cursorrules(?:\/|$)/i.test(filePath) || /(^|\/)\.clinerules(?:\/|$)/i.test(filePath) || /(^|\/)\.claude(?:\/|$)/i.test(filePath) || /(^|\/)\.gemini(?:\/|$)/i.test(filePath) || /(^|\/)\.(?:aider|cline|continue|roo|windsurf)(?:\/|$)/i.test(filePath) || /(^|\/)\.aider(?:\.conf)?\.ya?ml$/i.test(filePath) || /(^|\/)\.windsurfrules$/i.test(filePath) || filePath === ".github/copilot-instructions.md" || /^\.github\/(?:agents|prompts|instructions|chatmodes|skills)\//i.test(filePath));
}
function asObject4(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}
function git3(root, args, maxBuffer = 8 * 1024 * 1024) {
  return execFileSync3("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer });
}
function gitOk(root, args) {
  return spawnSync6("git", ["-C", root, ...args], { encoding: "utf8" }).status === 0;
}
function gitBuffer2(root, args, maxBuffer) {
  const result = spawnSync6("git", ["-C", root, ...args], { encoding: null, maxBuffer });
  if (result.status !== 0) throw new Error(`Git object read failed: ${Buffer.from(result.stderr ?? []).toString("utf8").trim()}`);
  return Buffer.from(result.stdout ?? []);
}
function parseNameStatus(raw) {
  const fields = raw.split("\0");
  const output = [];
  for (let index = 0; index < fields.length; ) {
    const status = fields[index++];
    if (!status) continue;
    const first = fields[index++] ?? "";
    if (/^[RC]/.test(status)) {
      const second = fields[index++] ?? "";
      output.push({ status, previousPath: first, path: second });
    } else {
      output.push({ status, path: first });
    }
  }
  return output;
}
function canonicalLinearIds(value) {
  return [...value.matchAll(/(?<![A-Za-z0-9])MLY-[1-9][0-9]*(?![A-Za-z0-9])/gi)].map((match2) => match2[0].toUpperCase());
}
async function readEvent(eventPath) {
  const metadata = await lstat6(eventPath);
  if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size > 1024 * 1024) throw new Error("Pull request event must be a regular JSON file no larger than 1 MiB");
  return asObject4(JSON.parse(await readFile6(eventPath, "utf8")), "pull request event");
}
function changedContract(entries) {
  const contractEntries = entries.filter((entry2) => entry2.path.startsWith(".mousely/contracts/") || entry2.previousPath?.startsWith(".mousely/contracts/"));
  const jsonEntries = contractEntries.filter((entry2) => entry2.path.endsWith(".json") || entry2.previousPath?.endsWith(".json"));
  if (jsonEntries.length !== 1) throw new Error(`exactly one committed .mousely/contracts/*.json task contract must change; found ${jsonEntries.length}`);
  const entry = jsonEntries[0];
  if (entry.status !== "A" && entry.status !== "M") throw new Error(`task contract must be added or modified, not ${entry.status}`);
  const match2 = /^\.mousely\/contracts\/(MLY-[1-9][0-9]*)\.json$/.exec(entry.path);
  if (!match2) throw new Error("task contract path must be .mousely/contracts/MLY-<number>.json");
  return { path: entry.path, issue: match2[1] };
}
function readRegularContractBlob(root, head, contractPath) {
  const tree = git3(root, ["ls-tree", "-z", head, "--", contractPath]);
  const records = tree.split("\0").filter(Boolean);
  if (records.length !== 1) throw new Error("task contract must resolve to exactly one committed Git tree entry");
  const match2 = /^(\d{6}) (\w+) ([a-f0-9]{40,64})\t(.+)$/.exec(records[0]);
  if (!match2 || match2[1] !== "100644" || match2[2] !== "blob" || match2[4] !== contractPath) {
    throw new Error("task contract must be a non-executable regular 100644 Git blob");
  }
  const size = Number(git3(root, ["cat-file", "-s", match2[3]]).trim());
  if (!Number.isFinite(size) || size > 256 * 1024) throw new Error("task contract exceeds the 256 KiB limit");
  const raw = git3(root, ["show", `${head}:${contractPath}`], 512 * 1024);
  const yamlDocument = import_yaml4.default.parseDocument(raw, { uniqueKeys: true, schema: "json" });
  if (yamlDocument.errors.length > 0) throw new Error(`task contract contains duplicate or invalid JSON keys: ${yamlDocument.errors[0].message}`);
  return asObject4(JSON.parse(raw), "task contract");
}
function scanCommittedBlobs(root, head, entries) {
  const errors = [];
  for (const entry of entries) {
    if (entry.status === "D") continue;
    const tree = git3(root, ["ls-tree", "-z", head, "--", entry.path]);
    const records = tree.split("\0").filter(Boolean);
    if (records.length !== 1) {
      errors.push(`${entry.path}: changed target must resolve to exactly one Git tree entry`);
      continue;
    }
    const match2 = /^(\d{6}) (\w+) ([a-f0-9]{40,64})\t(.+)$/.exec(records[0]);
    if (!match2 || match2[4] !== entry.path) {
      errors.push(`${entry.path}: malformed Git tree entry`);
      continue;
    }
    if (match2[2] === "commit" || match2[1] === "120000") {
      errors.push(`${entry.path}: changed symlinks and gitlinks are forbidden by the v1 trusted guard`);
      continue;
    }
    if (match2[2] !== "blob" || !["100644", "100755"].includes(match2[1])) {
      errors.push(`${entry.path}: unsupported Git object type ${match2[2]}`);
      continue;
    }
    const size = Number(git3(root, ["cat-file", "-s", match2[3]]).trim());
    if (!Number.isFinite(size) || size > 32 * 1024 * 1024) {
      errors.push(`${entry.path}: changed blob exceeds the 32 MiB trusted scan limit`);
      continue;
    }
    try {
      const blob = gitBuffer2(root, ["cat-file", "blob", match2[3]], 33 * 1024 * 1024);
      const utf8 = blob.toString("utf8");
      const printableBinary = blob.toString("latin1").replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "\n");
      if (scanSecrets(utf8).length > 0 || scanSecrets(printableBinary).length > 0) errors.push(`${entry.path}: committed blob contains potential secret material`);
    } catch (error) {
      errors.push(`${entry.path}: trusted blob scan failed closed: ${error.message}`);
    }
  }
  return errors;
}
function matchingIssue(event, contract, contractPathIssue) {
  const pullRequest = asObject4(event.pull_request, "pull request");
  const head = asObject4(pullRequest.head, "pull request head");
  const title = String(pullRequest.title ?? "");
  const body = String(pullRequest.body ?? "");
  const branch = String(head.ref ?? "");
  const errors = [];
  const titleMatch = /^\[(MLY-[1-9][0-9]*)\]\s+/.exec(title);
  const bodyMatches = [...body.matchAll(/^Linear issue:\s*(MLY-[1-9][0-9]*)\s*$/gm)].map((match2) => match2[1]);
  const branchMatches = canonicalLinearIds(branch);
  if (!titleMatch) errors.push("PR title must start with [MLY-###] ");
  if (bodyMatches.length !== 1) errors.push("PR body must contain exactly one structured `Linear issue: MLY-###` line");
  if (branchMatches.length !== 1) errors.push("PR branch must contain exactly one boundary-safe MLY-### identifier");
  const values = [contractPathIssue, String(contract.id), String(contract.linear_issue), titleMatch?.[1], bodyMatches[0], branchMatches[0]].filter(Boolean).map((item) => String(item).toUpperCase());
  if (new Set(values).size !== 1 || values.length !== 6) errors.push("contract path, id, linear_issue, PR title, body, and branch must resolve to the same MLY identifier");
  return errors;
}
async function verifyPullRequest(options) {
  const errors = [];
  if (options.actionRepository !== "Mouse-ly/mousely-ops") errors.push("trusted action repository must be Mouse-ly/mousely-ops");
  if (!/^[a-f0-9]{40}$/.test(options.actionRef)) errors.push("trusted action must be pinned to an exact 40-character commit SHA");
  if (errors.length > 0) return { ok: false, status: "untrusted-verifier", errors };
  const root = await realpath8(options.repositoryRoot);
  const event = await readEvent(options.eventPath);
  const repository = asObject4(event.repository, "event repository");
  const pullRequest = asObject4(event.pull_request, "pull request");
  const base = asObject4(pullRequest.base, "pull request base");
  const head = asObject4(pullRequest.head, "pull request head");
  const baseRepo = asObject4(base.repo, "pull request base repository");
  const headRepo = asObject4(head.repo, "pull request head repository");
  const repositoryName = String(repository.full_name ?? "");
  const baseRepositoryName = String(baseRepo.full_name ?? "");
  const headRepositoryName = String(headRepo.full_name ?? "");
  const baseSha = String(base.sha ?? "");
  const headSha = String(head.sha ?? "");
  const baseBranch = String(base.ref ?? "");
  if (!/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(repositoryName)) errors.push("event repository full_name is invalid");
  if (baseRepositoryName !== repositoryName || headRepositoryName !== repositoryName) errors.push("trusted PR guard accepts same-repository pull requests only");
  if (!/^[a-f0-9]{40}$/.test(baseSha) || !/^[a-f0-9]{40}$/.test(headSha)) errors.push("event requires exact 40-character base and head SHAs");
  const currentHead = git3(root, ["rev-parse", "HEAD"]).trim();
  if (currentHead !== headSha) errors.push("checked-out target HEAD does not match the event head SHA");
  if (!gitOk(root, ["cat-file", "-e", `${baseSha}^{commit}`]) || !gitOk(root, ["cat-file", "-e", `${headSha}^{commit}`])) errors.push("event base or head commit is unavailable");
  else if (!gitOk(root, ["merge-base", "--is-ancestor", baseSha, headSha])) errors.push("event base is not an ancestor of the PR head");
  if (errors.length > 0) return { ok: false, status: "invalid-pr-binding", errors };
  let baseSuccessor;
  let headSuccessor;
  try {
    baseSuccessor = readOptionalSuccessor(root, baseSha);
    headSuccessor = readOptionalSuccessor(root, headSha);
  } catch (error) {
    return { ok: false, status: "successor-invalid", errors: [error.message] };
  }
  if (baseSuccessor && headSuccessor) {
    return {
      ok: false,
      status: "successor-pending",
      errors: ["a base-owned verifier successor intent freezes ordinary PRs until an exact activation or cancellation deletes it"]
    };
  }
  const preparingSuccessor = !baseSuccessor && Boolean(headSuccessor);
  if (baseSuccessor && !headSuccessor) {
    const transitionEntries = parseNameStatus(git3(root, ["diff", "--name-status", "-z", "--find-renames", baseSha, headSha, "--"]));
    for (const entry of transitionEntries) {
      for (const filePath of [entry.previousPath, entry.path].filter((item) => Boolean(item))) {
        if (/[\\\r\n]/.test(filePath)) errors.push(`non-portable changed path is forbidden: ${JSON.stringify(filePath)}`);
      }
    }
    errors.push(...scanCommittedBlobs(root, headSha, transitionEntries));
    let selected2;
    let contract2;
    try {
      selected2 = changedContract(transitionEntries);
      contract2 = readRegularContractBlob(root, headSha, selected2.path);
      const contractValidation = validateContract(contract2, "TaskContract.v1");
      if (!contractValidation.valid) errors.push(...contractValidation.errors.map((item) => `${selected2.path}: ${item}`));
      errors.push(...matchingIssue(event, contract2, selected2.issue));
      if (scanSecrets(contract2).length > 0) errors.push("task contract contains potential secret material");
    } catch (error) {
      errors.push(error.message);
    }
    if (errors.length > 0 || !selected2 || !contract2) return { ok: false, status: "successor-invalid", errors: [...new Set(errors)] };
    const requestAuthority = verifyGithubRequestAuthority(event, contract2);
    if (!requestAuthority.verified) return { ok: false, status: "request-authority-needs-human", errors: requestAuthority.errors };
    const explicitApprovalErrors = [currentIntentApprovalMessage, ...requiresExplicitRequestApproval(contract2, true) ? [explicitRequestApprovalMessage] : []];
    const [transitionOwner, transitionRepoName] = repositoryName.split("/");
    const transition = await verifySuccessorResolution({
      file: baseSuccessor,
      repositoryRoot: root,
      trustedSourceRoot: options.trustedSourceRoot,
      successorSourceRoot: options.successorSourceRoot,
      repository: repositoryName,
      organization: transitionOwner,
      repoName: transitionRepoName,
      baseBranch,
      baseSha,
      headSha,
      actionRef: options.actionRef,
      entries: transitionEntries,
      contractPath: selected2.path,
      contract: contract2
    });
    return {
      ok: transition.ok,
      status: transition.status,
      repository: repositoryName,
      base_sha: baseSha,
      head_sha: headSha,
      trusted_action_revision: options.actionRef,
      successor_revision: transition.intent?.toRevision,
      contract_path: selected2.path,
      linear_issue: selected2.issue,
      human_gates: contract2.human_gates,
      human_scope_approval_required: true,
      request_identity_correlated: true,
      current_intent_approval_required: true,
      errors: [...transition.errors, ...explicitApprovalErrors]
    };
  }
  const [owner, repoName] = repositoryName.split("/");
  const manifestPath = await resolveExistingInside(root, "mousely.repo.yaml");
  const manifest = asObject4(await readData(manifestPath), "repository manifest");
  const manifestValidation = validateContract(manifest, "RepoManifest.v1");
  if (!manifestValidation.valid) errors.push(...manifestValidation.errors.map((item) => `mousely.repo.yaml: ${item}`));
  if (manifest.organization !== owner || manifest.name !== repoName) errors.push("repository manifest organization/name does not match the PR repository");
  const lockPath2 = await resolveExistingInside(root, "mousely-context.lock");
  const lock = asObject4(await readData(lockPath2), "context lock");
  if (lock.source_revision !== options.actionRef) errors.push("context lock source_revision does not match the pinned trusted action");
  const target = asObject4(lock.target_repository, "context lock target");
  if (target.repository !== repositoryName) errors.push("context lock target repository does not match the PR repository");
  let anchoredTargetRevision = baseSha;
  if (gitOk(root, ["cat-file", "-e", `${baseSha}:mousely-context.lock`])) {
    try {
      const baseLock = asObject4(JSON.parse(git3(root, ["show", `${baseSha}:mousely-context.lock`], 1024 * 1024)), "base context lock");
      const baseTarget = asObject4(baseLock.target_repository, "base context lock target");
      anchoredTargetRevision = String(baseTarget.revision);
      if (baseTarget.repository !== repositoryName) errors.push("base context lock target repository does not match the PR repository");
      if (target.revision !== anchoredTargetRevision) errors.push("context lock target revision differs from the base-owned context lock");
      const baseSources = asObject4(baseLock.source_revisions, "base context source revisions");
      const currentSources = asObject4(lock.source_revisions, "context source revisions");
      if (currentSources[repositoryName] !== baseSources[repositoryName]) errors.push("context target source revision differs from the base-owned context lock");
    } catch (error) {
      errors.push(`base context lock is unreadable: ${error.message}`);
    }
  } else {
    if (target.revision !== baseSha) errors.push("bootstrap context lock target revision must equal the exact PR base SHA");
  }
  const context = await verifyContextLock(lock, root, /* @__PURE__ */ new Date(), root);
  if (!context.ok) errors.push(...context.errors.map((item) => `context: ${item}`));
  const trustedHarnessHash = await hashFile(options.trustedHarnessPath);
  if (asObject4(lock.harness, "context lock harness").sha256 !== trustedHarnessHash) errors.push("target harness checksum does not match the pinned trusted action harness");
  errors.push(...await verifyTrustedBaseline({ trustedSourceRoot: options.trustedSourceRoot, repositoryRoot: root, repository: repositoryName, sourceRevision: options.actionRef, targetRevision: anchoredTargetRevision, lock }));
  const nameStatuses = parseNameStatus(git3(root, ["diff", "--name-status", "-z", "--find-renames", baseSha, headSha, "--"]));
  for (const entry of nameStatuses) {
    for (const filePath of [entry.previousPath, entry.path].filter((item) => Boolean(item))) {
      if (/[\\\r\n]/.test(filePath)) errors.push(`non-portable changed path is forbidden: ${JSON.stringify(filePath)}`);
    }
  }
  const trustedManagedPaths = new Set((lock.generated_files ?? []).map((item) => String(item.path)));
  trustedManagedPaths.add(String(asObject4(lock.harness, "context lock harness").path));
  const repoOwnedControlPlanePaths = /* @__PURE__ */ new Set();
  for (const entry of nameStatuses) {
    const deletingLegacyRootInstruction = entry.status === "D" && ["CLAUDE.md", "GEMINI.md"].includes(entry.path);
    if (deletingLegacyRootInstruction) repoOwnedControlPlanePaths.add(entry.path);
    const changedPaths = [entry.previousPath, entry.path].filter((item) => Boolean(item));
    for (const filePath of changedPaths) {
      if (repositoryControlPlanePrefixes.some((prefix) => filePath.startsWith(prefix)) && !trustedManagedPaths.has(filePath)) {
        repoOwnedControlPlanePaths.add(filePath);
      }
      if (filePath.startsWith("docs/ai/generated/") && !trustedManagedPaths.has(filePath)) errors.push(`${filePath}: extra generated context file is not part of the pinned trusted baseline`);
      if (isAgentInstructionPath(filePath) && !(deletingLegacyRootInstruction && filePath === entry.path)) errors.push(`${filePath}: unapproved agent instruction file is forbidden`);
    }
  }
  errors.push(...scanCommittedBlobs(root, headSha, nameStatuses));
  let selected;
  try {
    selected = changedContract(nameStatuses);
  } catch (error) {
    errors.push(error.message);
  }
  for (const entry of nameStatuses) {
    const extraMousely = entry.status !== "D" && entry.path.startsWith(".mousely/") && entry.path !== selected?.path && !(preparingSuccessor && entry.path === successorPath) && !trustedManagedPaths.has(entry.path);
    if (extraMousely) errors.push(`${entry.path}: extra Mousely control/runtime file is forbidden`);
  }
  const changed = gitChangedFilesBetween(root, baseSha, headSha);
  const rootAgentsChanged = changed.some((file) => file.path === "AGENTS.md");
  const governedControlPlanePaths = [...repoOwnedControlPlanePaths, ...rootAgentsChanged ? ["AGENTS.md"] : []].sort();
  const controlPlaneGateError = governedControlPlanePaths.length > 0 ? `repository-owned control-plane changes require engineering, DX, security/privacy, and outside/adversarial review plus the exact \`${repositoryOwnerControlPlaneGate}\` human gate: ${governedControlPlanePaths.join(", ")}` : void 0;
  if (controlPlaneGateError) errors.push(controlPlaneGateError);
  const nonDeletedPaths = new Set(nameStatuses.filter((entry) => entry.status !== "D").map((entry) => entry.path));
  const runtimePaths = changed.filter((file) => nonDeletedPaths.has(file.path) && /^\.mousely\/(?:task-contract\.json|preflight-receipt\.json|capabilities\.json|runs\/|leases\/|dry-run\/|wrangler-dry-run(?:\/|\.|$))/.test(file.path));
  if (runtimePaths.length > 0) errors.push(`runtime-only Mousely state is committed: ${runtimePaths.map((file) => file.path).join(", ")}`);
  let contract;
  if (selected) {
    try {
      contract = readRegularContractBlob(root, headSha, selected.path);
      const validation = validateContract(contract, "TaskContract.v1");
      if (!validation.valid) errors.push(...validation.errors.map((item) => `${selected.path}: ${item}`));
      if (contract.id !== selected.issue || contract.linear_issue !== selected.issue) errors.push("task contract id and linear_issue must exactly match its canonical filename");
      if (contract.source_revision !== options.actionRef) errors.push("task contract source_revision must match the pinned trusted action revision");
      if (contract.organization !== owner || contract.repo !== repoName) errors.push("task contract organization/repo does not match the PR repository");
      if (contract.base_branch !== baseBranch) errors.push("task contract base_branch does not match the PR base branch");
      if (!Number.isFinite(new Date(String(contract.ttl)).getTime()) || new Date(String(contract.ttl)) <= /* @__PURE__ */ new Date()) errors.push("task contract TTL is expired or invalid");
      errors.push(...matchingIssue(event, contract, selected.issue));
      const requestAuthority = verifyGithubRequestAuthority(event, contract);
      if (!requestAuthority.verified) errors.push(...requestAuthority.errors.map((item) => `request authority: ${item}`));
      const explicitApprovalErrors = [currentIntentApprovalMessage, ...requiresExplicitRequestApproval(contract, governedControlPlanePaths.length > 0) ? [explicitRequestApprovalMessage] : []];
      if (controlPlaneGateError) {
        const lanes = new Set(Array.isArray(contract.initial_review_lanes) ? contract.initial_review_lanes.map(String) : []);
        const gates = Array.isArray(contract.human_gates) ? contract.human_gates.map(String) : [];
        if (requiredControlPlaneReviewLanes.every((lane) => lanes.has(lane)) && gates.includes(repositoryOwnerControlPlaneGate)) {
          const index = errors.indexOf(controlPlaneGateError);
          if (index >= 0) errors.splice(index, 1);
        }
      }
      if (scanSecrets(contract).length > 0) errors.push("task contract contains potential secret material");
      const scope = guardScope(changed.filter((file) => file.path !== selected.path), contract);
      if (!scope.ok) errors.push(...scope.violations.map((item) => `scope: ${item}`));
      if (preparingSuccessor && headSuccessor) {
        const preparation = verifySuccessorPreparation({
          file: headSuccessor,
          repositoryRoot: root,
          repository: repositoryName,
          organization: owner,
          repoName,
          baseBranch,
          baseSha,
          actionRef: options.actionRef,
          entries: nameStatuses,
          contractPath: selected.path,
          contract
        });
        errors.push(...preparation.errors);
        if (errors.length === 0) {
          return {
            ok: false,
            status: "successor-prepared-needs-human",
            repository: repositoryName,
            base_sha: baseSha,
            head_sha: headSha,
            trusted_action_revision: options.actionRef,
            successor_revision: preparation.intent?.toRevision,
            contract_path: selected.path,
            linear_issue: selected.issue,
            changed_files: changed.length,
            warnings: scope.warnings,
            human_gates: contract.human_gates,
            human_scope_approval_required: true,
            request_identity_correlated: true,
            current_intent_approval_required: true,
            errors: explicitApprovalErrors
          };
        }
      }
      if (errors.length === 0) {
        return {
          ok: false,
          status: "scope-consistent-needs-human",
          repository: repositoryName,
          base_sha: baseSha,
          head_sha: headSha,
          trusted_action_revision: options.actionRef,
          contract_path: selected.path,
          linear_issue: selected.issue,
          changed_files: changed.length,
          warnings: scope.warnings,
          human_gates: contract.human_gates,
          human_scope_approval_required: true,
          request_identity_correlated: true,
          current_intent_approval_required: true,
          explicit_request_approval_required: explicitApprovalErrors.length > 0,
          errors: explicitApprovalErrors
        };
      }
    } catch (error) {
      errors.push(`task contract: ${error.message}`);
    }
  }
  const uniqueErrors = [...new Set(errors)];
  return {
    ok: false,
    status: uniqueErrors.some((error) => error.startsWith("request authority:")) ? "request-authority-needs-human" : "pr-guard-failed",
    errors: uniqueErrors
  };
}

// src/reviews.ts
var laneOrder = [
  "engineering",
  "product-premise",
  "design",
  "dx",
  "security-privacy",
  "release",
  "outside-adversarial"
];
function requiredReviewLanes2(initial, diff) {
  const lanes = new Set(initial);
  const classes = new Set(diff.change_classes);
  const allText = diff.files.map((file) => `${file.path}
${file.patch ?? ""}`).join("\n").toLowerCase();
  if ([...classes].some((item) => item !== "documentation")) lanes.add("engineering");
  if (classes.has("configuration-ci") || classes.has("tests")) lanes.add("engineering");
  if (classes.has("ui-ux")) {
    lanes.add("design");
    lanes.add("product-premise");
  }
  if (/user[- ]facing|user behavior|new behavior|onboarding|sign[- ]?up|checkout|notification|navigation|feature flag|entitlement|subscription|account flow/.test(allText)) lanes.add("product-premise");
  if (classes.has("api-cli-sdk") || /agents\.md|\.agents\/skills|setup|onboarding|public docs/.test(allText)) lanes.add("dx");
  if (classes.has("authentication-privacy") || classes.has("migration-data") || classes.has("protocol-networking") || /package-lock\.json|dependencies|storage|database|sqlite|keychain|filesystem|device|bluetooth|camera|microphone|external[- ]input|webhook|upload|parser|deserialize/.test(allText)) lanes.add("security-privacy");
  if (classes.has("release-publishing") || /packag(?:e|ing)|updater|release branch|protected tag|\btag\b|rollout|publishing|signing|notari[sz]/.test(allText)) lanes.add("release");
  if (diff.non_generated_changed_lines > 200 || classes.has("migration-data") || classes.has("release-publishing") || classes.has("authentication-privacy") || /(^|\/)(src\/|docs\/)?(security|harness|policy)|\.mousely\/harness/.test(allText)) lanes.add("outside-adversarial");
  return laneOrder.filter((lane) => lanes.has(lane));
}
function reviewerMeetsLanePolicy(lane, review) {
  const reviewer = review.reviewer;
  const writer = review.writer;
  return review.authority_verified === true && identitiesIndependent(reviewer, writer) && reviewRoleAllowed(lane, reviewer);
}
function reviewStatus(required, reviews, finalCommit) {
  const missing = [];
  const stale = [];
  const needsHuman = [];
  for (const lane of required) {
    const candidates = reviews.filter((review) => review.lane === lane);
    if (candidates.length === 0) {
      missing.push(lane);
      continue;
    }
    const current = candidates.find((review) => review.commit_sha === finalCommit);
    if (!current) {
      stale.push(lane);
      continue;
    }
    if (!reviewerMeetsLanePolicy(lane, current)) needsHuman.push(lane);
    else if (current.verdict === "needs-human" || current.verdict === "changes-requested") needsHuman.push(lane);
    else if (current.verdict !== "approved") missing.push(lane);
  }
  const readiness = needsHuman.length > 0 ? "needs-human" : stale.length > 0 ? "stale-review" : missing.length > 0 ? "missing-review" : "ready";
  return {
    readiness,
    required_lanes: required,
    missing_lanes: missing,
    stale_lanes: stale,
    needs_human_lanes: needsHuman
  };
}

// src/cli.ts
var VERSION = "0.1.0";
var COMMANDS = [
  "doctor",
  "validate-contract",
  "preflight",
  "verify-context",
  "guard-diff",
  "run-evals",
  "docs-impact",
  "review-status",
  "verify-proof",
  "write-receipt",
  "cleanup",
  "scan-secrets",
  "verify-pr",
  "lease-acquire",
  "lease-heartbeat",
  "lease-release",
  "lease-recover"
];
function usage() {
  return `Mousely Agent OS harness ${VERSION}

Usage: harness.mjs <command> [options]

Commands:
${COMMANDS.map((command) => `  ${command}`).join("\n")}

All commands emit a single JSON result and fail closed with a non-zero exit code.`;
}
function asObject5(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}
function optionInteger(args, name, fallback) {
  const raw = optionString(args, name);
  if (raw === void 0 && fallback !== void 0) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value)) throw new Error(`--${name} must be an integer`);
  return value;
}
async function exactRuntimePath(repo, supplied, expectedRelative) {
  const resolvedRepo = await realpath9(repo);
  const expected = path10.join(resolvedRepo, ...expectedRelative.split("/"));
  const suppliedAbsolute = path10.isAbsolute(supplied) ? path10.resolve(supplied) : path10.resolve(resolvedRepo, supplied);
  if (suppliedAbsolute !== expected) throw new Error(`${expectedRelative} must use its fixed worktree-local path`);
  await resolvePotentialInside(resolvedRepo, expectedRelative);
  return suppliedAbsolute;
}
async function exactExternalRuntimeFile(supplied, expected, label) {
  const suppliedAbsolute = path10.resolve(supplied);
  if (suppliedAbsolute !== expected) throw new Error(`${label} must use its fixed external broker path`);
  const metadata = await lstat7(suppliedAbsolute);
  if (!metadata.isFile() || metadata.isSymbolicLink()) throw new Error(`${label} must be a regular non-symlink file`);
  if (await realpath9(suppliedAbsolute) !== expected) throw new Error(`${label} must resolve to its fixed external broker path`);
  return expected;
}
async function stableRuntimeObject(file, label) {
  const before = await hashFile(file);
  const value = asObject5(await readData(file), label);
  const after = await hashFile(file);
  if (before !== after) throw new Error(`${label} changed while preflight was reading it`);
  return { value, fileHash: after };
}
function canonicalBaseRevision(repository, branch) {
  if (typeof branch !== "string" || !branch || branch.startsWith("-") || branch.includes("..") || /[~^:?*[\\\s]/.test(branch)) {
    throw new Error("mutating preflight requires a canonical base branch name");
  }
  const candidates = [`refs/remotes/origin/${branch}`, `refs/heads/${branch}`];
  for (const reference of candidates) {
    try {
      return execFileSync4("git", ["rev-parse", "--verify", `${reference}^{commit}`], { cwd: repository, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
    }
  }
  throw new Error(`canonical base branch is unavailable: ${branch}`);
}
function repositoryCleanErrors(repo) {
  const errors = [];
  try {
    const topLevel = execFileSync4("git", ["rev-parse", "--show-toplevel"], { cwd: repo, encoding: "utf8" }).trim();
    if (realpathSync2(topLevel) !== realpathSync2(repo)) errors.push("supplied repository must be the exact Git worktree root");
    const dirty = execFileSync4("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], { cwd: repo, encoding: "buffer", maxBuffer: 8 * 1024 * 1024 });
    if (dirty.length > 0) errors.push("repository index and worktree must be clean before preflight, review, or proof readiness");
  } catch (error) {
    errors.push(`cannot verify clean repository state: ${error.message}`);
  }
  return errors;
}
async function canonicalRepositoryBindingErrors(options) {
  const errors = [];
  const { repo, currentCommit, contractPath, contract, contextPath, contextLock, manifestPath, manifest } = options;
  const contractValidation = validateContract(contract, "TaskContract.v1");
  const contextValidation = validateContract(contextLock, "ContextLock.v1");
  const manifestValidation = validateContract(manifest, "RepoManifest.v1");
  if (!contractValidation.valid) errors.push(...contractValidation.errors.map((error) => `task contract: ${error}`));
  if (!contextValidation.valid) errors.push(...contextValidation.errors.map((error) => `context lock: ${error}`));
  if (!manifestValidation.valid) errors.push(...manifestValidation.errors.map((error) => `repository manifest: ${error}`));
  const issue = String(contract.linear_issue ?? "");
  const expectedRepository = `${String(manifest.organization)}/${String(manifest.name)}`;
  const target = contextLock.target_repository;
  if (!/^MLY-[1-9][0-9]*$/.test(issue)) errors.push("task contract linear_issue must be a canonical MLY identifier");
  if (contract.organization !== manifest.organization || contract.repo !== manifest.name) errors.push("task contract organization/repo does not match the repository manifest");
  if (target?.repository !== expectedRepository) errors.push("context lock target repository does not match the repository manifest");
  if (contract.source_revision !== manifest.source_revision || contract.source_revision !== contextLock.source_revision) errors.push("task contract, repository manifest, and context lock must share one source_revision");
  errors.push(...await canonicalTrackedInputErrors(repo, contractPath, `.mousely/contracts/${issue}.json`, "task contract"));
  errors.push(...await canonicalTrackedInputErrors(repo, contextPath, "mousely-context.lock", "context lock"));
  errors.push(...await canonicalTrackedInputErrors(repo, manifestPath, "mousely.repo.yaml", "repository manifest"));
  const contextResult = await verifyContextLock(contextLock, repo, /* @__PURE__ */ new Date(), repo);
  if (!contextResult.ok) errors.push(...contextResult.errors.map((error) => `context: ${error}`));
  try {
    if (!/^[a-f0-9]{40}$/.test(currentCommit)) throw new Error("repository HEAD is not an exact commit SHA");
    const targetRevision = String(target?.revision ?? "");
    execFileSync4("git", ["cat-file", "-e", `${targetRevision}^{commit}`], { cwd: repo, stdio: "ignore" });
    execFileSync4("git", ["merge-base", "--is-ancestor", targetRevision, currentCommit], { cwd: repo, stdio: "ignore" });
  } catch (error) {
    errors.push(`canonical repository provenance is invalid: ${error.message}`);
  }
  return errors;
}
function bootstrapCommitErrors(repo, contractPath, contract, taskStartSha) {
  const errors = [];
  const baseBranchSha = String(contract.base_branch_sha ?? "");
  const expectedRelative = `.mousely/contracts/${String(contract.linear_issue)}.json`;
  try {
    const parent = execFileSync4("git", ["rev-parse", `${taskStartSha}^`], { cwd: repo, encoding: "utf8" }).trim();
    if (parent !== baseBranchSha) errors.push("task bootstrap commit must have the exact base_branch_sha as its single parent");
    const parents = execFileSync4("git", ["rev-list", "--parents", "-n", "1", taskStartSha], { cwd: repo, encoding: "utf8" }).trim().split(/\s+/);
    if (parents.length !== 2) errors.push("task bootstrap must be one non-merge commit");
    const entries = execFileSync4("git", ["diff-tree", "--no-commit-id", "--name-status", "-r", "--no-renames", baseBranchSha, taskStartSha, "--"], { cwd: repo, encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
    if (entries.length !== 1 || entries[0] !== `A	${expectedRelative}`) errors.push("task bootstrap diff must add exactly the canonical issue contract and nothing else");
    const mode = execFileSync4("git", ["ls-tree", taskStartSha, "--", expectedRelative], { cwd: repo, encoding: "utf8" }).trim().split(/\s+/)[0];
    if (mode !== "100644") errors.push("task bootstrap contract must be a regular non-executable 100644 blob");
    const blob = execFileSync4("git", ["show", `${taskStartSha}:${expectedRelative}`], { cwd: repo, encoding: "buffer", maxBuffer: 1024 * 1024 });
    if (sha256(blob) !== sha256(`${JSON.stringify(contract, null, 2)}
`)) errors.push("task bootstrap contract bytes do not match the broker-bound canonical contract");
    if (sha256(awaitFileBuffer(contractPath)) !== sha256(blob)) errors.push("working-tree contract bytes do not match the broker-observed task start commit");
  } catch (error) {
    errors.push(`cannot verify exact task bootstrap commit: ${error.message}`);
  }
  return errors;
}
function awaitFileBuffer(file) {
  return readFileSync4(file);
}
async function historicalPreflightBindingErrors(options) {
  const errors = [];
  const { repo, receiptPath, runReceiptPath, contractPath, contract, contextPath, contextLock, manifestPath, manifest, proof, currentCommit, expectedBaseCommit } = options;
  let runtime;
  try {
    runtime = await resolveRuntimePaths(repo);
  } catch (error) {
    return [`external trusted runtime is unavailable for historical proof: ${error.message}`];
  }
  if (!receiptPath) return ["trusted task-base binding requires --preflight-receipt from the immutable external broker receipt directory"];
  if (!runReceiptPath) return ["trusted task-base binding requires --run-receipt containing consumption evidence"];
  try {
    const metadata = await lstat7(receiptPath);
    const receiptReal = await realpath9(receiptPath);
    const receiptDirectory = await realpath9(path10.dirname(receiptPath));
    if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size > 1024 * 1024 || receiptDirectory !== runtime.preflightReceipts || path10.dirname(receiptPath) !== runtime.preflightReceipts || !/^preflight-[A-Za-z0-9-]+\.json$/.test(path10.basename(receiptReal))) {
      errors.push("preflight receipt must be a bounded immutable file in the external broker receipt directory");
    }
  } catch (error) {
    errors.push(`preflight receipt is unavailable at its immutable external broker path: ${error.message}`);
  }
  let receipt;
  try {
    receipt = asObject5(await readData(receiptPath), "preflight receipt");
  } catch (error) {
    return [...errors, `preflight receipt is unreadable: ${error.message}`];
  }
  const binding = receipt.binding;
  const validation = validateContract(receipt, "PreflightReceipt.v1");
  if (!validation.valid || !binding) errors.push(...validation.errors.map((error) => `preflight receipt: ${error}`));
  if (binding) errors.push(...verifyBrokerPreflightReceipt(receipt, binding));
  if (!binding) return errors;
  if (binding.contract_hash !== hashValue(contract)) errors.push("preflight receipt contract hash does not match the canonical task contract");
  try {
    if (binding.canonical_contract_path !== `.mousely/contracts/${String(contract.linear_issue)}.json` || binding.canonical_contract_file_hash !== await hashFile(contractPath)) errors.push("preflight receipt canonical task-contract file hash does not match proof input");
    if (binding.context_hash !== await hashFile(contextPath)) errors.push("preflight receipt context file hash does not match the canonical context lock");
    if (binding.manifest_hash !== await hashFile(manifestPath)) errors.push("preflight receipt manifest file hash does not match the canonical repository manifest");
  } catch (error) {
    errors.push(`cannot hash canonical proof inputs: ${error.message}`);
  }
  try {
    if (binding.repo !== await realpath9(repo)) errors.push("preflight receipt repository binding does not match the exact worktree root");
    if (binding.runtime_root !== runtime.root || binding.lease_store_path !== runtime.leaseStore || binding.contract_path !== runtime.taskContract || binding.capability_snapshot_path !== runtime.capabilitySnapshot || binding.harness_path !== runtime.trustedHarness) {
      errors.push("preflight receipt does not bind the exact external runtime, capability, task-contract, lease-store, and harness paths");
    }
  } catch (error) {
    errors.push(`preflight repository binding is unavailable: ${error.message}`);
  }
  const baseSha = String(binding.base_branch_sha ?? "");
  const taskStartSha = String(binding.task_start_sha ?? "");
  if (!/^[a-f0-9]{40}$/.test(baseSha)) errors.push("preflight receipt base_branch_sha must be an exact commit SHA");
  if (!/^[a-f0-9]{40}$/.test(taskStartSha)) errors.push("preflight receipt task_start_sha must be an exact commit SHA");
  if (baseSha !== expectedBaseCommit) errors.push("proof base_commit does not match the authenticated preflight task base");
  const verifiedAt = new Date(String(binding.verified_at ?? ""));
  const expiresAt = new Date(String(binding.expires_at ?? ""));
  if (!Number.isFinite(verifiedAt.getTime()) || !Number.isFinite(expiresAt.getTime()) || expiresAt <= verifiedAt || expiresAt.getTime() - verifiedAt.getTime() > 5 * 6e4) {
    errors.push("preflight receipt must contain a valid historical verification window no longer than five minutes");
  }
  const proofEvidence = proof.preflight_evidence;
  let preflightFileHash = "";
  try {
    preflightFileHash = await hashFile(receiptPath);
  } catch (error) {
    errors.push(`cannot hash preflight receipt: ${error.message}`);
  }
  if (!proofEvidence || proofEvidence.receipt_id !== receipt.id || proofEvidence.receipt_sha256 !== preflightFileHash) errors.push("proof does not bind the exact preflight receipt ID and file hash");
  try {
    const metadata = await lstat7(runReceiptPath);
    const runDirectory = await realpath9(path10.dirname(runReceiptPath));
    if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size > 1024 * 1024 || runDirectory !== runtime.runReceipts || path10.dirname(runReceiptPath) !== runtime.runReceipts) throw new Error("run receipt must be a bounded regular non-symlink file in the external run-receipt directory");
    const runReceipt = asObject5(await readData(runReceiptPath), "run receipt");
    const runValidation = validateContract(runReceipt, "RunReceipt.v1");
    if (!runValidation.valid) errors.push(...runValidation.errors.map((error) => `run receipt: ${error}`));
    const runHash = await hashFile(runReceiptPath);
    if (proofEvidence?.run_receipt_id !== runReceipt.id || proofEvidence?.run_receipt_sha256 !== runHash) errors.push("proof does not bind the exact consumed run receipt ID and file hash");
    if (runReceipt.preflight_receipt_id !== receipt.id || runReceipt.preflight_receipt_sha256 !== preflightFileHash) errors.push("run receipt does not consume the exact preflight receipt");
    const consumedAt = new Date(String(runReceipt.preflight_consumed_at ?? ""));
    if (!Number.isFinite(consumedAt.getTime()) || consumedAt < verifiedAt || consumedAt > expiresAt) errors.push("run receipt preflight consumption time is outside the signed preflight window");
    if (runReceipt.contract_hash !== hashValue(contract) || runReceipt.context_hash !== hashValue(contextLock)) errors.push("run receipt contract/context hashes do not match proof inputs");
    if (runReceipt.provider !== binding.provider || runReceipt.host !== binding.host || runReceipt.worktree !== binding.worktree) errors.push("run receipt provider, host, or worktree does not match preflight");
  } catch (error) {
    errors.push(`run receipt is unavailable or invalid: ${error.message}`);
  }
  try {
    execFileSync4("git", ["cat-file", "-e", `${baseSha}^{commit}`], { cwd: repo, stdio: "ignore" });
    execFileSync4("git", ["merge-base", "--is-ancestor", baseSha, currentCommit], { cwd: repo, stdio: "ignore" });
    execFileSync4("git", ["merge-base", "--is-ancestor", taskStartSha, currentCommit], { cwd: repo, stdio: "ignore" });
    errors.push(...bootstrapCommitErrors(repo, contractPath, contract, taskStartSha));
  } catch (error) {
    errors.push(`preflight task base is unavailable or not an ancestor of current HEAD: ${error.message}`);
  }
  return errors;
}
async function canonicalTrackedInputErrors(repo, suppliedPath, expectedRelativePath, label) {
  const errors = [];
  try {
    const expected = path10.join(repo, expectedRelativePath);
    const suppliedMetadata = await lstat7(suppliedPath);
    if (!suppliedMetadata.isFile() || suppliedMetadata.isSymbolicLink()) errors.push(`${label} must be a regular non-symlink file`);
    const [suppliedReal, expectedReal] = await Promise.all([realpath9(suppliedPath), realpath9(expected)]);
    if (suppliedReal !== expectedReal) errors.push(`${label} must be the canonical repository file ${expectedRelativePath}`);
    execFileSync4("git", ["ls-files", "--error-unmatch", "--", expectedRelativePath], { cwd: repo, stdio: "ignore" });
  } catch (error) {
    errors.push(`${label} is not a tracked canonical repository input at ${expectedRelativePath}: ${error.message}`);
  }
  return errors;
}
async function changedFiles(args) {
  const changedFilePath = optionString(args, "changed-files");
  if (changedFilePath) return normalizeChangedFiles(await readData(changedFilePath));
  const diffFilePath = optionString(args, "diff-file");
  if (diffFilePath) return parseUnifiedDiff(await readText(diffFilePath));
  return gitChangedFiles(optionString(args, "repo") ?? process.cwd(), optionString(args, "base") ?? "HEAD");
}
async function doctor() {
  const errors = [];
  const warnings = [];
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  if (nodeMajor !== 22) errors.push(`Node 22 is required; found ${process.versions.node}`);
  const selfPath = fileURLToPath(import.meta.url);
  let harnessChecksum = null;
  try {
    harnessChecksum = await hashFile(selfPath);
  } catch (error) {
    errors.push(`cannot checksum harness: ${error.message}`);
  }
  if (schemaVersions.length !== 15) errors.push(`expected 15 embedded contract schemas, found ${schemaVersions.length}`);
  return {
    ok: errors.length === 0,
    command: "doctor",
    status: errors.length === 0 ? "healthy" : "preflight-failed",
    harness_version: VERSION,
    harness_checksum: harnessChecksum,
    node: process.versions.node,
    required_node_major: 22,
    schemas: schemaVersions,
    errors,
    warnings
  };
}
async function validateContractCommand(args) {
  const file = optionString(args, "file") ?? args.positional[0];
  if (!file) throw new Error("validate-contract requires a file path");
  const value = await readData(file);
  const result = validateContract(value, optionString(args, "type"));
  return {
    ok: result.valid,
    command: "validate-contract",
    status: result.valid ? "valid" : "invalid",
    file: path10.resolve(file),
    schema_version: result.schemaVersion,
    errors: result.errors
  };
}
async function scanSecretsCommand(args) {
  const findings = [];
  for (const file of await changedFiles(args)) {
    for (const finding of scanSecrets(file.patch ?? "")) findings.push({ file: file.path, path: finding.path, rule: finding.rule });
  }
  return { ok: findings.length === 0, command: "scan-secrets", status: findings.length === 0 ? "clear" : "blocked", findings, errors: findings.length ? ["changed content contains potential secret material"] : [] };
}
async function preflightCommand(args) {
  const contractPath = requireOption(args, "contract");
  const manifestPath = requireOption(args, "manifest");
  const contextPath = requireOption(args, "context-lock");
  const contract = asObject5(await readData(contractPath), "contract");
  const manifest = asObject5(await readData(manifestPath), "manifest");
  const contextLock = asObject5(await readData(contextPath), "context lock");
  const repo = path10.resolve(requireOption(args, "repo"));
  let resolvedRepo = repo;
  try {
    resolvedRepo = await realpath9(repo);
  } catch (error) {
    return { ok: false, command: "preflight", status: "not_dispatched", errors: [`cannot resolve supplied repository: ${error.message}`] };
  }
  let baseCommit = "";
  try {
    baseCommit = execFileSync4("git", ["rev-parse", "HEAD"], { cwd: resolvedRepo, encoding: "utf8" }).trim();
  } catch (error) {
    return { ok: false, command: "preflight", status: "not_dispatched", errors: [`cannot bind request authority to repository HEAD: ${error.message}`] };
  }
  const repositoryErrors = [
    ...repositoryCleanErrors(resolvedRepo),
    ...await canonicalRepositoryBindingErrors({ repo: resolvedRepo, currentCommit: baseCommit, contractPath, contract, contextPath, contextLock, manifestPath, manifest }),
    ...bootstrapCommitErrors(resolvedRepo, contractPath, contract, baseCommit)
  ];
  if (repositoryErrors.length > 0) return { ok: false, command: "preflight", status: "not_dispatched", errors: [...new Set(repositoryErrors)] };
  const requestReceiptPath = optionString(args, "request-receipt");
  if (!requestReceiptPath) return { ok: false, command: "preflight", status: "not_dispatched", errors: ["local preflight requires --request-receipt from a trusted request authority"] };
  const capabilityPath = requireOption(args, "capabilities");
  let fixedCapabilityPath;
  let runtimePaths;
  let repositoryHarnessPath;
  try {
    runtimePaths = await resolveRuntimePaths(resolvedRepo);
    fixedCapabilityPath = await exactExternalRuntimeFile(capabilityPath, runtimePaths.capabilitySnapshot, "capability snapshot");
    repositoryHarnessPath = await exactRuntimePath(resolvedRepo, optionString(args, "repository-harness") ?? ".mousely/harness.mjs", ".mousely/harness.mjs");
  } catch (error) {
    return { ok: false, command: "preflight", status: "not_dispatched", errors: [error.message] };
  }
  const canonicalContract = await stableRuntimeObject(contractPath, "canonical task contract");
  const canonicalManifest = await stableRuntimeObject(manifestPath, "repository manifest");
  const canonicalContext = await stableRuntimeObject(contextPath, "context lock");
  const canonicalCapabilities = await stableRuntimeObject(fixedCapabilityPath, "capability snapshot");
  const requestReceiptObject = await stableRuntimeObject(requestReceiptPath, "request authority receipt");
  const capabilities = canonicalCapabilities.value;
  const requestReceipt = requestReceiptObject.value;
  const requestBaseCommit = String(contextLock.target_repository?.revision ?? "");
  const requestAuthority = verifyLocalRequestAuthority({ contract, contextLock, manifest, baseCommit: requestBaseCommit, receipt: requestReceipt, signingKey: process.env.MOUSELY_AUTHORITY_SIGNING_KEY });
  if (!requestAuthority.verified) return { ok: false, command: "preflight", status: "not_dispatched", errors: requestAuthority.errors };
  const result = await preflight(contract, manifest, capabilities, { repository: resolvedRepo, baseSha: baseCommit, requireNode22: true });
  if (!result.ok) return { command: "preflight", ...result };
  let declaredBaseSha;
  try {
    declaredBaseSha = canonicalBaseRevision(resolvedRepo, contract.base_branch);
  } catch (error) {
    return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, error.message] };
  }
  if (declaredBaseSha !== contract.base_branch_sha) return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, "canonical base branch does not match the broker-bound task contract"] };
  const leaseId = requireOption(args, "lease-id");
  const store = await loadLeaseStore(runtimePaths.leaseStore);
  const writerLease = store.leases.find((lease) => lease.id === leaseId);
  if (!writerLease) return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, "writer lease is missing"] };
  if (typeof contract.linear_issue !== "string") return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, "writer lease requires an exact Linear issue"] };
  const leaseCheck = await validateActiveWriterLease({
    storePath: runtimePaths.leaseStore,
    id: leaseId,
    identityHash: leaseIdentityHash(writerLease),
    owner: String(writerLease.owner),
    writer: String(writerLease.writer),
    linearIssue: contract.linear_issue,
    idempotencyKey: String(contract.idempotency_key),
    worktree: resolvedRepo,
    repository: resolvedRepo,
    hostFingerprint: runtimeHostFingerprint(),
    contractHash: hashValue(contract),
    writerAgentId: String(writerLease.writer_agent_id),
    writerSessionId: String(writerLease.writer_session_id)
  });
  if (leaseCheck.errors.length > 0) return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, ...leaseCheck.errors] };
  const runtimeContractPath = runtimePaths.taskContract;
  const runtimeContractFileHash = sha256(`${JSON.stringify(contract, null, 2)}
`);
  const verifiedAt = /* @__PURE__ */ new Date();
  const capabilityExpiry = new Date(String(capabilities.expires_at));
  const contractExpiry = new Date(String(contract.ttl));
  const authorityExpiry = new Date(String(requestReceipt.expires_at));
  const expiresAt = new Date(Math.min(verifiedAt.getTime() + 5 * 6e4, capabilityExpiry.getTime(), contractExpiry.getTime(), authorityExpiry.getTime()));
  if (!(expiresAt > verifiedAt)) return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, "preflight authority, capability, or contract validity expires before mutation can begin"] };
  const target = contract.target;
  const requestPayload = requestAuthority.verified.payload;
  const requestReference = contract.request_receipt;
  const binding = {
    contract_path: runtimeContractPath,
    contract_hash: hashValue(contract),
    contract_file_hash: runtimeContractFileHash,
    canonical_contract_path: path10.relative(resolvedRepo, contractPath).replaceAll("\\", "/"),
    canonical_contract_file_hash: canonicalContract.fileHash,
    manifest_path: path10.relative(resolvedRepo, manifestPath).replaceAll("\\", "/"),
    manifest_hash: canonicalManifest.fileHash,
    context_lock_path: path10.relative(resolvedRepo, contextPath).replaceAll("\\", "/"),
    context_hash: canonicalContext.fileHash,
    harness_path: runtimePaths.trustedHarness,
    harness_hash: await hashFile(runtimePaths.trustedHarness),
    repository_harness_path: ".mousely/harness.mjs",
    repository_harness_hash: await hashFile(repositoryHarnessPath),
    capability_verifier_registry_hash: result.capability_verifier_registry_hash,
    capability_hash: canonicalCapabilities.fileHash,
    capability_snapshot_id: String(capabilities.id),
    capability_snapshot_path: runtimePaths.capabilitySnapshot,
    capability_expires_at: String(capabilities.expires_at),
    base_branch_sha: String(contract.base_branch_sha),
    task_start_sha: baseCommit,
    base_branch: contract.base_branch,
    repo: resolvedRepo,
    provider: target.provider,
    host: target.host,
    host_fingerprint: runtimeHostFingerprint(),
    required_capabilities: Array.isArray(contract.capabilities) ? contract.capabilities.map(String) : [],
    required_commands: Array.isArray(manifest.required_commands) ? manifest.required_commands.map(String) : [],
    command_resolutions: result.command_resolutions,
    runtime_root: runtimePaths.root,
    lease_store_path: runtimePaths.leaseStore,
    lease_store_instance_id: store.instance_id,
    lease_id: leaseId,
    lease_identity_hash: leaseIdentityHash(writerLease),
    lease_owner: String(writerLease.owner),
    lease_pid: writerLease.pid,
    lease_process_identity: writerLease.process_identity,
    idempotency_key: String(contract.idempotency_key),
    writer: String(writerLease.writer),
    writer_agent_id: String(writerLease.writer_agent_id),
    writer_session_id: String(writerLease.writer_session_id),
    one_writer: true,
    worktree: resolvedRepo,
    request_receipt_id: String(requestReference.id),
    request_receipt_hash: String(requestReference.sha256),
    request_nonce: String(requestPayload.nonce),
    request_receipt_created_at: String(requestReceipt.created_at),
    request_receipt_expires_at: String(requestReceipt.expires_at),
    contract_expires_at: String(contract.ttl),
    verified_at: verifiedAt.toISOString(),
    expires_at: expiresAt.toISOString()
  };
  let receipt;
  try {
    receipt = issueBrokerPreflightReceipt({ binding, sourceRevision: String(contract.source_revision) });
  } catch (error) {
    return { command: "preflight", ...result, ok: false, status: "not_dispatched", errors: [...result.errors, error.message] };
  }
  const immutableReceiptPath = path10.join(runtimePaths.preflightReceipts, `${String(receipt.id)}.json`);
  await writeJsonAtomic(runtimeContractPath, contract);
  await writeJsonAtomic(immutableReceiptPath, receipt);
  await writeJsonAtomic(runtimePaths.preflightReceipt, receipt);
  return { command: "preflight", ...result, receipt: runtimePaths.preflightReceipt, immutable_receipt: immutableReceiptPath, receipt_id: receipt.id };
}
async function authorityReceiptsFromArgs(args) {
  const authorityPath = optionString(args, "authority-receipts");
  if (!authorityPath) return { receipts: /* @__PURE__ */ new Map(), errors: ["--authority-receipts is required for authenticated review, remote media, or documentation-debt evidence"] };
  try {
    return { receipts: receiptMap(await readData(authorityPath)), errors: [] };
  } catch (error) {
    return { receipts: /* @__PURE__ */ new Map(), errors: [error.message] };
  }
}
function resolveReviews(rawReviews, finalCommit, receipts, signingKey) {
  const errors = [];
  const reviews = rawReviews.map((review) => {
    if (review.commit_sha !== finalCommit) return review;
    const verification = verifySignedAuthorityReceipt({ reference: review.receipt, receipts, signingKey, receiptType: "review" });
    if (!verification.verified) {
      errors.push(...verification.errors);
      return review;
    }
    const payload = verification.verified.payload;
    if (payload.lane !== review.lane || payload.verdict !== review.verdict || payload.commit_sha !== review.commit_sha) {
      errors.push(`${String(review.receipt?.id ?? "review")}: review receipt does not bind the claimed lane, verdict, and exact commit`);
      return review;
    }
    return { ...review, reviewer: payload.reviewer, writer: payload.writer, authority_verified: true };
  });
  return { reviews, errors };
}
async function verifyContextCommand(args) {
  const lockPath2 = requireOption(args, "lock");
  const lock = asObject5(await readData(lockPath2), "context lock");
  const root = path10.resolve(optionString(args, "root") ?? path10.dirname(lockPath2));
  const repositoryRoot = path10.resolve(optionString(args, "repository-root") ?? root);
  const now = optionString(args, "now");
  const result = await verifyContextLock(lock, root, now ? new Date(now) : /* @__PURE__ */ new Date(), repositoryRoot);
  return { command: "verify-context", ...result };
}
async function guardDiffCommand(args) {
  const contract = asObject5(await readData(requireOption(args, "contract")), "contract");
  const validation = validateContract(contract, "TaskContract.v1");
  if (!validation.valid) {
    return { ok: false, command: "guard-diff", status: "invalid-contract", errors: validation.errors };
  }
  const result = guardScope(await changedFiles(args), contract);
  return { command: "guard-diff", status: result.ok ? "within-scope" : "scope-violation", errors: [], ...result };
}
async function runEvalsCommand(args) {
  const touched = [
    ...optionStrings(args, "touched"),
    ...optionString(args, "touched-file") ? String(await readText(optionString(args, "touched-file"))).split(/\r?\n/).filter(Boolean) : []
  ];
  const result = await runEvalSuite({
    manifestPath: requireOption(args, "manifest"),
    resultsPath: requireOption(args, "results"),
    touched,
    cwd: path10.resolve(optionString(args, "cwd") ?? process.cwd())
  });
  return { ok: result.status === "pass", command: "run-evals", ...result };
}
async function docsImpactCommand(args) {
  const result = classifyDocsImpact(await changedFiles(args));
  return {
    ok: result.status === "complete" || result.status === "not-required",
    command: "docs-impact",
    ...result
  };
}
async function reviewStatusCommand(args) {
  const proof = asObject5(await readData(requireOption(args, "proof")), "proof bundle");
  const proofValidation = validateContract(proof, "ProofBundle.v1");
  if (!proofValidation.valid) {
    return { ok: false, command: "review-status", status: "invalid-proof", errors: proofValidation.errors };
  }
  const contractPath = requireOption(args, "contract");
  const contract = asObject5(await readData(contractPath), "contract");
  const contractValidation = validateContract(contract, "TaskContract.v1");
  if (!contractValidation.valid) return { ok: false, command: "review-status", status: "invalid-contract", errors: contractValidation.errors };
  const contextPath = requireOption(args, "context-lock");
  const manifestPath = requireOption(args, "manifest");
  const contextLock = asObject5(await readData(contextPath), "context lock");
  const manifest = asObject5(await readData(manifestPath), "repository manifest");
  const repo = path10.resolve(requireOption(args, "repo"));
  let resolvedRepo = repo;
  let currentCommit = "";
  const bindingErrors = [];
  try {
    resolvedRepo = await realpath9(repo);
    currentCommit = execFileSync4("git", ["rev-parse", "HEAD"], { cwd: resolvedRepo, encoding: "utf8" }).trim();
  } catch (error) {
    bindingErrors.push(`cannot bind review to the exact repository HEAD: ${error.message}`);
  }
  bindingErrors.push(...repositoryCleanErrors(resolvedRepo));
  bindingErrors.push(...await canonicalRepositoryBindingErrors({ repo: resolvedRepo, currentCommit, contractPath, contract, contextPath, contextLock, manifestPath, manifest }));
  if (proof.contract_hash !== hashValue(contract)) bindingErrors.push("proof contract_hash does not match the canonical task contract");
  if (proof.context_hash !== hashValue(contextLock)) bindingErrors.push("proof context_hash does not match the canonical context lock");
  if (proof.manifest_hash !== hashValue(manifest)) bindingErrors.push("proof manifest_hash does not match the canonical repository manifest");
  if (proof.source_revision !== contract.source_revision || proof.source_revision !== manifest.source_revision || proof.source_revision !== contextLock.source_revision) bindingErrors.push("proof, contract, manifest, and context lock must share one source_revision");
  const targetRevision = String(contextLock.target_repository?.revision ?? "");
  try {
    execFileSync4("git", ["merge-base", "--is-ancestor", targetRevision, String(proof.base_commit)], { cwd: resolvedRepo, stdio: "ignore" });
    execFileSync4("git", ["merge-base", "--is-ancestor", String(proof.base_commit), currentCommit], { cwd: resolvedRepo, stdio: "ignore" });
    const actualDiffHash = sha256(execFileSync4("git", ["diff", "--binary", "--full-index", "--no-ext-diff", "--no-renames", `${String(proof.base_commit)}..${currentCommit}`, "--"], { cwd: resolvedRepo, encoding: "buffer", maxBuffer: 32 * 1024 * 1024 }));
    if (proof.diff_hash !== actualDiffHash) bindingErrors.push("proof diff_hash does not match the authenticated base-to-current diff");
  } catch (error) {
    bindingErrors.push(`review base provenance is invalid: ${error.message}`);
  }
  bindingErrors.push(...await historicalPreflightBindingErrors({
    repo: resolvedRepo,
    receiptPath: optionString(args, "preflight-receipt"),
    runReceiptPath: optionString(args, "run-receipt"),
    contractPath,
    contract,
    contextPath,
    contextLock,
    manifestPath,
    manifest,
    proof,
    currentCommit,
    expectedBaseCommit: String(proof.base_commit)
  }));
  if (bindingErrors.length > 0) return { ok: false, command: "review-status", status: "needs-human", errors: [...new Set(bindingErrors)] };
  if (proof.final_commit !== currentCommit) {
    return { ok: false, command: "review-status", status: "stale-review", errors: ["proof final_commit is not current HEAD"] };
  }
  const initial = Array.isArray(contract.initial_review_lanes) ? contract.initial_review_lanes : [];
  const files = gitChangedFiles(resolvedRepo, `${String(proof.base_commit)}..${currentCommit}`, false);
  const classification = classifyDiff(files);
  const required = requiredReviewLanes2(initial, classification);
  const authority = await authorityReceiptsFromArgs(args);
  const resolved = resolveReviews(proof.review_lanes ?? [], String(proof.final_commit), authority.receipts, process.env.MOUSELY_AUTHORITY_SIGNING_KEY);
  const status = reviewStatus(required, resolved.reviews, String(proof.final_commit));
  const authorityErrors = [...authority.errors, ...resolved.errors];
  const readiness = authorityErrors.length > 0 ? "needs-human" : status.readiness;
  return {
    ok: readiness === "ready",
    command: "review-status",
    status: readiness,
    ...status,
    readiness,
    errors: authorityErrors,
    authority_errors: authorityErrors,
    final_diff: classification
  };
}
async function verifyProofCommand(args) {
  const proofPath = requireOption(args, "proof");
  const proof = asObject5(await readData(proofPath), "proof bundle");
  const validation = validateContract(proof, "ProofBundle.v1");
  const errors = [...validation.errors];
  const contractPath = requireOption(args, "contract");
  const contextPath = requireOption(args, "context-lock");
  const manifestPath = requireOption(args, "manifest");
  const repo = path10.resolve(requireOption(args, "repo"));
  let resolvedRepo = repo;
  try {
    resolvedRepo = await realpath9(repo);
  } catch (error) {
    errors.push(`cannot resolve supplied repository: ${error.message}`);
  }
  const contract = asObject5(await readData(contractPath), "contract");
  const contextLock = asObject5(await readData(contextPath), "context lock");
  const manifest = asObject5(await readData(manifestPath), "repository manifest");
  if (!validateContract(contract, "TaskContract.v1").valid) errors.push("task contract is invalid");
  if (!validateContract(contextLock, "ContextLock.v1").valid) errors.push("context lock is invalid");
  if (!validateContract(manifest, "RepoManifest.v1").valid) errors.push("repository manifest is invalid");
  if (proof.contract_hash !== hashValue(contract)) errors.push("proof contract_hash does not match task contract");
  if (proof.context_hash !== hashValue(contextLock)) errors.push("proof context_hash does not match context lock");
  if (proof.manifest_hash !== hashValue(manifest)) errors.push("proof manifest_hash does not match repository manifest");
  const expectedRepository = `${String(manifest.organization)}/${String(manifest.name)}`;
  const targetRepository = contextLock.target_repository;
  if (contract.organization !== manifest.organization || contract.repo !== manifest.name) errors.push("task contract organization/repo does not match the repository manifest");
  if (targetRepository?.repository !== expectedRepository) errors.push("context lock target repository does not match the repository manifest");
  if (proof.source_revision !== contract.source_revision || proof.source_revision !== manifest.source_revision || proof.source_revision !== contextLock.source_revision) errors.push("proof, contract, manifest, and context lock must share one source_revision");
  errors.push(...await canonicalTrackedInputErrors(resolvedRepo, contractPath, `.mousely/contracts/${String(contract.linear_issue)}.json`, "task contract"));
  errors.push(...await canonicalTrackedInputErrors(resolvedRepo, contextPath, "mousely-context.lock", "context lock"));
  errors.push(...await canonicalTrackedInputErrors(resolvedRepo, manifestPath, "mousely.repo.yaml", "repository manifest"));
  const contextResult = await verifyContextLock(contextLock, resolvedRepo, /* @__PURE__ */ new Date(), resolvedRepo);
  if (!contextResult.ok) errors.push(...contextResult.errors.map((error) => `context: ${error}`));
  let currentCommit = "";
  let actualDiffHash = "";
  let diffFiles = [];
  try {
    currentCommit = execFileSync4("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();
    errors.push(...repositoryCleanErrors(resolvedRepo));
    execFileSync4("git", ["merge-base", "--is-ancestor", String(proof.base_commit), currentCommit], { cwd: repo, stdio: "ignore" });
    execFileSync4("git", ["merge-base", "--is-ancestor", String(targetRepository?.revision ?? ""), String(proof.base_commit)], { cwd: repo, stdio: "ignore" });
    diffFiles = gitChangedFiles(repo, `${String(proof.base_commit)}..${currentCommit}`, false);
    actualDiffHash = sha256(execFileSync4("git", ["diff", "--binary", "--full-index", "--no-ext-diff", "--no-renames", `${String(proof.base_commit)}..${currentCommit}`, "--"], { cwd: repo, encoding: "buffer", maxBuffer: 32 * 1024 * 1024 }));
  } catch (error) {
    errors.push(`cannot recompute final repository state or prove the context-base-to-proof ancestry: ${error.message}`);
  }
  if (proof.final_commit !== currentCommit) errors.push("proof final_commit is not current HEAD");
  if (proof.diff_hash !== actualDiffHash) errors.push("proof diff_hash does not match base-to-final diff");
  const classification = classifyDiff(diffFiles);
  const required = requiredReviewLanes2(contract.initial_review_lanes ?? [], classification);
  const authority = await authorityReceiptsFromArgs(args);
  const resolvedReviews = resolveReviews(proof.review_lanes ?? [], currentCommit, authority.receipts, process.env.MOUSELY_AUTHORITY_SIGNING_KEY);
  const needsHumanErrors = [
    ...authority.errors,
    ...resolvedReviews.errors,
    ...await historicalPreflightBindingErrors({
      repo: resolvedRepo,
      receiptPath: optionString(args, "preflight-receipt"),
      runReceiptPath: optionString(args, "run-receipt"),
      contractPath,
      contract,
      contextPath,
      contextLock,
      manifestPath,
      manifest,
      proof,
      currentCommit,
      expectedBaseCommit: String(proof.base_commit)
    })
  ];
  const reviews = reviewStatus(required, resolvedReviews.reviews, currentCommit);
  if (reviews.readiness === "needs-human") needsHumanErrors.push("review readiness is needs-human");
  else if (reviews.readiness !== "ready") errors.push(`review readiness is ${reviews.readiness}`);
  const actualDocs = classifyDocsImpact(diffFiles);
  const claimedDocs = proof.documentation_result;
  const claimedImpacts = new Set(Array.isArray(claimedDocs?.impacts) ? claimedDocs.impacts.map(String) : []);
  const claimedUpdates = Array.isArray(claimedDocs?.updates) ? claimedDocs.updates : [];
  const debtIssue = claimedDocs?.debt_issue;
  const debtReceipt = claimedDocs?.debt_receipt;
  for (const impact of actualDocs.impacts) if (!claimedImpacts.has(impact)) errors.push(`documentation result omits recomputed impact ${impact}`);
  for (const update of claimedUpdates) {
    if (!actualDocs.updates.some((actual) => actual.impact === update.impact && actual.path === update.path)) errors.push(`documentation update is not present in the final diff: ${String(update.impact)} -> ${String(update.path)}`);
  }
  for (const missing of actualDocs.required_updates) {
    if (!/^MLY-[1-9][0-9]*$/.test(String(debtIssue ?? ""))) errors.push(`documentation impact ${missing} requires a specific changed document or linked MLY debt issue`);
  }
  if (debtIssue) {
    const verification = verifySignedAuthorityReceipt({ reference: debtReceipt, receipts: authority.receipts, signingKey: process.env.MOUSELY_AUTHORITY_SIGNING_KEY, receiptType: "linear-debt" });
    if (!verification.verified) needsHumanErrors.push(...verification.errors);
    else {
      const payload = verification.verified.payload;
      const repository = `${String(manifest.organization)}/${String(manifest.name)}`;
      const approver = payload.approver;
      const writer = payload.writer;
      if (payload.issue !== debtIssue || payload.repository !== repository || payload.commit_sha !== currentCommit || payload.approved !== true || approver?.provider !== "linear" || approver.role !== "linear-approver" || !identitiesIndependent(approver, writer)) {
        needsHumanErrors.push("documentation debt remains needs-human because its trusted Linear receipt does not bind issue, approval, repository, commit, and an independent approver");
      }
    }
  } else if (debtReceipt) errors.push("documentation debt receipt is present without a debt issue");
  if (actualDocs.status === "needs-human" && claimedDocs?.status !== "needs-human") {
    errors.push("taste-sensitive documentation/media impact requires a needs-human result");
  }
  const secretFindings = scanSecrets(proof);
  if (secretFindings.length > 0) errors.push("proof bundle contains material matching secret/redaction rules");
  const checks = proof.checks ?? [];
  if (checks.length === 0 || checks.every((check) => check.status === "not-applicable")) errors.push("proof must execute at least one applicable check");
  if (checks.some((check) => check.status !== "pass")) errors.push("proof contains a non-passing required check");
  if (proof.readiness !== "ready") errors.push(`proof readiness is ${String(proof.readiness)}, not ready`);
  const documentation = proof.documentation_result;
  if (documentation?.status === "blocked" || documentation?.status === "needs-human") {
    errors.push("documentation gate is not complete");
  }
  const proofTargets = proof.browser_device_matrix ?? [];
  const requiredTargets = Array.isArray(manifest.device_browser_needs) ? manifest.device_browser_needs.map(String) : [];
  const mediaById = /* @__PURE__ */ new Map();
  for (const media of proof.media ?? []) {
    const id = String(media.id ?? "");
    if (!id || mediaById.has(id)) errors.push(`proof media evidence IDs must be unique and non-empty: ${id || "<empty>"}`);
    else mediaById.set(id, media);
  }
  for (const check of checks) {
    const evidenceIds = Array.isArray(check.evidence_ids) ? check.evidence_ids.map(String) : [];
    if (evidenceIds.length === 0) errors.push(`${String(check.name)} check requires at least one typed evidence ID`);
    for (const evidenceId of evidenceIds) if (!mediaById.has(evidenceId)) errors.push(`${String(check.name)} check references missing media evidence ID: ${evidenceId}`);
    const attestation = verifySignedAuthorityReceipt({ reference: check.attestation_receipt, receipts: authority.receipts, signingKey: process.env.MOUSELY_AUTHORITY_SIGNING_KEY, receiptType: "check" });
    if (!attestation.verified) needsHumanErrors.push(...attestation.errors.map((error) => `${String(check.name)} check attestation: ${error}`));
    else {
      const payload = attestation.verified.payload;
      const expectedEvidence = evidenceIds.map((id) => ({ id, hash: String(mediaById.get(id)?.hash ?? "") })).sort((left, right) => left.id.localeCompare(right.id));
      const actualEvidence = Array.isArray(payload.evidence) ? payload.evidence.map((item) => ({ id: String(item.id), hash: String(item.hash) })).sort((left, right) => left.id.localeCompare(right.id)) : [];
      if (attestation.verified.receipt.source_revision !== proof.source_revision || payload.repository !== expectedRepository || payload.contract_hash !== hashValue(contract) || payload.context_hash !== hashValue(contextLock) || payload.manifest_hash !== hashValue(manifest) || payload.commit_sha !== currentCommit || payload.check_name !== check.name || payload.status !== check.status || JSON.stringify(actualEvidence) !== JSON.stringify(expectedEvidence) || !identitiesIndependent(payload.attestor, payload.writer)) needsHumanErrors.push(`${String(check.name)} check receipt does not bind source, repository, contract, context, manifest, exact commit, result, evidence hashes, and an independent attestor`);
    }
  }
  const targetKey = (target) => target.toLowerCase();
  const expectedTargetKind = (target) => targetKey(target).includes("accessibility") ? "accessibility" : targetKey(target).includes("reduced-motion") ? "reduced-motion" : targetKey(target).includes("browser") ? "browser" : "device";
  for (const requiredTarget of requiredTargets) {
    const matches = proofTargets.filter((target) => targetKey(String(target.target)) === targetKey(requiredTarget));
    if (matches.length !== 1) errors.push(`proof requires exactly one manifest-required browser/device evidence row: ${requiredTarget}`);
    else {
      const evidence = matches[0];
      if (evidence.kind !== expectedTargetKind(requiredTarget)) errors.push(`manifest-required evidence kind is incorrect for ${requiredTarget}`);
      if (evidence.status !== "pass") errors.push(`manifest-required browser/device evidence is not passing: ${requiredTarget}`);
      if (targetKey(requiredTarget).includes("physical") && evidence.physical !== true) errors.push(`manifest-required physical target is not marked physical: ${requiredTarget}`);
    }
  }
  for (const target of proofTargets) {
    const evidenceIds = Array.isArray(target.evidence_ids) ? target.evidence_ids.map(String) : [];
    if (evidenceIds.length === 0) errors.push(`${String(target.target)} requires at least one typed evidence ID`);
    for (const evidenceId of evidenceIds) if (!mediaById.has(evidenceId)) errors.push(`${String(target.target)} references missing media evidence ID: ${evidenceId}`);
    if (target.physical === true && ![target.device_identity, target.build_identity, target.install_identity].every((value) => typeof value === "string" && value.length > 0)) errors.push(`${String(target.target)} physical validation requires device, build, and install identity`);
    if (target.physical === true && /simulator|emulator/i.test([target.device_identity, target.build_identity, target.install_identity].map(String).join(" "))) errors.push(`${String(target.target)} claims physical validation using Simulator or emulator identity`);
    if (target.physical === true) {
      const attestation = verifySignedAuthorityReceipt({ reference: target.device_attestation_receipt, receipts: authority.receipts, signingKey: process.env.MOUSELY_AUTHORITY_SIGNING_KEY, receiptType: "device" });
      if (!attestation.verified) needsHumanErrors.push(...attestation.errors.map((error) => `${String(target.target)} device attestation: ${error}`));
      else {
        const payload = attestation.verified.payload;
        const expectedEvidence = evidenceIds.map((id) => ({ id, hash: String(mediaById.get(id)?.hash ?? "") })).sort((left, right) => left.id.localeCompare(right.id));
        const actualEvidence = Array.isArray(payload.evidence) ? payload.evidence.map((item) => ({ id: String(item.id), hash: String(item.hash) })).sort((left, right) => left.id.localeCompare(right.id)) : [];
        if (payload.repository !== `${String(manifest.organization)}/${String(manifest.name)}` || payload.contract_hash !== hashValue(contract) || payload.context_hash !== hashValue(contextLock) || payload.commit_sha !== currentCommit || payload.target !== target.target || payload.device_identity !== target.device_identity || payload.build_identity !== target.build_identity || payload.install_identity !== target.install_identity || JSON.stringify(actualEvidence) !== JSON.stringify(expectedEvidence) || !identitiesIndependent(payload.attestor, payload.writer)) needsHumanErrors.push(`${String(target.target)} physical-device receipt does not bind repository, contract, context, commit, device/build/install identity, evidence hashes, and an independent attestor`);
      }
    } else if (target.device_attestation_receipt) errors.push(`${String(target.target)} non-physical evidence cannot claim a physical-device attestation receipt`);
  }
  const proofMedia = proof.media ?? [];
  if ((requiredTargets.length > 0 || classification.change_classes.includes("ui-ux")) && proofMedia.length === 0) errors.push("user-visible work requires hashed screenshot, video, log, or artifact evidence");
  for (const media of proofMedia) {
    const uri = String(media.uri ?? "");
    if (uri.startsWith("file:")) {
      try {
        const mediaUrl = new URL(uri);
        if (mediaUrl.protocol !== "file:" || mediaUrl.hostname || mediaUrl.search || mediaUrl.hash) throw new Error("local evidence must be an unqualified file URL");
        const localPath = fileURLToPath(mediaUrl);
        const metadata = await lstat7(localPath);
        if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size > 32 * 1024 * 1024) throw new Error("local evidence must be a regular non-symlink file no larger than 32 MiB");
        const resolvedMedia = await realpath9(localPath);
        const relativeMedia = path10.relative(resolvedRepo, resolvedMedia);
        if (!relativeMedia || relativeMedia === ".." || relativeMedia.startsWith(`..${path10.sep}`) || path10.isAbsolute(relativeMedia)) throw new Error("local evidence must resolve inside the supplied repository");
        const artifactBytes = await readFile7(localPath);
        if (sha256(artifactBytes) !== media.hash) errors.push(`media hash mismatch: ${uri}`);
        const printableBinary = artifactBytes.toString("latin1").replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "\n");
        if (scanSecrets(artifactBytes.toString("utf8")).length > 0 || scanSecrets(printableBinary).length > 0) errors.push(`media artifact contains potential secret material: ${uri}`);
      } catch (error) {
        errors.push(`media artifact unavailable: ${uri} (${error.message})`);
      }
    } else {
      const protocol = (() => {
        try {
          return new URL(uri).protocol;
        } catch {
          return "";
        }
      })();
      if (!protocol || !["https:", "artifact:"].includes(protocol)) errors.push(`remote media URI uses an unsupported protocol: ${uri}`);
      const attestation = verifySignedAuthorityReceipt({ reference: media.attestation_receipt, receipts: authority.receipts, signingKey: process.env.MOUSELY_AUTHORITY_SIGNING_KEY, receiptType: "media" });
      if (!attestation.verified) needsHumanErrors.push(...attestation.errors.map((error) => `remote media ${String(media.id)}: ${error}`));
      else {
        const payload = attestation.verified.payload;
        if (payload.commit_sha !== currentCommit || payload.evidence_id !== media.id || payload.uri !== uri || payload.hash !== media.hash || !identitiesIndependent(payload.reviewer, payload.writer)) {
          needsHumanErrors.push(`remote media ${String(media.id)} remains needs-human because its receipt does not bind independent identity, writer, exact commit, URI, and hash`);
        }
      }
    }
  }
  const preview = proof.preview;
  if (preview?.url && (!preview.expires_at || new Date(String(preview.expires_at)) <= /* @__PURE__ */ new Date())) errors.push("preview is expired or missing expiry");
  {
    const commit = String(proof.final_commit);
    try {
      execFileSync4("git", ["cat-file", "-e", `${commit}^{commit}`], { cwd: repo, stdio: "ignore" });
    } catch {
      errors.push("final commit is not present in the supplied repository");
    }
  }
  return {
    ok: errors.length === 0 && needsHumanErrors.length === 0,
    command: "verify-proof",
    status: errors.length > 0 ? "invalid-proof" : needsHumanErrors.length > 0 ? "needs-human" : "verified",
    proof_hash: hashValue(proof),
    secret_findings: secretFindings.map(({ path: findingPath, rule }) => ({ path: findingPath, rule })),
    errors: [...errors, ...needsHumanErrors]
  };
}
async function writeReceiptCommand(args) {
  const inputPath = requireOption(args, "input");
  const outputPath = requireOption(args, "output");
  let receipt = asObject5(await readData(inputPath), "run receipt");
  const originalFindings = scanSecrets(receipt);
  if (originalFindings.length > 0 && optionBoolean(args, "redact")) {
    receipt = redactValue(receipt);
    receipt.redaction_state = "redacted";
  }
  const findings = scanSecrets(receipt);
  const validation = validateContract(receipt, "RunReceipt.v1");
  const errors = [...validation.errors];
  if (findings.length > 0) errors.push("receipt contains material matching secret/redaction rules");
  if (errors.length === 0) await writeJsonAtomic(outputPath, receipt);
  return {
    ok: errors.length === 0,
    command: "write-receipt",
    status: errors.length === 0 ? "written" : "blocked",
    output: path10.resolve(outputPath),
    receipt_hash: errors.length === 0 ? hashValue(receipt) : null,
    redacted_findings: optionBoolean(args, "redact") ? originalFindings.length : 0,
    errors
  };
}
async function cleanupCommand(args) {
  const repo = await realpath9(path10.resolve(requireOption(args, "repo")));
  const runtime = await resolveRuntimePaths(repo);
  const leasesPath = optionString(args, "leases") ?? runtime.leaseStore;
  if (path10.resolve(leasesPath) !== runtime.leaseStore) return { ok: false, command: "cleanup", status: "blocked", errors: ["cleanup may operate only on the external canonical lease store"] };
  const source = await readData(runtime.leaseStore);
  if (Array.isArray(source)) return { ok: false, command: "cleanup", status: "blocked", errors: ["legacy array cleanup is unsupported; use a locked LeaseStore.v1"] };
  const execute = optionBoolean(args, "execute");
  const now = optionString(args, "now");
  const result = await cleanupExpiredLeases({
    storePath: runtime.leaseStore,
    owner: requireOption(args, "owner"),
    hostFingerprint: runtimeHostFingerprint(),
    cleanupToken: leaseCleanupToken(true),
    execute,
    now: now ? new Date(now) : /* @__PURE__ */ new Date()
  });
  return { command: "cleanup", ...result };
}
function leaseCleanupToken(required = false) {
  const value = process.env.MOUSELY_LEASE_CLEANUP_TOKEN;
  if (required && (!value || value.length < 16)) throw new Error("MOUSELY_LEASE_CLEANUP_TOKEN must contain at least sixteen characters");
  return value;
}
function redactedLease(lease) {
  const { cleanup_token: _cleanupTokenHash, ...safe } = lease;
  return safe;
}
async function leaseAcquireCommand(args) {
  const repo = await realpath9(path10.resolve(requireOption(args, "repo")));
  const runtime = await resolveRuntimePaths(repo);
  const contractPath = requireOption(args, "contract");
  const contract = asObject5(await readData(contractPath), "task contract");
  const validation = validateContract(contract, "TaskContract.v1");
  if (!validation.valid) return { ok: false, command: "lease-acquire", status: "invalid-contract", errors: validation.errors };
  if (typeof contract.linear_issue !== "string") return { ok: false, command: "lease-acquire", status: "not-acquired", errors: ["mutating Mousely work requires an exact Linear issue"] };
  const canonicalErrors = await canonicalTrackedInputErrors(repo, contractPath, `.mousely/contracts/${contract.linear_issue}.json`, "task contract");
  if (canonicalErrors.length > 0) return { ok: false, command: "lease-acquire", status: "not-acquired", errors: canonicalErrors };
  if (contract.one_writer !== true || typeof contract.agent_of_record !== "string" || typeof contract.idempotency_key !== "string") {
    return { ok: false, command: "lease-acquire", status: "not-acquired", errors: ["task contract must bind one writer, an agent of record, and an idempotency key"] };
  }
  const requestedWriter = optionString(args, "writer") ?? String(contract.agent_of_record);
  if (requestedWriter !== contract.agent_of_record) return { ok: false, command: "lease-acquire", status: "not-acquired", errors: ["writer must exactly match TaskContract.agent_of_record"] };
  const requestedStore = optionString(args, "store") ?? runtime.leaseStore;
  if (path10.resolve(requestedStore) !== runtime.leaseStore) return { ok: false, command: "lease-acquire", status: "not-acquired", errors: ["lease acquisition may operate only on the external canonical lease store"] };
  const resourceType = optionString(args, "resource-type") ?? "writer";
  if (!(/* @__PURE__ */ new Set(["issue", "writer", "worktree", "port", "process", "device"])).has(resourceType)) return { ok: false, command: "lease-acquire", status: "not-acquired", errors: [`unsupported resource type: ${resourceType}`] };
  try {
    const acquired = await acquireLease({
      storePath: runtime.leaseStore,
      resourceType,
      sourceRevision: String(contract.source_revision),
      linearIssue: contract.linear_issue,
      idempotencyKey: String(contract.idempotency_key),
      writer: requestedWriter,
      writerAgentId: requireOption(args, "writer-agent-id"),
      writerSessionId: requireOption(args, "writer-session-id"),
      worktree: repo,
      repository: repo,
      owner: requireOption(args, "owner"),
      hostFingerprint: runtimeHostFingerprint(),
      contractHash: hashValue(contract),
      pid: optionInteger(args, "pid"),
      processGroup: optionString(args, "process-group") ? optionInteger(args, "process-group") : null,
      port: optionString(args, "port") ? optionInteger(args, "port") : null,
      device: optionString(args, "device") ?? null,
      commandHash: optionString(args, "command-hash") ?? null,
      healthUrl: optionString(args, "health-url") ?? null,
      ttlSeconds: optionInteger(args, "ttl-seconds", 120),
      cleanupToken: leaseCleanupToken(true)
    });
    return { ok: true, command: "lease-acquire", status: "acquired", lease: redactedLease(acquired.lease), lease_identity_hash: leaseIdentityHash(acquired.lease), recovered: acquired.recovered, errors: [] };
  } catch (error) {
    return { ok: false, command: "lease-acquire", status: "not-acquired", errors: [error.message] };
  }
}
async function mutateLeaseCommand(args, action) {
  const repo = await realpath9(path10.resolve(requireOption(args, "repo")));
  const runtime = await resolveRuntimePaths(repo);
  const requestedStore = optionString(args, "store") ?? runtime.leaseStore;
  if (path10.resolve(requestedStore) !== runtime.leaseStore) return { ok: false, command: `lease-${action}`, status: `not-${action}`, errors: ["lease mutation may operate only on the external canonical lease store"] };
  const common = { storePath: runtime.leaseStore, id: requireOption(args, "lease-id"), owner: requireOption(args, "owner"), hostFingerprint: runtimeHostFingerprint(), cleanupToken: leaseCleanupToken(true) };
  try {
    const lease = action === "heartbeat" ? await heartbeatLease({ ...common, ttlSeconds: optionInteger(args, "ttl-seconds", 120) }) : action === "release" ? await releaseLease(common) : await recoverLease(common);
    return { ok: true, command: `lease-${action}`, status: action === "heartbeat" ? "heartbeated" : action === "release" ? "released" : "recovered", lease: redactedLease(lease), errors: [] };
  } catch (error) {
    return { ok: false, command: `lease-${action}`, status: action === "heartbeat" ? "not-heartbeated" : action === "release" ? "not-released" : "not-recovered", errors: [error.message] };
  }
}
async function hookCommand(args) {
  const event = args.positional[0];
  if (!event) throw new Error("hook requires an event name");
  let raw = "";
  for await (const chunk of process.stdin) raw += String(chunk);
  const input = raw.trim() ? asObject5(JSON.parse(raw), "hook input") : {};
  return runHook(event, input);
}
async function verifyPrCommand(args) {
  return verifyPullRequest({
    eventPath: requireOption(args, "event"),
    repositoryRoot: path10.resolve(optionString(args, "repo") ?? process.cwd()),
    actionRepository: requireOption(args, "action-repository"),
    actionRef: requireOption(args, "action-ref"),
    trustedHarnessPath: path10.resolve(requireOption(args, "trusted-harness")),
    trustedSourceRoot: path10.resolve(requireOption(args, "trusted-source-root")),
    successorSourceRoot: optionString(args, "successor-source-root") ? path10.resolve(optionString(args, "successor-source-root")) : void 0
  });
}
async function dispatch(args) {
  switch (args.command) {
    case "doctor":
      return doctor();
    case "validate-contract":
      return validateContractCommand(args);
    case "preflight":
      return preflightCommand(args);
    case "verify-context":
      return verifyContextCommand(args);
    case "guard-diff":
      return guardDiffCommand(args);
    case "run-evals":
      return runEvalsCommand(args);
    case "docs-impact":
      return docsImpactCommand(args);
    case "review-status":
      return reviewStatusCommand(args);
    case "verify-proof":
      return verifyProofCommand(args);
    case "write-receipt":
      return writeReceiptCommand(args);
    case "cleanup":
      return cleanupCommand(args);
    case "scan-secrets":
      return scanSecretsCommand(args);
    case "verify-pr":
      return verifyPrCommand(args);
    case "lease-acquire":
      return leaseAcquireCommand(args);
    case "lease-heartbeat":
      return mutateLeaseCommand(args, "heartbeat");
    case "lease-release":
      return mutateLeaseCommand(args, "release");
    case "lease-recover":
      return mutateLeaseCommand(args, "recover");
    case "hook":
      return hookCommand(args);
    case "help":
    case "--help":
    case void 0:
      return { ok: true, command: "help", status: "help", usage: usage() };
    default:
      return { ok: false, command: String(args.command), status: "unknown-command", errors: [`Unknown command: ${args.command}`], usage: usage() };
  }
}
async function main() {
  try {
    const result = await dispatch(parseArgs(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(result, null, 2)}
`);
    if (result.ok === false) process.exitCode = 1;
  } catch (error) {
    const result = {
      ok: false,
      command: process.argv[2] ?? "unknown",
      status: "error",
      errors: [error.message]
    };
    process.stdout.write(`${JSON.stringify(result, null, 2)}
`);
    process.exitCode = 1;
  }
}
await main();
