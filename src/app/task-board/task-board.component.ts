import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskItem } from '../models';
import { TaskFilterPipe } from '../pipes/task-filter.pipe';
import { TaskManagerService } from '../services/task-manager.service';
import { UsersService } from '../services/users.service';

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
    @Input() filterDateRange: Date[]
    
    private _showCreateTaskCard: boolean;

    public get showCreateTaskCard(): boolean {
        return this._showCreateTaskCard;
    }

    public set showCreateTaskCard(value: boolean) {
        this._showCreateTaskCard = value;
        this.taskManager.pauseSync$.next(value);
    }
    
    public destroy$: Subject<any>;
    public tasks: TaskItem[];
    public filteredTasks: TaskItem[];
    public hasDragOver: boolean;
    
    constructor(private taskFilterPipe: TaskFilterPipe, private taskManager: TaskManagerService, private userService: UsersService) { 
        this.filteredTasks = [];
        this.destroy$ = new Subject();
        this.tasks = [];
        this.showCreateTaskCard = false;
        this.hasDragOver = false;
    }
    
    public ngOnInit(): void {
        this.taskManager.tasks$.pipe(takeUntil(this.destroy$)).subscribe({
            next: tasks => {
                this.tasks = !!this.value 
                    ? [...tasks.filter(task => task[this.property]==this.value)] 
                    : [...tasks.filter(task => !task[this.property])];
                this.applyFilter();
            }
        });
    }
    
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterTerm || changes.filterDateRange) {
            this.applyFilter();
        }
    }
    
    public applyFilter(): void {
        this.filteredTasks = this.taskFilterPipe.transform(this.tasks, this.filterTerm, this.filterDateRange);
    }
    
    public onDropped(event: DragEvent) {
        if (this.hasDragOver) {
            this.hasDragOver = false;
        }
        try {
            let task = JSON.parse(event.dataTransfer.getData('task')) as TaskItem;
            task.due_date = task.due_date ? new Date(task.due_date) : null;
            task.created_on = new Date(task.created_on);
            if (task[this.property] !== this.value) {
                task[this.property] = this.value;
                if (task.assigned_to) {
                    task.assigned_name = this.userService.getUserById(task.assigned_to).name;
                }
                this.taskManager.updateTask(task).subscribe();
            }
        } catch(error) {
            console.error(error);
        }
    }

    public onDragOver(event: DragEvent) {
        event.preventDefault();
        this.hasDragOver = true;
    }

    public onDragLeave(event: DragEvent) {
        this.hasDragOver = false;
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

    public identify(index: number, taskItem: TaskItem) {
        return taskItem.id;
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
