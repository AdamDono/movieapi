import { Component, OnInit } from '@angular/core';
import { MovieService, MovieDetails } from '../services/movie.service';
import { WatchlistService } from '../services/watchlist.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../services/dark-mode.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CommonModule],
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
  streamingOptions: any[] = [];
  ageRating: string = '';
  collectionMovies: any[] = [];
  reviews: any[] = [];
  showAllReviews = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private darkModeService: DarkModeService,
    private sanitizer: DomSanitizer,
    private watchlistService: WatchlistService
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

        // Fetch age rating/certification
        this.movieService.getMovieReleaseDates(movieId).subscribe({
          next: (response: any) => {
            // Get US certification (or fallback to first available)
            const usRelease = response.results.find((r: any) => r.iso_3166_1 === 'US');
            if (usRelease && usRelease.release_dates.length > 0) {
              const certification = usRelease.release_dates.find((rd: any) => rd.certification);
              this.ageRating = certification?.certification || 'Not Rated';
            } else if (response.results.length > 0) {
              const firstRelease = response.results[0];
              const certification = firstRelease.release_dates.find((rd: any) => rd.certification);
              this.ageRating = certification?.certification || 'Not Rated';
            }
          },
          error: (err: any) => {
            console.error('Failed to fetch age rating:', err);
          }
        });

        // Fetch collection if movie belongs to one
        if (movie.belongs_to_collection) {
          this.movieService.getCollectionDetails(movie.belongs_to_collection.id).subscribe({
            next: (collection: any) => {
              this.collectionMovies = collection.parts.sort((a: any, b: any) => 
                new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
              );
            },
            error: (err: any) => {
              console.error('Failed to fetch collection:', err);
            }
          });
        }

        // Fetch reviews
        this.movieService.getMovieReviews(movieId).subscribe({
          next: (response: any) => {
            this.reviews = response.results;
            console.log('Reviews loaded:', this.reviews.length);
          },
          error: (err: any) => {
            console.error('Failed to fetch reviews:', err);
          }
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load movie details';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router?.navigate(['/']);
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'N/A';
    // Convert USD to ZAR (approximate exchange rate: 1 USD = 18.5 ZAR)
    const amountInZAR = amount * 18.5;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amountInZAR);
  }

  // Navigate to collection movie and reload the page
  navigateToMovie(movieId: number): void {
    this.router.navigate(['/movie', movieId]).then(() => {
      window.location.reload();
    });
  }

  isInWatchlist(): boolean {
    return this.movie ? this.watchlistService.isInWatchlist(this.movie.id) : false;
  }

  toggleWatchlist(): void {
    if (this.movie) {
      this.watchlistService.toggleWatchlist({
        id: this.movie.id,
        title: this.movie.title,
        poster_path: this.movie.poster_path,
        release_date: this.movie.release_date,
        vote_average: this.movie.vote_average,
        addedAt: Date.now()
      });
    }
  }

  get displayedReviews() {
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, 3);
  }

  truncateReview(content: string, maxLength: number = 400): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  getAvatarUrl(avatarPath: string): string {
    if (!avatarPath) return 'https://via.placeholder.com/50';
    if (avatarPath.startsWith('/https')) {
      return avatarPath.substring(1);
    }
    return `https://image.tmdb.org/t/p/w200${avatarPath}`;
  }
}
