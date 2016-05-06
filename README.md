# Groceries

This branch contains the NativeScript Groceries sample implemented with Angular 2. It is also the completed code for the [NativeScript & Angular 2 Getting Started Guide](https://nativescript.github.io/nativescript-angular-guide/).

<h2 id="screenshots">Screenshots</h2>

![](http://docs.nativescript.org/angular/img/cli-getting-started/angular/chapter0/ios/1.png)
![](http://docs.nativescript.org/angular/img/cli-getting-started/angular/chapter0/ios/2.png)
![](http://docs.nativescript.org/angular/img/cli-getting-started/angular/chapter0/ios/3.png)

![](http://docs.nativescript.org/angular/img/cli-getting-started/angular/chapter0/android/1.png)
![](http://docs.nativescript.org/angular/img/cli-getting-started/angular/chapter0/android/2.png)
![](http://docs.nativescript.org/angular/img/cli-getting-started/angular/chapter0/android/3.png)

<h2 id="development">Development</h2>

This app is built with the NativeScript CLI. Once you have the [CLI installed](http://docs.nativescript.org/angular/tutorial/ng-chapter-0), start by cloning the repo:

```
$ git clone https://github.com/NativeScript/sample-Groceries.git
$ cd sample-Groceries
$ git checkout angular-end
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