var layouts = require("ui/layouts/layout-base");
var definition = require("ui/layouts/grid-layout");
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var bindable = require("ui/core/bindable");
var types = require("utils/types");
var numberUtils = require("utils/number-utils");
var proxy = require("ui/core/proxy");
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
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
        this._singleRow.index = 0;
        this._singleColumn.index = 0;
    }
    GridLayout.getColumn = function (element) {
        return validateArgs(element)._getValue(GridLayout.columnProperty);
    };
    GridLayout.setColumn = function (element, value) {
        validateArgs(element)._setValue(GridLayout.columnProperty, value);
    };
    GridLayout.getColumnSpan = function (element) {
        return validateArgs(element)._getValue(GridLayout.columnSpanProperty);
    };
    GridLayout.setColumnSpan = function (element, value) {
        validateArgs(element)._setValue(GridLayout.columnSpanProperty, value);
    };
    GridLayout.getRow = function (element) {
        return validateArgs(element)._getValue(GridLayout.rowProperty);
    };
    GridLayout.setRow = function (element, value) {
        validateArgs(element)._setValue(GridLayout.rowProperty, value);
    };
    GridLayout.getRowSpan = function (element) {
        return validateArgs(element)._getValue(GridLayout.rowSpanProperty);
    };
    GridLayout.setRowSpan = function (element, value) {
        validateArgs(element)._setValue(GridLayout.rowSpanProperty, value);
    };
    GridLayout.prototype.addRow = function (itemSpec) {
        GridLayout.validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._rows.push(itemSpec);
        this.onRowAdded(itemSpec);
    };
    GridLayout.prototype.addColumn = function (itemSpec) {
        GridLayout.validateItemSpec(itemSpec);
        itemSpec.owner = this;
        this._cols.push(itemSpec);
        this.onColumnAdded(itemSpec);
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
        this.onRowRemoved(itemSpec, index);
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
        this.onColumnRemoved(itemSpec, index);
    };
    GridLayout.prototype.onRowChanged = function (element, oldValue, newValue) {
    };
    GridLayout.prototype.onRowSpanChanged = function (element, oldValue, newValue) {
    };
    GridLayout.prototype.onColumnChanged = function (element, oldValue, newValue) {
    };
    GridLayout.prototype.onColumnSpanChanged = function (element, oldValue, newValue) {
    };
    GridLayout.prototype.onRowAdded = function (itemSpec) {
    };
    GridLayout.prototype.onColumnAdded = function (itemSpec) {
    };
    GridLayout.prototype.onRowRemoved = function (itemSpec, index) {
    };
    GridLayout.prototype.onColumnRemoved = function (itemSpec, index) {
    };
    GridLayout.prototype.getColumns = function () {
        return this._cols.slice();
    };
    GridLayout.prototype.getRows = function () {
        return this._rows.slice();
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
    GridLayout.prototype.invalidate = function () {
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
        return false;
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
    GridLayout.onRowPropertyChanged = function (data) {
        var element = GridLayout.getView(data.object);
        var grid = element.parent;
        if (grid instanceof GridLayout) {
            grid.onRowChanged(element, data.oldValue, data.newValue);
        }
    };
    GridLayout.onColumnPropertyChanged = function (data) {
        var element = GridLayout.getView(data.object);
        var grid = element.parent;
        if (grid instanceof GridLayout) {
            grid.onColumnChanged(element, data.oldValue, data.newValue);
        }
    };
    GridLayout.onRowSpanPropertyChanged = function (data) {
        var element = GridLayout.getView(data.object);
        var grid = element.parent;
        if (grid instanceof GridLayout) {
            grid.onRowSpanChanged(element, data.oldValue, data.newValue);
        }
    };
    GridLayout.onColumnSpanPropertyChanged = function (data) {
        var element = GridLayout.getView(data.object);
        var grid = element.parent;
        if (grid instanceof GridLayout) {
            grid.onColumnSpanChanged(element, data.oldValue, data.newValue);
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
    GridLayout.getView = function (object) {
        if (object instanceof view.View) {
            return object;
        }
        throw new Error("Element is not View or its descendant.");
    };
    GridLayout.prototype.setColumns = function (value) {
        this._cols = GridLayout.parseItemSpecs(value);
        this.invalidate();
    };
    GridLayout.prototype.setRows = function (value) {
        this._rows = GridLayout.parseItemSpecs(value);
        this.invalidate();
    };
    GridLayout.columnProperty = new dependencyObservable.Property("Column", "GridLayout", new proxy.PropertyMetadata(0, dependencyObservable.PropertyMetadataSettings.None, GridLayout.onColumnPropertyChanged, numberUtils.notNegative));
    GridLayout.columnSpanProperty = new dependencyObservable.Property("ColumnSpan", "GridLayout", new proxy.PropertyMetadata(1, dependencyObservable.PropertyMetadataSettings.None, GridLayout.onColumnSpanPropertyChanged, numberUtils.greaterThanZero));
    GridLayout.rowProperty = new dependencyObservable.Property("Row", "GridLayout", new proxy.PropertyMetadata(0, dependencyObservable.PropertyMetadataSettings.None, GridLayout.onRowPropertyChanged, numberUtils.notNegative));
    GridLayout.rowSpanProperty = new dependencyObservable.Property("RowSpan", "GridLayout", new proxy.PropertyMetadata(1, dependencyObservable.PropertyMetadataSettings.None, GridLayout.onRowSpanPropertyChanged, numberUtils.greaterThanZero));
    return GridLayout;
})(layouts.LayoutBase);
exports.GridLayout = GridLayout;
