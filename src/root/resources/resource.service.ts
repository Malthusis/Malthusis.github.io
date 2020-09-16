import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { RootService } from '../root.service';
import { Resource, ResourceRef } from '../interface';
import { LoggerService } from '../logger/logger.service';
import { Task, TRASH, TYPES } from './interface';

const TRASH_LENGTH = 6;

@Injectable()
export class ResourceService {

  private resourceGenTicks$: Observable<any>;
  private resources$$: BehaviorSubject<Map<string, Map<string, Resource>>>;
  // Maybe turn these two into BehaviorSubject
  private heatTick = 0;
  private taskTick = 0;

  // private heatWatcher$$: BehaviorSubject<boolean>;

  constructor(
    private rootService: RootService,
    private loggerService: LoggerService
  ) {
    const resources = new Map<string, Map<string, Resource>>();
    const basic = new Map<string, Resource>();
    basic.set('HEAT', {
      key: 'HEAT',
      value: 0,
      max: 50,
      cssStyle: 'heat',
      unlockedDefault: true
    });
    resources.set(TYPES.BASIC, basic);

    this.resources$$ = new BehaviorSubject<Map<string, Map<string, Resource>>>(resources);

    this.resourceGenTicks$ = this.rootService.resourceGenTick$;

    // Central game loop.
    this.rootService.resourceGenTick$.pipe(
      withLatestFrom(this.resources$$.asObservable(), this.rootService.currentTask$)
    ).subscribe(
      ([_, resourceMap, task]) => {
        const basicStats = resourceMap.get(TYPES.BASIC);
        const trashArray = resourceMap.get(TYPES.TRASH);

        // Heat Decay
        this.heatTick++;
        if (this.heatTick >= 8) {
          this.changeResource(-1, basicStats.get('HEAT'));
          this.heatTick = 0;
        }

        // Current Task Handling
        if (this.taskTick > 3) {
          switch (task) {
            case Task.TEND_FIRE:
              this.changeResource(1, basicStats.get('HEAT'));
              break;
            case Task.REST:
              this.changeResource(2, basicStats.get('ENERGY'));
              break;
            case Task.PICK_TRASH:
              const garbagePick = TRASH[this.randomIntFromInterval(0, TRASH_LENGTH - 1)];
              this.changeResource(1, trashArray.get(garbagePick));
              break;
          }
          this.taskTick = 0;
        } else {
          this.taskTick++;
        }


      }
    );
  }

  get resources$(): Observable<Map<string, Map<string, Resource>>> {
    return this.resources$$.asObservable();
  }

  // STAGE 2
  advanceToStage2(): void {
    const trash = new Map<string, Resource>();
    const refined = new Map<string, Resource>();

    trash.set('RUBBISH', {
      key: 'RUBBISH',
      value: 0,
      max: 25,
      cssStyle: 'rubbish',
      unlockedDefault: true
    });
    trash.set('KINDLING', {
      key: 'KINDLING',
      value: 0,
      max: 25,
      cssStyle: 'kindling',
      unlockedDefault: true
    });
    trash.set('PLASTIC', {
      key: 'PLASTIC',
      value: 0,
      max: 25,
      cssStyle: 'plastic',
      unlockedDefault: true
    });
    trash.set('METAL', {
      key: 'METAL',
      value: 0,
      max: 25,
      cssStyle: 'metal',
      unlockedDefault: true
    });
    trash.set('PLASTIC', {
      key: 'PLASTIC',
      value: 0,
      max: 25,
      cssStyle: 'plastic',
      unlockedDefault: true
    });
    trash.set('ELECTRONIC', {
      key: 'ELECTRONIC',
      value: 0,
      max: 25,
      cssStyle: 'electronic',
      unlockedDefault: true
    });
    trash.set('MEDICAL', {
      key: 'MEDICAL',
      value: 0,
      max: 25,
      cssStyle: 'medical',
      unlockedDefault: true
    });

    refined.set('PCHUNK', {
      key: 'PCHUNK',
      value: 0,
      max: 50,
      cssStyle: 'pChunk',
      unlockedDefault: false
    });
    refined.set('SCRAP', {
      key: 'SCRAP',
      value: 0,
      max: 50,
      cssStyle: 'scrap',
      unlockedDefault: false
    });

    const resources = this.resources$$.getValue();
    resources.get(TYPES.BASIC).set('ENERGY', {
      key: 'ENERGY',
      value: 0,
      max: 50,
      cssStyle: 'energy',
      unlockedDefault: true
    });
    resources.set(TYPES.TRASH, trash);
    resources.set(TYPES.REFINED, refined);
  }


  pickTrash(): void {
    this.resources$.pipe(
      take(1)
    ).subscribe(resourceMap => {
        // Gather Trash
        const resources = resourceMap.get(TYPES.TRASH);
        const trashArray = Array.from(resources.keys());
        const garbagePick = this.randomIntFromInterval(0, TRASH_LENGTH - 1);
        this.changeResource(1, resources.get(trashArray[garbagePick]));
      }
    );
  }


  // SYSTEM
  retreiveResource(resource: ResourceRef): Observable<Resource> {
    return this.resources$$.asObservable().pipe(
      map( resources => {
        // TODO: Check for bad values.
        return resources.get(resource.category).get(resource.id);
        }
      )
    );
  }

  /**
   * Change a resource by a certain number. Return false if this cannot be done (less then 0 left).
   */
  changeResource(value: number, resource: Resource): boolean {
    if (value < 0) {
      if (resource.value + value < 0) {
        return false;
      }
      resource.value = resource.value + value;
    } else {
      resource.value + value > resource.max ? resource.value = resource.max : resource.value = resource.value + value;
    }
    return true;
  }

  transaction(costs: number[], costTypes: Resource[], bought: number, boughtType: Resource) {
    let transactionValid = true;
    if (costs.length !== costTypes.length) {
      return;
    }
    // Check if we have enough to pay, then complete transaction
    costs.forEach((cost, i) => {
      if (costTypes[i].value < cost) {
        transactionValid = false;
      }
    });

    if (transactionValid) {
      costs.forEach((cost, i) => {
          costTypes[i].value = costTypes[i].value - cost;
      });
      boughtType.value = boughtType.value + bought;
    } else {
      this.loggerService.addMessage('Not enough resources.');
    }
  }

  // TODO: Improve this later so we don't have to save all these unnecessary fields.
  save(): any[] {
    const resources = this.resources$$.getValue();
    console.log(resources);
    const iter = resources.keys();
    const jsonArray = [];
    for (const i of iter) {
      jsonArray.push([i, [...resources.get(i)]]);
    }
    return jsonArray;
  }

  load(resources: any[]): void {
    const resourcesMap = new Map<string, Map<string, Resource>>();
    for (const category of resources) {
      const categoryMap = new Map<string, Resource>();
      for (const resource of category[1]) {
        categoryMap.set(resource[0], resource[1] as Resource);
      }
      resourcesMap.set(category[0], categoryMap);
    }

    this.resources$$.next(resourcesMap);
  }

  private randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
