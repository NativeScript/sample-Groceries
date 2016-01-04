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
var user_view_model_1 = require("../../shared/view-models/user-view-model");
var config_1 = require("../../shared/config");
var RegisterPage = (function () {
    function RegisterPage(router) {
        var _this = this;
        this.router = router;
        var actionBar = config_1.Config.page.actionBar;
        actionBar.title = "Sign Up";
        var cancelButton = new action_bar_1.ActionItem();
        cancelButton.text = "Cancel";
        cancelButton.on("tap", function () {
            _this.router.navigate(["Login"]);
        });
        actionBar.actionItems.addItem(cancelButton);
        this.user = new user_view_model_1.UserViewModel({});
    }
    RegisterPage.prototype.register = function () {
        if (this.user.isValidEmail()) {
            this.completeRegistration();
        }
        else {
            dialogsModule.alert({
                message: "Enter a valid email address.",
                okButtonText: "OK"
            });
        }
    };
    RegisterPage.prototype.completeRegistration = function () {
        this.user.register()
            .catch(function () {
            dialogsModule
                .alert({
                message: "Unfortunately we were unable to create your account.",
                okButtonText: "OK"
            });
        })
            .then(function () {
            var _this = this;
            dialogsModule
                .alert("Your account was successfully created.")
                .then(function () {
                _this.router.navigate(["Login"]);
            });
        });
    };
    RegisterPage = __decorate([
        core_1.Component({
            selector: "register",
            templateUrl: "views/register/register.html"
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], RegisterPage);
    return RegisterPage;
})();
exports.RegisterPage = RegisterPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpc3Rlci50cyJdLCJuYW1lcyI6WyJSZWdpc3RlclBhZ2UiLCJSZWdpc3RlclBhZ2UuY29uc3RydWN0b3IiLCJSZWdpc3RlclBhZ2UucmVnaXN0ZXIiLCJSZWdpc3RlclBhZ2UuY29tcGxldGVSZWdpc3RyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHFCQUF3QixlQUFlLENBQUMsQ0FBQTtBQUN4Qyx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN2QyxJQUFZLGFBQWEsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUU1QywyQkFBc0MsZUFBZSxDQUFDLENBQUE7QUFFdEQsZ0NBQTRCLDBDQUEwQyxDQUFDLENBQUE7QUFDdkUsdUJBQXFCLHFCQUFxQixDQUFDLENBQUE7QUFFM0M7SUFRSUEsc0JBQW9CQSxNQUFjQTtRQVJ0Q0MsaUJBZ0RDQTtRQXhDdUJBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBQzlCQSxJQUFJQSxTQUFTQSxHQUFHQSxlQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUN0Q0EsU0FBU0EsQ0FBQ0EsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFFNUJBLElBQUlBLFlBQVlBLEdBQUdBLElBQUlBLHVCQUFVQSxFQUFFQSxDQUFDQTtRQUNwQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDN0JBLFlBQVlBLENBQUNBLEVBQUVBLENBQUNBLEtBQUtBLEVBQUVBO1lBQ25CQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNwQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsU0FBU0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFFNUNBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLCtCQUFhQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUN0Q0EsQ0FBQ0E7SUFDREQsK0JBQVFBLEdBQVJBO1FBQ0lFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEVBQUVBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFDaEJBLE9BQU9BLEVBQUVBLDhCQUE4QkE7Z0JBQ3ZDQSxZQUFZQSxFQUFFQSxJQUFJQTthQUNyQkEsQ0FBQ0EsQ0FBQ0E7UUFDUEEsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFDREYsMkNBQW9CQSxHQUFwQkE7UUFDSUcsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUE7YUFDZkEsS0FBS0EsQ0FBQ0E7WUFDSCxhQUFhO2lCQUNSLEtBQUssQ0FBQztnQkFDSCxPQUFPLEVBQUUsc0RBQXNEO2dCQUMvRCxZQUFZLEVBQUUsSUFBSTthQUNyQixDQUFDLENBQUM7UUFDWCxDQUFDLENBQUNBO2FBQ0RBLElBQUlBLENBQUNBO1lBQUEsaUJBTUw7WUFMRyxhQUFhO2lCQUNSLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQztpQkFDL0MsSUFBSSxDQUFDO2dCQUNGLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUEvQ0xIO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNQQSxRQUFRQSxFQUFFQSxVQUFVQTtZQUNwQkEsV0FBV0EsRUFBRUEsOEJBQThCQTtTQUM5Q0EsQ0FBQ0E7O3FCQTZDREE7SUFBREEsbUJBQUNBO0FBQURBLENBQUNBLEFBaERELElBZ0RDO0FBM0NZLG9CQUFZLGVBMkN4QixDQUFBIn0=