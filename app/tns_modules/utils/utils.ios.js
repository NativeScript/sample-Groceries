var common = require("utils/utils-common");
var colorModule = require("color");
global.moduleMerge(common, exports);
function isOrientationLandscape(orientation) {
    return orientation === UIDeviceOrientation.UIDeviceOrientationLandscapeLeft || orientation === UIDeviceOrientation.UIDeviceOrientationLandscapeRight;
}
var layout;
(function (layout) {
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    function makeMeasureSpec(size, mode) {
        return (Math.round(size) & ~MODE_MASK) | (mode & MODE_MASK);
    }
    layout.makeMeasureSpec = makeMeasureSpec;
    function getDisplayDensity() {
        return 1;
    }
    layout.getDisplayDensity = getDisplayDensity;
})(layout = exports.layout || (exports.layout = {}));
var ios;
(function (ios) {
    var collections;
    (function (collections) {
        function jsArrayToNSArray(str) {
            var arr = new NSMutableArray();
            if ("undefined" !== typeof str) {
                for (var element in str) {
                    arr.addObject(str[element]);
                }
            }
            return arr;
        }
        collections.jsArrayToNSArray = jsArrayToNSArray;
        function nsArrayToJSArray(a) {
            var arr = [];
            if ("undefined" !== typeof a) {
                for (var i = 0; i < a.count; i++) {
                    arr.push(a.objectAtIndex(i));
                }
            }
            return arr;
        }
        collections.nsArrayToJSArray = nsArrayToJSArray;
    })(collections = ios.collections || (ios.collections = {}));
    function getColor(uiColor) {
        var redRef = new interop.Reference();
        var greenRef = new interop.Reference();
        var blueRef = new interop.Reference();
        var alphaRef = new interop.Reference();
        uiColor.getRedGreenBlueAlpha(redRef, greenRef, blueRef, alphaRef);
        var red = redRef.value * 255;
        var green = greenRef.value * 255;
        var blue = blueRef.value * 255;
        var alpha = alphaRef.value * 255;
        return new colorModule.Color(alpha, red, green, blue);
    }
    ios.getColor = getColor;
    function getActualHeight(uiView) {
        if (uiView.window && !uiView.hidden) {
            return uiView.frame.size.height;
        }
        return 0;
    }
    ios.getActualHeight = getActualHeight;
    function isLandscape() {
        var device = UIDevice.currentDevice();
        var statusBarOrientation = UIApplication.sharedApplication().statusBarOrientation;
        var isStatusBarOrientationLandscape = isOrientationLandscape(statusBarOrientation);
        return isOrientationLandscape(device.orientation) || isStatusBarOrientationLandscape;
    }
    ios.isLandscape = isLandscape;
    ios.MajorVersion = NSString.stringWithString(UIDevice.currentDevice().systemVersion).intValue;
    function _layoutRootView(rootView, parentBounds) {
        if (!rootView || !parentBounds) {
            return;
        }
        var landscape = isLandscape();
        var iOSMajorVersion = ios.MajorVersion;
        var size = parentBounds.size;
        var width = size.width;
        var height = size.height;
        var superview = rootView._nativeView.superview;
        var superViewRotationRadians;
        if (superview) {
            superViewRotationRadians = atan2f(superview.transform.b, superview.transform.a);
        }
        if (iOSMajorVersion < 8 && landscape && !superViewRotationRadians) {
            width = size.height;
            height = size.width;
        }
        var statusBarHeight;
        if (UIApplication.sharedApplication().statusBarHidden || (rootView._UIModalPresentationFormSheet && !CGSizeEqualToSize(parentBounds.size, UIScreen.mainScreen().bounds.size))) {
            statusBarHeight = 0;
        }
        else {
            var statusFrame = UIApplication.sharedApplication().statusBarFrame;
            try {
                statusBarHeight = Math.min(statusFrame.size.width, statusFrame.size.height);
            }
            catch (ex) {
                console.log("exception: " + ex);
            }
        }
        var origin = parentBounds.origin;
        var left = origin.x;
        var top = origin.y + statusBarHeight;
        var widthSpec = layout.makeMeasureSpec(width, common.layout.EXACTLY);
        var heightSpec = layout.makeMeasureSpec(height - statusBarHeight, common.layout.EXACTLY);
        rootView.measure(widthSpec, heightSpec);
        rootView.layout(left, top, width, height);
    }
    ios._layoutRootView = _layoutRootView;
})(ios = exports.ios || (exports.ios = {}));
function GC() {
    __collect();
}
exports.GC = GC;
