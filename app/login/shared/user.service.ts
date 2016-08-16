import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { Config } from "../../shared/config";

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
    return Config.el.Users.resetPassword({ Username: email })
      .catch(this.handleErrors);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}