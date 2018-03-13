import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { groceriesRouting } from "./groceries.routing";
import { GroceriesComponent } from "./groceries.component";
import { GroceryListComponent } from "./grocery-list/grocery-list.component";
import { ItemStatusPipe } from "./grocery-list/item-status.pipe";

@NgModule({
  imports: [
    NativeScriptFormsModule,
    NativeScriptCommonModule,
    groceriesRouting,
  ],
  declarations: [
    GroceriesComponent,
    GroceryListComponent,
    ItemStatusPipe
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GroceriesModule {}
