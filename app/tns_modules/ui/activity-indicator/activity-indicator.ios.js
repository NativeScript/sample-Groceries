var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aiCommon = require("ui/activity-indicator/activity-indicator-common");
function onBusyPropertyChanged(data) {
    var indicator = data.object;
    if (!indicator.ios) {
        return;
    }
    if (data.newValue) {
        indicator.ios.startAnimating();
    }
    else {
        indicator.ios.stopAnimating();
    }
}
aiCommon.ActivityIndicator.busyProperty.metadata.onSetNativeValue = onBusyPropertyChanged;
require("utils/module-merge").merge(aiCommon, exports);
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        _super.call(this);
        this._ios = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(UIActivityIndicatorViewStyle.UIActivityIndicatorViewStyleGray);
    }
    Object.defineProperty(ActivityIndicator.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return ActivityIndicator;
})(aiCommon.ActivityIndicator);
exports.ActivityIndicator = ActivityIndicator;
