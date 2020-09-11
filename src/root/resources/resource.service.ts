import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { RootService } from '../root.service';
import { Resource } from '../interface';

export enum TYPES {
  TRASH = 'Trash',
  REFINED = 'Refined Goods',
  BASIC = ''
}

export enum TRASH {
  RUBBISH = 0,
  KINDLING = 1,
  SCRAP = 2,
  PLASTIC = 3,
  ELECTRONIC = 4,
  MEDICAL = 5
}

export enum REFINED {
  PCHUNK = 0,
}

const TRASH_LENGTH = 6;

@Injectable()
export class ResourceService {

  private resourceGenTicks$: Observable<any>;
  private resources$$: BehaviorSubject<Map<string, Map<string, Resource>>>;
  private heatTick = 0;
  // private heatWatcher$$: BehaviorSubject<boolean>;

  constructor(
    private rootService: RootService
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

    this.rootService.resourceGenTick$.pipe(
      withLatestFrom(this.resources$$.asObservable())
    ).subscribe(
      ([_, resourceMap]) => {
        // TODO: FIX
        // Gather Trash
        // const trashArray = resourceMap.get(TYPES.TRASH);
        // const garbagePick = this.randomIntFromInterval(0, TRASH_LENGTH - 1);
        // this.changeResource(1, trashArray.get(garbagePick));

        // Heat Decay
        this.heatTick++;
        const statsArray = resourceMap.get(TYPES.BASIC);
        if (this.heatTick >= 10) {
          this.changeResource(-1, statsArray.get('HEAT'));
          this.heatTick = 0;
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
