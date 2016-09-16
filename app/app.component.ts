import { Component } from "@angular/core";

import { setStatusBarColors } from "./utils/status-bar-util";

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {
  constructor() {
    setStatusBarColors();
  }
}
