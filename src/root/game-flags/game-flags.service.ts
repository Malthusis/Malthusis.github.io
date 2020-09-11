import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResourceService } from '../resources/resource.service';




@Injectable()
export class GameFlagsService {

  private initialStage$$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor(private resourcesService: ResourceService) {
  }

  get initialStage$(): Observable<number> {
    return this.initialStage$$.asObservable();
  }

  // warm self by fire
  advanceToStage1(): void {
    this.resourcesService.advanceToStage2();
    this.initialStage$$.next(2);
  }

  save(): any[] {
    return [this.initialStage$$.getValue()];
  }

  load(saved: any[]): void {
    this.initialStage$$.next(saved[0]);
  }
}
