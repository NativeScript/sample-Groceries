"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var dialogs_1 = require("ui/dialogs");
var page_1 = require("ui/page");
var SocialShare = require("nativescript-social-share");
var shared_1 = require("./shared");
var shared_2 = require("../shared");
var GroceriesComponent = /** @class */ (function () {
    function GroceriesComponent(router, store, loginService, page) {
        this.router = router;
        this.store = store;
        this.loginService = loginService;
        this.page = page;
        this.grocery = "";
        this.isShowingRecent = false;
        this.isLoading = false;
    }
    GroceriesComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.page.className = "list-page";
    };
    // Prevent the first textfield from receiving focus on Android
    // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
    GroceriesComponent.prototype.handleAndroidFocus = function (textField, container) {
        if (container.android) {
            container.android.setFocusableInTouchMode(true);
            container.android.setFocusable(true);
            textField.android.clearFocus();
        }
    };
    GroceriesComponent.prototype.showActivityIndicator = function () {
        this.isLoading = true;
    };
    GroceriesComponent.prototype.hideActivityIndicator = function () {
        this.isLoading = false;
    };
    GroceriesComponent.prototype.add = function (target) {
        var _this = this;
        // If showing recent groceries the add button should do nothing.
        if (this.isShowingRecent) {
            return;
        }
        var textField = this.groceryTextField.nativeElement;
        if (this.grocery.trim() === "") {
            // If the user clicked the add button, and the textfield is empty,
            // focus the text field and return.
            if (target === "button") {
                textField.focus();
            }
            else {
                // If the user clicked return with an empty text field show an error.
                shared_2.alert("Enter a grocery item");
            }
            return;
        }
        // Dismiss the keyboard
        // TODO: Is it better UX to dismiss the keyboard, or leave it up so the
        // user can continue to add more groceries?
        textField.dismissSoftInput();
        this.showActivityIndicator();
        this.store.add(this.grocery)
            .subscribe(function () {
            _this.grocery = "";
            _this.hideActivityIndicator();
        }, function () {
            shared_2.alert("An error occurred while adding an item to your list.");
            _this.hideActivityIndicator();
        });
    };
    GroceriesComponent.prototype.toggleRecent = function () {
        this.isShowingRecent = !this.isShowingRecent;
    };
    GroceriesComponent.prototype.showMenu = function () {
        var _this = this;
        dialogs_1.action({
            message: "What would you like to do?",
            actions: ["Share", "Log Off"],
            cancelButtonText: "Cancel"
        }).then(function (result) {
            if (result === "Share") {
                _this.share();
            }
            else if (result === "Log Off") {
                _this.logoff();
            }
        });
    };
    GroceriesComponent.prototype.share = function () {
        var items = this.store.items.value;
        var list = [];
        for (var i = 0, size = items.length; i < size; i++) {
            list.push(items[i].name);
        }
        SocialShare.shareText(list.join(", ").trim());
    };
    GroceriesComponent.prototype.logoff = function () {
        this.loginService.logoff();
        this.router.navigate(["/login"]);
    };
    __decorate([
        core_1.ViewChild("groceryTextField"),
        __metadata("design:type", core_1.ElementRef)
    ], GroceriesComponent.prototype, "groceryTextField", void 0);
    GroceriesComponent = __decorate([
        core_1.Component({
            selector: "gr-groceries",
            moduleId: module.id,
            templateUrl: "./groceries.component.html",
            styleUrls: ["./groceries-common.css", "./groceries.component.css"],
            providers: [shared_1.GroceryService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            shared_1.GroceryService,
            shared_2.LoginService,
            page_1.Page])
    ], GroceriesComponent);
    return GroceriesComponent;
}());
exports.GroceriesComponent = GroceriesComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUU7QUFDekUsMENBQXlDO0FBQ3pDLHNDQUFvQztBQUVwQyxnQ0FBK0I7QUFFL0IsdURBQXlEO0FBR3pELG1DQUEwQztBQUMxQyxvQ0FBZ0Q7QUFTaEQ7SUFPRSw0QkFBb0IsTUFBYyxFQUN4QixLQUFxQixFQUNyQixZQUEwQixFQUMxQixJQUFVO1FBSEEsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBVHBCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsY0FBUyxHQUFHLEtBQUssQ0FBQztJQU9LLENBQUM7SUFFeEIscUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7SUFDcEMsQ0FBQztJQUVELDhEQUE4RDtJQUM5RCx3RkFBd0Y7SUFDeEYsK0NBQWtCLEdBQWxCLFVBQW1CLFNBQVMsRUFBRSxTQUFTO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFNBQVMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQUVELGtEQUFxQixHQUFyQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFDRCxrREFBcUIsR0FBckI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBRUQsZ0NBQUcsR0FBSCxVQUFJLE1BQWM7UUFBbEIsaUJBcUNDO1FBcENDLGdFQUFnRTtRQUNoRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQWMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztRQUUvRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0Isa0VBQWtFO1lBQ2xFLG1DQUFtQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixxRUFBcUU7Z0JBQ3JFLGNBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFDRCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsdUJBQXVCO1FBQ3ZCLHVFQUF1RTtRQUN2RSwyQ0FBMkM7UUFDM0MsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUN6QixTQUFTLENBQ1I7WUFDRSxLQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQixLQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixDQUFDLEVBQ0Q7WUFDRSxjQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUM5RCxLQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixDQUFDLENBQ0YsQ0FBQztJQUNOLENBQUM7SUFFRCx5Q0FBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDL0MsQ0FBQztJQUVELHFDQUFRLEdBQVI7UUFBQSxpQkFZQztRQVhDLGdCQUFNLENBQUM7WUFDTCxPQUFPLEVBQUUsNEJBQTRCO1lBQ3JDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7WUFDN0IsZ0JBQWdCLEVBQUUsUUFBUTtTQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTTtZQUNiLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGtDQUFLLEdBQUw7UUFDRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbkMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELG1DQUFNLEdBQU47UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBbEc4QjtRQUE5QixnQkFBUyxDQUFDLGtCQUFrQixDQUFDO2tDQUFtQixpQkFBVTtnRUFBQztJQUxqRCxrQkFBa0I7UUFQOUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLFNBQVMsRUFBRSxDQUFDLHdCQUF3QixFQUFFLDJCQUEyQixDQUFDO1lBQ2xFLFNBQVMsRUFBRSxDQUFDLHVCQUFjLENBQUM7U0FDNUIsQ0FBQzt5Q0FRNEIsZUFBTTtZQUNqQix1QkFBYztZQUNQLHFCQUFZO1lBQ3BCLFdBQUk7T0FWVCxrQkFBa0IsQ0F3RzlCO0lBQUQseUJBQUM7Q0FBQSxBQXhHRCxJQXdHQztBQXhHWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gXCJjb2xvclwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tIFwidWkvdGV4dC1maWVsZFwiO1xuaW1wb3J0ICogYXMgU29jaWFsU2hhcmUgZnJvbSBcIm5hdGl2ZXNjcmlwdC1zb2NpYWwtc2hhcmVcIjtcblxuaW1wb3J0IHsgR3JvY2VyeUxpc3RDb21wb25lbnQgfSBmcm9tIFwiLi9ncm9jZXJ5LWxpc3QvZ3JvY2VyeS1saXN0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgR3JvY2VyeVNlcnZpY2UgfSBmcm9tIFwiLi9zaGFyZWRcIjtcbmltcG9ydCB7IExvZ2luU2VydmljZSwgYWxlcnQgfSBmcm9tIFwiLi4vc2hhcmVkXCI7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJnci1ncm9jZXJpZXNcIixcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgdGVtcGxhdGVVcmw6IFwiLi9ncm9jZXJpZXMuY29tcG9uZW50Lmh0bWxcIixcbiAgc3R5bGVVcmxzOiBbXCIuL2dyb2Nlcmllcy1jb21tb24uY3NzXCIsIFwiLi9ncm9jZXJpZXMuY29tcG9uZW50LmNzc1wiXSxcbiAgcHJvdmlkZXJzOiBbR3JvY2VyeVNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIEdyb2Nlcmllc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGdyb2Nlcnk6IHN0cmluZyA9IFwiXCI7XG4gIGlzU2hvd2luZ1JlY2VudCA9IGZhbHNlO1xuICBpc0xvYWRpbmcgPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKFwiZ3JvY2VyeVRleHRGaWVsZFwiKSBncm9jZXJ5VGV4dEZpZWxkOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBzdG9yZTogR3JvY2VyeVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsb2dpblNlcnZpY2U6IExvZ2luU2VydmljZSxcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XG4gICAgdGhpcy5wYWdlLmNsYXNzTmFtZSA9IFwibGlzdC1wYWdlXCI7XG4gIH1cblxuICAvLyBQcmV2ZW50IHRoZSBmaXJzdCB0ZXh0ZmllbGQgZnJvbSByZWNlaXZpbmcgZm9jdXMgb24gQW5kcm9pZFxuICAvLyBTZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDU2NzM0L2FuZHJvaWQtZm9yY2UtZWRpdHRleHQtdG8tcmVtb3ZlLWZvY3VzXG4gIGhhbmRsZUFuZHJvaWRGb2N1cyh0ZXh0RmllbGQsIGNvbnRhaW5lcikge1xuICAgIGlmIChjb250YWluZXIuYW5kcm9pZCkge1xuICAgICAgY29udGFpbmVyLmFuZHJvaWQuc2V0Rm9jdXNhYmxlSW5Ub3VjaE1vZGUodHJ1ZSk7XG4gICAgICBjb250YWluZXIuYW5kcm9pZC5zZXRGb2N1c2FibGUodHJ1ZSk7XG4gICAgICB0ZXh0RmllbGQuYW5kcm9pZC5jbGVhckZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0FjdGl2aXR5SW5kaWNhdG9yKCkge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgfVxuICBoaWRlQWN0aXZpdHlJbmRpY2F0b3IoKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGFkZCh0YXJnZXQ6IHN0cmluZykge1xuICAgIC8vIElmIHNob3dpbmcgcmVjZW50IGdyb2NlcmllcyB0aGUgYWRkIGJ1dHRvbiBzaG91bGQgZG8gbm90aGluZy5cbiAgICBpZiAodGhpcy5pc1Nob3dpbmdSZWNlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdGV4dEZpZWxkID0gPFRleHRGaWVsZD50aGlzLmdyb2NlcnlUZXh0RmllbGQubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICh0aGlzLmdyb2NlcnkudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBjbGlja2VkIHRoZSBhZGQgYnV0dG9uLCBhbmQgdGhlIHRleHRmaWVsZCBpcyBlbXB0eSxcbiAgICAgIC8vIGZvY3VzIHRoZSB0ZXh0IGZpZWxkIGFuZCByZXR1cm4uXG4gICAgICBpZiAodGFyZ2V0ID09PSBcImJ1dHRvblwiKSB7XG4gICAgICAgIHRleHRGaWVsZC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tlZCByZXR1cm4gd2l0aCBhbiBlbXB0eSB0ZXh0IGZpZWxkIHNob3cgYW4gZXJyb3IuXG4gICAgICAgIGFsZXJ0KFwiRW50ZXIgYSBncm9jZXJ5IGl0ZW1cIik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGlzbWlzcyB0aGUga2V5Ym9hcmRcbiAgICAvLyBUT0RPOiBJcyBpdCBiZXR0ZXIgVVggdG8gZGlzbWlzcyB0aGUga2V5Ym9hcmQsIG9yIGxlYXZlIGl0IHVwIHNvIHRoZVxuICAgIC8vIHVzZXIgY2FuIGNvbnRpbnVlIHRvIGFkZCBtb3JlIGdyb2Nlcmllcz9cbiAgICB0ZXh0RmllbGQuZGlzbWlzc1NvZnRJbnB1dCgpO1xuXG4gICAgdGhpcy5zaG93QWN0aXZpdHlJbmRpY2F0b3IoKTtcbiAgICB0aGlzLnN0b3JlLmFkZCh0aGlzLmdyb2NlcnkpXG4gICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5ncm9jZXJ5ID0gXCJcIjtcbiAgICAgICAgICB0aGlzLmhpZGVBY3Rpdml0eUluZGljYXRvcigpO1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoXCJBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgYW4gaXRlbSB0byB5b3VyIGxpc3QuXCIpO1xuICAgICAgICAgIHRoaXMuaGlkZUFjdGl2aXR5SW5kaWNhdG9yKCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cblxuICB0b2dnbGVSZWNlbnQoKSB7XG4gICAgdGhpcy5pc1Nob3dpbmdSZWNlbnQgPSAhdGhpcy5pc1Nob3dpbmdSZWNlbnQ7XG4gIH1cblxuICBzaG93TWVudSgpIHtcbiAgICBhY3Rpb24oe1xuICAgICAgbWVzc2FnZTogXCJXaGF0IHdvdWxkIHlvdSBsaWtlIHRvIGRvP1wiLFxuICAgICAgYWN0aW9uczogW1wiU2hhcmVcIiwgXCJMb2cgT2ZmXCJdLFxuICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIlxuICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJTaGFyZVwiKSB7XG4gICAgICAgIHRoaXMuc2hhcmUoKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBcIkxvZyBPZmZcIikge1xuICAgICAgICB0aGlzLmxvZ29mZigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2hhcmUoKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5zdG9yZS5pdGVtcy52YWx1ZTtcbiAgICBsZXQgbGlzdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBzaXplID0gaXRlbXMubGVuZ3RoOyBpIDwgc2l6ZSA7IGkrKykge1xuICAgICAgbGlzdC5wdXNoKGl0ZW1zW2ldLm5hbWUpO1xuICAgIH1cbiAgICBTb2NpYWxTaGFyZS5zaGFyZVRleHQobGlzdC5qb2luKFwiLCBcIikudHJpbSgpKTtcbiAgfVxuXG4gIGxvZ29mZigpIHtcbiAgICB0aGlzLmxvZ2luU2VydmljZS5sb2dvZmYoKTtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvbG9naW5cIl0pO1xuICB9XG59XG4iXX0=