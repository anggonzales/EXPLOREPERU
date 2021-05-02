import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private dbPath = '/categories';
  private filePath: any;
  categoryRef: AngularFirestoreCollection<Category> = null;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {
    this.categoryRef = db.collection(this.dbPath);
   }


  getData(): AngularFirestoreCollection<Category> {
    return this.categoryRef;
  }
  
}


