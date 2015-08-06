var easysax = require("js-libs/easysax");
var ParserEventType = (function () {
    function ParserEventType() {
    }
    ParserEventType.StartElement = "StartElement";
    ParserEventType.EndElement = "EndElement";
    ParserEventType.Text = "Text";
    ParserEventType.CDATA = "CDATA";
    ParserEventType.Comment = "Comment";
    return ParserEventType;
})();
exports.ParserEventType = ParserEventType;
var ParserEvent = (function () {
    function ParserEvent(eventType, prefix, namespace, elementName, attributes, data) {
        this._eventType = eventType;
        this._prefix = prefix;
        this._namespace = namespace;
        this._elementName = elementName;
        this._attributes = attributes;
        this._data = data;
    }
    ParserEvent.prototype.toString = function () {
        return JSON.stringify({
            eventType: this.eventType,
            prefix: this.prefix,
            namespace: this.namespace,
            elementName: this.elementName,
            attributes: this.attributes,
            data: this.data
        });
    };
    Object.defineProperty(ParserEvent.prototype, "eventType", {
        get: function () {
            return this._eventType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserEvent.prototype, "prefix", {
        get: function () {
            return this._prefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserEvent.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserEvent.prototype, "elementName", {
        get: function () {
            return this._elementName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserEvent.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserEvent.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return ParserEvent;
})();
exports.ParserEvent = ParserEvent;
var XmlParser = (function () {
    function XmlParser(onEvent, onError, processNamespaces) {
        this._processNamespaces = processNamespaces;
        this._parser = new easysax.EasySAXParser();
        var that = this;
        this._parser.on('startNode', function (elem, attr, uq, str, tagend) {
            var attributes = attr();
            if (attributes === true) {
                attributes = undefined;
            }
            if (attributes) {
                var key;
                for (key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        attributes[key] = XmlParser._dereferenceEntities(attributes[key]);
                    }
                }
            }
            var prefix = undefined;
            var namespace = undefined;
            var name = elem;
            if (that._processNamespaces) {
                var stackEntry = XmlParser._getNamespacesStackEntry(attributes);
                that._namespaceStack.push(stackEntry);
                var resolved = that._resolveNamespace(name);
                prefix = resolved.prefix;
                namespace = resolved.namespace;
                name = resolved.name;
            }
            onEvent(new ParserEvent(ParserEventType.StartElement, prefix, namespace, name, attributes, undefined));
        });
        this._parser.on('textNode', function (text, uq) {
            var data = uq(text);
            onEvent(new ParserEvent(ParserEventType.Text, undefined, undefined, undefined, undefined, data));
        });
        this._parser.on('endNode', function (elem, uq, tagstart, str) {
            var prefix = undefined;
            var namespace = undefined;
            var name = elem;
            if (that._processNamespaces) {
                var resolved = that._resolveNamespace(name);
                prefix = resolved.prefix;
                namespace = resolved.namespace;
                name = resolved.name;
            }
            onEvent(new ParserEvent(ParserEventType.EndElement, prefix, namespace, name, undefined, undefined));
            if (that._processNamespaces) {
                that._namespaceStack.pop();
            }
        });
        this._parser.on('cdata', function (data) {
            onEvent(new ParserEvent(ParserEventType.CDATA, undefined, undefined, undefined, undefined, data));
        });
        this._parser.on('comment', function (text) {
            onEvent(new ParserEvent(ParserEventType.Comment, undefined, undefined, undefined, undefined, text));
        });
        if (onError) {
            this._parser.on('error', function (msg) {
                onError(new Error(msg));
            });
        }
    }
    Object.defineProperty(XmlParser.prototype, "angularSyntax", {
        get: function () {
            return this._parser.angularSyntax;
        },
        set: function (value) {
            this._parser.angularSyntax = value;
        },
        enumerable: true,
        configurable: true
    });
    XmlParser.prototype.parse = function (xmlString) {
        if (this._processNamespaces) {
            this._namespaceStack = [];
        }
        this._parser.parse(xmlString);
    };
    XmlParser._getNamespacesStackEntry = function (attributes) {
        var stackEntry = {};
        if (!attributes) {
            return stackEntry;
        }
        for (var key in attributes) {
            if (!attributes.hasOwnProperty(key)) {
                continue;
            }
            var attributeName = key;
            if (attributeName.indexOf("xmlns") !== 0) {
                continue;
            }
            var namespacePrefix = "";
            if (attributeName.indexOf(":") !== -1) {
                namespacePrefix = attributeName.split(":")[1];
            }
            stackEntry[namespacePrefix] = attributes[key];
        }
        return stackEntry;
    };
    XmlParser.prototype._resolveNamespace = function (fullName) {
        var result = { prefix: undefined, namespace: undefined, name: undefined };
        result.prefix = "";
        if (fullName.indexOf(":") !== -1) {
            var split = fullName.split(":");
            result.prefix = split[0];
            result.name = split[1];
        }
        else {
            result.name = fullName;
        }
        var i;
        var stackEntry;
        for (i = this._namespaceStack.length - 1; i >= 0; i--) {
            stackEntry = this._namespaceStack[i];
            for (var key in stackEntry) {
                if (!stackEntry.hasOwnProperty(key)) {
                    continue;
                }
                if (result.prefix === key) {
                    result.namespace = stackEntry[key];
                    return result;
                }
            }
        }
        return result;
    };
    XmlParser._dereferenceEntities = function (s) {
        s = String(s);
        if (s.length > 3 && s.indexOf('&') !== -1) {
            if (s.indexOf('&lt;') !== -1) {
                s = s.replace(/&lt;/g, '<');
            }
            if (s.indexOf('&gt;') !== -1) {
                s = s.replace(/&gt;/g, '>');
            }
            if (s.indexOf('&amp;') !== -1) {
                s = s.replace(/&amp;/g, '&');
            }
            if (s.indexOf('&apos;') !== -1) {
                s = s.replace(/&apos;/g, "'");
            }
            if (s.indexOf('&quot;') !== -1) {
                s = s.replace(/&quot;/g, '"');
            }
        }
        ;
        return s;
    };
    return XmlParser;
})();
exports.XmlParser = XmlParser;
