import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/Product';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  private image: any;
  private imageGallery : any;
  product: Product = new Product();
  submitted = false;
  gallery: File[] = [];
  imageProduct: File = null;
  categories: any[] = [];
  products: any[] = [];
  subcategories: any[] = [];
  selectedImage: any = null;
  imgSrc: string;
  dtOptions: DataTables.Settings = {};


  constructor(private productService: ProductService, private categoryService: CategoryService, private subcategoryService: SubcategoryService, private storage: AngularFireStorage, private toastr: ToastrService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe((data:any[]) => {
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

  getSubcategory(input) {
    let category = input.value.split("_")[0];
    console.log(category);
    this.subcategoryService.getSubcategoriesfilter(category).subscribe(data => {
      this.subcategories = [];
      for (const i in data) {
        this.subcategories.push(data[i]);
      }
    });
  }


  saveProduct(): void {
    this.productService.createProductImage(this.product, this.image);
    //this.productService.createProduct(this.product).then(() => {
      /* GUARDAR DATOS DE PRODUCTO*/
      this.toastr.success('El producto se ha agregado correctamente', 'Producto registrado', {
      positionClass: 'toast-top-right'
      });
      console.log('Se ha ingresado satisfactoriamente');
      this.submitted = true;
      this.closebutton.nativeElement.click();
    //});
  }

  newProduct(): void {
    this.submitted = true;
  }


  /* Funciones para el maneja de la galería de imagenes*/
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      console.log(this.selectedImage);
    }
    else {
      this.selectedImage = null;
    }
  }

  uploadFile(event) {
    this.image = event.target.gallery[0];
    const filePath = 'products';
    const task = this.storage.upload(filePath, this.image);
  }

  onSelect(event) {
    this.gallery.push(...event.addedFiles);
  }

  onRemove(event) {
    this.gallery.splice(this.gallery.indexOf(event), 1);
  }

  handleImage(event: any): void {
    this.image = event.target.files[0];
    console.log(this.image);
  }

}
