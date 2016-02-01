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
                this.items.push({
                    name: grocery.Name,
                    id: grocery.Id
                });
            });
        });
    }

    empty() {
        while (this.items.length) {
            this.items.pop();
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
            this.items.push({ name: grocery, id: data.Result.Id });
        });
    }

    delete(index) {
        return fetch(Config.apiUrl + "Groceries/" + this.items[index].id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + Config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(() => {
            this.items.splice(index, 1);
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
