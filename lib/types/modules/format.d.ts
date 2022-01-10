/**
 * 时间格式话
 * @param date 时间
 * @param format 格式规则 默认YYYY-MM-DD HH:mm:ss
 */
export declare function formatDate(date: any, format?: string): string;
/**
 * 金钱格式化
 * @param value 金额
 * @param precision 保留小数 截取不取整
 * @param seperator 千位分隔符 1,999.00
 */
export declare function formatMoney(value: number | string, precision?: number, seperator?: string): string | 0;
/**
 * 毫秒转时间格式化
 * @param milliSeconds 毫秒数
 * @param format 格式规则
 */
export declare function formatCD(milliSeconds: number, format?: string): string;
