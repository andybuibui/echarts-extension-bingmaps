## Bingmap extension for Apache ECharts

This is an Bingmap extension for [Apache ECharts](https://echarts.apache.org/en/index.html)

[![NPM version](https://img.shields.io/npm/v/echarts-extension-bingmaps.svg?style=flat)](https://www.npmjs.org/package/echarts-extension-bingmaps) [![NPM Downloads](https://img.shields.io/npm/dm/echarts-extension-bingmaps.svg)](https://npmcharts.com/compare/echarts-extension-bingmaps?minimal=true) [![jsDelivr Downloads](https://data.jsdelivr.com/v1/package/npm/echarts-extension-bingmaps/badge?style=rounded)](https://www.jsdelivr.com/package/npm/echarts-extension-bingmaps)

## [Warning：Migrating to Azure Map](https://github.com/andybuibui/echarts-extension-azure-map)
![346051349-c99c6b1a-36fa-4f13-91f4-9a770a2668af](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/95849877-4ff8-4702-856a-8f83b732a6ff)

## [Migrating to Echart Extension Azure Map](https://github.com/andybuibui/echarts-extension-azure-map)



## Installation

```shell
npm install echarts-extension-bingmaps --save
```

## Import

Import packaged distribution file `echarts-extension-bingmaps` and add BingMap API script and ECharts script.

```html
<script src="https://www.bing.com/api/maps/mapcontrol?key=${your-bingmapkey}&setlang=zh-cn"></script>
<!-- import ECharts -->
<script src="https://fastly.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<!-- import echarts-extension-bingmaps -->
<script src="https://fastly.jsdelivr.net/npm/echarts-extension-bingmaps/dist/echarts-extension-bingmaps.min.js"></script>
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

## Examples

### FlyChart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/d7b606f0-e6bd-4247-bfda-22c3d63a4add)

### Heart Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/df57d90f-8e39-4646-a44f-94dbde858105)

### Line Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/53478a66-597a-407c-9fb1-e0eec2be0edb)

### Pie Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/69706545-b68c-4d7c-bfd5-28a321c96766)

### Scatter Chart
![image](https://github.com/andybuibui/echarts-extension-bingmaps/assets/23742065/45916004-b9cc-4e06-8524-c89fd6f8efba)


## More Links
- [echarts-extension-bingmaps](https://github.com/andybuibui/echarts-extension-bingmaps)
- [echarts-extension-azure-map](https://github.com/andybuibui/echarts-extension-azure-map)
- [echarts-extension-amap](https://github.com/plainheart/echarts-extension-amap)
- [echarts-extension-gmap](https://github.com/plainheart/echarts-extension-gmap)
- [echarts-extension-bmap](https://github.com/apache/echarts/blob/master/extension-src/bmap/bmap.ts)

## Contributing

Pull requests are welcomed. For major changes, please open an issue first to discuss what you would like to change.

## Creators ✨

<!-- CREATORS:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td style="text-align: center; vertical-align: middle;">
      <a href="https://github.com/andybuibui"
        ><img
          src="https://avatars.githubusercontent.com/u/23742065?v=4"
          width="100px;"
          alt=""
        /><br /><sub><b>andybuibui</b></sub></a
      >
    </td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- CREATORS:END -->

## License

[MIT](https://choosealicense.com/licenses/mit/)


