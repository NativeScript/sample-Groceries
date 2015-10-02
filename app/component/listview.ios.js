var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var viewModule = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var commonModule = require("./listview-common");
var utilsModule = require("utils/utils");
var builder = require("ui/builder");
var proxyModule = require("ui/core/proxy");
var infinity = utilsModule.layout.makeMeasureSpec(0, utilsModule.layout.UNSPECIFIED);
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
    knownTemplates.itemSwipeTemplate = "itemSwipeTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var ListViewLayoutBase = (function (_super) {
    __extends(ListViewLayoutBase, _super);
    function ListViewLayoutBase() {
        _super.call(this);
    }
    Object.defineProperty(ListViewLayoutBase.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.prototype.onScrollDirectionChanged = function (data) {
        if (data.newValue) {
            this.ios.scrollDirection = (data.newValue === commonModule.ListViewScrollDirection.Horizontal) ?
                TKListViewScrollDirection.TKListViewScrollDirectionHorizontal :
                TKListViewScrollDirection.TKListViewScrollDirectionVertical;
        }
    };
    ListViewLayoutBase.prototype.onItemInsertAnimationChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        switch (commonModule.ListViewItemAnimation[data.newValue]) {
            case commonModule.ListViewItemAnimation.Fade: {
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationFade;
                break;
            }
            case commonModule.ListViewItemAnimation.Scale: {
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationScale;
                break;
            }
            case commonModule.ListViewItemAnimation.Slide: {
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationSlide;
                break;
            }
            default:
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationDefault;
        }
    };
    ListViewLayoutBase.prototype.onItemDeleteAnimationChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        switch (commonModule.ListViewItemAnimation[data.newValue]) {
            case commonModule.ListViewItemAnimation.Fade: {
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationFade;
                break;
            }
            case commonModule.ListViewItemAnimation.Scale: {
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationScale;
                break;
            }
            case commonModule.ListViewItemAnimation.Slide: {
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationSlide;
                break;
            }
            default:
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationDefault;
        }
    };
    ListViewLayoutBase.prototype.onItemAppearAnimationChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        switch (commonModule.ListViewItemAnimation[data.newValue]) {
            case commonModule.ListViewItemAnimation.Fade: {
                this.ios.itemAppearAnimation = TKListViewItemAnimation.TKListViewItemAnimationFade;
                break;
            }
            case commonModule.ListViewItemAnimation.Scale: {
                this.ios.itemAppearAnimation = TKListViewItemAnimation.TKListViewItemAnimationScale;
                break;
            }
            case commonModule.ListViewItemAnimation.Slide: {
                this.ios.itemAppearAnimation = TKListViewItemAnimation.TKListViewItemAnimationSlide;
                break;
            }
            default:
                this.ios.itemAppearAnimation = TKListViewItemAnimation.TKListViewItemAnimationDefault;
        }
    };
    ListViewLayoutBase.prototype.onAnimationDurationChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.ios.animationDuration = data.newValue;
        }
    };
    ListViewLayoutBase.prototype.onItemAlignmentChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        switch (commonModule.ListViewItemAlignment[data.newValue]) {
            case commonModule.ListViewItemAlignment.Center: {
                this.ios.itemAlignment = TKListViewItemAlignment.TKListViewItemAlignmentCenter;
                break;
            }
            case commonModule.ListViewItemAlignment.Left: {
                this.ios.itemAlignment = TKListViewItemAlignment.TKListViewItemAlignmentLeft;
                break;
            }
            case commonModule.ListViewItemAlignment.Right: {
                this.ios.itemAlignment = TKListViewItemAlignment.TKListViewItemAlignmentRight;
                break;
            }
            case commonModule.ListViewItemAlignment.Stretch: {
                this.ios.itemAlignment = TKListViewItemAlignment.TKListViewItemAlignmentStretch;
                break;
            }
        }
    };
    ListViewLayoutBase.prototype.onItemSpacingChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.ios.itemSpacing = data.newValue;
        }
    };
    ListViewLayoutBase.prototype.onItemWidthChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this._itemWidth = data.newValue;
            this.updateItemSize();
        }
    };
    ListViewLayoutBase.prototype.onItemHeightChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this._itemHeight = data.newValue;
            this.updateItemSize();
        }
    };
    ListViewLayoutBase.prototype.updateItemSize = function () {
        if (this._itemWidth && this._itemHeight) {
            this.ios.itemSize = CGSizeMake(this._itemWidth, this._itemHeight);
        }
    };
    return ListViewLayoutBase;
})(commonModule.ListViewLayoutBase);
exports.ListViewLayoutBase = ListViewLayoutBase;
var ListViewLinearLayout = (function (_super) {
    __extends(ListViewLinearLayout, _super);
    function ListViewLinearLayout() {
        _super.call(this);
        this._ios = TKListViewLinearLayout.new();
    }
    return ListViewLinearLayout;
})(ListViewLayoutBase);
exports.ListViewLinearLayout = ListViewLinearLayout;
var ListViewGridLayout = (function (_super) {
    __extends(ListViewGridLayout, _super);
    function ListViewGridLayout() {
        _super.call(this);
        this._ios = TKListViewGridLayout.new();
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
        if (!isNaN(+data.newValue)) {
            this.ios.spanCount = data.newValue;
        }
    };
    Object.defineProperty(ListViewGridLayout.prototype, "lineSpacing", {
        get: function () {
            return this._getValue(ListViewGridLayout.spanCountProperty);
        },
        set: function (value) {
            this._setValue(ListViewGridLayout.lineSpacingProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewGridLayout.onLineSpacingPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onLineSpacingChanged(data);
    };
    ListViewGridLayout.prototype.onLineSpacingChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.ios.lineSpacing = data.newValue;
        }
    };
    ListViewGridLayout.spanCountProperty = new dependencyObservable.Property("spanCount", "ListViewGridLayout", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewGridLayout.onSpanCountPropertyChanged));
    ListViewGridLayout.lineSpacingProperty = new dependencyObservable.Property("lineSpacing", "ListViewGridLayout", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewGridLayout.onLineSpacingPropertyChanged));
    return ListViewGridLayout;
})(ListViewLayoutBase);
exports.ListViewGridLayout = ListViewGridLayout;
var ListViewStaggeredLayout = (function (_super) {
    __extends(ListViewStaggeredLayout, _super);
    function ListViewStaggeredLayout() {
        _super.call(this);
        this._ios = TKListViewStaggeredLayout.new();
    }
    return ListViewStaggeredLayout;
})(ListViewGridLayout);
exports.ListViewStaggeredLayout = ListViewStaggeredLayout;
var TKListViewDelegateImpl = (function (_super) {
    __extends(TKListViewDelegateImpl, _super);
    function TKListViewDelegateImpl() {
        _super.apply(this, arguments);
    }
    TKListViewDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    TKListViewDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    TKListViewDelegateImpl.prototype.listViewShouldHighlightItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.shouldHighlightItemEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewDidHighlightItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didHighlightItemEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidUnhighlightItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didUnhighlightItemEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewShouldSelectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.shouldSelectItemEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewShouldDeselectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.shouldDeselectItemEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewDidSelectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.itemTapEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidDeselectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didDeselectItemEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidReorderItemFromIndexPathToIndexPath = function (listView, originalIndexPath, targetIndexPath) {
        if (!listView || !originalIndexPath || !targetIndexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didReorderItemEvent, object: this._owner, itemIndex: originalIndexPath.row, groupIndex: originalIndexPath.section,
            data: { targetIndex: targetIndexPath.row, targetGroupIndex: targetIndexPath.section } };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewShouldSwipeCellAtIndexPath = function (listView, cell, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.shouldSwipeCellEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewDidSwipeCellAtIndexPathWithOffset = function (listView, cell, indexPath, offset) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didSwipeCellEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, data: offset };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidFinishSwipeCellAtIndexPathWithOffset = function (listView, cell, indexPath, offset) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didFinishSwipeCellEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, data: offset };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidPullWithOffset = function (listView, offset) {
        var args = { eventName: commonModule.ListView.didPullEvent, object: this._owner, data: offset };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidLongPressCellAtIndexPath = function (listView, cell, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.didLongPressCellEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewShouldLoadMoreDataAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.ListView.shouldLoadMoreDataEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewShouldRefreshOnPull = function (listView) {
        var args = { eventName: commonModule.ListView.shouldRefreshOnPullEvent, object: this._owner, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.ObjCProtocols = [TKListViewDelegate];
    return TKListViewDelegateImpl;
})(NSObject);
var TKListViewDataSourceImpl = (function (_super) {
    __extends(TKListViewDataSourceImpl, _super);
    function TKListViewDataSourceImpl() {
        _super.apply(this, arguments);
    }
    TKListViewDataSourceImpl.new = function () {
        return _super.new.call(this);
    };
    TKListViewDataSourceImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    TKListViewDataSourceImpl.prototype.listViewNumberOfItemsInSection = function (listView, section) {
        return this._owner.items ? this._owner.items.length : 0;
    };
    TKListViewDataSourceImpl.prototype.listViewCellForItemAtIndexPath = function (listView, indexPath) {
        var cell = listView.dequeueReusableCellWithReuseIdentifierForIndexPath(NSString.stringWithCString("defaultCell"), indexPath);
        this._owner.prepareCell(cell, indexPath);
        var cellView = cell.view.itemView;
        if (cellView) {
            var cellWidth = this._owner.listViewLayout.itemWidth ? this._owner.listViewLayout.itemWidth : utilsModule.layout.getMeasureSpecSize(this._owner.getMeasuredWidth());
            var cellHeight = this._owner.listViewLayout.itemHeight ? this._owner.listViewLayout.itemHeight : this._owner.getHeightForCell(indexPath.row);
            viewModule.View.layoutChild(this._owner, cellView, 0, 0, cellWidth, cellHeight);
        }
        var backgroundView = cell.view.itemSwipeView;
        if (backgroundView) {
            var cellWidth = this._owner.listViewLayout.itemWidth ? this._owner.listViewLayout.itemWidth : utilsModule.layout.getMeasureSpecSize(this._owner.getMeasuredWidth());
            var cellHeight = this._owner.listViewLayout.itemHeight ? this._owner.listViewLayout.itemHeight : this._owner.getHeightForCell(indexPath.row);
            viewModule.View.layoutChild(this._owner, backgroundView, 0, 0, cellWidth, cellHeight);
        }
        return cell;
    };
    TKListViewDataSourceImpl.prototype.numberOfSectionsInListView = function (listView) {
        return 1;
    };
    TKListViewDataSourceImpl.prototype.listViewViewForSupplementaryElementOfKindAtIndexPath = function (listView, kind, indexPath) {
        return null;
    };
    TKListViewDataSourceImpl.ObjCProtocols = [TKListViewDataSource];
    return TKListViewDataSourceImpl;
})(NSObject);
var ListViewCell = (function (_super) {
    __extends(ListViewCell, _super);
    function ListViewCell() {
        _super.apply(this, arguments);
    }
    ListViewCell.new = function () {
        return _super.new.call(this);
    };
    ListViewCell.class = function () {
        return ListViewCell;
    };
    return ListViewCell;
})(TKListViewCell);
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.call(this);
        this._preparingCell = false;
        this.widthMeasureSpec = 0;
        console.log("ListView::constructor");
        this._heights = new Array();
        this._ios = TKListView.new();
        this._ios.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
        this._ios.cellSwipeLimits = UIEdgeInsetsFromString("{0, 60, 0, 180}");
        this._ios.cellSwipeTreshold = 30;
        this._delegate = TKListViewDelegateImpl.new().initWithOwner(this);
        this._dataSource = TKListViewDataSourceImpl.new().initWithOwner(this);
        this._ios.dataSource = this._dataSource;
        this._ios.registerClassForCellWithReuseIdentifier(ListViewCell.class(), "defaultCell");
    }
    Object.defineProperty(ListView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.getHeightForCell = function (index) {
        return this._heights[index];
    };
    ListView.prototype.setHeightForCell = function (index, value) {
        this._heights[index] = value;
    };
    ListView.prototype.onListViewLayoutChanged = function (data) {
        this.ios.layout = data.newValue.ios;
    };
    ListView.prototype.onItemTemplateChanged = function (data) {
        if (!data.newValue) {
            return;
        }
    };
    ListView.prototype.onItemSwipeTemplateChanged = function (data) {
        if (!data.newValue) {
            return;
        }
    };
    ListView.prototype.onMultipleSelectionChanged = function (data) {
        this.ios.allowsMultipleSelection = (data.newValue ? true : false);
    };
    ListView.prototype.onCellReorderChanged = function (data) {
        this.ios.allowsCellReorder = (data.newValue ? true : false);
    };
    ListView.prototype.onSwipeCellsChanged = function (data) {
        this.ios.allowsCellSwipe = (data.newValue ? true : false);
        ;
    };
    ListView.prototype.onPullToRefreshChanged = function (data) {
        this.ios.allowsPullToRefresh = (data.newValue ? true : false);
        ;
    };
    ListView.prototype.onLoadOnDemandModeChanged = function (data) {
        if (data.newValue) {
            if (commonModule.ListViewLoadOnDemandMode.Auto === data.newValue) {
                this.ios.loadOnDemandMode = TKListViewLoadOnDemandMode.TKListViewLoadOnDemandModeAuto;
            }
            else if (commonModule.ListViewLoadOnDemandMode.Manual === data.newValue) {
                this.ios.loadOnDemandMode = TKListViewLoadOnDemandMode.TKListViewLoadOnDemandModeManual;
            }
            else
                this.ios.loadOnDemandMode = TKListViewLoadOnDemandMode.TKListViewLoadOnDemandModeNone;
        }
    };
    ListView.prototype.onLoadOnDemandBufferSizeChanged = function (data) {
        if (data.newValue) {
            this.ios.loadOnDemandBufferSize = data.newValue;
        }
    };
    ListView.prototype.onSelectionBehaviorChanged = function (data) {
        if (data.newValue) {
            if (commonModule.ListViewSelectionBehavior.Press === data.newValue) {
                this.ios.selectionBehavior = TKListViewSelectionBehavior.TKListViewSelectionBehaviorPress;
            }
            else if (commonModule.ListViewSelectionBehavior.LongPress === data.newValue) {
                this.ios.selectionBehavior = TKListViewSelectionBehavior.TKListViewSelectionBehaviorLongPress;
            }
            else
                this.ios.selectionBehavior = TKListViewSelectionBehavior.TKListViewSelectionBehaviorNone;
        }
    };
    ListView.prototype.getDataItem = function (index) {
        return this.items.getItem ? this.items.getItem(index) : this.items[index];
    };
    ListView.prototype.prepareItem = function (item, index) {
        if (item) {
            item.bindingContext = this.getDataItem(index);
            item._inheritProperties(this);
        }
    };
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
    ListView.prototype.scrollToIndex = function (index) {
        if (this._ios) {
            this._ios.scrollToItemAtIndexPathAtScrollPositionAnimated(NSIndexPath.indexPathForItemInSection(index, 0), UICollectionViewScrollPosition.UICollectionViewScrollPositionTop, false);
        }
    };
    ListView.prototype.didRefreshOnPull = function () {
        this.ios.didRefreshOnPull();
    };
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
    ListView.prototype.requestLayout = function () {
        if (!this._preparingCell) {
            _super.prototype.requestLayout.call(this);
        }
    };
    ListView.prototype._layoutCell = function (cellView, indexPath) {
        if (cellView) {
            var measuredSize = viewModule.View.measureChild(this, cellView, this.widthMeasureSpec, infinity);
            var height = measuredSize.measuredHeight;
            this.setHeightForCell(indexPath.row, height);
            return height;
        }
        return 0;
    };
    ListView.prototype.getItemTemplateContent = function () {
        var cellViews = new Object();
        if (this.itemTemplate && this.items) {
            cellViews.itemView = builder.parse(this.itemTemplate, this);
        }
        if (this.itemSwipeTemplate && this.items) {
            cellViews.itemSwipeView = builder.parse(this.itemSwipeTemplate, this);
        }
        return cellViews;
    };
    ListView.prototype.prepareCell = function (tableCell, indexPath) {
        var cell = tableCell;
        var cellHeight = 20;
        try {
            this._preparingCell = true;
            cell.view = this.getItemTemplateContent();
            var args = { eventName: commonModule.ListView.itemLoadingEvent, object: this, index: indexPath.row, view: cell.view, ios: cell, android: undefined };
            this.notify(args);
            cell.view = args.view;
            if (cell.view.itemView && !cell.view.itemView.parent) {
                if (cell.myContentView) {
                    cell.myContentView.ios.removeFromSuperview();
                    cell.myContentView = null;
                }
                cell.myContentView = cell.view.itemView;
                if (cell.contentView.subviews && cell.contentView.subviews.count > 0) {
                    cell.contentView.insertSubviewBelowSubview(cell.view.itemView.ios, cell.contentView.subviews.objectAtIndex(0));
                }
                else {
                    cell.contentView.addSubview(cell.view.itemView.ios);
                }
                this._addView(cell.view.itemView);
            }
            this.prepareItem(cell.view.itemView, indexPath.row);
            cellHeight = this._layoutCell(cell.view.itemView, indexPath);
            if (cell.view.itemSwipeView && !cell.view.itemSwipeView.parent) {
                if (cell.myBackgroundView) {
                    cell.myBackgroundView.ios.removeFromSuperview();
                    cell.myBackgroundView = null;
                }
                cell.myBackgroundView = cell.view.itemSwipeView;
                cell.swipeBackgroundView.addSubview(cell.view.itemSwipeView.ios);
                this._addView(cell.view.itemSwipeView);
            }
            this.prepareItem(cell.view.itemSwipeView, indexPath.row);
            cellHeight = this._layoutCell(cell.view.itemSwipeView, indexPath);
        }
        finally {
            this._preparingCell = false;
        }
        return cellHeight;
    };
    return ListView;
})(commonModule.ListView);
exports.ListView = ListView;
