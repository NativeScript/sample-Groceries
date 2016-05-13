# Groceries

This branch contains the NativeScript Groceries sample implemented with Angular 2.

* [Screenshots](#screenshots)
* [Development](#development)
    * [Unit testing](#unit-testing)
    * [Travis CI](#travis)
* [Contributors](#contributors)

<h2 id="screenshots">Screenshots</h2>

![](http://i.imgur.com/HAsubGR.png)
![](http://i.imgur.com/ZAlDH1X.png)
![](http://i.imgur.com/km4UvQN.png)

![](http://i.imgur.com/DIbEWRy.png)
![](http://i.imgur.com/jAS7dez.png)
![](http://i.imgur.com/Ekk4MLq.png)

<h2 id="development">Development</h2>

This app is built with the NativeScript CLI. Once you have the [CLI installed](http://docs.nativescript.org/angular/tutorial/ng-chapter-1#11-install-nativescript-and-configure-your-environment), start by cloning the repo:

```
$ git clone https://github.com/NativeScript/sample-Groceries.git
$ cd sample-Groceries
$ git checkout angular
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

Groceries uses [Travis CI](https://travis-ci.org/) to verify all tests pass on each commit. Refer to the [`.travis.yml` configuration file](https://github.com/NativeScript/sample-Groceries/blob/master/.travis.yml) for details.

<h2 id="contributors">Contributors</h2>

The following is a list of all the people that have helped build Groceries. Thanks for your contributions!

[<img alt="tjvantoll" src="https://avatars.githubusercontent.com/u/544280?v=3&s=117" width="117">](https://github.com/tjvantoll)[<img alt="Mitko-Kerezov" src="https://avatars.githubusercontent.com/u/6683316?v=3&s=117" width="117">](https://github.com/Mitko-Kerezov)[<img alt="jlooper" src="https://avatars.githubusercontent.com/u/1450004?v=3&s=117" width="117">](https://github.com/jlooper)[<img alt="ligaz" src="https://avatars.githubusercontent.com/u/19437?v=3&s=117" width="117">](https://github.com/ligaz)[<img alt="nadyaA" src="https://avatars.githubusercontent.com/u/6064810?v=3&s=117" width="117">](https://github.com/nadyaA)[<img alt="rosen-vladimirov" src="https://avatars.githubusercontent.com/u/8351653?v=3&s=117" width="117">](https://github.com/rosen-vladimirov)

[<img alt="valentinstoychev" src="https://avatars.githubusercontent.com/u/4980822?v=3&s=117" width="117">](https://github.com/valentinstoychev)[<img alt="bradmartin" src="https://avatars.githubusercontent.com/u/6006148?v=3&s=117" width="117">](https://github.com/bradmartin)[<img alt="cmelo" src="https://avatars.githubusercontent.com/u/872461?v=3&s=117" width="117">](https://github.com/cmelo)

<!-- Note: The table above get generated with the following commands -->
<!-- npm install -g githubcontrib -->
<!-- githubcontrib --owner NativeScript --repos sample-Groceries --cols 6 --sortOrder desc | pbcopy -->

![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/sample-groceries?pixel)