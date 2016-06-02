import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {setStatusBarColors} from "./utils/status-bar-util";

setStatusBarColors();
nativeScriptBootstrap(AppComponent);