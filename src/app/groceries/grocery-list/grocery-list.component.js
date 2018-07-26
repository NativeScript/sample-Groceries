"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils = require("utils/utils");
var shared_1 = require("../shared");
var shared_2 = require("../../shared");
var GroceryListComponent = /** @class */ (function () {
    function GroceryListComponent(store) {
        this.loading = new core_1.EventEmitter();
        this.loaded = new core_1.EventEmitter();
        this.listLoaded = false;
        this.store = store;
    }
    GroceryListComponent.prototype.ngAfterViewInit = function () {
        this.load();
    };
    GroceryListComponent.prototype.load = function () {
        var _this = this;
        this.loading.next("");
        this.store.load()
            .subscribe(function () {
            _this.loaded.next("");
            _this.listLoaded = true;
        }, function () {
            shared_2.alert("An error occurred loading your grocery list.");
        });
    };
    // The following trick makes the background color of each cell
    // in the UITableView transparent as it’s created.
    GroceryListComponent.prototype.makeBackgroundTransparent = function (args) {
        var cell = args.ios;
        if (cell) {
            // support XCode 8
            cell.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
        }
    };
    GroceryListComponent.prototype.imageSource = function (grocery) {
        if (grocery.deleted) {
            return "res://add";
        }
        return grocery.done ? "res://checked" : "res://unchecked";
    };
    GroceryListComponent.prototype.toggleDone = function (grocery) {
        if (grocery.deleted) {
            this.store.unsetDeleteFlag(grocery)
                .subscribe(function () { }, function () {
                shared_2.alert("An error occurred managing your grocery list.");
            });
        }
        else {
            this.store.toggleDoneFlag(grocery)
                .subscribe(function () { }, function () {
                shared_2.alert("An error occurred managing your grocery list.");
            });
        }
    };
    GroceryListComponent.prototype.delete = function (grocery) {
        var _this = this;
        this.loading.next("");
        var successHandler = function () { return _this.loaded.next(""); };
        var errorHandler = function () {
            shared_2.alert("An error occurred while deleting an item from your list.");
            _this.loaded.next("");
        };
        if (grocery.deleted) {
            this.store.permanentlyDelete(grocery)
                .subscribe(successHandler, errorHandler);
        }
        else {
            this.store.setDeleteFlag(grocery)
                .subscribe(successHandler, errorHandler);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], GroceryListComponent.prototype, "showDeleted", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], GroceryListComponent.prototype, "row", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GroceryListComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GroceryListComponent.prototype, "loaded", void 0);
    GroceryListComponent = __decorate([
        core_1.Component({
            selector: "gr-grocery-list",
            moduleId: module.id,
            templateUrl: "./grocery-list.component.html",
            styleUrls: ["./grocery-list.component.css"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [shared_1.GroceryService])
    ], GroceryListComponent);
    return GroceryListComponent;
}());
exports.GroceryListComponent = GroceryListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyeS1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2NlcnktbGlzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBK0c7QUFDL0csbUNBQXFDO0FBRXJDLG9DQUFvRDtBQUNwRCx1Q0FBcUM7QUFXckM7SUFTRSw4QkFBWSxLQUFxQjtRQU52QixZQUFPLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFDN0IsV0FBTSxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBR3RDLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFHZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBQ0QsOENBQWUsR0FBZjtRQUNJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBQ0QsbUNBQUksR0FBSjtRQUFBLGlCQVlDO1FBWEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7YUFDZCxTQUFTLENBQ1I7WUFDRSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN6QixDQUFDLEVBQ0Q7WUFDRSxjQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQ0YsQ0FBQztJQUNOLENBQUM7SUFFRCw4REFBOEQ7SUFDOUQsa0RBQWtEO0lBQ2xELHdEQUF5QixHQUF6QixVQUEwQixJQUFJO1FBQzVCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULGtCQUFrQjtZQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkUsQ0FBQztJQUNILENBQUM7SUFFRCwwQ0FBVyxHQUFYLFVBQVksT0FBTztRQUNqQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JCLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztJQUM1RCxDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLE9BQWdCO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztpQkFDaEMsU0FBUyxDQUNSLGNBQVEsQ0FBQyxFQUNUO2dCQUNFLGNBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FDRixDQUFDO1FBQ04sQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO2lCQUMvQixTQUFTLENBQ1IsY0FBUSxDQUFDLEVBQ1Q7Z0JBQ0UsY0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUNGLENBQUM7UUFDTixDQUFDO0lBQ0gsQ0FBQztJQUVELHFDQUFNLEdBQU4sVUFBTyxPQUFnQjtRQUF2QixpQkFlQztRQWRDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLElBQUksY0FBYyxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQztRQUNoRCxJQUFJLFlBQVksR0FBRztZQUNqQixjQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztZQUNsRSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztpQkFDbEMsU0FBUyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7aUJBQzlCLFNBQVMsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDN0MsQ0FBQztJQUNILENBQUM7SUFoRlE7UUFBUixZQUFLLEVBQUU7OzZEQUFzQjtJQUNyQjtRQUFSLFlBQUssRUFBRTs7cURBQUs7SUFDSDtRQUFULGFBQU0sRUFBRTs7eURBQThCO0lBQzdCO1FBQVQsYUFBTSxFQUFFOzt3REFBNkI7SUFKM0Isb0JBQW9CO1FBUGhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsK0JBQStCO1lBQzVDLFNBQVMsRUFBRSxDQUFDLDhCQUE4QixDQUFDO1lBQzNDLGVBQWUsRUFBRSw4QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7eUNBVW1CLHVCQUFjO09BVHRCLG9CQUFvQixDQWtGaEM7SUFBRCwyQkFBQztDQUFBLEFBbEZELElBa0ZDO0FBbEZZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tIFwidXRpbHMvdXRpbHNcIjtcblxuaW1wb3J0IHsgR3JvY2VyeSwgR3JvY2VyeVNlcnZpY2UgfSBmcm9tIFwiLi4vc2hhcmVkXCI7XG5pbXBvcnQgeyBhbGVydCB9IGZyb20gXCIuLi8uLi9zaGFyZWRcIjtcblxuZGVjbGFyZSB2YXIgVUlDb2xvcjogYW55O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwiZ3ItZ3JvY2VyeS1saXN0XCIsXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHRlbXBsYXRlVXJsOiBcIi4vZ3JvY2VyeS1saXN0LmNvbXBvbmVudC5odG1sXCIsXG4gIHN0eWxlVXJsczogW1wiLi9ncm9jZXJ5LWxpc3QuY29tcG9uZW50LmNzc1wiXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgR3JvY2VyeUxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgc2hvd0RlbGV0ZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJvdztcbiAgQE91dHB1dCgpIGxvYWRpbmcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBsb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIHN0b3JlOiBHcm9jZXJ5U2VydmljZTtcbiAgbGlzdExvYWRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBHcm9jZXJ5U2VydmljZSkge1xuICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgIHRoaXMubG9hZCgpO1xuICB9XG4gIGxvYWQoKSB7XG4gICAgdGhpcy5sb2FkaW5nLm5leHQoXCJcIik7XG4gICAgdGhpcy5zdG9yZS5sb2FkKClcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRlZC5uZXh0KFwiXCIpO1xuICAgICAgICAgIHRoaXMubGlzdExvYWRlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBhbGVydChcIkFuIGVycm9yIG9jY3VycmVkIGxvYWRpbmcgeW91ciBncm9jZXJ5IGxpc3QuXCIpO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgLy8gVGhlIGZvbGxvd2luZyB0cmljayBtYWtlcyB0aGUgYmFja2dyb3VuZCBjb2xvciBvZiBlYWNoIGNlbGxcbiAgLy8gaW4gdGhlIFVJVGFibGVWaWV3IHRyYW5zcGFyZW50IGFzIGl04oCZcyBjcmVhdGVkLlxuICBtYWtlQmFja2dyb3VuZFRyYW5zcGFyZW50KGFyZ3MpIHtcbiAgICBsZXQgY2VsbCA9IGFyZ3MuaW9zO1xuICAgIGlmIChjZWxsKSB7XG4gICAgICAvLyBzdXBwb3J0IFhDb2RlIDhcbiAgICAgIGNlbGwuYmFja2dyb3VuZENvbG9yID0gdXRpbHMuaW9zLmdldHRlcihVSUNvbG9yLCBVSUNvbG9yLmNsZWFyQ29sb3IpO1xuICAgIH1cbiAgfVxuXG4gIGltYWdlU291cmNlKGdyb2NlcnkpIHtcbiAgICBpZiAoZ3JvY2VyeS5kZWxldGVkKSB7XG4gICAgICByZXR1cm4gXCJyZXM6Ly9hZGRcIjtcbiAgICB9XG4gICAgcmV0dXJuIGdyb2NlcnkuZG9uZSA/IFwicmVzOi8vY2hlY2tlZFwiIDogXCJyZXM6Ly91bmNoZWNrZWRcIjtcbiAgfVxuXG4gIHRvZ2dsZURvbmUoZ3JvY2VyeTogR3JvY2VyeSkge1xuICAgIGlmIChncm9jZXJ5LmRlbGV0ZWQpIHtcbiAgICAgIHRoaXMuc3RvcmUudW5zZXREZWxldGVGbGFnKGdyb2NlcnkpXG4gICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgKCkgPT4geyB9LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWQgbWFuYWdpbmcgeW91ciBncm9jZXJ5IGxpc3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yZS50b2dnbGVEb25lRmxhZyhncm9jZXJ5KVxuICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICgpID0+IHsgfSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBhbGVydChcIkFuIGVycm9yIG9jY3VycmVkIG1hbmFnaW5nIHlvdXIgZ3JvY2VyeSBsaXN0LlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlKGdyb2Nlcnk6IEdyb2NlcnkpIHtcbiAgICB0aGlzLmxvYWRpbmcubmV4dChcIlwiKTtcbiAgICBsZXQgc3VjY2Vzc0hhbmRsZXIgPSAoKSA9PiB0aGlzLmxvYWRlZC5uZXh0KFwiXCIpO1xuICAgIGxldCBlcnJvckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBhbGVydChcIkFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGRlbGV0aW5nIGFuIGl0ZW0gZnJvbSB5b3VyIGxpc3QuXCIpO1xuICAgICAgdGhpcy5sb2FkZWQubmV4dChcIlwiKTtcbiAgICB9O1xuXG4gICAgaWYgKGdyb2NlcnkuZGVsZXRlZCkge1xuICAgICAgdGhpcy5zdG9yZS5wZXJtYW5lbnRseURlbGV0ZShncm9jZXJ5KVxuICAgICAgICAuc3Vic2NyaWJlKHN1Y2Nlc3NIYW5kbGVyLCBlcnJvckhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlLnNldERlbGV0ZUZsYWcoZ3JvY2VyeSlcbiAgICAgICAgLnN1YnNjcmliZShzdWNjZXNzSGFuZGxlciwgZXJyb3JIYW5kbGVyKTtcbiAgICB9XG4gIH1cbn1cblxuIl19