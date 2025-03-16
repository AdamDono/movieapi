import { Component, Input } from '@angular/core';
import { Movie } from '../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-movie-carousel',
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.css']
})
export class MovieCarouselComponent {
  @Input() movies: Movie[] = [];
  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length;
  }
}