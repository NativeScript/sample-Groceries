var color = require("color");
var enums = require("ui/enums");
function colorConverter(value) {
    return new color.Color(value);
}
exports.colorConverter = colorConverter;
function fontSizeConverter(value) {
    var result = parseFloat(value);
    return result;
}
exports.fontSizeConverter = fontSizeConverter;
function textAlignConverter(value) {
    switch (value) {
        case enums.TextAlignment.left:
        case enums.TextAlignment.center:
        case enums.TextAlignment.right:
            return value;
            break;
        default:
            throw new Error("CSS text-align \"" + value + "\" is not supported.");
            break;
    }
}
exports.textAlignConverter = textAlignConverter;
exports.numberConverter = parseFloat;
function visibilityConverter(value) {
    if (value.toLowerCase() === enums.Visibility.collapsed) {
        return enums.Visibility.collapsed;
    }
    else if (value.toLowerCase() === enums.Visibility.collapse) {
        return enums.Visibility.collapse;
    }
    return enums.Visibility.visible;
}
exports.visibilityConverter = visibilityConverter;
function opacityConverter(value) {
    var result = parseFloat(value);
    result = Math.max(0.0, result);
    result = Math.min(1.0, result);
    return result;
}
exports.opacityConverter = opacityConverter;
