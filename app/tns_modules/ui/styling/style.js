var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/dependency-observable");
var color = require("color");
var types = require("utils/types");
var trace = require("trace");
var dependencyObservable = require("ui/core/dependency-observable");
var stylers = require("ui/styling/stylers");
var styleProperty = require("ui/styling/style-property");
var converters = require("ui/styling/converters");
var enums = require("ui/enums");
var imageSource = require("image-source");
var utils = require("utils/utils");
var font = require("ui/styling/font");
var background = require("ui/styling/background");
var _registeredHandlers = Array();
var _handlersCache = {};
var noStylingClasses = {};
var Style = (function (_super) {
    __extends(Style, _super);
    function Style(parentView) {
        _super.call(this);
        this._updateCounter = 0;
        this._nativeSetters = new Map();
        this._view = parentView;
    }
    Object.defineProperty(Style.prototype, "color", {
        get: function () {
            return this._getValue(exports.colorProperty);
        },
        set: function (value) {
            this._setValue(exports.colorProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "backgroundColor", {
        get: function () {
            return this._getValue(exports.backgroundColorProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundColorProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "backgroundImage", {
        get: function () {
            return this._getValue(exports.backgroundImageProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundImageProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "backgroundRepeat", {
        get: function () {
            return this._getValue(exports.backgroundRepeatProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundRepeatProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "backgroundSize", {
        get: function () {
            return this._getValue(exports.backgroundSizeProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundSizeProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "backgroundPosition", {
        get: function () {
            return this._getValue(exports.backgroundPositionProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundPositionProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "borderColor", {
        get: function () {
            return this._getValue(exports.borderColorProperty);
        },
        set: function (value) {
            this._setValue(exports.borderColorProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "borderWidth", {
        get: function () {
            return this._getValue(exports.borderWidthProperty);
        },
        set: function (value) {
            this._setValue(exports.borderWidthProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "borderRadius", {
        get: function () {
            return this._getValue(exports.borderRadiusProperty);
        },
        set: function (value) {
            this._setValue(exports.borderRadiusProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "fontSize", {
        get: function () {
            return this._getValue(exports.fontSizeProperty);
        },
        set: function (value) {
            this._setValue(exports.fontSizeProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "fontFamily", {
        get: function () {
            return this._getValue(exports.fontFamilyProperty);
        },
        set: function (value) {
            this._setValue(exports.fontFamilyProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "fontStyle", {
        get: function () {
            return this._getValue(exports.fontStyleProperty);
        },
        set: function (value) {
            this._setValue(exports.fontStyleProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "fontWeight", {
        get: function () {
            return this._getValue(exports.fontWeightProperty);
        },
        set: function (value) {
            this._setValue(exports.fontWeightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "font", {
        get: function () {
            return this._getValue(exports.fontProperty);
        },
        set: function (value) {
            this._setValue(exports.fontProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "textAlignment", {
        get: function () {
            return this._getValue(exports.textAlignmentProperty);
        },
        set: function (value) {
            this._setValue(exports.textAlignmentProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "minWidth", {
        get: function () {
            return this._getValue(exports.minWidthProperty);
        },
        set: function (value) {
            this._setValue(exports.minWidthProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "minHeight", {
        get: function () {
            return this._getValue(exports.minHeightProperty);
        },
        set: function (value) {
            this._setValue(exports.minHeightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "width", {
        get: function () {
            return this._getValue(exports.widthProperty);
        },
        set: function (value) {
            this._setValue(exports.widthProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "height", {
        get: function () {
            return this._getValue(exports.heightProperty);
        },
        set: function (value) {
            this._setValue(exports.heightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "margin", {
        get: function () {
            return this._getValue(exports.marginProperty);
        },
        set: function (value) {
            this._setValue(exports.marginProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginLeft", {
        get: function () {
            return this._getValue(exports.marginLeftProperty);
        },
        set: function (value) {
            this._setValue(exports.marginLeftProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginTop", {
        get: function () {
            return this._getValue(exports.marginTopProperty);
        },
        set: function (value) {
            this._setValue(exports.marginTopProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginRight", {
        get: function () {
            return this._getValue(exports.marginRightProperty);
        },
        set: function (value) {
            this._setValue(exports.marginRightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginBottom", {
        get: function () {
            return this._getValue(exports.marginBottomProperty);
        },
        set: function (value) {
            this._setValue(exports.marginBottomProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "padding", {
        get: function () {
            return this._getValue(exports.paddingProperty);
        },
        set: function (value) {
            this._setValue(exports.paddingProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingLeft", {
        get: function () {
            return this._getValue(exports.paddingLeftProperty);
        },
        set: function (value) {
            this._setValue(exports.paddingLeftProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingTop", {
        get: function () {
            return this._getValue(exports.paddingTopProperty);
        },
        set: function (value) {
            this._setValue(exports.paddingTopProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingRight", {
        get: function () {
            return this._getValue(exports.paddingRightProperty);
        },
        set: function (value) {
            this._setValue(exports.paddingRightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingBottom", {
        get: function () {
            return this._getValue(exports.paddingBottomProperty);
        },
        set: function (value) {
            this._setValue(exports.paddingBottomProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "horizontalAlignment", {
        get: function () {
            return this._getValue(exports.horizontalAlignmentProperty);
        },
        set: function (value) {
            this._setValue(exports.horizontalAlignmentProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "verticalAlignment", {
        get: function () {
            return this._getValue(exports.verticalAlignmentProperty);
        },
        set: function (value) {
            this._setValue(exports.verticalAlignmentProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "visibility", {
        get: function () {
            return this._getValue(exports.visibilityProperty);
        },
        set: function (value) {
            this._setValue(exports.visibilityProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "opacity", {
        get: function () {
            return this._getValue(exports.opacityProperty);
        },
        set: function (value) {
            this._setValue(exports.opacityProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Style.prototype._beginUpdate = function () {
        this._updateCounter++;
    };
    Style.prototype._endUpdate = function () {
        var _this = this;
        this._updateCounter--;
        if (this._updateCounter < 0) {
            throw new Error("style._endUpdate() called, but no update is in progress.");
        }
        if (this._updateCounter === 0) {
            this._nativeSetters.forEach(function (newValue, property, map) { _this._applyStyleProperty(property, newValue); });
            this._nativeSetters.clear();
        }
    };
    Style.prototype._resetCssValues = function () {
        var that = this;
        this._eachSetProperty(function (property) {
            that._resetValue(property, observable.ValueSource.Css);
            return true;
        });
    };
    Style.prototype._resetLocalValues = function () {
        var that = this;
        this._eachSetProperty(function (property) {
            that._resetValue(property, observable.ValueSource.Local);
            return true;
        });
    };
    Style.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        trace.write("Style._onPropertyChanged view:" + this._view +
            ", property: " + property.name +
            ", oldValue: " + oldValue +
            ", newValue: " + newValue, trace.categories.Style);
        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);
        this._view._checkMetadataOnPropertyChanged(property.metadata);
        this._applyProperty(property, newValue);
    };
    Style.prototype._syncNativeProperties = function () {
        var that = this;
        styleProperty.eachProperty(function (p) {
            var value = that._getValue(p);
            if (types.isDefined(value)) {
                that._applyProperty(p, value);
            }
        });
    };
    Style.prototype._applyProperty = function (property, newValue) {
        this._applyStyleProperty(property, newValue);
        if (this._view._childrenCount === 0 || !property.metadata.inheritable) {
            return;
        }
        var eachChild = function (child) {
            child.style._inheritStyleProperty(property);
            return true;
        };
        this._view._eachChildView(eachChild);
    };
    Style.prototype._applyStyleProperty = function (property, newValue) {
        if (this._updateCounter > 0) {
            this._nativeSetters.set(property, newValue);
            return;
        }
        try {
            var handler = getHandler(property, this._view);
            if (!handler) {
                trace.write("No handler for property: " + property.name + " with id: " + property.id + ", view:" + this._view, trace.categories.Style);
            }
            else {
                trace.write("Found handler for property: " + property.name + ", view:" + this._view, trace.categories.Style);
                var shouldReset = false;
                if (property.metadata.equalityComparer) {
                    shouldReset = property.metadata.equalityComparer(newValue, property.metadata.defaultValue);
                }
                else {
                    shouldReset = (newValue === property.metadata.defaultValue);
                }
                if (shouldReset) {
                    handler.resetProperty(property, this._view);
                }
                else {
                    handler.applyProperty(property, this._view, newValue);
                }
            }
        }
        catch (ex) {
            trace.write("Error setting property: " + property.name + " on " + this._view + ": " + ex, trace.categories.Style, trace.messageType.error);
        }
    };
    Style.prototype._inheritStyleProperty = function (property) {
        if (!property.metadata.inheritable) {
            throw new Error("An attempt was made to inherit a style property which is not marked as 'inheritable'.");
        }
        var currentParent = this._view.parent;
        var valueSource;
        while (currentParent) {
            valueSource = currentParent.style._getValueSource(property);
            if (valueSource > dependencyObservable.ValueSource.Default) {
                this._setValue(property, currentParent.style._getValue(property), dependencyObservable.ValueSource.Inherited);
                break;
            }
            currentParent = currentParent.parent;
        }
    };
    Style.prototype._inheritStyleProperties = function () {
        var that = this;
        styleProperty.eachInheritableProperty(function (p) {
            that._inheritStyleProperty(p);
        });
    };
    return Style;
})(observable.DependencyObservable);
exports.Style = Style;
function registerHandler(property, handler, className) {
    var realClassName = className ? className : "default";
    var handlerRecord = _registeredHandlers[property.id];
    if (!handlerRecord) {
        handlerRecord = {};
        _registeredHandlers[property.id] = handlerRecord;
    }
    handlerRecord[realClassName] = handler;
}
exports.registerHandler = registerHandler;
function registerNoStylingClass(className) {
    noStylingClasses[className] = 1;
}
exports.registerNoStylingClass = registerNoStylingClass;
function getHandler(property, view) {
    return getHandlerInternal(property.id, types.getClassInfo(view));
}
exports.getHandler = getHandler;
function getHandlerInternal(propertyId, classInfo) {
    var className = classInfo ? classInfo.name : "default";
    var handlerKey = className + propertyId;
    var result = _handlersCache[handlerKey];
    if (types.isDefined(result)) {
        return result;
    }
    var propertyHandlers = _registeredHandlers[propertyId];
    if (noStylingClasses.hasOwnProperty(className) || !propertyHandlers) {
        result = null;
    }
    else if (propertyHandlers.hasOwnProperty(className)) {
        result = propertyHandlers[className];
    }
    else if (classInfo) {
        result = getHandlerInternal(propertyId, classInfo.baseClassInfo);
    }
    else {
        result = null;
    }
    _handlersCache[handlerKey] = result;
    return result;
}
exports.colorProperty = new styleProperty.Property("color", "color", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.Inheritable, undefined, undefined, color.Color.equals), converters.colorConverter);
exports.backgroundImageProperty = new styleProperty.Property("backgroundImage", "background-image", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, onBackgroundImagePropertyChanged));
exports.backgroundColorProperty = new styleProperty.Property("backgroundColor", "background-color", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, onBackgroundColorPropertyChanged, undefined, color.Color.equals), converters.colorConverter);
exports.backgroundRepeatProperty = new styleProperty.Property("backgroundRepeat", "background-repeat", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, onBackgroundRepeatPropertyChanged));
exports.backgroundSizeProperty = new styleProperty.Property("backgroundSize", "background-size", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, onBackgroundSizePropertyChanged));
exports.backgroundPositionProperty = new styleProperty.Property("backgroundPosition", "background-position", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, onBackgroundPositionPropertyChanged));
exports.borderColorProperty = new styleProperty.Property("borderColor", "border-color", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, undefined, undefined, color.Color.equals), converters.colorConverter);
exports.borderWidthProperty = new styleProperty.Property("borderWidth", "border-width", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isPaddingValid), converters.numberConverter);
exports.borderRadiusProperty = new styleProperty.Property("borderRadius", "border-radius", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isPaddingValid), converters.numberConverter);
exports.backgroundInternalProperty = new styleProperty.Property("_backgroundInternal", "_backgroundInternal", new observable.PropertyMetadata(background.Background.default, observable.PropertyMetadataSettings.None, undefined, undefined, background.Background.equals));
function onBackgroundImagePropertyChanged(data) {
    var style = data.object;
    var url = data.newValue;
    var currentBackground = style._getValue(exports.backgroundInternalProperty);
    var isValid = false;
    if (types.isString(data.newValue)) {
        var pattern = /url\(('|")(.*?)\1\)/;
        var match = url.match(pattern);
        if (match && match[2]) {
            url = match[2];
        }
        if (utils.isDataURI(url)) {
            var base64Data = url.split(",")[1];
            if (types.isDefined(base64Data)) {
                style._setValue(exports.backgroundInternalProperty, currentBackground.withImage(imageSource.fromBase64(base64Data)));
                isValid = true;
            }
        }
        else if (utils.isFileOrResourcePath(url)) {
            style._setValue(exports.backgroundInternalProperty, currentBackground.withImage(imageSource.fromFileOrResource(url)));
            isValid = true;
        }
        else if (url.indexOf("http") !== -1) {
            style["_url"] = url;
            style._setValue(exports.backgroundInternalProperty, currentBackground.withImage(undefined));
            imageSource.fromUrl(url).then(function (r) {
                if (style && style["_url"] === url) {
                    style._setValue(exports.backgroundInternalProperty, currentBackground.withImage(r));
                }
            });
            isValid = true;
        }
    }
    if (!isValid) {
        style._setValue(exports.backgroundInternalProperty, currentBackground.withImage(undefined));
    }
}
function onBackgroundColorPropertyChanged(data) {
    var style = data.object;
    var currentBackground = style._getValue(exports.backgroundInternalProperty);
    if (!color.Color.equals(currentBackground.color, data.newValue)) {
        style._setValue(exports.backgroundInternalProperty, currentBackground.withColor(data.newValue));
    }
}
function onBackgroundSizePropertyChanged(data) {
    var style = data.object;
    var currentBackground = style._getValue(exports.backgroundInternalProperty);
    if (data.newValue !== currentBackground.size) {
        style._setValue(exports.backgroundInternalProperty, currentBackground.withSize(data.newValue));
    }
}
function onBackgroundRepeatPropertyChanged(data) {
    var style = data.object;
    var currentBackground = style._getValue(exports.backgroundInternalProperty);
    if (data.newValue !== currentBackground.repeat) {
        style._setValue(exports.backgroundInternalProperty, currentBackground.withRepeat(data.newValue));
    }
}
function onBackgroundPositionPropertyChanged(data) {
    var style = data.object;
    var currentBackground = style._getValue(exports.backgroundInternalProperty);
    if (data.newValue !== currentBackground.position) {
        style._setValue(exports.backgroundInternalProperty, currentBackground.withPosition(data.newValue));
    }
}
exports.fontProperty = new styleProperty.Property("font", "font", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.None, onFontChanged));
exports.fontSizeProperty = new styleProperty.Property("fontSize", "font-size", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.Inheritable, onFontSizeChanged), converters.fontSizeConverter);
exports.fontFamilyProperty = new styleProperty.Property("fontFamily", "font-family", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.Inheritable, onFontFamilyChanged));
exports.fontStyleProperty = new styleProperty.Property("fontStyle", "font-style", new observable.PropertyMetadata(enums.FontStyle.normal, observable.PropertyMetadataSettings.Inheritable, onFontStyleChanged, isFontStyleValid));
exports.fontWeightProperty = new styleProperty.Property("fontWeight", "font-weight", new observable.PropertyMetadata(enums.FontWeight.normal, observable.PropertyMetadataSettings.Inheritable, onFontWeightChanged, isFontWeightValid));
exports.fontInternalProperty = new styleProperty.Property("_fontInternal", "_fontInternal", new observable.PropertyMetadata(font.Font.default, observable.PropertyMetadataSettings.AffectsLayout, null, null, font.Font.equals), font.Font.parse);
function isFontWeightValid(value) {
    return value === enums.FontWeight.normal || value === enums.FontWeight.bold;
}
function isFontStyleValid(value) {
    return value === enums.FontStyle.normal || value === enums.FontStyle.italic;
}
function onFontFamilyChanged(data) {
    var style = data.object;
    var currentFont = style._getValue(exports.fontInternalProperty);
    if (currentFont.fontFamily !== data.newValue) {
        style._setValue(exports.fontInternalProperty, currentFont.withFontFamily(data.newValue));
    }
}
function onFontStyleChanged(data) {
    var style = data.object;
    var currentFont = style._getValue(exports.fontInternalProperty);
    if (currentFont.fontStyle !== data.newValue) {
        style._setValue(exports.fontInternalProperty, currentFont.withFontStyle(data.newValue));
    }
}
function onFontWeightChanged(data) {
    var style = data.object;
    var currentFont = style._getValue(exports.fontInternalProperty);
    if (currentFont.fontWeight !== data.newValue) {
        style._setValue(exports.fontInternalProperty, currentFont.withFontWeight(data.newValue));
    }
}
function onFontSizeChanged(data) {
    var style = data.object;
    var currentFont = style._getValue(exports.fontInternalProperty);
    if (currentFont.fontSize !== data.newValue) {
        style._setValue(exports.fontInternalProperty, currentFont.withFontSize(data.newValue));
    }
}
function onFontChanged(data) {
    var style = data.object;
    var newFont = font.Font.parse(data.newValue);
    var valueSource = style._getValueSource(exports.fontProperty);
    style._setValue(exports.fontFamilyProperty, newFont.fontFamily, valueSource);
    style._setValue(exports.fontStyleProperty, newFont.fontStyle, valueSource);
    style._setValue(exports.fontWeightProperty, newFont.fontWeight, valueSource);
    style._setValue(exports.fontSizeProperty, newFont.fontSize, valueSource);
}
exports.textAlignmentProperty = new styleProperty.Property("textAlignment", "text-align", new observable.PropertyMetadata(undefined, observable.PropertyMetadataSettings.AffectsLayout | observable.PropertyMetadataSettings.Inheritable), converters.textAlignConverter);
function isWidthHeightValid(value) {
    return isNaN(value) || (value >= 0.0 && isFinite(value));
}
function isMinWidthHeightValid(value) {
    return !isNaN(value) && value >= 0.0 && isFinite(value);
}
exports.widthProperty = new styleProperty.Property("width", "width", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataSettings.AffectsLayout, null, isWidthHeightValid), converters.numberConverter);
exports.heightProperty = new styleProperty.Property("height", "height", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataSettings.AffectsLayout, null, isWidthHeightValid), converters.numberConverter);
exports.minWidthProperty = new styleProperty.Property("minWidth", "min-width", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isMinWidthHeightValid), converters.numberConverter);
exports.minHeightProperty = new styleProperty.Property("minHeight", "min-height", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isMinWidthHeightValid), converters.numberConverter);
function parseThickness(value) {
    var result = { top: 0, right: 0, bottom: 0, left: 0 };
    if (types.isString(value)) {
        var arr = value.split(/[ ,]+/);
        var top = parseInt(arr[0]);
        top = isNaN(top) ? 0 : top;
        var right = parseInt(arr[1]);
        right = isNaN(right) ? top : right;
        var bottom = parseInt(arr[2]);
        bottom = isNaN(bottom) ? top : bottom;
        var left = parseInt(arr[3]);
        left = isNaN(left) ? right : left;
        result.top = top;
        result.right = right;
        result.bottom = bottom;
        result.left = left;
    }
    else if (types.isNumber(value)) {
        result.top = result.right = result.bottom = result.left = value;
    }
    return result;
}
function onPaddingChanged(data) {
    var thickness = parseThickness(data.newValue);
    var style = data.object;
    style.paddingTop = thickness.top;
    style.paddingRight = thickness.right;
    style.paddingBottom = thickness.bottom;
    style.paddingLeft = thickness.left;
}
function onMarginChanged(data) {
    var thickness = parseThickness(data.newValue);
    var style = data.object;
    style.marginTop = thickness.top;
    style.marginRight = thickness.right;
    style.marginBottom = thickness.bottom;
    style.marginLeft = thickness.left;
}
exports.verticalAlignmentProperty = new styleProperty.Property("verticalAlignment", "vertical-align", new observable.PropertyMetadata(enums.VerticalAlignment.stretch, observable.PropertyMetadataSettings.AffectsLayout));
exports.horizontalAlignmentProperty = new styleProperty.Property("horizontalAlignment", "horizontal-align", new observable.PropertyMetadata(enums.HorizontalAlignment.stretch, observable.PropertyMetadataSettings.AffectsLayout));
exports.marginProperty = new styleProperty.Property("margin", "margin", new observable.PropertyMetadata(null, null, onMarginChanged));
exports.paddingProperty = new styleProperty.Property("padding", "padding", new observable.PropertyMetadata(null, null, onPaddingChanged));
exports.marginLeftProperty = new styleProperty.Property("marginLeft", "margin-left", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isMarginValid), converters.numberConverter);
exports.marginRightProperty = new styleProperty.Property("marginRight", "margin-right", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isMarginValid), converters.numberConverter);
exports.marginTopProperty = new styleProperty.Property("marginTop", "margin-top", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isMarginValid), converters.numberConverter);
exports.marginBottomProperty = new styleProperty.Property("marginBottom", "margin-bottom", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isMarginValid), converters.numberConverter);
exports.paddingLeftProperty = new styleProperty.Property("paddingLeft", "padding-left", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isPaddingValid), converters.numberConverter);
exports.paddingRightProperty = new styleProperty.Property("paddingRight", "padding-right", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isPaddingValid), converters.numberConverter);
exports.paddingTopProperty = new styleProperty.Property("paddingTop", "padding-top", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isPaddingValid), converters.numberConverter);
exports.paddingBottomProperty = new styleProperty.Property("paddingBottom", "padding-bottom", new observable.PropertyMetadata(0, observable.PropertyMetadataSettings.AffectsLayout, null, isPaddingValid), converters.numberConverter);
function isVisibilityValid(value) {
    return value === enums.Visibility.visible || value === enums.Visibility.collapse || value === enums.Visibility.collapsed;
}
function setLayoutInfoVisibility(data) {
    data.object._view._isVisibleCache = (data.newValue === enums.Visibility.visible);
}
exports.visibilityProperty = new styleProperty.Property("visibility", "visibility", new observable.PropertyMetadata(enums.Visibility.visible, observable.PropertyMetadataSettings.AffectsLayout, setLayoutInfoVisibility, isVisibilityValid), converters.visibilityConverter);
function isPaddingValid(value) {
    return isFinite(value) && !isNaN(value) && value >= 0;
}
function isMarginValid(value) {
    return isFinite(value) && !isNaN(value);
}
function isOpacityValid(value) {
    var parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && 0 <= parsedValue && parsedValue <= 1;
}
exports.opacityProperty = new styleProperty.Property("opacity", "opacity", new observable.PropertyMetadata(1.0, observable.PropertyMetadataSettings.None, undefined, isOpacityValid), converters.opacityConverter);
stylers._registerDefaultStylers();
