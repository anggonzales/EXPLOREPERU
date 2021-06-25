import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Email } from '../models/email.interface';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private databaseFirebase = '/orders';
  orderReference: AngularFirestoreCollection<Order>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.orderReference = firestore.collection(this.databaseFirebase);
  }

  createOrder(order:any): Promise<any> {
    return this.firestore.collection('orders').add(order);
  }

  /* Iniciando conexión con el backend para el envío de correo electrónico  */
  sendEmail(obj): Observable<Email> {
    console.log(obj);
    return this.http.post<Email>('http://localhost:3000/sendFormData', obj)
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
}
