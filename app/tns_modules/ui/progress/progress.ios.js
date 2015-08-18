var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/progress/progress-common");
function onValuePropertyChanged(data) {
    var progress = data.object;
    progress.ios.progress = data.newValue / progress.maxValue;
}
function onMaxValuePropertyChanged(data) {
    var progress = data.object;
    progress.ios.progress = progress.value / data.newValue;
}
common.Progress.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
common.Progress.maxValueProperty.metadata.onSetNativeValue = onMaxValuePropertyChanged;
require("utils/module-merge").merge(common, exports);
var Progress = (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        _super.call(this);
        this._ios = new UIProgressView();
    }
    Object.defineProperty(Progress.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Progress;
})(common.Progress);
exports.Progress = Progress;
