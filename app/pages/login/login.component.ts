import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {Color} from "color";
import {alert} from "ui/dialogs";
import {topmost} from "ui/frame";
import {Page} from "ui/page";

import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";

@Component({
  selector: "login",
  templateUrl: "pages/login/login.html",
  providers: [UserService]
})
export class LoginPage implements OnInit {
  user: User;
  isLoggingIn = true;
  page: Page;

  constructor(
    private _router: Router,
    private _userService: UserService) {

    this.user = new User();

    // Hardcode a few values to make testing easy
    // this.user.email = "nativescriptrocks@telerik.com";
    // this.user.password = "password";
  }

  ngOnInit() {
    this.page = <Page>topmost().currentPage;
    this.page.actionBarHidden = true;
  }

  submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this._userService.login(this.user)
      .subscribe(
        () => this._router.navigate(["List"]),
        (error) => alert("Unfortunately we could not find your account.")
      );
  }

  signUp() {
    this._userService.register(this.user)
      .subscribe(
        () => {
          alert("Your account was successfully created.")
            .then(() => this.toggleDisplay());
        },
        () => alert("Unfortunately we were unable to create your account.")
      );
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.page.getViewById("container").animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    });
  }
}
