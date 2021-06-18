import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnDestroy, OnInit {


  orders: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private orderService: OrderService, private fb: FormBuilder ) { }
  
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().pipe(
      map(changes => changes.map(c => ({ 
        id: c.payload.doc.id, 
        ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.orders = data;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  /*getOrders() {
    this.orderService.getOrders().pipe(
      map(changes => changes.map(c => ({ 
        id: c.payload.doc.id, 
        ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.orders = data;
    });
  }*/
}
