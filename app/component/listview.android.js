var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dependencyObservable = require('ui/core/dependency-observable');
var listViewCommonModule = require('./listview-common');
var proxyModule = require('ui/core/proxy');
var builder = require('ui/builder');
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
    knownTemplates.itemSwipeTemplate = "itemSwipeTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var ListViewAdapter = (function (_super) {
    __extends(ListViewAdapter, _super);
    function ListViewAdapter(items, listView) {
        _super.call(this, items);
        this.ownerLv = listView;
        return global.__native(this);
    }
    ListViewAdapter.prototype.onCreateItemViewHolder = function (parent, viewType) {
        var view = builder.parse(this.ownerLv.itemTemplate);
        this.ownerLv._addView(view);
        var id = parent.getContext().getResources().getIdentifier("selectable_item_background", "drawable", "org.nativescript.devenv");
        view.android.setBackgroundResource(id);
        var holder = new com.telerik.widget.list.ListViewHolder(view.android);
        holder.nsView = view;
        return holder;
    };
    ListViewAdapter.prototype.onBindItemViewHolder = function (holder, entity) {
        holder.nsView.bindingContext = JSON.parse(entity);
    };
    ListViewAdapter.prototype.onCreateSwipeContentHolder = function (parent) {
        var swipeView = builder.parse(this.ownerLv.itemSwipeTemplate);
        this.ownerLv._addView(swipeView);
        var holder = new com.telerik.widget.list.ListViewHolder(swipeView.android);
        holder.nsView = swipeView;
        return holder;
    };
    ListViewAdapter.prototype.onBindSwipeContentHolder = function (holder, position) {
        holder.nsView.bindingContext = JSON.parse(this.getItem(position));
    };
    return ListViewAdapter;
})(com.telerik.widget.list.ListViewDataSourceAdapter);
exports.ListViewAdapter = ListViewAdapter;
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.call(this);
    }
    ListView.prototype._createUI = function () {
        if (!this._android) {
            this._android = new com.telerik.widget.list.RadListView(this._context);
            if (this.listViewLayout) {
                this.listViewLayout._onOwnerUICreated();
            }
            this.loadData();
            this.updateSelectionBehavior();
            this.updateReorderBehavior();
            this.updateLoadOnDemandBehavior();
            this.updatePullToRefreshBehavior();
            this.updateSwipeToExecuteBehavior();
        }
    };
    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.onListViewLayoutChanged = function (data) {
        _super.prototype.onListViewLayoutChanged.call(this, data);
        if (data.oldValue) {
            var newLayout = data.oldValue;
            newLayout._reset();
        }
        if (data.newValue) {
            var newLayout = data.newValue;
            newLayout._init(this);
        }
    };
    ListView.prototype.onItemTemplateChanged = function (data) {
        _super.prototype.onItemTemplateChanged.call(this, data);
        this.loadData();
    };
    ListView.prototype.itemSwipeTemplateChanged = function (data) {
        _super.prototype.onItemSwipeTemplateChanged.call(this, data);
        this.updateSwipeToExecuteBehavior();
        this.loadData();
    };
    ListView.prototype.onMultipleSelectionChanged = function (data) {
        _super.prototype.onMultipleSelectionChanged.call(this, data);
        this.updateSelectionBehavior();
    };
    ListView.prototype.onCellReorderChanged = function (data) {
        _super.prototype.onCellReorderChanged.call(this, data);
        this.updateReorderBehavior();
    };
    ListView.prototype.onSwipeCellsChanged = function (data) {
        _super.prototype.onSwipeCellsChanged.call(this, data);
        this.updateSwipeToExecuteBehavior();
    };
    ListView.prototype.onPullToRefreshChanged = function (data) {
        _super.prototype.onPullToRefreshChanged.call(this, data);
        this.updatePullToRefreshBehavior();
    };
    ListView.prototype.onLoadOnDemandModeChanged = function (data) {
        _super.prototype.onLoadOnDemandModeChanged.call(this, data);
        this.updateLoadOnDemandBehavior();
    };
    ListView.prototype.onLoadOnDemandBufferSizeChanged = function (data) {
        _super.prototype.onLoadOnDemandBufferSizeChanged.call(this, data);
        this.updateLoadOnDemandBehavior();
    };
    ListView.prototype.onSelectionBehaviorChanged = function (data) {
        _super.prototype.onSelectionBehaviorChanged.call(this, data);
        this.updateSelectionBehavior();
    };
    ListView.prototype.onItemsChanged = function (data) {
        _super.prototype.onItemsChanged.call(this, data);
        this.loadData();
    };
    ListView.prototype.refresh = function () {
        this.loadData();
    };
    ListView.prototype.scrollToIndex = function (index) {
        console.log("TODO: impelment scroll to position");
    };
    ListView.prototype.updateSwipeToExecuteBehavior = function () {
        if (!this._android || !this.itemSwipeTemplate) {
            return;
        }
        if (this.swipeCells === true) {
            if (!this._swipeExecuteBehavior) {
                this._swipeExecuteBehavior = new com.telerik.widget.list.SwipeExecuteBehavior();
                this._android.addBehavior(this._swipeExecuteBehavior);
            }
        }
        else {
            if (this._swipeExecuteBehavior) {
                this._android.removeBehavior(this._swipeExecuteBehavior);
                this._swipeExecuteBehavior = null;
            }
        }
    };
    ListView.prototype.updatePullToRefreshBehavior = function () {
        if (!this._android) {
            return;
        }
        if (this.pullToRefresh === true) {
            if (!this._pullToRefreshBehavior) {
                this._pullToRefreshBehavior = new com.telerik.widget.list.SwipeRefreshBehavior();
                this._android.addBehavior(this._pullToRefreshBehavior);
            }
        }
        else {
            if (this._pullToRefreshBehavior) {
                this._android.addBehavior(this._pullToRefreshBehavior);
                this._pullToRefreshBehavior = null;
            }
        }
    };
    ListView.prototype.updateLoadOnDemandBehavior = function () {
        if (!this._android) {
            return;
        }
        if (!this._loadOnDemandBehavior) {
            this._loadOnDemandBehavior = new com.telerik.widget.list.LoadOnDemandBehavior();
            this._android.addBehavior(this._loadOnDemandBehavior);
        }
        if (!isNaN(this.loadOnDemandBufferSize)) {
            this._loadOnDemandBehavior.setMaxRemainingItems(this.loadOnDemandBufferSize);
        }
        switch (this.loadOnDemandMode) {
            case listViewCommonModule.ListViewLoadOnDemandMode.Manual:
                this._loadOnDemandBehavior.setMode(com.telerik.widget.list.LoadOnDemandBehavior.LoadOnDemandMode.MANUAL);
                break;
            case listViewCommonModule.ListViewLoadOnDemandMode.Auto:
                this._loadOnDemandBehavior.setMode(com.telerik.widget.list.LoadOnDemandBehavior.LoadOnDemandMode.AUTOMATIC);
                break;
            default: {
                this._android.removeBehavior(this._loadOnDemandBehavior);
                this._loadOnDemandBehavior = undefined;
                break;
            }
        }
    };
    ListView.prototype.updateReorderBehavior = function () {
        if (!this._android) {
            return;
        }
        if (this.cellReorder) {
            if (!this._reorderBehavior) {
                this._reorderBehavior = new com.telerik.widget.list.ItemReorderBehavior();
                this._android.addBehavior(this._reorderBehavior);
            }
        }
        else {
            if (this._reorderBehavior) {
                this._android.removeBehavior(this._reorderBehavior);
                this._reorderBehavior = undefined;
            }
        }
    };
    ListView.prototype.updateSelectionBehavior = function () {
        if (!this._android) {
            return;
        }
        if (!this._selectionBehavior) {
            this._selectionBehavior = new com.telerik.widget.list.SelectionBehavior();
            this._android.addBehavior(this._selectionBehavior);
        }
        if (this.multipleSelection === true) {
            this._selectionBehavior.setSelectionMode(com.telerik.widget.list.SelectionBehavior.SelectionMode.MULTIPLE);
        }
        else {
            this._selectionBehavior.setSelectionMode(com.telerik.widget.list.SelectionBehavior.SelectionMode.SINGLE);
        }
        console.log("selection behavior: ", this.selectionBehavior);
        switch (this.selectionBehavior) {
            case listViewCommonModule.ListViewSelectionBehavior.None:
                this._android.removeBehavior(this._selectionBehavior);
                this._selectionBehavior = undefined;
                break;
            case listViewCommonModule.ListViewSelectionBehavior.LongPress:
                this._selectionBehavior.setSelectionOnTouch(com.telerik.widget.list.SelectionBehavior.SelectionOnTouch.NEVER);
                break;
            default: {
                this._selectionBehavior.setSelectionOnTouch(com.telerik.widget.list.SelectionBehavior.SelectionOnTouch.ALWAYS);
            }
        }
    };
    ListView.prototype.loadData = function () {
        if (!this.items || !this._android || !this.itemTemplate) {
            return;
        }
        var nativeSource = new java.util.ArrayList();
        var dsLength = this.items.length;
        for (var i = 0; i < dsLength; i++) {
            var item = this.items.getItem ? this.items.getItem(i) : this.items[i];
            nativeSource.add(java.lang.String.valueOf(JSON.stringify(item)));
        }
        var adapter = new ListViewAdapter(nativeSource, this);
        this._android.setAdapter(adapter);
    };
    return ListView;
})(listViewCommonModule.ListView);
exports.ListView = ListView;
var AndroidLVLayoutBase = (function (_super) {
    __extends(AndroidLVLayoutBase, _super);
    function AndroidLVLayoutBase() {
        _super.apply(this, arguments);
    }
    AndroidLVLayoutBase.prototype._init = function (owner) {
        this._owner = owner;
        console.log("==>> Init called");
    };
    AndroidLVLayoutBase.prototype._reset = function () {
    };
    AndroidLVLayoutBase.prototype._onOwnerUICreated = function () {
        this._android = this.getLayoutManager();
        this._owner.android.setLayoutManager(this._android);
        if (this.scrollDirection) {
            this.setLayoutOrientation(this.scrollDirection);
        }
        if (this.itemInsertAnimation) {
            this.updateItemAnimator(this.itemInsertAnimation);
        }
        if (this.itemAppearAnimation) {
            this.updateItemAnimator(this.itemAppearAnimation);
        }
        if (this.itemDeleteAnimation) {
            this.updateItemAnimator(this.itemDeleteAnimation);
        }
    };
    AndroidLVLayoutBase.prototype.reset = function () {
        this._owner.android.setLayoutManager(null);
        this._owner = null;
    };
    AndroidLVLayoutBase.prototype.getLayoutManager = function () {
        return undefined;
    };
    AndroidLVLayoutBase.prototype.onScrollDirectionChanged = function (data) {
        if (data.newValue && this._android) {
            this.setLayoutOrientation(data.newValue);
        }
    };
    AndroidLVLayoutBase.prototype.onItemInsertAnimationChanged = function (data) {
        if (this._owner) {
            this.updateItemAnimator(data.newValue);
        }
    };
    AndroidLVLayoutBase.prototype.onItemDeleteAnimationChanged = function (data) {
        if (this._owner) {
            this.updateItemAnimator(data.newValue);
        }
    };
    AndroidLVLayoutBase.prototype.setLayoutOrientation = function (orientation) {
        this._android.setOrientation((orientation === listViewCommonModule.ListViewScrollDirection.Horizontal) ?
            android.support.v7.widget.LinearLayoutManager.HORIZONTAL :
            android.support.v7.widget.LinearLayoutManager.VERTICAL);
    };
    AndroidLVLayoutBase.prototype.updateItemAnimator = function (newAnimator) {
        if (!newAnimator) {
            this._owner.android.setItemAnimator(null);
            return;
        }
        switch (listViewCommonModule.ListViewItemAnimation[newAnimator]) {
            case listViewCommonModule.ListViewItemAnimation.Fade: {
                this._owner.android.setItemAnimator(new com.telerik.widget.list.FadeItemAnimator());
                break;
            }
            case listViewCommonModule.ListViewItemAnimation.Scale: {
                this._owner.android.setItemAnimator(new com.telerik.widget.list.ScaleItemAnimator());
                break;
            }
            case listViewCommonModule.ListViewItemAnimation.Slide: {
                this._owner.android.setItemAnimator(new com.telerik.widget.list.SlideItemAnimator());
                break;
            }
            default:
                this._owner.android.setItemAnimator(null);
        }
    };
    return AndroidLVLayoutBase;
})(listViewCommonModule.ListViewLayoutBase);
var ListViewLinearLayout = (function (_super) {
    __extends(ListViewLinearLayout, _super);
    function ListViewLinearLayout() {
        _super.call(this);
    }
    ListViewLinearLayout.prototype.getLayoutManager = function () {
        return new android.support.v7.widget.LinearLayoutManager(this._owner._context);
    };
    return ListViewLinearLayout;
})(AndroidLVLayoutBase);
exports.ListViewLinearLayout = ListViewLinearLayout;
var ListViewGridLayout = (function (_super) {
    __extends(ListViewGridLayout, _super);
    function ListViewGridLayout() {
        _super.call(this);
    }
    Object.defineProperty(ListViewGridLayout.prototype, "spanCount", {
        get: function () {
            return this._getValue(ListViewGridLayout.spanCountProperty);
        },
        set: function (value) {
            this._setValue(ListViewGridLayout.spanCountProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewGridLayout.onSpanCountPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onSpanCountChanged(data);
    };
    ListViewGridLayout.prototype.onSpanCountChanged = function (data) {
        if (!isNaN(+data.newValue) && this.android) {
            this.android.setSpanCount(data.newValue);
        }
    };
    ListViewGridLayout.prototype.getLayoutManager = function () {
        var sc = (this.spanCount ? this.spanCount : 2);
        return new android.support.v7.widget.GridLayoutManager(this._owner._context, sc);
    };
    ListViewGridLayout.spanCountProperty = new dependencyObservable.Property("spanCount", "ListViewGridLayout", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewGridLayout.onSpanCountPropertyChanged));
    return ListViewGridLayout;
})(ListViewLinearLayout);
exports.ListViewGridLayout = ListViewGridLayout;
var ListViewStaggeredLayout = (function (_super) {
    __extends(ListViewStaggeredLayout, _super);
    function ListViewStaggeredLayout() {
        _super.apply(this, arguments);
    }
    ListViewStaggeredLayout.prototype.getLayoutManager = function () {
        return new android.support.v7.widget.StaggeredGridLayoutManager(this._owner._context);
    };
    return ListViewStaggeredLayout;
})(ListViewGridLayout);
exports.ListViewStaggeredLayout = ListViewStaggeredLayout;
