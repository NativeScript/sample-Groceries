# Groceries

Groceries is a NativeScript-built iOS and Android app for managing grocery lists. You can learn how to build a version of this app from scratch in the [NativeScript getting started guide](http://docs.nativescript.org/getting-started).

## Download

<<a href="https://itunes.apple.com/us/app/groceries-simple-grocery-lists/id1041129105?mt=8">
	<img src="assets/app-store-icons/ios-app-store.png" style="height: 59px;">
</a>

<a href="https://play.google.com/store/apps/details?id=org.nativescript.groceries&hl=en">
	<img src="assets/app-store-icons/google-play.png" style="height: 59px;">
</a>

## Screenshots

![](assets/screenshots/ios-1.png)
![](assets/screenshots/ios-2.png)
![](assets/screenshots/ios-3.png)

![](assets/screenshots/android-1.png)
![](assets/screenshots/android-2.png)
![](assets/screenshots/android-3.png)

## Development

This app is built with the [NativeScript CLI](https://github.com/NativeScript/nativescript-cli). Once you have the [CLI installed](https://github.com/NativeScript/nativescript-cli#installation), start by cloning the repo:

```
$ git clone https://github.com/NativeScript/sample-Groceries.git
$ cd sample-Groceries
```

Next, install the app's iOS and Android runtimes, as well as the app's npm dependencies:

```
$ tns install
```

Open your app's `platforms/android/build.gradle` file and add the following line of code below the two existing `compile "com.android.support"` lines. (Note, this manual step is going away with the NativeScript 1.5 release.)

```
compile "com.android.support:recyclerview-v7:$suppotVer"
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

### Linting

Groceries uses [JSHint](http://jshint.com/) and [JSCS](http://jscs.info/) for code linting. To kick off both, use the app's `gulp lint` command:

```
$ gulp lint
```
