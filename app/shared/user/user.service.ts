import {Injectable} from "@angular/core";
import {User} from "./user";
import {Config} from "../config";

@Injectable()
export class UserService {
  register(user: User) {
    return Config.el.Users.register(user.email, user.password)
      .catch(this.handleErrors);
  }

  login(user: User) {
    return Config.el.authentication.login(user.email, user.password).then((data) => {
      Config.token = data.result.access_token;
      return Promise.resolve();
    }).catch(this.handleErrors);
  }

  resetPassword(email) {
    /*let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.post(
      Config.apiUrl + "Users/resetpassword",
      JSON.stringify({
        Email: email
      }),
      { headers: headers }
    )
    .catch(this.handleErrors);*/
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}