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
var RegisterPage = (function () {
    function RegisterPage(router) {
        this.router = router;
        this.user = new user_view_model_1.UserViewModel({
            email: "foo",
            password: ""
        });
    }
    RegisterPage.prototype.register = function () {
        alert(this.user.email);
        return;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpc3Rlci50cyJdLCJuYW1lcyI6WyJSZWdpc3RlclBhZ2UiLCJSZWdpc3RlclBhZ2UuY29uc3RydWN0b3IiLCJSZWdpc3RlclBhZ2UucmVnaXN0ZXIiLCJSZWdpc3RlclBhZ2UuY29tcGxldGVSZWdpc3RyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHFCQUF3QixlQUFlLENBQUMsQ0FBQTtBQUN4Qyx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN2QyxJQUFZLGFBQWEsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUc1QyxnQ0FBNEIsMENBQTBDLENBQUMsQ0FBQTtBQUV2RTtJQVFJQSxzQkFBb0JBLE1BQWNBO1FBQWRDLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBQzlCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSwrQkFBYUEsQ0FBQ0E7WUFDMUJBLEtBQUtBLEVBQUVBLEtBQUtBO1lBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1NBQ2ZBLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBQ0RELCtCQUFRQSxHQUFSQTtRQUNJRSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN2QkEsTUFBTUEsQ0FBQ0E7UUFDUEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLElBQUlBLENBQUNBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7UUFDaENBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ0pBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBO2dCQUNoQkEsT0FBT0EsRUFBRUEsOEJBQThCQTtnQkFDdkNBLFlBQVlBLEVBQUVBLElBQUlBO2FBQ3JCQSxDQUFDQSxDQUFDQTtRQUNQQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUNERiwyQ0FBb0JBLEdBQXBCQTtRQUNJRyxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQTthQUNmQSxLQUFLQSxDQUFDQTtZQUNILGFBQWE7aUJBQ1IsS0FBSyxDQUFDO2dCQUNILE9BQU8sRUFBRSxzREFBc0Q7Z0JBQy9ELFlBQVksRUFBRSxJQUFJO2FBQ3JCLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQ0E7YUFDREEsSUFBSUEsQ0FBQ0E7WUFBQSxpQkFNTDtZQUxHLGFBQWE7aUJBQ1IsS0FBSyxDQUFDLHdDQUF3QyxDQUFDO2lCQUMvQyxJQUFJLENBQUM7Z0JBQ0YsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQTFDTEg7UUFBQ0EsZ0JBQVNBLENBQUNBO1lBQ1BBLFFBQVFBLEVBQUVBLFVBQVVBO1lBQ3BCQSxXQUFXQSxFQUFFQSw4QkFBOEJBO1NBQzlDQSxDQUFDQTs7cUJBd0NEQTtJQUFEQSxtQkFBQ0E7QUFBREEsQ0FBQ0EsQUEzQ0QsSUEyQ0M7QUF0Q1ksb0JBQVksZUFzQ3hCLENBQUEifQ==