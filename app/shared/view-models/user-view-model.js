var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");
var User = (function (_super) {
    __extends(User, _super);
    function User(info) {
        _super.call(this);
        this.email = info.email || "";
        this.password = info.password || "";
    }
    User.prototype.register = function () {
        return fetchModule.fetch(config.apiUrl + "Users", {
            method: "POST",
            body: JSON.stringify({
                Username: this.get("email"),
                Email: this.get("email"),
                Password: this.get("password")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleErrors);
    };
    return User;
})(observableModule.Observable);
function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci12aWV3LW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci12aWV3LW1vZGVsLnRzIl0sIm5hbWVzIjpbIlVzZXIiLCJVc2VyLmNvbnN0cnVjdG9yIiwiVXNlci5yZWdpc3RlciIsImhhbmRsZUVycm9ycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFZLE1BQU0sV0FBTSxxQkFBcUIsQ0FBQyxDQUFBO0FBQzlDLElBQVksV0FBVyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLElBQVksZ0JBQWdCLFdBQU0saUJBQWlCLENBQUMsQ0FBQTtBQUVwRDtJQUFtQkEsd0JBQTJCQTtJQWlCMUNBLGNBQVlBLElBQUlBO1FBQ1pDLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxFQUFFQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsSUFBSUEsRUFBRUEsQ0FBQ0E7SUFDeENBLENBQUNBO0lBbkJERCx1QkFBUUEsR0FBUkE7UUFDSUUsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsT0FBT0EsRUFBRUE7WUFDOUNBLE1BQU1BLEVBQUVBLE1BQU1BO1lBQ2RBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO2dCQUNqQkEsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQzNCQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQTtnQkFDeEJBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFVBQVVBLENBQUNBO2FBQ2pDQSxDQUFDQTtZQUNGQSxPQUFPQSxFQUFFQTtnQkFDTEEsY0FBY0EsRUFBRUEsa0JBQWtCQTthQUNyQ0E7U0FDSkEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7SUFDMUJBLENBQUNBO0lBUUxGLFdBQUNBO0FBQURBLENBQUNBLEFBdkJELEVBQW1CLGdCQUFnQixDQUFDLFVBQVUsRUF1QjdDO0FBRUQsc0JBQXNCLFFBQVE7SUFDMUJHLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQ2ZBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1FBQ3RDQSxNQUFNQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7SUFDREEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7QUFDcEJBLENBQUNBO0FBRUQ7a0JBQWUsSUFBSSxDQUFDIn0=