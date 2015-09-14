var config = require("../../shared/config");
var observableArrayModule = require("data/observable-array");

function GroceryListViewModel(items) {
	var viewModel = new observableArrayModule.ObservableArray(items);

	viewModel.load = function() {
		return new Promise(function(resolve, reject) {
			fetch(config.apiUrl + "Groceries", {
				headers: {
					"Authorization": "Bearer " + config.token
				}
			}).then(function(response) {
				return response.json();
			}).then(function(data) {
				data.Result.forEach(function(grocery) {
					viewModel.push({
						name: grocery.Name,
						id: grocery.Id
					});
				});
				resolve();
			}).catch(function(error) {
				console.log(error);
				reject();
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
			fetch(config.apiUrl + "Groceries", {
				method: "POST",
				body: JSON.stringify({
					Name: grocery
				}),
				headers: {
					"Authorization": "Bearer " + config.token,
					"Content-Type": "application/json"
				}
			}).then(function() {
				viewModel.push({ name: grocery });
				resolve();
			}).catch(function(error) {
				console.log(error);
				reject();
			});
		});
	};

	viewModel.delete = function(index) {
		return new Promise(function(resolve, reject) {
			fetch(config.apiUrl + "Groceries/" + viewModel.getItem(index).id, {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer " + config.token,
					"Content-Type": "application/json"
				}
			}).then(function() {
				viewModel.splice(index, 1);
				resolve();
			}).catch(function(error) {
				console.log(error);
				reject();
			});
		});
	};

	return viewModel;
}

module.exports = GroceryListViewModel;