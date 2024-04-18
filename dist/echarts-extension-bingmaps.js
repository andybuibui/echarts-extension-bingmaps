/** 
 * echarts-extension-bingmaps 
 * @version 1.0.0
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
import * as m from "echarts";
import { graphic as w, matrix as b, util as h } from "echarts";
function C(t, o) {
  return t && o && t[0] === o[0] && t[1] === o[1];
}
m.extendComponentModel({
  type: "bingmap",
  setBingMap: function(t) {
    this.__bingmap = t;
  },
  getBingMap: function() {
    return this.__bingmap;
  },
  setEChartsLayer: function(t) {
    this.__echartsLayer = t;
  },
  getEChartsLayer: function() {
    return this.__echartsLayer;
  },
  setCenterAndZoom: function(t, o) {
    this.option.viewOption.center = t, this.option.viewOption.zoom = o;
  },
  centerOrZoomChanged: function(t, o) {
    let e = this.option.viewOption;
    return !(C(t, e.center) && o === e.zoom);
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
});
m.extendComponentView({
  type: "bingmap",
  render: function(t, o, e) {
    let i = !0, n = t.getBingMap(), c = e.getZr().painter.getViewportRoot(), r = t.coordinateSystem, l = function(u) {
      if (i)
        return;
      let a = c.parentNode.parentNode.parentNode, f = [
        -parseInt(a.style.left, 10) || 0,
        -parseInt(a.style.top, 10) || 0
      ];
      c.style.left = f[0] + "px", c.style.top = f[1] + "px", r.setMapOffset(f), t.__mapOffset = f, e.dispatchAction({
        type: "bingmapRoam"
      });
    };
    Microsoft.Maps.Events.removeHandler(this._oldViewChangeHandler), this._oldViewChangeHandler = Microsoft.Maps.Events.addHandler(
      n,
      "viewchangeend",
      l
    ), Microsoft.Maps.Events.removeHandler(this._oldmapresize), this._oldmapresize = Microsoft.Maps.Events.addHandler(n, "mapresize", l), i = !1;
  }
});
function s(t, o) {
  this._bingmap = t, this.dimensions = ["lng", "lat"], this._mapOffset = [0, 0], this._api = o;
}
s.prototype.dimensions = ["lng", "lat"];
s.prototype.setZoom = function(t) {
  this._zoom = t;
};
s.prototype.setCenter = function(t) {
  this._center = this._bingmap.tryLocationToPixel(
    new Microsoft.Maps.Location(t[1], t[0])
  );
};
s.prototype.setMapOffset = function(t) {
  this._mapOffset = t;
};
s.prototype.getBingMap = function() {
  return this._bingmap;
};
s.prototype.dataToPoint = function(t) {
  let o = new Microsoft.Maps.Location(t[1], t[0]), e = this._bingmap.tryLocationToPixel(o, Microsoft.Maps.PixelReference.control), i = this._mapOffset;
  return [e.x - i[0], e.y - i[1]];
};
s.prototype.pointToData = function(t) {
  let o = this._mapOffset;
  const e = this._bingmap.tryPixelToLocation(
    {
      x: t[0] + o[0],
      y: t[1] + o[1]
    },
    Microsoft.Maps.PixelReference.control
  );
  return [e.longitude, e.latitude];
};
s.prototype.getViewRect = function() {
  let t = this._api;
  return new w.BoundingRect(0, 0, t.getWidth(), t.getHeight());
};
s.prototype.getRoamTransform = function() {
  return b.create();
};
s.prototype.prepareCustoms = function() {
  let t = this.getViewRect();
  return {
    coordSys: {
      type: "bingmap",
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height
    },
    api: {
      coord: h.bind(this.dataToPoint, this),
      size: h.bind(O, this)
    }
  };
};
function O(t, o) {
  return o = o || [0, 0], h.map(
    [0, 1],
    function(e) {
      let i = o[e], n = t[e] / 2, c = [], r = [];
      return c[e] = i - n, r[e] = i + n, c[1 - e] = r[1 - e] = o[1 - e], Math.abs(this.dataToPoint(c)[e] - this.dataToPoint(r)[e]);
    },
    this
  );
}
s.dimensions = s.prototype.dimensions;
s.create = function(t, o) {
  let e, i = o.getDom();
  t.eachComponent("bingmap", function(n) {
    let c = o.getZr().painter, r = c.getViewportRoot();
    if (typeof Microsoft > "u" || typeof Microsoft.Maps > "u" || typeof Microsoft.Maps.Map > "u")
      throw new Error("It seems that Bing Map API has not been loaded completely yet.");
    if (e)
      throw new Error("Only one bingmap component can exist");
    if (!n.__bingmap) {
      let p = i.querySelector(".ec-extension-bing-map");
      r.className = "ms-composite", r.style.visibility = "hidden", p && (r.style.left = "0px", r.style.top = "0px", r.style.width = "100%", r.style.height = "100%", r.style.position = "absolute", i.removeChild(p)), p = document.createElement("div"), p.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;", p.className = "ec-extension-bing-map", i.appendChild(p);
      const g = n.__bingmap = new Microsoft.Maps.Map(p);
      let d = n.get("mapOption") || {};
      g.setOptions(d), p.querySelector(".MicrosoftMap").appendChild(r), r.style.visibility = "", c.getViewportRootOffset = function() {
        return {
          offsetLeft: 0,
          offsetTop: 0
        };
      };
    }
    const l = n.__bingmap;
    let u = n.get("viewOption"), { center: a, zoom: f } = u, y = [
      a.lng !== void 0 ? a.lng : a[0],
      a.lat !== void 0 ? a.lat : a[1]
    ];
    if (a && f) {
      let p = l.getCenter(), g = l.getZoom();
      if (n.centerOrZoomChanged(
        [p.longitude, p.latitude],
        g
      )) {
        let _ = new Microsoft.Maps.Location(y[1], y[0]);
        l.setView({
          center: _,
          zoom: f
        });
      }
    }
    e = new s(l, o), e.setMapOffset(n.__mapOffset || [0, 0]), e.setZoom(f), e.setCenter(a), n.coordinateSystem = e;
  }), t.eachSeries(function(n) {
    n.get("coordinateSystem") === "bingmap" && (n.coordinateSystem = e);
  });
};
const v = "echarts-extension-bingmaps", x = "1.0.0";
m.registerCoordinateSystem("bingmap", s);
m.registerAction(
  {
    type: "bingmapRoam",
    event: "bingmapRoam",
    update: "updateLayout"
  },
  function(t, o) {
    o.eachComponent("bingmap", function(e) {
      const i = e.getBingMap(), n = i.getCenter();
      e.setCenterAndZoom([n.longitude, n.latitude], i.getZoom());
    });
  }
);
export {
  v as name,
  x as version
};
