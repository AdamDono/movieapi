import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Import provideRouter
import { routes } from './app.routes'; // Import your routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Enables HTTP
    provideRouter(routes), // Enables routing
  ],
};