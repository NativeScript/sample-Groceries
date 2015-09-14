var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableArrayModule = require("data/observable-array");

function GroceryListViewModel(items) {
    var viewModel = new observableArrayModule.ObservableArray(items);



    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        return Promise.reject(new Error(response.statusText));
    }
    return Promise.resolve(response);
}

module.exports = GroceryListViewModel;