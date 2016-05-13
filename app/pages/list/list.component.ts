import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {action} from "ui/dialogs";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
import {alert} from "../../utils/dialog-util";
var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListPage implements OnInit {
  groceryList: Array<Grocery> = [];
  grocery: string = "";
  isLoading = false;
  listLoaded = false;

  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _router: Router,
    private _groceryListService: GroceryListService,
    private page: Page) {}

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
    this.isLoading = true;

    this._groceryListService.load()
      .subscribe(loadedGroceries => {
        loadedGroceries.forEach((groceryObject) => {
          this.groceryList.unshift(groceryObject);
        });
        this.isLoading = false;
        this.listLoaded = true;
      });
  }

  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.groceryList.unshift(groceryObject);
          this.grocery = "";
        },
        () => {
          alert("An error occurred while adding an item to your list.");
          this.grocery = "";
        }
      )
  }

  toggleDone(grocery: Grocery) {
    this.isLoading = true;
    this._groceryListService.toggleDone(grocery)
      .subscribe(() => {
        grocery.done = !grocery.done;
        this.isLoading = false;
      }, () => {
        alert("An error occurred managing your grocery list.");
        this.isLoading = false;
      });
  }

  delete(grocery: Grocery) {
    this._groceryListService.delete(grocery)
      .subscribe(() => {
        var index = this.groceryList.indexOf(grocery);
        this.groceryList.splice(index, 1);
      })
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
    let list = [];
    for (let i = 0, size = this.groceryList.length; i < size ; i++) {
      list.push(this.groceryList[i].name);
    }
    let listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }

  logoff() {
    this._router.navigate(["Login"]);
  }
}