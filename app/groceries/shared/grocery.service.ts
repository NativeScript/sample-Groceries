import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/map";
import { Kinvey } from 'kinvey-nativescript-sdk';

import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject<Array<Grocery>>([]);

  private allItems: Array<Grocery> = [];
  private datastore = Kinvey.DataStore.collection<Grocery>('groceries');

  constructor(private zone: NgZone) { }

  load() {
    var promise = Promise.resolve();
    return promise.then(() => {
      var stream = this.datastore.find();
      return stream.toPromise();
    }).then((data)=> {
      this.allItems = [];
      data.forEach((grocery)=>{
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
    }).catch((error)=> {
      this.handleErrors;
    });
  }

  add(name: string) {
    return this.datastore.save({ name: name })
      .then((data) => {
        this.allItems.unshift(new Grocery(data._id, name, false, false));
        this.publishUpdates();
      })
      .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    return this.put({ _id: item._id, deleted: true, done: false })
      .then(data => {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
      });
  }

  toggleDoneFlag(item: Grocery) {
    item.done = !item.done;
    this.publishUpdates();
    return this.put({ _id: item._id, done: item.done });
  }

  restore() {
    let indeces = [];
    this.allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        indeces.push(grocery._id);
      }
    });
  }

  permanentlyDelete(item: Grocery) {
    const datastore = Kinvey.DataStore.collection<Grocery>('')
    return this.datastore.removeById(item._id)
      .then(() => {
        let index = this.allItems.indexOf(item);
        this.allItems.splice(index, 1);
        this.publishUpdates();
      }).catch(this.handleErrors);
  }

  private put(data: Object) {
    return this.datastore.save(data)
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