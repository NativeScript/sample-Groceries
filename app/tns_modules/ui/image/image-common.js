var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
var imageSource = require("image-source");
var enums = require("ui/enums");
var types = require("utils/types");
var SRC = "src";
var IMAGE_SOURCE = "imageSource";
var IMAGE = "Image";
var ISLOADING = "isLoading";
var STRETCH = "stretch";
var AffectsLayout = global.android ? dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;
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
    Image.srcProperty = new dependencyObservable.Property(SRC, IMAGE, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onSrcPropertyChanged));
    Image.imageSourceProperty = new dependencyObservable.Property(IMAGE_SOURCE, IMAGE, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));
    Image.isLoadingProperty = new dependencyObservable.Property(ISLOADING, IMAGE, new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None));
    Image.stretchProperty = new dependencyObservable.Property(STRETCH, IMAGE, new proxy.PropertyMetadata(enums.Stretch.aspectFit, AffectsLayout));
    return Image;
})(view.View);
exports.Image = Image;
