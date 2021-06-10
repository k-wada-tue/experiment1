import { Component} from '@angular/core';
//import {MatCheckboxModule} from '@angular/material/checkbox';

declare function addOverlay(status, value): any;
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
      'event_label': value,
      //'event_status': 'checkbox_' + checkStatus,
      'value': 0 })
  }
}

@Component ({
  selector: 'overlay-data',
  templateUrl: './overlay-data.component.html',
  styleUrls: ['./overlay-data.component.scss']
})

export class OverlayDataComponent {
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


