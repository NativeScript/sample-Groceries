"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_deprecated_1 = require("@angular/router-deprecated");
var user_1 = require("../../shared/user/user");
var user_service_1 = require("../../shared/user/user.service");
var LoginComponent = (function () {
    function LoginComponent(_userService, _router) {
        this._userService = _userService;
        this._router = _router;
        this.isLoggingIn = true;
        this.user = new user_1.User();
        this.user.email = "ngconf@telerik.com";
        this.user.password = "password";
    }
    LoginComponent.prototype.submit = function () {
        if (this.isLoggingIn) {
            this.login();
        }
        else {
            this.signUp();
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this._userService.login(this.user)
            .subscribe(function () { return _this._router.navigate(["List"]); }, function () { return alert("Unfortunately we were not able to log you in to the system"); });
    };
    LoginComponent.prototype.signUp = function () {
        var _this = this;
        this._userService.register(this.user)
            .subscribe(function () {
            alert("Your account was successfully created.");
            _this.toggleDisplay();
        }, function () { return alert("Unfortunately we were unable to create your account."); });
    };
    LoginComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: "login",
            template: "\n  <div id=\"wrapper\">\n    <section id=\"login\" class=\"{{ isLoggingIn ? '' : 'dark' }}\">\n      <header>\n        <span class=\"avatar\">\n          <img src=\"./app/assets/css/images/logo.png\" alt=\"Groceries logo\">\n        </span>\n      </header>\n      <h1>Groceries</h1>\n      <div class=\"field\">\n      <label>\n        Email:\n        <input type=\"text\" [(ngModel)]=\"user.email\">\n      </label>\n      </div>\n      <div class=\"field\">\n      <label>\n        Password:\n        <input type=\"password\" [(ngModel)]=\"user.password\">\n      </label>\n      </div>\n      <div class=\"field center\">\n        <button class=\"big\" (click)=\"submit()\">\n          {{ isLoggingIn ? 'Login' : 'Register' }}\n        </button>\n        <button class=\"plain\" (click)=\"toggleDisplay()\">\n          {{ isLoggingIn ? 'Sign Up' : 'Back to Login' }}\n        </button>\n      </div>\n    </section>\n  </div>\n  ",
            providers: [user_service_1.UserService]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, router_deprecated_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map