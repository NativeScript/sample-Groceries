var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var layouts = require("ui/layouts/layout");
var definition = require("ui/layouts/grid-layout");
var utils = require("utils/utils");
var dependencyObservable = require("ui/core/dependency-observable");
var enums = require("ui/enums");
var view = require("ui/core/view");
var bindable = require("ui/core/bindable");
var types = require("utils/types");
var numberUtils = require("utils/number-utils");
var GridUnitType;
(function (GridUnitType) {
    GridUnitType.auto = "auto";
    GridUnitType.pixel = "pixel";
    GridUnitType.star = "star";
})(GridUnitType = exports.GridUnitType || (exports.GridUnitType = {}));
var ItemSpec = (function (_super) {
    __extends(ItemSpec, _super);
    function ItemSpec() {
        _super.call(this);
        this._actualLength = 0;
        if (arguments.length === 0) {
            this._value = 1;
            this._unitType = GridUnitType.star;
        }
        else if (arguments.length === 2) {
            if (types.isNumber(arguments[0]) && types.isString(arguments[1])) {
                if (arguments[0] < 0 || (arguments[1] !== GridUnitType.auto && arguments[1] !== GridUnitType.star && arguments[1] !== GridUnitType.pixel)) {
                    throw new Error("Invalid values.");
                }
                this._value = arguments[0];
                this._unitType = arguments[1];
            }
            else {
                throw new Error("Arguments must be number and string.");
            }
        }
        else {
            throw new Error("ItemSpec expects 0 or 2 arguments");
        }
        this.index = -1;
    }
    Object.defineProperty(ItemSpec.prototype, "actualLength", {
        get: function () {
            return this._actualLength;
        },
        set: function (value) {
            throw new Error("actualLength is read-only property");
        },
        enumerable: true,
        configurable: true
    });
    ItemSpec.equals = function (value1, value2) {
        return (value1.gridUnitType === value2.gridUnitType) && (value1.value === value2.value) && (value1.owner === value2.owner) && (value1.index === value2.index);
    };
    Object.defineProperty(ItemSpec.prototype, "gridUnitType", {
        get: function () {
            return this._unitType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "isAbsolute", {
        get: function () {
            return this._unitType === GridUnitType.pixel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "isAuto", {
        get: function () {
            return this._unitType === GridUnitType.auto;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "isStar", {
        get: function () {
            return this._unitType === GridUnitType.star;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemSpec.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return ItemSpec;
})(bindable.Bindable);
exports.ItemSpec = ItemSpec;
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout() {
        _super.call(this);
        this._rows = new Array();
        this._cols = new Array();
        this._singleRow = new ItemSpec();
        this._singleColumn = new ItemSpec();
        this._isValid = false;
        this._singleRow.index = 0;
        this._singleColumn.index = 0;
    }
    GridLayout.getColumn = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridLayout.columnProperty);
    };
    GridLayout.setColumn = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridLayout.columnProperty, value);
    };
    GridLayout.getColumnSpan = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridLayout.columnSpanProperty);
    };
    GridLayout.setColumnSpan = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridLayout.columnSpanProperty, value);
    };
    GridLayout.getRow = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridLayout.rowProperty);
    };
    GridLayout.setRow = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridLayout.rowProperty, value);
    };
    GridLayout.getRowSpan = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridLayout.rowSpanProperty);
    };
    GridLayout.setRowSpan = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridLayout.rowSpanProperty, value);
    };
    GridLayout.attachedPropertyChanged = function (data) {
        if (data.object instanceof view.View) {
            var element = data.object;
            if (!element) {
                throw new Error("Element is not View.");
            }
            var grid = element.parent;
            if (grid instanceof GridLayout) {
                grid.invalidate();
            }
        }
    };
    GridLayout.validateItemSpec = function (itemSpec) {
        if (!itemSpec) {
            throw new Error("Value cannot be undefined.");
        }
        if (itemSpec.owner) {
            throw new Error("itemSpec is already added to GridLayout.");
        }
    };
    GridLayout.prototype.addRow = function (itemSpec) {
        GridLayout.validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._rows.push(itemSpec);
        this.invalidate();
    };
    GridLayout.prototype.addColumn = function (itemSpec) {
        GridLayout.validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._cols.push(itemSpec);
        this.invalidate();
    };
    GridLayout.prototype.removeColumn = function (itemSpec) {
        if (!itemSpec) {
            throw new Error("Value is null.");
        }
        var index = this._cols.indexOf(itemSpec);
        if (itemSpec.owner !== this || index < 0) {
            throw new Error("Column is not child of this GridLayout");
        }
        itemSpec.index = -1;
        this._cols.splice(index, 1);
        this.invalidate();
    };
    GridLayout.prototype.removeRow = function (itemSpec) {
        if (!itemSpec) {
            throw new Error("Value is null.");
        }
        var index = this._rows.indexOf(itemSpec);
        if (itemSpec.owner !== this || index < 0) {
            throw new Error("Row is not child of this GridLayout");
        }
        itemSpec.index = -1;
        this._rows.splice(index, 1);
        this.invalidate();
    };
    GridLayout.prototype.getColumns = function () {
        return this._cols.slice();
    };
    GridLayout.prototype.getRows = function () {
        return this._rows.slice();
    };
    GridLayout.prototype.setColumns = function (value) {
        this._cols = GridLayout.parseItemSpecs(value);
        this.invalidate();
    };
    GridLayout.prototype.setRows = function (value) {
        this._rows = GridLayout.parseItemSpecs(value);
        this.invalidate();
    };
    GridLayout.prototype.invalidate = function () {
        this._isValid = false;
        this.requestLayout();
    };
    GridLayout.prototype.getColumn = function (view) {
        if (this._cols.length === 0) {
            return this._singleColumn;
        }
        var columnIndex = Math.min(GridLayout.getColumn(view), this._cols.length - 1);
        return this._cols[columnIndex];
    };
    GridLayout.prototype.getRow = function (view) {
        if (this._rows.length === 0) {
            return this._singleRow;
        }
        var columnIndex = Math.min(GridLayout.getRow(view), this._rows.length - 1);
        return this._rows[columnIndex];
    };
    GridLayout.prototype.getColumnSpan = function (view, columnIndex) {
        if (this._cols.length === 0) {
            return 1;
        }
        return Math.min(GridLayout.getColumnSpan(view), this._cols.length - columnIndex);
    };
    GridLayout.prototype.getRowSpan = function (view, rowIndex) {
        if (this._rows.length === 0) {
            return 1;
        }
        return Math.min(GridLayout.getRowSpan(view), this._rows.length - rowIndex);
    };
    GridLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var density = utils.layout.getDisplayDensity();
        var infinityWidth = widthMode === utils.layout.UNSPECIFIED;
        var infinityHeight = heightMode === utils.layout.UNSPECIFIED;
        var column;
        var columnGroup;
        var row;
        var rowGroup;
        if (!this._isValid) {
            this._rows.forEach(function (value, index, array) {
                value.index = index;
            });
            this._cols.forEach(function (value, index, array) {
                value.index = index;
            });
            this.helper = new MeasureHelper();
            this.helper.grid = this;
            this.helper.width = width - (this.paddingLeft + this.paddingRight) * density;
            this.helper.height = height - (this.paddingTop + this.paddingBottom) * density;
            this.helper.infinityWidth = infinityWidth;
            this.helper.infinityHeight = infinityHeight;
            for (i = 0; i < this._cols.length; i++) {
                column = this._cols[i];
                columnGroup = new ColumnGroup(column, this.helper);
                this.helper.columns.push(columnGroup);
                if (column.isAbsolute) {
                    columnGroup.width = column.value * density;
                }
            }
            for (i = 0; i < this._rows.length; i++) {
                row = this._rows[i];
                rowGroup = new RowGroup(row, this.helper);
                this.helper.rows.push(rowGroup);
                if (row.isAbsolute) {
                    rowGroup.height = row.value * density;
                }
            }
            if (this._rows.length === 0) {
                this.helper.rows.push(new RowGroup(this._singleRow, this.helper));
            }
            if (this._cols.length === 0) {
                this.helper.columns.push(new ColumnGroup(this._singleColumn, this.helper));
            }
        }
        var i = 0;
        var childrenCount = this.getChildrenCount();
        for (i = 0; i < childrenCount; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            column = this.getColumn(child);
            row = this.getRow(child);
            var columnSpan = this.getColumnSpan(child, column.index);
            var rowSpan = this.getRowSpan(child, row.index);
            var measureSpec = new MeasureSpecs(child, column, row, columnSpan, rowSpan);
            this.helper.addMeasureSpec(measureSpec, density);
        }
        this.helper.measure();
        measureWidth = this.helper.measuredWidth + (this.paddingLeft + this.paddingRight) * density;
        measureHeight = this.helper.measuredHeight + (this.paddingTop + this.paddingBottom) * density;
        measureWidth = Math.max(measureWidth, this.minWidth * density);
        measureHeight = Math.max(measureHeight, this.minHeight * density);
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    GridLayout.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var density = utils.layout.getDisplayDensity();
        var columnOffsets = new Array();
        columnOffsets.push(this.paddingLeft * density);
        var rowOffsets = new Array();
        rowOffsets.push(this.paddingTop * density);
        var offset = columnOffsets[0];
        var i = 0;
        var j = 0;
        var columnGroup;
        var roundedOffset = this.paddingLeft;
        var roundedLength = 0;
        var actualLength = 0;
        for (i = 0; i < this.helper.columns.length; i++) {
            columnGroup = this.helper.columns[i];
            offset += columnGroup.width;
            columnOffsets.push(offset);
            actualLength = offset / density - roundedOffset;
            roundedLength = Math.round(actualLength);
            columnGroup.column._actualLength = roundedLength;
            roundedOffset += roundedLength;
        }
        offset = rowOffsets[0];
        roundedOffset = this.paddingTop;
        roundedLength = 0;
        actualLength = 0;
        for (i = 0; i < this.helper.rows.length; i++) {
            var rowGroup = this.helper.rows[i];
            offset += rowGroup.height;
            rowOffsets.push(offset);
            actualLength = offset / density - roundedOffset;
            roundedLength = Math.round(actualLength);
            rowGroup.row._actualLength = roundedLength;
            roundedOffset += roundedLength;
        }
        for (i = 0; i < this.helper.columns.length; i++) {
            columnGroup = this.helper.columns[i];
            for (j = 0; j < columnGroup.children.length; j++) {
                var measureSpec = columnGroup.children[j];
                var childLeft = columnOffsets[measureSpec.columnIndex];
                var childRight = columnOffsets[measureSpec.columnIndex + measureSpec.columnSpan];
                var childTop = rowOffsets[measureSpec.rowIndex];
                var childBottom = rowOffsets[measureSpec.rowIndex + measureSpec.rowSpan];
                view.View.layoutChild(this, measureSpec.child, childLeft, childTop, childRight, childBottom);
            }
        }
    };
    GridLayout.prototype._applyXmlAttribute = function (attributeName, attributeValue) {
        if (attributeName === "columns") {
            this.setColumns(attributeValue);
            return true;
        }
        else if (attributeName === "rows") {
            this.setRows(attributeValue);
            return true;
        }
        return _super.prototype._applyXmlAttribute.call(this, attributeName, attributeValue);
    };
    GridLayout.parseItemSpecs = function (value) {
        var result = new Array();
        var arr = value.split(",");
        for (var i = 0; i < arr.length; i++) {
            result.push(GridLayout.convertGridLength(arr[i].trim()));
        }
        return result;
    };
    GridLayout.convertGridLength = function (value) {
        if (value === "auto") {
            return new definition.ItemSpec(1, definition.GridUnitType.auto);
        }
        else if (value.indexOf("*") !== -1) {
            var starCount = parseInt(value.replace("*", "") || "1");
            return new definition.ItemSpec(starCount, definition.GridUnitType.star);
        }
        else if (!isNaN(parseInt(value))) {
            return new definition.ItemSpec(parseInt(value), definition.GridUnitType.pixel);
        }
        else {
            throw new Error("Cannot parse item spec from string: " + value);
        }
    };
    GridLayout.columnProperty = new dependencyObservable.Property("Column", "GridLayout", new dependencyObservable.PropertyMetadata(0, dependencyObservable.PropertyMetadataSettings.None, GridLayout.attachedPropertyChanged, numberUtils.notNegative));
    GridLayout.columnSpanProperty = new dependencyObservable.Property("ColumnSpan", "GridLayout", new dependencyObservable.PropertyMetadata(1, dependencyObservable.PropertyMetadataSettings.None, GridLayout.attachedPropertyChanged, numberUtils.greaterThanZero));
    GridLayout.rowProperty = new dependencyObservable.Property("Row", "GridLayout", new dependencyObservable.PropertyMetadata(0, dependencyObservable.PropertyMetadataSettings.None, GridLayout.attachedPropertyChanged, numberUtils.notNegative));
    GridLayout.rowSpanProperty = new dependencyObservable.Property("RowSpan", "GridLayout", new dependencyObservable.PropertyMetadata(1, dependencyObservable.PropertyMetadataSettings.None, GridLayout.attachedPropertyChanged, numberUtils.greaterThanZero));
    return GridLayout;
})(layouts.Layout);
exports.GridLayout = GridLayout;
var MeasureSpecs = (function () {
    function MeasureSpecs(child, column, row, columnSpan, rowSpan) {
        this.child = child;
        this.column = column;
        this.row = row;
        this._columnSpan = 1;
        this._rowSpan = 1;
        this.pixelWidth = 0;
        this.pixelHeight = 0;
        this.starColumnsCount = 0;
        this.starRowsCount = 0;
        this.autoColumnsCount = 0;
        this.autoRowsCount = 0;
        this.measured = false;
        if (columnSpan) {
            this._columnSpan = columnSpan;
        }
        if (rowSpan) {
            this._rowSpan = rowSpan;
        }
    }
    Object.defineProperty(MeasureSpecs.prototype, "columnIndex", {
        get: function () {
            return this.column.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureSpecs.prototype, "rowIndex", {
        get: function () {
            return this.row.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureSpecs.prototype, "spanned", {
        get: function () {
            return this._columnSpan > 1 || this._rowSpan > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureSpecs.prototype, "columnSpan", {
        get: function () {
            return this._columnSpan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureSpecs.prototype, "rowSpan", {
        get: function () {
            return this._rowSpan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureSpecs.prototype, "isStar", {
        get: function () {
            return this.starRowsCount > 0 || this.starColumnsCount > 0;
        },
        enumerable: true,
        configurable: true
    });
    return MeasureSpecs;
})();
var ColumnGroup = (function () {
    function ColumnGroup(column, owner) {
        this.width = 0;
        this.measuredCount = 0;
        this.children = new Array();
        this.measureToFix = 0;
        this.currentMeasureToFixCount = 0;
        this.owner = owner;
        this.column = column;
    }
    ColumnGroup.prototype.init = function () {
        this.measuredCount = 0;
        this.currentMeasureToFixCount = 0;
    };
    Object.defineProperty(ColumnGroup.prototype, "allMeasured", {
        get: function () {
            return this.measuredCount === this.children.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnGroup.prototype, "isAuto", {
        get: function () {
            return this.column.isAuto || (this.column.isStar && this.owner.infinityWidth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnGroup.prototype, "isStar", {
        get: function () {
            return this.column.isStar && !this.owner.infinityWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnGroup.prototype, "isAbsolute", {
        get: function () {
            return this.column.isAbsolute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnGroup.prototype, "canBeFixed", {
        get: function () {
            return this.currentMeasureToFixCount === this.measureToFix;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnGroup;
})();
var RowGroup = (function () {
    function RowGroup(row, owner) {
        this.height = 0;
        this.measuredCount = 0;
        this.children = new Array();
        this.measureToFix = 0;
        this.currentMeasureToFixCount = 0;
        this.row = row;
        this.owner = owner;
    }
    RowGroup.prototype.init = function () {
        this.measuredCount = 0;
        this.currentMeasureToFixCount = 0;
    };
    Object.defineProperty(RowGroup.prototype, "allMeasured", {
        get: function () {
            return this.measuredCount === this.children.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowGroup.prototype, "canBeFixed", {
        get: function () {
            return this.measuredCount === this.measureToFix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowGroup.prototype, "isAuto", {
        get: function () {
            return this.row.isAuto || (this.row.isStar && this.owner.infinityHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowGroup.prototype, "isStar", {
        get: function () {
            return this.row.isStar && !this.owner.infinityHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowGroup.prototype, "isAbsolute", {
        get: function () {
            return this.row.isAbsolute;
        },
        enumerable: true,
        configurable: true
    });
    return RowGroup;
})();
var MeasureHelper = (function () {
    function MeasureHelper() {
        this.infinity = utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED);
        this.rows = new Array();
        this.columns = new Array();
    }
    Object.defineProperty(MeasureHelper.prototype, "horizontalStretch", {
        get: function () {
            return this.grid.horizontalAlignment === enums.HorizontalAlignment.stretch && !this.infinityWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureHelper.prototype, "verticalStretch", {
        get: function () {
            return this.grid.verticalAlignment === enums.VerticalAlignment.stretch && !this.infinityHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeasureHelper.prototype, "columnsFixed", {
        get: function () {
            return !isNaN(this.columnStarValue);
        },
        enumerable: true,
        configurable: true
    });
    MeasureHelper.prototype.addMeasureSpec = function (measureSpec, density) {
        var i = 0;
        var columnGroup;
        for (i = measureSpec.columnIndex; i < measureSpec.columnIndex + measureSpec.columnSpan; i++) {
            columnGroup = this.columns[i];
            if (columnGroup.isAuto) {
                measureSpec.autoColumnsCount++;
            }
            else if (columnGroup.isStar) {
                measureSpec.starColumnsCount += columnGroup.column.value;
            }
            else if (columnGroup.isAbsolute) {
                measureSpec.pixelWidth += columnGroup.column.value * density;
            }
        }
        if (measureSpec.autoColumnsCount > 0 && measureSpec.starColumnsCount === 0) {
            for (i = measureSpec.columnIndex; i < measureSpec.columnIndex + measureSpec.columnSpan; i++) {
                columnGroup = this.columns[i];
                if (columnGroup.isAuto) {
                    columnGroup.measureToFix++;
                }
            }
        }
        var rowGroup;
        for (i = measureSpec.rowIndex; i < measureSpec.rowIndex + measureSpec.rowSpan; i++) {
            rowGroup = this.rows[i];
            if (rowGroup.isAuto) {
                measureSpec.autoRowsCount++;
            }
            else if (rowGroup.isStar) {
                measureSpec.starRowsCount += rowGroup.row.value;
            }
            else if (rowGroup.isAbsolute) {
                measureSpec.pixelHeight += rowGroup.row.value * density;
            }
        }
        if (measureSpec.autoRowsCount > 0 && measureSpec.starRowsCount === 0) {
            for (i = measureSpec.rowIndex; i < measureSpec.rowIndex + measureSpec.rowSpan; i++) {
                rowGroup = this.rows[i];
                if (rowGroup.isAuto) {
                    rowGroup.measureToFix++;
                }
            }
        }
        this.columns[measureSpec.columnIndex].children.push(measureSpec);
        this.rows[measureSpec.rowIndex].children.push(measureSpec);
    };
    MeasureHelper.prototype.init = function () {
        this.rows.forEach(function (row, i, a) { return row.init(); });
        this.columns.forEach(function (col, i, a) { return col.init(); });
        this.columnStarValue = Number.NaN;
        this.rowStarValue = Number.NaN;
    };
    MeasureHelper.prototype.itemMeasured = function (measureSpec, isFakeMeasure) {
        if (isFakeMeasure === void 0) { isFakeMeasure = false; }
        if (!isFakeMeasure) {
            this.columns[measureSpec.columnIndex].measuredCount++;
            this.rows[measureSpec.rowIndex].measuredCount++;
            measureSpec.measured = true;
        }
        var i = 0;
        if (measureSpec.autoColumnsCount > 0 && measureSpec.starColumnsCount === 0) {
            var columnGroup;
            for (i = measureSpec.columnIndex; i < measureSpec.columnIndex + measureSpec.columnSpan; i++) {
                columnGroup = this.columns[i];
                if (columnGroup.isAuto) {
                    columnGroup.currentMeasureToFixCount++;
                }
            }
        }
        if (measureSpec.autoRowsCount > 0 && measureSpec.starRowsCount === 0) {
            var rowGroup;
            for (i = measureSpec.rowIndex; i < measureSpec.rowIndex + measureSpec.rowSpan; i++) {
                rowGroup = this.rows[i];
                if (rowGroup.isAuto) {
                    rowGroup.currentMeasureToFixCount++;
                }
            }
        }
    };
    MeasureHelper.prototype.fixColumns = function () {
        var _this = this;
        var currentColumnWidth = 0;
        var columnStarCount = 0;
        this.columns.forEach(function (value, index, array) {
            currentColumnWidth += value.width;
            if (value.column.isStar) {
                columnStarCount += value.column.value;
            }
        });
        this.columnStarValue = columnStarCount > 0 ? (this.width - currentColumnWidth) / columnStarCount : 0;
        this.columns.forEach(function (value, index, array) {
            if (value.isStar) {
                value.width = value.column.value * _this.columnStarValue;
            }
        });
    };
    MeasureHelper.prototype.fixRows = function () {
        var _this = this;
        var currentRowHeight = 0;
        var rowStarCount = 0;
        this.rows.forEach(function (value, index, array) {
            currentRowHeight += value.height;
            if (value.row.isStar) {
                rowStarCount += value.row.value;
            }
        });
        this.rowStarValue = rowStarCount > 0 ? (this.height - currentRowHeight) / rowStarCount : 0;
        this.rows.forEach(function (value, index, array) {
            if (value.isStar) {
                value.height = value.row.value * _this.rowStarValue;
            }
        });
    };
    MeasureHelper.prototype.fakeMeasure = function () {
        for (var i = 0; i < this.columns.length; i++) {
            var columnGroup = this.columns[i];
            if (columnGroup.allMeasured) {
                continue;
            }
            for (var j = 0; j < columnGroup.children.length; j++) {
                var measureSpec = columnGroup.children[j];
                if (measureSpec.starRowsCount > 0 && measureSpec.autoColumnsCount > 0 && measureSpec.starColumnsCount === 0) {
                    this.measureChild(measureSpec, true);
                }
            }
        }
    };
    MeasureHelper.prototype.measureFixedColumnsNoStarRows = function () {
        for (var i = 0; i < this.columns.length; i++) {
            var columnGroup = this.columns[i];
            for (var j = 0; j < columnGroup.children.length; j++) {
                var measureSpec = columnGroup.children[j];
                if (measureSpec.starColumnsCount > 0 && measureSpec.starRowsCount === 0) {
                    this.measureChildFixedColumns(measureSpec);
                }
            }
        }
    };
    MeasureHelper.prototype.measureNoStarColumnsFixedRows = function () {
        for (var i = 0; i < this.columns.length; i++) {
            var columnGroup = this.columns[i];
            for (var j = 0; j < columnGroup.children.length; j++) {
                var measureSpec = columnGroup.children[j];
                if (measureSpec.starRowsCount > 0 && measureSpec.starColumnsCount === 0) {
                    this.measureChildFixedRows(measureSpec);
                }
            }
        }
    };
    MeasureHelper.prototype.measure = function () {
        var _this = this;
        this.init();
        var i = 0;
        var j = 0;
        var columnGroup;
        var measureSpec;
        for (i = 0; i < this.columns.length; i++) {
            columnGroup = this.columns[i];
            for (j = 0; j < columnGroup.children.length; j++) {
                measureSpec = columnGroup.children[j];
                if (measureSpec.isStar || measureSpec.spanned) {
                    continue;
                }
                this.measureChild(measureSpec);
            }
        }
        for (i = 0; i < this.columns.length; i++) {
            columnGroup = this.columns[i];
            for (j = 0; j < columnGroup.children.length; j++) {
                measureSpec = columnGroup.children[j];
                if (measureSpec.isStar || !measureSpec.spanned) {
                    continue;
                }
                this.measureChild(measureSpec);
            }
        }
        var fixColumns = this.columns.every(function (colGroup, i, a) { return colGroup.canBeFixed; });
        var fixRows = this.rows.every(function (rowGroup, i, a) { return rowGroup.canBeFixed; });
        if (fixColumns) {
            this.fixColumns();
        }
        if (fixRows) {
            this.fixRows();
        }
        if (!fixColumns && !fixRows) {
            this.fakeMeasure();
            this.fixColumns();
            this.measureFixedColumnsNoStarRows();
            this.fixRows();
        }
        else if (fixColumns && !fixRows) {
            this.measureFixedColumnsNoStarRows();
            this.fixRows();
        }
        else if (!fixColumns && fixRows) {
            this.measureNoStarColumnsFixedRows();
            this.fixColumns();
        }
        for (i = 0; i < this.columns.length; i++) {
            columnGroup = this.columns[i];
            for (j = 0; j < columnGroup.children.length; j++) {
                measureSpec = columnGroup.children[j];
                if (!measureSpec.measured) {
                    this.measureChildFixedColumnsAndRows(measureSpec);
                }
            }
        }
        this.measuredWidth = 0;
        this.columns.forEach(function (value, index, array) {
            _this.measuredWidth += value.width;
        });
        this.measuredHeight = 0;
        this.rows.forEach(function (value, index, array) {
            _this.measuredHeight += value.height;
        });
    };
    MeasureHelper.prototype.measureChild = function (measureSpec, isFakeMeasure) {
        if (isFakeMeasure === void 0) { isFakeMeasure = false; }
        var widthMeasureSpec = (measureSpec.autoColumnsCount > 0) ? this.infinity : utils.layout.makeMeasureSpec(measureSpec.pixelWidth, utils.layout.EXACTLY);
        var heightMeasureSpec = (isFakeMeasure || measureSpec.autoRowsCount > 0) ? this.infinity : utils.layout.makeMeasureSpec(measureSpec.pixelHeight, utils.layout.EXACTLY);
        var childSize = view.View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        var i;
        var columnSpanEnd = measureSpec.columnIndex + measureSpec.columnSpan;
        var rowSpanEnd = measureSpec.rowIndex + measureSpec.rowSpan;
        var columnGroup;
        var rowGroup;
        var growSize;
        var remainingSpace = 0;
        if (measureSpec.autoColumnsCount > 0) {
            remainingSpace = childSize.measuredWidth;
            for (i = measureSpec.columnIndex; i < columnSpanEnd; i++) {
                columnGroup = this.columns[i];
                remainingSpace -= columnGroup.width;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.autoColumnsCount;
                for (i = measureSpec.columnIndex; i < columnSpanEnd; i++) {
                    columnGroup = this.columns[i];
                    if (columnGroup.isAuto) {
                        columnGroup.width += growSize;
                    }
                }
            }
        }
        if (!isFakeMeasure && measureSpec.autoRowsCount > 0) {
            remainingSpace = childSize.measuredHeight;
            for (i = measureSpec.rowIndex; i < rowSpanEnd; i++) {
                rowGroup = this.rows[i];
                remainingSpace -= rowGroup.height;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.autoRowsCount;
                for (i = measureSpec.rowIndex; i < rowSpanEnd; i++) {
                    rowGroup = this.rows[i];
                    if (rowGroup.isAuto) {
                        rowGroup.height += growSize;
                    }
                }
            }
        }
        this.itemMeasured(measureSpec, isFakeMeasure);
    };
    MeasureHelper.prototype.measureChildFixedColumns = function (measureSpec) {
        var columnIndex = measureSpec.columnIndex;
        var columnSpanEnd = columnIndex + measureSpec.columnSpan;
        var rowIndex = measureSpec.rowIndex;
        var rowSpanEnd = rowIndex + measureSpec.rowSpan;
        var i = 0;
        var columnsWidth = 0;
        var columnGroup;
        var rowGroup;
        var growSize;
        for (i = columnIndex; i < columnSpanEnd; i++) {
            columnGroup = this.columns[i];
            if (!columnGroup.isStar) {
                columnsWidth += columnGroup.width;
            }
        }
        var measureWidth = columnsWidth + measureSpec.starColumnsCount * this.columnStarValue;
        var widthMeasureSpec = utils.layout.makeMeasureSpec(measureWidth, this.horizontalStretch ? utils.layout.EXACTLY : utils.layout.AT_MOST);
        var heightMeasureSpec = (measureSpec.autoRowsCount > 0) ? this.infinity : utils.layout.makeMeasureSpec(measureSpec.pixelHeight, utils.layout.EXACTLY);
        var childSize = view.View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        var remainingSpace = 0;
        if (!this.horizontalStretch) {
            remainingSpace = childSize.measuredWidth;
            for (i = columnIndex; i < columnSpanEnd; i++) {
                columnGroup = this.columns[i];
                remainingSpace -= columnGroup.width;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.starColumnsCount;
                for (i = columnIndex; i < columnSpanEnd; i++) {
                    columnGroup = this.columns[i];
                    if (columnGroup.isStar) {
                        columnGroup.width += growSize;
                    }
                }
            }
        }
        if (measureSpec.autoRowsCount > 0) {
            remainingSpace = childSize.measuredHeight;
            for (i = rowIndex; i < rowSpanEnd; i++) {
                rowGroup = this.rows[i];
                remainingSpace -= rowGroup.height;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.autoRowsCount;
                for (i = rowIndex; i < rowSpanEnd; i++) {
                    rowGroup = this.rows[i];
                    if (rowGroup.isAuto) {
                        rowGroup.height += growSize;
                    }
                }
            }
        }
        this.itemMeasured(measureSpec);
    };
    MeasureHelper.prototype.measureChildFixedRows = function (measureSpec) {
        var i = 0;
        var columnIndex = measureSpec.columnIndex;
        var columnSpanEnd = columnIndex + measureSpec.columnSpan;
        var rowIndex = measureSpec.rowIndex;
        var rowSpanEnd = rowIndex + measureSpec.rowSpan;
        var rowsHeight = 0;
        var rowGroup;
        for (i = rowIndex; i < rowSpanEnd; i++) {
            rowGroup = this.rows[i];
            if (!rowGroup.isStar) {
                rowsHeight += rowGroup.height;
            }
        }
        var measureHeight = rowsHeight + measureSpec.starRowsCount * this.rowStarValue;
        var widthMeasureSpec = (measureSpec.autoColumnsCount > 0) ? this.infinity : utils.layout.makeMeasureSpec(measureSpec.pixelWidth, utils.layout.EXACTLY);
        var heightMeasureSpec = utils.layout.makeMeasureSpec(measureHeight, this.verticalStretch ? utils.layout.EXACTLY : utils.layout.AT_MOST);
        var childSize = view.View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        var remainingSpace = 0;
        var columnGroup;
        var growSize;
        if (measureSpec.autoColumnsCount > 0) {
            remainingSpace = childSize.measuredWidth;
            for (i = columnIndex; i < columnSpanEnd; i++) {
                columnGroup = this.columns[i];
                remainingSpace -= columnGroup.width;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.autoColumnsCount;
                for (i = columnIndex; i < columnSpanEnd; i++) {
                    columnGroup = this.columns[i];
                    if (columnGroup.isAuto) {
                        columnGroup.width += growSize;
                    }
                }
            }
        }
        if (!this.verticalStretch) {
            remainingSpace = childSize.measuredHeight;
            for (i = rowIndex; i < rowSpanEnd; i++) {
                rowGroup = this.rows[i];
                remainingSpace -= rowGroup.height;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.starRowsCount;
                for (i = rowIndex; i < rowSpanEnd; i++) {
                    rowGroup = this.rows[i];
                    if (rowGroup.isStar) {
                        rowGroup.height += growSize;
                    }
                }
            }
        }
        this.itemMeasured(measureSpec);
    };
    MeasureHelper.prototype.measureChildFixedColumnsAndRows = function (measureSpec) {
        var i = 0;
        var columnIndex = measureSpec.columnIndex;
        var columnSpanEnd = columnIndex + measureSpec.columnSpan;
        var rowIndex = measureSpec.rowIndex;
        var rowSpanEnd = rowIndex + measureSpec.rowSpan;
        var columnGroup;
        var rowGroup;
        var columnsWidth = 0;
        for (i = columnIndex; i < columnSpanEnd; i++) {
            columnGroup = this.columns[i];
            if (!columnGroup.isStar) {
                columnsWidth += columnGroup.width;
            }
        }
        var rowsHeight = 0;
        for (i = rowIndex; i < rowSpanEnd; i++) {
            rowGroup = this.rows[i];
            if (!rowGroup.isStar) {
                rowsHeight += rowGroup.height;
            }
        }
        var measureWidth = columnsWidth + measureSpec.starColumnsCount * this.columnStarValue;
        var measureHeight = rowsHeight + measureSpec.starRowsCount * this.rowStarValue;
        var widthMeasureSpec = utils.layout.makeMeasureSpec(measureWidth, (measureSpec.starColumnsCount > 0 && !this.horizontalStretch) ? utils.layout.AT_MOST : utils.layout.EXACTLY);
        var heightMeasureSpec = utils.layout.makeMeasureSpec(measureHeight, (measureSpec.starRowsCount > 0 && !this.verticalStretch) ? utils.layout.AT_MOST : utils.layout.EXACTLY);
        var childSize = view.View.measureChild(this.grid, measureSpec.child, widthMeasureSpec, heightMeasureSpec);
        var remainingSpace = childSize.measuredWidth;
        var growSize;
        if (!this.horizontalStretch) {
            for (i = columnIndex; i < columnSpanEnd; i++) {
                columnGroup = this.columns[i];
                remainingSpace -= columnGroup.width;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.starColumnsCount;
                for (i = columnIndex; i < columnSpanEnd; i++) {
                    columnGroup = this.columns[i];
                    if (columnGroup.isStar) {
                        columnGroup.width += growSize;
                    }
                }
            }
        }
        remainingSpace = childSize.measuredHeight;
        if (!this.verticalStretch) {
            for (i = rowIndex; i < rowSpanEnd; i++) {
                rowGroup = this.rows[i];
                remainingSpace -= rowGroup.height;
            }
            if (remainingSpace > 0) {
                growSize = remainingSpace / measureSpec.starRowsCount;
                for (i = rowIndex; i < rowSpanEnd; i++) {
                    rowGroup = this.rows[i];
                    if (rowGroup.isStar) {
                        rowGroup.height += growSize;
                    }
                }
            }
        }
        this.itemMeasured(measureSpec);
    };
    return MeasureHelper;
})();
