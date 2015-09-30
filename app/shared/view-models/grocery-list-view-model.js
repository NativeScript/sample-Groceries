var config = require("../../shared/config");
var observableArrayModule = require("data/observable-array");

function GroceryListViewModel(items) {
	var viewModel = new observableArrayModule.ObservableArray(items);
	var history = new observableArrayModule.ObservableArray([]);

	viewModel.load = function() {
		return fetch(config.apiUrl + "Groceries", {
			headers: {
				"Authorization": "Bearer " + config.token
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		}).then(function(data) {
			data.Result.forEach(function(grocery) {
				var destination = grocery.Deleted ? history : viewModel;
				destination.push({
					name: grocery.Name,
					id: grocery.Id,
					deleted: grocery.Deleted,
					done: grocery.Done
				});
			});
		});
	};

	viewModel.empty = function() {
		while (viewModel.length) {
			viewModel.pop();
		}
		while (history.length) {
			history.pop();
		}
	};

	viewModel.history = function() {
		return history;
	};

	viewModel.add = function(grocery) {
		return fetch(config.apiUrl + "Groceries", {
			method: "POST",
			body: JSON.stringify({
				Name: grocery
			}),
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			viewModel.push({ name: grocery, id: data.Result.Id });
		});
	};

	function toggleDelete(index, deleteFlag) {
		var source = deleteFlag ? viewModel : history;
		var destination = deleteFlag ? history : viewModel;
		var item = source.getItem(index);

		return fetch(config.apiUrl + "Groceries/" + item.id, {
			method: "PUT",
			body: JSON.stringify({
				Deleted: deleteFlag
			}),
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function() {
			source.splice(index, 1);
			destination.push(item);
		});
	}

	viewModel.restore = function(index) {
		return toggleDelete(index, false);
	};
	viewModel.delete = function(index) {
		return toggleDelete(index, true);
	};

	viewModel.toggleDone = function(index) {
		var item = viewModel.getItem(index);
		item.done = !item.done;

		return fetch(config.apiUrl + "Groceries/" + item.id, {
			method: "PUT",
			body: JSON.stringify({
				Done: item.done
			}),
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors)
		.then(function() {
			viewModel.setItem(index, {
				name: item.name,
				id: item.id,
				deleted: item.deleted,
				done: item.done
			});
		});
	};

	return viewModel;
}

function handleErrors(response) {
	if (!response.ok) {
		console.log(JSON.stringify(response));
		throw Error(response.statusText);
	}
	return response;
}

module.exports = GroceryListViewModel;