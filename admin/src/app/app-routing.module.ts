import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

import { OrderComponent } from './components/order/order.component';
import { ProductComponent } from './components/product/product.component';
import { QuoteComponent } from './components/quote/quote.component';

const routes: Routes = [
  { path: '', redirectTo: 'productlist', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'productlist', component: ProductComponent },
  { path: 'orderlist', component: OrderComponent },
  { path: 'quotelist', component: QuoteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
