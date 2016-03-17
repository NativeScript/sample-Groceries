import * as applicationSettingsModule from "application-settings";

var config = {
  apiUrl: "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/",
  invalidateToken: function() {
    this.token = "";
  },
  token: ""
};

Object.defineProperty(config, "token", {
  get: function() {
    return applicationSettingsModule.getString("token");
  },
  set: function(token) {
    return applicationSettingsModule.setString("token", token);
  }
});

export = config;
