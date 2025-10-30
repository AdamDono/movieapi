import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  addedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly STORAGE_KEY = 'movieBuddyWatchlist';
  private watchlistSubject!: BehaviorSubject<WatchlistMovie[]>;
  
  watchlist$!: Observable<WatchlistMovie[]>;

  constructor() {
    this.watchlistSubject = new BehaviorSubject<WatchlistMovie[]>(this.loadWatchlist());
    this.watchlist$ = this.watchlistSubject.asObservable();
  }

  private loadWatchlist(): WatchlistMovie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  }

  private saveWatchlist(watchlist: WatchlistMovie[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist));
      this.watchlistSubject.next(watchlist);
      console.log('✅ Watchlist saved successfully:', watchlist.length, 'movies');
    } catch (error) {
      console.error('❌ Error saving watchlist:', error);
      console.warn('⚠️ LocalStorage might be disabled. Watchlist will only work during this session.');
      // Still update the subject so it works in memory
      this.watchlistSubject.next(watchlist);
    }
  }

  getWatchlist(): WatchlistMovie[] {
    return this.watchlistSubject.value;
  }

  addToWatchlist(movie: WatchlistMovie): void {
    const currentWatchlist = this.getWatchlist();
    
    // Check if movie already exists
    if (!this.isInWatchlist(movie.id)) {
      const movieWithTimestamp = {
        ...movie,
        addedAt: Date.now()
      };
      const updatedWatchlist = [movieWithTimestamp, ...currentWatchlist];
      this.saveWatchlist(updatedWatchlist);
    }
  }

  removeFromWatchlist(movieId: number): void {
    const currentWatchlist = this.getWatchlist();
    const updatedWatchlist = currentWatchlist.filter(m => m.id !== movieId);
    this.saveWatchlist(updatedWatchlist);
  }

  isInWatchlist(movieId: number): boolean {
    return this.getWatchlist().some(m => m.id === movieId);
  }

  toggleWatchlist(movie: WatchlistMovie): void {
    console.log('🔄 Toggling watchlist for movie:', movie.title, 'ID:', movie.id);
    console.log('📊 Current watchlist before toggle:', this.getWatchlist());
    
    if (this.isInWatchlist(movie.id)) {
      console.log('➖ Removing from watchlist');
      this.removeFromWatchlist(movie.id);
    } else {
      console.log('➕ Adding to watchlist');
      this.addToWatchlist(movie);
    }
    
    console.log('📊 Current watchlist after toggle:', this.getWatchlist());
  }

  clearWatchlist(): void {
    this.saveWatchlist([]);
  }

  getWatchlistCount(): number {
    return this.getWatchlist().length;
  }
}
