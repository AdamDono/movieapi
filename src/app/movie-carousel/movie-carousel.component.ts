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
  scrollPosition = 0;

  next() {
    const container = document.querySelector('.carousel-track') as HTMLElement;
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  prev() {
    const container = document.querySelector('.carousel-track') as HTMLElement;
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }
}