import {Color} from "color";
import {topmost} from "ui/frame";
import {TextField} from "ui/text-field";

declare var android: any;
declare var NSAttributedString: any;
declare var NSDictionary: any;
declare var NSForegroundColorAttributeName: any;

export function setHintColor(viewId: string, color: string) {
  var view = <TextField>topmost().currentPage.getViewById(viewId);

  if (view.android) {
    var colorObject = android.graphics.Color.parseColor(color);
    view.android.setHintTextColor(colorObject);
  }
  if (view.ios) {
    var dictionary = new NSDictionary([new Color(color).ios], [NSForegroundColorAttributeName]);
    view.ios.attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(
      view.hint, dictionary);
  }
}