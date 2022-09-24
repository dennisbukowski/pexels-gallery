import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserPreferences } from '../models/user-preferences';
import { UserThemes } from '../models/user-themes';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  activeTheme: string;
  nextTheme: string;
  userThemes: UserThemes = {
    'light-theme': {
      name: 'Light Theme'
    },
    'dark-theme': {
      name: 'Dark Theme'
    }
  };

  themeSubject$: ReplaySubject<UserPreferences> = new ReplaySubject<UserPreferences>();
  userPrefs$: Observable<UserPreferences> = this.themeSubject$.asObservable();

  constructor() { }

  setActiveTheme(changedTheme: string): void {
    for (const [index, iterator] of Object.entries(this.userThemes)) {
      if (changedTheme === index) {
        this.activeTheme = iterator.name;
      } else {
        this.nextTheme = iterator.name;
      }
    }
  }
}
