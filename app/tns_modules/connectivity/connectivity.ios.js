var common = require("connectivity/connectivity-common");
global.moduleMerge(common, exports);
function _createReachability(host) {
    if (host) {
        return SCNetworkReachabilityCreateWithName(null, host);
    }
    else {
        var zeroAddress = new interop.Reference(sockaddr, {
            sa_len: 16,
            sa_family: 2
        });
        return SCNetworkReachabilityCreateWithAddress(null, zeroAddress);
    }
}
function _getReachabilityFlags(host) {
    var reachability = _createReachability(host);
    var flagsRef = new interop.Reference();
    var gotFlags = SCNetworkReachabilityGetFlags(reachability, flagsRef);
    CFRelease(reachability);
    if (!gotFlags) {
        return null;
    }
    return flagsRef.value;
}
function _getConnectionType(host) {
    var flags = _getReachabilityFlags(host);
    return _getConnectionTypeFromFlags(flags);
}
function _getConnectionTypeFromFlags(flags) {
    if (!flags) {
        return common.connectionType.none;
    }
    var isReachable = flags & kSCNetworkReachabilityFlagsReachable;
    var connectionRequired = flags & kSCNetworkReachabilityFlagsConnectionRequired;
    if (!isReachable || connectionRequired) {
        return common.connectionType.none;
    }
    var isWWAN = flags & kSCNetworkReachabilityFlagsIsWWAN;
    if (isWWAN) {
        return common.connectionType.mobile;
    }
    return common.connectionType.wifi;
}
function getConnectionType() {
    return _getConnectionType();
}
exports.getConnectionType = getConnectionType;
function _reachabilityCallback(target, flags, info) {
    if (_connectionTypeChangedCallback) {
        var newConnectionType = _getConnectionTypeFromFlags(flags);
        _connectionTypeChangedCallback(newConnectionType);
    }
}
var _reachabilityCallbackFunctionRef = new interop.FunctionReference(_reachabilityCallback);
var _monitorReachabilityRef;
var _connectionTypeChangedCallback;
function starMonitoring(connectionTypeChangedCallback) {
    if (!_monitorReachabilityRef) {
        _monitorReachabilityRef = _createReachability();
        _connectionTypeChangedCallback = connectionTypeChangedCallback;
        SCNetworkReachabilitySetCallback(_monitorReachabilityRef, _reachabilityCallbackFunctionRef, null);
        SCNetworkReachabilityScheduleWithRunLoop(_monitorReachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
    }
}
exports.starMonitoring = starMonitoring;
function stopMonitoring() {
    if (_monitorReachabilityRef) {
        SCNetworkReachabilityUnscheduleFromRunLoop(_monitorReachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
        CFRelease(_monitorReachabilityRef);
        _monitorReachabilityRef = undefined;
        _connectionTypeChangedCallback = undefined;
        ;
    }
}
exports.stopMonitoring = stopMonitoring;
