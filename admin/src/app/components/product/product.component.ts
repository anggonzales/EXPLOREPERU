import { Component, OnInit, Input, NgZone } from '@angular/core';
import  { NgForm } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/Product';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products = this.productService.products;
  private image: any;
  product: Product = new Product();
  submitted = false;
  files: File[] = [];
  imageProduct:File = null;
  categories:any;
  subcategories:any[] = [];

  constructor( private productService: ProductService, private categoryService: CategoryService ) { }

  ngOnInit(): void {
    this.retrieveCategories();
  }

  retrieveCategories(): void {
    this.categoryService.getData().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });
  }

  saveProduct(data: Product): void {
    //this.productService.preAddAndUpdatePost(data, this.image);
    //this.submitted = true;
    this.productService.create(this.product).then(() => {
      console.log('Se ha ingresado satisfactoriamente');
      this.submitted = true;
    });
  }

  newProduct(): void {
    this.submitted = true;
    this.product = new Product();
  }

  listProduct(): void {

  }

  handleImage(event: any): void {
    this.image = event.target.files[0];
  }

  onSelect(event) {
        
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
     
    this.files.splice(this.files.indexOf(event), 1);
  }

}
