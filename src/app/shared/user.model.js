"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validator = require("email-validator");
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.isValidEmail = function () {
        return validator.validate(this.email);
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXIubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUU3QztJQUFBO0lBTUEsQ0FBQztJQUhDLDJCQUFZLEdBQVo7UUFDRSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5ZLG9CQUFJIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZShcImVtYWlsLXZhbGlkYXRvclwiKTtcblxuZXhwb3J0IGNsYXNzIFVzZXIge1xuICBlbWFpbDogc3RyaW5nO1xuICBwYXNzd29yZDogc3RyaW5nO1xuICBpc1ZhbGlkRW1haWwoKSB7XG4gICAgcmV0dXJuIHZhbGlkYXRvci52YWxpZGF0ZSh0aGlzLmVtYWlsKTtcbiAgfVxufSJdfQ==