var observable = require("data/observable");
var dockLayoutDef = require("ui/layouts/dock-layout");
var gridLayoutModule = require("ui/layouts/grid-layout");
var absoluteLayoutDef = require("ui/layouts/absolute-layout");
var types = require("utils/types");
var fs = require("file-system");
var gestures = require("ui/gestures");
var bindingBuilder = require("ui/builder/binding-builder");
var platform = require("platform");
var EVENT = "Event";
var UI_PATH = "ui/";
var MODULES = {
    "ActivityIndicator": "ui/activity-indicator",
    "ListView": "ui/list-view",
    "GridLayout": "ui/layouts/grid-layout",
    "DockLayout": "ui/layouts/dock-layout",
    "WrapLayout": "ui/layouts/wrap-layout",
    "AbsoluteLayout": "ui/layouts/absolute-layout",
    "StackLayout": "ui/layouts/stack-layout",
    "ScrollView": "ui/scroll-view",
    "SearchBar": "ui/search-bar",
    "SlideOut": "ui/slide-out",
    "TabView": "ui/tab-view",
    "TabViewItem": "ui/tab-view",
    "TextField": "ui/text-field",
    "TextView": "ui/text-view",
    "FormattedString": "text/formatted-string",
    "Span": "text/span",
    "WebView": "ui/web-view",
    "HtmlView": "ui/html-view",
    "SegmentedBar": "ui/segmented-bar",
    "SegmentedBarItem": "ui/segmented-bar",
    "ToolBar": "ui/tool-bar",
    "ToolBarItem": "ui/tool-bar",
    "TimePicker": "ui/time-picker",
    "DatePicker": "ui/date-picker",
    "ListPicker": "ui/list-picker",
    "ActionBar": "ui/action-bar",
    "ActionItem": "ui/action-bar",
    "NavigationButton": "ui/action-bar",
};
var ROW = "row";
var COL = "col";
var COL_SPAN = "colSpan";
var ROW_SPAN = "rowSpan";
var DOCK = "dock";
var LEFT = "left";
var TOP = "top";
function getComponentModule(elementName, namespace, attributes, exports) {
    var instance;
    var instanceModule;
    var componentModule;
    var moduleId = MODULES[elementName] || UI_PATH + elementName.toLowerCase();
    try {
        if (types.isString(namespace)) {
            var pathInsideTNSModules = fs.path.join(fs.knownFolders.currentApp().path, "tns_modules", namespace);
            if (fs.Folder.exists(pathInsideTNSModules)) {
                moduleId = pathInsideTNSModules;
            }
            else {
                moduleId = fs.path.join(fs.knownFolders.currentApp().path, namespace);
            }
        }
        instanceModule = require(moduleId);
        var instanceType = instanceModule[elementName] || Object;
        instance = new instanceType();
    }
    catch (ex) {
        throw new Error("Cannot create module " + moduleId + ". " + ex + ". StackTrace: " + ex.stack);
    }
    if (instance && instanceModule) {
        var bindings = new Array();
        for (var attr in attributes) {
            var attrValue = attributes[attr];
            if (attr.indexOf(":") !== -1) {
                var platformName = attr.split(":")[0].trim();
                if (platformName.toLowerCase() === platform.device.os.toLowerCase()) {
                    attr = attr.split(":")[1].trim();
                }
                else {
                    continue;
                }
            }
            if (attr.indexOf(".") !== -1) {
                var subObj = instance;
                var properties = attr.split(".");
                var subPropName = properties[properties.length - 1];
                var i;
                for (i = 0; i < properties.length - 1; i++) {
                    if (types.isDefined(subObj)) {
                        subObj = subObj[properties[i]];
                    }
                }
                if (types.isDefined(subObj)) {
                    setPropertyValue(subObj, instanceModule, exports, subPropName, attrValue);
                }
            }
            else {
                setPropertyValue(instance, instanceModule, exports, attr, attrValue);
            }
        }
        componentModule = { component: instance, exports: instanceModule, bindings: bindings };
    }
    return componentModule;
}
exports.getComponentModule = getComponentModule;
function setPropertyValue(instance, instanceModule, exports, propertyName, propertyValue) {
    var isEvent = instanceModule && isKnownEvent(propertyName, instanceModule[instance.typeName]);
    if (isBinding(propertyValue) && instance.bind) {
        if (isEvent) {
            attachEventBinding(instance, propertyName, propertyValue);
        }
        else if (isGesture(propertyName, instance)) {
            attachGestureBinding(instance, propertyName, propertyValue);
        }
        else {
            var bindOptions = bindingBuilder.getBindingOptions(propertyName, getBindingExpressionFromAttribute(propertyValue));
            instance.bind({
                sourceProperty: bindOptions[bindingBuilder.bindingConstants.sourceProperty],
                targetProperty: bindOptions[bindingBuilder.bindingConstants.targetProperty],
                expression: bindOptions[bindingBuilder.bindingConstants.expression],
                twoWay: bindOptions[bindingBuilder.bindingConstants.twoWay]
            }, bindOptions[bindingBuilder.bindingConstants.source]);
        }
    }
    else if (isEvent) {
        var handler = exports && exports[propertyValue];
        if (types.isFunction(handler)) {
            instance.on(propertyName, handler);
        }
    }
    else if (isGesture(propertyName, instance)) {
        var gestureHandler = exports && exports[propertyValue];
        if (types.isFunction(gestureHandler)) {
            instance.observe(gestures.fromString(propertyName.toLowerCase()), gestureHandler);
        }
    }
    else if (propertyName === ROW) {
        gridLayoutModule.GridLayout.setRow(instance, !isNaN(+propertyValue) && +propertyValue);
    }
    else if (propertyName === COL) {
        gridLayoutModule.GridLayout.setColumn(instance, !isNaN(+propertyValue) && +propertyValue);
    }
    else if (propertyName === COL_SPAN) {
        gridLayoutModule.GridLayout.setColumnSpan(instance, !isNaN(+propertyValue) && +propertyValue);
    }
    else if (propertyName === ROW_SPAN) {
        gridLayoutModule.GridLayout.setRowSpan(instance, !isNaN(+propertyValue) && +propertyValue);
    }
    else if (propertyName === LEFT) {
        absoluteLayoutDef.AbsoluteLayout.setLeft(instance, !isNaN(+propertyValue) && +propertyValue);
    }
    else if (propertyName === TOP) {
        absoluteLayoutDef.AbsoluteLayout.setTop(instance, !isNaN(+propertyValue) && +propertyValue);
    }
    else if (propertyName === DOCK) {
        dockLayoutDef.DockLayout.setDock(instance, propertyValue);
    }
    else {
        var attrHandled = false;
        if (instance._applyXmlAttribute) {
            attrHandled = instance._applyXmlAttribute(propertyName, propertyValue);
        }
        if (!attrHandled) {
            var valueAsNumber = +propertyValue;
            if (!isNaN(valueAsNumber)) {
                instance[propertyName] = valueAsNumber;
            }
            else if (propertyValue && (propertyValue.toLowerCase() === "true" || propertyValue.toLowerCase() === "false")) {
                instance[propertyName] = propertyValue.toLowerCase() === "true" ? true : false;
            }
            else {
                instance[propertyName] = propertyValue;
            }
        }
    }
}
exports.setPropertyValue = setPropertyValue;
function attachEventBinding(instance, eventName, value) {
    var propertyChangeHandler = function (args) {
        if (args.propertyName === "bindingContext") {
            var handler = instance.bindingContext && instance.bindingContext[getBindingExpressionFromAttribute(value)];
            if (types.isFunction(handler)) {
                instance.on(eventName, handler, instance.bindingContext);
            }
            instance.off(observable.Observable.propertyChangeEvent, propertyChangeHandler);
        }
    };
    instance.on(observable.Observable.propertyChangeEvent, propertyChangeHandler);
}
function attachGestureBinding(instance, gestureName, value) {
    var propertyChangeHandler = function (args) {
        if (args.propertyName === "bindingContext") {
            var handler = instance.bindingContext && instance.bindingContext[getBindingExpressionFromAttribute(value)];
            if (types.isFunction(handler)) {
                instance.observe(gestures.fromString(gestureName.toLowerCase()), handler, instance.bindingContext);
            }
            instance.off(observable.Observable.propertyChangeEvent, propertyChangeHandler);
        }
    };
    instance.on(observable.Observable.propertyChangeEvent, propertyChangeHandler);
}
function isGesture(name, instance) {
    return gestures.fromString(name.toLowerCase()) !== undefined;
}
function isKnownEvent(name, exports) {
    var nameEvent = name + EVENT;
    var result = !types.isNullOrUndefined(exports) ? nameEvent in exports : false;
    return result;
}
function getBindingExpressionFromAttribute(value) {
    return value.replace("{{", "").replace("}}", "").trim();
}
function isBinding(value) {
    var isBinding;
    if (types.isString(value)) {
        var str = value.trim();
        isBinding = str.indexOf("{{") === 0 && str.lastIndexOf("}}") === str.length - 2;
    }
    return isBinding;
}
