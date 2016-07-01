import {nativeScriptBootstrap} from "nativescript-angular/application";
import {HTTP_PROVIDERS} from "@angular/http";
import {AppComponent} from "./app.component";
import {APP_ROUTER_PROVIDERS} from "./app.routes";
import {setStatusBarColors} from "./utils/status-bar-util";

setStatusBarColors();
nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS, APP_ROUTER_PROVIDERS]);