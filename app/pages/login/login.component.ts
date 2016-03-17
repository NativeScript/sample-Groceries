import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";
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

  constructor(
    private _router: Router,
    private _userService: UserService) {

    this.user = new User();

    // Hardcode a few values to make testing easy
    // this.user.email = "nativescriptrocks@telerik.com";
    // this.user.password = "password";
  }

  ngOnInit() {
    var page = <Page>topmost().currentPage;
    page.actionBarHidden = true;
  }

  signIn() {
    this._userService.login(this.user)
      .subscribe(
        () => this._router.navigate(["List"]),
        (error) => alert("Unfortunately we could not find your account.")
      );
  }

  register() {
    this._router.navigate(["Register"]);
  }
}
