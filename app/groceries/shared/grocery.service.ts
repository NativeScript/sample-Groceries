import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
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
    }).then((data) => {
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
    }).catch((error) => {
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
    const clone = this.cloneGrocery(item);
    clone.deleted = true;
    clone.done = false;
    return this.datastore.update(clone)
      .then(data => {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
      })
      .catch((err) => this.handleErrors(err));
  }

  toggleDoneFlag(item: Grocery) {
    const clone = this.cloneGrocery(item);
    clone.done = !clone.done;
    return this.datastore.update(clone)
      .then(() => {
        item.done = !item.done;
        this.publishUpdates();
      })
      .catch(err => this.handleErrors(err));
  }

  restore() {
    const groceriesToRestore = this.allItems.filter(g => g.deleted && g.done);
    const promise = groceriesToRestore.reduce((result, grocery) => {
      return result.then(() => {
        const clone = this.cloneGrocery(grocery);
        clone.deleted = false;
        clone.done = false;
        return this.datastore.update(clone);
      });
    }, Promise.resolve(null));

    return promise
      .then(() => {
        groceriesToRestore.forEach((grocery) => {
          grocery.deleted = false;
          grocery.done = false;
        });
        this.publishUpdates();
      })
      .catch(err => this.handleErrors(err));
  }

  permanentlyDelete(item: Grocery) {
    return this.datastore.removeById(item._id)
      .then(() => {
        const index = this.allItems.findIndex(i => i._id === item._id);
        if (index > -1) {
          this.allItems.splice(index, 1);
          this.publishUpdates();
        }
      })
      .catch(this.handleErrors);
  }

  private put(data: Object) {
    return this.datastore.save(data)
      .catch(this.handleErrors);
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      const newVal = [...this.allItems];
      this.items.next(newVal);
    });
  }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }

  private cloneGrocery(grocery: Grocery) {
    const { _id, name, done, deleted } = grocery;
    return new Grocery(_id, name, done, deleted);
  }
}
