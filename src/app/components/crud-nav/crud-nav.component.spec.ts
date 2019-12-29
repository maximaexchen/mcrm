import { CrudNavComponent } from './crud-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('CrudNavComponent ', () => {
  let componentUnderTest: CrudNavComponent;
  let router = {
    navigate: jasmine.createSpy('navigate') // to spy on the url that has been routed
  };
  Given(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [],
      providers: [CrudNavComponent, { provide: Router, useValue: router }]
    }).compileComponents();

    componentUnderTest = TestBed.get(CrudNavComponent);
  });

  describe('METHOD onSubmit', () => {
    Given(() => {
      spyOn(componentUnderTest.save, 'emit');
    });

    When(() => {
      componentUnderTest.onSubmit();
    });

    Then(() => {
      expect(componentUnderTest.save.emit).toHaveBeenCalledWith(
        'CrudNav Submit'
      );
    });
  });

  describe('METHOD onCreate', () => {
    Given(() => {
      spyOn(componentUnderTest.create, 'emit');
      componentUnderTest.routeNew = 'newItem';
    });

    When(() => {
      componentUnderTest.onCreate();
    });

    Then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['newItem']);
    });
  });

  describe('METHOD onEdit', () => {
    Given(() => {
      spyOn(componentUnderTest.edit, 'emit');
    });

    When(() => {
      componentUnderTest.onEdit();
    });

    Then(() => {
      expect(componentUnderTest.edit.emit).toHaveBeenCalledWith('CrudNav Edit');
    });
  });

  describe('METHOD onDelete', () => {
    Given(() => {
      spyOn(componentUnderTest.delete, 'emit');
    });

    When(() => {
      componentUnderTest.onDelete();
    });

    Then(() => {
      expect(componentUnderTest.delete.emit).toHaveBeenCalledWith(
        'CrudNav Delete'
      );
    });
  });
});
