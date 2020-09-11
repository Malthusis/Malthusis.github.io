import { Component, OnInit } from '@angular/core';
import { Resource } from '../interface';
import { ResourceService } from './resource.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService
  ) {}

  resources$: Observable<Map<string, Map<string, Resource>>>;

  ngOnInit(): void {
    this.resources$ = this.resourcesService.resources$;
  }

}
