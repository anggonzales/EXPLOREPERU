import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.css']
})
export class OrderUserComponent implements OnInit {

  id: string | null;
  productName: string | null;
  productPrice: string;
  productAmount: string;
  productImage: string;

  quotationId: string;
  quotationDateAccept: string;

  orderStateProduction: string;
  stateProductionDate: string;

  orderStateDAM: boolean;
  stateDAMDate: string;
  stateDAMReportMessage: string;

  orderState: boolean;
  stateOrderDate: string;
  stateDAMCheck:boolean;

  orderStateDepostTemporary: boolean;
  stateDepostTemporaryDate:string;

  constructor(private productService: ProductService,
    private quotationService: QuotationService,
    private orderService: OrderService,
    private aRoute: ActivatedRoute) {
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    if (this.id !== null) {
      this.orderService.getOrder(this.id).subscribe(data => {
        this.getProduct(data.payload.data()['productId']);
        this.productPrice = data.payload.data()['price'];
        this.productAmount = data.payload.data()['estimateAmount'];
        this.quotationId = data.payload.data()['quotationId'];
        this.quotationDateAccept = data.payload.data()['quotationDateAccept'];
        this.orderStateProduction = data.payload.data()['stateProduction'];
        this.orderStateDAM = data.payload.data()['stateDAM'];
        this.orderStateDepostTemporary = data.payload.data()['stateDepostTemporary'];
        this.orderState = data.payload.data()['stateOrder'];

        this.stateProductionDate = data.payload.data()['stateProductionDate'];
        this.stateDAMDate = data.payload.data()['stateDAMDate'];
        this.stateDepostTemporaryDate = data.payload.data()['stateDepostTemporaryDate'];
        this.stateOrderDate = data.payload.data()['stateOrderDate'];
        this.stateDAMCheck = data.payload.data()['stateDAMCheck'];
        this.stateDAMReportMessage = data.payload.data()['stateDAMReportMessage'];
      });
    }
  }

  getQuotation() {
    if (this.id !== null) {
      this.quotationService.getQuotation(this.id).subscribe(data => {
        this.getProduct(data.payload.data()['productId']);
        this.productPrice = data.payload.data()['price'];
        this.productAmount = data.payload.data()['estimateAmount'];
      });
    }
  }

  translateInformation(){
    
  }

  getProduct(idproduct) {
    if (idproduct !== null) {
      this.productService.getProduct(idproduct).subscribe(res => {
        this.productName = res.payload.data()['name'];
        this.productImage = res.payload.data()['image'];
      });
    }
  }

}
