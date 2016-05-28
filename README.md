# Groceries

Groceries is a web-based grocery-management app built with Angular 2. The app was built to show how easy Angular 2 makes it to share code across multiple environments. This web implementation shares its services with the [NativeScript-built iOS and Android Groceries app](https://github.com/NativeScript/sample-Groceries).

> **TIP**: You can learn more sharing code between web and native apps with Angular 2 by watching [TJ VanToll and Jen Looper’s talk on the topic from ng-conf 2016](https://www.youtube.com/watch?v=R3nyG2xtzeQ).

![](assets/iphone-screenshot.png)
![](assets/desktop-screenshot.png)

## Development

To run Groceries you’ll first need to install the Angular 2 CLI installed.

```
npm install -g angular-cli
```

Next, clone this repo.

```
git clone https://github.com/tjvantoll/groceries.git
cd groceries
```

Then, install this app’s dependencies from npm.

```
npm install
```

And finally, use the Angular 2 CLI’s `ng serve` command to see Groceries running in your browser.

```
ng serve
```