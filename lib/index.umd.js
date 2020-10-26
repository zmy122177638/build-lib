(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['@anles/utils'] = {}));
}(this, (function (exports) { 'use strict';

  /** 时间格式化 */
  function formatDate(date) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss';

    if (!(date instanceof Date)) {
      date = new Date(date);

      if (isNaN(date)) {
        console.error('时间格式错误');
        return '';
      }
    }

    var z = {
      Y: date.getFullYear(),
      M: date.getMonth() + 1,
      D: date.getDate(),
      H: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    };
    return format.replace(/(Y+|M+|D+|H+|m+|s+)/g, function (v) {
      return String((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-(v.length > 2 ? v.length : 2));
    });
  }
  /** 金钱格式化 */

  function formatNumber(value) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var seperator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    if (!value) return 0;
    var numStr = typeof value === 'string' ? value.replace(/,/g, '') : "".concat(value || '');
    var arr = numStr.split('.');
    var strInt = arr[0];
    var strFractional = arr[1] || '';

    if (seperator) {
      strInt = strInt.replace(/\d{1,3}(?=(\d{3})+$)/g, "$&".concat(seperator));
    }

    precision = Math.max(0, precision);

    if (strFractional.length > precision) {
      strFractional = strFractional.substr(0, precision);
    }

    if (strFractional.length > 0) {
      strFractional = strFractional.replace(/0+$/, '');
    }

    if (strFractional.length > 0) {
      return "".concat(strInt, ".").concat(strFractional);
    }

    return strInt;
  }

  /** 导出模块所有方法 */
  function testBuildTarget() {
    var testconstOfVar = 'YYYY-MM-DD';
    return function () {
      return formatDate(new Date(), testconstOfVar);
    };
  }

  exports.formatDate = formatDate;
  exports.formatNumber = formatNumber;
  exports.testBuildTarget = testBuildTarget;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
