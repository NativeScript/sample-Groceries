import { nativeScriptBootstrap } from "nativescript-angular/application";
import { APP_ROUTER_PROVIDERS } from "./app.routes";
import { AppComponent } from "./app.component";
import { setStatusBarColors } from "./shared/status-bar-util";

setStatusBarColors();
nativeScriptBootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS
]);
