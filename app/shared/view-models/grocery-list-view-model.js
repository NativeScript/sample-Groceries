var config = require("../../shared/config");
var http = require("http");
var observableArrayModule = require("data/observable-array");

function GroceryListViewModel(items) {
    var viewModel = new observableArrayModule.ObservableArray(items);
    return viewModel;
}

module.exports = GroceryListViewModel;