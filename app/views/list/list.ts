import {Component} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {Observable} from "data/observable";
import {ActionItem} from "ui/action-bar";
import {TextField} from "ui/text-field";

import {GroceryListViewModel} from "../../shared/view-models/grocery-list-view-model";
import {ActionBarUtil} from "../../shared/utils/action-bar-util";
import {Config} from "../../shared/config";

var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");

@Component({
    selector: "list",
    templateUrl: "views/list/list.html"
})

export class ListPage {
    groceryList: GroceryListViewModel;
    grocery: string;
    isLoading: boolean;

    constructor(private router: Router) {
        this.groceryList = new GroceryListViewModel([]);
        this.grocery = "";
        this.isLoading = true;

        this.configureActionBar();

        this.groceryList.empty();
        this.groceryList.load().then(() => {
            this.isLoading = false;
        })

        /*var page = Config.page;
        var listView = page.getViewById("groceryList");

        if (page.ios) {
            swipeDelete.enable(listView, (index) => {
                this.delete(index);
            });
        }
        
        this.groceryList.empty();
        this.groceryList.load().then(() => {
            this.isLoading = false;
            listView.animate({
                opacity: 1,
                duration: 1000
            });
        });*/
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
        var groceryTextField = <TextField>Config.page.getViewById("grocery");
        if (groceryTextField.text.trim() === "") {
            dialogsModule.alert({
                message: "Enter a grocery item",
                okButtonText: "OK"
            });
            return;
        }

        // Dismiss the keyboard
        groceryTextField.dismissSoftInput();

        this.groceryList.add(groceryTextField.text)
            .catch(function() {
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });

        // Empty the input field
        groceryTextField.text = "";
    }

    share() {
        var list = [];
        var finalList = "";
        for (var i = 0, size = this.groceryList.length; i < size ; i++) {
            list.push(this.groceryList.getItem(i).name);
        }
        var listString = list.join(", ").trim();
        socialShare.shareText(listString);
    }

    delete(index) {
        this.groceryList.delete(index);
    }
}
