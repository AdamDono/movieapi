import { MovieCarouselComponent } from './../movie-carousel/movie-carousel.component';
import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MovieCarouselComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  searchQuery = '';
  isLoading = false;
  errorMessage = '';
  trendingMovies: Movie[] = []; // Properly declare the property here

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadPopularMovies();
    this.loadTrendingMovies(); // Add this method call
  }

  loadTrendingMovies(): void {
    this.movieService.getTrendingMovies().subscribe({
      next: (response) => {
        this.trendingMovies = response.results.slice(0, 10);
      },
      error: (err) => {
        console.error('Failed to load trending movies:', err);
      }
    });
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
}