var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var router_1 = require("angular2/router");
var dialogsModule = require("ui/dialogs");
var action_bar_1 = require("ui/action-bar");
var grocery_list_view_model_1 = require("../../shared/view-models/grocery-list-view-model");
var action_bar_util_1 = require("../../shared/utils/action-bar-util");
var config_1 = require("../../shared/config");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var ListPage = (function () {
    function ListPage(router) {
        var _this = this;
        this.router = router;
        this.groceryList = new grocery_list_view_model_1.GroceryListViewModel([]);
        this.grocery = "";
        this.isLoading = true;
        this.configureActionBar();
        var page = config_1.Config.page;
        var listView = page.getViewById("groceryList");
        if (page.ios) {
            swipeDelete.enable(listView, function (index) {
                _this.delete(index);
            });
        }
        this.groceryList.empty();
        this.groceryList.load().then(function () {
            _this.isLoading = false;
            listView.animate({
                opacity: 1,
                duration: 1000
            });
        });
    }
    ListPage.prototype.configureActionBar = function () {
        var _this = this;
        action_bar_util_1.ActionBarUtil.setTitle("Groceries");
        action_bar_util_1.ActionBarUtil.emptyActionBarItems();
        var logoutButton = new action_bar_1.ActionItem();
        logoutButton.text = "Logout";
        logoutButton.on("tap", function () {
            _this.router.navigate(["Login"]);
        });
        action_bar_util_1.ActionBarUtil.addButton(logoutButton);
        var shareButton = new action_bar_1.ActionItem();
        shareButton.text = "Share";
        shareButton.ios.position = "right";
        shareButton.on("tap", function () { _this.share(); });
        action_bar_util_1.ActionBarUtil.addButton(shareButton);
    };
    ListPage.prototype.add = function () {
        // Check for empty submissions
        if (this.grocery.trim() === "") {
            dialogsModule.alert({
                message: "Enter a grocery item",
                okButtonText: "OK"
            });
            return;
        }
        // Dismiss the keyboard
        config_1.Config.page.getViewById("grocery").dismissSoftInput();
        this.groceryList.add(this.grocery)
            .catch(function () {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list.",
                okButtonText: "OK"
            });
        });
        // Empty the input field
        this.grocery = "";
    };
    ListPage.prototype.share = function () {
        var list = [];
        var finalList = "";
        for (var i = 0, size = this.groceryList.length; i < size; i++) {
            list.push(this.groceryList.getItem(i).name);
        }
        var listString = list.join(", ").trim();
        socialShare.shareText(listString);
    };
    ListPage.prototype.delete = function (args) {
        var item = args.view.bindingContext;
        var index = this.groceryList.indexOf(item);
        this.groceryList.delete(index);
    };
    ListPage = __decorate([
        core_1.Component({
            selector: "list",
            templateUrl: "views/list/list.html"
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], ListPage);
    return ListPage;
})();
exports.ListPage = ListPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOlsiTGlzdFBhZ2UiLCJMaXN0UGFnZS5jb25zdHJ1Y3RvciIsIkxpc3RQYWdlLmNvbmZpZ3VyZUFjdGlvbkJhciIsIkxpc3RQYWdlLmFkZCIsIkxpc3RQYWdlLnNoYXJlIiwiTGlzdFBhZ2UuZGVsZXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFDeEMsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFDdkMsSUFBWSxhQUFhLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFFNUMsMkJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBRXpDLHdDQUFtQyxrREFBa0QsQ0FBQyxDQUFBO0FBQ3RGLGdDQUE0QixvQ0FBb0MsQ0FBQyxDQUFBO0FBQ2pFLHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBRTNDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3ZELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRWpFO0lBVUlBLGtCQUFvQkEsTUFBY0E7UUFWdENDLGlCQTRGQ0E7UUFsRnVCQSxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsOENBQW9CQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUNoREEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBRXRCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEVBQUVBLENBQUNBO1FBRTFCQSxJQUFJQSxJQUFJQSxHQUFHQSxlQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUN2QkEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FB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