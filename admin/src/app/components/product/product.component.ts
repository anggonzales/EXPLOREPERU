import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/Product';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  private image: any;
  product: Product = new Product();
  submitted = false;
  files: File[] = [];
  imageProduct: File = null;
  categories: any[] = [];
  products: any[] = [];
  subcategories: any[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService, private toastr: ToastrService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(data => {
      data.forEach((element: any) => {
        this.products.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      data.forEach((element: any) => {
        this.categories.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
  }

  saveProduct() : void {
    this.productService.createProduct(this.product).then(() => {
      this.toastr.success('El producto se ha agregado correctamente', 'Producto registrado', {
        positionClass: 'toast-top-right'
      });
      console.log('Se ha ingresado satisfactoriamente');
      this.submitted = true;
      this.closebutton.nativeElement.click();
    });
  }

  newProduct(): void {
    this.submitted = true;
    //this.product = new Product();
  }


  /* Funciones para el maneja de la galería de imagenes*/
  onSelect(event) {
    this.files.push(...event.addedFiles);
    console.log(event);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  handleImage(event: any): void {
    this.image = event.target.files[0];
  }

}
