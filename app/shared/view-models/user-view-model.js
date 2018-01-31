var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");
var validator = require("email-validator");

function User(info) {
    info = info || {};

    // You can add properties to observables on creation
    var viewModel = new observableModule.fromObject({
        email: info.email || "",
        password: info.password || ""
    });

    viewModel.login = function() {
        return fetchModule.fetch(config.apiUrl + "user/" + config.appKey + "/login", {
            method: "POST",
            body: JSON.stringify({
                username: viewModel.get("email"),
                password: viewModel.get("password")
            }),
            headers: getCommonHeaders()
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            config.token = data._kmd.authtoken;
        });
    };

    viewModel.register = function() {
        return fetchModule.fetch(config.apiUrl + "user/" + config.appKey, {
            method: "POST",
            body: JSON.stringify({
                username: viewModel.get("email"),
                email: viewModel.get("email"),
                password: viewModel.get("password")
            }),
            headers: getCommonHeaders()
        }).then(handleErrors);
    };

    viewModel.isValidEmail = function() {
        var email = this.get("email");
        return validator.validate(email);
    };

    return viewModel;
}

function getCommonHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": config.appUserHeader
    }
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = User;