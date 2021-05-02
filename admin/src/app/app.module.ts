import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

const config = {
  apiKey: "AIzaSyBGQ5lU2iwjN35W2QkcAJoI4YJ3t4PSbcY",
  authDomain: "explore-peru-from-abroad.firebaseapp.com",
  databaseURL: "https://explore-peru-from-abroad-default-rtdb.firebaseio.com",
  projectId: "explore-peru-from-abroad",
  storageBucket: "explore-peru-from-abroad.appspot.com",
  messagingSenderId: "1018755399244",
  appId: "1:1018755399244:web:33f63619f17f4b3489fee9"
};


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
