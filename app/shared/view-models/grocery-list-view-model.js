var config = require("../../shared/config");
var http = require("http");
var observableArrayModule = require("data/observable-array");

function GroceryList(items) {
	var viewModel = new observableArrayModule.ObservableArray(items);

	viewModel.load = function() {
		http.getJSON({
			url: config.apiUrl + "Groceries",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + config.token
			}
		}).then(function(data) {
			data.Result.forEach(function(grocery) {
				viewModel.push({
					name: grocery.Name,
					id: grocery.Id
				});
			});
		});
	};

	viewModel.empty = function() {
		while (viewModel.length) {
			viewModel.pop();
		}
	};

	viewModel.add = function(grocery) {
		return new Promise(function(resolve, reject) {
			http.request({
				url: config.apiUrl + "Groceries",
				method: "POST",
				content: JSON.stringify({
					Name: grocery
				}),
				headers: {
					"Authorization": "Bearer " + config.token,
					"Content-Type": "application/json"
				}
			}).then(function() {
				viewModel.push({ name: grocery });
				resolve();
			}).catch(function() {
				reject();
			});
		});
	};

	viewModel.delete = function(index) {
		return new Promise(function(resolve, reject) {
			http.request({
				url: config.apiUrl + "Groceries/" + viewModel.getItem(index).id,
				method: "DELETE",
				headers: {
					"Authorization": "Bearer " + config.token,
					"Content-Type": "application/json"
				}
			}).then(function(data) {
				viewModel.splice(index, 1);
				resolve();
			}).catch(function(error) {
				reject();
			});
		});
	};

	return viewModel;
}

module.exports = GroceryList;