exports.STRING = "string", exports.PROMPT = "Prompt", exports.CONFIRM = "Confirm", exports.ALERT = "Alert", exports.LOGIN = "Login", exports.OK = "OK", exports.CANCEL = "Cancel";
var inputType;
(function (inputType) {
    inputType.text = "text";
    inputType.password = "password";
})(inputType = exports.inputType || (exports.inputType = {}));
