import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TaskBoard, TaskDropEvent, TaskItem } from '../models';
import { TaskFilterPipe } from '../pipes/task-filter.pipe';
import { DateUtils } from '../utils/date-utils';

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit, OnChanges {
    
    @Input() boardConfig: TaskBoard;
    @Input() filterTerm: string;

    @Output() onTaskDropped: EventEmitter<TaskDropEvent>;

    public filteredTasks: TaskItem[];
    public filteredCount: number;
    
    constructor(private taskFilterPipe: TaskFilterPipe) { 
        this.filteredTasks = [];
        this.filteredCount = 0;
        this.onTaskDropped = new EventEmitter();
    }

    public ngOnInit(): void {
        this.applyFilter();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterTerm) {
            this.applyFilter();
        }
        if (changes.boardConfig) {
            console.log('Task board has changed : )');
        }
    }

    public applyFilter(): void {
        this.filteredTasks = this.filterTerm 
            ? this.taskFilterPipe.transform(this.boardConfig.items, this.filterTerm)
            : [...this.boardConfig.items];
    }

    public onDropped(event: DragEvent) {
        console.log(event);
        try {
            let task = JSON.parse(event.dataTransfer.getData('task')) as TaskItem;
            task.due_date = new Date(task.due_date);
            task.created_on = new Date(task.created_on);
            console.log(task);
            this.onTaskDropped.emit({
                task,
                board: this.boardConfig,
            })
        } catch(error) {
            console.error(error);
        }
    }

    public newTask(): void {
        // TODO: Implementation
    }
}
