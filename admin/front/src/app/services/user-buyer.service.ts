import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserTest } from '../models/userTest';

@Injectable({
  providedIn: 'root'
})
export class UserBuyerService {

  private databaseFirebase = '/users';
  userReference: AngularFirestoreCollection<UserTest>;

  private user: Observable<UserTest[]>;

  constructor(private firestore: AngularFirestore) { 
    this.userReference = firestore.collection(this.databaseFirebase)
  }

  getUserBuyer(id: string): Observable<any> {
    return this.firestore.collection('users').doc(id).snapshotChanges();
  }

  updateUserBuyer(id: string, data:any): Promise<any> {
    return this.firestore.collection('users').doc(id).update(data);
  }

}
