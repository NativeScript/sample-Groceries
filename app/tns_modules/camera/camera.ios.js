var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imageSource = require("image-source");
var frame = require("ui/frame");
var common = require("./camera-common");
var types = require("utils/types");
var UIImagePickerControllerDelegateImpl = (function (_super) {
    __extends(UIImagePickerControllerDelegateImpl, _super);
    function UIImagePickerControllerDelegateImpl() {
        _super.apply(this, arguments);
    }
    UIImagePickerControllerDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UIImagePickerControllerDelegateImpl.prototype.initWithCallback = function (callback) {
        this._callback = callback;
        return this;
    };
    UIImagePickerControllerDelegateImpl.prototype.initWithCallbackAndOptions = function (callback, options) {
        this._callback = callback;
        if (options) {
            this._width = options.width;
            this._height = options.height;
            this._keepAspectRatio = types.isNullOrUndefined(options.keepAspectRatio) ? true : options.keepAspectRatio;
        }
        return this;
    };
    UIImagePickerControllerDelegateImpl.prototype.imagePickerControllerDidFinishPickingMediaWithInfo = function (picker, info) {
        if (info) {
            var source = info.valueForKey(UIImagePickerControllerOriginalImage);
            if (source) {
                var image = null;
                if (this._width || this._height) {
                    var newSize = null;
                    if (this._keepAspectRatio) {
                        var aspectSafeSize = common.getAspectSafeDimensions(source.size.width, source.size.height, this._width, this._height);
                        newSize = CGSizeMake(aspectSafeSize.width, aspectSafeSize.height);
                    }
                    else {
                        newSize = CGSizeMake(this._width, this._height);
                    }
                    UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0);
                    source.drawInRect(CGRectMake(0, 0, newSize.width, newSize.height));
                    image = UIGraphicsGetImageFromCurrentImageContext();
                    UIGraphicsEndImageContext();
                }
                var imageSourceResult = image ? imageSource.fromNativeSource(image) : imageSource.fromNativeSource(source);
                if (this._callback) {
                    this._callback(imageSourceResult);
                }
            }
        }
        picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
        listener = null;
    };
    UIImagePickerControllerDelegateImpl.prototype.imagePickerControllerDidCancel = function (picker) {
        picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
        listener = null;
    };
    UIImagePickerControllerDelegateImpl.ObjCProtocols = [UIImagePickerControllerDelegate];
    return UIImagePickerControllerDelegateImpl;
})(NSObject);
var listener;
exports.takePicture = function (options) {
    return new Promise(function (resolve, reject) {
        listener = null;
        var imagePickerController = new UIImagePickerController();
        var reqWidth = 0;
        var reqHeight = 0;
        var keepAspectRatio = true;
        if (options) {
            reqWidth = options.width || 0;
            reqHeight = options.height || reqWidth;
            keepAspectRatio = types.isNullOrUndefined(options.keepAspectRatio) ? true : options.keepAspectRatio;
        }
        if (reqWidth && reqHeight) {
            listener = UIImagePickerControllerDelegateImpl.new().initWithCallbackAndOptions(resolve, { width: reqWidth, height: reqHeight, keepAspectRatio: keepAspectRatio });
        }
        else {
            listener = UIImagePickerControllerDelegateImpl.new().initWithCallback(resolve);
        }
        imagePickerController.delegate = listener;
        if (UIDevice.currentDevice().model !== "iPhone Simulator") {
            imagePickerController.mediaTypes = UIImagePickerController.availableMediaTypesForSourceType(UIImagePickerControllerSourceType.UIImagePickerControllerSourceTypeCamera);
            imagePickerController.sourceType = UIImagePickerControllerSourceType.UIImagePickerControllerSourceTypeCamera;
        }
        imagePickerController.modalPresentationStyle = UIModalPresentationStyle.UIModalPresentationCurrentContext;
        var topMostFrame = frame.topmost();
        if (topMostFrame) {
            var viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;
            if (viewController) {
                viewController.presentViewControllerAnimatedCompletion(imagePickerController, true, null);
            }
        }
    });
};
