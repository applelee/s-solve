/**
 * 全类型校验
 */

export class TypeVerification {
    static isString (obj: any) { return Object.prototype.toString.call(obj) === '[object String]'; }

    static isNumber (obj: any) { return Object.prototype.toString.call(obj) === '[object Number]'; }

    static isBoolean (obj: any) { return Object.prototype.toString.call(obj) === '[object Boolean]'; }

    static isArray (obj: any) { return Object.prototype.toString.call(obj) === '[object Array]'; }

    static isObject (obj: any) { return Object.prototype.toString.call(obj) === '[object Object]'; }

    static isNull (obj: any) { return Object.prototype.toString.call(obj) === '[object Null]'; }

    static isUndefined (obj: any) { return Object.prototype.toString.call(obj) === '[object Undefined ]'; }

    static isSymbol (obj: any) { return Object.prototype.toString.call(obj) === '[object Symbol]'; }

    static isSet (obj: any) { return Object.prototype.toString.call(obj) === '[object Set]'; }

    static isMap (obj: any) { return Object.prototype.toString.call(obj) === '[object Map]'; }

    static isPromise (obj: any) { return Object.prototype.toString.call(obj) === '[object Promise]'; }
}
