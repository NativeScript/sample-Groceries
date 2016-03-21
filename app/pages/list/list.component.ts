import {Component, ChangeDetectionStrategy, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {EventData} from "data/observable";
import {alert} from "ui/dialogs";
import {TextField} from "ui/text-field";
import {topmost} from "ui/frame";

import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
import {setHintColor} from "../../utils/hint-util";

var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  providers: [GroceryListService]
})
export class ListPage implements OnInit {
  groceryList: Array<Grocery> = [];
  grocery: string;
  isLoading: boolean;

  constructor(
    private _groceryListService: GroceryListService,
    private _router: Router) {

    this.grocery = "";
    this.isLoading = true;
  }

  ngOnInit() {
    this._groceryListService.load()
      .subscribe(loadedGroceries => {
        loadedGroceries.forEach((groceryObject) => {
          this.groceryList.unshift(groceryObject);
        });
      });
  }

  setHintColor(args: EventData) {
    var grocery = <TextField>args.object;
    setHintColor({ view: grocery, color: "#FFFFFF" });
  }

  add() {
    // Check for empty submissions
    var groceryTextField = <TextField>topmost().currentPage.getViewById("grocery");
    if (this.grocery.trim() === "") {
      alert({
        message: "Enter a grocery item",
        okButtonText: "OK"
      });
      return;
    }

    // Dismiss the keyboard
    groceryTextField.dismissSoftInput();

    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.groceryList.unshift(groceryObject);
          this.grocery = "";
        },
        () => {
          alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
          this.grocery = "";
        }
      )
  }

  share() {
    var list = [];
    for (var i = 0, size = this.groceryList.length; i < size ; i++) {
      list.push(this.groceryList[i].name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }
}
