var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
var dependencyObservable = require("ui/core/dependency-observable");
var builder = require("ui/builder");
var label = require("ui/label");
var color = require("color");
var weakEvents = require("ui/core/weak-event-listener");
var ITEMS = "items";
var ITEMTEMPLATE = "itemTemplate";
var ISSCROLLING = "isScrolling";
var LISTVIEW = "ListView";
var SEPARATORCOLOR = "separatorColor";
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
function onItemsPropertyChanged(data) {
    var listView = data.object;
    listView._onItemsPropertyChanged(data);
}
function onItemTemplatePropertyChanged(data) {
    var listView = data.object;
    listView.refresh();
}
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.apply(this, arguments);
    }
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
    Object.defineProperty(ListView.prototype, "isScrolling", {
        get: function () {
            return this._getValue(ListView.isScrollingProperty);
        },
        set: function (value) {
            this._setValue(ListView.isScrollingProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "separatorColor", {
        get: function () {
            return this._getValue(ListView.separatorColorProperty);
        },
        set: function (value) {
            this._setValue(ListView.separatorColorProperty, value instanceof color.Color ? value : new color.Color(value));
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
    };
    ListView.prototype._getItemTemplateContent = function (index) {
        var v;
        if (this.itemTemplate && this.items) {
            v = builder.parse(this.itemTemplate, this);
        }
        return v;
    };
    ListView.prototype._prepareItem = function (item, index) {
        if (item) {
            item.bindingContext = this._getDataItem(index);
            item._inheritProperties(this);
        }
    };
    ListView.prototype._getDataItem = function (index) {
        return this.items.getItem ? this.items.getItem(index) : this.items[index];
    };
    ListView.prototype._getDefaultItemContent = function (index) {
        var lbl = new label.Label();
        lbl.bind({
            targetProperty: "text",
            sourceProperty: "$value"
        });
        return lbl;
    };
    ListView.prototype._onItemsPropertyChanged = function (data) {
        if (data.oldValue instanceof observable.Observable) {
            weakEvents.removeWeakEventListener(data.oldValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        if (data.newValue instanceof observable.Observable) {
            weakEvents.addWeakEventListener(data.newValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        this.refresh();
    };
    ListView.prototype._onItemsChanged = function (args) {
        this.refresh();
    };
    ListView.prototype._propagateInheritableProperties = function (view) {
    };
    ListView.itemLoadingEvent = "itemLoading";
    ListView.itemTapEvent = "itemTap";
    ListView.loadMoreItemsEvent = "loadMoreItems";
    ListView.separatorColorProperty = new dependencyObservable.Property(SEPARATORCOLOR, LISTVIEW, new proxy.PropertyMetadata(undefined));
    ListView.itemsProperty = new dependencyObservable.Property(ITEMS, LISTVIEW, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemsPropertyChanged));
    ListView.itemTemplateProperty = new dependencyObservable.Property(ITEMTEMPLATE, LISTVIEW, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemTemplatePropertyChanged));
    ListView.isScrollingProperty = new dependencyObservable.Property(ISSCROLLING, LISTVIEW, new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None));
    return ListView;
})(view.View);
exports.ListView = ListView;
