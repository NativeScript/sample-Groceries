import {getString, setString} from "application-settings";
import {connectionType, getConnectionType, startMonitoring} from "connectivity";

export class Config {
  static apiUrl = "https://firegroceries-904d0.firebaseio.com";

  private static handleOnlineOffline() {
    if (getConnectionType() == connectionType.none) {
      //Config.el.offline();
    } else {
      //Config.el.online();
      //Config.el.sync();
    }
  }
  static setupConnectionMonitoring() {
    //Config.handleOnlineOffline();
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
