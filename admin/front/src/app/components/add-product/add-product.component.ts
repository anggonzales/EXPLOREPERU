import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
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

  formProduct: FormGroup;

  image: any;
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
  categoryname: string

  id: string | null;
  imageUpload: any[] = [];

  /* SUMMERNOTE CONFIGURACIÓN*/


  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private aRoute: ActivatedRoute) {

    this.formProduct = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      detail: [''],
      price: ['', Validators.required],
      status: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required]
    });

    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.userSellerId = this.userService.getIdentity();
  }

  ngOnInit(): void {
    this.getProduct();
    this.getCategories();
  }

  getProduct() {
    if (this.id !== null) {
      this.productService.getProduct(this.id).subscribe(data => {
        this.imageUpload = data.payload.data()['gallery'];

        this.formProduct.setValue({
          name: data.payload.data()['name'],
          description: data.payload.data()['description'],
          detail: data.payload.data()['detail'],
          price: data.payload.data()['price'],
          status: data.payload.data()['status'],
          category: data.payload.data()['category'],
          subcategory: data.payload.data()['subcategory']
        });
      });
    }
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

  updateProduct(): void {
    this.submitted = true;
    if (this.formProduct.invalid) {
      return;
    }

    if (this.id !== null) {
      this.editProduct(this.id);
    }
  }

  editProduct(id: string) {
    const product: any = {
      name: this.formProduct.value.name,
      description: this.formProduct.value.description,
      detail: this.formProduct.value.detail,
      price: this.formProduct.value.price,
      status: this.formProduct.value.status,
      category: this.formProduct.value.category,
      subcategory: this.formProduct.value.subcategory
    }

    this.productService.updateProduct(id, product).then(() => {
      this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
        positionClass: 'toast-bottom-right'
      });
      this.router.navigate(['/productlist']);
    }).catch(error => {
      console.log(error);
    });
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

  onUploadImage(event) {
    this.imageUpload.push(...event.addedFiles);
    console.log(this.imageUpload);
  }

  validateImage(e, tagPicture) {
    this.imageProduct = e.target.files[0];
    let image = e.target.files[0];

    let data = new FileReader();
    data.readAsDataURL(image);

    $(data).on("load", function (event) {
      let path = event.target.result;
      $(`.${tagPicture}`).attr("src", <any>path);
    })
  }
}
