var view = require("ui/core/view");
var fs = require("file-system");
var xml = require("xml");
var file_access_module = require("file-system/file-system-access");
var types = require("utils/types");
var componentBuilder = require("ui/builder/component-builder");
var templateBuilderDef = require("ui/builder/template-builder");
var platform = require("platform");
var page = require("ui/page");
var fileResolverModule = require("file-system/file-name-resolver");
var trace = require("trace");
var KNOWNCOLLECTIONS = "knownCollections";
function isPlatform(value) {
    return value && (value.toLowerCase() === platform.platformNames.android.toLowerCase()
        || value.toLowerCase() === platform.platformNames.ios.toLowerCase());
}
function isCurentPlatform(value) {
    return value && value.toLowerCase() === platform.device.os.toLowerCase();
}
function parse(value, context) {
    var viewToReturn;
    if (context instanceof view.View) {
        context = getExports(context);
    }
    var componentModule = parseInternal(value, context);
    if (componentModule) {
        viewToReturn = componentModule.component;
    }
    return viewToReturn;
}
exports.parse = parse;
function parseInternal(value, context) {
    var currentPage;
    var rootComponentModule;
    var parents = new Array();
    var complexProperties = new Array();
    var templateBuilder;
    var currentPlatformContext;
    var xmlParser = new xml.XmlParser(function (args) {
        if (args.eventType === xml.ParserEventType.StartElement) {
            if (isPlatform(args.elementName)) {
                if (currentPlatformContext) {
                    throw new Error("Already in '" + currentPlatformContext + "' platform context and cannot switch to '" + args.elementName + "' platform! Platform tags cannot be nested.");
                }
                currentPlatformContext = args.elementName;
                return;
            }
        }
        if (args.eventType === xml.ParserEventType.EndElement) {
            if (isPlatform(args.elementName)) {
                currentPlatformContext = undefined;
                return;
            }
        }
        if (currentPlatformContext && !isCurentPlatform(currentPlatformContext)) {
            return;
        }
        if (templateBuilder) {
            if (args.eventType === xml.ParserEventType.StartElement) {
                templateBuilder.addStartElement(args.prefix, args.namespace, args.elementName, args.attributes);
            }
            else if (args.eventType === xml.ParserEventType.EndElement) {
                if (templateBuilder.elementName !== args.elementName) {
                    templateBuilder.addEndElement(args.prefix, args.elementName);
                }
                else {
                    templateBuilder.build();
                    templateBuilder = undefined;
                }
            }
        }
        var parent = parents[parents.length - 1];
        var complexProperty = complexProperties[complexProperties.length - 1];
        if (args.eventType === xml.ParserEventType.StartElement) {
            if (isComplexProperty(args.elementName)) {
                var name = getComplexProperty(args.elementName);
                complexProperties.push({
                    parent: parent,
                    name: name,
                    items: [],
                });
                if (templateBuilderDef.isKnownTemplate(name, parent.exports)) {
                    templateBuilder = new templateBuilderDef.TemplateBuilder({
                        parent: parent,
                        name: name,
                        elementName: args.elementName,
                        templateItems: []
                    });
                }
            }
            else {
                var componentModule;
                if (args.prefix && args.namespace) {
                    componentModule = loadCustomComponent(args.namespace, args.elementName, args.attributes, context, currentPage);
                }
                else {
                    componentModule = componentBuilder.getComponentModule(args.elementName, args.namespace, args.attributes, context);
                }
                if (componentModule) {
                    if (parent) {
                        if (componentModule.component instanceof view.View) {
                            if (complexProperty) {
                                addToComplexProperty(parent, complexProperty, componentModule);
                            }
                            else if (parent.component._addChildFromBuilder) {
                                parent.component._addChildFromBuilder(args.elementName, componentModule.component);
                            }
                        }
                        else if (complexProperty) {
                            addToComplexProperty(parent, complexProperty, componentModule);
                        }
                    }
                    else if (parents.length === 0) {
                        rootComponentModule = componentModule;
                        if (rootComponentModule && rootComponentModule.component instanceof page.Page) {
                            currentPage = rootComponentModule.component;
                        }
                    }
                    parents.push(componentModule);
                }
            }
        }
        else if (args.eventType === xml.ParserEventType.EndElement) {
            if (isComplexProperty(args.elementName)) {
                if (complexProperty) {
                    if (parent && parent.component._addArrayFromBuilder) {
                        parent.component._addArrayFromBuilder(complexProperty.name, complexProperty.items);
                        complexProperty.items = [];
                    }
                }
                complexProperties.pop();
            }
            else {
                parents.pop();
            }
        }
    }, function (e) {
        throw new Error("XML parse error: " + e.message);
    }, true);
    if (types.isString(value)) {
        value = value.replace(/xmlns=("|')http:\/\/www.nativescript.org\/tns.xsd\1/, "");
        xmlParser.parse(value);
    }
    return rootComponentModule;
}
function loadCustomComponent(componentPath, componentName, attributes, context, parentPage) {
    var result;
    componentPath = componentPath.replace("~/", "");
    var fullComponentPathFilePathWithoutExt = componentPath;
    if (!fs.File.exists(componentPath) || componentPath === "." || componentPath === "./") {
        fullComponentPathFilePathWithoutExt = fs.path.join(fs.knownFolders.currentApp().path, componentPath, componentName);
    }
    var xmlFilePath = fileResolverModule.resolveFileName(fullComponentPathFilePathWithoutExt, "xml");
    if (xmlFilePath) {
        var jsFilePath = fileResolverModule.resolveFileName(fullComponentPathFilePathWithoutExt, "js");
        var subExports;
        if (jsFilePath) {
            subExports = require(jsFilePath);
        }
        result = loadInternal(xmlFilePath, subExports);
        if (types.isDefined(result) && types.isDefined(result.component) && types.isDefined(attributes)) {
            var attr;
            for (attr in attributes) {
                componentBuilder.setPropertyValue(result.component, subExports, context, attr, attributes[attr]);
            }
        }
    }
    else {
        result = componentBuilder.getComponentModule(componentName, componentPath, attributes, context);
    }
    var cssFilePath = fileResolverModule.resolveFileName(fullComponentPathFilePathWithoutExt, "css");
    if (cssFilePath) {
        if (parentPage) {
            parentPage.addCssFile(cssFilePath);
        }
        else {
            trace.write("CSS file found but no page specified. Please specify page in the options!", trace.categories.Error, trace.messageType.error);
        }
    }
    return result;
}
function load(pathOrOptions, context) {
    var viewToReturn;
    var componentModule;
    if (!context) {
        if (!types.isString(pathOrOptions)) {
            var options = pathOrOptions;
            componentModule = loadCustomComponent(options.path, options.name, undefined, options.exports, options.page);
        }
        else {
            var path = pathOrOptions;
            componentModule = loadInternal(path);
        }
    }
    else {
        var path = pathOrOptions;
        componentModule = loadInternal(path, context);
    }
    if (componentModule) {
        viewToReturn = componentModule.component;
    }
    return viewToReturn;
}
exports.load = load;
function loadInternal(fileName, context) {
    var componentModule;
    if (fs.File.exists(fileName)) {
        var fileAccess = new file_access_module.FileSystemAccess();
        fileAccess.readText(fileName, function (result) {
            componentModule = parseInternal(result, context);
        }, function (e) {
            throw new Error("Error loading file " + fileName + " :" + e.message);
        });
    }
    if (componentModule && componentModule.component) {
        componentModule.component.exports = context;
    }
    return componentModule;
}
function isComplexProperty(name) {
    return types.isString(name) && name.indexOf(".") !== -1;
}
function getComplexProperty(fullName) {
    var name;
    if (types.isString(fullName)) {
        var names = fullName.split(".");
        name = names[names.length - 1];
    }
    return name;
}
function isKnownCollection(name, context) {
    return KNOWNCOLLECTIONS in context && context[KNOWNCOLLECTIONS] && name in context[KNOWNCOLLECTIONS];
}
function addToComplexProperty(parent, complexProperty, elementModule) {
    var parentComponent = parent.component;
    if (isKnownCollection(complexProperty.name, parent.exports)) {
        complexProperty.items.push(elementModule.component);
    }
    else if (parentComponent._addChildFromBuilder) {
        parentComponent._addChildFromBuilder("", elementModule.component);
    }
    else {
        parentComponent[complexProperty.name] = elementModule.component;
    }
}
function getExports(instance) {
    var parent = instance.parent;
    while (parent && parent.exports === undefined) {
        parent = parent.parent;
    }
    return parent ? parent.exports : undefined;
}
