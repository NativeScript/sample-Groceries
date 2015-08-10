var config = require("../../shared/config");
var http = require("http");
var observableArrayModule = require("data/observable-array");

function GroceryList(items) {
	var viewModel = new observableArrayModule.ObservableArray(items);

	viewModel.empty = function() {
		while (viewModel.length) {
			viewModel.pop();
		}
	};

	return viewModel;
}

module.exports = GroceryList;