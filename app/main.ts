import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { AppModule } from "./app.module";

platformNativeScriptDynamic().bootstrapModule(AppModule);