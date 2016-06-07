import {Injectable} from "@angular/core";
import {User} from "./user";
import {Config} from "../config";
var firebase = require("nativescript-plugin-firebase");

@Injectable()
export class UserService {
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
    //return Config.el.Users.resetPassword({ Username: email })
     // .catch(this.handleErrors);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}