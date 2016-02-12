import {nativeScriptBootstrap} from "nativescript-angular/application";
import {NS_ROUTER_PROVIDERS} from "nativescript-angular/router/ns-router";
import {AppComponent} from "./app.component";

nativeScriptBootstrap(AppComponent, [NS_ROUTER_PROVIDERS]);
