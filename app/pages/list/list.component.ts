import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Color} from "color";
import {action} from "ui/dialogs";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
import {alert} from "../../utils/dialog-util";
import {setHintColor} from "../../utils/hint-util";
var socialShare = require("nativescript-social-share");

declare var UIColor: any;

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListPage implements OnInit {
  groceryList: Array<Grocery>;
  history: Array<Grocery>;
  grocery: string = "";

  isAndroid;
  isShowingRecent = false;
  isLoading = false;
  listLoaded = false;

  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _router: Router,
    private _groceryListService: GroceryListService,
    private page: Page) {}

  ngOnInit() {
    this.isAndroid = !!this.page.android;
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
    this.load();
  }

  setTextFieldHintColor(textField) {
    // TODO: Why is it necessary to defer this code on iOS?
    // It should work without the setTimeout like it does on Android.
    setTimeout(() => {
      setHintColor({
        view: <TextField>textField,
        color: new Color("white")
      });
    });
  }

  // Prevent the first textfield from receiving focus on Android
  // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
  handleAndroidFocus(textField, container) {
    if (container.android) {
      container.android.setFocusableInTouchMode(true);
      container.android.setFocusable(true);
      textField.android.clearFocus();
    }
  }

  // The following trick makes the background color of each cell
  // in the UITableView transparent as it’s created.
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      cell.backgroundColor = UIColor.clearColor();
    }
  }

  load() {
    this.isLoading = true;
    //clear list view
    this.groceryList = [];
    this.history = [];

    this._groceryListService.load()
      .subscribe(loadedGroceries => {
        //create a new items object to trick change detection
        this.groceryList = [];
        loadedGroceries.forEach((groceryObject: Grocery) => {
          if (groceryObject.deleted) {
            this.history.unshift(groceryObject);
          } else {
            this.groceryList.unshift(groceryObject);
          }
        });
        this.isLoading = false;
        this.listLoaded = true;
      });
  }

  add() {
    if (this.isShowingRecent) {
      return;
    }

    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.isLoading = true;

    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.groceryList.unshift(groceryObject);
          this.grocery = "";
          this.isLoading = false;
        },
        () => {
          alert("An error occurred while adding an item to your list.");
          this.isLoading = false;
        }
      );
  }

  toggleDone(grocery: Grocery) {
    this.isLoading = true;
    this._groceryListService.toggleDoneFlag(grocery)
      .subscribe(() => {
        grocery.done = !grocery.done;
        this.isLoading = false;
      }, () => {
        alert("An error occurred managing your grocery list.");
        this.isLoading = false;
      });
  }

  toggleDoneHistory(grocery: Grocery) {
    grocery.done = !grocery.done;
  }

  toggleRecent() {
    let groceriesToRestore = []
    this.history.forEach((grocery) => {
      if (grocery.done) {
        groceriesToRestore.push(grocery);
      }
    });

    if (!this.isShowingRecent || groceriesToRestore.length == 0) {
      this.isShowingRecent = !this.isShowingRecent;
      return;
    }

    this.isLoading = true;
    this._groceryListService.restore(groceriesToRestore)
      .subscribe(() => {
        this.isShowingRecent = false;
        this.load();
      });
  }

  delete(grocery: Grocery) {
    this.isLoading = true;
    this._groceryListService.setDeleteFlag(grocery)
      .subscribe(() => {
        var index = this.groceryList.indexOf(grocery);
        grocery.deleted = true;
        this.groceryList.splice(index, 1);
        this.history.push(grocery);
        this.isLoading = false;
      }, () => {
        alert("An error occurred while deleting an item from your list.");
        this.isLoading = false;
      });
  }

  showMenu() {
    action({
      message: "What would you like to do?",
      actions: ["Share", "Log Off"],
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result == "Share") {
        this.share();
      } else if (result == "Log Off") {
        this.logoff();
      }
    });
  }

  share() {
    let list = [];
    for (let i = 0, size = this.groceryList.length; i < size ; i++) {
      list.push(this.groceryList[i].name);
    }
    let listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }

  logoff() {
    this._router.navigate(["Login"]);
  }
}
