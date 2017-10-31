var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.loaded = function(args) {
    page = args.object;
    isLoggingIn = user.isLoggingIn;

    if (page.ios) {
        var navigationBar = frameModule.topmost().ios.controller.navigationBar;
        navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
    }

    page.bindingContext = user;
};

exports.signIn = function() {
    user.login()
        .catch(function(error) {
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            frameModule.topmost().navigate("views/list/list");
        });
};

toggleDisplay = function() {
    isLoggingIn = !isLoggingIn;
    user.set('isLoggingIn', isLoggingIn);
}

exports.register = function(){
    toggleDisplay();
}
/*exports.register = function() {
    user.register()
        .then(function() {
            dialogsModule
                .alert("Your account was successfully created.")
                .then(function() {
                    frameModule.topmost().navigate("views/login/login");
                });
        }).catch(function(error) {
            dialogsModule
                .alert({
                    message: "Unfortunately we were unable to create your account.",
                    okButtonText: "OK"
                });
        });
};*/