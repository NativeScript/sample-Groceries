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
        this.groceryList.empty();
        this.groceryList.load().then(function () {
            _this.isLoading = false;
        });
        /*var page = Config.page;
        var listView = page.getViewById("groceryList");

        if (page.ios) {
            swipeDelete.enable(listView, (index) => {
                this.delete(index);
            });
        }
        
        this.groceryList.empty();
        this.groceryList.load().then(() => {
            this.isLoading = false;
            listView.animate({
                opacity: 1,
                duration: 1000
            });
        });*/
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
        var groceryTextField = config_1.Config.page.getViewById("grocery");
        if (groceryTextField.text.trim() === "") {
            dialogsModule.alert({
                message: "Enter a grocery item",
                okButtonText: "OK"
            });
            return;
        }
        // Dismiss the keyboard
        groceryTextField.dismissSoftInput();
        this.groceryList.add(groceryTextField.text)
            .catch(function () {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list.",
                okButtonText: "OK"
            });
        });
        // Empty the input field
        groceryTextField.text = "";
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
    ListPage.prototype.delete = function (index) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOlsiTGlzdFBhZ2UiLCJMaXN0UGFnZS5jb25zdHJ1Y3RvciIsIkxpc3RQYWdlLmNvbmZpZ3VyZUFjdGlvbkJhciIsIkxpc3RQYWdlLmFkZCIsIkxpc3RQYWdlLnNoYXJlIiwiTGlzdFBhZ2UuZGVsZXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFDeEMsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFDdkMsSUFBWSxhQUFhLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFFNUMsMkJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBR3pDLHdDQUFtQyxrREFBa0QsQ0FBQyxDQUFBO0FBQ3RGLGdDQUE0QixvQ0FBb0MsQ0FBQyxDQUFBO0FBQ2pFLHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBRTNDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3ZELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRWpFO0lBVUlBLGtCQUFvQkEsTUFBY0E7UUFWdENDLGlCQWtHQ0E7UUF4RnVCQSxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsOENBQW9CQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUNoREEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBRXRCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEVBQUVBLENBQUNBO1FBRTFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUN6QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFD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