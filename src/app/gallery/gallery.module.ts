import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import { DirectivesModule } from '../directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GalleryComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    RouterModule
  ],
  exports: [
    GalleryComponent
  ]
})
export class GalleryModule { }
