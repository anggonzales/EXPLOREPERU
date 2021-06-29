import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { UserBuyerService } from 'src/app/services/user-buyer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
  providers: [DatePipe]
})
export class QuoteComponent implements OnInit {

  /* Datatable Controles*/
  datatableOptions: DataTables.Settings = {};
  datatableTrigger: Subject<any> = new Subject<any>();
  /* ------------------------------------------------ */

  id: string | null;
  formQuotation: FormGroup;

  /* Consulta de producto y usuario comprador */
  productId: string;
  productName: string | null;
  productImage: string;

  userBuyerId: string;
  userBuyerName: string | null;
  preferredLanguage: string | null;
  userBuyerEmail: string | null;
  

  messageAnswered: string;
  userSellerId: any = {};
  submitted = false;

  constructor(private quotationService: QuotationService,
    private productService: ProductService,
    private messageService: MessageService,
    private orderService: OrderService,
    private userService: UserService,
    private userBuyerService: UserBuyerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private dateFormat: DatePipe,
    private aRoute: ActivatedRoute) {

    this.formQuotation = this.formBuilder.group({
      nameProduct: [{ value: '', disabled: true }, Validators.required],
      estimateAmount: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      paymentTerms: [{ value: '', disabled: true }, Validators.required],
      destiny: [{ value: '', disabled: true }, Validators.required],
      shippingDate: [{ value: '', disabled: true }, Validators.required],
      status: [{ value: '', disabled: true }, Validators.required],
      messageTranslate: [{ value: '', disabled: true }],
      messageAnswered: [{ value: '', disabled: false }],
      nameClient: [{ value: '', disabled: false }, Validators.required],
      emailClient: [{ value: '', disabled: false }, Validators.required],
      messageAnsweredTranslate: [{ value: '', disabled: true }]
    });

    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.userSellerId = this.userService.getIdentity();
  }

  ngOnInit(): void {
    this.getQuotation();
  }

  getQuotation() {
    if (this.id !== null) {
      this.quotationService.getQuotation(this.id).subscribe(data => {

        this.getProduct(data.payload.data()['productId']);
        this.getUserBuyer(data.payload.data()['userId']);
        this.productId = data.payload.data()['productId'];
        this.userBuyerId = data.payload.data()['userId'];

        this.formQuotation.setValue({
          nameProduct: '',
          nameClient: '',
          emailClient: '',
          estimateAmount: data.payload.data()['estimateAmount'],
          price: data.payload.data()['price'],
          paymentTerms: data.payload.data()['paymentTerms'],
          destiny: data.payload.data()['destiny'],
          shippingDate: data.payload.data()['shippingDate'],
          status: data.payload.data()['status'],
          messageTranslate: data.payload.data()['messageTranslate'],
          messageAnswered: data.payload.data()['messageAnswered'],
          messageAnsweredTranslate: data.payload.data()['messageAnsweredTranslate']
        });
      });
    }
  }

  getProduct(idproduct) {
    if (idproduct !== null) {
      this.productService.getProduct(idproduct).subscribe(res => {
        this.productName = res.payload.data()['name'];
        this.productImage = res.payload.data()['image'];
        this.formQuotation.controls['nameProduct'].setValue(this.productName);
        
      });
    }
  }

  getUserBuyer(userBuyerId) {
    if (userBuyerId !== null) {
      this.userBuyerService.getUserBuyer(userBuyerId).subscribe(data => {
        this.userBuyerName = data.payload.data()['firstName'];
        this.userBuyerEmail = data.payload.data()['email'];
        this.preferredLanguage = data.payload.data()['preferredLanguage'];
        this.formQuotation.controls['nameClient'].setValue(this.userBuyerName);
        this.formQuotation.controls['emailClient'].setValue(this.userBuyerEmail);
      });
    }
  }

  getMessageTranslate() {
    this.messageService.translateText(this.formQuotation.controls['messageAnswered'].value, this.preferredLanguage).subscribe(
      res => {
        this.messageAnswered = JSON.parse(JSON.stringify(res[0].translations[0].text));
        this.formQuotation.controls['messageAnsweredTranslate'].setValue(this.messageAnswered);
      });
  }

  updateQuotation() {
    this.submitted = true;
    if (this.formQuotation.invalid) {
      return;
    }

    if (this.id !== null) {
      this.editQuotation(this.id);
      this.sendMailQuotation();
      this.createOrder();
    }
  }

  createOrder() {

    const order = {
      userSeller: this.userSellerId,
      userId: this.userBuyerId,
      productName: this.productName,
      productId: this.productId,
      userBuyerName: this.userBuyerName,
      priceProduct: this.formQuotation.controls['price'].value,
      paymentTerms: this.formQuotation.controls['paymentTerms'].value,
      estimateAmount: this.formQuotation.controls['estimateAmount'].value,
      destiny: this.formQuotation.controls['destiny'].value,
      shippingDate: this.formQuotation.controls['shippingDate'].value,
      stateStartingOrder: 'EN PROCESO',
      stateProduction: "0",
      stateDAM: false,
      stateDepostTemporary: false,
      stateOrder: false
    }

    this.orderService.createOrder(order).then(() => {
      console.log('Se ha generado correctamente el pedido');
      this.toastr.success('El pedido se ha agregado correctamente', 'Pedido registrado', {
        positionClass: 'toast-bottom-right'
      });
      this.router.navigate(['/orderlist']);
    }).catch(error => {
      console.log(error);
    });
  }


  editQuotation(id: string) {
    const quotation: any = {
      status: 'Respondido',
      messageAnswered: this.formQuotation.value.messageAnswered,
      messageAnsweredTranslate: this.formQuotation.controls['messageAnswered'].value
    }

    this.quotationService.updateQuotation(id, quotation).then(() => {
      this.toastr.info('La cotización fue respondida con éxito', 'Estado de Cotización', {
        positionClass: 'toast-bottom-right'
      });
    })
  }


  sendMailQuotation() {
    let date = Date.now();
    var emailData = {
      pedidoId: this.id,
      name: this.userBuyerName,
      message: this.messageAnswered,
      email: this.userBuyerEmail,
      createAt: this.dateFormat.transform(date, 'MMM d, y, h:mm:ss a')
    }

    this.orderService.sendEmail(emailData).subscribe(data => {
      console.log(JSON.parse(JSON.stringify(emailData)));
      let msg = data['message']
      console.log(data, "success");
    }, error => {
      console.error(error, "error");
    });
  }

}
