import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, Pipe, PipeTransform } from "@angular/core";
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryStore } from "../../shared/grocery/grocery-list.service";
import { alert } from "../../utils/dialog-util";

declare var UIColor: any;

@Pipe({
  name: "itemStatus"
})
export class ItemStatusPipe implements PipeTransform {
  value: Array<Grocery> = [];
  transform(items: Array<Grocery>, deleted: boolean) {
    if (items && items.length) {
      this.value = items.filter((grocery: Grocery) => {
        return grocery.deleted === deleted;
      });
    }
    return this.value;
  }
}

@Component({
  selector: "GroceryList",
  templateUrl: "pages/list/grocery-list.html",
  styleUrls: ["pages/list/grocery-list.css"],
  pipes: [ItemStatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceryList {
  @Input() showDeleted: boolean;
  @Input() row;
  @Output() loading = new EventEmitter();
  @Output() loaded = new EventEmitter();

  listLoaded = false;

  constructor(private store: GroceryStore) {}

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
