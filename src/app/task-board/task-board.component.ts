import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskItem } from '../models';
import { TaskFilterPipe } from '../pipes/task-filter.pipe';
import { TaskManagerService } from '../services/task-manager.service';

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit, OnChanges, OnDestroy {
    
    @Input() title: string;
    @Input() priority: number;
    @Input() filterTerm: string;
    
    public destroy$: Subject<any>;
    public tasks: TaskItem[];
    public filteredTasks: TaskItem[];
    
    constructor(private taskFilterPipe: TaskFilterPipe, private taskManager: TaskManagerService) { 
        this.filteredTasks = [];
        this.destroy$ = new Subject();
        this.tasks = [];
    }
    
    public ngOnInit(): void {
        this.taskManager.tasks$.pipe(takeUntil(this.destroy$)).subscribe({
            next: tasks => {
                this.tasks = [...tasks.filter(task => task.priority === this.priority)];
                this.applyFilter();
            }
        });
    }
    
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterTerm) {
            this.applyFilter();
        }
    }
    
    public applyFilter(): void {
        this.filteredTasks = this.filterTerm 
            ? this.taskFilterPipe.transform(this.tasks, this.filterTerm)
            : [...this.tasks];
    }
    
    public onDropped(event: DragEvent) {
        console.log(event);
        try {
            let task = JSON.parse(event.dataTransfer.getData('task')) as TaskItem;
            task.due_date = new Date(task.due_date);
            task.created_on = new Date(task.created_on);
            console.log(task);
            if (task.priority !== this.priority) {
                task.priority = this.priority;
                this.taskManager.updateTask(task).subscribe();
            }
        } catch(error) {
            console.error(error);
        }
    }
    
    public newTask(): void {
        // TODO: Implementation
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
