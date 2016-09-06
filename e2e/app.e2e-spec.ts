import { KnowleadPage } from './app.po';

describe('knowlead App', function() {
  let page: KnowleadPage;

  beforeEach(() => {
    page = new KnowleadPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
