import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import { Kinvey } from 'kinvey-nativescript-sdk';

import { User } from "./user.model";
import { BackendService } from "./backend.service";

@Injectable()
export class LoginService {
  constructor(private http: Http) { }

  register(user: User) {
    return Kinvey.User.signup(user);
  }

  login(user: User) {
    return Kinvey.User.login(user.username, user.password);
  }

  loginWithMIC() {
    return Kinvey.User.loginWithMIC('http://redirecturi');
  }

  logoff() {
    return Kinvey.User.logout();
  }

  resetPassword(email) {
    return Kinvey.User.resetPassword(email);
  }
}
