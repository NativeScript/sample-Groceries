This branch contains the starting point for the [NativeScript & Angular 2 Getting Started Guide](https://tjvantoll.github.io/nativescript-angular-guide/). If you're looking for the completed state of the getting started guide, refer to [this repo's “angular-end” branch](https://github.com/NativeScript/sample-Groceries/tree/angular-end).


## Super-fast quickstart

On Windows systems, you can develop, build, and deploy NativeScript projects that target **Android**.  
On OS X systems, you can develop, build, and deploy NativeScript projects that target iOS and **Android**.

For a detailed instruction see the [getting started guide](http://docs.nativescript.org/start/getting-started#install-nativescript-and-configure-your-environment).  
But if you already have node.js installed and this repository cloned, then follow these steps:


### 1. Install JDK and the Android SDK


**On windows**  

```sh
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/NativeScript/nativescript-cli/production/setup/native-script.ps1'))"`
```

**On OS X**  

```sh
sudo ruby -e "$(curl -fsSL https://raw.githubusercontent.com/NativeScript/nativescript-cli/production/setup/native-script.rb)"
```

### 2. Install packages for the Android SDK

Locate the android executable and call:
```
android update sdk --filter tools,platform-tools,android-23,build-tools-23.0.2,sys-img-x86-android-22,extra-android-m2repository,extra-google-m2repository,extra-android-support --all --no-ui
```

### 3. Start

Change into the cloned directory and start the emulator:

```
npm install
npm start
```