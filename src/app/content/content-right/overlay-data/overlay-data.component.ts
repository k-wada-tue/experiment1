import { Component} from '@angular/core';
//import {MatCheckboxModule} from '@angular/material/checkbox';

declare function addOverlay(status, value): any;
//export function trackOverlay(): any;
// declare let checkStatus: any;
// declare let checkValue: any;

declare let gtag: any;
export let checkStatus: any;
export let checkValue: any;

@Component ({
  selector: 'overlay-data',
  templateUrl: './overlay-data.component.html',
  styleUrls: ['./overlay-data.component.scss']
})

export class OverlayDataComponent {
  default = false;
  // checked = true;

  onAddOverlay(event) {
    console.log(event.checked);
    checkStatus = event.checked;

    checkValue = event.source.value;

    addOverlay(event.checked, event.source.value);

    gtag('event', 'click', {
      'event_category': 'checked',
      'event_label': 'something',
      //'event_status': 'checkbox_' + checkStatus,
      'value': 0 })
  }
}


