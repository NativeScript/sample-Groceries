import { NgModule } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/platform";

import { AppComponent } from "./app.component";

@NgModule({
  imports: [
    NativeScriptModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
