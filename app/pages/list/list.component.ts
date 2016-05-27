import {Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Color} from "color";
import {action} from "ui/dialogs";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryList} from "../list/grocery-list.component";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";
import {alert} from "../../utils/dialog-util";
import {setHintColor} from "../../utils/hint-util";
import "rxjs/add/operator/map";
var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  directives: [GroceryList],
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryStore]
})
export class ListPage implements OnInit {
  grocery: string = "";
  isAndroid;
  isShowingRecent = false;
  isLoading = false;
  
  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _router: Router,
    private store: GroceryStore,
    private page: Page) {}

  ngOnInit() {
    this.isAndroid = !!this.page.android;
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
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

  add() {
    if (this.isShowingRecent) {
      return;
    }

    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.isLoading = true;
    this.store.add(this.grocery)
      .subscribe(
        () => {
          this.grocery = "";
          this.isLoading = false;
        },
        () => {
          alert("An error occurred while adding an item to your list.");
          this.isLoading = false;
        }
      );
  }

  toggleRecent() {
    if (!this.isShowingRecent) {
      this.isShowingRecent = true;
      return;
    }

    this.isLoading = true;
    this.store.restore()
      .subscribe(
        () => {
          this.isShowingRecent = false;
          this.isLoading = false;
        },
        () => {
          alert("An error occurred while adding groceries to your list.");
          this.isLoading = false;
        }
      );
  }

  delete(grocery: Grocery) {
    this.isLoading = true;
    this.store.setDeleteFlag(grocery)
      .subscribe(
        () => this.isLoading = false,
        () => {
          alert("An error occurred while deleting an item from your list.");
          this.isLoading = false;
        }
      );
  }

  showMenu() {
    action({
      message: "What would you like to do?",
      actions: ["Share", "Log Off"],
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result == "Share") {
        this.share();
      } else if (result == "Log Off") {
        this.logoff();
      }
    });
  }

  share() {
    let items = this.store.getItems();
    let list = [];
    for (let i = 0, size = items.length; i < size ; i++) {
      list.push(items[i].name);
    }
    socialShare.shareText(list.join(", ").trim());
  }

  logoff() {
    this._router.navigate(["Login"]);
  }
}
