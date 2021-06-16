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
export let baseValue: any;

declare let gtag: any;

function trackBasemap(value) {
    console.log('excuted');
    console.log(value);
    gtag('event', 'click', {
      'event_category': value + '_selected',
      'event_label': value,
      //'event_status': 'checkbox_' + checkStatus,
      'value': 0 })
}

function trackBaseAttr(value) {

    console.log('excuted');
    console.log(value);
    gtag('event', 'click', {
      'event_category': value + '_selected',
      'event_label': value,
      //'event_status': 'checkbox_' + checkStatus,
      'value': 0 })
}

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
    baseValue = value;
    trackBasemap(baseValue);
  }

  onAttrChange(value) {
    console.log(" Attribute is : ", value );
    changeAttr(value);
    baseAttr = value;
    trackBaseAttr(baseAttr);
  }

  tooltiptext() {
    //console.log(baseAttr);
    if (baseAttr == 'default') {
      return "Moderate Exercise (19 years and older):\n\nAt least 150 minutes per week of\nmoderate intensity exercise,\nsuch as walking and cycling.\nSource: RIVM Open data StatLine (2016)";
    } else if (baseAttr == 'm_exercise') {
      return "Moderate Exercise (19 years and older):\n\nAt least 150 minutes per week of\nmoderate intensity exercise,\nsuch as walking and cycling.\nSource: RIVM Open data StatLine (2016)";
    } else if (baseAttr == 'healthy') {
      return "Healthy (19 years and older):\n\n'Very good'or 'good'\nabout their general health status.\nSource: RIVM Open data StatLine (2016)";
    } else if (baseAttr == 'm_drinker') {
      return "Drinker (19 years and older):\n\nAlcohol consumption according to\nguideline (drink no or a maximum of\none glass of alcohol per day).\nSource: RIVM Open data StatLine (2016)";
    } else if (baseAttr == 'smoker') {
      return "Smoker (19 years and older):\n\nSmokers excluding electronic cigarette.\nSource: RIVM Open data StatLine";
    } else if (baseAttr == 'overweight') {
      return "Overweight (19 years and older):\n\nBody Mass Index (BMI) of\n25.0 kg/m2 and above.\nSource: RIVM Open data StatLine";
    } else if (baseAttr == 'illness') {
      return "Illness (19 years and older):\n\nOne or more long-term (6 months\nor longer) illnesses or disorders.\nSource: RIVM Open data StatLine";
    } else if (baseAttr == 'physical_p') {
      return "Physical Unavailability (19 years and older):\n\nGreat difficulty or inability to\n2carry an object of 5 kg\nfor 10 meters, bend down and\ngrab something off the ground,\nwalk 400 meters in a row\nwithout standing still.\nSource: RIVM Open data StatLine";
    } else if (baseAttr == 'depression') {
      return "Depression (19 years and older):\n\nModerate or high risk of anxiety\nor depression based on a widely\nused anxiety and depression\nscreening questionnaire.\nSource: RIVM Open data StatLine";
    } else if (baseAttr == 'loneliness') {
      return "Loneliness (19 years and older):\n\nSevere loneliness based on the\nloneliness scale, a questionnaire\nto measure loneliness andconsists\nof eleven statements about emotional\nloneliness and social loneliness.\nSource: RIVM Open data StatLine";
    }

  }


}


