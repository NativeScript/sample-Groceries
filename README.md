# Groceries [![Build Status](https://travis-ci.org/NativeScript/sample-Groceries.svg?branch=release)](https://travis-ci.org/NativeScript/sample-Groceries)

Groceries is a NativeScript-built iOS and Android app for managing grocery lists. You can learn how to build a version of this app from scratch using either our [JavaScript getting started guide](http://docs.nativescript.org/tutorial/chapter-0), or our [TypeScript and Angular getting started guide](http://docs.nativescript.org/angular/tutorial/ng-chapter-0).

<!-- * [Download](#download) -->

* [Branches](#branches)
* [Screenshots](#screenshots)
* [Development](#development)
    * [Linting](#linting)
    * [Unit testing](#unit-testing)
    * [Travis CI](#travis)
    * [Telerik Platform](#telerik-platform)
* [Contributors](#contributors)

<h2 id="branches">Branches</h2>

This repository contains a number of branches:

* The [**release** branch](https://github.com/NativeScript/sample-Groceries/) shows how to build a robust, real-world app using NativeScript. The branch is built with TypeScript and Angular.
This branch targets latest official release of {N}.

---

* The [**master** branch](https://github.com/NativeScript/sample-Groceries/tree/master) contains the same as relase branch, but it is configured against latest bits of {N}.

---

* The [**angular-end** branch](https://github.com/NativeScript/sample-Groceries/tree/angular-end) contains the finished code for the [NativeScript _TypeScript and Angular_ getting started guide](http://docs.nativescript.org/angular/tutorial/ng-chapter-0).

---

* The [**end** branch](https://github.com/NativeScript/sample-Groceries/tree/end) contains the finished code for the [NativeScript _JavaScript_ getting started guide](http://docs.nativescript.org/tutorial/chapter-0).

---

* The [**web** branch](https://github.com/NativeScript/sample-Groceries/tree/web) contains a web version of Groceries that shares code with the NativeScript-built native app. The app is built with the Angular CLI.
* The [**gh-pages** branch](https://github.com/NativeScript/sample-Groceries/tree/gh-pages) contains the GitHub Pages hosted version of the web branch. You can view the web app live at <https://nativescript.github.io/sample-Groceries>.

<h2 id="screenshots">Screenshots</h2>

![](assets/screenshots/ios-1.png)
![](assets/screenshots/ios-2.png)
![](assets/screenshots/ios-3.png)

![](assets/screenshots/android-1.png)
![](assets/screenshots/android-2.png)
![](assets/screenshots/android-3.png)

<h2 id="development">Development</h2>

This app is built with the NativeScript CLI. Once you have the [CLI installed](https://docs.nativescript.org/start/quick-setup), start by cloning the repo:

```
$ git clone https://github.com/NativeScript/sample-Groceries.git
$ cd sample-Groceries
```

From there you can use the `run` command to run Groceries on iOS:

```
$ tns run ios
```

And the same command to run Groceries on Android:

```
$ tns run android
```

<h3 id="linting">Linting</h3>

Groceries uses [tslint](https://www.npmjs.com/package/tslint) + [codelyzer](https://github.com/mgechev/codelyzer) rules to ensure the code follows the [angular style guide](https://angular.io/docs/ts/latest/guide/style-guide.html).

You can run the linter with the `tslint` npm script:
```
$ npm run tslint
```

<h3 id="unit-testing">Unit Testing</h3>

Groceries uses NativeScript’s [integrated unit test runner](http://docs.nativescript.org/core-concepts/testing) with [Jasmine](http://jasmine.github.io/). To run the tests for yourself use the `tns test` command:

```
$ tns test ios --emulator
```

```
$ tns test android --emulator
```

For more information on unit testing NativeScript apps, refer to the [NativeScript docs on the topic](http://docs.nativescript.org/core-concepts/testing).

<h3 id="travis">Travis CI</h3>

Groceries uses [Travis CI](https://travis-ci.org/) to verify all tests pass on each commit. Refer to the [`.travis.yml` configuration file](https://github.com/NativeScript/sample-Groceries/blob/release/.travis.yml) for details.

<h3 id="telerik-platform">Telerik Platform</h3>

If you’d like to try developing Groceries without going through the full setup, you may be interested in loading the app in the [Telerik Platform](http://www.telerik.com/platform):

* [Run Groceries in the Telerik Platform](https://platform.telerik.com/#appbuilder/clone/https%3A%2F%2Fgithub.com%2FIcenium%2Fnativescript-sample-groceries)

<h2 id="contributors">Contributors</h2>

The following is a list of all the people that have helped build Groceries. Thanks for your contributions!

[<img alt="tjvantoll" src="https://avatars.githubusercontent.com/u/544280?v=3&s=117" width="117">](https://github.com/tjvantoll)[<img alt="hdeshev" src="https://avatars.githubusercontent.com/u/63219?v=3&s=117" width="117">](https://github.com/hdeshev)[<img alt="vakrilov" src="https://avatars.githubusercontent.com/u/4092076?v=3&s=117" width="117">](https://github.com/vakrilov)[<img alt="Mitko-Kerezov" src="https://avatars.githubusercontent.com/u/6683316?v=3&s=117" width="117">](https://github.com/Mitko-Kerezov)[<img alt="jlooper" src="https://avatars.githubusercontent.com/u/1450004?v=3&s=117" width="117">](https://github.com/jlooper)[<img alt="rosen-vladimirov" src="https://avatars.githubusercontent.com/u/8351653?v=3&s=117" width="117">](https://github.com/rosen-vladimirov)

[<img alt="SvetoslavTsenov" src="https://avatars.githubusercontent.com/u/3598759?v=3&s=117" width="117">](https://github.com/SvetoslavTsenov)[<img alt="ligaz" src="https://avatars.githubusercontent.com/u/19437?v=3&s=117" width="117">](https://github.com/ligaz)[<img alt="sis0k0" src="https://avatars.githubusercontent.com/u/7893485?v=3&s=117" width="117">](https://github.com/sis0k0)[<img alt="wdulin" src="https://avatars.githubusercontent.com/u/1111372?v=3&s=117" width="117">](https://github.com/wdulin)[<img alt="dtopuzov" src="https://avatars.githubusercontent.com/u/6651651?v=3&s=117" width="117">](https://github.com/dtopuzov)[<img alt="nadyaA" src="https://avatars.githubusercontent.com/u/6064810?v=3&s=117" width="117">](https://github.com/nadyaA)

[<img alt="vchimev" src="https://avatars.githubusercontent.com/u/12251337?v=3&s=117" width="117">](https://github.com/vchimev)[<img alt="covex-nn" src="https://avatars.githubusercontent.com/u/110878?v=3&s=117" width="117">](https://github.com/covex-nn)[<img alt="bundyo" src="https://avatars.githubusercontent.com/u/98318?v=3&s=117" width="117">](https://github.com/bundyo)[<img alt="EddyVerbruggen" src="https://avatars.githubusercontent.com/u/1426370?v=3&s=117" width="117">](https://github.com/EddyVerbruggen)[<img alt="NathanWalker" src="https://avatars.githubusercontent.com/u/457187?v=3&s=117" width="117">](https://github.com/NathanWalker)[<img alt="nsndeck" src="https://avatars.githubusercontent.com/u/5665150?v=3&s=117" width="117">](https://github.com/nsndeck)

[<img alt="tzraikov" src="https://avatars.githubusercontent.com/u/3244426?v=3&s=117" width="117">](https://github.com/tzraikov)[<img alt="TsvetanMilanov" src="https://avatars.githubusercontent.com/u/10463529?v=3&s=117" width="117">](https://github.com/TsvetanMilanov)[<img alt="bradmartin" src="https://avatars.githubusercontent.com/u/6006148?v=3&s=117" width="117">](https://github.com/bradmartin)[<img alt="cmelo" src="https://avatars.githubusercontent.com/u/872461?v=3&s=117" width="117">](https://github.com/cmelo)

<!-- Note: The table above get generated with the following commands -->
<!-- npm install -g github-contributors-list -->
<!-- githubcontrib --owner NativeScript --repo sample-Groceries --cols 6 --sortOrder desc | pbcopy -->

![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/sample-groceries?pixel)