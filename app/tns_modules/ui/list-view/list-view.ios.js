var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-view/list-view-common");
var utils = require("utils/utils");
var view = require("ui/core/view");
var color = require("color");
var CELLIDENTIFIER = "cell";
var ITEMLOADING = common.ListView.itemLoadingEvent;
var LOADMOREITEMS = common.ListView.loadMoreItemsEvent;
var ITEMTAP = common.ListView.itemTapEvent;
var DEFAULT_HEIGHT = 80;
require("utils/module-merge").merge(common, exports);
var infinity = utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED);
var ListViewCell = (function (_super) {
    __extends(ListViewCell, _super);
    function ListViewCell() {
        _super.apply(this, arguments);
    }
    ListViewCell.new = function () {
        return _super.new.call(this);
    };
    return ListViewCell;
})(UITableViewCell);
function notifyForItemAtIndex(listView, cell, eventName, indexPath) {
    var args = { eventName: eventName, object: listView, index: indexPath.row, view: cell.view, ios: cell, android: undefined };
    listView.notify(args);
    return args;
}
var DataSource = (function (_super) {
    __extends(DataSource, _super);
    function DataSource() {
        _super.apply(this, arguments);
    }
    DataSource.new = function () {
        return _super.new.call(this);
    };
    DataSource.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    DataSource.prototype.tableViewNumberOfRowsInSection = function (tableView, section) {
        return this._owner.items ? this._owner.items.length : 0;
    };
    DataSource.prototype.tableViewCellForRowAtIndexPath = function (tableView, indexPath) {
        var cell = tableView.dequeueReusableCellWithIdentifier(CELLIDENTIFIER) || ListViewCell.new();
        this._owner._prepareCell(cell, indexPath);
        var cellView = cell.view;
        if (cellView) {
            var specs = this._owner._getCurrentMeasureSpecs();
            var width = utils.layout.getMeasureSpecSize(specs.widthMeasureSpec);
            var cellHeight = this._owner.getHeight(indexPath.row);
            view.View.layoutChild(this._owner, cellView, 0, 0, width, cellHeight);
        }
        return cell;
    };
    DataSource.ObjCProtocols = [UITableViewDataSource];
    return DataSource;
})(NSObject);
var UITableViewDelegateImpl = (function (_super) {
    __extends(UITableViewDelegateImpl, _super);
    function UITableViewDelegateImpl() {
        _super.apply(this, arguments);
    }
    UITableViewDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UITableViewDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UITableViewDelegateImpl.prototype.tableViewWillDisplayCellForRowAtIndexPath = function (tableView, cell, indexPath) {
        if (indexPath.row === this._owner.items.length - 1) {
            this._owner.notify({ eventName: LOADMOREITEMS, object: this._owner });
        }
    };
    UITableViewDelegateImpl.prototype.tableViewWillSelectRowAtIndexPath = function (tableView, indexPath) {
        var cell = tableView.cellForRowAtIndexPath(indexPath);
        notifyForItemAtIndex(this._owner, cell, ITEMTAP, indexPath);
        cell.highlighted = false;
        return indexPath;
    };
    UITableViewDelegateImpl.prototype.tableViewHeightForRowAtIndexPath = function (tableView, indexPath) {
        var height = undefined;
        if (utils.ios.MajorVersion >= 8) {
            height = this._owner.getHeight(indexPath.row);
        }
        if (utils.ios.MajorVersion < 8 || height === undefined) {
            var cell = this._measureCell;
            if (!cell) {
                this._measureCell = tableView.dequeueReusableCellWithIdentifier(CELLIDENTIFIER) || ListViewCell.new();
                cell = this._measureCell;
            }
            height = this._owner._prepareCell(cell, indexPath);
        }
        return height;
    };
    UITableViewDelegateImpl.ObjCProtocols = [UITableViewDelegate];
    return UITableViewDelegateImpl;
})(NSObject);
function onSeparatorColorPropertyChanged(data) {
    var bar = data.object;
    if (!bar.ios) {
        return;
    }
    if (data.newValue instanceof color.Color) {
        bar.ios.separatorColor = data.newValue.ios;
    }
}
common.ListView.separatorColorProperty.metadata.onSetNativeValue = onSeparatorColorPropertyChanged;
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.call(this);
        this._preparingCell = false;
        this._isDataDirty = false;
        this._ios = new UITableView();
        this._ios.registerClassForCellReuseIdentifier(ListViewCell.class(), CELLIDENTIFIER);
        this._ios.autoresizesSubviews = false;
        this._ios.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingNone;
        this._ios.estimatedRowHeight = DEFAULT_HEIGHT;
        var dataSource = DataSource.new().initWithOwner(this);
        this._dataSource = dataSource;
        this._ios.dataSource = this._dataSource;
        this._delegate = UITableViewDelegateImpl.new().initWithOwner(this);
        this._heights = new Array();
    }
    ListView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this._isDataDirty) {
            this.refresh();
        }
        this._ios.delegate = this._delegate;
    };
    ListView.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(ListView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
        if (this.isLoaded) {
            this._ios.reloadData();
            this.requestLayout();
            this._isDataDirty = false;
        }
        else {
            this._isDataDirty = true;
        }
    };
    ListView.prototype.getHeight = function (index) {
        return this._heights[index];
    };
    ListView.prototype.setHeight = function (index, value) {
        this._heights[index] = value;
    };
    ListView.prototype.requestLayout = function () {
        if (!this._preparingCell) {
            _super.prototype.requestLayout.call(this);
        }
    };
    ListView.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        var changed = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        _super.prototype.measure.call(this, widthMeasureSpec, heightMeasureSpec);
        if (changed) {
            this._ios.reloadData();
        }
    };
    ListView.prototype._layoutCell = function (cellView, indexPath) {
        if (cellView) {
            var widthMeasureSpecs = this._getCurrentMeasureSpecs().widthMeasureSpec;
            var measuredSize = view.View.measureChild(this, cellView, widthMeasureSpecs, infinity);
            var height = measuredSize.measuredHeight;
            this.setHeight(indexPath.row, height);
            return height;
        }
        return 0;
    };
    ListView.prototype._prepareCell = function (tableCell, indexPath) {
        var cell = tableCell;
        var cellHeight;
        try {
            this._preparingCell = true;
            if (!cell.view) {
                cell.view = this._getItemTemplateContent(indexPath.row);
            }
            var args = notifyForItemAtIndex(this, cell, ITEMLOADING, indexPath);
            var view = cell.view = args.view || this._getDefaultItemContent(indexPath.row);
            if (view && !view.parent && view.ios) {
                cell.contentView.addSubview(view.ios);
                this._addView(view);
            }
            this._prepareItem(view, indexPath.row);
            cellHeight = this._layoutCell(view, indexPath);
        }
        finally {
            this._preparingCell = false;
        }
        return cellHeight;
    };
    return ListView;
})(common.ListView);
exports.ListView = ListView;
