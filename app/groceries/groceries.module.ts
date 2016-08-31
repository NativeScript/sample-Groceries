import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { groceriesRouting } from "./groceries.routing";
import { GroceriesComponent } from "./groceries.component";
import { GroceryListComponent } from "./grocery-list/grocery-list.component";
import { ItemStatusPipe } from "./grocery-list/item-status.pipe";

@NgModule({
  imports: [
    NativeScriptModule,
    groceriesRouting
  ],
  declarations: [
    GroceriesComponent,
    GroceryListComponent,
    ItemStatusPipe
  ]
})
export class GroceriesModule {}
