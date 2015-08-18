var httpModule = require("http");
var config = require("../../shared/config");
var validator = require("email-validator/index");
var observableModule = require("data/observable");

function User(info) {
	info = info || {};

	// You can add properties to observables on creation
	var viewModel = new observableModule.Observable({
		email: info.email || "",
		password: info.password || ""
	});

	viewModel.login = function() {
		return new Promise(function(resolve, reject) {
			httpModule.request({
				url: config.apiUrl + "oauth/token",
				method: "POST",
				content: JSON.stringify({
					username: viewModel.get("email"),
					password: viewModel.get("password"),
					grant_type: "password"
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(data) {
				config.token = data.content.toJSON().Result.access_token;
				resolve();
			}).catch(function(error) {
				console.log(error);
				reject();
			});
		});
	};

	viewModel.register = function() {
		return new Promise(function(resolve, reject) {
			httpModule.request({
				url: config.apiUrl + "Users",
				method: "POST",
				content: JSON.stringify({
					Username: viewModel.get("email"),
					Email: viewModel.get("email"),
					Password: viewModel.get("password")
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function() {
				resolve();
			}).catch(function(error) {
				console.log(error);
				reject();
			});
		});
	};

	viewModel.isValidEmail = function() {
		var email = this.get("email");
		return validator.validate(email);
	};

	return viewModel;
}

module.exports = User;