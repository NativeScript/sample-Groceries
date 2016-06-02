import {getString, setString} from "application-settings";
import {connectionType, getConnectionType, startMonitoring} from "connectivity";
var Everlive = require("../shared/everlive.all.min");

export class Config {
  static el = new Everlive({
    apiKey: "gwfrtxi1lwt4jcqk",
    offlineStorage: true
  });

  private static handleOnlineOffline() {
    if (getConnectionType() == connectionType.none) {
      Config.el.offline();
    } else {
      Config.el.online();
      Config.el.sync();
    }
  }

  static setupConnectionMonitoring() {
    startMonitoring(Config.handleOnlineOffline);
  }

  static get token():string {
    return getString("token");
  }
  static set token(theToken: string) {
    setString("token", theToken);
  }
  static hasActiveToken() {
    return !!getString("token");
  }
  static invalidateToken() {
    Config.token = "";
  }
}
