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
var router_deprecated_1 = require("@angular/router-deprecated");
var grocery_list_service_1 = require("../../shared/grocery/grocery-list.service");
var config_1 = require("../../shared/config");
var ListComponent = (function () {
    function ListComponent(_groceryListService, _router) {
        this._groceryListService = _groceryListService;
        this._router = _router;
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!config_1.Config.token) {
            this._router.navigate(["Login"]);
            return;
        }
        this._groceryListService.load()
            .subscribe(function (groceryList) { _this.groceryList = groceryList; });
    };
    ListComponent.prototype.add = function () {
        var _this = this;
        this._groceryListService.add(this.grocery)
            .subscribe(function (groceryObject) {
            _this.groceryList.push(groceryObject);
            // Clear out the input’s text
            _this.grocery = "";
        });
    };
    ListComponent.prototype.delete = function (grocery) {
        var _this = this;
        this._groceryListService.deleteForever(grocery)
            .subscribe(function () {
            var index = _this.groceryList.indexOf(grocery);
            _this.groceryList.splice(index, 1);
        });
    };
    ListComponent = __decorate([
        core_1.Component({
            selector: "list",
            template: " \n    <ul>\n      <li>\n        <h1>Add a Grocery Item</h1> \n      </li>\n      <li>\n        <input [(ngModel)]=\"grocery\">\n        <button (click)=\"add()\">Add</button>\n        <hr> \n      </li>\n      <li *ngFor=\"let grocery of groceryList\">\n        {{grocery.name}}\n        <button class=\"delete\" (click)=\"delete(grocery)\">x</button>\n      </li>\n     </ul>\n  ",
            styleUrls: ["./app/pages/list/list.css"],
            providers: [grocery_list_service_1.GroceryListService]
        }), 
        __metadata('design:paramtypes', [grocery_list_service_1.GroceryListService, router_deprecated_1.Router])
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map