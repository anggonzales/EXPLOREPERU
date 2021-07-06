import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INg2LoadingSpinnerConfig } from 'ng2-loading-spinner';
import { Options } from 'ng5-slider';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order';
import { MessageService } from 'src/app/services/message.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { UserBuyerService } from 'src/app/services/user-buyer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
  providers: [DatePipe]
})
export class AddOrderComponent implements OnInit {

  value: number;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
  };

  /* Código para la configuración de popover confirmation */
  placements = ['top', 'left', 'right', 'bottom'];
  popoverTitle = 'Mensaje de confirmación';
  popoverMessage = '¿Está seguro de realizar esta operación?';
  confirmText = 'Sí <i class="fas fa-check"></i>';
  cancelText = 'No <i class="fas fa-times"></i>';
  /*------------------------------------------------------*/

  formOrder: FormGroup;
  productId: string;
  productName: string | null;
  productImage: string;
  productAmount: string;
  productTranslate:string;

  userBuyerId: string;
  userBuyerName: string | null;
  userBuyerEmail: string | null;
  preferredLanguage: string;


  isReadonlyDAM: boolean;
  isReadonlyDepostTemporary: Boolean;
  isReadonlyOrder: boolean;

  isSwitchedDAM: boolean = false;
  isSwitchedDepost: boolean = false;
  isSwitchedOrder: boolean = false;

  checkDAM: boolean = false;
  checkDepostTemporary: boolean = false;
  checkOrder: boolean = false;

  order: Order = new Order();

  production: any;
  stateProduction: any;
  stateSlider: number
  submitted = false;
  email: any[] = [];
  id: string | null;


  userSellerId: any = {};
  date = Date.now();

  @Input() checkIdDAM: boolean;
  @Input() checkIdDepostTemporary: boolean;
  @Input() checkIdOrder: boolean;

  show = false;

  loadingConfig: INg2LoadingSpinnerConfig = {

  };

  constructor(private orderService: OrderService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private userBuyerService: UserBuyerService,
    private messageService: MessageService,
    private dateFormat: DatePipe,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {

    this.formOrder = this.formBuilder.group({
      emailClient: [{ value: '', disabled: true }, Validators.required],
      nameClient: [{ value: '', disabled: true }, Validators.required],
      nameProduct: [{ value: '', disabled: true }, Validators.required],
      priceProduct: [{ value: '', disabled: true }, Validators.required],
      paymentTerms: [{ value: '', disabled: true }, Validators.required],
      estimateAmount: [{ value: '', disabled: true }, Validators.required],
      destiny: [{ value: '', disabled: true }, Validators.required],
      shippingDate: [{ value: '', disabled: true }, Validators.required],
      stateProduction: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.userSellerId = this.userService.getIdentity();
  }

  ngOnInit(): void {
    this.getOrder();
    this.isReadonlyDAM = true;
  }

  getOrder() {
    if (this.id !== null) {
      this.orderService.getOrder(this.id).subscribe(data => {
        this.stateProduction = data.payload.data()['stateProduction'];
        this.getProduct(data.payload.data()['productId']);
        this.getUserBuyer(data.payload.data()['userId']);
 
        this.productAmount = data.payload.data()['estimateAmount'];
        this.checkDAM = data.payload.data()['stateDAM'];
        this.checkDepostTemporary = data.payload.data()['stateDepostTemporary'];
        this.checkOrder = data.payload.data()['stateOrder'];
        this.stateSlider = data.payload.data()['stateProduction'];

        this.options = {
          floor: 0,
          ceil: 100,
          step: 1,
          minLimit: this.stateSlider,
          maxLimit: 100
        }

        if (this.checkDAM === true) {
          this.checkIdDAM = true;
          this.isReadonlyDAM = true;
        } else {
          this.checkIdDAM = false;
          this.isReadonlyDAM = false;
        }

        if (this.checkDepostTemporary === true) {
          this.checkIdDepostTemporary = true;
          this.isReadonlyDepostTemporary = true;
        } else {
          this.checkIdDepostTemporary = false;
          this.isReadonlyDepostTemporary = false;
        }

        if (this.checkOrder === true) {
          this.checkIdOrder = true;
          this.isReadonlyOrder = true;
        } else {
          this.checkIdOrder = false;
          this.isReadonlyOrder = false;
        }

        this.formOrder.setValue({
          emailClient: '',
          nameClient: '',
          nameProduct: '',
          priceProduct: data.payload.data()['priceProduct'],
          paymentTerms: data.payload.data()['paymentTerms'],
          estimateAmount: data.payload.data()['estimateAmount'],
          destiny: data.payload.data()['destiny'],
          shippingDate: data.payload.data()['shippingDate'],
          stateProduction: data.payload.data()['stateProduction']
        });
      });
    }
  }


  getProduct(idproduct) {
    if (idproduct !== null) {
      this.productService.getProduct(idproduct).subscribe(res => {
        this.productName = res.payload.data()['name'];
        this.productImage = res.payload.data()['image'];
        this.formOrder.controls['nameProduct'].setValue(this.productName);
        this.messageService.translateText(this.productName, this.preferredLanguage).subscribe(
          data => {
            this.productTranslate = JSON.parse(JSON.stringify(data[0].translations[0].text));
          })
      });
    }
  }

  getUserBuyer(userBuyerId) {
    if (userBuyerId !== null) {
      this.userBuyerService.getUserBuyer(userBuyerId).subscribe(data => {
        this.userBuyerName = data.payload.data()['firstName'];
        this.userBuyerEmail = data.payload.data()['email'];
        
        this.preferredLanguage = data.payload.data()['preferredLanguage'];
        this.formOrder.controls['nameClient'].setValue(this.userBuyerName);
        this.formOrder.controls['emailClient'].setValue(this.userBuyerEmail);
      });
    }
  }

  getAdvance(value: number): void {
    this.production = `${value}`;
    console.log(this.production);
  }

  updateOrder() {
    this.submitted = true;
    if (this.formOrder.invalid) {
      return;
    }

    if (this.id !== null) {
      this.editOrder(this.id);
    }
  }

  editOrder(id: string) {
    this.show = true;
    const order: any = {
      stateProduction: this.production,
      stateProductionDate: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
    }

    this.orderService.updateOrder(id, order).then(() => {
      this.show = false;
      this.sendMailStateProduction();
      this.toastr.info('El avance de producción fue modificado con éxito', 'Estado de producción', {
        positionClass: 'toast-bottom-right'
      });
    })
  }

  editOrderDAM(id: string) {
    const order: any = {
      stateDAM: this.isSwitchedDAM,
      stateDAMDate: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
    }

    this.orderService.updateOrder(id, order).then(() => {
      this.sendMailStateDAM();
      this.toastr.info('El avance del proceso de exportación fue modificado con éxito', 'Estado de exportación', {
        positionClass: 'toast-bottom-right'
      });
    });
  }

  editOrderDepostTemporary(id: string) {
    this.sendMailStateDepostTemporary();
    const order: any = {
      stateDepostTemporary: this.isSwitchedDepost,
      stateDepostTemporaryDate: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
    }

    this.orderService.updateOrder(id, order).then(() => {
      this.toastr.info('El avance del proceso de exportación fue modificado con éxito', 'Estado de exportación', {
        positionClass: 'toast-bottom-right'
      });
    });
  }

  editOrderState(id: string) {
    this.sendMailStateOrder();
    const order: any = {
      stateOrder: this.isSwitchedOrder,
      stateOrderDate: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a'),
      stateStartingOrder: 'FINALIZADO'
    }

    this.orderService.updateOrder(id, order).then(() => {
      this.toastr.info('El avance del proceso de exportación fue modificado con éxito', 'Estado de exportación', {
        positionClass: 'toast-bottom-right'
      });
    });
  }



  sendMailStateProduction() {
    let messageStateProduction = 'El porcentaje de avance de su pedido es del ' + this.production + '%';
    this.messageService.translateText(messageStateProduction, this.preferredLanguage).subscribe(
      data => {
        var emailData = {
          orderId: this.id,
          name: this.userBuyerName,
          message: JSON.parse(JSON.stringify(data[0].translations[0].text)),
          email: this.userBuyerEmail,
          productName: this.productTranslate,
          productImage: this.productImage,
          productAmount: this.productAmount,
          orderUser: 'http://localhost:4200/orderconsult/' + this.id,
          createAt: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
        }

        this.orderService.sendEmail(emailData).subscribe(data => {
          console.log(JSON.parse(JSON.stringify(emailData)));
          let msg = data['message']
          console.log(data, "success");
        }, error => {
          console.error(error, "error");
        });
      })
  }

  sendMailStateDAM() {
    let messageDAM = 'Su pedido a finalizado la etapa de la Generación del Documento Aduanero de Mercancías. El siguiente proceso que se verá es el depósito temporal en almacén.';
    this.messageService.translateText(messageDAM, this.preferredLanguage).subscribe(
      data => {
        var emailData = {
          orderId: this.id,
          name: this.userBuyerName,
          message: JSON.parse(JSON.stringify(data[0].translations[0].text)),
          email: this.userBuyerEmail,
          productName: this.productTranslate,
          productImage: this.productImage,
          productAmount: this.productAmount,
          orderUser: 'http://localhost:4200/orderconsult/' + this.id,
          createAt: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
        }

        this.orderService.sendEmail(emailData).subscribe(data => {
          console.log(JSON.parse(JSON.stringify(emailData)));
          let msg = data['message']
          console.log(data, "success");
        }, error => {
          console.error(error, "error");
        });
      })
  }

  sendMailStateDepostTemporary() {
    let messageDepostTemporary = 'Su pedido ha pasado la etapa de depósito temporal en almacén. El siguiente proceso que se verá es la orden de salida.';
    this.messageService.translateText(messageDepostTemporary, this.preferredLanguage).subscribe(
      data => {
        var emailData = {
          orderId: this.id,
          name: this.userBuyerName,
          message: JSON.parse(JSON.stringify(data[0].translations[0].text)),
          email: this.userBuyerEmail,
          productName: this.productTranslate,
          productImage: this.productImage,
          productAmount: this.productAmount,
          orderUser: 'http://localhost:4200/orderconsult/' + this.id,
          createAt: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
        }

        this.orderService.sendEmail(emailData).subscribe(data => {
          console.log(JSON.parse(JSON.stringify(emailData)));
          let msg = data['message']
          console.log(data, "success");
        }, error => {
          console.error(error, "error");
        });
      })
  }

  sendMailStateOrder() {
    let messageStateOrder = 'Su pedido a finalizado el proceso de exportación. Su orden de pedido ha concluido el proceso de exportación.';
    this.messageService.translateText(messageStateOrder, this.preferredLanguage).subscribe(
      data => {
        var emailData = {
          orderId: this.id,
          name: this.userBuyerName,
          message: JSON.parse(JSON.stringify(data[0].translations[0].text)),
          email: this.userBuyerEmail,
          productName: this.productTranslate,
          productImage: this.productImage,
          productAmount: this.productAmount,
          orderUser: 'http://localhost:4200/orderconsult/' + this.id,
          createAt: this.dateFormat.transform(this.date, 'MMM d, y, h:mm:ss a')
        }

        this.orderService.sendEmail(emailData).subscribe(data => {
          console.log(JSON.parse(JSON.stringify(emailData)));
          let msg = data['message']
          console.log(data, "success");
        }, error => {
          console.error(error, "error");
        });
      })
  }

  updateOrderReport() {
    this.show = true;
    this.messageService.translateText(this.order.stateDAMReport, this.preferredLanguage).subscribe(data => {
      let messagestateDAMReport = this.order.stateDAMReport;
      const order: any = {
        stateDAMCheck: true,
        stateDAMReportMessage: messagestateDAMReport,
        stateDAMReport: JSON.parse(JSON.stringify(data[0].translations[0].text))
      }

      this.orderService.updateOrder(this.id, order).then(() => {
        this.show = false;
        this.toastr.info('Se ha informado el problema correctamente', 'Estado de exportación', {
          positionClass: 'toast-bottom-right'
        });
      });
    })
  }


  /** Código fuente extraído de Stackoverflow 
    *  Url="https://stackoverflow.com/questions/56754494/how-to-get-value-of-on-off-switch"
  */

  getSwitcherDAM(onoffswicth) {
    this.isSwitchedDAM = !this.isSwitchedDAM;
    console.log("onoffswicth:" + this.isSwitchedDAM);
    if (this.id !== null) {
      this.editOrderDAM(this.id);

    }
    else {

    }
  }

  getSwitcherDepost(onoffswicth) {
    this.isSwitchedDepost = !this.isSwitchedDepost;
    console.log("onoffswicth:" + this.isSwitchedDepost);
    if (this.id !== null) {
      this.editOrderDepostTemporary(this.id);
    }
    else {

    }
  }

  getSwitcherOrder(onoffswicth) {
    this.isSwitchedOrder = !this.isSwitchedOrder;
    console.log("onoffswicth:" + this.isSwitchedOrder);
    if (this.id !== null) {
      this.editOrderState(this.id);
    }
    else {

    }
  }

  getCancelDAM(onoffswicth) {
    this.checkIdDAM = false;
  }

  getCancelOrder(onoffswicth) {
    this.checkIdOrder = false;
  }

  getCancelDepost(onoffswicth) {
    this.checkIdDepostTemporary = false;
  }

  showLoading() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 1500);
  }
}
