---
title: Chapter 4—NativeScript Modules
position: 5
guide: true
environment: angular
---

# Chapter 4—NativeScript Modules

In this chapter you'll learn about NativeScript modules, which are the TypeScript modules in your app's `node_modules/tns-core-modules` folder. Whether you've realized it or not, you've already used several NativeScript modules, as all of the NativeScript UI elements are actually implemented with TypeScript code.

## Table of contents

- [4.1: UI elements](#41-ui-elements)
- [4.2: Animations](#42-animations)
- [4.3: ListView](#43-listview)
- [4.4: GridLayout](#44-gridlayout)
- [4.5: ActivityIndicator](#45-activityindicator)

If you dig into `node_modules/tns-core-modules` you can get an idea of how these modules work. Start by finding the `node_modules/tns-core-modules/color` folder, which includes the implementation of the color module. It includes:

- a `package.json` file that sets the name of the module;
- a file containing the module's Android implementation (`color.android.js`);
- a file containing the module's iOS implementation (`color.ios.js`);
- a file containing code shared by the Android and iOS implementations (`color-common.js`)
- files containing TypeScript definitions for the Color module, to help with code completion (`color.d.ts` and `known-colors.d.ts`)

> **NOTE**:
> * You can refer to the [Node.js documentation on folders as modules](https://nodejs.org/api/modules.html#modules_folders_as_modules) for more detailed information on how NativeScript organizes its modules.
> * The “tns-core-modules” package only includes compiled JavaScript code to cut down on file size. You can find the TypeScript code for each of these modules in the [main NativeScript GitHub repo](https://github.com/NativeScript/nativescript), for instance here’s the [color module’s source code](https://github.com/NativeScript/nativescript/tree/master/tns-core-modules/color).

The `*.ios.*` and `*.android.*` naming convention should look familiar, as it’s the exact same convention we used to include Android- and iOS-specific styling in [chapter 2](ng-chapter-2). NativeScript uses this same convention to implement its modules on iOS and Android. Now that you know where these modules are, let's examine what else they can do for your app, starting with a closer look at what you can do with NativeScript’s UI elements.

## 4.1: UI elements

So far, you’ve only used NativeScript UI elements by including them in an Angular component’s `template`, but you can also programmaticly create and access UI elements, and each UI element has a set of properties and methods you can use to customize your app. To see how this works lets access the `<Page>` UI element and make some changes to it.

<h4 class="exercise-start">
    <b>Exercise</b>: Customize the Page
</h4>

Open `app/pages/login/login.component.ts`, and add the following import to the top of the file:

``` TypeScript
import { Page } from "ui/page";
```

> **NOTE**: All of the imports you’ve seen to this point work because the TypeScript compiler resolves them against your project’s `node_modules` folder. For instance, `import { Component } from "@angular/core"` works because a `node_modules/@angular/core/core.d.ts` file exists. The `Page` class import above is a NativeScript module import, and it works because your project’s `tsconfig.json` file includes a path to TypeScript declarations (`.d.ts` files) that live in `node_modules/tns-core-modules`, which allow you to import modules from `node_modules/tns-core-modules` without any prefixes.

Next, alter the same file’s existing `"@angular/core"` import to include the `OnInit` interface:

``` TypeScript
import { Component, OnInit } from "@angular/core";
```

`OnInit` is a [TypeScript class interface](http://www.typescriptlang.org/docs/handbook/interfaces.html#class-types). To see how it works, make the following change to the declaration of your `LoginComponent` class:

``` TypeScript
export class LoginComponent implements OnInit {
```

If you’re using an editor that supports TypeScript, you should see an error that says something like *“Class ‘LoginComponent’ incorrectly implements interface ‘OnInit’”*. When you implement a TypeScript class interface, you’re telling the TypeScript compiler that you must implement all methods that the interface requires. In the case of `OnInit`, Angular requires you to implement a single `ngOnInit()` method. To implement it, add the following code within the `LoginComponent` class:

``` TypeScript
ngOnInit() {
  this.page.actionBarHidden = true;
  this.page.backgroundImage = "res://bg_login";
}
```

`ngOnInit` is one of several [component lifecycle hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html) that Angular provides. As its name implies, `ngOnInit` gets invoked when Angular initializes this component.

We’ll discuss what the code within `ngOnInit()` does momentarily, but finally, to make these changes compile and run, change the `LoginComponent`’s existing `constructor()` declaration to use the code below.

``` TypeScript
constructor(private router: Router, private userService: UserService, private page: Page) {
```

> **NOTE**: Because the `Page` class is so commonly used in NativeScript apps, NativeScript provides this syntax as a shorthand for getting access to a component’s page.

<div class="exercise-end"></div>

Now that you have this code in place, let’s discuss what happens in these two lines:

``` TypeScript
this.page.actionBarHidden = true;
this.page.backgroundImage = "res://bg_login";
```

This code uses an instance of the [`Page` class](https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html) from the [NativeScript page module](https://docs.nativescript.org/api-reference/modules/_ui_page_.html), and sets two properties on it—`actionBarHidden` and `backgroundImage`. Although you can peruse the [NativeScript API documentation](http://docs.nativescript.org/api-reference/globals.html) for a full list of these properties and what they do, if you’re using a TypeScript-friendly IDE, you can get a full list of these properties at any point.

<img alt="TypeScript autocomplete" class="plain" src="../img/cli-getting-started/angular/chapter4/typescript.png" style="border: 1px solid black;">

If you run your app you should see that the action bar—the bar beneath the status bar that had previously displayed on Android—is now hidden, and the page uses a gorgeous new background image:

![Background image on Android](../img/cli-getting-started/angular/chapter4/android/1.png)
![Background image on iOS](../img/cli-getting-started/angular/chapter4/ios/1.png)

Let’s look at a few other NativeScript modules you can use to help improve the look of this app.

## 4.2: Animations

The ability to run robust and performant animations is one of the biggest reasons people choose to build native mobile apps, and NativeScript makes running these animations simple. The NativeScript animation modules provides a [series of JavaScript APIs](https://docs.nativescript.org/angular/ui/animation) that let you perform a wide variety of animations to elements on the screen, including the following:

- [Opacity](https://docs.nativescript.org/angular/ui/animation-examples#opacity)
- [Background Color](https://docs.nativescript.org/angular/ui/animation-examples#background-color)
- [Translations](https://docs.nativescript.org/angular/ui/animation-examples#translate)
- [Scaling](https://docs.nativescript.org/angular/ui/animation-examples#scale)
- [Rotating](https://docs.nativescript.org/angular/ui/animation-examples#rotate)

Let’s add a simple animation so you can see how they work.

<h4 class="exercise-start">
    <b>Exercise</b>: Add a color animation
</h4>

Open `app/pages/login/login.html` and add `#container` to the existing `<StackLayout>`:

``` XML
<StackLayout #container>
```

The “#” syntax is Angular’s way of creating [local template variables](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#local-vars), and you’ll use this local variable to get a reference to the `<StackLayout>` element in TypeScript code momentarily.

Next, open `app/pages/login/login.component.ts` and add the following two lines at the top, which import the [`Color` class](https://docs.nativescript.org/api-reference/classes/_color_.color.html) from the NativeScript color module, and the [`View` class](https://docs.nativescript.org/api-reference/classes/_ui_core_view_.view.html) from the NativeScript view module.

``` TypeScript
import { Color } from "color";
import { View } from "ui/core/view";
```

After that, change the existing “@angular/core” import to include a few more classes:

``` TypeScript
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
```

With these new imports in place, next, add the following property to the `LoginComponent` class. Place it right under the `isLoggingIn = true;` line:

``` TypeScript
@ViewChild("container") container: ElementRef;
```

This code uses Angular’s [`@ViewChild` decorator](https://angular.io/docs/ts/latest/api/core/index/ViewChild-decorator.html) to create a new property that points at the `<StackLayout>` element. To use that property, change the `LoginComponent`’s `toggleDisplay()` function in the same file to use this code:

``` TypeScript
toggleDisplay() {
  this.isLoggingIn = !this.isLoggingIn;
  let container = <View>this.container.nativeElement;
  container.animate({
    backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
    duration: 200
  });
}
```

<div class="exercise-end"></div>

All NativeScript UI elements inherit from a base [`View` class](https://docs.nativescript.org/api-reference/classes/_ui_core_view_.view.html), which contains a number of useful methods—including the `animate()` method you used in the previous example.

Once you have a reference to a UI element, you can call any of the methods that element inherits from `View`. In this case, you call the `<StackLayout #container>` element’s `animate()` method to change its background color over a duration of `200`, or 2/10 of a second. The effect is a subtle color change that helps users differentiate between the “Sign In” and “Sign Up” functionality that your form provides.

![Color animation on Android](../img/cli-getting-started/angular/chapter4/android/2.gif)
![Color animation on iOS](../img/cli-getting-started/angular/chapter4/ios/2.gif)

> **NOTE**: You may notice that the text color is off with the brown background. Don’t worry about that for now; we’ll address those colors in chapter 6.

The animation module is a lot of fun to play with, and it’s easy to use too. All you need to do is get a reference to an element using `@ViewChild`, and then call that element’s `animate()` method. You may want to take a few minutes to look through our [animation samples](https://docs.nativescript.org/ui/animation#examples) and try a few of these animations for yourself in Groceries.

For now, let’s move on to another commonly used NativeScript UI element: the `<ListView>`.

## 4.3: ListView

The ListView element lets you show a list of things on the screen, which is exactly what you need for showing a list of groceries. Before tying the grocery list to a backend API, let's start by seeing how to show a hardcoded list of items on the screen.

<h4 class="exercise-start">
    <b>Exercise</b>: Build a list view
</h4>

Open `app/pages/list/list.html` and replace its contents with the following code:

``` XML
<GridLayout>
  <ListView [items]="groceryList" class="small-spacing">
    <ng-template let-item="item">
      <Label [text]="item.name" class="medium-spacing"></Label>
    </ng-template>
  </ListView>
</GridLayout>
```

We’ll talk about the new syntax in a moment, but first let’s define the class names used in the previous example. Open `app/app.css` and paste the following code at the bottom of the file, which defines a few utility class names you can use throughout your app:

``` CSS
.small-spacing {
  margin: 5;
}
.medium-spacing {
  margin: 10;
}
```

Next, open `app/pages/list/list.component.ts` and replace its contents with the code below:

``` TypeScript
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"]
})
export class ListComponent implements OnInit {
  groceryList: Array<Object> = [];

  ngOnInit() {
    this.groceryList.push({ name: "Apples" });
    this.groceryList.push({ name: "Bananas" });
    this.groceryList.push({ name: "Oranges" });
  }
}
```

<div class="exercise-end"></div>

Your `ListComponent` class now has a `groceryList` property that you fill with three objects in an `ngOnInit` handler. If you run your app and login, you should see the same list of groceries on the screen:

![List view on Android](../img/cli-getting-started/angular/chapter4/android/3.png)
![List view on iOS](../img/cli-getting-started/angular/chapter4/ios/3.png)

How does this work? Let’s return to this chunk of code:

``` XML
<ListView [items]="groceryList" class="small-spacing">
  <ng-template let-item="item">
    <Label [text]="item.name" class="medium-spacing"></Label>
  </ng-template>
</ListView>
```

The [`<ListView>` UI element](https://docs.nativescript.org/api-reference/classes/_ui_list_view_.listview.html) requires an `items` property that points to an array of data—in this case, the `groceryList` array you added to your `ListComponent` class. The list view element requires a child `<ng-template>` element that specifies how to render each item in the `items` array.

The `let-*` syntax is Angular’s way of creating template variables within loops. You can think of the syntax working like TypeScript’s `let` keyword. This gives you the ability to refer to each item in the array as `item` within the template. For this template, you render each item in the array with a single `<Label>` UI element, and because of the `[text]="item.name"` binding, those labels contain the text from the `name` property of each of the items in `groceryList` TypeScript array.

Now that you have a hardcoded list displaying, let’s see how to swap that out with live data.

<h4 class="exercise-start">
    <b>Exercise</b>: Populate the list view
</h4>

Open `app/shared/grocery/grocery.ts` and paste in the following code:

``` TypeScript
export class Grocery {
  constructor(public id: string, public name: string) {}
}
```

This creates a simple `Grocery` model object that you can use throughout your app. Next, let’s create a simple service that reads grocery lists from our backend.  Open `app/shared/grocery/grocery-list.service.ts` and paste in the following code:

``` TypeScript
import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Config } from "../config";
import { Grocery } from "./grocery";

@Injectable()
export class GroceryListService {
  constructor(private http: Http) {}

  load() {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);

    return this.http.get(Config.apiUrl + "Groceries", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let groceryList = [];
      data.Result.forEach((grocery) => {
        groceryList.push(new Grocery(grocery.Id, grocery.Name));
      });
      return groceryList;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
```

The code here is very similar to the code you used in the `UserService` earlier in this guide. You use the `Http` service’s `get()` method to load JSON data, and RxJS’s `map()` function to format the data into an array of `Grocery` objects.

To use this service, open `app/pages/list/list.component.ts` and add the following two lines to the top of the file:

``` TypeScript
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";
```

Next, change the existing `groceryList` declaration to use the newly imported `Grocery` class instead of a generic `Object`:

``` TypeScript
groceryList: Array<Grocery> = [];
```

Then, add the following `constructor` function within the `ListComponent` class:

``` TypeScript
constructor(private groceryListService: GroceryListService) {}
```

Next, because you’re injecting a service into your constructor you must also include it as a provider within your component decorator. To do so, replace the existing `@Component` decorator with the code below:

``` TypeScript
@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
```

Finally, to kick off the call to `load()` when this page initializes, replace the existing `ngOnInit()` function with the code below:

``` TypeScript
ngOnInit() {
  this.groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach((groceryObject) => {
        this.groceryList.unshift(groceryObject);
      });
    });
}
```

The full version of your `app/pages/list/list.component.ts` file should now look like this:

``` TypeScript
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { Grocery } from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListComponent implements OnInit {
  groceryList: Array<Grocery> = [];

  constructor(private groceryListService: GroceryListService) {}

  ngOnInit() {
    this.groceryListService.load()
      .subscribe(loadedGroceries => {
        loadedGroceries.forEach((groceryObject) => {
          this.groceryList.unshift(groceryObject);
        });
      });
  }
}
```

<div class="exercise-end"></div>

If you load the list page with the account you created earlier you’ll see a blank page, as your account is newly created, and therefore your grocery list is empty.

To really test out these changes you’ll need to allow users to add groceries to their lists, so let’s look at how to do that next.

## 4.4: GridLayout

In order to allow users to add to their grocery lists, you need to add a few additional UI controls to the list page. While you could use a simple `<StackLayout>` to stack up the controls you need, let’s look at how to create a slightly more complex layout using the `<GridLayout>` element.

<h4 class="exercise-start">
    <b>Exercise</b>: Add a GridLayout
</h4>

Open `app/pages/list/list.html` and replace the contents of the file with the following code:

``` XML
<GridLayout rows="auto, *">

  <GridLayout row="0" columns="*, auto" class="add-bar">
    <TextField #groceryTextField hint="Enter a grocery item" col="0"></TextField>
    <Image src="res://add" col="1"></Image>
  </GridLayout>

  <ListView [items]="groceryList" row="1" class="small-spacing">
    <ng-template let-item="item">
      <Label [text]="item.name" class="medium-spacing"></Label>
    </ng-template>
  </ListView>

</GridLayout>
```

<div class="exercise-end"></div>

When your app runs with these changes your UI should now look like this:

![Updated view on Android](../img/cli-getting-started/angular/chapter4/android/5.png)
![Updated view on  iOS](../img/cli-getting-started/angular/chapter4/ios/5.png)

To break down how this layout works, let’s start with the outer structure of the markup:

``` XML
<GridLayout rows="auto, *">
  <GridLayout row="0" class="add-bar">...</GridLayout>
  <ListView row="1">...</ListView>
</GridLayout>
```

The outer grid layout’s `rows` attribute divides the screen into two rows, the first auto-sized according to its childrens' height, and the other sized to take up *, or the remaining height of the screen. You place UI elements into these rows using the zero-based `row` attribute. The inner grid layout is in the top row because of its `row="0"` attribute, and the list view is in the bottom row because of its `row="1"` attribute.

Grid layouts can also divide the screen into columns, which is what the inner grid layout does:

``` XML
<GridLayout columns="*, auto" class="add-bar">
  <TextField col="0"></TextField>
  <Image col="1"></Image>
</GridLayout>
```

Here the `columns` attribute divides the top of the screen into two columns. The `col="0"` attribute puts the text field in the first column, and the `col="1"` attribute puts the “+” image in the last column. Grid layouts are the most commonly used NativeScript layout, so you may wish to take a minute to play around with the `columns` and `rows` attributes to figure out how they work.

> **TIP**:
> * You can nest any of the [NativeScript layouts](/ui/layout-containers.html)—not just grid layouts.
> * You can pass numbers, percentages, and a variety of other values to create more complex grid layouts. Refer to the [grid layout docs](/ui/layout-containers.html#gridlayout) for more information.

Now that we have the UI ready, let’s make the add button work.

<h4 class="exercise-start">
    <b>Exercise</b>: Allow users to add groceries
</h4>

Open `app/pages/list/list.html` and give the existing `<TextField>` a new `[(ngModel)]` attribute so that it looks like this:

``` XML
<TextField #groceryTextField [(ngModel)]="grocery" hint="Enter a grocery item" col="0"></TextField>
```

Next, add a new `tap` event binding to the image, so that the full `<Image>` looks like this:

``` XML
<Image src="res://add" (tap)="add()" col="1"></Image>
```

With these attributes in place, your next steps are to define a new `grocery` property and `add()` method in your `ListComponent` class. To do that, open `app/pages/list/list.component.ts` and add the following two properties to the `ListComponent` class (right below the existing `groceryList` property):

``` TypeScript
grocery = "";
@ViewChild("groceryTextField") groceryTextField: ElementRef;
```

Next, add the following import to the top of the `list.component.ts` file:

``` TypeScript
import { TextField } from "ui/text-field";
```

Then, add the following `add()` function to the existing `ListComponent` class:

``` TypeScript
add() {
  if (this.grocery.trim() === "") {
    alert("Enter a grocery item");
    return;
  }

  // Dismiss the keyboard
  let textField = <TextField>this.groceryTextField.nativeElement;
  textField.dismissSoftInput();

  this.groceryListService.add(this.grocery)
    .subscribe(
      groceryObject => {
        this.groceryList.unshift(groceryObject);
        this.grocery = "";
      },
      () => {
        alert({
          message: "An error occurred while adding an item to your list.",
          okButtonText: "OK"
        });
        this.grocery = "";
      }
    )
}
```

In this function you first ensure the user didn’t submit without typing a grocery. If the user did type something, you dismiss the device’s keyboard with the TextField element’s `dismissSoftInput()` method, and then call a new `add()` method on the `GroceryListService`.

To finish this example you have to define that new `add()` method. To do so, open `app/shared/grocery/grocery-list.service.ts` and paste the following function into the `GroceryService` class:

``` TypeScript
add(name: string) {
  let headers = new Headers();
  headers.append("Authorization", "Bearer " + Config.token);
  headers.append("Content-Type", "application/json");

  return this.http.post(
    Config.apiUrl + "Groceries",
    JSON.stringify({ Name: name }),
    { headers: headers }
  )
  .map(res => res.json())
  .map(data => {
    return new Grocery(data.Result.Id, name);
  })
  .catch(this.handleErrors);
}
```

<div class="exercise-end"></div>

The `add()` code should look familiar as you’re again using the `Http` service’s `post()` method to make an HTTP call to our backend, and then using RxJS’s `map()` function to convert the returned data into a `Grocery` object. You consume that object in the `ListComponent`’s `add()` method, which adds the grocery to the page’s list by calling `this.groceryList.unshift()`, and then empties that page’s text field by setting `this.grocery` equal to `""`.

``` TypeScript
this.groceryListService.add(this.grocery)
  .subscribe(
    groceryObject => {
      this.groceryList.unshift(groceryObject);
      this.grocery = "";
    },
    () => { ... }
  );
```

The end result looks like this:

![Adding to a list on Android](../img/cli-getting-started/angular/chapter4/android/6.gif)
![Adding to a list on iOS](../img/cli-getting-started/angular/chapter4/ios/6.gif)

At this point you can add a grocery item and it will appear immediately in your list—and, all of this is completely driven by a backend service. Pretty cool, huh?

Let's look at how you can polish this page with a NativeScript module for showing activity indicators.

## 4.5: ActivityIndicator

Currently there's a bit of a delay when you first visit the list page before groceries appear. This delay could confuse a new user, who might think the app is stuck rather than retrieving data from a backend.

In NativeScript apps you can use the [ActivityIndicator](https://docs.nativescript.org/api-reference/classes/_ui_activity_indicator_.activityindicator.html) module to show a spinner icon in your UI while your app is busy performing actions. The ActivityIndicator is a relatively simple UI element as it primarily uses one attribute—`busy`. When an ActivityIndicator's `busy` attribute is set to `true` the ActivityIndicator shows, and when its `busy` attribute is set to `false` it doesn't. Let's see how the module works by adding an ActivityIndicator to the list page.

<h4 class="exercise-start">
    <b>Exercise</b>: Add an ActivityIndicator
</h4>

Open up `app/pages/list/list.html` and paste the following line immediately before the final `</GridLayout>`:

``` XML
<ActivityIndicator [busy]="isLoading" [visibility]="isLoading ? 'visible' : 'collapse'" row="1" horizontalAlignment="center" verticalAlignment="center"></ActivityIndicator>
```

This binds the ActivityIndicator’s `busy` attribute to an `isLoading` property in the `ListComponent` component. To define that property, open `app/pages/list/list.component.ts` and add the following line of code immediately under `grocery = ""`:

``` TypeScript
isLoading = false;
```

Now that the property exists, your final step is to set this flag to `true` when the grocery data is loading. To do that, change the existing `ngOnInit()` function to use the code below:

``` TypeScript
ngOnInit() {
  this.isLoading = true;
  this.groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach((groceryObject) => {
        this.groceryList.unshift(groceryObject);
      });
      this.isLoading = false;
    });
}
```

<div class="exercise-end"></div>

When you first visit the list page, you should now see the following loading indicators:

![ActivityIndicator on Android](../img/cli-getting-started/angular/chapter4/android/7.png)
![ActivityIndicator on iOS](../img/cli-getting-started/angular/chapter4/ios/7.png)

> **TIP**: You can apply the same `row` or `column` attribute to multiple UI controls to have them take up the same space on the screen. The UI control that is defined last will appear on top, which is why the `<ActivityIndicator>` appears on top of the `<ListView>` in the previous example.
> ``` XML
> <ListView row="1">...</ListView>
> <ActivityIndicator row="1"></ActivityIndicator>
> ```

To finish off this chapter, let’s look at how you can use another NativeScript CSS feature to add a final bit of polish to how the list page loads.

In the following exercise you’ll use an animation to fade in the page’s `<ListView>` after your data loads. However this time, instead of getting a reference to the `<ListView>` UI element and calling its `animate()` method, you’ll instead use NativeScript’s CSS animations.

<h4 class="exercise-start">
    <b>Exercise</b>: Using CSS animations
</h4>

 Start by opening `app/pages/list/list-common.css` and pasting in the following CSS at the top of the file:

``` CSS
ListView {
  opacity: 0;
}
.visible {
  animation-name: show;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes show {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

This code sets the starting opacity value of the `<ListView>` to `0` so that the control is hidden when the page loads. The code also defines a `visible` class name that changes the `opacity` of an element from `0` to `1` over one full second.

> **TIP**: For background on how the CSS animations syntax works, feel free to refer to the [NativeScript CSS animation documentation](https://docs.nativescript.org/angular/ui/animation-css), or [external CSS animation guides](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

Now that you have the CSS in place, your next step is to add the previously defined `"visible"` class name to the `<ListView>` control after data has loaded. To do that, start by opening `app/pages/list/list.component.ts` and adding the following new property right below the existing `isLoading = false;` line:

``` TypeScript
listLoaded = false;
```

Next, in the same file, replace the existing `ngOnInit()` function with the following code, which sets the new `listLoaded` flag:

``` TypeScript
ngOnInit() {
  this.isLoading = true;
  this.groceryListService.load()
    .subscribe(loadedGroceries => {
      loadedGroceries.forEach((groceryObject) => {
        this.groceryList.unshift(groceryObject);
      });
      this.isLoading = false;
      this.listLoaded = true;
    });
}
```

Finally, open `app/pages/list/list.html` and replace the existing `<ListView>` tag with the following code:

``` XML
<ListView [items]="groceryList" row="1" class="small-spacing" [class.visible]="listLoaded">
```

<div class="exercise-end"></div>

The key here is the list view’s `[class.visible]="listLoaded"` binding, which automatically applies the `visible` CSS class name based on the state of the `listLoaded` TypeScript property.

The advantage of using CSS animations is that you avoid the need to reference specific UI elements in your TypeScript code; there was no need to create a local template variable. The CSS animation approach also helps to keep your code decoupled. Your TypeScript code can focus on logic, and leave styling concerns to your CSS code.

If you try out your app you should now see a nice fade-in animation:

![Loading animation on Android](../img/cli-getting-started/angular/chapter4/android/8.gif)
![Loading animation on iOS](../img/cli-getting-started/angular/chapter4/ios/8.gif)

Now that you have functional login and list pages, let’s enhance the app’s functionality as a grocery list management tool. In the next chapters you'll add functionality such as email validation, social sharing, and more. And you’ll use one of NativeScript's most useful features to do so: npm modules.

> **TIP**: There are several modules that come out of the box with your NativeScript installation that we did not have time to cover in this guide—including a [file-system helper]({%ns_cookbook file-system%}), a [timer module]({%ns_cookbook timer%}), and a whole lot more. Make sure to peruse the “API Reference” of the NativeScript documentation, or just look around your `node_modules/tns-core-modules` folder to see all of what’s available.

<div class="next-chapter-link-container">
  <a href="ng-chapter-5">Continue to Chapter 5—Plugins and npm Modules</a>
</div>
