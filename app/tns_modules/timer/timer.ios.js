var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var timeoutCallbacks = {};
var timerId = 0;
var TimerTargetImpl = (function (_super) {
    __extends(TimerTargetImpl, _super);
    function TimerTargetImpl() {
        _super.apply(this, arguments);
    }
    TimerTargetImpl.new = function () {
        return _super.new.call(this);
    };
    TimerTargetImpl.prototype.initWithCallback = function (callback) {
        this._callback = callback;
        return this;
    };
    TimerTargetImpl.prototype.tick = function (timer) {
        this._callback();
    };
    TimerTargetImpl.ObjCExposedMethods = {
        "tick": { returns: interop.types.void, params: [NSTimer] }
    };
    return TimerTargetImpl;
})(NSObject);
function createTimerAndGetId(callback, milliseconds, shouldRepeat) {
    timerId++;
    var id = timerId;
    var timerTarget = TimerTargetImpl.new().initWithCallback(callback);
    var timer = NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(milliseconds / 1000, timerTarget, "tick", null, shouldRepeat);
    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = timer;
    }
    return id;
}
function setTimeout(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    return createTimerAndGetId(callback, milliseconds, false);
}
exports.setTimeout = setTimeout;
function clearTimeout(id) {
    if (timeoutCallbacks[id]) {
        timeoutCallbacks[id].invalidate();
        delete timeoutCallbacks[id];
    }
}
exports.clearTimeout = clearTimeout;
function setInterval(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    return createTimerAndGetId(callback, milliseconds, true);
}
exports.setInterval = setInterval;
exports.clearInterval = clearTimeout;
