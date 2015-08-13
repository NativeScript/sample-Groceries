var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var enums = require("ui/enums");
var common = require("ui/styling/font-common");
var fs = require("file-system");
var DEFAULT_SERIF = "Times New Roman";
var DEFAULT_SANS_SERIF = "Helvetica";
var DEFAULT_MONOSPACE = "Courier New";
var Font = (function (_super) {
    __extends(Font, _super);
    function Font(family, size, style, weight) {
        _super.call(this, family, size, style, weight);
    }
    Font.prototype.getUIFont = function (defaultFont) {
        if (!this._uiFont) {
            var symbolicTraits = 0;
            if (this.isBold) {
                symbolicTraits |= UIFontDescriptorSymbolicTraits.UIFontDescriptorTraitBold;
            }
            if (this.isItalic) {
                symbolicTraits |= UIFontDescriptorSymbolicTraits.UIFontDescriptorTraitItalic;
            }
            var descriptor = resolveFontDescriptor(this.fontFamily, symbolicTraits);
            if (!descriptor) {
                descriptor = defaultFont.fontDescriptor().fontDescriptorWithSymbolicTraits(symbolicTraits);
            }
            var size = this.fontSize || defaultFont.pointSize;
            this._uiFont = UIFont.fontWithDescriptorSize(descriptor, size);
        }
        return this._uiFont;
    };
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
    Font.default = new Font(undefined, undefined, enums.FontStyle.normal, enums.FontWeight.normal);
    return Font;
})(common.Font);
exports.Font = Font;
var areSystemFontSetsValid = false;
var systemFontFamilies = new Set();
var systemFonts = new Set();
function assureSystemFontSets() {
    if (!areSystemFontSetsValid) {
        var nsFontFamilies = UIFont.familyNames();
        for (var i = 0; i < nsFontFamilies.count; i++) {
            var family = nsFontFamilies.objectAtIndex(i);
            systemFontFamilies.add(family);
            var nsFonts = UIFont.fontNamesForFamilyName(family);
            for (var j = 0; j < nsFonts.count; j++) {
                var font = nsFonts.objectAtIndex(j);
                systemFonts.add(font);
            }
        }
        areSystemFontSetsValid = true;
    }
}
function resolveFontDescriptor(fontFamilyValue, symbolicTraits) {
    var fonts = common.parseFontFamily(fontFamilyValue);
    var result = null;
    if (fonts.length === 0) {
        return null;
    }
    assureSystemFontSets();
    for (var i = 0; i < fonts.length; i++) {
        var fontFamily = getFontFamilyRespectingGenericFonts(fonts[i]);
        if (systemFontFamilies.has(fontFamily)) {
            result = UIFontDescriptor.fontDescriptorWithNameSize(fontFamily, 0);
            if (symbolicTraits) {
                result = result.fontDescriptorWithSymbolicTraits(symbolicTraits);
            }
        }
        else if (systemFonts.has(fontFamily)) {
            result = UIFontDescriptor.fontDescriptorWithNameSize(fontFamily, 0);
        }
        if (result) {
            return result;
        }
    }
    return null;
}
function getFontFamilyRespectingGenericFonts(fontFamily) {
    if (!fontFamily) {
        return fontFamily;
    }
    switch (fontFamily.toLowerCase()) {
        case common.genericFontFamilies.serif:
            return DEFAULT_SERIF;
        case common.genericFontFamilies.sansSerif:
            return DEFAULT_SANS_SERIF;
        case common.genericFontFamilies.monospace:
            return DEFAULT_MONOSPACE;
        default:
            return fontFamily;
    }
}
var ios;
(function (ios) {
    function registerFont(fontFile) {
        var filePath = fs.path.join(fs.knownFolders.currentApp().path, "fonts", fontFile);
        var fontData = NSFileManager.defaultManager().contentsAtPath(filePath);
        if (!fontData) {
            throw new Error("Could not load font from: " + fontFile);
        }
        var provider = CGDataProviderCreateWithCFData(fontData);
        var font = CGFontCreateWithDataProvider(provider);
        if (!font) {
            throw new Error("Could not load font from: " + fontFile);
        }
        var error = NSError.alloc().init();
        if (!CTFontManagerRegisterGraphicsFont(font, error)) {
            throw new Error(error.localizedDescription);
        }
        areSystemFontSetsValid = false;
    }
    ios.registerFont = registerFont;
})(ios = exports.ios || (exports.ios = {}));
