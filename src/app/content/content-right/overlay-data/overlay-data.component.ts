import { Component} from '@angular/core';
//import {MatCheckboxModule} from '@angular/material/checkbox';

declare function addOverlay(status, value): any;
// declare let checkStatus: any;
// declare let checkValue: any;

declare const gtag: any;

@Component ({
  selector: 'overlay-data',
  templateUrl: './overlay-data.component.html',
  styleUrls: ['./overlay-data.component.scss']
})

export class OverlayDataComponent {
  default = false;
  checked = true;

  onAddOverlay(event) {
    console.log(event.checked);
    //checkStatus = event.checked;
    console.log(event.source.value);
    //checkValue = event.source.value;
    addOverlay(event.checked, event.source.value);
  }

  trackGreenArea(){
    gtag('event', 'TRACK_ME_BUTTON_CLICKED', {
    'event_category': 'BUTTON_CLICK',
    'event_label': 'Track Me Click',
    'value': 'Put a value here that is meaningful with respect to the click event'   })
  }


}


