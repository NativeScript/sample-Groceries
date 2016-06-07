import {getString, setString} from "application-settings";

export class Config {
  static apiUrl = "https://firegroceries-904d0.firebaseio.com";
  //static uid = "";
  static get token():string {
    return getString("token");
  }
  static set token(theToken: string) {
    setString("token", theToken);
  }
  static hasActiveToken() {
    return !!getString("token");
  }
}
