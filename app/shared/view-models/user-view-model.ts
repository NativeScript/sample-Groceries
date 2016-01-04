import {Observable} from "data/observable";
import {Config} from "../../shared/config";

var validator = require("email-validator");

export class UserViewModel extends Observable {
    email: string;
    password: string;

    constructor(info) {
        super();

        this.email = info.email || "";
        this.password = info.password || "";
    }

    login() {
        return fetch(Config.apiUrl + "oauth/token", {
            method: "POST",
            body: JSON.stringify({
                username: this.get("email"),
                password: this.get("password"),
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
                Username: this.get("email"),
                Email: this.get("email"),
                Password: this.get("password")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleErrors);
    }

    isValidEmail() {
        return validator.validate(this.get("email"));
    };
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
