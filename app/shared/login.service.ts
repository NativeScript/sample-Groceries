import { Injectable } from "@angular/core";
import { getString, setString } from "application-settings";

import { User } from "./user.model";
import { BackendService } from "./backend.service";

const tokenKey = "token";

@Injectable()
export class LoginService {
  get isLoggedIn(): boolean {
    return !!getString(tokenKey);
  }

  private get token(): string {
    return getString(tokenKey);
  }
  private set token(theToken: string) {
    setString(tokenKey, theToken);
  }

  constructor(private backend: BackendService) {
    if (this.token) {
      this.backend.el.authentication.setAuthorization(this.token, "bearer");
    }
  }

  register(user: User) {
    return this.backend.el.Users.register(user.email, user.password)
      .catch(this.handleErrors);
  }

  login(user: User) {
    return this.backend.el.authentication.login(user.email, user.password).then((data) => {
      this.token = data.result.access_token;
      this.backend.el.authentication.setAuthorization(this.token, "bearer");
      return Promise.resolve();
    }).catch(this.handleErrors);
  }

  logoff() {
    this.backend.el.authentication.clearAuthorization();
    this.token = "";
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