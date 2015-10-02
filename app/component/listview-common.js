var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var viewModule = require("ui/core/view");
var observableArray = require("data/observable-array");
var bindableModule = require("ui/core/bindable");
var dependencyObservable = require("ui/core/dependency-observable");
var proxyModule = require("ui/core/proxy");
var observableModule = require("data/observable");
var weakEvents = require("ui/core/weak-event-listener");
var ListViewScrollDirection;
(function (ListViewScrollDirection) {
    ListViewScrollDirection.Vertical = "Vertical";
    ListViewScrollDirection.Horizontal = "Horizontal";
})(ListViewScrollDirection = exports.ListViewScrollDirection || (exports.ListViewScrollDirection = {}));
var ListViewItemAlignment;
(function (ListViewItemAlignment) {
    ListViewItemAlignment.Stretch = "Stretch";
    ListViewItemAlignment.Left = "Left";
    ListViewItemAlignment.Center = "Center";
    ListViewItemAlignment.Right = "Right";
})(ListViewItemAlignment = exports.ListViewItemAlignment || (exports.ListViewItemAlignment = {}));
var ListViewItemAnimation;
(function (ListViewItemAnimation) {
    ListViewItemAnimation.Default = "Default";
    ListViewItemAnimation.Fade = "Fade";
    ListViewItemAnimation.Scale = "Scale";
    ListViewItemAnimation.Slide = "Slide";
})(ListViewItemAnimation = exports.ListViewItemAnimation || (exports.ListViewItemAnimation = {}));
var ListViewLoadOnDemandMode;
(function (ListViewLoadOnDemandMode) {
    ListViewLoadOnDemandMode.None = "None";
    ListViewLoadOnDemandMode.Manual = "Manual";
    ListViewLoadOnDemandMode.Auto = "Auto";
})(ListViewLoadOnDemandMode = exports.ListViewLoadOnDemandMode || (exports.ListViewLoadOnDemandMode = {}));
;
var ListViewSelectionBehavior;
(function (ListViewSelectionBehavior) {
    ListViewSelectionBehavior.None = "None";
    ListViewSelectionBehavior.Press = "Press";
    ListViewSelectionBehavior.LongPress = "LongPress";
})(ListViewSelectionBehavior = exports.ListViewSelectionBehavior || (exports.ListViewSelectionBehavior = {}));
;
var ListViewLayoutBase = (function (_super) {
    __extends(ListViewLayoutBase, _super);
    function ListViewLayoutBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ListViewLayoutBase.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListViewLayoutBase.prototype, "ios", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListViewLayoutBase.prototype, "scrollDirection", {
        get: function () {
            return this._getValue(ListViewLayoutBase.scrollDirectionProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.scrollDirectionProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onScrollDirectionPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onScrollDirectionChanged(data);
    };
    ListViewLayoutBase.prototype.onScrollDirectionChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemInsertAnimation", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemInsertAnimationProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemInsertAnimationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemInsertAnimationPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemInsertAnimationChanged(data);
    };
    ListViewLayoutBase.prototype.onItemInsertAnimationChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemDeleteAnimation", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemDeleteAnimationProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemDeleteAnimationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemDeleteAnimationPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemDeleteAnimationChanged(data);
    };
    ListViewLayoutBase.prototype.onItemDeleteAnimationChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemAppearAnimation", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemAppearAnimationProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemAppearAnimationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemAppearAnimationPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemAppearAnimationChanged(data);
    };
    ListViewLayoutBase.prototype.onItemAppearAnimationChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "animationDuration", {
        get: function () {
            return this._getValue(ListViewLayoutBase.animationDurationProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.animationDurationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onAnimationDurationPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onAnimationDurationChanged(data);
    };
    ListViewLayoutBase.prototype.onAnimationDurationChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemAlignment", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemAlignmentProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemAlignmentProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemAlignmentPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemAlignmentChanged(data);
    };
    ListViewLayoutBase.prototype.onItemAlignmentChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemSpacing", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemSpacingProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemSpacingProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemSpacingPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemSpacingChanged(data);
    };
    ListViewLayoutBase.prototype.onItemSpacingChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemWidth", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemWidthProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemWidthPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemWidthChanged(data);
    };
    ListViewLayoutBase.prototype.onItemWidthChanged = function (data) {
    };
    Object.defineProperty(ListViewLayoutBase.prototype, "itemHeight", {
        get: function () {
            return this._getValue(ListViewLayoutBase.itemHeightProperty);
        },
        set: function (value) {
            this._setValue(ListViewLayoutBase.itemHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.onItemHeightPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onItemHeightChanged(data);
    };
    ListViewLayoutBase.prototype.onItemHeightChanged = function (data) {
    };
    ListViewLayoutBase.scrollDirectionProperty = new dependencyObservable.Property("scrollDirection", "ListViewLayoutBase", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onScrollDirectionPropertyChanged));
    ListViewLayoutBase.itemInsertAnimationProperty = new dependencyObservable.Property("itemInsertAnimation", "ListViewLayoutBase", new proxyModule.PropertyMetadata(ListViewItemAnimation.Default, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemInsertAnimationPropertyChanged));
    ListViewLayoutBase.itemDeleteAnimationProperty = new dependencyObservable.Property("itemDeleteAnimation", "ListViewLayoutBase", new proxyModule.PropertyMetadata(ListViewItemAnimation.Default, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemDeleteAnimationPropertyChanged));
    ListViewLayoutBase.itemAppearAnimationProperty = new dependencyObservable.Property("itemAppearAnimation", "ListViewLayoutBase", new proxyModule.PropertyMetadata(ListViewItemAnimation.Default, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemAppearAnimationPropertyChanged));
    ListViewLayoutBase.animationDurationProperty = new dependencyObservable.Property("animationDuration", "ListViewLayoutBase", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListViewLayoutBase.onAnimationDurationPropertyChanged));
    ListViewLayoutBase.itemAlignmentProperty = new dependencyObservable.Property("itemAlignment", "ListViewLayoutBase", new proxyModule.PropertyMetadata(ListViewItemAlignment.Center, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemAlignmentPropertyChanged));
    ListViewLayoutBase.itemSpacingProperty = new dependencyObservable.Property("itemSpacing", "ListViewLayoutBase", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemSpacingPropertyChanged));
    ListViewLayoutBase.itemWidthProperty = new dependencyObservable.Property("itemWidth", "ListViewLayoutBase", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemWidthPropertyChanged));
    ListViewLayoutBase.itemHeightProperty = new dependencyObservable.Property("itemHeight", "ListViewLayoutBase", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewLayoutBase.onItemHeightPropertyChanged));
    return ListViewLayoutBase;
})(bindableModule.Bindable);
exports.ListViewLayoutBase = ListViewLayoutBase;
function onItemsPropertyChanged(data) {
    var listView = data.object;
    listView._onItemsPropertyChanged(data);
}
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "ios", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "listViewLayout", {
        get: function () {
            return this._getValue(ListView.listViewLayoutProperty);
        },
        set: function (value) {
            this._setValue(ListView.listViewLayoutProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "itemTemplate", {
        get: function () {
            return this._getValue(ListView.itemTemplateProperty);
        },
        set: function (value) {
            this._setValue(ListView.itemTemplateProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "itemSwipeTemplate", {
        get: function () {
            return this._getValue(ListView.itemSwipeTemplateProperty);
        },
        set: function (value) {
            this._setValue(ListView.itemSwipeTemplateProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "multipleSelection", {
        get: function () {
            return this._getValue(ListView.multipleSelectionProperty);
        },
        set: function (value) {
            this._setValue(ListView.multipleSelectionProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "cellReorder", {
        get: function () {
            return this._getValue(ListView.cellReorderProperty);
        },
        set: function (value) {
            this._setValue(ListView.cellReorderProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "swipeCells", {
        get: function () {
            return this._getValue(ListView.swipeCellsProperty);
        },
        set: function (value) {
            this._setValue(ListView.swipeCellsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "pullToRefresh", {
        get: function () {
            return this._getValue(ListView.pullToRefreshProperty);
        },
        set: function (value) {
            this._setValue(ListView.pullToRefreshProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "loadOnDemandMode", {
        get: function () {
            return this._getValue(ListView.loadOnDemandModeProperty);
        },
        set: function (value) {
            this._setValue(ListView.loadOnDemandModeProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "loadOnDemandBufferSize", {
        get: function () {
            return this._getValue(ListView.loadOnDemandBufferSizeProperty);
        },
        set: function (value) {
            this._setValue(ListView.loadOnDemandBufferSizeProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "selectionBehavior", {
        get: function () {
            return this._getValue(ListView.selectionBehaviorProperty);
        },
        set: function (value) {
            this._setValue(ListView.selectionBehaviorProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListView.onLayoutPropertyChanged = function (data) {
        var lv;
        lv = data.object;
        lv.onListViewLayoutChanged(data);
    };
    ListView.onItemTemplatePropertyChanged = function (data) {
        var lv = data.object;
        lv.onItemTemplateChanged(data);
    };
    ListView.onItemSwipeTemplatePropertyChanged = function (data) {
        var lv = data.object;
        lv.onItemTemplateChanged(data);
    };
    ListView.onMultipleSelectionPropertyChanged = function (data) {
        var lv = data.object;
        lv.onMultipleSelectionChanged(data);
    };
    ListView.onCellReorderPropertyChanged = function (data) {
        var lv = data.object;
        lv.onCellReorderChanged(data);
    };
    ListView.onSwipeCellsPropertyChanged = function (data) {
        var lv = data.object;
        lv.onSwipeCellsChanged(data);
    };
    ListView.onPullToRefreshPropertyChanged = function (data) {
        var lv = data.object;
        lv.onPullToRefreshChanged(data);
    };
    ListView.onLoadOnDemandModePropertyChanged = function (data) {
        var lv = data.object;
        lv.onLoadOnDemandModeChanged(data);
    };
    ListView.onLoadOnDemandBufferSizePropertyChanged = function (data) {
        var lv = data.object;
        lv.onLoadOnDemandBufferSizeChanged(data);
    };
    ListView.onSelectionBehaviorPropertyChanged = function (data) {
        var lv = data.object;
        lv.onSelectionBehaviorChanged(data);
    };
    ListView.prototype.onListViewLayoutChanged = function (data) {
    };
    ListView.prototype.onDataSourceChanged = function (data) {
    };
    ListView.prototype.onItemTemplateChanged = function (data) {
    };
    ListView.prototype.onItemSwipeTemplateChanged = function (data) {
    };
    ListView.prototype.onMultipleSelectionChanged = function (data) {
    };
    ListView.prototype.onCellReorderChanged = function (data) {
    };
    ListView.prototype.onSwipeCellsChanged = function (data) {
    };
    ListView.prototype.onPullToRefreshChanged = function (data) {
    };
    ListView.prototype.onLoadOnDemandModeChanged = function (data) {
    };
    ListView.prototype.onLoadOnDemandBufferSizeChanged = function (data) {
    };
    ListView.prototype.onSelectionBehaviorChanged = function (data) {
    };
    ListView.prototype._onItemsPropertyChanged = function (data) {
        var lvDataSource;
        lvDataSource = data.object;
        if (data.oldValue instanceof observableModule.Observable) {
            weakEvents.removeWeakEventListener(data.oldValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        if (data.newValue instanceof observableModule.Observable) {
            weakEvents.addWeakEventListener(data.newValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        lvDataSource._onItemsChanged(data);
    };
    ListView.prototype.onItemsChanged = function (data) {
    };
    ListView.prototype._onItemsChanged = function (args) {
        this.refresh();
    };
    Object.defineProperty(ListView.prototype, "items", {
        get: function () {
            return this._getValue(ListView.itemsProperty);
        },
        set: function (value) {
            this._setValue(ListView.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
    };
    ListView.prototype.scrollToIndex = function (index) {
    };
    ListView.prototype.didRefreshOnPull = function () {
    };
    ListView.shouldHighlightItemEvent = "shouldHighlightItem";
    ListView.didHighlightItemEvent = "didHighlightItem";
    ListView.didUnhighlightItemEvent = "didUnhighlightItem";
    ListView.shouldSelectItemEvent = "shouldSelectItem";
    ListView.shouldDeselectItemEvent = "shouldDeselectItem";
    ListView.itemTapEvent = "itemTap";
    ListView.didDeselectItemEvent = "didDeselectItem";
    ListView.didReorderItemEvent = "didReorderItem";
    ListView.shouldSwipeCellEvent = "shouldSwipeCell";
    ListView.didSwipeCellEvent = "didSwipeCell";
    ListView.didFinishSwipeCellEvent = "didFinishSwipeCell";
    ListView.didPullEvent = "didPull";
    ListView.didLongPressCellEvent = "didLongPressCell";
    ListView.shouldLoadMoreDataEvent = "shouldLoadMoreData";
    ListView.shouldRefreshOnPullEvent = "shouldRefreshOnPull";
    ListView.itemLoadingEvent = "itemLoading";
    ListView.listViewLayoutProperty = new dependencyObservable.Property("listViewLayout", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onLayoutPropertyChanged));
    ListView.itemTemplateProperty = new dependencyObservable.Property("itemTemplate", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onItemTemplatePropertyChanged));
    ListView.itemSwipeTemplateProperty = new dependencyObservable.Property("itemSwipeTemplate", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onItemSwipeTemplatePropertyChanged));
    ListView.multipleSelectionProperty = new dependencyObservable.Property("multipleSelection", "ListView", new proxyModule.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None, ListView.onMultipleSelectionPropertyChanged));
    ListView.cellReorderProperty = new dependencyObservable.Property("cellReorder", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onCellReorderPropertyChanged));
    ListView.swipeCellsProperty = new dependencyObservable.Property("swipeCells", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onSwipeCellsPropertyChanged));
    ListView.pullToRefreshProperty = new dependencyObservable.Property("pullToRefresh", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onPullToRefreshPropertyChanged));
    ListView.loadOnDemandModeProperty = new dependencyObservable.Property("loadOnDemandMode", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onLoadOnDemandModePropertyChanged));
    ListView.loadOnDemandBufferSizeProperty = new dependencyObservable.Property("loadOnDemandBufferSize", "ListView", new proxyModule.PropertyMetadata(1, dependencyObservable.PropertyMetadataSettings.None, ListView.onLoadOnDemandBufferSizePropertyChanged));
    ListView.selectionBehaviorProperty = new dependencyObservable.Property("selectionBehavior", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, ListView.onSelectionBehaviorPropertyChanged));
    ListView.itemsProperty = new dependencyObservable.Property("items", "ListView", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemsPropertyChanged));
    return ListView;
})(viewModule.View);
exports.ListView = ListView;
