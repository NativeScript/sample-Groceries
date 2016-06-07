import {Injectable} from "@angular/core";
//import {Http} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
var firebase = require("nativescript-plugin-firebase");

@Injectable()
export class GroceryStore {
  
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private _allItems: Array<Grocery> = [];
  
  constructor() {
    firebase.addChildEventListener(this.onChildEvent.bind(this), "/Groceries").then(
      () => {
        console.log("firebase.addChildEventListener added");
      },
      (error) => {
        console.log("firebase.addChildEventListener error: " + error);
      }
    );
  }
  
  onQueryEvent(result:any){
    if (!result.error) {
      if (result.type === "ChildAdded") {
          if (result.value.UID === Config.token) {
            // TODO: Why is this event firing multiple times? We shouldn’t
            // need to do this manual checking.
            let found = false;
            this._allItems.forEach((grocery) => {
              if (grocery.id === result.key) {
                found = true;
              }
            });
            if (!found) {
              this._allItems.push(
                new Grocery(
                  result.key,
                  result.value.Name,
                  result.value.Done || false,
                  result.value.Deleted || false
                )
              );
            }
            this.publishUpdates();                  
          }
         return Promise.resolve(this._allItems);
      }
    }
  }

  onChildEvent(result:any){
    return firebase.query(
      this.onQueryEvent.bind(this),
      "/Groceries",
      {
        orderBy: {
          type: firebase.QueryOrderByType.CHILD,
          value: "Name" // mandatory when type is 'child'
        }
      });
  }
  
  add(name: string) {
    let newGrocery = new Grocery("", name, false, false);
    //this._allItems.unshift(newGrocery);
    //this.publishUpdates();
    return firebase.push(
        "/Groceries",
        { "Name": name, "UID": Config.token }
      )
      .then((data) => {
        newGrocery.id = data.result.Id;
        //return Promise.resolve(newGrocery);
      })
      .catch(this.handleErrors);
  }

  getItems() {
    return this._allItems;
  }

  setDeleteFlag(item: Grocery) {
    item.deleted = true;
    item.done = false;
    this.publishUpdates();
    return firebase.remove("/Groceries/"+item.id+"")
      .catch(this.handleErrors);
  }

  toggleDoneFlag(item: Grocery) {
    /*item.done = !item.done;
    this.publishUpdates();
    return Config.el.data("Groceries")
      .updateSingle({ Id: item.id, Done: !item.done })
      .catch(this.handleErrors);*/
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
    /*return Config.el.data("Groceries")
      .withHeaders(headers)
      .update({ Deleted: false, Done: false })
      .catch(this.handleErrors);*/
  }

  publishUpdates() {
    // must emit a *new* value (immutability!)
    this.items.next([...this._allItems]);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}