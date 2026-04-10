import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'qa-home-root',
  standalone: true,
  imports: [HomeComponent],
  template: '<qa-home />',
})
export class AppComponent {}
