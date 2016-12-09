import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service"

@Component({
  selector: "login",
  templateUrl: "./login.html",
  styleUrls: ["./login.css"],
  providers: [UserService]
})
export class LoginComponent {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  constructor(
    private _userService: UserService,
    private _router: Router) {
    this.user = new User();
  }

  submit() {
    /*if (!this.user.isValidEmail()) {
      alert("Enter a valid email address");
      return;
    }*/

    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this._userService.login(this.user)
      .subscribe(
        () => {
          this.isAuthenticating = false;
          this._router.navigate(["/list"]);
        },
        () => {
          alert("Unfortunately we were not able to log you in to the system");
          this.isAuthenticating = false;
        }
      );
  }

  signUp() {
    this._userService.register(this.user)
      .subscribe(
        () => {
          alert("Your account was successfully created.");
          this.isAuthenticating = false;
          this.toggleDisplay();
        },
        () => {
          alert("Unfortunately we were unable to create your account.");
          this.isAuthenticating = false;
        }
      );
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}
