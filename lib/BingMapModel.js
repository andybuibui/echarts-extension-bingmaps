import { ComponentModel } from 'echarts'

import { v2Equal, isNewEC, COMPONENT_TYPE } from './util';

const BingMapModel = {
  type: COMPONENT_TYPE,
  setBingMap: function (bingmap) {
    this.__bingmap = bingmap;
  },
  getBingMap: function () {
    return this.__bingmap;
  },
  setEChartsLayer: function (layer) {
    this.__echartsLayer = layer;
  },

  getEChartsLayer: function () {
    return this.__echartsLayer;
  },
  setCenterAndZoom: function (center, zoom) {
    this.option.viewOption.center = center;
    this.option.viewOption.zoom = zoom;
  },
  centerOrZoomChanged: function (center, zoom) {
    let option = this.option.viewOption;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },
  defaultOption: {
    viewOption: {
      center: [113.493471, 23.169598],
      zoom: 5,
    },
    mapOption: {
      customMapStyle: {},
    },
  },
}

export default isNewEC
  ? ComponentModel.extend(BingMapModel)
  : BingMapModel
