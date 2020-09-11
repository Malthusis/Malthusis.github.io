import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class RootService {

  private resourceGenTicks$: Observable<any>;
  private resourceGenOn$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.resourceGenTicks$ = interval(1000);
  }

  get resourceGenTick$(): Observable<any> {
    return combineLatest(this.resourceGenTicks$,
      this.resourceGenOn$$.asObservable()).pipe(
        filter( ([tick, on]) => on),
        map(([tick, _]) => tick)
    );
  }
}
