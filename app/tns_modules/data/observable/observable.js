var types = require("utils/types");
var Observable = (function () {
    function Observable(json) {
        this._observers = {};
        if (json) {
            this._map = new Map();
            var that = this;
            var definePropertyFunc = function definePropertyFunc(propertyName) {
                Object.defineProperty(Observable.prototype, propertyName, {
                    get: function () {
                        return that._map.get(propertyName);
                    },
                    set: function (value) {
                        that._map.set(propertyName, value);
                        that.notify(that._createPropertyChangeData(propertyName, value));
                    },
                    enumerable: true,
                    configurable: true
                });
            };
            for (var prop in json) {
                if (json.hasOwnProperty(prop)) {
                    definePropertyFunc(prop);
                    this.set(prop, json[prop]);
                }
            }
        }
    }
    Object.defineProperty(Observable.prototype, "typeName", {
        get: function () {
            return types.getClass(this);
        },
        enumerable: true,
        configurable: true
    });
    Observable.prototype.on = function (eventNames, callback, thisArg) {
        this.addEventListener(eventNames, callback, thisArg);
    };
    Observable.prototype.off = function (eventNames, callback, thisArg) {
        this.removeEventListener(eventNames, callback, thisArg);
    };
    Observable.prototype.addEventListener = function (eventNames, callback, thisArg) {
        types.verifyCallback(callback);
        var events = eventNames.split(",");
        for (var i = 0, l = events.length; i < l; i++) {
            var event = events[i].trim();
            var list = this._getEventList(event, true);
            list.push({
                callback: callback,
                thisArg: thisArg
            });
        }
    };
    Observable.prototype.removeEventListener = function (eventNames, callback, thisArg) {
        var events = eventNames.split(",");
        for (var i = 0, l = events.length; i < l; i++) {
            var event = events[i].trim();
            if (callback) {
                var list = this._getEventList(event, false);
                if (list) {
                    var index = this._indexOfListener(list, callback, thisArg);
                    if (index >= 0) {
                        list.splice(index, 1);
                    }
                    if (list.length === 0) {
                        delete this._observers[event];
                    }
                }
            }
            else {
                this._observers[event] = undefined;
                delete this._observers[event];
            }
        }
    };
    Observable.prototype.set = function (name, value) {
        if (this[name] === value) {
            return;
        }
        var data = this._createPropertyChangeData(name, value);
        this._setCore(data);
        this.notify(data);
    };
    Observable.prototype.get = function (name) {
        return this[name];
    };
    Observable.prototype._setCore = function (data) {
        this[data.propertyName] = data.value;
    };
    Observable.prototype.notify = function (data) {
        var observers = this._getEventList(data.eventName);
        if (!observers) {
            return;
        }
        var i;
        var entry;
        for (i = 0; i < observers.length; i++) {
            entry = observers[i];
            if (entry.thisArg) {
                entry.callback.apply(entry.thisArg, [data]);
            }
            else {
                entry.callback(data);
            }
        }
    };
    Observable.prototype.hasListeners = function (eventName) {
        return eventName in this._observers;
    };
    Observable.prototype._createPropertyChangeData = function (name, value) {
        return {
            eventName: Observable.propertyChangeEvent,
            propertyName: name,
            object: this,
            value: value
        };
    };
    Observable.prototype._emit = function (eventNames) {
        var events = eventNames.split(",");
        for (var i = 0, l = events.length; i < l; i++) {
            var event = events[i].trim();
            this.notify({ eventName: event, object: this });
        }
    };
    Observable.prototype._getEventList = function (eventName, createIfNeeded) {
        if (!eventName) {
            throw new TypeError("EventName must be valid string.");
        }
        var list = this._observers[eventName];
        if (!list && createIfNeeded) {
            list = [];
            this._observers[eventName] = list;
        }
        return list;
    };
    Observable.prototype._indexOfListener = function (list, callback, thisArg) {
        var i;
        var entry;
        for (i = 0; i < list.length; i++) {
            entry = list[i];
            if (thisArg) {
                if (entry.callback === callback && entry.thisArg === thisArg) {
                    return i;
                }
            }
            else {
                if (entry.callback === callback) {
                    return i;
                }
            }
        }
        return -1;
    };
    Observable.prototype.toString = function () {
        return this.typeName;
    };
    Observable.propertyChangeEvent = "propertyChange";
    return Observable;
})();
exports.Observable = Observable;
