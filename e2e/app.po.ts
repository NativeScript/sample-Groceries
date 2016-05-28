export class GroceriesPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('groceries-app h1')).getText();
  }
}
