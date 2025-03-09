import { Component } from '@angular/core';
import { MovieListComponent } from './movie-list/movie-list.component';

@Component({
  standalone: true,
  imports: [MovieListComponent],
  selector: 'app-root',
  template: `
    <main class="container">
      <h1>Movie App</h1>
      <app-movie-list></app-movie-list>
    </main>
  `,
})
export class AppComponent {}