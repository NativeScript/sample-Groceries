import { RouterConfig } from "@angular/router";
import { nsProvideRouter } from "nativescript-angular/router";
import { LoginComponent } from "./login/login.component";
import { GroceriesComponent } from "./groceries/groceries.component";
import { AuthGuard } from "./auth.guard";

export const routes: RouterConfig = [
  { path: "", component: GroceriesComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, { enableTracing: false }),
  AuthGuard
];
