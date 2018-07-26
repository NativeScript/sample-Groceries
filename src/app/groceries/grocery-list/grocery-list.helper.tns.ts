import * as utils from "tns-core-modules/utils/utils";

declare var UIColor: any;

export class GroceryListHelper {
  // The following trick makes the background color of each cell
  // in the UITableView transparent as it’s created.
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      // support XCode 8
      cell.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
    }
  }

}