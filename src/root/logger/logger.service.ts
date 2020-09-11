import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoggerService {

  private logConsole$$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
  }

  // probably should make this better.
  addMessage(log: string): void {
    const logs = this.logConsole$$.getValue();
    logs.push(log);
    if (logs.length > 15) {
      logs.shift();
    }
    this.logConsole$$.next(logs);
  }

  get logConsole$(): Observable<string[]> {
    return this.logConsole$$.asObservable();
  }
}
