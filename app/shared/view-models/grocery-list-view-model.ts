import {ObservableArray} from "data/observable-array";
import {Config} from "../../shared/config";

export class GroceryListViewModel extends ObservableArray<any> {
    load() {
        return fetch(Config.apiUrl + "Groceries", {
            headers: {
                "Authorization": "Bearer " + Config.token
            }
        })
        .then(handleErrors)
        .then((response) => {
            return response.json();
        }).then((data) => {
            data.Result.forEach((grocery) => {
                this.push({
                    name: grocery.Name,
                    id: grocery.Id
                });
            });
        });
    }

    empty() {
        while (this.length) {
            this.pop();
        }
    }

    add(grocery: string) {
        return fetch(Config.apiUrl + "Groceries", {
            method: "POST",
            body: JSON.stringify({
                Name: grocery
            }),
            headers: {
                "Authorization": "Bearer " + Config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.push({ name: grocery, id: data.Result.Id });
        });
    }

    delete(index) {
        return fetch(Config.apiUrl + "Groceries/" + this.getItem(index).id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + Config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(() => {
            this.splice(index, 1);
        });
    }
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
