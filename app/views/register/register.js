var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("angular2/core");
var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var user_view_model_1 = require("../../shared/view-models/user-view-model");
var RegisterPage = (function () {
    function RegisterPage() {
        this.user = new user_view_model_1.UserViewModel();
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
            dialogsModule
                .alert("Your account was successfully created.")
                .then(function () {
                frameModule.topmost().navigate("views/login/login");
            });
        });
    };
    RegisterPage = __decorate([
        core_1.Component({
            selector: "register",
            templateUrl: "views/register/register.html"
        })
    ], RegisterPage);
    return RegisterPage;
})();
exports.RegisterPage = RegisterPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpc3Rlci50cyJdLCJuYW1lcyI6WyJSZWdpc3RlclBhZ2UiLCJSZWdpc3RlclBhZ2UuY29uc3RydWN0b3IiLCJSZWdpc3RlclBhZ2UucmVnaXN0ZXIiLCJSZWdpc3RlclBhZ2UuY29tcGxldGVSZWdpc3RyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQUF3QixlQUFlLENBQUMsQ0FBQTtBQUN4QyxJQUFZLGFBQWEsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUM1QyxJQUFZLFdBQVcsV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUV4QyxnQ0FBNEIsMENBQTBDLENBQUMsQ0FBQTtBQUV2RTtJQVFJQTtRQUNJQyxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSwrQkFBYUEsRUFBRUEsQ0FBQ0E7SUFDcENBLENBQUNBO0lBQ0RELCtCQUFRQSxHQUFSQTtRQUNJRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2hCQSxPQUFPQSxFQUFFQSw4QkFBOEJBO2dCQUN2Q0EsWUFBWUEsRUFBRUEsSUFBSUE7YUFDckJBLENBQUNBLENBQUNBO1FBQ1BBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0RGLDJDQUFvQkEsR0FBcEJBO1FBQ0lHLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBO2FBQ2ZBLEtBQUtBLENBQUNBO1lBQ0gsYUFBYTtpQkFDUixLQUFLLENBQUM7Z0JBQ0gsT0FBTyxFQUFFLHNEQUFzRDtnQkFDL0QsWUFBWSxFQUFFLElBQUk7YUFDckIsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDQTthQUNEQSxJQUFJQSxDQUFDQTtZQUNGLGFBQWE7aUJBQ1IsS0FBSyxDQUFDLHdDQUF3QyxDQUFDO2lCQUMvQyxJQUFJLENBQUM7Z0JBQ0YsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQXJDTEg7UUFBQ0EsZ0JBQVNBLENBQUNBO1lBQ1BBLFFBQVFBLEVBQUVBLFVBQVVBO1lBQ3BCQSxXQUFXQSxFQUFFQSw4QkFBOEJBO1NBQzlDQSxDQUFDQTtxQkFtQ0RBO0lBQURBLG1CQUFDQTtBQUFEQSxDQUFDQSxBQXRDRCxJQXNDQztBQWpDWSxvQkFBWSxlQWlDeEIsQ0FBQSJ9