import { HeaderComponent } from './header.component';
import { TestBed } from '@angular/core/testing';

describe('HeaderComponent ', () => {
  let componentUnderTest: HeaderComponent;
  Given(() => {
    TestBed.configureTestingModule({
      providers: [HeaderComponent]
    }).compileComponents();

    componentUnderTest = TestBed.get(HeaderComponent);
    spyOn(componentUnderTest, 'ngOnInit').and.callThrough();
  });

  When(() => {
    componentUnderTest.ngOnInit();
  });

  describe('INIT', () => {
    Given(() => {
      // @ts-ignore
      spyOn(componentUnderTest, 'initMenu').and.callThrough();
    });

    Then(() => {
      // @ts-ignore
      expect(componentUnderTest.initMenu).toHaveBeenCalled();
      // @ts-ignore
      expect(componentUnderTest.mainmenuItems.length).toBe(4);
    });
  });
});
