import {getString, setString} from "application-settings";

export class Config {
  static apiUrl = "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/";
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
