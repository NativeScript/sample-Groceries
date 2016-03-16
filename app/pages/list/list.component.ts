import {Component, ChangeDetectionStrategy, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {Observable} from "rxjs/Observable";

import * as dialogsModule from "ui/dialogs";
import {ActionItem} from "ui/action-bar";
import {TextField} from "ui/text-field";
import {topmost} from "ui/frame";
import {WrappedValue} from "data/observable";

import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  // TODO: Why is this necessary?
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GroceryListService]
})
export class ListPage implements OnInit {
  groceryList: Observable<Array<Grocery>>;
  grocery: string;
  isLoading: boolean;

  private subscr;
  private items: Array<Grocery> = [];

  constructor(
    private _groceryListService: GroceryListService,
    private router: Router) {

    this.grocery = "";
    this.isLoading = true;

    // TODO: I have no idea what’s going on here
    this.groceryList = Observable.create(subscriber => {
      this.subscr = subscriber;
      subscriber.next(this.items);
    });
  }

  ngOnInit() {
    this._groceryListService.load()
      .subscribe(loadedGroceries => {
        this.items = loadedGroceries;
        this.updateList();
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

    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.items.push(groceryObject);
          this.updateList();
          this.grocery = "";
        },
        () => {
          dialogsModule.alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
          this.grocery = "";
        }
      )
  }

  updateList() {
    this.subscr.next(this.items);
  }

  //delete(grocery) {
    //this._groceryListService.delete(grocery.id)
      //.subscribe(() => {
        //var index = this.groceryList.indexOf(grocery);
        //this.groceryList.splice(index, 1);
      //});
  //}
}
