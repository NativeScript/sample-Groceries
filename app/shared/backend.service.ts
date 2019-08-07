import { Injectable } from "@angular/core";
import { nsSettings } from "@nativescript/core";

const tokenKey = "token";

export class BackendService {
  static baseUrl = "https://baas.kinvey.com/";
  static appKey = "kid_HyHoT_REf";
  static appUserHeader = "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ";
  static apiUrl = "";

  static isLoggedIn(): boolean {
    return !!nsSettings.getString(tokenKey);
  }

  static get token(): string {
    return nsSettings.getString(tokenKey);
  }

  static set token(theToken: string) {
    nsSettings.setString(tokenKey, theToken);
  }
}
