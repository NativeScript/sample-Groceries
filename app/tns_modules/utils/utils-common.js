var types = require("utils/types");
exports.RESOURCE_PREFIX = "res://";
function copyFrom(source, target) {
    if (types.isDefined(source) && types.isDefined(target)) {
        var i;
        var key;
        var value;
        var keys = Object.keys(source);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            value = source[key];
            if (types.isDefined(value)) {
                target[key] = value;
            }
        }
    }
}
exports.copyFrom = copyFrom;
var layout;
(function (layout) {
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    layout.UNSPECIFIED = 0 << MODE_SHIFT;
    layout.EXACTLY = 1 << MODE_SHIFT;
    layout.AT_MOST = 2 << MODE_SHIFT;
    layout.MEASURED_STATE_TOO_SMALL = 0x01000000;
    layout.MEASURED_STATE_MASK = 0xff000000;
    layout.MEASURED_SIZE_MASK = 0x00ffffff;
    function getMode(mode) {
        switch (mode) {
            case layout.EXACTLY:
                return "Exact";
            case layout.AT_MOST:
                return "AtMost";
            default:
                return "Unspecified";
        }
    }
    layout.getMode = getMode;
    function getMeasureSpecMode(spec) {
        return (spec & MODE_MASK);
    }
    layout.getMeasureSpecMode = getMeasureSpecMode;
    function getMeasureSpecSize(spec) {
        return (spec & ~MODE_MASK);
    }
    layout.getMeasureSpecSize = getMeasureSpecSize;
})(layout = exports.layout || (exports.layout = {}));
function isFileOrResourcePath(path) {
    if (!types.isString(path)) {
        return false;
    }
    return path.indexOf("~/") === 0 ||
        path.indexOf("/") === 0 ||
        path.indexOf(exports.RESOURCE_PREFIX) === 0;
}
exports.isFileOrResourcePath = isFileOrResourcePath;
function isDataURI(uri) {
    if (!types.isString(uri)) {
        return false;
    }
    var firstSegment = uri.trim().split(',')[0];
    return firstSegment && firstSegment.indexOf("data:") === 0 && firstSegment.indexOf('base64') >= 0;
}
exports.isDataURI = isDataURI;
