var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var dependencyObservable = require("ui/core/dependency-observable");
var weakEvents = require("ui/core/weak-event-listener");
var appModule = require("application");
var types = require("utils/types");
var trace = require("trace");
var polymerExpressions = require("js-libs/polymer-expressions");
var bindingBuilder = require("../builder/binding-builder");
var viewModule = require("ui/core/view");
var bindingContextProperty = new dependencyObservable.Property("bindingContext", "Bindable", new dependencyObservable.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.Inheritable, onBindingContextChanged));
function onBindingContextChanged(data) {
    var bindable = data.object;
    bindable._onBindingContextChanged(data.oldValue, data.newValue);
}
var contextKey = "context";
var paramsRegex = /\[\s*(['"])*(\w*)\1\s*\]/;
var parentsRegex = /\$parents\s*\[\s*(['"]*)\w*\1\s*\]/g;
var bc = bindingBuilder.bindingConstants;
var Bindable = (function (_super) {
    __extends(Bindable, _super);
    function Bindable() {
        _super.apply(this, arguments);
        this._bindings = {};
    }
    Object.defineProperty(Bindable.prototype, "bindingContext", {
        get: function () {
            return this._getValue(Bindable.bindingContextProperty);
        },
        set: function (value) {
            this._setValue(Bindable.bindingContextProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Bindable.prototype.bind = function (options, source) {
        var binding = this._bindings[options.targetProperty];
        if (binding) {
            binding.unbind();
        }
        binding = new Binding(this, options);
        this._bindings[options.targetProperty] = binding;
        var bindingSource = source;
        if (!bindingSource) {
            bindingSource = this.bindingContext;
            binding.sourceIsBindingContext = true;
        }
        if (!types.isNullOrUndefined(bindingSource)) {
            binding.bind(bindingSource);
        }
    };
    Bindable.prototype.unbind = function (property) {
        var binding = this._bindings[property];
        if (binding) {
            binding.unbind();
            delete this._bindings[property];
        }
    };
    Bindable.prototype._updateTwoWayBinding = function (propertyName, value) {
        var binding = this._bindings[propertyName];
        if (binding) {
            binding.updateTwoWay(value);
        }
    };
    Bindable.prototype._setCore = function (data) {
        _super.prototype._setCore.call(this, data);
        this._updateTwoWayBinding(data.propertyName, data.value);
    };
    Bindable.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        trace.write("Bindable._onPropertyChanged(" + this + ") " + property.name, trace.categories.Binding);
        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);
        if (this instanceof viewModule.View) {
            if (property.metadata.inheritable && this._isInheritedChange() === true) {
                return;
            }
        }
        var binding = this._bindings[property.name];
        if (binding && !binding.updating) {
            if (binding.options.twoWay) {
                trace.write("_updateTwoWayBinding(" + this + "): " + property.name, trace.categories.Binding);
                this._updateTwoWayBinding(property.name, newValue);
            }
            else {
                trace.write("_onPropertyChanged(" + this + ") removing binding for property: " + property.name, trace.categories.Binding);
                this.unbind(property.name);
            }
        }
    };
    Bindable.prototype._onBindingContextChanged = function (oldValue, newValue) {
        var binding;
        for (var p in this._bindings) {
            binding = this._bindings[p];
            if (binding.updating || !binding.sourceIsBindingContext) {
                continue;
            }
            trace.write("Binding target: " + binding.target.get() +
                " targetProperty: " + binding.options.targetProperty +
                " to the changed context: " + newValue, trace.categories.Binding);
            binding.unbind();
            if (!types.isNullOrUndefined(newValue)) {
                binding.bind(newValue);
            }
        }
    };
    Bindable.bindingContextProperty = bindingContextProperty;
    return Bindable;
})(dependencyObservable.DependencyObservable);
exports.Bindable = Bindable;
var Binding = (function () {
    function Binding(target, options) {
        this.updating = false;
        this.target = new WeakRef(target);
        this.options = options;
    }
    Binding.prototype.bind = function (obj) {
        if (types.isNullOrUndefined(obj)) {
            throw new Error("Expected valid object reference as a source in the Binding.bind method.");
        }
        if (typeof (obj) === "number") {
            obj = new Number(obj);
        }
        if (typeof (obj) === "boolean") {
            obj = new Boolean(obj);
        }
        if (typeof (obj) === "string") {
            obj = new String(obj);
        }
        this.source = new WeakRef(obj);
        this.updateTarget(this.getSourceProperty());
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }
        if (this.sourceOptions) {
            var sourceOptionsInstance = this.sourceOptions.instance.get();
            if (sourceOptionsInstance instanceof observable.Observable) {
                weakEvents.addWeakEventListener(sourceOptionsInstance, observable.Observable.propertyChangeEvent, this.onSourcePropertyChanged, this);
            }
        }
    };
    Binding.prototype.unbind = function () {
        if (!this.source) {
            return;
        }
        if (this.sourceOptions) {
            var sourceOptionsInstance = this.sourceOptions.instance.get();
            if (sourceOptionsInstance) {
                weakEvents.removeWeakEventListener(sourceOptionsInstance, observable.Observable.propertyChangeEvent, this.onSourcePropertyChanged, this);
            }
        }
        if (this.source) {
            this.source.clear();
        }
        if (this.sourceOptions) {
            this.sourceOptions.instance.clear();
            this.sourceOptions = undefined;
        }
        if (this.targetOptions) {
            this.targetOptions = undefined;
        }
    };
    Binding.prototype.prepareExpressionForUpdate = function () {
        var escapeRegex = /[-\/\\^$*+?.()|[\]{}]/g;
        var escapedSourceProperty = this.options.sourceProperty.replace(escapeRegex, '\\$&');
        var expRegex = new RegExp(escapedSourceProperty, 'g');
        var resultExp = this.options.expression.replace(expRegex, bc.newPropertyValueKey);
        return resultExp;
    };
    Binding.prototype.updateTwoWay = function (value) {
        if (this.updating) {
            return;
        }
        if (this.options.twoWay) {
            if (this.options.expression) {
                var changedModel = {};
                changedModel[bc.bindingValueKey] = value;
                changedModel[bc.newPropertyValueKey] = value;
                var sourcePropertyName = "";
                if (this.sourceOptions) {
                    sourcePropertyName = this.sourceOptions.property;
                }
                else if (typeof this.options.sourceProperty === "string" && this.options.sourceProperty.indexOf(".") === -1) {
                    sourcePropertyName = this.options.sourceProperty;
                }
                if (sourcePropertyName !== "") {
                    changedModel[sourcePropertyName] = value;
                }
                var updateExpression = this.prepareExpressionForUpdate();
                this.prepareContextForExpression(changedModel, updateExpression);
                var expressionValue = this._getExpressionValue(updateExpression, true, changedModel);
                if (expressionValue instanceof Error) {
                    trace.write(expressionValue.message, trace.categories.Binding, trace.messageType.error);
                }
                else {
                    this.updateSource(expressionValue);
                }
            }
            else {
                this.updateSource(value);
            }
        }
    };
    Binding.prototype._getExpressionValue = function (expression, isBackConvert, changedModel) {
        try {
            var exp = polymerExpressions.PolymerExpressions.getExpression(expression);
            if (exp) {
                var context = this.source && this.source.get && this.source.get() || global;
                var model = {};
                for (var prop in appModule.resources) {
                    if (appModule.resources.hasOwnProperty(prop) && !context.hasOwnProperty(prop)) {
                        context[prop] = appModule.resources[prop];
                    }
                }
                this.prepareContextForExpression(context, expression);
                model[contextKey] = context;
                return exp.getValue(model, isBackConvert, changedModel);
            }
            return new Error(expression + " is not a valid expression.");
        }
        catch (e) {
            var errorMessage = "Run-time error occured in file: " + e.sourceURL + " at line: " + e.line + " and column: " + e.column;
            return new Error(errorMessage);
        }
    };
    Binding.prototype.onSourcePropertyChanged = function (data) {
        if (this.options.expression) {
            var expressionValue = this._getExpressionValue(this.options.expression, false, undefined);
            if (expressionValue instanceof Error) {
                trace.write(expressionValue.message, trace.categories.Binding, trace.messageType.error);
            }
            else {
                this.updateTarget(expressionValue);
            }
        }
        else if (data.propertyName === this.sourceOptions.property) {
            this.updateTarget(data.value);
        }
    };
    Binding.prototype.prepareContextForExpression = function (model, expression) {
        var parentViewAndIndex;
        var parentView;
        if (expression.indexOf(bc.parentValueKey) > -1) {
            parentView = this.getParentView(this.target.get(), bc.parentValueKey).view;
            if (parentView) {
                model[bc.parentValueKey] = parentView.bindingContext;
            }
        }
        var parentsArray = expression.match(parentsRegex);
        if (parentsArray) {
            var i;
            for (i = 0; i < parentsArray.length; i++) {
                parentViewAndIndex = this.getParentView(this.target.get(), parentsArray[i]);
                if (parentViewAndIndex.view) {
                    model[bc.parentsValueKey] = model[bc.parentsValueKey] || {};
                    model[bc.parentsValueKey][parentViewAndIndex.index] = parentViewAndIndex.view.bindingContext;
                }
            }
        }
    };
    Binding.prototype.getSourceProperty = function () {
        if (this.options.expression) {
            var changedModel = {};
            changedModel[bc.bindingValueKey] = this.source.get();
            var expressionValue = this._getExpressionValue(this.options.expression, false, changedModel);
            if (expressionValue instanceof Error) {
                trace.write(expressionValue.message, trace.categories.Binding, trace.messageType.error);
            }
            else {
                return expressionValue;
            }
        }
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }
        var value;
        if (this.sourceOptions) {
            var sourceOptionsInstance = this.sourceOptions.instance.get();
            if (this.sourceOptions.property === bc.bindingValueKey) {
                value = sourceOptionsInstance;
            }
            else if (sourceOptionsInstance instanceof observable.Observable) {
                value = sourceOptionsInstance.get(this.sourceOptions.property);
            }
            else if (sourceOptionsInstance && this.sourceOptions.property &&
                this.sourceOptions.property in sourceOptionsInstance) {
                value = sourceOptionsInstance[this.sourceOptions.property];
            }
        }
        return value;
    };
    Binding.prototype.updateTarget = function (value) {
        if (this.updating || (!this.target || !this.target.get())) {
            return;
        }
        if (!this.targetOptions) {
            this.targetOptions = this.resolveOptions(this.target, this.options.targetProperty);
        }
        this.updateOptions(this.targetOptions, value);
    };
    Binding.prototype.updateSource = function (value) {
        if (this.updating || (!this.source || !this.source.get())) {
            return;
        }
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }
        this.updateOptions(this.sourceOptions, value);
    };
    Binding.prototype.getParentView = function (target, property) {
        if (!target || !(target instanceof viewModule.View)) {
            return { view: null, index: null };
        }
        var result;
        if (property === bc.parentValueKey) {
            result = target.parent;
        }
        if (property.indexOf(bc.parentsValueKey) === 0) {
            result = target.parent;
            var indexParams = paramsRegex.exec(property);
            var index;
            if (indexParams && indexParams.length > 1) {
                index = indexParams[2];
            }
            if (!isNaN(index)) {
                var indexAsInt = parseInt(index);
                while (indexAsInt > 0) {
                    result = result.parent;
                    indexAsInt--;
                }
            }
            else {
                while (result && result.typeName !== index) {
                    result = result.parent;
                }
            }
        }
        return { view: result, index: index };
    };
    Binding.prototype.resolveOptions = function (obj, property) {
        var options;
        if (property === bc.bindingValueKey) {
            options = {
                instance: obj,
                property: property
            };
            return options;
        }
        if (types.isString(property) && property.indexOf(".") !== -1) {
            var properties = property.split(".");
            var i;
            var currentObject = obj.get();
            for (i = 0; i < properties.length - 1; i++) {
                if (properties[i] === bc.bindingValueKey) {
                    continue;
                }
                if (properties[i] === bc.parentValueKey || properties[i].indexOf(bc.parentsValueKey) === 0) {
                    var parentView = this.getParentView(this.target.get(), properties[i]).view;
                    if (parentView) {
                        currentObject = parentView.bindingContext;
                    }
                    continue;
                }
                currentObject = currentObject[properties[i]];
            }
            if (!types.isNullOrUndefined(currentObject)) {
                options = {
                    instance: new WeakRef(currentObject),
                    property: properties[properties.length - 1]
                };
            }
        }
        else {
            options = {
                instance: obj,
                property: property
            };
        }
        return options;
    };
    Binding.prototype.updateOptions = function (options, value) {
        var optionsInstance;
        if (options && options.instance) {
            optionsInstance = options.instance.get();
        }
        if (!optionsInstance) {
            return;
        }
        this.updating = true;
        try {
            if (optionsInstance instanceof observable.Observable) {
                optionsInstance.set(options.property, value);
            }
            else {
                optionsInstance[options.property] = value;
            }
        }
        catch (ex) {
            trace.write("Binding error while setting property " + options.property + " of " + optionsInstance + ": " + ex, trace.categories.Binding, trace.messageType.error);
        }
        this.updating = false;
    };
    return Binding;
})();
exports.Binding = Binding;
