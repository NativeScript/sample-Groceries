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
        return data.Result.map(groceryData =>
            new Grocery(
                groceryData.Id,
                groceryData.Name,
                groceryData.Done || false,
                groceryData.Deleted || false
            )
        );
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
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
