import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { loginRouting } from "./login.routing";
import { LoginComponent } from "./login.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    loginRouting
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
