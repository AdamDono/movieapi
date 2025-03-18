import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';  // Adjust the path if needed
import { CommonModule } from '@angular/common';  // Import necessary common module

@Component({
  standalone: true,
  imports: [CommonModule],  // Ensure CommonModule is imported for *ngIf and other directives
  selector: 'app-theme-toggle',
  template: `
    <button (click)="toggleTheme()" class="theme-toggle">
      <ng-container *ngIf="theme.currentTheme === 'dark'; else lightTheme">
        🌙  <!-- Dark mode icon -->
      </ng-container>
      <ng-template #lightTheme>
        ☀️  <!-- Light mode icon -->
      </ng-template>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      padding: 0.5rem;
      color: var(--text-color);
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}

  toggleTheme() {
    this.theme.toggleTheme();
  }
}
