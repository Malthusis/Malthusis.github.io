import { Component, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';
import { Observable } from 'rxjs';
import { GameFlagsService } from '../game-flags/game-flags.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {

  constructor(
    private loggerService: LoggerService,
    private gameFlagsService: GameFlagsService
  ) {}

  logQueue$: Observable<string[]>;

  ngOnInit(): void {
    this.logQueue$ = this.loggerService.logConsole$;

    this.gameFlagsService.initialStage$.pipe(
      take(1),
    ).subscribe( introStage => {
      switch (introStage) {
        case 1: this.loggerService.addMessage('Welcome to ANS!');
                break;
        case 2: this.loggerService.addMessage('Stage 2');
                break;
        default:  // do nothing.
      }
    });
    // this.loggerService.addMessage(
    //   'Bacon ipsum dolor amet ground round salami tenderloin buffalo shankle doner chicken pork belly cupim turkey landjaeger.' +
    //   ' Venison chislic pork belly cupim. Filet mignon short ribs meatball bacon prosciutto bresaola.' +
    //   ' Burgdoggen alcatra beef landjaeger, kielbasa fatback tongue venison sirloin turducken short ribs pancetta.');
  }

}
