import {topmost} from "ui/frame";
import {ActionItem} from "ui/action-bar";

declare var UIBarStyle: any;

export module ActionBarUtil {
    export function setTitle(title: string) {
        var actionBar = topmost().currentPage.actionBar;
        actionBar.title = title;
    }
    export function addButton(button: ActionItem) {
        topmost().currentPage.actionBar.actionItems.addItem(button);
    }
    export function emptyActionBarItems() {
        var actionBar = topmost().currentPage.actionBar;
        var actionItems = actionBar.actionItems.getItems();
        actionItems.forEach((item) => {
            actionBar.actionItems.removeItem(item);
        });
    }
    export function customizeStatusBar() {
        if (topmost().ios) {
            let navigationBar = topmost().ios.controller.navigationBar;
            navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
        }
    }
}
