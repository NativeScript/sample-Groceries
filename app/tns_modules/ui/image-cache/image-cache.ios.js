var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/image-cache/image-cache-common");
var httpRequest = require("http/http-request");
var utils = require("utils/utils");
var trace = require("trace");
var MemmoryWarningHandler = (function (_super) {
    __extends(MemmoryWarningHandler, _super);
    function MemmoryWarningHandler() {
        _super.apply(this, arguments);
    }
    MemmoryWarningHandler.new = function () {
        return _super.new.call(this);
    };
    MemmoryWarningHandler.prototype.initWithCache = function (cache) {
        this._cache = cache;
        NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(this, "clearCache", "UIApplicationDidReceiveMemoryWarningNotification", null);
        trace.write("[MemmoryWarningHandler] Added low memory observer.", trace.categories.Debug);
        return this;
    };
    MemmoryWarningHandler.prototype.dealloc = function () {
        NSNotificationCenter.defaultCenter().removeObserverNameObject(this, "UIApplicationDidReceiveMemoryWarningNotification", null);
        trace.write("[MemmoryWarningHandler] Removed low memory observer.", trace.categories.Debug);
        _super.prototype.dealloc.call(this);
    };
    MemmoryWarningHandler.prototype.clearCache = function () {
        trace.write("[MemmoryWarningHandler] Clearing Image Cache.", trace.categories.Debug);
        this._cache.removeAllObjects();
        utils.GC();
    };
    MemmoryWarningHandler.ObjCExposedMethods = {
        "clearCache": { returns: interop.types.void, params: [] }
    };
    return MemmoryWarningHandler;
})(NSObject);
var Cache = (function (_super) {
    __extends(Cache, _super);
    function Cache() {
        _super.call(this);
        this._cache = new NSCache();
        this._memoryWarningHandler = MemmoryWarningHandler.new().initWithCache(this._cache);
    }
    Cache.prototype._downloadCore = function (request) {
        var that = this;
        httpRequest.request({ url: request.url, method: "GET" })
            .then(function (response) {
            var image = UIImage.alloc().initWithData(response.content.raw);
            that._onDownloadCompleted(request.key, image);
        });
    };
    Cache.prototype.get = function (key) {
        return this._cache.objectForKey(key);
    };
    Cache.prototype.set = function (key, image) {
        this._cache.setObjectForKey(image, key);
    };
    Cache.prototype.remove = function (key) {
        this._cache.removeObjectForKey(key);
    };
    Cache.prototype.clear = function () {
        this._cache.removeAllObjects();
        utils.GC();
    };
    return Cache;
})(common.Cache);
exports.Cache = Cache;
