import { Component, OnInit } from '@angular/core';
import { MovieService, MovieDetails } from '../services/movie.service';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router import
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';

import { DarkModeService } from '../services/dark-mode.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Add this import

@Component({
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie?: MovieDetails;
  isLoading = true;
  errorMessage = '';
  trailerKey: string | null = null;
  safeTrailerUrl: SafeResourceUrl | null = null;
  isDarkMode = false;
  streamingOptions: any[] = []; // Add this line

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router, // Add Router
    private darkModeService: DarkModeService,
    private sanitizer: DomSanitizer // Add this line
  ) {}

  ngOnInit() {
    const movieId = this.route.snapshot.params['id'];
    this.movieService.getMovieDetails(movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.isLoading = false;

        // Fetch movie videos (trailers)
        this.movieService.getMovieVideos(movieId).subscribe({
          next: (videos: any) => {
            console.log('Videos API Response:', videos);
            const trailer = videos.results.find((video: any) => video.type === 'Trailer');
            if (trailer) {
              this.trailerKey = trailer.key;
              console.log('Trailer Key:', this.trailerKey);

              // Sanitize the trailer URL
              this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube.com/embed/${this.trailerKey}`
              );
            } else {
              console.log('No trailer found for this movie.');
            }
          },
          error: (err: any) => {
            console.error('Failed to fetch trailers:', err);
          }
        });

        // Fetch streaming options
        this.movieService.getStreamingOptions(movieId).subscribe({
          next: (providers: any) => {
            this.streamingOptions = providers?.flatrate || [];
          },
          error: (err: any) => {
            console.error('Failed to fetch streaming options:', err);
          }
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load movie details';
        this.isLoading = false;
      }
    });
  }

  // Add this method
  goBack() {
    this.router?.navigate(['/']); // Ensure router is defined before navigating
  }
}
