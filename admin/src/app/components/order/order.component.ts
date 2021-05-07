import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  
  constructor() { }


  ngOnInit(): void {
    
  }


  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 100
  };
}
