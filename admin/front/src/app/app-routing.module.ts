import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { OrderReportComponent } from './components/order-report/order-report.component';
import { OrderUserComponent } from './components/order-user/order-user.component';


import { OrderComponent } from './components/order/order.component';
import { ProductComponent } from './components/product/product.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { QuoteComponent } from './components/quote/quote.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'productlist', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'productlist', component: ProductComponent },
  { path: 'orderlist', component: OrderComponent },
  { path: 'quotationlist', component: QuotationListComponent },
  { path: 'createproduct', component: AddProductComponent },
  { path: 'orderconsult/:id', component: OrderUserComponent },
  { path: 'editorder/:id', component: AddOrderComponent },
  { path: 'editquotation/:id', component: QuoteComponent },
  { path: 'editproduct/:id', component: AddProductComponent },
  { path: 'orderreportlist', component: OrderReportComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
