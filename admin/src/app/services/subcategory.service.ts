import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Subcategory } from '../models/subcategory';
import { AngularFireModule } from '@angular/fire';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private databaseFirebase = '/subcategories';
  subcategoryReference: AngularFirestoreCollection<Subcategory>;

  private subcategories: Observable<Subcategory[]>;

  constructor(private firestore: AngularFirestore) {
    this.subcategoryReference = firestore.collection(this.databaseFirebase)
  }

  getSubcategories(): Observable<any> {
    return this.firestore.collection('subcategories').snapshotChanges();
  }

  getSubcategoriesfilter(category)  {
    this.subcategoryReference = this.firestore.collection('subcategories', ref => ref.where('category', "==", category));
    return this.subcategories = this.subcategoryReference.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Subcategory;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }
}

