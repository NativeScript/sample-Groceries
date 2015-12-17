var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");
var observableArrayModule = require("data/observable-array");

function indexOf(item) {
    var match = -1;
    this.forEach(function(loopItem, index) {
        if (loopItem.id === item.key) {
            match = index;
        }
    });
    return match;
}

function GroceryListViewModel(items) {

    var viewModel = new observableArrayModule.ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function () {
        
        var onChildEvent = function(result) {
        var matches = [];

            if (result.type === "ChildAdded") {            
                if(result.value.UID === config.uid){
                  viewModel.push({
                    name: result.value.Name,
                    id: result.key
                  });
                }
            }

            else if (result.type === "ChildRemoved") {

                matches.push(result);
                        
                matches.forEach(function(match) {
                    var index = viewModel.indexOf(match);
                    viewModel.splice(index, 1);                                     
                });

            }

        };
        return firebase.addChildEventListener(onChildEvent, "/Groceries").then(
            function () {
              console.log("firebase.addChildEventListener added");
            },
            function (error) {
              console.log("firebase.addChildEventListener error: " + error);
            }
        )   
      };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.add = function(grocery) {
        return firebase.push(
          '/Groceries',
          {'Name': grocery,
           'UID': config.uid
           }
        );
    };

    viewModel.delete = function(index) {
        var id = viewModel.getItem(index).id;
        return firebase.remove("/Groceries/"+id+"");
    };

    return viewModel;
}

module.exports = GroceryListViewModel;