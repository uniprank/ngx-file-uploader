import { NgxFileUploaderPage } from './app.po';

describe('ngxfileuploader App', () => {
  let page: NgxFileUploaderPage;

  beforeEach(() => {
    page = new NgxFileUploaderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
