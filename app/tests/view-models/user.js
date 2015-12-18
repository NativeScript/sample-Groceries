var UserViewModel = require("../../shared/view-models/user-view-model");

describe("Email validation", function () {
	var user = new UserViewModel();

	it("Should reject an empty email address", function () {
		user.set("email", "");
		assert.isFalse(user.isValidEmail());
	});

	it("Should reject a malformed email addresses", function() {
		user.set("email", "nativescript");
		assert.isFalse(user.isValidEmail());

		user.set("email", "nativescript@");
		assert.isFalse(user.isValidEmail());

		user.set("email", "nativescript@isawesome");
		assert.isFalse(user.isValidEmail());
	});

	it("Should accept valid email addresses", function() {
		user.set("email", "nativescript@isawesome.com");
		assert.isTrue(user.isValidEmail());
	});
});
