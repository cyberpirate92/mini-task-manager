import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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
    @Input() property: string;
    @Input() value: string | number;
    @Input() displayPicture: string;
    @Input() filterTerm: string;
    
    public destroy$: Subject<any>;
    public tasks: TaskItem[];
    public filteredTasks: TaskItem[];
    public showCreateTaskCard: boolean;
    
    constructor(private taskFilterPipe: TaskFilterPipe, private taskManager: TaskManagerService) { 
        this.filteredTasks = [];
        this.destroy$ = new Subject();
        this.tasks = [];
        this.showCreateTaskCard = false;
    }
    
    public ngOnInit(): void {
        this.taskManager.tasks$.pipe(takeUntil(this.destroy$)).subscribe({
            next: tasks => {
                this.tasks = !!this.value 
                    ? [...tasks.filter(task => task[this.property]==this.value)] 
                    : [...tasks.filter(task => !task[this.property])];
                console.log('NgOnInit called', this.property, this.value, this.tasks);
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
            if (task[this.property] !== this.value) {
                task[this.property] = this.value;
                this.taskManager.updateTask(task).subscribe();
            }
        } catch(error) {
            console.error(error);
        }
    }
    
    public newTask(): void {
        this.showCreateTaskCard = true;
    }

    public createTask(task: TaskItem): void {
        this.taskManager.createTask(task).subscribe({
            next: _ => {
                this.showCreateTaskCard = false;
            }
        });
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
