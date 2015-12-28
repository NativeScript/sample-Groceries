import {nativeScriptBootstrap} from "nativescript-angular/application";
import {Component} from "angular2/core";

@Component({
    selector: "main",
    template: `
        <Label text="Hello world 2!"></Label>
    `
})
class MainPage {
    //...
}

export function loaded(args) {
    nativeScriptBootstrap(MainPage, []);
}
