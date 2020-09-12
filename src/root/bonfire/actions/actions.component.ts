import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../resources/resource.service';
import { Observable } from 'rxjs';
import { Resource } from '../../interface';
import { map, take } from 'rxjs/operators';
import { GameFlagsService } from '../../game-flags/game-flags.service';
import { LoggerService } from '../../logger/logger.service';

@Component({
  selector: 'actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService,
    private gameFlagsService: GameFlagsService,
    private loggerService: LoggerService
  ) {}

  gameProgress$: Observable<number>;
  heat$: Observable<number>;

  ngOnInit(): void {
    this.gameProgress$ = this.gameFlagsService.initialStage$;
    this.heat$ = this.resourcesService.retreiveResource({category: '', id: 'HEAT'}).pipe(
      map( heat => heat.value));
  }

  kindleFire(): void {
    this.resourcesService.retreiveResource({category: '', id: 'HEAT'}).pipe(
      take(1)
    ).subscribe(heat => {
        this.resourcesService.changeResource(1, heat);
    });
  }

  warmByFire(): void {
    this.gameFlagsService.advanceToStage1();
  }

  pickTrash(): void {
    this.resourcesService.pickTrash();
  }

  save(): void {
    const resourcesJSON = this.resourcesService.save();
    const flagsJSON = this.gameFlagsService.save();
    const saveString = [['resources', resourcesJSON], ['flags', flagsJSON]];

    localStorage.setItem('save', JSON.stringify(saveString));
    this.loggerService.addMessage('Save successful!');
  }

  load(): void {
    const loadString = JSON.parse(localStorage.getItem('save'));
    const resources = loadString[0][1];
    const flags = loadString[1][1];

    this.resourcesService.load(resources);
    this.gameFlagsService.load(flags);
    this.loggerService.addMessage('Load successful!');
  }
}
