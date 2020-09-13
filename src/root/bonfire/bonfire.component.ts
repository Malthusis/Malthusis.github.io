import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
  }

}
