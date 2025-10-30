import { RouterLink, Routes } from '@angular/router';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'movie/:id', component: MovieDetailsComponent }
];
