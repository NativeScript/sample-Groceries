export class BackendHelper {
  public getToken() {
    return localStorage.getItem("token");
  }

  public setToken(token) {
    localStorage.setItem("token", token);
  }
}
