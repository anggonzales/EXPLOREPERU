import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, ) {
    this.getStateAuth();
  }

  signIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password).then((res) => {
      this.SetUserData(res.user);
    });

  }

  public getUserLocalStorage(): any[] {
    let userSignIn =  JSON.parse(localStorage.getItem('user'));
    if(userSignIn === null) {
      userSignIn = [];
    }
    return userSignIn;
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
