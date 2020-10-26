/** 导出模块所有方法 */
export * from './modules/format'

import { formatDate } from './modules/format'

export function testBuildTarget() {
  const testconstOfVar = 'YYYY-MM-DD'
  return () => formatDate(new Date(), testconstOfVar)
}
