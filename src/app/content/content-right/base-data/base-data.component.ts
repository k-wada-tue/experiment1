//import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, ViewChild, OnInit} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

interface  Dataset {
  value: string;
  viewValue: string;
}

declare function checkFunction(): any;
declare let name: string;

@Component ({
  selector: 'base-data',
  templateUrl: './base-data.component.html',
  styleUrls: ['./base-data.component.scss']
})

export class BaseDataComponent implements OnInit{
  @ViewChild( MatAccordion ) accordion: MatAccordion;
  datasets: Dataset[] = [
    {value: 'sports-0', viewValue: 'Moderate Exercise'},
    {value: 'healthy-1', viewValue: 'Healthy'},
    {value: 'drinker-2', viewValue: 'Drinker'},
    {value: 'smoker-3', viewValue: 'Smorker'},
    {value: 'illness-4', viewValue: 'Illuness'},
    {value: 'physical-5', viewValue: 'Physical Unavailability'},
    {value: 'depress-6', viewValue: 'Depression'},
    {value: 'loneliness-7', viewValue: 'Loneliness'}
  ];

  ngOnInit() {
    checkFunction();
  }

  boundarySelected(value){
    console.log(" Value is : ", value );
    //checkFunction();
    name=value;
    //console.log(name);
  }
  onBookChange(value) {
    console.log(" Value is : ", value );
  }
}


