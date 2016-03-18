import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";

import * as Config from "./shared/config";
import {LoginPage} from "./pages/login/login.component";
import {ListPage} from "./pages/list/list.component";

var startOnList = !!Config.token;

@Component({
  selector: "main",
  directives: [NS_ROUTER_DIRECTIVES],
  template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>"
})
@RouteConfig([
  { path: "/Login", component: LoginPage, as: "Login", useAsDefault: !startOnList },
  { path: "/List", component: ListPage, as: "List", useAsDefault: startOnList }
])
export class AppComponent {}
