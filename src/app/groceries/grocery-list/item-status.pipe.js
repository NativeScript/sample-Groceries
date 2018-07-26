"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ItemStatusPipe = /** @class */ (function () {
    function ItemStatusPipe() {
        this.value = [];
    }
    ItemStatusPipe.prototype.transform = function (items, deleted) {
        if (items instanceof Array) {
            this.value = items.filter(function (grocery) {
                return grocery.deleted === deleted;
            });
        }
        return this.value;
    };
    ItemStatusPipe = __decorate([
        core_1.Pipe({
            name: "itemStatus"
        })
    ], ItemStatusPipe);
    return ItemStatusPipe;
}());
exports.ItemStatusPipe = ItemStatusPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS1zdGF0dXMucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIml0ZW0tc3RhdHVzLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBb0Q7QUFPcEQ7SUFIQTtRQUlFLFVBQUssR0FBbUIsRUFBRSxDQUFDO0lBUzdCLENBQUM7SUFSQyxrQ0FBUyxHQUFULFVBQVUsS0FBcUIsRUFBRSxPQUFnQjtRQUMvQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFnQjtnQkFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFUVSxjQUFjO1FBSDFCLFdBQUksQ0FBQztZQUNKLElBQUksRUFBRSxZQUFZO1NBQ25CLENBQUM7T0FDVyxjQUFjLENBVTFCO0lBQUQscUJBQUM7Q0FBQSxBQVZELElBVUM7QUFWWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5pbXBvcnQgeyBHcm9jZXJ5IH0gZnJvbSBcIi4uL3NoYXJlZFwiO1xuXG5AUGlwZSh7XG4gIG5hbWU6IFwiaXRlbVN0YXR1c1wiXG59KVxuZXhwb3J0IGNsYXNzIEl0ZW1TdGF0dXNQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHZhbHVlOiBBcnJheTxHcm9jZXJ5PiA9IFtdO1xuICB0cmFuc2Zvcm0oaXRlbXM6IEFycmF5PEdyb2Nlcnk+LCBkZWxldGVkOiBib29sZWFuKSB7XG4gICAgaWYgKGl0ZW1zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBpdGVtcy5maWx0ZXIoKGdyb2Nlcnk6IEdyb2NlcnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGdyb2NlcnkuZGVsZXRlZCA9PT0gZGVsZXRlZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufSJdfQ==