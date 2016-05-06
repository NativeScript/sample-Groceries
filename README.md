# Groceries

This branch contains the NativeScript Groceries sample implemented with Angular 2. This is also the completed code for the [NativeScript & Angular 2 Getting Started Guide](https://nativescript.github.io/nativescript-angular-guide/).

<h2 id="screenshots">Screenshots</h2>

![](http://i.imgur.com/HAsubGR.png)
![](http://i.imgur.com/ZAlDH1X.png)
![](http://i.imgur.com/km4UvQN.png)

![](http://i.imgur.com/DIbEWRy.png)
![](http://i.imgur.com/jAS7dez.png)
![](http://i.imgur.com/Ekk4MLq.png)

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