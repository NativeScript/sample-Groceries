import {Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform, ChangeDetectionStrategy} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";
import {Observable, BehaviorSubject} from "rxjs/Rx";

declare var UIColor: any;

@Pipe({
  name: "itemStatus"
})
export class ItemStatusPipe implements PipeTransform {
  transform(items: Array<Grocery>, deleted: boolean) {
    if (!items) return;
    return items.filter((grocery: Grocery) => {
      return grocery.deleted == deleted;
    });
  }
}

@Component({
  selector: "GroceryList",
  template: `
    <ListView
      [row]="row"
      [class.visible]="listLoaded"
      [items]="store.items | async | itemStatus:showDeleted"
      (itemLoading)="makeBackgroundTransparent($event)"
      (loaded)="load()">
      <template let-item="item">
        <GridLayout
          columns="auto, *, auto"
          class="grocery-list-item-container"
          [opacity]="item.done ? '0.8' : '1'">
          <Image
            col="0"
            [src]="imageSource(item)"
            class="grocery-list-check-box"
            (tap)="toggleDone(item)"></Image>
          <Label
            col="1"
            [text]="item.name"
            [class.line-through]="item.done && !item.deleted"></Label>
          <StackLayout
            *ngIf="!item.deleted"
            col="2"
            class="delete-container"
            (tap)="delete(item)">
            <Image src="res://delete"></Image>
          </StackLayout>
        </GridLayout>
      </template>
    </ListView>
  `,
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
    this.loading.emit("loading");
    this.store.load()
      .subscribe(() => {
        this.loaded.emit("loaded");
        this.listLoaded = true;
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
      return grocery.done ? "res://selected" : "res://nonselected"
    }
    return grocery.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      grocery.done = !grocery.done;
      return;
    }

    this.loading.emit("loading");
    this.store.toggleDoneFlag(grocery)
      .subscribe(() => {
        this.loaded.emit("loaded");
      }, () => {
        alert("An error occurred managing your grocery list.");
        this.loaded.emit("loaded");
      });
  }

  delete(grocery: Grocery) {
    this.loading.emit("loading");
    this.store.setDeleteFlag(grocery)
      .subscribe(
        () => this.loaded.emit("loaded"),
        () => {
          alert("An error occurred while deleting an item from your list.");
          this.loaded.emit("loaded");
        }
      );
  }
}
