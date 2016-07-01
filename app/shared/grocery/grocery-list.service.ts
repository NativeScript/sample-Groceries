import {Injectable, NgZone} from "@angular/core";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable, BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class GroceryStore {
  constructor(private _zone: NgZone) { }

  public items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private _allItems: Array<Grocery> = [];

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

  loadItems() {
    return Config.el.data("Groceries")
      .withHeaders({ "X-Everlive-Sort": JSON.stringify({ ModifiedAt: -1 }) })
      .get()
      .then((data) => {
        data.result.forEach((grocery) => {
          this._allItems.push(
            new Grocery(
              grocery.Id,
              grocery.Name,
              grocery.Done || false,
              grocery.Deleted || false
            )
          );
        });

        this.publishUpdates();
        return Promise.resolve(this._allItems);
      })
      .catch(this.handleErrors);
  }

  add(name: string) {
    let newGrocery = new Grocery("", name, false, false);
    this._allItems.unshift(newGrocery);
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
    var newItem = new Grocery(item.id, item.name, false, true);
    this.updateSingleItem(item, newItem);

    this.publishUpdates();
    return this.syncItem(newItem);
  }

  toggleDoneFlag(item: Grocery, skipSync: boolean = false) {
    var newItem = new Grocery(item.id, item.name, !item.done, item.deleted);
    this.updateSingleItem(item, newItem);

    this.publishUpdates();
    if (skipSync) {
      return Promise.resolve(true);
    } else {
      return this.syncItem(newItem);
    }
  }

  updateSingleItem(item: Grocery, newItem: Grocery) {
    const index = this._allItems.indexOf(item);
    this._allItems.splice(index, 1, newItem);
  }

  syncItem(item: Grocery) {
    return Config.el.data("Groceries")
      .updateSingle({ Id: item.id, Name: item.name, Deleted: item.deleted, Done: item.done })
      .catch(this.handleErrors);
  }

  restore() {
    let indeces = [];
    this._allItems.forEach((grocery) => {
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

  publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detectionis triggered if needed
    this._zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this._allItems]);
    });
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}