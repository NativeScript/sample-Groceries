import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {ActionItem} from "ui/action-bar";

import {UserViewModel} from "../../shared/view-models/user-view-model";
import {ActionBarUtil} from "../../shared/utils/action-bar-util";
import {Config} from "../../shared/config";

@Component({
    selector: "register",
    templateUrl: "views/register/register.html"
})

export class RegisterPage {
    user: UserViewModel;

    constructor(private router: Router) {
        ActionBarUtil.setTitle("Sign Up");
        ActionBarUtil.emptyActionBarItems();

        var cancelButton = new ActionItem();
        cancelButton.text = "Cancel";
        cancelButton.on("tap", () => {
            this.router.navigate(["Login"]);
        });
        ActionBarUtil.addButton(cancelButton);

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
