import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
import { Kinvey } from 'kinvey-nativescript-sdk';

Kinvey.init({
  appKey: 'kid_B12-IEx7b',
  appSecret: '13954d0eed70468baf999146e7a5508a'
});

platformNativeScriptDynamic().bootstrapModule(AppModule);
