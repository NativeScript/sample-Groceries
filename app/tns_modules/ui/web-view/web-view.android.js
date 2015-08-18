var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/web-view/web-view-common");
var trace = require("trace");
var utils = require("utils/utils");
var fs = require("file-system");
require("utils/module-merge").merge(common, exports);
var WebViewClientClass = (function (_super) {
    __extends(WebViewClientClass, _super);
    function WebViewClientClass(view) {
        _super.call(this);
        this._view = view;
        return global.__native(this);
    }
    WebViewClientClass.prototype.shouldOverrideUrlLoading = function (view, url) {
        trace.write("WebViewClientClass.shouldOverrideUrlLoading(" + url + ")", trace.categories.Debug);
        return false;
    };
    WebViewClientClass.prototype.onPageStarted = function (view, url, favicon) {
        _super.prototype.onPageStarted.call(this, view, url, favicon);
        if (this._view) {
            trace.write("WebViewClientClass.onPageStarted(" + url + ", " + favicon + ")", trace.categories.Debug);
            this._view._onLoadStarted(url);
        }
    };
    WebViewClientClass.prototype.onPageFinished = function (view, url) {
        _super.prototype.onPageFinished.call(this, view, url);
        if (this._view) {
            trace.write("WebViewClientClass.onPageFinished(" + url + ")", trace.categories.Debug);
            this._view._onLoadFinished(url, undefined);
        }
    };
    WebViewClientClass.prototype.onReceivedError = function (view, errorCode, description, failingUrl) {
        _super.prototype.onReceivedError.call(this, view, errorCode, description, failingUrl);
        if (this._view) {
            trace.write("WebViewClientClass.onReceivedError(" + errorCode + ", " + description + ", " + failingUrl + ")", trace.categories.Debug);
            this._view._onLoadFinished(failingUrl, description + "(" + errorCode + ")");
        }
    };
    return WebViewClientClass;
})(android.webkit.WebViewClient);
;
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        _super.call(this);
        this._webViewClient = new WebViewClientClass(this);
    }
    Object.defineProperty(WebView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype._createUI = function () {
        this._android = new android.webkit.WebView(this._context);
        this._android.getSettings().setJavaScriptEnabled(true);
        this._android.getSettings().setBuiltInZoomControls(true);
        this._android.setWebViewClient(this._webViewClient);
    };
    WebView.prototype._loadUrl = function (url) {
        trace.write("WebView._loadUrl(" + url + ")", trace.categories.Debug);
        this._android.stopLoading();
        this._android.loadUrl(url);
    };
    WebView.prototype._loadSrc = function (src) {
        var _this = this;
        trace.write("WebView._loadSrc(" + src + ")", trace.categories.Debug);
        this._android.stopLoading();
        this._android.loadUrl("about:blank");
        if (utils.isFileOrResourcePath(src)) {
            if (src.indexOf("~/") === 0) {
                src = fs.path.join(fs.knownFolders.currentApp().path, src.replace("~/", ""));
            }
            var file = fs.File.fromPath(src);
            if (file) {
                file.readText().then(function (r) {
                    _this._android.loadData(r, "text/html", null);
                });
            }
        }
        else if (src.indexOf("http://") === 0 || src.indexOf("https://") === 0) {
            this._android.loadUrl(src);
        }
        else {
            this._android.loadData(src, "text/html", null);
        }
    };
    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            return this._android.canGoBack();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            return this._android.canGoForward();
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.goBack = function () {
        this._android.goBack();
    };
    WebView.prototype.goForward = function () {
        this._android.goForward();
    };
    WebView.prototype.reload = function () {
        this._android.reload();
    };
    return WebView;
})(common.WebView);
exports.WebView = WebView;
