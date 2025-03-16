import { Component, OnInit } from '@angular/core';
import { MovieService, Movie, Genre } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MovieCarouselComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  trendingMovies: Movie[] = [];
  searchQuery = '';
  isLoading = false;
  errorMessage = '';
  genres: Genre[] = [];
  selectedGenres: number[] = [];
  showGenreFilter = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadPopularMovies();
    this.loadTrendingMovies();
    this.loadGenres();
  }

  loadPopularMovies(): void {
    this.isLoading = true;
    this.movieService.getPopularMovies().subscribe({
      next: (response: { results: Movie[] }) => {
        this.movies = response.results;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load movies';
        this.isLoading = false;
        this.movies = [];
      }
    });
  }

  loadTrendingMovies(): void {
    this.movieService.getTrendingMovies().subscribe({
      next: (response: { results: Movie[] }) => {
        this.trendingMovies = response.results.slice(0, 10);
      },
      error: (err: any) => {
        console.error('Failed to load trending movies:', err);
      }
    });
  }

  loadGenres(): void {
    this.movieService.getGenres().subscribe({
      next: (response: { genres: Genre[] }) => {
        this.genres = response.genres;
      },
      error: (err: any) => {
        console.error('Failed to load genres:', err);
      }
    });
  }

  searchMovies(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.movieService.searchMovies(this.searchQuery.trim()).subscribe({
        next: (response: { results: Movie[] }) => {
          this.movies = response.results;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Search failed';
          this.isLoading = false;
          this.movies = [];
        }
      });
    } else {
      this.loadPopularMovies();
    }
  }

  toggleGenre(genreId: number): void {
    const index = this.selectedGenres.indexOf(genreId);
    index === -1 
      ? this.selectedGenres.push(genreId)
      : this.selectedGenres.splice(index, 1);
    
    if (this.selectedGenres.length > 0) {
      this.movieService.getMoviesByGenres(this.selectedGenres).subscribe({
        next: (response: { results: Movie[] }) => this.movies = response.results
      });
    } else {
      this.loadPopularMovies();
    }
  }

  get filteredMovies(): Movie[] {
    return this.selectedGenres.length === 0
      ? this.movies
      : this.movies.filter(m => 
          m.genre_ids && this.selectedGenres.every(g => m.genre_ids.includes(g))
        );
  }
}