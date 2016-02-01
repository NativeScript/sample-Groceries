import {Config} from "../../shared/config";

var validator = require("email-validator");

export class UserViewModel {
    email: string;
    password: string;

    constructor(info) {
        this.email = info.email || "";
        this.password = info.password || "";
    }

    login() {
        return fetch(Config.apiUrl + "oauth/token", {
            method: "POST",
            body: JSON.stringify({
                username: this.email,
                password: this.password,
                grant_type: "password"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            Config.token = data.Result.access_token;
        });
    }

    register() {
        return fetch(Config.apiUrl + "Users", {
            method: "POST",
            body: JSON.stringify({
                Username: this.email,
                Email: this.email,
                Password: this.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleErrors);
    }

    isValidEmail() {
        return validator.validate(this.email);
    };
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
