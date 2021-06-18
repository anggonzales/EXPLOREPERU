import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { MessageService } from 'src/app/services/message.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

  /* Datatable Controles*/
  datatableOptions: DataTables.Settings = {};
  datatableTrigger: Subject<any> = new Subject<any>();
  /* ------------------------------------------------ */

  id: string | null;
  formQuotation: FormGroup;

  /* Consulta de producto y usuario comprador */
  public productId: any | null;
  productName: any[] = [];

  userBuyerId: string;
  userBuyerSelect: any = null;
  messageAnswered: string;

  submitted = false;

  constructor(private quotationService: QuotationService,
    private productService: ProductService,
    private messageService: MessageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private orderService: OrderService,
    private aRoute: ActivatedRoute) {

    this.formQuotation = this.formBuilder.group({
      nameProduct: [{ value: '', disabled: true }, Validators.required],
      estimatedAmount: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      paymentTerms: [{ value: '', disabled: true }, Validators.required],
      destiny: [{ value: '', disabled: true }, Validators.required],
      shippingDate: [{ value: '', disabled: true }, Validators.required],
      status: [{ value: '', disabled: true }, Validators.required],
      messageTranslate: [{ value: '', disabled: true }, Validators.required],
      messageAnswered: [{ value: '', disabled: false }, Validators.required],
      nameClient: [{ value: '', disabled: false }, Validators.required],
      emailClient: [{ value: '', disabled: false }, Validators.required],
      messageAnsweredTranslate: [{ value: '', disabled: true }, Validators.required]
    });

    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.getQuotation();
  }

  getQuotation() {
    if (this.id !== null) {
      this.quotationService.getQuotation(this.id).subscribe(data => {

        this.productId = data.payload.data()['productId'];
        this.userBuyerId = data.payload.data()['usersId'];
        console.log(this.userBuyerId);

        this.formQuotation.setValue({
          nameProduct: '',
          nameClient: '',
          emailClient: '',
          estimatedAmount: data.payload.data()['estimatedAmount'],
          price: data.payload.data()['price'],
          paymentTerms: data.payload.data()['paymentTerms'],
          destiny: data.payload.data()['destiny'],
          shippingDate: data.payload.data()['shippingDate'],
          status: data.payload.data()['status'],
          messageTranslate: data.payload.data()['messageTranslate'],
          messageAnswered: data.payload.data()['messageAnswered'],
          messageAnsweredTranslate: data.payload.data()['messageAnsweredTranslate']
        })

        this.userService.getUser(this.userBuyerId).subscribe(data => {
          this.userBuyerSelect = JSON.parse(JSON.stringify(data[0]));
          this.formQuotation.controls['nameClient'].setValue(this.userBuyerSelect.name);
          this.formQuotation.controls['emailClient'].setValue(this.userBuyerSelect.email);
        });

        this.productService.getProductNow(this.productId).subscribe(data =>{
          this.productName = JSON.parse(JSON.stringify(data, null, 0));
          console.log(this.productName);
        });
        
      });
    }
  }

  getProduct(idproduct) {
    this.productService.getProductNow(idproduct).subscribe(data => {
      this.productName = data;
      console.log(this.productName);
    });
  }

  getUserBuyer() {
    this.userService.getUser(this.userBuyerId).subscribe(data => {
      this.userBuyerSelect = JSON.parse(JSON.stringify(data[0]));
      console.log(this.userBuyerSelect.languageCode);
    });
  }

  getMessageTranslate() {
    this.messageService.translateText(this.formQuotation.controls['messageAnswered'].value, this.userBuyerSelect.languageCode).subscribe(
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
    }
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
      name: this.userBuyerSelect.nameClient,
      message: this.messageAnswered,
      email: this.userBuyerSelect.emailClient,
      createAt: '',
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
