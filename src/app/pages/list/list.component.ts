import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";
import {Config} from "../../shared/config";
import {ActivityIndicator} from "../../components/activity-indicator.component";
import {GroceryList} from "./grocery-list.component";

@Component({
  selector: "list",
  directives: [ActivityIndicator, GroceryList],
  templateUrl: "./app/pages/list/list.html",
  styleUrls: ["./app/pages/list/list.css"],
  providers: [GroceryStore]
})
export class ListComponent implements OnInit {
  grocery: string = "";

  isLoading = false;
  isShowingRecent = false;

  constructor(private _router: Router, private store: GroceryStore) {}

  ngOnInit() {
    if (!Config.token) {
      this._router.navigate(["Login"]);
      return;
    }

    this.isLoading = true;
  }

  hideLoadingIndicator() {
    this.isLoading = false;
  }
  
  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    this.store.add(this.grocery)
      .subscribe(() => {
        this.grocery = "";
      }, () => {
        alert("An error occurred while adding a grocery to your list.");
      });
  }

  toggleRecent() {
    if (this.isShowingRecent) {
      this.store.restore()
        .subscribe(
          () => { this.isShowingRecent = false },
          () => { alert("An error occurred while adding groceries to your list.") }
        )
    } else {
      this.isShowingRecent = true;
    }
  }
}
