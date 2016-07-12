import {nativeScriptBootstrap} from "nativescript-angular/application";
import {APP_ROUTER_PROVIDERS} from "./app.routes";
import {AppComponent} from "./app.component";
import {setStatusBarColors} from "./utils/status-bar-util";

var firebase = require("nativescript-plugin-firebase");

firebase.init({
   persist: true
          }).then(
              function (instance) {
                console.log("firebase.init done");
              },
              function (error) {
                console.log("firebase.init error: " + error);
              }
          );
setStatusBarColors();
nativeScriptBootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS
]);