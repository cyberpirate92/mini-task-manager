import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        TaskBoardComponent,
        TaskItemComponent,
        DateFormatPipe,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
