import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Email } from '../models/email.interface';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private databaseFirebase = '/orders';
  orderReference: AngularFirestoreCollection<Order>;
  private order: Observable<Order[]>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.orderReference = firestore.collection(this.databaseFirebase);
  }

  createOrder(order:any): Promise<any> {
    return this.firestore.collection('orders').add(order);
  }

  getOrders(): Observable<any> {
    return this.orderReference.snapshotChanges();
  }

  getOrder(id: string): Observable<any> {
    return this.firestore.collection('orders').doc(id).snapshotChanges();
  }

  updateOrder(id: string, data:any): Promise<any> {
    return this.firestore.collection('orders').doc(id).update(data);
  }

  getOrderFilter(userSellerId)  {
    this.orderReference = this.firestore.collection('orders', ref => ref.where('userSeller', "==", userSellerId));
    return this.order = this.orderReference.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data();
        data['id'] = action.payload.doc.id;
        return data;
      });
    }));
  }

  /* Iniciando conexión con el backend para el envío de correo electrónico  */
  sendEmail(obj): Observable<Email> {
    console.log(obj);
    return this.http.post<Email>('http://localhost:3000/sendFormData', obj)
  }
}
