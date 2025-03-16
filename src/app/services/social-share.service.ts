// social-share.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SocialShareService {
  shareMovie(movie: any) {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: `${window.location.origin}/movie/${movie.id}`
      });
    } else {
      // Fallback for desktop
      const url = `${window.location.origin}/movie/${movie.id}`;
      window.open(`https://twitter.com/intent/tweet?text=Check out "${movie.title}"&url=${url}`, '_blank');
    }
  }

  shareOnTwitter(movie: any) {
    const text = `Check out "${movie.title}" 🎬`;
    const url = `${window.location.origin}/movie/${movie.id}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnFacebook(movie: any) {
    const url = `${window.location.origin}/movie/${movie.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  shareViaEmail(movie: any) {
    const subject = `Check out this movie: ${movie.title}`;
    const body = `${movie.overview}\n\nView more: ${window.location.origin}/movie/${movie.id}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}