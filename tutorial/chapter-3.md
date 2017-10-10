---
title: Chapter 3—Application Logic
position: 4
environment: nativescript
---

# Chapter 3—Application Logic

In this chapter, you'll learn how to add JavaScript logic to your NativeScript app, and you'll be doing so using the base pattern on which the NativeScript framework is built, MVVM, or "model view view model". Here's what those words mean:

- **Model**: The model defines and represents the data. Separating the model from the various views that might use it allows for code reuse.
- **View**: The view represents the UI, which in NativeScript is written in XML. The view is often data-bound to the view model so that changes made to the view model in JavaScript instantly trigger visual changes to UI components.
- **View Model**: The view model contains the application logic (often including the model), and exposes the data to the view. NativeScript provides a module called 'Observable', which facilitates creating a view model object that can be bound to the view.

The biggest benefit of separating models, views, and view models, is that you are able to use two-way data binding; that is, changes to data in the model get instantly reflected on the view, and vice versa. The other big benefit is code reuse, as you're often able to reuse models and view models across views.

In Groceries, so far you've only touched the view (`login.xml`), and in this chapter you'll be creating a view model. To do so, we first need to introduce one other type of file: the code-behind.

## Table of contents

- [3.1: The code-behind](#31-the-code-behind)
- [3.2: Navigating screens](#32-navigating-screens)
- [3.3: Accessing UI components](#33-accessing-ui-components)
- [3.4: Adding a view model](#34-adding-a-view-model)

## 3.1: The code-behind

In NativeScript a code-behind file is a JavaScript file that shares the same name as the view. For example, the login page's view is named `login.xml`, so its code-behind file is named `login.js`. The code-behind file is where you put all code that interacts with the view itself.

Let's look at what you can do in a code-behind file with a simple example.

<h4 class="exercise-start">
    <b>Exercise</b>: Construct the login view model
</h4>

Open `login.xml` and add a `loaded` attribute to the `<Page>` UI component at the top. It should look like this:

``` XML
<Page loaded="loaded">
```

Next, paste the code below in `app/views/login/login.js` to define a `loaded()` function:

``` JavaScript
exports.loaded = function() {
    console.log("hello");
};
```
<div class="exercise-end"></div>

> **NOTE**: The keyword `exports` is part of [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1), the standard on which both NativeScript and Node.js' implementations of modules are based. In CommonJS-based JavaScript modules, a free variable called `exports` is an object to which a module might add properties and methods to configure its external API. Using `exports` in a code-behind file exposes the function for use in the view, or XML file. That is, the `exports.loaded` assignment in the code-behind file is what makes `loaded="loaded"` in the view work.

When you run the app with this change, NativeScript triggers the `loaded()` function you created in the code-behind file, and you should see the word “hello” logged in your terminal.

![](/img/cli-getting-started/nativescript/chapter3/terminal-1.png)

This simple example shows you how you can append attributes to UI components to run functions in the view's accompanying JavaScript file. Let's use another one of these attributes: `tap`.

<h4 class="exercise-start">
    <b>Exercise</b>: Enable the buttons
</h4>

You can add a `tap` attribute that will fire when the user taps or touches a button. In `app/views/login/login.xml`, switch the two buttons at the bottom of the screen to use this markup:

``` XML
<Button text="Sign in" tap="signIn" />
<Button text="Sign up for Groceries" class="link" tap="register" />
```

Then, at the bottom of the `app/views/login/login.js` file, paste in the following `signIn()` and `register()` functions:

``` JavaScript
exports.signIn = function() {
    alert("Signing in");
};

exports.register = function() {
    alert("Registering");
};
```
<div class="exercise-end"></div>

At this point, if you run your app and tap either of the buttons, you will see the appropriate alerts pop up. 

![login 5](/img/cli-getting-started/nativescript/chapter3/ios/1.png)
![login 5](/img/cli-getting-started/nativescript/chapter3/android/1.png)

Now that you can see tap gestures working, let's make them do something more interesting than open alerts.

## 3.2: Navigating screens

When you tap the “Sign up for Groceries” button, you would expect a navigational change to a registration screen. This is very easy to do in NativeScript.

<h4 class="exercise-start">
    <b>Exercise</b>: Enable the “Sign up” button on the login screen with a navigational change
</h4>

In `app/views/login/login.js`, add this line to the top of the file:

``` JavaScript
var frameModule = require("ui/frame");
```

Then, replace the current `register()` function with the version shown below:

``` JavaScript
exports.register = function() {
    var topmost = frameModule.topmost();
    topmost.navigate("views/register/register");
};
```
<div class="exercise-end"></div>

This function uses the [frame module](http://docs.nativescript.org/api-reference/modules/_ui_frame_.html), which is the NativeScript module responsible for navigation in your app. Here, you tell the topmost frame, or the frame the user actually sees, to navigate to the register view. 

If you run your app and click the “Sign up for Groceries” button, you will be sent to the registration screen, which we have pre-built for you.

![navigate](/img/cli-getting-started/nativescript/chapter3/ios/2.gif)
![navigate](/img/cli-getting-started/nativescript/chapter3/android/2.gif)

Now that you can access the registration page, go ahead and sign up for an account to use for the rest of this tutorial.

<h4 class="exercise-start">
    <b>Exercise</b>: Register for an account
</h4>

Open Groceries and tap “Sign up for Groceries” to access the registration page. From there, provide an email address and password, and click the “Sign up” button to create an account.

You can use a fake email address and password, just remember your credentials as you'll need them later.

<div class="exercise-end"></div>

> **TIP**: Although our Groceries app doesn't use complex navigation strategies, you have several available to you out of the box, such as the [TabView](/ui-views#tabview) and the [SegmentedBar](/ui-views#segmentedbar). A SideDrawer component is also available for free via Telerik's [UI for NativeScript](http://docs.telerik.com/devtools/nativescript-ui/introduction) product.

## 3.3: Accessing UI components

It's time to see how data flows back and forth between the front end and back end in forms.

<h4 class="exercise-start">
    <b>Exercise</b>: Send data from the front end to the view model
</h4>

Open `login.xml` and add an `id="email"` attribute to the email text field. Its markup should look like this:

``` XML
<TextField id="email" hint="Email Address" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
```

With an `id` attribute in place, you can access this text field in your code-behind file. To do that, start by opening `app/views/login/login.js` and adding the two lines of code below at the top of the file, underneath the `frameModule` variable.

``` JavaScript
var page;
var email;
```

Next, edit the `loaded()` function in `login.js` to get a reference to the current page:

``` JavaScript
exports.loaded = function(args) {
    page = args.object;
};
```

> **NOTE**: This works because NativeScript passes `loaded` event handlers a reference to the `<Page>` in the function's argument, which is named `args` by convention.

Finally, edit the `signIn()` function to get a reference to the text field component and log its contents:

``` JavaScript
exports.signIn = function() {
    email = page.getViewById("email");
    console.log(email.text);
};
```

<div class="exercise-end"></div>

All NativeScript UI components, including `<Page>`, inherit from the [`View` class](http://docs.nativescript.org/api-reference/classes/_ui_core_view_.view.html), which gives them a number of methods for working the UI. In this case you use the [`getViewById()` method](http://docs.nativescript.org/api-reference/classes/_ui_core_view_.view.html#getviewbyid) to get a reference to the email text field by its `id` attribute.

To see how this works in action, run the app, type some text in the email address text field, and tap the “Sign in” button. If all went well, you should see the text you typed logged in your terminal.

![](/img/cli-getting-started/nativescript/chapter3/terminal-2.png)

By accessing UI elements in JavaScript, you can control how those elements look and behave on the front end. However, accessing these UI components individually is a very manual process, and it makes it hard to track the state of the UI. This is where view models come in.

## 3.4: Adding a view model

NativeScript provides view model functionality in the form of a module called 'Observable'.

The Observable is the view model in the MVVM design pattern. It provides a mechanism used for two-way data binding, to enable direct communication between the UI and code-behind file. This means that if the user updates the data in the UI, the change will be automatically reflected in the view model, and vice versa. 

<h4 class="exercise-start">
    <b>Exercise</b>: Create a view model and bind it to the view
</h4>

To allow for two-way data binding using an Observable, open `login.xml`, and replace the two existing TextField UI components with the two shown below, each including a new `text` attribute:

``` XML
<TextField id="email" text="{% raw %}{{ email }}{% endraw %}" hint="Email Address" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
<TextField secure="true" text="{% raw %}{{ password }}{% endraw %}" hint="Password" />
```

> **NOTE**: The use of two curly brackets surrounding the `text` attribute's value delineates a data-bound value. You will be setting corresponding properties with the same name in the view model.

Add the following code to the top of `app/views/login/login.js`. The code gets a reference to the `Observable` constructor from the observable module, and invokes the constructor to define a new `user` object, which you'll be using as this page's view model:

``` JavaScript
var observableModule = require("data/observable");

var user = new observableModule.fromObject({
    email: "user@domain.com",
    password: "password"
});
```

Now, replace the existing `loaded()` function with the one below, which sets `user` as the binding context for the page.

``` JavaScript
exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = user;
};
```

<div class="exercise-end"></div>

What's going on here?

1. You're creating a `user` view model that is based on the NativeScript Observable module. You create the view model with two properties, `email` and `password`, that are pre-populated with some dummy values.
2. You bind the page to the `user` view model by setting it as the page's `bindingContext` property. This is specifically what makes the curly bracket syntax work.

Simply put, properties placed on a page's binding context are available to XML elements using the `{% raw %}{{ propertyName }}{% endraw %}` syntax. Because JavaScript sets the view model's `email` to `"user@domain.com"`, and because you bound the email address text field to that property using `<TextField text="{% raw %}{{ email }}{% endraw %}">`, when you run this app you'll see "user@domain.com" appear on the front end.

![](/img/cli-getting-started/nativescript/chapter3/ios/3.png)
![](/img/cli-getting-started/nativescript/chapter3/android/3.png)

What's really cool is that the binding is two-way. Meaning, when the user types text in these text fields, those changes are immediately applied to your view model.

To use these values, and to make this login functional by typing your app into a backend service, you're going to need the ability to make HTTP calls. And to make HTTP calls in NativeScript you use the NativeScript fetch module. Let's look at how NativeScript modules work.

<div class="next-chapter-link-container">
  <a href="/tutorial/chapter-4">Continue to Chapter 4—NativeScript Modules</a>
</div>
