import { Pipe, PipeTransform } from "@angular/core";

import { Grocery } from "../shared";

@Pipe({
  name: "itemStatus"
})
export class ItemStatusPipe implements PipeTransform {
  transform(items: Array<Grocery>, deleted: boolean) {
    let itemsToShow: Grocery[] = [];
    if (items && Array.isArray(items)) {
      itemsToShow = items.filter((grocery: Grocery) => {
        return grocery.deleted === deleted;
      });
    }
    return itemsToShow;
  }
}