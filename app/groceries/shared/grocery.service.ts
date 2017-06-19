import { Injectable, NgZone } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { Kinvey } from 'kinvey-nativescript-sdk';

import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);

  private allItems: Array<Grocery> = [];

  constructor(private zone: NgZone) { }

  load() {
    const datastore = Kinvey.DataStore.collection('groceries');
    return datastore.find()
      .map(data => {
        this.allItems = [];
        data.forEach((grocery) => {
          this.allItems.push(
            new Grocery(
              grocery._id,
              grocery.name,
              grocery.done || false,
              grocery.deleted || false
            )
          );
          this.publishUpdates();
        });
      })
      .catch(this.handleErrors);
  }

  add(name: string) {
    const datastore = Kinvey.DataStore.collection('groceries');
    return datastore.save({ name: name })
      .then((data) => {
        this.allItems.unshift(new Grocery(data._id, name, false, false));
        this.publishUpdates();
      })
      .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    return this.put({ _id: item.id, deleted: true, done: false })
      .then(data => {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
      });
  }

  toggleDoneFlag(item: Grocery) {
    item.done = !item.done;
    this.publishUpdates();
    return this.put({ _id: item.id, done: item.done });
  }

  restore() {
    let indeces = [];
    this.allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        indeces.push(grocery.id);
      }
    });

    const datastore = Kinvey.DataStore.collection('groceries');
    const query = new Kinvey.Query();
    query.containsAll('_id', indeces);

    // return this.http.put(
    //   BackendService.apiUrl + "Groceries",
    //   JSON.stringify({
    //     Deleted: false,
    //     Done: false
    //   }),
    //   { headers: headers }
    // )
    // .map(res => res.json())
    // .map(data => {
    //   this.allItems.forEach((grocery) => {
    //     if (grocery.deleted && grocery.done) {
    //       grocery.deleted = false;
    //       grocery.done = false;
    //     }
    //   });
    //   this.publishUpdates();
    // })
    // .catch(this.handleErrors);
  }

  permanentlyDelete(item: Grocery) {
    // return this.http
    //   .delete(
    //     BackendService.apiUrl + "Groceries/" + item.id,
    //     { headers: this.getHeaders() }
    //   )
    //   .map(res => res.json())
    //   .map(data => {
    //     let index = this.allItems.indexOf(item);
    //     this.allItems.splice(index, 1);
    //     this.publishUpdates();
    //   })
    //   .catch(this.handleErrors);
  }

  private put(data: Object) {
    const datastore = Kinvey.DataStore.collection('groceries');
    return datastore.save(data)
      .catch(this.handleErrors);
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}