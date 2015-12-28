import * as config from "../../shared/config";
import * as fetchModule from "fetch";
import * as observableModule from "data/observable";

class User extends observableModule.Observable {
    email: string; password: string;

    register() {
        return fetchModule.fetch(config.apiUrl + "Users", {
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

    constructor(info) {
        super();

        this.email = info.email || "";
        this.password = info.password || "";
    } 
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

export default User;