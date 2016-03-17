import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import * as Config from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";

@Injectable()
export class GroceryListService {
  constructor(private _http: Http) {}

  load() {
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);

    return this._http.get(Config.apiUrl + "Groceries", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      var groceryList = [];
      data.Result.forEach((grocery) => {
        groceryList.push(new Grocery(grocery.Id, grocery.Name));
      });
      return groceryList;
    })
    .catch(this.handleErrors);
  }

  add(name: string) {
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);
    headers.append("Content-Type", "application/json");

    return this._http.post(
      Config.apiUrl + "Groceries",
      JSON.stringify({ Name: name }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      return new Grocery(data.Result.Id, name);
    })
    .catch(this.handleErrors);
  }
  
  delete(id: string) {
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);
    headers.append("Content-Type", "application/json");

    return this._http.delete(
      Config.apiUrl + "Groceries/" + id,
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}