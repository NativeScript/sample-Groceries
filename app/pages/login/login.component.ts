import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "color";
import { connectionType, getConnectionType } from "connectivity";
import { Animation } from "ui/animation";
import { View } from "ui/core/view";
import { prompt } from "ui/dialogs";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
import { setHintColor } from "../../utils/hint-util";
import { alert } from "../../utils/dialog-util";

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"],
})
export class LoginPageComponent implements OnInit {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  @ViewChild("initialContainer") initialContainer: ElementRef;
  @ViewChild("mainContainer") mainContainer: ElementRef;
  @ViewChild("logoContainer") logoContainer: ElementRef;
  @ViewChild("formControls") formControls: ElementRef;
  @ViewChild("signUpStack") signUpStack: ElementRef;
  @ViewChild("email") email: ElementRef;
  @ViewChild("password") password: ElementRef;

  constructor(private _router: Router,
    private _userService: UserService,
    private page: Page) {
    this.user = new User();
    this.user.email = "ngconf@telerik33.com";
    this.user.password = "password";
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  focusPassword() {
    this.password.nativeElement.focus();
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
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
    if (getConnectionType() === connectionType.none) {
      alert("Groceries requires an internet connection to log in.");
      return;
    }

    this._userService.login(this.user)
      .then(() => {
        this.isAuthenticating = false;
        this._router.navigate(["/"]);
      })
      .catch(() => {
        alert("Unfortunately we could not find your account.");
        this.isAuthenticating = false;
      });
  }

  signUp() {
    if (getConnectionType() === connectionType.none) {
      alert("Groceries requires an internet connection to register.");
      return;
    }

    this._userService.register(this.user)
      .then(() => {
        alert("Your account was successfully created.");
        this.isAuthenticating = false;
        this.toggleDisplay();
      })
      .catch((message) => {
        if (message.match(/same user/)) {
          alert("This email address is already in use.");
        } else {
          alert("Unfortunately we were unable to create your account.");
        }
        this.isAuthenticating = false;
      });
  }

  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for Groceries to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        this._userService.resetPassword(data.text.trim())
          .then(() => {
            alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
          })
          .catch(() => {
            alert("Unfortunately, an error occurred resetting your password.");
          });
      }
    });
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.setTextFieldColors();
    let mainContainer = <View>this.mainContainer.nativeElement;
    mainContainer.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    });
  }

  startBackgroundAnimation(background) {
    background.animate({
      scale: { x: 1.0, y: 1.0 },
      duration: 10000
    });
  }

  showMainContent() {
    let initialContainer = <View>this.initialContainer.nativeElement;
    let mainContainer = <View>this.mainContainer.nativeElement;
    let logoContainer = <View>this.logoContainer.nativeElement;
    let formControls = <View>this.formControls.nativeElement;
    let signUpStack = <View>this.signUpStack.nativeElement;
    let animations = [];

    // Fade out the initial content over one half second
    initialContainer.animate({
      opacity: 0,
      duration: 500
    }).then(function() {
      // After the animation completes, hide the initial container and
      // show the main container and logo. The main container and logo will
      // not immediately appear because their opacity is set to 0 in CSS.
      initialContainer.style.visibility = "collapse";
      mainContainer.style.visibility = "visible";
      logoContainer.style.visibility = "visible";

      // Fade in the main container and logo over one half second.
      animations.push({ target: mainContainer, opacity: 1, duration: 500 });
      animations.push({ target: logoContainer, opacity: 1, duration: 500 });

      // Slide up the form controls and sign up container.
      animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
      animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });

      // Kick off the animation queue
      new Animation(animations, false).play();
    });
  }

  setTextFieldColors() {
    let emailTextField = <TextField>this.email.nativeElement;
    let passwordTextField = <TextField>this.password.nativeElement;

    let mainTextColor = new Color(this.isLoggingIn ? "black" : "#C4AFB4");
    emailTextField.color = mainTextColor;
    passwordTextField.color = mainTextColor;

    let hintColor = new Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
    setHintColor({ view: emailTextField, color: hintColor });
    setHintColor({ view: passwordTextField, color: hintColor });
  }
}
