import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { User } from "./user";
import { Config } from "../config";

@Injectable()
export class UserService {
  constructor(private http: Http) {}

  register(user: User) {
    return this.http.post(
      Config.apiUrl + "user/" + Config.appKey,
      JSON.stringify({
        username: user.email,
        email: user.email,
        password: user.password
      }),
      { headers: this.getCommonHeaders() }
    )
    .catch(this.handleErrors);
  }

  login(user: User) {
    return this.http.post(
      Config.apiUrl + "user/" + Config.appKey + "/login",
      JSON.stringify({
        username: user.email,
        password: user.password,
        grant_type: "password"
      }),
      { headers: this.getCommonHeaders() }
    )
    .map(response => response.json())
    .do(data => {
      Config.token = data._kmd.authtoken;
    })
    .catch(this.handleErrors);
  }

  getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", Config.authHeader);
    return headers;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}