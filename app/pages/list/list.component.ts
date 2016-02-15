import {Component, ChangeDetectionStrategy} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {ActionItem} from "ui/action-bar";
import {TextField} from "ui/text-field";
import {topmost} from "ui/frame";

import {Grocery, GroceryList} from "../../shared/view-models/grocery-list";

var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPage {
  groceryList: GroceryList;
  grocery: string;
  isLoading: boolean;

  constructor(private router: Router) {
    this.groceryList = new GroceryList();
    this.grocery = "";
    this.isLoading = true;

    this.groceryList.empty();
    this.groceryList.load().then(() => {
      this.isLoading = false;
    });
  }

  add() {
    // Check for empty submissions
    var groceryTextField = <TextField>topmost().currentPage.getViewById("grocery");
    if (this.grocery.trim() === "") {
      dialogsModule.alert({
        message: "Enter a grocery item",
        okButtonText: "OK"
      });
      return;
    }

    // Dismiss the keyboard
    groceryTextField.dismissSoftInput();
      this.groceryList.add(this.grocery)
        .catch(() => {
          dialogsModule.alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
        });

      // Empty the input field
      this.grocery = "";
  }

  share() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = this.groceryList.items.length; i < size ; i++) {
      list.push(this.groceryList.items[i].name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }

  delete(index) {
    this.groceryList.delete(index);
  }
}
