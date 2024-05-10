import BingMapModel from './BingMapModel';
import BingMapView from './BingMapView';
import BingMapCoordSys from './BingMapCoordSys';
import { isNewEC, ecVer, COMPONENT_TYPE } from './util';

export { version, name } from '../package.json';

/**
 * BingMap extension installer
 * @param {EChartsExtensionRegisters} registers
 */
export function install(registers) {
  // add coordinate system support for pie series for ECharts < 5.4.0
  if (!isNewEC || (ecVer[0] == 5 && ecVer[1] < 4)) {
    registers.registerLayout(function (ecModel) {
      ecModel.eachSeriesByType('pie', function (seriesModel) {
        const coordSys = seriesModel.coordinateSystem;
        const data = seriesModel.getData();
        const valueDim = data.mapDimension('value');
        if (coordSys && coordSys._type === COMPONENT_TYPE) {
          const center = seriesModel.get('center');
          const point = coordSys.dataToPoint(center);
          const cx = point[0];
          const cy = point[1];
          data.each(valueDim, function (value, idx) {
            const layout = data.getItemLayout(idx);
            layout.cx = cx;
            layout.cy = cy;
          });
        }
      });
    });
  }
  // Model
  isNewEC
    ? registers.registerComponentModel(BingMapModel)
    : registers.extendComponentModel(BingMapModel);
  // View
  isNewEC
    ? registers.registerComponentView(BingMapView)
    : registers.extendComponentView(BingMapView);
  // Coordinate System
  registers.registerCoordinateSystem(COMPONENT_TYPE, BingMapCoordSys);
  // Action
  registers.registerAction(
    {
      type: COMPONENT_TYPE + 'Roam',
      event: COMPONENT_TYPE + 'Roam',
      update: 'updateLayout',
    },
    function (payload, ecModel) {
      ecModel.eachComponent('bingmap', function (bingMapModel) {
        const bingmap = bingMapModel.getBingMap();
        const center = bingmap.getCenter();
        bingMapModel.setCenterAndZoom([center.longitude, center.latitude], bingmap.getZoom());
      });
    },
  );
}
