import { nativeScriptBootstrap } from "nativescript-angular/application";

import { APP_ROUTER_PROVIDERS } from "./app.routes";
import { AppComponent } from "./app.component";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

setStatusBarColors();
nativeScriptBootstrap(AppComponent, [
  BackendService,
  LoginService,
  APP_ROUTER_PROVIDERS
]);
