
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';

import { OrderComponent } from './order.component';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let service: OrderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientTestingModule
      ],
      declarations: [ 
        OrderComponent 
      ],
      providers: [
        OrderService,
        AngularFirestore,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(OrderService);
  });

  it('getOrders get Orders from the subscription', () => {
    const orderService = fixture.debugElement.injector.get(OrderService);
    const listOrder: Order[] = [];
    const spy1 = spyOn(orderService, 'getOrders').and.returnValue(of(listOrder));
    component.getOrders();
    expect(spy1).toHaveBeenCalled();
    expect(component.getOrders.length).toBe(0);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

