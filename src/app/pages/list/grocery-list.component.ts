import {ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";

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

@Component({
  selector: "grocery-list",
  template: `
    <ul>
      <li *ngFor="let grocery of store.items | async | itemStatus:showDeleted">
        <img
          [src]="imageSource(grocery)"
          (click)="toggleDone(grocery)">
        <span
          [class.done]="grocery.done && !grocery.deleted">{{ grocery.name }}</span>
        <button
          *ngIf="!grocery.deleted"
          (click)="delete(grocery)">&times;</button>
      </li>
    </ul>
  `,
  styleUrls: ["./app/pages/list/grocery-list.css"],
  pipes: [ItemStatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceryList {
  @Input() showDeleted: boolean;
  @Output() loaded = new EventEmitter();

  constructor(private store: GroceryStore) {}

  ngOnInit() {
    this.store.load()
      .subscribe(() => this.loaded.emit("loaded"));
  }

  imageSource(grocery) {
    if (grocery.deleted) {
      return grocery.done ? "./app/assets/images/selected.png" : "./app/assets/images/nonselected.png"
    }
    return grocery.done ? "./app/assets/images/checked.png" : "./app/assets/images/unchecked.png";
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      grocery.done = !grocery.done;
      return;
    }

    this.store.toggleDoneFlag(grocery)
      .subscribe(
        () => {},
        () => { alert("An error occurred managing your grocery list") }
      );
  }

  delete(grocery: Grocery) {
    this.store.setDeleteFlag(grocery)
      .subscribe(
        () => {},
        () => alert("An error occurred while deleting an item from your list.")
      );
  }
}
