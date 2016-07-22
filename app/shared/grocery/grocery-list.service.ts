import {Injectable} from "@angular/core";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
var firebase = require("nativescript-plugin-firebase");
declare var zonedCallback: Function;

@Injectable()
export class GroceryStore {
  
  private onSync:Function;
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private _allItems: Array<Grocery> = [];
  
  constructor() {
    firebase.addValueEventListener(zonedCallback(this.onQueryEvent.bind(this)), "/Groceries");
  }
  
  
  
  onQueryEvent(result: any) {
    if (result) {
      if (result.error) {
        console.log(`Error:`);
        console.log(result.error);
      } else if (result.value) {
        result = result.value;
        this._allItems = [];
        Object.keys(result).forEach((key) => {
          let entry = result[key];
          if(Config.token === entry.UID){
            this._allItems.push(
              new Grocery(
                key,
                entry.Name,
                entry.Date,
                entry.Done || false,
                entry.Deleted || false
              )
            )
          }
        });
        this.publishUpdates();
      }
    }
    return Promise.resolve(this._allItems);             
  }  
  
  add(name: string) {   
    return firebase.push(
        "/Groceries",
        { "Name": name, "UID": Config.token, "Date": 0 - Date.now() }
      )
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
    item.done = !item.done;
    this.publishUpdates();
    return firebase.update("/Groceries/"+item.id+"",{Done: item.done})
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

    this.publishUpdates();
  }

  publishUpdates() {
    // must emit a *new* value (immutability!)
    this._allItems.sort(function(a, b){
        if(a.date < b.date) return -1;
        if(a.date > b.date) return 1;
      return 0;
    })
    this.items.next([...this._allItems]);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}
