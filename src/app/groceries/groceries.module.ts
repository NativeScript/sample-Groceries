import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ActivityIndicator } from "./activity-indicator.component";
import { groceriesRouting } from "./groceries.routing";
import { GroceriesComponent } from "./groceries.component";
import { GroceryListComponent } from "./grocery-list/grocery-list.component";
import { ItemStatusPipe } from "./grocery-list/item-status.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    groceriesRouting
  ],
  declarations: [
    ActivityIndicator,
    GroceriesComponent,
    GroceryListComponent,
    ItemStatusPipe
  ]
})
export class GroceriesModule {}
