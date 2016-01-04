import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import * as frameModule from "ui/frame";

import {UserViewModel} from "../../shared/view-models/user-view-model";

@Component({
    selector: "register",
    templateUrl: "views/register/register.html"
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
            .catch(function() {
                dialogsModule
                    .alert({
                        message: "Unfortunately we were unable to create your account.",
                        okButtonText: "OK"
                    });
            })
            .then(function() {
                dialogsModule
                    .alert("Your account was successfully created.")
                    .then(() => {
                        this.router.navigate(["Login"]);
                    });
            });
    }
}
