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
var user_view_model_1 = require("../../shared/view-models/user-view-model");
var config_1 = require("../../shared/config");
var LoginPage = (function () {
    function LoginPage(router) {
        this.router = router;
        var actionBar = config_1.Config.page.actionBar;
        actionBar.title = "Sign In";
        this.user = new user_view_model_1.UserViewModel({
            email: "nativescriptrocks@telerik.com",
            password: "password"
        });
    }
    LoginPage.prototype.signIn = function () {
        var _this = this;
        this.user.login()
            .catch(function (error) {
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
        })
            .then(function () {
            _this.router.navigate(["List"]);
        });
    };
    LoginPage.prototype.register = function () {
        this.router.navigate(["Register"]);
    };
    LoginPage = __decorate([
        core_1.Component({
            selector: "login",
            templateUrl: "views/login/login.html"
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], LoginPage);
    return LoginPage;
})();
exports.LoginPage = LoginPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dpbi50cyJdLCJuYW1lcyI6WyJMb2dpblBhZ2UiLCJMb2dpblBhZ2UuY29uc3RydWN0b3IiLCJMb2dpblBhZ2Uuc2lnbkluIiwiTG9naW5QYWdlLnJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFDeEMsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFDdkMsSUFBWSxhQUFhLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFJNUMsZ0NBQTRCLDBDQUEwQyxDQUFDLENBQUE7QUFDdkUsdUJBQXFCLHFCQUFxQixDQUFDLENBQUE7QUFFM0M7SUFPSUEsbUJBQW9CQSxNQUFjQTtRQUFkQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUM5QkEsSUFBSUEsU0FBU0EsR0FBR0EsZUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdENBLFNBQVNBLENBQUNBLEtBQUtBLEdBQUdBLFNBQVNBLENBQUNBO1FBRTVCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSwrQkFBYUEsQ0FBQ0E7WUFDMUJBLEtBQUtBLEVBQUVBLCtCQUErQkE7WUFDdENBLFFBQVFBLEVBQUVBLFVBQVVBO1NBQ3ZCQSxDQUFDQSxDQUFDQTtJQUNQQSxDQUFDQTtJQUNERCwwQkFBTUEsR0FBTkE7UUFBQUUsaUJBV0NBO1FBVkdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBO2FBQ1pBLEtBQUtBLENBQUNBLFVBQUNBLEtBQUtBO1lBQ1RBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBO2dCQUNoQkEsT0FBT0EsRUFBRUEsK0NBQStDQTtnQkFDeERBLFlBQVlBLEVBQUVBLElBQUlBO2FBQ3JCQSxDQUFDQSxDQUFDQTtRQUNQQSxDQUFDQSxDQUFDQTthQUNEQSxJQUFJQSxDQUFDQTtZQUNGQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNuQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFDREYsNEJBQVFBLEdBQVJBO1FBQ0lHLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQTlCTEg7UUFBQ0EsZ0JBQVNBLENBQUNBO1lBQ1BBLFFBQVFBLEVBQUVBLE9BQU9BO1lBQ2pCQSxXQUFXQSxFQUFFQSx3QkFBd0JBO1NBQ3hDQSxDQUFDQTs7a0JBNEJEQTtJQUFEQSxnQkFBQ0E7QUFBREEsQ0FBQ0EsQUEvQkQsSUErQkM7QUEzQlksaUJBQVMsWUEyQnJCLENBQUEifQ==