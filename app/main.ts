import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {setStatusBarColors} from "./utils/status-bar-util";
import {NS_ROUTER_PROVIDERS, routerTraceCategory} from "nativescript-angular/router";
import {HTTP_PROVIDERS} from "@angular/http";

setStatusBarColors();
nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS]);