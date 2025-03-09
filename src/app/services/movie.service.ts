import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Define the Movie interface here (no extra file)
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiKey = environment.tmdbApiKey; // Uses environment
  private baseUrl = 'https://api.themoviedb.org/3';

  // Get popular movies


  getPopularMovies() {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Search movies
  searchMovies(query: string) {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`
    );
  }
}