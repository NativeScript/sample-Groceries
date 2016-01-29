import {ObservableArray} from "data/observable-array";
import {Config} from "../../shared/config";

export class GroceryListViewModel {
    public items = [];

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
                var newItem = {
                    name: grocery.Name,
                    id: grocery.Id
                };
                console.log('new item: ' + newItem.name);
                this.items.push(newItem);
            });
        });
    }

    empty() {
        this.items = [];
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
            this.items.push({ name: grocery, id: data.Result.Id });
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
