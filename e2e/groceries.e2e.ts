import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { isSauceLab, runType, capabilitiesName } from "nativescript-dev-appium/lib/parser";
import { expect } from "chai";
import { ImageOptions } from "nativescript-dev-appium/lib/image-options";

const isSauceRun = isSauceLab;
const isAndroid: string = runType.includes("android");

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

    const clickOnCrossCheckboxBtn = async ()=>{
        if (isAndroid) {
            // First image is the menu, second is the cross button. The rest are pairs checkbox/bin per list item.
            const allImages = await driver.findElementsByClassName(driver.locators.image);
            await allImages[2].click(); // Checkbox button
        } else {
            await driver.clickPoint(26, 160); // Checkbox button
        }
    }

    const clickOnBinButton = async() =>{
        if (isAndroid) {
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
    }

    before(async () => {
        driver = await createDriver();
        driver.defaultWaitTime = 15000;
    });

    after(async () => {
        if (isSauceRun) {
            driver.sessionId().then(function (sessionId) {
                console.log("Report: https://saucelabs.com/beta/tests/" + sessionId);
            });
        }
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should log in", async () => {
        const loginButton = await driver.findElementByText(loginButtonText, SearchOptions.exact);
        await loginButton.click();
        if (isAndroid) {
            const allFields = await driver.findElementsByClassName(driver.locators.getElementByName("textfield"));
            await allFields[0].sendKeys(email);
            await allFields[1].sendKeys(password);
            if (isSauceLab) {
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
    });

    it("should mark element as Done", async () => {
        await clickOnCrossCheckboxBtn();
        const appleItem = await driver.findElementByText(fruit);
        const isItemDone = await driver.compareElement(appleItem, "itemDone", 0.07);
        expect(isItemDone).to.be.true;
    });

    it("should delete item from the list", async () => {
        await clickOnBinButton();
        const appleListItemXpath = await driver.elementHelper.getXPathByText(fruit, SearchOptions.exact);
        const appleItem = await driver.findElementByXPathIfExists(appleListItemXpath, 10000);
        expect(appleItem).to.be.undefined;
    });

    it("should find deleted item in Recent", async () => {
        const recentButton = await driver.findElementByText(recentButtonText);
        await recentButton.click();
        const appleItem = await driver.findElementByText(fruit);
        expect(appleItem).to.exist;
    });

    it("should return back an item from the Recent list", async () => {
        await clickOnCrossCheckboxBtn();
        const doneButton = await driver.findElementByText(doneButtonText);
        await doneButton.click();
        const appleItem = await driver.findElementByText(fruit);
        expect(appleItem).to.exist;
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
        await driver.driver.sleep(2000);
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
        if (isAndroid) {
            if (isSauceLab) {
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