var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var textBase = require("ui/text-base");
var editableTextBase = require("ui/editable-text-base");
require("utils/module-merge").merge(textBase, exports);
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView(options) {
        _super.call(this, options);
    }
    return TextView;
})(editableTextBase.EditableTextBase);
exports.TextView = TextView;
