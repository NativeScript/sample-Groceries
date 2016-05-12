import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";

@Injectable()
export class GroceryListService {
  constructor(private _http: Http) {}

  load() {
    return this._http.get(Config.apiUrl + "Groceries", {
      headers: this.getHeaders()
    })
    .map(res => res.json())
    .map(data => {
      let groceryList = [];
      data.Result.forEach((grocery) => {
        groceryList.push(
          new Grocery(grocery.Id, grocery.Name, grocery.Done || false)
        );
      });
      return groceryList;
    })
    .catch(this.handleErrors);
  }

  add(name: string) {
    return this._http.post(
      Config.apiUrl + "Groceries",
      JSON.stringify({ Name: name }),
      { headers: this.getHeaders() }
    )
    .map(res => res.json())
    .map(data => {
      return new Grocery(data.Result.Id, name, false);
    })
    .catch(this.handleErrors);
  }

  delete(id: string) {
    return this._http.delete(
      Config.apiUrl + "Groceries/" + id,
      { headers: this.getHeaders() }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  toggleDone(item: Grocery) {
    console.log(item.id);
    return this._http.put(
      Config.apiUrl + "Groceries/" + item.id,
      JSON.stringify({ Done: !item.done }),
      { headers: this.getHeaders() }
    )
    .catch(this.handleErrors);
  }

  getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + Config.token);
    return headers;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}