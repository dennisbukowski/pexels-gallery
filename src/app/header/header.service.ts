import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  private isScrollPausedBehaviorSub = new BehaviorSubject<boolean>(false);
  isScrollPaused: boolean = false;

  changeScrollStatus() {
      this.isScrollPaused = !this.isScrollPaused;
      this.isScrollPausedBehaviorSub.next(this.isScrollPaused);
  }

  changeScrollStatusObs(): Observable<boolean> {
    return this.isScrollPausedBehaviorSub.asObservable();
  }

}
