export class LoginHelper {
  static styleUrls = ["./login-common.css"];

  configureActionBar() {}

  // TODO: Can we detect connectivity for the web?
  isOffline() { return false; }

  // TODO: Implement
  forgotPasswordPrompt() {
    return Promise.resolve({ result: "", text: "" });
  }

  toggleDisplay(mainContainer, isLoggingIn) {}

  showMainContent(elements) {}
}
