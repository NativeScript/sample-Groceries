import { Injectable } from "@angular/core";

const tokenKey = "token";

export class BackendService {
  static baseUrl = "https://baas.kinvey.com/";
  static appKey = "kid_HyHoT_REf";
  static appUserHeader = "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ";
  static apiUrl = "";

  static isLoggedIn(): boolean {
    return !!localStorage.getItem(tokenKey);
  }

  static get token(): string {
    return localStorage.getItem(tokenKey);
  }

  static set token(theToken: string) {
    localStorage.setItem(tokenKey, theToken);
  }
}