var gesturesModule = require("ui/gestures");

exports.hideKeyboardOnBlur = function(page, views) {
	page.observe(gesturesModule.GestureTypes.tap, function(view) {
		views.forEach(function(view) {
			view.dismissSoftInput();
		});
	});
};
