import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, RouterOutlet } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  selector: 'app-root',
  template: `
    <main class="container" [ngClass]="{ 'dark-mode': isDarkMode }">
      <h1>Movie App</h1>
      <button (click)="toggleDarkMode()" class="dark-mode-toggle">
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isDarkMode = false;

  constructor(
    private router: Router,
    private darkModeService: DarkModeService
  ) {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    this.applyDarkMode();

    // Optional: Debug router events
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started');
      }
      if (event instanceof NavigationEnd) {
        console.log('Navigation ended');
      }
      if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
      }
    });
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    this.applyDarkMode();
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}