import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Config} from "../config";
import {Grocery} from "./grocery";

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
    });
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
    });
  }
  
  delete(id: string) {
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);
    headers.append("Content-Type", "application/json");

    return this._http.delete(
      Config.apiUrl + "Groceries/" + id,
      { headers: headers }
    )
    .map(res => res.json());
  }
}