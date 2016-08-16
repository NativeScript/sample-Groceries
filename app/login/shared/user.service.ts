import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { BackendService } from "../../shared";

@Injectable()
export class UserService {
  constructor(private backend: BackendService) { }

  register(user: User) {
    return this.backend.el.Users.register(user.email, user.password)
      .catch(this.handleErrors);
  }

  login(user: User) {
    return this.backend.el.authentication.login(user.email, user.password).then((data) => {
      this.backend.token = data.result.access_token;
      return Promise.resolve();
    }).catch(this.handleErrors);
  }

  resetPassword(email) {
    return this.backend.el.Users.resetPassword({ Username: email })
      .catch(this.handleErrors);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}