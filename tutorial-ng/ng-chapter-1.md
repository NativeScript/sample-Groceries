---
title: Chapter 1—Learning the NativeScript Basics
position: 2
guide: true
environment: angular
---

# Chapter 1—Learning the NativeScript Basics

In this chapter you’re going to start with the basics, including creating new apps, getting those apps running on emulators, and setting up a development workflow that will allow you to build apps quickly.

## Table of contents

- [1.1: Creating apps](#11-creating-apps)
- [1.2: Running apps](#12-running-apps)
- [1.3: Debugging apps](#13-debugging-apps)
- [Appendix A: Choosing an editor](#appendix-a-choosing-an-editor)

## 1.1: Creating apps

In NativeScript you create and run apps using the NativeScript CLI. After [installation](/start/quick-setup), the NativeScript CLI is available on your terminal or command prompt as a `tns` command—which is short for <b>T</b>elerik <b>N</b>ative<b>S</b>cript.

In this section you’ll familiarize yourself with the NativeScript CLI, and use the CLI’s `create` command to start your first NativeScript app.

<h4 class="exercise-start">
    <b>Exercise</b>: Use the <code>tns create</code> command
</h4>

Open your terminal or command prompt and run the following command to create a new NativeScript application.

```
tns create HelloWorld --template nativescript-template-ng-tutorial
```

Here you’re passing two things to the `create` command: `HelloWorld` which determines the name of the app you’re creating, and the `--template` option, which tells the NativeScript CLI to scaffold an app using a predefined template named “nativescript-template-ng-tutorial”.

> **TIP**: You can use the `tns create` command to scaffold apps at a [variety of different starting points](https://github.com/NativeScript/NativeScript/wiki/Using-the-%60tns-create%60-command). The “nativescript-template-ng-tutorial” template creates a dead-simple app for the purposes of teaching the basics of NativeScript.

The `create` command will take a minute to complete, as the NativeScript CLI needs to download a few dependencies while setting up your new app.

When the command finishes, use the `cd` command (change directory) to navigate into your new app’s folder.

```
cd HelloWorld
```

<div class="exercise-end"></div>

Now that you have created an app, let’s look at how to get your new app up and running in an emulator.

> **TIP**: You can run the `tns help` command to view the NativeScript CLI’s help documentation in your web browser.

## 1.2: Running apps

Now that you have an app scaffolded on your local computer and you have `cd`‘ed to the root of the app, you are ready to run your application on an emulator.

<h4 class="exercise-start">
    <b>Exercise</b>: Use the <code>tns run</code> command
</h4>

In NativeScript you use the CLI’s `tns run` command to run your apps on iOS or Android. Let’s start with Android.

Execute the following command in your terminal to run your app on an Android emulator.

```
tns run android
```

> **NOTE**:
> * If you get an error at this point you likely haven’t completed the [NativeScript CLI installation instructions](/start/quick-setup). If you’ve gone through the instructions and are still stuck, try asking for help in the [NativeScript community forum](http://forum.nativescript.org/).
> * You must have at least one AVD (Android Virtual Device) configured on your development machine for this command to run your app up on an Android emulator. If you don’t have one installed currently go ahead and [set one up now](/tooling/android-virtual-devices).

The `run` command will take a few seconds to complete, as the NativeScript CLI will actually be building and deploying a native Android application. When the command finishes the native emulator will open and you will see your app:

![Basic hello world app running on Android](../img/cli-getting-started/angular/chapter1/android/1.png)

If you’re on macOS and would prefer to develop for iOS first, type `Ctrl` + `C` in your terminal to end the previous `tns run android` command, and then execute the following command instead.

```
tns run ios
```

> **NOTE**: NativeScript uses Xcode under the hood to build and run iOS apps, and Xcode is only available on macOS; therefore, you can only run iOS apps on macOS.

The `run` command will again take a few seconds, as the NativeScript CLI will be building and deploying a native iOS application. When the command finishes the native emulator will open and you will see your app:

![Basic hello world app running on iOS](../img/cli-getting-started/angular/chapter1/ios/1.png)

<div class="exercise-end"></div>

You might have noticed that the `tns run` command never terminates. That is, you cannot type in your terminal or command prompt after your app starts up.

<img src="../img/cli-getting-started/angular/chapter1/terminal-1.png" alt="Terminal display after executing tns run" class="plain">

This happens because the `tns run` command not only starts your apps, it also watches your code for changes. When the `tns run` command detects a code change, the command automatically refreshes, or _livesyncs_, your app so you can see those changes immediately. Let’s make some updates to your code so you can see this in action.

<h4 class="exercise-start">
    <b>Exercise</b>: Try Livesync
</h4>

Open your new project in your favorite text editor or IDE.

> **TIP**: You can use any editor to develop NativeScript apps, but we recommend Visual Studio Code. Feel free to [skip ahead to this chapter’s appendix](#appendix-a-choosing-an-editor) for more information.

Let’s add a simple image to your app so you can see how livesync works. Open your app’s  `app/app.component.ts` file, and place the following line of code directly under the comment `<!-- Your UI components go here -->` :

``` XML
<Image src="~/images/apple.jpg"></Image>
```

> **NOTE**: Don’t worry about the specifics of how this code works yet. We’ll cover the details momentarily—for now just get comfortable with how livesync works.

Your emulator should refresh and display the new image.

![Apple on the iOS emulator](../img/cli-getting-started/angular/chapter1/ios/2.png)
![Apple on the Android emulator](../img/cli-getting-started/angular/chapter1/android/2.png)

Next, let’s animate the apple you just added. While still in `app/app.component.ts`, delete all the code in this file and replace it with the following code. Again don’t worry about the details right now.

``` TypeScript
import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My Apple" class="action-bar"></ActionBar>
    <Image src="~/images/apple.jpg"></Image>
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0); } to { transform: rotate(360); }
    }
    Image {
      animation-name: spin; animation-duration: 3s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  `]
})
export class AppComponent {}
```

When your emulator refreshes, you should see a crazy spinning apple!

![App with a blue action bar](../img/cli-getting-started/angular/chapter1/ios/3.gif)
![Apple spinning on the Android emulator](../img/cli-getting-started/angular/chapter1/android/3.gif)

Let’s make one final change.

This time open your project’s `app/app.css` file. You can see that it’s blank, except for the import of a `core.light.css` file. This import tells NativeScript to use a “light” color scheme. Let’s change to the “sky” color scheme by replacing the existing line of code with the one shown below.

``` CSS
@import "nativescript-theme-core/css/sky.css";
```

<div class="exercise-end"></div>

The emulator should refresh and you should see a nice blue ActionBar color:

![App with a blue action bar](../img/cli-getting-started/angular/chapter1/ios/4.png)
![App with a blue action bar](../img/cli-getting-started/angular/chapter1/android/4.png)

<h4 class="exercise-start">
    <b>Challenge</b>: Pick a different color scheme
</h4>

Looking for a little more fun? NativeScript has several color schemes available for styling your iOS and Android apps. Pick a different stylesheet from the [full list](/ui/theme#color-schemes) and try it out in your app. Which one looks best?

<div class="exercise-end"></div>

Overall, the NativeScript CLI’s livesync process makes native iOS and Android development feel a lot like web development. You have the ability to change your CSS, markup, and JavaScript code, and see those changes reflected on the fly—all in a completely native mobile app.

> **WARNING**: There are situations where you’ll need to stop `tns run` and rebuild your app from scratch—for instance if need to install a new dependency from npm. In those cases you need to type `Ctrl + C` in your terminal to stop the current `tns run` process, and then re-execute `tns run android` or `tns run ios` to get your app up and running again. Don’t worry though; when situations that require a restart come up in this tutorial, those instructions will be explicitly listed.

## 1.3: Debugging apps

You now know how to create and run NativeScript apps. Your next step is learning how to debug your apps when things go wrong. Let’s look at how debugging works in NativeScript.

<h4 class="exercise-start">
    <b>Exercise</b>: Console logging in NativeScript
</h4>

One of the easiest things you can do to debug apps in any environment is writing to the system’s log. In NativeScript logging works a lot like it does on the web, as most of the same `console` APIs that work on the web also work in NativeScript.

To see this action open your app’s `app/app.component.ts` file and replace its contents with the code below.

``` TypeScript
import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My Apple" class="action-bar"></ActionBar>
    <Image src="~/images/apple.jpg"></Image>
  `
})
export class AppComponent {
  constructor() {
    console.log("Hello World");
  }
}
```

After the NativeScript CLI refreshes your app, head back to your terminal or command prompt. You should see a “Hello World” message at the bottom that looks like something like this.

<img src="../img/cli-getting-started/angular/chapter1/terminal-2.png" alt="Terminal display after running a console log" class="plain">

The `console.log()` function is great for outputting primitive values such as strings, numbers, and booleans, but it doesn’t work so well for objects. For those situations you’ll want to use another of the `console` object’s methods intended for complex object output: `console.dir()`.

To see this in action replace the contents of your `app/app.component.ts` file with the code below, which uses `console.log()` to log a simple object.

``` TypeScript
import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My Apple" class="action-bar"></ActionBar>
    <Image src="~/images/apple.jpg"></Image>
  `
})
export class AppComponent {
  constructor() {
    console.log({
      type: "Apple",
      color: "Red"
    });
  }
}
```

If you look at your console you’ll see the following not-very-helpful output.

```
JS: [object Object]
```

Go ahead and replace your code’s `console.log` reference with `console.dir`. After the NativeScript CLI refreshes your app you should see the full output of the object in your terminal or command prompt.

```
JS: === dump(): dumping members ===
JS: {
JS:     "type": "Apple",
JS:     "color": "Red"
JS: }
JS: === dump(): dumping function and properties names ===
JS: === dump(): finished ===
```

<div class="exercise-end"></div>

The `console.log()` and `console.dir()` functions are two of the many tools available when debugging your NativeScript applications. You might want to try out [step debugging](https://www.nativescript.org/nativescript-for-visual-studio-code) as you move into more advanced development, but for now let’s shift our attention to how to deal with errors in NativeScript apps.

<h4 class="exercise-start">
    <b>Exercise</b>: Error handling in NativeScript
</h4>

Errors happen, and when they do it’s important to know how to handle them. Let’s mess up a few things in your new app.

Find the line of code that declares an `<ActionBar>` (line 6 of your `app/app.component.ts` file). Remove that line’s final `>` character so that the line looks like this.

``` XML
<ActionBar title="My Apple" class="action-bar"></ActionBar
```

This is invalid markup, and as you might expect NativeScript is unable to render your user interface. What NativeScript does do, however, is log any relevant errors and stack traces to your console. If you return to your terminal and scroll up just a bit you’ll see following error logged that indicates exactly where the problem is.

```
JS ERROR Error: Template parse errors:
        Unexpected character "<" ("
            <ActionBar title="My Apple" class="action-bar"></ActionBar
            [ERROR ->]<Image src="~/images/apple.jpg"></Image>
          "): AppComponent@2:4
```

Let’s fix the error now by adding the `>` back to line 6 in your `app.component.ts` file.

``` XML
<ActionBar title="My Apple" class="action-bar"></ActionBar>
```

The NativeScript CLI continues to watch the files in your application, even after errors. As such, after you correct this problem, the CLI updates your app to its previous state.

> **TIP**: Once you get started with real-world application development you’ll almost certainly hit problems that are outside the scope of this basic tutorial. When you do hit these issues the [NativeScript Community Forum](http://forum.nativescript.org/) is a great place to get help.

<div class="exercise-end"></div>

Now that you’re familiar with how to create, run, and debug NativeScript app, let’s start building a real-world application. In the next chapter you’ll learn about how NativeScript apps are structured, and start building a new app from the ground up.

<div class="next-chapter-link-container">
  <a href="ng-chapter-2">Continue to Chapter 2—Creating User Interfaces</a>
</div>

## Appendix A: Choosing an editor

You can develop NativeScript apps in any text editor or IDE you wish. Therefore, if you’re deeply committed to an editor, by all means continue to use your editor of choice as you build applications with NativeScript.

> TIP: If you’re a WebStorm user, check out this [popular community-written plugin](https://plugins.jetbrains.com/webstorm/plugin/8588-nativescript) that adds a number of NativeScript-related features.

However, if you’re not absolutely committed to an editor, or if you’re looking to try something new, the NativeScript team recommends using Microsoft’s Visual Studio Code to develop your NativeScript applications. Here’s why.

- Visual Studio Code has excellent support for TypeScript, which you’ll be using heavily as you code Angular apps in this tutorial.
- Visual Studio Code gives you the ability to debug JavaScript and TypeScript code directly in your editor. The NativeScript team maintains an official [NativeScript Visual Studio Code extension](https://www.nativescript.org/nativescript-for-visual-studio-code) that enables step debugging for NativeScript apps.
- Visual Studio Code is a fast, modern editor that Microsoft [updates frequently](https://code.visualstudio.com/updates/).
- Visual Studio Code is available for Windows, macOS, and Linux.
- Visual Studio Code is backed by Microsoft; therefore, you can feel confident that the editor will continue to be supported in the future.

If you do choose to [try Visual Studio Code](https://code.visualstudio.com/), let’s look at a few tips & tricks you might find useful as you develop NativeScript apps.

### Tip #1: The `code` command

After you install Visual Studio Code you can open projects using the editor’s `File` → `Open` menu option, but there’s an alternative option that works far better for command-line-based projects like NativeScript: the `code` command.

The `code` command runs in your command-line or terminal, and it works just like the `tns` command does for NativeScript apps. Visual Studio Code installs the `code` command by default on Windows on Linux, but on macOS there’s [one manual step](https://code.visualstudio.com/docs/setup/mac) you must perform.

Once set up, you can type `code .` in your terminal to open the files in your current folder for editing. For example, you could use the following sequence of commands to create a new NativeScript app and open it for editing.

```
tns create MyNewApp --ng
cd MyNewApp
code .
```

> **NOTE**: The `tns create` command’s `--ng` option is a shorthand for `tns create MyNewApp --template tns-template-hello-world-ng` , which creates a simple NativeScript app with Angular preconfigured.

### Tip #2: Hiding generated code

One thing you’ve likely noticed is that each `.ts` file in your `app` folder has a corresponding `.js` file. We’ll be going over TypeScript compilation and why these files are present throughout this tutorial, but for now just know that the `.js` files are generated from their corresponding `.ts` file; therefore, the `.js` files aren’t files you need to see in your editor during development. Luckily, Visual Studio Code has a handy little feature you can use to hide these files.

Open your Visual Studio Code user settings by pressing `Command + ,` on macOS, or `Ctrl + ,` on Windows and Linux, and then paste in the following lines of code.

``` JavaScript
{
    "files.exclude": {
        "**/*.js": { "when": "$(basename).ts" }
    }
}
```

This tells Visual Studio Code to exclude `.js` files whenever there’s a corresponding `.ts` file. For example after you save these new settings, Visual Studio Code will no longer display your new app’s `app.component.js` file because a `app.component.ts` file exists.

This is one of many features that makes Visual Studio Code a powerful editor well suited for NativeScript development. You may wish to look through the [many configuration options](https://code.visualstudio.com/Docs/customization/userandworkspace) Visual Studio Code provides to customize the editor to match your personal preferences.

<div class="next-chapter-link-container">
  <a href="ng-chapter-2">Continue to Chapter 2—Creating User Interfaces</a>
</div>
