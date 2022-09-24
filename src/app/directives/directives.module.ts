import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebounceClickDirective } from './debounceClick.directive';
import { InfiniteScrollDirective } from './scrollable.directive';

@NgModule({
  declarations: [
    DebounceClickDirective,
    InfiniteScrollDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DebounceClickDirective,
    InfiniteScrollDirective
  ]
})
export class DirectivesModule { }
