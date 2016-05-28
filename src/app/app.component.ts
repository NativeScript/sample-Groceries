import {Component} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "@angular/router-deprecated";

import {LoginComponent} from "./pages/login/login.component";
import {ListComponent} from "./pages/list/list.component";

@Component({
  selector: "groceries-app",
  template: "<router-outlet></router-outlet>",
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  { path: "/Login", name: "Login", component: LoginComponent, useAsDefault: true },
  { path: "/List", name: "List", component: ListComponent }
])
export class GroceriesAppComponent {}
