import { MessageService } from 'primeng/components/common/messageservice';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

describe('NotificationsService test', () => {
  let serviceUnderTest: NotificationsService;
  let messageServiceSpy: Spy<MessageService>;
  const fakeMassege = {
    severity: 'tata',
    summary: 'summary',
    detail: 'detail'
  };

  const fakeMasseges = [
    {
      severity: 'success',
      summary: 'Service Message',
      detail: 'Via MessageService'
    },
    {
      severity: 'info',
      summary: 'Info Message',
      detail: 'Via MessageService'
    }
  ];

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationsService,
        {
          provide: MessageService,
          useValue: createSpyFromClass(MessageService)
        }
      ]
    });
    serviceUnderTest = TestBed.get(NotificationsService);
    messageServiceSpy = TestBed.get(MessageService);
  });

  describe('GIVEN single notification THEN call MessageService', () => {
    Given(() => {
      messageServiceSpy.add.and.callFake(() => {});
      spyOn(serviceUnderTest, 'addSingle').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      serviceUnderTest.addSingle('tata', 'summary', 'detail');
    });

    Then(() => {
      // @ts-ignore
      expect(serviceUnderTest.messageService.add).toHaveBeenCalledWith(
        fakeMassege
      );
    });
  });

  describe('GIVEN multiple notifications THEN call MessageService', () => {
    Given(() => {
      spyOn(serviceUnderTest, 'addMultiple').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      serviceUnderTest.addMultiple();
    });

    Then(() => {
      // @ts-ignore
      expect(serviceUnderTest.messageService.addAll).toHaveBeenCalledWith(
        fakeMasseges
      );
    });
  });

  describe('METHOD clear', () => {
    Given(() => {
      spyOn(serviceUnderTest, 'clear').and.callThrough();
    });

    When(() => {
      // @ts-ignore
      serviceUnderTest.clear();
    });

    Then(() => {
      // @ts-ignore
      expect(serviceUnderTest.messageService.clear).toHaveBeenCalled();
    });
  });
});
