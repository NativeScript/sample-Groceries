var FrameHandlerImpl = (function (_super) {
    __extends(FrameHandlerImpl, _super);
    function FrameHandlerImpl() {
        _super.apply(this, arguments);
    }
    FrameHandlerImpl.new = function () {
        return _super.new.call(this);
    };
    FrameHandlerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    FrameHandlerImpl.prototype.handleFrame = function (sender) {
        this._owner._handleFrame(sender);
    };
    FrameHandlerImpl.ObjCExposedMethods = {
        "handleFrame": { returns: interop.types.void, params: [CADisplayLink] }
    };
    return FrameHandlerImpl;
})(NSObject);
var FPSCallback = (function () {
    function FPSCallback(onFrame) {
        this.onFrame = onFrame;
        this.impl = FrameHandlerImpl.new().initWithOwner(this);
        this.displayLink = CADisplayLink.displayLinkWithTargetSelector(this.impl, "handleFrame");
        this.displayLink.paused = true;
        this.displayLink.addToRunLoopForMode(NSRunLoop.currentRunLoop(), NSDefaultRunLoopMode);
        this.displayLink.addToRunLoopForMode(NSRunLoop.currentRunLoop(), UITrackingRunLoopMode);
    }
    FPSCallback.prototype.start = function () {
        if (this.running) {
            return;
        }
        this.running = true;
        this.displayLink.paused = false;
    };
    FPSCallback.prototype.stop = function () {
        if (!this.running) {
            return;
        }
        this.displayLink.paused = true;
        this.running = false;
    };
    FPSCallback.prototype._handleFrame = function (sender) {
        if (!this.running) {
            return;
        }
        this.onFrame(sender.timestamp * 1000);
    };
    return FPSCallback;
})();
exports.FPSCallback = FPSCallback;
