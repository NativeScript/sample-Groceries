var common = require("ui/segmented-bar/segmented-bar-common");
var types = require("utils/types");
global.moduleMerge(common, exports);
function onSelectedIndexPropertyChanged(data) {
    var view = data.object;
    if (!view.android || !view.items) {
        return;
    }
    var index = data.newValue;
    if (types.isNumber(index)) {
        if (index >= 0 && index <= view.items.length - 1) {
            view.android.setCurrentTab(index);
        }
        else {
            view.selectedIndex = undefined;
            throw new Error("selectedIndex should be between [0, items.length - 1]");
        }
    }
}
common.SegmentedBar.selectedIndexProperty.metadata.onSetNativeValue = onSelectedIndexPropertyChanged;
function onItemsPropertyChanged(data) {
    var view = data.object;
    if (!view.android) {
        return;
    }
    view.android.clearAllTabs();
    var newItems = data.newValue;
    view._adjustSelectedIndex(newItems);
    if (newItems && newItems.length) {
        for (var i = 0; i < newItems.length; i++) {
            var title = newItems[i].title;
            var tab = view.android.newTabSpec(i + "");
            tab.setIndicator(title);
            tab.setContent(new android.widget.TabHost.TabContentFactory({
                createTabContent: function (tag) {
                    var tv = new android.widget.TextView(view._context);
                    tv.setVisibility(android.view.View.GONE);
                    return tv;
                }
            }));
            view.android.addTab(tab);
        }
        if (types.isNumber(view.selectedIndex) && view.android.getCurrentTab() !== view.selectedIndex) {
            view.android.setCurrentTab(view.selectedIndex);
        }
        view.android.setOnTabChangedListener(null);
        view.android.setOnTabChangedListener(view._listener);
        var tabHost = view.android;
        var tabIndex;
        if (view.selectedBackgroundColor) {
            for (tabIndex = 0; tabIndex < tabHost.getTabWidget().getTabCount(); tabIndex++) {
                var vg = tabHost.getTabWidget().getChildTabViewAt(tabIndex);
                var stateDrawable = new android.graphics.drawable.StateListDrawable();
                var arr = java.lang.reflect.Array.newInstance(java.lang.Integer.class.getField("TYPE").get(null), 1);
                arr[0] = android.R.attr.state_selected;
                var colorDrawable = new SegmentedBarColorDrawable(view.selectedBackgroundColor.android);
                stateDrawable.addState(arr, colorDrawable);
                stateDrawable.setBounds(0, 15, vg.getRight(), vg.getBottom());
                vg.setBackgroundDrawable(stateDrawable);
            }
        }
        for (tabIndex = 0; tabIndex < tabHost.getTabWidget().getTabCount(); tabIndex++) {
            var tabChild = tabHost.getTabWidget().getChildTabViewAt(tabIndex);
            var t = tabChild.getChildAt(1);
            if (view.color) {
                t.setTextColor(view.color.android);
            }
        }
    }
}
common.SegmentedBar.itemsProperty.metadata.onSetNativeValue = onItemsPropertyChanged;
var SegmentedBarColorDrawable = (function (_super) {
    __extends(SegmentedBarColorDrawable, _super);
    function SegmentedBarColorDrawable(arg) {
        _super.call(this, arg);
        return global.__native(this);
    }
    SegmentedBarColorDrawable.prototype.draw = function (canvas) {
        var p = new android.graphics.Paint();
        p.setColor(this.getColor());
        p.setStyle(android.graphics.Paint.Style.FILL);
        canvas.drawRect(0, this.getBounds().height() - 15, this.getBounds().width(), this.getBounds().height(), p);
    };
    return SegmentedBarColorDrawable;
})(android.graphics.drawable.ColorDrawable);
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        _super.apply(this, arguments);
    }
    SegmentedBar.prototype._createUI = function () {
        this._android = new OurTabHost(this._context, null);
        if (types.isNumber(this.selectedIndex) && this._android.getCurrentTab() !== this.selectedIndex) {
            this._android.setCurrentTab(this.selectedIndex);
        }
        var that = new WeakRef(this);
        this._listener = new android.widget.TabHost.OnTabChangeListener({
            onTabChanged: function (id) {
                var bar = that.get();
                if (bar) {
                    var oldIndex = bar.selectedIndex;
                    var newIndex = parseInt(id);
                    if (oldIndex !== newIndex) {
                        bar._onPropertyChangedFromNative(SegmentedBar.selectedIndexProperty, newIndex);
                    }
                }
            }
        });
        var tabHostLayout = new android.widget.LinearLayout(this._context);
        tabHostLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
        var tabWidget = new android.widget.TabWidget(this._context);
        tabWidget.setId(android.R.id.tabs);
        tabHostLayout.addView(tabWidget);
        var frame = new android.widget.FrameLayout(this._context);
        frame.setId(android.R.id.tabcontent);
        frame.setVisibility(android.view.View.GONE);
        tabHostLayout.addView(frame);
        this._android.addView(tabHostLayout);
        this._android.setup();
    };
    Object.defineProperty(SegmentedBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBar;
})(common.SegmentedBar);
exports.SegmentedBar = SegmentedBar;
var OurTabHost = (function (_super) {
    __extends(OurTabHost, _super);
    function OurTabHost(context, attrs) {
        _super.call(this, context, attrs);
        return global.__native(this);
    }
    OurTabHost.prototype.onAttachedToWindow = function () {
    };
    return OurTabHost;
})(android.widget.TabHost);
