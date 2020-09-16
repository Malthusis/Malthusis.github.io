import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Task } from './resources/interface';

@Injectable()
export class RootService {

  private resourceGenTicks$: Observable<any>;
  private resourceGenOn$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private currentTask$$: BehaviorSubject<Task> = new BehaviorSubject<Task>(Task.NOTHING);

  constructor() {
    this.resourceGenTicks$ = interval(500);
  }

  setTask(task: Task) {
    this.currentTask$$.next(task);
  }

  get resourceGenTick$(): Observable<any> {
    return combineLatest(this.resourceGenTicks$,
      this.resourceGenOn$$.asObservable()).pipe(
        filter( ([tick, on]) => on),
        map(([tick, _]) => tick)
    );
  }

  get currentTask$(): Observable<Task> {
    return this.currentTask$$.asObservable();
  }
}
