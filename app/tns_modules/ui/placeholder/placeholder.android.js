var common = require("ui/placeholder/placeholder-common");
global.moduleMerge(common, exports);
var Placeholder = (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder() {
        _super.apply(this, arguments);
    }
    Placeholder.prototype._createUI = function () {
        var args = { eventName: common.Placeholder.creatingViewEvent, object: this, view: undefined, context: this._context };
        this.notify(args);
        this._android = args.view || new android.view.View(this._context);
    };
    Object.defineProperty(Placeholder.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Placeholder.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return Placeholder;
})(common.Placeholder);
exports.Placeholder = Placeholder;
