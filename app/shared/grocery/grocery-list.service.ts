import {Injectable} from "@angular/core";
//import {Http} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
var firebase = require("nativescript-plugin-firebase");

@Injectable()
export class GroceryStore {
  
  private onSync:Function;
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private _allItems: Array<Grocery> = [];
  
  constructor() {
    
    this.onSync = (result:any) => this.onQueryEvent(result.value)
    firebase.addValueEventListener(this.onSync, '/Groceries')
    
    /*firebase.addValueEventListener(this.onValueEvent.bind(this), "/Groceries").then(
      () => {
        console.log("firebase.addValueEventListener added");
      },
      (error) => {
        console.log("firebase.addValueEventListener error: " + error);
      }
    );*/
  }
  
  onQueryEvent(result:any){
    console.log(JSON.stringify(result))
    if (!result.error) {
          if (result.UID === Config.token) {
            // TODO: Why is this event firing multiple times? We shouldn’t
            // need to do this manual checking.
            /*let found = false;
            this._allItems.forEach((grocery) => {
              if (grocery.id === result.key) {
                found = true;
              }
            });*/
            //if(result.type === "ValueChanged"){
              //if (!found) {
              this._allItems.push(
                new Grocery(
                  result.key,
                  result.Name,
                  result.Done || false,
                  result.Deleted || false
                )
              );
            // }
            this.publishUpdates(); 
            //}
            /*else if (result.type === "ChildChanged"){
              let newGrocery = new Grocery("", result.value.Name, false, false);
              this._allItems.unshift(newGrocery);
              this.publishUpdates();
            } */                           
          }
         return Promise.resolve(this._allItems);             
    }
  }
    
  onValueEvent(result:any){
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
        //console.log(data.result)
        //newGrocery.id = data.result.Key;
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
