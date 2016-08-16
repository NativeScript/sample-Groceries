import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from "@angular/core";
import { Grocery, GroceryService } from "../shared";
import { alert } from "../../shared";
import { ItemStatusPipe } from "./item-status.pipe";
declare var UIColor: any;

@Component({
  selector: "grocery-list",
  templateUrl: "groceries/grocery-list/grocery-list.component.html",
  styleUrls: ["groceries/grocery-list/grocery-list.component.css"],
  pipes: [ItemStatusPipe],
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
      .then(() => {
        this.loaded.next("");
        this.listLoaded = true;
      })
      .catch(() => {
        alert("An error occurred loading your grocery list.");
      });
  }

  // The following trick makes the background color of each cell
  // in the UITableView transparent as it’s created.
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      cell.backgroundColor = UIColor.clearColor();
    }
  }

  imageSource(grocery) {
    if (grocery.deleted) {
      return grocery.done ? "res://selected" : "res://nonselected";
    }
    return grocery.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(grocery: Grocery) {
    this.store.toggleDoneFlag(grocery, this.showDeleted)
      .catch(() => {
        alert("An error occurred managing your grocery list.");
      });
  }

  delete(grocery: Grocery) {
    this.store.setDeleteFlag(grocery)
      .catch(() => {
        alert("An error occurred while deleting an item from your list.");
      });
  }
}
