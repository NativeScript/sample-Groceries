var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var observable_array_1 = require("data/observable-array");
var config_1 = require("../../shared/config");
var GroceryListViewModel = (function (_super) {
    __extends(GroceryListViewModel, _super);
    function GroceryListViewModel() {
        _super.apply(this, arguments);
    }
    GroceryListViewModel.prototype.load = function () {
        var _this = this;
        return fetch(config_1.Config.apiUrl + "Groceries", {
            headers: {
                "Authorization": "Bearer " + config_1.Config.token
            }
        })
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            data.Result.forEach(function (grocery) {
                _this.push({
                    name: grocery.Name,
                    id: grocery.Id
                });
            });
        });
    };
    GroceryListViewModel.prototype.empty = function () {
        while (this.length) {
            this.pop();
        }
    };
    GroceryListViewModel.prototype.add = function (grocery) {
        var _this = this;
        return fetch(config_1.Config.apiUrl + "Groceries", {
            method: "POST",
            body: JSON.stringify({
                Name: grocery
            }),
            headers: {
                "Authorization": "Bearer " + config_1.Config.token,
                "Content-Type": "application/json"
            }
        })
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        })
            .then(function (data) {
            _this.push({ name: grocery, id: data.Result.Id });
        });
    };
    GroceryListViewModel.prototype.delete = function (index) {
        var _this = this;
        return fetch(config_1.Config.apiUrl + "Groceries/" + this.getItem(index).id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + config_1.Config.token,
                "Content-Type": "application/json"
            }
        })
            .then(handleErrors)
            .then(function () {
            _this.splice(index, 1);
        });
    };
    return GroceryListViewModel;
})(observable_array_1.ObservableArray);
exports.GroceryListViewModel = GroceryListViewModel;
function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyeS1saXN0LXZpZXctbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm9jZXJ5LWxpc3Qtdmlldy1tb2RlbC50cyJdLCJuYW1lcyI6WyJHcm9jZXJ5TGlzdFZpZXdNb2RlbCIsIkdyb2NlcnlMaXN0Vmlld01vZGVsLmNvbnN0cnVjdG9yIiwiR3JvY2VyeUxpc3RWaWV3TW9kZWwubG9hZCIsIkdyb2NlcnlMaXN0Vmlld01vZGVsLmVtcHR5IiwiR3JvY2VyeUxpc3RWaWV3TW9kZWwuYWRkIiwiR3JvY2VyeUxpc3RWaWV3TW9kZWwuZGVsZXRlIiwiaGFuZGxlRXJyb3JzIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGlDQUE4Qix1QkFBdUIsQ0FBQyxDQUFBO0FBQ3RELHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBRTNDO0lBQTBDQSx3Q0FBb0JBO0lBQTlEQTtRQUEwQ0MsOEJBQW9CQTtJQTJEOURBLENBQUNBO0lBMURHRCxtQ0FBSUEsR0FBSkE7UUFBQUUsaUJBaUJDQTtRQWhCR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsV0FBV0EsRUFBRUE7WUFDdENBLE9BQU9BLEVBQUVBO2dCQUNMQSxlQUFlQSxFQUFFQSxTQUFTQSxHQUFHQSxlQUFNQSxDQUFDQSxLQUFLQTthQUM1Q0E7U0FDSkEsQ0FBQ0E7YUFDREEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7YUFDbEJBLElBQUlBLENBQUNBLFVBQUNBLFFBQVFBO1lBQ1hBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO1FBQzNCQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFDQSxJQUFJQTtZQUNUQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFPQTtnQkFDeEJBLEtBQUlBLENBQUNBLElBQUlBLENBQUNBO29CQUNOQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxJ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