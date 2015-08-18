var httpRequest = require("http/http-request");
var types = require("utils/types");
require("utils/module-merge").merge(httpRequest, exports);
function getString(arg) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) { return resolve(r.content.toString()); }, function (e) { return reject(e); });
    });
}
exports.getString = getString;
function getJSON(arg) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) { return resolve(r.content.toJSON()); }, function (e) { return reject(e); });
    });
}
exports.getJSON = getJSON;
function getImage(arg) {
    return new Promise(function (resolve, reject) {
        httpRequest.request(typeof arg === "string" ? { url: arg, method: "GET" } : arg)
            .then(function (r) {
            r.content.toImage().then(function (source) { return resolve(source); });
        }, function (e) { return reject(e); });
    });
}
exports.getImage = getImage;
var XMLHttpRequest = (function () {
    function XMLHttpRequest() {
        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;
        this._responseText = "";
        this._readyState = this.UNSENT;
    }
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (types.isString(method) && types.isString(url)) {
            this._options = { url: url, method: method };
            this._options.headers = {};
            if (types.isString(user)) {
                this._options.headers["user"] = user;
            }
            if (types.isString(password)) {
                this._options.headers["password"] = password;
            }
            this._setReadyState(this.OPENED);
        }
    };
    XMLHttpRequest.prototype.abort = function () {
        this._errorFlag = true;
        this._response = null;
        this._responseText = null;
        this._headers = null;
        this._status = null;
        if (this._readyState === this.UNSENT || this._readyState === this.OPENED || this._readyState === this.DONE) {
            this._readyState = this.UNSENT;
        }
        else {
            this._setReadyState(this.DONE);
        }
    };
    XMLHttpRequest.prototype.send = function (data) {
        var _this = this;
        this._errorFlag = false;
        this._response = null;
        this._responseText = null;
        this._headers = null;
        this._status = null;
        if (types.isDefined(this._options)) {
            if (types.isString(data)) {
                this._options.content = data;
            }
            httpRequest.request(this._options).then(function (r) {
                if (!_this._errorFlag) {
                    _this._status = r.statusCode;
                    _this._response = r.content.raw;
                    _this._headers = r.headers;
                    _this._setReadyState(_this.HEADERS_RECEIVED);
                    _this._setReadyState(_this.LOADING);
                    _this._responseText = r.content.toString();
                    _this._setReadyState(_this.DONE);
                }
            }).catch(function (e) {
                _this._errorFlag = true;
                _this._setReadyState(_this.DONE);
            });
        }
    };
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        if (types.isDefined(this._options) && types.isString(header) && types.isString(value)) {
            this._options.headers[header] = value;
        }
    };
    XMLHttpRequest.prototype.getAllResponseHeaders = function () {
        if (this._readyState < 2 || this._errorFlag) {
            return "";
        }
        var result = "";
        for (var i in this._headers) {
            if (i !== "set-cookie" && i !== "set-cookie2") {
                result += i + ": " + this._headers[i] + "\r\n";
            }
        }
        return result.substr(0, result.length - 2);
    };
    XMLHttpRequest.prototype.getResponseHeader = function (header) {
        if (types.isString(header) && this._readyState > 1
            && this._headers
            && this._headers[header]
            && !this._errorFlag) {
            return this._headers[header];
        }
        return null;
    };
    XMLHttpRequest.prototype.overrideMimeType = function (mime) {
    };
    Object.defineProperty(XMLHttpRequest.prototype, "readyState", {
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "responseType", {
        get: function () {
            return this._responseType;
        },
        set: function (value) {
            if (value === "" || value === "text") {
                this._responseType = value;
            }
            else {
                throw new Error("Response type of '" + value + "' not supported.");
            }
        },
        enumerable: true,
        configurable: true
    });
    XMLHttpRequest.prototype._setReadyState = function (value) {
        if (this._readyState !== value) {
            this._readyState = value;
            if (types.isFunction(this.onreadystatechange)) {
                this.onreadystatechange();
            }
        }
        if (this._readyState === this.DONE) {
            if (this._errorFlag && types.isFunction(this.onerror)) {
                this.onerror();
            }
            if (!this._errorFlag && types.isFunction(this.onload)) {
                this.onload();
            }
        }
    };
    Object.defineProperty(XMLHttpRequest.prototype, "responseText", {
        get: function () {
            return this._responseText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "response", {
        get: function () {
            return this._response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "statusText", {
        get: function () {
            if (this._readyState === this.UNSENT || this._readyState === this.OPENED || this._errorFlag) {
                return "";
            }
            return this._status + " " + statuses[this._status];
        },
        enumerable: true,
        configurable: true
    });
    return XMLHttpRequest;
})();
exports.XMLHttpRequest = XMLHttpRequest;
var statuses = {
    100: "Continue",
    101: "Switching Protocols",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non - Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Request Entity Too Large",
    414: "Request - URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported"
};
