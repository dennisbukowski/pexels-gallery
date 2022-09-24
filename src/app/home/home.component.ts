import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, scan, switchMap, takeWhile } from 'rxjs/operators';
import { PexelsService } from '../services/pexels.service';
import { HeaderService } from '../header/header.service';
import { PexelData } from '../models/pexel-data';
import { PexelPhoto } from '../models/pexel-photo';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  currentPage = Math.floor(Math.random() * 100) + 1;
  pauseInfiniteScrollSub: Subscription;
  isPauseScroll: boolean = false;
  subs: Subscription[] = [];

  pageNumberBehaviorSub = new BehaviorSubject<number>(this.currentPage);
  pageNumberObs$ = this.pageNumberBehaviorSub.asObservable();

  photoColumns$ = this.pageNumberObs$.pipe(
    switchMap((): Observable<PexelData> => this.pexelsService.getCuratedPhotos(this.currentPage)),
    map((data: PexelData) => {
      const perColumn = 10;
      const result: PexelPhoto[][] = data.photos.reduce((resultArray: PexelPhoto[][], photo: PexelPhoto, index: number) => {
        let isLoadingImage: boolean = true;
        let imageMap = [
          `${photo.src.medium} 320w`,
          `${photo.src.large} 480w`,
          `${photo.src.large2x} 800w`];
        let imageSize = [
          "(max-width: 320px) 280px",
          "(max-width: 480px) 440px",
          "800px"];

        let aspectRatioPadding = 100 * photo.height / photo.width;
        photo = {...photo, aspectRatioPadding, imageMap, imageSize, isLoadingImage};
          const chunkIndex = Math.floor(index / perColumn);
          if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
          }
          resultArray[chunkIndex].push(photo);
        return resultArray;
      }, []);
      return result;
    }),
    takeWhile((data) => !!data.length),
    scan((previousPhotos: PexelPhoto[][], currentPhotos: PexelPhoto[][]) => {
      // Handle photo colum sorting from what is available
      switch (currentPhotos.length) {
        case 3:
          return [
            [...previousPhotos[0], ...currentPhotos[0]],
            [...previousPhotos[1], ...currentPhotos[1]],
            [...previousPhotos[2], ...currentPhotos[2]]
          ];
        case 2:
          return [
            [...previousPhotos[0], ...currentPhotos[0]],
            [...previousPhotos[1], ...currentPhotos[1]],
            [...previousPhotos[2]]
          ];
        case 1:
          return [
            [...previousPhotos[0], ...currentPhotos[0]],
            [...previousPhotos[1]],
            [...previousPhotos[2]]
          ];
        default:
          return [
            [...previousPhotos[0]],
            [...previousPhotos[1]],
            [...previousPhotos[2]]
          ];
      }
    })
  );

  constructor(
    private pexelsService: PexelsService,
    private headerService: HeaderService
  ) {
    window.scrollTo(0, 0);
    this.subs.push(
      this.pauseInfiniteScrollSub = this.headerService.changeScrollStatusObs().subscribe((scrollStatus: boolean) => {
        this.isPauseScroll = scrollStatus;
      })
    );
  }

  ngOnInit(): void {
    this.resetScrollStatus();
  }

  resetScrollStatus(): void {
    if (this.isPauseScroll) {
      this.headerService.changeScrollStatus();
    }
  }

  onScroll(): void {
    this.currentPage += 1;
    this.pageNumberBehaviorSub.next(this.currentPage);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
