import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

import { UserService } from './user.service';

describe('User Service', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let storage = {};

  const userAuth: User[] =  [
    {
      uid: '',
      email: '',
      displayName: '',
      photoURL: '',
      emailVerified: ''
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientTestingModule
      ],
      providers: [
        UserService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    storage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storage[key] ? storage[key] : null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      return storage[key] = value;
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getUser return empty value when localStorage is empty', () => {
    const userAuth = service.getUserLocalStorage();
    expect(userAuth.length).toBe(0);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
