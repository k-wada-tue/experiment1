import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './content/content-left/map/map.component';
import { RightComponent } from './content/content-right/right.component';
import { LeftComponent } from './content/content-left/left.component';
import { AnnoataionComponent } from './content/content-left/annotation/annotation.component';
import { PlayerComponent } from './content/content-left/player/player.component';
import { OverlayDataComponent } from './content/content-right/overlay-data/overlay-data.component';
import { BaseDataComponent } from './content/content-right/base-data/base-data.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    LeftComponent,
    RightComponent,
    MapComponent,
    AnnoataionComponent,
    PlayerComponent,
    OverlayDataComponent,
    BaseDataComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
