var config = require("../../shared/config");
var http = require("http");
var observableModule = require("data/observable");
var validator = require("email-validator/index");

function User() {}
User.prototype = new observableModule.Observable();
User.prototype.login = function() {
	var that = this;
	return new Promise(function(resolve, reject) {
		http.request({
			url: config.apiUrl + "oauth/token",
			method: "POST",
			content: JSON.stringify({
				username: that.get("email_address"),
				password: that.get("password"),
				grant_type: "password"
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function(data) {
			config.token = data.content.toJSON().Result.access_token;
			resolve();
		}).catch(function() {
			reject();
		});
	});
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
User.prototype.isValidEmail = function() {
	var email = this.get("email_address");
	return validator.validate(email);
};

module.exports = User;