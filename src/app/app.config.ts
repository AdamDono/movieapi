import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Import provideRouter
import { routes } from './app.routes'; // Import your routes
import { CookieService } from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Enables HTTP
    provideRouter(routes), // Enables routing
    CookieService, // Add CookieService to providers
  ],
};