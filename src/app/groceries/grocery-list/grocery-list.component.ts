import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { Grocery, GroceryService } from "../shared";

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
          (click)="delete(grocery)">&times;</button>
        <img
          *ngIf="!grocery.deleted && grocery.deleting"
          src="./assets/loading.gif">
      </li>
    </ul>
  `,
  styleUrls: ["./grocery-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceryListComponent {
  @Input() showDeleted: boolean;
  @Output() loaded = new EventEmitter();

  constructor(public store: GroceryService) {}

  ngOnInit() {
    this.store.load()
      .subscribe(() => this.loaded.emit("loaded"));
  }

  imageSource(grocery) {
    if (grocery.deleted) {
      return "./assets/plus.png";
    }
    return grocery.done ? "./assets/checked.png" : "./assets/unchecked.png";
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      this.store.unsetDeleteFlag(grocery)
        .subscribe(
          () => { },
          () => {
            alert("An error occurred managing your grocery list.");
          }
        );
    } else {
      this.store.toggleDoneFlag(grocery)
        .subscribe(
          () => { },
          () => {
            alert("An error occurred managing your grocery list.");
          }
        );
      }
  }

  delete(grocery: Grocery) {
    // grocery.deleting = true;

    let successHandler = () => {};
    let errorHandler = () => {
      alert("An error occurred while deleting an item from your list.");
    };

    if (grocery.deleted) {
      this.store.permanentlyDelete(grocery)
        .subscribe(successHandler, errorHandler);
    } else {
      this.store.setDeleteFlag(grocery)
        .subscribe(successHandler, errorHandler);
    }
  }
}
