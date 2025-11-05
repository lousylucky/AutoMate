import { Routes } from '@angular/router';
import { MusicComponent } from './music/music.component';
import { NavigationComponent } from './navigation/navigation.component';

export const routes: Routes = [
  { path: 'music', component: MusicComponent },
  { path: 'navigation', component: NavigationComponent },

  // default 
  { path: '', redirectTo: 'music', pathMatch: 'full' },
  { path: '**', redirectTo: 'music' }
];