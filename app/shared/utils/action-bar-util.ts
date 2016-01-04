import {ActionItem} from "ui/action-bar";
import {Config} from "../config";

export module ActionBarUtil {
    export function setTitle(title: string) {
        var actionBar = Config.page.actionBar;
        actionBar.title = title;
    }
    export function addButton(button: ActionItem) {
        Config.page.actionBar.actionItems.addItem(button);
    }
    export function emptyActionBarItems() {
        var actionBar = Config.page.actionBar;
        var actionItems = actionBar.actionItems.getItems();
        actionItems.forEach((item) => {
            actionBar.actionItems.removeItem(item);
        });
    }
}
