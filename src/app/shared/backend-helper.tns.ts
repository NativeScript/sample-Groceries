import { getString, setString } from "tns-core-modules/application-settings";

export class BackendHelper {
  public getToken() {
    return getString("token");
  }

  public setToken(token) {
    setString("token", token);
  }
}
