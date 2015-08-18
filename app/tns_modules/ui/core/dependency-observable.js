var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var types = require("utils/types");
var propertyFromKey = {};
var propertyIdCounter = 0;
function generatePropertyKey(name, ownerType, validate) {
    if (validate) {
        validateRegisterParameters(name, ownerType);
    }
    return ownerType + "." + name;
}
function validateRegisterParameters(name, ownerType) {
    if (name == null || name.trim().length === 0) {
        throw new Error("Name should not be null or empty string.");
    }
    if (ownerType == null || ownerType.trim().length === 0) {
        throw new Error("OwnerType should not be null or empty string.");
    }
}
function getPropertyByNameAndType(name, owner) {
    var result;
    var key;
    var classInfo = types.getClassInfo(owner);
    while (classInfo) {
        key = generatePropertyKey(name, classInfo.name);
        result = propertyFromKey[key];
        if (result) {
            break;
        }
        classInfo = classInfo.baseClassInfo;
    }
    return result;
}
var PropertyMetadataSettings;
(function (PropertyMetadataSettings) {
    PropertyMetadataSettings.None = 0;
    PropertyMetadataSettings.AffectsLayout = 1;
    PropertyMetadataSettings.AffectsStyle = 1 << 1;
    PropertyMetadataSettings.Inheritable = 1 << 2;
})(PropertyMetadataSettings = exports.PropertyMetadataSettings || (exports.PropertyMetadataSettings = {}));
var ValueSource;
(function (ValueSource) {
    ValueSource.Default = 0;
    ValueSource.Inherited = 1;
    ValueSource.Css = 2;
    ValueSource.Local = 3;
    ValueSource.VisualState = 4;
})(ValueSource = exports.ValueSource || (exports.ValueSource = {}));
var PropertyMetadata = (function () {
    function PropertyMetadata(defaultValue, options, onChanged, onValidateValue, equalityComparer) {
        this._defaultValue = defaultValue;
        this._options = options;
        if (types.isUndefined(this._options)) {
            this._options = PropertyMetadataSettings.None;
        }
        this._onChanged = onChanged;
        this._onValidateValue = onValidateValue;
        this._equalityComparer = equalityComparer;
    }
    Object.defineProperty(PropertyMetadata.prototype, "defaultValue", {
        get: function () {
            return this._defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "onValueChanged", {
        get: function () {
            return this._onChanged;
        },
        set: function (value) {
            this._onChanged = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "onValidateValue", {
        get: function () {
            return this._onValidateValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "equalityComparer", {
        get: function () {
            return this._equalityComparer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "affectsLayout", {
        get: function () {
            return (this._options & PropertyMetadataSettings.AffectsLayout) === PropertyMetadataSettings.AffectsLayout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "affectsStyle", {
        get: function () {
            return (this._options & PropertyMetadataSettings.AffectsStyle) === PropertyMetadataSettings.AffectsStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyMetadata.prototype, "inheritable", {
        get: function () {
            return (this._options & PropertyMetadataSettings.Inheritable) === PropertyMetadataSettings.Inheritable;
        },
        enumerable: true,
        configurable: true
    });
    return PropertyMetadata;
})();
exports.PropertyMetadata = PropertyMetadata;
var Property = (function () {
    function Property(name, ownerType, metadata, valueConverter) {
        this._key = generatePropertyKey(name, ownerType, true);
        if (propertyFromKey[this._key]) {
            throw new Error("Property " + name + " already registered for type " + ownerType + ".");
        }
        propertyFromKey[this._key] = this;
        if (!metadata || !(metadata instanceof PropertyMetadata)) {
            throw new Error("Expected valid PropertyMetadata instance.");
        }
        this._name = name;
        this._ownerType = ownerType;
        this._metadata = metadata;
        if (!metadata.options) {
            metadata.options = PropertyMetadataSettings.None;
        }
        this._id = propertyIdCounter++;
        this._valueConverter = valueConverter;
    }
    Object.defineProperty(Property.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Property.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Property.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });
    Property.prototype.isValidValue = function (value) {
        if (this.metadata.onValidateValue) {
            return this.metadata.onValidateValue(value);
        }
        return true;
    };
    Object.defineProperty(Property.prototype, "valueConverter", {
        get: function () {
            return this._valueConverter;
        },
        enumerable: true,
        configurable: true
    });
    Property.prototype._getEffectiveValue = function (entry) {
        if (types.isDefined(entry.localValue)) {
            entry.valueSource = ValueSource.Local;
            return entry.localValue;
        }
        if (types.isDefined(entry.inheritedValue)) {
            entry.valueSource = ValueSource.Inherited;
            return entry.inheritedValue;
        }
        entry.valueSource = ValueSource.Default;
        return this.metadata.defaultValue;
    };
    return Property;
})();
exports.Property = Property;
var PropertyEntry = (function () {
    function PropertyEntry(property) {
        this._property = property;
    }
    Object.defineProperty(PropertyEntry.prototype, "property", {
        get: function () {
            return this._property;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyEntry.prototype, "effectiveValue", {
        get: function () {
            if (!this._effectiveValue) {
                this._effectiveValue = this._property._getEffectiveValue(this);
            }
            return this._effectiveValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyEntry.prototype, "valueSource", {
        get: function () {
            return this._valueSource;
        },
        set: function (value) {
            this._valueSource = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyEntry.prototype, "localValue", {
        get: function () {
            return this._localValue;
        },
        set: function (value) {
            this._localValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyEntry.prototype, "inheritedValue", {
        get: function () {
            return this._inheritedValue;
        },
        set: function (value) {
            this._inheritedValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyEntry.prototype, "cssValue", {
        get: function () {
            return this._cssValue;
        },
        set: function (value) {
            this._cssValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyEntry.prototype, "visualStateValue", {
        get: function () {
            return this._visualStateValue;
        },
        set: function (value) {
            this._visualStateValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });
    PropertyEntry.prototype.resetValue = function () {
        this._valueSource = ValueSource.Default;
        this._visualStateValue = undefined;
        this._localValue = undefined;
        this._cssValue = undefined;
        this._inheritedValue = undefined;
        this._effectiveValue = undefined;
    };
    return PropertyEntry;
})();
exports.PropertyEntry = PropertyEntry;
var DependencyObservable = (function (_super) {
    __extends(DependencyObservable, _super);
    function DependencyObservable() {
        _super.apply(this, arguments);
        this._propertyEntries = {};
    }
    DependencyObservable.prototype.set = function (name, value) {
        var property = getPropertyByNameAndType(name, this);
        if (property) {
            this._setValue(property, value, ValueSource.Local);
        }
        else {
            _super.prototype.set.call(this, name, value);
        }
    };
    DependencyObservable.prototype.get = function (name) {
        var property = getPropertyByNameAndType(name, this);
        if (property) {
            return this._getValue(property);
        }
        else {
            return _super.prototype.get.call(this, name);
        }
    };
    DependencyObservable.prototype._setValue = function (property, value, source) {
        if (!property.isValidValue(value)) {
            throw new Error("Invalid value " + value + " for property " + property.name);
        }
        if (types.isUndefined(source)) {
            source = ValueSource.Local;
        }
        this._setValueInternal(property, value, source);
    };
    DependencyObservable.prototype._getValueSource = function (property) {
        var entry = this._propertyEntries[property.id];
        if (entry) {
            return entry.valueSource;
        }
        return ValueSource.Default;
    };
    DependencyObservable.prototype._getValue = function (property) {
        var entry = this._propertyEntries[property.id];
        if (entry) {
            return entry.effectiveValue;
        }
        return property.metadata.defaultValue;
    };
    DependencyObservable.prototype._resetValue = function (property, source) {
        if (!(property.id in this._propertyEntries)) {
            return;
        }
        if (types.isDefined(source)) {
            this._setValueInternal(property, undefined, source);
        }
        else {
            var currentValue = this._getValue(property);
            delete this._propertyEntries[property.id];
            var newValue = this._getValue(property);
            var comparer = property.metadata.equalityComparer || this._defaultComparer;
            if (!comparer(currentValue, newValue)) {
                this._onPropertyChanged(property, currentValue, newValue);
            }
        }
    };
    DependencyObservable.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        if (property.metadata.onValueChanged) {
            property.metadata.onValueChanged({
                object: this,
                property: property,
                eventName: observable.Observable.propertyChangeEvent,
                newValue: newValue,
                oldValue: oldValue
            });
        }
        if (this.hasListeners(observable.Observable.propertyChangeEvent)) {
            var changeData = _super.prototype._createPropertyChangeData.call(this, property.name, newValue);
            this.notify(changeData);
        }
    };
    DependencyObservable.prototype._eachSetProperty = function (callback) {
        var i;
        var key;
        var entry;
        var retVal;
        var keys = Object.keys(this._propertyEntries);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            entry = this._propertyEntries[key];
            retVal = callback(entry.property);
            if (!retVal) {
                break;
            }
        }
    };
    DependencyObservable.prototype.toString = function () {
        return this.typeName;
    };
    DependencyObservable.prototype._setValueInternal = function (property, value, source) {
        if (types.isString(value) && property.valueConverter) {
            value = property.valueConverter(value);
        }
        var entry = this._propertyEntries[property.id];
        if (!entry) {
            entry = new PropertyEntry(property);
            this._propertyEntries[property.id] = entry;
        }
        var currentValue = entry.effectiveValue;
        switch (source) {
            case ValueSource.Css:
                entry.cssValue = value;
                break;
            case ValueSource.Inherited:
                entry.inheritedValue = value;
                break;
            case ValueSource.Local:
                entry.localValue = value;
                break;
            case ValueSource.VisualState:
                entry.visualStateValue = value;
                break;
        }
        var comparer = property.metadata.equalityComparer || this._defaultComparer;
        if (!comparer(currentValue, entry.effectiveValue)) {
            this._onPropertyChanged(property, currentValue, entry.effectiveValue);
        }
    };
    DependencyObservable.prototype._defaultComparer = function (x, y) {
        return x === y;
    };
    return DependencyObservable;
})(observable.Observable);
exports.DependencyObservable = DependencyObservable;
