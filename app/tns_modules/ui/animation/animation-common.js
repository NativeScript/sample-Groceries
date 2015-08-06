var trace = require("trace");
var Properties;
(function (Properties) {
    Properties.opacity = "opacity";
    Properties.backgroundColor = "backgroundColor";
    Properties.translate = "translate";
    Properties.rotate = "rotate";
    Properties.scale = "scale";
})(Properties = exports.Properties || (exports.Properties = {}));
var Animation = (function () {
    function Animation(animationDefinitions, playSequentially) {
        if (!animationDefinitions || animationDefinitions.length === 0) {
            throw new Error("No animation definitions specified");
        }
        trace.write("Analyzing " + animationDefinitions.length + " animation definitions...", trace.categories.Animation);
        this._propertyAnimations = new Array();
        var i = 0;
        var length = animationDefinitions.length;
        for (; i < length; i++) {
            this._propertyAnimations = this._propertyAnimations.concat(Animation._createPropertyAnimations(animationDefinitions[i]));
        }
        if (this._propertyAnimations.length === 0) {
            throw new Error("Nothing to animate.");
        }
        trace.write("Created " + this._propertyAnimations.length + " individual property animations.", trace.categories.Animation);
        this._playSequentially = playSequentially;
        var that = this;
        this._animationFinishedPromise = new Promise(function (resolve, reject) {
            that._resolve = resolve;
            that._reject = reject;
        });
    }
    Animation.prototype.play = function () {
        if (this.isPlaying) {
            throw new Error("Animation is already playing.");
        }
        this._isPlaying = true;
        return this;
    };
    Animation.prototype.cancel = function () {
        if (!this.isPlaying) {
            throw new Error("Animation is not currently playing.");
        }
    };
    Object.defineProperty(Animation.prototype, "finished", {
        get: function () {
            return this._animationFinishedPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Animation.prototype._resolveAnimationFinishedPromise = function () {
        this._isPlaying = false;
        this._resolve();
    };
    Animation.prototype._rejectAnimationFinishedPromise = function () {
        this._isPlaying = false;
        this._reject(new Error("Animation cancelled."));
    };
    Animation._createPropertyAnimations = function (animationDefinition) {
        if (!animationDefinition.target) {
            throw new Error("No animation target specified.");
        }
        var propertyAnimations = new Array();
        if (animationDefinition.opacity !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.opacity,
                value: animationDefinition.opacity,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.backgroundColor !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.backgroundColor,
                value: animationDefinition.backgroundColor,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.translate !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.translate,
                value: animationDefinition.translate,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.scale !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.scale,
                value: animationDefinition.scale,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (animationDefinition.rotate !== undefined) {
            propertyAnimations.push({
                target: animationDefinition.target,
                property: Properties.rotate,
                value: animationDefinition.rotate,
                duration: animationDefinition.duration,
                delay: animationDefinition.delay,
                iterations: animationDefinition.iterations,
                curve: animationDefinition.curve
            });
        }
        if (propertyAnimations.length === 0) {
            throw new Error("No animation property specified.");
        }
        return propertyAnimations;
    };
    Animation._getAnimationInfo = function (animation) {
        return JSON.stringify({
            target: animation.target.id,
            property: animation.property,
            value: animation.value,
            duration: animation.duration,
            delay: animation.delay,
            iterations: animation.iterations,
            curve: animation.curve
        });
    };
    return Animation;
})();
exports.Animation = Animation;
