import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../models/Product';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileI } from '../models/file.interface';



@Injectable({
  providedIn: 'root'
})

export class ProductService {

  products: Observable<Product[]>;
  private dbPath = '/products';
  private filePath: any;
  private downloadURL: Observable<string>;

  productRef: AngularFirestoreCollection<Product>;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { 
    this.productRef = db.collection(this.dbPath);
    this.getProducts();
  }

  getAll(): AngularFirestoreCollection<Product> {
    return this.productRef;
  }

  create(product: Product): any {
    return this.productRef.add({ ...product });
  }

  update(id: string, data: any): Promise<void> {
    return this.productRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.productRef.doc(id).delete();
  }

  getProducts(): void {
    this.products = this.productRef.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as Product))
    );
  }

  saveProduct(product : Product){
    const productObj = {
        id: product.id,
        name: product.name,
        store: product.store,
        description: product.description,
        price : product.price,
        detail: product.detail,
        image: this.downloadURL,
        gallery: product.gallery,
        status: product.status,
        category: product.category,
        subcategory: product.subcategory
    };

    return this.productRef.add(productObj);
  }

  public preAddAndUpdatePost(product: Product, image: FileI): void {
    this.uploadImage(product, image);
  }

  private uploadImage(product : Product, image: FileI) {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.saveProduct(product);
          });
        })
      ).subscribe();
  }
}
