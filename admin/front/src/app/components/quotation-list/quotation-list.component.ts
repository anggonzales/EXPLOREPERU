import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { UserBuyerService } from 'src/app/services/user-buyer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css']
})
export class QuotationListComponent implements OnDestroy, OnInit {

  userSellerId: any = {};
  quotations: any[] = [];
  productName: string | null;
  productId: any = {};
  userBuyerName: string | null;

  //Datable
  datatableOptions: DataTables.Settings = {};
  datatableTrigger: Subject<any> = new Subject<any>();

  constructor(private quotationService: QuotationService,
    private productService: ProductService,
    private userService: UserService,
    private userBuyerService: UserBuyerService) {
    this.userSellerId = this.userService.getIdentity();
  }


  ngOnInit(): void {
    this.getQuotationFilter();
  }

  getQuotationFilter() {
    this.quotationService.getQuotationFilter(this.userSellerId).subscribe(data => {
      this.quotations = [];

      for (const i in data) {
        this.quotations.push(data[i]);
      }
      
      this.datatableTrigger.next();
    });
  }

  getProduct(productId) {
    if (productId !== null) {
      this.productService.getProduct(productId).subscribe(data => {
        this.productName = data.payload.data()['name'];
        console.log(this.productName);
      });
    }
  }

  getUserBuyer(userBuyerId) {
    if (userBuyerId !== null) {
      this.userBuyerService.getUserBuyer(userBuyerId).subscribe(data => {
        this.userBuyerName = data.payload.data()['firstName'];
      });
    }
  }

  /*getQuotationFilter() {
    this.quotationService.getQuotationFilter(this.userSellerId).subscribe(data => {
      this.quotations = data;
      this.datatableTrigger.next();
    });
  }*/

  ngOnDestroy(): void {
    //this.datatableTrigger.unsubscribe();
  }
}
