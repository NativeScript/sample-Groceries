import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";

import { User } from "./user.model";
import { BackendService } from "./backend.service";

@Injectable()
export class LoginService {
  constructor(private http: Http) { }

  register(user: User) {
    return this.http.post(
      BackendService.baseUrl + "user/" + BackendService.appKey,
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
      BackendService.baseUrl + "user/" + BackendService.appKey + "/login",
      JSON.stringify({
        username: user.email,
        password: user.password
      }),
      { headers: this.getCommonHeaders() }
    )
    .map(response => response.json())
    .do(data => {
      BackendService.token = data._kmd.authtoken;
    })
    .catch(this.handleErrors);
  }

  logoff() {
    BackendService.token = "";
  }

  resetPassword(email) {
    return this.http.post(
      BackendService.baseUrl + "rpc/" + BackendService.appKey + "/" + email + "/user-password-reset-initiate",
      {},
      { headers: this.getCommonHeaders() }
    ).catch(this.handleErrors);
  }

  private getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", BackendService.appUserHeader);
    return headers;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
