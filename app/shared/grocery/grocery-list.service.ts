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
    
    return firebase.addChildEventListener(this.onChildEvent.bind(this), "/Groceries").then(
            () => {
              console.log("firebase.addChildEventListener added");
            },
            (error) => {
              console.log("firebase.addChildEventListener error: " + error);
            }
        )
  }
  
  onQueryEvent(result:any){
    if (!result.error) {
            console.log("Event type: " + result.type);
            console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value.Name));
            if (result.type === "ChildAdded") {            
                if(result.value.UID === Config.token){
                  this._allItems.push(
                    new Grocery(
                      result.key,
                      result.value.Name,
                      result.value.Done || false,
                      result.value.Deleted || false
                    )                  
                  );
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
                    value: 'Name' // mandatory when type is 'child'
                }
            })
  }
  
  load() {
    /*Config.el.authentication.setAuthorization(Config.token, "bearer");
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
        return Promise.resolve(this._allItems);
      })
      .catch(this.handleErrors);*/
  }

  add(name: string) {
    /*let newGrocery = new Grocery("", name, false, false);
    this._allItems.unshift(newGrocery);
    this.publishUpdates();
    return Config.el.data("Groceries")
      .create({ Name: name })
      .then((data) => {
        newGrocery.id = data.result.Id;
        return Promise.resolve(newGrocery);
      })
      .catch(this.handleErrors);*/
  }

  getItems() {
    return this._allItems;
  }

  setDeleteFlag(item: Grocery) {
    /*item.deleted = true;
    item.done = false;
    this.publishUpdates();
    return Config.el.data("Groceries")
      .updateSingle({ Id: item.id, Deleted: true, Done: true })
      .catch(this.handleErrors);*/
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