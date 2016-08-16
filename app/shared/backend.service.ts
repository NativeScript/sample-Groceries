import { Injectable } from "@angular/core";

import { connectionType, getConnectionType, startMonitoring } from "connectivity";
const Everlive = require("everlive-sdk");

@Injectable()
export class BackendService {
  public el = new Everlive({
    apiKey: "gwfrtxi1lwt4jcqk",
    offlineStorage: true,
    scheme: "https"
  });

  private lastOnlineState;

  constructor() {
    this.setupConnectionMonitoring();
  }

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
}
