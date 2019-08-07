import { nsDialogs } from "@nativescript/ui";

export function alert(message: string) {
  return nsDialogs.alert({
    title: "Groceries",
    okButtonText: "OK",
    message: message
  });
}
