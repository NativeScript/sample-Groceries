var config = require("../../shared/config");
var http = require("http");
var observableArray = require("data/observable-array");

var GroceryList = (function (_super) {
	__extends(GroceryList, _super);
	function GroceryList() {
		_super.apply(this, arguments);
	}
	return GroceryList;
})(observableArray.ObservableArray);

GroceryList.prototype.load = function() {
	var that = this;
	http.getJSON({
		url: config.apiUrl + "Groceries",
		method: "GET",
		headers: {
			"Authorization": "Bearer " + config.token
		}
	}).then(function(data) {
		data.Result.forEach(function(grocery) {
			that.push({
				name: grocery.Name,
				id: grocery.Id
			});
		});
	});
};

GroceryList.prototype.empty = function() {
	while (this.length) {
		this.pop();
	}
};

GroceryList.prototype.add = function(grocery) {
	var that = this;
	return new Promise(function(resolve, reject) {
		http.request({
			url: config.apiUrl + "Groceries",
			method: "POST",
			content: JSON.stringify({
				Name: grocery
			}),
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		}).then(function() {
			that.push({ name: grocery });
			resolve();
		}).catch(function() {
			reject();
		});
	});
};
GroceryList.prototype.isValidItem = function(grocery) {
	return !!grocery;
};
GroceryList.prototype.delete = function(index) {
	var that = this;
	return new Promise(function(resolve, reject) {
		http.request({
			url: config.apiUrl + "Groceries/" + that.getItem(index).id,
			method: "DELETE",
			headers: {
				"Authorization": "Bearer " + config.token,
				"Content-Type": "application/json"
			}
		}).then(function() {
			that.splice(index, 1);
			resolve();
		}).catch(function() {
			reject();
		});
	});
};

module.exports = GroceryList;
