import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistService, WatchlistMovie } from '../services/watchlist.service';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist: WatchlistMovie[] = [];
  isDarkMode = false;

  constructor(
    private watchlistService: WatchlistService,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    this.loadWatchlist();
    
    // Subscribe to watchlist changes
    this.watchlistService.watchlist$.subscribe(watchlist => {
      this.watchlist = watchlist;
    });
  }

  loadWatchlist(): void {
    this.watchlist = this.watchlistService.getWatchlist();
  }

  removeFromWatchlist(movieId: number): void {
    this.watchlistService.removeFromWatchlist(movieId);
  }

  clearWatchlist(): void {
    if (confirm('Are you sure you want to clear your entire watchlist?')) {
      this.watchlistService.clearWatchlist();
    }
  }
}
