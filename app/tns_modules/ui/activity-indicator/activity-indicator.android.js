var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aiCommon = require("ui/activity-indicator/activity-indicator-common");
var enums = require("ui/enums");
function onBusyPropertyChanged(data) {
    var indicator = data.object;
    if (!indicator.android) {
        return;
    }
    if (indicator.visibility === enums.Visibility.visible) {
        indicator.android.setVisibility(data.newValue ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
    }
}
aiCommon.ActivityIndicator.busyProperty.metadata.onSetNativeValue = onBusyPropertyChanged;
require("utils/module-merge").merge(aiCommon, exports);
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        _super.apply(this, arguments);
    }
    ActivityIndicator.prototype._createUI = function () {
        this._android = new android.widget.ProgressBar(this._context);
        this._android.setVisibility(android.view.View.INVISIBLE);
        this._android.setIndeterminate(true);
    };
    Object.defineProperty(ActivityIndicator.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return ActivityIndicator;
})(aiCommon.ActivityIndicator);
exports.ActivityIndicator = ActivityIndicator;
