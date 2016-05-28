"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var config_1 = require("../config");
var grocery_1 = require("./grocery");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
var GroceryListService = (function () {
    function GroceryListService(_http) {
        this._http = _http;
    }
    GroceryListService.prototype.load = function () {
        return this._http.get(config_1.Config.apiUrl + "Groceries", {
            headers: this.getHeaders()
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            var groceryList = [];
            data.Result.forEach(function (grocery) {
                groceryList.push(new grocery_1.Grocery(grocery.Id, grocery.Name, grocery.Done || false, grocery.Deleted || false));
            });
            return groceryList;
        })
            .catch(this.handleErrors);
    };
    GroceryListService.prototype.add = function (name) {
        return this._http.post(config_1.Config.apiUrl + "Groceries", JSON.stringify({ Name: name }), { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return new grocery_1.Grocery(data.Result.Id, name, false, false);
        })
            .catch(this.handleErrors);
    };
    GroceryListService.prototype._put = function (id, data) {
        return this._http.put(config_1.Config.apiUrl + "Groceries/" + id, JSON.stringify(data), { headers: this.getHeaders() })
            .catch(this.handleErrors);
    };
    GroceryListService.prototype.setDeleteFlag = function (item) {
        return this._put(item.id, { Deleted: !item.deleted });
    };
    GroceryListService.prototype.restore = function (groceries) {
        var indeces = [];
        groceries.forEach(function (grocery) {
            indeces.push(grocery.id);
        });
        var headers = this.getHeaders();
        headers.append("X-Everlive-Filter", JSON.stringify({
            "Id": {
                "$in": indeces
            }
        }));
        return this._http.put(config_1.Config.apiUrl + "Groceries", JSON.stringify({
            Deleted: false,
            Done: false
        }), { headers: headers })
            .catch(this.handleErrors);
    };
    GroceryListService.prototype.toggleDoneFlag = function (item) {
        return this._put(item.id, { Done: !item.done });
    };
    GroceryListService.prototype.deleteForever = function (item) {
        return this._http.delete(config_1.Config.apiUrl + "Groceries/" + item.id, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .catch(this.handleErrors);
    };
    GroceryListService.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return headers;
    };
    GroceryListService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error.json()));
        return Rx_1.Observable.throw(error);
    };
    GroceryListService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], GroceryListService);
    return GroceryListService;
}());
exports.GroceryListService = GroceryListService;
//# sourceMappingURL=grocery-list.service.js.map