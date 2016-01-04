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
        action_bar_util_1.ActionBarUtil.setTitle("Groceries");
        action_bar_util_1.ActionBarUtil.emptyActionBarItems();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOlsiTGlzdFBhZ2UiLCJMaXN0UGFnZS5jb25zdHJ1Y3RvciIsIkxpc3RQYWdlLmFkZCIsIkxpc3RQYWdlLnNoYXJlIiwiTGlzdFBhZ2UuZGVsZXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFDeEMsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFDdkMsSUFBWSxhQUFhLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFHNUMsd0NBQW1DLGtEQUFrRCxDQUFDLENBQUE7QUFDdEYsZ0NBQTRCLG9DQUFvQyxDQUFDLENBQUE7QUFDakUsdUJBQXFCLHFCQUFxQixDQUFDLENBQUE7QUFFM0MsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDdkQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFFakU7SUFVSUEsa0JBQW9CQSxNQUFjQTtRQVZ0Q0MsaUJBMkVDQTtRQWpFdUJBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBQzlCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSw4Q0FBb0JBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBQ2hEQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNsQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFdEJBLCtCQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUNwQ0EsK0JBQWFBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFFcENBLElBQUlBLElBQUlBLEdBQUdBLGVBQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ3ZCQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtRQUUv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