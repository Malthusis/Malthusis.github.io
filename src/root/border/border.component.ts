import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../resources/resource.service';

@Component({
  selector: 'border',
  templateUrl: './border.component.html',
  styleUrls: ['./border.component.scss']
})
export class BorderComponent {

  constructor(
    private resourcesService: ResourceService
  ) {}
}
