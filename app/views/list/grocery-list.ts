import {Observable} from "rxjs/Observable";
import {WrappedValue} from "data/observable";
import {Config} from "../../shared/config";

export class Grocery {
    constructor(public id: number, public name: string) {}
}

export class GroceryList {
    public items: Observable<Array<Grocery>>;

    private _items: Array<Grocery>;
    private subscr;

    constructor() {
        this._items = [];
        this.items = Observable.create(subscriber => {
            this.subscr = subscriber;
            subscriber.next(WrappedValue.wrap(this._items));
        });
    }

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
                this._items.push(new Grocery(grocery.Id, grocery.Name));
                this.subscr.next(WrappedValue.wrap(this._items));
            });
        });
    }

    empty() {
        while (this._items.length) {
            this._items.pop();
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
            this._items.push(new Grocery(data.Result.Id, grocery));
            this.subscr.next(WrappedValue.wrap(this._items));
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
            this._items.splice(index, 1);
            this.subscr.next(WrappedValue.wrap(this._items));
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
