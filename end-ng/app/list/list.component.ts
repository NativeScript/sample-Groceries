import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ListViewEventData, RadListView } from "nativescript-pro-ui/listview";
import { TextField } from "tns-core-modules/ui/text-field";
import { View } from "tns-core-modules/ui/core/view";

import { Grocery } from "../shared/grocery/grocery.model";
import { GroceryService } from "../shared/grocery/grocery.service";

@Component({
  selector: "gr-list",
  templateUrl: "list/list.component.html",
  styleUrls: ["list/list.component.css"],
  providers: [GroceryService]
})
export class ListComponent implements OnInit {
  groceryList: Array<Grocery> = [];
  grocery = "";
  isLoading = false;
  listLoaded = false;
  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private groceryService: GroceryService) {}

  ngOnInit() {
    this.isLoading = true;
    this.groceryService.load()
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
  
    this.groceryService.add(this.grocery)
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

  onSwipeCellStarted(args: ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;
    var swipeView = args.object;
    var rightItem = swipeView.getViewById<View>("delete-view");
    swipeLimits.right = rightItem.getMeasuredWidth();
    swipeLimits.left = 0;
    swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
  }

  delete(args: ListViewEventData) {
    let grocery = <Grocery>args.object.bindingContext;
    this.groceryService.delete(grocery.id)
      .subscribe(() => {
        let index = this.groceryList.indexOf(grocery);
        this.groceryList.splice(index, 1);
      });
  }
}