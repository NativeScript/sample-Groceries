var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var contentView = require("ui/content-view");
var viewModule = require("ui/core/view");
var utils = require("utils/utils");
var Border = (function (_super) {
    __extends(Border, _super);
    function Border() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Border.prototype, "cornerRadius", {
        get: function () {
            return this.borderRadius;
        },
        set: function (value) {
            this.borderRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Border.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var density = utils.layout.getDisplayDensity();
        var borderSize = (2 * this.borderWidth) * density;
        var result = viewModule.View.measureChild(this, this.content, utils.layout.makeMeasureSpec(width - borderSize, widthMode), utils.layout.makeMeasureSpec(height - borderSize, heightMode));
        var widthAndState = viewModule.View.resolveSizeAndState(result.measuredWidth + borderSize, width, widthMode, 0);
        var heightAndState = viewModule.View.resolveSizeAndState(result.measuredHeight + borderSize, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Border.prototype.onLayout = function (left, top, right, bottom) {
        var density = utils.layout.getDisplayDensity();
        var borderSize = this.borderWidth * density;
        viewModule.View.layoutChild(this, this.content, borderSize, borderSize, right - left - borderSize, bottom - top - borderSize);
    };
    Border = __decorate([
        Deprecated
    ], Border);
    return Border;
})(contentView.ContentView);
exports.Border = Border;
