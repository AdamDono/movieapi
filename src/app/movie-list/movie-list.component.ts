import { Component, OnInit } from '@angular/core';
import { MovieService, Movie, Genre } from '../services/movie.service';
import { WatchlistService } from '../services/watchlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';
import { DarkModeService } from '../services/dark-mode.service';


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
  currentPage = 1;
  totalPages = 1;
  isDarkMode = false;
  
  // Advanced Filters
  sortBy: string = 'popularity.desc';
  minRating: number = 0;
  selectedYear: string = '';
  selectedCountry: string = '';
  showAdvancedFilters = false;

  countries = [
    { code: '', name: 'All Countries' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'IN', name: 'India' },
    { code: 'KR', name: 'South Korea' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'EG', name: 'Egypt' },
    { code: 'RU', name: 'Russia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TH', name: 'Thailand' }
  ];

  constructor(
    private movieService: MovieService,
    private darkModeService: DarkModeService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled(); // Initialize dark mode state
    this.loadPopularMovies();
    this.loadTrendingMovies();
    this.loadGenres();





    
  }


  
  loadPopularMovies(): void {
    this.isLoading = true;
    this.movieService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        this.movies = [...this.movies, ...response.results]; // Append new movies
        this.totalPages = response.total_pages; // Set totalPages from the API response
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load movies';
        this.isLoading = false;
        this.movies = [];
      }
    });
  }

  loadMore(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPopularMovies();
    }
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

  loadGenres(): void {
    this.movieService.getGenres().subscribe({
      next: (response) => {
        this.genres = response.genres;
      },
      error: (err) => {
        console.error('Failed to load genres:', err);
      }
    });
  }

  searchMovies(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.movieService.searchMovies(this.searchQuery.trim()).subscribe({
        next: (response) => {
          this.movies = response.results;
          this.isLoading = false;
        },
        error: (err) => {
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

    this.currentPage = 1; // Reset to the first page
    this.movies = []; // Clear the existing movies

    if (this.selectedGenres.length > 0) {
      this.movieService.getMoviesByGenres(this.selectedGenres, this.currentPage).subscribe({
        next: (response) => {
          this.movies = response.results;
          this.totalPages = response.total_pages; // Set totalPages from the API response
        }
      });
    } else {
      this.loadPopularMovies();
    }
  }

  get filteredMovies(): Movie[] {
    let filtered = this.selectedGenres.length === 0
      ? this.movies
      : this.movies.filter(m => 
          m.genre_ids && this.selectedGenres.every(g => m.genre_ids.includes(g))
        );
    
    // Apply rating filter
    if (this.minRating > 0) {
      filtered = filtered.filter(m => m.vote_average >= this.minRating);
    }
    
    // Apply year filter
    if (this.selectedYear) {
      filtered = filtered.filter(m => 
        m.release_date && m.release_date.startsWith(this.selectedYear)
      );
    }
    
    // Apply sorting
    return this.sortMovies(filtered);
  }

  sortMovies(movies: Movie[]): Movie[] {
    const sorted = [...movies];
    
    switch (this.sortBy) {
      case 'rating.desc':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case 'rating.asc':
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case 'release.desc':
        return sorted.sort((a, b) => 
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
      case 'release.asc':
        return sorted.sort((a, b) => 
          new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );
      case 'title.asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title.desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }

  applyFilters(): void {
    // If country filter is selected, use discover API
    if (this.selectedCountry || this.selectedYear || this.minRating > 0) {
      this.loadMoviesWithFilters();
    } else {
      // Just trigger re-render for sorting
      this.movies = [...this.movies];
    }
  }

  loadMoviesWithFilters(): void {
    this.isLoading = true;
    
    const params: any = {
      page: 1,
      sort_by: this.sortBy
    };

    if (this.selectedCountry) {
      params.with_origin_country = this.selectedCountry;
    }

    if (this.selectedYear) {
      params.primary_release_year = this.selectedYear;
    }

    if (this.minRating > 0) {
      params['vote_average.gte'] = this.minRating;
    }

    if (this.selectedGenres.length > 0) {
      params.with_genres = this.selectedGenres.join(',');
    }

    this.movieService.discoverMovies(params).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading filtered movies:', err);
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.sortBy = 'popularity.desc';
    this.minRating = 0;
    this.selectedYear = '';
    this.selectedCountry = '';
    this.selectedGenres = [];
    this.currentPage = 1;
    this.movies = [];
    this.loadPopularMovies();
  }

  isInWatchlist(movieId: number): boolean {
    return this.watchlistService.isInWatchlist(movieId);
  }

  toggleWatchlist(event: Event, movie: Movie): void {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🎬 Toggle watchlist clicked for:', movie.title);
    
    this.watchlistService.toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: Date.now()
    });
    
    console.log('📋 Current watchlist:', this.watchlistService.getWatchlist());
    console.log('❤️ Is in watchlist now?', this.isInWatchlist(movie.id));
  }
}

