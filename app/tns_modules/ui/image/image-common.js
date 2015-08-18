var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
var imageSource = require("image-source");
var trace = require("trace");
var enums = require("ui/enums");
var utils = require("utils/utils");
var types = require("utils/types");
var SRC = "src";
var IMAGE_SOURCE = "imageSource";
var IMAGE = "Image";
var ISLOADING = "isLoading";
var STRETCH = "stretch";
function onSrcPropertyChanged(data) {
    var image = data.object;
    var value = data.newValue;
    if (types.isString(value)) {
        value = value.trim();
        image.imageSource = null;
        image["_url"] = value;
        image._setValue(Image.isLoadingProperty, true);
        if (imageSource.isFileOrResourcePath(value)) {
            image.imageSource = imageSource.fromFileOrResource(value);
            image._setValue(Image.isLoadingProperty, false);
        }
        else {
            imageSource.fromUrl(value).then(function (r) {
                if (image["_url"] === value) {
                    image.imageSource = r;
                    image._setValue(Image.isLoadingProperty, false);
                }
            });
        }
    }
    else if (value instanceof imageSource.ImageSource) {
        image.imageSource = value;
    }
    else {
        image.imageSource = imageSource.fromNativeSource(value);
    }
}
var Image = (function (_super) {
    __extends(Image, _super);
    function Image(options) {
        _super.call(this, options);
    }
    Object.defineProperty(Image.prototype, "imageSource", {
        get: function () {
            return this._getValue(Image.imageSourceProperty);
        },
        set: function (value) {
            this._setValue(Image.imageSourceProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "src", {
        get: function () {
            return this._getValue(Image.srcProperty);
        },
        set: function (value) {
            this._setValue(Image.srcProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "isLoading", {
        get: function () {
            return this._getValue(Image.isLoadingProperty);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "stretch", {
        get: function () {
            return this._getValue(Image.stretchProperty);
        },
        set: function (value) {
            this._setValue(Image.stretchProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Image.prototype._setNativeImage = function (nativeImage) {
    };
    Image.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
        var nativeWidth = this.imageSource ? this.imageSource.width : 0;
        var nativeHeight = this.imageSource ? this.imageSource.height : 0;
        var measureWidth = Math.max(nativeWidth, this.minWidth);
        var measureHeight = Math.max(nativeHeight, this.minHeight);
        var finiteWidth = widthMode !== utils.layout.UNSPECIFIED;
        var finiteHeight = heightMode !== utils.layout.UNSPECIFIED;
        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var scale = Image.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch);
            var resultW = Math.floor(nativeWidth * scale.width);
            var resultH = Math.floor(nativeHeight * scale.height);
            measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
            measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;
            trace.write("Image stretch: " + this.stretch +
                ", nativeWidth: " + nativeWidth +
                ", nativeHeight: " + nativeHeight, trace.categories.Layout);
        }
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Image.computeScaleFactor = function (measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
        var scaleW = 1;
        var scaleH = 1;
        if ((imageStretch === enums.Stretch.aspectFill || imageStretch === enums.Stretch.aspectFit || imageStretch === enums.Stretch.fill) &&
            (widthIsFinite || heightIsFinite)) {
            scaleW = (nativeWidth > 0) ? measureWidth / nativeWidth : 0;
            scaleH = (nativeHeight > 0) ? measureHeight / nativeHeight : 0;
            if (!widthIsFinite) {
                scaleW = scaleH;
            }
            else if (!heightIsFinite) {
                scaleH = scaleW;
            }
            else {
                switch (imageStretch) {
                    case enums.Stretch.aspectFit:
                        scaleH = scaleW < scaleH ? scaleW : scaleH;
                        scaleW = scaleH;
                        break;
                    case enums.Stretch.aspectFill:
                        scaleH = scaleW > scaleH ? scaleW : scaleH;
                        scaleW = scaleH;
                        break;
                }
            }
        }
        return { width: scaleW, height: scaleH };
    };
    Image.srcProperty = new dependencyObservable.Property(SRC, IMAGE, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onSrcPropertyChanged));
    Image.imageSourceProperty = new dependencyObservable.Property(IMAGE_SOURCE, IMAGE, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));
    Image.isLoadingProperty = new dependencyObservable.Property(ISLOADING, IMAGE, new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None));
    Image.stretchProperty = new dependencyObservable.Property(STRETCH, IMAGE, new proxy.PropertyMetadata(enums.Stretch.aspectFit, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
    return Image;
})(view.View);
exports.Image = Image;
