import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";
import { groceriesRouting } from "./groceries.routing";
import { GroceriesComponent } from "./groceries.component";
import { GroceryListComponent } from "./grocery-list/grocery-list.component";
import { ItemStatusPipe } from "./grocery-list/item-status.pipe";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    groceriesRouting
  ],
  declarations: [
    GroceriesComponent,
    GroceryListComponent,
    ItemStatusPipe
  ]
})
export class GroceriesModule {}
