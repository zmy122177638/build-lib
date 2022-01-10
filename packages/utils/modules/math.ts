/**
 * 加
 * @param arg 数值
 * @returns 相加的和
 */
export function accAdd(...arg: number[]) {
  let lens = arg.map(num => {
    try {
      return num.toString().split('.')[1].length
    } catch (error) {
      return 0
    }
  })
  let m = Math.pow(10, Math.max(...lens))
  return (
    arg.reduce((init, curr) => {
      return init + curr * m
    }, 0) / m
  )
}
/**
 * 减
 * @param arg 数值
 * @returns 相减的差值
 */
export function accSub(...arg: number[]) {
  return accAdd(...arg.map((num, index) => (index >= 1 ? -num : num)))
}

/**
 * 乘
 * @param arg 数值
 * @returns 相乘结果
 */
export function accMul(...arg: number[]) {
  let m = arg.reduce((init, curr) => {
    try {
      return init + curr.toString().split('.')[1].length
    } catch (error) {
      return init
    }
  }, 0)
  return (
    arg.reduce((init, curr) => {
      return init * Number(curr.toString().replace('.', ''))
    }, 1) / Math.pow(10, m)
  )
}
/**
 * 除
 * @param arg 数值
 * @returns 相除结果
 */
export function accDiv(...arg: number[]) {
  return arg.reduce((init, curr, index) => {
    let r1, r2
    if (index == 0) {
      return curr
    } else {
      try {
        r1 = init.toString().split('.')[1].length
      } catch (error) {
        r1 = 0
      }
      try {
        r2 = curr.toString().split('.')[1].length
      } catch (error) {
        r2 = 0
      }
      return (
        (Number(init.toString().replace('.', '')) / Number(curr.toString().replace('.', ''))) * Math.pow(10, r2 - r1)
      )
    }
  }, 0)
}

/**
 * 精度转换
 * @param num 数字
 * @param precision 小数位数
 */
export function toPrecision(num: number | string, precision: number): string {
  if (/d+/g.test(num as string)) return num as string
  num = Number(num)
  let truncNum = Math.trunc(num)
  const toLen = truncNum.toString().length + precision
  return num.toPrecision(toLen).padEnd(toLen, '0')
}
