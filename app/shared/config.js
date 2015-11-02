var applicationSettingsModule = require("application-settings");

var configObject = {
	apiUrl: "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/",
	invalidateToken: function() {
		this.token = "";
	}
};
Object.defineProperty(configObject, "token", {
	get: function() {
		return applicationSettingsModule.getString("token");
	},
	set: function(token) {
		return applicationSettingsModule.setString("token", token);
	}
});

module.exports = configObject;
