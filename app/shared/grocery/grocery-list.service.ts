import {Injectable} from "@angular/core";
import {Http, Headers, Response, ResponseOptions} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable, BehaviorSubject} from "rxjs/Rx";
import "rxjs/add/operator/map";

@Injectable()
export class GroceryStore {

  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private _allItems: Array<Grocery> = [];

  constructor(private _http: Http) {}

  load() {
    Config.el.authentication.setAuthorization(Config.token, "bearer");
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
          this.publishUpdates();
        });
      });
  }

  add(name: string) {
    let newGrocery = new Grocery("", name, false, false);
    this._allItems.unshift(newGrocery);
    this.publishUpdates();
    return Config.el.data("Groceries")
      .create({ Name: name })
      .then((data) => {
        newGrocery.id = data.result.Id;
      });
  }

  getItems() {
    return this._allItems;
  }

  setDeleteFlag(item: Grocery) {
    item.deleted = true;
    item.done = false;
    this.publishUpdates();
    return Config.el.data("Groceries")
      .updateSingle({ Id: item.id, Deleted: true, Done: true });
  }

  toggleDoneFlag(item: Grocery) {
    item.done = !item.done;
    this.publishUpdates();
    return Config.el.data("Groceries")
      .updateSingle({ Id: item.id, Done: !item.done });
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
      .update({ Deleted: false, Done: false });
  }

  publishUpdates() {
    // must emit a *new* value (immutability!)
    this.items.next([...this._allItems]);
  }
}