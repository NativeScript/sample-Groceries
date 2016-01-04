import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import * as frameModule from "ui/frame";

import {UserViewModel} from "../../shared/view-models/user-view-model";

@Component({
    selector: "login",
    templateUrl: "views/login/login.html"
})
export class LoginPage {
    user: UserViewModel;

    constructor(private router: Router) {
        this.user = new UserViewModel({
            email: "nativescriptrocks@telerik.com",
            password: "password"
        });
    }
    signIn() {
        this.user.login()
            .catch((error) => {
                dialogsModule.alert({
                    message: "Unfortunately we could not find your account.",
                    okButtonText: "OK"
                });
            })
            .then(() => {
                this.router.navigate(["List"]);
            });
    }
    register() {
        this.router.navigate(["Register"]);
    }
}
