var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");

function User(info) {
    info = info || {};

    // You can add properties to observables on creation
    var viewModel = new observableModule.Observable({
        email: info.email || "",
        password: info.password || ""
    });

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

    return viewModel;
}

module.exports = User;