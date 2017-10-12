import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core";
import { Page } from "ui/page";
import { GridLayout } from "ui/layouts/grid-layout";
import { TextField } from "ui/text-field";

import { Grocery} from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";
import { isIPhoneX } from "../../utils/status-bar-util";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListComponent implements OnInit {
  groceryList: Array<Grocery> = [];
  grocery = "";
  isLoading = false;
  listLoaded = false;

  @ViewChild("groceryTextField") groceryTextField: ElementRef;
  @ViewChild("addBar") addBar: ElementRef;

  constructor(private groceryListService: GroceryListService,
    private zone: NgZone,
    private page: Page) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.groceryListService.load()
      .subscribe(loadedGroceries => {
        loadedGroceries.forEach((groceryObject) => {
          this.groceryList.unshift(groceryObject);
        });
        this.isLoading = false;
        this.listLoaded = true;
      });

    // This is a hack.
    // TODO: Why doesn’t this work in CSS?
    if (isIPhoneX()) {
      let addBar = <GridLayout>this.addBar.nativeElement;
      addBar.paddingTop = 12;
      addBar.paddingBottom = 12;
    }
  }

  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.groceryListService.add(this.grocery)
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
      );
  }

  delete(grocery: Grocery) {
    this.groceryListService.delete(grocery.id)
      .subscribe(() => {
        // Running the array splice in a zone ensures that change detection gets triggered.
        this.zone.run(() => {
          let index = this.groceryList.indexOf(grocery);
          this.groceryList.splice(index, 1);
        });
      });
  }
}