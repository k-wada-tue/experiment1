import { Component, ViewChild, OnInit} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

interface  Dataset {
  value: string;
  viewValue: string;
}

declare function initializeMap(): any;
declare function changeAttr(attr): any;
declare function changeBasemap(value): any;
declare function tooltiptext(): any;
export let baseAttr: any;

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
    baseAttr = 'default';
  }

  onBasemapChange(value){
    console.log(" Basemap is : ", value );
    changeBasemap(value);
  }

  onAttrChange(value) {
    console.log(" Attribute is : ", value );
    changeAttr(value);
    baseAttr = value;
  }

  tooltiptext() {
    //console.log(baseAttr);
    if (baseAttr == 'default') {
      return "Moderate Exercise:\nAt least 150 minutes per week of\nmoderate intensity exercise,\nsuch as walking and cycling";
    } else if (baseAttr == 'm_exercise') {
      return "Moderate Exercise:\nAt least 150 minutes per week of\nmoderate intensity exercise,\nsuch as walking and cycling";
    } else if (baseAttr == 'healthy') {
      return "Healthy:\n'Very good'or 'good'\nabout their general health status";
    } else if (baseAttr == 'm_drinker') {
      return "Drinker:\nAlcohol consumption according to\nguideline (drink no or a maximum of\none glass of alcohol per day)";
    } else if (baseAttr == 'smoker') {
      return "Smoker:\nSmokers excluding electronic cigarette";
    } else if (baseAttr == 'overweight') {
      return "Overweight:\nBody Mass Index (BMI) of\n25.0 kg/m2 and above";
    } else if (baseAttr == 'illness') {
      return "Illness:\nOne or more long-term (6 months\nor longer) illnesses or disorders ";
    } else if (baseAttr == 'physical_p') {
      return "Physical Unavailability:\nGreat difficulty or inability to\n2carry an object of 5 kg\nfor 10 meters, bend down and\ngrab something off the ground,\nwalk 400 meters in a row\nwithout standing still";
    } else if (baseAttr == 'depression') {
      return "Depression:\nModerate or high risk of anxiety\nor depression based on a widely\nused anxiety and depression\nscreening questionnaire";
    } else if (baseAttr == 'loneliness') {
      return "Loneliness:\nSevere loneliness based on the\nloneliness scale, a questionnaire\nto measure loneliness andconsists\nof eleven statements about emotional\nloneliness and social loneliness";
    }

  }


}


