import {nativeScriptBootstrap} from "nativescript-angular/application";
import {provide} from "angular2/core";
import {ROUTER_PROVIDERS, LocationStrategy} from "angular2/router";
import {NSLocationStrategy} from "./ns-location-strategy";
import {AppComponent} from "./app-component";

nativeScriptBootstrap(AppComponent, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: NSLocationStrategy })]);
