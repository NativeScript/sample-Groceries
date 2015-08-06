var types = require("utils/types");
var _enabled = false;
var _categories = {};
var _writers = [];
var _eventListeners = [];
function enable() {
    _enabled = true;
}
exports.enable = enable;
function disable() {
    _enabled = false;
}
exports.disable = disable;
function addWriter(writer) {
    _writers.push(writer);
}
exports.addWriter = addWriter;
function removeWriter(writer) {
    var index = _writers.indexOf(writer);
    if (index >= 0) {
        _writers.splice(index, 1);
    }
}
exports.removeWriter = removeWriter;
function clearWriters() {
    if (_writers.length > 0) {
        _writers.splice(0, _writers.length);
    }
}
exports.clearWriters = clearWriters;
function setCategories(categories) {
    _categories = {};
    addCategories(categories);
}
exports.setCategories = setCategories;
function addCategories(categories) {
    var split = categories.split(",");
    _categories = {};
    var i;
    for (i = 0; i < split.length; i++) {
        _categories[split[i].trim()] = true;
    }
}
exports.addCategories = addCategories;
function write(message, category, type) {
    if (!_enabled) {
        return;
    }
    if (!(category in _categories)) {
        return;
    }
    var i;
    for (i = 0; i < _writers.length; i++) {
        _writers[i].write(message, category, type);
    }
}
exports.write = write;
function notifyEvent(object, name, data) {
    if (!_enabled) {
        return;
    }
    var i, listener, filters;
    for (i = 0; i < _eventListeners.length; i++) {
        listener = _eventListeners[i];
        if (listener.filter) {
            filters = listener.filter.split(",");
            filters.forEach(function (value) {
                if (value.trim() === name) {
                    listener.on(object, name, data);
                }
            });
        }
        else {
            listener.on(object, name, data);
        }
    }
}
exports.notifyEvent = notifyEvent;
function addEventListener(listener) {
    _eventListeners.push(listener);
}
exports.addEventListener = addEventListener;
function removeEventListener(listener) {
    var index = _eventListeners.indexOf(listener);
    if (index >= 0) {
        _eventListeners.splice(index, 1);
    }
}
exports.removeEventListener = removeEventListener;
var messageType;
(function (messageType) {
    messageType.log = 0;
    messageType.info = 1;
    messageType.warn = 2;
    messageType.error = 3;
})(messageType = exports.messageType || (exports.messageType = {}));
var categories;
(function (categories) {
    categories.VisualTreeEvents = "VisualTreeEvents";
    categories.Layout = "Layout";
    categories.Style = "Style";
    categories.ViewHierarchy = "ViewHierarchy";
    categories.NativeLifecycle = "NativeLifecycle";
    categories.Debug = "Debug";
    categories.Navigation = "Navigation";
    categories.Test = "Test";
    categories.Binding = "Binding";
    categories.Error = "Error";
    categories.Animation = "Animation";
    categories.All = categories.VisualTreeEvents + "," + categories.Layout + "," + categories.Style + "," + categories.ViewHierarchy + "," + categories.NativeLifecycle + "," + categories.Debug + "," + categories.Navigation + "," + categories.Test + "," + categories.Binding + "," + categories.Error + "," + categories.Animation;
    categories.separator = ",";
    function concat() {
        var i;
        var result;
        for (i = 0; i < arguments.length; i++) {
            if (!result) {
                result = arguments[i];
                continue;
            }
            result = result.concat(categories.separator, arguments[i]);
        }
        return result;
    }
    categories.concat = concat;
})(categories = exports.categories || (exports.categories = {}));
var ConsoleWriter = (function () {
    function ConsoleWriter() {
    }
    ConsoleWriter.prototype.write = function (message, category, type) {
        if (!console) {
            return;
        }
        var msgType;
        if (types.isUndefined(type)) {
            msgType = messageType.log;
        }
        else {
            msgType = type;
        }
        switch (msgType) {
            case messageType.log:
                console.log(category + ": " + message);
                break;
            case messageType.info:
                console.info(category + ": " + message);
                break;
            case messageType.warn:
                console.warn(category + ": " + message);
                break;
            case messageType.error:
                console.error(category + ": " + message);
                break;
        }
    };
    return ConsoleWriter;
})();
addWriter(new ConsoleWriter());
