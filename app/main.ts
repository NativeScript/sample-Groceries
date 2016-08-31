import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { routes } from "./app.routes";
import { AppComponent } from "./app.component";
import { setStatusBarColors, BackendService, LoginService } from "./shared";
import { AuthGuard } from "./auth.guard";

import { LoginComponent } from "./login/login.component";
import { GroceriesComponent } from "./groceries/groceries.component";
import { GroceryListComponent } from "./groceries/grocery-list/grocery-list.component";
import { ItemStatusPipe } from "./groceries/grocery-list/item-status.pipe";

setStatusBarColors();

@NgModule({
  declarations: [
    LoginComponent,
    GroceriesComponent,
    GroceryListComponent,
    ItemStatusPipe
  ],
  providers: [
    BackendService,
    LoginService,
    AuthGuard
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent]
})
class AppComponentModule { }

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);