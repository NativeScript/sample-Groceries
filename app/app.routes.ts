import {RouterConfig} from "@angular/router";
import {NS_ROUTER_DIRECTIVES, nsProvideRouter} from "nativescript-angular/router"
import {LoginPageComponent} from "./pages/login/login.component";
import {ListPageComponent} from "./pages/list/list.component";
import {Config} from "./shared/config";

export const routes: RouterConfig = [
  /* TODO: Why does this break things?
  { path: "", redirectTo: Config.hasActiveToken() ? "list" : "login", terminal: true },
  { path: "login", component: LoginPageComponent },
  { path: "list", component: ListPageComponent }*/

  { path: "", component: LoginPageComponent },
  { path: "list", component: ListPageComponent }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, {})
];
