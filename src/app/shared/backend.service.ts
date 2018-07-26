import { BackendHelper } from "./backend-helper";

export class BackendService {
  static baseUrl = "https://baas.kinvey.com/";
  static appKey = "kid_HyHoT_REf";
  static appUserHeader = "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ";
  static apiUrl = "";

  private static helper = new BackendHelper();

  static isLoggedIn(): boolean {
    return !!BackendService.helper.getToken();
  }

  static get token(): string {
    return BackendService.helper.getToken();
  }

  static set token(theToken: string) {
    BackendService.helper.setToken(theToken);
  }
}
