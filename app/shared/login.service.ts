import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
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
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ");

    return this.http.post(
      "https://baas.kinvey.com/user/kid_HyHoT_REf/",
      JSON.stringify({
        username: user.email,
        password: user.password
      }),
      { headers: headers }
    )
    .catch(this.handleErrors);

  }

  login(user: User) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      "https://baas.kinvey.com/user/kid_HyHoT_REf/",
      // BackendService.apiUrl + "oauth/token",
      JSON.stringify({
        username: user.email,
        password: user.password
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .do(data => {
      console.log("here?");
      // BackendService.token = data.Result.access_token;
    })
    .catch(this.handleErrors);
  }

  logoff() {
    BackendService.token = "";
  }

  resetPassword(email) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      BackendService.apiUrl + "Users/resetpassword",
      JSON.stringify({
        Email: email
      }),
      { headers: headers }
    ).catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
