import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  private image: any;
  private imageGallery: any;
  product: Product = new Product();
  submitted = false;
  files: File[] = [];
  imageProduct: File = null;
  categories: any[] = [];
  products: any[] = [];
  subcategories: any[] = [];
  selectedImage: any = null;
  imgSrc: string;
  userSellerId: any = {};


  //Datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  
  constructor(private productService: ProductService, private categoryService: CategoryService, private subcategoryService: SubcategoryService, private storage: AngularFireStorage, private toastr: ToastrService,
    private router: Router, private fb: FormBuilder, private userService: UserService) {
    this.userSellerId = this.userService.getIdentity();
  }

  ngOnInit(): void {
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
    this.productService.createProductImage(this.product, this.image, this.files);
    this.toastr.success('El producto se ha agregado correctamente', 'Producto registrado', {
      positionClass: 'toast-top-right'
    });
    console.log('Se ha ingresado satisfactoriamente');
    this.submitted = true;
  }

  newProduct(): void {
    this.submitted = true;
  }

  /* Funciones para el manejo de la galería de imagenes*/
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
    this.files.push(...event.addedFiles);
    console.log(event);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  handleImage(event: any): void {
    this.image = event.target.files[0];
    console.log(this.image);
  }

}
