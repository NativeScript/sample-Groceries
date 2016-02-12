import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";

import {UserViewModel} from "../../shared/view-models/user-view-model";

@Component({
    selector: "login",
    templateUrl: "pages/login/login.html"
})
export class LoginPage {
    user: UserViewModel;

    constructor(private _router: Router) {
        this.user = new UserViewModel({
            email: "nativescriptrocks@telerik.com",
            password: "password"
        });
    }

    signIn() {
        this.user.login()
            .then(() => {
                this._router.navigate(["List"]);
            })
            .catch((error) => {
                dialogsModule.alert({
                    message: "Unfortunately we could not find your account.",
                    okButtonText: "OK"
                });
            });
    }
    register() {
        this._router.navigate(["Register"]);
    }
}
