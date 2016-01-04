import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {ActionItems} from "ui/action-bar";
import {TextField} from "ui/text-field";

import {UserViewModel} from "../../shared/view-models/user-view-model";
import {ActionBarUtil} from "../../shared/utils/action-bar-util";
import {Config} from "../../shared/config";

@Component({
    selector: "login",
    templateUrl: "views/login/login.html"
})
export class LoginPage {
    user: UserViewModel;

    constructor(private router: Router) {
        ActionBarUtil.setTitle("Sign In");
        ActionBarUtil.emptyActionBarItems();

        this.user = new UserViewModel({
            email: "nativescriptrocks@telerik.com",
            password: "password"
        });
    }
    signIn() {
        // Need to manually set these until 2-way data binding is supported
        var emailTextField = <TextField>Config.page.getViewById("email");
        var passwordTextField = <TextField>Config.page.getViewById("password");
        this.user.email = emailTextField.text;
        this.user.password = passwordTextField.text;

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
