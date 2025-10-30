# Watchlist Feature Troubleshooting

## Issue: "Add to Watchlist" not working

### Possible Causes & Solutions:

#### 1. **Server Not Running**
**Solution:**
```bash
cd /Users/dam1mac89/Desktop/movie/movieapi
npm start
```
Wait for the message: "Application bundle generation complete"
Then navigate to: http://localhost:4200/

#### 2. **Browser Console Errors**
**Check:**
- Open browser DevTools (F12 or Cmd+Option+I)
- Go to Console tab
- Look for any red error messages
- Common errors:
  - "Cannot find module" - Missing import
  - "is not a function" - Method not defined
  - "undefined" - Service not injected

#### 3. **LocalStorage Disabled**
**Check:**
- Open DevTools → Application tab → Local Storage
- Verify localStorage is enabled
- Try: `localStorage.setItem('test', 'value')` in console
- If error, localStorage is blocked

#### 4. **Click Event Not Firing**
**Debug:**
Add console.log to verify method is called:

In `movie-list.component.ts`:
```typescript
toggleWatchlist(event: Event, movie: Movie): void {
  console.log('Toggle watchlist clicked!', movie.title);
  event.preventDefault();
  event.stopPropagation();
  
  this.watchlistService.toggleWatchlist({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    addedAt: Date.now()
  });
  console.log('Watchlist after toggle:', this.watchlistService.getWatchlist());
}
```

#### 5. **Service Not Injected Properly**
**Verify** in `movie-list.component.ts`:
```typescript
constructor(
  private movieService: MovieService,
  private darkModeService: DarkModeService,
  private watchlistService: WatchlistService  // ← Must be here
) {}
```

#### 6. **Module Import Issues**
**Check** that these files exist:
- ✅ `/src/app/services/watchlist.service.ts`
- ✅ `/src/app/watchlist/watchlist.component.ts`
- ✅ `/src/app/watchlist/watchlist.component.html`
- ✅ `/src/app/watchlist/watchlist.component.css`

#### 7. **Route Not Configured**
**Verify** in `app.routes.ts`:
```typescript
import { WatchlistComponent } from './watchlist/watchlist.component';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'watchlist', component: WatchlistComponent },  // ← Must be here
  { path: 'movie/:id', component: MovieDetailsComponent }
];
```

### Manual Testing Steps:

1. **Test Service Directly (Browser Console):**
```javascript
// After page loads, in browser console:
const service = document.querySelector('app-root').__ngContext__[8].injector.get('WatchlistService');
console.log('Current watchlist:', service.getWatchlist());
```

2. **Test LocalStorage:**
```javascript
// In browser console:
localStorage.setItem('movieBuddyWatchlist', JSON.stringify([
  {id: 1, title: 'Test Movie', poster_path: '/test.jpg', release_date: '2024-01-01', vote_average: 8.5, addedAt: Date.now()}
]));
// Refresh page - should see "My Watchlist (1)" in header
```

3. **Clear LocalStorage:**
```javascript
localStorage.removeItem('movieBuddyWatchlist');
// Refresh page
```

### Quick Fix Checklist:

- [ ] Server is running (`npm start`)
- [ ] No console errors in browser DevTools
- [ ] LocalStorage is enabled
- [ ] All files created successfully
- [ ] WatchlistService imported in components
- [ ] Route configured in app.routes.ts
- [ ] Browser cache cleared (Cmd+Shift+R / Ctrl+Shift+R)

### If Still Not Working:

1. **Hard Refresh:**
   - Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Clear browser cache completely

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Click heart icon
   - Look for any failed requests

4. **Verify Button Exists:**
   - Right-click heart icon → Inspect Element
   - Verify it has class="watchlist-btn"
   - Verify (click) event is bound

### Expected Behavior:

✅ **When clicking white heart (🤍):**
- Heart turns red (❤️)
- Header count increases
- Console shows: "Toggle watchlist clicked!"
- LocalStorage updated

✅ **When clicking red heart (❤️):**
- Heart turns white (🤍)
- Header count decreases
- Movie removed from watchlist

✅ **When navigating to /watchlist:**
- Shows all saved movies
- Can remove movies
- Empty state if no movies

### Still Having Issues?

Share:
1. Browser console errors (screenshot)
2. Network tab errors
3. Terminal output from `npm start`
4. Browser and version
