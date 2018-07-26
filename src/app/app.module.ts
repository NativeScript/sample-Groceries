import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { authProviders, appRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { LoginModule } from "./login/login.module";
import { GroceriesModule } from "./groceries/groceries.module";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

setStatusBarColors();

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    LoginModule,
    GroceriesModule,
    RouterModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    BackendService,
    LoginService,
    authProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
