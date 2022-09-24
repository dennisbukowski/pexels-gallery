import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { UserPreferences } from './models/user-preferences';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  themeSubscription: Subscription;

  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.themeSubject$.subscribe((prefs: UserPreferences) => {
      if (prefs.theme) {
        this.renderer.setAttribute(document.body, 'data-theme', prefs.theme);
      }
    });
    this.checkStorage();
  }

  checkStorage() {
    if (!localStorage.getItem('theme')) {
      const preferredThemeValue = this.checkOSPreferredAppearance();
      this.themeService.themeSubject$.next({ theme: preferredThemeValue });
      localStorage.setItem('theme', preferredThemeValue);
      this.themeService.setActiveTheme(preferredThemeValue);
    } else {
      const localStorageTheme = localStorage.getItem('theme');
      if (localStorageTheme) {
        this.themeService.themeSubject$.next({ theme: localStorageTheme });
        this.themeService.setActiveTheme(localStorageTheme);
      }
    }
  }

  checkOSPreferredAppearance(): string {
    const isLightThemePreferred: boolean = window.matchMedia('(prefers-color-scheme: light)').matches;
    let preferredThemeValue: 'light-theme' | 'dark-theme';
    if (isLightThemePreferred) {
      preferredThemeValue = 'light-theme';
    } else {
      const isDarkThemePreferred = window.matchMedia('(prefers-color-scheme: dark)');
      if (isDarkThemePreferred) {
        preferredThemeValue = 'dark-theme';
      } else {
        preferredThemeValue = 'light-theme';
      }
    }
    return preferredThemeValue;
  }


  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
