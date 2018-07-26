"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("nativescript-angular/common");
var forms_1 = require("nativescript-angular/forms");
var core_1 = require("@angular/core");
var groceries_routing_1 = require("./groceries.routing");
var groceries_component_1 = require("./groceries.component");
var grocery_list_component_1 = require("./grocery-list/grocery-list.component");
var item_status_pipe_1 = require("./grocery-list/item-status.pipe");
var GroceriesModule = /** @class */ (function () {
    function GroceriesModule() {
    }
    GroceriesModule = __decorate([
        core_1.NgModule({
            imports: [
                forms_1.NativeScriptFormsModule,
                common_1.NativeScriptCommonModule,
                groceries_routing_1.groceriesRouting,
            ],
            declarations: [
                groceries_component_1.GroceriesComponent,
                grocery_list_component_1.GroceryListComponent,
                item_status_pipe_1.ItemStatusPipe
            ],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
    ], GroceriesModule);
    return GroceriesModule;
}());
exports.GroceriesModule = GroceriesModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyaWVzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyb2Nlcmllcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBdUU7QUFDdkUsb0RBQXFFO0FBQ3JFLHNDQUEyRDtBQUMzRCx5REFBdUQ7QUFDdkQsNkRBQTJEO0FBQzNELGdGQUE2RTtBQUM3RSxvRUFBaUU7QUFlakU7SUFBQTtJQUE4QixDQUFDO0lBQWxCLGVBQWU7UUFiM0IsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLCtCQUF1QjtnQkFDdkIsaUNBQXdCO2dCQUN4QixvQ0FBZ0I7YUFDakI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osd0NBQWtCO2dCQUNsQiw2Q0FBb0I7Z0JBQ3BCLGlDQUFjO2FBQ2Y7WUFDRCxPQUFPLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQztTQUM1QixDQUFDO09BQ1csZUFBZSxDQUFHO0lBQUQsc0JBQUM7Q0FBQSxBQUEvQixJQUErQjtBQUFsQiwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5hdGl2ZVNjcmlwdENvbW1vbk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBncm9jZXJpZXNSb3V0aW5nIH0gZnJvbSBcIi4vZ3JvY2VyaWVzLnJvdXRpbmdcIjtcbmltcG9ydCB7IEdyb2Nlcmllc0NvbXBvbmVudCB9IGZyb20gXCIuL2dyb2Nlcmllcy5jb21wb25lbnRcIjtcbmltcG9ydCB7IEdyb2NlcnlMaXN0Q29tcG9uZW50IH0gZnJvbSBcIi4vZ3JvY2VyeS1saXN0L2dyb2NlcnktbGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEl0ZW1TdGF0dXNQaXBlIH0gZnJvbSBcIi4vZ3JvY2VyeS1saXN0L2l0ZW0tc3RhdHVzLnBpcGVcIjtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdENvbW1vbk1vZHVsZSxcbiAgICBncm9jZXJpZXNSb3V0aW5nLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBHcm9jZXJpZXNDb21wb25lbnQsXG4gICAgR3JvY2VyeUxpc3RDb21wb25lbnQsXG4gICAgSXRlbVN0YXR1c1BpcGVcbiAgXSxcbiAgc2NoZW1hczogW05PX0VSUk9SU19TQ0hFTUFdXG59KVxuZXhwb3J0IGNsYXNzIEdyb2Nlcmllc01vZHVsZSB7fVxuIl19