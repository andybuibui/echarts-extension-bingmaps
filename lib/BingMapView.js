import { ComponentView } from 'echarts'
import { COMPONENT_TYPE, isNewEC } from './util'

const BingMapView = {
  type: COMPONENT_TYPE,
  init() {
    this._isFirstRender = true
  },

  render: function (bingMapModel, ecModel, api) {
    let rendering = true;
    let bingmap = bingMapModel.getBingMap();
    let viewportRoot = api.getZr().painter.getViewportRoot();
    let coordSys = bingMapModel.coordinateSystem;

    let viewChangeHandler = function (arg) {
      if (rendering) {
        return;
      }

      let offsetEl = viewportRoot.parentNode.parentNode.parentNode;
      let mapOffset = [
        -parseInt(offsetEl.style.left, 10) || 0,
        -parseInt(offsetEl.style.top, 10) || 0,
      ];
      viewportRoot.style.left = mapOffset[0] + 'px';
      viewportRoot.style.top = mapOffset[1] + 'px';
      coordSys.setMapOffset(mapOffset);
      bingMapModel.__mapOffset = mapOffset;
      api.dispatchAction({
        type: 'bingmapRoam',
      });
    };
    Microsoft.Maps.Events.removeHandler(this._oldViewChangeHandler);
    this._oldViewChangeHandler = Microsoft.Maps.Events.addHandler(
      bingmap,
      'viewchangeend',
      viewChangeHandler,
    );
    Microsoft.Maps.Events.removeHandler(this._oldmapresize);
    this._oldmapresize = Microsoft.Maps.Events.addHandler(bingmap, 'mapresize', viewChangeHandler);
    this._isFirstRender = rendering = false;
    this.__viewChangeHandler = viewChangeHandler;
  },
  dispose() {
    const component = this.__model
    if (component) {
      component.getBingMap().dispose()
      component.setBingMap(null)
      component.setEChartsLayer(null)
      if (component.coordinateSystem) {
        component.coordinateSystem.setBingMap(null)
        component.coordinateSystem = null
      }
    }
    delete this.__viewChangeHandler
  }
}

export default isNewEC
  ? ComponentView.extend(BingMapView)
  : BingMapView
