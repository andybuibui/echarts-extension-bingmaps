[![NPM version](https://img.shields.io/npm/v/echarts-extension-bingmaps.svg?style=flat)](https://www.npmjs.org/package/echarts-extension-bingmaps) [![NPM Downloads](https://img.shields.io/npm/dm/echarts-extension-bingmaps.svg)](https://npmcharts.com/compare/echarts-extension-bingmaps?minimal=true) [![jsDelivr Downloads](https://data.jsdelivr.com/v1/package/npm/echarts-extension-bingmaps/badge?style=rounded)](https://www.jsdelivr.com/package/npm/echarts-extension-bingmaps)

## Bingmap extension for Apache ECharts

This is an Bingmap extension for [Apache ECharts](https://echarts.apache.org/en/index.html)

### Installation

```shell
npm install echarts-extension-bingmaps --save
```

### Import

Import packaged distribution file `echarts-extension-bingmaps.umd.cjs` and add BingMap API script and ECharts script.

```html
<script src="https://www.bing.com/api/maps/mapcontrol?key=${your-bingmapkey}&setlang=zh-cn"></script>
<!-- import ECharts -->
<script src="https://fastly.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<!-- import echarts-extension-bingmaps -->
<script src="dist/echarts-extension-bingmaps.umd.cjs"></script>
```

You can also import this extension by `require` or `import` if you are using `webpack` or any other bundler.

```js
// use require
require('echarts');
require('echarts-extension-bingmaps');

// use import
import * as echarts from 'echarts';
import 'echarts-extension-bingmaps';
```

### Examples

#### FlyChart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/d7b606f0-e6bd-4247-bfda-22c3d63a4add)

### Heart Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/df57d90f-8e39-4646-a44f-94dbde858105)

#### Line Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/53478a66-597a-407c-9fb1-e0eec2be0edb)

#### Pie Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/69706545-b68c-4d7c-bfd5-28a321c96766)

#### Scatter Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/45916004-b9cc-4e06-8524-c89fd6f8efba)





