var config = require("../../shared/config");
var http = require("http");

var observableModule = require("data/observable");

function User() {}
User.prototype = new observableModule.Observable();
User.prototype.login = function() {
	
};
User.prototype.register = function() {
	var that = this;
	return new Promise(function(resolve, reject) {
		http.request({
			url: config.apiUrl + "Users",
			method: "POST",
			content: JSON.stringify({
				Username: that.get("email_address"),
				Email: that.get("email_address"),
				Password: that.get("password")
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function() {
			resolve();
		}).catch(function() {
			reject();
		});
	});
};



module.exports = User;