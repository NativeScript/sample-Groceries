import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { LoginService, User } from "../shared";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login-common.css"],
  providers: [LoginService]
})
export class LoginComponent {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  constructor(
    private _loginService: LoginService,
    private _router: Router) {
    this.user = new User();
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address");
      return;
    }

    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this._loginService.login(this.user)
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
    this._loginService.register(this.user)
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
