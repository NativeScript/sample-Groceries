var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/button/button-common");
var utils = require("utils/utils");
var trace = require("trace");
require("utils/module-merge").merge(common, exports);
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.call(this);
        this._isPressed = false;
    }
    Object.defineProperty(Button.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype._createUI = function () {
        var that = new WeakRef(this);
        this._android = new android.widget.Button(this._context);
        this._android.setOnClickListener(new android.view.View.OnClickListener({
            get owner() {
                return that.get();
            },
            onClick: function (v) {
                if (this.owner) {
                    this.owner._emit(common.Button.tapEvent);
                }
            }
        }));
    };
    Button.prototype.onLayout = function (left, top, right, bottom) {
        if (this.android) {
            var measuredWidth = this.getMeasuredWidth();
            var measuredHeight = this.getMeasuredHeight();
            var measureSpecs = this._getCurrentMeasureSpecs();
            var widthModeIsNotExact = utils.layout.getMeasureSpecMode(measureSpecs.widthMeasureSpec) !== utils.layout.EXACTLY;
            var heightModeIsNotExact = utils.layout.getMeasureSpecMode(measureSpecs.heightMeasureSpec) !== utils.layout.EXACTLY;
            var width = right - left;
            var height = bottom - top;
            if ((Math.abs(measuredWidth - width) > 1 && widthModeIsNotExact) || (Math.abs(measuredHeight - height) > 1 && heightModeIsNotExact)) {
                var widthMeasureSpec = utils.layout.makeMeasureSpec(width, utils.layout.EXACTLY);
                var heightMeasureSpec = utils.layout.makeMeasureSpec(height, utils.layout.EXACTLY);
                trace.write(this + ", measuredSize: (" + measuredWidth + ", " + measuredHeight + ")" + ", remeasure with: (" + width + ", " + height + ")", trace.categories.Layout);
                this.android.measure(widthMeasureSpec, heightMeasureSpec);
            }
        }
        _super.prototype.onLayout.call(this, left, top, right, bottom);
    };
    return Button;
})(common.Button);
exports.Button = Button;
