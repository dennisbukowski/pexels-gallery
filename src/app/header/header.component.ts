import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Util } from '../util/util';
import { ThemeService } from '../services/theme.service';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { debounce, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('fHeader') mainHeader: ElementRef;

  resizingId = false;
  scrollingId = false;
  previousTop = 0;
  currentTop = 0;
  scrollDelta = 10;
  scrollOffset = 150;

  searchForm: UntypedFormGroup;
  isFormSubmitted: boolean = false;
  isDefaultInputActive: boolean = true;

  queryParams$ = this.activatedRoute.queryParams.pipe(
    tap(data => {
      if (data.color) {
        this.searchForm.get('searchType')?.setValue('color');
        this.searchForm.get('searchStringHexColor')?.setValue(data.color);
      }
      if (data.query) {
        this.searchForm.get('searchStringDefault')?.patchValue(data.query);
      }
    })
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    private themeService: ThemeService,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchType: ['default', Validators.required],
      searchStringDefault: [{value: '', disabled: false}, Validators.required],
      searchStringHexColor: [{
          value: window.getComputedStyle(document.body).getPropertyValue('--color-primary-picker-rgb'),
          disabled: true
        }, Validators.required]
    });
    this.windowScroll();
    this.handleSearchFormTypeChange();
    this.queryParams$.subscribe();
  }

  get userPrefs() {
    return this.themeService.userPrefs$;
  }

  get isScrollPaused() {
    return this.headerService.isScrollPaused;
  }

  get nextTheme() {
    return this.themeService.nextTheme;
  }

  handleSearchFormTypeChange(): void {
    const searchType: AbstractControl | null = this.searchForm.get('searchType');
    const searchStringHexColor: AbstractControl | null = this.searchForm.get('searchStringHexColor');

    searchType?.valueChanges.subscribe((data: string) => {
      if (data === 'default') {
        searchStringHexColor?.disable();
        this.isDefaultInputActive = true;
      } else {
        searchStringHexColor?.enable();
        this.isDefaultInputActive = false;
      }
    });
  }

  handleThemeChange(selectedTheme: string | null): void {
    if (selectedTheme) {
      let theme = (selectedTheme === 'light-theme') ? 'dark-theme' : 'light-theme';
      this.themeService.themeSubject$.next({ theme });
      localStorage.setItem('theme', theme);
      this.themeService.setActiveTheme(theme);
    }
}

  onSubmit(): void {
      this.isFormSubmitted = true;

      if (this.searchForm.invalid) {
        return;
      }

      const searchType: string = this.searchForm.get('searchType')?.value;
      const searchStringDefault: string = this.searchForm.get('searchStringDefault')?.value;
      const searchStringHexColor: string = this.searchForm.get('searchStringHexColor')?.value;

      let query: string;
      let color: string;

      if (searchType === 'default') {
        query = this.sanitizeString(searchStringDefault);
        this.router.navigate([ 'search' ], { queryParams: { query } });

      } else if (searchType === 'color') {

        query = this.sanitizeString(searchStringDefault);
        color = searchStringHexColor;

        this.router.navigate(
          [ 'search' ],
          { queryParams: { query, color }}
        );
      } else {
        throw new Error('Unexpected form values returned');
      }
  }

  sanitizeString(value: string): string {
    value = value.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return value.trim();
}

  onReset(): void {
    this.isFormSubmitted = false;
    this.searchForm.reset();
  }

  windowScroll(): void {
    window.addEventListener('scroll', () => {
      if (this.scrollingId) {
        return;
      }
      this.scrollingId = true;
      window.requestAnimationFrame(()=>{})
        ? setTimeout(() => {
            this.autoHideHeader();
          }, 250)
        : window.requestAnimationFrame(() => {
            this.autoHideHeader();
          });
    });
  }

  autoHideHeader(): void {
    const currentTop = document.documentElement.scrollTop;
    this.checkSimpleNavigation(currentTop);
    this.previousTop = currentTop;
    this.scrollingId = false;
  }

  checkSimpleNavigation(currentTop: number): void {
    if (this.previousTop - currentTop > this.scrollDelta) {

      Util.removeClass(this.mainHeader, 'is-header-hidden');
    } else if (
      currentTop - this.previousTop > this.scrollDelta &&
      currentTop > this.scrollOffset
    ) {
      Util.addClass(this.mainHeader, 'is-header-hidden');
    }
  }

  handleClick(event: Event, headerEl: Element, headerNavEl: Element): void {
    event.preventDefault();
    const status = !Util.hasClass(event.target, 'anim-menu-btn--state-b');
    const headerStatus = !Util.hasClass(headerEl, 'f-header--expanded');
    const headerNavStatus = !Util.hasClass(
      headerNavEl,
      'f-header__nav--is-visible'
    );

    Util.toggleClass(event.target, 'anim-menu-btn--state-b', status);
    Util.toggleClass(headerEl, 'f-header--expanded', headerStatus);
    Util.toggleClass(
      headerNavEl,
      'f-header__nav--is-visible',
      headerNavStatus
    );
  }

  handleScrollStatus(): void {
    this.headerService.changeScrollStatus();
  }
}
