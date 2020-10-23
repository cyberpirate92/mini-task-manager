import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFilterPipe } from './pipes/task-filter.pipe';
import { PadPipe } from './pipes/pad.pipe';
import { TaskItemEditComponent } from './task-item-edit/task-item-edit.component';

@NgModule({
    declarations: [
        AppComponent,
        TaskBoardComponent,
        TaskItemComponent,
        DateFormatPipe,
        TaskFilterPipe,
        PadPipe,
        TaskItemEditComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
    ],
    providers: [TaskFilterPipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
