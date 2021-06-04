import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { Email } from '../models/email.interface';

import { OrderService } from './order.service';

describe('Order Service', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientTestingModule
      ],
      providers: [
        OrderService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  })

  it('sendEmail return a request', () => {
    let email = {
      name: 'Angel',
      email: 'aggc9982@gmail.com'
  }
    service.sendEmail(email).subscribe((resp: Email) => {
      expect(resp).not.toBeNull();
    });
    
    const req = httpMock.expectOne('http://localhost:3000/sendFormData');
    expect(req.request.method).toBe('POST');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

