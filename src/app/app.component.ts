import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, RouterOutlet, RouterLink } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { WatchlistService } from './services/watchlist.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  selector: 'app-root',
  template: `
    <main class="container" [ngClass]="{ 'dark-mode': isDarkMode }">
      <header class="app-header">
        <h1>Movie Buddy</h1>
        <nav class="app-nav">
          <a routerLink="/watchlist" class="watchlist-link">
            ❤️ My Watchlist ({{ watchlistCount }})
          </a>
          <button (click)="toggleDarkMode()" class="dark-mode-toggle">
            {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>
        </nav>
      </header>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isDarkMode = false;
  watchlistCount = 0;

  constructor(
    private router: Router,
    private darkModeService: DarkModeService,
    private watchlistService: WatchlistService
  ) {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    this.applyDarkMode();

    // Subscribe to watchlist changes
    this.watchlistService.watchlist$.subscribe(watchlist => {
      this.watchlistCount = watchlist.length;
    });

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