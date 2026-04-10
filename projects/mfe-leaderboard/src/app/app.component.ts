import { Component } from '@angular/core';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@Component({
  selector: 'qa-lb-root',
  standalone: true,
  imports: [LeaderboardComponent],
  template: '<qa-leaderboard />',
})
export class AppComponent {}
