"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var shared_1 = require("../../shared");
var grocery_model_1 = require("./grocery.model");
var GroceryService = /** @class */ (function () {
    function GroceryService(http, zone) {
        this.http = http;
        this.zone = zone;
        this.items = new rxjs_1.BehaviorSubject([]);
        this.allItems = [];
        this.baseUrl = shared_1.BackendService.baseUrl + "appdata/" + shared_1.BackendService.appKey + "/Groceries";
    }
    GroceryService.prototype.load = function () {
        var _this = this;
        var params = new http_1.HttpParams();
        params.append("sort", "{\"_kmd.lmt\": -1}");
        return this.http.get(this.baseUrl, {
            headers: this.getCommonHeaders(),
            params: params,
        })
            .pipe(operators_1.map(function (data) {
            data.forEach(function (grocery) {
                _this.allItems.push(new grocery_model_1.Grocery(grocery._id, grocery.Name, grocery.Done || false, grocery.Deleted || false));
                _this.publishUpdates();
            });
        }), operators_1.catchError(this.handleErrors));
    };
    GroceryService.prototype.add = function (name) {
        var _this = this;
        return this.http.post(this.baseUrl, JSON.stringify({ Name: name }), { headers: this.getCommonHeaders() })
            .pipe(operators_1.map(function (data) {
            _this.allItems.unshift(new grocery_model_1.Grocery(data._id, name, false, false));
            _this.publishUpdates();
        }), operators_1.catchError(this.handleErrors));
    };
    GroceryService.prototype.setDeleteFlag = function (item) {
        var _this = this;
        item.deleted = true;
        return this.put(item)
            .pipe(operators_1.map(function (data) {
            item.done = false;
            _this.publishUpdates();
        }));
    };
    GroceryService.prototype.unsetDeleteFlag = function (item) {
        var _this = this;
        item.deleted = false;
        return this.put(item)
            .pipe(operators_1.map(function (data) {
            item.done = false;
            _this.publishUpdates();
        }));
    };
    GroceryService.prototype.toggleDoneFlag = function (item) {
        item.done = !item.done;
        this.publishUpdates();
        return this.put(item);
    };
    GroceryService.prototype.permanentlyDelete = function (item) {
        var _this = this;
        return this.http
            .delete(this.baseUrl + "/" + item.id, { headers: this.getCommonHeaders() })
            .pipe(operators_1.map(function (data) {
            var index = _this.allItems.indexOf(item);
            _this.allItems.splice(index, 1);
            _this.publishUpdates();
        }), operators_1.catchError(this.handleErrors));
    };
    GroceryService.prototype.put = function (grocery) {
        return this.http.put(this.baseUrl + "/" + grocery.id, JSON.stringify({
            Name: grocery.name,
            Done: grocery.done,
            Deleted: grocery.deleted
        }), { headers: this.getCommonHeaders() })
            .pipe(operators_1.catchError(this.handleErrors));
    };
    GroceryService.prototype.publishUpdates = function () {
        var _this = this;
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this.zone.run(function () {
            // must emit a *new* value (immutability!)
            _this.items.next(_this.allItems.slice());
        });
    };
    GroceryService.prototype.getCommonHeaders = function () {
        return new http_1.HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": "Kinvey " + shared_1.BackendService.token,
        });
    };
    GroceryService.prototype.handleErrors = function (error) {
        console.log(error);
        return rxjs_1.throwError(error);
    };
    GroceryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, core_1.NgZone])
    ], GroceryService);
    return GroceryService;
}());
exports.GroceryService = GroceryService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvY2VyeS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvY2VyeS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBQ25ELDZDQUs4QjtBQUM5Qiw2QkFBK0Q7QUFDL0QsNENBQWlEO0FBRWpELHVDQUE4QztBQUM5QyxpREFBMEM7QUFHMUM7SUFLRSx3QkFBb0IsSUFBZ0IsRUFBVSxJQUFZO1FBQXRDLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBSjFELFVBQUssR0FBb0MsSUFBSSxzQkFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELGFBQVEsR0FBbUIsRUFBRSxDQUFDO1FBQ3RDLFlBQU8sR0FBRyx1QkFBYyxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsdUJBQWMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0lBRXZCLENBQUM7SUFFL0QsNkJBQUksR0FBSjtRQUFBLGlCQXdCQztRQXZCQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFVLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEMsTUFBTSxRQUFBO1NBQ1AsQ0FBQzthQUNELElBQUksQ0FDSCxlQUFHLENBQUMsVUFBQyxJQUFXO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87Z0JBQ25CLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNoQixJQUFJLHVCQUFPLENBQ1QsT0FBTyxDQUFDLEdBQUcsRUFDWCxPQUFPLENBQUMsSUFBSSxFQUNaLE9BQU8sQ0FBQyxJQUFJLElBQUksS0FBSyxFQUNyQixPQUFPLENBQUMs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ZWN0YWJsZSwgTmdab25lIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7XG4gIEh0dHBDbGllbnQsXG4gIEh0dHBIZWFkZXJzLFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cFBhcmFtcyxcbn0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QsIHRocm93RXJyb3IgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG5cbmltcG9ydCB7IEJhY2tlbmRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZFwiO1xuaW1wb3J0IHsgR3JvY2VyeSB9IGZyb20gXCIuL2dyb2NlcnkubW9kZWxcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdyb2NlcnlTZXJ2aWNlIHtcbiAgaXRlbXM6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxHcm9jZXJ5Pj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcbiAgcHJpdmF0ZSBhbGxJdGVtczogQXJyYXk8R3JvY2VyeT4gPSBbXTtcbiAgYmFzZVVybCA9IEJhY2tlbmRTZXJ2aWNlLmJhc2VVcmwgKyBcImFwcGRhdGEvXCIgKyBCYWNrZW5kU2VydmljZS5hcHBLZXkgKyBcIi9Hcm9jZXJpZXNcIjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgem9uZTogTmdab25lKSB7IH1cblxuICBsb2FkKCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKCk7XG4gICAgcGFyYW1zLmFwcGVuZChcInNvcnRcIiwgXCJ7XFxcIl9rbWQubG10XFxcIjogLTF9XCIpO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5iYXNlVXJsLCB7XG4gICAgICBoZWFkZXJzOiB0aGlzLmdldENvbW1vbkhlYWRlcnMoKSxcbiAgICAgIHBhcmFtcyxcbiAgICB9KVxuICAgIC5waXBlKFxuICAgICAgbWFwKChkYXRhOiBhbnlbXSkgPT4ge1xuICAgICAgICBkYXRhLmZvckVhY2goKGdyb2NlcnkpID0+IHtcbiAgICAgICAgICB0aGlzLmFsbEl0ZW1zLnB1c2goXG4gICAgICAgICAgICBuZXcgR3JvY2VyeShcbiAgICAgICAgICAgICAgZ3JvY2VyeS5faWQsXG4gICAgICAgICAgICAgIGdyb2NlcnkuTmFtZSxcbiAgICAgICAgICAgICAgZ3JvY2VyeS5Eb25lIHx8IGZhbHNlLFxuICAgICAgICAgICAgICBncm9jZXJ5LkRlbGV0ZWQgfHwgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucHVibGlzaFVwZGF0ZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpXG4gICAgKTtcbiAgfVxuXG4gIGFkZChuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICB0aGlzLmJhc2VVcmwsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IE5hbWU6IG5hbWUgfSksXG4gICAgICB7IGhlYWRlcnM6IHRoaXMuZ2V0Q29tbW9uSGVhZGVycygpIH1cbiAgICApXG4gICAgLnBpcGUoXG4gICAgICBtYXAoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLmFsbEl0ZW1zLnVuc2hpZnQobmV3IEdyb2NlcnkoZGF0YS5faWQsIG5hbWUsIGZhbHNlLCBmYWxzZSkpO1xuICAgICAgICB0aGlzLnB1Ymxpc2hVcGRhdGVzKCk7XG4gICAgICB9KSxcbiAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpXG4gICAgKTtcbiAgfVxuXG4gIHNldERlbGV0ZUZsYWcoaXRlbTogR3JvY2VyeSkge1xuICAgIGl0ZW0uZGVsZXRlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMucHV0KGl0ZW0pXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKGRhdGEgPT4ge1xuICAgICAgICAgIGl0ZW0uZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucHVibGlzaFVwZGF0ZXMoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICB1bnNldERlbGV0ZUZsYWcoaXRlbTogR3JvY2VyeSkge1xuICAgIGl0ZW0uZGVsZXRlZCA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzLnB1dChpdGVtKVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcChkYXRhID0+IHtcbiAgICAgICAgICBpdGVtLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnB1Ymxpc2hVcGRhdGVzKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cblxuICB0b2dnbGVEb25lRmxhZyhpdGVtOiBHcm9jZXJ5KSB7XG4gICAgaXRlbS5kb25lID0gIWl0ZW0uZG9uZTtcbiAgICB0aGlzLnB1Ymxpc2hVcGRhdGVzKCk7XG4gICAgcmV0dXJuIHRoaXMucHV0KGl0ZW0pO1xuICB9XG5cbiAgcGVybWFuZW50bHlEZWxldGUoaXRlbTogR3JvY2VyeSkge1xuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5kZWxldGUoXG4gICAgICAgIHRoaXMuYmFzZVVybCArIFwiL1wiICsgaXRlbS5pZCxcbiAgICAgICAgeyBoZWFkZXJzOiB0aGlzLmdldENvbW1vbkhlYWRlcnMoKSB9XG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKGRhdGEgPT4ge1xuICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuYWxsSXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICB0aGlzLmFsbEl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgdGhpcy5wdWJsaXNoVXBkYXRlcygpO1xuICAgICAgICB9KSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9ycylcbiAgICAgICk7XG4gIH1cblxuICBwcml2YXRlIHB1dChncm9jZXJ5OiBHcm9jZXJ5KSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoXG4gICAgICB0aGlzLmJhc2VVcmwgKyBcIi9cIiArIGdyb2NlcnkuaWQsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIE5hbWU6IGdyb2NlcnkubmFtZSxcbiAgICAgICAgRG9uZTogZ3JvY2VyeS5kb25lLFxuICAgICAgICBEZWxldGVkOiBncm9jZXJ5LmRlbGV0ZWRcbiAgICAgIH0pLFxuICAgICAgeyBoZWFkZXJzOiB0aGlzLmdldENvbW1vbkhlYWRlcnMoKSB9XG4gICAgKVxuICAgIC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpKTtcbiAgfVxuXG4gIHByaXZhdGUgcHVibGlzaFVwZGF0ZXMoKSB7XG4gICAgLy8gTWFrZSBzdXJlIGFsbCB1cGRhdGVzIGFyZSBwdWJsaXNoZWQgaW5zaWRlIE5nWm9uZSBzbyB0aGF0IGNoYW5nZSBkZXRlY3Rpb24gaXMgdHJpZ2dlcmVkIGlmIG5lZWRlZFxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgLy8gbXVzdCBlbWl0IGEgKm5ldyogdmFsdWUgKGltbXV0YWJpbGl0eSEpXG4gICAgICB0aGlzLml0ZW1zLm5leHQoWy4uLnRoaXMuYWxsSXRlbXNdKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29tbW9uSGVhZGVycygpIHtcbiAgICByZXR1cm4gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiS2ludmV5IFwiICsgQmFja2VuZFNlcnZpY2UudG9rZW4sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9ycyhlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICB9XG59XG4iXX0=