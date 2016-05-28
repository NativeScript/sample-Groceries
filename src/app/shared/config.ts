export class Config {
  static apiUrl = "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/";
  static get token():string {
    return <string>localStorage.getItem("token");
  }
  static set token(theToken: string) {
    localStorage.setItem("token", theToken);
  }
  static hasActiveToken() {
    return !!localStorage.getItem("token");
  }
}