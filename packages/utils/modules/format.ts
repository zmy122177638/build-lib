/** 时间格式化 */
export function formatDate(date: any, format: string = 'YYYY-MM-DD HH:mm:ss') {
  if (!(date instanceof Date)) {
    date = new Date(date)
    if (isNaN(date)) {
      console.error('时间格式错误')
      return ''
    }
  }

  var z = {
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

/** 金钱格式化 */
export function formatNumber(value: number | string, precision = 2, seperator: string = '') {
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
