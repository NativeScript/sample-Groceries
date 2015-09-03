var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");
var validator = require("email-validator/index");

function User(info) {
	info = info || {};

	// You can add properties to observables on creation
	var viewModel = new observableModule.Observable({
		email: info.email || "",
		password: info.password || ""
	});

	viewModel.login = function() {
		return new Promise(function(resolve, reject) {
			fetchModule.fetch(config.apiUrl + "oauth/token", {
				method: "POST",
				body: JSON.stringify({
					username: viewModel.get("email"),
					password: viewModel.get("password"),
					grant_type: "password"
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(response) {
				return response.json();
			}).then(function(data) {
				config.token = data.Result.access_token;
				resolve();
			}).catch(function(error) {
				console.log(error);
				reject();
			});
		});
	};

	viewModel.register = function() {
		return new Promise(function(resolve, reject) {
			fetchModule.fetch(config.apiUrl + "Users", {
				method: "POST",
				body: JSON.stringify({
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