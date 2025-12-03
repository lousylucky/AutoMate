import { Routes } from '@angular/router';
import { PlayerComponent } from './music/music.component';
import { NavigationComponent } from './navigation/navigation.component';

export const routes: Routes = [
  { path: 'music', component: PlayerComponent },
  { path: 'navigation', component: NavigationComponent },

  // default 
  { path: '', redirectTo: 'music', pathMatch: 'full' },
  { path: '**', redirectTo: 'music' }
];