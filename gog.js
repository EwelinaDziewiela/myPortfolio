!function (a, b) {
  "use strict";
  function c() {
    if (!d.READY) {
      d.event.determineEventTypes();
      for (var a in d.gestures)d.gestures.hasOwnProperty(a) && d.detection.register(d.gestures[a]);
      d.event.onTouch(d.DOCUMENT, d.EVENT_MOVE, d.detection.detect), d.event.onTouch(d.DOCUMENT, d.EVENT_END, d.detection.detect), d.READY = !0
    }
  }

  var d = function (a, b) {
    return new d.Instance(a, b || {})
  };
  d.defaults = {
    stop_browser_behavior: {
      userSelect: "none",
      touchAction: "manipulation",
      touchCallout: "none",
      contentZooming: "none",
      userDrag: "none",
      tapHighlightColor: "rgba(0,0,0,0)"
    }
  }, d.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, d.HAS_TOUCHEVENTS = "ontouchstart" in a, d.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, d.NO_MOUSEEVENTS = d.HAS_TOUCHEVENTS && navigator.userAgent.match(d.MOBILE_REGEX), d.EVENT_TYPES = {}, d.DIRECTION_DOWN = "down", d.DIRECTION_LEFT = "left", d.DIRECTION_UP = "up", d.DIRECTION_RIGHT = "right", d.POINTER_MOUSE = "mouse", d.POINTER_TOUCH = "touch", d.POINTER_PEN = "pen", d.EVENT_START = "start", d.EVENT_MOVE = "move", d.EVENT_END = "end", d.DOCUMENT = document, d.plugins = {}, d.READY = !1, d.Instance = function (a, b) {
    var e = this;
    return c(), this.element = a, this.enabled = !0, this.options = d.utils.extend(d.utils.extend({}, d.defaults), b || {}), this.options.stop_browser_behavior && d.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), d.event.onTouch(a, d.EVENT_START, function (a) {
      e.enabled && d.detection.startDetect(e, a)
    }), this
  }, d.Instance.prototype = {
    on: function (a, b) {
      for (var c = a.split(" "), d = 0; d < c.length; d++)this.element.addEventListener(c[d], b, !1);
      return this
    }, off: function (a, b) {
      for (var c = a.split(" "), d = 0; d < c.length; d++)this.element.removeEventListener(c[d], b, !1);
      return this
    }, trigger: function (a, b) {
      var c = d.DOCUMENT.createEvent("Event");
      c.initEvent(a, !0, !0), c.gesture = b;
      var e = this.element;
      return d.utils.hasParent(b.target, e) && (e = b.target), e.dispatchEvent(c), this
    }, enable: function (a) {
      return this.enabled = a, this
    }
  };
  var e = null, f = !1, g = !1;
  d.event = {
    bindDom: function (a, b, c) {
      for (var d = b.split(" "), e = 0; e < d.length; e++)a.addEventListener(d[e], c, !1)
    }, onTouch: function (a, b, c) {
      var h = this;
      this.bindDom(a, d.EVENT_TYPES[b], function (i) {
        var j = i.type.toLowerCase();
        if (!j.match(/mouse/) || !g) {
          (j.match(/touch/) || j.match(/pointerdown/) || j.match(/mouse/) && 1 === i.which) && (f = !0), j.match(/touch|pointer/) && (g = !0);
          var k = 0;
          f && (d.HAS_POINTEREVENTS && b != d.EVENT_END ? k = d.PointerEvent.updatePointer(b, i) : j.match(/touch/) ? k = i.touches.length : g || (k = j.match(/up/) ? 0 : 1), k > 0 && b == d.EVENT_END ? b = d.EVENT_MOVE : k || (b = d.EVENT_END), k || null === e ? e = i : i = e, c.call(d.detection, h.collectEventData(a, b, i)), d.HAS_POINTEREVENTS && b == d.EVENT_END && (k = d.PointerEvent.updatePointer(b, i))), k || (e = null, f = !1, g = !1, d.PointerEvent.reset())
        }
      })
    }, determineEventTypes: function () {
      var a;
      a = d.HAS_POINTEREVENTS ? d.PointerEvent.getEvents() : d.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], d.EVENT_TYPES[d.EVENT_START] = a[0], d.EVENT_TYPES[d.EVENT_MOVE] = a[1], d.EVENT_TYPES[d.EVENT_END] = a[2]
    }, getTouchList: function (a) {
      return d.HAS_POINTEREVENTS ? d.PointerEvent.getTouchList() : a.touches ? a.touches : [{
        identifier: 1,
        pageX: a.pageX,
        pageY: a.pageY,
        target: a.target
      }]
    }, collectEventData: function (a, b, c) {
      var e = this.getTouchList(c, b), f = d.POINTER_TOUCH;
      return (c.type.match(/mouse/) || d.PointerEvent.matchType(d.POINTER_MOUSE, c)) && (f = d.POINTER_MOUSE), {
        center: d.utils.getCenter(e),
        timeStamp: (new Date).getTime(),
        target: c.target,
        touches: e,
        eventType: b,
        pointerType: f,
        srcEvent: c,
        preventDefault: function () {
          this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
        },
        stopPropagation: function () {
          this.srcEvent.stopPropagation()
        },
        stopDetect: function () {
          return d.detection.stopDetect()
        }
      }
    }
  }, d.PointerEvent = {
    pointers: {}, getTouchList: function () {
      var a = this, b = [];
      return Object.keys(a.pointers).sort().forEach(function (c) {
        b.push(a.pointers[c])
      }), b
    }, updatePointer: function (a, b) {
      return a == d.EVENT_END ? this.pointers = {} : (b.identifier = b.pointerId, this.pointers[b.pointerId] = b), Object.keys(this.pointers).length
    }, matchType: function (a, b) {
      if (!b.pointerType)return !1;
      var c = {};
      return c[d.POINTER_MOUSE] = b.pointerType == b.MSPOINTER_TYPE_MOUSE || b.pointerType == d.POINTER_MOUSE, c[d.POINTER_TOUCH] = b.pointerType == b.MSPOINTER_TYPE_TOUCH || b.pointerType == d.POINTER_TOUCH, c[d.POINTER_PEN] = b.pointerType == b.MSPOINTER_TYPE_PEN || b.pointerType == d.POINTER_PEN, c[a]
    }, getEvents: function () {
      return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
    }, reset: function () {
      this.pointers = {}
    }
  }, d.utils = {
    extend: function (a, c, d) {
      for (var e in c)a[e] !== b && d || (a[e] = c[e]);
      return a
    }, hasParent: function (a, b) {
      for (; a;) {
        if (a == b)return !0;
        a = a.parentNode
      }
      return !1
    }, getCenter: function (a) {
      for (var b = [], c = [], d = 0, e = a.length; d < e; d++)b.push(a[d].pageX), c.push(a[d].pageY);
      return {
        pageX: (Math.min.apply(Math, b) + Math.max.apply(Math, b)) / 2,
        pageY: (Math.min.apply(Math, c) + Math.max.apply(Math, c)) / 2
      }
    }, getVelocity: function (a, b, c) {
      return {x: Math.abs(b / a) || 0, y: Math.abs(c / a) || 0}
    }, getAngle: function (a, b) {
      var c = b.pageY - a.pageY, d = b.pageX - a.pageX;
      return 180 * Math.atan2(c, d) / Math.PI
    }, getDirection: function (a, b) {
      return Math.abs(a.pageX - b.pageX) >= Math.abs(a.pageY - b.pageY) ? a.pageX - b.pageX > 0 ? d.DIRECTION_LEFT : d.DIRECTION_RIGHT : a.pageY - b.pageY > 0 ? d.DIRECTION_UP : d.DIRECTION_DOWN
    }, getDistance: function (a, b) {
      var c = b.pageX - a.pageX, d = b.pageY - a.pageY;
      return Math.sqrt(c * c + d * d)
    }, getScale: function (a, b) {
      return a.length >= 2 && b.length >= 2 ? this.getDistance(b[0], b[1]) / this.getDistance(a[0], a[1]) : 1
    }, getRotation: function (a, b) {
      return a.length >= 2 && b.length >= 2 ? this.getAngle(b[1], b[0]) - this.getAngle(a[1], a[0]) : 0
    }, isVertical: function (a) {
      return a == d.DIRECTION_UP || a == d.DIRECTION_DOWN
    }, stopDefaultBrowserBehavior: function (a, b) {
      var c, d = ["webkit", "khtml", "moz", "ms", "o", ""];
      if (b && a.style) {
        for (var e = 0; e < d.length; e++)for (var f in b)b.hasOwnProperty(f) && (c = f, d[e] && (c = d[e] + c.substring(0, 1).toUpperCase() + c.substring(1)), a.style[c] = b[f]);
        "none" == b.userSelect && (a.onselectstart = function () {
          return !1
        })
      }
    }
  }, d.detection = {
    gestures: [], current: null, previous: null, stopped: !1, startDetect: function (a, b) {
      this.current || (this.stopped = !1, this.current = {
        inst: a,
        startEvent: d.utils.extend({}, b),
        lastEvent: !1,
        name: ""
      }, this.detect(b))
    }, detect: function (a) {
      if (this.current && !this.stopped) {
        a = this.extendEventData(a);
        for (var b = this.current.inst.options, c = 0, e = this.gestures.length; c < e; c++) {
          var f = this.gestures[c];
          if (!this.stopped && b[f.name] !== !1 && f.handler.call(f, a, this.current.inst) === !1) {
            this.stopDetect();
            break
          }
        }
        return this.current && (this.current.lastEvent = a), a.eventType == d.EVENT_END && !a.touches.length - 1 && this.stopDetect(), a
      }
    }, stopDetect: function () {
      this.previous = d.utils.extend({}, this.current), this.current = null, this.stopped = !0
    }, extendEventData: function (a) {
      var b = this.current.startEvent;
      if (b && (a.touches.length != b.touches.length || a.touches === b.touches)) {
        b.touches = [];
        for (var c = 0, e = a.touches.length; c < e; c++)b.touches.push(d.utils.extend({}, a.touches[c]))
      }
      var f = a.timeStamp - b.timeStamp, g = a.center.pageX - b.center.pageX, h = a.center.pageY - b.center.pageY, i = d.utils.getVelocity(f, g, h);
      return d.utils.extend(a, {
        deltaTime: f,
        deltaX: g,
        deltaY: h,
        velocityX: i.x,
        velocityY: i.y,
        distance: d.utils.getDistance(b.center, a.center),
        angle: d.utils.getAngle(b.center, a.center),
        direction: d.utils.getDirection(b.center, a.center),
        scale: d.utils.getScale(b.touches, a.touches),
        rotation: d.utils.getRotation(b.touches, a.touches),
        startEvent: b
      }), a
    }, register: function (a) {
      var c = a.defaults || {};
      return c[a.name] === b && (c[a.name] = !0), d.utils.extend(d.defaults, c, !0), a.index = a.index || 1e3, this.gestures.push(a), this.gestures.sort(function (a, b) {
        return a.index < b.index ? -1 : a.index > b.index ? 1 : 0
      }), this.gestures
    }
  }, d.gestures = d.gestures || {}, d.gestures.Hold = {
    name: "hold",
    index: 10,
    defaults: {hold_timeout: 500, hold_threshold: 1},
    timer: null,
    handler: function (a, b) {
      switch (a.eventType) {
        case d.EVENT_START:
          clearTimeout(this.timer), d.detection.current.name = this.name, this.timer = setTimeout(function () {
            "hold" == d.detection.current.name && b.trigger("hold", a)
          }, b.options.hold_timeout);
          break;
        case d.EVENT_MOVE:
          a.distance > b.options.hold_threshold && clearTimeout(this.timer);
          break;
        case d.EVENT_END:
          clearTimeout(this.timer)
      }
    }
  }, d.gestures.Tap = {
    name: "tap",
    index: 100,
    defaults: {
      tap_max_touchtime: 250,
      tap_max_distance: 10,
      tap_always: !0,
      doubletap_distance: 20,
      doubletap_interval: 300
    },
    handler: function (a, b) {
      if (a.eventType == d.EVENT_END) {
        var c = d.detection.previous, e = !1;
        if (a.deltaTime > b.options.tap_max_touchtime || a.distance > b.options.tap_max_distance)return;
        c && "tap" == c.name && a.timeStamp - c.lastEvent.timeStamp < b.options.doubletap_interval && a.distance < b.options.doubletap_distance && (b.trigger("doubletap", a), e = !0), e && !b.options.tap_always || (d.detection.current.name = "tap", b.trigger(d.detection.current.name, a))
      }
    }
  }, d.gestures.Swipe = {
    name: "swipe",
    index: 40,
    defaults: {swipe_max_touches: 1, swipe_velocity: .7},
    handler: function (a, b) {
      if (a.eventType == d.EVENT_END) {
        if (b.options.swipe_max_touches > 0 && a.touches.length > b.options.swipe_max_touches)return;
        (a.velocityX > b.options.swipe_velocity || a.velocityY > b.options.swipe_velocity) && (b.trigger(this.name, a), b.trigger(this.name + a.direction, a))
      }
    }
  }, d.gestures.Drag = {
    name: "drag",
    index: 50,
    defaults: {
      drag_min_distance: 10,
      drag_max_touches: 1,
      drag_block_horizontal: !1,
      drag_block_vertical: !1,
      drag_lock_to_axis: !1,
      drag_lock_min_distance: 25
    },
    triggered: !1,
    handler: function (a, b) {
      if (d.detection.current.name != this.name && this.triggered)return b.trigger(this.name + "end", a), void(this.triggered = !1);
      if (!(b.options.drag_max_touches > 0 && a.touches.length > b.options.drag_max_touches))switch (a.eventType) {
        case d.EVENT_START:
          this.triggered = !1;
          break;
        case d.EVENT_MOVE:
          if (a.distance < b.options.drag_min_distance && d.detection.current.name != this.name)return;
          d.detection.current.name = this.name, (d.detection.current.lastEvent.drag_locked_to_axis || b.options.drag_lock_to_axis && b.options.drag_lock_min_distance <= a.distance) && (a.drag_locked_to_axis = !0);
          var c = d.detection.current.lastEvent.direction;
          a.drag_locked_to_axis && c !== a.direction && (d.utils.isVertical(c) ? a.direction = a.deltaY < 0 ? d.DIRECTION_UP : d.DIRECTION_DOWN : a.direction = a.deltaX < 0 ? d.DIRECTION_LEFT : d.DIRECTION_RIGHT), this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), b.trigger(this.name + a.direction, a), (b.options.drag_block_vertical && d.utils.isVertical(a.direction) || b.options.drag_block_horizontal && !d.utils.isVertical(a.direction)) && a.preventDefault();
          break;
        case d.EVENT_END:
          this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
      }
    }
  }, d.gestures.Transform = {
    name: "transform",
    index: 45,
    defaults: {transform_min_scale: .01, transform_min_rotation: 1, transform_always_block: !1},
    triggered: !1,
    handler: function (a, b) {
      if (d.detection.current.name != this.name && this.triggered)return b.trigger(this.name + "end", a), void(this.triggered = !1);
      if (!(a.touches.length < 2))switch (b.options.transform_always_block && a.preventDefault(), a.eventType) {
        case d.EVENT_START:
          this.triggered = !1;
          break;
        case d.EVENT_MOVE:
          var c = Math.abs(1 - a.scale), e = Math.abs(a.rotation);
          if (c < b.options.transform_min_scale && e < b.options.transform_min_rotation)return;
          d.detection.current.name = this.name, this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), e > b.options.transform_min_rotation && b.trigger("rotate", a), c > b.options.transform_min_scale && (b.trigger("pinch", a), b.trigger("pinch" + (a.scale < 1 ? "in" : "out"), a));
          break;
        case d.EVENT_END:
          this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
      }
    }
  }, d.gestures.Touch = {
    name: "touch",
    index: -(1 / 0),
    defaults: {prevent_default: !1, prevent_mouseevents: !1},
    handler: function (a, b) {
      if (b.options.prevent_mouseevents && a.pointerType == d.POINTER_MOUSE)return void a.stopDetect();
      b.options.prevent_default && a.preventDefault(), a.eventType == d.EVENT_START && b.trigger(this.name, a)
    }
  }, d.gestures.Release = {
    name: "release", index: 1 / 0, handler: function (a, b) {
      a.eventType == d.EVENT_END && b.trigger(this.name, a)
    }
  }, "object" == typeof module && "object" == typeof module.exports ? module.exports = d : (a.Hammer = d, "function" == typeof a.define && a.define.amd && a.define("hammer", [], function () {
    return d
  }))
}(this);
angular.module("gog").factory("gogTimer", ["$timeout", "$window", function (a, b) {
  var c, d, e, f, g, h, i, j, k;
  return g = Math.floor((new b.Date).getTime() / 1e3), c = [], d = 0, f = !1, k = null, i = function () {
    return f = !0, j()
  }, e = function () {
    f = !1, a.cancel(k)
  }, h = function (a) {
    var b, e, f;
    if (d <= 0)return !1;
    for (e = 0, f = c.length; e < f; e++)b = c[e], b && b(a)
  }, j = function () {
    var c;
    if (c = Math.floor((new b.Date).getTime() / 1e3), c > g && (h(c), g = c), !f)return !1;
    k = a(j, 1e3)
  }, {
    addCallback: function (a) {
      return c.indexOf(a) === -1 && (d = c.push(a), f || i(), a(g))
    }, removeCallback: function (a) {
      var b;
      return b = c.indexOf(a), b !== -1 && (c.splice(b, 1), d -= 1, 0 === d && f ? e() : void 0)
    }
  }
}]);
gog.directive("gogCounter", ["$window", "gogTimer", "paddingFilter", function (a, b, c) {
  var d, e, f, g, h, i, j;
  return d = 86400, e = 3600, f = 60, i = Math.floor((new Date).getTime() / 1e3), h = a.gogData.now || i, j = i, g = function (a, g, i, k) {
    var l, m, n, o, p, q, r, s, t, u, v;
    return o = {hasEnded: !1, isLast48Hours: !1, padded: {}}, t = null, p = null, m = null, r = function () {
      return a.counter = o, m = i.$observe("gogCounter", s), a.$on("$destroy", u)
    }, s = function (a) {
      return isNaN(parseInt(a)) ? void q() : (l(a), b.addCallback(n))
    }, l = function (a) {
      return t = parseInt(a, 10), p = t - h
    }, q = function () {
      return b.removeCallback(n), o.hasEnded = !0
    }, v = function (a, b) {
      var g, h, i, j;
      return g = Math.floor(b / d), b -= g * d, h = Math.floor(b / e), b -= h * e, i = Math.floor(b / f), b -= i * f, j = b, a.days = g, a.hours = h, a.hours48 = h + 24 * g, a.minutes = i, a.seconds = j, a.padded.days = c(g, 2), a.padded.hours = c(h, 2), a.padded.hours48 = c(a.hours48, 2), a.padded.minutes = c(a.minutes, 2), a.padded.seconds = c(a.seconds, 2), a.isLast48Hours = g < 2, a
    }, n = function (a) {
      var b;
      if (b = p - (a - j), o = v(o, b), k && k.updateTime(o), b <= 0)return q()
    }, u = function () {
      return m(), b.removeCallback(n)
    }, r()
  }, {restrict: "A", require: "?^gogCounterInterface", link: g, scope: !0}
}]);
gog.directive("gogRelativeTime", ["dateFilter", "$timeout", "transFilter", "config", function (a, b, c, d) {
  var e;
  return e = function (e, f, g) {
    var h, i, j, k, l, m, n, o, p, q, r, s, t, u;
    return o = 1, m = 60 * o, l = 60 * m, h = 24 * l, i = 0, s = void 0, t = parseInt(g.gogRelativeTime), q = a(1e3 * t, "M"), r = a(1e3 * t, "yyyy"), 1e3 * parseInt(r) + parseInt(q), n = void 0, u = function () {
      var a, b;
      return a = new Date, n = j(a), b = Math.floor(a.getTime() / 1e3), i = b - t, f.text(k(t)), p(t)
    }, k = function (b) {
      return function () {
        switch (!1) {
          case!(i < m):
            return c("diff.now");
          case!(i < l):
            return c("diff.ago.minute", Math.floor(i / m));
          case!(i < h):
            return c("diff.ago.hour", Math.floor(i / l));
          case!(i < 7 * h):
            return c("diff.ago.day", Math.floor(i / h));
          case 1 !== Math.floor(i / 7 * h):
            return c("diff.ago.week");
          default:
            return a(1e3 * t, d.date.defaultFormat)
        }
      }()
    }, p = function (a) {
      var c;
      if (c = function () {
          switch (!1) {
            case!(i < m):
              return 15 * o;
            case!(i < l):
              return m;
            case!(i < h):
              return 15 * m;
            default:
              return -1
          }
        }(), c > 0)return c *= 1e3, s = b(u, c)
    }, j = function (a) {
      return 1e3 * a.getUTCFullYear() + a.getUTCMonth() + 1
    }, u()
  }, {restrict: "A", link: e}
}]);
gog.service("gogPluralize", ["$locale", function (a) {
  return function (b, c) {
    if (null != b && "object" == typeof c)return null != c[b + ""] ? c[b + ""] : c[a.pluralCat(b)]
  }
}]);
gog.run(["$window", "productsRepository", "productsProvider", function (a, b, c) {
  var d, e;
  return e = a.gogData.spotGames, d = a.gogData.smallSpots, b.addProducts(c.getFromObject(e)), b.addProducts(c.getValidatedFromArray(d))
}]);
gog.controller("frontpageCtrl", ["$scope", function (a) {
  return a.frontpage = {smallSpotsLimit: 4}, a.cssData = {smallSpotsLimit: 4}, a.$watch(function () {
    return a.cssData.smallSpotsLimit
  }, function (b) {
    return a.frontpage.smallSpotsLimit = b
  })
}]);
var GalaxtAccountsOpenerService;
GalaxtAccountsOpenerService = function () {
  function a(a, b, c, d, e) {
    return this._$window = a, this._config = c, this._redirectionService = d, this._galaxyAccounts = e, this._loginUrlParamValue = null, this._isLoginUrlParamPresent = !1, this._processLocationParams(), this._isLoginUrlParamPresent ? this._openLoginWithUrl(this._loginUrlParamValue) : this._isOpenLoginHashPresent() && !b.isLoggedIn() ? this._openLoginAndRedirectToFrontpage() : void 0
  }

  return a.$inject = ["$window", "user", "config", "redirectionService", "galaxyAccounts"], a.prototype._isOpenLoginHashPresent = function () {
    return this._$window.location.hash.indexOf(this._config.urls.login.forceOpenHash) > -1
  }, a.prototype._openLoginAndRedirectToFrontpage = function () {
    return this._redirectionService.set("frontpage", function (a) {
      return function () {
        return a._galaxyAccounts.openLoginForm()
      }
    }(this))
  }, a.prototype._processLocationParams = function () {
    var a;
    if (a = this._locationSearchToArray(this._$window.location.search), a.hasOwnProperty(this._config.urls.login.openWithUrlParam))return this._isLoginUrlParamPresent = !0, this._loginUrlParamValue = a[this._config.urls.login.openWithUrlParam]
  }, a.prototype._openLoginWithUrl = function (a) {
    return this._galaxyAccounts.open(decodeURIComponent(a))
  }, a.prototype._locationSearchToArray = function (a) {
    return a.replace(/^\?/, "").split("&").reduce(this._locationChunkToKeyValue, {})
  }, a.prototype._locationChunkToKeyValue = function (a, b) {
    var c;
    return c = b.split("="), a[c[0]] = c[1], a
  }, a
}(), gog.service("galaxyAccountsOpener", GalaxtAccountsOpenerService);
gog.controller("newsCtrl", ["$scope", function (a) {
  return a.displayCount = 11, a.showMore = function () {
    return a.displayCount += gogData.newsBatchCount
  }
}]);
var TabbedGameController;
TabbedGameController = function () {
  function a(a, b) {
    this._gogAnalytics = a, this._productList = b, this.activeTab = "bestsellers"
  }

  return a.$inject = ["gogAnalytics", "productList"], a.prototype.selectTab = function (a, b) {
    var c;
    if (a !== this.activeTab)return this.activeTab = a, c = this._productList.getDirective(b), c.currentPage < 1 && c.loadMore(), this._gogAnalytics.sendEvent({
      hitType: "event",
      eventCategory: "mainPage",
      eventAction: "switchTab",
      eventLabel: a
    })
  }, a
}(), gog.controller("tabbedGamesCtrl", TabbedGameController);
gog.factory("SpotsTypeRotator", ["$window", function (a) {
  "use strict";
  return function () {
    function b(a, b, c, d, e) {
      this._type = a, this._nextSpot = b, this._prevSpot = c, null == d && (d = 1e3), this._delay = null != e ? e : 0, this._switchTime = d + this._delay, this._isRotationPausedByUser = !1, this._timeoutRotation = null
    }

    return b.TYPE = {LARGE: "large", PROMO: "promo"}, b.prototype._rotate = function () {
      if (this._nextSpot(), this.rotate(), this._delay)return this._switchTime -= this._delay, this._delay = 0
    }, b.prototype.lockRotation = function () {
      return this._isRotationPausedByUser = !0, a.clearTimeout(this._timeoutRotation), this._timeoutRotation = null
    }, b.prototype.unlockRotation = function () {
      return a.clearTimeout(this._timeoutRotation), this._isRotationPausedByUser = !1
    }, b.prototype.rotate = function () {
      if (!this._isRotationPausedByUser)return this._timeoutRotation = a.setTimeout(this._rotate.bind(this), this._switchTime)
    }, b
  }()
}]);
angular.module("gog").directive("gogSpotsScroll", ["$window", "debounce", function (a, b) {
  var c, d, e, f, g, h;
  return h = new RegExp("%s", "g"), f = document.body, c = function () {
    function b(b, c) {
      var f, g, h, i, j, k;
      return h = c, i = d(), j = e(), this.addSpot = function (a) {
        return i.addContentToScroll(a), j.addElement(a)
      }, this.removeSpot = function (a) {
        return j.removeElement(a), i.removeContentFromScroll(a)
      }, f = function () {
        return i.registerContainer(h), j.registerPositionManager(i), b.$watch("cssData.isScrollingActive", function (a) {
          return a ? k() : g()
        })
      }, k = function () {
        return j.initScroll(), i.init(), a.addEventListener("resize", i.updateDimensionsDebounced, !1)
      }, g = function () {
        return a.removeEventListener("resize", i.updateDimensionsDebounced), j.resetScroll(), i.reset()
      }, f(), this
    }

    return b.$inject = ["$scope", "$element"], b
  }(), g = function (a, b) {
    return b = b || 0, a === f || null === a ? b : (b += a.offsetLeft, g(a.offsetParent, b))
  }, d = function () {
    var c, d, e, f, i, j, k, l, m, n, o, p, q, r, s, t, u;
    return n = 0, o = 0, j = !1, i = !1, p = angular.element(), c = [], k = void 0, f = {
      window: 0,
      leftEdge: 0,
      rightEdge: 0,
      width: 0
    }, d = "transform: translateX(%s)", e = "-webkit-%s; -moz-%s; -ms-%s; %s;".replace(h, d), q = function () {
      if (f.leftEdge = g(p[0]), f.width = k.offsetWidth + g(k), f.rightEdge = f.width + f.leftEdge, o = f.rightEdge - f.window, j)return n = u(o, n), m(n)
    }, r = b(q, 25), t = function () {
      return f.window = a.innerWidth
    }, s = function () {
      if (t(), i)return q()
    }, u = function (a, b) {
      return b <= -a ? -a : b >= 0 ? 0 : b
    }, l = function (a) {
      var b;
      return b = n + a, n = u(o, b)
    }, m = function (a) {
      var b, c;
      return b = a + "px", c = e.replace(h, b), p.attr("style", c)
    }, {
      move: function (a) {
        return m(l(a))
      }, addContentToScroll: function (a) {
        return i = !0, k = a[0], c.push(a), r()
      }, removeContentFromScroll: function (a) {
        var b;
        return b = c.indexOf(a), c.splice(b, 1), 0 === c.length ? (k = null, i = !1) : (k === a[0] && (k = c[b - 1][0]), r())
      }, init: function () {
        return j = !0, s()
      }, reset: function () {
        return j = !1, n = 0, m(0)
      }, updateDimensionsDebounced: b(s, 200), registerContainer: function (a) {
        return p = a
      }
    }
  }, e = function () {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r;
    return h = !1, i = 0, c = null, p = [], d = [], r = ["right", "left"], j = null, b = {isDragged: "is-dragged"}, f = function (a) {
      return 0 === a.length
    }, g = function (a) {
      return !!a.gesture && r.indexOf(a.gesture.direction) !== -1
    }, k = function (a) {
      if (a.preventDefault(), g(a))return a.gesture.stopPropagation(), a.gesture.preventDefault()
    }, e = {preventDefault: !0, dragBlockHorizontal: !0, preventMouse: !0}, a = function (a) {
      return a.on("dragleft", m), a.on("dragright", m), a.on("dragstart", o), a.on("dragend", n)
    }, l = function () {
      var a, b, c, e;
      if (!f(d)) {
        for (e = [], b = 0, c = d.length; b < c; b++)a = d[b], e.push(q(a));
        return e
      }
    }, q = function (a) {
      return a.off("dragleft dragright", m), a.off("dragstart", o), a.off("dragend", n)
    }, m = function (a) {
      var b;
      return b = a.gesture.deltaX, j.move(b - i), i = b, k(a)
    }, o = function (a) {
      return c = angular.element(this), c.addClass(b.isDragged), k(a)
    }, n = function (a) {
      return i = 0, c.removeClass(b.isDragged), k(a)
    }, {
      addElement: function (b) {
        var c;
        if (c = 0, p.push(b), c = d.push(new Hammer(b[0], e)), h)return a(d[c - 1])
      }, removeElement: function (a) {
        var b;
        return b = p.indexOf(a), p.splice(b, 1), q(d[b]), d.splice(b, 1)
      }, initScroll: function () {
        var b, c, e, g;
        if (h = !0, !f(d)) {
          for (g = [], c = 0, e = d.length; c < e; c++)b = d[c], g.push(a(b));
          return g
        }
      }, resetScroll: function () {
        return h = !1, l()
      }, registerPositionManager: function (a) {
        return j = a
      }
    }
  }, {restrict: "A", scope: !0, controller: c}
}]);
gog.directive("gogSpotsRotator", ["SpotsTypeRotator", "$window", "$timeout", "config", "debounce", function (a, b, c, d, e) {
  var f, g, h, i, j;
  return 0, 0, null, f = {
    isMouseOver: "is-hovered",
    isDragged: "is-dragged",
    controlButton: "big-spots__btn",
    promoSpot: "big-spot--promo",
    largeSpot: "big-spot--big",
    blurForSpot: "big-spot-blur"
  }, g = function (a) {
    return [].slice.call(a, 0)
  }, i = function () {
    var a, b, c, d, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L;
    return d = 0, h = 0, p = 1, o = 1, "big-spot--promo", m = "is-active", n = "is-fading", E = !1, F = !1, D = !1, w = null, x = null, z = null, s = null, v = null, y = null, A = null, u = null, t = null, B = document.querySelector(".big-spots"), G = null, H = null, l = [], r = {
      largeWidth: 0,
      largeRightEdge: 0,
      largeChangePoint: 0,
      largeDistance: 0,
      promoRightEdge: 0,
      promoChangePoint: 0,
      promoWidth: 0,
      promoDistance: 0,
      containerWidth: 0
    }, b = null, c = null, k = null, C = function () {
      return G = angular.element(b), H = angular.element(c), l = angular.element(k), d = G.length, h = H.length, h > 1 && (E = !0), d > 1 && (F = !0), i(), j(), K()
    }, K = function () {
      return D = !0, G.on("transitionend", I), H.on("transitionend", I), l.on("transitionend", I)
    }, a = function () {
      this.classList && this.classList.add(n)
    }, I = function () {
      this.classList && this.classList.remove(n)
    }, i = function () {
      var a, b, c;
      return a = o - 1, b = o < d ? a + 1 : 0, c = a > 0 ? a - 1 : d - 1, t = G.eq(a), w = G.eq(b), z = G.eq(c), s = l.eq(a), v = l.eq(b), y = l.eq(c)
    }, j = function () {
      var a, b, c;
      if (E)return a = p - 1, b = p < h ? a + 1 : 0, c = a > 0 ? a - 1 : h - 1, u = H.eq(a), x = H.eq(b), A = H.eq(c)
    }, q = function () {
      var a, b;
      if (a = t[0], r.containerWidth = B.offsetWidth, r.largeWidth = a.offsetWidth, r.largeRightEdge = r.largeWidth, r.largeChangePoint = Math.floor(r.largeWidth / 2), r.largeDistance = r.largeRightEdge - r.largeChangePoint, E)return b = u[0], r.promoWidth = b.offsetWidth, r.promoRightEdge = b.offsetLeft + r.promoWidth, r.promoChangePoint = r.promoRightEdge - r.promoWidth, r.promoDistance = r.promoWidth
    }, J = function (a, b, c) {
      return b += a, b > c && (b = 1), b <= 0 && (b = c), b
    }, L = function (b, c) {
      if (b && D && a.call(b[0]), b && b.removeClass(m), c)return c.addClass(m)
    }, {
      initWithSpotsContainer: function (a) {
        return b = g(a.querySelectorAll("." + f.largeSpot)), c = g(a.querySelectorAll("." + f.promoSpot)), k = g(document.querySelectorAll("." + f.blurForSpot)), C()
      }, nextLargeSpot: function () {
        return o = J(1, o, d), i(), L(z, t), L(y, s)
      }, nextPromoSpot: function () {
        if (E)return p = J(1, p, h), j(), L(A, u)
      }, prevLargeSpot: function () {
        return o = J(-1, o, d), i(), L(w, t), L(v, s)
      }, prevPromoSpot: function () {
        if (E)return p = J(-1, p, h), j(), L(x, u)
      }, getCurrentPromoSpot: function () {
        return u
      }, getCurrentLargeSpot: function () {
        return t
      }, getNextPromoSpot: function () {
        return x
      }, getNextLargeSpot: function () {
        return w
      }, getPromoSpots: function () {
        return E ? H : []
      }, getLargeSpots: function () {
        return G
      }, getDimensionsData: function () {
        return r
      }, isRotatorNeeded: function () {
        return F
      }, onWindowResize: e(q, 200)
    }
  }(), j = function () {
    var b, c, e, f, g, h, j, k, l, m, n;
    return m = d.spots.rotateInterval, k = d.spots.promoSpotDelay, f = !1, b = !1, g = new a(a.TYPE.LARGE, i.nextLargeSpot, i.prevLargeSpot, m), j = new a(a.TYPE.PROMO, i.nextPromoSpot, i.prevPromoSpot, m, k), e = function () {
      return !(b || g.isRotationPausedByUser && j.isRotationPausedByUser)
    }, l = function () {
      return g.rotate(), j.rotate()
    }, n = function () {
      return g.unlockRotation(), j.unlockRotation()
    }, h = function () {
      return f = !1, g.lockRotation(), j.lockRotation()
    }, c = function () {
      if (!f && i.isRotatorNeeded() && e())return f = !0, n(), l()
    }, {
      large: g,
      promo: j,
      initRotation: c,
      rotateSpots: l,
      lockAllRotations: h,
      unlockAllRotations: n,
      lockByOtherMechanism: function () {
        return b = !0, h()
      },
      unlockByOtherMechanism: function () {
        return b = !1, c()
      },
      lockByUser: function (a) {
        return a.lockRotation()
      },
      unlockByUser: function (a) {
        return a.unlockRotation(), a.rotate()
      }
    }
  }(), h = function (b, c, d) {
    var e, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E;
    return v = angular.element(c[0].querySelectorAll(".big-spots__btn--next")), B = angular.element(c[0].querySelectorAll(".big-spots__btn--prev")), D = g(c[0].querySelectorAll("." + f.promoSpot)), m = g(c[0].querySelectorAll("." + f.largeSpot)), w = angular.element(m), x = angular.element(D), y = angular.element(m.concat(D)), C = g(c[0].querySelectorAll(".big-spots__controls--promo ." + f.controlButton)), l = g(c[0].querySelectorAll(".big-spots__controls--large ." + f.controlButton)), p = angular.element(C.concat(l)), k = void 0, r = function () {
      return y.on("swipeleft", function () {
        var b;
        return b = this.classList.contains(f.largeSpot) ? a.TYPE.LARGE : a.TYPE.PROMO, u(b)
      }).on("swiperight", function () {
        var b;
        return b = this.classList.contains(f.largeSpot) ? a.TYPE.LARGE : a.TYPE.PROMO, A(b)
      }), v.on("click", u), B.on("click", A), w.on("mouseenter", function () {
        return j.lockByUser(j.large)
      }).on("mouseleave", function () {
        return j.unlockByUser(j.large)
      }), x.on("mouseenter", function () {
        return j.lockByUser(j.promo)
      }).on("mouseleave", function () {
        return j.unlockByUser(j.promo)
      }), y.on("mouseenter", e).on("mouseleave", E), p.on("mouseenter", n), p.on("mouseleave", o), i.initWithSpotsContainer(c[0]), j.initRotation(), angular.element(window).on("resize", i.onWindowResize)
    }, b.cssData = {isRotatorActive: !1}, z = function () {
      return b.cssData.isRotatorActive ? void j.unlockByOtherMechanism() : b.cssData.isRotatorActive ? void 0 : j.lockByOtherMechanism()
    }, u = function (b) {
      var c;
      return c = "string" == typeof b ? b : this.getAttribute("data-spot-type"), c === a.TYPE.LARGE ? i.nextLargeSpot() : c === a.TYPE.PROMO ? i.nextPromoSpot() : void 0
    }, A = function (b) {
      var c;
      return c = "string" == typeof b ? b : this.getAttribute("data-spot-type"), c === a.TYPE.LARGE ? i.prevLargeSpot() : c === a.TYPE.PROMO ? i.prevPromoSpot() : void 0
    }, h = function (a) {
      return k && q(), k = a, k.addClass(f.isMouseOver)
    }, q = function () {
      if (k)return k.removeClass(f.isMouseOver), k = void 0
    }, s = function (b, c) {
      return !!c && (b.attr("data-spot-type") === a.TYPE.PROMO ? D.indexOf(c) !== -1 : m.indexOf(c) !== -1)
    }, t = function (a, b) {
      return !!b && (a.hasClass(f.promoSpot) ? C.indexOf(b) !== -1 : l.indexOf(b) !== -1)
    }, e = function () {
      return h(angular.element(this))
    }, n = function () {
      var b;
      return b = this.getAttribute("data-spot-type") === a.TYPE.PROMO ? a.TYPE.PROMO : a.TYPE.LARGE, j[b].lockRotation()
    }, o = function (b) {
      var c, d;
      if (d = angular.element(this), c = this.getAttribute("data-spot-type") === a.TYPE.PROMO ? a.TYPE.PROMO : a.TYPE.LARGE, j[c].unlockRotation(), j[c].rotate(), !s(d, b.relatedTarget))return q()
    }, E = function (a) {
      var b;
      if (b = angular.element(this), !t(b, a.relatedTarget))return q()
    }, b.$watch(function () {
      return b.cssData.isRotatorActive
    }, z), r()
  }, {restrict: "A", link: h, scope: !0}
}]);
angular.module("gog").directive("gogSpot", function () {
  var a;
  return a = function (a, b, c, d) {
    var e;
    return e = function () {
      return d.removeSpot(b), b.off("$destroy"), b = null
    }, d.addSpot(b), b.on("$destroy", function () {
      return e()
    })
  }, {require: "^gogSpotsScroll", restrict: "A", link: a}
});
var BannerController;
BannerController = function () {
  function a(a, b, c) {
    this._$element = a, this._currencyChanger = b, this._$window = c, this._containerEl = this._$element[0], this.currencyCodeToShow = this._$window.gogData.newCurrencyCode, this._getDismissedState() ? this._setShowingGalaxy() : this._setShowingCurrency()
  }

  return a.$inject = ["$element", "currencyChanger", "$window"], a.DEFAULT_STATE_CLASSNAME = "is-default-state", a.SHOWING_GALAXY_BANNER = "is-showing-galaxy-banner", a.SHOWING_CURRENY_BANNER = "is-showing-currency-banner", a.SHOWING_DIMISSED = "is-showing-no-banners", a.LOCALSTORAGE_KEY = "currencyBannerDismissed_", a.LOCALSTORAGE_VALUE = "1", a.prototype.dismiss = function () {
    return this._setDismissedState(), this._saveDismissedState()
  }, a.prototype.changeCurrency = function () {
    return this._setDismissedState(), this._saveDismissedState(), this._currencyChanger.changeCurrencyToCode(this.currencyCodeToShow)
  }, a.prototype._saveDismissedState = function () {
    return this._$window.localStorage.setItem(a.LOCALSTORAGE_KEY + this.currencyCodeToShow, a.LOCALSTORAGE_VALUE)
  }, a.prototype._getDismissedState = function () {
    return this._$window.localStorage.getItem(a.LOCALSTORAGE_KEY + this.currencyCodeToShow) === a.LOCALSTORAGE_VALUE
  }, a.prototype._setDismissedState = function () {
    return this._containerEl.classList.add(a.SHOWING_DIMISSED), this._containerEl.classList.remove(a.SHOWING_GALAXY_BANNER, a.SHOWING_CURRENY_BANNER)
  }, a.prototype._setShowingGalaxy = function () {
    return this._containerEl.classList.add(a.SHOWING_GALAXY_BANNER), this._containerEl.classList.remove(a.DEFAULT_STATE_CLASSNAME, a.SHOWING_CURRENY_BANNER)
  }, a.prototype._setShowingCurrency = function () {
    return this._containerEl.classList.add(a.SHOWING_CURRENY_BANNER), this._containerEl.classList.remove(a.DEFAULT_STATE_CLASSNAME, a.SHOWING_GALAXY_BANNER)
  }, a
}(), gog.directive("gogBannerSelector", function () {
  return {restrict: "A", controller: BannerController, controllerAs: "banner", scope: !0}
});
gog.factory("userAgent", function () {
  return new (function () {
    function a() {
      this.os = !1, this.getData()
    }

    return a.prototype.getOs = function () {
      return this.os
    }, a.prototype.search = function (a) {
      var b, c, d;
      for (b = 0, c = a.length; b < c; b++)if (d = a[b], d.where.indexOf(d.what) !== -1)return d.result
    }, a.prototype.osCandidates = [{
      where: navigator.platform,
      what: "Win",
      result: "Windows"
    }, {where: navigator.platform, what: "Mac", result: "Mac"}, {
      where: navigator.userAgent,
      what: "Android",
      result: !1
    }, {
      where: navigator.platform,
      what: "Linux",
      result: "Linux"
    }], a.prototype.browserCandidrtes = [{
      where: navigator.userAgent,
      what: "Windows Phone",
      result: "Windows Phone"
    }], a.prototype.getData = function () {
      var a, b;
      return b = this.search(this.osCandidates || !1), a = this.search(this.browserCandidates || !1), "Windows" === b && "Windows Phone" === a && (b = !1), this.os = b
    }, a
  }())
});
var GalaxyBannerService;
GalaxyBannerService = function () {
  function a(a) {
    this._userAgent = a
  }

  return a.$inject = ["userAgent"], a.prototype.getIsVisible = function () {
    return "Linux" !== this._userAgent.getOs()
  }, a
}(), gog.service("galaxyBanner", GalaxyBannerService);
var GOGGalaxyBannerController;
GOGGalaxyBannerController = function () {
  function a(a, b) {
    this._galaxyBanner = b, this._el = a[0], this._setVisibility()
  }

  return a.$inject = ["$element", "galaxyBanner"], a.CLASSNAMES = {
    IS_HIDDEN: "is-section-hidden",
    IS_VISIBILITY_HIDDEN: "is-section-visibility-hidden"
  }, a.prototype._setVisibility = function () {
    this._galaxyBanner.getIsVisible() ? this._el.classList.remove(a.CLASSNAMES.IS_VISIBILITY_HIDDEN, a.CLASSNAMES.IS_HIDDEN) : this._el.classList.add(a.CLASSNAMES.IS_HIDDEN)
  }, a
}(), gog.directive("gogGalaxyBanner", function () {
  return {restrict: "A", controller: GOGGalaxyBannerController, scope: !1}
});
var ContentScrollController;
ContentScrollController = function () {
  function a(a, b) {
    this.position = 0, this.enabled = !1, this.elContext = a[0].querySelector("._cs-content"), this.elContent = a[0].querySelector("._cs-content__in"), angular.element(b).on("resize rotate orientationchange", this.checkScrollState.bind(this)), b.setTimeout(this.checkScrollState.bind(this))
  }

  return a.$inject = ["$element", "$window"], a.prototype.enable = function () {
    return this.enabled = !0
  }, a.prototype.disable = function () {
    return this.setPosition(0), this.enabled = !1
  }, a.prototype.calculateSize = function () {
    return this.elemWidth = this.elContext.clientWidth, this.contentWidth = this.elContent.clientWidth, this.contentWidth <= this.elemWidth ? this.disable() : this.enable()
  }, a.prototype.showLeft = function () {
    return this.enabled && this.position < 0
  }, a.prototype.showRight = function () {
    return this.enabled && this.position > -1 * (this.contentWidth - this.elemWidth)
  }, a.prototype.left = function () {
    if (this.enabled)return this.setPosition(this.position + this.elemWidth)
  }, a.prototype.right = function () {
    if (this.enabled)return this.setPosition(this.position - this.elemWidth)
  }, a.prototype.setPosition = function (a) {
    var b;
    return b = Math.max(a, -1 * (this.contentWidth - this.elemWidth)), b = Math.min(b, 0), this.elContent.style.left = b + "px", this.position = b
  }, a.prototype.checkScrollState = function () {
    return this.calculateSize(), this.enabled || (this.position = 0), this.setPosition(this.position)
  }, a
}(), gog.directive("gogContentScroll", function () {
  return {restrict: "A", controller: ContentScrollController, controllerAs: "scroll", scope: !0}
});
var extend = function (a, b) {
  function c() {
    this.constructor = a
  }

  for (var d in b)hasProp.call(b, d) && (a[d] = b[d]);
  return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
}, hasProp = {}.hasOwnProperty;
gog.factory("wrappedStorageFactory", ["$window", function (a) {
  var b, c, d, e, f, g;
  return g = function () {
    var b;
    try {
      return a.localStorage.setItem("gog", "gog"), a.localStorage.removeItem("gog"), !0
    } catch (b) {
      return b, !1
    }
  }, b = function () {
    function a() {
      this._data = {}, this._length = 0
    }

    return a.prototype.setItem = function (a, b) {
      return this._data[a] = "" + b, this.length++
    }, a.prototype.getItem = function (a) {
      return null != this._data[a] ? this._data[a] : null
    }, a.prototype.removeItem = function (a) {
      if (null != this._data[a])return this.length--, delete this._data[a]
    }, a.prototype.key = function (a) {
      return Object.keys(this._data)[a]
    }, a.prototype.isSet = function () {
      return null != this._data[key]
    }, a
  }(), f = function () {
    function a(a) {
      this._prefix = a
    }

    return a.prototype.getItem = function (a) {
      var b;
      return b = this._storage.getItem("" + this._prefix + a), null !== b ? JSON.parse(b) : null
    }, a.prototype.setItem = function (a, b) {
      this._storage.setItem("" + this._prefix + a, JSON.stringify(b))
    }, a.prototype.reset = function (a) {
      var b, c, d;
      this.clear(), c = [];
      for (b in a)d = a[b], c.push(this.setItem(b, d));
      return c
    }, a.prototype.clear = function () {
      var a, b, c, d, e, f;
      for (f = [], a = b = 0, e = this._storage.length; 0 <= e ? b <= e : b >= e; a = 0 <= e ? ++b : --b)c = this._storage.key(a), null != c && c.search(this._prefix) !== -1 ? (d = c.replace(this._prefix, ""), f.push(this.removeItem(d))) : f.push(void 0);
      return f
    }, a.prototype.getAll = function () {
      var a, b, c, d, e, f;
      for (f = {}, a = b = 0, e = this._storage.length; 0 <= e ? b <= e : b >= e; a = 0 <= e ? ++b : --b)c = this._storage.key(a), null != c && c.search(this._prefix) !== -1 && (d = c.replace(this._prefix, ""), f[d] = this.getItem(d));
      return f
    }, a.prototype.key = function (a) {
      return this._storage.key(a)
    }, a.prototype.removeItem = function (a) {
      return this._storage.removeItem("" + this._prefix + a)
    }, a.prototype.isSet = function (a) {
      return null != this._storage.getItem("" + this._prefix + a)
    }, a
  }(), e = function (b) {
    function c(b) {
      c.__super__.constructor.call(this, b), this._storage = a.sessionStorage
    }

    return extend(c, b), c
  }(f), c = function (b) {
    function c(b) {
      c.__super__.constructor.call(this, b), this._storage = a.localStorage
    }

    return extend(c, b), c
  }(f), d = function (a) {
    function c(a) {
      c.__super__.constructor.call(this, a), this._storage = new b
    }

    return extend(c, a), c
  }(f), {
    getSessionStorage: function (a) {
      return g() ? new e(a) : new d(a)
    }, getLocalStorage: function (a) {
      return g() ? new c(a) : new d(a)
    }
  }
}]);
var UserStorageService;
UserStorageService = function () {
  function a(a, b, c, d, e) {
    this._user = a, this._config = c, this._wrappedStorageFactory = d, this._storageBeforeUserResponse = {}, b.success(this._init.bind(this)), e.addEventListener("beforeunload", this.save.bind(this)), this._init()
  }

  return a.$inject = ["user", "userResponse", "config", "wrappedStorageFactory", "$window"], a.prototype.defaults = function (a) {
    var b, c, d;
    c = [];
    for (b in a)d = a[b], this[b] = d, this.isSet(b) ? c.push(void 0) : c.push(this.set(b, d));
    return c
  }, a.prototype.set = function (a, b) {
    return this[a] = b, this._storageBeforeUserResponse[a] = b, this._wrappedStorage.setItem(a, b)
  }, a.prototype.get = function (a) {
    return null != this[a] ? this[a] : this._wrappedStorage.getItem(a)
  }, a.prototype.remove = function (a) {
    return delete this[a], this._wrappedStorage.removeItem(a)
  }, a.prototype.isSet = function (a) {
    return this._wrappedStorage.isSet(a)
  }, a.prototype.reset = function (a) {
    return this._wrappedStorage.reset(a)
  }, a.prototype.clear = function () {
    var a;
    for (a in this)this[a], "_" !== a.charAt(0) && "function" != typeof this[a] && delete this[a];
    return this._wrappedStorage.clear()
  }, a.prototype.save = function () {
    var a, b;
    for (a in this)b = this[a], "_" !== a.charAt(0) && "function" != typeof this[a] && this._wrappedStorage.setItem(a, b)
  }, a.prototype._init = function () {
    var a, b, c;
    this._wrappedStorage = this._wrappedStorageFactory.getLocalStorage(this._getPrefix()), b = this._wrappedStorage.getAll();
    for (a in b)c = b[a], null == this[a] && (this[a] = c);
    if (this._user.isLoggedIn())return this._refresh()
  }, a.prototype._refresh = function () {
    var a, b, c, d;
    b = this._storageBeforeUserResponse, c = [];
    for (a in b)d = b[a], c.push(this.set(a, d));
    return c
  }, a.prototype._getPrefix = function () {
    return this._user.isLoggedIn() ? this._config.storage.keyPrefix + "_" + this._user.getId() + "_" : this._config.storage.keyPrefix + "_" + this._config.storage.notLoggedId + "_"
  }, a
}(), gog.service("userStorage", UserStorageService);
var GogAccordionController;
GogAccordionController = function () {
  function a(a, b, c, d) {
    this.__scope = a, this.__modal = c, this.__dispatcher = d, this.__currentSectionId = "", this.__sections = {}, b.gogAccordion && (this.__deregisterConfigListener = b.$observe("gogAccordion", this.__setConfig.bind(this)))
  }

  return a.$inject = ["$scope", "$attrs", "modal", "eventDispatcher"], a.prototype.__isActiveClass = "is-active", a.prototype.__setConfig = function (a) {
    var b;
    return b = angular.fromJson(a), b.isModal && (this.selectSection = this.__selectSectionModal, this.deselectSection = this.__deselectSectionModal, this.__deregisterCloseListener = this.__dispatcher.on(this.__modal.config.eventModalClose, this.__deactivateCurrentSection.bind(this))), this.__deregisterConfigListener(), this.__deregisterConfigListener = null
  }, a.prototype.__clearController = function () {
    this.__deregisterCloseListener && this.__deregisterCloseListener()
  }, a.prototype.__deactivateSection = function (a) {
    var b, c, d, e;
    if (this.__sections[a] && 0 !== this.__sections[a].length) {
      for (e = this.__sections[a], c = 0, d = e.length; c < d; c++)b = e[c], b.removeClass(this.__isActiveClass);
      return this.__currentSectionId = "", this.__scope.$emit("sectionResize")
    }
  }, a.prototype.__deactivateCurrentSection = function () {
    if (this.__currentSectionId)return this.__deactivateSection(this.__currentSectionId)
  }, a.prototype.__activateSection = function (a) {
    var b, c, d, e;
    if (this.__sections[a] && 0 !== this.__sections[a].length) {
      for (e = this.__sections[a], c = 0, d = e.length; c < d; c++)b = e[c], b.addClass(this.__isActiveClass);
      return this.__currentSectionId = a, this.__scope.$emit("sectionResize")
    }
  }, a.prototype.__isDeselectable = function (a) {
    return this.__currentSectionId && this.__currentSectionId === a
  }, a.prototype.__isSelectable = function (a) {
    return this.__currentSectionId !== a
  }, a.prototype.__selectSectionModal = function (a) {
    if (this.__isSelectable(a))return this.__currentSectionId && this.__modal.close(), this.__activateSection(a), this.__modal.open()
  }, a.prototype.__deselectSectionModal = function (a) {
    if (this.__isDeselectable(a))return this.__modal.close()
  }, a.prototype.isSectionActive = function (a) {
    return this.__currentSectionId === a
  }, a.prototype.addSection = function (a, b) {
    return this.__sections[a] || (this.__sections[a] = []), this.__sections[a].push(b)
  }, a.prototype.selectSection = function (a) {
    if (this.__isSelectable(a))return this.__currentSectionId && this.__deactivateSection(this.__currentSectionId), this.__activateSection(a)
  }, a.prototype.deselectSection = function (a) {
    if (this.__isDeselectable(a))return this.__deactivateSection(a)
  }, a
}(), gog.directive("gogAccordion", function () {
  return {restrict: "A", scope: !0, controller: GogAccordionController}
}), gog.directive("gogAccordionSection", function () {
  var a;
  return a = function (a, b, c, d) {
    var e, f, g, h, i, j;
    return h = c.gogAccordionSection, e = function () {
      return d.addSection(h, b), angular.isDefined(c.gogAccordionToggle) ? b.on("click", j) : b.on("click", i)
    }, f = function (a) {
      return a.target.gogAccordionDeselect || g(a.target)
    }, j = function (a) {
      if (!f(a))return d.isSectionActive(h) ? d.deselectSection(h) : d.selectSection(h)
    }, i = function (a) {
      if (!f(a))return d.selectSection(h)
    }, g = function (a) {
      return "input" === a.nodeName.toLowerCase()
    }, e()
  }, {require: "^gogAccordion", restrict: "A", link: a}
}), angular.module("gog").directive("gogAccordionBody", function () {
  var a;
  return a = function (a, b, c, d) {
    var e, f, g, h;
    return g = c.gogAccordionBody.split(/\s+/), f = function () {
      var a, c, f, i;
      for (b.on("click", h), b.on("$destroy", e), f = [], a = 0, c = g.length; a < c; a++)i = g[a], i && f.push(d.addSection(i, b));
      return f
    }, h = function (a) {
      return a.stopPropagation()
    }, e = function () {
      return b.off("click")
    }, f()
  }, {require: "^gogAccordion", restrict: "A", link: a}
}), angular.module("gog").directive("gogAccordionBind", function () {
  var a;
  return a = function (a, b, c, d) {
    var e;
    return e = c.gogAccordionSection, a.$watch(function () {
      return a.isControlledOutside
    }, function (a) {
      return a ? d.selectSection(e) : d.deselectSection(e)
    })
  }, {require: "^gogAccordion", restrict: "A", scope: {isControlledOutside: "=gogAccordionBind"}, link: a}
});
