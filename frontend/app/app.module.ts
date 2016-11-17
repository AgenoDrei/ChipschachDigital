import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu.component';
import { SingleComponent } from "./single.component";
import { MultiLocalComponent } from "./multiLocal.component";
import { MultiGlobalComponent } from "./multiGlobal.component";
import { MiniComponent } from "./mini.component";
import { ClassicComponent } from "./classic.component";

import { LevelService } from './level.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: '',
                component: MenuComponent
            },
            {
                path: 'singleplayer',
                component: SingleComponent
            },
            {
                path: 'multiplayer-local',
                component: MultiLocalComponent
            },
            {
                path: 'multiplayer-global',
                component: MultiGlobalComponent
            },
            {
                path: 'mini-chess',
                component: MiniComponent
            },
            {
                path: 'classic-chess',
                component: ClassicComponent
            }
        ])
    ],
    declarations: [
        AppComponent,
        MenuComponent,
        SingleComponent,
        MultiLocalComponent,
        MultiGlobalComponent,
        MiniComponent,
        ClassicComponent
    ],
    providers: [
        LevelService
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}