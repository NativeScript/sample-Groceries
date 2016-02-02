import "reflect-metadata";
import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

import {LoginPage} from "./views/login/login";
import {RegisterPage} from "./views/register/register";
import {ListPage} from "./views/list/list";

@Component({
    selector: "main",
    directives: [ROUTER_DIRECTIVES],
    template: "<StackLayout><router-outlet></router-outlet></StackLayout>"
})
@RouteConfig([
    { path: "/", component: LoginPage, as: "Login" },
    { path: "/Register", component: RegisterPage, as: "Register" },
    { path: "/List", component: ListPage, as: "List" }
])
export class AppComponent {}
