import { BrewToolsCliPage } from './app.po';

describe('brew-tools-cli App', () => {
  let page: BrewToolsCliPage;

  beforeEach(() => {
    page = new BrewToolsCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
