This branch contains the starting point for the [NativeScript & Angular 2 Getting Started Guide](https://tjvantoll.github.io/nativescript-angular-guide/). If you're looking for the completed state of the getting started guide, refer to [this repo's “angular-end” branch](https://github.com/NativeScript/sample-Groceries/tree/angular-end).


## Quickstart (Android only)

On Windows systems, you can develop, build, and deploy NativeScript projects that target **Android**.  
On OS X systems, you can develop, build, and deploy NativeScript projects that target iOS and **Android**.

For a detailed instruction see the [getting started guide](http://docs.nativescript.org/start/getting-started#install-nativescript-and-configure-your-environment).  
If you have node.js installed and this repository cloned, then follow these steps:


### 1. Install JDK, Android SDK & HAXM

The Java SE Development Kit (JDK) is required for the Android SDK.

**On windows**  

```sh
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/NativeScript/nativescript-cli/production/setup/native-script.ps1'))"`
```

**On OS X**  

```sh
sudo ruby -e "$(curl -fsSL https://raw.githubusercontent.com/NativeScript/nativescript-cli/production/setup/native-script.rb)"
```

**For both**

The Android x86 emulator will be much more faster if you install the ["Intel® Hardware Accelerated Execution Manager" (HAXM)](https://software.intel.com/en-us/android/articles/intel-hardware-accelerated-execution-manager). You definitely want to install it to speed up Android app emulation on your host machine. A chipset with Intel VT is required, of course.   

### 2. Install packages for the Android SDK

Locate the `android` executable and call:
```
android update sdk --filter tools,platform-tools,android-23,build-tools-23.0.2,sys-img-x86-android-22,extra-android-m2repository,extra-google-m2repository,extra-android-support --all --no-ui
```

Skip the `--no-ui` parameter if you prefer a graphical user interface.

### 3. Android SDK Tools: Create an AVD

The AVD Manager provides a graphical user interface in which you can create and manage Android Virtual Devices (AVDs), which are required by the Android Emulator. Launch the AVD Manager, configure a device and start it.

### 4. Start the Demo

Everything up to this point was not specific to NativeScript.
Lets install the [nativescript](https://www.npmjs.com/package/nativescript)-cli and [angular2](https://www.npmjs.com/package/angular2) via NPM.
Change into the cloned directory and execute:

```
npm install
npm start
```

If something goes wrong, type the following command:

```
npm run doctor
```

### 5. Highly recommend: Genymotion

Soon you will find out that the Android Emulator still very slow and tricky to set up. 
You should give [Genymotion](https://www.genymotion.com) a try! The solution works on top of Oracle VM VirtualBox and is a breeze compared to the normal emulator.

1. Register at [genymotion.com](https://www.genymotion.com), chose the [free license](https://www.genymotion.com/pricing-and-licensing/) (Free for personal use only). 
2. [Download and install Genymotion](https://www.genymotion.com/download/) and Oracle VM VirtualBox.
3. At the installation directory of Genymotion to the PATH environment variable.
4. Add and configure a device with the Genymotion graphical user interface.
5. Start the device.
6. Verify in the "Genymotion shell" the name of the created device:
    ```
    devices list
    ```
6. Start the demo:
   
    ```
    npm intall -g nativescript
    tns run android --emulator --geny="device name"
    ```
    (there is also a NPM script definied: `npm run start-geny`, but you have to adjust the device name in the `package.json` first)
7. Happy hacking!