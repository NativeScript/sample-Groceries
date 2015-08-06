var Common = require("application-settings/application-settings-common");
var utils = require("utils/utils");
var sharedPreferences = utils.ad.getApplicationContext().getSharedPreferences("prefs.db", 0);
exports.hasKey = function (key) {
    Common.checkKey(key);
    return sharedPreferences.contains(key);
};
exports.getBoolean = function (key, defaultValue) {
    Common.checkKey(key);
    if (exports.hasKey(key)) {
        return sharedPreferences.getBoolean(key, false);
    }
    return defaultValue;
};
exports.getString = function (key, defaultValue) {
    Common.checkKey(key);
    if (exports.hasKey(key)) {
        return sharedPreferences.getString(key, "");
    }
    return defaultValue;
};
exports.getNumber = function (key, defaultValue) {
    Common.checkKey(key);
    if (exports.hasKey(key)) {
        return sharedPreferences.getFloat(key, float(0.0));
    }
    return defaultValue;
};
exports.setBoolean = function (key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "boolean");
    var editor = sharedPreferences.edit();
    editor.putBoolean(key, value);
    editor.commit();
};
exports.setString = function (key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "string");
    var editor = sharedPreferences.edit();
    editor.putString(key, value);
    editor.commit();
};
exports.setNumber = function (key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "number");
    var editor = sharedPreferences.edit();
    editor.putFloat(key, float(value));
    editor.commit();
};
exports.remove = function (key) {
    Common.checkKey(key);
    var editor = sharedPreferences.edit();
    editor.remove(key);
    editor.commit();
};
