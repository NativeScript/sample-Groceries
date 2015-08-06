var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var enums = require("ui/enums");
function isValidOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
exports.orientationProperty = new dependencyObservable.Property("orientation", "ScrollView", new proxy.PropertyMetadata(enums.Orientation.vertical, dependencyObservable.PropertyMetadataSettings.AffectsLayout, undefined, isValidOrientation));
