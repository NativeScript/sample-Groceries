# Groceries [![Build Status](https://travis-ci.org/NativeScript/sample-Groceries.svg?branch=master)](https://travis-ci.org/NativeScript/sample-Groceries) [![dependency status](https://david-dm.org/nativescript/sample-Groceries.svg)](https://david-dm.org/nativescript/sample-Groceries) [![devDependency Status](https://david-dm.org/nativescript/sample-Groceries/dev-status.svg)](https://david-dm.org/nativescript/sample-Groceries#info=devDependencies)

Groceries is a NativeScript-built iOS and Android app for managing grocery lists. You can learn how to build a version of this app from scratch using either our [JavaScript getting started guide](http://docs.nativescript.org/start/getting-started), or our [TypeScript and Angular 2 getting started guide](http://docs.nativescript.org/angular/tutorial/ng-chapter-0).

* [Download](#download)
* [Branches](#branches)
* [Screenshots](#screenshots)
* [Development](#development)
    * [Telerik AppBuilder](#telerik-appbuilder)
    * [Linting](#linting)
    * [Unit testing](#unit-testing)
    * [Travis CI](#travis)
* [Contributors](#contributors)

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

* The [**master** branch](https://github.com/NativeScript/sample-Groceries/) contains the version of Groceries that appears in the iOS App Store and Google Play. The intention of the master branch is to show how to build a robust, real-world app using NativeScript.
* The [**angular** branch](https://github.com/NativeScript/sample-Groceries/tree/angular) contains the a version of Groceries built with TypeScript and Angular 2.

---

* The [**angular-start** branch](https://github.com/NativeScript/sample-Groceries/tree/angular-start) contains the starting point for the [NativeScript “TypeScript and Angular” getting started guide](http://docs.nativescript.org/angular/tutorial/ng-chapter-0).
* The [**angular-end** branch](https://github.com/NativeScript/sample-Groceries/tree/angular-end) contains the finished code for the TypeScript and Angular getting started guide.

---

* The [**start** branch](https://github.com/NativeScript/sample-Groceries/tree/start) contains the starting point for the [NativeScript “JavaScript” getting started guide](http://docs.nativescript.org/start/getting-started).
* The [**end** branch](https://github.com/NativeScript/sample-Groceries/tree/end) contains the finished code for the JavaScript getting started guide. Refer to it at any point while you’re completing the guide.

---

* The [**firebase** branch](https://github.com/NativeScript/sample-Groceries/tree/firebase) contains a version of Groceries that [uses Firebase as its data store](https://www.nativescript.org/blog/ignite-your-app-development-with-nativescript-and-firebase).

<h2 id="screenshots">Screenshots</h2>

![](assets/screenshots/ios-1.png)
![](assets/screenshots/ios-2.png)
![](assets/screenshots/ios-3.png)

![](assets/screenshots/android-1.png)
![](assets/screenshots/android-2.png)
![](assets/screenshots/android-3.png)

<h2 id="development">Development</h2>

This app is built with the NativeScript CLI. Once you have the [CLI installed](http://docs.nativescript.org/angular/tutorial/ng-chapter-0), start by cloning the repo:

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

<h3 id="unit-testing">Unit Testing</h3>

Groceries uses NativeScript’s [integrated unit test runner](http://docs.nativescript.org/core-concepts/testing) and [Mocha](https://mochajs.org/) with [Chai](http://chaijs.com/) for assertions. To run the tests for yourself use the `tns test` command:

```
$ tns test ios --emulator
```

```
$ tns test android --emulator
```

For more information on unit testing NativeScript apps, refer to the [NativeScript docs on the topic](http://docs.nativescript.org/core-concepts/testing).

<h3 id="travis">Travis CI</h3>

Groceries uses [Travis CI](https://travis-ci.org/) to verify all tests pass on each commit. Refer to the [`.travis.yml` configuration file](https://github.com/NativeScript/sample-Groceries/blob/master/.travis.yml) for details.

<h2 id="contributors">Contributors</h2>

The following is a list of all the people that have helped build Groceries. Thanks for your contributions!

[<img alt="tjvantoll" src="https://avatars.githubusercontent.com/u/544280?v=3&s=117" width="117">](https://github.com/tjvantoll)[<img alt="Mitko-Kerezov" src="https://avatars.githubusercontent.com/u/6683316?v=3&s=117" width="117">](https://github.com/Mitko-Kerezov)[<img alt="jlooper" src="https://avatars.githubusercontent.com/u/1450004?v=3&s=117" width="117">](https://github.com/jlooper)[<img alt="ligaz" src="https://avatars.githubusercontent.com/u/19437?v=3&s=117" width="117">](https://github.com/ligaz)[<img alt="nadyaA" src="https://avatars.githubusercontent.com/u/6064810?v=3&s=117" width="117">](https://github.com/nadyaA)[<img alt="rosen-vladimirov" src="https://avatars.githubusercontent.com/u/8351653?v=3&s=117" width="117">](https://github.com/rosen-vladimirov)

[<img alt="valentinstoychev" src="https://avatars.githubusercontent.com/u/4980822?v=3&s=117" width="117">](https://github.com/valentinstoychev)[<img alt="bradmartin" src="https://avatars.githubusercontent.com/u/6006148?v=3&s=117" width="117">](https://github.com/bradmartin)[<img alt="cmelo" src="https://avatars.githubusercontent.com/u/872461?v=3&s=117" width="117">](https://github.com/cmelo)

<!-- Note: The table above get generated with the following commands -->
<!-- npm install -g githubcontrib -->
<!-- githubcontrib --owner NativeScript --repos sample-Groceries --cols 6 --sortOrder desc | pbcopy -->

![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/sample-groceries?pixel)
