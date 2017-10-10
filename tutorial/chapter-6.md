---
title: Chapter 6—Accessing Native APIs
position: 7
environment: nativescript
---

# Chapter 6—Accessing Native APIs

The beauty of NativeScript is that you can write a native iOS or Android app in JavaScript, XML, and CSS without touching Swift, Objective-C, or Java, if you choose. But what if you want to present a different, more platform-specific UI to your users? Or if you want to access an iOS or Android API that NativeScript doesn't expose through a NativeScript module or plugin?

NativeScript gives you the option to dig into native code as needed, and to do so without leaving JavaScript. To show how this works in action, let's start by adding some color to the ActionBar in the iOS version of the Groceries app.

## Table of contents

- [6.1: Customize the ActionBar - iOS](#61-customize-the-actionbar---ios)
- [6.2: Deleting from a list - Android](#62-deleting-from-a-list---android)
- [6.3: Deleting from a list - iOS](#63-deleting-from-a-list---ios)

## 6.1: Customize the ActionBar - iOS

When you use the ActionBar UI component, NativeScript is actually creating and managing an iOS `UINavigationController` for you. You can see this for yourself by digging into the implementation code, specifically `node_modules/tns-core-modules/ui/action-bar/action-bar.ios.js`, and `node_modules/tns-core-modules/ui/frame/frame.ios.js`.

What you might not realize is that the code that you see in these NativeScript modules, the code that looks like Objective-C-ified or Java-ified JavaScript code, is available for you to use in your own JavaScript modules. For example, you can easily get a reference to the `UINavigationBar` and simply call its [documented methods](https://developer.apple.com/library/prerelease/ios/documentation/UIKit/Reference/UINavigationBar_Class/index.html) to change its look and feel. Let's look at how to do that.

<h4 class="exercise-start">
    <b>Exercise</b>: Modify the ActionBar
</h4>

Before you start tinkering with the `UINavigationBar` let's add an `<ActionBar>` to the login and register pages, so that the app's three pages all have a consistent look.

Open `app/views/register/register.xml` and paste the following code in directly after the opening `<Page>` tag:

``` XML
<Page.actionBar>
    <ActionBar title="Sign up"></ActionBar>
</Page.actionBar>
```

Next, open `app/views/login/login.xml` and paste in the following code, again directly after the opening `<Page>` tag:

``` XML
<Page.actionBar>
    <ActionBar title="Sign in"></ActionBar>
</Page.actionBar>
```

Finally, open `app/app.css` and paste the following CSS to modify the ActionBar’s colors:

``` CSS
ActionBar {
    color: white;
    background-color: #2E6DAD;
}
```

With the ActionBar in place, let's look at how to customize its look with some native iOS APIs. Open `app/views/login/login.js` and paste the following code in the `exports.loaded()` function, directly after the `var page = args.object;` assignment:

``` JavaScript
if (page.ios) {
    var navigationBar = frameModule.topmost().ios.controller.navigationBar;
    navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
}
```

<div class="exercise-end"></div>

Ok, let's break down what just happened, starting with the `if (page.ios)` check. NativeScript modules, in general, follow the pattern of exposing their native implementations through `ios` and `android` properties. You can see this in the if check (`page.ios`), and also on the first line within the if check, as `frameModule.topMost().ios` is used to retrieve a reference to the underlying `UINavigationController`. Testing for the existence of these properties (e.g. `if (page.ios)`) is a convenient way to fork your code, to ensure that iOS-specific code only runs on iOS, and Android-specific code only runs on Android.

> **TIP**: As a best practice, testing for a platform with an if check is the way to go when you have a small number of platform-specific changes to make. If, on the contrary, you have big, entirely different chunks of code for iOS and Android, you might want to go with [platform-specific code-behind files](#platform-specific-files)—e.g. `login.ios.js` and `login.android.js`.

Within the if block, you start by getting a reference to the `UINavigationBar`, and then you set its [`barStyle` property](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIKitDataTypesReference/index.html#//apple_ref/c/tdef/UIBarStyle) to `UIBarStyle.UIBarStyleBlack`, which (counter intuitively) makes the iOS status bar use white text. This produces the look shown below:

![The iOS actionbar with updated colors](/img/cli-getting-started/nativescript/chapter6/ios/1.png)

Learning how to transfer iOS and Android APIs into valid NativeScript code can take a little trial and error to get right. You can always refer to the NativeScript docs for detailed discussions of how to handle the code conversion. Here are the [docs for Android](/runtimes/android/marshalling/java-to-js.html), and here are the [docs for iOS](/runtimes/ios/marshalling/Marshalling-Overview.html).

> **TIP**: NativeScript provides TypeScript declaration files for all iOS and Android APIs. If you're using TypeScript you can reference these declaration files to enable code completion in your editor. Even if you're not using TypeScript, these declaration files can be invaluable references when you're transferring native APIs to NativeScript code. For instance try searching for “UINavigationBar” in the iOS declaration file below to see which other properties are available.
> - [iOS TypeScript declaration file](https://github.com/NativeScript/NativeScript/tree/master/tns-platform-declarations/ios/objc-i386)
> - [Android TypeScript declaration file](https://raw.githubusercontent.com/NativeScript/NativeScript/master/tns-platform-declarations/android/android17.d.ts)

Forking the user experience can entail more than just changing some colors. For example, sliding to delete list items is a common UI interaction on iOS, but not Android. But as you've seen, NativeScript makes it relatively easy to fork your code to provide a more platform-specific experience. So to allow a user to delete an item from a list, let's create a slide-to-delete UI for iOS, and use a more-Android-friendly trash can icon to let the user delete items from our Android app.

## 6.2: Deleting from a list - Android

For Android you're going to add tappable trash cans to each item in the grocery list; so the first challenge is figuring out how to show these images only for Android, as you'll be using a completely different UI on iOS.

To do so you'll use a new bit of syntax in your XML. NativeScript allows you to set an attribute for only one platform using the `platform:attributeName` syntax. For example the following sets a button's text to “foo” on iOS, and “bar” on Android:

``` XML
<Button ios:text="foo" android:text="bar" />
```

This same syntax is available for all attributes for all UI components, and this mechanism is another convenient way NativeScript lets you fork your code for separate iOS and Android implementations. Let's use this technique to show a trash can only on Android.

<h4 class="exercise-start">
    <b>Exercise</b>: Add an Android-only UI element
</h4>

Open `app/views/list/list.xml`, find the `<ListView.itemTemplate>` tag, and replace it with the code below:

``` XML
<ListView.itemTemplate>
    <GridLayout columns="*, auto">
        <Label text="{% raw %}{{ name }}{% endraw %}"/>
        <Image src="res://ic_menu_delete" ios:visibility="collapsed" col="1" tap="delete" />
    </GridLayout>
</ListView.itemTemplate>
```

<div class="exercise-end"></div>

With this code you're primarily adding an `<Image>` to the existing ListView template. But now that you have multiple UI components in this template, you have to tell NativeScript how to layout these two components, which is what the `<GridLayout>` handles. By specifying `columns="*, auto"` you divide each item into two columns: the first containing the label and the second containing the new image.

For the image itself, the `ios:visibility="collapsed"` attribute sets the image's `visibility` CSS property to `"collapsed"`, which hides it. Because the attribute was prefixed with `ios:`, that CSS property is only applied on iOS; therefore the button displays on Android devices, but not on iOS ones. The trash can image itself has already been placed in the app for you, and can be found in appropriate sizes in the four drawable folders in `/app/App_Resources/Android`. Here's what the trash can UI looks like on Android:

![Trash can icons on Android](/img/cli-getting-started/nativescript/chapter6/android/1.png)

Finally, make the trash actually delete items. To do that you'll need to implement the `tap="delete"` handler in the list code-behind file.

<h4 class="exercise-start">
    <b>Exercise</b>: Build the delete functions
</h4>

Open `app/views/list/list.js` and paste the following code at the bottom of the file:

``` JavaScript
exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = groceryList.indexOf(item);
    groceryList.delete(index);
};
```

This code gets the index of the grocery the user tapped, matches that to the corresponding item in the view model, and then passes that index to the view model's `delete()` method—which doesn't exist yet, so let's create it.

Open `app/shared/view-models/grocery-list-view-model.js` and paste in the code below. Remember to add this function toward the end of the file, right above the `return viewModel` line:

``` JavaScript
viewModel.delete = function(index) {
    return fetch(config.apiUrl + "Groceries/" + viewModel.getItem(index).id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + config.token,
            "Content-Type": "application/json"
        }
    })
    .then(handleErrors)
    .then(function() {
        viewModel.splice(index, 1);
    });
};
```

<div class="exercise-end"></div>

This code probably looks fairly familiar by now. You're again calling the fetch module's `fetch()` method, this time specifying a `method` of `"DELETE"` to delete a grocery from the backend. You again return a `Promise` so the calling function can handle successful and unsuccessful calls. Note again the power of using the MVVM approach for building your app. To update the grocery list UI, all you have to do is remove the item from the ObservableArray (`viewModel.splice(index, 1)`), and let the list's presentation take care of itself.

If you run your app on Android you should be able to delete items from the list.

![deleting from a list on Android](/img/cli-getting-started/nativescript/chapter6/android/2.gif)

Now that you have built the interface for Android's tappable icon, let's add a swipe delete interface for iOS.

## 6.3: Deleting from a list - iOS

If you're an iOS user you're probably familiar with the slide-to-delete gesture as it's common in a number of iOS applications. The code to implement the gesture is actually baked into the iOS SDK itself (see [`UITableViewCellEditingStyle`'s docs](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UITableViewCell_Class/#//apple_ref/c/tdef/UITableViewCellEditingStyle)), so you can directly use those APIs in your NativeScript apps.

The code to do so is a little trickier than our previous example for Android, so we've provided a ready-built module to implement this functionality in the `shared/utils/ios-swipe-delete.js` file. In this file you'll find a custom implementation of a data source that adheres to the `UITableViewDataSource` protocol. The file exports a single `enable()` function, which takes a reference to a ListView, and injects that ListView with the custom data source behavior.

Don't worry too much about exactly what this code is doing, as it involves a bit of understanding of how iOS APIs works. What is cool is that you *can* implement this relatively advanced iOS API in a few dozen lines of code, and that it's really easy to wrap this code with a very simple JavaScript API. This ease of use is exactly why NativeScript modules and NativeScript plugins are so easy to consume. Let's look at how to use this module.

<h4 class="exercise-start">
    <b>Exercise</b>: Edit the ListView
</h4>

Add the following line of code to the top of `app/views/list/list.js`:

``` JavaScript
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
```

Then, add the following code to the `exports.loaded()` function, directly under the `page = args.object;` assignment:

``` JavaScript
if (page.ios) {
    var listView = page.getViewById("groceryList");
    swipeDelete.enable(listView, function(index) {
        groceryList.delete(index);
    });
}
```

<div class="exercise-end"></div>

This code gets a reference to the page's `<ListView>` id and then passes that reference to the swipe-to-delete module's `enable()` function. The `enable()` function also takes a callback, so you additionally pass an inline function that calls the view model's `delete()` function that you built in the previous section. Here's what the swipe-to-delete functionality looks like on iOS:

![deleting from a list on iOS](/img/cli-getting-started/nativescript/chapter6/ios/2.gif)

And... that's it! You've created a functional, cross-platform, backend-driven app to manage your grocery list. In the process you've created a unique UI for Android and iOS, leveraged NativeScript plugins and npm modules, learned how to log in and register, managed backend services, created a list with add and delete functionality, and more. 

Congratulations! Feel free to [share your accomplishment on Twitter](https://twitter.com/intent/tweet?text=I%20just%20built%20an%20iOS%20and%20Android%20app%20using%20@NativeScript%20%F0%9F%8E%89.%20You%20can%20too!%20http://docs.nativescript.org/tutorial/chapter-0%20%23opensource) or [Facebook](https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fdocs.nativescript.org%2Ftutorial%2Fchapter-0&p%5B) to impress your friends 😀.

> **TIP**:
> * If you're curious about how NativeScript makes it possible to directly invoke iOS and Android APIs, you can read about [“How NativeScript Works”](http://developer.telerik.com/featured/nativescript-works/) on our blog.
> * Remember that the [Groceries app's “end” branch](https://github.com/NativeScript/sample-Groceries/tree/end) has the final state of this tutorial. Feel free to refer back to it at any time.
> * Advanced ListView interactions like swipe-to-delete, pull-to-refresh, as well as other components such as calendars and charts are available out-of-the-box as part of Telerik [UI For NativeScript](http://docs.telerik.com/devtools/nativescript-ui/introduction).

<div class="next-chapter-link-container">
  <a href="/tutorial/chapter-7">Continue to Chapter 7—Next Steps</a>
</div>
