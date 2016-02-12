import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";

import {UserViewModel} from "../../shared/view-models/user-view-model";

@Component({
    selector: "register",
    templateUrl: "pages/register/register.html"
})
export class RegisterPage {
    user: UserViewModel;

    constructor(private router: Router) {
        this.user = new UserViewModel({});
    }

    register() {
        if (this.user.isValidEmail()) {
            this.completeRegistration();
        } else {
            dialogsModule.alert({
                message: "Enter a valid email address.",
                okButtonText: "OK"
            });
        }
    }

    completeRegistration() {
        this.user.register()
            .catch(() => {
                dialogsModule
                    .alert({
                        message: "Unfortunately we were unable to create your account.",
                        okButtonText: "OK"
                    });
            })
            .then(() => {
                dialogsModule
                    .alert("Your account was successfully created.")
                    .then(() => {
                        this.router.navigate(["Login"]);
                    });
            });
    }
}
