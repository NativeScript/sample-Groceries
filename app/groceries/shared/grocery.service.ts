import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { BackendService } from "../../shared";
import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);

  private allItems: Array<Grocery> = [];

  constructor(private http: Http, private zone: NgZone) { }

  load() {
    let headers = this.getHeaders();
    headers.append("X-Everlive-Sort", JSON.stringify({ ModifiedAt: -1 }));

    return this.http.get(BackendService.apiUrl + "Groceries", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      data.Result.forEach((grocery) => {
        this.allItems.push(
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
    return this.http.post(
      BackendService.apiUrl + "Groceries",
      JSON.stringify({ Name: name }),
      { headers: this.getHeaders() }
    )
    .map(res => res.json())
    .map(data => {
      this.allItems.unshift(new Grocery(data.Result.Id, name, false, false));
      this.publishUpdates();
    })
    .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    return this.put(item.id, { Deleted: true, Done: false })
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
    return this.put(item.id, { Done: item.done })
      .map(res => res.json());
  }

  restore() {
    let indeces = [];
    this.allItems.forEach((grocery) => {
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

    return this.http.put(
      BackendService.apiUrl + "Groceries",
      JSON.stringify({
        Deleted: false,
        Done: false
      }),
      { headers: headers }
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
        BackendService.apiUrl + "Groceries/" + item.id,
        { headers: this.getHeaders() }
      )
      .map(res => res.json())
      .map(data => {
        let index = this.allItems.indexOf(item);
        this.allItems.splice(index, 1);
        this.publishUpdates();
      })
      .catch(this.handleErrors);
  }

  private put(id: string, data: Object) {
    return this.http.put(
      BackendService.apiUrl + "Groceries/" + id,
      JSON.stringify(data),
      { headers: this.getHeaders() }
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

  private getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + BackendService.token);
    return headers;
  }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}