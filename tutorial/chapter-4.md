---
title: Chapter 4—NativeScript Modules
position: 5
environment: nativescript
---

# Chapter 4—NativeScript Modules

In this chapter you'll learn about NativeScript modules, which are the JavaScript modules in your app's `node_modules/tns-core-modules` folder. Whether you've realized it or not, you've already used several NativeScript modules. This includes the modules you've brought in via `require()` (the view, frame and observable modules) and also the UI components you've been using in XML (the page, image, text field and button modules).

## Table of contents

- [4.1: Connecting to a backend](#41-connecting-to-a-backend)
- [4.2: Dialog module](#42-dialog-module)
- [4.3: ListView](#43-listview)
- [4.4: Working with arrays](#44-working-with-arrays)
- [4.5: GridLayout](#45-gridlayout)
- [4.6: ActivityIndicator](#46-activityindicator)
- [4.7: Animations](#47-animations)

If you dig into `node_modules/tns-core-modules` you can get an idea of how these modules work. Start by finding the `node_modules/tns-core-modules/color` folder, which includes the implementation of the color module. It includes:

- a `package.json` file that sets the name of the module;
- a file containing the module's Android implementation (`color.android.js`);
- a file containing the module's iOS implementation (`color.ios.js`);
- a file containing code shared by the Android and iOS implementations (`color-common.js`)

> **NOTE**:
> * You can refer to the [Node.js documentation on folders as modules](https://nodejs.org/api/modules.html#modules_folders_as_modules) for more detailed information on how NativeScript organizes its modules.

The \*.ios.\* and \*.android.\* naming convention should look familiar, as it's the exact same convention we used to include Android- and iOS-specific styling in [chapter 2.4](#24-css). NativeScript uses this same convention to implement its modules on iOS and Android. Now that you know where these modules are, let's take a closer look at what else they can do for your app.

## 4.1: Connecting to a backend

When you created your own account on the registration page, you probably noticed that data was magically going... somewhere. But there's actually no magic involved; the register page invokes a RESTful API provided by [Telerik Backend Services](http://www.telerik.com/backend-services) to register the user for the Groceries service.

> **NOTE**: You don't have to use Telerik Backend Services to hit your backend service; you can use any HTTP API in a NativeScript app. Telerik Backend Services is convenient for us to use for this tutorial because it lets us spin up HTTP endpoints quickly.

Take a look at `app/shared/config.js`. There's only a small code snippet there, but it includes a hardcoded root path to the Groceries backend that the register page uses, and that you'll be using momentarily:

``` JavaScript
module.exports = {
    apiUrl: "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/"
};
```

> **TIP**: `config.js` also shows a convenient pattern you can use for sharing configuration variables throughout your app.

Next, take a look in the `app/shared/view-models` folder, which contains a few view models that we've pre-packaged into Groceries, and those view models contain the code to hit our backend. You can see this demonstrated in the `user-view-model.js` file's `register()` function.

> **NOTE**: In a larger app, it's pretty common to place code that interacts with the backend in separate files, and not directly in the view models. But in our case, the connection code lives directly in the view model for simplicity—which is perfectly reasonable for small apps. 

Note that the `register()` function uses the config module to get the path to the backend, as well as the [fetch module]({%ns_cookbook fetch%}) to make HTTP calls.

``` JavaScript
var config = require("../../shared/config");
var fetchModule = require("fetch");
```

NativeScript's fetch module uses the same API as the [browser's new fetch() API](https://fetch.spec.whatwg.org/). Therefore, if you already know how to use the web's `fetch()` method, you already know how to make HTTP calls in NativeScript. Let's look at how the fetch module works by adding another method to the user view model.

<h4 class="exercise-start">
    <b>Exercise</b>: Complete the login in the view model
</h4>

Open `app/shared/view-models/user-view-model.js` and paste the following code directly above the existing `viewModel.register()` function:

``` JavaScript
viewModel.login = function() {
    return fetchModule.fetch(config.apiUrl + "oauth/token", {
        method: "POST",
        body: JSON.stringify({
            username: viewModel.get("email"),
            password: viewModel.get("password"),
            grant_type: "password"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(handleErrors)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        config.token = data.Result.access_token;
    });
};
```

<div class="exercise-end"></div>

Let's break down what the code you just pasted in does.

- You use the fetch module's `fetch()` method to POST data to the `apiUrl` stored in `shared/config.js`. The username, password and grant_type are sent to this endpoint as a JSON string. (Telerik Backend Services [requires a grant_type parameter](http://docs.telerik.com/platform/backend-services/development/rest-api/users/authenticate-user) for logins.)

- The `fetch()` method returns a `Promise`, which allows you to execute code after the asynchronous login either completes successfully or fails. You use this functionality to do three things (the three `then()` handlers).
    - First, you handle any errors in the HTTP response with a `handleErrors()` function defined at the bottom of `user-view-model.js`. (If you want more details on how handling HTTP response errors with `fetch()` works check out [this article](http://tjvantoll.com/2015/09/13/fetch-and-errors/).)
    - Next, you convert the returned data into JSON by calling the [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object's `json()` method.
    - Finally, you save a reference to the user's authentication token in the config module. You'll use that token on subsequent HTTP requests later in this guide.

> **TIP**:
> * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) are a part of ECMAScript 6 (the scripting language of which JavaScript is an implementation). Because Promises have been implemented in the two JavaScript engines NativeScript uses—V8 for Android and JavaScriptCore for iOS—Promises are available for use in NativeScript apps.
> * NativeScript makes `fetch()` available as a global variable for convenience. This means you can replace `fetchModule.fetch()` with `fetch()`. The global `fetch()` shortcut will be used for the remainder of this guide.

With this code in place let's return to `login.js` to use this new function.

<h4 class="exercise-start">
    <b>Exercise: Add UserViewModel to the login code-behind</b>
</h4>

In `login.js`, at the top of the file, add the following reference to `shared/view-models/user-view-model`:

``` JavaScript
var UserViewModel = require("../../shared/view-models/user-view-model");
```

**Remove** the following five lines of code, as you'll be using the `UserViewModel` instead of the `user` you added in the previous chapter.

<div class="no-copy-button"></div>

``` JavaScript
// Remove these lines of code
var observableModule = require("data/observable");

var user = new observableModule.fromObject({
    email: "user@domain.com",
    password: "password"
});
```

Next, add the following line of code after the `var UserViewModel = require(...)` line:

``` JavaScript
var user = new UserViewModel();
```

Finally, replace the `exports.signIn()` function with the code below:

``` JavaScript
exports.signIn = function() {
    user.login();
};
```

> **TIP**: You can always view the completed codebase in the “end” branch of the [sample-Groceries repo](https://github.com/NativeScript/sample-Groceries/tree/end).

<div class="exercise-end"></div>

Take a moment to look at just how clean your code-behind file is now. The code-behind instantiates a view model (`UserViewModel`), and calls its `signIn()` method when the user taps the view's sign in button. Because the view model is bound to the page's two text fields (remember `{% raw %}{{ email }}{% endraw %}` and `{% raw %}{{ password }}{% endraw %}`), the view model already has the data it needs to perform the actual login.

And if you try running your app, and input your account's credentials, you can indeed login, but... you don't see anything. That's because view models aren't responsible for updating the UI. Instead the view model returns a `Promise` to let the code-behind handle the UI. (Remember that `fetch()` returns a `Promise`.) Let's see how you can use that `Promise`, and introduce a new NativeScript module in the process.

## 4.2: Dialog module

To utilize the `Promise` that the view model's `login()` function returns, you need to handle two scenarios: what to do when the login works, and what to do when it doesn't.

In the case of Groceries, when the login works you're going to navigate the user to the list page, which you'll be building momentarily, and which will let the user add and remove groceries from a list. To do the navigation you'll use the same frame module you used earlier in this guide.

The trickier situation is handling login failures, and for that you're going to use the dialog module. You can use this module to show [several types]({%ns_cookbook ui/dialogs%}) of popup UIs in your app, including action sheets, confirmation boxes, alert boxes, and prompts. It is a highly customizable module, and it lets you control the buttons in your alerts, their text, and the messaging in the alert itself. The dialog module's code is in the `node_modules/tns-core-modules/ui` folder with other UI widgets. Let's see how to use this widget on the login page.

<h4 class="exercise-start">
    <b>Exercise</b>: Handle an error with a dialog window
</h4>

Add the following line to the top of `login.js` to import the dialog module:

``` JavaScript
var dialogsModule = require("ui/dialogs");
```

Next, re-write your `signIn()` function to look like this:

``` JavaScript
exports.signIn = function() {
    user.login()
        .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            frameModule.topmost().navigate("views/list/list");
        });
};
```
<div class="exercise-end"></div>

This code handles both a successful and unsuccessful login. On success, you call the frame module's `navigate()` method to navigate the user to the (currently empty) list page. On failure, you use the dialog module to show the user an error message. Try inputting some invalid credentials to see what the dialog looks like.

![login 8](/img/cli-getting-started/nativescript/chapter4/ios/1.png)
![login 8](/img/cli-getting-started/nativescript/chapter4/android/1.png)

With that, the login page is completely functional. Now that you have user management working in your NativeScript app, let's move onto the page where users will manage their grocery list. To do that, you need a module that shows items in a list, which is exactly what the ListView module does.

> **TIP**: From this point forward in the guide you'll have to log in a lot, so you may find it helpful to hardcode your credentials in the app during development. The easiest way to do that is to pass an email address and password to the `UserViewModel()` constructor, for example:

> ``` JavaScript
> var user = new UserViewModel({
>     email: "username@domain.com",
>     password: "password"
> });
> ```

## 4.3: ListView

The ListView widget lets you show a list of things on the screen, which is exactly what you need for showing a list of groceries. Before tying the grocery list to a backend API, let's start by seeing how to show a hardcoded list of items on the screen.

<h4 class="exercise-start">
    <b>Exercise</b>: Construct the list view
</h4>

Open `app/views/list/list.xml` and paste in the code below, which creates the list where your groceries will reside:

``` XML
<Page loaded="loaded">
    <GridLayout>
        <ListView items="{% raw %}{{ groceryList }}{% endraw %}">
            <ListView.itemTemplate>
                <Label text="{% raw %}{{ name }}{% endraw %}" horizontalAlignment="left" verticalAlignment="center"/>
            </ListView.itemTemplate>
        </ListView>
    </GridLayout>
</Page>
```
<div class="exercise-end"></div>

> **NOTE**: Notice that this page is going to use a `<GridLayout>` to layout the UI components on the screen. As you add more UI components, you'll start dividing the screen into rows and columns, but for now you're just going to let the `<ListView>` take up the full screen (which is the default behavior of a `<GridLayout>` with no attributes).

As discussed earlier, even though you're using `<ListView>` in XML, the ListView module is still a NativeScript module. You can find its implementation in the `node_modules/tns-core-modules/ui/list-view` folder. If you want to, you could construct a ListView in pure JavaScript code in the code-behind file as shown in [this example]({%ns_cookbook ui/list-view%}). For most situations using the NativeScript UI modules in XML is easier, so we'll be sticking with XML usage throughout this tutorial.

Note the use of `<ListView.itemTemplate>`. This tag gives you the ability to control how each of the ListView's items displays within the list. For now you're using a simple `<Label>` UI component to display the `{% raw %}{{ name }}{% endraw %}` of each grocery.

If you run this code as is, you won't see any items in the grocery list. First you need to build out a way to manage data within the ListView module, and to do that you're going to need a new NativeScript module: the ObservableArray.

## 4.4: Working with arrays

In the previous section of this guide you saw how to create observables and how to use them to connect XML views with code-behind files and view models. You're going to do the same thing in this section with one additional twist, and it involves making this `items` attribute work:

``` XML
<ListView items="{% raw %}{{ groceryList }}{% endraw %}">
```

The ListView module's `items` attribute takes an array, and to create that array on the view model, NativeScript provides a special ObservableArray module. To see how it works, let's start building the list page's code-behind file.

<h4 class="exercise-start">
    <b>Exercise</b>: Populate the list view
</h4>

Open `app/views/list/list.js` and paste in the following code:

``` JavaScript
var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable")
var ObservableArray = require("data/observable-array").ObservableArray;
var page;

var pageData = new observableModule.fromObject({
    groceryList: new ObservableArray([
        { name: "eggs" },
        { name: "bread" },
        { name: "cereal" }
    ])
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;
};
```

<div class="exercise-end"></div>

Here, you're creating a new Observable object called `pageData`, which you set as the page's `bindingContext` in the `loaded()` function. Inside the Observable, you set a single `"groceryList"` property to be a new instance of the ObservableArray class. Notice how the `"groceryList"` property corresponds to `<ListView items="{% raw %}{{ groceryList }}{% endraw %}">`, and each array entry's `"name"` property corresponds to `<Label text="{% raw %}{{ name }}{% endraw %}">`.

> **NOTE**: Notice how this example uses the observable module’s `fromObject()` method instead of the `Observable` class constructor. Both `observableModule.fromObject()` and `new Observable()` create a new `Observable` instance, however, the `fromObject()` method performs a bit of additional initialization to handle nested objects. This example uses `fromObject()` because the `pageData` observable object contains a nested `ObservableArray`.

If you run your app you'll see the list screen shows the hardcoded data:

![list 1](/img/cli-getting-started/nativescript/chapter4/ios/2.png)
![list 1](/img/cli-getting-started/nativescript/chapter4/android/2.png)

Now that we have items on the screen let's look at how you can tie this list to a backend instead of hardcoded data. To do so you'll switch the list page to use a view model, much like you did with the login page.

A starting view model for this page is already in the file at `app/shared/view-models/grocery-list-view-model.js`, which contains code that looks a lot like what you already have in `list.js`:

``` JavaScript
var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function GroceryListViewModel(items) {
    var viewModel = new ObservableArray(items);
    return viewModel;
}

module.exports = GroceryListViewModel;
```

Let's expand on this to tie this view model to a backend.

<h4 class="exercise-start">
    <b>Exercise</b>: Populate a list view from a backend
</h4>

You're going to start by changing `list.js` to use the `GroceryListViewModel`. First, `require()` the `GroceryListViewModel` so you can use it:

``` JavaScript
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
```

Next, **remove** the existing `var pageData` assignment:

<div class="no-copy-button"></div>

``` JavaScript
// Remove these seven lines of code
var pageData = new observableModule.fromObject({
    groceryList: new ObservableArray([
        { name: "eggs" },
        { name: "bread" },
        { name: "cereal" }
    ])
});
```

And add the code below in the same location:

``` JavaScript
var groceryList = new GroceryListViewModel([]);
var pageData = new observableModule.fromObject({
    groceryList: groceryList
});
```

Finally, replace the existing `exports.loaded()` function with the one below, which calls two new methods on the view model—`empty()` and `load()`.

``` JavaScript
exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    groceryList.empty();
    groceryList.load();
};
```

In this code, `groceryList` is referencing the grocery list model, and the `empty()` function empties the list, and then calls the view model's `load()` function to reload the data from the backend.

The last piece to make this work is actually implementing the `empty()` and `load()` functions in the view model. Open `app/shared/view-models/grocery-list-view-model.js`, and paste the following code between the `var viewModel` assignment, and the `return viewModel` statement.

``` JavaScript
viewModel.load = function() {
    return fetch(config.apiUrl + "Groceries", {
        headers: {
            "Authorization": "Bearer " + config.token
        }
    })
    .then(handleErrors)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        data.Result.forEach(function(grocery) {
            viewModel.push({
                name: grocery.Name,
                id: grocery.Id
            });
        });
    });
};

viewModel.empty = function() {
    while (viewModel.length) {
        viewModel.pop();
    }
};
```

<div class="exercise-end"></div>

The code to make an HTTP call should look familiar, as it leverages the same fetch module you used in the previous section. Here, the fetch module's first `then()` handler checks for HTTP errors, the second `then()` handler converts the data from the response into JSON format, and the third handler pushes each grocery item from the response into the ObservableArray.

The cool thing here is the code you didn't have to write. Notice that there is no need to refresh the UI, or manually access the ListView UI component—all the view model does is push the JSON response to the ObservableArray, and the UI takes care of itself.

If you load the list page with the account you created earlier you’ll see a blank page, as your account is newly created, and therefore your grocery list is empty. To really test out these changes you’ll need to allow users to add groceries to their lists, so let’s look at how to do that next.

## 4.5: GridLayout

You already know how to add items to a `<ListView>`, because you just did so in the previous section—all you need to do is call the ObservableArray module's `push()` method.

To give the user the ability to manage their grocery list you're going to have to put some more UI components on the screen, and to do that you're going to need to divide the screen into rows and columns using the `<GridLayout>` UI component.

<h4 class="exercise-start">
    <b>Exercise</b>: Implement the ability to add groceries to the list
</h4>

Open `app/views/list/list.xml` and change the `<GridLayout>` tag to use the code below:

``` XML
<GridLayout rows="auto, *" columns="2*, *">
```

The `rows` attribute divides the screen into two rows, the first auto-sized according to its childrens' height, and the other to contain \*, or the remaining height of the screen. The `columns` attribute divides the screen into two columns, where the first column takes up 2/3 of the screen, and the second takes up the remaining third.

Next, to give the user a means of adding groceries to the list, add a text field and a button to the page. Add these two lines of code directly after the initial `<GridLayout>` tag:

``` XML
<TextField id="grocery" text="{% raw %}{{ grocery }}{% endraw %}" hint="Enter a grocery item" row="0" col="0" />
<Button text="Add" tap="add" row="0" col="1" />
```

The text field has an id attribute of `"grocery"`, and is bound to the `{% raw %}{{ grocery }}{% endraw %}` property of the page's binding context. The button's `tap` event refers to an `add()` function, that you'll add to the code-behind file momentarily.

But the most important thing to note here is the use of the `row` and `col` attributes. These attributes are zero-based, so the text field's `row="0" col="0"` attributes place it in the first row and first column, whereas the button's `row="0" col="1"` attributes place it in the first row and second column.

Finally, replace the `<ListView>` tag with the code below to place it in the second row, to have it span both columns, and also to give it an `id` attribute that you'll need later.

``` XML
<ListView items="{% raw %}{{ groceryList }}{% endraw %}" id="groceryList" row="1" colSpan="2">
```

Now you just need to make the necessary changes to the code-behind file to support these XML changes. Open `list.js` and start by adding a new `"grocery"` property to the `pageData` Observable. The `pageData` assignment should look like this:

``` JavaScript
var pageData = new observableModule.fromObject({
    groceryList: groceryList,
    grocery: ""
});
```

Next, you need to add an `add()` function to handle the button tap event. Paste in the following code at the bottom of `list.js`:

``` JavaScript
exports.add = function() {
    // Check for empty submissions
    if (pageData.get("grocery").trim() === "") {
        dialogsModule.alert({
            message: "Enter a grocery item",
            okButtonText: "OK"
        });
        return;
    }

    // Dismiss the keyboard
    page.getViewById("grocery").dismissSoftInput();
    groceryList.add(pageData.get("grocery"))
        .catch(function() {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list.",
                okButtonText: "OK"
            });
        });

    // Empty the input field
    pageData.set("grocery", "");
};
```

In this function, you first ensure the user didn't submit without typing a grocery. If the user did type something, you dismiss the device's keyboard, then you get the `"grocery"` property from the page's binding context (which is bound to the new `<TextField>`), and pass that value to the view model's `add()` function.

Finally, define that `add()` function. To do so, open `app/shared/view-models/grocery-list-view-model.js` and paste the following function under the `empty()` function, but before the `return viewModel` statement.

``` JavaScript
viewModel.add = function(grocery) {
    return fetch(config.apiUrl + "Groceries", {
        method: "POST",
        body: JSON.stringify({
            Name: grocery
        }),
        headers: {
            "Authorization": "Bearer " + config.token,
            "Content-Type": "application/json"
        }
    })
    .then(handleErrors)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        viewModel.push({ name: grocery, id: data.Result.Id });
    });
};
```
<div class="exercise-end"></div>

If you build and rerun your app, you'll find that you can add a grocery item and it will appear immediately in your list—and, all of this is completely driven by a backend service. Pretty cool, huh?

![list 3](/img/cli-getting-started/nativescript/chapter4/ios/4.gif)
![list 3](/img/cli-getting-started/nativescript/chapter4/android/4.gif)

Let's look at how you can polish this page with a NativeScript module for showing activity indicators.

## 4.6: ActivityIndicator

Currently there's a bit of a delay when you first visit the list page before groceries appear. This delay could confuse a new user, who might think the app is stuck rather than retrieving data from a backend.

In NativeScript apps you can use the ActivityIndicator module to show a spinner icon in your UI while your app is busy performing actions. The ActivityIndicator is a relatively simple UI element as it primarily uses one attribute—`busy`. When an ActivityIndicator's `busy` attribute is set to `true` the ActivityIndicator shows, and when its `busy` attribute is set to `false` it doesn't. Let's see how the module works by adding an ActivityIndicator to the list page.

<h4 class="exercise-start">
    <b>Exercise</b>: Add an ActivityIndicator
</h4>

Open `app/views/list/list.xml` and add the following element directly before the closing `</GridLayout>` tag.

``` XML
<ActivityIndicator busy="{% raw %}{{ isLoading }}{% endraw %}" rowSpan="2" colSpan="2" />
```

Then, in `app/views/list/list.js`, replace the existing `groceryList.load()` call in `loaded()` with the following four lines of code:

``` JavaScript
pageData.set("isLoading", true);
groceryList.load().then(function() {
    pageData.set("isLoading", false);
});
```

<div class="exercise-end"></div>

In the code above you add a new `"isLoading"` flag to the list page's Observable, and then bind the ActivityIndicator's `busy` attribute to that value. You set the initial value of the `"isLoading"` flag to `true` in the list page's `loaded()` function, which shows the ActivityIndicator. When the grocery list finishes loading, you flip the `"isLoading"` flag back to `false`, which hides the ActivityIndicator.

You control where the ActivityIndicator displays by setting its `rowSpan` and `colSpan` attributes. In this case `rowSpan="2" colSpan="2"` makes the ActivityIndicator take up both rows and both columns of its parent GridLayout. Here's what the new ActivityIndicator looks like:

![ActivityIndicator on iOS](/img/cli-getting-started/nativescript/chapter4/ios/5.gif)
![ActivityIndicator on Android](/img/cli-getting-started/nativescript/chapter4/android/5.gif)

The list page is now more user friendly, but we can improve the experience with one of the more powerful NativeScript modules: the animation module.

## 4.7: Animations

The ability to run robust and performant animations is the one of the biggest reasons people choose to build native mobile apps, and NativeScript makes running these animations simple. The NativeScript animation modules provides a [series of JavaScript APIs](/ui/animation) that let you perform a wide variety of animations to elements on the screen, including the following:

- [Opacity](/ui/animation#opacity)
- [Background Color](/ui/animation#background-color)
- [Translations](/ui/animation#translate)
- [Scaling](/ui/animation#scale)
- [Rotating](/ui/animation#rotate)

For our list page you’re going to use an [opacity animation](/ui/animation#opacity) to fade in your grocery list after your data loads. Let’s add in the code and then discuss how it all works.

<h4 class="exercise-start">
    <b>Exercise</b>: Add an animation
</h4>

Open `app/views/list/list.css` and add an `opacity: 0` rule to the existing `ListView` selector. The full set of rules should look like this:

``` CSS
ListView {
    margin: 5;
    opacity: 0;
}
```

Then, in `app/views/list/list.js`, replace the existing `exports.loaded()` function with the code below, which does two new things: gets a reference to the `<ListView>` (`page.getViewById("groceryList")`), and then calls that element’s `animate()` function after the `groceryList.load()` call completes.

``` JavaScript
exports.loaded = function(args) {
    page = args.object;
    var listView = page.getViewById("groceryList");
    page.bindingContext = pageData;

    groceryList.empty();
    pageData.set("isLoading", true);
    groceryList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 1,
            duration: 1000
        });
    });
};
```

<div class="exercise-end"></div>

A few things are happening in the code above.

First, in CSS, you assign an `opacity` of `0` to the grocery list `<ListView>`. This hides the grocery list completely when the page loads. Next, in JavaScript, after the `groceryList.load()` call completes, you call the list view’s `animate()` function. This changes the element's `opacity` from `0` (completely hidden) to `1` (completely visible) over one full second.

> **NOTE**: The animation function’s `duration` property takes a time in milliseconds. Therefore, `1000` equates to one second.

The result of this code is a nice fade-in animation:

![Animations on iOS](/img/cli-getting-started/nativescript/chapter4/ios/6.gif)
![Animations on Android](/img/cli-getting-started/nativescript/chapter4/android/6.gif)

The animation module is a lot of fun to play with, and it’s easy to use too. All you need to do is get a reference to an element using `getViewById()`, and then call that element’s `animate` method. You may want to take a few minutes to look through our [animation samples](/ui/animation#examples) and try a few of these animations for yourself in Groceries.

Now that you have the login, registration, and list pages complete, let’s enhance the app's functionality as a grocery list management tool. In the next chapters you'll add functionality such as email validation, social sharing, and more. And you'll use one of NativeScript's most useful features to do so: npm modules.

> **TIP**: There are several modules that come out of the box with your NativeScript installation that we did not have time to cover in this guide—including a [file-system helper]({%ns_cookbook file-system%}), a [timer module]({%ns_cookbook timer%}), and a whole lot more. Make sure to peruse the “API Reference” of the NativeScript documentation, or just look around your `node_modules/tns-core-modules` folder to see all of what’s available.

<div class="next-chapter-link-container">
  <a href="/tutorial/chapter-5">Continue to Chapter 5—Plugins and npm Modules</a>
</div>
