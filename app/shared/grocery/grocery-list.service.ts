import { Injectable, NgZone } from "@angular/core";
import { Config } from "../config";
import { Grocery } from "./grocery.model";
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class GroceryStore {
  public items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private allItems: Array<Grocery> = [];

  constructor(private zone: NgZone) { }

  load() {
    Config.el.authentication.setAuthorization(Config.token, "bearer");

    if (!Config.el.offlineStorage.isSynchronizing()) {
      return this.loadItems();
    }

    return new Promise((resolve, reject) => {
      Config.el.on("syncEnd", () => {
        this.loadItems()
          .then(() => { resolve(); })
          .catch(() => { reject(); });
      });
    });
  }

  private loadItems() {
    return Config.el.data("Groceries")
      .withHeaders({ "X-Everlive-Sort": JSON.stringify({ ModifiedAt: -1 }) })
      .get()
      .then((data) => {
        data.result.forEach((grocery) => {
          this.allItems.push(
            new Grocery(
              grocery.Id,
              grocery.Name,
              grocery.Done || false,
              grocery.Deleted || false
            )
          );
        });

        this.publishUpdates();
        return Promise.resolve(this.allItems);
      })
      .catch(this.handleErrors);
  }

  add(name: string) {
    let newGrocery = new Grocery("", name, false, false);
    this.allItems.unshift(newGrocery);
    this.publishUpdates();
    return Config.el.data("Groceries")
      .create({ Name: name })
      .then((data) => {
        newGrocery.id = data.result.Id;
        return Promise.resolve(newGrocery);
      })
      .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    const newItem = new Grocery(item.id, item.name, false, true);
    this.updateSingleItem(item, newItem);

    this.publishUpdates();
    return this.syncItem(newItem);
  }

  toggleDoneFlag(item: Grocery, skipSync: boolean = false) {
    const newItem = new Grocery(item.id, item.name, !item.done, item.deleted);
    this.updateSingleItem(item, newItem);

    this.publishUpdates();
    if (skipSync) {
      return Promise.resolve(true);
    } else {
      return this.syncItem(newItem);
    }
  }

  restore() {
    let indeces = [];
    this.allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        grocery.done = false;
        grocery.deleted = false;
        indeces.push(grocery.id);
      }
    });

    let headers = {
      "X-Everlive-Filter": JSON.stringify({
        "Id": { "$in": indeces }
      })
    };

    this.publishUpdates();
    return Config.el.data("Groceries")
      .withHeaders(headers)
      .update({ Deleted: false, Done: false })
      .catch(this.handleErrors);
  }

  private updateSingleItem(item: Grocery, newItem: Grocery) {
    const index = this.allItems.indexOf(item);
    this.allItems.splice(index, 1, newItem);
  }

  private syncItem(item: Grocery) {
    return Config.el.data("Groceries")
      .updateSingle({ Id: item.id, Name: item.name, Deleted: item.deleted, Done: item.done })
      .catch(this.handleErrors);
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  private handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}