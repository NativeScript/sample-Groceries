import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";

import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";

@Component({
  selector: "register",
  templateUrl: "pages/register/register.html",
  providers: [UserService]
})
export class RegisterPage {
  user: User;

  constructor(
    private _router: Router,
    private _userService: UserService) {

    this.user = new User();
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
    this._userService.register(this.user)
      .subscribe(
        () => {
          dialogsModule
            .alert("Your account was successfully created.")
            .then(() => this._router.navigate(["Login"]));
        },
        (error) => {
          dialogsModule.alert({
            message: "Unfortunately we were unable to create your account.",
            okButtonText: "OK"
          });
        }
      );
    }
}
