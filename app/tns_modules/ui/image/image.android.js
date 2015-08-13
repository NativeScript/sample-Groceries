var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imageCommon = require("ui/image/image-common");
var enums = require("ui/enums");
require("utils/module-merge").merge(imageCommon, exports);
function onStretchPropertyChanged(data) {
    var image = data.object;
    if (!image.android) {
        return;
    }
    switch (data.newValue) {
        case enums.Stretch.aspectFit:
            image.android.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
            break;
        case enums.Stretch.aspectFill:
            image.android.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
            break;
        case enums.Stretch.fill:
            image.android.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
            break;
        case enums.Stretch.none:
        default:
            image.android.setScaleType(android.widget.ImageView.ScaleType.MATRIX);
            break;
    }
}
function onImageSourcePropertyChanged(data) {
    var image = data.object;
    if (!image.android) {
        return;
    }
    image._setNativeImage(data.newValue ? data.newValue.android : null);
}
imageCommon.Image.imageSourceProperty.metadata.onSetNativeValue = onImageSourcePropertyChanged;
imageCommon.Image.stretchProperty.metadata.onSetNativeValue = onStretchPropertyChanged;
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Image.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Image.prototype._createUI = function () {
        this._android = new android.widget.ImageView(this._context);
    };
    Image.prototype._setNativeImage = function (nativeImage) {
        this.android.setImageBitmap(nativeImage);
    };
    return Image;
})(imageCommon.Image);
exports.Image = Image;
