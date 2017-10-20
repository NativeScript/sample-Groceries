## Lesson 3. Store the images in the cloud

### Step 7. Create a backend

The Telerik Platform provides tools for the entire app building experience. In this lesson, you'll setup a complete backend for storing your photos in the cloud.

<hr data-action="start" />

#### Action

* **a**. Click on the “Data” tab on the left-hand side of the screen.
* **b**. Click the blue “Enable Data” button to enable data storage for your project.

<hr data-action="end" />

The Data tab is where you manage your application’s data. You can connect to an existing database, or use the Telerik Platform’s own secure backend storage system. Regardless of which approach you use, the Telerik Platform provides a simple RESTful API for accessing your data.

On this tab you’ll see a “Files” menu, which is where you’re going to store your app’s photos. When you clicked “Enable Data”, the Telerik Platform automatically created a RESTful API for you to upload files to this backend system. Before using the API though, you need to grab your App ID.

<hr data-action="start" />

#### Action

* **c**. Click the “Settings” tab in the menu on the left-hand side of the screen.
* **d**. Copy the App ID shown under the “App ID” heading and paste it somewhere convenient; you'll need it to complete the next step.

<hr data-action="end" />

### Step 8. Upload images to your backend

With a backend ready to go, your next step is to add data to it. The Telerik Platform provides backend SDKs for several platforms, including .NET, iOS, Android, and Windows Phone, but for a NativeScript app you're interested in the JavaScript SDK. Your app already contains the appropriate JavaScript SDK in the form of the `everlive.all.min.js` file. Let’s head back to the code to see how it all works.

<hr data-action="start" />

#### Action

* **a**. Navigate back to your code by clicking on the “Code” tab on the left-hand side of the screen.
* **b**. Open the `homeView-view-model.js` file and add the following line at the top to load the SDK module:
```
var Everlive = require('../../everlive.all.min');
```
* **c**. Right after loading the module declare an `everlive` object:
```
var everlive = new Everlive("YOUR API KEY");
```
* **d.** Replace the `"YOUR API KEY"` string with the API key you saved off in the previous step.

<hr data-action="end" />

The `everlive` object now contains an Everlive instance you can use to interact with your backend. Let's return to our photo management code to see how to use it.

**Tip**: The latest versions of the JavaScript SDKs can be downloaded from [this documentation article](http://docs.telerik.com/platform/backend-services/development/javascript-sdk/introduction). 

<hr data-action="start" />

#### Action

* **e**. Make the following code snippet replacement to change the way the NativeScript ListView gets the data it needs.

Before:

```
Object.defineProperty(photoAlbumModel, "photoItems", {
    get: function () {
        return localImagesArray;
    },
    enumerable: true,
    configurable: true
});
```
After:

```
var backendArray = new observableArrayModule.ObservableArray();

Object.defineProperty(photoAlbumModel, "photoItems", {
    get: function () {
        everlive.Files.get().then(function (data) {
                data.result.forEach(function (fileMetadata) {
                    imageSourceModule.fromUrl(fileMetadata.Uri).then(function (result) {
                        var item = {
                            itemImage: result
                        };
                        backendArray.push(item);
                    });
                });
            },
            function (error) {});

        return backendArray;
    },
    enumerable: true,
    configurable: true
});
```

The `get()` method retrieves all pictures stored in your backend. If you now deploy the Photo Album app using `LiveSync` feature, the ListView will appear empty, because there are no images in your backend yet. But don't worry, we will soon add a few.

* **f**. Add the following code to the bottom of the `cameraModule.takePicture` promise:

```
var file = {
    "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
    "ContentType": "image/jpeg",
    "base64": picture.toBase64String(enums.ImageFormat.jpeg, 100)
};

everlive.Files.create(file,
    function (data) {},
    function (error) {});
```

Here is what the `tapAction` implementation should look like:

```
photoAlbumModel.tapAction = function () {
    //localImagesArray.push([item7, item8]);

    cameraModule.takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true
    }).then(function (picture) {
        var item = {
            itemImage: picture
        };
        backendArray.push(item);

        var file = {
            "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
            "ContentType": "image/jpeg",
            "base64": picture.toBase64String(enums.ImageFormat.jpeg, 100)
        };

        everlive.Files.create(file,
            function (data) {},
            function (error) {});
    });
};
```

This code displays the images you take in the ListView (using the `backendArray` instead of the `localImagesArray`) and uploads them asynchronously to the your backend using the `create()` method.

* **g**. Save the `homeView-view-model.js` file and use the LiveSync feature to update the application. On the device, tap `Add new photos` to take photos and upload the images to the cloud.
* **h**. After you store a few pictures, return to the “Data” tab and click “Files” to see a list of the photos you are storing.
* **i**. To see how the images are downloaded asynchronously from your backend, close (kill) the `Photo Album Native` app on your device and reopen it. Your previously taken photos will load accordingly.

<hr data-action="end" />

And that's all there is to it, which is pretty cool if you think about it — you have just built a native mobile app that gets and uploads pictures in the cloud!

You can find the complete [Photo Album project at GitHub](https://github.com/Icenium/nativescript-sample-PhotoAlbum).
