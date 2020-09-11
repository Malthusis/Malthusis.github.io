import { Component, OnInit } from '@angular/core';
import { ResourceService, TYPES } from './resources/resource.service';
import { Observable } from 'rxjs';
import { Resource } from './interface';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  private fire$: Observable<number>;
  trashArray$: Observable<Map<string, Map<string, Resource>>>;

  constructor(
    private resourcesService: ResourceService,
    private translateService: TranslateService
  ) {
    // Set default language and force to English for now.
    translateService.setDefaultLang('en');
    translateService.use('en');
  }


  ngOnInit(): void {
    this.trashArray$ = this.resourcesService.resources$;
  //   this.fire$ = this.trashArray$.pipe(
  //     map(resources => {
  //       const fire = resources.get(TYPES.BASIC).get('HEAT').value;
  //       if (fire > 10) {
  //         console.log('embers!');
  //         return 'embers';
  //       }
  //       return 'no-fire';
  //       console.log(resources.get(TYPES.BASIC));
  //       // return resources.get(TYPES.BASIC).get('HEAT').value;
  //     })
  //   );
  }
}
