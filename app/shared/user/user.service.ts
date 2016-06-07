import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {User} from "./user";
import {Config} from "../config";
import {Observable} from "rxjs/Rx";
var firebase = require("nativescript-plugin-firebase");

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

@Injectable()
export class UserService {
  constructor(private _http: Http) {}  
    
  register(user: User) {
    return firebase.createUser({
      email: user.email,
      password: user.password
    }).then(
        function (result) {
          return JSON.stringify(result);
        },
        function (errorMessage) {
          alert(errorMessage);
        }
    )
  }

  login(user: User) {
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      email: user.email,
      password: user.password
    }).then(
        function (result) {
          Config.token = result.uid
          return JSON.stringify(result);
        },
        function (errorMessage) {
          console.log(errorMessage);
        }
    )
  }

  resetPassword(email) {
    
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}