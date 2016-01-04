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
var action_bar_util_1 = require("../../shared/utils/action-bar-util");
var LoginPage = (function () {
    function LoginPage(router) {
        this.router = router;
        action_bar_util_1.ActionBarUtil.setTitle("Sign In");
        action_bar_util_1.ActionBarUtil.emptyActionBarItems();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dpbi50cyJdLCJuYW1lcyI6WyJMb2dpblBhZ2UiLCJMb2dpblBhZ2UuY29uc3RydWN0b3IiLCJMb2dpblBhZ2Uuc2lnbkluIiwiTG9naW5QYWdlLnJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFDeEMsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFDdkMsSUFBWSxhQUFhLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFHNUMsZ0NBQTRCLDBDQUEwQyxDQUFDLENBQUE7QUFDdkUsZ0NBQTRCLG9DQUFvQyxDQUFDLENBQUE7QUFFakU7SUFPSUEsbUJBQW9CQSxNQUFjQTtRQUFkQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUM5QkEsK0JBQWFBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQ2xDQSwrQkFBYUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUVwQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsK0JBQWFBLENBQUNBO1lBQzFCQSxLQUFLQSxFQUFFQSwrQkFBK0JBO1lBQ3RDQSxRQUFRQSxFQUFFQSxVQUFVQTtTQUN2QkEsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFDREQsMEJBQU1BLEdBQU5BO1FBQUFFLGlCQVdDQTtRQVZHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQTthQUNaQSxLQUFLQSxDQUFDQSxVQUFDQSxLQUFLQTtZQUNUQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFDaEJBLE9BQU9BLEVBQUVBLCtDQUErQ0E7Z0JBQ3hEQSxZQUFZQSxFQUFFQSxJQUFJQTthQUNyQkEsQ0FBQ0EsQ0FBQ0E7UUFDUEEsQ0FBQ0EsQ0FBQ0E7YUFDREEsSUFBSUEsQ0FBQ0E7WUFDRkEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbkNBLENBQUNBLENBQUNBLENBQUNBO0lBQ1hBLENBQUNBO0lBQ0RGLDRCQUFRQSxHQUFSQTtRQUNJRyxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUE5QkxIO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNQQSxRQUFRQSxFQUFFQSxPQUFPQTtZQUNqQkEsV0FBV0EsRUFBRUEsd0JBQXdCQTtTQUN4Q0EsQ0FBQ0E7O2tCQTRCREE7SUFBREEsZ0JBQUNBO0FBQURBLENBQUNBLEFBL0JELElBK0JDO0FBM0JZLGlCQUFTLFlBMkJyQixDQUFBIn0=