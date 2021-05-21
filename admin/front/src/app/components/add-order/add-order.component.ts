import { Component, OnInit } from '@angular/core';
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

  formOrder: FormGroup;
  isSwitchedDAM: boolean = false;
  isSwitchedDepost: boolean = false;
  isSwitchedOrder: boolean = false;
  public productionNumber;
  checkDAM: boolean = false;
  production: any;
  submitted = false;
  public email: any;
  id: string | null;

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
      shippingDate: [{ value: '', disabled: true }, Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
  }
  

  getAdvance(value: number): void {
    this.production = `${value}`;
    console.log(this.production);
  }

  ngOnInit(): void {
    this.getOrder();
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
    const order: any = {
      stateProduction: this.production,
      stateDAM: this.isSwitchedDAM,
      stateDepostTemporary: this.isSwitchedDepost,
      stateStartingOrder: this.isSwitchedOrder
    }

    this.orderService.updateOrder(id, order).then(() => {
      this.toastr.info('El avance de producción fue modificado con éxito', 'Estado de producción', {
        positionClass: 'toast-bottom-right'
      })
    })
  }

  getOrder() {
    if (this.id !== null) {
      this.orderService.getOrder(this.id).subscribe(data => {
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
      this.orderService.getOrder(this.id).subscribe(data => {
        this.checkDAM = data.payload.data()['stateDAM'];
        console.log(this.checkDAM);
      });
    }
  }

  sendMail() {
    this.email = {
      name: 'Se ha generado la Declaración de Mercancías Aduanero',
      email: 'aggc9982@gmail.com'
    }

    this.orderService.sendEmail(this.email).subscribe(data => {
      let msg = data['message']
      console.log(msg);
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
  }
  getSwitcherDepost(onoffswicth) {
    this.isSwitchedDepost = !this.isSwitchedDepost;
    console.log("onoffswicth:" + this.isSwitchedDepost);
  }
  getSwitcherOrder(onoffswicth) {
    this.isSwitchedOrder = !this.isSwitchedOrder;
    console.log("onoffswicth:" + this.isSwitchedOrder);
  }

  value: number = 10;
  options: Options = {
    floor: 0,
    ceil: 100
  };
}
