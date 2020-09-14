import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../resources/resource.service';
import { Observable } from 'rxjs';
import { Resource } from '../../interface';
import { take } from 'rxjs/operators';
import { GameFlagsService } from '../../game-flags/game-flags.service';
import { Task } from '../../resources/interface';
import { RootService } from '../../root.service';

@Component({
  selector: 'actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService,
    private gameFlagsService: GameFlagsService,
    private rootService: RootService
  ) {}

  gameProgress$: Observable<number>;
  resources$: Observable<Map<string, Map<string, Resource>>>;

  ngOnInit(): void {
    this.gameProgress$ = this.gameFlagsService.initialStage$;
    this.resources$ = this.resourcesService.resources$;
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

  // pickTrash(): void {
  //   this.resourcesService.pickTrash();
  // }

  changeTask(task: Task) {
    this.rootService.setTask(task);
  }

  public get Task() {
    return Task;
  }

}
