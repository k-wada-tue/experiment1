//import { Component} from '@angular/core';
//import {MatCheckboxModule} from '@angular/material/checkbox';
import { Component, ViewChild} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

//declare function addOverlay(status, value): any;
//declare function trackOverlay(): any;

declare let gtag: any;
export let checkStatus: any;
export let checkValue: any;

function trackOverlay(value) {
  if (checkStatus == true) { //send click data only when checkbox is checked (not unchecked)
    console.log('excuted');
    console.log(value);
    gtag('event', 'click', {
      'event_category': value + '_checked',
      'event_label': 'overlay datasets',
      //'event_status': 'checkbox_' + checkStatus,
      'value': 0 })
  }
}


function addOverlay (status, value) {
    if (status == true && value != undefined) {
      document.getElementById(value).setAttribute('aria-hidden', 'false');
    } else if (status == false && value != undefined) {
      document.getElementById(value).setAttribute('aria-hidden', 'true');
    }
}

@Component ({
  selector: 'overlay-data',
  templateUrl: './overlay-data.component.html',
  styleUrls: ['./overlay-data.component.scss']
})

export class OverlayDataComponent {
  @ViewChild( MatAccordion ) accordion: MatAccordion;

  default = false;
  // checked = true;

  onAddOverlay(event) {

    checkStatus = event.checked;
    console.log(checkStatus);
    checkValue = event.source.value;

    addOverlay(event.checked, checkValue);
    trackOverlay(checkValue);
  }
}


