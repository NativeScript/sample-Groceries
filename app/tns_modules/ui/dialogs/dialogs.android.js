/**
 * Android specific dialogs functions implementation.
 */
var dialogs = require("ui/dialogs");
var dialogs_common = require("ui/dialogs/dialogs-common");
var appmodule = require("application");
var types = require("utils/types");
require("utils/module-merge").merge(dialogs_common, exports);
function createAlertDialog(options) {
    var alert = new android.app.AlertDialog.Builder(appmodule.android.foregroundActivity);
    alert.setTitle(options && types.isString(options.title) ? options.title : "");
    alert.setMessage(options && types.isString(options.message) ? options.message : "");
    return alert;
}
function addButtonsToAlertDialog(alert, options, callback) {
    if (!options) {
        return;
    }
    if (options.okButtonText) {
        alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, id) {
                dialog.cancel();
                callback(true);
            }
        }));
    }
    if (options.cancelButtonText) {
        alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, id) {
                dialog.cancel();
                callback(false);
            }
        }));
    }
    if (options.neutralButtonText) {
        alert.setNeutralButton(options.neutralButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, id) {
                dialog.cancel();
                callback(undefined);
            }
        }));
    }
}
function alert(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var options = types.isString(arg) ? { title: dialogs_common.ALERT, okButtonText: dialogs_common.OK, message: arg } : arg;
            var alert = createAlertDialog(options);
            alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
                onClick: function (dialog, id) {
                    dialog.cancel();
                    resolve();
                }
            }));
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.alert = alert;
function confirm(arg) {
    return new Promise(function (resolve, reject) {
        try {
            var options = types.isString(arg) ? { title: dialogs_common.CONFIRM, okButtonText: dialogs_common.OK, cancelButtonText: dialogs_common.CANCEL, message: arg } : arg;
            var alert = createAlertDialog(options);
            addButtonsToAlertDialog(alert, options, function (result) { resolve(result); });
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.confirm = confirm;
function prompt(arg) {
    var options;
    var defaultOptions = {
        title: dialogs_common.PROMPT,
        okButtonText: dialogs_common.OK,
        cancelButtonText: dialogs_common.CANCEL,
        inputType: dialogs.inputType.text,
    };
    if (arguments.length === 1) {
        if (types.isString(arg)) {
            options = defaultOptions;
            options.message = arg;
        }
        else {
            options = arg;
        }
    }
    else if (arguments.length === 2) {
        if (types.isString(arguments[0]) && types.isString(arguments[1])) {
            options = defaultOptions;
            options.message = arguments[0];
            options.defaultText = arguments[1];
        }
    }
    return new Promise(function (resolve, reject) {
        try {
            var alert = createAlertDialog(options);
            var input = new android.widget.EditText(appmodule.android.currentContext);
            if (options && options.inputType === dialogs.inputType.password) {
                input.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            input.setText(options && options.defaultText || "");
            alert.setView(input);
            var getText = function () { return input.getText().toString(); };
            addButtonsToAlertDialog(alert, options, function (r) { resolve({ result: r, text: getText() }); });
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.prompt = prompt;
function login(arg) {
    var options;
    var defaultOptions = { title: dialogs_common.LOGIN, okButtonText: dialogs_common.OK, cancelButtonText: dialogs_common.CANCEL };
    if (arguments.length === 1) {
        if (types.isString(arguments[0])) {
            options = defaultOptions;
            options.message = arguments[0];
        }
        else {
            options = arguments[0];
        }
    }
    else if (arguments.length === 2) {
        if (types.isString(arguments[0]) && types.isString(arguments[1])) {
            options = defaultOptions;
            options.message = arguments[0];
            options.userName = arguments[1];
        }
    }
    else if (arguments.length === 3) {
        if (types.isString(arguments[0]) && types.isString(arguments[1]) && types.isString(arguments[2])) {
            options = defaultOptions;
            options.message = arguments[0];
            options.userName = arguments[1];
            options.password = arguments[2];
        }
    }
    return new Promise(function (resolve, reject) {
        try {
            var context = appmodule.android.currentContext;
            var alert = createAlertDialog(options);
            var userNameInput = new android.widget.EditText(context);
            userNameInput.setText(options.userName ? options.userName : "");
            var passwordInput = new android.widget.EditText(context);
            passwordInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
            passwordInput.setText(options.password ? options.password : "");
            var layout = new android.widget.LinearLayout(context);
            layout.setOrientation(1);
            layout.addView(userNameInput);
            layout.addView(passwordInput);
            alert.setView(layout);
            addButtonsToAlertDialog(alert, options, function (r) {
                resolve({
                    result: r,
                    userName: userNameInput.getText().toString(),
                    password: passwordInput.getText().toString()
                });
            });
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.login = login;
function action(arg) {
    var options;
    var defaultOptions = { cancelButtonText: dialogs_common.CANCEL };
    if (arguments.length === 1) {
        if (types.isString(arguments[0])) {
            options = defaultOptions;
            options.message = arguments[0];
        }
        else {
            options = arguments[0];
        }
    }
    else if (arguments.length === 2) {
        if (types.isString(arguments[0]) && types.isString(arguments[1])) {
            options = defaultOptions;
            options.message = arguments[0];
            options.cancelButtonText = arguments[1];
        }
    }
    else if (arguments.length === 3) {
        if (types.isString(arguments[0]) && types.isString(arguments[1]) && types.isDefined(arguments[2])) {
            options = defaultOptions;
            options.message = arguments[0];
            options.cancelButtonText = arguments[1];
            options.actions = arguments[2];
        }
    }
    return new Promise(function (resolve, reject) {
        try {
            var alert = new android.app.AlertDialog.Builder(appmodule.android.foregroundActivity);
            alert.setTitle(options && types.isString(options.message) ? options.message : "");
            if (options.actions) {
                alert.setItems(options.actions, new android.content.DialogInterface.OnClickListener({
                    onClick: function (dialog, which) {
                        resolve(options.actions[which]);
                    }
                }));
            }
            if (types.isString(options.cancelButtonText)) {
                alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
                    onClick: function (dialog, id) {
                        dialog.cancel();
                        resolve(options.cancelButtonText);
                    }
                }));
            }
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.action = action;
