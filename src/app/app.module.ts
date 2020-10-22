import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FormsModule } from '@angular/forms';
import { TaskFilterPipe } from './pipes/task-filter.pipe';
import { PadPipe } from './pipes/pad.pipe';

@NgModule({
    declarations: [
        AppComponent,
        TaskBoardComponent,
        TaskItemComponent,
        DateFormatPipe,
        TaskFilterPipe,
        PadPipe,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [TaskFilterPipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
