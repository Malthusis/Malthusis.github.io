import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RootComponent } from './root.component';
import { ResourcesComponent } from './resources/resources.component';
import { RootService } from './root.service';
import { ResourceService } from './resources/resource.service';
import { BonfireComponent } from './bonfire/bonfire.component';
import { MatButtonModule, MatDividerModule, MatTabsModule } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BorderComponent } from './border/border.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActionsComponent } from './bonfire/actions/actions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameFlagsService } from './game-flags/game-flags.service';
import { LoggerComponent } from './logger/logger.component';
import { LoggerService } from './logger/logger.service';
import { RefineComponent } from './bonfire/actions/refine/refine.component';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { TooltipComponent } from './tooltip/tooltip.component';
import { OverlayModule } from '@angular/cdk/overlay';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    RootComponent,
    ResourcesComponent,
    BonfireComponent,
    BorderComponent,
    ActionsComponent,
    LoggerComponent,
    RefineComponent,
    TooltipDirective,
    TooltipComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    HttpClientModule,
    OverlayModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatTabsModule
  ],
  providers: [RootService, ResourceService, GameFlagsService, LoggerService],
  bootstrap: [RootComponent]
})
export class RootModule { }
