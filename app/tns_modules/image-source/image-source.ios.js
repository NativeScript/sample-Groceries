var types = require("utils/types");
var fs = require("file-system");
var common = require("image-source/image-source-common");
var enums = require("ui/enums");
global.moduleMerge(common, exports);
var ImageSource = (function () {
    function ImageSource() {
    }
    ImageSource.prototype.loadFromResource = function (name) {
        this.ios = UIImage.imageNamed(name);
        return this.ios != null;
    };
    ImageSource.prototype.loadFromFile = function (path) {
        var fileName = types.isString(path) ? path.trim() : "";
        if (fileName.indexOf("~/") === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
        }
        this.ios = UIImage.imageWithContentsOfFile(fileName);
        return this.ios != null;
    };
    ImageSource.prototype.loadFromData = function (data) {
        this.ios = UIImage.imageWithData(data);
        return this.ios != null;
    };
    ImageSource.prototype.loadFromBase64 = function (source) {
        if (types.isString(source)) {
            var data = NSData.alloc().initWithBase64EncodedStringOptions(source, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
            this.ios = UIImage.imageWithData(data);
        }
        return this.ios != null;
    };
    ImageSource.prototype.setNativeSource = function (source) {
        this.ios = source;
        return source != null;
    };
    ImageSource.prototype.saveToFile = function (path, format, quality) {
        if (!this.ios) {
            return false;
        }
        var data = getImageData(this.ios, format, quality);
        if (data) {
            return data.writeToFileAtomically(path, true);
        }
        return false;
    };
    ImageSource.prototype.toBase64String = function (format, quality) {
        var res = null;
        if (!this.ios) {
            return res;
        }
        var data = getImageData(this.ios, format, quality);
        if (data) {
            res = data.base64Encoding();
        }
        return res;
    };
    Object.defineProperty(ImageSource.prototype, "height", {
        get: function () {
            if (this.ios) {
                return this.ios.size.height;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageSource.prototype, "width", {
        get: function () {
            if (this.ios) {
                return this.ios.size.width;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    return ImageSource;
})();
exports.ImageSource = ImageSource;
function getImageData(instance, format, quality) {
    if (quality === void 0) { quality = 1.0; }
    var data = null;
    switch (format) {
        case enums.ImageFormat.png:
            data = UIImagePNGRepresentation(instance);
            break;
        case enums.ImageFormat.jpeg:
            data = UIImageJPEGRepresentation(instance, quality);
            break;
    }
    return data;
}
