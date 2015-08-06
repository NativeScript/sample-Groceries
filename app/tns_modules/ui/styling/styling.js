var styleModule = require("ui/styling/style");
var stylePropertyModule = require("ui/styling/style-property");
var stylersCommonModule = require("ui/styling/stylers-common");
var visualStateConstatnsModule = require("ui/styling/visual-state-constants");
var convertersModule = require("ui/styling/converters");
exports.Property = stylePropertyModule.Property;
exports.Style = styleModule.Style;
var properties;
(function (properties) {
    properties.fontSizeProperty = styleModule.fontSizeProperty;
    properties.colorProperty = styleModule.colorProperty;
    properties.backgroundColorProperty = styleModule.backgroundColorProperty;
    properties.textAlignmentProperty = styleModule.textAlignmentProperty;
    properties.getPropertyByName = stylePropertyModule.getPropertyByName;
    properties.getPropertyByCssName = stylePropertyModule.getPropertyByCssName;
    properties.eachProperty = stylePropertyModule.eachProperty;
    properties.eachInheritableProperty = stylePropertyModule.eachInheritableProperty;
})(properties = exports.properties || (exports.properties = {}));
;
var converters;
(function (converters) {
    converters.colorConverter = convertersModule.colorConverter;
    converters.fontSizeConverter = convertersModule.fontSizeConverter;
    converters.textAlignConverter = convertersModule.textAlignConverter;
    converters.numberConverter = convertersModule.numberConverter;
    converters.visibilityConverter = convertersModule.visibilityConverter;
})(converters = exports.converters || (exports.converters = {}));
;
var visualStates;
(function (visualStates) {
    visualStates.Normal = visualStateConstatnsModule.Normal;
    visualStates.Hovered = visualStateConstatnsModule.Hovered;
    visualStates.Pressed = visualStateConstatnsModule.Pressed;
})(visualStates = exports.visualStates || (exports.visualStates = {}));
;
var stylers;
(function (stylers) {
    stylers.StylePropertyChangedHandler = stylersCommonModule.StylePropertyChangedHandler;
    stylers.registerHandler = styleModule.registerHandler;
})(stylers = exports.stylers || (exports.stylers = {}));
