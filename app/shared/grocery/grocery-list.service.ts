import { Injectable } from "@angular/core";
import { Http, Headers, URLSearchParams } from "@angular/http";
import { Config } from "../config";
import { Grocery } from "./grocery";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class GroceryListService {
  baseUrl = Config.apiUrl + "appdata/" + Config.appKey + "/Groceries";
  constructor(private http: Http) {}

  load() {
    // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
    let params = new URLSearchParams();
    params.append("sort", "{\"_kmd.lmt\": 1}");

    return this.http.get(this.baseUrl, {
      headers: this.getCommonHeaders(),
      params: params
    })
    .map(res => res.json())
    .map(data => {
      let groceryList = [];
      data.forEach((grocery) => {
        groceryList.push(new Grocery(grocery._id, grocery.Name));
      });
      return groceryList;
    })
    .catch(this.handleErrors);
  }

  add(name: string) {
    return this.http.post(
      this.baseUrl,
      JSON.stringify({ Name: name }),
      { headers: this.getCommonHeaders() }
    )
    .map(res => res.json())
    .map(data => {
      return new Grocery(data._id, name);
    })
    .catch(this.handleErrors);
  }

  delete(id: string) {
    return this.http.delete(
      this.baseUrl + "/" + id,
      { headers: this.getCommonHeaders() }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Kinvey " + Config.token);
    return headers;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}