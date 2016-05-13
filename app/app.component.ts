import {Component} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {RouteConfig} from "@angular/router-deprecated";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import {LoginPage} from "./pages/login/login.component";
import {ListPage} from "./pages/list/list.component";
import {Config} from "./shared/config";

@Component({
  selector: "main",
  directives: [NS_ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS],
  template: "<page-router-outlet></page-router-outlet>"
})
@RouteConfig([
  { path: "/Login", component: LoginPage, name: "Login", useAsDefault: !Config.hasActiveToken() },
  { path: "/List", component: ListPage, name: "List", useAsDefault: Config.hasActiveToken() }
])
export class AppComponent {}
