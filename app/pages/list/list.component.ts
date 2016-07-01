import {Component, ElementRef, NgZone, OnInit, ViewChild} from "@angular/core";
import {TextField} from "ui/text-field";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
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

  constructor(
    private _groceryListService: GroceryListService,
    private _zone: NgZone) {}

  ngOnInit() {
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

    console.log("add start");
    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          console.log("add done");
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

  delete(grocery: Grocery) {
    this._groceryListService.delete(grocery.id)
      .subscribe(() => {
        // Running the change detection in a zone ensures that change
        // detection gets triggered if needed.
        this._zone.run(() => {
          var index = this.groceryList.indexOf(grocery);
          this.groceryList.splice(index, 1);
        });
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
}