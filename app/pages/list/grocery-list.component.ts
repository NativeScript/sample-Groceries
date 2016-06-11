import {Component, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {alert} from "../../utils/dialog-util";

declare var UIColor: any;

@Pipe({
  name: "itemStatus"
})
export class ItemStatusPipe implements PipeTransform {
  value: Array<Grocery> = [];
  constructor(private _ref: ChangeDetectorRef) {}
  transform(items: Array<Grocery>, deleted: boolean) {
    if (items && items.length) {
      this.value = items.filter((grocery: Grocery) => {
        return grocery.deleted == deleted;
      });
      this._ref.markForCheck();
    }
    return this.value;
  }
}

/*@Pipe({
  name: "itemSort"
})
export class ArraySortPipe implements PipeTransform {
  value: Array<Grocery> = [];
  constructor(private _ref: ChangeDetectorRef) {}
  transform(items: Array<Grocery>, args: string): Array<string> {
    this.value = items.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return this.value;
  }
}*/

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

  // TODO: Implement loading indicators
  // This should start at false
  listLoaded = true;

  constructor(private store: GroceryStore) {
    this.load();
  }

  load() {
    this.loading.next("");
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
      return grocery.done ? "res://selected" : "res://nonselected"
    }
    return grocery.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      grocery.done = !grocery.done;
      return;
    }
    this.store.toggleDoneFlag(grocery)
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
