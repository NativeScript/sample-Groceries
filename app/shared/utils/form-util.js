var gesturesModule = require("ui/gestures");

exports.hideKeyboardOnBlur = function(page, views) {
	page.observe(gesturesModule.GestureTypes.tap, function() {
		views.forEach(function(view) {
			view.dismissSoftInput();
		});
	});
};
