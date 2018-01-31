var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function GroceryListViewModel(items) {
    var baseUrl = config.apiUrl + "appdata/" + config.appKey + "/Groceries";
    var viewModel = new ObservableArray(items);

    viewModel.load = function() {
        return fetch(baseUrl, {
            headers: getCommonHeaders()
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            data.forEach(function(grocery) {
                viewModel.push({
                    name: grocery.Name,
                    id: grocery._id
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
        return fetch(baseUrl, {
            method: "POST",
            body: JSON.stringify({
                Name: grocery
            }),
            headers: getCommonHeaders()
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            viewModel.push({ name: grocery, id: data._id });
        });
    };

    viewModel.delete = function(index) {
        return fetch(baseUrl + "/" + viewModel.getItem(index).id, {
            method: "DELETE",
            headers: getCommonHeaders()
        })
        .then(handleErrors)
        .then(function() {
            viewModel.splice(index, 1);
        });
    };

    return viewModel;
}

function getCommonHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Kinvey " + config.token
    }
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = GroceryListViewModel;