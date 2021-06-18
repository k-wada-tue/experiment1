import { Component, ViewChild} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component ({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent {
  @ViewChild( MatAccordion ) accordion: MatAccordion;

}
