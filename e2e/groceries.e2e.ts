import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { expect } from "chai";
import { Eyes } from "@applitools/eyes-images";
import { Region } from "@applitools/eyes-common";
import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

describe("Groceries", async function () {
    let driver: AppiumDriver;
    const loginButtonText = "Login";
    const email = "groceries@mailinator.com";
    const password = "123";
    const fruit = "apple";
    const recentButtonText = "Recent";
    const doneButtonText = "Done";
    const logOffButtonText = "Log Off";
    const invalidEmail = "groceries@mailinator";
    const invalidEmailWarningText = "valid email";
    const okButtonText = "OK";
    const cancelButtonText = "Cancel";
    const signUpHereButtonText = "Sign up here";
    const signUpButtonText = "Sign up";
    const backToLoginButtonText = "Back to login";
    const forgotPasswordButtonText = "Forgot";
    const forgotPasswordFormText = "reset";
    const eyes = new Eyes();
    const sleep = promisify(setTimeout);

    const clickOnCrossOrCheckboxBtn = async () => {
        if (driver.isAndroid) {
            // First image is the menu, second is the cross button. The rest are pairs checkbox/bin per list item.
            const allImages = await driver.findElementsByClassName(driver.locators.image);
            await allImages[2].click(); // Checkbox button
        } else {
            await driver.clickPoint(26, 160); // Checkbox button
        }
    };

    const clickOnBinButton = async () => {
        if (driver.isAndroid) {
            // First image is the menu, second is the cross button. The rest are pairs checkbox/bin per list item.
            const allImages = await driver.findElementsByClassName(driver.locators.image);
            for (let i = 3; i < allImages.length; i = i + 2) {
                await allImages[3].click(); // Bin button of the first list item
            }
        } else {
            const allImages = await driver.findElementsByText(fruit);
            for (let i = 0; i < allImages.length; i++) {
                await driver.clickPoint(345, 166); // Bin button of the first list item
            }
        }
    };

    before(async () => {
        driver = await createDriver();
        driver.defaultWaitTime = 15000;
        if (fs.existsSync(`${__dirname}/screenshots/`)) {
            fs.mkdirSync(`${__dirname}/screenshots/`)
        }
    });

    after(async () => {
        if (driver.nsCapabilities.isSauceLab) {
            driver.sessionId().then(function (sessionId) {
                console.log("Report: https://saucelabs.com/beta/tests/" + sessionId);
            });
        }
        await driver.quit();
        console.log("Driver quits!");
    });

    const testScreenShot = async (testName: string) => {
        const imagePath = await driver.takeScreenshot(`${__dirname}/screenshots/${testName}`);
        const image = await readFile(imagePath);
        await eyes.open("Sample Groceries", testName);
        // chopping off top 100 pixels because time display never matches.
        await eyes.checkRegion(image, new Region(0, 100, 1440, 2560), testName);
        await eyes.close();
    }

    it("should log in", async () => {
        const loginButton = await driver.findElementByText(loginButtonText, SearchOptions.exact);
        await loginButton.click();
        if (driver.isAndroid) {
            const allFields = await driver.findElementsByClassName(driver.locators.getElementByName("textfield"));
            await allFields[0].sendKeys(email);
            await allFields[1].sendKeys(password);
            if (driver.nsCapabilities.isSauceLab) {
                await driver.driver.hideDeviceKeyboard("Done");
            }
        } else {
            const usernameField = await driver.findElementByClassName(driver.locators.getElementByName("textfield"));
            await usernameField.sendKeys(email);
            const passField = await driver.findElementByClassName(driver.locators.getElementByName("securetextfield"));
            await passField.sendKeys(password);
            const done = await driver.findElementByText("Done", SearchOptions.contains);
            await done.click();
        }
        const loginBtn = await driver.findElementByText(loginButtonText, SearchOptions.exact);
        await testScreenShot('login');
        await loginBtn.click();
        const recentButton = await driver.findElementByText(recentButtonText, SearchOptions.exact);
        expect(recentButton).to.exist;
    });

    it("should add element in the list", async () => {
        const addField = await driver.findElementByClassName(driver.locators.getElementByName("textfield"));
        await addField.sendKeys(fruit);
        const allImages = await driver.findElementsByClassName(driver.locators.image); // First image is the menu, second is the cross adding to the list.
        await allImages[1].click(); // Cross image button to add the item.
        const appleItem = await driver.findElementByText(fruit);
        expect(appleItem).to.exist;
        await sleep(200);
        await testScreenShot('itemAdded');
    });

    it("should mark element as Done", async () => {
        await clickOnCrossOrCheckboxBtn();
        await sleep(200);
        await testScreenShot('itemMarked');
    });

    it("should delete item from the list", async () => {
        await clickOnBinButton();
        const appleListItemXpath = await driver.elementHelper.getXPathByText(fruit, SearchOptions.exact);
        const appleItem = await driver.findElementByXPathIfExists(appleListItemXpath, 10000);
        expect(appleItem).to.be.undefined;
        await sleep(200);
        await testScreenShot('itemDeleted');
    });

    it("should find deleted item in Recent", async () => {
        const recentButton = await driver.findElementByText(recentButtonText);
        await recentButton.click();
        const appleItem = await driver.findElementByText(fruit);
        expect(appleItem).to.exist;
        await sleep(200);
        await testScreenShot('itemInRecent');
    });

    it("should return back an item from the Recent list", async () => {
        await clickOnCrossOrCheckboxBtn();
        const doneButton = await driver.findElementByText(doneButtonText);
        await doneButton.click();
        const appleItem = await driver.findElementByText(fruit);
        expect(appleItem).to.exist;
        await sleep(200);
        await testScreenShot('itemReturned');
    });

    it("should delete item from the Groceries list and remove it from Recent", async () => {
        await clickOnBinButton();
        const recentButton = await driver.findElementByText(recentButtonText);
        await recentButton.click();

        await clickOnBinButton();

        const appleListItemXpath = await driver.elementHelper.getXPathByText(fruit, SearchOptions.contains);
        const appleItem = await driver.findElementByXPathIfExists(appleListItemXpath, 10000);
        expect(appleItem).to.be.undefined;
    });

    it("should log off", async () => {
        // First image is the menu, second is the clock/cross button. The rest are pairs checkbox/bin per list item.
        await driver.sleep(2000);
        const allImages = await driver.findElementsByClassName(driver.locators.image);
        await allImages[0].click(); // Menu button
        const logOffButton = await driver.findElementByText(logOffButtonText);
        await logOffButton.click();
        const loginButton = await driver.findElementByText(loginButtonText, SearchOptions.contains);
        expect(loginButton).to.exist;
    });

    it("should warn for invalid email", async () => {
        const loginButton = await driver.findElementByText(loginButtonText, SearchOptions.exact);
        await loginButton.click();
        const usernameField = await driver.findElementByClassName(driver.locators.getElementByName("textfield"));
        await usernameField.sendKeys(invalidEmail);
        if (driver.isAndroid) {
            if (driver.nsCapabilities.isSauceLab) {
                await driver.driver.hideDeviceKeyboard("Done");
            }
        } else {
            const done = await driver.findElementByText("Done", SearchOptions.contains);
            await done.click();
        }
        const loginBtn = await driver.findElementByText(loginButtonText, SearchOptions.exact);
        await loginBtn.click();
        const invalidEmailWarning = await driver.findElementByText(invalidEmailWarningText, SearchOptions.contains);
        expect(invalidEmailWarning).to.exist;
        const okButton = await driver.findElementByText(okButtonText);
        await okButton.click();
    });

    it("should open sign up form", async () => {
        const signUpHereButton = await driver.findElementByText(signUpHereButtonText);
        await signUpHereButton.click();
        const signUpButton = await driver.findElementByText(signUpButtonText, SearchOptions.exact);
        expect(signUpButton).to.exist;
        const backToLoginButton = await driver.findElementByText(backToLoginButtonText);
        await backToLoginButton.click();
    });

    it("should open Forgot password form", async () => {
        const forgotPasswordButton = await driver.findElementByText(forgotPasswordButtonText, SearchOptions.contains);
        await forgotPasswordButton.click();
        const forgotPasswordForm = await driver.findElementByText(forgotPasswordFormText, SearchOptions.contains);
        expect(forgotPasswordForm).to.exist;
        const cancelButton = await driver.findElementByText(cancelButtonText);
        await cancelButton.click();
    });
});