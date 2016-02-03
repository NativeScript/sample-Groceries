import {Component, ChangeDetectionStrategy} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {ActionItem} from "ui/action-bar";
import {TextField} from "ui/text-field";
import {topmost} from "ui/frame";

import {Grocery, GroceryList} from "./grocery-list";
import {ActionBarUtil} from "../../shared/utils/action-bar-util";

var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");

@Component({
    selector: "list",
    templateUrl: "views/list/list.html",
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

    configureActionBar() {
        ActionBarUtil.setTitle("Groceries");
        ActionBarUtil.emptyActionBarItems();

        var logoutButton = new ActionItem();
        logoutButton.text = "Logout";
        logoutButton.on("tap", () => {
            this.router.navigate(["Login"]);
        });
        ActionBarUtil.addButton(logoutButton);

        var shareButton = new ActionItem();
        shareButton.text = "Share";
        if (shareButton.ios) {
            shareButton.ios.position = "right";
        }
        shareButton.on("tap", () => { this.share() });
        ActionBarUtil.addButton(shareButton);
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
