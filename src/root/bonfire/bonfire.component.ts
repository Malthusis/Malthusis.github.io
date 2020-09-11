import { Component, OnInit } from '@angular/core';
import { Resource } from '../interface';
import { Observable } from 'rxjs';
import { ResourceService } from '../resources/resource.service';

@Component({
  selector: 'bonfire',
  templateUrl: './bonfire.component.html',
  styleUrls: ['./bonfire.component.scss']
})
export class BonfireComponent implements OnInit {

  constructor(
    private resourcesService: ResourceService
  ) {}

  private trashArray$: Observable<Map<string, Resource[]>>;

  ngOnInit(): void {
  }

}
