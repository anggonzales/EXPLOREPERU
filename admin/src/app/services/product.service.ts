import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FileI } from '../models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private databaseFirebase = '/products';
  productReference: AngularFirestoreCollection<Product>;
  private downloadURL: Observable<string>;
  private downloadURLGallery: Observable<[]>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {
    this.productReference = firestore.collection(this.databaseFirebase);
  }

  createProduct(product: Product) {

    const productObj = {
      name: product.name,
      store: 'Peruana S.A.C',
      description: product.description,
      price: product.price,
      image: this.downloadURL,
      gallery: this.downloadURL,
      status: product.status,
      category: product.category,
      subcategory: product.subcategory
    };

    return this.productReference.add(productObj);
  }

  public createProductImage(product: Product, image: FileI): void {
    this.uploadImageProduct(product, image);
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

  uploadImageProduct(product: Product, image: FileI) {
    var filePath = `images/${image.name}`;
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

    /*for (let i = 0; i < gallery.length; i++) {
      var filePath2 = `images/${gallery[i]}`;
      const fileRef2 = this.storage.ref(filePath2);
      const task2 = this.storage.upload(filePath2, gallery);
      task2.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef2.getDownloadURL().subscribe(urlImage2 => {
              this.downloadURLGallery = urlImage2;
              this.createProduct(product);
            });
          })
        ).subscribe();
    }*/

  }
}
