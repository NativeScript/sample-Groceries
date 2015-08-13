var common = require("color/color-common");
var AMP = "#";
var Color = (function (_super) {
    __extends(Color, _super);
    function Color() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Color.prototype, "ios", {
        get: function () {
            if (!this._ios) {
                this._ios = UIColor.alloc().initWithRedGreenBlueAlpha(this.r / 255, this.g / 255, this.b / 255, this.a / 255);
            }
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Color.prototype._argbFromString = function (hex) {
        if (hex.charAt(0) === AMP) {
            hex = hex.substr(1);
        }
        var intVal = parseInt(hex, 16);
        if (hex.length === 6) {
            intVal |= 255 << 24;
        }
        return intVal;
    };
    return Color;
})(common.Color);
exports.Color = Color;
