import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../resources/resource.service';
import { combineLatest, Observable } from 'rxjs';
import { GameFlagsService } from '../../../game-flags/game-flags.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'refine',
  templateUrl: './refine.component.html',
  styleUrls: ['./refine.component.scss']
})
export class RefineComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService,
    private gameFlagsService: GameFlagsService
  ) {}

  gameProgress$: Observable<number>;
  viewMode = 'tab1';

  ngOnInit(): void {
    this.gameProgress$ = this.gameFlagsService.initialStage$;
  }

  smeltMetal(): void {
    combineLatest(this.resourcesService.retreiveResource({category: 'Trash', id: 'METAL'}),
      this.resourcesService.retreiveResource({category: 'Refined', id: 'SCRAP'})).pipe(
      take(1),
    ).subscribe(([trash, metal]) => {
      this.resourcesService.transaction([5], [trash], 1, metal);
    });
  }
}
