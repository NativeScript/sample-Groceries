import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router"

import { alert, LoginService, User } from "../shared";
import { LoginHelper } from "./login-helper";

@Component({
  selector: "gr-login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ["./login-common.css", "./login.component.css"]
})
export class LoginComponent implements OnInit {
  helper: LoginHelper;
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  @ViewChild("initialContainer") initialContainer: ElementRef;
  @ViewChild("mainContainer") mainContainer: ElementRef;
  @ViewChild("logoContainer") logoContainer: ElementRef;
  @ViewChild("formControls") formControls: ElementRef;
  @ViewChild("signUpStack") signUpStack: ElementRef;
  @ViewChild("password") password: ElementRef;

  constructor(private router: Router, private userService: LoginService) {
    this.helper = new LoginHelper();
    this.user = new User();
  }

  ngOnInit() {
    this.helper.configureActionBar();
  }

  focusPassword() {
    this.password.nativeElement.focus();
  }

  startBackgroundAnimation(background) {
    background.animate({
      scale: { x: 1.1, y: 1.1 },
      duration: 10000
    });
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }

    if (this.helper.isOffline()) {
      alert("Groceries requires an internet connection to log in.");
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
    this.userService.login(this.user)
      .subscribe(
        () => {
          this.isAuthenticating = false;
          this.router.navigate(["/"]);
        },
        (error) => {
          alert("Unfortunately we could not find your account.");
          this.isAuthenticating = false;
        }
      );
  }

  signUp() {
    this.userService.register(this.user)
      .subscribe(
        () => {
          alert("Your account was successfully created.");
          this.isAuthenticating = false;
          this.toggleDisplay();
        },
        (errorDetails) => {
          if (errorDetails.error && errorDetails.error.error == "UserAlreadyExists") {
            alert("This email address is already in use.");
          } else {
            alert("Unfortunately we were unable to create your account.");
          }
          this.isAuthenticating = false;
        }
      );
  }

  forgotPassword() {
    this.helper.forgotPasswordPrompt()
      .then((data) => {
        if (data.result) {
          this.userService.resetPassword(data.text.trim())
            .subscribe(() => {
              alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
            }, () => {
              alert("Unfortunately, an error occurred resetting your password.");
            });
        }
      });
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.helper.toggleDisplay(this.mainContainer, this.isLoggingIn);
  }

  showMainContent() {
    this.helper.showMainContent({
      initialContainer: this.initialContainer,
      mainContainer: this.mainContainer,
      logoContainer: this.logoContainer,
      formControls: this.formControls,
      signUpStack: this.signUpStack
    });
  }
}
