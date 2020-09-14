import { Component, OnInit } from '@angular/core';
import { Resource } from '../interface';
import { ResourceService } from './resource.service';
import { Observable } from 'rxjs';
import { RootService } from '../root.service';
import { Task } from './interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService,
    private rootService: RootService
  ) {}

  resources$: Observable<Map<string, Map<string, Resource>>>;
  currentTask$: Observable<string>;

  ngOnInit(): void {
    this.resources$ = this.resourcesService.resources$;
    // TODO: Add translation keys.
    this.currentTask$ = this.rootService.currentTask$.pipe(
      map(task => {
        switch (task) {
          case Task.NOTHING:
            return ' doing nothing.';
          case Task.REST:
            return ' resting by the fire.';
          case Task.TEND_FIRE:
            return ' tending the fire.';
          case Task.PICK_TRASH:
            return ' picking through the mountains of trash.';
          default:
            return '';
        }
      })
    );
  }

}
