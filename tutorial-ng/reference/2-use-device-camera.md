## Lesson 2. Add photos to the album using your device's camera

### Step 6. Using the cross-platform camera API

At this point you have a list of photos, and a mechanism for adding new photos to the list. Next, let's see how you can switch from adding a hardcoded image to one that uses your device's camera. 

The NativeScript cross-platform wrappers makes invoking native device methods as easy as JavaScript method calls. Let's see how to use the cross-platform camera API:

<hr data-action="start" />

#### Action

* **a**. In the `homeView-view-model.js` add the following declaration to load the module responsible for the native camera API: 
```
var cameraModule = require("camera");
```
* **b**. Replace the body of the tapAction method with the following:

```
cameraModule.takePicture({
    width: 300,
    height: 300,
    keepAspectRatio: true
}).then(function (picture) {
    var item = {
        itemImage: picture
    };
    localImagesArray.push(item);
});
```

The above code snippet will start the native platform camera application. After taking the picture and tapping the button Save (Android) or Use Image (iOS) the promise will return the image object that you can add to the ListView

<hr data-action="end" />

**Tip**: Remember that keyboard shortcut `Ctrl` + `Alt` + `F` can format the code that you paste in. You can also view all keyboard shortcuts using `Ctrl` + `Shift` + `/`.

<hr data-action="start" />

* **c**. Save the `homeView-view-model.js` file and use the LiveSync feature to deploy the updated app to the device.
* **d**. Tap the `Add new photos` button on your device.
* **e**. Take a picture! It can be of you, your keyboard, or that stress ball you got at some conference three years ago. If everything went right, you should see the picture appear at the bottom of the list.

<hr data-action="end" />

Your app can now take photos from the camera and build a photo gallery, which is pretty cool. But there's one problem: the photos aren't persisted. If you close the app, all the photos in the list go away. Let's see how you can take those photos and store them in the cloud.
