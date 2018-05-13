import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Grocery } from "../../shared/grocery/grocery.model";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";
import { BackendService } from "../../shared/backend.service";
import { GroceryList } from "./grocery-list.component";

@Component({
  selector: "list",
  templateUrl: "./list.html",
  styleUrls: ["./list.css"],
  providers: [GroceryListService]
})
export class ListComponent implements OnInit {
  grocery: string = "";

  isLoading = false;
  isShowingRecent = false;

  constructor(private _router: Router, private store: GroceryListService) {}

  ngOnInit() {
    if (!BackendService.token) {
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
    this.isShowingRecent = !this.isShowingRecent;
  }
}
