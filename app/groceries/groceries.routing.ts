import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { GroceriesComponent } from "./groceries.component";
import { AuthGuard } from "../auth-guard.service";

const groceriesRoutes: Routes = [
  { path: "", component: GroceriesComponent, canActivate: [AuthGuard] },
];
export const groceriesRouting: ModuleWithProviders = RouterModule.forChild(groceriesRoutes);