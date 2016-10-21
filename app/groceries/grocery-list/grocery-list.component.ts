import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from "@angular/core";
import * as utils from "utils/utils";

import { Grocery, GroceryService } from "../shared";
import { alert } from "../../shared";

declare var UIColor: any;

@Component({
  selector: "gr-grocery-list",
  templateUrl: "groceries/grocery-list/grocery-list.component.html",
  styleUrls: ["groceries/grocery-list/grocery-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceryListComponent {
  @Input() showDeleted: boolean;
  @Input() row;
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  listLoaded = false;

  constructor(private store: GroceryService) { }

  load() {
    this.loading.next("");
    this.store.load()
      .subscribe(
        () => {
          this.loaded.next("");
          this.listLoaded = true;
        },
        () => {
          alert("An error occurred loading your grocery list.");
        }
      );
  }

  // The following trick makes the background color of each cell
  // in the UITableView transparent as it’s created.
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      // support XCode 8
      cell.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
    }
  }

  imageSource(grocery) {
    if (grocery.deleted) {
      return grocery.done ? "res://selected" : "res://nonselected";
    }
    return grocery.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      grocery.done = !grocery.done;
      return;
    }

    this.store.toggleDoneFlag(grocery)
      .subscribe(
        () => { },
        () => {
          alert("An error occurred managing your grocery list.");
        }
      );
  }

  delete(grocery: Grocery) {
    this.loading.next("");
    this.store.setDeleteFlag(grocery)
      .subscribe(
        () => this.loaded.next(""),
        () => {
          alert("An error occurred while deleting an item from your list.");
          this.loaded.next("");
        }
      );
  }
}
