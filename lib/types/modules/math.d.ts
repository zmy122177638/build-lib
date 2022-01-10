/**
 * 加
 * @param arg 数值
 * @returns 相加的和
 */
export declare function accAdd(...arg: number[]): number;
/**
 * 减
 * @param arg 数值
 * @returns 相减的差值
 */
export declare function accSub(...arg: number[]): number;
/**
 * 乘
 * @param arg 数值
 * @returns 相乘结果
 */
export declare function accMul(...arg: number[]): number;
/**
 * 除
 * @param arg 数值
 * @returns 相除结果
 */
export declare function accDiv(...arg: number[]): number;
/**
 * 精度转换
 * @param num 数字
 * @param precision 小数位数
 */
export declare function toPrecision(num: number | string, precision: number): string;
