var common = require("utils/utils-common");
global.moduleMerge(common, exports);
var layout;
(function (layout) {
    var density = -1;
    var metrics;
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    var sdkVersion = -1;
    var useOldMeasureSpec = false;
    function makeMeasureSpec(size, mode) {
        if (sdkVersion === -1) {
            sdkVersion = ad.getApplicationContext().getApplicationInfo().targetSdkVersion;
            useOldMeasureSpec = sdkVersion <= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1;
        }
        if (useOldMeasureSpec) {
            return size + mode;
        }
        return (size & ~MODE_MASK) | (mode & MODE_MASK);
    }
    layout.makeMeasureSpec = makeMeasureSpec;
    function getDisplayDensity() {
        if (density === -1) {
            density = getDisplayMetrics().density;
        }
        return density;
    }
    layout.getDisplayDensity = getDisplayDensity;
    function getDisplayMetrics() {
        if (!metrics) {
            metrics = ad.getApplicationContext().getResources().getDisplayMetrics();
        }
        return metrics;
    }
})(layout = exports.layout || (exports.layout = {}));
var ad;
(function (ad) {
    function getApplication() { return com.tns.NativeScriptApplication.getInstance(); }
    ad.getApplication = getApplication;
    function getApplicationContext() { return getApplication().getApplicationContext(); }
    ad.getApplicationContext = getApplicationContext;
    var collections;
    (function (collections) {
        function stringArrayToStringSet(str) {
            var hashSet = new java.util.HashSet();
            if ("undefined" !== typeof str) {
                for (var element in str) {
                    hashSet.add('' + str[element]);
                }
            }
            return hashSet;
        }
        collections.stringArrayToStringSet = stringArrayToStringSet;
        function stringSetToStringArray(stringSet) {
            var arr = [];
            if ("undefined" !== typeof stringSet) {
                var it = stringSet.iterator();
                while (it.hasNext()) {
                    var element = '' + it.next();
                    arr.push(element);
                }
            }
            return arr;
        }
        collections.stringSetToStringArray = stringSetToStringArray;
    })(collections = ad.collections || (ad.collections = {}));
    var resources;
    (function (resources_1) {
        function getDrawableId(name) {
            return getId(":drawable/" + name);
        }
        resources_1.getDrawableId = getDrawableId;
        function getStringId(name) {
            return getId(":string/" + name);
        }
        resources_1.getStringId = getStringId;
        function getId(name) {
            var resources = getApplicationContext().getResources();
            var packageName = getApplicationContext().getPackageName();
            var uri = packageName + name;
            return resources.getIdentifier(uri, null, null);
        }
        resources_1.getId = getId;
    })(resources = ad.resources || (ad.resources = {}));
})(ad = exports.ad || (exports.ad = {}));
function GC() {
    gc();
}
exports.GC = GC;
