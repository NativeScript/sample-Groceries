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




module.exports = GroceryList;
