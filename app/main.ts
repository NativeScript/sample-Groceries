import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";

// TODO: This is temporary. Remove after this is fixed.
import "./livesync-patch";

nativeScriptBootstrap(AppComponent);