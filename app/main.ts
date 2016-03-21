import * as application from "application";
import {nativeScriptBootstrap} from "nativescript-angular/application";
import {HTTP_PROVIDERS} from "angular2/http";
import {NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import {AppComponent} from "./app.component";
import "./livesync-patch";

// Make TypeScript happy
declare var UIResponder: any;
declare var UIStatusBarStyle: any;
declare var UIApplication: any;
declare var UIApplicationDelegate: any;

// Set the iOS status bar color
if (application.ios) {
  var AppDelegate = UIResponder.extend({
    applicationDidFinishLaunchingWithOptions: function () {
      UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent;
      return true;
    }
  }, {
    name: "AppDelegate",
    protocols: [UIApplicationDelegate]
  });
  application.ios.delegate = AppDelegate;
}

nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS]);
