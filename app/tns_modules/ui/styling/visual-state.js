var viewModule = require("ui/core/view");
var constants = require("ui/styling/visual-state-constants");
var observable = require("ui/core/dependency-observable");
var styleProperty = require("ui/styling/style-property");
var VisualState = (function () {
    function VisualState() {
        this._setters = {};
    }
    Object.defineProperty(VisualState.prototype, "setters", {
        get: function () {
            return this._setters;
        },
        enumerable: true,
        configurable: true
    });
    return VisualState;
})();
exports.VisualState = VisualState;
function goToState(view, state) {
    var root = viewModule.getAncestor(view, "Page");
    if (!root) {
        return undefined;
    }
    var allStates = root._getStyleScope().getVisualStates(view);
    if (!allStates) {
        return undefined;
    }
    if (!(state in allStates)) {
        state = constants.Normal;
    }
    if (state !== view.visualState) {
        var newState = allStates[state];
        var oldState = allStates[view.visualState];
        resetProperties(view, oldState, newState);
        applyProperties(view, newState);
    }
    return state;
}
exports.goToState = goToState;
function resetProperties(view, oldState, newState) {
    if (!oldState) {
        return;
    }
    var property;
    for (var name in oldState.setters) {
        if (newState && (name in newState.setters)) {
            continue;
        }
        property = styleProperty.getPropertyByName(name);
        if (property) {
            view.style._resetValue(property, observable.ValueSource.VisualState);
        }
    }
}
function applyProperties(view, state) {
    if (!state) {
        return;
    }
    var property;
    for (var name in state.setters) {
        property = styleProperty.getPropertyByName(name);
        if (property) {
            view.style._setValue(property, state.setters[name], observable.ValueSource.VisualState);
        }
    }
}
