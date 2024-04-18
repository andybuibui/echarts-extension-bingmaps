import { graphic, matrix, util as zrUtil } from 'echarts';

function BingMapCoordSys(bingmap, api) {
  this._bingmap = bingmap;
  this.dimensions = ['lng', 'lat'];
  this._mapOffset = [0, 0];
  this._api = api;
}

BingMapCoordSys.prototype.dimensions = ['lng', 'lat'];

BingMapCoordSys.prototype.setZoom = function (zoom) {
  this._zoom = zoom;
};

BingMapCoordSys.prototype.setCenter = function (center) {
  this._center = this._bingmap.tryLocationToPixel(
    new Microsoft.Maps.Location(center[1], center[0]),
  );
};

BingMapCoordSys.prototype.setMapOffset = function (mapOffset) {
  this._mapOffset = mapOffset;
};

BingMapCoordSys.prototype.getBingMap = function () {
  return this._bingmap;
};

BingMapCoordSys.prototype.dataToPoint = function (data) {
  let lnglat = new Microsoft.Maps.Location(data[1], data[0]);
  let px = this._bingmap.tryLocationToPixel(lnglat, Microsoft.Maps.PixelReference.control);
  let mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

BingMapCoordSys.prototype.pointToData = function (pt) {
  let mapOffset = this._mapOffset;
  const ptN = this._bingmap.tryPixelToLocation(
    {
      x: pt[0] + mapOffset[0],
      y: pt[1] + mapOffset[1],
    },
    Microsoft.Maps.PixelReference.control,
  );

  return [ptN.longitude, ptN.latitude];
};

BingMapCoordSys.prototype.getViewRect = function () {
  let api = this._api;
  return new graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

BingMapCoordSys.prototype.getRoamTransform = function () {
  return matrix.create();
};

BingMapCoordSys.prototype.prepareCustoms = function () {
  let rect = this.getViewRect();
  return {
    coordSys: {
      type: 'bingmap',
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
    api: {
      coord: zrUtil.bind(this.dataToPoint, this),
      size: zrUtil.bind(dataToCoordSize, this),
    },
  };
};

function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return zrUtil.map(
    [0, 1],
    function (dimIdx) {
      let val = dataItem[dimIdx];
      let halfSize = dataSize[dimIdx] / 2;
      let p1 = [];
      let p2 = [];
      p1[dimIdx] = val - halfSize;
      p2[dimIdx] = val + halfSize;
      p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
      return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
    },
    this,
  );
}

BingMapCoordSys.dimensions = BingMapCoordSys.prototype.dimensions;

BingMapCoordSys.create = function (ecModel, api) {
  let bingmapCoordSys;
  let root = api.getDom();

  ecModel.eachComponent('bingmap', function (bingmapModel) {
    let painter = api.getZr().painter;
    let viewportRoot = painter.getViewportRoot();

    if (
      typeof Microsoft === 'undefined' ||
      typeof Microsoft.Maps === 'undefined' ||
      typeof Microsoft.Maps.Map === 'undefined'
    ) {
      throw new Error('It seems that Bing Map API has not been loaded completely yet.');
    }

    if (bingmapCoordSys) {
      throw new Error('Only one bingmap component can exist');
    }

    if (!bingmapModel.__bingmap) {
      let bingmapRoot = root.querySelector('.ec-extension-bing-map');
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
      const bingmap = (bingmapModel.__bingmap = new Microsoft.Maps.Map(bingmapRoot));
      let mapOption = bingmapModel.get('mapOption') || {};
      bingmap.setOptions(mapOption);
      bingmapRoot.querySelector('.MicrosoftMap').appendChild(viewportRoot);
      viewportRoot.style.visibility = '';
      painter.getViewportRootOffset = function () {
        return {
          offsetLeft: 0,
          offsetTop: 0,
        };
      };
    }

    const bingmap = bingmapModel.__bingmap;
    let viewOption = bingmapModel.get('viewOption');
    let { center, zoom } = viewOption;
    let normalizedCenter = [
      center.lng !== undefined ? center.lng : center[0],
      center.lat !== undefined ? center.lat : center[1],
    ];

    if (center && zoom) {
      let bingmapCenter = bingmap.getCenter();
      let bingmapZoom = bingmap.getZoom();
      let centerOrZoomChanged = bingmapModel.centerOrZoomChanged(
        [bingmapCenter.longitude, bingmapCenter.latitude],
        bingmapZoom,
      );
      if (centerOrZoomChanged) {
        let pt = new Microsoft.Maps.Location(normalizedCenter[1], normalizedCenter[0]);
        bingmap.setView({
          center: pt,
          zoom: zoom,
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
    if (seriesModel.get('coordinateSystem') === 'bingmap') {
      seriesModel.coordinateSystem = bingmapCoordSys;
    }
  });
};

export default BingMapCoordSys;
