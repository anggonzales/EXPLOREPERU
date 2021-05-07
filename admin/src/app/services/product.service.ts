import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private databaseFirebase = '/products';
  productReference: AngularFirestoreCollection<Product>;
  
  constructor( private firestore: AngularFirestore ){
    this.productReference = firestore.collection(this.databaseFirebase);
  }

  createProduct(product: Product) {
    return this.productReference.add({ ...product });
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
}
