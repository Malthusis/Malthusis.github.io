import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameFlagsService } from '../game-flags/game-flags.service';
import { ResourceService } from '../resources/resource.service';
import { LoggerService } from '../logger/logger.service';

@Component({
  selector: 'bonfire',
  templateUrl: './bonfire.component.html',
  styleUrls: ['./bonfire.component.scss']
})
export class BonfireComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService,
    private gameFlagsService: GameFlagsService,
    private loggerService: LoggerService
  ) {}

  gameProgress$: Observable<number>;

  ngOnInit(): void {
    this.gameProgress$ = this.gameFlagsService.initialStage$;
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
