import {Injectable} from "@angular/core";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable, BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class GroceryStore {

    items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);
    private _allItems: Array<Grocery> = [];

    load() {
        Config.el.authentication.setAuthorization(Config.token, "bearer");
        if (Config.el.offlineStorage.isSynchronizing()) {
            Config.el.on('syncEnd', () => {
                return this.loadItems();
            });
        } else {
            return this.loadItems();
        }
    }

    loadItems() {
        return Config.el.data("Groceries")
            .withHeaders({ "X-Everlive-Sort": JSON.stringify({ ModifiedAt: -1 }) })
            .get()
            .then((data) => {
                data.result.forEach((grocery) => {
                    this._allItems.push(
                        new Grocery(
                            grocery.Id,
                            grocery.Name,
                            grocery.Done || false,
                            grocery.Deleted || false
                        )
                    );
                    this.publishUpdates();
                });
                return Promise.resolve(this._allItems);
            })
            .catch(this.handleErrors);
    }

    add(name: string) {
        let newGrocery = new Grocery("", name, false, false);
        this._allItems.unshift(newGrocery);
        this.publishUpdates();
        return Config.el.data("Groceries")
            .create({ Name: name })
            .then((data) => {
                newGrocery.id = data.result.Id;
                return Promise.resolve(newGrocery);
            })
            .catch(this.handleErrors);
    }

    getItems() {
        return this._allItems;
    }

    setDeleteFlag(item: Grocery) {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
        return Config.el.data("Groceries")
            .updateSingle({ Id: item.id, Deleted: true, Done: true })
            .catch(this.handleErrors);
    }

    toggleDoneFlag(item: Grocery) {
        item.done = !item.done;
        this.publishUpdates();
        return Config.el.data("Groceries")
            .updateSingle({ Id: item.id, Done: !item.done })
            .catch(this.handleErrors);
    }

    restore() {
        let indeces = [];
        this._allItems.forEach((grocery) => {
            if (grocery.deleted && grocery.done) {
                grocery.done = false;
                grocery.deleted = false;
                indeces.push(grocery.id);
            }
        });

        let headers = {
            "X-Everlive-Filter": JSON.stringify({
                "Id": { "$in": indeces }
            })
        };

        this.publishUpdates();
        return Config.el.data("Groceries")
            .withHeaders(headers)
            .update({ Deleted: false, Done: false })
            .catch(this.handleErrors);
    }

    publishUpdates() {
        // must emit a *new* value (immutability!)
        this.items.next([...this._allItems]);
    }

    handleErrors(error) {
        console.log(JSON.stringify(error));
        return Promise.reject(error.message);
    }
}