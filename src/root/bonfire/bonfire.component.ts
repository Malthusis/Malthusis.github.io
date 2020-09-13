import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameFlagsService } from '../game-flags/game-flags.service';

@Component({
  selector: 'bonfire',
  templateUrl: './bonfire.component.html',
  styleUrls: ['./bonfire.component.scss']
})
export class BonfireComponent implements OnInit {

  constructor(
    private gameFlagsService: GameFlagsService
  ) {}

  gameProgress$: Observable<number>;

  ngOnInit(): void {
    this.gameProgress$ = this.gameFlagsService.initialStage$;
  }

}
