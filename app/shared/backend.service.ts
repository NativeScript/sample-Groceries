import { Injectable } from "@angular/core";
import { getString, setString } from "application-settings";
import { connectionType, getConnectionType, startMonitoring } from "connectivity";
const Everlive = require("everlive-sdk");

const tokenKey = "token";

@Injectable()
export class BackendService {
  public el = new Everlive({
    apiKey: "gwfrtxi1lwt4jcqk",
    offlineStorage: true,
    scheme: "https"
  });

  private lastOnlineState;

  private handleOnlineOffline() {
    if (getConnectionType() === connectionType.none) {
      this.el.offline();
    } else {
      this.el.online();
    }
  }

  setupConnectionMonitoring() {
    this.handleOnlineOffline();
    this.lastOnlineState = getConnectionType();
    startMonitoring(() => {
      this.handleOnlineOffline();

      // If the user comes back online sync any changes they
      // made while offline.
      if (getConnectionType() !== connectionType.none
        && this.lastOnlineState === connectionType.none) {
        this.el.sync();
      }

      this.lastOnlineState = getConnectionType();
    });
  }

  get token(): string {
    return getString(tokenKey);
  }
  set token(theToken: string) {
    setString(tokenKey, theToken);
  }

  hasActiveToken() {
    return !!getString(tokenKey);
  }

  invalidateToken() {
    this.token = "";
  }
}
