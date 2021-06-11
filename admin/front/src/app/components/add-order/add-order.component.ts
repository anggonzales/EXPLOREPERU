import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ng5-slider';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
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

  isReadonlyDAM: boolean;
  isReadonlyDepostTemporary: Boolean;
  isReadonlyOrder: boolean;

  isSwitchedDAM: boolean = false;
  isSwitchedDepost: boolean = false;
  isSwitchedOrder: boolean = false;

  checkDAM: boolean = false;
  checkDepostTemporary: boolean = false;
  checkOrder: boolean = false;

  production: any;
  stateProduction: any;
  stateSlider: number
  submitted = false;
  email: any[] = [];
  id: string | null;

  @Input() checkIdDAM: boolean;
  @Input() checkIdDepostTemporary: boolean;
  @Input() checkIdOrder: boolean;



  constructor(private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {

    this.formOrder = this.formBuilder.group({
      emailClient: [{ value: '', disabled: true }, Validators.required],
      nameClient: [{ value: '', disabled: true }, Validators.required],
      nameProduct: [{ value: '', disabled: true }, Validators.required],
      priceProduct: [{ value: '', disabled: true }, Validators.required],
      paymentTerms: [{ value: '', disabled: true }, Validators.required],
      estimatedAmount: [{ value: '', disabled: true }, Validators.required],
      unit: [{ value: '', disabled: true }, Validators.required],
      destiny: [{ value: '', disabled: true }, Validators.required],
      shippingDate: [{ value: '', disabled: true }, Validators.required],
      stateProduction: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.getOrder();
    this.isReadonlyDAM = true;
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
      this.sendMailDAM();
    }
  }

  editOrder(id: string) {
    const order: any = {
      stateProduction: this.production
    }
    this.orderService.updateOrder(id, order).then(() => {
      this.toastr.info('El avance de producción fue modificado con éxito', 'Estado de producción', {
        positionClass: 'toast-bottom-right'
      })
    })
  }

  editOrderDAM(id: string) {
    const order: any = {
      stateDAM: this.isSwitchedDAM
    }

    this.orderService.updateOrder(id, order).then(() => {
      this.sendMailDAM();
      this.toastr.info('El avance del proceso de exportación fue modificado con éxito', 'Estado de exportación', {
        positionClass: 'toast-bottom-right'
      });
    });
  }

  editOrderDepostTemporary(id: string) {
    const order: any = {
      stateDepostTemporary: this.isSwitchedDepost
    }
    this.orderService.updateOrder(id, order).then(() => {
      this.sendMailDAM();
      this.toastr.info('El avance del proceso de exportación fue modificado con éxito', 'Estado de exportación', {
        positionClass: 'toast-bottom-right'
      });
    });
  }

  editOrderState(id: string) {
    const order: any = {
      stateOrder: this.isSwitchedOrder
    }
    this.orderService.updateOrder(id, order).then(() => {
      this.sendMailDAM();
      this.toastr.info('El avance del proceso de exportación fue modificado con éxito', 'Estado de exportación', {
        positionClass: 'toast-bottom-right'
      });
    });
  }

  /* https://angular-slider.github.io/ngx-slider/demos */

  getOrder() {
    if (this.id !== null) {
      this.orderService.getOrder(this.id).subscribe(data => {
        this.stateProduction = data.payload.data()['stateProduction'];
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
          console.log(this.checkDAM);
          this.checkIdDAM = true;
          this.isReadonlyDAM = true;
        } else {
          this.checkIdDAM = false;
          this.isReadonlyDAM = false;
        }

        if (this.checkDepostTemporary === true) {
          console.log(this.checkDepostTemporary);
          this.checkIdDepostTemporary = true;
          this.isReadonlyDepostTemporary = true;
        } else {
          this.checkIdDepostTemporary = false;
          this.isReadonlyDepostTemporary = false;
        }

        if (this.checkOrder === true) {
          console.log(this.checkOrder);
          this.checkIdOrder = true;
          this.isReadonlyOrder = true;
        } else {
          this.checkIdOrder = false;
          this.isReadonlyOrder = false;
        }

        this.formOrder.setValue({
          emailClient: data.payload.data()['emailClient'],
          nameClient: data.payload.data()['nameClient'],
          nameProduct: data.payload.data()['nameProduct'],
          priceProduct: data.payload.data()['priceProduct'],
          paymentTerms: data.payload.data()['paymentTerms'],
          estimatedAmount: data.payload.data()['estimatedAmount'],
          unit: data.payload.data()['unit'],
          destiny: data.payload.data()['destiny'],
          shippingDate: data.payload.data()['shippingDate'],
          stateProduction: data.payload.data()['stateProduction']
        })
      });
    }
  }



  sendMailDAM() {
    let date = Date.now();
    var emailData = {
      pedidoId: this.id,
      name: 'Angel',
      message: 'El porcentaje de avance de su pedido es del '+ this.production + '%',
      email: 'info@gmail.com',
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

  /*value: number = 10;
  options: Options = {
    floor: 0,
    ceil: 100,
    minLimit: 10,
  };*/


}
