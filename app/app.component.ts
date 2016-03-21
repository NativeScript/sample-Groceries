import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import * as application from "application";

import {LoginPage} from "./pages/login/login.component";
import {ListPage} from "./pages/list/list.component";

@Component({
  selector: "main",
  directives: [NS_ROUTER_DIRECTIVES],
  template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>"
})
@RouteConfig([
  { path: "/Login", component: LoginPage, as: "Login", useAsDefault: true },
  { path: "/List", component: ListPage, as: "List" }
])
export class AppComponent {}
