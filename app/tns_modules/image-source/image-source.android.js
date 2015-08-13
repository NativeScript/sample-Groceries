var types = require("utils/types");
var fs = require("file-system");
var appModule = require("application");
var common = require("image-source/image-source-common");
var enums = require("ui/enums");
require("utils/module-merge").merge(common, exports);
var ImageSource = (function () {
    function ImageSource() {
    }
    ImageSource.prototype.loadFromResource = function (name) {
        this.android = null;
        var androidApp = appModule.android;
        var res = androidApp.context.getResources();
        if (res) {
            var identifier = res.getIdentifier(name, 'drawable', androidApp.packageName);
            if (0 < identifier) {
                var bitmapDrawable = res.getDrawable(identifier);
                if (bitmapDrawable && bitmapDrawable.getBitmap) {
                    this.android = bitmapDrawable.getBitmap();
                }
            }
        }
        return this.android != null;
    };
    ImageSource.prototype.loadFromFile = function (path) {
        var fileName = types.isString(path) ? path.trim() : "";
        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }
        this.android = android.graphics.BitmapFactory.decodeFile(fileName, null);
        return this.android != null;
    };
    ImageSource.prototype.loadFromData = function (data) {
        this.android = android.graphics.BitmapFactory.decodeStream(data);
        return this.android != null;
    };
    ImageSource.prototype.loadFromBase64 = function (source) {
        if (types.isString(source)) {
            var bytes = android.util.Base64.decode(source, android.util.Base64.DEFAULT);
            this.android = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        }
        return this.android != null;
    };
    ImageSource.prototype.setNativeSource = function (source) {
        this.android = source;
        return source != null;
    };
    ImageSource.prototype.saveToFile = function (path, format, quality) {
        if (quality === void 0) { quality = 100; }
        if (!this.android) {
            return false;
        }
        var targetFormat = getTargetFromat(format);
        var outputStream = new java.io.BufferedOutputStream(new java.io.FileOutputStream(path));
        var res = this.android.compress(targetFormat, quality, outputStream);
        outputStream.close();
        return res;
    };
    ImageSource.prototype.toBase64String = function (format, quality) {
        if (quality === void 0) { quality = 100; }
        if (!this.android) {
            return null;
            ;
        }
        var targetFormat = getTargetFromat(format);
        var outputStream = new java.io.ByteArrayOutputStream();
        var base64Stream = new android.util.Base64OutputStream(outputStream, android.util.Base64.NO_WRAP);
        this.android.compress(targetFormat, quality, base64Stream);
        base64Stream.close();
        outputStream.close();
        return outputStream.toString();
    };
    Object.defineProperty(ImageSource.prototype, "height", {
        get: function () {
            if (this.android) {
                return this.android.getHeight();
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "width", {
        get: function () {
            if (this.android) {
                return this.android.getWidth();
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    return ImageSource;
})();
exports.ImageSource = ImageSource;
function getTargetFromat(format) {
    switch (format) {
        case enums.ImageFormat.jpeg:
            return android.graphics.Bitmap.CompressFormat.JPEG;
        default:
            return android.graphics.Bitmap.CompressFormat.PNG;
    }
}
