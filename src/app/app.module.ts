import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NearbyAsteroidsComponent } from './nearby-asteroids/nearby-asteroids.component';

@NgModule({
  declarations: [
    AppComponent,
    NearbyAsteroidsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
