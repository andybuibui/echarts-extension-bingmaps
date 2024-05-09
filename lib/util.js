import { version } from 'echarts'

export const ecVer = version.split('.')

export const isNewEC = ecVer[0] > 4

export const COMPONENT_TYPE = 'bingmap'

export function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1]
}
