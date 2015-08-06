var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var urlProperty = new dependencyObservable.Property("url", "WebView", new proxy.PropertyMetadata(""));
function onUrlPropertyChanged(data) {
    var webView = data.object;
    if (webView._suspendLoading) {
        return;
    }
    webView._loadUrl(data.newValue);
}
urlProperty.metadata.onSetNativeValue = onUrlPropertyChanged;
var srcProperty = new dependencyObservable.Property("src", "WebView", new proxy.PropertyMetadata(""));
function onSrcPropertyChanged(data) {
    var webView = data.object;
    if (webView._suspendLoading) {
        return;
    }
    webView._loadSrc(data.newValue);
}
srcProperty.metadata.onSetNativeValue = onSrcPropertyChanged;
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        _super.call(this);
    }
    Object.defineProperty(WebView.prototype, "url", {
        get: function () {
            return this._getValue(WebView.urlProperty);
        },
        set: function (value) {
            this._setValue(WebView.urlProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebView.prototype, "src", {
        get: function () {
            return this._getValue(WebView.srcProperty);
        },
        set: function (value) {
            this._setValue(WebView.srcProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype._onLoadFinished = function (url, error) {
        this._suspendLoading = true;
        this.url = url;
        this._suspendLoading = false;
        var args = {
            eventName: WebView.loadFinishedEvent,
            object: this,
            url: url,
            error: error
        };
        this.notify(args);
    };
    WebView.prototype._onLoadStarted = function (url) {
        var args = {
            eventName: WebView.loadStartedEvent,
            object: this,
            url: url,
            error: undefined
        };
        this.notify(args);
    };
    WebView.prototype._loadUrl = function (url) {
        throw new Error("This member is abstract.");
    };
    WebView.prototype._loadSrc = function (src) {
        throw new Error("This member is abstract.");
    };
    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            throw new Error("This member is abstract.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            throw new Error("This member is abstract.");
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.goBack = function () {
        throw new Error("This member is abstract.");
    };
    WebView.prototype.goForward = function () {
        throw new Error("This member is abstract.");
    };
    WebView.prototype.reload = function () {
        throw new Error("This member is abstract.");
    };
    WebView.loadStartedEvent = "loadStarted";
    WebView.loadFinishedEvent = "loadFinished";
    WebView.urlProperty = urlProperty;
    WebView.srcProperty = srcProperty;
    return WebView;
})(view.View);
exports.WebView = WebView;
