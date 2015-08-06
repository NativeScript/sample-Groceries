var common = require("ui/label/label-common");
var utils = require("utils/utils");
var viewModule = require("ui/core/view");
var trace = require("trace");
function onTextWrapPropertyChanged(data) {
    var label = data.object;
    if (data.newValue) {
        label.ios.lineBreakMode = NSLineBreakMode.NSLineBreakByWordWrapping;
        label.ios.numberOfLines = 0;
    }
    else {
        label.ios.lineBreakMode = NSLineBreakMode.NSLineBreakByTruncatingTail;
        label.ios.numberOfLines = 1;
    }
}
common.Label.textWrapProperty.metadata.onSetNativeValue = onTextWrapPropertyChanged;
global.moduleMerge(common, exports);
var UILabelImpl = (function (_super) {
    __extends(UILabelImpl, _super);
    function UILabelImpl() {
        _super.apply(this, arguments);
    }
    UILabelImpl.new = function () {
        return _super.new.call(this);
    };
    UILabelImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UILabelImpl.prototype.textRectForBoundsLimitedToNumberOfLines = function (bounds, numberOfLines) {
        var rect = _super.prototype.textRectForBoundsLimitedToNumberOfLines.call(this, bounds, numberOfLines);
        var textRect = CGRectMake(-(this._owner.borderWidth + this._owner.style.paddingLeft), -(this._owner.borderWidth + this._owner.style.paddingTop), rect.size.width + (this._owner.borderWidth + this._owner.style.paddingLeft + this._owner.style.paddingRight + this._owner.borderWidth), rect.size.height + (this._owner.borderWidth + this._owner.style.paddingTop + this._owner.style.paddingBottom + this._owner.borderWidth));
        return textRect;
    };
    UILabelImpl.prototype.drawTextInRect = function (rect) {
        var textRect = CGRectMake((this._owner.borderWidth + this._owner.style.paddingLeft), (this._owner.borderWidth + this._owner.style.paddingTop), rect.size.width - (this._owner.borderWidth + this._owner.style.paddingLeft + this._owner.style.paddingRight + this._owner.borderWidth), rect.size.height - (this._owner.borderWidth + this._owner.style.paddingTop + this._owner.style.paddingBottom + this._owner.borderWidth));
        _super.prototype.drawTextInRect.call(this, textRect);
    };
    return UILabelImpl;
})(UILabel);
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(options) {
        _super.call(this, options);
        this._ios = UILabelImpl.new().initWithOwner(this);
        this._ios.userInteractionEnabled = true;
    }
    Object.defineProperty(Label.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Label.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeView = this._nativeView;
        if (nativeView) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            if (widthMode === utils.layout.UNSPECIFIED) {
                width = Number.POSITIVE_INFINITY;
            }
            if (heightMode === utils.layout.UNSPECIFIED) {
                height = Number.POSITIVE_INFINITY;
            }
            trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
            var nativeSize = nativeView.sizeThatFits(CGSizeMake(width, height));
            var labelWidth = nativeSize.width;
            if (!this.textWrap) {
                labelWidth = Math.min(labelWidth, width);
            }
            var measureWidth = Math.max(labelWidth, this.minWidth);
            var measureHeight = Math.max(nativeSize.height, this.minHeight);
            var widthAndState = viewModule.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = viewModule.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    return Label;
})(common.Label);
exports.Label = Label;
