var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/tab-view/tab-view-common");
var view = require("ui/core/view");
var trace = require("trace");
var imageSource = require("image-source");
var types = require("utils/types");
var app = require("application");
var VIEWS_STATES = "_viewStates";
var RESOURCE_PREFIX = "res://";
require("utils/module-merge").merge(common, exports);
var ViewPagerClass = (function (_super) {
    __extends(ViewPagerClass, _super);
    function ViewPagerClass(ctx, owner) {
        _super.call(this, ctx);
        this.owner = owner;
        return global.__native(this);
    }
    ViewPagerClass.prototype.onVisibilityChanged = function (changedView, visibility) {
        _super.prototype.onVisibilityChanged.call(this, changedView, visibility);
        this.owner._onVisibilityChanged(changedView, visibility);
    };
    return ViewPagerClass;
})(android.support.v4.view.ViewPager);
;
var PagerAdapterClass = (function (_super) {
    __extends(PagerAdapterClass, _super);
    function PagerAdapterClass(owner, items) {
        _super.call(this);
        this.owner = owner;
        this.items = items;
        return global.__native(this);
    }
    PagerAdapterClass.prototype.getCount = function () {
        return this.items ? this.items.length : 0;
    };
    PagerAdapterClass.prototype.getPageTitle = function (index) {
        if (index < 0 || index >= this.items.length) {
            return "";
        }
        return this.items[index].title;
    };
    PagerAdapterClass.prototype.instantiateItem = function (container, index) {
        trace.write("TabView.PagerAdapter.instantiateItem; container: " + container + "; index: " + index, common.traceCategory);
        var item = this.items[index];
        if (item.view.parent !== this.owner) {
            this.owner._addView(item.view);
        }
        if (this[VIEWS_STATES]) {
            trace.write("TabView.PagerAdapter.instantiateItem; restoreHierarchyState: " + item.view, common.traceCategory);
            item.view.android.restoreHierarchyState(this[VIEWS_STATES]);
        }
        container.addView(item.view.android);
        return item.view.android;
    };
    PagerAdapterClass.prototype.destroyItem = function (container, index, _object) {
        trace.write("TabView.PagerAdapter.destroyItem; container: " + container + "; index: " + index + "; _object: " + _object, common.traceCategory);
        var item = this.items[index];
        var nativeView = item.view.android;
        if (nativeView.toString() !== _object.toString()) {
            throw new Error("Expected " + nativeView.toString() + " to equal " + _object.toString());
        }
        if (!this[VIEWS_STATES]) {
            this[VIEWS_STATES] = new android.util.SparseArray();
        }
        nativeView.saveHierarchyState(this[VIEWS_STATES]);
        container.removeView(nativeView);
        if (item.view.parent === this.owner) {
            this.owner._removeView(item.view);
        }
    };
    PagerAdapterClass.prototype.isViewFromObject = function (view, _object) {
        return view === _object;
    };
    PagerAdapterClass.prototype.saveState = function () {
        trace.write("TabView.PagerAdapter.saveState", common.traceCategory);
        var owner = this.owner;
        if (!owner || owner._childrenCount === 0) {
            return null;
        }
        if (!this[VIEWS_STATES]) {
            this[VIEWS_STATES] = new android.util.SparseArray();
        }
        var viewStates = this[VIEWS_STATES];
        var childCallback = function (view) {
            var nativeView = view.android;
            if (nativeView && nativeView.isSaveFromParentEnabled && nativeView.isSaveFromParentEnabled()) {
                nativeView.saveHierarchyState(viewStates);
            }
            return true;
        };
        owner._eachChildView(childCallback);
        var bundle = new android.os.Bundle();
        bundle.putSparseParcelableArray(VIEWS_STATES, viewStates);
        return bundle;
    };
    PagerAdapterClass.prototype.restoreState = function (state, loader) {
        trace.write("TabView.PagerAdapter.restoreState", common.traceCategory);
        var bundle = state;
        bundle.setClassLoader(loader);
        this[VIEWS_STATES] = bundle.getSparseParcelableArray(VIEWS_STATES);
    };
    return PagerAdapterClass;
})(android.support.v4.view.PagerAdapter);
;
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.call(this);
        this._listenersSuspended = false;
        this._tabsAddedByMe = new Array();
        this._tabsCache = {};
        this._iconsCache = {};
        var that = new WeakRef(this);
        this._tabListener = new android.app.ActionBar.TabListener({
            get owner() {
                return that.get();
            },
            onTabSelected: function (tab, transaction) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (owner._listenersSuspended || !owner.isLoaded) {
                    return;
                }
                var index = owner._tabsCache[tab.hashCode()];
                trace.write("TabView.TabListener.onTabSelected(" + index + ");", common.traceCategory);
                owner.selectedIndex = index;
            },
            onTabUnselected: function (tab, transaction) {
            },
            onTabReselected: function (tab, transaction) {
            }
        });
        this._pageChangeListener = new android.support.v4.view.ViewPager.OnPageChangeListener({
            get owner() {
                return that.get();
            },
            onPageSelected: function (index) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (owner._listenersSuspended || !owner.isLoaded) {
                    return;
                }
                trace.write("TabView.OnPageChangeListener.onPageSelected(" + index + ");", common.traceCategory);
                owner.selectedIndex = index;
            },
            onPageScrollStateChanged: function (state) {
            },
            onPageScrolled: function (index, offset, offsetPixels) {
            }
        });
    }
    Object.defineProperty(TabView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._createUI = function () {
        trace.write("TabView._createUI(" + this._android + ");", common.traceCategory);
        this._android = new ViewPagerClass(this._context, this);
        if (!this._androidViewId) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);
        this._android.setOnPageChangeListener(this._pageChangeListener);
    };
    TabView.prototype._onVisibilityChanged = function (changedView, visibility) {
        trace.write("TabView._onVisibilityChanged:" + this.android + " isShown():" + this.android.isShown(), common.traceCategory);
        if (this.isLoaded && this.android && this.android.isShown()) {
            this._setAdapterIfNeeded();
            this._addTabsIfNeeded();
            this._setNativeSelectedIndex(this.selectedIndex);
        }
        else {
            if (TabView._isProxyOfOrDescendantOfNativeView(this, changedView)) {
                this._removeTabsIfNeeded();
            }
        }
    };
    TabView._isProxyOfOrDescendantOfNativeView = function (view, nativeView) {
        if (view.android === nativeView) {
            return true;
        }
        if (!view.parent) {
            return false;
        }
        return TabView._isProxyOfOrDescendantOfNativeView(view.parent, nativeView);
    };
    TabView.prototype._onAttached = function (context) {
        trace.write("TabView._onAttached(" + context + ");", common.traceCategory);
        _super.prototype._onAttached.call(this, context);
    };
    TabView.prototype._onDetached = function (force) {
        trace.write("TabView._onDetached(" + force + ");", common.traceCategory);
        _super.prototype._onDetached.call(this, force);
    };
    TabView.prototype.onLoaded = function () {
        trace.write("TabView.onLoaded(); selectedIndex: " + this.selectedIndex + "; items: " + this.items + ";", common.traceCategory);
        _super.prototype.onLoaded.call(this);
        if (this.android && this.android.isShown()) {
            this._setAdapterIfNeeded();
            this._addTabsIfNeeded();
            this._setNativeSelectedIndex(this.selectedIndex);
        }
    };
    TabView.prototype.onUnloaded = function () {
        trace.write("TabView.onUnloaded();", common.traceCategory);
        this._removeTabsIfNeeded();
        this._unsetAdapter();
        _super.prototype.onUnloaded.call(this);
    };
    TabView.prototype._addTabsIfNeeded = function () {
        if (this.items && this.items.length > 0 && this._tabsAddedByMe.length === 0) {
            this._listenersSuspended = true;
            this._addTabs(this.items);
            this._listenersSuspended = false;
        }
    };
    TabView.prototype._removeTabsIfNeeded = function () {
        if (this._tabsAddedByMe.length > 0) {
            this._listenersSuspended = true;
            this._removeTabs(this.items);
            this._listenersSuspended = false;
        }
    };
    TabView.prototype._onItemsPropertyChangedSetNativeValue = function (data) {
        trace.write("TabView._onItemsPropertyChangedSetNativeValue(" + data.oldValue + " ---> " + data.newValue + ");", common.traceCategory);
        this._listenersSuspended = true;
        if (data.oldValue) {
            this._removeTabs(data.oldValue);
            this._unsetAdapter();
        }
        if (data.newValue) {
            this._addTabs(data.newValue);
            this._setAdapter(data.newValue);
        }
        this._updateSelectedIndexOnItemsPropertyChanged(data.newValue);
        this._listenersSuspended = false;
    };
    TabView.prototype._setAdapterIfNeeded = function () {
        if (!this._pagerAdapter && this.items && this.items.length > 0) {
            this._setAdapter(this.items);
        }
    };
    TabView.prototype._setAdapter = function (items) {
        this._pagerAdapter = new PagerAdapterClass(this, items);
        this._android.setAdapter(this._pagerAdapter);
    };
    TabView.prototype._unsetAdapter = function () {
        if (this._pagerAdapter) {
            this._android.setAdapter(null);
            this._pagerAdapter = null;
        }
    };
    TabView.prototype._addTabs = function (newItems) {
        var parentPage = view.getAncestor(this, "Page");
        if (parentPage && parentPage.actionBarHidden) {
            return;
        }
        trace.write("TabView._addTabs(" + newItems + ");", common.traceCategory);
        _super.prototype._addTabs.call(this, newItems);
        var actionBar = this._getActionBar();
        if (!actionBar) {
            return;
        }
        if (this._tabsAddedByMe.length > 0) {
            throw new Error("TabView has already added its tabs to the ActionBar.");
        }
        this._originalActionBarNavigationMode = actionBar.getNavigationMode();
        actionBar.setNavigationMode(android.app.ActionBar.NAVIGATION_MODE_TABS);
        this._originalActionBarIsShowing = actionBar.isShowing();
        actionBar.show();
        var i = 0;
        var length = newItems.length;
        var item;
        var tab;
        var androidApp = app.android;
        var resources = androidApp.context.getResources();
        for (i; i < length; i++) {
            item = newItems[i];
            tab = actionBar.newTab();
            tab.setText(item.title);
            this._setIcon(item.iconSource, tab, resources, androidApp.packageName);
            tab.setTabListener(this._tabListener);
            actionBar.addTab(tab);
            this._tabsCache[tab.hashCode()] = i;
            this._tabsAddedByMe.push(tab);
        }
    };
    TabView.prototype._setIcon = function (iconSource, tab, resources, packageName) {
        if (!iconSource) {
            return;
        }
        if (iconSource.indexOf(RESOURCE_PREFIX) === 0 && resources) {
            var resourceId = resources.getIdentifier(iconSource.substr(RESOURCE_PREFIX.length), 'drawable', packageName);
            if (resourceId > 0) {
                tab.setIcon(resourceId);
            }
        }
        else {
            var drawable;
            drawable = this._iconsCache[iconSource];
            if (!drawable) {
                var is = imageSource.fromFileOrResource(iconSource);
                if (is) {
                    drawable = new android.graphics.drawable.BitmapDrawable(is.android);
                    this._iconsCache[iconSource] = drawable;
                }
            }
            if (drawable) {
                tab.setIcon(drawable);
            }
        }
    };
    TabView.prototype._removeTabs = function (oldItems) {
        var parentPage = view.getAncestor(this, "Page");
        if (parentPage && parentPage.actionBarHidden) {
            return;
        }
        trace.write("TabView._removeTabs(" + oldItems + ");", common.traceCategory);
        _super.prototype._removeTabs.call(this, oldItems);
        var actionBar = this._getActionBar();
        if (!actionBar) {
            return;
        }
        var i = actionBar.getTabCount() - 1;
        var tab;
        var index;
        for (i; i >= 0; i--) {
            tab = actionBar.getTabAt(i);
            index = this._tabsAddedByMe.indexOf(tab);
            if (index > -1) {
                actionBar.removeTabAt(i);
                tab.setTabListener(null);
                delete this._tabsCache[tab.hashCode()];
                this._tabsAddedByMe.splice(index, 1);
            }
        }
        if (this._tabsAddedByMe.length > 0) {
            throw new Error("TabView did not remove all of its tabs from the ActionBar.");
        }
        if (this._originalActionBarNavigationMode !== undefined) {
            actionBar.setNavigationMode(this._originalActionBarNavigationMode);
        }
        if (!this._originalActionBarIsShowing) {
            actionBar.hide();
        }
    };
    TabView.prototype._onSelectedIndexPropertyChangedSetNativeValue = function (data) {
        trace.write("TabView._onSelectedIndexPropertyChangedSetNativeValue(" + data.oldValue + " ---> " + data.newValue + ");", common.traceCategory);
        _super.prototype._onSelectedIndexPropertyChangedSetNativeValue.call(this, data);
        this._setNativeSelectedIndex(data.newValue);
        var args = { eventName: TabView.selectedIndexChangedEvent, object: this, oldIndex: data.oldValue, newIndex: data.newValue };
        this.notify(args);
    };
    TabView.prototype._setNativeSelectedIndex = function (index) {
        if (types.isNullOrUndefined(index)) {
            return;
        }
        var actionBar = this._getActionBar();
        if (actionBar && index < actionBar.getNavigationItemCount() && index !== actionBar.getSelectedNavigationIndex()) {
            trace.write("TabView actionBar.setSelectedNavigationItem(" + index + ")", common.traceCategory);
            actionBar.setSelectedNavigationItem(index);
        }
        var viewPagerSelectedIndex = this._android.getCurrentItem();
        if (viewPagerSelectedIndex !== index) {
            trace.write("TabView this._android.setCurrentItem(" + index + ", true);", common.traceCategory);
            this._android.setCurrentItem(index, true);
        }
    };
    TabView.prototype._loadEachChildView = function () {
    };
    TabView.prototype._unloadEachChildView = function () {
    };
    TabView.prototype._getActionBar = function () {
        if (!this._android) {
            return undefined;
        }
        var activity = this._android.getContext();
        return activity.getActionBar();
    };
    return TabView;
})(common.TabView);
exports.TabView = TabView;
