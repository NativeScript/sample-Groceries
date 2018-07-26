"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var backend_service_1 = require("./backend.service");
var LoginService = /** @class */ (function () {
    function LoginService(http) {
        this.http = http;
    }
    LoginService.prototype.register = function (user) {
        return this.http.post(backend_service_1.BackendService.baseUrl + "user/" + backend_service_1.BackendService.appKey, JSON.stringify({
            username: user.email,
            email: user.email,
            password: user.password
        }), { headers: this.getCommonHeaders() })
            .pipe(operators_1.catchError(this.handleErrors));
    };
    LoginService.prototype.login = function (user) {
        return this.http.post(backend_service_1.BackendService.baseUrl + "user/" + backend_service_1.BackendService.appKey + "/login", JSON.stringify({
            username: user.email,
            password: user.password
        }), { headers: this.getCommonHeaders() })
            .pipe(operators_1.tap(function (data) {
            backend_service_1.BackendService.token = data._kmd.authtoken;
        }), operators_1.catchError(this.handleErrors));
    };
    LoginService.prototype.logoff = function () {
        backend_service_1.BackendService.token = "";
    };
    LoginService.prototype.resetPassword = function (email) {
        return this.http.post(backend_service_1.BackendService.baseUrl + "rpc/" + backend_service_1.BackendService.appKey + "/" + email + "/user-password-reset-initiate", {}, { headers: this.getCommonHeaders() }).pipe(operators_1.catchError(this.handleErrors));
    };
    LoginService.prototype.getCommonHeaders = function () {
        return new http_1.HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": backend_service_1.BackendService.appUserHeader,
        });
    };
    LoginService.prototype.handleErrors = function (error) {
        console.log(JSON.stringify(error));
        return rxjs_1.throwError(error);
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2luLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsNkNBQWtGO0FBQ2xGLDZCQUE4QztBQUM5Qyw0Q0FBc0Q7QUFHdEQscURBQW1EO0FBR25EO0lBQ0Usc0JBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBRXpDLCtCQUFRLEdBQVIsVUFBUyxJQUFVO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbkIsZ0NBQWMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxHQUFHLGdDQUFjLENBQUMsTUFBTSxFQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQyxFQUNGLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQ3JDO2FBQ0EsSUFBSSxDQUFDLHNCQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELDRCQUFLLEdBQUwsVUFBTSxJQUFVO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNuQixnQ0FBYyxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsZ0NBQWMsQ0FBQyxNQUFNLEdBQUcsUUFBUSxFQUNuRSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDLEVBQ0YsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FDckM7YUFDQSxJQUFJLENBQ0gsZUFBRyxDQUFDLFVBQUMsSUFBUztZQUNaLGdDQUFjLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxFQUNGLHNCQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUM5QixDQUFDO0lBQ0osQ0FBQztJQUVELDZCQUFNLEdBQU47UUFDRSxnQ0FBYyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELG9DQUFhLEdBQWIsVUFBYyxLQUFLO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbkIsZ0NBQWMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxHQUFHLGdDQUFjLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsK0JBQStCLEVBQ3ZHLEVBQUUsRUFDRixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUNyQyxDQUFDLElBQUksQ0FBQyxzQkFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTyx1Q0FBZ0IsR0FBeEI7UUFDRSxNQUFNLENBQUMsSUFBSSxrQkFBVyxDQUFDO1lBQ3JCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsZUFBZSxFQUFFLGdDQUFjLENBQUMsYUFBYTtTQUM5QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sbUNBQVksR0FBcEIsVUFBcUIsS0FBd0I7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQXZEVSxZQUFZO1FBRHhCLGlCQUFVLEVBQUU7eUNBRWUsaUJBQVU7T0FEekIsWUFBWSxDQXdEeEI7SUFBRCxtQkFBQztDQUFBLEFBeERELElBd0RDO0FBeERZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBIdHRwSGVhZGVycywgSHR0cENsaWVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uL2h0dHBcIjtcbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgdGFwLCBtYXAsIGNhdGNoRXJyb3IgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcblxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL3VzZXIubW9kZWxcIjtcbmltcG9ydCB7IEJhY2tlbmRTZXJ2aWNlIH0gZnJvbSBcIi4vYmFja2VuZC5zZXJ2aWNlXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICBCYWNrZW5kU2VydmljZS5iYXNlVXJsICsgXCJ1c2VyL1wiICsgQmFja2VuZFNlcnZpY2UuYXBwS2V5LFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB1c2VybmFtZTogdXNlci5lbWFpbCxcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXG4gICAgICB9KSxcbiAgICAgIHsgaGVhZGVyczogdGhpcy5nZXRDb21tb25IZWFkZXJzKCkgfVxuICAgIClcbiAgICAucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3JzKSk7XG4gIH1cblxuICBsb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQmFja2VuZFNlcnZpY2UuYmFzZVVybCArIFwidXNlci9cIiArIEJhY2tlbmRTZXJ2aWNlLmFwcEtleSArIFwiL2xvZ2luXCIsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VyLmVtYWlsLFxuICAgICAgICBwYXNzd29yZDogdXNlci5wYXNzd29yZFxuICAgICAgfSksXG4gICAgICB7IGhlYWRlcnM6IHRoaXMuZ2V0Q29tbW9uSGVhZGVycygpIH1cbiAgICApXG4gICAgLnBpcGUoXG4gICAgICB0YXAoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBCYWNrZW5kU2VydmljZS50b2tlbiA9IGRhdGEuX2ttZC5hdXRodG9rZW47XG4gICAgICB9KSxcbiAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpXG4gICAgKTtcbiAgfVxuXG4gIGxvZ29mZigpIHtcbiAgICBCYWNrZW5kU2VydmljZS50b2tlbiA9IFwiXCI7XG4gIH1cblxuICByZXNldFBhc3N3b3JkKGVtYWlsKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgQmFja2VuZFNlcnZpY2UuYmFzZVVybCArIFwicnBjL1wiICsgQmFja2VuZFNlcnZpY2UuYXBwS2V5ICsgXCIvXCIgKyBlbWFpbCArIFwiL3VzZXItcGFzc3dvcmQtcmVzZXQtaW5pdGlhdGVcIixcbiAgICAgIHt9LFxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmdldENvbW1vbkhlYWRlcnMoKSB9XG4gICAgKS5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29tbW9uSGVhZGVycygpIHtcbiAgICByZXR1cm4gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IEJhY2tlbmRTZXJ2aWNlLmFwcFVzZXJIZWFkZXIsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9ycyhlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgfVxufVxuIl19