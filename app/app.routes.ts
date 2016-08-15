import { RouterConfig } from "@angular/router";
import { nsProvideRouter } from "nativescript-angular/router";
import { LoginPageComponent } from "./pages/login/login.component";
import { ListPageComponent } from "./pages/list/list.component";
import { AuthGuard } from "./auth.guard";

export const routes: RouterConfig = [
  { path: "", component: ListPageComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginPageComponent }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, { enableTracing: false }),
  AuthGuard
];
