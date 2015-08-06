var KNOWNTEMPLATES = "knownTemplates";
var TemplateBuilder = (function () {
    function TemplateBuilder(templateProperty) {
        this._items = new Array();
        this._templateProperty = templateProperty;
    }
    Object.defineProperty(TemplateBuilder.prototype, "elementName", {
        get: function () {
            return this._templateProperty.elementName;
        },
        enumerable: true,
        configurable: true
    });
    TemplateBuilder.prototype.addStartElement = function (prefix, namespace, elementName, attributes) {
        this._items.push("<" +
            getElementNameWithPrefix(prefix, elementName) +
            (namespace ? " " + getNamespace(prefix, namespace) : "") +
            (attributes ? " " + getAttributesAsString(attributes) : "") +
            ">");
    };
    TemplateBuilder.prototype.addEndElement = function (prefix, elementName) {
        this._items.push("</" + getElementNameWithPrefix(prefix, elementName) + ">");
    };
    TemplateBuilder.prototype.build = function () {
        if (this._templateProperty.name in this._templateProperty.parent.component) {
            this._templateProperty.parent.component[this._templateProperty.name] = this._items.join("");
        }
    };
    return TemplateBuilder;
})();
exports.TemplateBuilder = TemplateBuilder;
function isKnownTemplate(name, exports) {
    return KNOWNTEMPLATES in exports && exports[KNOWNTEMPLATES] && name in exports[KNOWNTEMPLATES];
}
exports.isKnownTemplate = isKnownTemplate;
function getAttributesAsString(attributes) {
    var result = [];
    for (var item in attributes) {
        result.push(item + '="' + attributes[item] + '"');
    }
    return result.join(" ");
}
function getElementNameWithPrefix(prefix, elementName) {
    return (prefix ? prefix + ":" : "") + elementName;
}
function getNamespace(prefix, namespace) {
    return 'xmlns:' + prefix + '="' + namespace + '"';
}
