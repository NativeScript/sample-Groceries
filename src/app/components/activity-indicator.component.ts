import {Component, Input} from "@angular/core";

@Component({
  selector: "activity-indicator",
  inputs: ["isLoading"],
  template: `
    <div [class.hidden]="!isLoading">
      <img src="./app/assets/images/loading.gif">
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    div {
      position: fixed;
      bottom: 0;
      right: 0;
      padding: 0.5em;
      background: white;
      border: solid 1px #c8cccf;
      border-width: 1px 0 0 1px;
      display: flex;
    }
    img {
      height: 50px;
    }
    span {
      line-height: 50px;
    }
  `]
})
export class ActivityIndicator {
  @Input("isLoading") isLoading = false;
  @Input("message") message = "Loading"
}
