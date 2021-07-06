import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css']
})
export class OrderReportComponent implements OnDestroy, OnInit {

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
    },);
  }

  ngOnDestroy(): void {
    this.datatableTrigger.unsubscribe();
  }

}
