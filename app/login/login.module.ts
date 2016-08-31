import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";

import { loginRouting } from "./login.routing";
import { LoginComponent } from "./login.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    loginRouting
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
