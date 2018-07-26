import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { GroceryService } from "./shared";

@Component({
  selector: "gr-groceries",
  templateUrl: "./groceries.component.html",
  styleUrls: ["./groceries.component.css"],
  providers: [GroceryService]
})
export class GroceriesComponent implements OnInit {
  grocery: string = "";

  isLoading = false;
  isShowingRecent = false;

  constructor(private _router: Router, private store: GroceryService) {}

  ngOnInit() {
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
