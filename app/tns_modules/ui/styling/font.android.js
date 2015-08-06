var enums = require("ui/enums");
var common = require("ui/styling/font-common");
var application = require("application");
var trace = require("trace");
var types = require("utils/types");
var fs = require("file-system");
var typefaceCache = new Map();
var appAssets;
var FONTS_BASE_PATH = "app/fonts/";
var Font = (function (_super) {
    __extends(Font, _super);
    function Font(family, size, style, weight) {
        _super.call(this, family, size, style, weight);
    }
    Font.prototype.withFontFamily = function (family) {
        return new Font(family, this.fontSize, this.fontStyle, this.fontWeight);
    };
    Font.prototype.withFontStyle = function (style) {
        return new Font(this.fontFamily, this.fontSize, style, this.fontWeight);
    };
    Font.prototype.withFontWeight = function (weight) {
        return new Font(this.fontFamily, this.fontSize, this.fontStyle, weight);
    };
    Font.prototype.withFontSize = function (size) {
        return new Font(this.fontFamily, size, this.fontStyle, this.fontWeight);
    };
    Font.prototype.getAndroidTypeface = function () {
        if (!this._typeface) {
            var style = 0;
            if (this.isBold) {
                style |= android.graphics.Typeface.BOLD;
            }
            if (this.isItalic) {
                style |= android.graphics.Typeface.ITALIC;
            }
            var typeFace = this.getTypeFace(this.fontFamily);
            this._typeface = android.graphics.Typeface.create(typeFace, style);
        }
        return this._typeface;
    };
    Font.prototype.getTypeFace = function (fontFamily) {
        var fonts = common.parseFontFamily(fontFamily);
        var result = null;
        if (fonts.length === 0) {
            return null;
        }
        for (var i = 0; i < fonts.length; i++) {
            switch (fonts[i].toLowerCase()) {
                case common.genericFontFamilies.serif:
                    result = android.graphics.Typeface.SERIF;
                    break;
                case common.genericFontFamilies.sansSerif:
                    result = android.graphics.Typeface.SANS_SERIF;
                    break;
                case common.genericFontFamilies.monospace:
                    result = android.graphics.Typeface.MONOSPACE;
                    break;
                default:
                    result = this.loadFontFromAsset(fonts[i]);
                    break;
            }
            if (result) {
                return result;
            }
        }
        return null;
    };
    Font.prototype.loadFontFromAsset = function (fontFamily) {
        appAssets = appAssets || application.android.context.getAssets();
        if (!appAssets) {
            return null;
        }
        var result = typefaceCache.get(fontFamily);
        if (types.isUndefined(result)) {
            result = null;
            var fontAssetPath;
            var basePath = fs.path.join(fs.knownFolders.currentApp().path, "fonts", fontFamily);
            if (fs.File.exists(basePath + ".ttf")) {
                fontAssetPath = FONTS_BASE_PATH + fontFamily + ".ttf";
            }
            else if (fs.File.exists(basePath + ".otf")) {
                fontAssetPath = FONTS_BASE_PATH + fontFamily + ".otf";
            }
            else {
                trace.write("Could not find font file for " + fontFamily, trace.categories.Error, trace.messageType.error);
            }
            if (fontAssetPath) {
                try {
                    result = android.graphics.Typeface.createFromAsset(appAssets, fontAssetPath);
                }
                catch (e) {
                    trace.write("Error loading font asset: " + fontAssetPath, trace.categories.Error, trace.messageType.error);
                }
            }
            typefaceCache.set(fontFamily, result);
        }
        return result;
    };
    Font.default = new Font(undefined, undefined, enums.FontStyle.normal, enums.FontWeight.normal);
    return Font;
})(common.Font);
exports.Font = Font;
