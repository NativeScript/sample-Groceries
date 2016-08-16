import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "color";
import { action } from "ui/dialogs";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { Config } from "../shared/config";
import { GroceryList } from "./grocery-list/grocery-list.component";
import { GroceryService } from "./shared/grocery.service";
import { alert } from "../shared/dialog-util";
import { setHintColor } from "../shared/hint-util";
import * as SocialShare from "nativescript-social-share";

@Component({
  selector: "list",
  directives: [GroceryList],
  templateUrl: "groceries/groceries.component.html",
  styleUrls: ["groceries/groceries-common.css", "groceries/groceries.component.css"],
  providers: [GroceryService]
})
export class ListPageComponent implements OnInit {
  grocery: string = "";
  isAndroid;
  isShowingRecent = false;
  isLoading = false;

  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _router: Router,
    private store: GroceryService,
    private page: Page) {}

  ngOnInit() {
    this.isAndroid = !!this.page.android;
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
    Config.setupConnectionMonitoring();
  }

  setTextFieldHintColor(textField) {
    // TODO: Why is it necessary to defer this code on iOS?
    // It should work without the setTimeout like it does on Android.
    setTimeout(() => {
      setHintColor({
        view: <TextField>textField,
        color: new Color("white")
      });
    });
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

    this.store.add(this.grocery)
      .catch(() => {
        alert("An error occurred while adding an item to your list.");
      });

    this.grocery = "";
  }

  toggleRecent() {
    if (!this.isShowingRecent) {
      this.isShowingRecent = true;
      return;
    }

    this.store.restore()
      .catch(() => {
        alert("An error occurred while adding groceries to your list.");
      });

    this.isShowingRecent = false;
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
    Config.invalidateToken();
    this._router.navigate(["/login"]);
  }
}
