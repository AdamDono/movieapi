import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private isDarkMode = false;

  constructor(private cookieService: CookieService) {
    // Check for saved preference in cookies
    const savedMode = this.cookieService.get('darkMode');
    if (savedMode) {
      this.isDarkMode = savedMode === 'true';
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.cookieService.set('darkMode', this.isDarkMode.toString(), 365); // Save for 365 days
  }

  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }
}