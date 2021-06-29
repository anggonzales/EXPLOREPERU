import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ANIMATION_TYPES, INg2LoadingSpinnerConfig } from 'ng2-loading-spinner';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  localStorageEmail: any;
  localStorageId: string;
  userData: any;
  show = false;

  loadingConfig: INg2LoadingSpinnerConfig = {
   
  };

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router,) {
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
    })
  }

  ngOnInit(): void {

  }

  login() {
    console.log(this.email);
    this.show = true;
    this.auth.signInWithEmailAndPassword(this.email, this.password).then((res) => {
      this.show = false;
      this.SetUserData(res.user);
      this.router.navigate(['productlist']);
      
    });
  }

  getIdentity() {
    localStorage.setItem("email", this.localStorageEmail);
    localStorage.setItem("id", this.localStorageId);
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

  showLoading() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 1500);
  }
  
}
