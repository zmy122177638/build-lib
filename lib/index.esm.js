/**
 * 时间格式话
 * @param date 时间
 * @param format 格式规则 默认YYYY-MM-DD HH:mm:ss
 */
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
/**
 * 金钱格式化
 * @param value 金额
 * @param precision 保留小数 截取不取整
 * @param seperator 千位分隔符 1,999.00
 */

function formatMoney(value) {
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
/**
 * 毫秒转时间格式化
 * @param milliSeconds 毫秒数
 * @param format 格式规则
 */

function formatCD(milliSeconds) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DD:HH:mm:ss ms';
  var formatResult;

  if (!milliSeconds || milliSeconds < 0) {
    formatResult = {
      D: 0,
      H: 0,
      m: 0,
      s: 0,
      ms: 0
    };
  } else {
    var seconds = Math.floor(milliSeconds / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var millis = String(milliSeconds % 1000);

    if (millis.length < 3) {
      millis = '0'.repeat(3).slice(0, -millis.length) + millis;
    }

    formatResult = {
      D: days,
      H: hours % 24,
      m: minutes % 60,
      s: seconds % 60,
      ms: millis.substr(0, 2)
    };
  }

  return format.replace(/(D+|H+|ms|m+|s+)/g, function (v) {
    var len = v.length;
    var key = v === 'ms' ? v : v.slice(-1);
    var value = String(formatResult[key]).slice(-(len > 2 ? len : 2));
    return '0'.repeat(len).slice(0, -value.length) + value;
  });
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * 加
 * @param arg 数值
 * @returns 相加的和
 */
function accAdd() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  var lens = arg.map(function (num) {
    try {
      return num.toString().split('.')[1].length;
    } catch (error) {
      return 0;
    }
  });
  var m = Math.pow(10, Math.max.apply(Math, _toConsumableArray(lens)));
  return arg.reduce(function (init, curr) {
    return init + curr * m;
  }, 0) / m;
}
/**
 * 减
 * @param arg 数值
 * @returns 相减的差值
 */

function accSub() {
  for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    arg[_key2] = arguments[_key2];
  }

  return accAdd.apply(void 0, _toConsumableArray(arg.map(function (num, index) {
    return index >= 1 ? -num : num;
  })));
}
/**
 * 乘
 * @param arg 数值
 * @returns 相乘结果
 */

function accMul() {
  for (var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    arg[_key3] = arguments[_key3];
  }

  var m = arg.reduce(function (init, curr) {
    try {
      return init + curr.toString().split('.')[1].length;
    } catch (error) {
      return init;
    }
  }, 0);
  return arg.reduce(function (init, curr) {
    return init * Number(curr.toString().replace('.', ''));
  }, 1) / Math.pow(10, m);
}
/**
 * 除
 * @param arg 数值
 * @returns 相除结果
 */

function accDiv() {
  for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    arg[_key4] = arguments[_key4];
  }

  return arg.reduce(function (init, curr, index) {
    var r1, r2;

    if (index == 0) {
      return curr;
    } else {
      try {
        r1 = init.toString().split('.')[1].length;
      } catch (error) {
        r1 = 0;
      }

      try {
        r2 = curr.toString().split('.')[1].length;
      } catch (error) {
        r2 = 0;
      }

      return Number(init.toString().replace('.', '')) / Number(curr.toString().replace('.', '')) * Math.pow(10, r2 - r1);
    }
  }, 0);
}
/**
 * 精度转换
 * @param num 数字
 * @param precision 小数位数
 */

function toPrecision(num, precision) {
  if (/d+/g.test(num)) return num;
  num = Number(num);
  var truncNum = Math.trunc(num);
  var toLen = truncNum.toString().length + precision;
  return num.toPrecision(toLen).padEnd(toLen, '0');
}

export { accAdd, accDiv, accMul, accSub, formatCD, formatDate, formatMoney, toPrecision };
