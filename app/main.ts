import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
import { Kinvey } from 'kinvey-nativescript-sdk';

Kinvey.init({
  appKey: '<app-key>',
  appSecret: '<app-secret>'
});

platformNativeScriptDynamic().bootstrapModule(AppModule);
