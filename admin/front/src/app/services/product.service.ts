import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FileI } from '../models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { UserService } from './user.service';



@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private databaseFirebase = '/products';
  productReference: AngularFirestoreCollection<Product>;
  private downloadURL: Observable<string>;
  public downloadURLGallery: any[] = [];
  public galleryList: any[] = [];
  userSellerId: any = {};
  private products: Observable<Product[]>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private userService: UserService) {
    this.productReference = firestore.collection(this.databaseFirebase);
    this.userSellerId = this.userService.getIdentity();
  }

  createProduct(product: Product) {
    const productObj = {
      name: product.name,
      userSellerId: this.userSellerId,
      description: product.description,
      price: product.price,
      image: this.downloadURL,
      gallery: this.galleryList,
      status: product.status,
      category: product.category,
      subcategory: product.subcategory
    };

    return this.productReference.add(productObj);
  }

  public createProductImage(product: Product, image: FileI, gallery: Array<any>): void {
    this.uploadImageProduct(product, image, gallery);
  }

  updateProduct(id: string, data: any): Promise<void> {
    return this.firestore.collection('products').doc(id).update(data);
  }

  getProduct(id: string): Observable<any> {
    return this.firestore.collection('products').doc(id).snapshotChanges();
  }

  getProducts(): Observable<any> {
    return this.productReference.snapshotChanges();
  }

  getProductsFilter(userSellerId)  {
    this.productReference = this.firestore.collection('products', ref => ref.where('userSellerId', "==", userSellerId));
    return this.products = this.productReference.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Product;
        return data;
      });
    }));
  }

  /** Registrar la imagen principal y la galería de imagenes del producto */
  uploadImageProduct(product: Product, image: FileI, gallery: Array<any>) {

    for (let i = 0; i < gallery.length; i++) {
      var filePath2 = `images/${gallery[i].name}/${'gallery'}_${new Date().getTime()}`;
      const fileRef2 = this.storage.ref(filePath2);
      const task2 = this.storage.upload(filePath2, gallery[i]);
      task2.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef2.getDownloadURL().subscribe(urlImage2 => {
              this.downloadURLGallery = urlImage2
              this.galleryList.push(this.downloadURLGallery);
              console.log(this.downloadURLGallery);
              console.log(this.galleryList);
            });
          })
        ).subscribe();
    }

    var filePath = `images/${image.name}/${'main'}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.createProduct(product);
          });
        })
      ).subscribe();

    
  }
}
