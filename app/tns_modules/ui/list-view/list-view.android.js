var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-view/list-view-common");
var layout = require("ui/layouts/layout");
var stackLayout = require("ui/layouts/stack-layout");
var color = require("color");
var ITEMLOADING = common.ListView.itemLoadingEvent;
var LOADMOREITEMS = common.ListView.loadMoreItemsEvent;
var ITEMTAP = common.ListView.itemTapEvent;
var REALIZED_INDEX = "realizedIndex";
require("utils/module-merge").merge(common, exports);
function onSeparatorColorPropertyChanged(data) {
    var bar = data.object;
    if (!bar.android) {
        return;
    }
    if (data.newValue instanceof color.Color) {
        bar.android.setDivider(new android.graphics.drawable.ColorDrawable(data.newValue.android));
        bar.android.setDividerHeight(1);
    }
}
common.ListView.separatorColorProperty.metadata.onSetNativeValue = onSeparatorColorPropertyChanged;
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.apply(this, arguments);
        this._realizedItems = {};
    }
    ListView.prototype._createUI = function () {
        this._android = new android.widget.ListView(this._context);
        this._android.setCacheColorHint(android.graphics.Color.TRANSPARENT);
        if (!this._androidViewId) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);
        this.android.setAdapter(new ListViewAdapter(this));
        var that = new WeakRef(this);
        this.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener({
            onScrollStateChanged: function (view, scrollState) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (scrollState === android.widget.AbsListView.OnScrollListener.SCROLL_STATE_IDLE) {
                    owner._setValue(common.ListView.isScrollingProperty, false);
                    owner._notifyScrollIdle();
                }
                else {
                    owner._setValue(common.ListView.isScrollingProperty, true);
                }
            },
            onScroll: function (view, firstVisibleItem, visibleItemCount, totalItemCount) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (totalItemCount > 0 && firstVisibleItem + visibleItemCount === totalItemCount) {
                    owner.notify({ eventName: LOADMOREITEMS, object: owner });
                }
            },
            get owner() {
                return that.get();
            }
        }));
        this.android.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener({
            onItemClick: function (parent, convertView, index, id) {
                var owner = that.get();
                if (owner) {
                    owner.notify({ eventName: ITEMTAP, object: owner, index: index, view: owner._getRealizedView(convertView, index) });
                }
            }
        }));
    };
    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
        if (!this._android || !this._android.getAdapter()) {
            return;
        }
        this.android.getAdapter().notifyDataSetChanged();
    };
    ListView.prototype._onDetached = function (force) {
        _super.prototype._onDetached.call(this, force);
        var keys = Object.keys(this._realizedItems);
        var i;
        var length = keys.length;
        var view;
        var key;
        for (i = 0; i < length; i++) {
            key = keys[i];
            view = this._realizedItems[key];
            view.parent._removeView(view);
            delete this._realizedItems[key];
        }
    };
    ListView.prototype._getRealizedView = function (convertView, index) {
        if (!convertView) {
            return this._getItemTemplateContent(index);
        }
        return this._realizedItems[convertView.hashCode()];
    };
    ListView.prototype._notifyScrollIdle = function () {
        var keys = Object.keys(this._realizedItems);
        var i;
        var length = keys.length;
        var view;
        var key;
        for (i = 0; i < length; i++) {
            key = keys[i];
            view = this._realizedItems[key];
            this.notify({
                eventName: ITEMLOADING,
                object: this,
                index: view[REALIZED_INDEX],
                view: view
            });
        }
    };
    return ListView;
})(common.ListView);
exports.ListView = ListView;
var ListViewAdapter = (function (_super) {
    __extends(ListViewAdapter, _super);
    function ListViewAdapter(listView) {
        _super.call(this);
        this._listView = listView;
        return global.__native(this);
    }
    ListViewAdapter.prototype.getCount = function () {
        return this._listView && this._listView.items ? this._listView.items.length : 0;
    };
    ListViewAdapter.prototype.getItem = function (i) {
        if (this._listView && this._listView.items && i < this._listView.items.length) {
            return this._listView.items.getItem ? this._listView.items.getItem(i) : this._listView.items[i];
        }
        return null;
    };
    ListViewAdapter.prototype.getItemId = function (i) {
        return long(i);
    };
    ListViewAdapter.prototype.hasStableIds = function () {
        return true;
    };
    ListViewAdapter.prototype.getView = function (index, convertView, parent) {
        if (!this._listView) {
            return null;
        }
        var view = this._listView._getRealizedView(convertView, index);
        var args = {
            eventName: ITEMLOADING, object: this._listView, index: index, view: view,
            android: parent,
            ios: undefined
        };
        this._listView.notify(args);
        if (!args.view) {
            args.view = this._listView._getDefaultItemContent(index);
        }
        if (args.view) {
            if (!args.view.parent) {
                if (args.view instanceof layout.Layout) {
                    this._listView._addView(args.view);
                    convertView = args.view.android;
                }
                else {
                    var sp = new stackLayout.StackLayout();
                    sp.addChild(args.view);
                    this._listView._addView(sp);
                    convertView = sp.android;
                }
            }
            this._listView._realizedItems[convertView.hashCode()] = args.view;
            args.view[REALIZED_INDEX] = index;
            this._listView._prepareItem(args.view, index);
        }
        return convertView;
    };
    return ListViewAdapter;
})(android.widget.BaseAdapter);
