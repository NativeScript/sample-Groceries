"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var shared_1 = require("../../../shared");
describe("Email validation", function () {
    var user = new shared_1.User();
    it("Should reject an empty email address", function () {
        user.email = "";
        expect(user.isValidEmail()).toBe(false);
    });
    it("Should reject a malformed email addresses", function () {
        user.email = "nativescript";
        expect(user.isValidEmail()).toBe(false);
        user.email = "nativescript@";
        expect(user.isValidEmail()).toBe(false);
        user.email = "nativescript@isawesome";
        expect(user.isValidEmail()).toBe(false);
    });
    it("Should accept valid email addresses", function () {
        user.email = "nativescript@isawesome.com";
        expect(user.isValidEmail()).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTBCO0FBQzFCLDBDQUF1QztBQU12QyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxhQUFJLEVBQUUsQ0FBQztJQUV0QixFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtRQUM5QyxJQUFJLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQTRCLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi8uLi8uLi9zaGFyZWRcIjtcblxuZGVjbGFyZSB2YXIgZGVzY3JpYmU6IGFueTtcbmRlY2xhcmUgdmFyIGV4cGVjdDogYW55O1xuZGVjbGFyZSB2YXIgaXQ6IGFueTtcblxuZGVzY3JpYmUoXCJFbWFpbCB2YWxpZGF0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICBsZXQgdXNlciA9IG5ldyBVc2VyKCk7XG5cbiAgaXQoXCJTaG91bGQgcmVqZWN0IGFuIGVtcHR5IGVtYWlsIGFkZHJlc3NcIiwgZnVuY3Rpb24gKCkge1xuICAgIHVzZXIuZW1haWwgPSBcIlwiO1xuICAgIGV4cGVjdCh1c2VyLmlzVmFsaWRFbWFpbCgpKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgaXQoXCJTaG91bGQgcmVqZWN0IGEgbWFsZm9ybWVkIGVtYWlsIGFkZHJlc3Nlc1wiLCBmdW5jdGlvbigpIHtcbiAgICB1c2VyLmVtYWlsID0gXCJuYXRpdmVzY3JpcHRcIjtcbiAgICBleHBlY3QodXNlci5pc1ZhbGlkRW1haWwoKSkudG9CZShmYWxzZSk7XG5cbiAgICB1c2VyLmVtYWlsID0gXCJuYXRpdmVzY3JpcHRAXCI7XG4gICAgZXhwZWN0KHVzZXIuaXNWYWxpZEVtYWlsKCkpLnRvQmUoZmFsc2UpO1xuXG4gICAgdXNlci5lbWFpbCA9IFwibmF0aXZlc2NyaXB0QGlzYXdlc29tZVwiO1xuICAgIGV4cGVjdCh1c2VyLmlzVmFsaWRFbWFpbCgpKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgaXQoXCJTaG91bGQgYWNjZXB0IHZhbGlkIGVtYWlsIGFkZHJlc3Nlc1wiLCBmdW5jdGlvbigpIHtcbiAgICB1c2VyLmVtYWlsID0gXCJuYXRpdmVzY3JpcHRAaXNhd2Vzb21lLmNvbVwiO1xuICAgIGV4cGVjdCh1c2VyLmlzVmFsaWRFbWFpbCgpKS50b0JlKHRydWUpO1xuICB9KTtcbn0pO1xuIl19