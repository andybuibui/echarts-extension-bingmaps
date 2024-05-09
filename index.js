import * as echarts from 'echarts'
import { install } from './lib/index'
import { isNewEC } from './lib/util'

isNewEC ? echarts.use(install) : install(echarts)

export { name, version } from './lib/index'
