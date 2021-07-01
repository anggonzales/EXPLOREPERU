import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private productService: ProductService,
    private quotationService: QuotationService,
    private aRoute: ActivatedRoute) {
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getQuotation();
  }

  getQuotation() {
    if (this.id !== null) {
      if (this.id !== null) {
        this.quotationService.getQuotation(this.id).subscribe(data => {
          this.getProduct(data.payload.data()['productId']);
          this.productPrice = data.payload.data()['price'];
          this.productAmount = data.payload.data()['estimateAmount'];
        });
      }
    }
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
