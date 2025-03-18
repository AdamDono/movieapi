import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <main class="container">
      <h1>Movie App</h1>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  constructor(private router: Router) {

  ;
  }
}