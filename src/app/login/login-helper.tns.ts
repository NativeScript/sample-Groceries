import { Color } from "tns-core-modules/color";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { Animation } from "tns-core-modules/ui/animation";
import { View } from "tns-core-modules/ui/core/view";
import { prompt } from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";

export class LoginHelper {
  static styleUrls = ["./login-common.css", "./login.component.css"];

  configureActionBar() {
    topmost().currentPage.actionBarHidden = true;
  }

  isOffline() {
    return getConnectionType() === connectionType.none;
  }

  forgotPassword() {
    return prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for Groceries to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    });
  }

  toggleDisplay(mainContainer, isLoggingIn) {
    let theMainContainer = <View>mainContainer.nativeElement;
    theMainContainer.animate({
      backgroundColor: isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    });
  }

  showMainContent(elements) {
    let initialContainer = <View>elements.initialContainer.nativeElement;
    let mainContainer = <View>elements.mainContainer.nativeElement;
    let logoContainer = <View>elements.logoContainer.nativeElement;
    let formControls = <View>elements.formControls.nativeElement;
    let signUpStack = <View>elements.signUpStack.nativeElement;
    let animations = [];

    // Fade out the initial content over one half second
    initialContainer.animate({
      opacity: 0,
      duration: 500
    }).then(function() {
      // After the animation completes, hide the initial container and
      // show the main container and logo. The main container and logo will
      // not immediately appear because their opacity is set to 0 in CSS.
      initialContainer.style.visibility = "collapse";
      mainContainer.style.visibility = "visible";
      logoContainer.style.visibility = "visible";

      // Fade in the main container and logo over one half second.
      animations.push({ target: mainContainer, opacity: 1, duration: 500 });
      animations.push({ target: logoContainer, opacity: 1, duration: 500 });

      // Slide up the form controls and sign up container.
      animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
      animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });

      // Kick off the animation queue
      new Animation(animations, false).play();
    });
  }
}

