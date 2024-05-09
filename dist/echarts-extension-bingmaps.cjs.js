/*!
 * echarts-extension-bingmaps 
 * @version 1.0.4
 * @author andybuibui
 * 
 * MIT License
 * 
 * Copyright (c) 2019-2024 andybuibui
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

var echarts = require('echarts');

var ecVer = echarts.version.split('.');
var isNewEC = ecVer[0] > 4;
var COMPONENT_TYPE = 'bingmap';
function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

var BingMapModel = {
  type: COMPONENT_TYPE,
  setBingMap: function setBingMap(bingmap) {
    this.__bingmap = bingmap;
  },
  getBingMap: function getBingMap() {
    return this.__bingmap;
  },
  setEChartsLayer: function setEChartsLayer(layer) {
    this.__echartsLayer = layer;
  },
  getEChartsLayer: function getEChartsLayer() {
    return this.__echartsLayer;
  },
  setCenterAndZoom: function setCenterAndZoom(center, zoom) {
    this.option.viewOption.center = center;
    this.option.viewOption.zoom = zoom;
  },
  centerOrZoomChanged: function centerOrZoomChanged(center, zoom) {
    var option = this.option.viewOption;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },
  defaultOption: {
    viewOption: {
      center: [113.493471, 23.169598],
      zoom: 5
    },
    mapOption: {
      customMapStyle: {}
    }
  }
};
var BingMapModel$1 = isNewEC ? echarts.ComponentModel.extend(BingMapModel) : BingMapModel;

var BingMapView = {
  type: COMPONENT_TYPE,
  init: function init() {
    this._isFirstRender = true;
  },
  render: function render(bingMapModel, ecModel, api) {
    var rendering = true;
    var bingmap = bingMapModel.getBingMap();
    var viewportRoot = api.getZr().painter.getViewportRoot();
    var coordSys = bingMapModel.coordinateSystem;
    var viewChangeHandler = function viewChangeHandler(arg) {
      if (rendering) {
        return;
      }
      var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
      var mapOffset = [-parseInt(offsetEl.style.left, 10) || 0, -parseInt(offsetEl.style.top, 10) || 0];
      viewportRoot.style.left = mapOffset[0] + 'px';
      viewportRoot.style.top = mapOffset[1] + 'px';
      coordSys.setMapOffset(mapOffset);
      bingMapModel.__mapOffset = mapOffset;
      api.dispatchAction({
        type: 'bingmapRoam'
      });
    };
    Microsoft.Maps.Events.removeHandler(this._oldViewChangeHandler);
    this._oldViewChangeHandler = Microsoft.Maps.Events.addHandler(bingmap, 'viewchangeend', viewChangeHandler);
    Microsoft.Maps.Events.removeHandler(this._oldmapresize);
    this._oldmapresize = Microsoft.Maps.Events.addHandler(bingmap, 'mapresize', viewChangeHandler);
    this._isFirstRender = rendering = false;
    this.__viewChangeHandler = viewChangeHandler;
  },
  dispose: function dispose() {
    var component = this.__model;
    if (component) {
      component.getBingMap().dispose();
      component.setBingMap(null);
      component.setEChartsLayer(null);
      if (component.coordinateSystem) {
        component.coordinateSystem.setBingMap(null);
        component.coordinateSystem = null;
      }
    }
    delete this.__viewChangeHandler;
  }
};
var BingMapView$1 = isNewEC ? echarts.ComponentView.extend(BingMapView) : BingMapView;

function BingMapCoordSys(bingmap, api) {
  this._bingmap = bingmap;
  this.dimensions = ['lng', 'lat'];
  this._mapOffset = [0, 0];
  this._api = api;
  this._type = COMPONENT_TYPE;
}
BingMapCoordSys.prototype.dimensions = ['lng', 'lat'];
BingMapCoordSys.prototype.setZoom = function (zoom) {
  this._zoom = zoom;
};
BingMapCoordSys.prototype.setCenter = function (center) {
  this._center = this._bingmap.tryLocationToPixel(new Microsoft.Maps.Location(center[1], center[0]));
};
BingMapCoordSys.prototype.setMapOffset = function (mapOffset) {
  this._mapOffset = mapOffset;
};
BingMapCoordSys.prototype.getBingMap = function () {
  return this._bingmap;
};
BingMapCoordSys.prototype.dataToPoint = function (data) {
  var lnglat = new Microsoft.Maps.Location(data[1], data[0]);
  var px = this._bingmap.tryLocationToPixel(lnglat, Microsoft.Maps.PixelReference.control);
  var mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};
BingMapCoordSys.prototype.pointToData = function (pt) {
  var mapOffset = this._mapOffset;
  var ptN = this._bingmap.tryPixelToLocation({
    x: pt[0] + mapOffset[0],
    y: pt[1] + mapOffset[1]
  }, Microsoft.Maps.PixelReference.control);
  return [ptN.longitude, ptN.latitude];
};
BingMapCoordSys.prototype.getViewRect = function () {
  var api = this._api;
  return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};
BingMapCoordSys.prototype.getRoamTransform = function () {
  return echarts.matrix.create();
};
BingMapCoordSys.prototype.prepareCustoms = function () {
  var rect = this.getViewRect();
  return {
    coordSys: {
      type: COMPONENT_TYPE,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: echarts.util.bind(this.dataToPoint, this),
      size: echarts.util.bind(dataToCoordSize, this)
    }
  };
};
function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return echarts.util.map([0, 1], function (dimIdx) {
    var val = dataItem[dimIdx];
    var halfSize = dataSize[dimIdx] / 2;
    var p1 = [];
    var p2 = [];
    p1[dimIdx] = val - halfSize;
    p2[dimIdx] = val + halfSize;
    p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
    return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
  }, this);
}
BingMapCoordSys.dimensions = BingMapCoordSys.prototype.dimensions;
BingMapCoordSys.create = function (ecModel, api) {
  var bingmapCoordSys;
  var root = api.getDom();
  ecModel.eachComponent(COMPONENT_TYPE, function (bingmapModel) {
    var painter = api.getZr().painter;
    var viewportRoot = painter.getViewportRoot();
    if (typeof Microsoft === 'undefined' || typeof Microsoft.Maps === 'undefined' || typeof Microsoft.Maps.Map === 'undefined') {
      throw new Error('It seems that Bing Map API has not been loaded completely yet.');
    }
    if (bingmapCoordSys) {
      throw new Error('Only one bingmap component can exist');
    }
    if (!bingmapModel.__bingmap) {
      var bingmapRoot = root.querySelector('.ec-extension-bing-map');
      viewportRoot.className = 'ms-composite';
      viewportRoot.style.visibility = 'hidden';
      if (bingmapRoot) {
        viewportRoot.style.left = '0px';
        viewportRoot.style.top = '0px';
        viewportRoot.style.width = '100%';
        viewportRoot.style.height = '100%';
        viewportRoot.style.position = 'absolute';
        root.removeChild(bingmapRoot);
      }
      bingmapRoot = document.createElement('div');
      bingmapRoot.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;';
      bingmapRoot.className = 'ec-extension-bing-map';
      root.appendChild(bingmapRoot);
      var _bingmap = bingmapModel.__bingmap = new Microsoft.Maps.Map(bingmapRoot);
      var mapOption = bingmapModel.get('mapOption') || {};
      _bingmap.setOptions(mapOption);
      bingmapRoot.querySelector('.MicrosoftMap').appendChild(viewportRoot);
      viewportRoot.style.visibility = '';
      painter.getViewportRootOffset = function () {
        return {
          offsetLeft: 0,
          offsetTop: 0
        };
      };
    }
    var bingmap = bingmapModel.__bingmap;
    var viewOption = bingmapModel.get('viewOption');
    var center = viewOption.center,
      zoom = viewOption.zoom;
    var normalizedCenter = [center.lng !== undefined ? center.lng : center[0], center.lat !== undefined ? center.lat : center[1]];
    if (center && zoom) {
      var bingmapCenter = bingmap.getCenter();
      var bingmapZoom = bingmap.getZoom();
      var centerOrZoomChanged = bingmapModel.centerOrZoomChanged([bingmapCenter.longitude, bingmapCenter.latitude], bingmapZoom);
      if (centerOrZoomChanged) {
        var pt = new Microsoft.Maps.Location(normalizedCenter[1], normalizedCenter[0]);
        bingmap.setView({
          center: pt,
          zoom: zoom
        });
      }
    }
    bingmapCoordSys = new BingMapCoordSys(bingmap, api);
    bingmapCoordSys.setMapOffset(bingmapModel.__mapOffset || [0, 0]);
    bingmapCoordSys.setZoom(zoom);
    bingmapCoordSys.setCenter(center);
    bingmapModel.coordinateSystem = bingmapCoordSys;
  });
  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.get('coordinateSystem') === COMPONENT_TYPE) {
      seriesModel.coordinateSystem = bingmapCoordSys;
    }
  });
};

var name = "echarts-extension-bingmaps";
var version = "1.0.4";

/**
 * BingMap extension installer
 * @param {EChartsExtensionRegisters} registers
 */
function install(registers) {
  // add coordinate system support for pie series for ECharts < 5.4.0
  if (!isNewEC || ecVer[0] == 5 && ecVer[1] < 4) {
    registers.registerLayout(function (ecModel) {
      ecModel.eachSeriesByType('pie', function (seriesModel) {
        var coordSys = seriesModel.coordinateSystem;
        var data = seriesModel.getData();
        var valueDim = data.mapDimension('value');
        if (coordSys && coordSys.type === COMPONENT_TYPE) {
          var center = seriesModel.get('center');
          var point = coordSys.dataToPoint(center);
          var cx = point[0];
          var cy = point[1];
          data.each(valueDim, function (value, idx) {
            var layout = data.getItemLayout(idx);
            layout.cx = cx;
            layout.cy = cy;
          });
        }
      });
    });
  }
  // Model
  isNewEC ? registers.registerComponentModel(BingMapModel$1) : registers.extendComponentModel(BingMapModel$1);
  // View
  isNewEC ? registers.registerComponentView(BingMapView$1) : registers.extendComponentView(BingMapView$1);
  // Coordinate System
  registers.registerCoordinateSystem(COMPONENT_TYPE, BingMapCoordSys);
  // Action
  registers.registerAction({
    type: COMPONENT_TYPE + 'Roam',
    event: COMPONENT_TYPE + 'Roam',
    update: 'updateLayout'
  }, function (payload, ecModel) {
    ecModel.eachComponent('bingmap', function (bingMapModel) {
      var bingmap = bingMapModel.getBingMap();
      var center = bingmap.getCenter();
      bingMapModel.setCenterAndZoom([center.longitude, center.latitude], bingmap.getZoom());
    });
  });
}

isNewEC ? echarts.use(install) : install(echarts);

exports.name = name;
exports.version = version;
