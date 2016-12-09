import { SampleGroceriesPage } from './app.po';

describe('sample-groceries App', function() {
  let page: SampleGroceriesPage;

  beforeEach(() => {
    page = new SampleGroceriesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
