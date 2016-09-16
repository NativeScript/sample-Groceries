import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core"; 
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { routes, navigatableComponents } from "./app.routes";
import { AppComponent } from "./app.component";
import { setStatusBarColors } from "./utils/status-bar-util";

setStatusBarColors();

@NgModule({
    declarations: [
        AppComponent,
        ...navigatableComponents,
    ],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes),
    ],
})
class AppModule {}

platformNativeScriptDynamic().bootstrapModule(AppModule);
