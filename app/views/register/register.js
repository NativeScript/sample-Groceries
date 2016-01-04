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
var action_bar_util_1 = require("../../shared/utils/action-bar-util");
var config_1 = require("../../shared/config");
var RegisterPage = (function () {
    function RegisterPage(router) {
        var _this = this;
        this.router = router;
        action_bar_util_1.ActionBarUtil.setTitle("Sign Up");
        action_bar_util_1.ActionBarUtil.emptyActionBarItems();
        var cancelButton = new action_bar_1.ActionItem();
        cancelButton.text = "Cancel";
        cancelButton.on("tap", function () {
            _this.router.navigate(["Login"]);
        });
        action_bar_util_1.ActionBarUtil.addButton(cancelButton);
        this.user = new user_view_model_1.UserViewModel({});
    }
    RegisterPage.prototype.register = function () {
        // Need to manually set these until 2-way data binding is supported
        var emailTextField = config_1.Config.page.getViewById("email");
        var passwordTextField = config_1.Config.page.getViewById("password");
        this.user.email = emailTextField.text;
        this.user.password = passwordTextField.text;
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
        var _this = this;
        this.user.register()
            .catch(function () {
            dialogsModule
                .alert({
                message: "Unfortunately we were unable to create your account.",
                okButtonText: "OK"
            });
        })
            .then(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpc3Rlci50cyJdLCJuYW1lcyI6WyJSZWdpc3RlclBhZ2UiLCJSZWdpc3RlclBhZ2UuY29uc3RydWN0b3IiLCJSZWdpc3RlclBhZ2UucmVnaXN0ZXIiLCJSZWdpc3RlclBhZ2UuY29tcGxldGVSZWdpc3RyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHFCQUF3QixlQUFlLENBQUMsQ0FBQTtBQUN4Qyx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN2QyxJQUFZLGFBQWEsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUM1QywyQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFHekMsZ0NBQTRCLDBDQUEwQyxDQUFDLENBQUE7QUFDdkUsZ0NBQTRCLG9DQUFvQyxDQUFDLENBQUE7QUFDakUsdUJBQXFCLHFCQUFxQixDQUFDLENBQUE7QUFFM0M7SUFRSUEsc0JBQW9CQSxNQUFjQTtRQVJ0Q0MsaUJBc0RDQTtRQTlDdUJBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBQzlCQSwrQkFBYUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDbENBLCtCQUFhQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBRXBDQSxJQUFJQSxZQUFZQSxHQUFHQSxJQUFJQSx1QkFBVUEsRUFBRUEsQ0FBQ0E7UUFDcENBLFlBQVlBLENBQUNBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBO1FBQzdCQSxZQUFZQSxDQUFDQSxFQUFFQSxDQUFDQSxLQUFLQSxFQUFFQTtZQUNuQkEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDcENBLENBQUNBLENBQUNBLENBQUNBO1FBQ0hBLCtCQUFhQSxDQUFDQSxTQUFTQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUV0Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsK0JBQWFBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQUNERCwrQkFBUUEsR0FBUkE7UUFDSUUsbUVBQW1FQTtRQUNuRUEsSUFBSUEsY0FBY0EsR0FBY0EsZUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDakVBLElBQUlBLGlCQUFpQkEsR0FBY0EsZUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFDdkVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxpQkFBaUJBLENBQUNBLElBQUlBLENBQUNBO1FBRTVDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2hCQSxPQUFPQSxFQUFFQSw4QkFBOEJBO2dCQUN2Q0EsWUFBWUEsRUFBRUEsSUFBSUE7YUFDckJBLENBQUNBLENBQUNBO1FBQ1BBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0RGLDJDQUFvQkEsR0FBcEJBO1FBQUFHLGlCQWdCQ0E7UUFmR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUE7YUFDZkEsS0FBS0EsQ0FBQ0E7WUFDSEEsYUFBYUE7aUJBQ1JBLEtBQUtBLENBQUNBO2dCQUNIQSxPQUFPQSxFQUFFQSxzREFBc0RBO2dCQUMvREEsWUFBWUEsRUFBRUEsSUFBSUE7YUFDckJBLENBQUNBLENBQUNBO1FBQ1hBLENBQUNBLENBQUNBO2FBQ0RBLElBQUlBLENBQUNBO1lBQ0ZBLGFBQWFBO2lCQUNSQSxLQUFLQSxDQUFDQSx3Q0FBd0NBLENBQUNBO2lCQUMvQ0EsSUFBSUEsQ0FBQ0E7Z0JBQ0ZBLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1lBQ3BDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNYQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQXJETEg7UUFBQ0EsZ0JBQVNBLENBQUNBO1lBQ1BBLFFBQVFBLEVBQUVBLFVBQVVBO1lBQ3BCQSxXQUFXQSxFQUFFQSw4QkFBOEJBO1NBQzlDQSxDQUFDQTs7cUJBbUREQTtJQUFEQSxtQkFBQ0E7QUFBREEsQ0FBQ0EsQUF0REQsSUFzREM7QUFqRFksb0JBQVksZUFpRHhCLENBQUEifQ==