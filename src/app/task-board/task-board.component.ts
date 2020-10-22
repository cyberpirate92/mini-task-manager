import { Component, Input } from '@angular/core';
import { TaskBoard, TaskItem } from '../models';

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {
    
    @Input() boardConfig: TaskBoard;
    @Input() filterTerm: string;
    
    constructor() { }

    public newTask(): void {
        // TODO: Implementation
    }
}
