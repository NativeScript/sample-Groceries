import {getString, setString} from "application-settings";
var Everlive = require("../shared/everlive.all.min");

export class Config {
  static el = new Everlive({
    apiKey: "gwfrtxi1lwt4jcqk",
    offlineStorage: true
  });
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
