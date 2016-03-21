import {Color} from "color";
import {topmost} from "ui/frame";
import {TextField} from "ui/text-field";

declare var android: any;
declare var NSAttributedString: any;
declare var NSDictionary: any;
declare var NSForegroundColorAttributeName: any;

export function setHintColor(args: { view: TextField, color: string }) {
  if (args.view.android) {
    var colorObject = android.graphics.Color.parseColor(args.color);
    if (args.view.android) {
      args.view.android.setHintTextColor(colorObject);
    }
  }
  if (args.view.ios) {
    var dictionary = new NSDictionary([new Color(args.color).ios], [NSForegroundColorAttributeName]);
    args.view.ios.attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(
      args.view.hint, dictionary);
  }
}
