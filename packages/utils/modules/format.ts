/**
 * 时间格式话
 * @param date 时间
 * @param format 格式规则 默认YYYY-MM-DD HH:mm:ss
 */
export function formatDate(date: any, format: string = 'YYYY-MM-DD HH:mm:ss') {
  if (!(date instanceof Date)) {
    date = new Date(date)
    if (isNaN(date)) {
      console.error('时间格式错误')
      return ''
    }
  }

  const z = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  }
  return format.replace(/(Y+|M+|D+|H+|m+|s+)/g, (v: string) => {
    return String((v.length > 1 ? '0' : '') + (z as any)[v.slice(-1)]).slice(-(v.length > 2 ? v.length : 2))
  })
}
/**
 * 金钱格式化
 * @param value 金额
 * @param precision 保留小数 截取不取整
 * @param seperator 千位分隔符 1,999.00
 */
export function formatMoney(value: number | string, precision = 2, seperator: string = '') {
  if (!value) return 0
  const numStr = typeof value === 'string' ? value.replace(/,/g, '') : `${value || ''}`
  const arr = numStr.split('.')
  let strInt = arr[0]
  let strFractional = arr[1] || ''
  if (seperator) {
    strInt = strInt.replace(/\d{1,3}(?=(\d{3})+$)/g, `$&${seperator}`)
  }
  precision = Math.max(0, precision)
  if (strFractional.length > precision) {
    strFractional = strFractional.substr(0, precision)
  }
  if (strFractional.length > 0) {
    strFractional = strFractional.replace(/0+$/, '')
  }
  if (strFractional.length > 0) {
    return `${strInt}.${strFractional}`
  }
  return strInt
}
/**
 * 毫秒转时间格式化
 * @param milliSeconds 毫秒数
 * @param format 格式规则
 */
export function formatCD(milliSeconds: number, format: string = 'DD:HH:mm:ss ms'): string {
  let formatResult: any
  if (!milliSeconds || milliSeconds < 0) {
    formatResult = {
      D: 0,
      H: 0,
      m: 0,
      s: 0,
      ms: 0,
    }
  } else {
    const seconds = Math.floor(milliSeconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    let millis = String(milliSeconds % 1000)
    if (millis.length < 3) {
      millis = '0'.repeat(3).slice(0, -millis.length) + millis
    }
    formatResult = {
      D: days,
      H: hours % 24,
      m: minutes % 60,
      s: seconds % 60,
      ms: millis.substr(0, 2),
    }
  }
  return format.replace(/(D+|H+|ms|m+|s+)/g, (v: string) => {
    const len = v.length
    const key = v === 'ms' ? v : v.slice(-1)
    const value = String((formatResult as any)[key]).slice(-(len > 2 ? len : 2))
    return '0'.repeat(len).slice(0, -value.length) + value
  })
}
