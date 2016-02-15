var validator = require("email-validator");

export class User {
  email: string;
  password: string;
  isValidEmail: function() {
    return validator.validate(this.email);
  }
}
