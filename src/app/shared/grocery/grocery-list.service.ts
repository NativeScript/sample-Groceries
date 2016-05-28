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
    let headers = this.getHeaders();
    headers.append("X-Everlive-Sort", JSON.stringify({ ModifiedAt: -1 }));

    return this._http.get(Config.apiUrl + "Groceries", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      data.Result.forEach((grocery) => {
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
    })
    .catch(this.handleErrors);
  }

  add(name: string) {
    return this._http.post(
      Config.apiUrl + "Groceries",
      JSON.stringify({ Name: name }),
      { headers: this.getHeaders() }
    )
    .map(res => res.json())
    .map(data => {
      this._allItems.unshift(new Grocery(data.Result.Id, name, false, false));
      this.publishUpdates();
    })
    .catch(this.handleErrors);
  }

  private _put(id: string, data: Object) {
    return this._http.put(
      Config.apiUrl + "Groceries/" + id,
      JSON.stringify(data),
      { headers: this.getHeaders() }
    )
    .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    return this._put(item.id, { Deleted: true, Done: false })
      .map(res => res.json())
      .map(data => {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
      });
  }

  restore() {
    let indeces = [];
    this._allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        indeces.push(grocery.id);
      }
    });

    let headers = this.getHeaders();
    headers.append("X-Everlive-Filter", JSON.stringify({
      "Id": {
        "$in": indeces
      }
    }));

    return this._http.put(
      Config.apiUrl + "Groceries",
      JSON.stringify({
        Deleted: false,
        Done: false
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      this._allItems.forEach((grocery) => {
        if (grocery.deleted && grocery.done) {
          grocery.deleted = false;
          grocery.done = false;
        }
      });
      this.publishUpdates();
    })
    .catch(this.handleErrors);
  }

  toggleDoneFlag(item: Grocery) {
    return this._put(item.id, { Done: !item.done })
      .map(res => res.json())
      .map(data => {
        item.done = !item.done;
        this.publishUpdates();
      });
  }

  deleteForever(item: Grocery) {
    return this._http.delete(
      Config.apiUrl + "Groceries/" + item.id,
      { headers: this.getHeaders() }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    return headers;
  }

  publishUpdates() {
    this.items.next([...this._allItems]);
  }

  handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}