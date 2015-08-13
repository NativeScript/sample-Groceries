/**
 * Android specific http request implementation.
 */
var imageSource = require("image-source");
var types = require("utils/types");
var platform = require("platform");
var requestIdCounter = 0;
var pendingRequests = {};
var completeCallback = new com.tns.Async.CompleteCallback({
    onComplete: function (result, context) {
        onRequestComplete(context, result);
    }
});
function onRequestComplete(requestId, result) {
    var callbacks = pendingRequests[requestId];
    delete pendingRequests[requestId];
    if (result.error) {
        callbacks.rejectCallback(new Error(result.error.toString()));
        return;
    }
    var headers = {};
    if (result.headers) {
        var jHeaders = result.headers;
        var length = jHeaders.size();
        var i;
        var pair;
        for (i = 0; i < length; i++) {
            pair = jHeaders.get(i);
            headers[pair.key] = pair.value;
        }
    }
    callbacks.resolveCallback({
        content: {
            raw: result.raw,
            toString: function () { return result.responseAsString; },
            toJSON: function () { return JSON.parse(result.responseAsString); },
            toImage: function () {
                return new Promise(function (resolveImage, rejectImage) {
                    if (result.responseAsImage != null) {
                        resolveImage(imageSource.fromNativeSource(result.responseAsImage));
                    }
                    else {
                        rejectImage(new Error("Response content may not be converted to an Image"));
                    }
                });
            }
        },
        statusCode: result.statusCode,
        headers: headers
    });
}
function buildJavaOptions(options) {
    if (!types.isString(options.url)) {
        throw new Error("Http request must provide a valid url.");
    }
    var javaOptions = new com.tns.Async.Http.RequestOptions();
    javaOptions.url = options.url;
    if (types.isString(options.method)) {
        javaOptions.method = options.method;
    }
    if (types.isString(options.content) || options.content instanceof FormData) {
        javaOptions.content = options.content.toString();
    }
    if (types.isNumber(options.timeout)) {
        javaOptions.timeout = options.timeout;
    }
    if (options.headers) {
        var arrayList = new java.util.ArrayList();
        var pair = com.tns.Async.Http.KeyValuePair;
        for (var key in options.headers) {
            arrayList.add(new pair(key, options.headers[key] + ""));
        }
        javaOptions.headers = arrayList;
    }
    var screen = platform.screen.mainScreen;
    javaOptions.screenWidth = screen.widthPixels;
    javaOptions.screenHeight = screen.heightPixels;
    return javaOptions;
}
function request(options) {
    if (!types.isDefined(options)) {
        return;
    }
    return new Promise(function (resolve, reject) {
        try {
            var javaOptions = buildJavaOptions(options);
            var callbacks = {
                resolveCallback: resolve,
                rejectCallback: reject
            };
            pendingRequests[requestIdCounter] = callbacks;
            com.tns.Async.Http.MakeRequest(javaOptions, completeCallback, new java.lang.Integer(requestIdCounter));
            requestIdCounter++;
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.request = request;
