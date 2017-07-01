import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { MaterialModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap/';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgGridModule } from 'angular2-grid';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { BrewTimerComponent } from './components/brewtimer/brewtimer.component';
import { TimeRowComponent } from './components/brewtimer/timerow.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { Utilities } from './components/utilities/utilities.component';
import { PageNotFoundComponent } from './components/utilities/not-found.component';

import { WindowRef } from './services/window-ref.service';
import { VoiceService } from './services/voice.service';
import { AnimationService } from 'css-animator';
import { BrewTimerService } from './services/brewtimer.service';

import { BrewingRouting } from './routes/app.routes';
import { routerTransition } from './animations/router.animations';
import 'hammerjs';

@NgModule({
  declarations: [
      HomeComponent,
      PageNotFoundComponent,
      NavigationComponent,
      BrewTimerComponent,
      TimeRowComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpModule,
      JsonpModule,
      MaterialModule,
      FlexLayoutModule,
      BrewingRouting,
      //NgGridModule,
      NgbModule.forRoot(),
      LocalStorageModule.withConfig({
          prefix: 'brew-tools',
          storageType: 'localStorage'
      }),
      MomentModule
  ],
  providers: [WindowRef, AnimationService, VoiceService, BrewTimerService],
  bootstrap: [HomeComponent]
})
export class AppModule { }
