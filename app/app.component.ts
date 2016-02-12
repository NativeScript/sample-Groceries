import "reflect-metadata";
import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";

import {LoginPage} from "./views/login/login";
import {RegisterPage} from "./views/register/register";
import {ListPage} from "./views/list/list";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>"
})
@RouteConfig([
    { path: "/", component: LoginPage, as: "Login" },
    { path: "/Register", component: RegisterPage, as: "Register" },
    { path: "/List", component: ListPage, as: "List" }
])
export class AppComponent {}
