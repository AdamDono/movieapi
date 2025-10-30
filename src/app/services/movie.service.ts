import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language?: string;
  origin_country?: string[];
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  belongs_to_collection?: MovieCollection;
}

export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface ContentRating {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    type: number;
  }[];
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

  // Get popular movies with pagination
  getPopularMovies(page: number = 1) {
    return this.http.get<{ results: Movie[], total_pages: number }>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`
    );
  }

  // Search movies
  searchMovies(query: string) {
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`
    );
  }
  getStreamingOptions(movieId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${movieId}/watch/providers?api_key=${this.apiKey}`
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

  // Get movie videos (including trailers)
  getMovieVideos(movieId: number) {
    return this.http.get<{ results: { key: string, type: string }[] }>(
      `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}`
    );
  }

  // Get movies by genres with pagination
  getMoviesByGenres(genreIds: number[], page: number = 1) {
    return this.http.get<{ results: Movie[], total_pages: number }>(
      `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreIds.join(',')}&page=${page}`
    );
  }

  // Get movie release dates (includes age ratings/certifications)
  getMovieReleaseDates(movieId: number) {
    return this.http.get<{ results: ContentRating[] }>(
      `${this.baseUrl}/movie/${movieId}/release_dates?api_key=${this.apiKey}`
    );
  }

  // Get collection details
  getCollectionDetails(collectionId: number) {
    return this.http.get<{ 
      id: number;
      name: string;
      overview: string;
      poster_path: string;
      backdrop_path: string;
      parts: Movie[];
    }>(
      `${this.baseUrl}/collection/${collectionId}?api_key=${this.apiKey}`
    );
  }

  // Get movie reviews
  getMovieReviews(movieId: number, page: number = 1) {
    return this.http.get<{ 
      results: {
        id: string;
        author: string;
        author_details: {
          name: string;
          username: string;
          avatar_path: string;
          rating: number;
        };
        content: string;
        created_at: string;
        updated_at: string;
      }[];
      page: number;
      total_pages: number;
      total_results: number;
    }>(
      `${this.baseUrl}/movie/${movieId}/reviews?api_key=${this.apiKey}&page=${page}`
    );
  }

  // Discover movies with filters
  discoverMovies(params: {
    page?: number;
    with_origin_country?: string;
    primary_release_year?: string;
    'vote_average.gte'?: number;
    with_genres?: string;
    sort_by?: string;
  }) {
    let queryParams = `api_key=${this.apiKey}`;
    
    if (params.page) queryParams += `&page=${params.page}`;
    if (params.with_origin_country) queryParams += `&with_origin_country=${params.with_origin_country}`;
    if (params.primary_release_year) queryParams += `&primary_release_year=${params.primary_release_year}`;
    if (params['vote_average.gte']) queryParams += `&vote_average.gte=${params['vote_average.gte']}`;
    if (params.with_genres) queryParams += `&with_genres=${params.with_genres}`;
    if (params.sort_by) queryParams += `&sort_by=${params.sort_by}`;

    return this.http.get<{ results: Movie[]; page: number; total_pages: number; total_results: number }>(
      `${this.baseUrl}/discover/movie?${queryParams}`
    );
  }
}