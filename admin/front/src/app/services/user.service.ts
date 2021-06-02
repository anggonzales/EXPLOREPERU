import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { UserTest } from '../models/userTest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any;

  private databaseFirebase = '/userTest';
  userReference: AngularFirestoreCollection<UserTest>;

  private user: Observable<UserTest[]>;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {
    this.userReference = firestore.collection(this.databaseFirebase)
    this.getStateAuth();
  }

  getUsers(): Observable<any> {
    return this.userReference.snapshotChanges();
  }

  getUser(id: string): Observable<any> {
    this.userReference = this.firestore.collection('userTest', ref => ref
      .where('id', "==", id));
    return this.userReference.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data();
          data.id = action.payload.doc.id;
          //console.log(data);
          return data;
        });
      }));
  }

  signIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password).then((res) => {
      this.SetUserData(res.user);
    });

  }

  public getUserLocalStorage(): any[] {
    let userSignIn = JSON.parse(localStorage.getItem('user'));

    if (userSignIn === null) {
      userSignIn = [];
    }
    return userSignIn;
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('uid'));
    if (identity === null) {
      identity = [];
    }
    return identity;
  }

  getStateAuth() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        localStorage.setItem('email', JSON.stringify(this.userData['email']));
        localStorage.setItem('uid', JSON.stringify(this.userData['uid']));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }


  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }
}
