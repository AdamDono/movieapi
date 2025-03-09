import { Component, inject } from '@angular/core';
import { MovieService, Movie } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-movie-list',
  template: `

  `,
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  private movieService = inject(MovieService);
  movies: Movie[] = [];

  ngOnInit() {
    this.loadPopularMovies();
  }

  loadPopularMovies() {
    this.movieService.getPopularMovies().subscribe((response) => {
      this.movies = response.results;
    });
  }

// Update the searchMovies method:
searchMovies(event: Event) {
  const query = (event.target as HTMLInputElement).value; // Type-safe here
  if (query) {
    this.movieService.searchMovies(query).subscribe((response) => {
      this.movies = response.results;
    });
  } else {
    this.loadPopularMovies();
  }
}
}