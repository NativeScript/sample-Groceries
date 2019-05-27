import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { action } from "ui/dialogs";
import { Color } from "color";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import * as SocialShare from "nativescript-social-share";

import { GroceryListComponent } from "./grocery-list/grocery-list.component";
import { GroceryService } from "./shared";
import { LoginService, alert } from "../shared";

@Component({
  selector: "gr-groceries",
  moduleId: module.id,
  templateUrl: "./groceries.component.html",
  styleUrls: ["./groceries-common.css", "./groceries.component.css"],
  providers: [GroceryService]
})
export class GroceriesComponent implements OnInit {
  grocery: string = "";
  isShowingRecent = false;
  isLoading = false;

  @ViewChild("groceryTextField", { read: ElementRef, static: false }) groceryTextField: ElementRef;

  constructor(private router: Router,
    private store: GroceryService,
    private loginService: LoginService,
    private page: Page) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  // Prevent the first textfield from receiving focus on Android
  // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
  handleAndroidFocus(textField, container) {
    if (container.android) {
      container.android.setFocusableInTouchMode(true);
      container.android.setFocusable(true);
      textField.android.clearFocus();
    }
  }

  showActivityIndicator() {
    this.isLoading = true;
  }
  hideActivityIndicator() {
    this.isLoading = false;
  }

  add(target: string) {
    // If showing recent groceries the add button should do nothing.
    if (this.isShowingRecent) {
      return;
    }

    let textField = <TextField>this.groceryTextField.nativeElement;

    if (this.grocery.trim() === "") {
      // If the user clicked the add button, and the textfield is empty,
      // focus the text field and return.
      if (target === "button") {
        textField.focus();
      } else {
        // If the user clicked return with an empty text field show an error.
        alert("Enter a grocery item");
      }
      return;
    }

    // Dismiss the keyboard
    // TODO: Is it better UX to dismiss the keyboard, or leave it up so the
    // user can continue to add more groceries?
    textField.dismissSoftInput();

    this.showActivityIndicator();
    this.store.add(this.grocery)
      .subscribe(
        () => {
          this.grocery = "";
          this.hideActivityIndicator();
        },
        () => {
          alert("An error occurred while adding an item to your list.");
          this.hideActivityIndicator();
        }
      );
  }

  toggleRecent() {
    this.isShowingRecent = !this.isShowingRecent;
  }

  showMenu() {
    action({
      message: "What would you like to do?",
      actions: ["Share", "Log Off"],
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result === "Share") {
        this.share();
      } else if (result === "Log Off") {
        this.logoff();
      }
    });
  }

  share() {
    let items = this.store.items.value;
    let list = [];
    for (let i = 0, size = items.length; i < size ; i++) {
      list.push(items[i].name);
    }
    SocialShare.shareText(list.join(", ").trim());
  }

  logoff() {
    this.loginService.logoff();
    this.router.navigate(["/login"]);
  }
}
