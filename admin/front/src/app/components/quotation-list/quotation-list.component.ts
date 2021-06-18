import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { QuotationService } from 'src/app/services/quotation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css']
})
export class QuotationListComponent implements OnDestroy, OnInit {

  userSellerId: any = {};
  quotations: any[] = [];

  //Datable
  datatableOptions: DataTables.Settings = {};
  datatableTrigger: Subject<any> = new Subject<any>();

  constructor(private quotationService: QuotationService, private userService: UserService) {
    this.userSellerId = this.userService.getIdentity();
  }


  ngOnInit(): void {
    this.getQuotationFilter();
  }

  getQuotationFilter() {
    this.quotationService.getQuotationFilter(this.userSellerId).subscribe(data => {
      this.quotations = data;
      this.datatableTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.datatableTrigger.unsubscribe();
  }
}
