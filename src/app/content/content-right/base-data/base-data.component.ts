import { Component, ViewChild, OnInit} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

interface  Dataset {
  value: string;
  viewValue: string;
}

declare function initializeMap(): any;
declare function changeAttr(attr): any;
declare function changeBasemap(value): any;

@Component ({
  selector: 'base-data',
  templateUrl: './base-data.component.html',
  styleUrls: ['./base-data.component.scss']
})

export class BaseDataComponent implements OnInit{
  @ViewChild( MatAccordion ) accordion: MatAccordion;
  datasets: Dataset[] = [
    {value: 'm_exercise', viewValue: 'Moderate Exercise'},
    {value: 'healthy', viewValue: 'Healthy'},
    {value: 'm_drinker', viewValue: 'Drinker'},
    {value: 'smoker', viewValue: 'Smorker'},
    {value: 'overweight', viewValue: 'Overweight'},
    {value: 'illness', viewValue: 'Illness'},
    {value: 'physical_p', viewValue: 'Physical Unavailability'},
    {value: 'depression', viewValue: 'Depression'},
    {value: 'loneliness', viewValue: 'Loneliness'}
  ];

  ngOnInit() {
    initializeMap();
  }

  onBasemapChange(value){
    console.log(" Basemap is : ", value );
    changeBasemap(value);
  }

  onAttrChange(value) {
    console.log(" Attribute is : ", value );
    changeAttr(value);
  }
}


