import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  searchQuery = '';

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadPopularMovies();
  }

  loadPopularMovies() {
    this.movieService.getPopularMovies().subscribe({
      next: (response) => {
        console.log('Popular movies:', response.results);
        this.movies = response.results;
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.movies = [];
      }
    });
  }

// movie-list.component.ts
searchMovies() {
  if (this.searchQuery.trim()) {
    this.movieService.searchMovies(this.searchQuery.trim()).subscribe({
      next: (response) => {
        this.movies = response.results;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.movies = [];
      }
    });
  } else {
    this.loadPopularMovies();
  }
}
}