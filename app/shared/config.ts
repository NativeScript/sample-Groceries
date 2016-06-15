import {getString, setString} from "application-settings";
import {connectionType, getConnectionType, startMonitoring} from "connectivity";
var Everlive = require("../shared/everlive.all.min");

export class Config {
  static el = new Everlive({
    apiKey: "gwfrtxi1lwt4jcqk",
    offlineStorage: true
  });
  static lastOnlineState;

  private static handleOnlineOffline() {
    if (getConnectionType() == connectionType.none) {
      Config.el.offline();
    } else {
      Config.el.online();
    }
  }
  static setupConnectionMonitoring() {
    Config.handleOnlineOffline();
    Config.lastOnlineState = getConnectionType();
    startMonitoring(() => {
      Config.handleOnlineOffline();

      // If the user comes back online sync any changes they
      // made while offline.
      if (getConnectionType() != connectionType.none
        && Config.lastOnlineState == connectionType.none) {
          Config.el.sync();
      }

      Config.lastOnlineState = getConnectionType();
    });
  }

  static get token():string {
    var result = getString("token");
    console.log("get token: " + result);
    return result;
  }
  static set token(theToken: string) {
    setString("token", theToken);
    console.log("token: " + theToken);
  }
  static hasActiveToken() {
    return !!getString("token");
  }
  static invalidateToken() {
    Config.token = "";
  }
}