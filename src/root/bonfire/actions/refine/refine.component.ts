import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../resources/resource.service';
import { Observable } from 'rxjs';
import { Resource } from '../../../interface';


@Component({
  selector: 'refine',
  templateUrl: './refine.component.html',
  styleUrls: ['./refine.component.scss']
})
export class RefineComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService
  ) {}

  viewMode = 'tab1';

  private trashArray$: Observable<Map<string, Resource[]>>;

  ngOnInit(): void {
  }

}
