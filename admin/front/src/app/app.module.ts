import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from "@angular/common/http";

//Módulos varios
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ANIMATION_TYPES, Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { NgxConfirmBoxModule, NgxConfirmBoxService } from 'ngx-confirm-box';

//Módulos Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';
import { QuoteComponent } from './components/quote/quote.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './modules/home/home.component';
import { TopbarComponent } from './modules/topbar/topbar.component';
import { FooterComponent } from './modules/footer/footer.component';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { LoginComponent } from './components/login/login.component';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { OrderUserComponent } from './components/order-user/order-user.component';
import { OrderReportComponent } from './components/order-report/order-report.component';
import { ProfileComponent } from './components/profile/profile.component';

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
    OrderComponent,
    QuoteComponent,
    ChatComponent,
    HomeComponent,
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    AddOrderComponent,
    LoginComponent,
    QuotationListComponent,
    AddProductComponent,
    OrderUserComponent,
    OrderReportComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    Ng5SliderModule,
    DataTablesModule,
    AngularFireStorageModule,
    NgxDropzoneModule,
    NgxSummernoteModule,
    ToastrModule.forRoot(),
    NgxConfirmBoxModule,
    Ng2LoadingSpinnerModule.forRoot({
      animationType: ANIMATION_TYPES.chasingDots,
      spinnerPosition: 'center',
      spinnerColor   : '#fff',
      spinnerSize: 'md',
      backdropColor  : '#0000008a'
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger',
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
