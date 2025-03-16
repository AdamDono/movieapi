
import { RouterLink, Routes } from '@angular/router';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieListComponent } from './movie-list/movie-list.component';

export const routes: Routes = [ { path: '', component: MovieListComponent },
    
    { path: 'movie/:id', component: MovieDetailsComponent }];
