import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
var firebase = require("nativescript-plugin-firebase");

@Injectable()
export class GroceryListService {
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
    let groceryList = [];
      if (!result.error) {
            console.log("Event type: " + result.type);
            console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value));
            if (result.type === "ChildAdded") {            
                if(result.value.UID === Config.token){
                  groceryList.push({
                    name: JSON.stringify(result.value.Name),
                    id: result.key
                  });
                }
            }

            else if (result.type === "ChildRemoved") {
              
              let matches = [];

                matches.push(result);
                        
                matches.forEach(function(match) {
                    var index = groceryList.indexOf(match);
                    groceryList.splice(index, 1);                                     
                });

            }
        }
        return groceryList
    }
  onChildEvent(result:any){
    //get dem groceries
    
    return firebase.query(
        this.onQueryEvent,
        "/Groceries",
        {
          orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'Name' // mandatory when type is 'child'
            }
        }).then(
          /*data => {
           let groceryList = [];
          data.result.forEach((grocery) => {
            console.log("groc",data)
            groceryList.push({
              name: grocery.value.Name,
              id: grocery.key
            }
              
            );
          });
          return groceryList;
        }*/)
        .catch(this.handleErrors);
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

  handleErrors(error: Response) {
    console.log(JSON.stringify(error));
    return Observable.throw(error);
  }
}