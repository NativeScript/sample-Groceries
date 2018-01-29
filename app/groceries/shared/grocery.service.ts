import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/map";

import { BackendService } from "../../shared";
import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private allItems: Array<Grocery> = [];
  baseUrl = BackendService.baseUrl + "appdata/" + BackendService.appKey + "/Groceries";

  constructor(private http: Http, private zone: NgZone) { }

  load() {
    return this.http.get(this.baseUrl, {
      headers: this.getCommonHeaders()
    })
    .map(res => res.json())
    .map(data => {
      data.forEach((grocery) => {
        this.allItems.push(
          new Grocery(
            grocery._id,
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
    return this.http.post(
      this.baseUrl,
      JSON.stringify({ Name: name }),
      { headers: this.getCommonHeaders() }
    )
    .map(res => res.json())
    .map(data => {
      this.allItems.unshift(new Grocery(data._kmd._id, name, false, false));
      this.publishUpdates();
    })
    .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    item.deleted = true;
    item.done = false;
    return this.put(item)
      .map(res => res.json())
      .map(data => {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
      });
  }

  toggleDoneFlag(item: Grocery) {
    item.done = !item.done;
    this.publishUpdates();
    return this.put(item)
      .map(res => res.json());
  }

  restore() {
    let indeces = [];
    this.allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        indeces.push(grocery.id);
      }
    });

    return this.http.put(
      BackendService.apiUrl + "Groceries",
      JSON.stringify({
        Deleted: false,
        Done: false
      }),
      { headers: this.getCommonHeaders() }
    )
    .map(res => res.json())
    .map(data => {
      this.allItems.forEach((grocery) => {
        if (grocery.deleted && grocery.done) {
          grocery.deleted = false;
          grocery.done = false;
        }
      });
      this.publishUpdates();
    })
    .catch(this.handleErrors);
  }

  permanentlyDelete(item: Grocery) {
    return this.http
      .delete(
        this.baseUrl + "/" + item.id,
        { headers: this.getCommonHeaders() }
      )
      .map(res => res.json())
      .map(data => {
        let index = this.allItems.indexOf(item);
        this.allItems.splice(index, 1);
        this.publishUpdates();
      })
      .catch(this.handleErrors);
  }

  private put(grocery: Grocery) {
    return this.http.put(
      this.baseUrl + "/" + grocery.id,
      JSON.stringify({
        Name: grocery.name,
        Done: grocery.done,
        Deleted: grocery.deleted
      }),
      { headers: this.getCommonHeaders() }
    )
    .catch(this.handleErrors);
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  private getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Kinvey " + BackendService.token);
    return headers;
  }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}