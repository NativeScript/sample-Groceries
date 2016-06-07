import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import "rxjs/add/operator/map";
var firebase = require("nativescript-plugin-firebase");

@Injectable()
export class GroceryListService {
  
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
  private _allItems: Array<Grocery> = [];

  constructor(private _http: Http) {
    
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
    //let groceryList = [];
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

            /*else if (result.type === "ChildRemoved") {
              
              let matches = [];

                matches.push(result);
                        
                matches.forEach(function(match) {
                    var index = groceryList.indexOf(match);
                    groceryList.splice(index, 1);                                     
                });

            }*/
        }
        //return groceryList
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
  
  add(name: string) {
   return firebase.push(
      '/Groceries',
          {'Name': name,
           'UID': Config.token
           }
        )
    .map(res => res.json())
    .map(data => {
      return new Grocery(data.Result.Id, name, false, false);
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
    return this._put(item.id, { Deleted: !item.deleted });
  }

  restore(groceries: Array<Grocery>) {
    let indeces = [];
    groceries.forEach((grocery) => {
      indeces.push(grocery.id);
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
    .catch(this.handleErrors);
  }

  toggleDoneFlag(item: Grocery) {
    return this._put(item.id, { Done: !item.done });
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
      // must emit a *new* value (immutability!)
      this.items.next([...this._allItems]);
  }
  handleErrors(error: Response) {
    console.log(JSON.stringify(error));
    return Observable.throw(error);
  }
}