import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Quotation } from '../models/quotation';
import { UserService } from './user.service';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private databaseFirebase = '/quotation';
  quotationReference: AngularFirestoreCollection<Quotation>;
  private quotation: Observable<Quotation[]>;

  constructor(private firestore: AngularFirestore, private userService: UserService) {
    this.quotationReference = firestore.collection(this.databaseFirebase);
   }

  getQuotationFilter(userSellerId)  {
    this.quotationReference = this.firestore.collection('quotation', ref => ref.where('userSellerId', "==", userSellerId));
    return this.quotation = this.quotationReference.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data();
        data['id'] = action.payload.doc.id;
        return data;
      });
    }));
  }

  getQuotation(id: string): Observable<any> {
    return this.firestore.collection('quotation').doc(id).snapshotChanges();
  }

  updateQuotation(id: string, data:any): Promise<any> {
    return this.firestore.collection('quotation').doc(id).update(data);
  }
}
