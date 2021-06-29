import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnDestroy, OnInit {


  orders: any[] = [];
  datatableOptions: DataTables.Settings = {};
  datatableTrigger: Subject<any> = new Subject<any>();
  userSellerId: any = {};
  submitted = false;

  constructor(private orderService: OrderService,
    private userService: UserService) { 
      this.userSellerId = this.userService.getIdentity();
    }
  
  ngOnInit(): void {
    this.getQuotationFilter();
  }

  getQuotationFilter() {
    this.orderService.getOrderFilter(this.userSellerId).subscribe(data => {
      this.orders = [];
      for (const i in data) {
        this.orders.push(data[i]);
      }
      this.datatableTrigger.next();
    });
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
      this.datatableTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.datatableTrigger.unsubscribe();
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
