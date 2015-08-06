var pageCommon = require("ui/page/page-common");
var trace = require("trace");
var color = require("color");
global.moduleMerge(pageCommon, exports);
var DialogFragmentClass = (function (_super) {
    __extends(DialogFragmentClass, _super);
    function DialogFragmentClass(owner, fullscreen) {
        _super.call(this);
        this._owner = owner;
        this._fullscreen = fullscreen;
        return global.__native(this);
    }
    DialogFragmentClass.prototype.onCreateDialog = function (savedInstanceState) {
        var dialog = new android.app.Dialog(this._owner._context);
        dialog.requestWindowFeature(android.view.Window.FEATURE_NO_TITLE);
        dialog.setContentView(this._owner._nativeView);
        var window = dialog.getWindow();
        window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
        if (this._fullscreen) {
            window.setLayout(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.FILL_PARENT);
        }
        return dialog;
    };
    return DialogFragmentClass;
})(android.app.DialogFragment);
;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page(options) {
        _super.call(this, options);
        this._isBackNavigation = false;
    }
    Page.prototype._onDetached = function (force) {
        var skipDetached = !force && this.frame.android.cachePagesOnNavigate && !this._isBackNavigation;
        if (skipDetached) {
            trace.write("Caching Page " + this._domId, trace.categories.NativeLifecycle);
        }
        else {
            _super.prototype._onDetached.call(this);
        }
    };
    Page.prototype.onNavigatedFrom = function (isBackNavigation) {
        this._isBackNavigation = isBackNavigation;
        _super.prototype.onNavigatedFrom.call(this, isBackNavigation);
    };
    Page.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen) {
        if (!this.backgroundColor) {
            this.backgroundColor = new color.Color("White");
        }
        this._onAttached(parent._context);
        this._isAddedToNativeVisualTree = true;
        this.onLoaded();
        this._dialogFragment = new DialogFragmentClass(this, fullscreen);
        this._dialogFragment.show(parent.frame.android.activity.getFragmentManager(), "dialog");
        _super.prototype._raiseShownModallyEvent.call(this, parent, context, closeCallback);
    };
    Page.prototype._hideNativeModalView = function (parent) {
        this._dialogFragment.dismissAllowingStateLoss();
        this._dialogFragment = null;
        this.onUnloaded();
        this._isAddedToNativeVisualTree = false;
        this._onDetached(true);
    };
    Page.prototype._updateActionBar = function (hidden) {
        this.actionBar.update();
    };
    return Page;
})(pageCommon.Page);
exports.Page = Page;
