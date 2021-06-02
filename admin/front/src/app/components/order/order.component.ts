import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Options } from 'ng5-slider';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public email: any;
  orders: any[] = [];
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
    });
  }

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 100
  };
}
