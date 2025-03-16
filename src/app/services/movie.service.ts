import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[]; // Added for genre filtering
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Genre[]; // Changed to use Genre interface
}

export interface Genre {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private apiKey = environment.tmdbApiKey;
  private baseUrl = 'https://api.themoviedb.org/3';

  // Get popular movies
  getPopularMovies() {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`
    );
  }

  // Search movies
  searchMovies(query: string) {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`
    );
  }

  // Get trending movies
  getTrendingMovies() {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}`
    );
  }

  // Get movie details
  getMovieDetails(id: number) {
    return this.http.get<MovieDetails>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`
    );
  }

  // Get genre list
  getGenres() {
    return this.http.get<{ genres: Genre[] }>(
      `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`
    );
  }

  // Get movies by genres
  getMoviesByGenres(genreIds: number[]) {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreIds.join(',')}`
    );
  }
}