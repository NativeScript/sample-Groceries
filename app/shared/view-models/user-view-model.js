var http = require("http");
var config = require("../../shared/config");
var observableModule = require("data/observable");

function User(info) {
    info = info || {};

    // You can add properties to observables on creation
    var viewModel = new observableModule.Observable({
        email: info.email || "",
        password: info.password || ""
    });

    viewModel.login = function() {

    };

    viewModel.register = function() {
        return new Promise(function(resolve, reject) {
            http.request({
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
            }).catch(function() {
                reject();
            });
        });
    };

    return viewModel;
}

module.exports = User;