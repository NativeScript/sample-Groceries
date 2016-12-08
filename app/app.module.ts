import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NSModuleFactoryLoader } from "./ns-module-factory-loader";
import { authProviders, appRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

setStatusBarColors();

@NgModule({
  providers: [
    BackendService,
    LoginService,
    authProviders,
    { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
  ],
  imports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
