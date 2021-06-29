import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ANIMATION_TYPES, INg2LoadingSpinnerConfig } from 'ng2-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
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

  /* Código para la configuración de popover confirmation */
  placements = ['top', 'left', 'right', 'bottom'];
  popoverTitle = 'Mensaje de confirmación';
  popoverMessage = '¿Está seguro de realizar esta operación?';
  confirmText = 'Sí <i class="fas fa-check"></i>';
  cancelText = 'No <i class="fas fa-times"></i>';
  /*------------------------------------------------------*/

  formProduct: FormGroup;
  product: Product = new Product();
  submitted = false;
  categories: any[] = [];
  products: any[] = [];
  subcategories: any[] = [];
  userSellerId: any = {};
  categoryname: string
  id: string | null;

  productGallery: any[] = [];
  productGalleryDelete: any[] = [];

  files: File[] = [];

  ImageURL: Observable<string>;
  downloadURLGallery: any[] = [];
  imageProduct: any;
  imageUpload: any[] = [];

  show = false;

  loadingConfig: INg2LoadingSpinnerConfig = {

  };

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
        this.imageUpload = data.payload.data()['image'];
        this.getSubcategoryInit(data.payload.data()['category']);
        this.productGallery = data.payload.data()['gallery'];

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

  getSubcategoryInit(category) {
    this.subcategoryService.getSubcategoriesfilter(category).subscribe(data => {
      this.subcategories = [];
      for (const i in data) {
        this.subcategories.push(data[i]);
      }
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
    this.show = true;
    if (this.imageProduct !== null) {
      var filePath = `images/${this.userSellerId}/${this.imageProduct.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileReference = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.imageProduct);
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileReference.getDownloadURL().subscribe(urlImage => {
              this.ImageURL = urlImage;
              const product: any = {
                name: this.formProduct.value.name,
                description: this.formProduct.value.description,
                detail: this.formProduct.value.detail,
                price: this.formProduct.value.price,
                status: this.formProduct.value.status,
                category: this.formProduct.value.category,
                subcategory: this.formProduct.value.subcategory,
                image: urlImage
              }
              this.productService.updateProduct(id, product).then(() => {
                this.show = false;
                this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
                  positionClass: 'toast-bottom-right'
                });
              });
              console.log(this.ImageURL);
            });
          })
        ).subscribe();

    } else {
      const productNew: any = {
        name: this.formProduct.value.name,
        description: this.formProduct.value.description,
        detail: this.formProduct.value.detail,
        price: this.formProduct.value.price,
        status: this.formProduct.value.status,
        category: this.formProduct.value.category,
        subcategory: this.formProduct.value.subcategory
      }
      console.log("Imagenormal");
      this.productService.updateProduct(id, productNew).then(() => {
        this.show = false;
        this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
          positionClass: 'toast-bottom-right'
        });

      });
    }


    //this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
    //  positionClass: 'toast-bottom-right'
    //});
    //this.router.navigate(['/productlist']);


    /*this.productService.updateProduct(id, this.product).then(() => {
      this.show = false;
      this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
        positionClass: 'toast-bottom-right'
      });
      this.router.navigate(['/productlist']);
    }).catch(error => {
      console.log(error);
    });*/
  }

  removeGallery(image) {
    this.show = true;
    this.productGallery.forEach((name, index) => {
      if (image == name) {
        this.productGallery.splice(index, 1);

        const product: any = {
          gallery: this.productGallery
        }

        console.log(this.productGallery);
        this.productService.updateProduct(this.id, product).then(() => {
          this.show = false;
          this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
            positionClass: 'toast-bottom-right'
          });
        });
      }
    })
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

  onSelect(event) {
    this.files.push(...event.addedFiles);
    console.log(event);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  saveGallery() {
    this.show = true;
    for (let i = 0; i < this.files.length; i++) {
      var filePath = `images/${this.userSellerId}/${this.files[i].name.split('.').slice(0, -1).join('.')}/${'gallery'}_${new Date().getTime()}`;
      const fileReference = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.files[i]);
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileReference.getDownloadURL().subscribe(urlImage => {
              this.downloadURLGallery = urlImage;
              this.productGallery.push(this.downloadURLGallery);

              const product: any = {
                gallery: this.productGallery
              }

              this.productService.updateProduct(this.id, product).then(() => {
                this.show = false;
                this.toastr.info('El producto fue modificado con éxito', 'Producto actualizado', {
                  positionClass: 'toast-bottom-right'
                });
              });
            });
          })
        ).subscribe();
    }
    this.files = [];
  }

  showLoading() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 9000);
  }

  remove() {

  }
}
