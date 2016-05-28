"use strict";
var User = (function () {
    function User() {
    }
    User.prototype.isValidEmail = function () {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email);
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map