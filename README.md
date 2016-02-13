[![Build Status](https://travis-ci.org/NativeScript/sample-Groceries.svg?branch=master)](https://travis-ci.org/NativeScript/sample-Groceries)

# Groceries

Groceries is a NativeScript-built iOS and Android app for managing grocery lists. You can learn how to build a version of this app from scratch in the [official NativeScript getting started guide](http://docs.nativescript.org/start/getting-started).

* [Download](#download)
* [Branches](#branches)
* [Screenshots](#screenshots)
* [Development](#development)
    * [Telerik AppBuilder](#telerik-appbuilder)
    * [Linting](#linting)
    * [Unit testing](#unit-testing)

<h2 id="download">Download</h2>

The latest version of Groceries is available on the iOS App Store as well as Google Play:

<a href="https://itunes.apple.com/us/app/groceries-simple-grocery-lists/id1041129105?mt=8">
	<img src="assets/app-store-icons/ios-app-store.png">
</a>
<a href="https://play.google.com/store/apps/details?id=org.nativescript.groceries&hl=en">
	<img src="assets/app-store-icons/google-play.png">
</a>

<h2 id="branches">Branches</h2>

This repository contains a number of branches intended to show off a number of the ways you can build NativeScript apps:

* The [**start** branch](https://github.com/NativeScript/sample-Groceries/tree/start) contains the starting point for the [official NativeScript getting started guide](http://docs.nativescript.org/start/getting-started).
* The [**end** branch](https://github.com/NativeScript/sample-Groceries/tree/end) contains the finished code for the getting started guide. Refer to it at any point while you’re completing the guide.
* The [**master** branch](https://github.com/NativeScript/sample-Groceries/) contains the version of Groceries that appears in the iOS App Store and Google Play. The intention of the master branch is to show how to build a robust, real-world app using NativeScript.
* The [**firebase** branch](https://github.com/NativeScript/sample-Groceries/tree/firebase) contains a version of Groceries that [uses Firebase as its data store](https://www.nativescript.org/blog/ignite-your-app-development-with-nativescript-and-firebase).
* The [**angular** branch](https://github.com/NativeScript/sample-Groceries/tree/angular) contains a version of Groceries built with [NativeScript’s Angular 2 integration](http://angularjs.blogspot.com/2015/12/building-mobile-apps-with-angular-2-and.html).

<h2 id="screenshots">Screenshots</h2>

![](assets/screenshots/ios-1.png)
![](assets/screenshots/ios-2.png)
![](assets/screenshots/ios-3.png)

![](assets/screenshots/android-1.png)
![](assets/screenshots/android-2.png)
![](assets/screenshots/android-3.png)

<h2 id="development">Development</h2>

This app is built with the [NativeScript CLI](https://github.com/NativeScript/nativescript-cli). Once you have the [CLI installed](https://github.com/NativeScript/nativescript-cli#installation), start by cloning the repo:

```
$ git clone https://github.com/NativeScript/sample-Groceries.git
$ cd sample-Groceries
```

Next, install the app's iOS and Android runtimes, as well as the app's npm dependencies:

```
$ tns install
```

From there you can use the `run` command to run Groceries on iOS:

```
$ tns run ios --emulator
```

And the same command to run Groceries on Android:

```
$ tns run android --emulator
```

Finally, use the `livesync` command to push out changes to your app without having to go through the full build cycle:

```
$ tns livesync ios --emulator --watch
```
```
$ tns livesync android --emulator --watch
```

<h3 id="telerik-appbuilder">Telerik AppBuilder</h3>

If you’d like to try developing Groceries without going through the full setup, you may be interested in loading the app through [Telerik AppBuilder](http://www.telerik.com/platform/appbuilder):

<a href="https://platform.telerik.com/#appbuilder/clone/https%3A%2F%2Fgithub.com%2FIcenium%2Fnativescript-sample-groceries" target="_blank"><img src="http://docs.telerik.com/platform/appbuilder/sample-apps/images/try-in-appbuilder.png" alt="Try in AppBuilder" title="Try in AppBuilder" /></a>

<h3 id="linting">Linting</h3>

Groceries uses [JSHint](http://jshint.com/) and [JSCS](http://jscs.info/) for code linting. To kick off both, use the app's `npm run lint` command:

```
$ npm run lint
```

<h3 id="unit testing">Unit Testing</h3>

Groceries uses NativeScript’s [integrated unit test runner](http://docs.nativescript.org/core-concepts/testing) and [Mocha](https://mochajs.org/) with [Chai](http://chaijs.com/) for assertions. To run the tests for yourself use the `tns test` command:

```
$ tns test ios --emulator
```

```
$ tns test android --emulator
```

For more information on unit testing NativeScript apps, refer to the [NativeScript docs on the topic](http://docs.nativescript.org/core-concepts/testing).

![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/sample-groceries?pixel)
