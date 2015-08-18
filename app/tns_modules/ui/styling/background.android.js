var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("utils/utils");
var common = require("ui/styling/background-common");
require("utils/module-merge").merge(common, exports);
var ad;
(function (ad) {
    var BorderDrawable = (function (_super) {
        __extends(BorderDrawable, _super);
        function BorderDrawable() {
            _super.call(this);
            this._density = utils.layout.getDisplayDensity();
            return global.__native(this);
        }
        Object.defineProperty(BorderDrawable.prototype, "borderWidth", {
            get: function () {
                return this._borderWidth;
            },
            set: function (value) {
                if (this._borderWidth !== value) {
                    this._borderWidth = value;
                    this.invalidateSelf();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorderDrawable.prototype, "cornerRadius", {
            get: function () {
                return this._cornerRadius;
            },
            set: function (value) {
                if (this._cornerRadius !== value) {
                    this._cornerRadius = value;
                    this.invalidateSelf();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorderDrawable.prototype, "borderColor", {
            get: function () {
                return this._borderColor;
            },
            set: function (value) {
                if (this._borderColor !== value) {
                    this._borderColor = value;
                    this.invalidateSelf();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorderDrawable.prototype, "background", {
            get: function () {
                return this._background;
            },
            set: function (value) {
                if (this._background !== value) {
                    this._background = value;
                    this.invalidateSelf();
                }
            },
            enumerable: true,
            configurable: true
        });
        BorderDrawable.prototype.draw = function (canvas) {
            var bounds = this.getBounds();
            var boundsF = new android.graphics.RectF(bounds);
            var boundsWidth = bounds.width();
            var boundsHeight = bounds.height();
            var radius = this._cornerRadius * this._density;
            var stroke = this._borderWidth * this._density;
            if (radius > 0) {
                var path = new android.graphics.Path();
                path.addRoundRect(boundsF, radius, radius, android.graphics.Path.Direction.CW);
                canvas.clipPath(path);
            }
            if (this.background.color && this.background.color.android) {
                var c = this.background.color;
                canvas.drawARGB(c.a, c.r, c.g, c.b);
            }
            if (this.background.image) {
                var bitmap = this.background.image.android;
                var params = this.background.getDrawParams(boundsWidth, boundsHeight);
                var matrix = new android.graphics.Matrix();
                if (params.sizeX > 0 && params.sizeY > 0) {
                    var scaleX = params.sizeX / bitmap.getWidth();
                    var scaleY = params.sizeY / bitmap.getHeight();
                    matrix.setScale(scaleX, scaleY, 0, 0);
                }
                else {
                    params.sizeX = bitmap.getWidth();
                    params.sizeY = bitmap.getHeight();
                }
                matrix.postTranslate(params.posX, params.posY);
                if (!params.repeatX && !params.repeatY) {
                    canvas.drawBitmap(bitmap, matrix, undefined);
                }
                else {
                    var shader = new android.graphics.BitmapShader(bitmap, android.graphics.Shader.TileMode.REPEAT, android.graphics.Shader.TileMode.REPEAT);
                    shader.setLocalMatrix(matrix);
                    var paint = new android.graphics.Paint();
                    paint.setShader(shader);
                    var w = params.repeatX ? bounds.width() : params.sizeX;
                    var h = params.repeatY ? bounds.height() : params.sizeY;
                    params.posX = params.repeatX ? 0 : params.posX;
                    params.posY = params.repeatY ? 0 : params.posY;
                    canvas.drawRect(params.posX, params.posY, params.posX + w, params.posY + h, paint);
                }
            }
            if (stroke > 0 && this._borderColor && this._borderColor) {
                var borderPaint = new android.graphics.Paint();
                borderPaint.setStyle(android.graphics.Paint.Style.STROKE);
                borderPaint.setColor(this._borderColor);
                borderPaint.setStrokeWidth(stroke * 2);
                canvas.drawRoundRect(boundsF, radius, radius, borderPaint);
            }
        };
        return BorderDrawable;
    })(android.graphics.drawable.ColorDrawable);
    ad.BorderDrawable = BorderDrawable;
})(ad = exports.ad || (exports.ad = {}));
